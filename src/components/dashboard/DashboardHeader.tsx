
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-800">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4 hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <Button 
          onClick={() => navigate('/profile')}
          className="bg-sprint-primary hover:bg-sprint-accent"
        >
          Ver perfil
        </Button>
      </div>
    </header>
  );
};
