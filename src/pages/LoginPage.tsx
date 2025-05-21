
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-sprint-background flex flex-col">
      <div className="bg-sprint-primary text-white py-2 px-4">
        <h1 className="text-sm font-semibold">Login</h1>
      </div>
      
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-md shadow-md overflow-hidden">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
