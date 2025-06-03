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

  // Mutação para atualizar uma tarefa existente
  const updateTask = useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: UpdateTaskRequest }) =>
      taskService.update(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Tarefa atualizada!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('Erro ao atualizar tarefa');
    }
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
    onSuccess: (data, variables) => {
      console.log('=== Sucesso na mutação moveTask (onSuccess) ===');
      console.log('Dados retornados pela API:', JSON.stringify(data, null, 2));
      console.log('Variáveis da mutação:', variables);

      // Mapear o nome da coluna retornado pela API para o nosso ColumnId
      let processedColumn: ColumnId = variables.newColumn; // Padrão: manter a coluna otimista
      const apiReturnedColumn = data?.column?.toLowerCase(); // Obter o campo 'column' da API (lowercase)
      
      console.log('Coluna retornada pela API (raw):', data?.column);
      console.log('Coluna retornada pela API (lowercase):', apiReturnedColumn);

      if (apiReturnedColumn) {
         // Mapear os nomes de coluna comuns que a API pode retornar
         if (apiReturnedColumn === 'backlog') processedColumn = 'backlog';
         else if (apiReturnedColumn === 'pronto') processedColumn = 'pronto';
         else if (apiReturnedColumn === 'em progresso') processedColumn = 'em progresso';
         else if (apiReturnedColumn === 'revisao') processedColumn = 'revisao';
         else if (apiReturnedColumn === 'concluido' || apiReturnedColumn === 'done') processedColumn = 'concluido';
         // Adicionar outros mapeamentos se a API usar outros nomes

         console.log('Coluna processada da resposta da API:', processedColumn);
      } else {
         console.log('Campo \'column\' não encontrado na resposta da API ou inválido, usando coluna otimista:', processedColumn);
      }

      // Atualizar o cache com os dados retornados pela API, usando a coluna processada
      queryClient.setQueryData<Task[]>(['tasks', projectId], (old) => {
        if (!old) return [];
        const updatedTasks = old.map(task => {
           if (task.id === variables.taskId) {
              console.log(`Atualizando task ${task.id} no cache com dados da API e coluna processada.`);
              // Usar os dados completos retornados pela API para atualizar a task no cache
              // Garantir que o kanbanColumn da task no cache seja o que veio da API (processado)
              const updatedTask = { 
                 ...task, // Manter alguns campos do estado anterior se a API não retornar tudo
                 ...data, // Sobrescrever com os dados da API
                 kanbanColumn: processedColumn // >>> Usar a coluna processada da resposta da API <<<\n              };
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

      // Não invalidamos mais a query aqui para evitar re-fetch desnecessário se a API retornar a task completa
      // queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });

      toast.success(`Tarefa movida para ${columnNames[processedColumn]}!`); // Usar o nome mapeado para o toast
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
    createTask,
    updateTask,
    moveTask,
    deleteTask,
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
