import { storage, STORAGE_KEYS } from '../storage/asyncStorage';
import { Trip, CreateTripDTO, UpdateTripDTO } from '@/types/trip.types';
import { getAllActivities } from './activitiesApi';

const SIMULATE_NETWORK_DELAY = true;
const DELAY_MS = 800;

const delay = () => 
  SIMULATE_NETWORK_DELAY 
    ? new Promise(resolve => setTimeout(resolve, DELAY_MS))
    : Promise.resolve();

async function getAllTrips(): Promise<Trip[]> {
  const trips = await storage.get<Trip[]>(STORAGE_KEYS.TRIPS);
  return trips || [];
}

async function saveTrips(trips: Trip[]): Promise<void> {
  await storage.set(STORAGE_KEYS.TRIPS, trips);
}

function generateId(): string {
  return `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const tripsApi = {
  /**
   * GET /api/trips
   */
  async findAll(): Promise<Trip[]> {
    await delay();
    return await getAllTrips();
  },

  /**
   * GET /api/trips/:id
   */
  async findById(id: string): Promise<Trip | null> {
    await delay();
    
    const all = await getAllTrips();
    return all.find(t => t.id === id) || null;
  },

  /**
   * POST /api/trips
   */
  async create(dto: CreateTripDTO): Promise<Trip> {
    await delay();
    
    const all = await getAllTrips();
    const allTrips = await getAllActivities()
    const newTrip: Trip = {
      ...dto,
      id: generateId(),
      activities: allTrips,
      guests: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    all.push(newTrip);
    await saveTrips(all);
    
    console.log('✅ Viagem criada:', newTrip.id);
    return newTrip;
  },

  /**
   * PUT /api/trips/:id
   */
  async update(id: string, dto: UpdateTripDTO): Promise<Trip> {
    await delay();
    
    const all = await getAllTrips();
    const index = all.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error(`Viagem ${id} não encontrada`);
    }
    
    all[index] = {
      ...all[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    
    await saveTrips(all);
    
    console.log('✅ Viagem atualizada:', id);
    return all[index];
  },

  /**
   * DELETE /api/trips/:id
   */
  async delete(id: string): Promise<void> {
    await delay();
    
    const all = await getAllTrips();
    const filtered = all.filter(t => t.id !== id);
    
    await saveTrips(filtered);
    
    console.log('✅ Viagem deletada:', id);
  },

  // DEV UTILS
  async clearAll(): Promise<void> {
    await storage.remove(STORAGE_KEYS.TRIPS);
    console.log('🧹 Todas as viagens foram limpas');
  },
};