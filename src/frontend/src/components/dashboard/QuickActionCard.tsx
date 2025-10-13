import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    onClick: () => void;
    count?: number;
    countLabel?: string;
    tone?: 'primary' | 'investor' | 'borrower' | 'success' | 'warning' | 'neutral';
    badgeLabel?: string;
    className?: string;
    titleClassName?: string;
    countClassName?: string;
}

const toneStyles = {
    primary: {
        cardGradient: 'from-white via-primary/5 to-primary/10',
        iconGradient: 'from-primary/25 via-primary/15 to-transparent',
        border: 'border-primary/20',
        title: 'text-primary',
        count: 'text-primary',
        badge: 'bg-white/80 text-primary',
    },
    investor: {
        cardGradient: 'from-white via-investor/6 to-investor/12',
        iconGradient: 'from-investor/25 via-investor/10 to-transparent',
        border: 'border-investor/25',
        title: 'text-investor',
        count: 'text-investor',
        badge: 'bg-white/80 text-investor',
    },
    borrower: {
        cardGradient: 'from-white via-borrower/6 to-borrower/12',
        iconGradient: 'from-borrower/25 via-borrower/10 to-transparent',
        border: 'border-borrower/25',
        title: 'text-borrower',
        count: 'text-borrower',
        badge: 'bg-white/80 text-borrower',
    },
    success: {
        cardGradient: 'from-white via-positive/10 to-positive/5',
        iconGradient: 'from-positive/25 via-positive/10 to-transparent',
        border: 'border-positive/25',
        title: 'text-positive',
        count: 'text-positive',
        badge: 'bg-white/80 text-positive',
    },
    warning: {
        cardGradient: 'from-white via-warning/10 to-warning/5',
        iconGradient: 'from-warning/25 via-warning/10 to-transparent',
        border: 'border-warning/30',
        title: 'text-warning',
        count: 'text-warning',
        badge: 'bg-white/80 text-warning',
    },
    neutral: {
        cardGradient: 'from-white via-muted/10 to-muted/5',
        iconGradient: 'from-muted/30 via-muted/15 to-transparent',
        border: 'border-border/60',
        title: 'text-foreground',
        count: 'text-foreground',
        badge: 'bg-white/80 text-muted-foreground',
    },
} satisfies Record<string, {
    cardGradient: string;
    iconGradient: string;
    border: string;
    title: string;
    count: string;
    badge: string;
}>;

export const QuickActionCard = ({
    icon: Icon,
    title,
    description,
    onClick,
    count,
    countLabel,
    tone = 'primary',
    badgeLabel = 'Acesso rápido',
    className,
    titleClassName,
    countClassName,
}: QuickActionCardProps) => {
    const palette = toneStyles[tone] ?? toneStyles.primary;

    return (
        <button
            onClick={onClick}
            className={cn(
                'group relative w-full overflow-hidden rounded-3xl border bg-card p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                palette.border,
                className,
            )}
            aria-label={description}
        >
            <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-r', palette.cardGradient)} />
            <div className="relative flex flex-wrap items-center gap-6 md:flex-nowrap">
                <div className="flex flex-1 items-center gap-4">
                    <div
                        className={cn(
                            'flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-lg shadow-sm transition-transform duration-200 group-hover:scale-105',
                            palette.iconGradient,
                            palette.count,
                        )}
                    >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <div className={cn('text-base font-semibold tracking-tight', palette.title, titleClassName)}>
                            {title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {description}
                        </div>
                        {badgeLabel && (
                            <div className={cn(
                                'mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide shadow-sm backdrop-blur',
                                palette.badge,
                            )}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {badgeLabel}
                            </div>
                        )}
                    </div>
                </div>

                {typeof count === 'number' && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center md:items-end md:text-right">
                        {countLabel && (
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                {countLabel}
                            </span>
                        )}
                        <span className={cn('text-3xl font-black leading-none', palette.count, countClassName)}>
                            {count}
                        </span>
                    </div>
                )}

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-white/80 text-muted-foreground transition-all group-hover:border-primary/40 group-hover:text-primary" aria-hidden="true">
                    →
                </span>
            </div>
        </button>
    );
};
