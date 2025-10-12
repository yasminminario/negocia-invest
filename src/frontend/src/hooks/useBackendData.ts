/**
 * Hook para gerenciar dados do backend PostgreSQL
 * Quando ativado, substitui os mockData por dados reais da API
 */

import { useState, useEffect, useCallback } from 'react';
import { mapNegociacaoToNegotiation } from '@/utils/dataMappers';
import type { Negotiation, NegociacaoCompleta, Usuario, ScoreCredito } from '@/types';

const backendNotConfigured = async <T>(): Promise<T> => {
  throw new Error('Serviço de backend não configurado.');
};

const negociacoesService = {
  getByTomador: (_id: number) => backendNotConfigured<NegociacaoCompleta[]>(),
  getByInvestidor: (_id: number) => backendNotConfigured<NegociacaoCompleta[]>(),
  getAll: () => backendNotConfigured<NegociacaoCompleta[]>(),
  getById: (_id: number) => backendNotConfigured<NegociacaoCompleta>(),
};

const usuariosService = {
  getById: (_id: number) => backendNotConfigured<Usuario>(),
};

const scoresService = {
  getByUserId: (_id: number) => backendNotConfigured<ScoreCredito | null>(),
};

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

  const fetchNegotiations = useCallback(async () => {
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
  }, [userId, userType]);

  useEffect(() => {
    if (autoFetch) {
      fetchNegotiations();
    }
  }, [autoFetch, fetchNegotiations]);

  return {
    negotiations,
    loading,
    error,
    refetch: fetchNegotiations,
    isUsingBackend: USE_BACKEND,
  };
};

export const useBackendUser = (userId: number) => {
  const [user, setUser] = useState<{ usuario: Usuario; score: ScoreCredito | null } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!USE_BACKEND) return;

    try {
      setLoading(true);
      const [usuario, score] = await Promise.all([
        usuariosService.getById(userId),
        scoresService.getByUserId(userId),
      ]);

      setUser({ usuario, score });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar usuário';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

  return { user, loading, error, refetch: fetchUser };
};
