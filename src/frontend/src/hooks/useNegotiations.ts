import { useCallback, useEffect, useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { negociacoesApi, propostasApi, usuariosApi } from '@/services/api.service';
import type { NegociacaoResponse, PropostaResponsePayload, Usuario } from '@/types';
import { parseRateRange } from '@/utils/dataMappers';

export type NegotiationWithUsers = NegociacaoResponse & {
  tomador?: Usuario | null;
  investidor?: Usuario | null;
};

export const useNegotiations = (userType: 'borrower' | 'investor') => {
  const { user } = useProfile();
  const [negotiations, setNegotiations] = useState<NegotiationWithUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNegotiations = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const negociacoes = await negociacoesApi.listar();
      const filtered = negociacoes.filter((item) =>
        userType === 'borrower' ? item.id_tomador === user.id : item.id_investidor === user.id
      );

      const participantIds = Array.from(
        new Set(filtered.flatMap((item) => [item.id_tomador, item.id_investidor]))
      );

      const participants = await Promise.all(
        participantIds.map(async (id) => {
          try {
            const perfil = await usuariosApi.obterPorId(id);
            return { id, perfil } as const;
          } catch (participantError) {
            console.error(`Erro ao carregar usuário ${id}:`, participantError);
            return { id, perfil: null } as const;
          }
        })
      );

      const participantesPorId = participants.reduce<Record<number, Usuario | null>>((acc, entry) => {
        acc[entry.id] = entry.perfil;
        return acc;
      }, {});

      const propostasPorNegociacao = await Promise.all(
        filtered.map(async (negociacao) => {
          try {
            return await propostasApi.listar(negociacao.id);
          } catch (proposalError) {
            console.warn(`Erro ao carregar propostas da negociação ${negociacao.id}:`, proposalError);
            return [] as PropostaResponsePayload[];
          }
        }),
      );

      const enriquecidas = filtered.map((item, index) => {
        const propostas = propostasPorNegociacao[index] ?? [];
        const ordenadas = [...propostas].sort(
          (a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime(),
        );
        const referencia = ordenadas[0] ?? null;
        const faixa = referencia?.taxa_sugerida ? parseRateRange(referencia.taxa_sugerida) : null;

        const taxaAtual = item.taxa ?? faixa?.average ?? null;
        const prazoAtual = item.prazo ?? referencia?.prazo_meses ?? null;
        const valorAtual = item.valor ?? referencia?.valor ?? null;
        const parcelaAtual = item.parcela ?? referencia?.parcela ?? null;

        return {
          ...item,
          taxa: taxaAtual,
          prazo: prazoAtual,
          valor: valorAtual,
          parcela: parcelaAtual,
          tomador: participantesPorId[item.id_tomador] ?? null,
          investidor: participantesPorId[item.id_investidor] ?? null,
        };
      });

      setNegotiations(enriquecidas);
    } catch (err) {
      console.error('Error fetching negotiations:', err);
      const message = err instanceof Error ? err.message : 'Erro ao carregar negociações.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user?.id, userType]);

  useEffect(() => {
    fetchNegotiations();
  }, [fetchNegotiations]);

  return { negotiations, loading, error, refetch: fetchNegotiations };
};
