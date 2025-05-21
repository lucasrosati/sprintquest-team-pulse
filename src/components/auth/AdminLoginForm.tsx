
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import authService from '@/services/authService';

const AdminLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Você pode criar um método específico para login de administrador no authService
      const response = await authService.login({ email, password });
      
      // Store auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast({
        title: "Login bem-sucedido",
        description: "Você está sendo redirecionado para o painel administrativo.",
      });
      
      navigate('/admin-dashboard'); // Redireciona para um dashboard admin (que você pode criar depois)
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais de administrador e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex p-4">
        <Button 
          variant="ghost" 
          className="p-0" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 px-6">
        <h1 className="text-3xl font-bold mb-8 text-foreground">SprintQuest</h1>
        <h2 className="text-2xl font-semibold mb-8 text-foreground">Login administrador</h2>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-10"
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : 'Avançar'}
          </Button>
          
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              className="text-sm text-primary"
              onClick={() => navigate('/forgot-password')}
            >
              Esqueceu a senha?
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;
