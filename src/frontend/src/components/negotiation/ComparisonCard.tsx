import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatInterestRate } from '@/utils/calculations';
import { useProfile } from '@/contexts/ProfileContext';
import { DollarSign, Calendar } from 'lucide-react';

interface ComparisonCardProps {
  type: 'current' | 'proposed';
  label: string;
  interestRate: number;
  monthlyPayment: number;
  totalAmount: number;
  highlightColor?: 'borrower' | 'investor';
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  type,
  label,
  interestRate,
  monthlyPayment,
  totalAmount,
  highlightColor,
}) => {
  const { activeProfile } = useProfile();
  const isHighlighted = type === 'proposed';
  
  // Define a cor da borda baseado no perfil
  const borderColor = highlightColor === 'borrower' 
    ? 'border-primary-borrower' 
    : highlightColor === 'investor'
    ? 'border-primary-investor'
    : activeProfile === 'borrower'
    ? 'border-primary-borrower'
    : 'border-primary-investor';

  return (
    <div
      className={cn(
        'p-4 rounded-2xl border-2 transition-all',
        isHighlighted 
          ? `${borderColor} bg-primary/5` 
          : 'border-border bg-card'
      )}
    >
      {/* Label */}
      <div className={cn(
        'text-sm font-medium mb-3',
        isHighlighted && 'text-primary'
      )}>
        {label}
      </div>

      {/* Taxa de juros */}
      <div className="text-2xl font-bold mb-4">
        Juros: {formatInterestRate(interestRate)}
      </div>

      {/* Divider */}
      <div className="border-t my-3" />

      {/* Parcela mensal */}
      <div className="space-y-1 mb-3">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Parcela mensal
        </div>
        <div className={cn(
          'font-semibold',
          isHighlighted ? 'text-primary' : 'text-foreground'
        )}>
          {formatCurrency(monthlyPayment)}
        </div>
      </div>

      {/* Valor total */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          Valor total do empréstimo
        </div>
        <div className={cn(
          'font-semibold',
          isHighlighted ? 'text-primary' : 'text-foreground'
        )}>
          {formatCurrency(totalAmount)}
        </div>
      </div>
    </div>
  );
};
