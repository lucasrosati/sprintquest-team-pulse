import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Member } from '@/types/Member';
import { ColumnId, CreateTaskRequest } from '@/types/Task';
import { toast } from 'sonner';
import { taskService } from '@/services/taskService';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTaskRequest) => Promise<void>;
  projectMembers: Member[];
  projectId: string;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onSubmit,
  projectMembers,
  projectId,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const [assignedMemberId, setAssignedMemberId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('O título da tarefa é obrigatório');
      return;
    }

    if (!assignedMemberId) {
      toast.error('É necessário selecionar um responsável para a tarefa');
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        points: points ? parseInt(points) : 0,
        kanbanColumn: 'backlog' as ColumnId,
        projectId: projectId,
      };

      console.log('Criando task com dados:', taskData);
      const createdTask = await onSubmit(taskData);

      if (createdTask?.id) {
        console.log('Atribuindo membro à task:', assignedMemberId);
        await taskService.assignTask(createdTask.id, parseInt(assignedMemberId));
      }
      
      setTitle('');
      setDescription('');
      setPoints('');
      setAssignedMemberId('');
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
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
            <Label htmlFor="assignedMember">Responsável <span className="text-destructive">*</span></Label>
            <Select value={assignedMemberId} onValueChange={setAssignedMemberId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                {projectMembers.map((member) => (
                  <SelectItem key={member.memberId} value={member.memberId.toString()}>
                    {member.name}
                  </SelectItem>
                ))}
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
              {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}