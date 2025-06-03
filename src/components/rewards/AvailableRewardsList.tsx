import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAvailableRewards, useUnlockedRewards } from '@/hooks/useRewards';
import { useUnlockReward, useMember } from '@/hooks/useMembers';
import { Gift, Trophy, Coffee } from 'lucide-react';

interface AvailableRewardsListProps {
  userId: number;
  userPoints: number;
  onPointsUpdate?: (newPoints: number) => void;
}

const AvailableRewardsList: React.FC<AvailableRewardsListProps> = ({ 
  userId, 
  userPoints: initialUserPoints,
  onPointsUpdate 
}) => {
  const { data: availableRewards = [], isLoading: isLoadingAvailable } = useAvailableRewards(initialUserPoints);
  const { data: unlockedRewards = [], isLoading: isLoadingUnlocked } = useUnlockedRewards(userId);
  const { data: userData, isLoading: isLoadingUser } = useMember(userId);
  const unlockRewardMutation = useUnlockReward();

  const isLoading = isLoadingAvailable || isLoadingUnlocked || isLoadingUser;
  const currentUserPoints = userData?.individualScore || initialUserPoints;

  // Atualiza os pontos do usuário quando os dados são atualizados
  React.useEffect(() => {
    if (userData?.individualScore !== undefined && onPointsUpdate) {
      onPointsUpdate(userData.individualScore);
    }
  }, [userData?.individualScore, onPointsUpdate]);

  const handleUnlockReward = async (rewardId: number) => {
    try {
      await unlockRewardMutation.mutateAsync({
        id: userId,
        data: { rewardId }
      });
    } catch (error) {
      console.error('Erro ao desbloquear recompensa:', error);
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'CUPOM':
        return <Coffee className="h-6 w-6" />;
      case 'FOLGA':
        return <Gift className="h-6 w-6" />;
      case 'DESTAQUE':
        return <Trophy className="h-6 w-6" />;
      default:
        return <Gift className="h-6 w-6" />;
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'CUPOM':
        return 'bg-blue-500';
      case 'FOLGA':
        return 'bg-green-500';
      case 'DESTAQUE':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <p className="text-center text-gray-400">Carregando recompensas...</p>
        </CardContent>
      </Card>
    );
  }

  const isRewardUnlocked = (rewardId: number) => {
    return unlockedRewards.some(reward => reward.id === rewardId);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recompensas Disponíveis</CardTitle>
        <p className="text-gray-400">Seus pontos: {currentUserPoints}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableRewards.length === 0 ? (
          <p className="text-center text-gray-400">Nenhuma recompensa disponível</p>
        ) : (
          availableRewards.map((reward) => {
            const canUnlock = currentUserPoints >= reward.requiredPoints;
            const isUnlocking = unlockRewardMutation.isPending;
            const isUnlocked = isRewardUnlocked(reward.id);
            
            return (
              <div
                key={reward.id}
                className={`p-4 rounded-lg border ${
                  isUnlocked 
                    ? 'border-gray-600 bg-gray-700' 
                    : 'border-sprint-primary bg-gray-750'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getRewardColor(reward.type)}`}>
                      {getRewardIcon(reward.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{reward.description}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-sprint-primary border-sprint-primary">
                          {reward.requiredPoints} pontos
                        </Badge>
                        <Badge variant="secondary">
                          {reward.type}
                        </Badge>
                        {!canUnlock && !isUnlocked && (
                          <Badge variant="destructive">
                            Pontos insuficientes
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {(canUnlock || isUnlocked) && (
                    <Button
                      onClick={() => handleUnlockReward(reward.id)}
                      disabled={!canUnlock || isUnlocking || isUnlocked}
                      className={`ml-4 ${
                        isUnlocked
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-sprint-primary hover:bg-sprint-accent'
                      }`}
                    >
                      {isUnlocked 
                        ? 'Já Resgatou' 
                        : isUnlocking 
                          ? 'Desbloqueando...' 
                          : 'Desbloquear'
                      }
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableRewardsList; 