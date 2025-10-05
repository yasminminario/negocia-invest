import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DonutChart } from '@/components/charts/DonutChart';
import { Button } from '@/components/ui/button';
import { mockLoanOffers } from '@/data/mockData';
import { formatCurrency, formatInterestRate, calculateMonthlyPayment, calculateTotalAmount, calculateInterestAmount, calculateIntermediationFee } from '@/utils/calculations';
import { Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const OfferDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const offer = mockLoanOffers.find(o => o.id === id);
  const [confirmAccept, setConfirmAccept] = useState(false);

  const handleAcceptOffer = () => {
    toast({
      title: "Oferta aceita com sucesso!",
      description: "O investidor será notificado. Você pode acompanhar o progresso em Empréstimos Ativos.",
      className: "bg-positive-light border-positive/20",
    });
    setTimeout(() => navigate('/borrower/loans'), 1500);
  };

  if (!offer) {
    return <div>Oferta não encontrada</div>;
  }

  const monthlyPayment = calculateMonthlyPayment(offer.amount, offer.interestRate, offer.installments);
  const totalAmount = calculateTotalAmount(monthlyPayment, offer.installments);
  const interestAmount = calculateInterestAmount(totalAmount, offer.amount);
  const intermediationFee = calculateIntermediationFee(offer.amount);

  // O gráfico deve mostrar a composição do total pago pelo tomador
  // Total pago = Valor principal + Juros + Taxa de intermediação
  const totalPaid = offer.amount + interestAmount + intermediationFee;
  
  const chartData = [
    { label: 'Valor principal', value: offer.amount, color: 'hsl(var(--chart-principal))' },
    { label: 'Juros totais', value: interestAmount, color: 'hsl(var(--chart-interest))' },
    { label: 'Taxa de intermediação', value: intermediationFee, color: 'hsl(var(--chart-fee))' },
  ];

  const handleAccept = () => {
    toast({
      title: 'Oferta aceita!',
      description: 'O empréstimo foi ativado com sucesso.',
      variant: 'borrower',
    });
    navigate('/borrower/loans');
  };

  const handleNegotiate = () => {
    navigate(`/borrower/negotiate/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onBack={() => navigate(-1)} />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-primary">Detalhes da oferta</h1>

        {/* Investor Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl">{offer.investor.name.charAt(0)}</span>
            </div>
            <span className="font-medium text-foreground">{offer.investor.name}</span>
          </div>
          <StatusBadge status={offer.status} />
        </div>

        {/* Main Info Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Taxa de juros</p>
            <p className="text-sm font-bold text-primary">{formatInterestRate(offer.interestRate)}</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Período</p>
            <p className="text-sm font-bold text-foreground">{offer.installments} m</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Parcela mensal</p>
            <p className="text-sm font-bold text-foreground">{formatCurrency(monthlyPayment)}</p>
          </div>
        </div>

        {/* Total and Offered Amount */}
        <div className="flex justify-between mb-6 text-sm">
          <span className="text-foreground">Total a pagar: <span className="font-bold">{formatCurrency(totalPaid)}</span></span>
          <span className="text-foreground">Valor ofertado: <span className="font-bold">{formatCurrency(offer.amount)}</span></span>
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
              <p className="text-sm font-bold text-foreground">{formatCurrency(offer.amount)}</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-interest"></div>
                <p className="text-sm text-muted-foreground">Juros totais</p>
              </div>
              <p className="text-sm font-bold text-foreground">{formatCurrency(interestAmount)}</p>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-fee"></div>
                <p className="text-sm text-muted-foreground">Taxa de intermediação</p>
              </div>
              <p className="text-sm font-bold text-foreground">{formatCurrency(intermediationFee)}</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm font-medium text-muted-foreground">Total a pagar</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </div>

        {/* Investor Details */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">
            Detalhes do <span className="text-primary">Investidor</span>
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>📊</span>
                <span>Pontuação</span>
              </div>
              <span className="font-bold text-foreground">{offer.investor.creditScore}</span>
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
                <span>💰</span>
                <span>Empréstimos realizados</span>
              </div>
              <span className="font-bold text-foreground">5 empréstimos</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>✅</span>
                <span>Taxa de aprovação</span>
              </div>
              <span className="font-bold text-foreground">93%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-8">
          <Button 
            className="w-full h-14 text-base rounded-full transition-all duration-200 hover-scale"
            onClick={() => setConfirmAccept(true)}
          >
            <Check className="mr-2 h-5 w-5" />
            Aceitar esta oferta
          </Button>
          {offer.status === 'negotiable' && (
            <Button 
              variant="outline"
              className="w-full h-14 text-base rounded-full border-primary text-primary hover:bg-primary/10 transition-all duration-200"
              onClick={handleNegotiate}
            >
              Iniciar negociação
            </Button>
          )}
        </div>

        <ConfirmDialog
          open={confirmAccept}
          onOpenChange={setConfirmAccept}
          title="Confirmar aceitação da oferta"
          description={`Você está prestes a aceitar um empréstimo de ${formatCurrency(offer.amount)} com taxa de ${formatInterestRate(offer.interestRate)} ao mês. Deseja continuar?`}
          confirmText="Aceitar Oferta"
          onConfirm={handleAcceptOffer}
        />
      </main>
    </div>
  );
};
