export type NegotiationStatus = "pendente" | "aceita" | "rejeitada" | "concluida";

export interface Negotiation {
    id: string;
    borrowerName: string;
    investorName: string;
    amount: number;
    rate: number;
    status: NegotiationStatus;
    createdAt: string;
    updatedAt?: string;
}

export type LoanStatus =
    | "negotiable"
    | "fixed"
    | "active"
    | "cancelled"
    | "completed"
    | "negotiating";

export interface Loan {
    id: string;
    company: string;
    score: number;
    status: LoanStatus;
    interestRateMonthly: number;
    periodMonths: number;
    monthlyPayment: number;
    totalAmount: number;
    offeredValue: number;
    iconColor?: string;
    iconBackgroundClass?: string;
    rateColorClass?: string;
}
