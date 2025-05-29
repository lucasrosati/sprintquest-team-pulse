
export interface Member {
  id: number;
  name: string;
  email: string;
  role: 'DEV' | 'QA' | 'PO';
  individualScore: number;
  points?: number;
  rewards?: Reward[];
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
