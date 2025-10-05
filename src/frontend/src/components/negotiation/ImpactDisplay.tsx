import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/calculations';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ImpactDisplayProps {
  type: 'savings' | 'profit';
  value: number;
  className?: string;
}

export const ImpactDisplay: React.FC<ImpactDisplayProps> = ({
  type,
  value,
  className,
}) => {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  // Determinar label baseado no tipo e se é positivo/negativo
  const getLabel = () => {
    if (isNeutral) return type === 'savings' ? 'Sem impacto' : 'Sem lucro';
    
    if (type === 'savings') {
      return isPositive ? 'Economia estimada' : 'Custo adicional';
    } else {
      return isPositive ? 'Lucro estimado' : 'Redução de lucro';
    }
  };

  // Determinar cores
  const getColorClasses = () => {
    if (isNeutral) {
      return {
        border: 'border-muted',
        bg: 'bg-muted/30',
        text: 'text-muted-foreground',
        icon: 'text-muted-foreground',
      };
    }

    if (isPositive) {
      return {
        border: 'border-positive',
        bg: 'bg-positive-light',
        text: 'text-positive',
        icon: 'text-positive',
      };
    }

    return {
      border: 'border-negative',
      bg: 'bg-negative-light',
      text: 'text-negative',
      icon: 'text-negative',
    };
  };

  const colors = getColorClasses();
  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : DollarSign;

  return (
    <div
      className={cn(
        'p-4 rounded-2xl border-2 transition-all duration-300',
        colors.border,
        colors.bg,
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-full bg-background/60', colors.icon)}>
            <Icon className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className={cn('text-xs font-medium', colors.text)}>
              {getLabel()}
            </p>
            <p className={cn('text-2xl font-bold mt-0.5', colors.text)}>
              {isNegative ? '-' : '+'} {formatCurrency(Math.abs(value))}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar visual (opcional) */}
      {!isNeutral && (
        <div className="mt-3 h-1.5 bg-background/60 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isPositive ? 'bg-positive' : 'bg-negative'
            )}
            style={{
              width: `${Math.min(Math.abs(value) / 1000, 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};
