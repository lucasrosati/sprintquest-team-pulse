import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import authService, { RegisterData } from '@/services/authService';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "As senhas não coincidem.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userData: RegisterData = {
        name,
        email,
        password
      };

      const response = await authService.register(userData);
      
      // Store auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Você está sendo redirecionado para a página inicial.",
      });
      
      // Redirecionar para a página inicial
      navigate('/');
      
    } catch (error: any) { // Mantido 'any' para simplificar a demonstração, idealmente seria 'unknown' com tratamento mais robusto
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error instanceof Error ? error.message : "Não foi possível completar seu cadastro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center justify-center flex-1 px-6">
        <h1 className="text-3xl font-bold mb-4 text-foreground">SprintQuest</h1>
        <h2 className="text-xl mb-8 text-foreground">Cadastre-se!</h2>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <Input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={3}
            className="h-12 bg-background border-input text-foreground placeholder:text-muted-foreground"
          />
          
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
            minLength={6}
            className="h-12 bg-background border-input text-foreground placeholder:text-muted-foreground"
          />
          
          <Input
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="h-12 bg-background border-input text-foreground placeholder:text-muted-foreground"
          />
          
          <Button 
            type="submit" 
            variant="default"
            className="w-full h-10"
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : 'Cadastrar'}
          </Button>
          
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              className="text-sm text-primary"
              onClick={() => navigate('/login')}
            >
              Já possui cadastro?
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
