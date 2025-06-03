import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '@/services/memberService';
import { teamService } from '@/services/teamService';
import { CreateMemberRequest, UpdatePointsRequest, UnlockRewardRequest, Member } from '@/types/Member';
import { Team } from '@/types/Team';
import { toast } from 'sonner';
import { useMemo } from 'react';

export const useMembers = (teamIdToFilter?: number) => {
  const queryClient = useQueryClient();

  const { data: allMembers, isLoading: membersLoading, error: membersError } = useQuery<Member[]>({
    queryKey: ['allMembersWithoutTeamId'],
    queryFn: () => memberService.list(),
  });

  const { data: allTeams, isLoading: teamsLoading, error: teamsError } = useQuery<Team[]>({
    queryKey: ['allTeams'],
    queryFn: () => teamService.getAll(),
  });

  const isLoading = membersLoading || teamsLoading;
  const error = membersError || teamsError;

  const membersWithTeamIdAndFiltered = useMemo(() => {
    console.log('Calculando membros com teamId e filtrando...');
    console.log('allMembers (sem teamId da API):', allMembers);
    console.log('allTeams:', allTeams);

    if (!allMembers || !allTeams) return [];

    const memberTeamMap = new Map<number, number>();
    allTeams.forEach(team => {
      team.members?.forEach(memberRef => {
        if (!memberTeamMap.has(memberRef.value)) {
           memberTeamMap.set(memberRef.value, team.id.value);
        }
      });
    });
    console.log('memberTeamMap (construído dos times):', memberTeamMap);

    const membersWithTeamId = allMembers.map(member => ({
      ...member,
      teamId: memberTeamMap.get(member.memberId)
    }));
    console.log('members depois de associar teamId:', membersWithTeamId);

    if (teamIdToFilter !== undefined) {
      console.log('Aplicando filtro final por teamId:', teamIdToFilter);
      const filtered = membersWithTeamId.filter(member => member.teamId === teamIdToFilter);
      console.log('members depois do filtro final:', filtered);
      return filtered;
    }

    console.log('Retornando todos os membros com teamId associado (sem filtro final).');
    return membersWithTeamId;

  }, [allMembers, allTeams, teamIdToFilter]);

  return {
    data: membersWithTeamIdAndFiltered,
    isLoading,
    error,
  };
};

export const useMember = (id: number) => {
  const queryClient = useQueryClient();

  return useQuery<Member>({
    queryKey: ['member', id],
    queryFn: async () => {
      const member = await memberService.getById(id);

      const teams = await teamService.getAll();
      let memberTeamId: number | undefined;
      const memberTeam = teams.find(team => team.members?.some(m => m.value === member.memberId));

      if (memberTeam) {
        memberTeamId = memberTeam.id.value;
      }

      return { ...member, teamId: memberTeamId };
    },
    enabled: !!id,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMemberRequest) => memberService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allMembersWithoutTeamId'] });
      queryClient.invalidateQueries({ queryKey: ['allTeams'] });
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
      queryClient.invalidateQueries({ queryKey: ['allMembersWithoutTeamId'] });
      queryClient.invalidateQueries({ queryKey: ['allTeams'] });
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
    mutationFn: ({ id, data }: { id: number; data: { rewardId: number } }) => 
      memberService.unlockReward(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unlockedRewards'] });
      queryClient.invalidateQueries({ queryKey: ['availableRewards'] });
      queryClient.invalidateQueries({ queryKey: ['member'] });
      toast.success('Recompensa desbloqueada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao desbloquear recompensa:', error);
      toast.error('Erro ao desbloquear recompensa');
    }
  });
};
