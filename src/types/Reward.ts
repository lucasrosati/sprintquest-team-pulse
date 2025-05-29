
export interface Reward {
  id: number;
  description: string;
  requiredPoints: number;
  type: 'CUPOM' | 'FOLGA' | 'DESTAQUE';
  createdBy: number;
}

export interface CreateRewardRequest {
  description: string;
  requiredPoints: number;
  type: 'CUPOM' | 'FOLGA' | 'DESTAQUE';
  createdBy: number;
}

export interface UpdateRewardPointsRequest {
  requiredPoints: number;
}
