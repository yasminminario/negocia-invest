import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatInterestRate } from '@/utils/calculations';
import { StatusBadge } from './StatusBadge';
import { LoanStatus, OfferStatus } from '@/types';

interface LoanCardProps {
  id: string;
  name: string;
  score: number;
  interestRate: number;
  installments: number;
  monthlyPayment: number;
  total: number;
  amount: number;
  status?: LoanStatus | OfferStatus;
  onClick?: () => void;
  className?: string;
}

export const LoanCard: React.FC<LoanCardProps> = ({
  name,
  score,
  interestRate,
  installments,
  monthlyPayment,
  total,
  amount,
  status,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Oferta de empréstimo de ${name}. Valor: ${formatCurrency(amount)}. Taxa: ${formatInterestRate(interestRate)}. ${installments} parcelas de ${formatCurrency(monthlyPayment)}. Score: ${score}`}
      className={cn(
        'p-4 rounded-2xl border-2 border-border bg-card hover:border-primary/50 transition-all duration-200 hover-scale cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">
              {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <div className="font-semibold">{name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span>✓</span>
              <span>{score}</span>
            </div>
          </div>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <div className="text-xs text-muted-foreground">Taxa de juros</div>
          <div className="font-bold text-primary" aria-label={`Taxa de juros de ${formatInterestRate(interestRate)}`}>
            {formatInterestRate(interestRate)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Período</div>
          <div className="font-semibold" aria-label={`${installments} meses`}>
            {installments} meses
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Parcela mensal</div>
          <div className="font-semibold" aria-label={`Parcela mensal de ${formatCurrency(monthlyPayment)}`}>
            {formatCurrency(monthlyPayment)}
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div>
          <span className="text-xs text-muted-foreground">Valor total a pagar: </span>
          <span className="font-bold" aria-label={`Total de ${formatCurrency(total)}`}>
            {formatCurrency(total)}
          </span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Valor {status ? 'solicitado' : 'ofertado'}: </span>
          <span className="font-bold" aria-label={`Valor ${status ? 'solicitado' : 'ofertado'} de ${formatCurrency(amount)}`}>
            {formatCurrency(amount)}
          </span>
        </div>
      </div>
    </div>
  );
};
