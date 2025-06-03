import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardService } from '@/services/rewardService';

const rewardSchema = z.object({
  description: z.string().min(1, 'A descrição é obrigatória'),
  requiredPoints: z.number().min(1, 'A pontuação mínima deve ser maior que zero'),
  type: z.enum(['DESTAQUE', 'CUPOM', 'FOLGA'] as const),
});

type RewardFormData = z.infer<typeof rewardSchema>;

interface CreateRewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createdBy: number;
}

export function CreateRewardDialog({
  open,
  onOpenChange,
  createdBy,
}: CreateRewardDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<RewardFormData>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      description: '',
      requiredPoints: 0,
      type: 'DESTAQUE',
    },
  });

  const createRewardMutation = useMutation({
    mutationFn: (data: RewardFormData) => 
      rewardService.create({
        ...data,
        createdBy,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Recompensa criada com sucesso!');
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      console.error('Erro ao criar recompensa:', error);
      toast.error('Não foi possível criar a recompensa.');
    },
  });

  const onSubmit = (data: RewardFormData) => {
    createRewardMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-850 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Nova Recompensa</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a recompensa..."
                      className="bg-gray-700 border-gray-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requiredPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pontuação Necessária</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      className="bg-gray-700 border-gray-600 text-white"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="DESTAQUE">Destaque</SelectItem>
                      <SelectItem value="CUPOM">Cupom</SelectItem>
                      <SelectItem value="FOLGA">Folga</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-sprint-primary hover:bg-sprint-accent"
                disabled={createRewardMutation.isPending}
              >
                {createRewardMutation.isPending ? 'Criando...' : 'Criar Recompensa'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 