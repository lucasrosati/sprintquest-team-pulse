
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CreateTaskDialog } from './projects/CreateTaskDialog';

type Task = {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  responsible?: string;
  criteria?: string;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'A fazer',
    tasks: [
      { id: 'task-1', title: 'Definir escopo', description: 'Definir o escopo do projeto' },
      { id: 'task-2', title: 'Criar wireframes', description: 'Criar wireframes das principais telas' },
    ],
  },
  {
    id: 'in-progress',
    title: 'Em progresso',
    tasks: [
      { id: 'task-3', title: 'Implementar login', description: 'Implementar tela de login' },
    ],
  },
  {
    id: 'done',
    title: 'Concluído',
    tasks: [
      { id: 'task-4', title: 'Setup do projeto', description: 'Configurar o ambiente inicial' },
    ],
  },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [editingTask, setEditingTask] = useState<{columnId: string, taskId: string} | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedDescription, setEditedDescription] = useState<string>('');
  const { toast } = useToast();
  
  // State for the create task dialog
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | undefined>(undefined);

  const handleAddTask = (columnId: string) => {
    setActiveColumnId(columnId);
    setIsCreateTaskOpen(true);
  };

  const handleCreateTask = (taskData: {
    title: string;
    description: string;
    deadline: string;
    responsible: string;
    criteria: string;
  }) => {
    if (!activeColumnId) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...taskData
    };

    const updatedColumns = columns.map(column => {
      if (column.id === activeColumnId) {
        return {
          ...column,
          tasks: [...column.tasks, newTask]
        };
      }
      return column;
    });

    setColumns(updatedColumns);
    setIsCreateTaskOpen(false);
    
    toast({
      title: "Tarefa adicionada",
      description: "Nova tarefa adicionada ao quadro.",
    });
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    const updatedColumns = columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId)
        };
      }
      return column;
    });

    setColumns(updatedColumns);
    if (editingTask?.taskId === taskId) {
      setEditingTask(null);
    }
    
    toast({
      title: "Tarefa removida",
      description: "A tarefa foi removida do quadro.",
    });
  };

  const handleEditTask = (columnId: string, task: Task) => {
    setEditingTask({ columnId, taskId: task.id });
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

  const handleSaveTask = () => {
    if (!editingTask) return;

    const updatedColumns = columns.map(column => {
      if (column.id === editingTask.columnId) {
        return {
          ...column,
          tasks: column.tasks.map(task => {
            if (task.id === editingTask.taskId) {
              return {
                ...task,
                title: editedTitle,
                description: editedDescription
              };
            }
            return task;
          })
        };
      }
      return column;
    });

    setColumns(updatedColumns);
    setEditingTask(null);
    
    toast({
      title: "Tarefa atualizada",
      description: "As alterações na tarefa foram salvas.",
    });
  };

  const handleMoveTask = (fromColId: string, toColId: string, taskId: string) => {
    // Find the task in the source column
    const sourceColumn = columns.find(col => col.id === fromColId);
    if (!sourceColumn) return;
    
    const taskToMove = sourceColumn.tasks.find(task => task.id === taskId);
    if (!taskToMove) return;
    
    // Remove from source and add to target column
    const updatedColumns = columns.map(column => {
      if (column.id === fromColId) {
        return {
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId)
        };
      }
      if (column.id === toColId) {
        return {
          ...column,
          tasks: [...column.tasks, taskToMove]
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
    
    toast({
      title: "Tarefa movida",
      description: `A tarefa foi movida para ${columns.find(col => col.id === toColId)?.title}.`,
    });
  };

  const handleDragStart = (e: React.DragEvent, columnId: string, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('fromColumnId', columnId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    const taskId = e.dataTransfer.getData('taskId');
    const fromColumnId = e.dataTransfer.getData('fromColumnId');
    
    if (fromColumnId !== columnId) {
      handleMoveTask(fromColumnId, columnId, taskId);
    }
  };

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg">
        {columns.map((column, index) => (
          <React.Fragment key={column.id}>
            {index > 0 && <ResizableHandle withHandle />}
            <ResizablePanel defaultSize={33} minSize={20} className="p-1">
              <div 
                className="bg-gray-800 h-full rounded-md overflow-hidden flex flex-col" 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="bg-gray-750 p-2 border-b border-gray-700">
                  <h3 className="font-medium text-center text-white">
                    {column.title} ({column.tasks.length})
                  </h3>
                </div>
                <div className="p-2 flex-1 overflow-y-auto">
                  {column.tasks.map(task => (
                    <div 
                      key={task.id}
                      className={`mb-2 rounded-md ${
                        editingTask?.taskId === task.id 
                          ? 'bg-gray-700 p-3' 
                          : 'bg-gray-700 p-3 cursor-move hover:bg-gray-650'
                      }`}
                      draggable={editingTask?.taskId !== task.id}
                      onDragStart={(e) => handleDragStart(e, column.id, task.id)}
                    >
                      {editingTask?.taskId === task.id ? (
                        <div className="space-y-2">
                          <Input 
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            placeholder="Título da tarefa"
                            className="bg-gray-800 border-gray-600"
                          />
                          <Textarea 
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            placeholder="Descrição da tarefa"
                            className="bg-gray-800 border-gray-600 min-h-20"
                          />
                          <div className="flex justify-end gap-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingTask(null)}
                            >
                              Cancelar
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={handleSaveTask}
                            >
                              Salvar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-medium mb-1">{task.title}</h4>
                          <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                          {task.deadline && (
                            <p className="text-xs text-gray-500 mb-1">Data limite: {task.deadline}</p>
                          )}
                          {task.responsible && (
                            <p className="text-xs text-gray-500 mb-1">Responsável: {task.responsible}</p>
                          )}
                          {task.criteria && (
                            <p className="text-xs text-gray-500 mb-1">Critérios: {task.criteria}</p>
                          )}
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditTask(column.id, task)}
                            >
                              Editar
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteTask(column.id, task.id)}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-700">
                  <Button 
                    className="w-full bg-gray-700 hover:bg-gray-650" 
                    variant="outline"
                    onClick={() => handleAddTask(column.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar tarefa
                  </Button>
                </div>
              </div>
            </ResizablePanel>
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
      
      <CreateTaskDialog 
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        onCreateTask={handleCreateTask}
        columnId={activeColumnId}
      />
    </>
  );
};

export default KanbanBoard;
