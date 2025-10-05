import React, { useState, useEffect } from 'react';
import { calculateTimeRemaining } from '@/utils/calculations';
import { cn } from '@/lib/utils';

interface NegotiationTimerProps {
  expiresAt: Date;
  className?: string;
}

export const NegotiationTimer: React.FC<NegotiationTimerProps> = ({
  expiresAt,
  className,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(expiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const isExpiringSoon = () => {
    const [hours] = timeRemaining.split(':').map(Number);
    return hours < 2;
  };

  return (
    <div className={cn('flex items-center justify-between p-4 rounded-lg bg-muted', className)}>
      <span className="text-sm font-medium text-foreground">
        Tempo restante de negociação:
      </span>
      <span
        className={cn(
          'text-lg font-bold',
          isExpiringSoon() ? 'text-warning' : 'text-primary'
        )}
      >
        {timeRemaining}
      </span>
    </div>
  );
};
