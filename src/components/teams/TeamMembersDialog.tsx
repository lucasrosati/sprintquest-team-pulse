import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Member } from '@/types/Member'; // Corrigindo o import para usar a interface do arquivo de tipos
import { Card, CardContent } from "@/components/ui/card"; // Import Card components for styling

interface TeamMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  teamId?: number; // Novo parâmetro opcional
}

export function TeamMembersDialog({
  open,
  onOpenChange,
  members,
  teamId, // Novo parâmetro
}: TeamMembersDialogProps) {
  // Filtrar membros por teamId se fornecido
  const filteredMembers = teamId 
    ? members.filter(member => member.teamId === teamId)
    : members;

  // Ordenar membros por individualScore (do maior para o menor)
  const sortedMembers = [...filteredMembers].sort((a, b) => (
    (b.individualScore || 0) - (a.individualScore || 0)
  ));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-850 text-white border-gray-700 max-w-md md:max-w-lg lg:max-w-xl h-[80vh] flex flex-col">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <DialogTitle className="text-xl text-white flex justify-between items-center">
            <span>{teamId ? 'Membros da Equipe' : 'Ranking Geral'}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-1">
          <div className="space-y-3">
            {sortedMembers.length > 0 ? (
              sortedMembers.map((member) => (
                <Card key={member.memberId} className="bg-gray-700 p-3 rounded-md">
                  <CardContent className="p-0 flex items-center justify-between">
                     <div className="flex items-center">
                        {/* Placeholder for avatar */}
                        <div className="h-8 w-8 rounded-full bg-gray-600 mr-3"></div>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-xs text-gray-400">{member.role}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-sprint-primary">
                        {member.individualScore || 0} pts
                      </span>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-400">Nenhum membro encontrado.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 