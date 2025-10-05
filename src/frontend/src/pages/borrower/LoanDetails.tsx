import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PaymentSchedule, PaymentInstallment } from '@/components/loan/PaymentSchedule';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockActiveLoansBorrower } from '@/data/mockData';
import { formatCurrency, formatInterestRate, calculateMonthlyPayment } from '@/utils/calculations';
import { TrendingUp, Calendar, DollarSign, User, Info } from 'lucide-react';

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loan = mockActiveLoansBorrower.find((l) => l.id === id);

  const [earlyPayoffAmount, setEarlyPayoffAmount] = useState<number | null>(null);

  if (!loan) {
    return <div>Empréstimo não encontrado</div>;
  }

  // Mock payment schedule
  const generateSchedule = (): PaymentInstallment[] => {
    const schedule: PaymentInstallment[] = [];
    const startDate = new Date(loan.startDate);
    const paidCount = 5; // Example: 5 installments paid

    for (let i = 0; i < loan.installments; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i + 1);

      let status: PaymentInstallment['status'] = 'pending';
      let paidDate: Date | undefined;

      if (i < paidCount) {
        status = 'paid';
        paidDate = new Date(dueDate);
        paidDate.setDate(dueDate.getDate() - 2); // Paid 2 days before due
      } else if (i === paidCount && new Date() > dueDate) {
        status = 'pending';
      }

      schedule.push({
        number: i + 1,
        dueDate,
        amount: loan.monthlyPayment,
        status,
        paidDate,
      });
    }

    return schedule;
  };

  const schedule = generateSchedule();
  const paidInstallments = schedule.filter((s) => s.status === 'paid').length;
  const pendingInstallments = loan.installments - paidInstallments;
  const nextPayment = schedule.find((s) => s.status === 'pending');

  const calculateEarlyPayoff = () => {
    // Simplified calculation: remaining installments * monthly payment * 0.95 (5% discount)
    const remaining = loan.monthlyPayment * pendingInstallments * 0.95;
    setEarlyPayoffAmount(remaining);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
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
          <StatusBadge status={loan.status} />
        </div>

        {/* Loan Overview */}
        <div className="p-6 rounded-lg bg-card border-2 border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Investidor</div>
              <div className="text-lg font-bold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {loan.investorName}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Taxa</div>
              <div className="text-lg font-bold text-primary">
                {formatInterestRate(loan.interestRate)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <div className="text-sm text-muted-foreground">Valor emprestado</div>
              <div className="text-base font-bold text-foreground">{formatCurrency(loan.amount)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total a pagar</div>
              <div className="text-base font-bold text-foreground">{formatCurrency(loan.totalAmount)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Parcela mensal</div>
              <div className="text-base font-bold text-foreground">{formatCurrency(loan.monthlyPayment)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Parcelas</div>
              <div className="text-base font-bold text-foreground">{loan.installments}x</div>
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
              <Button size="sm" className="rounded-full">
                Pagar agora
              </Button>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="p-4 rounded-lg bg-card border-2 border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progresso do pagamento</span>
            <span className="text-sm font-bold text-primary">
              {paidInstallments} de {loan.installments} parcelas pagas
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(paidInstallments / loan.installments) * 100}%` }}
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
                    {formatCurrency(loan.monthlyPayment * pendingInstallments)}
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
                    {formatCurrency(loan.monthlyPayment * pendingInstallments - earlyPayoffAmount)}
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
