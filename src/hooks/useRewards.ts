import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardService } from '@/services/rewardService';
import { CreateRewardRequest, UpdateRewardPointsRequest } from '@/types/Reward';
import { toast } from 'sonner';
import { teamService } from '@/services/teamService';
import authService from '@/services/authService';

export const useRewards = () => {
  const currentUser = authService.getCurrentUser();

  return useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      // Buscar todos os rewards
      const rewards = await rewardService.list();
      
      // Se não houver usuário logado, retorna todos os rewards
      if (!currentUser) return rewards;

      // Buscar todas as equipes
      const teams = await teamService.getAll();
      
      // Encontrar a equipe do usuário atual
      const userTeam = teams.find(team => 
        team.members.some(member => member.value === currentUser.memberId)
      );

      // Se não encontrar a equipe do usuário, retorna todos os rewards
      if (!userTeam) return rewards;

      // Filtrar apenas os rewards criados pelo líder da equipe do usuário
      return rewards.filter(reward => reward.createdBy === userTeam.leaderId.value);
    },
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

export const useUnlockedRewards = (userId: number) => {
  return useQuery({
    queryKey: ['unlockedRewards', userId],
    queryFn: () => rewardService.getUnlockedRewards(userId),
    enabled: !!userId,
  });
};

export const useAvailableRewards = (points: number) => {
  const currentUser = authService.getCurrentUser();

  return useQuery({
    queryKey: ['availableRewards', points],
    queryFn: async () => {
      // Buscar todos os rewards disponíveis
      const rewards = await rewardService.getAvailableRewards(points);
      
      // Se não houver usuário logado, retorna todos os rewards
      if (!currentUser) return rewards;

      // Buscar todas as equipes
      const teams = await teamService.getAll();
      
      // Encontrar a equipe do usuário atual
      const userTeam = teams.find(team => 
        team.members.some(member => member.value === currentUser.memberId)
      );

      // Se não encontrar a equipe do usuário, retorna todos os rewards
      if (!userTeam) return rewards;

      // Filtrar apenas os rewards criados pelo líder da equipe do usuário
      return rewards.filter(reward => reward.createdBy === userTeam.leaderId.value);
    },
    enabled: points >= 0,
  });
};
