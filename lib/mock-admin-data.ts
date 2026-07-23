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
    email: 'aarav.sharma@example.com',
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
  },
  {
    id: 'user-2',
    fullName: 'Priya Mehta',
    email: 'priya.mehta@example.com',
    phone: '+91 9820123456',
    societyId: 'soc-1',
    societyName: 'Green Acres Residency',
    tower: 'Tower B',
    flatNo: 'B-105',
    registeredVehicles: [
      { id: 'v-2', ownerId: 'user-2', registrationNumber: 'MH 04 EQ 1928', make: 'Audi', model: 'A4', color: 'Ibis White', parkingSpot: 'B1-12', societyId: 'soc-1' },
      { id: 'v-3', ownerId: 'user-2', registrationNumber: 'MH 02 FP 9081', make: 'Hyundai', model: 'Creta', color: 'Titan Grey', parkingSpot: 'B1-13', societyId: 'soc-1' }
    ],
    subscriptionStatus: 'active',
    currentPlanName: 'Premium Daily Care (Dual Vehicle)'
  },
  {
    id: 'user-3',
    fullName: 'Rohan Gupta',
    email: 'rohan.gupta@example.com',
    phone: '+91 9769012345',
    societyId: 'soc-2',
    societyName: 'Sun City Apartments',
    tower: 'Block 1',
    flatNo: '102',
    registeredVehicles: [
      { id: 'v-4', ownerId: 'user-3', registrationNumber: 'MH 01 AB 1234', make: 'Mercedes-Benz', model: 'C-Class', color: 'Obsidian Black', parkingSpot: 'P-08', societyId: 'soc-2' }
    ],
    subscriptionStatus: 'paused',
    currentPlanName: 'Daily Exterior Polish'
  },
  {
    id: 'user-4',
    fullName: 'Ananya Roy',
    email: 'ananya.roy@example.com',
    phone: '+91 9833445566',
    societyId: 'soc-1',
    societyName: 'Green Acres Residency',
    tower: 'Tower C',
    flatNo: 'C-301',
    registeredVehicles: [
      { id: 'v-5', ownerId: 'user-4', registrationNumber: 'MH 03 DR 5544', make: 'Honda', model: 'City', color: 'Radiant Red', parkingSpot: 'B3-19', societyId: 'soc-1' }
    ],
    subscriptionStatus: 'expired',
    currentPlanName: 'Standard Exterior Wash'
  },
  {
    id: 'user-5',
    fullName: 'Vikramaditya Sen',
    email: 'vikram.sen@example.com',
    phone: '+91 9988776655',
    societyId: 'soc-2',
    societyName: 'Sun City Apartments',
    tower: 'Block 2',
    flatNo: '404',
    registeredVehicles: [
      { id: 'v-6', ownerId: 'user-5', registrationNumber: 'MH 02 EX 7711', make: 'Tata', model: 'Harrier', color: 'Orcus White', parkingSpot: 'P-44', societyId: 'soc-2' }
    ],
    subscriptionStatus: 'active',
    currentPlanName: 'Daily Exterior + Bi-weekly Deep Clean'
  }
];

