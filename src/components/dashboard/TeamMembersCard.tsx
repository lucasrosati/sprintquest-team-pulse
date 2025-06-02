
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useMembers } from '@/hooks/useMembers';

export const TeamMembersCard = () => {
  const { data: members = [], isLoading: membersLoading } = useMembers();

  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-center text-xl text-white flex items-center justify-center">
          <Users className="h-5 w-5 mr-2" />
          Equipe
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {membersLoading ? (
          <p className="text-center text-sm">Carregando membros...</p>
        ) : members.length > 0 ? (
          <div className="space-y-3">
            {members.slice(0, 5).map((member) => (
              <div key={member.id} className="bg-gray-700 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-xs text-gray-400">{member.role}</p>
                  </div>
                  <span className="text-sm font-bold text-sprint-primary">
                    {member.individualScore || 0} pts
                  </span>
                </div>
              </div>
            ))}
            {members.length > 5 && (
              <p className="text-sm text-center text-gray-400 mt-4">
                +{members.length - 5} membros adicionais
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-400">Nenhum membro encontrado</p>
        )}
      </CardContent>
    </Card>
  );
};
