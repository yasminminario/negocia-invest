import React from 'react';
import { cn } from '@/lib/utils';
import { LoanStatus, NegotiationStatus, OfferStatus } from '@/types';

interface StatusBadgeProps {
  status: LoanStatus | NegotiationStatus | OfferStatus;
  className?: string;
}

const statusConfig = {
  // LoanStatus - Para empréstimos ativos (após aceite)
  active: {
    label: 'Ativo',
    icon: '≈',
    className: 'bg-status-active/10 text-status-active border-status-active/20',
  },
  concluded: {
    label: 'Concluído',
    icon: '✓',
    className: 'bg-status-concluded/10 text-status-concluded border-status-concluded/20',
  },
  cancelled: {
    label: 'Cancelado',
    icon: '⊗',
    className: 'bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20',
  },
  // OfferStatus - Para ofertas/solicitações (antes de aceite)
  fixed: {
    label: 'Fixo',
    icon: '🔒',
    className: 'bg-status-fixed/10 text-status-fixed border-status-fixed/20',
  },
  negotiable: {
    label: 'Negociável',
    icon: '🤝',
    className: 'bg-status-negotiable/10 text-status-negotiable border-status-negotiable/20',
  },
  // NegotiationStatus - Para negociações em andamento
  em_negociacao: {
    label: 'Em negociação',
    icon: '🤝',
    className: 'bg-status-active/10 text-status-active border-status-active/20',
  },
  em_andamento: {
    label: 'Em andamento',
    icon: '⏳',
    className: 'bg-status-active/10 text-status-active border-status-active/20',
  },
  pendente: {
    label: 'Pendente',
    icon: '⌛',
    className: 'bg-status-pending/10 text-status-pending border-status-pending/20',
  },
  finalizada: {
    label: 'Finalizada',
    icon: '✓',
    className: 'bg-status-completed/10 text-status-completed border-status-completed/20',
  },
  cancelada: {
    label: 'Cancelada',
    icon: '⊗',
    className: 'bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20',
  },
  expirada: {
    label: 'Expirada',
    icon: '⏰',
    className: 'bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status as keyof typeof statusConfig];

  if (!config) return null;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
};
