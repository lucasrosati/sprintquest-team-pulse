
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { toast } from 'sonner';

export const ProjectsCard = () => {
  const navigate = useNavigate();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const createProjectMutation = useCreateProject();

  const handleCreateProject = async (projectData: { name: string; type: string; description: string }) => {
    try {
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

  // Control how many projects to show
  const projectsToShow = showAllProjects ? projects : projects.slice(0, 5);
  const hasMoreProjects = projects.length > 5;

  return (
    <>
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

      <CreateProjectDialog 
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
        onCreateProject={handleCreateProject}
      />
    </>
  );
};
