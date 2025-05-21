
import LoginForm from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary text-primary-foreground py-2 px-4 flex justify-between items-center">
        <h1 className="text-sm font-semibold">Login</h1>
        <ThemeToggle />
      </div>
      
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-card text-card-foreground rounded-md shadow-md overflow-hidden">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
