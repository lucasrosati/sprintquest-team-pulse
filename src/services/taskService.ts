import api from './api';
import { Task, CreateTaskRequest, UpdateTaskRequest, MoveTaskRequest, ColumnId, columnNames } from '@/types/Task';

// Defina a interface para uma Tarefa
export interface Task {
  id: number; // Ou string, dependendo do backend
  projectId: number;
  title: string;
  description: string;
  status: 'backlog' | 'ready' | 'in-progress' | 'review' | 'done'; // Status da tarefa atualizado
  deadline?: string; // Data limite opcional
  assignedMemberId?: number; // ID do membro responsável opcional (renomeado para corresponder à API)
  criteria?: string; // Critérios de aceitação opcionais
  points?: number; // Pontos da tarefa (adicionado conforme a API)
  // Adicione outros campos conforme a necessidade da sua API de backend
  kanbanColumn: ColumnId; // Adicionar kanbanColumn aqui também
}

// Interfaces para requisições (se necessário)
export interface CreateTaskRequest {
  // projectId: number; // Não necessário no corpo da requisição, vai na URL
  title: string;
  description: string;
  // status: 'todo' | 'in-progress' | 'done'; // Status inicial pode ser definido no backend
  deadline?: string;
  assignedMemberId?: number; // ID do membro atribuído
  criteria?: string;
  points: number; // Pontos da tarefa (obrigatório ou opcional, dependendo da API - assumindo obrigatório no request)
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
  deadline?: string;
  assignedMemberId?: number; // ID do membro responsável opcional
  criteria?: string;
  points?: number; // Pontos da tarefa (opcional na atualização)
}

