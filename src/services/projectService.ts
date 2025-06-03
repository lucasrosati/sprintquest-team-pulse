import api from './api';
import { Project, CreateProjectRequest } from '@/types/Project';
import { Task, CreateTaskRequest } from '@/types/Task';
import { teamService } from './teamService';
import authService from './authService';
import { toast } from 'sonner';

export const projectService = {
  // GET /api/projects
  list: async (): Promise<Project[]> => {
    const response = await api.get('/api/projects');
    return response.data;
  },

  // GET /api/projects/{id}
  getById: async (id: number): Promise<Project> => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  // POST /api/projects/new-project
  create: async (data: CreateProjectRequest): Promise<Project> => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar a equipe do usuário
    const teams = await teamService.getAll();
    const userTeam = teams.find(team => team.id.value === currentUser.teamId);
    
    // Verificar se o usuário é o líder da equipe
    if (!userTeam || userTeam.leaderId?.value !== currentUser.memberId) {
      toast.error('Apenas o líder da equipe pode criar projetos');
      throw new Error('Apenas o líder da equipe pode criar projetos');
    }

    const response = await api.post('/api/projects/new-project', data);
    return response.data;
  },

  // DELETE /api/projects/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/projects/${id}`);
  },

  // POST /api/projects/{id}/tasks
  createTask: async (projectId: number, data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post(`/api/projects/${projectId}/tasks`, data);
    return response.data;
  }
};
