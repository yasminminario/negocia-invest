import type { Negotiation } from "@/types";

const now = new Date();

export const mockNegotiations: Negotiation[] = [
    {
        id: "negotiation-1",
        borrowerName: "Carlos Silva",
        investorName: "QI Tech",
        amount: 192000,
        rate: 1.5,
        status: "pendente",
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
    },
    {
        id: "negotiation-2",
        borrowerName: "Maria Souza",
        investorName: "Cooperativa Blue",
        amount: 115000,
        rate: 1.2,
        status: "aceita",
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
    },
];
