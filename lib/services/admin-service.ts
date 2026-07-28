import { Society, Cleaner, Consumer, DailyCleanJob, Complaint } from '../types/api';
import { MOCK_SOCIETIES, MOCK_CLEANERS, MOCK_CONSUMERS, MOCK_JOBS, MOCK_COMPLAINTS } from '../mock-admin-data';
import { IS_REAL_MODE } from '../config';
import { getBrowserSupabase } from '../supabase/browser';

export type NewCleanerInput = Omit<
  Cleaner,
  'id' | 'completedToday' | 'totalAssignedToday' | 'rating' | 'joinedDate'
>;

export type NewSocietyInput = Omit<Society, 'id' | 'totalSubscribers' | 'assignedCleanerIds'>;

export interface OverviewStats {
  mrrInr: number;
  activeSubscriptions: number;
  completionTrend: { day: string; label: string; rate: number }[];
}

export interface AdminApi {
  getSocieties(): Promise<Society[]>;
  getCleaners(): Promise<Cleaner[]>;
  getConsumers(): Promise<Consumer[]>;
  getDailyJobs(date?: string): Promise<DailyCleanJob[]>;
  getComplaints(): Promise<Complaint[]>;

  addCleaner(input: NewCleanerInput): Promise<Cleaner>;
  updateCleaner(cleanerId: string, patch: Partial<NewCleanerInput>): Promise<Cleaner>;
  addSociety(input: NewSocietyInput): Promise<Society>;
  updateComplaintStatus(
    complaintId: string,
    status: Complaint['status'],
    resolutionNote?: string
  ): Promise<Complaint>;
  updateJobStatus(jobId: string, status: DailyCleanJob['status'], rating?: number): Promise<DailyCleanJob>;
  /** Builds the day's roster from active subscriptions. Idempotent. */
  generateDailyJobs(date?: string): Promise<{ created: number; skipped: number; jobs: DailyCleanJob[] }>;
  /** Revenue and 7-day completion trend for the executive dashboard. */
  getOverviewStats(): Promise<OverviewStats>;
}

/* -------------------------------------------------------------------------- */
/* Mock implementation — in-memory, used when NEXT_PUBLIC_API_MODE is not real  */
/* -------------------------------------------------------------------------- */

export class MockAdminService implements AdminApi {
  private societies: Society[] = [...MOCK_SOCIETIES];
  private cleaners: Cleaner[] = [...MOCK_CLEANERS];
  private consumers: Consumer[] = [...MOCK_CONSUMERS];
  private jobs: DailyCleanJob[] = [...MOCK_JOBS];
  private complaints: Complaint[] = [...MOCK_COMPLAINTS];

  async getSocieties(): Promise<Society[]> { return this.societies; }
  async getCleaners(): Promise<Cleaner[]> { return this.cleaners; }
  async getConsumers(): Promise<Consumer[]> { return this.consumers; }
  async getDailyJobs(): Promise<DailyCleanJob[]> { return this.jobs; }
  async getComplaints(): Promise<Complaint[]> { return this.complaints; }

  async updateComplaintStatus(
    complaintId: string,
    status: Complaint['status']
  ): Promise<Complaint> {
    const index = this.complaints.findIndex((c) => c.id === complaintId);
    if (index !== -1) {
      this.complaints[index] = { ...this.complaints[index], status };
      return this.complaints[index];
    }
    throw new Error(`Complaint with ID ${complaintId} not found`);
  }

