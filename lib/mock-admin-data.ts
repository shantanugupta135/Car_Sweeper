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
