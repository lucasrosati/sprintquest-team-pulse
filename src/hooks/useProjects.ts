import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService, CreateProjectRequest, UpdateProjectRequest } from '@/services/projectService';
import { CreateTaskRequest } from '@/types/Task';
import { toast } from 'sonner';
import authService from '@/services/authService';
import { Project } from '@/types/Project';

export const useProjects = (teamId?: number) => {
  const currentUser = authService.getCurrentUser();
  const userTeamId = currentUser?.teamId;

  console.log('CurrentUser from localStorage:', currentUser);
  console.log('User Team ID:', userTeamId);

  return useQuery<Project[]>({
    queryKey: ['projects', userTeamId],
    queryFn: async () => {
      console.log('Fetching projects for team ID:', userTeamId);
      if (!userTeamId) {
        console.log('No userTeamId, returning empty array.');
        return [];
      }
      
      const allProjects = await projectService.list();
      console.log('Fetched all projects:', allProjects);
      
      const filteredProjects = allProjects.filter(project => project.teamId === userTeamId);
      console.log(`Filtered projects for team ${userTeamId}:`, filteredProjects);
      
      return filteredProjects;
    },
    enabled: !!userTeamId,
  });
};

export const useProject = (id: number) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, CreateProjectRequest>({
    mutationFn: (projectData) => {
      console.log('useCreateProject mutationFn - projectData:', projectData);
      return projectService.create(projectData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar projeto:', error);
      toast.error(`Erro ao criar projeto: ${error.message}`);
    }
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => projectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir projeto:', error);
      toast.error('Erro ao excluir projeto');
    }
  });
};

export const useCreateProjectTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: CreateTaskRequest }) => 
      projectService.createTask(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
    }
  });
};

export const useUpdateProject = () => {
  // ... rest of the code ...
};
