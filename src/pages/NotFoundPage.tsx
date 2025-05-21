
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sprint-background p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-6xl font-bold text-sprint-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página não encontrada</p>
        <p className="mb-8 text-gray-500">
          Não conseguimos encontrar a página que você está procurando.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-sprint-primary hover:bg-sprint-accent"
        >
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
