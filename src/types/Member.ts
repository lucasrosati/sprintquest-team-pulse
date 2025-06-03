import { Reward } from './Reward';

export interface Member {
  memberId: number;
  name: string;
  email: string;
  role: 'DEV' | 'QA' | 'PO';
  individualScore: number;
  points?: number;
  rewards?: Reward[];
  teamId?: number;
  password?: string;
  is_admin?: boolean;
  unlockedRewardIds?: number[];
  receivedFeedbacks?: {
    id: number;
    message: string;
    date: string;
    givenBy: number;
    relatedTaskId: number;
  }[];
}

export interface Reward {
  id: number;
  description: string;
  requiredPoints: number;
  type: 'CUPOM' | 'FOLGA' | 'DESTAQUE';
  createdBy: number;
}

export interface CreateMemberRequest {
  name: string;
  email: string;
  password: string;
  role: 'DEV' | 'QA' | 'PO';
}

export interface UpdatePointsRequest {
  points: number;
}

export interface UnlockRewardRequest {
  rewardId: number;
}

export interface TeamMemberReference {
  value: number;
}
