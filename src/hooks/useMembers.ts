
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '@/services/memberService';
import { CreateMemberRequest, UpdatePointsRequest, UnlockRewardRequest } from '@/types/Member';
import { toast } from 'sonner';

export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: memberService.list,
  });
};

export const useMember = (id: number) => {
  return useQuery({
    queryKey: ['members', id],
    queryFn: () => memberService.getById(id),
    enabled: !!id,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMemberRequest) => memberService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Membro criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar membro:', error);
      toast.error('Erro ao criar membro');
    }
  });
};

export const useUpdateMemberPoints = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePointsRequest }) => 
      memberService.updatePoints(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Pontos atualizados com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar pontos:', error);
      toast.error('Erro ao atualizar pontos');
    }
  });
};

export const useUnlockReward = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UnlockRewardRequest }) => 
      memberService.unlockReward(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Recompensa desbloqueada!');
    },
    onError: (error) => {
      console.error('Erro ao desbloquear recompensa:', error);
      toast.error('Erro ao desbloquear recompensa');
    }
  });
};
