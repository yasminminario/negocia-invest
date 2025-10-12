import { apiClient } from "@/services/api-client"
import type { ScoreResponse } from "@/types"
import { USE_MOCKS } from "@/config/dev"
import mock from "@/mocks"

export async function calculateScore(userId: number) {
    if (USE_MOCKS) {
        await mock.wait()
        return { ...mock.sampleScore, user_id: userId } as ScoreResponse
    }
    const { data } = await apiClient.post<ScoreResponse>(`/score/${userId}`)
    return data
}
