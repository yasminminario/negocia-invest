import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { NegotiationSlider } from '@/components/negotiation/NegotiationSlider';
import { ComparisonCard } from '@/components/negotiation/ComparisonCard';
import { ImpactDisplay } from '@/components/negotiation/ImpactDisplay';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { calculateEstimatedProfit, calculateMonthlyPayment, calculateTotalAmount } from '@/utils/calculations';
import { Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { propostasApi, negociacoesApi, usuariosApi } from '@/services/api.service';
import type { NegociacaoResponse, PropostaResponsePayload, Usuario } from '@/types';
import { parseRateRange } from '@/utils/dataMappers';
import { useProfile } from '@/contexts/ProfileContext';
import { useNotifications } from '@/contexts/NotificationContext';

export const NegotiateRequest: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useProfile();
  const { addNotification } = useNotifications();
  const [proposal, setProposal] = useState<PropostaResponsePayload | null>(null);
  const [negotiation, setNegotiation] = useState<NegociacaoResponse | null>(null);
  const [borrower, setBorrower] = useState<Usuario | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposedRate, setProposedRate] = useState(1.5);
  const [message, setMessage] = useState('');

  const negotiationResponseRate = (
    baseProposal: PropostaResponsePayload | null,
    baseNegotiation: NegociacaoResponse | null
  ): number => {
    if (baseNegotiation?.taxa != null) {
      return baseNegotiation.taxa;
    }
    const range = parseRateRange(baseProposal?.taxa_sugerida);
    return range.average || 1.5;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      const proposalId = Number(id);
      if (Number.isNaN(proposalId)) {
        setError('Identificador inválido.');
        setFetching(false);
        return;
      }

      try {
        setFetching(true);
        setError(null);
        const proposalResponse = await propostasApi.obterPorId(proposalId);
        setProposal(proposalResponse);

        let negotiationResponse: NegociacaoResponse | null = null;
        if (proposalResponse.id_negociacoes) {
          negotiationResponse = await negociacoesApi
            .obterPorId(proposalResponse.id_negociacoes)
            .catch(() => null);
          if (negotiationResponse) {
            setNegotiation(negotiationResponse);
          }
        }

        const borrowerData = await usuariosApi
          .obterPorId(proposalResponse.id_autor)
          .catch(() => null);
        setBorrower(borrowerData);

        const initialRate = negotiationResponseRate(
          proposalResponse,
          negotiationResponse
        );
        setProposedRate(initialRate);
      } catch (err) {
        console.error('Erro ao carregar solicitação:', err);
        const messageText = err instanceof Error ? err.message : 'Erro ao carregar solicitação.';
        setError(messageText);
      } finally {
        setFetching(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const derived = useMemo(() => {
    const range = parseRateRange(proposal?.taxa_sugerida);
    const amount = Number(proposal?.valor ?? negotiation?.valor ?? 0);
    const installments = Number(proposal?.prazo_meses ?? negotiation?.prazo ?? 0) || 1;
    const currentRate = negotiation?.taxa ?? range.average;
    const currentMonthly = calculateMonthlyPayment(amount, currentRate, installments);
    const currentTotal = calculateTotalAmount(currentMonthly, installments);
    const proposedMonthly = calculateMonthlyPayment(amount, proposedRate, installments);
    const proposedTotal = calculateTotalAmount(proposedMonthly, installments);
    const currentProfit = calculateEstimatedProfit(amount, currentRate, installments);
    const proposedProfit = calculateEstimatedProfit(amount, proposedRate, installments);

    return {
      amount,
      installments,
      currentRate,
      currentMonthly,
      currentTotal,
      proposedMonthly,
      proposedTotal,
      profitDiff: proposedProfit - currentProfit,
      suggestion: range,
    };
  }, [negotiation, proposal, proposedRate]);

  const handleSubmit = async () => {
    if (!user?.id || !proposal) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a proposta. Realize login novamente.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const delta = 0.25;
      const minRange = Math.max(proposedRate - delta, 0.1);
      const maxRange = proposedRate + delta;

      await propostasApi.criar({
        id_negociacoes: negotiation?.id ?? proposal.id_negociacoes ?? null,
        id_autor: user.id,
        autor_tipo: 'investidor',
        taxa_analisada: `${minRange.toFixed(2)}-${maxRange.toFixed(2)}`,
        taxa_sugerida: proposedRate.toFixed(2),
        prazo_meses: proposal.prazo_meses ?? negotiation?.prazo ?? derived.installments,
        tipo: negotiation ? 'contraproposta' : 'inicial',
        status: 'pendente',
        parcela: Number(derived.proposedMonthly.toFixed(2)),
        valor: derived.amount,
        negociavel: true,
        justificativa: message ? message.trim() : null,
        id_tomador_destino: negotiation ? null : proposal.id_autor,
        id_investidor_destino: negotiation ? null : user.id,
      });

      addNotification({
        type: 'negotiation',
        title: 'Proposta enviada',
        message: `Você fez uma oferta para ${borrowerName}. Acompanhe a negociação pelo painel.`,
        actionUrl: '/investor/negotiations',
      });

      toast({
        title: 'Proposta enviada',
        description: 'O tomador receberá sua proposta em instantes.',
      });

      navigate('/investor/negotiations');
    } catch (err) {
      console.error('Erro ao enviar proposta:', err);
      const description = err instanceof Error ? err.message : 'Não foi possível enviar a proposta.';
      toast({
        title: 'Erro',
        description,
        variant: 'destructive',
      });
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={() => navigate('/investor/find-requests')} />
        <main className="container mx-auto px-4 py-6 max-w-md">
          <p>Carregando solicitação...</p>
        </main>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={() => navigate('/investor/find-requests')} />
        <main className="container mx-auto px-4 py-6 max-w-md space-y-4">
          <p className="text-destructive">{error ?? 'Solicitação não encontrada.'}</p>
          <Button onClick={() => navigate('/investor/find-requests')}>Voltar</Button>
        </main>
      </div>
    );
  }

  const borrowerName = borrower?.nome ?? `Usuário #${proposal.id_autor}`;
  const isCounterProposal = Boolean(negotiation);
  const suggestedMin = derived.suggestion.min || 1.3;
  const suggestedMax = derived.suggestion.max || 3;

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate(isCounterProposal ? '/investor/negotiations' : '/investor/find-requests')} />

      <main className="container mx-auto px-4 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-primary">
          {isCounterProposal ? 'Detalhes da negociação' : 'Iniciar negociação'}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {isCounterProposal ? 'Envie uma contraproposta para' : 'Proponha uma taxa de juros para'} {borrowerName}
        </p>

        {/* Current vs Proposed */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <ComparisonCard
            type="current"
            label="Solicitação atual"
            interestRate={derived.currentRate}
            monthlyPayment={derived.currentMonthly}
            totalAmount={derived.currentTotal}
          />
          <ComparisonCard
            type="proposed"
            label="Sua proposta"
            interestRate={proposedRate}
            monthlyPayment={derived.proposedMonthly}
            totalAmount={derived.proposedTotal}
          />
        </div>

        {/* Impact Display */}
        <ImpactDisplay
          type="profit"
          value={derived.profitDiff}
          className="mb-6"
        />

        {/* Negotiation Slider */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            Propor taxa de juros:
          </label>
          <NegotiationSlider
            value={proposedRate}
            onChange={setProposedRate}
            min={1.25}
            max={10}
            step={0.01}
            suggestedMin={suggestedMin}
            suggestedMax={suggestedMax}
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Zona verde = maior chance de aceitação
          </p>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Mensagem (opcional)
          </label>
          <Textarea
            placeholder="Explique o motivo da sua proposta..."
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 300))}
            className="min-h-[100px] resize-none"
            maxLength={300}
          />
          <div className="text-xs text-muted-foreground text-right mt-1">
            {message.length}/300
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-border">
          <p className="text-xs text-muted-foreground">
            💡 <span className="font-medium">Dica:</span> Propostas dentro da zona verde têm maior taxa de aceitação.
            A negociação expira em 48 horas se não houver resposta.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          className="w-full h-14 text-base rounded-full"
          onClick={handleSubmit}
        >
          <Send className="mr-2 h-5 w-5" />
          {isCounterProposal ? 'Enviar contraproposta' : 'Enviar proposta'}
        </Button>
      </main>
    </div>
  );
};