  async updateJobStatus(
    jobId: string,
    status: DailyCleanJob['status'],
    rating?: number
  ): Promise<DailyCleanJob> {
    const index = this.jobs.findIndex((j) => j.id === jobId);
    if (index !== -1) {
      this.jobs[index] = {
        ...this.jobs[index],
        status,
        ...(rating !== undefined ? { rating } : {}),
        ...(status === 'completed' && !this.jobs[index].completedAt
          ? { completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : {})
      };
      return this.jobs[index];
    }
    throw new Error(`Job with ID ${jobId} not found`);
  }

  async addCleaner(cleanerData: NewCleanerInput): Promise<Cleaner> {
    const newCleaner: Cleaner = {
      ...cleanerData,
      id: `cleaner-${Date.now()}`,
      completedToday: 0,
      totalAssignedToday: 0,
      rating: 5.0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    this.cleaners.push(newCleaner);
    return newCleaner;
  }

  async updateCleaner(cleanerId: string, patch: Partial<NewCleanerInput>): Promise<Cleaner> {
    const index = this.cleaners.findIndex((c) => c.id === cleanerId);
    if (index === -1) throw new Error(`Cleaner with ID ${cleanerId} not found`);
    this.cleaners[index] = { ...this.cleaners[index], ...patch };
    return this.cleaners[index];
  }

  async addSociety(societyData: NewSocietyInput): Promise<Society> {
    const newSociety: Society = {
      ...societyData,
      id: `soc-${Date.now()}`,
      totalSubscribers: 0,
      assignedCleanerIds: []
    };
    this.societies.push(newSociety);
    return newSociety;
  }

  async generateDailyJobs(): Promise<{ created: number; skipped: number; jobs: DailyCleanJob[] }> {
    // Nothing to schedule against without a database — report the seeded roster.
    return { created: 0, skipped: this.jobs.length, jobs: this.jobs };
  }

  async getOverviewStats(): Promise<OverviewStats> {
    // Representative figures so the dashboard reads sensibly on seed data.
    const today = new Date();
    const completionTrend = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      return {
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        label: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rate: [92, 95, 89, 91, 96, 94, 93][i],
      };
    });
    return { mrrInr: 148500, activeSubscriptions: this.consumers.length, completionTrend };
  }
}

/* -------------------------------------------------------------------------- */
/* HTTP implementation — talks to /api/admin/*, which owns the service role     */
/* -------------------------------------------------------------------------- */

async function authHeaders(): Promise<HeadersInit> {
  const { data } = await getBrowserSupabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Your admin session has expired. Sign in again.');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/admin${path}`, {
    ...init,
    headers: { ...(await authHeaders()), ...(init?.headers ?? {}) },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? `Request failed (${response.status})`);
  }
  return payload.data as T;
}

export class HttpAdminService implements AdminApi {
  getSocieties() { return request<Society[]>('/societies'); }
  getCleaners() { return request<Cleaner[]>('/cleaners'); }
  getConsumers() { return request<Consumer[]>('/consumers'); }
  getComplaints() { return request<Complaint[]>('/complaints'); }

  getDailyJobs(date?: string) {
    return request<DailyCleanJob[]>(`/jobs${date ? `?date=${date}` : ''}`);
  }

  addCleaner(input: NewCleanerInput) {
    return request<Cleaner>('/cleaners', { method: 'POST', body: JSON.stringify(input) });
  }

  updateCleaner(cleanerId: string, patch: Partial<NewCleanerInput>) {
    return request<Cleaner>(`/cleaners/${cleanerId}`, { method: 'PATCH', body: JSON.stringify(patch) });
  }

  addSociety(input: NewSocietyInput) {
    return request<Society>('/societies', { method: 'POST', body: JSON.stringify(input) });
  }

  updateComplaintStatus(complaintId: string, status: Complaint['status'], resolutionNote?: string) {
    return request<Complaint>(`/complaints/${complaintId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, resolutionNote }),
    });
  }

  updateJobStatus(jobId: string, status: DailyCleanJob['status'], rating?: number) {
    return request<DailyCleanJob>(`/jobs/${jobId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, rating }),
    });
  }

  generateDailyJobs(date?: string) {
    return request<{ created: number; skipped: number; jobs: DailyCleanJob[] }>('/jobs', {
      method: 'POST',
      body: JSON.stringify({ date }),
    });
  }

  getOverviewStats() {
    return request<OverviewStats>('/overview');
  }
}

/** Kept as the historical name so existing imports keep working. */
export const AdminService = MockAdminService;

export const adminService: AdminApi = IS_REAL_MODE ? new HttpAdminService() : new MockAdminService();
