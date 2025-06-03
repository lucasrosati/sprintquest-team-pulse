import { Member } from './Member';

export type ColumnId = 'backlog' | 'pronto' | 'em progresso' | 'revisao' | 'concluido';

export const columnNames: Record<ColumnId, string> = {
  backlog: 'Backlog',
  pronto: 'Pronto',
  'em progresso': 'Em Progresso',
  revisao: 'Revisão',
  concluido: 'Concluído'
};

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  kanbanColumn: ColumnId;
  points: number;
  createdAt: string;
  completedAt?: string;
  assignedMemberId?: number;
  assignees?: { memberId: number }[];
  deadline?: string;
  criteria?: string;
}

export interface CreateTaskRequest {
  projectId: number;
  title: string;
  description: string;
  kanbanColumn: ColumnId;
  assignedMemberId?: number;
  points: number;
  deadline?: string;
  criteria?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  kanbanColumn?: ColumnId;
  assignedMemberId?: number;
  points?: number;
  deadline?: string;
  criteria?: string;
}

export interface MoveTaskRequest {
  taskId: number;
  newColumn: ColumnId;
}
