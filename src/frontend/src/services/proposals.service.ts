import { apiClient } from "@/services/api-client"
import type { CreateProposalInput, MarketRecommendation, Proposal } from "@/types"
import { USE_MOCKS } from "@/config/dev"
import mock from "@/mocks"

export async function fetchProposals(params?: { id_negociacoes?: number }) {
    if (USE_MOCKS) {
        await mock.wait()
        return mock.sampleProposals.filter((p) => !params?.id_negociacoes || p.id_negociacoes === params.id_negociacoes)
    }
    const { data } = await apiClient.get<Proposal[]>("/propostas", { params })
    return data
}

export async function createProposal(payload: CreateProposalInput) {
    if (USE_MOCKS) {
        await mock.wait()
        const newId = Math.max(...mock.sampleProposals.map((p) => p.id)) + 1
        const novo: Proposal = {
            id: newId,
            id_negociacoes: payload.id_negociacoes ?? null,
            id_autor: payload.id_autor,
            autor_tipo: payload.autor_tipo,
            taxa_analisada: payload.taxa_analisada,
            taxa_sugerida: payload.taxa_sugerida,
            prazo_meses: payload.prazo_meses,
            tipo: payload.tipo ?? null,
            status: payload.status,
            parcela: payload.parcela ?? null,
            valor: payload.valor ?? null,
            negociavel: payload.negociavel,
            justificativa: payload.justificativa ?? null,
            criado_em: new Date().toISOString(),
        }
        mock.sampleProposals.push(novo)
        return novo
    }
    const { data } = await apiClient.post<Proposal>("/propostas", payload)
    return data
}

export async function fetchMarketRecommendations(userId: number, perfil: string) {
    const { data } = await apiClient.get<MarketRecommendation[]>(
        `/internal/recommendations/solicitacoes/${userId}`,
        {
            params: { perfil },
        }
    )
    return data
}
