
export interface Feedback {
  id: number;
  message: string;
  givenBy: number;
  receivedBy: number;
  date: string;
  relatedTaskId?: number;
}

export interface CreateFeedbackRequest {
  message: string;
  givenBy: number;
  receivedBy: number;
  relatedTaskId?: number;
}
