
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
  };
  
  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  return (
    <div className="min-h-screen bg-sprint-background dark:bg-sprint-dark-background">
      <header className="bg-sprint-primary text-white p-4 shadow-md dark:bg-sprint-dark-primary">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">SprintQuest</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout} className="text-white border-white">
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Bem-vindo ao Dashboard, {user?.firstName}!</h2>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <p className="mb-4 dark:text-gray-200">Esta é uma página de dashboard temporária. O conteúdo completo será implementado em breve.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-sprint-secondary dark:bg-sprint-dark-secondary p-6 rounded-lg">
              <h3 className="font-bold mb-2 dark:text-white">Seus Projetos</h3>
              <p className="dark:text-gray-300">Você não tem projetos ativos no momento.</p>
            </div>
            <div className="bg-sprint-secondary dark:bg-sprint-dark-secondary p-6 rounded-lg">
              <h3 className="font-bold mb-2 dark:text-white">Suas Tarefas</h3>
              <p className="dark:text-gray-300">Não há tarefas pendentes.</p>
            </div>
            <div className="bg-sprint-secondary dark:bg-sprint-dark-secondary p-6 rounded-lg">
              <h3 className="font-bold mb-2 dark:text-white">Suas Conquistas</h3>
              <p className="dark:text-gray-300">Conquiste distintivos completando tarefas!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
