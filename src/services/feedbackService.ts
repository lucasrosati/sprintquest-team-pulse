
import api from './api';
import { Feedback, CreateFeedbackRequest } from '@/types/Feedback';

export const feedbackService = {
  // POST /api/feedbacks
  create: async (data: CreateFeedbackRequest): Promise<Feedback> => {
    const response = await api.post('/api/feedbacks', data);
    return response.data;
  },

  // GET /api/feedbacks/{memberId}
  getByMember: async (memberId: number): Promise<Feedback[]> => {
    const response = await api.get(`/api/feedbacks/${memberId}`);
    return response.data;
  }
};
