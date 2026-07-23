import { Society, Cleaner, Consumer, DailyCleanJob, Complaint } from '../types/api';
import { MOCK_SOCIETIES, MOCK_CLEANERS, MOCK_CONSUMERS, MOCK_JOBS, MOCK_COMPLAINTS } from '../mock-admin-data';

export class AdminService {
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

  async addCleaner(cleanerData: Omit<Cleaner, 'id' | 'completedToday' | 'totalAssignedToday' | 'rating' | 'joinedDate'>): Promise<Cleaner> {
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

  async addSociety(societyData: Omit<Society, 'id' | 'totalSubscribers' | 'assignedCleanerIds'>): Promise<Society> {
    const newSociety: Society = {
      ...societyData,
      id: `soc-${Date.now()}`,
      totalSubscribers: 0,
      assignedCleanerIds: []
    };
    this.societies.push(newSociety);
    return newSociety;
  }
}

export const adminService = new AdminService();
