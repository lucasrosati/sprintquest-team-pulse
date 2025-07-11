import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task, ColumnId, columnNames, CreateTaskRequest } from '@/types/Task';
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
  updateTask: (taskId: number, newTitle: string) => Promise<void>;
  moveTask: (data: { taskId: number; newColumn: ColumnId }) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
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

  const handleDragEnd = async (result: DropResult) => {
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

  const handleCreateTask = async (data: CreateTaskRequest) => {
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
            <div key={columnId} className="flex flex-col space-y-2 p-2 rounded-lg bg-gray-800">
              <div className="flex items-center justify-between h-8 px-2">
                <h3 className="font-semibold flex-1 text-white">{columnNames[columnId as ColumnId]}</h3>
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
                    className="flex-1 space-y-2 min-h-[200px] rounded-lg p-2 transition-colors duration-200"
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
                              className={`bg-gray-700 text-white rounded-md shadow-sm transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] ${
                                task.assignedMemberId === currentUser?.memberId ? 'border-sprint-primary border-2' : 'border-gray-600 border'
                              }`}
                              style={{
                                ...provided.draggableProps.style,
                                transition: 'transform 0.2s ease-in-out',
                                opacity: (isTaskOwner || isTeamLeader) ? 1 : 0.6
                              }}
                            >
                              <CardHeader className="p-3">
                                <div className="flex items-start justify-between">
                                  <CardTitle className="text-sm font-medium text-white">
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
                                <div className="text-sm text-gray-400 space-y-1">
                                  {task.description && <p>{task.description}</p>}
                                  {task.assignedMemberId && (
                                    <p className="text-xs">Responsável: {projectMembers.find(member => member.memberId === task.assignedMemberId)?.name || 'Não atribuído'}</p>
                                  )}
                                </div>
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
            </div>
          ))}
        </div>
      </DragDropContext>

      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateTask}
        projectMembers={projectMembers}
        projectId={projectId.toString()}
      />

      {editingTask && (
        <EditTaskDialog
          open={!!editingTask}
          onOpenChange={(open) => {
            if (!open) setEditingTask(null);
          }}
          task={editingTask}
          onSubmit={async (taskId, newTitle) => {
            await updateTask(taskId, newTitle);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
} 