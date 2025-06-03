import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Member } from '@/types/Member';
import { Task, UpdateTaskRequest, ColumnId } from '@/types/Task';

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  onSubmit: (data: UpdateTaskRequest) => Promise<void>;
  projectMembers: Member[];
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
  projectMembers,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [points, setPoints] = useState(task.points?.toString() || '');
  const [assignedMemberId, setAssignedMemberId] = useState<string>(
    task.assignees?.[0]?.id.toString() || ''
  );
  const [kanbanColumn, setKanbanColumn] = useState<ColumnId>(task.kanbanColumn.toLowerCase() as ColumnId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setPoints(task.points?.toString() || '');
    setAssignedMemberId(task.assignees?.[0]?.id.toString() || '');
    setKanbanColumn(task.kanbanColumn.toLowerCase() as ColumnId);
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        points: points ? parseInt(points) : undefined,
        assignedMemberId: assignedMemberId ? parseInt(assignedMemberId) : undefined,
        kanbanColumn,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição da tarefa"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Pontos</Label>
            <Input
              id="points"
              type="number"
              min="0"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Digite os pontos da tarefa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedMember">Responsável</Label>
            <Select value={assignedMemberId} onValueChange={setAssignedMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                {projectMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kanbanColumn">Coluna</Label>
            <Select value={kanbanColumn} onValueChange={(value) => setKanbanColumn(value as ColumnId)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="ready">Pronto</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="review">Revisão</SelectItem>
                <SelectItem value="done">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 