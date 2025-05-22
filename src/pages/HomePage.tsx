
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sprint-secondary dark:from-sprint-dark-background dark:to-sprint-dark-secondary flex flex-col">
      <header className="bg-white dark:bg-sprint-dark-background p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sprint-primary dark:text-sprint-dark-primary">SprintQuest</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              className="mr-2 text-sprint-primary dark:text-sprint-dark-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              className="bg-sprint-primary hover:bg-sprint-accent dark:bg-sprint-dark-primary dark:hover:bg-sprint-dark-accent"
              onClick={() => navigate('/register')}
            >
              Cadastre-se
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-16 px-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Gerencie projetos de forma <span className="text-sprint-primary dark:text-sprint-dark-primary">gamificada</span>
        </h2>
        <p className="text-xl max-w-2xl mb-8 dark:text-gray-200">
          SprintQuest transforma a gestão de projetos ágeis em uma experiência divertida e motivadora,
          com pontos, conquistas e recompensas para toda a equipe.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            className="bg-sprint-primary hover:bg-sprint-accent dark:bg-sprint-dark-primary dark:hover:bg-sprint-dark-accent text-white px-8 py-6 text-lg"
            onClick={() => navigate('/register')}
          >
            Começar agora
          </Button>
          <Button 
            variant="outline" 
            className="border-sprint-primary text-sprint-primary hover:bg-sprint-secondary dark:border-sprint-dark-primary dark:text-sprint-dark-primary dark:hover:bg-gray-800 px-8 py-6 text-lg"
            onClick={() => navigate('/login')}
          >
            Fazer login
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-sprint-accent dark:text-sprint-dark-accent">Quadros Kanban</h3>
            <p className="dark:text-gray-300">Visualize e gerencie tarefas em quadros interativos que mostram o progresso real do projeto.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-sprint-accent dark:text-sprint-dark-accent">Sistema de Pontos</h3>
            <p className="dark:text-gray-300">Ganhe pontos ao concluir tarefas e desafios, subindo no ranking da sua equipe.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-sprint-accent dark:text-sprint-dark-accent">Conquistas</h3>
            <p className="dark:text-gray-300">Desbloqueie distintivos e recompensas especiais ao atingir marcos importantes.</p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-900 py-6">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 SprintQuest - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
