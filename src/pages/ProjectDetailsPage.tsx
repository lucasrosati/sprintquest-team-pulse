import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useMembers } from '@/hooks/useMembers';
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

export function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const projectIdNumber = projectId ? parseInt(projectId) : 0;
  const user = authService.getCurrentUser();
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);

  console.log('ProjectDetailsPage - User:', user);
  console.log('ProjectDetailsPage - Project ID:', projectIdNumber);

  const { data: projects, isLoading: isLoadingProject, error: errorProjects } = useProjects(projectIdNumber);
  const { data: members, isLoading: isLoadingMembers, error: errorMembers } = useMembers();
  const { data: userTasks, isLoading: isLoadingUserTasks, error: errorUserTasks } = useUserTasks(user?.memberId || 0);
  const { tasks: projectTasks, isLoading: isLoadingProjectTasks, error: errorProjectTasks, createTask, updateTask, moveTask, deleteTask } = useTasks(projectIdNumber);

  console.log('ProjectDetailsPage - projectTasks (raw data):', projectTasks);
  console.log('ProjectDetailsPage - userTasks (raw data):', userTasks);
  console.log('ProjectDetailsPage - isLoadingProjectTasks:', isLoadingProjectTasks);
  console.log('ProjectDetailsPage - isLoadingUserTasks:', isLoadingUserTasks);

  const project = projects?.[0];
  const projectMembers = useMemo(() => {
    return members?.filter(
      (member) => member.teamId === project?.teamId
    ) || [];
  }, [members, project]);

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

  if (isLoadingProject || isLoadingMembers || isLoadingProjectTasks || isLoadingUserTasks) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
        <p>Carregando detalhes do projeto...</p>
      </div>
    );
  }

  if (errorProjects || errorMembers || errorProjectTasks || errorUserTasks) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao Carregar Dados</AlertTitle>
        <AlertDescription>
          Ocorreu um erro ao carregar os dados.
          Detalhes: {errorProjects?.message || errorMembers?.message || errorProjectTasks?.message || errorUserTasks?.message}
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

  const handleCreateTask = async (data: CreateTaskRequest) => {
    try {
      await createTask.mutateAsync({
        ...data,
        projectId: projectIdNumber,
      });
    } catch (error) {
      console.error('Erro ao criar tarefa na página:', error);
    }
  };

  const handleUpdateTask = async ({ taskId, data }: { taskId: number; data: UpdateTaskRequest }) => {
    try {
      await updateTask.mutateAsync({
        taskId,
        data,
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa na página:', error);
    }
  };

  const handleMoveTask = async ({ taskId, newColumn }: { taskId: number; newColumn: ColumnId }) => {
    try {
      await moveTask.mutateAsync({
        taskId,
        newColumn,
      });
    } catch (error) {
      console.error('Erro ao mover tarefa na página:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask.mutateAsync(taskId);
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

      <Tabs defaultValue="kanban" className="w-full px-2">
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
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between px-0">
              <CardTitle>Desafios do Projeto</CardTitle>
              <Button
                onClick={() => setIsCreateChallengeOpen(true)}
                className="bg-sprint-primary hover:bg-sprint-accent"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Novo Desafio
              </Button>
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
      />
    </div>
  );
}

export default ProjectDetailsPage;
