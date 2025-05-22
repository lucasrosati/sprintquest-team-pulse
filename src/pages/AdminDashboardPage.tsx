
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Plus, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useToast } from "@/components/ui/use-toast";

interface Reward {
  id: string;
  description: string;
  points: number;
  isEditing: boolean;
}

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<Reward[]>([
    { id: '1', description: 'Descrição da recompensa', points: 10000, isEditing: false },
    { id: '2', description: 'Descrição da recompensa', points: 20000, isEditing: false },
    { id: '3', description: 'Descrição da recompensa', points: 30000, isEditing: false },
  ]);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin-login');
  };

  const handleBackClick = () => {
    setSelectedReward(null);
  };
  
  const toggleEditMode = (id: string) => {
    setRewards(rewards.map(reward => 
      reward.id === id ? { ...reward, isEditing: !reward.isEditing } : reward
    ));
  };

  const updateRewardDescription = (id: string, description: string) => {
    setRewards(rewards.map(reward => 
      reward.id === id ? { ...reward, description } : reward
    ));
  };

  const updateRewardPoints = (id: string, points: string) => {
    const numericPoints = Number(points) || 0;
    setRewards(rewards.map(reward => 
      reward.id === id ? { ...reward, points: numericPoints } : reward
    ));
  };

  const addNewReward = () => {
    const newId = (rewards.length + 1).toString();
    setRewards([
      ...rewards,
      { id: newId, description: 'Nova recompensa', points: 5000, isEditing: true }
    ]);
  };

  const saveChanges = () => {
    // Here you would typically send the data to your backend API
    // For now, we'll just show a success message
    setRewards(rewards.map(reward => ({ ...reward, isEditing: false })));
    toast({
      title: "Alterações salvas",
      description: "As recompensas foram atualizadas com sucesso.",
    });
  };

  // Reward detail view
  if (selectedReward) {
    const reward = rewards.find(r => r.id === selectedReward) || rewards[0];
    
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <header className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              className="p-2 mr-4" 
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold flex-grow text-center">Admin</h1>
          </header>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center font-medium">Recompensa</div>
            <div className="text-center font-medium">Pontuação necessária</div>
          </div>
          
          <div className="space-y-4">
            {rewards.map((item) => (
              <div key={item.id} className="grid grid-cols-2 gap-4">
                <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-md">
                  {item.isEditing ? (
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateRewardDescription(item.id, e.target.value)}
                      className="w-full bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="text-center">{item.description}</div>
                  )}
                </div>
                <div className={`p-4 rounded-md ${item.id === '1' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-400 dark:bg-gray-600'}`}>
                  {item.isEditing ? (
                    <Input
                      type="number"
                      value={item.points}
                      onChange={(e) => updateRewardPoints(item.id, e.target.value)}
                      className="text-center w-full bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="text-center">{item.points}</div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="grid grid-cols-1">
              <Button 
                variant="outline" 
                className="bg-gray-200 dark:bg-gray-700 p-4 h-auto flex items-center justify-center gap-2"
                onClick={addNewReward}
              >
                Adicionar recompensa <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-end mt-6 space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setRewards(rewards.map(r => ({ ...r, isEditing: true })))}
              >
                Editar
              </Button>
              <Button onClick={saveChanges}>
                <Save className="h-4 w-4 mr-2" /> Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Main dashboard view with rewards list
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with title and actions */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Menu administrador</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>
        
        {/* Rewards Section */}
        <Card className="mb-8 bg-gray-100 dark:bg-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Recompensas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div 
                  key={reward.id}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setSelectedReward(reward.id)}
                >
                  <div className="flex-1">
                    <span className="text-base font-medium">
                      Recompensa {reward.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Rankings Section */}
        <Card className="bg-gray-100 dark:bg-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Team Rankings */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Por equipe</h3>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-md">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">1.</span>
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-500 flex-grow"></div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">2.</span>
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-500 flex-grow"></div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">3.</span>
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-500 flex-grow"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Member Rankings */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Por membro</h3>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-md">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">1.</span>
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-500 flex-grow"></div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">2.</span>
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-500 flex-grow"></div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">3.</span>
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-500 flex-grow"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
