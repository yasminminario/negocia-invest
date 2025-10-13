// ============= CORE TYPES =============

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'x-large';
  fontWeight: 'normal' | 'bold';
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  highContrast: boolean;
  reducedMotion: boolean;
}

export type ProfileType = 'borrower' | 'investor';

export type CreditScore = 'good' | 'excellent';

// Status para ofertas/solicitações (antes de aceite)
export type OfferStatus = 'negotiable' | 'fixed';

// Status para negociações (mapeado do banco)
export type NegotiationStatus = 'em_negociacao' | 'em_andamento' | 'finalizada' | 'cancelada' | 'pendente' | 'expirada';

// Status para empréstimos já aceitos/ativos
export type LoanStatus = 'active' | 'concluded' | 'cancelled';

// Status para propostas (do banco)
export type ProposalStatus = 'pendente' | 'em_analise' | 'aceita' | 'rejeitada' | 'cancelada';

// Tipo de autor da proposta (do banco)
export type AutorTipo = 'tomador' | 'investidor';

// Tipo de proposta (do banco)
export type ProposalType = 'inicial' | 'contraproposta' | 'final';

// ============= DATABASE TYPES (PostgreSQL) =============

// Tabela: usuarios
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  saldo_cc: number;
  cpf_mascarado?: string;
  celular_mascarado?: string;
  iniciais?: string;
  criado_em: string;
}

// Tabela: scores_credito
export interface ScoreCredito {
  id: number;
  id_usuarios: number;
  valor_score: number; // 0-1000
  atualizado_em: Date;
  analise: {
    tempo_na_plataforma_meses: number;
    emprestimos_contratados: number;
    emprestimos_quitados: number;
    emprestimos_inadimplentes: number;
    taxa_inadimplencia: number;
    media_taxa_juros_paga: number;
    media_prazo_contratado: number;
    renda_mensal: number;
    endividamento_estimado: number;
    propostas_realizadas: number;
    propostas_aceitas: number;
    media_tempo_negociacao_dias: number;
  };
  risco: number; // 0-1
}

export interface ScoreCalculoDetalhado {
  score: ScoreCredito;
  score_modelo: number;
  score_serasa: number;
  prob_default: number;
  analise: ScoreCredito['analise'];
}

// Tabela: negociacoes
export interface Negociacao {
  id: number;
  id_tomador: number;
  id_investidor: number;
  status: NegotiationStatus;
  criado_em: Date;
  atualizado_em: Date;
  taxa: number | null;
  quant_propostas: number;
  prazo: number; // meses
  valor: number;
  parcela: number;
  hash_onchain: string | null;
  contrato_tx_hash: string | null;
  assinado_em: Date | null;
}

// Tabela: propostas
export interface Proposta {
  id: number;
  id_negociacoes: number;
  id_autor: number;
  autor_tipo: AutorTipo;
  taxa_analisada: string; // ex: "1.5-2.0"
  taxa_sugerida: string; // ex: "1.0-3.0"
  prazo_meses: number;
  criado_em: Date;
  tipo: ProposalType;
  status: ProposalStatus;
  parcela: number;
  valor: number;
  justificativa: string;
  negociavel: boolean;
}

// ============= BACKEND API RESPONSES =============

