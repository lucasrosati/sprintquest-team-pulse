
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Plus, X } from 'lucide-react';
import KanbanBoard from '@/components/KanbanBoard';
import { toast } from 'sonner';

interface Ranking {
  position: number;
  name: string;
  points: number;
}

const ProjectDetailsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [isKanbanOpen, setIsKanbanOpen] = useState(false);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [rankingsLoading, setRankingsLoading] = useState(true);
  
  // Mock data for project details - in a real app this would come from an API
  // Based on the projectId
  const projectName = 
    projectId === 'a' ? 'Projeto A' :
    projectId === 'b' ? 'Projeto B' :
    projectId === 'c' ? 'Projeto C' : 'Projeto';
    
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        // In a real implementation, this would be API calls to fetch rankings
        // For now, we'll simulate fetching rankings based on the project ID
        
        // Simulated API response for rankings
        const rankingsData = [
          { position: 1, name: 'Equipe Alpha', points: 10000 },
          { position: 2, name: 'Equipe Beta', points: 8000 },
          { position: 3, name: 'Equipe Gamma', points: 7000 },
        ];
        
        setRankings(rankingsData);
      } catch (error) {
        console.error('Error fetching rankings:', error);
        toast.error('Falha ao carregar os rankings');
      } finally {
        setRankingsLoading(false);
      }
    };

    fetchRankings();
  }, [projectId]);
  
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
          <h1 className="text-2xl font-bold text-center flex-1">{projectName}</h1>
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
                {/* This would be a real chart or visualization in a full implementation */}
                <p className="text-5xl font-bold text-sprint-primary">850</p>
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
                {/* This would be a real progress chart in a full implementation */}
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
              <CardTitle className="text-center text-xl text-white">Ranking Semanal</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {rankingsLoading ? (
                  <p className="text-center text-sm">Carregando...</p>
                ) : rankings.length > 0 ? (
                  rankings.map((rank) => (
                    <div key={rank.position} className="bg-gray-700 p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xl font-bold mr-4">{rank.position}.</span>
                          <div className="h-8 w-8 rounded-full bg-gray-600 mr-3"></div>
                          <span>{rank.name}</span>
                        </div>
                        <span className="font-bold">{rank.points.toLocaleString()}</span>
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
              <span>Quadro Kanban - {projectName}</span>
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
            <KanbanBoard />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetailsPage;
