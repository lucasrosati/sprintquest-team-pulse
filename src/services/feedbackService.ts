import api from './api';

export interface FeedbackId {
  value: number;
}

export interface FeedbackMemberReference {
  value: number;
}

export interface FeedbackTaskReference {
  value: number;
}

export interface Feedback {
  id: FeedbackId;
  message: string;
  date: string;
  givenBy: FeedbackMemberReference;
  receivedBy: FeedbackMemberReference;
  relatedTask?: FeedbackTaskReference;
}

export interface CreateFeedbackRequest {
  message: string;
  givenBy: number;
  receivedBy: number;
  relatedTaskId?: number;
}

export const feedbackService = {
  // POST /api/feedbacks
  create: async (data: CreateFeedbackRequest): Promise<Feedback> => {
    const response = await api.post('/api/feedbacks', data);
    return response.data;
  },

  // GET /api/feedbacks/{memberId}
  getByMemberId: async (memberId: number): Promise<Feedback[]> => {
    const response = await api.get(`/api/feedbacks/${memberId}`);
    return response.data;
  },

  // GET /api/feedbacks/{id}
  getById: async (id: number): Promise<Feedback> => {
    const response = await api.get(`/api/feedbacks/${id}`);
    return response.data;
  }
};
