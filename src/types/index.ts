export type UserRole = 'farmer' | 'middleman' | 'driver' | 'worker';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  location: string;
  avatar?: string;
  createdAt: Date;
}

export interface Crop {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  location: string;
  images: string[];
  description?: string;
  quality?: 'A' | 'B' | 'C';
  status: 'available' | 'in_discussion' | 'sold';
  createdAt: Date;
}

export interface Meeting {
  id: string;
  farmerId: string;
  middlemanId: string;
  cropId: string;
  date: Date;
  time: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  notes?: string;
}

export interface WorkerJob {
  id: string;
  farmerId: string;
  location: string;
  pricePerDay: number;
  description: string;
  requiredWorkers: number;
  startDate: Date;
  duration: number; // days
  status: 'open' | 'filled' | 'completed';
}

export interface DriverJob {
  id: string;
  requesterId: string;
  pickupLocation: string;
  dropLocation: string;
  date: Date;
  vehicleType: string;
  weight: number;
  status: 'open' | 'accepted' | 'completed';
}

export interface CropPrice {
  id: string;
  cropName: string;
  price: number;
  unit: string;
  market: string;
  date: Date;
  change: number; // percentage change from previous day
}
