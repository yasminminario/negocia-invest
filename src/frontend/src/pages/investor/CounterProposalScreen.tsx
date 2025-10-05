import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const CounterProposalScreen: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // negotiation id
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Normally we'd load negotiation details; for mock we prefill a rate
    const [rate, setRate] = useState<number>(18);
    const [description, setDescription] = useState<string>('Contraproposta do investidor');

    const mutation = useMutation({
        mutationFn: (payload: Parameters<typeof api.createCounterProposal>[0]) => api.createCounterProposal(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['negotiations'] });
            toast({ title: 'Contraproposta enviada', description: 'Sua contraproposta foi criada.' });
            navigate('/app/investidor/negociacoes');
        },
    });

    const handleSend = () => {
        const payload = {
            borrowerName: `Resposta à ${id}`,
            investorName: 'Investidor',
            loanId: undefined,
            description,
            rate,
            parentNegotiationId: id,
            status: 'pendente' as const,
        } as any;

        mutation.mutate(payload);
    };

    return (
        <div className="px-4 pt-6 pb-8 min-h-[480px]">
            <h1 className="text-lg font-semibold mb-4">Enviar Contraproposta</h1>

            <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                <div>
                    <label className="block text-sm text-gray-600">Taxa (% a.a.)</label>
                    <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
                </div>

                <div>
                    <label className="block text-sm text-gray-600">Descrição</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
                </div>

                <div className="flex gap-3">
                    <button onClick={handleSend} className="flex-1 rounded-md bg-[var(--primary-color)] text-white px-4 py-3 font-semibold">Enviar</button>
                    <button onClick={() => navigate(-1)} className="flex-1 rounded-md border px-4 py-3">Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default CounterProposalScreen;
