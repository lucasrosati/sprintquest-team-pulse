
import api from './api';
import { Team, CreateTeamRequest, AddMemberToTeamRequest } from '@/types/Team';

export const teamService = {
  // POST /api/teams
  create: async (data: CreateTeamRequest): Promise<Team> => {
    const response = await api.post('/api/teams', data);
    return response.data;
  },

  // GET /api/teams/{id}
  getById: async (id: number): Promise<Team> => {
    const response = await api.get(`/api/teams/${id}`);
    return response.data;
  },

  // POST /api/teams/{id}/members
  addMember: async (teamId: number, data: AddMemberToTeamRequest): Promise<any> => {
    const response = await api.post(`/api/teams/${teamId}/members`, data);
    return response.data;
  }
};
