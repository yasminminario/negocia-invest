import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SliderControl } from '@/components/Sim/SliderControl';
import { ValueCard } from '@/components/Sim/ValueCard';
import { ActionButton } from '@/components/Sim/ActionButton';
import { calculateMonthly, totalPayment, totalInterest } from '@/lib/loan';

const SimulationScreen: React.FC = () => {
    const navigate = useNavigate();

    const [amount, setAmount] = useState<number>(10000);
    const [months, setMonths] = useState<number>(12);
    const [rate, setRate] = useState<number>(10);

    const monthly = useMemo(() => calculateMonthly(amount, rate, months), [amount, rate, months]);
    const total = useMemo(() => totalPayment(monthly, months), [monthly, months]);
    const interest = useMemo(() => totalInterest(amount, total), [amount, total]);

    const suggestedRateRange: [number, number] = [6, 14];

    return (
        <div className="px-4 pt-4 pb-8">
            <h2 className="text-xl font-bold mb-4">Ofertar empréstimo</h2>

            <SliderControl label="Quanto você deseja ofertar?" min={500} max={100000} step={100} value={amount} onChange={setAmount} suffix=" R$" />
            <SliderControl label="Quantas parcelas?" min={1} max={72} value={months} onChange={setMonths} />
            <SliderControl label="Qual seria a taxa de juros desejada?" min={0} max={50} step={0.1} value={rate} onChange={setRate} suggestedRange={suggestedRateRange} suffix=" %" />

            <div className="mt-6 grid grid-cols-1 gap-4">
                <ValueCard title="Parcela mensal estimada" value={`${monthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} subtitle={`Total a receber: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} • Juros: ${interest.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} />
            </div>

            <div className="mt-6 flex justify-center">
                <ActionButton onClick={() => navigate(`/app/investidor/solicitacoes?amount=${amount}&months=${months}&rate=${rate}`)}>Ver solicitações disponíveis</ActionButton>
            </div>
        </div>
    );
};

export default SimulationScreen;
