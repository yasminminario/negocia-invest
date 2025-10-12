import { useCallback, useEffect, useMemo, useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { propostasApi } from '@/services/api.service';
import type { PropostaResponsePayload } from '@/types';
import { calculateMonthlyPayment, calculateTotalAmount } from '@/utils/calculations';
import { parseRateRange } from '@/utils/dataMappers';

export interface OwnProposal {
    raw: PropostaResponsePayload;
    amount: number;
    interestRate: number;
    installments: number;
    monthlyPayment: number;
    totalAmount: number;
    createdAt: Date;
}

export const useOwnProposals = (authorType: 'tomador' | 'investidor') => {
    const { user } = useProfile();
    const [proposals, setProposals] = useState<OwnProposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = user?.id ?? null;

    const fetchProposals = useCallback(async () => {
        if (!userId) {
            setProposals([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const allProposals = await propostasApi.listar();
            const ownProposals = allProposals.filter(
                (proposal) => proposal.autor_tipo === authorType && proposal.id_autor === userId,
            );

            const mapped = ownProposals.map((proposal) => {
                const ranges = parseRateRange(proposal.taxa_sugerida);
                const amount = Number(proposal.valor ?? 0);
                const installments = Number(proposal.prazo_meses ?? 0);
                const interestRate = ranges.average;
                const monthlyPayment = installments
                    ? calculateMonthlyPayment(amount, interestRate, installments)
                    : Number(proposal.parcela ?? 0);
                const totalAmount = installments ? calculateTotalAmount(monthlyPayment, installments) : amount;

                return {
                    raw: proposal,
                    amount,
                    interestRate,
                    installments,
                    monthlyPayment,
                    totalAmount,
                    createdAt: new Date(proposal.criado_em),
                } satisfies OwnProposal;
            });

            setProposals(mapped);
        } catch (err) {
            console.error('Erro ao carregar propostas do usuário:', err);
            const message = err instanceof Error ? err.message : 'Erro ao carregar suas propostas.';
            setError(message);
            setProposals([]);
        } finally {
            setLoading(false);
        }
    }, [authorType, userId]);

    useEffect(() => {
        fetchProposals();
    }, [fetchProposals]);

    const sorted = useMemo(
        () => [...proposals].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
        [proposals],
    );

    return { proposals: sorted, loading, error, refetch: fetchProposals };
};
