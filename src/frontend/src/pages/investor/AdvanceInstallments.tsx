import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { negociacoesApi, usuariosApi } from '@/services/api.service';
import {
    calculateMonthlyPayment,
    calculateTotalAmount,
    formatCurrency,
    formatInterestRate,
} from '@/utils/calculations';
import type { NegociacaoResponse, Usuario } from '@/types';
import { AlertTriangle, ArrowLeft, CalendarDays, CheckCircle2, Clock, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface InstallmentOption {
    id: string;
    number: number;
    amount: number;
    dueDate: Date;
    daysUntilDue: number;
}

interface LoanOverview {
    negotiation: NegociacaoResponse;
    borrower: Usuario | null;
    investor: Usuario | null;
    amount: number;
    installments: number;
    interestRate: number;
    monthlyPayment: number;
    totalAmount: number;
    startDate: Date;
}

const AdvanceInstallments: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loan, setLoan] = useState<LoanOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showConfirm, setShowConfirm] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [completed, setCompleted] = useState(false);
    const { t, i18n } = useTranslation();

    const resolveLocale = useCallback(() => {
        const language = i18n.resolvedLanguage || i18n.language || 'pt-BR';
        if (language.startsWith('pt')) return 'pt-BR';
        if (language.startsWith('es')) return 'es-ES';
        if (language.startsWith('en')) return 'en-US';
        return language;
    }, [i18n.language, i18n.resolvedLanguage]);

    const formatDate = useCallback((date: Date) => {
        return new Intl.DateTimeFormat(resolveLocale(), {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date);
    }, [resolveLocale]);

    useEffect(() => {
        const fetchLoan = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                const negotiationId = Number(id);
                const negotiation = await negociacoesApi.obterPorId(negotiationId);
                const [investor, borrower] = await Promise.all([
                    usuariosApi.obterPorId(negotiation.id_investidor).catch(() => null),
                    usuariosApi.obterPorId(negotiation.id_tomador).catch(() => null),
                ]);

                const amount = Number(negotiation.valor ?? 0);
                const installments = Number(negotiation.prazo ?? 0);
                const interestRate = Number(negotiation.taxa ?? 0);
                const monthlyPayment = Number(
                    negotiation.parcela ?? (installments ? calculateMonthlyPayment(amount, interestRate, installments) : 0),
                );
                const totalAmount = installments ? calculateTotalAmount(monthlyPayment, installments) : monthlyPayment;
                const startDate = negotiation.criado_em ? new Date(negotiation.criado_em) : new Date();

                setLoan({
                    negotiation,
                    borrower,
                    investor,
                    amount,
                    installments,
                    interestRate,
                    monthlyPayment,
                    totalAmount,
                    startDate,
                });
            } catch (err) {
                console.error('Erro ao carregar empréstimo para antecipação:', err);
                const message = err instanceof Error ? err.message : 'Erro ao carregar dados do empréstimo.';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchLoan();
    }, [id]);

    const installmentOptions = useMemo<InstallmentOption[]>(() => {
        if (!loan) return [];

        const options: InstallmentOption[] = [];
        const today = new Date();
        const baseDate = new Date(loan.startDate);

        for (let index = 0; index < loan.installments; index += 1) {
            const dueDate = new Date(baseDate);
            dueDate.setMonth(baseDate.getMonth() + index + 1);

            const daysUntilDue = Math.max(0, Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

            if (daysUntilDue <= 0) {
                continue; // parcela já recebida
            }

            options.push({
                id: `${loan.negotiation.id}-${index + 1}`,
                number: index + 1,
                amount: loan.monthlyPayment,
                dueDate,
                daysUntilDue,
            });
        }

        return options;
    }, [loan]);

    const toggleInstallment = (installmentId: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(installmentId)) {
                next.delete(installmentId);
            } else {
                next.add(installmentId);
            }
            return next;
        });
    };

    const selectedInstallments = useMemo(() => {
        return installmentOptions.filter((item) => selectedIds.has(item.id));
    }, [installmentOptions, selectedIds]);

    const totalOriginal = useMemo(() => {
        return selectedInstallments.reduce((sum, installment) => sum + installment.amount, 0);
    }, [selectedInstallments]);

    const anticipationFee = useMemo(() => {
        // Mock da taxa: 1.4% do valor + 0.15% por mês até o vencimento
        return selectedInstallments.reduce((sum, installment) => {
            const monthsUntilDue = Math.max(0, Math.ceil(installment.daysUntilDue / 30));
            const baseRate = 0.014;
            const timeFactor = 0.0015 * monthsUntilDue;
            return sum + installment.amount * (baseRate + timeFactor);
        }, 0);
    }, [selectedInstallments]);

    const netAmount = useMemo(() => {
        return Math.max(0, totalOriginal - anticipationFee);
    }, [totalOriginal, anticipationFee]);

    const buttonLabel = useMemo(() => {
        if (!selectedInstallments.length) {
            return t('advanceInstallments.buttons.select');
        }

        return t('advanceInstallments.buttons.advanceCount', {
            count: selectedInstallments.length,
        });
    }, [selectedInstallments.length, t]);

    const handleConfirm = async () => {
        if (!selectedInstallments.length) return;

        try {
            setProcessing(true);
            // Mock de chamada ao backend
            await new Promise((resolve) => setTimeout(resolve, 1200));
            setCompleted(true);
        } finally {
            setProcessing(false);
            setShowConfirm(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header showBackButton onBack={() => navigate('/investor/loans')} />
                <main className="container max-w-md mx-auto px-4 py-6">
                    <p>{t('advanceInstallments.loading')}</p>
                </main>
            </div>
        );
    }

    if (error || !loan) {
        return (
            <div className="min-h-screen bg-background">
                <Header showBackButton onBack={() => navigate('/investor/loans')} />
                <main className="container max-w-md mx-auto px-4 py-6 space-y-4">
                    <p className="text-destructive">{error ?? t('advanceInstallments.error')}</p>
                    <Button onClick={() => navigate('/investor/loans')}>{t('buttons.back')}</Button>
                </main>
            </div>
        );
    }

    if (completed) {
        return (
            <div className="min-h-screen bg-background">
                <Header showBackButton onBack={() => navigate('/investor/loans')} />
                <main className="container max-w-md mx-auto px-4 py-10 space-y-8 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-investor/20 via-investor/10 to-transparent text-investor shadow-lg">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-2xl font-bold text-foreground">{t('advanceInstallments.success.title')}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t('advanceInstallments.success.description')}
                        </p>
                    </div>
                    <div className="relative overflow-hidden rounded-3xl border border-investor/20 bg-card p-5 text-left shadow-sm">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-investor/6 to-investor/12" />
                        <div className="relative space-y-3">
                            <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                <span>{t('advanceInstallments.summary.original')}</span>
                                <span className="text-foreground">{formatCurrency(totalOriginal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                <span>{t('advanceInstallments.summary.fee')}</span>
                                <span className="text-status-cancelled">- {formatCurrency(anticipationFee)}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 text-base font-bold text-investor shadow-sm backdrop-blur">
                                <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('advanceInstallments.summary.net')}</span>
                                <span>{formatCurrency(netAmount)}</span>
                            </div>
                        </div>
                    </div>
                    <Button className="w-full" onClick={() => navigate('/investor/loans')}>
                        {t('advanceInstallments.success.back')}
                    </Button>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header showBackButton onBack={() => navigate('/investor/loans')} />

            <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold text-primary">{t('advanceInstallments.title')}</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    {t('advanceInstallments.instructions')}
                </p>

                <div className="relative overflow-hidden rounded-3xl border border-investor/20 bg-card p-5 shadow-sm">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-investor/6 to-investor/12" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('advanceInstallments.overview.loan', { id: loan.negotiation.id })}</p>
                            <p className="text-base font-semibold text-foreground">{loan.borrower?.nome ?? t('advanceInstallments.overview.borrowerFallback', { id: loan.negotiation.id_tomador })}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('advanceInstallments.overview.rate')}</p>
                            <p className="text-base font-semibold text-investor">{formatInterestRate(loan.interestRate)}</p>
                        </div>
                    </div>
                    <div className="relative mt-4 flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground shadow-sm backdrop-blur">
                        <CalendarDays className="h-4 w-4 text-investor" />
                        {t('advanceInstallments.overview.summary', {
                            count: loan.installments,
                            amount: formatCurrency(loan.monthlyPayment),
                        })}
                    </div>
                </div>

                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <h2 className="text-lg font-semibold text-foreground">{t('advanceInstallments.installments.title')}</h2>
                    </div>

                    {installmentOptions.length === 0 ? (
                        <div className="rounded-2xl border border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground space-y-2">
                            <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground/60" />
                            <p>{t('advanceInstallments.installments.none')}</p>
                            <Button variant="outline" onClick={() => navigate('/investor/loans')}>
                                {t('advanceInstallments.installments.emptyCta')}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {installmentOptions.map((installment) => {
                                const isSelected = selectedIds.has(installment.id);
                                return (
                                    <label
                                        key={installment.id}
                                        htmlFor={installment.id}
                                        className={cn(
                                            'relative flex items-start gap-3 overflow-hidden rounded-3xl border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
                                            isSelected ? 'border-investor/70 bg-white/80 backdrop-blur' : 'border-border/60'
                                        )}
                                    >
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-investor/6 to-transparent" />
                                        <Checkbox
                                            id={installment.id}
                                            checked={isSelected}
                                            onCheckedChange={() => toggleInstallment(installment.id)}
                                            className="relative mt-1"
                                        />
                                        <div className="relative flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {t('advanceInstallments.installments.label', {
                                                            number: installment.number,
                                                            total: loan.installments,
                                                        })}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {t('advanceInstallments.installments.due', {
                                                            date: formatDate(installment.dueDate),
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-foreground">{formatCurrency(installment.amount)}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {t('advanceInstallments.installments.inDays', {
                                                            days: installment.daysUntilDue,
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <h2 className="text-lg font-semibold text-foreground">{t('advanceInstallments.summary.title')}</h2>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl border border-investor/20 bg-card p-5 shadow-sm">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-investor/6 to-investor/12" />
                        <div className="relative flex items-center justify-between">
                            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('advanceInstallments.summary.original')}</span>
                            <span className="text-base font-semibold text-foreground">{formatCurrency(totalOriginal)}</span>
                        </div>
                        <div className="relative mt-4 flex items-center justify-between">
                            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('advanceInstallments.summary.fee')}</span>
                            <span className="text-base font-semibold text-status-cancelled">- {formatCurrency(anticipationFee)}</span>
                        </div>
                        <div className="relative mt-6 flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 text-base font-bold text-investor shadow-sm backdrop-blur">
                            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('advanceInstallments.summary.net')}</span>
                            <span className="text-2xl font-bold text-investor">{formatCurrency(netAmount)}</span>
                        </div>
                    </div>
                </section>

                <Button
                    className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-investor to-investor/80 text-base font-semibold text-primary-foreground shadow-lg shadow-investor/30 transition-all duration-200 hover:translate-y-[-1px] hover:from-investor/90 hover:to-investor/70 focus-visible:ring-2 focus-visible:ring-investor"
                    disabled={!selectedInstallments.length}
                    onClick={() => setShowConfirm(true)}
                >
                    <Sparkles className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
                    {buttonLabel}
                </Button>

                <Button
                    variant="ghost"
                    className="w-full text-sm text-muted-foreground"
                    onClick={() => navigate(`/investor/loan/${loan.negotiation.id}`)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('advanceInstallments.buttons.backToLoan')}
                </Button>
            </main>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={t('advanceInstallments.confirm.title')}
                description={t('advanceInstallments.confirm.description', {
                    amount: formatCurrency(netAmount),
                })}
                confirmText={processing ? t('advanceInstallments.buttons.processing') : t('advanceInstallments.buttons.confirm')}
                confirmDisabled={processing}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default AdvanceInstallments;
