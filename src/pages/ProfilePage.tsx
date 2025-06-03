import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import authService from '@/services/authService';
import { useUserTasks } from '@/hooks/useUserTasks';

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  // Usar o hook para buscar as tarefas do usuário logado
  const { data: tasks, isLoading, error } = useUserTasks(user?.memberId);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Por favor, faça login para ver seu perfil.</p>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto p-4 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4 hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Perfil de {user.name}</h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* User Info Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-xl text-white">Informações do Usuário</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-400">Nome:</p>
                <p className="text-lg font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email:</p>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Função:</p>
                <p className="text-lg font-medium">{user.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Pontuação Individual:</p>
                <p className="text-lg font-medium text-sprint-primary">{user.individualScore || 0} pts</p>
              </div>
               {/* Exibir TeamId se disponível */}
               {user.teamId && (
                 <div>
                   <p className="text-sm text-gray-400">ID do Time:</p>
                   <p className="text-lg font-medium">{user.teamId}</p>
                 </div>
               )}
            </CardContent>
          </Card>
          
          {/* User Tasks Card (Novo)*/}
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-xl text-white">Minhas Tarefas Atribuídas</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {isLoading ? (
                <p className="text-center text-sm">Carregando tarefas...</p>
              ) : error ? (
                <p className="text-center text-red-500">Erro ao carregar tarefas: {error.message}</p>
              ) : tasks && tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="bg-gray-700 p-3 rounded-md">
                      <h4 className="font-medium text-white">{task.title}</h4>
                      {task.description && <p className="text-sm text-gray-400 mt-1">{task.description}</p>}
                      {task.kanbanColumn && <p className="text-xs text-gray-500 mt-1">Status: {task.kanbanColumn}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">Nenhuma tarefa atribuída encontrada.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
