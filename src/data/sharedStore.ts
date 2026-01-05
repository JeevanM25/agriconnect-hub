import { Crop, WorkerJob, Vehicle } from '@/types';

const CROPS_KEY = 'krishiconnect_crops';
const WORKER_JOBS_KEY = 'krishiconnect_worker_jobs';
const VEHICLES_KEY = 'krishiconnect_vehicles';

// Crops
export function getAllCrops(): Crop[] {
  const data = localStorage.getItem(CROPS_KEY);
  return data ? JSON.parse(data) : [];
}

export function addCrop(crop: Crop): void {
  const crops = getAllCrops();
  crops.unshift(crop);
  localStorage.setItem(CROPS_KEY, JSON.stringify(crops));
}

export function updateCrop(cropId: string, updates: Partial<Crop>): void {
  const crops = getAllCrops();
  const index = crops.findIndex(c => c.id === cropId);
  if (index !== -1) {
    crops[index] = { ...crops[index], ...updates };
    localStorage.setItem(CROPS_KEY, JSON.stringify(crops));
  }
}

// Worker Jobs
export function getAllWorkerJobs(): WorkerJob[] {
  const data = localStorage.getItem(WORKER_JOBS_KEY);
  return data ? JSON.parse(data, (key, value) => {
    if (key === 'startDate' && value) return new Date(value);
    return value;
  }) : [];
}

export function addWorkerJob(job: WorkerJob): void {
  const jobs = getAllWorkerJobs();
  jobs.unshift(job);
  localStorage.setItem(WORKER_JOBS_KEY, JSON.stringify(jobs));
}

// Vehicles
export function getAllVehicles(): Vehicle[] {
  const data = localStorage.getItem(VEHICLES_KEY);
  return data ? JSON.parse(data, (key, value) => {
    if (key === 'createdAt' && value) return new Date(value);
    return value;
  }) : [];
}

export function addVehicle(vehicle: Vehicle): void {
  const vehicles = getAllVehicles();
  vehicles.unshift(vehicle);
  localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
}
