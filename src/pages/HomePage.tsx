
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sprint-secondary flex flex-col">
      <header className="bg-white p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sprint-primary">SprintQuest</h1>
          <div>
            <Button 
              variant="ghost" 
              className="mr-2 text-sprint-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              className="bg-sprint-primary hover:bg-sprint-accent"
              onClick={() => navigate('/register')}
            >
              Cadastre-se
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-16 px-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Gerencie projetos de forma <span className="text-sprint-primary">gamificada</span>
        </h2>
        <p className="text-xl max-w-2xl mb-8">
          SprintQuest transforma a gestão de projetos ágeis em uma experiência divertida e motivadora,
          com pontos, conquistas e recompensas para toda a equipe.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            className="bg-sprint-primary hover:bg-sprint-accent text-white px-8 py-6 text-lg"
            onClick={() => navigate('/register')}
          >
            Começar agora
          </Button>
          <Button 
            variant="outline" 
            className="border-sprint-primary text-sprint-primary hover:bg-sprint-secondary px-8 py-6 text-lg"
            onClick={() => navigate('/login')}
          >
            Fazer login
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-sprint-accent">Quadros Kanban</h3>
            <p>Visualize e gerencie tarefas em quadros interativos que mostram o progresso real do projeto.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-sprint-accent">Sistema de Pontos</h3>
            <p>Ganhe pontos ao concluir tarefas e desafios, subindo no ranking da sua equipe.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-sprint-accent">Conquistas</h3>
            <p>Desbloqueie distintivos e recompensas especiais ao atingir marcos importantes.</p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2023 SprintQuest - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
