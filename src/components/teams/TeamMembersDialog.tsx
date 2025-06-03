import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Member } from '@/types/Member';
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateFeedbackDialog } from '@/components/feedback/CreateFeedbackDialog';
import { useFeedback } from '@/hooks/useFeedback';
import authService from '@/services/authService';
import { CreateFeedbackRequest } from '@/services/feedbackService';
import { useQuery } from '@tanstack/react-query';
import { teamService } from '@/services/teamService';

interface TeamMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId?: number;
}

export function TeamMembersDialog({
  open,
  onOpenChange,
  teamId,
}: TeamMembersDialogProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const currentUser = authService.getCurrentUser();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['teamMembers', teamId],
    queryFn: () => teamService.getMembersByTeamId(teamId!),
    enabled: !!teamId,
  });

  const { createFeedback, isCreating } = useFeedback(selectedMember?.memberId || 0);

  // Ordenar membros por individualScore (do maior para o menor) e pegar apenas os 5 primeiros
  const sortedMembers = [...members]
    .sort((a, b) => (b.individualScore || 0) - (a.individualScore || 0))
    .slice(0, 5);

  const handleFeedbackClick = (member: Member) => {
    setSelectedMember(member);
    setIsFeedbackDialogOpen(true);
  };

  const handleCreateFeedback = async (data: CreateFeedbackRequest) => {
    if (selectedMember) {
      await createFeedback(data);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-850 text-white border-gray-700 max-w-md md:max-w-lg lg:max-w-xl h-[80vh] flex flex-col">
          <DialogHeader className="border-b border-gray-700 pb-4">
            <DialogTitle className="text-xl text-white flex justify-between items-center">
              <span>{teamId ? 'Membros da Equipe' : 'Ranking Geral'}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-1">
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-center text-gray-400">Carregando membros...</p>
              ) : sortedMembers.length > 0 ? (
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-sprint-primary">
                          {member.individualScore || 0} pts
                        </span>
                        {currentUser && currentUser.memberId !== member.memberId && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-600"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-800 border-gray-700">
                              <DropdownMenuItem
                                className="text-white hover:bg-gray-700 cursor-pointer"
                                onClick={() => handleFeedbackClick(member)}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Enviar Feedback
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
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

      {selectedMember && (
        <CreateFeedbackDialog
          open={isFeedbackDialogOpen}
          onOpenChange={setIsFeedbackDialogOpen}
          onSubmit={handleCreateFeedback}
          member={selectedMember}
        />
      )}
    </>
  );
} 