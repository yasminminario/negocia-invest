import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/common/Header';
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
import { Check, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { propostasApi, scoresCreditoApi, usuariosApi } from '@/services/api.service';
import type { PropostaResponsePayload, ScoreCredito, Usuario } from '@/types';
import { parseRateRange } from '@/utils/dataMappers';

export const RequestDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [proposal, setProposal] = useState<PropostaResponsePayload | null>(null);
  const [borrower, setBorrower] = useState<Usuario | null>(null);
  const [borrowerScore, setBorrowerScore] = useState<ScoreCredito | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      const proposalId = Number(id);
      if (Number.isNaN(proposalId)) {
        setError('Identificador inválido.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const proposalResponse = await propostasApi.obterPorId(proposalId);
        setProposal(proposalResponse);

        const [usuario, score] = await Promise.all([
          usuariosApi.obterPorId(proposalResponse.id_autor).catch(() => null),
          scoresCreditoApi.obterPorUsuario(proposalResponse.id_autor).catch(() => null),
        ]);

        if (usuario) {
          setBorrower(usuario);
        }
        if (score) {
          setBorrowerScore(score);
        }
      } catch (err) {
        console.error('Erro ao carregar solicitação:', err);
        const message = err instanceof Error ? err.message : 'Erro ao carregar dados da solicitação.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const loanMetrics = useMemo(() => {
    if (!proposal) {
      return {
        interestRate: 0,
        monthlyPayment: 0,
        totalAmount: 0,
        interestAmount: 0,
        intermediationFee: 0,
        totalReceived: 0,
        netProfit: 0,
        amount: 0,
        installments: 0,
        ranges: { min: 0, max: 0, average: 0 },
      };
    }

    const ranges = parseRateRange(proposal.taxa_sugerida);
    const interestRate = ranges.average;
    const amount = Number(proposal.valor ?? 0);
    const installments = Number(proposal.prazo_meses ?? 0) || 1;

    const monthlyPayment = calculateMonthlyPayment(amount, interestRate, installments);
    const totalAmount = calculateTotalAmount(monthlyPayment, installments);
    const interestAmount = calculateInterestAmount(totalAmount, amount);
    const intermediationFee = calculateIntermediationFee(amount);
    const totalReceived = amount + interestAmount;
    const netProfit = interestAmount - intermediationFee;

    return {
      interestRate,
      monthlyPayment,
      totalAmount,
      interestAmount,
      intermediationFee,
      totalReceived,
      netProfit,
      amount,
      installments,
      ranges,
    };
  }, [proposal]);

  const chartData = useMemo(() => {
    if (!proposal) return [];

    return [
      { label: 'Valor principal', value: loanMetrics.amount ?? 0, color: 'hsl(var(--chart-principal))' },
      { label: 'Juros totais (bruto)', value: loanMetrics.interestAmount, color: 'hsl(var(--chart-profit))' },
      { label: 'Taxa de intermediação', value: loanMetrics.intermediationFee, color: 'hsl(var(--chart-fee))' },
    ];
  }, [loanMetrics, proposal]);

  const handleAccept = () => {
    toast({
      title: 'Solicitação aceita!',
      description: 'O empréstimo foi ativado com sucesso.',
      variant: 'investor',
    });
    navigate('/investor/loans');
  };

  const handleNegotiate = () => {
    if (!proposal) return;
    navigate(`/investor/negotiate/${proposal.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={() => navigate(-1)} />
        <main className="container mx-auto px-4 py-6 max-w-md">
          <p className="text-muted-foreground">Carregando solicitação...</p>
        </main>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={() => navigate(-1)} />
        <main className="container mx-auto px-4 py-6 max-w-md space-y-4">
          <p className="text-destructive">{error ?? 'Solicitação não encontrada.'}</p>
          <Button onClick={() => navigate('/investor/find-requests')}>Voltar</Button>
        </main>
      </div>
    );
  }

  const borrowerName = borrower?.nome ?? `Usuário #${proposal.id_autor}`;
  const borrowerScoreValue = borrowerScore?.valor_score ?? 0;
  const borrowerCreditLabel = borrowerScoreValue >= 800 ? 'Excelente' : 'Bom';
  const status = proposal.negociavel ? 'negotiable' : 'fixed';

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate(-1)} />

      <main className="container mx-auto px-4 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-primary">Detalhes da solicitação</h1>

        {/* Borrower Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl">{borrowerName.charAt(0)}</span>
            </div>
            <span className="font-medium text-foreground">{borrowerName}</span>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Main Info Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Taxa de juros</p>
            <p className="text-sm font-bold text-primary">{formatInterestRate(loanMetrics.interestRate)}</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Período</p>
            <p className="text-sm font-bold text-foreground">{Number(proposal.prazo_meses ?? 0)} m</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Parcela mensal</p>
            <p className="text-sm font-bold text-foreground">{formatCurrency(loanMetrics.monthlyPayment)}</p>
          </div>
        </div>

        {/* Total and Requested Amount */}
        <div className="flex justify-between mb-6 text-sm">
          <span className="text-foreground">Total a receber: <span className="font-bold">{formatCurrency(loanMetrics.totalReceived)}</span></span>
          <span className="text-foreground">Valor solicitado: <span className="font-bold">{formatCurrency(loanMetrics.amount ?? 0)}</span></span>
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
              <p className="text-sm font-bold text-foreground">{formatCurrency(loanMetrics.amount ?? 0)}</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-profit"></div>
                <p className="text-sm text-muted-foreground">Juros totais (bruto)</p>
              </div>
              <p className="text-sm font-bold text-foreground">{formatCurrency(loanMetrics.interestAmount)}</p>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-fee"></div>
                <p className="text-sm text-muted-foreground">Taxa de intermediação</p>
              </div>
              <p className="text-sm font-bold text-negative">-{formatCurrency(loanMetrics.intermediationFee)}</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-positive" />
                <p className="text-sm font-medium text-muted-foreground">Lucro líquido</p>
              </div>
              <p className="text-lg font-bold text-positive">{formatCurrency(loanMetrics.netProfit)}</p>
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
              <span className="font-bold text-foreground">{borrowerScoreValue} ({borrowerCreditLabel})</span>
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
          {status === 'negotiable' && (
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
