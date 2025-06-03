import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import { Task, CreateTaskRequest, UpdateTaskRequest, MoveTaskRequest, ColumnId, columnNames } from '@/types/Task';
import { toast } from 'sonner';
import authService from '@/services/authService';

export const useTasks = (projectId: number) => {
  const queryClient = useQueryClient();
  const currentUser = authService.getCurrentUser();

  // Query para buscar todas as tarefas de um projeto
  const { data: tasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ['tasks', projectId], // Chave inclui projectId para cache por projeto
    queryFn: () => taskService.listByProject(projectId),
    enabled: !!projectId, // Só roda a query se tiver um projectId válido
  });

  // Mutação para criar uma nova tarefa
  const createTask = useMutation({
    mutationFn: (data: CreateTaskRequest) => taskService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Tarefa criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
    }
  });

  // Mutação para atualizar o título de uma tarefa
  const updateTaskTitleMutation = useMutation({
    mutationFn: ({ taskId, newTitle }: { taskId: number, newTitle: string }) =>
      taskService.updateTitle(taskId, newTitle),
    onSuccess: (updatedTask) => {
      console.log('useTasks - updateTaskTitleMutation onSuccess - updatedTask:', updatedTask);
      queryClient.setQueryData<Task[]>(['tasks', projectId], (oldTasks) => {
        if (!oldTasks) return [];
        return oldTasks.map(task =>
          task.id === updatedTask.id ? { ...task, title: updatedTask.title } : task
        );
      });
      toast.success('Título da tarefa atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('useTasks - updateTaskTitleMutation onError:', error);
      toast.error('Erro ao atualizar título da tarefa. Por favor, tente novamente.');
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  // Mutação para mover uma tarefa entre colunas (atualiza o status)
  const moveTask = useMutation({
    mutationFn: ({ taskId, newColumn }: { taskId: number; newColumn: ColumnId }) => {
      console.log('=== Verificando usuário atual para moveTask ===');
      console.log('Current User:', currentUser);
      
      if (!currentUser?.memberId) {
        console.error('Usuário não autenticado ou sem memberId para mover task');
        toast.error('Você precisa estar logado para mover tarefas.');
        throw new Error('Usuário não autenticado');
      }

      console.log('MemberId do usuário atual:', currentUser.memberId);
      console.log(`Chamando taskService.move para Task ${taskId} para coluna ${newColumn} com Member ID ${currentUser.memberId}`);
      return taskService.move(taskId, newColumn, currentUser.memberId);
    },
    onMutate: async ({ taskId, newColumn }) => {
      console.log('=== Iniciando mutação moveTask (onMutate) ===');
      console.log('Task ID:', taskId);
      console.log('Nova coluna (otimista):', newColumn);
      console.log('Usuário atual:', currentUser);

      if (!currentUser?.memberId) {
         console.error('Usuário não autenticado ou sem memberId em onMutate');
        // Não lança erro aqui para não interromper o fluxo, o erro é tratado em mutationFn
        return { previousTasks: undefined };
      }

      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });

      // Salvar o estado anterior
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', projectId]);
      console.log('Estado anterior (cache):', previousTasks);

      // Atualizar otimisticamente
      queryClient.setQueryData<Task[]>(['tasks', projectId], (old) => {
        if (!old) return [];
        const updatedTasks = old.map(task => 
          task.id === taskId 
            ? { ...task, kanbanColumn: newColumn } // Atualiza a coluna otimisticamente
            : task
        );
        console.log('Estado otimista atualizado (cache):', updatedTasks);
        return updatedTasks;
      });

      return { previousTasks };
    },
    onError: (err: any, variables, context) => {
      console.error('=== Erro na mutação moveTask (onError) ===');
      console.error('Erro:', err);
      console.error('Detalhes do erro (se houver response):', err?.response?.data);
      console.error('Variáveis da mutação:', variables);
      
      // Em caso de erro, reverter para o estado anterior
      if (context?.previousTasks) {
        console.log('Revertendo para estado anterior:', context.previousTasks);
        queryClient.setQueryData(['tasks', projectId], context.previousTasks);
      } else {
         console.log('Não foi possível reverter para estado anterior (previousTasks is undefined).');
      }
      toast.error(`Erro ao mover tarefa para ${variables.newColumn}.`);
    },
    onSuccess: async (data, variables) => {
      console.log('=== Sucesso na mutação moveTask (onSuccess) ===');
      console.log('Dados retornados pela API:', JSON.stringify(data, null, 2));
      console.log('Variáveis da mutação:', variables);

      // Mapear o nome da coluna retornado pela API para o nosso ColumnId
      let processedColumn: ColumnId = variables.newColumn; // Padrão: manter a coluna otimista
      const apiReturnedColumn = data?.column?.toLowerCase();
      
      console.log('Coluna retornada pela API (raw):', data?.column);
      console.log('Coluna retornada pela API (lowercase):', apiReturnedColumn);

      if (apiReturnedColumn) {
         // Mapear os nomes de coluna comuns que a API pode retornar
         if (apiReturnedColumn === 'backlog') processedColumn = 'backlog';
         else if (apiReturnedColumn === 'pronto') processedColumn = 'pronto';
         else if (apiReturnedColumn === 'em progresso') processedColumn = 'em progresso';
         else if (apiReturnedColumn === 'revisao' || apiReturnedColumn === 'revisão') processedColumn = 'revisao';
         else if (apiReturnedColumn === 'concluido' || apiReturnedColumn === 'done' || apiReturnedColumn === 'concluído') processedColumn = 'concluido';
         // Adicionar outros mapeamentos se a API usar outros nomes

         console.log('Coluna processada da resposta da API:', processedColumn);
      } else {
         console.log('Campo \'column\' não encontrado na resposta da API ou inválido, usando coluna otimista:', processedColumn);
      }

      // Atualizar o cache com os dados retornados pela API
      queryClient.setQueryData<Task[]>(['tasks', projectId], (old) => {
        if (!old) return [];
        const updatedTasks = old.map(task => {
           if (task.id === variables.taskId) {
              console.log(`Atualizando task ${task.id} no cache com dados da API e coluna processada.`);
              // Usar os dados da API, mas garantir que campos como 'points' do estado anterior sejam mantidos
              // a menos que a API retorne um novo valor para eles.
              const updatedTask = { 
                 ...task, // Manter os dados anteriores da task
                 ...data, // Sobrescrever com os dados da API (se existirem)
                 kanbanColumn: processedColumn, // Garantir que o kanbanColumn está correto
                 // Explicitamente manter points do estado anterior se não vier na API response
                 points: data.points !== undefined ? data.points : task.points,
                 description: data.description !== undefined ? data.description : task.description, // Manter descrição também
                 assignedMemberId: data.assignedMemberId !== undefined ? data.assignedMemberId : task.assignedMemberId, // Manter responsável
                 assignees: data.assignees !== undefined ? data.assignees : task.assignees // Manter assignees
              };
              console.log(`Task ${task.id} no cache após atualização:`, JSON.stringify(updatedTask, null, 2));
              return updatedTask;
           } else {
              return task;
           }
        });
        console.log('Cache atualizado com sucesso:', updatedTasks);
        return updatedTasks;
      });

      // Chamar a API /complete se a tarefa foi movida para a coluna 'concluido'
      if (processedColumn === 'concluido') {
        console.log(`Task ${variables.taskId} movida para 'concluido', chamando API /complete.`);
        if (currentUser?.memberId) {
          try {
            await taskService.completeTask(variables.taskId, currentUser.memberId);
             console.log(`API /complete para task ${variables.taskId} chamada com sucesso.`);
          } catch (error) {
            console.error(`Falha ao chamar API /complete para task ${variables.taskId}:`, error);
            // Opcional: toast de erro específico para falha ao completar
            toast.error(`Erro ao marcar task ${variables.taskId} como completa.`);
          }
        } else {
          console.warn('Usuário atual não identificado, não é possível chamar API /complete.');
        }
      }

      toast.success(`Tarefa movida para ${columnNames[processedColumn]}!`);
    },
     onSettled: (data, error, variables, context) => {
       console.log('=== Mutação moveTask finalizada (onSettled) ===');
       console.log('Dados (se sucesso):', data);
       console.log('Erro (se erro):', error);
       console.log('Variáveis:', variables);
       console.log('Contexto:', context);

       // Podemos invalidar a query aqui se quisermos garantir que os dados estejam 100% sincronizados com o backend após qualquer resultado
       // No entanto, com a atualização otimista e no onSuccess, geralmente não é necessário e pode causar flickering
       // queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
     }
  });

  // Mutação para excluir uma tarefa
  const deleteTask = useMutation({
    mutationFn: (taskId: number) => taskService.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Tarefa excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir tarefa:', error);
      toast.error('Erro ao excluir tarefa');
    }
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTask.mutateAsync,
    updateTask: updateTaskTitleMutation.mutateAsync,
    moveTask: moveTask.mutateAsync,
    deleteTask: deleteTask.mutateAsync,
  };
};

export const useTask = (taskId: number) => {
  const { data: task, isLoading, error } = useQuery<Task>({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getById(taskId),
    enabled: !!taskId,
  });

  return {
    task,
    isLoading,
    error,
  };
};
