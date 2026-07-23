# Admin Operations Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a comprehensive, CRED-styled Admin Operations Portal inside the `Car_Sweeper-main` Next.js application, enabling management of societies, cleaner onboarding & credentials, consumer directory, daily cleaning quality control, and executive analytics.

**Architecture:** Single Page Application (SPA) extension in Next.js using role-based routing (`lib/navigation-context.tsx`, `lib/auth-context.tsx`). Uses a typed service abstraction (`lib/types/api.ts`, `lib/services/admin-service.ts`) pre-seeded with mock data, ready for backend deployment via `NEXT_PUBLIC_API_MODE`.

**Tech Stack:** Next.js 14+ / React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Radix UI / shadcn primitives.

## Global Constraints
- Target directory: `Car_Sweeper-main`
- All styling must use Tailwind CSS v4 and the existing dark automotive OKLCH design tokens (`--glass`, `--glass-border`, `--glow`, `--surface`, `--metallic`).
- Code must pass `npx tsc --noEmit` and `npm run build` without breaking existing SPA components.

---

### Task 1: Shared API Data Contracts & Seed Service

**Files:**
- Create: `Car_Sweeper-main/lib/types/api.ts`
- Create: `Car_Sweeper-main/lib/services/admin-service.ts`
- Create: `Car_Sweeper-main/lib/mock-admin-data.ts`

**Interfaces:**
- Consumes: None
- Produces: `Society`, `Cleaner`, `Consumer`, `Vehicle`, `DailyCleanJob`, `Complaint`, `AdminService`

- [ ] **Step 1: Create `lib/types/api.ts`**

```typescript
export interface Society {
  id: string;
  name: string;
  city: string;
  area: string;
  towers: string[];
  totalSubscribers: number;
  assignedCleanerIds: string[];
}

export interface Cleaner {
  id: string;
  fullName: string;
  phone: string;
  status: 'active' | 'inactive' | 'on_leave';
  assignedSocietyId: string;
  assignedSocietyName: string;
  assignedTowers: string[];
  maxDailyCapacity: number;
  completedToday: number;
  totalAssignedToday: number;
  rating: number;
  joinedDate: string;
  accessPin: string;
}

export interface Consumer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  societyId: string;
  societyName: string;
  tower: string;
  flatNo: string;
  registeredVehicles: Vehicle[];
  subscriptionStatus: 'active' | 'paused' | 'expired';
  currentPlanName: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  registrationNumber: string;
  make: string;
  model: string;
  color: string;
  parkingSpot: string;
  societyId: string;
}

export interface DailyCleanJob {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  vehicleModel: string;
  ownerName: string;
  cleanerId: string;
  cleanerName: string;
  societyId: string;
  societyName: string;
  tower: string;
  parkingSpot: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  completedAt?: string;
  rating?: number;
}

export interface Complaint {
  id: string;
  jobId: string;
  consumerId: string;
  consumerName: string;
  vehicleReg: string;
  cleanerName: string;
  issueType: 'missed_wash' | 'poor_quality' | 'scratch_or_damage' | 'other';
  status: 'open' | 'in_review' | 'resolved';
  description: string;
  photoUrls: string[];
  createdAt: string;
}
```

- [ ] **Step 2: Create mock seed data in `lib/mock-admin-data.ts`**

