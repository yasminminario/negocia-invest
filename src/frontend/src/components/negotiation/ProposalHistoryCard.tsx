import React from 'react';
import { NegotiationProposal } from '@/types';
import { formatCurrency, formatInterestRate } from '@/utils/calculations';
import { User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProposalHistoryCardProps {
  proposal: NegotiationProposal;
  proposerName: string;
  isCurrentUser: boolean;
  isLatest?: boolean;
}

export const ProposalHistoryCard: React.FC<ProposalHistoryCardProps> = ({
  proposal,
  proposerName,
  isCurrentUser,
  isLatest = false,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 transition-all',
        isLatest
          ? 'border-primary bg-primary/5'
          : 'border-border bg-card',
        isCurrentUser && 'ml-8',
        !isCurrentUser && 'mr-8'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className={cn(
            'font-semibold text-sm',
            isCurrentUser ? 'text-primary' : 'text-foreground'
          )}>
            {proposerName}
            {isCurrentUser && ' (Você)'}
          </span>
        </div>
        {isLatest && (
          <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            Atual
          </span>
        )}
      </div>

      {/* Interest Rate */}
      <div className="mb-3">
        <div className="text-2xl font-bold text-primary">
          {formatInterestRate(proposal.proposedRate)}
        </div>
      </div>

      {/* Payment Details */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-xs text-muted-foreground">Parcela mensal</div>
          <div className="text-sm font-semibold text-foreground">
            {formatCurrency(proposal.monthlyPayment)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="text-sm font-semibold text-foreground">
            {formatCurrency(proposal.totalAmount)}
          </div>
        </div>
      </div>

      {/* Message */}
      {proposal.message && (
        <div className="mb-3 p-3 rounded bg-muted/50">
          <p className="text-sm text-foreground italic">"{proposal.message}"</p>
        </div>
      )}

      {/* Timestamp */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Calendar className="w-3 h-3" />
        <span>{formatDate(proposal.createdAt)}</span>
      </div>
    </div>
  );
};
