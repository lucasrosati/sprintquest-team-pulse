
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';

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
    <div className="min-h-screen bg-sprint-background">
      <header className="bg-sprint-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">SprintQuest</h1>
          <Button variant="outline" onClick={handleLogout} className="text-white border-white">
            Sair
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Bem-vindo ao Dashboard, {user?.firstName}!</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">Esta é uma página de dashboard temporária. O conteúdo completo será implementado em breve.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-sprint-secondary p-6 rounded-lg">
              <h3 className="font-bold mb-2">Seus Projetos</h3>
              <p>Você não tem projetos ativos no momento.</p>
            </div>
            <div className="bg-sprint-secondary p-6 rounded-lg">
              <h3 className="font-bold mb-2">Suas Tarefas</h3>
              <p>Não há tarefas pendentes.</p>
            </div>
            <div className="bg-sprint-secondary p-6 rounded-lg">
              <h3 className="font-bold mb-2">Suas Conquistas</h3>
              <p>Conquiste distintivos completando tarefas!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
