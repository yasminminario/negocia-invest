/**
 * Mapeadores de dados entre o formato do banco PostgreSQL e o frontend
 */

import type {
  Usuario,
  ScoreCredito,
  Negociacao,
  Proposta,
  NegociacaoCompleta,
  User,
  Negotiation,
  NegotiationProposal,
  CreditScore,
  ProfileType,
} from '@/types';

export interface RateRange {
  min: number;
  max: number;
  average: number;
}

// ============= USUÁRIO =============

/**
 * Converte Usuario (banco) para User (frontend)
 */
export const mapUsuarioToUser = (
  usuario: Usuario,
  score: ScoreCredito,
  activeProfile: ProfileType = 'borrower'
): User => {
  return {
    id: usuario.id.toString(),
    name: usuario.nome,
    email: usuario.email,
    creditScore: getCreditScoreCategory(score.valor_score),
    scoreValue: score.valor_score,
    activeProfile,
    avatarUrl: undefined, // Pode ser adicionado futuramente
  };
};

/**
 * Determina a categoria do score de crédito
 */
const getCreditScoreCategory = (score: number): CreditScore => {
  if (score >= 800) return 'excellent';
  if (score >= 600) return 'good';
  return 'good'; // Default
};

// ============= NEGOCIAÇÃO =============

/**
 * Converte Negociacao (banco) para Negotiation (frontend)
 */
export const mapNegociacaoToNegotiation = (
  negociacao: NegociacaoCompleta
): Negotiation => {
  const proposals = negociacao.propostas
    .map((p) => mapPropostaToNegotiationProposal(p))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const lastProposal = proposals[proposals.length - 1];
  const currentRate = negociacao.taxa || lastProposal?.proposedRate || 0;

  return {
    id: negociacao.id.toString(),
    loanRequestId: undefined,
    loanOfferId: undefined,
    borrowerId: negociacao.id_tomador.toString(),
    borrowerName: negociacao.tomador.nome,
    borrowerScore: negociacao.score_tomador.valor_score,
    investorId: negociacao.id_investidor.toString(),
    investorName: negociacao.investidor.nome,
    investorScore: negociacao.score_investidor.valor_score,
    amount: negociacao.valor,
    installments: negociacao.prazo,
    currentRate,
    currentProposer: lastProposal?.proposerType || 'borrower',
    proposals,
    status: negociacao.status,
    createdAt: new Date(negociacao.criado_em),
    expiresAt: calculateExpirationDate(negociacao.criado_em),
    suggestedRateMin: extractSuggestedRateMin(negociacao.propostas),
    suggestedRateMax: extractSuggestedRateMax(negociacao.propostas),
  };
};

/**
 * Converte Proposta (banco) para NegotiationProposal (frontend)
 */
export const mapPropostaToNegotiationProposal = (
  proposta: Proposta
): NegotiationProposal => {
  return {
    id: proposta.id.toString(),
    proposerId: proposta.id_autor.toString(),
    proposerType: proposta.autor_tipo === 'tomador' ? 'borrower' : 'investor',
    proposedRate: parseRateFromString(proposta.taxa_sugerida),
    message: proposta.justificativa,
    createdAt: new Date(proposta.criado_em),
    monthlyPayment: proposta.parcela,
    totalAmount: proposta.valor * proposta.prazo_meses,
  };
};

// ============= HELPERS =============

/**
 * Calcula a data de expiração (48 horas após criação)
 */
const calculateExpirationDate = (createdAt: Date | string): Date => {
  const date = new Date(createdAt);
  date.setHours(date.getHours() + 48);
  return date;
};

/**
 * Extrai a taxa mínima sugerida das propostas
 */
const extractSuggestedRateMin = (propostas: Proposta[]): number => {
  if (!propostas.length) return 1.5;

  const rates = propostas.map((p) => parseRateFromString(p.taxa_analisada, 'min'));
  return Math.min(...rates);
};

/**
 * Extrai a taxa máxima sugerida das propostas
 */
const extractSuggestedRateMax = (propostas: Proposta[]): number => {
  if (!propostas.length) return 2.5;

  const rates = propostas.map((p) => parseRateFromString(p.taxa_analisada, 'max'));
  return Math.max(...rates);
};

/**
 * Parse de string de taxa (ex: "1.5-2.0") para número
 */
export const parseRateRange = (value?: string | null): RateRange => {
  if (!value) {
    return { min: 0, max: 0, average: 0 };
  }

  const sanitized = value.replace('%', '').trim();

  if (!sanitized) {
    return { min: 0, max: 0, average: 0 };
  }

  const toNumber = (raw: string): number => {
    const parsed = parseFloat(raw.replace('%', '').trim());
    return Number.isFinite(parsed) ? parsed : 0;
  };

  let min = 0;
  let max = 0;

  if (sanitized.includes('-')) {
    const [rawMin, rawMax] = sanitized.split('-');
    min = toNumber(rawMin);
    max = toNumber(rawMax);
    if (!Number.isFinite(max)) {
      max = min;
    }
  } else {
    min = toNumber(sanitized);
    max = min;
  }

  const average = Number(((min + max) / 2).toFixed(4));

  return { min, max, average };
};

export const parseRateFromString = (
  rateString: string,
  part: 'min' | 'max' | 'avg' = 'avg'
): number => {
  const { min, max, average } = parseRateRange(rateString);

  if (part === 'min') return min;
  if (part === 'max') return max;
  return average;
};

/**
 * Formata taxa como string de range (ex: 1.5 -> "1.5-1.5")
 */
export const formatRateAsRange = (rate: number): string => {
  return `${rate.toFixed(1)}-${rate.toFixed(1)}`;
};

/**
 * Formata taxa como string de range com margem (ex: 1.5 -> "1.3-1.7")
 */
export const formatRateAsRangeWithMargin = (
  rate: number,
  margin: number = 0.2
): string => {
  const min = Math.max(0.5, rate - margin);
  const max = Math.min(5.0, rate + margin);
  return `${min.toFixed(1)}-${max.toFixed(1)}`;
};
