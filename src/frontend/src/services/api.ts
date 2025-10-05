import { mockLoans } from "@/mocks/loans";
import { mockNegotiations } from "@/mocks/negotiations";
import type { Loan, Negotiation } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const FORCE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

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
        return withFallback<Negotiation[]>("/negotiations", mockNegotiations);
    },
    async getLoans(): Promise<Loan[]> {
        return withFallback<Loan[]>("/loans", mockLoans);
    },
};
