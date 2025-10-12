import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { NegotiationSlider } from '@/components/negotiation/NegotiationSlider';
import { ComparisonCard } from '@/components/negotiation/ComparisonCard';
import { ImpactDisplay } from '@/components/negotiation/ImpactDisplay';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { calculateMonthlyPayment, calculateTotalAmount, calculateSavings } from '@/utils/calculations';
import { Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { negociacoesApi, propostasApi, usuariosApi } from '@/services/api.service';
import type { NegociacaoResponse, PropostaResponsePayload, Usuario } from '@/types';
import { useNotifications } from '@/contexts/NotificationContext';

export const NegotiateOffer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useProfile();
  const { addNotification } = useNotifications();
  const [proposal, setProposal] = useState<PropostaResponsePayload | null>(null);
  const [negotiation, setNegotiation] = useState<NegociacaoResponse | null>(null);
  const [investor, setInvestor] = useState<Usuario | null>(null);
  const [fetching, setFetching] = useState(true);
  const [proposedRate, setProposedRate] = useState(1.5);
  const [message, setMessage] = useState('');
  const [confirmSend, setConfirmSend] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        setFetching(true);
        setError(null);

        const proposalId = Number(id);
        const proposalResponse = await propostasApi.obterPorId(proposalId);

        if (!proposalResponse.id_negociacoes) {
          throw new Error('Oferta ainda não possui uma negociação ativa.');
        }

        const negotiationResponse = await negociacoesApi.obterPorId(proposalResponse.id_negociacoes);
        const investorData = await usuariosApi.obterPorId(proposalResponse.id_autor).catch(() => null);

        setProposal(proposalResponse);
        setNegotiation(negotiationResponse);
        setInvestor(investorData);

        const parsedRate = parseFloat(proposalResponse.taxa_sugerida.replace('%', '')) || 1.5;
        const baseRate = negotiationResponse.taxa ?? parsedRate;
        setProposedRate(baseRate);
      } catch (err) {
        console.error('Erro ao carregar dados de negociação:', err);
        const messageText = err instanceof Error ? err.message : 'Erro ao carregar dados.';
        setError(messageText);
        toast({
          title: 'Erro',
          description: messageText,
          variant: 'destructive',
        });
        navigate('/borrower/find-offers');
      } finally {
        setFetching(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const amount = negotiation?.valor ?? proposal?.valor ?? 0;
  const installments = negotiation?.prazo ?? proposal?.prazo_meses ?? 0;
  const currentRate = negotiation?.taxa ?? parseFloat(proposal?.taxa_sugerida.replace('%', '') || '0');

  const currentMonthly = useMemo(() => calculateMonthlyPayment(amount, currentRate, installments || 1), [amount, currentRate, installments]);
  const currentTotal = useMemo(() => calculateTotalAmount(currentMonthly, installments || 1), [currentMonthly, installments]);

  const proposedMonthly = useMemo(() => calculateMonthlyPayment(amount, proposedRate, installments || 1), [amount, proposedRate, installments]);
  const proposedTotal = useMemo(() => calculateTotalAmount(proposedMonthly, installments || 1), [proposedMonthly, installments]);
  const savings = useMemo(() => calculateSavings(amount, currentRate, proposedRate, installments || 1), [amount, currentRate, proposedRate, installments]);

  const handleSubmit = async () => {
    if (!user?.id || !proposal || !negotiation) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a proposta. Dados incompletos da negociação.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setConfirmSend(false);

      const suggestedRangeDelta = 0.2;
      const minRange = Math.max(proposedRate - suggestedRangeDelta, 0).toFixed(2);
      const maxRange = (proposedRate + suggestedRangeDelta).toFixed(2);

      await propostasApi.criar({
        id_negociacoes: negotiation.id,
        id_autor: user.id,
        autor_tipo: 'tomador',
        taxa_analisada: `${minRange}-${maxRange}%`,
        taxa_sugerida: `${proposedRate.toFixed(2)}%`,
        prazo_meses: negotiation.prazo ?? proposal.prazo_meses ?? 0,
        tipo: negotiation ? 'contraproposta' : 'inicial',
        status: 'pendente',
        parcela: Number(proposedMonthly.toFixed(2)),
        valor: negotiation.valor ?? proposal.valor ?? amount,
        negociavel: true,
        justificativa: message ? message.trim() : null,
      });

      addNotification({
        type: 'negotiation',
        title: 'Contraproposta enviada',
        message: `Você respondeu ao investidor ${investor?.nome ?? 'investidor'} nesta negociação.`,
        actionUrl: '/borrower/negotiations',
      });

      toast({
        title: 'Contraproposta enviada',
        description: 'O investidor receberá sua proposta em instantes.',
      });

      navigate('/borrower/negotiations');
    } catch (err) {
      console.error('Erro ao enviar contraproposta:', err);
      const description = err instanceof Error ? err.message : 'Não foi possível enviar a contraproposta.';
      toast({
        title: 'Erro',
        description,
        variant: 'destructive',
      });
    }
  };

  // Suggested zone based on negotiation context
  const suggestedMin = Math.max(currentRate - 0.3, 0.5);
  const suggestedMax = currentRate + 1;

  if (fetching) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={() => navigate('/borrower/find-offers')} />
        <main className="container mx-auto px-4 py-6 max-w-md">
          <p>Carregando dados da oferta...</p>
        </main>
      </div>
    );
  }

  if (error || !proposal || !negotiation) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={() => navigate('/borrower/find-offers')} />
        <main className="container mx-auto px-4 py-6 max-w-md space-y-4">
          <p className="text-destructive">{error ?? 'Oferta não encontrada'}</p>
          <Button onClick={() => navigate('/borrower/find-offers')}>Voltar</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate('/borrower/find-offers')} />

      <main className="container mx-auto px-4 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-primary">
          {negotiation ? 'Detalhes da negociação' : 'Iniciar negociação'}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {negotiation ? 'Envie uma contraproposta para' : 'Proponha uma taxa de juros para'} {investor?.nome ?? 'Investidor'}
        </p>

        {/* Current vs Proposed */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <ComparisonCard
            type="current"
            label="Oferta atual"
            interestRate={currentRate}
            monthlyPayment={currentMonthly}
            totalAmount={currentTotal}
          />
          <ComparisonCard
            type="proposed"
            label="Sua proposta"
            interestRate={proposedRate}
            monthlyPayment={proposedMonthly}
            totalAmount={proposedTotal}
          />
        </div>

        {/* Impact Display */}
        <ImpactDisplay
          type="savings"
          value={savings}
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
          className="w-full h-14 text-base rounded-full transition-all duration-200 hover-scale"
          onClick={() => setConfirmSend(true)}
        >
          <Send className="mr-2 h-5 w-5" />
          {negotiation ? 'Enviar contraproposta' : 'Enviar proposta'}
        </Button>

        <ConfirmDialog
          open={confirmSend}
          onOpenChange={setConfirmSend}
          title="Enviar contraproposta"
          description="Deseja enviar esta proposta para o investidor? Ele receberá uma notificação e poderá aceitar, rejeitar ou fazer uma nova contraproposta."
          confirmText="Enviar"
          onConfirm={handleSubmit}
        />
      </main>
    </div>
  );
};
