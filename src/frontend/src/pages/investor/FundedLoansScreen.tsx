import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLoans } from "@/hooks/useLoans";
import { LoanCard } from "@/components/LoanCard";

const InvestorFundedLoansScreen = () => {
    const { loans, loading, error, fetchLoans } = useLoans();

    const navigate = useNavigate();

    useEffect(() => {
        void fetchLoans();
    }, [fetchLoans]);

    if (loading) return <div className="flex min-h-[400px] items-center justify-center">Carregando...</div>;
    if (error) return <div className="flex min-h-[400px] items-center justify-center text-sm text-red-600">{error}</div>;

    return (
        <div className="min-h-[400px] w-full px-4 pt-6 pb-10">
            <h1 className="text-lg font-semibold text-black mb-4">Empréstimos Concedidos</h1>
            <div className="space-y-4">
                {loans.length === 0 ? (
                    <div className="text-sm text-slate-600">Nenhum empréstimo concedido ainda.</div>
                ) : (
                    loans.map((loan) => (
                        <LoanCard
                            key={loan.id}
                            company={loan.company}
                            score={loan.score}
                            type={loan.status}
                            interestRate={`${loan.interestRateMonthly.toFixed(2)}% a.m.`}
                            period={`${loan.periodMonths} m`}
                            monthlyPayment={loan.monthlyPayment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            total={loan.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            offeredValue={loan.offeredValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            iconBg={loan.iconBackgroundClass ?? 'bg-[rgba(87,217,255,0.16)]'}
                            iconColor={loan.iconColor ?? '#57D9FF'}
                            rateColor={loan.rateColorClass ?? 'text-[#9B59B6]'}
                            onClick={() => navigate(`/app/investidor/solicitacao/${loan.id}`)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default InvestorFundedLoansScreen;
