
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
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: {
    title: string;
    description: string;
    deadline: string;
    responsible: string;
    criteria: string;
  }) => void;
  columnId?: string;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onCreateTask,
  columnId,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [responsible, setResponsible] = useState("");
  const [criteria, setCriteria] = useState("");
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

    onCreateTask({
      title,
      description,
      deadline,
      responsible,
      criteria
    });

    // Reset form
    setTitle("");
    setDescription("");
    setDeadline("");
    setResponsible("");
    setCriteria("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-300 text-gray-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Nova task</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
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
          
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2">
            <span className="text-gray-800">Responsável</span>
            <Button
              type="button"
              variant="ghost"
              className="text-gray-500"
              onClick={() => {
                // This would typically open a user selection dialog
                // For now it just sets a placeholder value
                setResponsible("Usuário Selecionado");
                toast({
                  title: "Seleção de usuário",
                  description: "Função de seleção de usuário será implementada posteriormente."
                });
              }}
            >
              Selecionar
            </Button>
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
