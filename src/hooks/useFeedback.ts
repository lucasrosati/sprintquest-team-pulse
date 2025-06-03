import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService, CreateFeedbackRequest, Feedback } from '@/services/feedbackService';
import { toast } from 'sonner';

export function useFeedback(memberId: number) {
  const queryClient = useQueryClient();

  const { data: feedbacks = [], isLoading, error } = useQuery<Feedback[]>({
    queryKey: ['feedbacks', memberId],
    queryFn: () => feedbackService.getByMemberId(memberId),
    enabled: !!memberId,
  });

  const createFeedbackMutation = useMutation({
    mutationFn: (data: CreateFeedbackRequest) => feedbackService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks', memberId] });
      toast.success('Feedback enviado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao enviar feedback:', error);
      toast.error('Erro ao enviar feedback');
    }
  });

  return {
    feedbacks,
    isLoading,
    error,
    createFeedback: createFeedbackMutation.mutate,
    isCreating: createFeedbackMutation.isPending
  };
} 