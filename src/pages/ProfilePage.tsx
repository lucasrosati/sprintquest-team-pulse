import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import authService from '@/services/authService';
import { useUserTasks } from '@/hooks/useUserTasks';
import UnlockedRewardsList from '@/components/rewards/UnlockedRewardsList';
import AvailableRewardsList from '@/components/rewards/AvailableRewardsList';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { FeedbackList } from '@/components/feedback/FeedbackList';

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [userPoints, setUserPoints] = useState(user?.individualScore || 0);

  // Usar o hook para buscar as tarefas do usuário logado
  const { data: tasks, isLoading, error } = useUserTasks(user?.memberId);

  const handlePointsUpdate = (newPoints: number) => {
    setUserPoints(newPoints);
    // Atualiza também o usuário no localStorage
    if (user) {
      const updatedUser = { ...user, individualScore: newPoints };
      authService.setCurrentUser(updatedUser);
    }
  };

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
                <p className="text-lg font-medium text-sprint-primary">{userPoints} pts</p>
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
          
          {/* User Tasks Card */}
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
                <>
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="bg-gray-700 p-3 rounded-md">
                        <h4 className="font-medium text-white">{task.title}</h4>
                        {task.description && <p className="text-sm text-gray-400 mt-1">{task.description}</p>}
                        {task.kanbanColumn && <p className="text-xs text-gray-500 mt-1">Status: {task.kanbanColumn}</p>}
                      </div>
                    ))}
                  </div>
                  
                  {/* Seção de Progresso */}
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-sprint-primary" />
                        Meu Progresso
                      </h3>
                      <Badge variant="secondary" className="text-sm">
                        {tasks.filter(task => task.kanbanColumn === 'Concluído').length} de {tasks.length} concluídas
                      </Badge>
                    </div>
                    <Progress 
                      value={(tasks.filter(task => task.kanbanColumn === 'Concluído').length / tasks.length) * 100} 
                      className="h-2 bg-gray-700"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      {tasks.filter(task => task.kanbanColumn === 'Concluído').length === tasks.length 
                        ? 'Parabéns! Você concluiu todas as suas tarefas!' 
                        : 'Trabalhe mais para concluir as tasks!'}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-400">Nenhuma tarefa atribuída encontrada.</p>
              )}
            </CardContent>
          </Card>

          {/* Available Rewards Card */}
          <AvailableRewardsList 
            userId={user.memberId} 
            userPoints={userPoints}
            onPointsUpdate={handlePointsUpdate}
          />

          {/* Unlocked Rewards Card */}
          <UnlockedRewardsList userId={user.memberId} />

          {/* Feedbacks Card */}
          <FeedbackList memberId={user.memberId} />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
