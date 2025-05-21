
import RegisterForm from "@/components/auth/RegisterForm";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col">
      <div className="bg-primary text-primary-foreground py-2 px-4 flex justify-between items-center">
        <h1 className="text-sm font-semibold">Cadastro</h1>
        <ThemeToggle />
      </div>
      
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-card dark:bg-slate-800 text-card-foreground dark:text-white rounded-md shadow-md overflow-hidden">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
