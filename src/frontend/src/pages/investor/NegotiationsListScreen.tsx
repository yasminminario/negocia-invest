import { useEffect } from "react";
import { useNegotiations } from "@/hooks/useNegotiations";

const InvestorNegotiationsListScreen = () => {
    const { negotiations, loading, error, fetchNegotiations } = useNegotiations();

    useEffect(() => {
        void fetchNegotiations();
    }, [fetchNegotiations]);

    if (loading) return <div className="flex min-h-[400px] items-center justify-center">Carregando negociações...</div>;
    if (error) return <div className="flex min-h-[400px] items-center justify-center text-sm text-red-600">{error}</div>;

    return (
        <div className="min-h-[400px] w-full px-4 pt-6 pb-10">
            <h1 className="text-lg font-semibold text-black mb-4">Negociações (Investidor)</h1>
            <div className="space-y-4">
                {negotiations.length === 0 ? (
                    <div className="text-sm text-slate-600">Sem negociações no momento.</div>
                ) : (
                    negotiations.map((n) => (
                        <div key={n.id} className="rounded-2xl bg-[#FFF8F5] px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-slate-700 font-semibold">{n.borrowerName}</div>
                                    <div className="text-sm text-slate-500">{n.investorName}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold">{n.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                    <div className="text-xs text-slate-500">{n.rate}% a.m. — {n.status}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default InvestorNegotiationsListScreen;
