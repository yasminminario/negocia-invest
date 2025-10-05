import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PaymentSchedule, PaymentInstallment } from '@/components/loan/PaymentSchedule';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockActiveLoansInvestor } from '@/data/mockData';
import { formatCurrency, formatInterestRate } from '@/utils/calculations';
import { TrendingUp, Calendar, DollarSign, User, TrendingDown } from 'lucide-react';

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loan = mockActiveLoansInvestor.find((l) => l.id === id);

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
        status = 'overdue';
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
  const nextPayment = schedule.find((s) => s.status === 'pending' || s.status === 'overdue');

  const receivedAmount = loan.monthlyPayment * paidInstallments;
  const expectedAmount = loan.totalAmount;
  const profitReceived = receivedAmount - (loan.amount * (paidInstallments / loan.installments));

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate('/investor/loans')} />

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
              <div className="text-sm text-muted-foreground">Tomador</div>
              <div className="text-lg font-bold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {loan.borrowerName}
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
              <div className="text-sm text-muted-foreground">Valor investido</div>
              <div className="text-base font-bold text-foreground">{formatCurrency(loan.amount)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Retorno total</div>
              <div className="text-base font-bold text-foreground">{formatCurrency(loan.totalAmount)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Parcela mensal</div>
              <div className="text-base font-bold text-foreground">{formatCurrency(loan.monthlyPayment)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Lucro estimado</div>
              <div className="text-base font-bold text-status-concluded">
                {formatCurrency(loan.interestAmount)}
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
              {paidInstallments} de {loan.installments} parcelas recebidas
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(paidInstallments / loan.installments) * 100}%` }}
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
                  {((loan.interestRate * 12) / loan.amount * 100).toFixed(2)}%
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground mb-3">Detalhamento financeiro</div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Principal investido</span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(loan.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Juros totais</span>
                    <span className="text-sm font-semibold text-status-concluded">
                      +{formatCurrency(loan.interestAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Taxa de intermediação</span>
                    <span className="text-sm font-semibold text-status-cancelled">
                      -{formatCurrency(loan.intermediationFee)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between">
                    <span className="text-sm font-semibold text-foreground">Lucro líquido</span>
                    <span className="text-base font-bold text-primary">
                      {formatCurrency(loan.interestAmount - loan.intermediationFee)}
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
