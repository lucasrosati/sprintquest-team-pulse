
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sprint-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">SprintQuest</h1>
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
};

export default Index;
