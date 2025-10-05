import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { ActionButtons } from "@/components/ActionButtons";
import { ActiveProductsSection } from "@/components/ActiveProductsSection";
import { InvestorStats } from "@/components/InvestorStats";
import { LoanCard } from "@/components/LoanCard";

const InvestorDashboardScreen: React.FC = () => {
    const navigate = useNavigate();

    const navigateTo = useCallback(
        (path: string) => {
            navigate(path);
        },
        [navigate],
    );

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
                    loansCount={3}
                    negotiationsCount={1}
                    onLoansClick={handleLoansClick}
                    onNegotiationsClick={handleNegotiationsClick}
                />

                <section className="mt-6 w-full px-4">
                    <div className="flex w-full items-center gap-2.5 px-2 text-lg font-semibold text-black">
                        <h2 className="my-auto self-stretch text-black">
                            Solicitações disponíveis no mercado
                        </h2>
                    </div>

                    <LoanCard
                        company="Teste"
                        score={597}
                        type="fixed"
                        interestRate="1,5% a.m."
                        period="12 m"
                        monthlyPayment="R$912,69"
                        total="R$10.952,28"
                        offeredValue="R$10.000"
                        iconBg="bg-[rgba(87,217,255,0.16)]"
                        iconColor="#57D9FF"
                        rateColor="text-[#9B59B6]"
                        className="mt-2"
                    />
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
