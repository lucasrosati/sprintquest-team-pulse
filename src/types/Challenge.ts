
export interface Challenge {
  id: number;
  title: string;
  description: string;
  criteria: string;
  extraPoints: number;
  createdBy: number;
  projectId: number;
  deadline: string;
}

export interface CreateChallengeRequest {
  title: string;
  description: string;
  criteria: string;
  extraPoints: number;
  createdBy: number;
  projectId: number;
  deadline: string;
}
