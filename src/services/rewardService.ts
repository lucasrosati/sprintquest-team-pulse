import api from './api';
import { Reward, CreateRewardRequest, UpdateRewardPointsRequest, RewardType } from '@/types/Reward';

export interface CreateRewardRequest {
  description: string;
  requiredPoints: number;
  type: RewardType;
  createdBy: number;
}

export const rewardService = {
  // GET /api/rewards
  getAll: async (): Promise<Reward[]> => {
    const response = await api.get('/api/rewards');
    return response.data;
  },

  // POST /api/rewards
  create: async (data: CreateRewardRequest): Promise<Reward> => {
    const response = await api.post('/api/rewards', data);
    return response.data;
  },

  // GET /api/rewards/{id}
  getById: async (id: number): Promise<Reward> => {
    const response = await api.get(`/api/rewards/${id}`);
    return response.data;
  },

  // GET /api/rewards - listar todas
  list: async (): Promise<Reward[]> => {
    const response = await api.get('/api/rewards');
    return response.data;
  },

  // PATCH /api/rewards/{id}/points
  updatePoints: async (id: number, data: UpdateRewardPointsRequest): Promise<Reward> => {
    const response = await api.patch(`/api/rewards/${id}/points`, data);
    return response.data;
  },

  // DELETE /api/rewards/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/rewards/${id}`);
  },

  // GET /api/rewards/unlocked/{userId}
  getUnlockedRewards: async (userId: number): Promise<Reward[]> => {
    const response = await api.get(`/api/rewards/unlocked/${userId}`);
    return response.data;
  },

  // GET /api/rewards/available/{points}
  getAvailableRewards: async (points: number): Promise<Reward[]> => {
    const response = await api.get(`/api/rewards/available/${points}`);
    return response.data;
  }
};
