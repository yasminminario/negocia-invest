import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DonutChart } from '@/components/charts/DonutChart';
import { Button } from '@/components/ui/button';
import {
  formatCurrency,
  formatInterestRate,
  calculateMonthlyPayment,
  calculateTotalAmount,
  calculateInterestAmount,
  calculateIntermediationFee,
} from '@/utils/calculations';
import { Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { LoanOffer, PropostaResponsePayload } from '@/types';
import { useNotifications } from '@/contexts/NotificationContext';
import { negociacoesApi, propostasApi, scoresCreditoApi, usuariosApi } from '@/services/api.service';

const parseRate = (taxa: string): { min: number; max: number; average: number } => {
  const cleaned = taxa.replace('%', '').trim();
  if (cleaned.includes('-')) {
    const [min, max] = cleaned.split('-').map(Number);
    const minValue = Number.isFinite(min) ? min : 0;
    const maxValue = Number.isFinite(max) ? max : minValue;
    return {
      min: minValue,
      max: maxValue,
      average: (minValue + maxValue) / 2,
    };
  }

  const value = Number(cleaned) || 0;
  return { min: value, max: value, average: value };
};

export const OfferDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [offer, setOffer] = useState<LoanOffer | null>(null);
  const [proposal, setProposal] = useState<PropostaResponsePayload | null>(null);
  const [fetching, setFetching] = useState(true);
  const [confirmAccept, setConfirmAccept] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchOffer = async () => {
      if (!id) return;

      try {
        setFetching(true);
        setError(null);
        const proposalId = Number(id);
        const response = await propostasApi.obterPorId(proposalId);

        if (response.autor_tipo !== 'investidor') {
          throw new Error('Oferta inválida para este fluxo.');
        }

        const investorData = await usuariosApi.obterPorId(response.id_autor).catch(() => null);
        if (!investorData) {
          throw new Error('Investidor não encontrado.');
        }
        setProposal(response);

        const ranges = parseRate(response.taxa_sugerida);
        const amount = Number(response.valor ?? 0);
        const installments = Number(response.prazo_meses ?? 0);
        const monthlyPayment = installments ? calculateMonthlyPayment(amount, ranges.average, installments) : 0;
        const totalAmount = installments ? calculateTotalAmount(monthlyPayment, installments) : amount;
        const score = await scoresCreditoApi.obterPorUsuario(response.id_autor).catch(() => null);

        const mappedOffer: LoanOffer = {
          id: String(response.id),
          investorId: String(response.id_autor),
          investor: {
            id: String(response.id_autor),
            name: investorData.nome,
            email: investorData.email,
            creditScore: (score?.valor_score ?? 0) >= 800 ? 'excellent' : 'good',
            scoreValue: score?.valor_score ?? 0,
            activeProfile: 'investor',
          },
          amount,
          interestRate: ranges.average,
          installments,
          monthlyPayment,
          totalAmount,
          status: response.negociavel ? 'negotiable' : 'fixed',
          createdAt: new Date(response.criado_em),
          acceptsNegotiation: Boolean(response.negociavel),
          suggestedRateMin: ranges.min,
          suggestedRateMax: ranges.max,
        };

        setOffer(mappedOffer);
      } catch (err) {
        console.error('Erro ao carregar oferta:', err);
        const message = err instanceof Error ? err.message : 'Erro ao carregar oferta.';
        setError(message);
        toast({
          title: 'Erro',
          description: message,
          variant: 'destructive',
        });
        navigate('/borrower/find-offers');
      } finally {
        setFetching(false);
      }
    };

    fetchOffer();
  }, [id, navigate]);

  const handleAcceptOffer = async () => {
    if (!offer) return;
    setAccepting(true);

    try {
      if (proposal?.id_negociacoes) {
        await negociacoesApi.atualizar(Number(proposal.id_negociacoes), {
          status: 'finalizada',
          valor: proposal?.valor ?? offer.amount,
          prazo: proposal?.prazo_meses ?? offer.installments,
          parcela: proposal?.parcela ?? Number(monthlyPayment.toFixed(2)),
        });
      }

      addNotification({
        type: 'payment',
        title: 'Oferta aceita',
        message: `O empréstimo de ${formatCurrency(offer.amount)} foi ativado e o valor estará disponível em sua conta.`,
        actionUrl: '/borrower/loans',
      });

      toast({
        title: "Oferta aceita com sucesso!",
        description: "O empréstimo foi ativado e o valor foi transferido.",
        className: "bg-positive-light border-positive/20",
      });
      navigate('/borrower/loans');
    } catch (error) {
      console.error('Error accepting offer:', error);
      const message = error instanceof Error ? error.message : "Ocorreu um erro ao processar sua solicitação.";
      toast({
        title: "Erro ao aceitar oferta",
        description: message,
        variant: "destructive",
      });
    } finally {
      setAccepting(false);
      setConfirmAccept(false);
    }
  };

  const monthlyPayment = useMemo(() => {
    if (!offer) return 0;
    return calculateMonthlyPayment(offer.amount, offer.interestRate, offer.installments);
  }, [offer]);

  const totalAmount = useMemo(() => {
    if (!offer) return 0;
    return calculateTotalAmount(monthlyPayment, offer.installments);
  }, [monthlyPayment, offer]);

  const interestAmount = useMemo(() => {
    if (!offer) return 0;
    return calculateInterestAmount(totalAmount, offer.amount);
  }, [offer, totalAmount]);

  const intermediationFee = useMemo(() => {
    if (!offer) return 0;
    return calculateIntermediationFee(offer.amount);
  }, [offer]);

  if (fetching) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={() => navigate(-1)} />
        <main className="container mx-auto px-4 py-6 max-w-md">
          <p>Carregando oferta...</p>
        </main>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={() => navigate(-1)} />
        <main className="container mx-auto px-4 py-6 max-w-md space-y-4">
          <p className="text-destructive">{error ?? 'Oferta não encontrada'}</p>
          <Button onClick={() => navigate('/borrower/find-offers')}>Voltar</Button>
        </main>
      </div>
    );
  }

  // O gráfico deve mostrar a composição do total pago pelo tomador
  // Total pago = Valor principal + Juros + Taxa de intermediação
  const totalPaid = offer.amount + interestAmount + intermediationFee;

  const chartData = [
    { label: 'Valor principal', value: offer.amount, color: 'hsl(var(--chart-principal))' },
    { label: 'Juros totais', value: interestAmount, color: 'hsl(var(--chart-interest))' },
    { label: 'Taxa de intermediação', value: intermediationFee, color: 'hsl(var(--chart-fee))' },
  ];

  const handleNegotiate = () => {
    navigate(`/borrower/negotiate/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate(-1)} />

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
            disabled={accepting}
          >
            <Check className="mr-2 h-5 w-5" />
            {accepting ? 'Processando...' : 'Aceitar esta oferta'}
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
