
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, X } from 'lucide-react';
import KanbanBoard from '@/components/KanbanBoard';
import { useProject } from '@/hooks/useProjects';
import { useMembers } from '@/hooks/useMembers';
import { toast } from 'sonner';

const ProjectDetailsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [isKanbanOpen, setIsKanbanOpen] = useState(false);
  
  // Use real data from backend
  const { data: project, isLoading: projectLoading } = useProject(Number(projectId));
  const { data: members = [], isLoading: membersLoading } = useMembers();
  
  // Calculate rankings from real member data
  const rankings = members
    .map((member, index) => ({
      position: index + 1,
      name: member.name,
      points: member.individualScore || 0,
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 3); // Top 3 for this view

  // Calculate team score from members
  const teamScore = members.reduce((total, member) => total + (member.individualScore || 0), 0);

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Carregando projeto...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Projeto não encontrado</p>
          <Button onClick={() => navigate('/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto p-4 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4 hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-center flex-1">{project.name}</h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Team Score Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg h-72">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-center text-xl text-white">Pontuação da Equipe</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <p className="text-5xl font-bold text-sprint-primary">{teamScore}</p>
                <p className="mt-2 text-gray-400">pontos totais</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Project Progress Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg h-72">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-center text-xl text-white">Progresso do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-white w-full">
                {/* Mock progress - you can enhance this with real task completion data */}
                <div className="h-8 bg-gray-700 rounded-full overflow-hidden w-full">
                  <div 
                    className="h-full bg-sprint-primary" 
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <p className="mt-4 text-2xl font-bold">75%</p>
                <p className="mt-2 text-gray-400">completado</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Weekly Ranking */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-center text-xl text-white">Ranking da Equipe</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {membersLoading ? (
                  <p className="text-center text-sm">Carregando...</p>
                ) : rankings.length > 0 ? (
                  rankings.map((rank) => (
                    <div key={rank.position} className="bg-gray-700 p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xl font-bold mr-4 text-sprint-primary">
                            {rank.position}.
                          </span>
                          <div className="h-8 w-8 rounded-full bg-gray-600 mr-3"></div>
                          <span>{rank.name}</span>
                        </div>
                        <span className="font-bold text-sprint-accent">
                          {rank.points.toLocaleString()} pts
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm">Nenhum ranking disponível</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Kanban Board */}
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-center text-xl text-white">Quadro Kanban</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div 
                className="flex justify-center items-center h-72 text-gray-500 cursor-pointer hover:bg-gray-750 transition-colors rounded-md"
                onClick={() => setIsKanbanOpen(true)}
              >
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto border-2 border-gray-700 rounded-lg flex items-center justify-center">
                    <div className="transform rotate-45 w-24 h-24 border-gray-700 border-2"></div>
                  </div>
                  <p className="mt-4">Clique para abrir o quadro Kanban</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Kanban Dialog */}
      <Dialog open={isKanbanOpen} onOpenChange={setIsKanbanOpen}>
        <DialogContent className="bg-gray-850 text-white border-gray-700 max-w-6xl h-[80vh] flex flex-col">
          <DialogHeader className="border-b border-gray-700 pb-4">
            <DialogTitle className="text-xl text-white flex justify-between items-center">
              <span>Quadro Kanban - {project.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsKanbanOpen(false)} 
                className="hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-1">
            <KanbanBoard projectId={Number(projectId)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetailsPage;
