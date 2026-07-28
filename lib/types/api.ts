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
