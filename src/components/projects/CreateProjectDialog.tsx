import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (projectData: { name: string; description: string; teamId: number }) => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onCreateProject,
}: CreateProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Nome e descrição do projeto são obrigatórios.",
      });
      return;
    }

    const defaultTeamId = 101;

    onCreateProject({
      name,
      description,
      teamId: defaultTeamId,
    });

    setName('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-white">Crie seu projeto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          <div className="space-y-4">
            <div>
              <Input
                id="name"
                placeholder="Nome do projeto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600 text-white focus:ring-sprint-primary focus:border-sprint-primary"
              />
            </div>
            <div>
              <Textarea
                id="description"
                placeholder="Descrição do projeto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600 text-white min-h-[100px] focus:ring-sprint-primary focus:border-sprint-primary"
              />
            </div>
          </div>
          
        </form>
        <DialogFooter className="p-4 sm:justify-center">
          <Button type="submit" onClick={handleSubmit} className="bg-sprint-primary hover:bg-sprint-accent text-white px-8">
            Criar Projeto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
