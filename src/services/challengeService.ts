
import api from './api';
import { Challenge, CreateChallengeRequest } from '@/types/Challenge';

export const challengeService = {
  // POST /api/challenges
  create: async (data: CreateChallengeRequest): Promise<Challenge> => {
    const response = await api.post('/api/challenges', data);
    return response.data;
  },

  // GET /api/challenges/{id}
  getById: async (id: number): Promise<Challenge> => {
    const response = await api.get(`/api/challenges/${id}`);
    return response.data;
  },

  // GET /api/challenges/project/{projectId}
  getByProject: async (projectId: number): Promise<Challenge[]> => {
    const response = await api.get(`/api/challenges/project/${projectId}`);
    return response.data;
  },

  // DELETE /api/challenges/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/challenges/${id}`);
  }
};
