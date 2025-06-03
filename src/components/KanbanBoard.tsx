import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CreateTaskDialog } from './projects/CreateTaskDialog';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/services/taskService';
import { Member } from '@/services/memberService';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { PlusCircle, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogClose } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { columnNames } from '@/types/Task';
import { toast } from 'sonner';
import { mutate } from 'react-query';

type ColumnId = 'backlog' | 'ready' | 'in-progress' | 'review' | 'done';

type Column = {
  id: ColumnId;
  title: string;
};

const columns: Column[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'ready', title: 'Pronto' },
  { id: 'in-progress', title: 'Em Progresso' },
  { id: 'review', title: 'Revisão' },
  { id: 'done', title: 'Concluído' },
];

interface KanbanBoardProps {
  projectId: number;
  projectMembers: Member[];
  tasks: Task[];
  createTask: (taskData: Omit<Task, 'id' | 'projectId'>) => Promise<any>;
  updateTask: (taskData: Task) => Promise<any>;
  moveTask: (taskId: number, newColumn: ColumnId) => Promise<any>;
  deleteTask: (taskId: number) => Promise<any>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, projectMembers, tasks, createTask, updateTask, moveTask, deleteTask }) => {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState<
    number | undefined
  >(undefined);
  const [newTaskPoints, setNewTaskPoints] = useState<number | undefined>(
    undefined
  );
  const [activeColumnId, setActiveColumnId] = useState<ColumnId | null>(null);

  const tasksByColumn = useMemo(() => {
    console.log('KanbanBoard - Grouping tasks by column. Total tasks received:', tasks.length);
    const columns: Record<ColumnId, Task[]> = {
      backlog: [],
      pronto: [],
      'em progresso': [],
      revisao: [],
      concluido: [],
    };

    tasks.forEach((task) => {
      const columnKey = task.kanbanColumn.toLowerCase() as ColumnId;
      if (columns[columnKey]) {
        columns[columnKey].push(task);
      } else {
        console.warn('KanbanBoard - Task with unknown column:', task.kanbanColumn, task);
      }
    });
    console.log('KanbanBoard - Tasks grouped by column:', columns);
    return columns;
  }, [tasks]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceColumnId = result.source.droppableId as ColumnId;
    const destinationColumnId = result.destination.droppableId as ColumnId;
    const movedTask = tasksByColumn[sourceColumnId].find(
      (task) => task.id.toString() === result.draggableId
    );

    if (movedTask && sourceColumnId !== destinationColumnId) {
      console.log(
        `Moving task ${movedTask.id} from ${sourceColumnId} to ${destinationColumnId}`
      );
      try {
        await moveTask(movedTask.id, destinationColumnId);
        toast.success('Tarefa movida com sucesso!');
      } catch (error) {
        console.error('Erro ao mover a tarefa:', error);
        toast.error('Erro ao mover a tarefa.');
      }
    }
  };

  const handleAddTaskClick = (columnId: ColumnId) => {
    setActiveColumnId(columnId);
    setIsCreateTaskOpen(true);
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    assignedMemberId: number | undefined;
    points: number | undefined;
  }) => {
    if (!activeColumnId) {
      toast.error('Coluna ativa não definida.');
      return;
    }
    console.log('KanbanBoard - handleCreateTask - taskData:', taskData);
    try {
      await createTask({
        projectId: projectId,
        kanbanColumn: activeColumnId,
        title: taskData.title,
        description: taskData.description,
        assignedMemberId: taskData.assignedMemberId,
        points: taskData.points,
      });
      toast.success('Tarefa criada com sucesso!');
      setIsCreateTaskOpen(false);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskAssignee(undefined);
      setNewTaskPoints(undefined);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa.');
    }
  };

  const handleEditTaskClick = (task: Task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description);
    setNewTaskAssignee(task.assignees ? task.assignees[0]?.memberId : undefined);
    setNewTaskPoints(task.points);
  };

  const handleSaveTask = async () => {
    if (!editingTask) return;

    const updatedTaskData: Task = {
      ...editingTask,
      title: newTaskTitle,
      description: newTaskDescription,
      assignees: newTaskAssignee !== undefined ? [{ memberId: newTaskAssignee }] : [],
      points: newTaskPoints,
    };
    console.log('KanbanBoard - handleSaveTask - updatedTaskData:', updatedTaskData);

    try {
      await updateTask(updatedTaskData);
      toast.success('Tarefa atualizada com sucesso!');
      setEditingTask(null);
    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error);
      toast.error('Erro ao atualizar a tarefa.');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    console.log('KanbanBoard - handleDeleteTask - taskId:', taskId);
    try {
      await deleteTask(taskId);
      toast.success('Tarefa excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir a tarefa:', error);
      toast.error('Erro ao excluir a tarefa.');
    }
  };

  const getAssigneeName = (assigneeId: number) => {
    const member = projectMembers.find((m) => m.memberId === assigneeId);
    return member ? member.name : 'Não atribuído';
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 overflow-x-auto h-full pb-4">
        {Object.entries(tasksByColumn).map(([columnId, tasks]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-64 flex-shrink-0 bg-gray-800 rounded-lg shadow-md flex flex-col overflow-hidden"
              >
                <CardHeader className="bg-gray-700 text-white py-3 px-4 border-b border-gray-600">
                  <CardTitle className="text-sm font-semibold uppercase">
                    {columnNames[columnId as ColumnId]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-2 space-y-2">
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-700 text-white p-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-600 transition-colors"
                          onClick={() => handleEditTaskClick(task)}
                        >
                          <h4 className="text-sm font-medium mb-1">{task.title}</h4>
                          <p className="text-xs text-gray-400 mb-2 overflow-hidden text-ellipsis line-clamp-2">{task.description}</p>
                          {task.assignees && task.assignees.length > 0 && (
                            <p className="text-xs text-gray-300">Responsável: {getAssigneeName(task.assignees[0].memberId)}</p>
                          )}
                          {task.points !== undefined && (
                             <p className="text-xs text-gray-300">Pontos: {task.points}</p>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </CardContent>
                <Button
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-700 justify-start rounded-t-none"
                  onClick={() => handleAddTaskClick(columnId as ColumnId)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Tarefa
                </Button>
              </div>
            )}
          </Droppable>
        ))}
      </div>

      {isCreateTaskOpen && (
        <CreateTaskDialog
          open={isCreateTaskOpen}
          onOpenChange={setIsCreateTaskOpen}
          onCreateTask={handleCreateTask}
          projectMembers={projectMembers}
        />
      )}

      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={setEditingTask}>
          <DialogContent className="bg-gray-850 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Editar Tarefa</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                label="Título"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="col-span-4 bg-gray-700 text-white border-gray-600"
              />
              <Textarea
                label="Descrição"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="col-span-4 bg-gray-700 text-white border-gray-600"
              />
              <Select
                value={newTaskAssignee?.toString() || ''}
                onValueChange={(value) => setNewTaskAssignee(Number(value))}
              >
                <SelectTrigger className="col-span-4 bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Atribuir a..." />
                </SelectTrigger>
                <SelectContent>
                  {projectMembers.map((member) => (
                    <SelectItem key={member.memberId} value={member.memberId.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <Input
                label="Pontos"
                type="number"
                value={newTaskPoints !== undefined ? newTaskPoints : ''}
                onChange={(e) => setNewTaskPoints(e.target.value === '' ? undefined : Number(e.target.value))}
                className="col-span-4 bg-gray-700 text-white border-gray-600"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={() => handleDeleteTask(editingTask.id)}>
                 <Trash2 className="h-4 w-4 mr-2" /> Excluir
              </Button>
              <Button onClick={handleSaveTask} className="bg-sprint-primary hover:bg-sprint-accent">
                <Edit className="h-4 w-4 mr-2" /> Salvar Alterações
              </Button>
            </div>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus-ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </DragDropContext>
  );
};

export default KanbanBoard;
