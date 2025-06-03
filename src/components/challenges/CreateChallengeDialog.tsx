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
import { X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { challengeService } from "@/services/challengeService";
import { CreateChallengeRequest } from "@/types/Challenge";

interface CreateChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  createdBy: number;
  onSubmit: (data: CreateChallengeRequest) => Promise<void>;
}

export function CreateChallengeDialog({
  open,
  onOpenChange,
  projectId,
  createdBy,
  onSubmit,
}: CreateChallengeDialogProps) {
  const [title, setTitle] = useState("");
  const [criteria, setCriteria] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [extraPoints, setExtraPoints] = useState("10");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O título do desafio é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!criteria.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O critério do desafio é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      const challengeData: CreateChallengeRequest = {
        title,
        criteria,
        deadline,
        description,
        extraPoints: Number(extraPoints),
        projectId,
        createdBy,
      };

      await onSubmit(challengeData);
      
      setTitle("");
      setCriteria("");
      setDeadline("");
      setDescription("");
      setExtraPoints("10");
      onOpenChange(false);
    } catch (error) {
      console.error("Erro no handleSubmit do dialog:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Novo Desafio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Nome do desafio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Input
              placeholder={`Data limite: ${format(new Date(), "dd/MM/yyyy", { locale: ptBR })}`}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              type="date"
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Descrição do desafio"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
            />
          </div>
          
          <div>
            <Input
              placeholder="Critérios específicos"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Input
              type="number"
              placeholder="Pontos extras"
              value={extraPoints}
              onChange={(e) => setExtraPoints(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              min="1"
              max="100"
            />
          </div>
          
          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              className="bg-sprint-primary hover:bg-sprint-accent text-white px-8"
            >
              Criar Desafio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 