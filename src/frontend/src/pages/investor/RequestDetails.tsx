import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DonutChart } from '@/components/charts/DonutChart';
import { Button } from '@/components/ui/button';
import { mockLoanRequests } from '@/data/mockData';
import { formatCurrency, formatInterestRate, calculateMonthlyPayment, calculateTotalAmount, calculateInterestAmount, calculateIntermediationFee } from '@/utils/calculations';
import { Check, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const RequestDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const request = mockLoanRequests.find(r => r.id === id);

  if (!request) {
    return <div>Solicitação não encontrada</div>;
  }

  const monthlyPayment = calculateMonthlyPayment(request.amount, request.interestRate, request.installments);
  const totalAmount = calculateTotalAmount(monthlyPayment, request.installments);
  const interestAmount = calculateInterestAmount(totalAmount, request.amount);
  const intermediationFee = calculateIntermediationFee(request.amount);

  // O gráfico deve mostrar a composição do que o investidor recebe
  // Total recebido = Valor principal + Juros totais (bruto)
  // Lucro líquido = Juros totais - Taxa de intermediação
  const netProfit = interestAmount - intermediationFee;
  const totalReceived = request.amount + interestAmount;
  
  const chartData = [
    { label: 'Valor principal', value: request.amount, color: 'hsl(var(--chart-principal))' },
    { label: 'Juros totais (bruto)', value: interestAmount, color: 'hsl(var(--chart-profit))' },
    { label: 'Taxa de intermediação', value: intermediationFee, color: 'hsl(var(--chart-fee))' },
  ];

  const handleAccept = () => {
    toast({
      title: 'Solicitação aceita!',
      description: 'O empréstimo foi ativado com sucesso.',
      variant: 'investor',
    });
    navigate('/investor/loans');
  };

  const handleNegotiate = () => {
    navigate(`/investor/negotiate/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onBack={() => navigate(-1)} />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-primary">Detalhes da solicitação</h1>

        {/* Borrower Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl">{request.borrower.name.charAt(0)}</span>
            </div>
            <span className="font-medium text-foreground">{request.borrower.name}</span>
          </div>
          <StatusBadge status={request.status} />
        </div>

        {/* Main Info Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Taxa de juros</p>
            <p className="text-sm font-bold text-primary">{formatInterestRate(request.interestRate)}</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Período</p>
            <p className="text-sm font-bold text-foreground">{request.installments} m</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Parcela mensal</p>
            <p className="text-sm font-bold text-foreground">{formatCurrency(monthlyPayment)}</p>
          </div>
        </div>

        {/* Total and Requested Amount */}
        <div className="flex justify-between mb-6 text-sm">
          <span className="text-foreground">Total a receber: <span className="font-bold">{formatCurrency(totalReceived)}</span></span>
          <span className="text-foreground">Valor solicitado: <span className="font-bold">{formatCurrency(request.amount)}</span></span>
        </div>

        {/* Chart Section */}
        <div className="bg-card rounded-xl p-6 mb-6 border border-border">
          <div className="flex items-center justify-center mb-4">
            <div className="w-40 h-40">
              <DonutChart data={chartData} showLegend={false} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-principal"></div>
                <p className="text-sm text-muted-foreground">Valor principal</p>
              </div>
              <p className="text-sm font-bold text-foreground">{formatCurrency(request.amount)}</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-profit"></div>
                <p className="text-sm text-muted-foreground">Juros totais (bruto)</p>
              </div>
              <p className="text-sm font-bold text-foreground">{formatCurrency(interestAmount)}</p>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-fee"></div>
                <p className="text-sm text-muted-foreground">Taxa de intermediação</p>
              </div>
              <p className="text-sm font-bold text-negative">-{formatCurrency(intermediationFee)}</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-positive" />
                <p className="text-sm font-medium text-muted-foreground">Lucro líquido</p>
              </div>
              <p className="text-lg font-bold text-positive">{formatCurrency(netProfit)}</p>
            </div>
          </div>
        </div>

        {/* Borrower Details */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">
            Detalhes do <span className="text-primary">Tomador</span>
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>📊</span>
                <span>Pontuação</span>
              </div>
              <span className="font-bold text-foreground">{request.borrower.creditScore}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>⏱️</span>
                <span>Tempo de conta</span>
              </div>
              <span className="font-bold text-foreground">2 meses</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>📧</span>
                <span>Tempo médio de resposta</span>
              </div>
              <span className="font-bold text-foreground">2 horas</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>💳</span>
                <span>Empréstimos tomados</span>
              </div>
              <span className="font-bold text-foreground">2 empréstimos</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>✅</span>
                <span>Taxa de aprovação em solicitações</span>
              </div>
              <span className="font-bold text-foreground">93%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-8">
          <Button 
            className="w-full h-14 text-base rounded-full"
            onClick={handleAccept}
          >
            <Check className="mr-2 h-5 w-5" />
            Aceitar esta solicitação
          </Button>
          {request.status === 'negotiable' && (
            <Button 
              variant="outline"
              className="w-full h-14 text-base rounded-full border-primary text-primary hover:bg-primary/10"
              onClick={handleNegotiate}
            >
              Iniciar negociação
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};
