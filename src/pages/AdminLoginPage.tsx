
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const AdminLoginPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary text-primary-foreground py-2 px-4 flex justify-between items-center">
        <h1 className="text-sm font-semibold">Login Administrador</h1>
        <ThemeToggle />
      </div>
      
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-card text-card-foreground rounded-md shadow-md overflow-hidden">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
