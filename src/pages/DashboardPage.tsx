import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { useMembers } from '@/hooks/useMembers';
import { toast } from 'sonner';
import { TeamMembersDialog } from '@/components/teams/TeamMembersDialog';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  
  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // Use real data from backend
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  // Usando useMembers sem teamId para o ranking geral
  const { data: allMembers = [], isLoading: allMembersLoading } = useMembers();
  // Usando useMembers com teamId para os membros da equipe
  const { data: teamMembers = [], isLoading: teamMembersLoading } = useMembers(user?.teamId);
  const createProjectMutation = useCreateProject();

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
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-center text-xl text-white flex items-center justify-between">
                <span>Meus Projetos</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsCreateProjectOpen(true)}
                  className="hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {projectsLoading ? (
                <p className="text-center text-sm">Carregando projetos...</p>
              ) : projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div 
                      key={project.id} 
                      className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-650 transition-colors"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">Nenhum projeto encontrado</p>
                  <Button 
                    onClick={() => setIsCreateProjectOpen(true)}
                    className="bg-sprint-primary hover:bg-sprint-accent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar primeiro projeto
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Team Score Card (Adicionado no Dashboard)*/}
          <Card className="bg-gray-800 border-gray-700 shadow-lg h-72">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-center text-xl text-white">Pontuação da Equipe</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full pb-20">
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
                    .slice(0, 5)
                    .sort((a, b) => (b.individualScore || 0) - (a.individualScore || 0))
                    .map((member) => (
                    <div key={member.memberId} className="bg-gray-700 p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-xs text-gray-400">{member.role}</p>
                        </div>
                        <span className="text-sm font-bold text-sprint-primary">
                          {member.individualScore || 0} pts
                        </span>
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
                        +{teamMembers.length - 5} membros adicionais
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
                    .sort((a, b) => (b.individualScore || 0) - (a.individualScore || 0)) // Ordenar por pontuação
                    .slice(0, 5) // Top 5 para o ranking geral
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
                   {/* Opcional: Adicionar botão para ver ranking completo se houver mais que 5 */}
                   {allMembers.length > 5 && (
                     <div className="text-center mt-4">
                       <Button
                         variant="link"
                         className="text-sm text-gray-400 hover:text-white"
                         onClick={() => setIsMembersDialogOpen(true)} // Reutiliza o dialog de membros para ranking completo
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
        members={teamMembers} // Passa teamMembers ou allMembers dependendo de como o dialog será usado para o ranking completo
        teamId={user?.teamId} // Passa teamId para filtrar se necessário
      />
    </div>
  );
};

export default DashboardPage;
