import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatInterestRate } from '@/utils/calculations';
import { StatusBadge } from './StatusBadge';
import { LoanStatus, OfferStatus } from '@/types';
import { useTranslation } from 'react-i18next';

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
  tone?: 'primary' | 'investor' | 'borrower' | 'success' | 'warning' | 'neutral';
}

const toneStyles = {
  primary: {
    cardGradient: 'from-white via-primary/5 to-primary/10',
    border: 'border-primary/20',
    avatar: 'from-primary/20 via-primary/10 to-transparent text-primary',
  },
  investor: {
    cardGradient: 'from-white via-investor/6 to-investor/12',
    border: 'border-investor/20',
    avatar: 'from-investor/20 via-investor/10 to-transparent text-investor',
  },
  borrower: {
    cardGradient: 'from-white via-borrower/6 to-borrower/12',
    border: 'border-borrower/20',
    avatar: 'from-borrower/20 via-borrower/10 to-transparent text-borrower',
  },
  success: {
    cardGradient: 'from-white via-positive/8 to-positive/5',
    border: 'border-positive/25',
    avatar: 'from-positive/20 via-positive/10 to-transparent text-positive',
  },
  warning: {
    cardGradient: 'from-white via-warning/8 to-warning/4',
    border: 'border-warning/25',
    avatar: 'from-warning/20 via-warning/10 to-transparent text-warning',
  },
  neutral: {
    cardGradient: 'from-white via-muted/10 to-muted/5',
    border: 'border-border/50',
    avatar: 'from-muted/40 via-muted/20 to-transparent text-muted-foreground',
  },
} satisfies Record<string, {
  cardGradient: string;
  border: string;
  avatar: string;
}>;

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
  tone = 'primary',
}) => {
  const { t } = useTranslation();
  const palette = toneStyles[tone] ?? toneStyles.primary;
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);

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
      aria-label={t('common.loanCard.ariaLabel', {
        name,
        amount: formatCurrency(amount),
        rate: formatInterestRate(interestRate),
        installments,
        payment: formatCurrency(monthlyPayment),
        score,
      })}
      className={cn(
        'relative overflow-hidden rounded-3xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        palette.border,
        className
      )}
    >
      <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-r', palette.cardGradient)} />

      {/* Header */}
      <div className="relative mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold shadow-sm', palette.avatar)}>
            <span>{initials}</span>
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
      <div className="relative grid grid-cols-1 gap-3 border-y border-border/40 py-4 text-sm md:grid-cols-3">
        <div className="md:border-r md:border-border/30 md:pr-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('common.loanCard.interestRate')}</div>
          <div className="mt-1 text-lg font-bold text-primary" aria-label={`${t('common.loanCard.interestRate')} ${formatInterestRate(interestRate)}`}>
            {formatInterestRate(interestRate)}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('common.loanCard.period')}</div>
          <div className="mt-1 text-base font-semibold" aria-label={t('common.months', { count: installments })}>
            {t('common.months', { count: installments })}
          </div>
        </div>
        <div className="md:border-l md:border-border/30 md:pl-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('common.loanCard.monthlyPayment')}</div>
          <div className="mt-1 text-base font-semibold" aria-label={`${t('common.loanCard.monthlyPayment')} ${formatCurrency(monthlyPayment)}`}>
            {formatCurrency(monthlyPayment)}
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="relative mt-4 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('common.loanCard.totalToPay')}</span>
          <span className="text-base font-bold" aria-label={`${t('common.loanCard.totalToPay')} ${formatCurrency(total)}`}>
            {formatCurrency(total)}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('common.loanCard.amountOffered', {
              type: t(`common.loanCard.${status ? 'requested' : 'offered'}`),
            })}
          </span>
          <span className="text-base font-bold" aria-label={`${t('common.loanCard.amountOffered', {
            type: t(`common.loanCard.${status ? 'requested' : 'offered'}`),
          })} ${formatCurrency(amount)}`}>
            {formatCurrency(amount)}
          </span>
        </div>
      </div>
    </div>
  );
};
