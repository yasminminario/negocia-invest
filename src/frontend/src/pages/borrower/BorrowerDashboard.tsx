import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { ScoreRing } from '@/components/common/ScoreRing';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Search, FileText, Handshake, TrendingUp, Wallet } from 'lucide-react';
import { formatCurrency } from '@/utils/calculations';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OnboardingTutorial } from '@/components/onboarding/OnboardingTutorial';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useOffers } from '@/hooks/useOffers';
import { useActiveLoans } from '@/hooks/useActiveLoans';
import { useNegotiations } from '@/hooks/useNegotiations';

const BorrowerDashboard = () => {
  const { user, score, setActiveProfile, isLoading, error } = useProfile();
  const navigate = useNavigate();
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  const firstName = user?.nome?.split(' ')[0] ?? 'Usuário';
  const balance = user?.saldo_cc ?? 0;
  const scoreValue = score?.valor_score ?? 0;

  const { offers } = useOffers();
  const { loans } = useActiveLoans('borrower');
  const { negotiations } = useNegotiations('borrower');

  const availableOffersCount = offers.length;
  const activeLoansCount = useMemo(
    () => loans.filter((loan) => loan.status === 'active').length,
    [loans],
  );
  const ongoingNegotiationsCount = useMemo(
    () => negotiations.filter((neg) => !['finalizada', 'cancelada'].includes(neg.status)).length,
    [negotiations],
  );

  const actionCards = useMemo(
    () => [
      {
        icon: Search,
        title: 'Encontrar ofertas',
        description: 'Explore opções de crédito alinhadas ao seu perfil',
        action: () => navigate('/borrower/find-offers'),
        color: 'bg-primary/10 text-primary',
        background: 'from-primary/10 via-primary/5 to-transparent',
        accent: 'text-primary',
        count: availableOffersCount,
        countLabel: 'Disponíveis',
        countColor: 'text-primary',
      },
      {
        icon: FileText,
        title: 'Empréstimos ativos',
        description: 'Acompanhe contratos em andamento e parcelas atuais',
        action: () => navigate('/borrower/loans'),
        color: 'bg-success/10 text-success',
        background: 'from-success/10 via-success/5 to-transparent',
        accent: 'text-success',
        count: activeLoansCount,
        countLabel: 'Em andamento',
        countColor: 'text-success',
      },
      {
        icon: Handshake,
        title: 'Negociações',
        description: 'Gerencie contrapropostas e mantenha o diálogo em dia',
        action: () => navigate('/borrower/negotiations'),
        color: 'bg-warning/10 text-warning',
        background: 'from-warning/10 via-warning/5 to-transparent',
        accent: 'text-warning',
        count: ongoingNegotiationsCount,
        countLabel: 'Em andamento',
        countColor: 'text-warning',
      },
    ],
    [navigate, availableOffersCount, activeLoansCount, ongoingNegotiationsCount],
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />

        <OnboardingTutorial
          profile="borrower"
          open={showOnboarding}
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />

        <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Welcome Section */}
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Olá, {firstName}! 👋
                </h1>
                <p className="text-muted-foreground">Bem-vindo de volta ao seu painel</p>
              </div>

              {isLoading && (
                <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
                  Carregando dados do seu perfil...
                </div>
              )}

              {!isLoading && error && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Balance Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-borrower/20 via-borrower/10 to-borrower/5 border-2 border-borrower/40">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-borrower/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-borrower" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Saldo em Conta</span>
                </div>
                <div className="text-3xl font-bold text-borrower">
                  {formatCurrency(balance)}
                </div>
              </div>

              {/* Quick Action */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => navigate('/borrower/create-request')}
                    className="w-full rounded-full py-6 text-lg font-semibold hover:scale-[1.02] transition-transform"
                    aria-label="Criar nova solicitação de empréstimo"
                  >
                    + Solicitar empréstimo
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Criar nova solicitação de empréstimo</p>
                </TooltipContent>
              </Tooltip>

              {/* Action Cards */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold">Acesso rápido</h2>
                  <p className="text-sm text-muted-foreground">
                    Veja oportunidades disponíveis, acompanhamento de contratos e negociações em andamento.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                  {actionCards.map((card, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={card.action}
                          className="group relative w-full overflow-hidden rounded-2xl border border-border bg-card p-4 text-left transition-all duration-200 hover:border-primary/40 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          aria-label={card.description}
                        >
                          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.background ?? 'from-muted/10 via-muted/5 to-transparent'}`} />
                          <div className="relative flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-2xl ${card.color ?? 'bg-primary/10 text-primary'} flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                                <card.icon className="w-6 h-6" aria-hidden="true" />
                              </div>
                              <div>
                                <div className={`font-semibold ${card.accent ?? ''}`}>{card.title}</div>
                                <div className="text-sm text-muted-foreground">{card.description}</div>
                                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium uppercase tracking-wide">
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    Acesso rápido
                                  </span>
                                </div>
                              </div>
                            </div>
                            {typeof card.count === 'number' && (
                              <div className="flex flex-col items-end justify-center gap-1">
                                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                  {card.countLabel ?? 'Total'}
                                </span>
                                <span className={`text-3xl font-extrabold leading-none ${card.countColor ?? 'text-primary'}`}>
                                  {card.count}
                                </span>
                              </div>
                            )}
                            <span className="mt-1 self-center text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true">→</span>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{card.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Score & Info */}
            <div className="space-y-6">
              {/* Score Ring */}
              <div className="flex flex-col items-center p-8 bg-gradient-to-br from-borrower/10 to-borrower/5 rounded-2xl border-2 border-borrower/30 sticky top-6">
                <ScoreRing score={scoreValue} size="lg" />
                <div className="mt-4 text-center">
                  <div className="text-lg font-bold text-borrower">Excelente Pagador</div>
                  <div className="text-sm text-muted-foreground">Seu score está ótimo!</div>
                </div>
              </div>

              {/* Profile Switch */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      setActiveProfile('investor');
                      navigate('/investor/dashboard');
                    }}
                    variant="outline"
                    className="w-full rounded-full bg-investor/5 border-investor text-investor hover:bg-investor/20 hover:border-investor transition-colors"
                    aria-label="Mudar para perfil de investidor"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" aria-hidden="true" />
                    Trocar para Investidor
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Trocar para modo Investidor</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default BorrowerDashboard;
