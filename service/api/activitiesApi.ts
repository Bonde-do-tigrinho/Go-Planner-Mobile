import { storage, STORAGE_KEYS } from '../storage/asyncStorage';
import { Activity, CreateActivity, UpdateActivity } from '@/types/activity.types';

// ==================== CONFIG ====================

const SIMULATE_NETWORK_DELAY = true;
const DELAY_MS = 800;

const delay = () => 
  SIMULATE_NETWORK_DELAY 
    ? new Promise(resolve => setTimeout(resolve, DELAY_MS))
    : Promise.resolve();

// ==================== HELPERS ====================

export async function getAllActivities(): Promise<Activity[]> {
  const activities = await storage.get<Activity[]>(STORAGE_KEYS.TRIPS);
  return activities || [];
}

async function saveActivities(activities: Activity[]): Promise<void> {
  await storage.set(STORAGE_KEYS.TRIPS, activities);
}

function generateId(): string {
  return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ==================== API MOCK ====================

/**
 * API Mock para Atividades
 * 
 * 🔄 Para migrar para API real:
 * 1. Substitua storage por fetch/axios
 * 2. Mantenha as mesmas assinaturas de funções
 * 3. Adicione autenticação nos headers
 */
export const activitiesApi = {
  /**
   * GET /api/activities
   * Lista todas as atividades (com filtro opcional por tripId)
   */
  async findAll(tripId?: string): Promise<Activity[]> {
    await delay();
    
    const all = await getAllActivities();
    
    if (tripId) {
      return all.filter(a => a.tripId === tripId);
    }
    
    return all;
  },

  /**
   * GET /api/activities/:id
   * Busca uma atividade por ID
   */
  async findById(id: string): Promise<Activity | null> {
    await delay();
    
    const all = await getAllActivities();
    return all.find(a => a.id === id) || null;
  },

  /**
   * POST /api/activities
   * Cria uma nova atividade
   */
  async create(dto: CreateActivity): Promise<Activity> {
    await delay();
    
    const all = await getAllActivities();
    
    const newActivity: Activity = {
      ...dto,
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    all.push(newActivity);
    await saveActivities(all);
    
    console.log('✅ Atividade criada:', newActivity.id);
    return newActivity;
  },

  /**
   * PUT /api/activities/:id
   * Atualiza uma atividade existente
   */
  async update(id: string, dto: UpdateActivity): Promise<Activity> {
    await delay();
    
    const all = await getAllActivities();
    const index = all.findIndex(a => a.id === id);
    
    if (index === -1) {
      throw new Error(`Atividade ${id} não encontrada`);
    }
    
    all[index] = {
      ...all[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    
    await saveActivities(all);
    
    console.log('✅ Atividade atualizada:', id);
    return all[index];
  },

  /**
   * PATCH /api/activities/:id/toggle
   * Alterna status de completude
   */
  async toggleComplete(id: string): Promise<Activity> {
    await delay();
    
    const activity = await this.findById(id);
    if (!activity) {
      throw new Error(`Atividade ${id} não encontrada`);
    }
    
    return await this.update(id, { completed: !activity.completed });
  },

  /**
   * DELETE /api/activities/:id
   * Deleta uma atividade
   */
  async delete(id: string): Promise<void> {
    await delay();
    
    const all = await getAllActivities();
    const filtered = all.filter(a => a.id !== id);
    
    await saveActivities(filtered);
    
    console.log('✅ Atividade deletada:', id);
  },

  /**
   * GET /api/activities/by-date/:date
   * Busca atividades por data
   */
  async findByDate(date: string, tripId?: string): Promise<Activity[]> {
    await delay();
    
    const all = await this.findAll(tripId);
    return all.filter(a => a.date === date);
  },

  /**
   * DELETE /api/trips/:tripId/activities
   * Deleta todas as atividades de uma viagem
   */
  async deleteByTrip(tripId: string): Promise<void> {
    await delay();
    
    const all = await getAllActivities();
    const filtered = all.filter(a => a.tripId !== tripId);
    
    await saveActivities(filtered);
    
    console.log('✅ Atividades da viagem deletadas:', tripId);
  },

  // ==================== DEV UTILS ====================

  async clearAll(): Promise<void> {
    await storage.remove(STORAGE_KEYS.TRIPS);
    console.log('🧹 Todas as atividades foram limpas');
  },

  async seedMockData(): Promise<void> {
    const mockActivities: Activity[] = [
      {
        id: '1',
        title: 'Churrasco na praia',
        time: '12:00',
        date: '2025-10-26',
        tripId: "1",
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Mergulho com snorkel',
        time: '14:30',
        date: '2025-10-26',
        tripId: "2",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    await saveActivities(mockActivities);
    console.log('🌱 Dados mock populados');
  },
};