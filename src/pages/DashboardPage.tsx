
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { User, Plus, Menu, BarChart } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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

  const projects = [
    { id: 'a', name: 'Projeto A' },
    { id: 'b', name: 'Projeto B' },
    { id: 'c', name: 'Projeto C' },
  ];
  
  const rewards = [
    { id: 1, name: 'Recompensa 1' },
    { id: 2, name: 'Recompensa 2' },
    { id: 3, name: 'Recompensa 3' },
  ];
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-950 text-white">
        {/* Sidebar */}
        <Sidebar variant="inset" side="left">
          <SidebarHeader className="flex items-center justify-between p-4">
            <div className="text-xl font-bold">Menu usuário</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <User className="h-5 w-5" />
                  <span>Perfil</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Menu className="h-5 w-5" />
                  <span>Menu</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            
            <div className="mt-6 px-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-300">Projetos</h3>
              <div className="space-y-2">
                {projects.map((project) => (
                  <div key={project.id} className="bg-gray-800 p-3 rounded-md text-center hover:bg-gray-700 cursor-pointer transition-colors">
                    {project.name}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full flex items-center gap-1 mt-2">
                  <Plus className="h-4 w-4" /> Novo projeto
                </Button>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main content */}
        <main className="flex-1 p-8 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">SprintQuest</h1>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button variant="outline" onClick={handleLogout} className="border-gray-600">
                  Sair
                </Button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Rewards Section */}
              <Card className="bg-gray-800 border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center text-xl text-white">Recompensas</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="option-1" className="space-y-3">
                    {rewards.map((reward) => (
                      <div key={reward.id} className="bg-gray-700 p-4 rounded-md flex items-center space-x-4">
                        <RadioGroupItem value={`option-${reward.id}`} id={`option-${reward.id}`} className="text-primary" />
                        <label htmlFor={`option-${reward.id}`} className="text-base font-medium leading-none w-full text-white">
                          {reward.name}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Rankings Section */}
              <Card className="bg-gray-800 border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center text-xl text-white">Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Team Rankings */}
                    <div>
                      <h3 className="text-center mb-4 text-white font-medium">Por equipe</h3>
                      <div className="bg-gray-700 p-4 rounded-md">
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <span className="mr-3 font-medium">1.</span>
                            <div className="h-0.5 bg-gray-500 flex-grow"></div>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-3 font-medium">2.</span>
                            <div className="h-0.5 bg-gray-500 flex-grow"></div>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-3 font-medium">3.</span>
                            <div className="h-0.5 bg-gray-500 flex-grow"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Member Rankings */}
                    <div>
                      <h3 className="text-center mb-4 text-white font-medium">Por membro</h3>
                      <div className="bg-gray-700 p-4 rounded-md">
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <span className="mr-3 font-medium">1.</span>
                            <div className="h-0.5 bg-gray-500 flex-grow"></div>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-3 font-medium">2.</span>
                            <div className="h-0.5 bg-gray-500 flex-grow"></div>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-3 font-medium">3.</span>
                            <div className="h-0.5 bg-gray-500 flex-grow"></div>
                          </div>
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
