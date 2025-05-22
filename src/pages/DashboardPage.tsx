
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { User, Award } from 'lucide-react';
import { ProjectList } from '@/components/projects/ProjectList';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
  };
  
  const rewards = [
    { id: 1, name: 'Recompensa 1' },
    { id: 2, name: 'Recompensa 2' },
    { id: 3, name: 'Recompensa 3' },
  ];

  const handleRedeemReward = (rewardId: number) => {
    toast({
      title: "Resgate solicitado",
      description: `Você solicitou o resgate da recompensa ${rewardId}.`,
    });
  };
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-950 text-white overflow-hidden">
        {/* Sidebar - made narrower and with darker background */}
        <Sidebar variant="inset" side="left" className="w-64 bg-gray-900 border-r border-gray-800">
          <SidebarHeader className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="text-xl font-bold">Menu usuário</div>
          </SidebarHeader>
          <SidebarContent className="p-0">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="w-full px-4 py-3 hover:bg-gray-800 text-gray-300"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-5 w-5" />
                  <span>Perfil</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            
            <div className="mt-6 px-4">
              <ProjectList />
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main content - full width and height with proper spacing */}
        <main className="flex-1 h-full bg-gray-900 overflow-y-auto">
          <div className="max-w-full mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 px-4">
              <h1 className="text-3xl font-bold">SprintQuest</h1>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button variant="outline" onClick={handleLogout} className="border-gray-600 hover:bg-gray-800">
                  Sair
                </Button>
              </div>
            </div>

            {/* Content Grid - better spacing and width for larger screens */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 px-4">
              {/* Rewards Section */}
              <Card className="bg-gray-800 border-gray-700 shadow-lg">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-center text-xl text-white">Recompensas</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <RadioGroup defaultValue="option-1" className="space-y-4">
                    {rewards.map((reward) => (
                      <div key={reward.id} className="bg-gray-700 p-4 rounded-md flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <RadioGroupItem value={`option-${reward.id}`} id={`option-${reward.id}`} className="text-sprint-primary" />
                          <label htmlFor={`option-${reward.id}`} className="text-base font-medium leading-none w-full text-white">
                            {reward.name}
                          </label>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleRedeemReward(reward.id)}
                          className="bg-sprint-primary hover:bg-sprint-accent border-none text-white flex items-center gap-1"
                        >
                          <Award className="h-4 w-4" />
                          Resgatar
                        </Button>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Rankings Section */}
              <Card className="bg-gray-800 border-gray-700 shadow-lg">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-center text-xl text-white">Rankings</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Team Rankings */}
                    <div>
                      <h3 className="text-center mb-4 text-white font-medium">Por equipe</h3>
                      <div className="bg-gray-700 p-4 rounded-md">
                        <div className="space-y-4">
                          {[1, 2, 3].map((rank) => (
                            <div key={rank} className="flex items-center">
                              <span className="mr-3 font-medium">{rank}.</span>
                              <div className="h-0.5 bg-gray-500 flex-grow"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Member Rankings */}
                    <div>
                      <h3 className="text-center mb-4 text-white font-medium">Por membro</h3>
                      <div className="bg-gray-700 p-4 rounded-md">
                        <div className="space-y-4">
                          {[1, 2, 3].map((rank) => (
                            <div key={rank} className="flex items-center">
                              <span className="mr-3 font-medium">{rank}.</span>
                              <div className="h-0.5 bg-gray-500 flex-grow"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardPage;