export const taskService = {
  // GET /api/projects/{projectId}/tasks
  listByProject: async (projectId: number): Promise<Task[]> => {
    console.log(`=== Iniciando busca de tasks do projeto ${projectId} ===`);
    try {
      const response = await api.get(`/api/projects/${projectId}/tasks`);
      console.log('Resposta bruta da API (/api/projects/{projectId}/tasks):', JSON.stringify(response.data, null, 2));
      
      // Processar todas as tasks e buscar seus assignees
      const tasks = await Promise.all(response.data.map(async (task: any) => {
        console.log('\n=== Processando task da lista ===');
        console.log('Task original (da lista): ', JSON.stringify(task, null, 2));
        // Adicionar log para inspecionar a propriedade 'points'
        console.log(`Task ${task.id} - Propriedade 'points' (bruta da API):`, task.points, `(Tipo: ${typeof task.points})`);

        // Buscar os assignees da task (mantido para garantir assignedMemberId)
        let assignees: number[] = [];
        try {
          // Verificar se a task já vem com assignees antes de buscar separadamente
          if (task.assignees && Array.isArray(task.assignees) && task.assignees.length > 0) {
             assignees = task.assignees.map((a: any) => a.memberId || a);
             console.log(`Assignees encontrados na task original ${task.id}:`, assignees);
          } else {
             // Esta chamada pode ser otimizada se a lista já vier com assignees
             assignees = await taskService.getTaskAssignees(task.id);
             console.log(`Assignees buscados separadamente para task ${task.id}:`, assignees);
          }
        } catch (error) {
          console.error(`Erro ao buscar assignees da task ${task.id}:`, error);
          // Continuar mesmo que falhe buscar assignees
        }

        // O assignedMemberId será o primeiro assignee (se houver)
        const assignedMemberId = assignees.length > 0 ? assignees[0] : undefined;
        console.log('AssignedMemberId extraído:', assignedMemberId);

        // --- Lógica de mapeamento da coluna --- 
        let kanbanColumn: ColumnId = 'backlog'; // Padrão
        
        // Coletar todos os possíveis campos de coluna/status e seus valores (case-insensitive)
        const possibleColumnFields: { [key: string]: string | undefined } = {
          backend_kanban_column: task.kanban_column?.toLowerCase(), // Campo do DB/Backend (snake_case)
          backendKanbanColumn: task.kanbanColumn?.toLowerCase(), // Campo da rota específica (/api/tasks/{taskId}) (camelCase)
          status: task.status?.toLowerCase(), // Campo 'status' comum
          column: task.column?.toLowerCase(), // Campo 'column' comum
          kanbanStatus: task.kanbanStatus?.toLowerCase(),
          taskStatus: task.taskStatus?.toLowerCase(),
          // Adicionar outros campos que possam vir na API de lista que representem a coluna
          // Ex: se tiver um campo chamado 'currentState' que indica a coluna:
          // currentState: task.currentState?.toLowerCase(),
        };

        console.log(`Task ${task.id} - Possíveis campos de coluna/status da API de lista:`, possibleColumnFields);

        // Prioridade de mapeamento: verificar os campos em uma ordem lógica
        // 1. Campo do DB ('kanban_column') - Maior Prioridade (snake_case)
        if (possibleColumnFields.backend_kanban_column && ['backlog', 'pronto', 'em progresso', 'revisao', 'concluido'].includes(possibleColumnFields.backend_kanban_column)) {
           kanbanColumn = possibleColumnFields.backend_kanban_column as ColumnId;
           console.log(`Task ${task.id} mapeada para '${kanbanColumn}' usando 'kanban_column' do backend.`);
        }
        // 2. Campo da API de lista/rota específica ('kanbanColumn') - Segunda Prioridade (camelCase, pode vir Capitalizado)
        else if (possibleColumnFields.backendKanbanColumn) { // Verificar se o campo existe
           const lowerCaseKanbanColumn = possibleColumnFields.backendKanbanColumn.trim().toLowerCase(); // Adicionado trim()
           // Mapear os nomes de coluna que vêm da API de lista
           if (lowerCaseKanbanColumn === 'backlog') kanbanColumn = 'backlog';
           else if (lowerCaseKanbanColumn === 'pronto') kanbanColumn = 'pronto';
           else if (lowerCaseKanbanColumn === 'em progresso') kanbanColumn = 'em progresso';
           else if (lowerCaseKanbanColumn === 'revisao' || lowerCaseKanbanColumn === 'revisão') kanbanColumn = 'revisao'; // Adicionado 'revisão' com acento
           else if (lowerCaseKanbanColumn === 'concluido' || lowerCaseKanbanColumn === 'done' || lowerCaseKanbanColumn === 'concluído') kanbanColumn = 'concluido'; // Adicionado 'concluído' com acento
           // Adicionar outros mapeamentos se a API usar outros nomes que não sejam os 5 ColumnId padrão + done
           
           if (kanbanColumn !== 'backlog' || lowerCaseKanbanColumn === 'backlog') { // Verificar se o mapeamento encontrou uma coluna (ou se era backlog mesmo)
                console.log(`Task ${task.id} mapeada para '${kanbanColumn}' usando 'kanbanColumn' (camelCase/Capitalizado) da API.`);
           } else {
                console.log(`Task ${task.id} encontrou '${lowerCaseKanbanColumn}' em 'kanbanColumn', mas não mapeou para um ColumnId válido.`);
           }
        }
         // 3. Campo 'column' (retornado pela API de movimentação) ou 'status' ou outros fallbacks - Menor Prioridade
         else if (possibleColumnFields.column && ['backlog', 'pronto', 'em progresso', 'revisao', 'concluido'].includes(possibleColumnFields.column)) {
           kanbanColumn = possibleColumnFields.column as ColumnId;
           console.log(`Task ${task.id} mapeada para '${kanbanColumn}' usando 'column' da API.`);
         }
        else if (possibleColumnFields.status && ['backlog', 'pronto', 'em progresso', 'revisao', 'concluido', 'done'].includes(possibleColumnFields.status)) {
           kanbanColumn = (possibleColumnFields.status === 'done' ? 'concluido' : possibleColumnFields.status) as ColumnId;
           console.log(`Task ${task.id} mapeada para '${kanbanColumn}' usando 'status'.`);
        }
        // Adicionar mais fallbacks aqui se necessário, seguindo a mesma estrutura
        
        // Se nenhum campo válido foi encontrado com um dos nomes esperados, mantém o padrão 'backlog'
        // A condição verifica se AINDA está como 'backlog' E se os campos prioritários não continham um valor válido
        if (kanbanColumn === 'backlog' && 
            !(['backlog', 'pronto', 'em progresso', 'revisao', 'concluido', 'done'].includes(possibleColumnFields.backend_kanban_column)) && 
            !(['backlog', 'pronto', 'em progresso', 'revisao', 'concluido', 'done'].includes(possibleColumnFields.backendKanbanColumn)) &&
            !(['backlog', 'pronto', 'em progresso', 'revisao', 'concluido', 'done'].includes(possibleColumnFields.column)) &&
            !(['backlog', 'pronto', 'em progresso', 'revisao', 'concluido', 'done'].includes(possibleColumnFields.status))) {
            console.log(`Task ${task.id} manteve o padrão 'backlog' após verificar todos os campos conhecidos e não encontrar um valor mapeável.`);
        } else if (kanbanColumn !== 'backlog') {
             // Log já feito na lógica de mapeamento bem-sucedida
        }
        // --- Fim da lógica de mapeamento da coluna ---

        const processedTask = {
          ...task, // Incluir todos os campos originais da API de lista
          projectId,
          assignedMemberId,
          kanbanColumn, // Usar a coluna mapeada
          // Garantir que assignees é um array de objetos { memberId: number } ou apenas um array de numbers, dependendo do formato esperado no frontend
          assignees: assignees.map(id => ({ memberId: id })) 
        };

        console.log('Task processada (para o frontend):', JSON.stringify(processedTask, null, 2));
        return processedTask;
      }));

      console.log('\n=== Tasks processadas (lista final) ===');
      console.log(JSON.stringify(tasks, null, 2));
      return tasks;
    } catch (error) {
      console.error('Erro ao buscar tasks:', error);
      throw error;
    } 
  },

  // GET /api/tasks/{taskId}
  getById: async (taskId: number): Promise<Task> => {
    console.log(`Fetching task by ID: ${taskId}`);
    const response = await api.get(`/api/tasks/${taskId}`);
    console.log(`Task ${taskId}:`, response.data);
     // Mapear a coluna e pontos aqui
    const taskData = response.data;
    let kanbanColumn: ColumnId = 'backlog'; // Padrão
    let points: number | undefined = undefined; // Inicializar pontos

     const apiColumnName = taskData.kanbanColumn?.toLowerCase() || taskData.column?.toLowerCase() || taskData.status?.toLowerCase();
     if (apiColumnName) {
        if (apiColumnName === 'backlog') kanbanColumn = 'backlog';
        else if (apiColumnName === 'pronto') kanbanColumn = 'pronto';
        else if (apiColumnName === 'em progresso') kanbanColumn = 'em progresso';
        else if (apiColumnName === 'revisao' || apiColumnName === 'revisão') kanbanColumn = 'revisao';
        else if (apiColumnName === 'concluido' || apiColumnName === 'done' || apiColumnName === 'concluído') kanbanColumn = 'concluido';
     }

     // Tentar obter os pontos, verificando se é um número
     if (typeof taskData.points === 'number') {
        points = taskData.points;
     } else if (typeof taskData.points === 'string' && !isNaN(parseInt(taskData.points))) {
        // Se vier como string que pode ser convertida para número
        points = parseInt(taskData.points);
     }
     console.log(`Task ${taskId} - Pontos processados:`, points);

    return { ...taskData, kanbanColumn, points }; // Incluir pontos no retorno
  },

  // POST /api/projects/{projectId}/tasks
  create: async (data: CreateTaskRequest): Promise<Task> => {
    // projectId é usado na URL, não no corpo da requisição POST
    const { projectId, ...taskData } = data; // Remover projectId do corpo
    console.log(`Creating task for project ${projectId} with data:`, taskData);
    const response = await api.post(`/api/projects/${projectId}/tasks`, taskData);
    console.log(`Task created for project ${projectId}:`, response.data);
    return response.data;
  },

  // PATCH /api/tasks/{taskId}
  update: async (taskId: number, data: UpdateTaskRequest): Promise<Task> => {
    console.log(`Updating task ${taskId} with data:`, data);
    const response = await api.patch(`/api/tasks/${taskId}`, data);
    console.log(`Task ${taskId} updated:`, response.data);
    return response.data;
  },

  // PATCH /api/tasks/{taskId}/title - Novo método para atualizar apenas o título
  updateTitle: async (taskId: number, newTitle: string): Promise<Task> => {
    console.log(`Updating task ${taskId} title to: ${newTitle}`);
    const response = await api.patch(`/api/tasks/${taskId}/title`, { newTitle });
    console.log(`Task ${taskId} title updated:`, response.data);
    // A API pode retornar apenas o título atualizado, ou a task completa.
    // Retornar a task completa (se disponível) ou uma estrutura mínima
    return response.data || { id: taskId, title: newTitle, kanbanColumn: 'backlog' }; // Retornar a task atualizada (ou uma estrutura mínima) - assumindo que a API retorna a task atualizada
  },

  // PATCH /api/tasks/{taskId}/column - Ajustado endpoint e corpo
  move: async (taskId: number, newColumn: ColumnId, memberId: number): Promise<Task> => {
    console.log('\n=== Iniciando movimento de task ===');
    console.log('Task ID:', taskId);
    console.log('Nova coluna (ColumnId):', newColumn);
    console.log('Member ID:', memberId);
    
    // Mapear o ColumnId do frontend para o nome capitalizado esperado pela API
    const apiColumnName = columnNames[newColumn];
    console.log('Nome da coluna para API:', apiColumnName);

    try {
      // Primeiro, buscar a task atual para ter o estado anterior
      const currentTask = await taskService.getById(taskId);
      console.log('Estado atual da task:', currentTask);

      // Enviar memberId como parâmetro de query string
      const requestBody = { 
        column: apiColumnName,
        status: apiColumnName // Adicionando status também para garantir
      };
      console.log('Corpo da requisição:', requestBody);

      const response = await api.patch(`/api/tasks/${taskId}/column?memberId=${memberId}`, requestBody);
      console.log('Resposta bruta da API:', JSON.stringify(response.data, null, 2));

      // Se a resposta não tiver os campos necessários, usar o estado anterior
      let processedColumn: ColumnId = newColumn; // Usar a nova coluna como padrão
      
      if (!response.data || (!response.data.column && !response.data.status)) {
        console.log('API não retornou column/status, mantendo a nova coluna:', newColumn);
      } else {
        const responseColumn = response.data.column?.toLowerCase();
        const responseStatus = response.data.status?.toLowerCase();
        const responseKanbanStatus = response.data.kanbanStatus?.toLowerCase();

        console.log('Dados da resposta:');
        console.log('- Coluna:', responseColumn);
        console.log('- Status:', responseStatus);
        console.log('- KanbanStatus:', responseKanbanStatus);

        // Tentar determinar a coluna correta
        if (responseStatus === 'done' || responseStatus === 'concluido' || 
            responseColumn === 'done' || responseColumn === 'concluido') {
          processedColumn = 'concluido';
        } else if (responseColumn === 'pronto' || responseKanbanStatus === 'pronto') {
          processedColumn = 'pronto';
        } else if (responseColumn === 'em progresso' || responseKanbanStatus === 'em progresso') {
          processedColumn = 'em progresso';
        } else if (responseColumn === 'revisao' || responseKanbanStatus === 'revisao') {
          processedColumn = 'revisao';
        } else if (responseColumn === 'backlog' || responseKanbanStatus === 'backlog') {
          processedColumn = 'backlog';
        }
      }

      console.log('Coluna processada:', processedColumn);

      // Garantir que a task retornada tenha o kanbanColumn correto
      const updatedTask = {
        ...currentTask, // Manter os dados anteriores
        ...response.data, // Sobrescrever com os dados da resposta
        kanbanColumn: processedColumn // Garantir que o kanbanColumn está correto
      };

      console.log('Task atualizada:', updatedTask);
      return updatedTask;
    } catch (error) {
      console.error('Erro ao mover task:', error);
      throw error;
    }
  },

  // DELETE /api/tasks/{taskId}
  delete: async (taskId: number): Promise<void> => {
    console.log(`Deleting task ${taskId}`);
    await api.delete(`/api/tasks/${taskId}`);
    console.log(`Task ${taskId} deleted.`);
  },

  // POST /api/tasks/{taskId}/assign
  assignTask: async (taskId: number, memberId: number): Promise<Task> => {
    console.log(`Atribuindo task ${taskId} para o membro ${memberId}`);
    const response = await api.post(`/api/tasks/${taskId}/assign`, { memberId });
    console.log(`Task ${taskId} atribuída para o membro ${memberId}:`, response.data);
    return response.data;
  },

  // GET /api/tasks/{taskId}/assignees
  getTaskAssignees: async (taskId: number): Promise<number[]> => {
    console.log(`Buscando assignees da task ${taskId}`);
    const response = await api.get(`/api/tasks/${taskId}/assignees`);
    console.log(`Assignees da task ${taskId}:`, response.data);
    return response.data;
  },

  // PATCH /api/tasks/{taskId}/complete - Novo método para marcar task como completa
  completeTask: async (taskId: number, memberId: number): Promise<void> => {
    console.log(`Marking task ${taskId} as complete by member ${memberId}`);
    try {
      // Usar PATCH conforme o endpoint fornecido, passando memberId na query string
      await api.patch(`/api/tasks/${taskId}/complete?memberId=${memberId}`);
      console.log(`Task ${taskId} marked as complete.`);
    } catch (error) {
      console.error(`Erro ao marcar task ${taskId} como completa:`, error);
      // Opcional: lançar erro ou retornar falha dependendo de como quer tratar no frontend
      throw error; 
    }
  },
};
