import { mockLoans } from "@/mocks/loans";
import { mockNegotiations } from "@/mocks/negotiations";
import type { Loan, Negotiation } from "@/types";

// In-memory copies used when falling back to mocks — allow runtime mutation in DEV
const STORAGE_KEY_NEGOTIATIONS = 'negocia.ai.mocks.negotiations';
const STORAGE_KEY_LOANS = 'negocia.ai.mocks.loans';

const readFromStorage = <T,>(key: string, fallback: T) => {
    try {
        const raw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
        if (!raw) return JSON.parse(JSON.stringify(fallback));
        return JSON.parse(raw) as T;
    } catch (err) {
        console.warn('Failed to read mocks from localStorage', err);
        return JSON.parse(JSON.stringify(fallback));
    }
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const FORCE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

let inMemoryNegotiations: Negotiation[] = (FORCE_MOCKS || import.meta.env.DEV) ? readFromStorage(STORAGE_KEY_NEGOTIATIONS, mockNegotiations) : JSON.parse(JSON.stringify(mockNegotiations));
let inMemoryLoans: Loan[] = (FORCE_MOCKS || import.meta.env.DEV) ? readFromStorage(STORAGE_KEY_LOANS, mockLoans) : JSON.parse(JSON.stringify(mockLoans));

// Ensure predictable dev experience: if we're in DEV or forcing mocks and the
// localStorage keys are absent, initialize them from the canonical mock files.
// This avoids confusion where the code reads stale data from storage after the
// source mock files were updated.
if (FORCE_MOCKS || import.meta.env.DEV) {
    try {
        if (typeof window !== 'undefined') {
            if (!window.localStorage.getItem(STORAGE_KEY_LOANS)) {
                window.localStorage.setItem(STORAGE_KEY_LOANS, JSON.stringify(inMemoryLoans));
            }
            if (!window.localStorage.getItem(STORAGE_KEY_NEGOTIATIONS)) {
                window.localStorage.setItem(STORAGE_KEY_NEGOTIATIONS, JSON.stringify(inMemoryNegotiations));
            }
        }
    } catch (err) {
        // keep silent in CI or restricted environments
        console.warn('Failed to initialize mock storage from files', err);
    }
}

const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

async function fetchFromApi<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    return handleResponse<T>(response);
}

async function withFallback<T>(path: string, fallback: T): Promise<T> {
    if (FORCE_MOCKS) {
        return clone(fallback);
    }

    try {
        return await fetchFromApi<T>(path);
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn(
                `Falha ao consultar ${path}, retornando dados mockados. Detalhes:`,
                error,
            );
            return clone(fallback);
        }
        throw error;
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            errorText || "Não foi possível concluir a requisição."
        );
    }

    const data = (await response.json()) as T;
    return data;
}

export const api = {
    async getNegotiations(): Promise<Negotiation[]> {
        const result = await withFallback<Negotiation[]>("/negotiations", mockNegotiations);
        // if we are using fallback, return the in-memory copy so created items persist
        if (FORCE_MOCKS || import.meta.env.DEV) {
            return clone(inMemoryNegotiations);
        }

        return result;
    },
    async getLoans(): Promise<Loan[]> {
        const result = await withFallback<Loan[]>("/loans", mockLoans);
        if (FORCE_MOCKS || import.meta.env.DEV) {
            return clone(inMemoryLoans);
        }

        return result;
    },
    async createNegotiation(payload: Omit<Negotiation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Negotiation> {
        // If forced mocks / dev, mutate in-memory state and return
        if (FORCE_MOCKS || import.meta.env.DEV) {
            const now = new Date().toISOString();
            const newItem: Negotiation = {
                id: `neg-${Date.now()}`,
                createdAt: now,
                updatedAt: now,
                ...payload,
            } as Negotiation;
            inMemoryNegotiations = [newItem, ...inMemoryNegotiations];
            try {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(STORAGE_KEY_NEGOTIATIONS, JSON.stringify(inMemoryNegotiations));
                }
            } catch (err) {
                console.warn('Failed to persist negotiations to localStorage', err);
            }
            return clone(newItem);
        }

        const response = await fetch(`${API_BASE_URL}/negotiations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include',
        });

        return handleResponse<Negotiation>(response);
    },
    async acceptNegotiation(negotiationId: string): Promise<Negotiation> {
        if (FORCE_MOCKS || import.meta.env.DEV) {
            const now = new Date().toISOString();
            const idx = inMemoryNegotiations.findIndex(n => n.id === negotiationId);
            if (idx === -1) throw new Error('Negociação não encontrada');
            inMemoryNegotiations[idx] = { ...inMemoryNegotiations[idx], status: 'aceita', updatedAt: now } as Negotiation;

            // if linked to a loan, mark loan as active
            const loanId = inMemoryNegotiations[idx].loanId;
            if (loanId) {
                const lidx = inMemoryLoans.findIndex(l => l.id === loanId);
                if (lidx !== -1) {
                    inMemoryLoans[lidx] = { ...inMemoryLoans[lidx], status: 'active' } as Loan;
                }
            }

            try {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(STORAGE_KEY_NEGOTIATIONS, JSON.stringify(inMemoryNegotiations));
                    window.localStorage.setItem(STORAGE_KEY_LOANS, JSON.stringify(inMemoryLoans));
                }
            } catch (err) {
                console.warn('Failed to persist changes to localStorage', err);
            }

            return clone(inMemoryNegotiations[idx]);
        }

        const response = await fetch(`${API_BASE_URL}/negotiations/${encodeURIComponent(negotiationId)}/accept`, {
            method: 'POST',
            credentials: 'include',
        });

        return handleResponse<Negotiation>(response);
    },
    async rejectNegotiation(negotiationId: string): Promise<Negotiation> {
        if (FORCE_MOCKS || import.meta.env.DEV) {
            const now = new Date().toISOString();
            const idx = inMemoryNegotiations.findIndex(n => n.id === negotiationId);
            if (idx === -1) throw new Error('Negociação não encontrada');
            inMemoryNegotiations[idx] = { ...inMemoryNegotiations[idx], status: 'rejeitada', updatedAt: now } as Negotiation;
            try {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(STORAGE_KEY_NEGOTIATIONS, JSON.stringify(inMemoryNegotiations));
                }
            } catch (err) {
                console.warn('Failed to persist negotiations to localStorage', err);
            }
            return clone(inMemoryNegotiations[idx]);
        }

        const response = await fetch(`${API_BASE_URL}/negotiations/${encodeURIComponent(negotiationId)}/reject`, {
            method: 'POST',
            credentials: 'include',
        });

        return handleResponse<Negotiation>(response);
    },

    async createCounterProposal(payload: Omit<Negotiation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Negotiation> {
        // simply reuse createNegotiation behavior for counter proposals in mocks
        return this.createNegotiation(payload as any);
    },
};
