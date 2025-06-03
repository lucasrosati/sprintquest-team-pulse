import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Task } from '@/types/Task';

export const useUserTasks = (userId: number) => {
  return useQuery<Task[]>({
    queryKey: ['userTasks', userId],
    queryFn: async () => {
      const response = await api.get(`/api/tasks/assignee/${userId}`);
      return response.data;
    },
  });
}; 