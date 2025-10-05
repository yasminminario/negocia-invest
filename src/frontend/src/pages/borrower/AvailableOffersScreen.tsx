import { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { useLoans } from '@/hooks/useLoans';

import { LoanCard } from "@/components/LoanCard";
import { SearchAndFilter } from "@/components/SearchAndFilter";

const AvailableOffersScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // TODO: implementar busca real quando backend estiver disponível
    };

    const handleFilter = () => {
        // TODO: implementar filtros quando regras estiverem definidas
    };

    const navigate = useNavigate();
    const { loans, loading, error, fetchLoans } = useLoans();

    useEffect(() => {
        void fetchLoans();
    }, [fetchLoans]);

    const handleOpenOffer = (id: string) => {
        navigate(`/app/tomador/oferta/${id}`);
    };

    // Simulation state
    const [amount, setAmount] = useState<number>(50000);
    const [months, setMonths] = useState<number>(24);
    const [rate, setRate] = useState<number>(1.5); // monthly %

    const monthlyPayment = useMemo(() => {
        const P = amount;
        const i = rate / 100; // monthly decimal
        const n = months;
        if (i === 0) return P / n;
        const payment = P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
        return payment;
    }, [amount, months, rate]);

    return (
        <div className="h-screen w-full overflow-hidden bg-[#F5F8FE]">
            <main className="mt-8 flex w-full flex-1 flex-col items-stretch overflow-hidden rounded-[30px_30px_0_0] bg-white px-4 pt-6 pb-[34px]">
                <div className="flex w-full items-center justify-center gap-2 text-[28px] font-normal">
                    <img
                        src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/8a995a15982d2c207ea0a9f60386d15d7759fc9f?placeholderIfAbsent=true"
                        className="my-auto aspect-[1/1] w-6 shrink-0 self-stretch object-contain"
                        alt="Offers icon"
                    />
                    <h1 className="my-auto self-stretch">
                        <span className="font-bold text-[#57D9FF]">Ofertas disponíveis</span>
                    </h1>
                </div>

                <SearchAndFilter onSearch={handleSearch} onFilter={handleFilter} />

                <section className="mt-6">
                    {loading ? (
                        <div className="text-sm text-slate-600">Carregando ofertas...</div>
                    ) : error ? (
                        <div className="text-sm text-red-600">{error}</div>
                    ) : loans.length === 0 ? (
                        <div className="text-sm text-slate-600">Nenhuma oferta disponível.</div>
                    ) : (
                        <div className="space-y-4">
                            {loans.map((loan) => (
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
                                    iconBg={loan.iconBackgroundClass ?? 'bg-[rgba(155,89,182,0.16)]'}
                                    iconColor={loan.iconColor ?? '#9B59B6'}
                                    rateColor={loan.rateColorClass ?? 'text-[#57D9FF]'}
                                    onClick={() => handleOpenOffer(loan.id)}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <div className="mt-6 flex items-center justify-center gap-1 text-center text-sm font-normal text-[#D1D1D1]">
                    <img
                        src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/ff618ac4e00001a08299f0889c2068f251e40331?placeholderIfAbsent=true"
                        className="my-auto aspect-[1] w-4 shrink-0 self-stretch object-contain"
                        alt="End icon"
                    />
                    <div className="my-auto self-stretch text-[#D1D1D1]">Acaba aqui</div>
                </div>
            </main>
        </div>
    );
};

export default AvailableOffersScreen;