export const MOCK_JOBS: DailyCleanJob[] = [
  {
    id: 'job-1',
    vehicleId: 'v-1',
    vehicleReg: 'MH 02 CZ 4821',
    vehicleModel: 'BMW 3 Series',
    ownerName: 'Aarav Sharma',
    cleanerId: 'cleaner-1',
    cleanerName: 'Ramesh Kumar',
    societyId: 'soc-1',
    societyName: 'Green Acres Residency',
    tower: 'Tower A',
    parkingSpot: 'B2-45',
    date: '2026-07-23',
    status: 'completed',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80',
    completedAt: '07:45 AM',
    rating: 5
  },
  {
    id: 'job-2',
    vehicleId: 'v-2',
    vehicleReg: 'MH 04 EQ 1928',
    vehicleModel: 'Audi A4',
    ownerName: 'Priya Mehta',
    cleanerId: 'cleaner-1',
    cleanerName: 'Ramesh Kumar',
    societyId: 'soc-1',
    societyName: 'Green Acres Residency',
    tower: 'Tower B',
    parkingSpot: 'B1-12',
    date: '2026-07-23',
    status: 'in_progress',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'job-3',
    vehicleId: 'v-3',
    vehicleReg: 'MH 02 FP 9081',
    vehicleModel: 'Hyundai Creta',
    ownerName: 'Priya Mehta',
    cleanerId: 'cleaner-2',
    cleanerName: 'Suresh Patil',
    societyId: 'soc-1',
    societyName: 'Green Acres Residency',
    tower: 'Tower C',
    parkingSpot: 'B1-13',
    date: '2026-07-23',
    status: 'pending'
  },
  {
    id: 'job-4',
    vehicleId: 'v-6',
    vehicleReg: 'MH 02 EX 7711',
    vehicleModel: 'Tata Harrier',
    ownerName: 'Vikramaditya Sen',
    cleanerId: 'cleaner-3',
    cleanerName: 'Vikram Singh',
    societyId: 'soc-2',
    societyName: 'Sun City Apartments',
    tower: 'Block 2',
    parkingSpot: 'P-44',
    date: '2026-07-23',
    status: 'completed',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80',
    completedAt: '08:15 AM',
    rating: 5
  },
  {
    id: 'job-5',
    vehicleId: 'v-5',
    vehicleReg: 'MH 03 DR 5544',
    vehicleModel: 'Honda City',
    ownerName: 'Ananya Roy',
    cleanerId: 'cleaner-2',
    cleanerName: 'Suresh Patil',
    societyId: 'soc-1',
    societyName: 'Green Acres Residency',
    tower: 'Tower C',
    parkingSpot: 'B3-19',
    date: '2026-07-23',
    status: 'skipped'
  },
  {
    id: 'job-6',
    vehicleId: 'v-4',
    vehicleReg: 'MH 01 AB 1234',
    vehicleModel: 'Mercedes-Benz C-Class',
    ownerName: 'Rohan Gupta',
    cleanerId: 'cleaner-3',
    cleanerName: 'Vikram Singh',
    societyId: 'soc-2',
    societyName: 'Sun City Apartments',
    tower: 'Block 1',
    parkingSpot: 'P-08',
    date: '2026-07-23',
    status: 'completed',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80',
    completedAt: '06:50 AM',
    rating: 4
  }
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-1',
    jobId: 'job-6',
    consumerId: 'user-3',
    consumerName: 'Rohan Gupta',
    vehicleReg: 'MH 01 AB 1234',
    cleanerName: 'Suresh Patil',
    issueType: 'poor_quality',
    status: 'open',
    description: 'Dust and water spots left on windshield and rear glass after morning wash.',
    photoUrls: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80'],
    createdAt: '2026-07-23 08:30 AM'
  },
  {
    id: 'cmp-2',
    jobId: 'job-1',
    consumerId: 'user-1',
    consumerName: 'Aarav Sharma',
    vehicleReg: 'MH 02 CZ 4821',
    cleanerName: 'Ramesh Kumar',
    issueType: 'missed_wash',
    status: 'in_review',
    description: 'Vehicle was parked in bay B2-45 but cleaner marked job skipped due to gate access.',
    photoUrls: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=80'],
    createdAt: '2026-07-23 07:15 AM'
  },
  {
    id: 'cmp-3',
    jobId: 'job-2',
    consumerId: 'user-2',
    consumerName: 'Priya Mehta',
    vehicleReg: 'MH 04 EQ 1928',
    cleanerName: 'Ramesh Kumar',
    issueType: 'scratch_or_damage',
    status: 'open',
    description: 'Noticed a minor hairline mark near the left side mirror post-cleaning.',
    photoUrls: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80'
    ],
    createdAt: '2026-07-23 09:10 AM'
  },
  {
    id: 'cmp-4',
    jobId: 'job-5',
    consumerId: 'user-4',
    consumerName: 'Ananya Roy',
    vehicleReg: 'MH 03 DR 5544',
    cleanerName: 'Suresh Patil',
    issueType: 'other',
    status: 'resolved',
    description: 'Water drips around boot latch area. Issue resolved with instant re-wipe.',
    photoUrls: ['https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80'],
    createdAt: '2026-07-22 06:45 PM'
  }
];
