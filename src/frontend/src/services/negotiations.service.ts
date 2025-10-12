import { apiClient } from "@/services/api-client"
import type { Negotiation, NegotiationUpdate } from "@/types"
import { USE_MOCKS } from "@/config/dev"
import mock from "@/mocks"

export async function fetchNegotiations(params?: { status?: string }) {
    if (USE_MOCKS) {
        await mock.wait()
        return mock.sampleNegotiations.filter((n) => (params?.status ? n.status === params.status : true))
    }
    const { data } = await apiClient.get<Negotiation[]>("/negociacoes", { params })
    return data
}

export async function fetchNegotiationById(id: number) {
    if (USE_MOCKS) {
        await mock.wait()
        return mock.sampleNegotiations.find((n) => n.id === id) as Negotiation
    }
    const { data } = await apiClient.get<Negotiation>(`/negociacoes/${id}`)
    return data
}

export async function updateNegotiation(id: number, payload: NegotiationUpdate) {
    if (USE_MOCKS) {
        await mock.wait()
        const idx = mock.sampleNegotiations.findIndex((n) => n.id === id)
        if (idx === -1) throw new Error("Not found")
        const updated = { ...mock.sampleNegotiations[idx], ...payload, atualizado_em: new Date().toISOString() }
        mock.sampleNegotiations[idx] = updated
        return updated
    }
    const { data } = await apiClient.put<Negotiation>(`/negociacoes/${id}`, payload)
    return data
}
