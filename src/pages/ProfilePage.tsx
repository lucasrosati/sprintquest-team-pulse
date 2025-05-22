
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  
  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // Mock user points
  const userPoints = 11000;
  
  // Mock rewards data
  const rewards = [
    { id: 1, description: 'Descrição da recompensa', pointsRequired: 10000 },
    { id: 2, description: 'Descrição da recompensa', pointsRequired: 20000 },
    { id: 3, description: 'Descrição da recompensa', pointsRequired: 30000 },
  ];
  
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
      
      {/* Rewards Section */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Reward Description */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">Recompensa</h2>
            <div className="space-y-4">
              {rewards.map((reward) => (
                <Card 
                  key={reward.id}
                  className="bg-gray-800 border-gray-700 shadow-lg"
                >
                  <CardContent className="p-6">
                    <p className="text-lg text-center">{reward.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Right Column - Points Required */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">Pontuação necessária</h2>
            <div className="space-y-4">
              {rewards.map((reward) => (
                <Card 
                  key={reward.id}
                  className={`${
                    userPoints >= reward.pointsRequired 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-gray-700 border-gray-600'
                  } shadow-lg`}
                >
                  <CardContent className="p-6">
                    <p className="text-lg text-center">{reward.pointsRequired}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
