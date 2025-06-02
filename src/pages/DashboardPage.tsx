
import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProjectsCard } from '@/components/dashboard/ProjectsCard';
import { TeamMembersCard } from '@/components/dashboard/TeamMembersCard';
import { RankingsCard } from '@/components/dashboard/RankingsCard';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardHeader />
      
      {/* Main content */}
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ProjectsCard />
          <TeamMembersCard />
        </div>
        
        <RankingsCard />
      </main>
    </div>
  );
};

export default DashboardPage;
