
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Remove any stored tokens/data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Navigate back to the admin login page
    navigate('/admin-login');
  };
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with title and actions */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Menu administrador</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>
        
        {/* Rewards Section */}
        <Card className="mb-8 bg-gray-100 dark:bg-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Recompensas</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="recompensa-1" className="space-y-4">
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-4 rounded-md">
                <RadioGroupItem value="recompensa-1" id="recompensa-1" />
                <label htmlFor="recompensa-1" className="text-base font-medium">
                  Recompensa 1
                </label>
              </div>
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-4 rounded-md">
                <RadioGroupItem value="recompensa-2" id="recompensa-2" />
                <label htmlFor="recompensa-2" className="text-base font-medium">
                  Recompensa 2
                </label>
              </div>
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-4 rounded-md">
                <RadioGroupItem value="recompensa-3" id="recompensa-3" />
                <label htmlFor="recompensa-3" className="text-base font-medium">
                  Recompensa 3
                </label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        {/* Rankings Section */}
        <Card className="bg-gray-100 dark:bg-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Team Rankings */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Por equipe</h3>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-md">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">1.</span>
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-500 flex-grow"></div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">2.</span>
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-500 flex-grow"></div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">3.</span>
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-500 flex-grow"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Member Rankings */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Por membro</h3>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-md">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">1.</span>
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-500 flex-grow"></div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">2.</span>
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-500 flex-grow"></div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">3.</span>
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-500 flex-grow"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
