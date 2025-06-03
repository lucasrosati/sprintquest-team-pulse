import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Users, MoreVertical, MessageSquare, Trophy } from 'lucide-react';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { useMembers } from '@/hooks/useMembers';
import { toast } from 'sonner';
import { TeamMembersDialog } from '@/components/teams/TeamMembersDialog';
import { RankingDialog } from '@/components/teams/RankingDialog';
import { CreateRewardDialog } from '@/components/rewards/CreateRewardDialog';
import { useQuery } from '@tanstack/react-query';
import { teamService } from '@/services/teamService';
import { rewardService } from '@/services/rewardService';
import { CreateFeedbackDialog } from '@/components/feedback/CreateFeedbackDialog';
import { useFeedback } from '@/hooks/useFeedback';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Member } from '@/types/Member';
import { CreateFeedbackRequest } from '@/services/feedbackService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [isRankingDialogOpen, setIsRankingDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isCreateRewardOpen, setIsCreateRewardOpen] = useState(false);
  
  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // Use real data from backend
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  // Usando useMembers sem teamId para o ranking geral
  const { data: allMembers = [], isLoading: allMembersLoading } = useMembers();
  // Usando teamService.getMembersByTeamId para os membros da equipe
  const { data: teamMembers = [], isLoading: teamMembersLoading } = useQuery({
    queryKey: ['teamMembers', user?.teamId],
    queryFn: () => teamService.getMembersByTeamId(user?.teamId!),
    enabled: !!user?.teamId,
  });
  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.getAll(),
  });
  const { data: rewards = [], isLoading: rewardsLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: () => rewardService.getAll(),
  });

  const isTeamLeader = useMemo(() => {
    if (!user || !teams) return false;
    const userTeam = teams.find(team => team.id.value === user.teamId);
    return userTeam?.leaderId?.value === user.memberId;
  }, [user, teams]);

  const createProjectMutation = useCreateProject();

  const { createFeedback } = useFeedback(selectedMember?.memberId || 0);

  const handleFeedbackClick = (member: Member) => {
    setSelectedMember(member);
    setIsFeedbackDialogOpen(true);
  };

  const handleCreateFeedback = async (data: CreateFeedbackRequest) => {
    if (selectedMember) {
      await createFeedback(data);
    }
  };

  const handleCreateProject = async (projectData: { name: string; type: string; description: string }) => {
    try {
      // For now, we'll use teamId 101 as default, you might want to get this from user context
      await createProjectMutation.mutateAsync({
        name: projectData.name,
        description: projectData.description,
        teamId: 101 // Default team ID - you should get this from user context
      });
      setIsCreateProjectOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Erro ao criar projeto');
    }
  };

  // Calcular pontuação da equipe no Dashboard
  const teamScore = useMemo(() => {
    return teamMembers.reduce((total, member) => total + (member.individualScore || 0), 0);
  }, [teamMembers]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4 hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <Button 
            onClick={() => navigate('/profile')}
            className="bg-sprint-primary hover:bg-sprint-accent"
          >
            Ver perfil
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Projects Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg h-80">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-center text-xl text-white flex items-center justify-between">
                <span>Meus Projetos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-4rem)] px-0">
              {projectsLoading ? (
                <p className="text-center text-sm py-6">Carregando projetos...</p>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-3 px-6 pb-10 pt-4">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <div 
                        key={project.id} 
                        className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-650 transition-colors"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">Nenhum projeto encontrado</p>
                      {!isTeamLeader && (
                        <p className="text-sm text-gray-400">Apenas o líder da equipe pode criar projetos.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              {isTeamLeader && (
                <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 rounded-b-lg">
                  <Button 
                    onClick={() => setIsCreateProjectOpen(true)}
                    className="w-full bg-sprint-primary hover:bg-sprint-accent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Projeto
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Team Score Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg h-80">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-center text-xl text-white">Pontuação da Equipe</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[calc(100%-4rem)] pb-5">
              <div className="text-center text-white flex flex-col items-center justify-center h-full w-full">
                 {/* Calcular score usando teamMembers do Dashboard*/}
                {teamMembersLoading ? (
                  <p className="text-sm">Carregando pontuação...</p>
                ) : (
                  <p className="text-5xl font-bold text-sprint-primary">{teamScore}</p>
                )}
                <p className="mt-2 text-gray-400">pontos totais</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Team Members Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-center text-xl text-white flex items-center justify-center">
                <Users className="h-5 w-5 mr-2" />
                Equipe
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {teamMembersLoading ? (
                <p className="text-center text-sm">Carregando membros...</p>
              ) : teamMembers.length > 0 ? (
                <div className="space-y-3">
                  {teamMembers
                    .sort((a, b) => (b.individualScore || 0) - (a.individualScore || 0))
                    .slice(0, 5)
                    .map((member) => (
                    <div key={member.memberId} className="bg-gray-700 p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
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
                          {user && user.memberId !== member.memberId && (
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
                      </div>
                    </div>
                  ))}
                  {teamMembers.length > 5 && (
                    <div className="text-center mt-4">
                      <Button
                        variant="link"
                        className="text-sm text-gray-400 hover:text-white"
                        onClick={() => setIsMembersDialogOpen(true)}
                      >
                        Ver todos os {teamMembers.length} membros
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Nenhum membro da equipe encontrado</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Overall Ranking Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-center text-xl text-white">Ranking Geral</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {allMembersLoading ? (
                <p className="text-center text-sm">Carregando ranking...</p>
              ) : allMembers.length > 0 ? (
                <div className="space-y-3">
                  {allMembers
                    .sort((a, b) => (b.individualScore || 0) - (a.individualScore || 0))
                    .slice(0, 5)
                    .map((member, index) => (
                      <div key={member.memberId} className="bg-gray-700 p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-6 text-center mr-2 font-bold text-sprint-accent">{index + 1}.</div>
                            <h4>{member.name}</h4>
                          </div>
                          <span className="text-sm font-bold text-sprint-primary">
                            {member.individualScore || 0} pts
                          </span>
                        </div>
                      </div>
                    ))
                  }
                  {allMembers.length > 5 && (
                    <div className="text-center mt-4">
                      <Button
                        variant="link"
                        className="text-sm text-gray-400 hover:text-white"
                        onClick={() => setIsRankingDialogOpen(true)}
                      >
                        Ver ranking completo
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-400">Nenhum ranking disponível</p>
              )}
            </CardContent>
          </Card>

          {/* Rewards Card - Apenas para líder da equipe */}
          {isTeamLeader && (
            <Card className="bg-gray-800 border-gray-700 shadow-lg">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-center text-xl text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Recompensas
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreateRewardOpen(true)}
                    className="hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {rewardsLoading ? (
                  <p className="text-center text-sm">Carregando recompensas...</p>
                ) : rewards.length > 0 ? (
                  <div className="space-y-3">
                    {rewards.map((reward) => (
                      <div key={reward.id} className="bg-gray-700 p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{reward.description}</h4>
                            <p className="text-xs text-gray-400">
                              Tipo: {reward.type === 'DESTAQUE' ? 'Destaque' : 
                                     reward.type === 'CUPOM' ? 'Cupom' : 'Folga'}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-sprint-primary">
                            {reward.requiredPoints} pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Nenhuma recompensa disponível</p>
                    <Button
                      onClick={() => setIsCreateRewardOpen(true)}
                      className="bg-sprint-primary hover:bg-sprint-accent"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar primeira recompensa
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Create Project Dialog */}
      <CreateProjectDialog 
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
        onCreateProject={handleCreateProject}
      />

      {/* Team Members Dialog */}
      <TeamMembersDialog
        open={isMembersDialogOpen}
        onOpenChange={setIsMembersDialogOpen}
        teamId={user?.teamId}
      />

      {/* Ranking Dialog */}
      <RankingDialog
        open={isRankingDialogOpen}
        onOpenChange={setIsRankingDialogOpen}
      />

      {/* Create Feedback Dialog */}
      {selectedMember && (
        <CreateFeedbackDialog
          open={isFeedbackDialogOpen}
          onOpenChange={setIsFeedbackDialogOpen}
          onSubmit={handleCreateFeedback}
          member={selectedMember}
        />
      )}

      {/* Create Reward Dialog */}
      {isTeamLeader && (
        <CreateRewardDialog
          open={isCreateRewardOpen}
          onOpenChange={setIsCreateRewardOpen}
          createdBy={user?.memberId || 0}
        />
      )}
    </div>
  );
};

export default DashboardPage;
