import { useCallback, useEffect, useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { metricasInvestidorApi } from '@/services/api.service';

export interface InvestorMetrics {
  totalInvested: number;
  totalReturn: number;
  returnPercentage: number;
  activeLoans: number;
  portfolioDiversification: {
    goodScore: number;
    excellentScore: number;
  };
}

export const useInvestorMetrics = () => {
  const { user } = useProfile();
  const [metrics, setMetrics] = useState<InvestorMetrics>({
    totalInvested: 0,
    totalReturn: 0,
    returnPercentage: 0,
    activeLoans: 0,
    portfolioDiversification: {
      goodScore: 0,
      excellentScore: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    if (!user?.id) {
      setMetrics((prev) => ({ ...prev, totalInvested: 0 }));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await metricasInvestidorApi.obterPorUsuario(user.id);

      const totalInvested = Number(response.valor_total_investido ?? 0);
      const returnPercentage = Number(response.rentabilidade_media_am ?? 0);
      const totalReturn = totalInvested * (returnPercentage / 100);
      const perfil = response.analise_taxa?.perfil ?? 'equilibrado';
      const activeLoans = Math.max(Math.round((response.risco_medio ?? 0) * 10), 0);
      const goodScore = perfil === 'conservador' ? 70 : perfil === 'moderado' ? 50 : 40;
      const excellentScore = 100 - goodScore;

      setMetrics({
        totalInvested,
        totalReturn,
        returnPercentage,
        activeLoans,
        portfolioDiversification: {
          goodScore,
          excellentScore,
        },
      });
    } catch (err) {
      console.error('Error loading investor metrics:', err);
      const message = err instanceof Error ? err.message : 'Erro ao carregar métricas.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
};
