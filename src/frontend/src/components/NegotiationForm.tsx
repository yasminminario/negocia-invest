import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const NegotiationForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [rate, setRate] = useState<string>('1.5');
  const [description, setDescription] = useState<string>('');

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof api.createNegotiation>[0]) => api.createNegotiation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['negotiations'] });
      toast({ title: 'Negociação criada', description: 'Sua proposta foi enviada com sucesso.' });
      navigate(-1);
    },
    onError: (err) => {
      console.error('Erro ao criar negociação', err);
      toast({ title: 'Erro', description: 'Não foi possível enviar a proposta.' });
    },
  });

  const isLoading = mutation.status === 'pending';
  const isError = mutation.status === 'error';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      borrowerName: 'Carlos Silva',
      investorName: `Oferta ${id ?? ''}`,
      loanId: id ?? undefined,
      description: description || undefined,
      rate: Number(rate) || 0,
      status: 'pendente' as const,
    };

    mutation.mutate(payload as any);
  };

  return (
    <div className="min-h-[400px] w-full px-4 pt-6">
      <h1 className="text-lg font-semibold text-black mb-4">Iniciar Negociação</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Taxa (% a.m.)</label>
          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Descrição (opcional)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" />
        </div>

        {isError ? <div className="text-sm text-red-600">Ocorreu um erro ao enviar.</div> : null}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-[var(--primary-color,#57D9FF)] px-6 py-3 text-sm font-semibold text-white shadow-md"
          >
            {isLoading ? 'Enviando...' : 'Enviar proposta'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border px-6 py-3 text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NegotiationForm;

