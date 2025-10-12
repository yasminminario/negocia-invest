import React from 'react';
import { formatCurrency } from '@/utils/calculations';
import { Check, Clock, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaymentInstallment {
  number: number;
  dueDate: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: Date;
}

interface PaymentScheduleProps {
  installments: PaymentInstallment[];
  className?: string;
}

export const PaymentSchedule: React.FC<PaymentScheduleProps> = ({
  installments,
  className,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getStatusConfig = (status: PaymentInstallment['status']) => {
    switch (status) {
      case 'paid':
        return {
          icon: Check,
          label: 'Pago',
          iconColor: 'text-status-concluded',
          bgColor: 'bg-status-concluded/10',
          borderColor: 'border-status-concluded/20',
        };
      case 'overdue':
        return {
          icon: Circle,
          label: 'Atrasado',
          iconColor: 'text-status-cancelled',
          bgColor: 'bg-status-cancelled/10',
          borderColor: 'border-status-cancelled/20',
        };
      default:
        return {
          icon: Clock,
          label: 'Pendente',
          iconColor: 'text-status-active',
          bgColor: 'bg-status-active/10',
          borderColor: 'border-status-active/20',
        };
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {installments.map((installment) => {
        const config = getStatusConfig(installment.status);
        const Icon = config.icon;

        return (
          <div
            key={installment.number}
            className={cn(
              'flex items-center justify-between p-4 rounded-lg border',
              config.bgColor,
              config.borderColor
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  config.bgColor
                )}
              >
                <Icon className={cn('w-4 h-4', config.iconColor)} />
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  Parcela {installment.number}
                </div>
                <div className="text-xs text-muted-foreground">
                  Vencimento: {formatDate(installment.dueDate)}
                </div>
                {installment.paidDate && (
                  <div className="text-xs text-status-concluded">
                    Pago em: {formatDate(installment.paidDate)}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-foreground">
                {formatCurrency(installment.amount)}
              </div>
              <div
                className={cn(
                  'text-xs font-medium',
                  config.iconColor
                )}
              >
                {config.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
