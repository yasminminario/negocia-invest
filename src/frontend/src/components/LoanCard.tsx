import React from 'react';
import { StatusBadge } from './StatusBadge';

interface LoanCardProps {
  company: string;
  score: number;
  type: 'negotiable' | 'fixed' | 'active' | 'cancelled' | 'completed' | 'negotiating';
  interestRate: string;
  period: string;
  monthlyPayment: string;
  total: string;
  offeredValue: string;
  iconBg: string;
  iconColor: string;
  rateColor: string;
  className?: string;
  onClick?: () => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({
  company,
  score,
  type,
  interestRate,
  period,
  monthlyPayment,
  total,
  offeredValue,
  iconBg,
  iconColor,
  rateColor,
  className = ''
  , onClick
}) => {
  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { onClick(); } } : undefined}
      className={`shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] w-full overflow-hidden flex-1 bg-[#F5F8FE] p-4 rounded-2xl ${className} ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
    >
      <div className="flex w-full gap-[40px_100px] justify-between">
        <div className="flex items-center gap-2">
          <div className={`justify-center items-center aspect-[1/1] self-stretch flex min-h-10 flex-col overflow-hidden w-10 h-10 ${iconBg} my-auto px-px rounded-[1000px]`}>
            <img
              src={iconColor === '#9B59B6'
                ? "https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/eb28d6e92877d2283ac4c144ba3ba4a9a8411a1d?placeholderIfAbsent=true"
                : "https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/793849a31fbc1a2249de6d233fba5a86dd2c80f4?placeholderIfAbsent=true"
              }
              className="aspect-[19/16] object-contain w-[19px]"
              alt="Company icon"
            />
          </div>
          <div className="self-stretch flex flex-col items-stretch font-normal justify-center my-auto">
            <div className="text-black text-base">{company}</div>
            <div className="flex items-center gap-1 text-sm text-[#4A4A55] whitespace-nowrap justify-center mt-1">
              <img
                src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/2bfeb6bc545e9299bb6964aa52fbe2168815ed10?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                alt="Score icon"
              />
              <div className="text-[#4A4A55] self-stretch my-auto">{score}</div>
            </div>
          </div>
        </div>
        <StatusBadge status={type} />
      </div>

      <div className="flex w-full items-center gap-[40px_58px] justify-between mt-4">
        <div className="self-stretch flex flex-col items-stretch justify-center my-auto">
          <div className="text-[#4A4A55] text-sm font-normal">Taxa de juros</div>
          <div className={`${rateColor} text-lg font-semibold mt-2`}>{interestRate}</div>
        </div>
        <div className="self-stretch flex flex-col items-center justify-center my-auto">
          <div className="text-[#4A4A55] text-sm font-normal">Período</div>
          <div className="text-black text-lg font-semibold mt-2">{period}</div>
        </div>
        <div className="self-stretch flex flex-col items-stretch justify-center my-auto">
          <div className="text-[#4A4A55] text-sm font-normal">Parcela mensal</div>
          <div className="text-black text-lg font-semibold mt-2">{monthlyPayment}</div>
        </div>
      </div>

      <div className="justify-between items-center flex w-full gap-[40px_66px] text-sm text-black font-normal mt-4 pt-4 border-t-[#D1D1D1] border-t border-solid">
        <div className="self-stretch flex items-center gap-2 my-auto">
          <div className="text-black self-stretch my-auto">
            <span className="text-[#4A4A55]">Total:</span>{' '}
            <span className="font-bold">{total}</span>
          </div>
        </div>
        <div className="self-stretch flex items-center gap-2 my-auto">
          <div className="text-black self-stretch my-auto">
            Valor ofertado:{' '}
            <span className="font-bold">{offeredValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
