import { apiClient } from '@/config/api';
import type {
  NegociacaoResponse,
  NegociacaoUpdatePayload,
  PropostaCreatePayload,
  PropostaResponsePayload,
  Usuario,
  ScoreCredito,
  MetricasInvestidor,
} from '@/types';

// ============= NEGOCIAÇÕES =============

export const negociacoesApi = {
  listar: (status?: string) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiClient.get<NegociacaoResponse[]>(`/negociacoes${query}`);
  },

  obterPorId: (id: number) => apiClient.get<NegociacaoResponse>(`/negociacoes/${id}`),

  listarPorTomador: (tomadorId: number, status?: string) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiClient.get<NegociacaoResponse[]>(`/negociacoes/tomador/${tomadorId}${query}`);
  },

  listarPorInvestidor: (investidorId: number, status?: string) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiClient.get<NegociacaoResponse[]>(`/negociacoes/investidor/${investidorId}${query}`);
  },

  atualizar: (id: number, payload: NegociacaoUpdatePayload) =>
    apiClient.put<NegociacaoResponse>(`/negociacoes/${id}`, payload),
};

// ============= PROPOSTAS =============

export const propostasApi = {
  listar: (idNegociacoes?: number) => {
    const query = idNegociacoes ? `?id_negociacoes=${idNegociacoes}` : '';
    return apiClient.get<PropostaResponsePayload[]>(`/propostas${query}`);
  },

  criar: (payload: PropostaCreatePayload) =>
    apiClient.post<PropostaResponsePayload>('/propostas', payload),

  obterPorId: (id: number) => apiClient.get<PropostaResponsePayload>(`/propostas/${id}`),
};

// ============= SCORE & RECOMENDAÇÕES =============

export const scoreApi = {
  calcularScoreFinal: (userId: number) =>
    apiClient.post(`/score/${userId}`, {}),
};

export const recomendacaoApi = {
  recomendarTaxa: (params: {
    user_id: number;
    valor: number;
    prazo: number;
    score: number;
    tipo?: string;
  }) => {
    const search = new URLSearchParams({
      user_id: String(params.user_id),
      valor: String(params.valor),
      prazo: String(params.prazo),
      score: String(params.score),
    });

    if (params.tipo) {
      search.set('tipo', params.tipo);
    }

    return apiClient.get(`/recomendacao/taxa?${search.toString()}`);
  },

  listarRecomendacoesInternas: (userId: number, perfil: string) =>
    apiClient.get(`/internal/recommendations/solicitacoes/${userId}?perfil=${encodeURIComponent(perfil)}`),
};

// ============= USUÁRIOS, SCORE E MÉTRICAS =============

export const usuariosApi = {
  listar: () => apiClient.get<Usuario[]>('/usuarios'),
  obterPorId: (id: number) => apiClient.get<Usuario>(`/usuarios/${id}`),
};

export const scoresCreditoApi = {
  obterPorUsuario: (userId: number) => apiClient.get<ScoreCredito>(`/scores_credito/usuario/${userId}`),
};

export const metricasInvestidorApi = {
  obterPorUsuario: (userId: number) => apiClient.get<MetricasInvestidor>(`/metricas_investidor/usuario/${userId}`),
};
