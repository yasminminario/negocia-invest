import { useCallback, useEffect, useMemo, useState } from 'react';
import { LoanRequest, PropostaResponsePayload, ScoreCredito, Usuario } from '@/types';
import { propostasApi, scoresCreditoApi, usuariosApi } from '@/services/api.service';
import {
    calculateMonthlyPayment,
    calculateTotalAmount,
} from '@/utils/calculations';
import { parseRateRange } from '@/utils/dataMappers';
import { useProfile } from '@/contexts/ProfileContext';

const scoreCategory = (value: number): LoanRequest['borrower']['creditScore'] => {
    if (value >= 800) return 'excellent';
    return 'good';
};

export const useLoanRequests = () => {
    const [requests, setRequests] = useState<LoanRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hiddenIds, setHiddenIds] = useState<string[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const stored = window.localStorage.getItem('negocia:hidden-requests');
            return stored ? (JSON.parse(stored) as string[]) : [];
        } catch (err) {
            console.warn('Não foi possível carregar solicitações ocultas', err);
            return [];
        }
    });

    const persistHidden = useCallback((ids: string[]) => {
        setHiddenIds(ids);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('negocia:hidden-requests', JSON.stringify(ids));
        }
    }, []);

    const hideRequest = useCallback((id: string) => {
        persistHidden(Array.from(new Set([...hiddenIds, id])));
    }, [hiddenIds, persistHidden]);

    const restoreHiddenRequests = useCallback(() => {
        persistHidden([]);
    }, [persistHidden]);

    const { user } = useProfile();
    const currentUserId = user?.id ? Number(user.id) : null;

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const proposals = await propostasApi.listar();
            const borrowerProposals = proposals.filter(
                (proposal) => proposal.autor_tipo === 'tomador' && proposal.status === 'pendente'
            );

            const availableProposals = borrowerProposals.filter((proposal) => {
                if (currentUserId === null) return true;

                const authoredByCurrentUser = proposal.id_autor === currentUserId;
                const directedToCurrentUser = proposal.id_investidor_destino === currentUserId;
                const alreadyLinkedToNegotiation = Boolean(proposal.id_negociacoes);

                return !authoredByCurrentUser && !directedToCurrentUser && !alreadyLinkedToNegotiation;
            });

            if (!availableProposals.length) {
                setRequests([]);
                return;
            }

            const borrowerIds = Array.from(new Set(availableProposals.map((proposal) => proposal.id_autor)));

            const borrowers = await Promise.all(
                borrowerIds.map(async (id) => {
                    try {
                        const [usuario, score] = await Promise.all([
                            usuariosApi.obterPorId(id),
                            scoresCreditoApi.obterPorUsuario(id).catch(() => null),
                        ]);
                        return { usuario, score } as { usuario: Usuario; score: ScoreCredito | null };
                    } catch (err) {
                        console.warn('Não foi possível carregar dados do tomador', id, err);
                        return null;
                    }
                })
            );

            const borrowerMap = new Map<number, { usuario: Usuario; score: ScoreCredito | null }>();
            borrowers.forEach((entry) => {
                if (entry) {
                    borrowerMap.set(entry.usuario.id, entry);
                }
            });

            const mapped: LoanRequest[] = availableProposals.map((proposal: PropostaResponsePayload) => {
                const borrowerData = borrowerMap.get(proposal.id_autor);
                const ranges = parseRateRange(proposal.taxa_sugerida);
                const amount = Number(proposal.valor ?? 0);
                const installments = Number(proposal.prazo_meses ?? 0);
                const interestRate = ranges.average;
                const monthlyPayment = installments
                    ? calculateMonthlyPayment(amount, interestRate, installments)
                    : 0;
                const totalAmount = installments ? calculateTotalAmount(monthlyPayment, installments) : amount;
                const scoreValue = borrowerData?.score?.valor_score ?? 650;

                return {
                    id: String(proposal.id),
                    borrowerId: String(proposal.id_autor),
                    borrower: {
                        id: String(proposal.id_autor),
                        name: borrowerData?.usuario.nome ?? `Tomador #${proposal.id_autor}`,
                        email: borrowerData?.usuario.email ?? '',
                        creditScore: scoreCategory(scoreValue),
                        scoreValue,
                        activeProfile: 'borrower',
                    },
                    amount,
                    interestRate,
                    installments,
                    monthlyPayment,
                    totalAmount,
                    status: proposal.negociavel ? 'negotiable' : 'fixed',
                    createdAt: new Date(proposal.criado_em),
                    acceptsNegotiation: Boolean(proposal.negociavel),
                    suggestedRateMin: ranges.min,
                    suggestedRateMax: ranges.max,
                } satisfies LoanRequest;
            });

            setRequests(mapped);
        } catch (err) {
            console.error('Error fetching loan requests:', err);
            const message = err instanceof Error ? err.message : 'Erro ao carregar solicitações.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const sorted = useMemo(
        () => [...requests].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
        [requests]
    );

    const visibleRequests = useMemo(
        () => sorted.filter((request) => !hiddenIds.includes(request.id)),
        [sorted, hiddenIds]
    );

    return {
        requests: visibleRequests,
        loading,
        error,
        refetch: fetchRequests,
        hideRequest,
        hiddenRequestIds: hiddenIds,
        restoreHiddenRequests,
    };
};
