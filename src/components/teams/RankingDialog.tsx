import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Member } from '@/types/Member';
import { Card, CardContent } from "@/components/ui/card";
import { useMembers } from '@/hooks/useMembers';

interface RankingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RankingDialog({
  open,
  onOpenChange,
}: RankingDialogProps) {
  const { data: members = [], isLoading } = useMembers();

  // Ordenar membros por individualScore (do maior para o menor)
  const sortedMembers = [...members]
    .sort((a, b) => (b.individualScore || 0) - (a.individualScore || 0));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-850 text-white border-gray-700 max-w-md md:max-w-lg lg:max-w-xl h-[80vh] flex flex-col">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <DialogTitle className="text-xl text-white flex justify-between items-center">
            <span>Ranking Geral</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-1">
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-center text-gray-400">Carregando ranking...</p>
            ) : sortedMembers.length > 0 ? (
              sortedMembers.map((member, index) => (
                <Card key={member.memberId} className="bg-gray-700 p-3 rounded-md">
                  <CardContent className="p-0 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 text-center mr-3 font-bold text-sprint-accent">{index + 1}.</div>
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
              <p className="text-center text-gray-400">Nenhum ranking disponível</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 