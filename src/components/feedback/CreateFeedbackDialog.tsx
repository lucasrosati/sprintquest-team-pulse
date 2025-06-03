import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Member } from '@/types/Member';
import { CreateFeedbackRequest } from '@/services/feedbackService';
import authService from '@/services/authService';

interface CreateFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateFeedbackRequest) => Promise<void>;
  member: Member;
}

export function CreateFeedbackDialog({
  open,
  onOpenChange,
  onSubmit,
  member,
}: CreateFeedbackDialogProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = authService.getCurrentUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        message: message.trim(),
        givenBy: currentUser.memberId,
        receivedBy: member.memberId,
      });
      setMessage('');
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl">Enviar Feedback para {member.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite seu feedback aqui..."
              className="bg-gray-700 border-gray-600 text-white"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!message.trim() || isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 