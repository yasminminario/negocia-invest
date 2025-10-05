import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { ActionButtons } from "@/components/ActionButtons";
import { ActiveProductsSection } from "@/components/ActiveProductsSection";
import { InvestorStats } from "@/components/InvestorStats";
import { LoanCard } from "@/components/LoanCard";
import { useLoans } from "@/hooks/useLoans";
import { useNegotiations } from "@/hooks/useNegotiations";
import { useAuth } from "@/contexts/AuthContext";

const InvestorDashboardScreen: React.FC = () => {
    const navigate = useNavigate();

    const navigateTo = useCallback(
        (path: string) => {
            navigate(path);
        },
        [navigate],
    );

    const { loans, fetchLoans } = useLoans();
    const { negotiations, fetchNegotiations } = useNegotiations();
    const { user } = useAuth();

    // consider as market requests those that are not yet active
    const marketLoans = loans.filter((l) => l.status !== "active");
    const userNegotiations = negotiations.filter((n) => n.investorName === user?.name || n.investorName == null);

    const handleLoansClick = useCallback(() => {
        navigateTo("/app/investidor/emprestimos-concedidos");
    }, [navigateTo]);

    const handleNegotiationsClick = useCallback(() => {
        navigateTo("/app/investidor/negociacoes");
    }, [navigateTo]);

    const handleViewAll = useCallback(() => {
        navigateTo("/app/investidor/solicitacoes");
    }, [navigateTo]);

    const handleFindRequest = useCallback(() => {
        navigateTo("/app/investidor/solicitacoes");
    }, [navigateTo]);

    return (
        <main className="min-h-[926px] w-full overflow-hidden bg-[#F5F8FE]">
            <InvestorStats />

            <div className="mt-6 w-full flex-1 overflow-hidden rounded-[30px_30px_0_0] bg-white py-6">
                <ActiveProductsSection
                    userType="investor"
                    loansCount={marketLoans.length}
                    negotiationsCount={userNegotiations.length}
                    onLoansClick={handleLoansClick}
                    onNegotiationsClick={handleNegotiationsClick}
                />

                <section className="mt-6 w-full px-4">
                    <div className="flex w-full items-center gap-2.5 px-2 text-lg font-semibold text-black">
                        <h2 className="my-auto self-stretch text-black">
                            Solicitações disponíveis no mercado
                        </h2>
                    </div>

                    {marketLoans.slice(0, 1).map((loan) => (
                        <LoanCard
                            key={loan.id}
                            company={loan.company}
                            score={loan.score}
                            type={loan.status}
                            interestRate={`${loan.interestRateMonthly}% a.m.`}
                            period={`${loan.periodMonths} m`}
                            monthlyPayment={`R$${loan.monthlyPayment.toFixed(2)}`}
                            total={`R$${loan.totalAmount.toFixed(2)}`}
                            offeredValue={`R$${loan.offeredValue.toFixed(2)}`}
                            iconBg={loan.iconBackgroundClass ?? "bg-[rgba(87,217,255,0.16)]"}
                            iconColor={loan.iconColor ?? "#57D9FF"}
                            rateColor={loan.rateColorClass ?? "text-[#9B59B6]"}
                            className="mt-2"
                            onClick={() => navigateTo(`/app/investidor/solicitacao/${loan.id}`)}
                        />
                    ))}
                </section>

                <ActionButtons
                    userType="investor"
                    onViewAll={handleViewAll}
                    onFindOffer={handleFindRequest}
                />
            </div>
        </main>
    );
};

export default InvestorDashboardScreen;
