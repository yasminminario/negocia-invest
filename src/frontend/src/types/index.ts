export type Role = "investidor" | "tomador"

export interface Negotiation {
    id: number
    id_tomador: number
    id_investidor: number
    prazo?: number | null
    valor?: number | null
    parcela?: number | null
    status: string
    taxa?: number | null
    quant_propostas?: number | null
    hash_onchain?: string | null
    contrato_tx_hash?: string | null
    assinado_em?: string | null
    criado_em: string
    atualizado_em: string
}

export interface NegotiationUpdate {
    id_tomador?: number
    id_investidor?: number
    status?: string
    taxa?: number
    quant_propostas?: number
    hash_onchain?: string
    contrato_tx_hash?: string
}

export interface Proposal {
    id: number
    id_negociacoes?: number | null
    id_autor: number
    autor_tipo: Role
    taxa_analisada: string
    taxa_sugerida: string
    prazo_meses: number
    tipo?: string | null
    status: string
    parcela?: number | null
    valor?: number | null
    negociavel: boolean
    justificativa?: string | null
    criado_em: string
}

export interface CreateProposalInput {
    id_negociacoes?: number | null
    id_autor: number
    autor_tipo: Role
    taxa_analisada: string
    taxa_sugerida: string
    prazo_meses: number
    tipo?: string | null
    status: string
    parcela?: number | null
    valor?: number | null
    negociavel: boolean
    justificativa?: string | null
}

export interface ScoreResponse {
    user_id: number
    analise: Record<string, unknown>
    score_modelo: number
    score_serasa: number
    valor_score: number
    prob_default: number
}

export interface RateRecommendation {
    faixa_sugerida: string
    faixa_mercado: string
    mensagem: string
    media_usuario: number
}

export interface MarketRecommendation extends Proposal { }