```typescript
import { Society, Cleaner, Consumer, DailyCleanJob, Complaint } from './types/api';

export const MOCK_SOCIETIES: Society[] = [
  { id: 'soc-1', name: 'Green Acres Residency', city: 'Mumbai', area: 'Andheri West', towers: ['Tower A', 'Tower B', 'Tower C'], totalSubscribers: 42, assignedCleanerIds: ['cleaner-1', 'cleaner-2'] },
  { id: 'soc-2', name: 'Sun City Apartments', city: 'Mumbai', area: 'Bandra West', towers: ['Block 1', 'Block 2'], totalSubscribers: 28, assignedCleanerIds: ['cleaner-3'] },
];

export const MOCK_CLEANERS: Cleaner[] = [
  { id: 'cleaner-1', fullName: 'Ramesh Kumar', phone: '+91 9876543210', status: 'active', assignedSocietyId: 'soc-1', assignedSocietyName: 'Green Acres Residency', assignedTowers: ['Tower A', 'Tower B'], maxDailyCapacity: 30, completedToday: 22, totalAssignedToday: 25, rating: 4.8, joinedDate: '2025-11-10', accessPin: '482910' },
  { id: 'cleaner-2', fullName: 'Suresh Patil', phone: '+91 9876543211', status: 'active', assignedSocietyId: 'soc-1', assignedSocietyName: 'Green Acres Residency', assignedTowers: ['Tower C'], maxDailyCapacity: 25, completedToday: 15, totalAssignedToday: 17, rating: 4.6, joinedDate: '2026-01-15', accessPin: '193840' },
  { id: 'cleaner-3', fullName: 'Vikram Singh', phone: '+91 9876543212', status: 'active', assignedSocietyId: 'soc-2', assignedSocietyName: 'Sun City Apartments', assignedTowers: ['Block 1', 'Block 2'], maxDailyCapacity: 30, completedToday: 28, totalAssignedToday: 28, rating: 4.9, joinedDate: '2025-08-01', accessPin: '739102' },
];

export const MOCK_CONSUMERS: Consumer[] = [
  {
    id: 'user-1',
    fullName: 'Aarav Sharma',
    email: 'aarav@example.com',
    phone: '+91 9123456789',
    societyId: 'soc-1',
    societyName: 'Green Acres Residency',
    tower: 'Tower A',
    flatNo: 'A-402',
    registeredVehicles: [
      { id: 'v-1', ownerId: 'user-1', registrationNumber: 'MH 02 CZ 4821', make: 'BMW', model: '3 Series', color: 'Phytonic Blue', parkingSpot: 'B2-45', societyId: 'soc-1' }
    ],
    subscriptionStatus: 'active',
    currentPlanName: 'Daily Exterior + Interior Weekly'
  }
];

export const MOCK_JOBS: DailyCleanJob[] = [
  { id: 'job-1', vehicleId: 'v-1', vehicleReg: 'MH 02 CZ 4821', vehicleModel: 'BMW 3 Series', ownerName: 'Aarav Sharma', cleanerId: 'cleaner-1', cleanerName: 'Ramesh Kumar', societyId: 'soc-1', societyName: 'Green Acres Residency', tower: 'Tower A', parkingSpot: 'B2-45', date: '2026-07-23', status: 'completed', beforePhotoUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400', afterPhotoUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400', completedAt: '07:45 AM', rating: 5 },
  { id: 'job-2', vehicleId: 'v-2', vehicleReg: 'MH 04 EQ 1928', vehicleModel: 'Audi A4', ownerName: 'Priya Mehta', cleanerId: 'cleaner-1', cleanerName: 'Ramesh Kumar', societyId: 'soc-1', societyName: 'Green Acres Residency', tower: 'Tower B', parkingSpot: 'B1-12', date: '2026-07-23', status: 'in_progress' }
];

export const MOCK_COMPLAINTS: Complaint[] = [
  { id: 'cmp-1', jobId: 'job-99', consumerId: 'user-2', consumerName: 'Rohan Gupta', vehicleReg: 'MH 01 AB 1234', cleanerName: 'Suresh Patil', issueType: 'poor_quality', status: 'open', description: 'Dust left on windshield after wash.', photoUrls: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400'], createdAt: '2026-07-23 08:30 AM' }
];
```

- [ ] **Step 3: Create `lib/services/admin-service.ts`**

```typescript
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
```

- [ ] **Step 4: Commit Task 1**

```bash
git add lib/types/api.ts lib/mock-admin-data.ts lib/services/admin-service.ts
git commit -m "feat(admin): add admin API data types, mock seed data, and service layer"
```

---

### Task 2: Auth & Navigation Context Role Extension

**Files:**
- Modify: `Car_Sweeper-main/lib/auth-context.tsx`
- Modify: `Car_Sweeper-main/lib/navigation-context.tsx`

**Interfaces:**
- Consumes: `AuthProvider`, `useAuth`, `NavigationProvider`, `useNavigation`
- Produces: Role-aware navigation (`'admin' | 'owner' | 'cleaner'`) and admin screen routes (`admin-overview`, `admin-cleaners`, `admin-societies`, `admin-consumers`, `admin-daily-monitor`, `admin-complaints`).

