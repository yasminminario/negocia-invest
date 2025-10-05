import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { calculateMonthly, totalPayment } from '@/lib/loan';
import { useToast } from '@/hooks/use-toast';

const NegotiationDetailsScreen: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // In a real app we'd fetch the negotiation by id; using a mock here
    const negotiation = {
        id: id ?? 'neg-1',
        borrowerName: 'Carlos Silva',
        investorName: 'QI Tech',
        amount: 8000,
        rate: 16, // a.a.
        status: 'pendente' as const,
        description: 'Preciso reduzir a parcela em função de fluxo de caixa.'
    };

    const originalRate = 18;
    const months = 12;

    const monthlyOriginal = useMemo(() => calculateMonthly(negotiation.amount, originalRate, months), [negotiation.amount]);
    const monthlyProposal = useMemo(() => calculateMonthly(negotiation.amount, negotiation.rate, months), [negotiation.amount, negotiation.rate]);
    const totalOriginal = useMemo(() => totalPayment(monthlyOriginal, months), [monthlyOriginal]);
    const totalProposal = useMemo(() => totalPayment(monthlyProposal, months), [monthlyProposal]);

    const profitDifference = totalProposal - totalOriginal; // from investidor perspective

    const acceptMutation = useMutation({
        mutationFn: (nid: string) => api.acceptNegotiation(nid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['negotiations'] });
            queryClient.invalidateQueries({ queryKey: ['loans'] });
            toast({ title: 'Negociação aceita', description: 'A negociação foi aceita com sucesso.' });
            navigate('/app/investidor/negociacoes');
        },
    });

    const rejectMutation = useMutation({
        mutationFn: (nid: string) => api.rejectNegotiation(nid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['negotiations'] });
            toast({ title: 'Negociação rejeitada', description: 'A negociação foi rejeitada com sucesso.' });
            navigate('/app/investidor/negociacoes');
        },
    });

    const handleAccept = () => {
        if (negotiation.status !== 'pendente') {
            toast({ title: 'Ação inválida', description: 'Esta negociação já foi processada.' });
            return;
        }
        acceptMutation.mutate(negotiation.id);
    };

    const handleReject = () => {
        if (negotiation.status !== 'pendente') {
            toast({ title: 'Ação inválida', description: 'Esta negociação já foi processada.' });
            return;
        }
        rejectMutation.mutate(negotiation.id);
    };

    return (
        <div className="px-4 pt-6 pb-8 min-h-[480px]">
            <h1 className="text-lg font-semibold mb-4">Detalhes da Negociação</h1>

            <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-xs text-gray-500">Sua proposta (original)</div>
                            <div className="text-xl font-bold">{originalRate}% a.a.</div>
                        </div>

                        <div>
                            <div className="text-xs text-gray-500">Oferta do tomador</div>
                            <div className="text-xl font-bold">{negotiation.rate}% a.a.</div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded">
                            <div className="text-xs text-gray-500">Parcela original</div>
                            <div className="text-lg font-bold">{monthlyOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <div className="text-xs text-gray-500">Parcela proposta</div>
                            <div className="text-lg font-bold">{monthlyProposal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-500">Descrição do tomador</div>
                    <div className="mt-1 p-3 bg-gray-50 rounded text-sm">{negotiation.description}</div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Diferença no lucro estimado</div>
                    <div className={`text-2xl font-bold ${profitDifference < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profitDifference < 0 ? `Menos ${Math.abs(profitDifference).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : `Mais ${profitDifference.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={handleAccept} disabled={acceptMutation.status === 'pending'} className="flex-1 rounded-md bg-[var(--primary-color)] text-white px-4 py-3 font-semibold">{acceptMutation.status === 'pending' ? 'Processando...' : 'Aceitar proposta'}</button>
                    <button onClick={handleReject} disabled={rejectMutation.status === 'pending'} className="flex-1 rounded-md border px-4 py-3">{rejectMutation.status === 'pending' ? 'Processando...' : 'Recusar'}</button>
                    <button onClick={() => navigate(`/app/investidor/contrapropor/${negotiation.id}`)} className="flex-1 rounded-md border border-[var(--primary-color)] text-[var(--primary-color)] px-4 py-3">Enviar contraproposta</button>
                </div>
            </div>
        </div>
    );
};

export default NegotiationDetailsScreen;
