import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PaymentSchedule, PaymentInstallment } from '@/components/loan/PaymentSchedule';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { negociacoesApi, usuariosApi } from '@/services/api.service';
import {
  calculateIntermediationFee,
  calculateInterestAmount,
  calculateMonthlyPayment,
  calculateTotalAmount,
  formatCurrency,
  formatInterestRate,
} from '@/utils/calculations';
import type { LoanStatus, NegociacaoResponse, Usuario } from '@/types';
import { TrendingUp, Calendar, DollarSign, User, TrendingDown, Sparkles } from 'lucide-react';

const STATUS_MAP: Record<string, LoanStatus> = {
  em_andamento: 'active',
  finalizada: 'concluded',
  cancelada: 'cancelled',
  em_negociacao: 'active',
  pendente: 'active',
};

const mapStatus = (status: string): LoanStatus => STATUS_MAP[status] ?? 'active';

interface LoanDetailsData {
  negotiation: NegociacaoResponse;
  investor: Usuario | null;
  borrower: Usuario | null;
  amount: number;
  installments: number;
  interestRate: number;
  monthlyPayment: number;
  totalAmount: number;
  interestAmount: number;
  intermediationFee: number;
  status: LoanStatus;
  startDate: Date;
}

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loanData, setLoanData] = useState<LoanDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          negotiation.parcela ?? (installments ? calculateMonthlyPayment(amount, interestRate, installments) : 0)
        );
        const totalAmount = installments ? calculateTotalAmount(monthlyPayment, installments) : monthlyPayment;
        const interestAmount = calculateInterestAmount(totalAmount, amount);
        const intermediationFee = calculateIntermediationFee(amount);
        const startDate = negotiation.criado_em ? new Date(negotiation.criado_em) : new Date();

        setLoanData({
          negotiation,
          investor,
          borrower,
          amount,
          installments,
          interestRate,
          monthlyPayment,
          totalAmount,
          interestAmount,
          intermediationFee,
          status: mapStatus(negotiation.status),
          startDate,
        });
      } catch (err) {
        console.error('Erro ao carregar empréstimo do investidor:', err);
        const message = err instanceof Error ? err.message : 'Erro ao carregar empréstimo.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id]);

  const schedule = useMemo<PaymentInstallment[]>(() => {
    if (!loanData) return [];

    const items: PaymentInstallment[] = [];
    const start = new Date(loanData.startDate);

    for (let index = 0; index < loanData.installments; index += 1) {
      const dueDate = new Date(start);
      dueDate.setMonth(start.getMonth() + index + 1);

      items.push({
        number: index + 1,
        dueDate,
        amount: loanData.monthlyPayment,
        status: 'pending',
      });
    }

    return items;
  }, [loanData]);

  const paidInstallments = schedule.filter((installment) => installment.status === 'paid').length;
  const pendingInstallments = loanData ? loanData.installments - paidInstallments : 0;
  const nextPayment = schedule.find((installment) => installment.status !== 'paid');

  const receivedAmount = loanData ? loanData.monthlyPayment * paidInstallments : 0;
  const expectedAmount = loanData?.totalAmount ?? 0;
  const profitReceived = loanData
    ? receivedAmount - loanData.amount * (loanData.installments ? paidInstallments / loanData.installments : 0)
    : 0;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={() => navigate('/investor/loans')} />
        <main className="container max-w-md mx-auto px-4 py-6">
          <p>Carregando detalhes...</p>
        </main>
      </div>
    );
  }

  if (error || !loanData) {
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

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate('/investor/loans')} />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Detalhes do empréstimo</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <StatusBadge status={loanData.status} />
            {pendingInstallments > 0 && (
              <Button
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-investor to-investor/80 px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-investor/30 transition-all duration-200 hover:translate-y-[-1px] hover:from-investor/90 hover:to-investor/70 focus-visible:ring-2 focus-visible:ring-investor"
                onClick={() => navigate(`/investor/loan/${loanData.negotiation.id}/advance`)}
              >
                <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                Antecipar parcelas
              </Button>
            )}
          </div>
        </div>

        {/* Loan Overview */}
        <div className="p-6 rounded-lg bg-card border-2 border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Tomador</div>
              <div className="text-lg font-bold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {loanData.borrower?.nome ?? `Usuário #${loanData.negotiation.id_tomador}`}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Taxa</div>
              <div className="text-lg font-bold text-primary">
                {formatInterestRate(loanData.interestRate)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <div className="text-sm text-muted-foreground">Valor investido</div>
              <div className="text-base font-bold text-foreground">{formatCurrency(loanData.amount)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Retorno total</div>
              <div className="text-base font-bold text-foreground">{formatCurrency(loanData.totalAmount)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Parcela mensal</div>
              <div className="text-base font-bold text-foreground">{formatCurrency(loanData.monthlyPayment)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Lucro estimado</div>
              <div className="text-base font-bold text-status-concluded">
                {formatCurrency(loanData.interestAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Next Payment */}
        {nextPayment && (
          <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-primary font-medium">Próximo recebimento</div>
                <div className="text-lg font-bold text-foreground">
                  {formatCurrency(nextPayment.amount)}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  Data prevista: {formatDate(nextPayment.dueDate)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="p-4 rounded-lg bg-card border-2 border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progresso do recebimento</span>
            <span className="text-sm font-bold text-primary">
              {paidInstallments} de {loanData.installments} parcelas recebidas
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${loanData.installments ? (paidInstallments / loanData.installments) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-card border-2 border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-status-concluded" />
              <span className="text-sm text-muted-foreground">Recebido</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {formatCurrency(receivedAmount)}
            </div>
            <div className="text-xs text-status-concluded mt-1">
              Lucro: {formatCurrency(profitReceived)}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-card border-2 border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">A receber</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {formatCurrency(expectedAmount - receivedAmount)}
            </div>
            <div className="text-xs text-primary mt-1">
              {pendingInstallments} parcelas restantes
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">Cronograma</TabsTrigger>
            <TabsTrigger value="analytics">Análise</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Cronograma de recebimentos</h2>
            </div>
            <PaymentSchedule installments={schedule} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Análise financeira</h2>
            </div>

            <div className="p-6 rounded-lg bg-card border-2 border-border space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Taxa de retorno anual</div>
                <div className="text-2xl font-bold text-primary">
                  {loanData.amount ? ((loanData.interestRate * 12) / loanData.amount * 100).toFixed(2) : '0.00'}%
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground mb-3">Detalhamento financeiro</div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Principal investido</span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(loanData.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Juros totais</span>
                    <span className="text-sm font-semibold text-status-concluded">
                      +{formatCurrency(loanData.interestAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Taxa de intermediação</span>
                    <span className="text-sm font-semibold text-status-cancelled">
                      -{formatCurrency(loanData.intermediationFee)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between">
                    <span className="text-sm font-semibold text-foreground">Lucro líquido</span>
                    <span className="text-base font-bold text-primary">
                      {formatCurrency(loanData.interestAmount - loanData.intermediationFee)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LoanDetails;
