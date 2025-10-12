import { apiClient } from "@/services/api-client"
import type { RateRecommendation } from "@/types"
import { USE_MOCKS } from "@/config/dev"
import mock from "@/mocks"

export async function getRateRecommendation(params: {
    user_id: number
    valor: number
    prazo: number
    score: number
    tipo?: string
}) {
    if (USE_MOCKS) {
        await mock.wait()
        return mock.sampleRateRecommendation as RateRecommendation
    }
    const { data } = await apiClient.get<RateRecommendation>("/recomendacao/taxa", { params })
    return data
}
