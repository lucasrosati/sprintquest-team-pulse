
import { Team } from './Team';
import { Task } from './Task';

export interface Project {
  id: number;
  name: string;
  description: string;
  teamId: number;
  team?: Team;
  tasks?: Task[];
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  teamId: number;
}
