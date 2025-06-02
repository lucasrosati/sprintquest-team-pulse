
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMembers } from '@/hooks/useMembers';

export const RankingsCard = () => {
  const { data: members = [], isLoading: membersLoading } = useMembers();

  // Calculate rankings from real member data
  const rankings = members
    .map((member, index) => ({
      position: index + 1,
      name: member.name,
      points: member.individualScore || 0,
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5); // Top 5

  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-center text-xl text-white">Ranking Individual</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {membersLoading ? (
          <p className="text-center text-sm">Carregando rankings...</p>
        ) : rankings.length > 0 ? (
          <div className="space-y-4">
            {rankings.map((rank) => (
              <div key={rank.position} className="bg-gray-700 p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xl font-bold mr-4 text-sprint-primary">
                      {rank.position}.
                    </span>
                    <div className="h-8 w-8 rounded-full bg-gray-600 mr-3"></div>
                    <span className="font-medium">{rank.name}</span>
                  </div>
                  <span className="font-bold text-sprint-accent">
                    {rank.points.toLocaleString()} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">Nenhum ranking disponível</p>
        )}
      </CardContent>
    </Card>
  );
};
