import type { Loan } from "@/types";

export const mockLoans: Loan[] = [
    {
        id: "loan-1",
        company: "QI Tech",
        score: 983,
        status: "negotiable",
        interestRateMonthly: 1.5,
        periodMonths: 48,
        monthlyPayment: 5642.5,
        totalAmount: 270840,
        offeredValue: 192000,
        iconBackgroundClass: "bg-[rgba(155,89,182,0.16)]",
        iconColor: "#9B59B6",
        rateColorClass: "text-[#57D9FF]",
    },
    {
        id: "loan-2",
        company: "Cooperativa Blue",
        score: 875,
        status: "fixed",
        interestRateMonthly: 1.2,
        periodMonths: 36,
        monthlyPayment: 3985.75,
        totalAmount: 143487,
        offeredValue: 115000,
        iconBackgroundClass: "bg-[rgba(87,217,255,0.16)]",
        iconColor: "#57D9FF",
        rateColorClass: "text-[#57D9FF]",
    },
];
