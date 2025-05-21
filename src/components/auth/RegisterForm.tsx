
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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

    setIsLoading(true);

    try {
      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Você está sendo redirecionado para o dashboard.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = "Não foi possível completar seu cadastro. Tente novamente.";
      
      // Handle specific Supabase errors
      if (error.message) {
        if (error.message.includes("already registered")) {
          errorMessage = "Este e-mail já está cadastrado.";
        } else if (error.message.includes("password")) {
          errorMessage = "A senha deve ter pelo menos 6 caracteres.";
        }
      }
      
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: errorMessage,
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Nome"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="h-12 bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Sobrenome"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="h-12 bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
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
          
          <Input
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-12 bg-background border-input text-foreground placeholder:text-muted-foreground"
          />
          
          <Button 
            type="submit" 
            variant="default"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : 'Avançar'}
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
        
        <div className="mt-auto py-4">
          <Button 
            variant="outline" 
            className="text-xs text-foreground border-input"
            onClick={() => navigate('/admin-login')}
          >
            Login administrador
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
