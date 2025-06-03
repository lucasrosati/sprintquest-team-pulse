export type RewardType = 'DESTAQUE' | 'CUPOM' | 'FOLGA';

export interface Reward {
  id: number;
  description: string;
  requiredPoints: number;
  type: RewardType;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRewardRequest {
  description: string;
  requiredPoints: number;
  type: RewardType;
  createdBy: number;
}

export interface UpdateRewardPointsRequest {
  requiredPoints: number;
}
