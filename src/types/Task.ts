
import { Member } from './Member';

export interface Task {
  id: number;
  title: string;
  description: string;
  points: number;
  createdAt: string;
  kanbanColumn: 'TODO' | 'DOING' | 'DONE';
  completedAt?: string;
  assignedMemberId?: number;
  projectId?: number;
  assignedMember?: Member;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  assignedMemberId?: number;
  points: number;
}

export interface UpdateTaskColumnRequest {
  column: 'TODO' | 'DOING' | 'DONE';
}

export interface UpdateTaskTitleRequest {
  newTitle: string;
}

export interface AssignTaskRequest {
  memberId: number;
}
