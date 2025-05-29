
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import { CreateTaskRequest, UpdateTaskColumnRequest, UpdateTaskTitleRequest, AssignTaskRequest } from '@/types/Task';
import { toast } from 'sonner';

export const useTask = (id: number) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskService.getById(id),
    enabled: !!id,
  });
};

export const useTasksByProject = (projectId: number) => {
  return useQuery({
    queryKey: ['tasks', 'project', projectId],
    queryFn: () => taskService.getByProject(projectId),
    enabled: !!projectId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: CreateTaskRequest }) => 
      taskService.createForProject(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'project', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
      toast.success('Tarefa criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
    }
  });
};

export const useAssignTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: AssignTaskRequest }) => 
      taskService.assign(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa atribuída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atribuir tarefa:', error);
      toast.error('Erro ao atribuir tarefa');
    }
  });
};

export const useUpdateTaskColumn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: UpdateTaskColumnRequest }) => 
      taskService.updateColumn(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Status da tarefa atualizado!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar status da tarefa:', error);
      toast.error('Erro ao atualizar status da tarefa');
    }
  });
};

export const useUpdateTaskTitle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: UpdateTaskTitleRequest }) => 
      taskService.updateTitle(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Título da tarefa atualizado!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar título da tarefa:', error);
      toast.error('Erro ao atualizar título da tarefa');
    }
  });
};

export const useMarkTaskComplete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId: number) => taskService.markComplete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa marcada como concluída!');
    },
    onError: (error) => {
      console.error('Erro ao marcar tarefa como concluída:', error);
      toast.error('Erro ao marcar tarefa como concluída');
    }
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId: number) => taskService.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir tarefa:', error);
      toast.error('Erro ao excluir tarefa');
    }
  });
};
