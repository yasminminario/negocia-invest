import type { FC } from "react";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ActionButtons } from "@/components/ActionButtons";
import { ActiveProductsSection } from "@/components/ActiveProductsSection";
import { LoanCard } from "@/components/LoanCard";
import { ScoreSection } from "@/components/ScoreSection";
import { useLoans } from "@/hooks/useLoans";
import { useNegotiations } from "@/hooks/useNegotiations";
import { useAuth } from "@/contexts/AuthContext";

const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2,
    });

const formatInterestRate = (value: number) =>
    `${value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}% a.m.`;

const DEFAULT_ICON_BG = "bg-[rgba(155,89,182,0.16)]";
const DEFAULT_ICON_COLOR = "#9B59B6";
const DEFAULT_RATE_COLOR = "text-[#57D9FF]";

const BorrowerDashboardScreen: FC = () => {
    const navigate = useNavigate();

    const {
        negotiations,
        loading: negotiationsLoading,
        error: negotiationsError,
        fetchNegotiations,
    } = useNegotiations();

    const {
        loans,
        loading: loansLoading,
        error: loansError,
        fetchLoans,
    } = useLoans();

    const navigateTo = useCallback(
        (path: string) => {
            navigate(path);
        },
        [navigate],
    );

    const handleLoansClick = useCallback(() => {
        navigateTo("/app/tomador/emprestimos-ativos");
    }, [navigateTo]);

    const handleNegotiationsClick = useCallback(() => {
        navigateTo("/app/tomador/negociacoes");
    }, [navigateTo]);

    const handleViewAll = useCallback(() => {
        navigateTo("/app/tomador/ofertas");
    }, [navigateTo]);

    const handleFindOffer = useCallback(() => {
        navigateTo("/app/tomador/ofertas");
    }, [navigateTo]);

    useEffect(() => {
        void Promise.all([fetchNegotiations(), fetchLoans()]);
    }, [fetchNegotiations, fetchLoans]);

    if (negotiationsLoading || loansLoading) {
        return (
            <main className="flex min-h-[926px] w-full items-center justify-center bg-[#F5F8FE]">
                <div className="rounded-2xl bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-md">
                    Carregando dados da sua conta...
                </div>
            </main>
        );
    }

    if (negotiationsError || loansError) {
        const message =
            negotiationsError ?? loansError ?? "Ocorreu um erro ao carregar as informações.";

        const handleRetry = () => {
            void fetchNegotiations();
            void fetchLoans();
        };

        return (
            <main className="flex min-h-[926px] w-full items-center justify-center bg-[#F5F8FE]">
                <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl bg-white px-8 py-10 text-center shadow-xl">
                    <p className="text-lg font-semibold text-slate-900">Não foi possível carregar</p>
                    <p className="text-sm text-slate-600">{message}</p>
                    <button
                        type="button"
                        onClick={handleRetry}
                        className="rounded-full bg-[#57D9FF] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#3dcaf4]"
                    >
                        Tentar novamente
                    </button>
                </div>
            </main>
        );
    }

    const { user } = useAuth();

    const marketLoans = loans.filter((l) => l.status !== "active");
    const userNegotiations = negotiations.filter((n) => n.borrowerName === user?.name);

    const hasLoans = marketLoans.length > 0;

    return (
        <main className="min-h-[926px] w-full overflow-hidden bg-[#F5F8FE]">
            <ScoreSection />

            <div className="mt-6 w-full flex-1 overflow-hidden rounded-[30px_30px_0_0] bg-white py-6">
                <ActiveProductsSection
                    userType="borrower"
                    loansCount={marketLoans.length}
                    negotiationsCount={userNegotiations.length}
                    onLoansClick={handleLoansClick}
                    onNegotiationsClick={handleNegotiationsClick}
                />

                <section className="mt-6 w-full px-4">
                    <div className="flex w-full items-center gap-2.5 px-2 text-lg font-semibold text-black">
                        <h2 className="my-auto self-stretch text-black">
                            Empréstimos disponíveis no mercado
                        </h2>
                    </div>

                    {hasLoans ? (
                        <div className="mt-4 space-y-4">
                            {marketLoans.slice(0, 1).map((loan, index) => (
                                <LoanCard
                                    key={loan.id}
                                    company={loan.company}
                                    score={loan.score}
                                    type={loan.status}
                                    interestRate={formatInterestRate(loan.interestRateMonthly)}
                                    period={`${loan.periodMonths} m`}
                                    monthlyPayment={formatCurrency(loan.monthlyPayment)}
                                    total={formatCurrency(loan.totalAmount)}
                                    offeredValue={formatCurrency(loan.offeredValue)}
                                    iconBg={loan.iconBackgroundClass ?? DEFAULT_ICON_BG}
                                    iconColor={loan.iconColor ?? DEFAULT_ICON_COLOR}
                                    rateColor={loan.rateColorClass ?? DEFAULT_RATE_COLOR}
                                    className={index === 0 ? "mt-2" : ""}
                                    onClick={() => navigateTo(`/app/tomador/oferta/${loan.id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-[#F5F8FE] px-6 py-14 text-center">
                            <p className="text-base font-semibold text-slate-900">
                                Nenhum empréstimo disponível no momento
                            </p>
                            <p className="max-w-md text-sm text-slate-600">
                                Assim que novas ofertas forem publicadas pelos investidores da nossa rede,
                                elas aparecerão aqui.
                            </p>
                        </div>
                    )}
                </section>

                <ActionButtons
                    userType="borrower"
                    onViewAll={handleViewAll}
                    onFindOffer={handleFindOffer}
                />
            </div>
        </main>
    );
};

export default BorrowerDashboardScreen;