export interface NegociacaoResponse {
  id: number;
  id_tomador: number;
  id_investidor: number;
  prazo: number | null;
  valor: number | null;
  parcela: number | null;
  status: string;
  taxa: number | null;
  quant_propostas: number | null;
  hash_onchain: string | null;
  contrato_tx_hash: string | null;
  assinado_em: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface NegociacaoUpdatePayload {
  id_tomador?: number | null;
  id_investidor?: number | null;
  prazo?: number | null;
  valor?: number | null;
  parcela?: number | null;
  status?: string | null;
  taxa?: number | null;
  quant_propostas?: number | null;
  hash_onchain?: string | null;
  contrato_tx_hash?: string | null;
  assinado_em?: string | null;
}

export interface PropostaCreatePayload {
  id_negociacoes?: number | null;
  id_autor: number;
  autor_tipo: 'tomador' | 'investidor';
  taxa_analisada: string;
  taxa_sugerida: string;
  prazo_meses: number;
  tipo?: string | null;
  status: string;
  parcela?: number | null;
  valor?: number | null;
  negociavel: boolean;
  justificativa?: string | null;
  id_tomador_destino?: number | null;
  id_investidor_destino?: number | null;
}

export interface PropostaResponsePayload extends PropostaCreatePayload {
  id: number;
  criado_em: string;
}

// Tabela: metricas_investidor
export interface MetricasInvestidor {
  id: number;
  id_usuarios: number;
  valor_total_investido: number;
  rentabilidade_media_am: number;
  patrimonio: number;
  risco_medio: number;
  analise_taxa: {
    taxa_preferida: string;
    perfil: string;
  };
  atualizado_em: Date;
}

// ============= USER & AUTH (Compatibilidade) =============

export interface User {
  id: string;
  name: string;
  email: string;
  creditScore: CreditScore;
  scoreValue: number; // 0-1000
  activeProfile: ProfileType;
  avatarUrl?: string;
  balance?: number; // Saldo em conta corrente
  accessibilitySettings?: AccessibilitySettings;
}

// ============= LOAN REQUEST (Solicitação) =============

export interface LoanRequest {
  id: string;
  borrowerId: string;
  borrower: User;
  amount: number; // Valor solicitado
  interestRate: number; // Taxa de juros (ex: 1.5 = 1.5%)
  installments: number; // Número de parcelas
  monthlyPayment: number; // Parcela mensal
  totalAmount: number; // Valor total do empréstimo
  status: OfferStatus; // negotiable ou fixed (antes de aceite)
  createdAt: Date;
  acceptsNegotiation: boolean;
  suggestedRateMin: number; // Zona sugerida mínima
  suggestedRateMax: number; // Zona sugerida máxima
}

// ============= LOAN OFFER (Oferta) =============

export interface LoanOffer {
  id: string;
  investorId: string;
  investor: User;
  amount: number; // Valor ofertado
  interestRate: number; // Taxa de juros
  installments: number; // Número de parcelas
  monthlyPayment: number; // Parcela mensal
  totalAmount: number; // Valor total
  status: OfferStatus;
  createdAt: Date;
  acceptsNegotiation: boolean;
  suggestedRateMin: number;
  suggestedRateMax: number;
}

// ============= ACTIVE LOAN (Empréstimo Ativo) =============

export interface ActiveLoan {
  id: string;
  loanRequestId?: string;
  loanOfferId?: string;
  borrowerId: string;
  borrowerName: string;
  investorId: string;
  investorName: string;
  amount: number;
  interestRate: number;
  installments: number;
  monthlyPayment: number;
  totalAmount: number;
  interestAmount: number; // Total de juros
  intermediationFee: number; // Taxa de intermediação
  status: LoanStatus;
  startDate: Date;
  endDate: Date;
}

// ============= NEGOTIATION (Compatibilidade + Extensões) =============

export interface Negotiation {
  id: string;
  loanRequestId?: string;
  loanOfferId?: string;
  borrowerId: string;
  borrowerName: string;
  borrowerScore: number;
  investorId: string;
  investorName: string;
  investorScore: number;
  amount: number;
  installments: number;

  // Proposta atual
  currentRate: number;
  currentProposer: ProfileType;

  // Histórico de propostas
  proposals: NegotiationProposal[];

  status: NegotiationStatus;
  createdAt: Date;
  expiresAt: Date;
  suggestedRateMin: number;
  suggestedRateMax: number;
}

export interface NegotiationProposal {
  id: string;
  proposerId: string;
  proposerType: ProfileType;
  proposedRate: number;
  message?: string;
  createdAt: Date;
  monthlyPayment: number;
  totalAmount: number;
}

// ============= EXTENDED TYPES (Com dados do banco) =============

// Negociação completa com dados relacionados
export interface NegociacaoCompleta extends Negociacao {
  tomador: Usuario;
  investidor: Usuario;
  score_tomador: ScoreCredito;
  score_investidor: ScoreCredito;
  propostas: Proposta[];
}

// Proposta completa com dados do autor
export interface PropostaCompleta extends Proposta {
  autor: Usuario;
}

// ============= INVESTOR METRICS =============

export interface InvestorMetrics {
  totalInvested: number;
  totalReturn: number;
  returnPercentage: number;
  activeLoans: number;
  portfolioDiversification: {
    goodScore: number; // Percentual
    excellentScore: number; // Percentual
  };
}

// ============= FORM DATA =============

export interface CreateLoanRequestData {
  amount: number;
  installments: number;
  interestRate: number;
  acceptsNegotiation: boolean;
}

export interface CreateLoanOfferData {
  amount: number;
  installments: number;
  interestRate: number;
  acceptsNegotiation: boolean;
}

export interface CreateNegotiationProposalData {
  negotiationId: string;
  proposedRate: number;
  message?: string;
}
