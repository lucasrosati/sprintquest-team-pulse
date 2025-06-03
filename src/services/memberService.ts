import api from './api';
import { Member, CreateMemberRequest, UpdatePointsRequest, UnlockRewardRequest } from '@/types/Member';

export const memberService = {
  // GET /api/members
  list: async (teamId?: number): Promise<Member[]> => {
    console.log('memberService.list chamado sem filtro de teamId na API');
    const response = await api.get('/api/members');
    const members = response.data;
    console.log('Todos os membros da API (sem filtro no service):', members);
    return members; // Retorna todos os membros sem filtrar aqui
  },

  // POST /api/members
  create: async (data: CreateMemberRequest): Promise<Member> => {
    const response = await api.post('/api/members', data);
    return response.data;
  },

  // GET /api/members/{id}
  getById: async (id: number): Promise<Member> => {
    const response = await api.get(`/api/members/${id}`);
    return response.data;
  },

  // PATCH /api/members/{id}/points
  updatePoints: async (id: number, data: UpdatePointsRequest): Promise<Member> => {
    const response = await api.patch(`/api/members/${id}/points`, data);
    return response.data;
  },

  // PATCH /api/members/{id}/rewards
  unlockReward: async (id: number, data: UnlockRewardRequest): Promise<Member> => {
    const response = await api.patch(`/api/members/${id}/rewards`, data);
    return response.data;
  },

  // POST /api/members/{id}/feedbacks
  addFeedback: async (id: number, feedbackData: any): Promise<any> => {
    const response = await api.post(`/api/members/${id}/feedbacks`, feedbackData);
    return response.data;
  }
};
