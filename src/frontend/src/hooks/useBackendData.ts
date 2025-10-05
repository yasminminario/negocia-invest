/**
 * Hook para gerenciar dados do backend PostgreSQL
 * Quando ativado, substitui os mockData por dados reais da API
 */

import { useState, useEffect } from 'react';
import { negociacoesService, usuariosService, scoresService } from '@/services/api.service';
import { mapNegociacaoToNegotiation } from '@/utils/dataMappers';
import type { Negotiation, NegociacaoCompleta } from '@/types';

// Flag para alternar entre mock e backend real
const USE_BACKEND = false; // Alterar para true quando o backend estiver rodando

interface UseBackendDataOptions {
  autoFetch?: boolean;
  userId?: number;
  userType?: 'tomador' | 'investidor';
}

export const useBackendNegotiations = (options: UseBackendDataOptions = {}) => {
  const { autoFetch = false, userId, userType } = options;
  
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNegotiations = async () => {
    if (!USE_BACKEND) {
      console.info('Backend integration disabled. Using mock data.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let negociacoes: NegociacaoCompleta[] = [];

      if (userId && userType === 'tomador') {
        const data = await negociacoesService.getByTomador(userId);
        // Buscar dados completos para cada negociação
        negociacoes = await Promise.all(
          data.map((neg) => negociacoesService.getById(neg.id))
        );
      } else if (userId && userType === 'investidor') {
        const data = await negociacoesService.getByInvestidor(userId);
        negociacoes = await Promise.all(
          data.map((neg) => negociacoesService.getById(neg.id))
        );
      } else {
        // Buscar todas as negociações (admin view)
        const data = await negociacoesService.getAll();
        negociacoes = await Promise.all(
          data.map((neg) => negociacoesService.getById(neg.id))
        );
      }

      const mapped = negociacoes.map(mapNegociacaoToNegotiation);
      setNegotiations(mapped);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar negociações';
      setError(message);
      console.error('Backend error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchNegotiations();
    }
  }, [autoFetch, userId, userType]);

  return {
    negotiations,
    loading,
    error,
    refetch: fetchNegotiations,
    isUsingBackend: USE_BACKEND,
  };
};

export const useBackendUser = (userId: number) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!USE_BACKEND) return;

    try {
      setLoading(true);
      const [usuario, score] = await Promise.all([
        usuariosService.getById(userId),
        scoresService.getByUserId(userId),
      ]);

      setUser({ usuario, score });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar usuário');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return { user, loading, error, refetch: fetchUser };
};
