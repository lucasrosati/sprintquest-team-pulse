
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';

interface Reward {
  id: string;
  description: string;
  points: number;
}

interface Ranking {
  position: number;
  name: string;
  points: number;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [teamRankings, setTeamRankings] = useState<Ranking[]>([]);
  const [memberRankings, setMemberRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [rankingsLoading, setRankingsLoading] = useState(true);
  
  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // User points - in a real app, this would come from the backend
  const userPoints = 11000;
  
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        // In a real implementation, this would be a call to the backend API
        // For now, we'll simulate fetching rewards from AdminDashboardPage
        const adminRewards = localStorage.getItem('adminRewards');
        
        if (adminRewards) {
          setRewards(JSON.parse(adminRewards));
        } else {
          // Fallback to hardcoded rewards if no admin rewards are found
          setRewards([
            { id: '1', description: 'Alexa', points: 10000 },
            { id: '2', description: 'JBL', points: 20000 },
            { id: '3', description: 'iPhone 16 Pro Max', points: 30000 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching rewards:', error);
        toast.error('Erro ao carregar recompensas');
      } finally {
        setLoading(false);
      }
    };

    const fetchRankings = async () => {
      try {
        // In a real implementation, this would be API calls
        // For now, we'll simulate fetching rankings
        // This would be replaced with actual API calls in production
        
        // Simulated API response for team rankings
        const teamRankingsData = [
          { position: 1, name: 'Time Alpha', points: 25000 },
          { position: 2, name: 'Time Beta', points: 18000 },
          { position: 3, name: 'Time Gamma', points: 12500 },
        ];
        
        // Simulated API response for member rankings
        const memberRankingsData = [
          { position: 1, name: 'João Silva', points: 8500 },
          { position: 2, name: 'Maria Oliveira', points: 7200 },
          { position: 3, name: 'Carlos Santos', points: 5800 },
        ];
        
        setTeamRankings(teamRankingsData);
        setMemberRankings(memberRankingsData);
      } catch (error) {
        console.error('Error fetching rankings:', error);
        toast.error('Erro ao carregar rankings');
      } finally {
        setRankingsLoading(false);
      }
    };

    fetchRewards();
    fetchRankings();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header Section */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-gray-800 hover:bg-gray-700"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold">
              {user?.name || 'Nome do usuário'}
            </h1>
          </div>
          
          <div className="text-right">
            <p className="text-xl">Pontuação: {userPoints}</p>
          </div>
        </div>
      </div>
      
      {/* Main Grid - Rewards and Rankings */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Rewards */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Recompensas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Reward Description */}
            <div>
              <h3 className="text-xl font-medium mb-4 text-center">Recompensa</h3>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-center">Carregando recompensas...</p>
                ) : rewards.length > 0 ? (
                  rewards.map((reward) => (
                    <Card 
                      key={reward.id}
                      className="bg-gray-800 border-gray-700 shadow-lg"
                    >
                      <CardContent className="p-6">
                        <p className="text-lg text-center">{reward.description}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center">Nenhuma recompensa disponível</p>
                )}
              </div>
            </div>
            
            {/* Points Required */}
            <div>
              <h3 className="text-xl font-medium mb-4 text-center">Pontuação necessária</h3>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-center">Carregando pontuações...</p>
                ) : rewards.length > 0 ? (
                  rewards.map((reward) => (
                    <Card 
                      key={reward.id}
                      className={`${
                        userPoints >= reward.points 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-gray-700 border-gray-600'
                      } shadow-lg`}
                    >
                      <CardContent className="p-6">
                        <p className="text-lg text-center">{reward.points}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center">Nenhuma pontuação disponível</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Rankings */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">Rankings</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Team Rankings */}
            <div>
              <h3 className="text-center mb-4 text-white font-medium">Por equipe</h3>
              <div className="bg-gray-800 p-4 rounded-md">
                <div className="space-y-4">
                  {rankingsLoading ? (
                    <p className="text-center text-sm">Carregando...</p>
                  ) : teamRankings.length > 0 ? (
                    teamRankings.map((rank) => (
                      <div key={rank.position} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2 font-medium">{rank.position}.</span>
                          <span className="text-sm">{rank.name}</span>
                        </div>
                        <span className="font-medium text-sm">{rank.points}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm">Nenhum ranking disponível</p>
                  )}
                </div>
              </div>
            </div>

            {/* Member Rankings */}
            <div>
              <h3 className="text-center mb-4 text-white font-medium">Por membro</h3>
              <div className="bg-gray-800 p-4 rounded-md">
                <div className="space-y-4">
                  {rankingsLoading ? (
                    <p className="text-center text-sm">Carregando...</p>
                  ) : memberRankings.length > 0 ? (
                    memberRankings.map((rank) => (
                      <div key={rank.position} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2 font-medium">{rank.position}.</span>
                          <span className="text-sm">{rank.name}</span>
                        </div>
                        <span className="font-medium text-sm">{rank.points}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm">Nenhum ranking disponível</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
