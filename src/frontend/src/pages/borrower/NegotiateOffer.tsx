import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { NegotiationSlider } from '@/components/negotiation/NegotiationSlider';
import { ComparisonCard } from '@/components/negotiation/ComparisonCard';
import { ImpactDisplay } from '@/components/negotiation/ImpactDisplay';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { calculateMonthlyPayment, calculateTotalAmount, calculateSavings, formatCurrency } from '@/utils/calculations';
import { ArrowRightLeft, CheckCircle2, Clock, Send, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { negociacoesApi, propostasApi, usuariosApi } from '@/services/api.service';
import type { NegociacaoResponse, PropostaResponsePayload, Usuario } from '@/types';
import { parseRateRange } from '@/utils/dataMappers';
import { useNotifications } from '@/contexts/NotificationContext';
import { PageHint } from '@/components/onboarding/PageHint';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const relativeTimeFormatter = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

const statusLabelMap: Record<string, string> = {
  pendente: 'Pendente',
  aceita: 'Aceita',
  rejeitada: 'Recusada',
  cancelada: 'Cancelada',
  finalizada: 'Finalizada',
  expirada: 'Expirada',
};

const statusVariantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pendente: 'secondary',
  aceita: 'default',
  rejeitada: 'destructive',
  cancelada: 'outline',
  finalizada: 'default',
  expirada: 'outline',
};

const proposalTypeLabelMap: Record<string, string> = {
  inicial: 'Proposta inicial',
  contraproposta: 'Contraproposta',
  revisada: 'Proposta revisada',
};

const TIME_RANGES = [
  { max: 60, divisor: 1, unit: 'second' as Intl.RelativeTimeFormatUnit },
  { max: 3600, divisor: 60, unit: 'minute' as Intl.RelativeTimeFormatUnit },
  { max: 86400, divisor: 3600, unit: 'hour' as Intl.RelativeTimeFormatUnit },
  { max: 604800, divisor: 86400, unit: 'day' as Intl.RelativeTimeFormatUnit },
  { max: 2629800, divisor: 604800, unit: 'week' as Intl.RelativeTimeFormatUnit },
  { max: 31557600, divisor: 2629800, unit: 'month' as Intl.RelativeTimeFormatUnit },
  { max: Number.POSITIVE_INFINITY, divisor: 31557600, unit: 'year' as Intl.RelativeTimeFormatUnit },
];

