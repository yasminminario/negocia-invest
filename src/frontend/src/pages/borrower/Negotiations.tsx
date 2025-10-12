import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Search, SlidersHorizontal, Handshake } from 'lucide-react';
import { useNegotiations } from '@/hooks/useNegotiations';
import { formatCurrency, formatInterestRate } from '@/utils/calculations';
import type { NegotiationStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/contexts/ProfileContext';
import { calculateRemainingTime, formatTimeRemaining } from '@/utils/time';

const Negotiations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useProfile();
  const { negotiations, loading } = useNegotiations('borrower');

  const filteredNegotiations = negotiations.filter((negotiation) => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return true;

    const investidorNome = negotiation.investidor?.nome?.toLowerCase() ?? '';
    const tomadorNome = negotiation.tomador?.nome?.toLowerCase() ?? '';
    const identificadores = [
      investidorNome,
      tomadorNome,
      String(negotiation.id),
      String(negotiation.id_investidor),
      String(negotiation.id_tomador),
    ];

    return identificadores.some((campo) => campo.includes(term));
  });

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate('/borrower/dashboard')} />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Handshake className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Negociações</h1>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar"
              className="pl-10"
            />
          </div>
          <button className="px-4 py-2 rounded-lg border-2 border-border hover:border-primary transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Negotiations List */}
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="space-y-4">
            {filteredNegotiations.map((negotiation) => {
              const borrowerName = user?.nome ?? negotiation.tomador?.nome ?? `Usuário #${negotiation.id_tomador}`;
              const investorHasResponded = (negotiation.quant_propostas ?? 0) > 1;
              const investorName = investorHasResponded
                ? negotiation.investidor?.nome ?? `Usuário #${negotiation.id_investidor}`
                : 'Aguardando investidor';
              const investorInitial = investorHasResponded ? investorName.charAt(0).toUpperCase() : '?';
              const awaitingNegotiation = !negotiation.quant_propostas || negotiation.quant_propostas <= 1;
              const remainingMs = calculateRemainingTime(negotiation.criado_em);
              const activeStatus = ['em_negociacao', 'pendente', 'em_andamento'].includes(
                negotiation.status as string,
              );
              const expiredByClock = remainingMs != null && remainingMs <= 0;
              const expired = negotiation.status === 'expirada' || (activeStatus && expiredByClock);
              const countdownLabel = remainingMs == null
                ? '--'
                : expired
                  ? 'Prazo encerrado'
                  : `Expira em ${formatTimeRemaining(remainingMs)}`;
              const showCountdown = activeStatus || expired;

              return (
                <div
                  key={negotiation.id}
                  onClick={() => navigate(`/borrower/negotiation/${negotiation.id}`)}
                  className="bg-card rounded-2xl p-5 border border-border cursor-pointer hover:border-primary/80 transition-all shadow-sm hover:shadow-md"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary aspect-square">
                        {investorInitial}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Negociando com</p>
                        <p className="text-base font-semibold text-foreground leading-tight">{investorName}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-muted/40 border-dashed">
                            {borrowerName} (você)
                          </Badge>
                          {investorHasResponded ? (
                            <Badge variant="secondary" className="text-xs font-semibold">
                              {investorName}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs font-semibold border-dashed">
                              Aguardando investidor
                            </Badge>
                          )}
                          {awaitingNegotiation && (
                            <Badge variant="outline" className="text-muted-foreground border-dashed">
                              Aguardando negociação
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={negotiation.status as NegotiationStatus} />
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Taxa atual</p>
                      <p className="text-sm font-bold text-primary">
                        {negotiation.taxa != null ? formatInterestRate(negotiation.taxa) : '--'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Prazo</p>
                      <p className="text-sm font-bold text-foreground">
                        {negotiation.prazo != null ? `${negotiation.prazo} meses` : '--'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Parcela</p>
                      <p className="text-sm font-bold text-foreground">
                        {negotiation.parcela != null ? formatCurrency(negotiation.parcela) : '--'}
                      </p>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Valor solicitado</p>
                      <p className="text-lg font-semibold text-foreground">
                        {negotiation.valor != null ? formatCurrency(negotiation.valor) : '--'}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      Número da negociação<br />
                      <span className="text-sm font-semibold text-foreground">#{negotiation.id}</span>
                      {showCountdown && (
                        <div
                          className={`mt-2 text-xs font-semibold ${expired ? 'text-status-cancelled' : 'text-status-pending'
                            }`}
                        >
                          {countdownLabel}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {!loading && filteredNegotiations.length === 0 && (
              <div className="text-center py-12">
                <Handshake className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Nenhuma negociação ativa</p>
              </div>
            )}

            {/* End indicator */}
            {filteredNegotiations.length > 0 && (
              <div className="text-center text-sm text-muted-foreground py-4">
                😊 Acaba aqui
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Negotiations;
