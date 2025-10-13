/**
 * Configuração da API Backend
 * 
 * Backend rodando em: http://localhost:8000
 * Database: PostgreSQL (negociaai)
 * Port: 5432
 */

// URL base da API - ajustar conforme ambiente
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Endpoints da API que existem no backend (FastAPI)
export const API_ENDPOINTS = {
  // Usuários
  usuarios: '/usuarios',
  usuario: (id: number) => `/usuarios/${id}`,

  // Scores de crédito (consulta individual e recálculo)
  scoreByUserId: (userId: number) => `/scores_credito/usuario/${userId}`,
  recalcularScore: (userId: number) => `/score/${userId}`,
  recalcularTodosScores: '/score/recalcular',

  // Negociações
  negociacoes: '/negociacoes',
  negociacao: (id: number) => `/negociacoes/${id}`,
  negociacoesPorTomador: (tomadorId: number) => `/negociacoes/tomador/${tomadorId}`,
  negociacoesPorInvestidor: (investidorId: number) => `/negociacoes/investidor/${investidorId}`,

  // Propostas
  propostas: '/propostas',
  proposta: (id: number) => `/propostas/${id}`,

  // Métricas de investidor
  metricasPorUsuario: (usuarioId: number) => `/metricas_investidor/usuario/${usuarioId}`,

  // Recomendações
  recomendacaoTaxa: '/recomendacao/taxa',
  recomendacoesInternas: (userId: number) => `/internal/recommendations/solicitacoes/${userId}`,
} as const;

// Headers padrão
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

// Helper para fazer requisições
export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },
};
