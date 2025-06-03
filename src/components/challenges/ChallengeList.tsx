import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { challengeService } from "@/services/challengeService";
import { Challenge } from "@/types/Challenge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChallengeListProps {
  projectId: number;
  onOpenCreateDialog: () => void;
  openCreateDialog: boolean;
  onOpenCreateDialogChange: (open: boolean) => void;
}

export function ChallengeList({
  projectId,
  onOpenCreateDialog,
  openCreateDialog,
  onOpenCreateDialogChange,
}: ChallengeListProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const { toast } = useToast();

  const loadChallenges = async () => {
    try {
      const data = await challengeService.getByProject(projectId);
      setChallenges(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os desafios.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [projectId]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-xl">{challenge.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-300">{challenge.description}</p>
                <div className="text-sm">
                  <strong>Critérios:</strong> {challenge.criteria}
                </div>
                <div className="text-sm">
                  <strong>Prazo:</strong>{" "}
                  {challenge.deadline
                    ? format(new Date(challenge.deadline), "dd/MM/yyyy", {
                        locale: ptBR,
                      })
                    : "Não definido"}
                </div>
                <div className="text-sm">
                  <strong>Pontos extras:</strong> {challenge.extraPoints}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 