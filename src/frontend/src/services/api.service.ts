/**
 * Serviço de integração com a API Backend
 * Mapeia os dados do PostgreSQL para os tipos do frontend
 */

import { apiClient, API_ENDPOINTS } from '@/config/api';
import type {
  Usuario,
  ScoreCredito,
  Negociacao,
  Proposta,
  MetricasInvestidor,
  NegociacaoCompleta,
  PropostaCompleta,
} from '@/types';

// ============= USUÁRIOS =============

export const usuariosService = {
  getAll: () => apiClient.get<Usuario[]>(API_ENDPOINTS.usuarios),
  
  getById: (id: number) => apiClient.get<Usuario>(API_ENDPOINTS.usuario(id)),
  
  create: (data: Omit<Usuario, 'id' | 'criado_em'>) =>
    apiClient.post<Usuario>(API_ENDPOINTS.usuarios, data),
  
  update: (id: number, data: Partial<Usuario>) =>
    apiClient.put<Usuario>(API_ENDPOINTS.usuario(id), data),
};

// ============= SCORES DE CRÉDITO =============

export const scoresService = {
  getAll: () => apiClient.get<ScoreCredito[]>(API_ENDPOINTS.scores),
  
  getByUserId: (userId: number) =>
    apiClient.get<ScoreCredito>(API_ENDPOINTS.scoreByUserId(userId)),
  
  update: (userId: number, data: Partial<ScoreCredito>) =>
    apiClient.put<ScoreCredito>(API_ENDPOINTS.scoreByUserId(userId), data),
};

// ============= NEGOCIAÇÕES =============

export const negociacoesService = {
  getAll: () => apiClient.get<Negociacao[]>(API_ENDPOINTS.negociacoes),
  
  getById: (id: number) => apiClient.get<NegociacaoCompleta>(API_ENDPOINTS.negociacao(id)),
  
  getByTomador: (tomadorId: number) =>
    apiClient.get<Negociacao[]>(API_ENDPOINTS.negociacoesByTomador(tomadorId)),
  
  getByInvestidor: (investidorId: number) =>
    apiClient.get<Negociacao[]>(API_ENDPOINTS.negociacoesByInvestidor(investidorId)),
  
  create: (data: {
    id_tomador: number;
    id_investidor: number;
    prazo: number;
    valor: number;
    parcela: number;
  }) => apiClient.post<Negociacao>(API_ENDPOINTS.negociacoes, {
    ...data,
    status: 'pendente',
    quant_propostas: 0,
  }),
  
  update: (id: number, data: Partial<Negociacao>) =>
    apiClient.put<Negociacao>(API_ENDPOINTS.negociacao(id), data),
};

// ============= PROPOSTAS =============

export const propostasService = {
  getAll: () => apiClient.get<Proposta[]>(API_ENDPOINTS.propostas),
  
  getById: (id: number) => apiClient.get<PropostaCompleta>(API_ENDPOINTS.proposta(id)),
  
  getByNegociacao: (negociacaoId: number) =>
    apiClient.get<Proposta[]>(API_ENDPOINTS.propostasByNegociacao(negociacaoId)),
  
  create: (data: {
    id_negociacoes: number;
    id_autor: number;
    autor_tipo: 'tomador' | 'investidor';
    taxa_analisada: string;
    taxa_sugerida: string;
    prazo_meses: number;
    tipo: 'inicial' | 'contraproposta' | 'final';
    parcela: number;
    valor: number;
    justificativa: string;
    negociavel: boolean;
  }) => apiClient.post<Proposta>(API_ENDPOINTS.propostas, {
    ...data,
    status: 'pendente',
  }),
  
  update: (id: number, data: Partial<Proposta>) =>
    apiClient.put<Proposta>(API_ENDPOINTS.proposta(id), data),
  
  accept: (id: number) =>
    apiClient.put<Proposta>(API_ENDPOINTS.proposta(id), { status: 'aceita' }),
  
  reject: (id: number) =>
    apiClient.put<Proposta>(API_ENDPOINTS.proposta(id), { status: 'rejeitada' }),
};

// ============= MÉTRICAS DE INVESTIDOR =============

export const metricasService = {
  getAll: () => apiClient.get<MetricasInvestidor[]>(API_ENDPOINTS.metricas),
  
  getByUsuario: (usuarioId: number) =>
    apiClient.get<MetricasInvestidor>(API_ENDPOINTS.metricasByUsuario(usuarioId)),
  
  update: (usuarioId: number, data: Partial<MetricasInvestidor>) =>
    apiClient.put<MetricasInvestidor>(API_ENDPOINTS.metricasByUsuario(usuarioId), data),
};
