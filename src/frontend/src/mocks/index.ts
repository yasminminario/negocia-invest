import type { Negotiation, Proposal, MarketRecommendation, RateRecommendation, ScoreResponse } from "@/types"
import { MOCK_LATENCY_MS } from "@/config/dev"

const wait = (ms = MOCK_LATENCY_MS) => new Promise((r) => setTimeout(r, ms))

export const sampleNegotiations: Negotiation[] = [
    {
        id: 1,
        id_tomador: 101,
        id_investidor: 201,
        prazo: 12,
        valor: 5000,
        parcela: 450,
        status: "pendente",
        taxa: 1.8,
        quant_propostas: 1,
        hash_onchain: null,
        contrato_tx_hash: null,
        assinado_em: null,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
    },
]

export const sampleProposals: Proposal[] = [
    {
        id: 10,
        id_negociacoes: 1,
        id_autor: 201,
        autor_tipo: "investidor",
        taxa_analisada: "1.5-2.0",
        taxa_sugerida: "1.8",
        prazo_meses: 12,
        tipo: "inicial",
        status: "pendente",
        parcela: 450,
        valor: 5000,
        negociavel: true,
        justificativa: "Oferta inicial com boa taxa",
        criado_em: new Date().toISOString(),
    },
]

export const sampleMarketRecommendations: MarketRecommendation[] = sampleProposals

export const sampleRateRecommendation: RateRecommendation = {
    faixa_sugerida: "1.6-1.9",
    faixa_mercado: "1.5-2.5",
    mensagem: "Taxa sugerida baseada em histórico e mercado",
    media_usuario: 1.8,
}

export const sampleScore: ScoreResponse = {
    user_id: 101,
    analise: {},
    score_modelo: 720,
    score_serasa: 710,
    valor_score: 715,
    prob_default: 0.03,
}

export const mock = {
    wait,
    sampleNegotiations,
    sampleProposals,
    sampleMarketRecommendations,
    sampleRateRecommendation,
    sampleScore,
}

export default mock

// Seed helper: writes a default user into localStorage if auth mock is enabled and no users exist
export function seedMockUsers() {
    try {
        const key = "ni.mock.users"
        const raw = localStorage.getItem(key)
        if (raw) return

        const users = [
            {
                id: 101,
                nome: "Usuário de Teste",
                email: "test@example.com",
                senha: "password", // somente para desenvolvimento
                perfis: ["tomador"],
                cpf: null,
                telefone: null,
            },
        ]
        localStorage.setItem(key, JSON.stringify(users))
    } catch (error) {
        // noop
    }
}
