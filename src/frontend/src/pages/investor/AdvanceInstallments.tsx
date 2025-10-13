import React, { useEffect, useMemo, useState } from 'react';
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
import { AlertTriangle, ArrowLeft, CalendarDays, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

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

    const buttonLabel = selectedInstallments.length
        ? `Antecipar ${selectedInstallments.length} ${selectedInstallments.length === 1 ? 'parcela' : 'parcelas'}`
        : 'Selecionar parcelas';

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

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header showBackButton onBack={() => navigate('/investor/loans')} />
                <main className="container max-w-md mx-auto px-4 py-6">
                    <p>Carregando parcelas disponíveis...</p>
                </main>
            </div>
        );
    }

    if (error || !loan) {
        return (
            <div className="min-h-screen bg-background">
                <Header showBackButton onBack={() => navigate('/investor/loans')} />
                <main className="container max-w-md mx-auto px-4 py-6 space-y-4">
                    <p className="text-destructive">{error ?? 'Empréstimo não encontrado'}</p>
                    <Button onClick={() => navigate('/investor/loans')}>Voltar</Button>
                </main>
            </div>
        );
    }

    if (completed) {
        return (
            <div className="min-h-screen bg-background">
                <Header showBackButton onBack={() => navigate('/investor/loans')} />
                <main className="container max-w-md mx-auto px-4 py-10 space-y-8 text-center">
                    <div className="mx-auto w-20 h-20 rounded-full bg-status-concluded/10 text-status-concluded flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-2xl font-bold text-foreground">Antecipação solicitada!</h1>
                        <p className="text-sm text-muted-foreground">
                            O valor estará disponível na sua conta em até 2 dias úteis. Você receberá uma notificação assim que a transferência for concluída.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4 text-left space-y-2">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Total antecipado</span>
                            <span className="font-semibold text-foreground">{formatCurrency(totalOriginal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Taxa retida</span>
                            <span className="font-semibold text-status-cancelled">- {formatCurrency(anticipationFee)}</span>
                        </div>
                        <div className="flex items-center justify-between text-base font-semibold text-primary">
                            <span>Valor líquido recebido</span>
                            <span>{formatCurrency(netAmount)}</span>
                        </div>
                    </div>
                    <Button className="w-full" onClick={() => navigate('/investor/loans')}>
                        Voltar para meus empréstimos
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
                    <h1 className="text-2xl font-bold text-primary">Antecipar parcelas</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    Selecione as parcelas que deseja antecipar. Os valores abaixo são estimativas e podem variar após análise final.
                </p>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Empréstimo #{loan.negotiation.id}</p>
                            <p className="text-base font-semibold text-foreground">{loan.borrower?.nome ?? `Tomador #${loan.negotiation.id_tomador}`}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Taxa contratada</p>
                            <p className="text-base font-semibold text-primary">{formatInterestRate(loan.interestRate)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <CalendarDays className="w-4 h-4" />
                        {loan.installments} parcelas totais · {formatCurrency(loan.monthlyPayment)} por parcela
                    </div>
                </div>

                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <h2 className="text-lg font-semibold text-foreground">Parcelas disponíveis</h2>
                    </div>

                    {installmentOptions.length === 0 ? (
                        <div className="rounded-2xl border border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground space-y-2">
                            <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground/60" />
                            <p>Este empréstimo não possui parcelas futuras para antecipação.</p>
                            <Button variant="outline" onClick={() => navigate('/investor/loans')}>
                                Voltar para meus empréstimos
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {installmentOptions.map((installment) => (
                                <label
                                    key={installment.id}
                                    htmlFor={installment.id}
                                    className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/50"
                                >
                                    <Checkbox
                                        id={installment.id}
                                        checked={selectedIds.has(installment.id)}
                                        onCheckedChange={() => toggleInstallment(installment.id)}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">Parcela {installment.number}/{loan.installments}</p>
                                                <p className="text-xs text-muted-foreground">Vencimento: {formatDate(installment.dueDate)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-foreground">{formatCurrency(installment.amount)}</p>
                                                <p className="text-xs text-muted-foreground">em {installment.daysUntilDue} dias</p>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <h2 className="text-lg font-semibold text-foreground">Resumo da antecipação</h2>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Valor original a receber</span>
                            <span className="text-base font-semibold text-foreground">{formatCurrency(totalOriginal)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Taxa de antecipação</span>
                            <span className="text-base font-semibold text-status-cancelled">- {formatCurrency(anticipationFee)}</span>
                        </div>
                        <div className="pt-4 border-t border-border flex items-center justify-between">
                            <span className="text-sm font-semibold text-muted-foreground">Valor líquido agora</span>
                            <span className="text-2xl font-bold text-primary">{formatCurrency(netAmount)}</span>
                        </div>
                    </div>
                </section>

                <Button
                    className="w-full h-14 text-base"
                    disabled={!selectedInstallments.length}
                    onClick={() => setShowConfirm(true)}
                >
                    {buttonLabel}
                </Button>

                <Button
                    variant="ghost"
                    className="w-full text-sm text-muted-foreground"
                    onClick={() => navigate(`/investor/loan/${loan.negotiation.id}`)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Ver detalhes do empréstimo
                </Button>
            </main>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Confirmar antecipação?"
                description={`Você está prestes a receber ${formatCurrency(netAmount)} agora. Esta ação é irreversível.`}
                confirmText={processing ? 'Processando...' : 'Confirmar e antecipar'}
                confirmDisabled={processing}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default AdvanceInstallments;
