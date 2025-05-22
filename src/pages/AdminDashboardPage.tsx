
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, LogOut, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    { id: '1', description: 'Alexa', points: 10000, isEditing: false },
    { id: '2', description: 'JBL', points: 20000, isEditing: false },
    { id: '3', description: 'iPhone 16 Pro Max', points: 30000, isEditing: false },
    { id: '4', description: 'Macbook Pro M4', points: 100000, isEditing: false },
    { id: '5', description: 'Nova recompensa', points: 5000, isEditing: false },
  ]);

  // Save rewards to localStorage on mount and when rewards change
  useEffect(() => {
    // Remove isEditing property before saving to localStorage
    const rewardsForStorage = rewards.map(({ isEditing, ...rest }) => rest);
    localStorage.setItem('adminRewards', JSON.stringify(rewardsForStorage));
  }, [rewards]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin-login');
  };
  
  const toggleEditMode = () => {
    setRewards(rewards.map(reward => ({ ...reward, isEditing: true })));
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

  const removeReward = (id: string) => {
    setRewards(rewards.filter(reward => reward.id !== id));
    toast({
      title: "Recompensa removida",
      description: "A recompensa foi removida com sucesso.",
    });
  };

  const saveChanges = () => {
    const updatedRewards = rewards.map(reward => ({ ...reward, isEditing: false }));
    setRewards(updatedRewards);
    
    // Save to localStorage for ProfilePage to access
    const rewardsForStorage = updatedRewards.map(({ isEditing, ...rest }) => rest);
    localStorage.setItem('adminRewards', JSON.stringify(rewardsForStorage));
    
    toast({
      title: "Alterações salvas",
      description: "As recompensas foram atualizadas com sucesso.",
    });
  };

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
        
        {/* Rewards Section with direct editing */}
        <Card className="mb-8 bg-gray-100 dark:bg-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Recompensas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center font-medium">Recompensa</div>
              <div className="text-center font-medium">Pontuação necessária</div>
              <div className="text-center font-medium">Ações</div>
            </div>
            
            <div className="space-y-4">
              {rewards.map((item) => (
                <div key={item.id} className="grid grid-cols-3 gap-4">
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
                  <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-md">
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
                  <div className="flex items-center justify-center">
                    {item.isEditing && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remover
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover recompensa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover esta recompensa? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeReward(item.id)}>
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 mt-4">
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
                onClick={toggleEditMode}
              >
                <Edit className="h-4 w-4 mr-2" /> Editar
              </Button>
              <Button 
                onClick={saveChanges}
              >
                <Save className="h-4 w-4 mr-2" /> Salvar
              </Button>
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
