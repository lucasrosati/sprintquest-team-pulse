import api from './api';
import { Team, CreateTeamRequest, AddMemberToTeamRequest } from '@/types/Team';
import { Member } from '@/types/Member';

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

  // GET /api/teams
  getAll: async (): Promise<Team[]> => {
    const response = await api.get('/api/teams');
    return response.data;
  },

  // POST /api/teams/{id}/members
  addMember: async (teamId: number, data: AddMemberToTeamRequest): Promise<any> => {
    const response = await api.post(`/api/teams/${teamId}/members`, data);
    return response.data;
  },

  // GET /api/teams/{teamId}/members
  getMembersByTeamId: async (teamId: number): Promise<Member[]> => {
    console.log(`Fetching members for team ID: ${teamId}`);
    const response = await api.get(`/api/teams/${teamId}/members`);
    console.log(`Members for team ${teamId}:`, response.data);
    return response.data;
  }
};
