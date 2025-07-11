
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import authService from "@/services/authService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar o email. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary text-primary-foreground py-2 px-4 flex justify-between items-center">
        <h1 className="text-sm font-semibold">Recuperar Senha</h1>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-card text-card-foreground rounded-md shadow-md overflow-hidden p-6">
          <div className="flex mb-6">
            <Button
              variant="ghost"
              className="p-0"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </Button>
          </div>

          <h1 className="text-3xl font-bold mb-8 text-center">SprintQuest</h1>

          {!isSubmitted ? (
            <>
              <h2 className="text-xl mb-6 text-center">Esqueceu sua senha?</h2>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                Digite seu email abaixo e enviaremos um link para redefinir sua senha.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />

                <Button
                  type="submit"
                  className="w-full h-10"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <h2 className="text-xl font-medium">Email enviado!</h2>
              <p className="text-muted-foreground">
                Verifique sua caixa de entrada para instruções sobre como redefinir sua senha.
              </p>
              <Button
                onClick={() => navigate("/login")}
              >
                Voltar para o login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
