
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
  SidebarHeader,
} from "@/components/ui/sidebar";
import { User, Plus, Menu } from 'lucide-react';

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
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar variant="inset" side="left">
          <SidebarHeader className="flex items-center justify-between">
            <div className="text-lg font-semibold">Menu usuário</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <User />
                  <span>Perfil</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Menu />
                  <span>Menu</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            
            <div className="mt-4 px-2">
              <h3 className="mb-2 text-sm font-semibold text-foreground">Projetos</h3>
              <div className="space-y-2">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white dark:bg-gray-800 p-2 rounded-md text-center">
                    {project.name}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Novo projeto
                </Button>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main content */}
        <main className="flex-1 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">SprintQuest</h1>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Rewards Section */}
            <Card className="bg-gray-100 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-center">Recompensas</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="option-1" className="space-y-3">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="bg-white dark:bg-gray-700 p-3 rounded-md flex items-center space-x-2">
                      <RadioGroupItem value={`option-${reward.id}`} id={`option-${reward.id}`} />
                      <label htmlFor={`option-${reward.id}`} className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {reward.name}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Rankings Section */}
            <Card className="bg-gray-100 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-center">Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Team Rankings */}
                  <div>
                    <h3 className="text-center mb-2">Por equipe</h3>
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-md">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="mr-2">1.</span>
                          <div className="h-0.5 bg-gray-300 dark:bg-gray-600 flex-grow"></div>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">2.</span>
                          <div className="h-0.5 bg-gray-300 dark:bg-gray-600 flex-grow"></div>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">3.</span>
                          <div className="h-0.5 bg-gray-300 dark:bg-gray-600 flex-grow"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Member Rankings */}
                  <div>
                    <h3 className="text-center mb-2">Por membro</h3>
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-md">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="mr-2">1.</span>
                          <div className="h-0.5 bg-gray-300 dark:bg-gray-600 flex-grow"></div>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">2.</span>
                          <div className="h-0.5 bg-gray-300 dark:bg-gray-600 flex-grow"></div>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">3.</span>
                          <div className="h-0.5 bg-gray-300 dark:bg-gray-600 flex-grow"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardPage;
