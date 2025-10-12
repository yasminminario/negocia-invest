import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PaymentSchedule, PaymentInstallment } from '@/components/loan/PaymentSchedule';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { negociacoesApi, usuariosApi } from '@/services/api.service';
import {
  calculateInterestAmount,
  calculateMonthlyPayment,
  calculateTotalAmount,
  formatCurrency,
  formatInterestRate,
} from '@/utils/calculations';
import type { LoanStatus, NegociacaoResponse, Usuario } from '@/types';
import { TrendingUp, Calendar, DollarSign, User, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  status: LoanStatus;
  startDate: Date;
}

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loanData, setLoanData] = useState<LoanDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [earlyPayoffAmount, setEarlyPayoffAmount] = useState<number | null>(null);
  const [payingInstallment, setPayingInstallment] = useState(false);

  useEffect(() => {
    const fetchLoan = async () => {
      if (!id) {
        return;
      }

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
          status: mapStatus(negotiation.status),
          startDate,
        });
      } catch (err) {
        console.error('Erro ao carregar detalhes do empréstimo:', err);
        const message = err instanceof Error ? err.message : 'Erro ao carregar detalhes do empréstimo.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id]);

  const schedule = useMemo<PaymentInstallment[]>(() => {
    if (!loanData) return [];

    const installments: PaymentInstallment[] = [];
    const start = new Date(loanData.startDate);

    for (let index = 0; index < loanData.installments; index += 1) {
      const dueDate = new Date(start);
      dueDate.setMonth(start.getMonth() + index + 1);

      installments.push({
        number: index + 1,
        dueDate,
        amount: loanData.monthlyPayment,
        status: 'pending',
      });
    }

    return installments;
  }, [loanData]);

  const paidInstallments = schedule.filter((installment) => installment.status === 'paid').length;
  const pendingInstallments = loanData ? loanData.installments - paidInstallments : 0;
  const nextPayment = schedule.find((installment) => installment.status !== 'paid');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={() => navigate('/borrower/loans')} />
        <main className="container max-w-md mx-auto px-4 py-6">
          <p>Carregando detalhes...</p>
        </main>
      </div>
    );
  }

  if (error || !loanData) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={() => navigate('/borrower/loans')} />
        <main className="container max-w-md mx-auto px-4 py-6 space-y-4">
          <p className="text-destructive">{error ?? 'Empréstimo não encontrado'}</p>
          <Button onClick={() => navigate('/borrower/loans')}>Voltar</Button>
        </main>
      </div>
    );
  }

  const calculateEarlyPayoff = () => {
    // Simplified calculation: remaining installments * monthly payment * 0.95 (5% discount)
    const remaining = loanData.monthlyPayment * pendingInstallments * 0.95;
    setEarlyPayoffAmount(remaining);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const handlePayInstallment = async () => {
    if (!id) return;

    setPayingInstallment(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      toast({
        title: "Parcela paga com sucesso!",
        description: "O valor foi transferido para o investidor.",
        className: "bg-positive-light border-positive/20",
      });
      navigate('/borrower/loans');
    } catch (error) {
      console.error('Error paying installment:', error);
      const message = error instanceof Error ? error.message : "Ocorreu um erro ao processar o pagamento.";
      toast({
        title: "Erro ao pagar parcela",
        description: message,
        variant: "destructive",
      });
    } finally {
      setPayingInstallment(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate('/borrower/loans')} />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Detalhes do empréstimo</h1>
          </div>
          <StatusBadge status={loanData.status} />
        </div>

        {/* Loan Overview */}
        <div className="p-6 rounded-lg bg-card border-2 border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Investidor</div>
              <div className="text-lg font-bold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {loanData.investor?.nome ?? `Usuário #${loanData.negotiation.id_investidor}`}
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
              <div className="text-sm text-muted-foreground">Valor emprestado</div>
              <div className="text-base font-bold text-foreground">{formatCurrency(loanData.amount)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total a pagar</div>
              <div className="text-base font-bold text-foreground">{formatCurrency(loanData.totalAmount)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Parcela mensal</div>
              <div className="text-base font-bold text-foreground">{formatCurrency(loanData.monthlyPayment)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Parcelas</div>
              <div className="text-base font-bold text-foreground">{loanData.installments}x</div>
            </div>
          </div>
        </div>

        {/* Next Payment */}
        {nextPayment && (
          <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-primary font-medium">Próximo pagamento</div>
                <div className="text-lg font-bold text-foreground">
                  {formatCurrency(nextPayment.amount)}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  Vencimento: {formatDate(nextPayment.dueDate)}
                </div>
              </div>
              <Button
                size="sm"
                className="rounded-full"
                onClick={handlePayInstallment}
                disabled={payingInstallment}
              >
                {payingInstallment ? 'Processando...' : 'Pagar agora'}
              </Button>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="p-4 rounded-lg bg-card border-2 border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progresso do pagamento</span>
            <span className="text-sm font-bold text-primary">
              {paidInstallments} de {loanData.installments} parcelas pagas
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${loanData.installments ? (paidInstallments / loanData.installments) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">Cronograma</TabsTrigger>
            <TabsTrigger value="earlyPayoff">Quitação antecipada</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Cronograma de pagamentos</h2>
            </div>
            <PaymentSchedule installments={schedule} />
          </TabsContent>

          <TabsContent value="earlyPayoff" className="space-y-4 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Quitação antecipada</h2>
            </div>

            <div className="p-4 rounded-lg bg-muted border border-border">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Ao quitar antecipadamente, você pode economizar nos juros restantes.
                  Calcule o valor necessário para quitar seu empréstimo agora.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-card border-2 border-border space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Parcelas restantes</div>
                  <div className="text-xl font-bold text-foreground">{pendingInstallments}x</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Valor restante</div>
                  <div className="text-xl font-bold text-foreground">
                    {formatCurrency(loanData.monthlyPayment * pendingInstallments)}
                  </div>
                </div>
              </div>

              {earlyPayoffAmount && (
                <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary">
                  <div className="text-sm text-primary font-medium mb-1">
                    Valor para quitação antecipada
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    {formatCurrency(earlyPayoffAmount)}
                  </div>
                  <div className="text-sm text-status-concluded">
                    Economia de{' '}
                    {formatCurrency(loanData.monthlyPayment * pendingInstallments - earlyPayoffAmount)}
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                onClick={calculateEarlyPayoff}
                disabled={!!earlyPayoffAmount}
              >
                {earlyPayoffAmount ? 'Valor calculado' : 'Calcular valor de quitação'}
              </Button>

              {earlyPayoffAmount && (
                <Button className="w-full" variant="outline">
                  Prosseguir com quitação
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LoanDetails;
