import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { calculateMonthly, totalPayment } from '@/lib/loan';
import { ActionButton } from '@/components/Sim/ActionButton';

const NegotiationStartScreen: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    // Mocked current offer
    const offer = {
        id: id ?? 'of-1',
        principal: 8000,
        months: 12,
        rate: 18, // a.a.
    };

    const [proposedRate, setProposedRate] = useState<number>(16);
    const [description, setDescription] = useState<string>('');

    const monthlyOriginal = useMemo(() => calculateMonthly(offer.principal, offer.rate, offer.months), [offer]);
    const monthlyProposed = useMemo(() => calculateMonthly(offer.principal, proposedRate, offer.months), [offer.principal, proposedRate, offer.months]);
    const totalOriginal = useMemo(() => totalPayment(monthlyOriginal, offer.months), [monthlyOriginal, offer.months]);
    const totalProposed = useMemo(() => totalPayment(monthlyProposed, offer.months), [monthlyProposed, offer.months]);
    const savings = useMemo(() => Math.max(0, totalOriginal - totalProposed), [totalOriginal, totalProposed]);

    const mutation = useMutation({
        mutationFn: (payload: Parameters<typeof api.createNegotiation>[0]) => api.createNegotiation(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['negotiations'] });
            navigate('/app/tomador/negociacoes');
        },
    });

    const handleSend = () => {
        const payload = {
            borrowerName: 'Carlos Silva',
            investorName: `Oferta ${offer.id}`,
            loanId: offer.id,
            description: description || undefined,
            rate: proposedRate,
            status: 'pendente' as const,
        };

        mutation.mutate(payload as any);
    };

    const suggestedRange: [number, number] = [12, 18];

    return (
        <div className="px-4 pt-6 pb-8 min-h-[480px]">
            <h1 className="text-lg font-semibold mb-4">Negociação</h1>

            <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-xs text-gray-500">Oferta do investidor</div>
                            <div className="text-xl font-bold">{offer.rate}% a.a.</div>
                        </div>

                        <div>
                            <div className="text-xs text-gray-500">Sua proposta</div>
                            <div className="text-xl font-bold">{proposedRate}% a.a.</div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded">
                            <div className="text-xs text-gray-500">Parcela</div>
                            <div className="text-lg font-bold">{monthlyOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <div className="text-xs text-gray-500">Parcela proposta</div>
                            <div className="text-lg font-bold">{monthlyProposed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm text-gray-600">Ajuste a taxa</label>
                        <input type="range" min={0} max={40} step={0.1} value={proposedRate} onChange={(e) => setProposedRate(Number(e.target.value))} className="w-full mt-2" />
                        <div className="mt-2 text-sm text-gray-500">Zona sugerida: <span className="font-semibold">{suggestedRange[0]}%</span> - <span className="font-semibold">{suggestedRange[1]}%</span></div>
                    </div>

                    <div className="mt-4 p-3 rounded border border-green-100 bg-gradient-to-r from-green-50 to-white text-green-800">
                        <div className="text-xs">Economia estimada</div>
                        <div className="text-2xl font-bold">{savings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        <div className="text-xs text-gray-400 mt-1">Comparado com a oferta original</div>
                    </div>

                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-700">Descrição da proposta</label>
                    <textarea maxLength={300} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 p-3 text-sm" placeholder="Explique por que sua proposta é justa (opcional)" />
                    <div className="text-xs text-gray-400 mt-1">{description.length}/300</div>
                </div>

                <div className="flex gap-3">
                    <ActionButton onClick={handleSend} className="flex-1">Enviar negociação</ActionButton>
                    <ActionButton variant="secondary" onClick={() => navigate(-1)} className="flex-1">Cancelar</ActionButton>
                </div>
            </div>
        </div>
    );
};

export default NegotiationStartScreen;