- [ ] **Step 1: Update `lib/auth-context.tsx` to include `role` and `setRole`**

Extend `User` interface to include `role: 'owner' | 'cleaner' | 'admin'` and add `setRole` helper.

- [ ] **Step 2: Update `lib/navigation-context.tsx` screen type**

Extend `Screen` type union to include admin screens:
`'home' | 'add-car' | 'subscription' | 'cleaning-status' | 'history' | 'rating' | 'complaint' | 'profile' | 'admin-overview' | 'admin-cleaners' | 'admin-societies' | 'admin-consumers' | 'admin-daily-monitor' | 'admin-complaints'`

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS clean

- [ ] **Step 4: Commit Task 2**

```bash
git add lib/auth-context.tsx lib/navigation-context.tsx
git commit -m "feat(admin): extend Auth and Navigation contexts with admin roles and screens"
```

---

### Task 3: Admin Header & Sidebar Shell Layout

**Files:**
- Create: `Car_Sweeper-main/components/admin/admin-header.tsx`
- Create: `Car_Sweeper-main/components/admin/admin-sidebar.tsx`
- Create: `Car_Sweeper-main/components/admin/admin-shell.tsx`

**Interfaces:**
- Consumes: `useNavigation()`, `useAuth()`
- Produces: `AdminShell` container component wrapper for all admin screens.

- [ ] **Step 1: Create `components/admin/admin-header.tsx`**

Header featuring brand logo, search bar, role pill indicator, and quick action button (`+ Add Cleaner`).

- [ ] **Step 2: Create `components/admin/admin-sidebar.tsx`**

Sidebar containing navigation items:
- 📊 `Overview` (`admin-overview`)
- 🧼 `Cleaners` (`admin-cleaners`)
- 🏢 `Societies` (`admin-societies`)
- 🚗 `Consumers` (`admin-consumers`)
- ⏱️ `Live Monitor` (`admin-daily-monitor`)
- ⚠️ `Complaints` (`admin-complaints`)

- [ ] **Step 3: Create `components/admin/admin-shell.tsx`**

Container wrapping header, sidebar, and rendering the active admin screen component.

- [ ] **Step 4: Commit Task 3**

```bash
git add components/admin/
git commit -m "feat(admin): implement Admin Shell layout with header and sidebar navigation"
```

---

### Task 4: Executive Overview & Analytics Screen

**Files:**
- Create: `Car_Sweeper-main/components/admin/screens/admin-overview.tsx`

- [ ] **Step 1: Build `components/admin/screens/admin-overview.tsx`**

Display KPI cards:
- Total MRR: ₹1,48,500
- Active Subscribers: 70
- Completion Rate today: 85%
- Active Cleaners: 3
- Open Complaints: 1

Render 7-day completion chart and recent activity feed.

- [ ] **Step 2: Commit Task 4**

```bash
git add components/admin/screens/admin-overview.tsx
git commit -m "feat(admin): add Executive Overview & Analytics dashboard screen"
```

---

### Task 5: Cleaner Management & Onboarding Screen with Credential Generator Modal

**Files:**
- Create: `Car_Sweeper-main/components/admin/screens/admin-cleaners.tsx`
- Create: `Car_Sweeper-main/components/admin/modals/add-cleaner-modal.tsx`

- [ ] **Step 1: Build `components/admin/modals/add-cleaner-modal.tsx`**

Form modal to add cleaner: Full Name, Phone, Aadhaar Ref, Society Picker, Tower Select, Daily Capacity limit.
Includes a **Generate Mobile Login PIN** button that outputs a 6-digit access PIN for the cleaner's mobile login.

- [ ] **Step 2: Build `components/admin/screens/admin-cleaners.tsx`**

Cleaner directory table displaying Cleaner Name, Phone, Assigned Society, Towers, Quota (e.g., 22/25), Rating, PIN code badge, and "Add Cleaner" button.

- [ ] **Step 3: Commit Task 5**

