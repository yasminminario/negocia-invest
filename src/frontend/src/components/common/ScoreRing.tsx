import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreRingProps {
  score: number; // 0-1000
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 'md',
  className,
}) => {
  const percentage = (score / 1000) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-success';
    if (score >= 600) return 'text-primary';
    return 'text-warning';
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', sizeClasses[size], className)}>
      {/* SVG Ring */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        {/* Background ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted opacity-20"
        />
        {/* Progress ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className={getScoreColor(score)}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transition: 'stroke-dashoffset 0.5s ease',
          }}
        />
      </svg>

      {/* Score text */}
      <div className="flex flex-col items-center">
        <span className={cn('font-bold', textSizes[size], getScoreColor(score))}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground">Score</span>
      </div>
    </div>
  );
};
