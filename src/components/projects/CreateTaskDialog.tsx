import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Member } from '@/types/Member';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: {
    title: string;
    description: string;
    deadline: string;
    assignedMemberId?: number;
    criteria: string;
    points: number;
  }) => void;
  columnId?: string;
  projectMembers: Member[];
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onCreateTask,
  columnId,
  projectMembers,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedMemberId, setAssignedMemberId] = useState<string>('');
  const [criteria, setCriteria] = useState("");
  const [points, setPoints] = useState<number>(0);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O título da tarefa é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    if (points <= 0) {
      toast({
        title: "Campo obrigatório",
        description: "A pontuação da tarefa deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    onCreateTask({
      title,
      description,
      deadline,
      assignedMemberId: assignedMemberId ? Number(assignedMemberId) : undefined,
      criteria,
      points,
    });

    setTitle("");
    setDescription("");
    setDeadline("");
    setAssignedMemberId('');
    setCriteria("");
    setPoints(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-300 text-gray-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Nova task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Tarefa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white border-gray-300 text-gray-800"
            />
          </div>
          
          <div>
            <Input
              type="date"
              placeholder={`Data limite: ${format(new Date(), "dd/MM/yyyy", { locale: ptBR })}`}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-white border-gray-300 text-gray-800"
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white border-gray-300 text-gray-800 min-h-[100px]"
            />
          </div>
          
          <div>
            <label htmlFor="responsible" className="block text-sm font-medium text-gray-800">Responsável</label>
            <select
              id="responsible"
              value={assignedMemberId}
              onChange={(e) => setAssignedMemberId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sprint-primary focus:ring focus:ring-sprint-primary focus:ring-opacity-50 bg-white text-gray-800"
            >
              <option value="">Selecionar Responsável</option>
              {projectMembers.map(member => (
                <option key={member.memberId} value={member.memberId}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="points" className="block text-sm font-medium text-gray-800">Pontos</label>
            <Input
              id="points"
              type="number"
              placeholder="Pontos da Tarefa"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="mt-1 bg-white border-gray-300 text-gray-800"
              min="0"
            />
          </div>

          <div>
            <Input
              placeholder="Critérios específicos"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              className="bg-white border-gray-300 text-gray-800"
            />
          </div>
          
          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 px-8"
            >
              Criar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
