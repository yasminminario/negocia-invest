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

const BorrowerDashboard = () => {
  const { user, score, setActiveProfile, isLoading, error } = useProfile();
  const navigate = useNavigate();
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  const firstName = user?.nome?.split(' ')[0] ?? 'Usuário';
  const balance = user?.saldo_cc ?? 0;
  const scoreValue = score?.valor_score ?? 0;

  const actionCards = [
    {
      icon: Search,
      title: 'Encontrar ofertas',
      description: 'Explore ofertas de crédito disponíveis',
      action: () => navigate('/borrower/find-offers'),
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: FileText,
      title: 'Empréstimos ativos',
      description: 'Acompanhe seus empréstimos',
      action: () => navigate('/borrower/loans'),
      color: 'bg-success/10 text-success',
    },
    {
      icon: Handshake,
      title: 'Negociações',
      description: 'Veja suas negociações em andamento',
      action: () => navigate('/borrower/negotiations'),
      color: 'bg-warning/10 text-warning',
    },
  ];

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
                <h2 className="text-lg font-bold">Acesso rápido</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                  {actionCards.map((card, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={card.action}
                          className="w-full p-4 rounded-2xl border-2 border-border hover:border-primary/50 transition-all bg-card text-left group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          aria-label={card.description}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <card.icon className="w-6 h-6" aria-hidden="true" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{card.title}</div>
                              <div className="text-sm text-muted-foreground">{card.description}</div>
                            </div>
                            <span className="text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true">→</span>
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
