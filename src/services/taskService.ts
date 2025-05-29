
import api from './api';
import { Task, CreateTaskRequest, UpdateTaskColumnRequest, UpdateTaskTitleRequest, AssignTaskRequest } from '@/types/Task';

export const taskService = {
  // POST /api/tasks/project/{projectId}
  createForProject: async (projectId: number, data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post(`/api/tasks/project/${projectId}`, data);
    return response.data;
  },

  // GET /api/tasks/{id}
  getById: async (id: number): Promise<Task> => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },

  // POST /api/tasks/{id}/assign
  assign: async (taskId: number, data: AssignTaskRequest): Promise<Task> => {
    const response = await api.post(`/api/tasks/${taskId}/assign`, data);
    return response.data;
  },

  // PATCH /api/tasks/{id}/title
  updateTitle: async (taskId: number, data: UpdateTaskTitleRequest): Promise<Task> => {
    const response = await api.patch(`/api/tasks/${taskId}/title`, data);
    return response.data;
  },

  // PATCH /api/tasks/{id}/column
  updateColumn: async (taskId: number, data: UpdateTaskColumnRequest): Promise<Task> => {
    const response = await api.patch(`/api/tasks/${taskId}/column`, data);
    return response.data;
  },

  // PATCH /api/tasks/{id} - marcar como concluída
  markComplete: async (taskId: number): Promise<Task> => {
    const response = await api.patch(`/api/tasks/${taskId}`);
    return response.data;
  },

  // DELETE /api/tasks/{id}
  delete: async (taskId: number): Promise<void> => {
    await api.delete(`/api/tasks/${taskId}`);
  },

  // GET tasks by project (você pode precisar criar este endpoint ou usar o existente)
  getByProject: async (projectId: number): Promise<Task[]> => {
    const response = await api.get(`/api/tasks/project/${projectId}`);
    return response.data;
  }
};
