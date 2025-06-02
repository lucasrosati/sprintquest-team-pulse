
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { useMembers } from '@/hooks/useMembers';
import { toast } from 'sonner';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  
  // Use real data from backend with proper fallbacks
  const { data: projectsData, isLoading: projectsLoading, error: projectsError } = useProjects();
  const { data: membersData, isLoading: membersLoading, error: membersError } = useMembers();
  const createProjectMutation = useCreateProject();

  // Ensure data is always an array and log what we receive
  const projects = React.useMemo(() => {
    console.log('📊 Raw projects data:', projectsData);
    if (Array.isArray(projectsData)) {
      console.log('✅ Projects is array with', projectsData.length, 'items');
      return projectsData;
    }
    console.log('⚠️ Projects data is not an array:', typeof projectsData);
    return [];
  }, [projectsData]);

  const members = React.useMemo(() => {
    console.log('👥 Raw members data:', membersData);
    if (Array.isArray(membersData)) {
      console.log('✅ Members is array with', membersData.length, 'items');
      return membersData;
    }
    console.log('⚠️ Members data is not an array:', typeof membersData);
    return [];
  }, [membersData]);

  // Log errors if any
  useEffect(() => {
    if (projectsError) {
      console.error('❌ Projects error:', projectsError);
    }
    if (membersError) {
      console.error('❌ Members error:', membersError);
    }
  }, [projectsError, membersError]);

  const handleCreateProject = async (projectData: { name: string; type: string; description: string }) => {
    try {
      await createProjectMutation.mutateAsync({
        name: projectData.name,
        description: projectData.description,
        teamId: 101
      });
      setIsCreateProjectOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Erro ao criar projeto');
    }
  };

  // Calculate rankings from real member data
  const rankings = React.useMemo(() => {
    return members
      .filter(member => member && typeof member === 'object')
      .map((member, index) => ({
        position: index + 1,
        name: member.name || 'Nome não informado',
        points: member.individualScore || 0,
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);
  }, [members]);

  // Control how many projects to show
  const projectsToShow = showAllProjects ? projects : projects.slice(0, 5);
  const hasMoreProjects = projects.length > 5;

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
                <span>Meus Projetos ({projects.length})</span>
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
              ) : projectsError ? (
                <p className="text-center text-sm text-red-400">Erro ao carregar projetos</p>
              ) : projects.length > 0 ? (
                <div className="space-y-3">
                  {projectsToShow.map((project) => (
                    <div 
                      key={project.id} 
                      className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-650 transition-colors"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                      {project.team && (
                        <p className="text-xs text-gray-500 mt-2">Team: {project.team.name}</p>
                      )}
                    </div>
                  ))}
                  {hasMoreProjects && !showAllProjects && (
                    <Button
                      variant="ghost"
                      className="w-full text-gray-400 hover:text-white hover:bg-gray-700"
                      onClick={() => setShowAllProjects(true)}
                    >
                      Mostrar todos os {projects.length} projetos
                    </Button>
                  )}
                  {showAllProjects && hasMoreProjects && (
                    <Button
                      variant="ghost"
                      className="w-full text-gray-400 hover:text-white hover:bg-gray-700"
                      onClick={() => setShowAllProjects(false)}
                    >
                      Mostrar menos
                    </Button>
                  )}
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
          
          {/* Team Members Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-center text-xl text-white flex items-center justify-center">
                <Users className="h-5 w-5 mr-2" />
                Equipe
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {membersLoading ? (
                <p className="text-center text-sm">Carregando membros...</p>
              ) : membersError ? (
                <p className="text-center text-sm text-red-400">Erro ao carregar membros</p>
              ) : members.length > 0 ? (
                <div className="space-y-3">
                  {members.slice(0, 5).map((member) => (
                    <div key={member.id} className="bg-gray-700 p-3 rounded-md">
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
                  {members.length > 5 && (
                    <p className="text-sm text-center text-gray-400 mt-4">
                      +{members.length - 5} membros adicionais
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-400">Nenhum membro encontrado</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Rankings Section */}
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-center text-xl text-white">Ranking Individual</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {membersLoading ? (
              <p className="text-center text-sm">Carregando rankings...</p>
            ) : rankings.length > 0 ? (
              <div className="space-y-4">
                {rankings.map((rank) => (
                  <div key={rank.position} className="bg-gray-700 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xl font-bold mr-4 text-sprint-primary">
                          {rank.position}.
                        </span>
                        <div className="h-8 w-8 rounded-full bg-gray-600 mr-3"></div>
                        <span className="font-medium">{rank.name}</span>
                      </div>
                      <span className="font-bold text-sprint-accent">
                        {rank.points.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">Nenhum ranking disponível</p>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create Project Dialog */}
      <CreateProjectDialog 
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default DashboardPage;
