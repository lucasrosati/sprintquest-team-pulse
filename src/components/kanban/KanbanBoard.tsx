import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Task, ColumnId, columnNames } from '@/types/Task';
import { Member } from '@/types/Member';
import { CreateTaskDialog } from './CreateTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MoreVertical, Trash2, Edit2, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import authService from '@/services/authService';

interface KanbanBoardProps {
  projectId: number;
  tasks: Task[];
  projectMembers: Member[];
  createTask: (data: CreateTaskRequest) => Promise<void>;
  updateTask: (taskId: number, newTitle: string) => Promise<any>;
  moveTask: (data: any) => Promise<any>;
  deleteTask: (taskId: number) => Promise<any>;
  isTeamLeader: boolean;
}

export function KanbanBoard({
  projectId,
  tasks,
  projectMembers,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
  isTeamLeader,
}: KanbanBoardProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<ColumnId>('backlog');
  const currentUser = authService.getCurrentUser();

  console.log('KanbanBoard - tasks prop:', tasks);

  const columns: Record<ColumnId, Task[]> = useMemo(() => {
    const cols: Record<ColumnId, Task[]> = {
      backlog: [],
      'em progresso': [],
      pronto: [],
      revisao: [],
      concluido: [],
    };

    tasks?.forEach(task => {
      if (task.kanbanColumn && cols[task.kanbanColumn]) {
        console.log(`Task ID: ${task.id}, kanbanColumn: ${task.kanbanColumn}`);
        console.log(`Task ID: ${task.id}, matched columnId: ${task.kanbanColumn}`);
        cols[task.kanbanColumn].push(task);
      } else {
        console.warn(`Task ID: ${task.id} has an invalid or unmapped kanbanColumn: ${task.kanbanColumn}. Not adding to any column.`);
      }
    });

    const orderedColumns: Record<ColumnId, Task[]> = {
      backlog: cols.backlog,
      pronto: cols.pronto,
      'em progresso': cols['em progresso'],
      revisao: cols.revisao,
      concluido: cols.concluido,
    };

    return orderedColumns;
  }, [tasks]);

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    console.log('--- Drag End Event ---');
    console.log('Resultado do Drag:', result);
    console.log('Source (origem):', source);
    console.log('Destination (destino):', destination);
    console.log('Draggable ID:', draggableId);

    if (!destination) {
      console.log('Arrasto cancelado (sem destino).');
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
       console.log('Soltou na mesma posição, sem mudança.');
      return;
    }

    const task = tasks.find(t => t.id.toString() === draggableId);
    if (!task) {
      console.error('Task não encontrada com draggableId:', draggableId);
      return;
    }

    console.log('Task sendo movida:', task);
    console.log('Usuário atual:', currentUser);
    console.log('Task assignedMemberId:', task.assignedMemberId);
    console.log('Current user memberId:', currentUser?.memberId);
    console.log('Usuário é líder da equipe?', isTeamLeader);

    const canMoveTask = task.assignedMemberId === currentUser?.memberId || isTeamLeader;
    console.log('Pode mover a task?', canMoveTask);

    if (!canMoveTask) {
      console.warn('Tentativa de mover task sem permissão.');
      toast.error('Você só pode mover suas próprias tarefas ou ser o líder da equipe para mover outras.');
      return;
    }

    console.log('Movendo task para:', destination.droppableId);

    try {
      console.log(`Chamando moveTask com taskId: ${parseInt(draggableId)}, newColumn: ${destination.droppableId}, memberId: ${currentUser?.memberId}`);
      await moveTask({
        taskId: parseInt(draggableId),
        newColumn: destination.droppableId as ColumnId,
      });
      console.log('moveTask chamado com sucesso.');
    } catch (error) {
      console.error('Erro ao chamar moveTask:', error);
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      await createTask({
        ...data,
        projectId,
      });
      setIsCreateDialogOpen(false);

    } catch (error) {
      console.error('Erro ao criar tarefa no KanbanBoard:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Erro ao excluir tarefa no KanbanBoard:', error);
    }
  };

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(columns).map(([columnId, columnTasks]) => (
            <div key={columnId} className="flex flex-col space-y-2">
              <div className="flex items-center justify-between h-8">
                <h3 className="font-semibold flex-1">{columnNames[columnId as ColumnId]}</h3>
                {columnId === 'backlog' && isTeamLeader && (
                  <div className="w-8 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveColumnId(columnId as ColumnId);
                        setIsCreateDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 space-y-2 min-h-[200px] bg-muted/50 rounded-lg p-2 transition-colors duration-200"
                  >
                    {columnTasks.map((task, index) => {
                      console.log('Renderizando task:', task);
                      console.log('Task assignedMemberId:', task.assignedMemberId);
                      console.log('Current user memberId:', currentUser?.memberId);
                      const isTaskOwner = task.assignedMemberId === currentUser?.memberId;
                      console.log('É dono da task?', isTaskOwner);

                      const isDragDisabled = !(isTaskOwner || isTeamLeader);
                      console.log('Arrasto desabilitado?', isDragDisabled);

                      return (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                          isDragDisabled={isDragDisabled}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-card transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] ${
                                task.assignedMemberId === currentUser?.memberId ? 'border-primary' : 'border-muted'
                              }`}
                              style={{
                                ...provided.draggableProps.style,
                                transition: 'transform 0.2s ease-in-out',
                                opacity: (isTaskOwner || isTeamLeader) ? 1 : 0.6
                              }}
                            >
                              <CardHeader className="p-3">
                                <div className="flex items-start justify-between">
                                  <CardTitle className="text-sm font-medium">
                                    {task.title}
                                  </CardTitle>
                                  {(isTaskOwner || isTeamLeader) && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                        >
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={() => setEditingTask(task)}
                                        >
                                          <Edit2 className="mr-2 h-4 w-4" />
                                          Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleDeleteTask(task.id)}
                                          className="text-red-600 focus:text-red-600"
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Excluir
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent className="p-3 pt-0">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {task.description}
                                </p>
                                {typeof task.points === 'number' && (
                                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                                    <span className="font-medium">
                                      {task.points} pontos
                                    </span>
                                  </div>
                                )}
                                {task.assignedMemberId && (
                                  <div className="mt-2 text-xs text-muted-foreground">
                                    Responsável: {projectMembers.find(m => m.memberId === task.assignedMemberId)?.name}
                                    {isTaskOwner && ' (Você)'}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {columnId === 'backlog' && isTeamLeader && (
                <Button
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-700 justify-start rounded-t-none"
                  onClick={() => handleAddTaskClick(columnId as ColumnId)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Tarefa
                </Button>
              )}
            </div>
          ))}
        </div>
      </DragDropContext>

      {isCreateDialogOpen && (
        <CreateTaskDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateTask}
          projectMembers={projectMembers}
          projectId={projectId.toString()}
        />
      )}

      {editingTask && (
        <EditTaskDialog
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          task={editingTask}
          projectMembers={projectMembers}
          onSubmit={updateTask}
        />
      )}
    </div>
  );
} 