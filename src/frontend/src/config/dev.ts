export const USE_MOCKS = (import.meta.env.VITE_USE_MOCKS ?? "") === "true"

// Small artificial latency to make UX feel realistic in dev
export const MOCK_LATENCY_MS = 250
