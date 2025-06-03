import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFeedback } from '@/hooks/useFeedback';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeedbackListProps {
  memberId: number;
}

export function FeedbackList({ memberId }: FeedbackListProps) {
  const { feedbacks, isLoading } = useFeedback(memberId);

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <p className="text-center text-gray-400">Carregando feedbacks...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Feedbacks Recebidos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedbacks.length === 0 ? (
          <p className="text-center text-gray-400">Nenhum feedback recebido ainda.</p>
        ) : (
          feedbacks.map((feedback) => (
            <div
              key={feedback.id.value}
              className="p-4 rounded-lg border border-gray-600 bg-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">{feedback.message}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {format(new Date(feedback.date), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
} 