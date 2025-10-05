import React from 'react';

interface InvestorDetailsProps {
    name: string;
    score: number; // 0-100
    accountAgeMonths: number;
    loansProvided: number;
    approvalRatePercent: number;
}

export const InvestorDetails: React.FC<InvestorDetailsProps> = ({ name, score, accountAgeMonths, loansProvided, approvalRatePercent }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white font-bold">{name[0]}</div>
                <div>
                    <div className="font-bold text-sm">{name}</div>
                    <div className="text-xs text-gray-500">Pontuação: <span className="font-semibold">{score}</span></div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-400">Conta</div>
                    <div className="font-semibold">{Math.floor(accountAgeMonths / 12)} anos</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-400">Empréstimos</div>
                    <div className="font-semibold">{loansProvided}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-400">Aprovação</div>
                    <div className="font-semibold">{approvalRatePercent}%</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-400">Risco</div>
                    <div className="font-semibold">{score >= 75 ? 'Baixo' : score >= 45 ? 'Médio' : 'Alto'}</div>
                </div>
            </div>
        </div>
    );
};

export default InvestorDetails;
