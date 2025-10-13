import { useCallback, useEffect, useMemo, useState } from 'react';
import { LoanOffer, ScoreCredito, Usuario } from '@/types';
import { propostasApi, scoresCreditoApi, usuariosApi } from '@/services/api.service';
import {
  calculateMonthlyPayment,
  calculateTotalAmount,
} from '@/utils/calculations';
import { parseRateRange } from '@/utils/dataMappers';
import { useProfile } from '@/contexts/ProfileContext';

const deriveCreditScore = (scoreValue: number): LoanOffer['investor']['creditScore'] => {
  if (scoreValue >= 800) return 'excellent';
  return 'good';
};

export const useOffers = () => {
  const [offers, setOffers] = useState<LoanOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem('negocia:hidden-offers');
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch (err) {
      console.warn('Não foi possível carregar ofertas ocultas', err);
      return [];
    }
  });

  const persistHidden = useCallback((ids: string[]) => {
    setHiddenIds(ids);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('negocia:hidden-offers', JSON.stringify(ids));
    }
  }, []);

  const hideOffer = useCallback(
    (id: string) => {
      persistHidden(Array.from(new Set([...hiddenIds, id])));
    },
    [hiddenIds, persistHidden],
  );

  const restoreHiddenOffers = useCallback(() => {
    persistHidden([]);
  }, [persistHidden]);

  const { user } = useProfile();
  const currentUserId = user?.id ? Number(user.id) : null;

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const proposals = await propostasApi.listar();
      const investorProposals = proposals.filter(
        (proposal) => proposal.autor_tipo === 'investidor' && proposal.status === 'pendente'
      );

      const availableProposals = investorProposals.filter((proposal) => {
        if (currentUserId === null) return true;

        const authoredByCurrentUser = proposal.id_autor === currentUserId;
        const directedToCurrentUser = proposal.id_tomador_destino === currentUserId;
        const alreadyLinkedToNegotiation = Boolean(proposal.id_negociacoes);

        return !authoredByCurrentUser && !directedToCurrentUser && !alreadyLinkedToNegotiation;
      });

      if (!availableProposals.length) {
        setOffers([]);
        return;
      }

      const investorIds = Array.from(new Set(availableProposals.map((proposal) => proposal.id_autor)));

      const investors = await Promise.all(
        investorIds.map(async (id) => {
          try {
            const [usuario, score] = await Promise.all([
              usuariosApi.obterPorId(id),
              scoresCreditoApi.obterPorUsuario(id).catch(() => null),
            ]);
            return { usuario, score } as { usuario: Usuario; score: ScoreCredito | null };
          } catch (err) {
            console.warn('Não foi possível carregar dados do investidor', id, err);
            return null;
          }
        })
      );

      const investorMap = new Map<number, { usuario: Usuario; score: ScoreCredito | null }>();
      investors.forEach((entry) => {
        if (entry) {
          investorMap.set(entry.usuario.id, entry);
        }
      });

      const mappedOffers: LoanOffer[] = availableProposals.map((proposal) => {
        const investorData = investorMap.get(proposal.id_autor);
        const ranges = parseRateRange(proposal.taxa_sugerida);
        const amount = Number(proposal.valor ?? 0);
        const installments = Number(proposal.prazo_meses ?? 0);
        const monthlyPayment = installments ? calculateMonthlyPayment(amount, ranges.average, installments) : 0;
        const totalAmount = installments ? calculateTotalAmount(monthlyPayment, installments) : amount;

        const scoreValue = investorData?.score?.valor_score ?? 700;

        return {
          id: String(proposal.id),
          investorId: String(proposal.id_autor),
          investor: {
            id: String(proposal.id_autor),
            name: investorData?.usuario.nome ?? `Investidor #${proposal.id_autor}`,
            email: investorData?.usuario.email ?? '',
            creditScore: deriveCreditScore(scoreValue),
            scoreValue,
            activeProfile: 'investor',
          },
          amount,
          interestRate: ranges.average,
          installments,
          monthlyPayment,
          totalAmount,
          status: proposal.negociavel ? 'negotiable' : 'fixed',
          createdAt: new Date(proposal.criado_em),
          acceptsNegotiation: Boolean(proposal.negociavel),
          suggestedRateMin: ranges.min,
          suggestedRateMax: ranges.max,
        } satisfies LoanOffer;
      });

      setOffers(mappedOffers);
    } catch (err) {
      console.error('Error fetching offers:', err);
      const message = err instanceof Error ? err.message : 'Erro ao carregar ofertas.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const sortedOffers = useMemo(
    () => [...offers].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    [offers]
  );

  const visibleOffers = useMemo(
    () => sortedOffers.filter((offer) => !hiddenIds.includes(offer.id)),
    [sortedOffers, hiddenIds],
  );

  return {
    offers: visibleOffers,
    loading,
    error,
    refetch: fetchOffers,
    hideOffer,
    hiddenOfferIds: hiddenIds,
    restoreHiddenOffers,
  };
};