const formatRelativeTime = (dateString?: string | null) => {
  if (!dateString) return '';
  const target = new Date(dateString);
  if (Number.isNaN(target.getTime())) return '';
  const now = Date.now();
  const diffSeconds = Math.round((target.getTime() - now) / 1000);
  const absoluteSeconds = Math.abs(diffSeconds);

  for (const range of TIME_RANGES) {
    if (absoluteSeconds < range.max) {
      const value = Math.round(diffSeconds / range.divisor);
      return relativeTimeFormatter.format(value, range.unit);
    }
  }

  return '';
};

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
  const [createdNegotiationOnLoad, setCreatedNegotiationOnLoad] = useState(false);
  const [proposalsHistory, setProposalsHistory] = useState<PropostaResponsePayload[]>([]);
  const [confirmAcceptLatest, setConfirmAcceptLatest] = useState(false);
  const [confirmDeclineLatest, setConfirmDeclineLatest] = useState(false);
  const [processingAction, setProcessingAction] = useState<'accept' | 'decline' | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      if (!user?.id) {
        return;
      }

      try {
        setFetching(true);
        setError(null);

        const proposalId = Number(id);
        let proposalResponse = await propostasApi.obterPorId(proposalId);
        const hadNegotiation = Boolean(proposalResponse.id_negociacoes);
        let negotiationResponse: NegociacaoResponse | null = null;

        if (!hadNegotiation) {
          negotiationResponse = await propostasApi.iniciarNegociacao(
            proposalId,
            Number(user.id),
          );

          proposalResponse = await propostasApi.obterPorId(proposalId);
          setCreatedNegotiationOnLoad(true);
        } else {
          negotiationResponse = await negociacoesApi.obterPorId(proposalResponse.id_negociacoes);
          setCreatedNegotiationOnLoad(false);
        }
        const investorData = await usuariosApi.obterPorId(proposalResponse.id_autor).catch(() => null);

        setProposal(proposalResponse);
        setNegotiation(negotiationResponse);
        setInvestor(investorData);

        try {
          let timeline: PropostaResponsePayload[] = [];
          if (negotiationResponse?.id) {
            timeline = await propostasApi.listar(negotiationResponse.id);
          }
          if (!timeline.some((item) => item.id === proposalResponse.id)) {
            timeline.push(proposalResponse);
          }
          const ordered = [...timeline].sort(
            (a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime(),
          );
          setProposalsHistory(ordered);
        } catch (historyError) {
          console.warn('Não foi possível carregar histórico da negociação:', historyError);
          setProposalsHistory([proposalResponse]);
        }

        const ranges = parseRateRange(proposalResponse.taxa_sugerida);
        const fallbackRate = ranges.average || ranges.min || ranges.max || 1.5;
        const baseRate = negotiationResponse?.taxa ?? fallbackRate;
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
  }, [id, navigate, user?.id]);

  const ranges = parseRateRange(proposal?.taxa_sugerida);
  const fallbackRate = ranges.average || ranges.min || ranges.max || 1.5;
  const baseRate = negotiation?.taxa ?? fallbackRate;
  const amount = negotiation?.valor ?? proposal?.valor ?? 0;
  const installments = negotiation?.prazo ?? proposal?.prazo_meses ?? 0;
  const currentRate = baseRate;
  const isFirstNegotiationInteraction = createdNegotiationOnLoad && Boolean(negotiation);
  const primaryActionLabel = isFirstNegotiationInteraction ? 'Iniciar negociação' : 'Enviar contraproposta';
  const confirmDialogTitle = isFirstNegotiationInteraction ? 'Iniciar negociação' : 'Enviar contraproposta';
  const confirmDialogDescription = isFirstNegotiationInteraction
    ? 'Deseja iniciar esta negociação com o investidor? Ele receberá sua proposta inicial.'
    : 'Deseja enviar esta proposta para o investidor? Ele poderá aceitar, rejeitar ou responder com uma nova contraproposta.';
  const confirmDialogCta = isFirstNegotiationInteraction ? 'Iniciar' : 'Enviar';

  const latestProposal = proposalsHistory[0] ?? proposal;
  const latestProposalRanges = latestProposal ? parseRateRange(latestProposal.taxa_sugerida) : ranges;
  const latestProposalRate = latestProposalRanges.average || latestProposalRanges.min || latestProposalRanges.max || currentRate;
  const latestProposalInstallments = latestProposal?.prazo_meses ?? installments;
  const latestProposalAmount = latestProposal?.valor ?? amount;
  const latestProposalMonthly = latestProposal?.parcela
    ?? calculateMonthlyPayment(latestProposalAmount, latestProposalRate, latestProposalInstallments || 1);
  const negotiationStatus = negotiation?.status ?? 'em_negociacao';
  const negotiationClosedStatuses = ['aceita', 'finalizada', 'cancelada', 'expirada'];
  const isNegotiationClosed = negotiationClosedStatuses.includes(negotiationStatus);
  const latestStatus = latestProposal?.status ?? 'pendente';
  const canAcceptLatest = Boolean(
    !isNegotiationClosed
    && latestProposal
    && latestProposal.autor_tipo === 'investidor'
    && latestStatus !== 'rejeitada'
    && latestStatus !== 'aceita'
  );
  const closedStatusMessage = useMemo(() => {
    switch (negotiationStatus) {
      case 'aceita':
      case 'finalizada':
        return 'Esta negociação já foi concluída. Consulte seus empréstimos ativos para acompanhar as parcelas.';
      case 'cancelada':
        return 'Esta negociação foi encerrada. Você pode explorar novas ofertas no marketplace.';
      case 'expirada':
        return 'Esta negociação expirou por falta de resposta. Abra uma nova proposta caso ainda tenha interesse.';
      default:
        return null;
    }
  }, [negotiationStatus]);

  const currentMonthly = useMemo(() => calculateMonthlyPayment(amount, currentRate, installments || 1), [amount, currentRate, installments]);
  const currentTotal = useMemo(() => calculateTotalAmount(currentMonthly, installments || 1), [currentMonthly, installments]);

  const proposedMonthly = useMemo(() => calculateMonthlyPayment(amount, proposedRate, installments || 1), [amount, proposedRate, installments]);
  const proposedTotal = useMemo(() => calculateTotalAmount(proposedMonthly, installments || 1), [proposedMonthly, installments]);
  const savings = useMemo(() => calculateSavings(amount, currentRate, proposedRate, installments || 1), [amount, currentRate, proposedRate, installments]);
  const monthlySavings = useMemo(() => currentMonthly - proposedMonthly, [currentMonthly, proposedMonthly]);
  const monthlySavingsLabel = monthlySavings >= 0
    ? `Economia mensal: ${formatCurrency(monthlySavings)}`
    : `Acréscimo mensal: ${formatCurrency(Math.abs(monthlySavings))}`;
  const monthlySavingsClass = monthlySavings >= 0 ? 'text-borrower' : 'text-destructive';

  const sparklineData = useMemo(() => {
    const WIDTH = 100;
    const HEIGHT = 40;
    const PADDING_X = 10;
    const PADDING_Y = 6;

    const rawPoints = [
      { label: 'Oferta atual', value: currentMonthly },
      { label: 'Sua proposta', value: proposedMonthly },
    ];

    const maxValue = Math.max(...rawPoints.map((item) => item.value));
    const minValue = Math.min(...rawPoints.map((item) => item.value));
    const range = maxValue - minValue || 1;
    const usableWidth = WIDTH - PADDING_X * 2;
    const usableHeight = HEIGHT - PADDING_Y * 2;

    const points = rawPoints.map((item, index) => {
      const ratio = rawPoints.length === 1 ? 0 : index / (rawPoints.length - 1);
      const x = PADDING_X + ratio * usableWidth;
      const valueRatio = (item.value - minValue) / range;
      const y = HEIGHT - PADDING_Y - valueRatio * usableHeight;
      return { ...item, x, y };
    });

    const linePath = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    const baselineY = HEIGHT - PADDING_Y;
    const areaPath = points.length >= 2
      ? `M ${points[0].x} ${baselineY} ${points
        .map((point) => `L ${point.x} ${point.y}`)
        .join(' ')} L ${points[points.length - 1].x} ${baselineY} Z`
      : '';

    return {
      points,
      linePath,
      areaPath,
      bounds: { WIDTH, HEIGHT },
    };
  }, [currentMonthly, proposedMonthly]);

  const historyItems = useMemo(() => {
    return proposalsHistory.map((entry, index) => {
      const rateRange = parseRateRange(entry.taxa_sugerida);
      const normalizedRate = rateRange.average || rateRange.min || rateRange.max || latestProposalRate;
      const normalizedInstallments = entry.prazo_meses ?? latestProposalInstallments ?? installments;
      const normalizedAmount = entry.valor ?? latestProposalAmount;
      const monthlyValue = entry.parcela
        ?? calculateMonthlyPayment(normalizedAmount, normalizedRate, normalizedInstallments || 1);

      const statusKey = entry.status ?? 'pendente';
      const typeKey = entry.tipo ?? '';

      return {
        id: entry.id ?? index,
        highlight: index === 0,
        actorLabel: entry.autor_tipo === 'investidor' ? 'Investidor' : 'Você',
        typeLabel:
          proposalTypeLabelMap[typeKey] ?? (entry.autor_tipo === 'investidor' ? 'Oferta do investidor' : 'Sua proposta'),
        statusLabel: statusLabelMap[statusKey] ?? 'Atualização',
        statusVariant: statusVariantMap[statusKey] ?? 'outline',
        createdAtRelative: formatRelativeTime(entry.criado_em),
        details: `Taxa ${normalizedRate.toFixed(2)}% · Parcela ${formatCurrency(monthlyValue)} · Prazo ${normalizedInstallments} meses`,
        justification: entry.justificativa,
      };
    });
  }, [
    installments,
    latestProposalAmount,
    latestProposalInstallments,
    latestProposalRate,
    proposalsHistory,
  ]);

  const handleSubmit = async () => {
    if (!user?.id || !proposal) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a proposta. Verifique seus dados e tente novamente.',
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
        id_negociacoes: negotiation?.id ?? proposal.id_negociacoes ?? null,
        id_autor: user.id,
        autor_tipo: 'tomador',
        taxa_analisada: `${minRange}-${maxRange}%`,
        taxa_sugerida: `${proposedRate.toFixed(2)}%`,
        prazo_meses: negotiation?.prazo ?? proposal.prazo_meses ?? 0,
        tipo: negotiation ? 'contraproposta' : 'inicial',
        status: 'pendente',
        parcela: Number(proposedMonthly.toFixed(2)),
        valor: negotiation?.valor ?? proposal.valor ?? amount,
        negociavel: true,
        justificativa: message ? message.trim() : null,
        id_tomador_destino: negotiation ? null : user.id,
        id_investidor_destino: negotiation ? null : proposal.id_autor,
      });

      const notificationTitle = isFirstNegotiationInteraction ? 'Negociação iniciada' : 'Contraproposta enviada';
      const notificationMessage = isFirstNegotiationInteraction
        ? `Você iniciou uma negociação com ${investor?.nome ?? 'o investidor'}.`
        : `Você respondeu ao investidor ${investor?.nome ?? 'investidor'} nesta negociação.`;

      addNotification({
        type: 'negotiation',
        title: notificationTitle,
        message: notificationMessage,
        actionUrl: '/borrower/negotiations',
        profileType: 'borrower',
      });

      toast({
        title: notificationTitle,
        description: isFirstNegotiationInteraction
          ? 'Sua proposta inicial foi enviada com sucesso.'
          : 'O investidor receberá sua contraproposta em instantes.',
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

  const handleAcceptLatestProposal = async () => {
    if (!latestProposal || !user?.id) {
      toast({
        title: 'Erro',
        description: 'Não foi possível confirmar sua identidade para aceitar a proposta.',
        variant: 'destructive',
      });
      return;
    }

    setProcessingAction('accept');

    try {
      await propostasApi.aceitar(Number(latestProposal.id), {
        usuarioId: Number(user.id),
        perfil: 'tomador',
      });

      addNotification({
        type: 'loan',
        title: 'Negociação concluída',
        message: `Você aceitou a proposta de ${investor?.nome ?? 'investidor'}. O empréstimo foi ativado nos empréstimos ativos.`,
        actionUrl: '/borrower/loans',
        profileType: 'borrower',
      });

      toast({
        title: 'Oferta aceita!',
        description: 'A negociação foi concluída e o empréstimo está ativo na sua carteira.',
        className: 'bg-positive-light border-positive/20',
      });

      navigate('/borrower/loans');
    } catch (err) {
      console.error('Erro ao aceitar proposta:', err);
      const description =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        ?? (err instanceof Error ? err.message : 'Não foi possível aceitar a proposta.');
      toast({
        title: 'Erro ao aceitar',
        description,
        variant: 'destructive',
      });
    } finally {
      setProcessingAction(null);
      setConfirmAcceptLatest(false);
    }
  };

  const handleDeclineNegotiation = async () => {
    if (!latestProposal || !user?.id) {
      toast({
        title: 'Erro',
        description: 'Não foi possível confirmar sua identidade para encerrar a negociação.',
        variant: 'destructive',
      });
      return;
    }

    setProcessingAction('decline');

    try {
      await propostasApi.recusar(Number(latestProposal.id), {
        usuarioId: Number(user.id),
        perfil: 'tomador',
      });

      addNotification({
        type: 'negotiation',
        title: 'Negociação encerrada',
        message: `Você encerrou a negociação com ${investor?.nome ?? 'investidor'}. A oferta voltará para o marketplace.`,
        actionUrl: '/borrower/find-offers',
        profileType: 'borrower',
      });

      toast({
        title: 'Negociação encerrada',
        description: 'Registramos sua decisão. Você pode buscar novas ofertas quando quiser.',
      });

      navigate('/borrower/negotiations');
    } catch (err) {
      console.error('Erro ao encerrar negociação:', err);
      const description =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        ?? (err instanceof Error ? err.message : 'Não foi possível encerrar a negociação.');
      toast({
        title: 'Erro ao encerrar',
        description,
        variant: 'destructive',
      });
    } finally {
      setProcessingAction(null);
      setConfirmDeclineLatest(false);
    }
  };

  // Suggested zone based on negotiation context
  const suggestedMin = Math.max((ranges.min || currentRate) - 0.3, 0.5);
  const suggestedMax = (ranges.max || currentRate) + 1;

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
        <PageHint
          storageKey="hint-borrower-negotiation"
          title="Use a proposta mais recente a seu favor"
          description="Você pode aceitar a proposta enviada pelo investidor, enviar uma contraproposta com novos valores ou encerrar a negociação caso ela não faça mais sentido."
          bullets={[
            'Aceitar ativa automaticamente o empréstimo no seu painel',
            'Contrapropostas atualizam as parcelas projetadas',
            'Encerrar negociação libera você para buscar novas ofertas',
          ]}
          variant="borrower"
          className="mb-6"
        />

        <h1 className="text-2xl font-bold mb-2 text-primary">
          {isFirstNegotiationInteraction ? 'Iniciar negociação' : 'Detalhes da negociação'}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {isFirstNegotiationInteraction
            ? 'Faça sua proposta inicial para o investidor'
            : 'Envie uma contraproposta para'}{' '}
          {investor?.nome ?? 'Investidor'}
        </p>

        {closedStatusMessage && (
          <div className="mb-6 rounded-2xl border border-muted bg-muted/40 p-4 text-sm text-muted-foreground">
            {closedStatusMessage}
          </div>
        )}

        {canAcceptLatest && (
          <>
            <div className="mb-6 hidden rounded-2xl border border-borrower/40 bg-gradient-to-br from-borrower/10 via-background to-background p-5 shadow-sm sm:block">
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="inline-flex items-center gap-1.5 border-borrower/40 bg-borrower/10 text-borrower"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Disponível para decisão
                    </Badge>
                    <Badge variant="outline" className="text-xs uppercase tracking-wide text-muted-foreground">
                      Investidor
                    </Badge>
                  </div>
                  <h2 className="text-sm font-semibold text-borrower">Proposta do investidor pronta para decisão</h2>
                  <p className="text-xs text-muted-foreground">
                    {`Taxa ${latestProposalRate.toFixed(2)}% a.m. · Parcela ${formatCurrency(latestProposalMonthly)} · Prazo ${latestProposalInstallments} meses`}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDeclineLatest(true)}
                    disabled={processingAction !== null}
                    className="min-w-[140px]"
                  >
                    Recusar
                  </Button>
                  <Button
                    onClick={() => setConfirmAcceptLatest(true)}
                    disabled={processingAction !== null}
                    className="min-w-[180px] bg-gradient-to-r from-borrower to-borrower/80 text-primary-foreground shadow-lg transition-transform hover:from-borrower/90 hover:to-borrower/70 hover:scale-[1.01]"
                  >
                    Aceitar proposta
                  </Button>
                </div>
              </div>
            </div>

            <div className="sm:hidden">
              <div className="fixed inset-x-4 bottom-4 z-40 rounded-3xl border border-borrower/30 bg-background/95 p-4 shadow-2xl backdrop-blur supports-[backdrop-filter]:backdrop-blur">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-medium text-borrower">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Proposta disponível
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {`Taxa ${latestProposalRate.toFixed(2)}% a.m. · Parcela ${formatCurrency(latestProposalMonthly)}`}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {`${latestProposalInstallments}x`}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmDeclineLatest(true)}
                    disabled={processingAction !== null}
                    className="h-11"
                  >
                    Recusar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setConfirmAcceptLatest(true)}
                    disabled={processingAction !== null}
                    className="h-11 bg-gradient-to-r from-borrower to-borrower/80 text-primary-foreground shadow-md hover:from-borrower/90 hover:to-borrower/70"
                  >
                    Aceitar
                  </Button>
                </div>
              </div>
              <div className="pb-28" aria-hidden="true" />
            </div>
          </>
        )}

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

        <div className="mb-6 rounded-2xl border border-muted/60 bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-primary">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                Evolução das parcelas
              </p>
              <p className="text-xs text-muted-foreground">
                Visualize a diferença entre a parcela atual e a proposta.
              </p>
            </div>
            <Badge variant="outline" className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Atual × proposta
            </Badge>
          </div>
          <div className="mt-4 h-20 w-full text-borrower">
            <svg
              viewBox={`0 0 ${sparklineData.bounds.WIDTH} ${sparklineData.bounds.HEIGHT}`}
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <defs>
                <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(32, 183, 143, 0.25)" />
                  <stop offset="100%" stopColor="rgba(32, 183, 143, 0.05)" />
                </linearGradient>
              </defs>
              {sparklineData.areaPath && (
                <path d={sparklineData.areaPath} fill="url(#sparkline-gradient)" opacity={0.7} />
              )}
              {sparklineData.linePath && (
                <path
                  d={sparklineData.linePath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              )}
              {sparklineData.points.map((point) => (
                <g key={point.label}>
                  <circle cx={point.x} cy={point.y} r={2} fill="currentColor" />
                  <text
                    x={point.x}
                    y={point.y - 4}
                    textAnchor="middle"
                    className="fill-current text-[9px]"
                  >
                    {formatCurrency(point.value)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-flex h-2 w-2 rounded-full bg-foreground" />
              Parcela atual
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-flex h-2 w-2 rounded-full bg-borrower" />
              Parcela proposta
            </span>
            <span className={cn('ml-auto text-xs font-medium', monthlySavingsClass)}>
              {monthlySavingsLabel}
            </span>
          </div>
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

        <div className="mb-6 rounded-2xl border border-muted/60 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
              Histórico da negociação
            </p>
            <span className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Atualizado em tempo real
            </span>
          </div>
          <div className="mt-4 space-y-4">
            {historyItems.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Ainda não há movimentações nesta negociação. Assim que uma proposta for enviada, ela aparece aqui.
              </p>
            )}
            {historyItems.map((item, index) => (
              <div key={item.id} className="relative pl-6">
                {index !== historyItems.length - 1 && (
                  <span className="absolute left-2 top-6 h-[calc(100%-12px)] w-px bg-border" aria-hidden="true" />
                )}
                <span className="absolute left-1 top-2 inline-flex h-3 w-3 items-center justify-center">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full border border-background transition-colors',
                      item.highlight ? 'bg-borrower shadow-sm shadow-borrower/40' : 'bg-muted-foreground/50',
                    )}
                  />
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="bg-muted/60 text-xs font-medium text-muted-foreground">
                    {item.actorLabel}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {item.typeLabel}
                  </Badge>
                  <Badge variant={item.statusVariant} className="text-xs">
                    {item.statusLabel}
                  </Badge>
                  {item.createdAtRelative && (
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      {item.createdAtRelative}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.details}
                </p>
                {item.justification && (
                  <p className="mt-1 text-[11px] italic text-muted-foreground/80">
                    “{item.justification}”
                  </p>
                )}
              </div>
            ))}
          </div>
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
          className="w-full h-14 rounded-full bg-gradient-to-r from-borrower to-borrower/80 text-base text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-[1.01] hover:from-borrower/90 hover:to-borrower/70 focus-visible:ring-2 focus-visible:ring-borrower"
          onClick={() => setConfirmSend(true)}
        >
          <Send className="mr-2 h-5 w-5" />
          {primaryActionLabel}
        </Button>

        <ConfirmDialog
          open={confirmSend}
          onOpenChange={setConfirmSend}
          title={confirmDialogTitle}
          description={confirmDialogDescription}
          confirmText={confirmDialogCta}
          onConfirm={handleSubmit}
        />

        <ConfirmDialog
          open={confirmAcceptLatest}
          onOpenChange={setConfirmAcceptLatest}
          title="Aceitar proposta"
          description="Confirma que deseja aceitar os termos desta proposta? O empréstimo será ativado imediatamente na sua conta."
          confirmText={processingAction === 'accept' ? 'Confirmando...' : 'Aceitar proposta'}
          confirmDisabled={processingAction !== null}
          onConfirm={handleAcceptLatestProposal}
        />

        <ConfirmDialog
          open={confirmDeclineLatest}
          onOpenChange={setConfirmDeclineLatest}
          title="Encerrar negociação"
          description="Tem certeza de que deseja encerrar esta negociação? Você poderá buscar outras ofertas em seguida."
          confirmText={processingAction === 'decline' ? 'Encerrando...' : 'Encerrar negociação'}
          variant="destructive"
          confirmDisabled={processingAction !== null}
          onConfirm={handleDeclineNegotiation}
        />
      </main>
    </div>
  );
};
