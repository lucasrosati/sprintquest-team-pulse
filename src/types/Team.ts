import { Member } from './Member';

export interface TeamMemberReference {
  value: number;
}

export interface Team {
  id: { value: number };
  name: string;
  leaderId: number;
  teamScore: number;
  leader?: Member;
  members?: TeamMemberReference[];
}

export interface CreateTeamRequest {
  id: number;
  name: string;
}

export interface AddMemberToTeamRequest {
  memberId: number;
  role: string;
}