```bash
git add components/admin/screens/admin-cleaners.tsx components/admin/modals/add-cleaner-modal.tsx
git commit -m "feat(admin): add Cleaner Management screen and Cleaner Onboarding Modal"
```

---

### Task 6: Society Onboarding & Management Screen

**Files:**
- Create: `Car_Sweeper-main/components/admin/screens/admin-societies.tsx`
- Create: `Car_Sweeper-main/components/admin/modals/add-society-modal.tsx`

- [ ] **Step 1: Build `components/admin/modals/add-society-modal.tsx`**

Modal to onboard new society: Society Name, City, Area, Towers comma-separated input.

- [ ] **Step 2: Build `components/admin/screens/admin-societies.tsx`**

Grid/Table of onboarded societies showing total subscribers, assigned cleaners count, and tower coverage tags.

- [ ] **Step 3: Commit Task 6**

```bash
git add components/admin/screens/admin-societies.tsx components/admin/modals/add-society-modal.tsx
git commit -m "feat(admin): add Society Management screen and Society Onboarding Modal"
```

---

### Task 7: Consumer & Vehicle Directory Screen

**Files:**
- Create: `Car_Sweeper-main/components/admin/screens/admin-consumers.tsx`

- [ ] **Step 1: Build `components/admin/screens/admin-consumers.tsx`**

Directory table listing Car Owners, Phone, Society & Flat #, Registered Vehicles (Reg #, Make/Model, Parking Bay), Plan Name, and Subscription Status badge (`Active`, `Paused`, `Expired`).

- [ ] **Step 2: Commit Task 7**

```bash
git add components/admin/screens/admin-consumers.tsx
git commit -m "feat(admin): add Consumer & Vehicle Directory screen"
```

---

### Task 8: Live Daily Cleaning Monitor & Photo Audit Modal

**Files:**
- Create: `Car_Sweeper-main/components/admin/screens/admin-daily-monitor.tsx`
- Create: `Car_Sweeper-main/components/admin/modals/photo-audit-modal.tsx`

- [ ] **Step 1: Build `components/admin/modals/photo-audit-modal.tsx`**

Modal displaying side-by-side **Before Wash** and **After Wash** photos submitted by cleaner for a specific job, with timestamp and "Approve Wash" / "Flag Issue" actions.

- [ ] **Step 2: Build `components/admin/screens/admin-daily-monitor.tsx`**

Live queue table of today's washes with filter tabs (`All`, `Pending`, `In Progress`, `Completed`, `Skipped`), showing vehicle info, parking bay, cleaner, and "View Photos" button.

- [ ] **Step 3: Commit Task 8**

```bash
git add components/admin/screens/admin-daily-monitor.tsx components/admin/modals/photo-audit-modal.tsx
git commit -m "feat(admin): add Live Daily Cleaning Monitor screen and Photo Audit modal"
```

---

### Task 9: Complaint Resolution Desk Screen

**Files:**
- Create: `Car_Sweeper-main/components/admin/screens/admin-complaints.tsx`

- [ ] **Step 1: Build `components/admin/screens/admin-complaints.tsx`**

Ticket management view listing open complaints, consumer name, vehicle, cleaner involved, description, photo evidence preview, and resolution buttons ("Re-wash Triggered", "Mark Resolved").

- [ ] **Step 2: Commit Task 9**

```bash
git add components/admin/screens/admin-complaints.tsx
git commit -m "feat(admin): add Complaint Resolution Desk screen"
```

---

### Task 10: App Shell Integration & Verification

**Files:**
- Modify: `Car_Sweeper-main/components/smartcar/app-shell.tsx`

- [ ] **Step 1: Update `app-shell.tsx` to mount `AdminShell` when in admin screen mode or role**

Import `AdminShell` and map `admin-overview`, `admin-cleaners`, `admin-societies`, `admin-consumers`, `admin-daily-monitor`, and `admin-complaints` to render `AdminShell`.

- [ ] **Step 2: Run verification checks**

Run:
```bash
npx tsc --noEmit
npm run build
```
Expected: All build steps pass cleanly.

- [ ] **Step 3: Commit Task 10**

```bash
git add components/smartcar/app-shell.tsx
git commit -m "feat(admin): integrate AdminShell into AppShell and verify build"
```
