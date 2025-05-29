
import { Member } from './Member';

export interface Team {
  id: number;
  name: string;
  leaderId: number;
  teamScore: number;
  leader?: Member;
  members?: Member[];
}

export interface CreateTeamRequest {
  id: number;
  name: string;
}

export interface AddMemberToTeamRequest {
  memberId: number;
  role: string;
}
