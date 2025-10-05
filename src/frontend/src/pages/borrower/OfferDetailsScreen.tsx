import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DonutChart from '@/components/Offer/DonutChart';
import InvestorDetails from '@/components/Offer/InvestorDetails';
import { calculateMonthly, totalPayment, totalInterest } from '@/lib/loan';

const BorrowerOfferDetailsScreen = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Mocked offer data (in real app we'd fetch by id)
    const offer = {
        id,
        principal: 8000,
        months: 12,
        monthlyRatePercent: 1.5 * 12, // convert a.m. to anual approx (for demo)
        offeredAmount: 8000,
        intermediationFee: 120,
        negotiable: true,
        investor: {
            name: 'QI Tech',
            score: 82,
            accountAgeMonths: 48,
            loansProvided: 124,
            approvalRatePercent: 93,
        },
    };

    const monthly = useMemo(() => calculateMonthly(offer.principal, offer.monthlyRatePercent, offer.months), [offer]);
    const total = useMemo(() => totalPayment(monthly, offer.months), [monthly, offer.months]);
    const interest = useMemo(() => totalInterest(offer.principal, total), [offer.principal, total]);

    const slices = [
        { label: 'Juros totais', value: interest, color: '#F97316' },
        { label: 'Valor principal', value: offer.principal, color: '#3B82F6' },
        { label: 'Taxa de intermediação', value: offer.intermediationFee, color: '#A78BFA' },
    ];

    return (
        <div className="min-h-[400px] w-full px-4 pt-6">
            <h1 className="text-lg font-semibold text-black mb-4">Detalhes da Oferta</h1>

            <div className="grid grid-cols-1 gap-4">
                <div className="rounded-2xl bg-white p-4 shadow-sm flex gap-4 items-center">
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-500">Taxa de juros (a.a.)</div>
                                <div className="text-2xl font-bold">{offer.monthlyRatePercent}%</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Período</div>
                                <div className="text-2xl font-bold">{offer.months}x</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Parcela mensal</div>
                                <div className="text-2xl font-bold">{monthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                            </div>
                        </div>

                        <div className="mt-3 text-sm text-gray-500">Valor ofertado: <span className="font-semibold">{offer.offeredAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
                        {offer.negotiable && <div className="mt-2 inline-block text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">Negociável</div>}
                    </div>

                    <div className="w-[220px] flex-shrink-0">
                        <DonutChart slices={slices} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <InvestorDetails {...offer.investor} />
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => alert('Oferta aceita — fluxos backend não implementados aqui.')}
                        className="flex-1 rounded-md bg-[var(--primary-color)] text-white px-4 py-3 font-semibold"
                    >
                        Aceitar esta oferta
                    </button>
                    <button
                        onClick={() => navigate(`/app/tomador/negociar/${offer.id}`)}
                        className="flex-1 rounded-md border border-[var(--primary-color)] text-[var(--primary-color)] px-4 py-3 font-semibold bg-white"
                    >
                        Iniciar negociação
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BorrowerOfferDetailsScreen;
