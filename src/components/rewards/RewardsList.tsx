
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRewards } from '@/hooks/useRewards';
import { useUnlockReward } from '@/hooks/useMembers';
import { Gift, Trophy, Coffee } from 'lucide-react';

interface RewardsListProps {
  userPoints: number;
  userId: number;
}

const RewardsList: React.FC<RewardsListProps> = ({ userPoints, userId }) => {
  const { data: rewards = [], isLoading } = useRewards();
  const unlockRewardMutation = useUnlockReward();

  const handleUnlockReward = async (rewardId: number) => {
    try {
      await unlockRewardMutation.mutateAsync({
        id: userId,
        data: { rewardId }
      });
    } catch (error) {
      console.error('Error unlocking reward:', error);
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

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recompensas Disponíveis</CardTitle>
        <p className="text-gray-400">Seus pontos: {userPoints}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {rewards.length === 0 ? (
          <p className="text-center text-gray-400">Nenhuma recompensa disponível</p>
        ) : (
          rewards.map((reward) => {
            const canUnlock = userPoints >= reward.requiredPoints;
            const isUnlocking = unlockRewardMutation.isPending;
            
            return (
              <div
                key={reward.id}
                className={`p-4 rounded-lg border ${
                  canUnlock 
                    ? 'border-sprint-primary bg-gray-750' 
                    : 'border-gray-600 bg-gray-700 opacity-60'
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
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleUnlockReward(reward.id)}
                    disabled={!canUnlock || isUnlocking}
                    className={
                      canUnlock
                        ? 'bg-sprint-primary hover:bg-sprint-accent'
                        : 'bg-gray-600 cursor-not-allowed'
                    }
                  >
                    {isUnlocking ? 'Desbloqueando...' : canUnlock ? 'Desbloquear' : 'Insuficiente'}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default RewardsList;
