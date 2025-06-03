import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useUserTasks } from '@/hooks/useUserTasks';
import { useTasks } from '@/hooks/useTasks';
import authService from '@/services/authService';
import { taskService } from '@/services/taskService';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { ChallengeList } from '@/components/challenges/ChallengeList';
import { CreateChallengeDialog } from '@/components/challenges/CreateChallengeDialog';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ColumnId, CreateTaskRequest, UpdateTaskRequest } from '@/types/Task';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService } from '@/services/teamService';
import { Member } from '@/types/Member';
import { challengeService } from '@/services/challengeService';
import { CreateChallengeRequest } from '@/types/Challenge';

export function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const projectIdNumber = projectId ? parseInt(projectId) : 0;
  const user = authService.getCurrentUser();
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'kanban' | 'challenges'>('kanban');

  const queryClient = useQueryClient();

  const { data: projects, isLoading: isLoadingProject, error: errorProjects } = useProjects(projectIdNumber);
  const { data: userTasks, isLoading: isLoadingUserTasks, error: errorUserTasks } = useUserTasks(user?.memberId || 0);
  const { tasks: projectTasks, isLoading: isLoadingProjectTasks, error: errorProjectTasks, createTask, updateTask, moveTask, deleteTask } = useTasks(projectIdNumber);

  const { data: teams, isLoading: isLoadingTeams, error: errorTeams } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.getAll(),
  });

  console.log('ProjectDetailsPage - User:', user);
  console.log('ProjectDetailsPage - Project ID:', projectIdNumber);
  console.log('ProjectDetailsPage - Raw project data:', projects);
  console.log('ProjectDetailsPage - projectTasks (raw data):', projectTasks);
  console.log('ProjectDetailsPage - userTasks (raw data):', userTasks);
  console.log('ProjectDetailsPage - isLoadingProjectTasks:', isLoadingProjectTasks);
  console.log('ProjectDetailsPage - isLoadingUserTasks:', isLoadingUserTasks);
  console.log('ProjectDetailsPage - Raw teams data:', teams);

  const project = useMemo(() => {
    return projects?.find(p => p.id === projectIdNumber);
  }, [projects, projectIdNumber]);

  const projectTeamId = project?.teamId;
  const projectTeam = useMemo(() => {
    return teams?.find(team => team.id.value === projectTeamId);
  }, [teams, projectTeamId]);

  const isTeamLeader = useMemo(() => {
    return projectTeam?.leaderId?.value === user?.memberId;
  }, [user, projectTeam]);

  const { data: projectMembers = [], isLoading: isLoadingProjectMembers, error: errorProjectMembers } = useQuery({
    queryKey: ['teamMembers', projectTeamId],
    queryFn: () => teamService.getMembersByTeamId(projectTeamId!),
    enabled: !!projectTeamId,
  });

  console.log('ProjectDetailsPage - Project teamId:', projectTeamId);
  console.log('ProjectDetailsPage - Found project team:', projectTeam);
  console.log('ProjectDetailsPage - Is user team leader?', isTeamLeader);
  console.log('ProjectDetailsPage - Loaded projectMembers:', projectMembers);

  const createChallengeMutation = useMutation({
    mutationFn: (data: CreateChallengeRequest) => challengeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges', projectIdNumber] });
      toast.success('Desafio criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar desafio:', error);
      toast.error('Não foi possível criar o desafio.');
    },
  });

  const tasksToDisplay = useMemo(() => {
    console.log('ProjectDetailsPage - Using all project tasks');
    if (!projectTasks) {
      console.log('Project tasks not loaded yet.');
      return [];
    }
    return projectTasks;
  }, [projectTasks]);

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro de Autenticação</AlertTitle>
        <AlertDescription>Você precisa estar logado para ver os detalhes do projeto.</AlertDescription>
      </Alert>
    );
  }

  if (isLoadingProject || isLoadingTeams || isLoadingProjectTasks || isLoadingUserTasks || isLoadingProjectMembers || createChallengeMutation.status === 'pending') {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
        <p>Carregando detalhes do projeto...</p>
      </div>
    );
  }

  if (errorProjects || errorTeams || errorProjectTasks || errorUserTasks || errorProjectMembers || createChallengeMutation.status === 'error') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao Carregar Dados</AlertTitle>
        <AlertDescription>
          Ocorreu um erro ao carregar os dados.
          Detalhes: {errorProjects?.message || errorTeams?.message || errorProjectTasks?.message || errorUserTasks?.message || errorProjectMembers?.message || (createChallengeMutation.error as Error)?.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!project) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Projeto não encontrado</AlertTitle>
        <AlertDescription>O projeto com o ID {projectId} não foi encontrado.</AlertDescription>
      </Alert>
    );
  }

  const completedTasksCount = tasksToDisplay.filter((task) => task.kanbanColumn === 'concluido').length;
  const totalTasksCount = tasksToDisplay.length;
  const progressPercentage = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

  const handleCreateChallenge = async (data: CreateChallengeRequest) => {
    try {
      await createChallengeMutation.mutateAsync(data);
      setActiveTab('challenges');
    } catch (error) {
      console.error('Erro ao criar desafio:', error);
    }
  };

  const handleCreateTask = async (data: CreateTaskRequest) => {
    try {
      await createTask({
        ...data,
        projectId: projectIdNumber,
      });
    } catch (error) {
      console.error('Erro ao criar tarefa na página:', error);
      toast.error('Falha ao criar tarefa.');
    }
  };

  const handleUpdateTask = async (taskId: number, newTitle: string) => {
    try {
      await updateTask({ taskId, newTitle });
    } catch (error) {
      console.error('Erro ao atualizar tarefa na página:', error);
    }
  };

  const handleMoveTask = async ({ taskId, newColumn }: { taskId: number; newColumn: ColumnId }) => {
    try {
      await moveTask({
        taskId,
        newColumn,
      });
    } catch (error) {
      console.error('Erro ao mover tarefa na página:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Erro ao excluir tarefa na página:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/dashboard')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para o Dashboard
      </Button>

      <div className="px-2">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Progresso do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                {completedTasksCount} de {totalTasksCount} tarefas concluídas
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'kanban' | 'challenges')} className="w-full px-2">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="kanban">Quadro Kanban</TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Desafios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="px-0">
              <CardTitle>Quadro Kanban</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <KanbanBoard
                projectId={projectIdNumber}
                tasks={tasksToDisplay}
                projectMembers={projectMembers}
                createTask={handleCreateTask}
                updateTask={handleUpdateTask}
                moveTask={handleMoveTask}
                deleteTask={handleDeleteTask}
                isTeamLeader={isTeamLeader}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between px-0">
              <CardTitle>Desafios do Projeto</CardTitle>
              {isTeamLeader && (
                <Button
                  onClick={() => setIsCreateChallengeOpen(true)}
                  className="bg-sprint-primary hover:bg-sprint-accent"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Novo Desafio
                </Button>
              )}
            </CardHeader>
            <CardContent className="px-0">
              <ChallengeList
                projectId={projectIdNumber}
                onOpenCreateDialog={() => setIsCreateChallengeOpen(true)}
                openCreateDialog={isCreateChallengeOpen}
                onOpenCreateDialogChange={setIsCreateChallengeOpen}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateChallengeDialog
        open={isCreateChallengeOpen}
        onOpenChange={setIsCreateChallengeOpen}
        projectId={projectIdNumber}
        createdBy={user?.memberId || 0}
        onSubmit={handleCreateChallenge}
      />
    </div>
  );
}

export default ProjectDetailsPage;
