import { useEffect, useState } from 'react';
import { CheckCircle2, Lightbulb, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHintProps {
    storageKey: string;
    title: string;
    description: string;
    bullets?: string[];
    variant?: 'primary' | 'borrower' | 'investor';
    className?: string;
}

const variantClasses: Record<NonNullable<PageHintProps['variant']>, string> = {
    primary: 'border-primary/40 bg-primary/5 text-primary',
    borrower: 'border-borrower/40 bg-borrower/5 text-borrower',
    investor: 'border-investor/40 bg-investor/5 text-investor',
};

export const PageHint = ({
    storageKey,
    title,
    description,
    bullets,
    variant = 'primary',
    className,
}: PageHintProps) => {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const storedState = window.localStorage.getItem(storageKey);
        if (storedState === 'dismissed') {
            setDismissed(true);
        } else {
            setVisible(true);
        }
    }, [storageKey]);

    const handleDismiss = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(storageKey, 'dismissed');
        }
        setVisible(false);
        setDismissed(true);
    };

    const handleRestore = () => {
        setVisible(true);
        setDismissed(false);
    };

    if (!visible) {
        if (!dismissed) {
            return null;
        }

        return (
            <button
                type="button"
                onClick={handleRestore}
                className={cn(
                    'group inline-flex items-center gap-1 rounded-full border border-primary/30 bg-background px-3 py-1 text-xs font-medium text-primary shadow-sm transition-all hover:bg-primary hover:text-primary-foreground',
                    className,
                )}
                aria-label="Reabrir dica"
            >
                <Lightbulb className="h-4 w-4 transition-transform group-hover:rotate-6" aria-hidden="true" />
                Ver dica novamente
            </button>
        );
    }

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md',
                variantClasses[variant],
                className,
            )}
            role="note"
        >
            <button
                type="button"
                onClick={handleDismiss}
                className="absolute right-4 top-4 rounded-full bg-background/70 p-1 text-xs text-muted-foreground shadow hover:text-foreground"
                aria-label="Fechar dica"
            >
                <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-background/70 p-2 text-current shadow">
                    <Lightbulb className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-2">
                    <p className="font-semibold leading-tight">{title}</p>
                    <p className="text-sm text-muted-foreground/90">{description}</p>
                    {bullets && bullets.length > 0 && (
                        <ul className="space-y-2 text-xs text-muted-foreground/90">
                            {bullets.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-px h-4 w-4 flex-shrink-0 text-current/80" aria-hidden="true" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
