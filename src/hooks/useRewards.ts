
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardService } from '@/services/rewardService';
import { CreateRewardRequest, UpdateRewardPointsRequest } from '@/types/Reward';
import { toast } from 'sonner';

export const useRewards = () => {
  return useQuery({
    queryKey: ['rewards'],
    queryFn: rewardService.list,
  });
};

export const useReward = (id: number) => {
  return useQuery({
    queryKey: ['rewards', id],
    queryFn: () => rewardService.getById(id),
    enabled: !!id,
  });
};

export const useCreateReward = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRewardRequest) => rewardService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Recompensa criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar recompensa:', error);
      toast.error('Erro ao criar recompensa');
    }
  });
};

export const useUpdateRewardPoints = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRewardPointsRequest }) => 
      rewardService.updatePoints(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Pontos da recompensa atualizados!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar pontos da recompensa:', error);
      toast.error('Erro ao atualizar pontos da recompensa');
    }
  });
};

export const useDeleteReward = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => rewardService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Recompensa excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir recompensa:', error);
      toast.error('Erro ao excluir recompensa');
    }
  });
};
