import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Handshake, ArrowLeft, FileText } from 'lucide-react';
import { negociacoesApi, propostasApi, usuariosApi } from '@/services/api.service';
import type { NegociacaoResponse, PropostaResponsePayload, Usuario } from '@/types';
import { formatCurrency, formatInterestRate } from '@/utils/calculations';
import { parseRateRange } from '@/utils/dataMappers';
import { calculateRemainingTime, formatTimeRemaining, NEGOTIATION_EXPIRATION_MS } from '@/utils/time';

const STATUS_LABELS: Record<string, string> = {
  aguardando_investidor: 'Aguardando investidor',
  em_negociacao: 'Em negociação',
  pendente: 'Pendente',
  aceito: 'Aceito',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
  expirada: 'Expirada',
};

const NegotiationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const negociacaoId = Number(id);
  const [negociacao, setNegociacao] = useState<NegociacaoResponse | null>(null);
  const [propostas, setPropostas] = useState<PropostaResponsePayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Record<number, Usuario | null>>({});

  useEffect(() => {
    if (!negociacaoId) {
      setError('Identificador de negociação inválido.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [negociacaoResponse, propostasResponse] = await Promise.all([
          negociacoesApi.obterPorId(negociacaoId),
          propostasApi.listar(negociacaoId),
        ]);

        setNegociacao(negociacaoResponse);
        setPropostas(propostasResponse);

        const participantIds = new Set<number>();
        if (negociacaoResponse) {
          participantIds.add(negociacaoResponse.id_tomador);
          participantIds.add(negociacaoResponse.id_investidor);
        }
        propostasResponse.forEach((proposta) => participantIds.add(proposta.id_autor));

        const profiles = await Promise.all(
          Array.from(participantIds).map(async (userId) => {
            try {
              const profile = await usuariosApi.obterPorId(userId);
              return { id: userId, profile } as const;
            } catch (fetchError) {
              console.error(`Erro ao carregar usuário ${userId}:`, fetchError);
              return { id: userId, profile: null } as const;
            }
          })
        );

        const map = profiles.reduce<Record<number, Usuario | null>>((acc, entry) => {
          acc[entry.id] = entry.profile;
          return acc;
        }, {});
        setParticipants(map);
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'Não foi possível carregar a negociação.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [negociacaoId]);

  const handleBack = () => navigate('/borrower/negotiations');

  const investorHasResponded = useMemo(
    () => propostas.some((item) => item.autor_tipo === 'investidor'),
    [propostas],
  );

  const latestInvestorProposal = useMemo(
    () => propostas.find((item) => item.autor_tipo === 'investidor') ?? null,
    [propostas],
  );

  const latestBorrowerProposal = useMemo(
    () => propostas.find((item) => item.autor_tipo === 'tomador') ?? null,
    [propostas],
  );

  const derivedNegotiation = useMemo(() => {
    const referenceProposal = latestInvestorProposal ?? latestBorrowerProposal ?? null;
    const parsedRate = referenceProposal?.taxa_sugerida ? parseRateRange(referenceProposal.taxa_sugerida) : null;
    return {
      taxa: negociacao?.taxa ?? parsedRate?.average ?? null,
      prazo: negociacao?.prazo ?? referenceProposal?.prazo_meses ?? null,
      valor: negociacao?.valor ?? referenceProposal?.valor ?? null,
      parcela: negociacao?.parcela ?? referenceProposal?.parcela ?? null,
    };
  }, [negociacao, latestInvestorProposal, latestBorrowerProposal]);

  const investorDisplayName = negociacao && investorHasResponded
    ? participants[negociacao.id_investidor]?.nome ?? `Usuário #${negociacao.id_investidor}`
    : 'Aguardando investidor';

  const statusKey = investorHasResponded ? negociacao?.status ?? 'em_negociacao' : 'aguardando_investidor';
  const statusLabel = STATUS_LABELS[statusKey] ?? statusKey;

  const remainingMs = useMemo(
    () => (negociacao ? calculateRemainingTime(negociacao.criado_em) : null),
    [negociacao?.criado_em],
  );

  const countdownExpired = negociacao
    ? negociacao.status === 'expirada' || (remainingMs != null && remainingMs <= 0)
    : false;

  const countdownLabel = remainingMs == null
    ? '--'
    : countdownExpired
      ? 'Prazo encerrado'
      : `Restam ${formatTimeRemaining(remainingMs)}`;

  const deadline = useMemo(() => {
    if (!negociacao) return null;
    const createdTime = new Date(negociacao.criado_em).getTime();
    if (Number.isNaN(createdTime)) return null;
    return new Date(createdTime + NEGOTIATION_EXPIRATION_MS);
  }, [negociacao]);

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={handleBack} />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Handshake className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Detalhes da negociação</h1>
        </div>

        {loading && <div className="p-4 rounded-lg border border-border">Carregando...</div>}

        {!loading && error && (
          <div className="p-4 rounded-lg border border-destructive text-destructive text-sm">
            {error}
          </div>
        )}

        {!loading && negociacao && (
          <Card className="p-4 space-y-4 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Negociação #{negociacao.id}</p>
                <p className="text-lg font-semibold text-foreground">Status: {statusLabel}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>
                  Tomador: {participants[negociacao.id_tomador]?.nome ?? `Usuário #${negociacao.id_tomador}`}
                </p>
                <p>
                  Investidor: {investorDisplayName}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border border-border/60">
              <p className="text-xs text-muted-foreground">Prazo para finalizar</p>
              <p
                className={`text-sm font-semibold ${countdownExpired ? 'text-status-cancelled' : 'text-status-pending'
                  }`}
              >
                {countdownLabel}
              </p>
              {deadline && (
                <p className="text-xs text-muted-foreground">
                  {countdownExpired ? `Encerrado em ${deadline.toLocaleString()}` : `Limite: ${deadline.toLocaleString()}`}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Taxa</p>
                <p className="text-sm font-semibold text-foreground">
                  {derivedNegotiation.taxa != null ? formatInterestRate(derivedNegotiation.taxa) : '--'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Prazo</p>
                <p className="text-sm font-semibold text-foreground">
                  {derivedNegotiation.prazo != null ? `${derivedNegotiation.prazo} meses` : '--'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Valor</p>
                <p className="text-sm font-semibold text-foreground">
                  {derivedNegotiation.valor != null ? formatCurrency(derivedNegotiation.valor) : '--'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Parcela</p>
                <p className="text-sm font-semibold text-foreground">
                  {derivedNegotiation.parcela != null ? formatCurrency(derivedNegotiation.parcela) : '--'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div>
                <span>Última atualização</span>
                <p className="font-medium text-foreground">{new Date(negociacao.atualizado_em).toLocaleString()}</p>
              </div>
              <div>
                <span>Criado em</span>
                <p className="font-medium text-foreground">{new Date(negociacao.criado_em).toLocaleString()}</p>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Card>
        )}

        {!loading && propostas.length > 0 && (
          <Card className="p-4 space-y-3 border border-border">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Propostas</h2>
            </div>

            <ul className="space-y-2 text-sm">
              {propostas.map((proposta) => (
                <li
                  key={proposta.id}
                  className="rounded-lg border border-border p-3 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {participants[proposta.id_autor]?.nome ?? `Usuário #${proposta.id_autor}`}{' '}
                      <span className="text-xs text-muted-foreground">({proposta.autor_tipo})</span>
                    </span>
                    <span className="text-muted-foreground">{new Date(proposta.criado_em).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>Taxa sugerida: {proposta.taxa_sugerida}</span>
                    <span>Taxa analisada: {proposta.taxa_analisada}</span>
                    <span>Prazo: {proposta.prazo_meses} meses</span>
                    <span>Status: {proposta.status}</span>
                  </div>
                  {proposta.valor != null && (
                    <span className="text-xs text-muted-foreground">Valor: {formatCurrency(proposta.valor)}</span>
                  )}
                  {proposta.negociavel ? (
                    <span className="text-xs text-primary">Negociável</span>
                  ) : (
                    <span className="text-xs">Não negociável</span>
                  )}
                  {proposta.justificativa && (
                    <p className="text-xs text-muted-foreground">Justificativa: {proposta.justificativa}</p>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {!loading && negociacao && propostas.length === 0 && (
          <Card className="p-4 border border-dashed border-border text-sm text-muted-foreground">
            Nenhuma proposta cadastrada para esta negociação.
          </Card>
        )}
      </main>
    </div>
  );
};

export default NegotiationDetails;
