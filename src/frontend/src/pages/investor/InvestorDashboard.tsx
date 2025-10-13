import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { useMemo } from 'react';
import { DonutChart } from '@/components/charts/DonutChart';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, TrendingDown, Handshake, Wallet } from 'lucide-react';
import { useInvestorMetrics } from '@/hooks/useInvestorMetrics';
import { formatCurrency } from '@/utils/calculations';
import { OnboardingTutorial } from '@/components/onboarding/OnboardingTutorial';
import { useOnboarding } from '@/hooks/useOnboarding';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActiveLoans } from '@/hooks/useActiveLoans';
import { useOwnProposals } from '@/hooks/useOwnProposals';
import { useNegotiations } from '@/hooks/useNegotiations';
import { useLoanRequests } from '@/hooks/useLoanRequests';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { useTranslation } from 'react-i18next';

const InvestorDashboard = () => {
  const { user, setActiveProfile, isLoading, error } = useProfile();
  const navigate = useNavigate();
  const { metrics, loading: metricsLoading } = useInvestorMetrics();
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();
  const { loans } = useActiveLoans('investor');
  const { proposals: investorOffers } = useOwnProposals('investidor');
  const { negotiations } = useNegotiations('investor');
  const { requests } = useLoanRequests();
  const { t } = useTranslation();

  const firstName = user?.nome?.split(' ')[0] ?? t('common.userFallback');
  const balance = user?.saldo_cc ?? 0;

  const chartData = useMemo(
    () => [
      {
        label: t('investorDashboard.chart.goodScore'),
        value: (metrics.totalInvested * metrics.portfolioDiversification.goodScore) / 100,
        color: 'hsl(var(--investor))',
      },
      {
        label: t('investorDashboard.chart.excellentScore'),
        value: (metrics.totalInvested * metrics.portfolioDiversification.excellentScore) / 100,
        color: 'hsl(var(--borrower))',
      },
    ],
    [metrics.portfolioDiversification.excellentScore, metrics.portfolioDiversification.goodScore, metrics.totalInvested, t],
  );

  const openOffersCount = useMemo(
    () => investorOffers.filter(
      (offer) => offer.raw.status === 'pendente' && !offer.raw.id_negociacoes,
    ).length,
    [investorOffers],
  );

  const totalLoansCount = loans.length + openOffersCount;
  const negotiationsCount = negotiations.length;
  const availableRequestsCount = requests.length;

  const actionCards = useMemo(
    () => [
      {
        icon: Search,
        title: t('investorDashboard.actions.findRequests.title'),
        description: t('investorDashboard.actions.findRequests.description'),
        action: () => navigate('/investor/find-requests'),
        tone: 'investor' as const,
        count: availableRequestsCount,
        countLabel: t('investorDashboard.actions.findRequests.countLabel'),
      },
      {
        icon: TrendingUp,
        title: t('investorDashboard.actions.loans.title'),
        description: t('investorDashboard.actions.loans.description'),
        action: () => navigate('/investor/loans'),
        tone: 'primary' as const,
        count: totalLoansCount,
        titleClassName: 'text-investor',
        countClassName: 'text-investor',
        countLabel: t('investorDashboard.actions.loans.countLabel'),
      },
      {
        icon: Handshake,
        title: t('investorDashboard.actions.negotiations.title'),
        description: t('investorDashboard.actions.negotiations.description'),
        action: () => navigate('/investor/negotiations'),
        tone: 'warning' as const,
        count: negotiationsCount,
        countLabel: t('investorDashboard.actions.negotiations.countLabel'),
      },
    ],
    [navigate, availableRequestsCount, totalLoansCount, negotiationsCount, t],
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />

        <OnboardingTutorial
          profile="investor"
          open={showOnboarding}
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />

        <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Welcome */}
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {t('investorDashboard.greeting', { name: firstName })}
                </h1>
                <p className="text-muted-foreground">{t('investorDashboard.subtitle')}</p>
              </div>

              {isLoading && (
                <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
                  {t('common.loadingProfile')}
                </div>
              )}

              {!isLoading && error && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Balance Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-2 border-primary/40">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{t('investorDashboard.balanceCard')}</span>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(balance)}
                </div>
              </div>

              {/* Metrics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-investor/10 to-investor/5 border-2 border-investor/30">
                  <div className="text-sm text-muted-foreground mb-1">{t('investorDashboard.metrics.returnPercentage')}</div>
                  <div className="text-2xl font-bold text-investor">{metrics.returnPercentage}%</div>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-positive/10 to-positive/5 border-2 border-positive/30">
                  <div className="text-sm text-muted-foreground mb-1">{t('investorDashboard.metrics.totalProfit')}</div>
                  <div className="text-xl font-bold text-positive">{formatCurrency(metrics.totalReturn)}</div>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30">
                  <div className="text-sm text-muted-foreground mb-1">{t('investorDashboard.metrics.totalInvested')}</div>
                  <div className="text-xl font-bold text-primary">{formatCurrency(metrics.totalInvested)}</div>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-border">
                  <div className="text-sm text-muted-foreground mb-1">{t('investorDashboard.metrics.activeLoans')}</div>
                  <div className="text-2xl font-bold">{metrics.activeLoans}</div>
                </div>
              </div>

              {/* Quick Action */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => navigate('/investor/create-offer')}
                    className="w-full rounded-full py-6 text-lg font-semibold hover:scale-[1.02] transition-transform"
                    aria-label={t('investorDashboard.createOfferAria')}
                  >
                    + {t('investorDashboard.createOffer')}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('investorDashboard.createOfferTooltip')}</p>
                </TooltipContent>
              </Tooltip>

              {/* Action Cards */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold">{t('investorDashboard.quickAccess.title')}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t('investorDashboard.quickAccess.description')}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                  {actionCards.map((card, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <QuickActionCard
                          icon={card.icon}
                          title={card.title}
                          description={card.description}
                          onClick={card.action}
                          count={card.count}
                          countLabel={card.countLabel}
                          tone={card.tone}
                          titleClassName={card.titleClassName}
                          countClassName={card.countClassName}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{card.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Chart & Info */}
            <div className="space-y-6">
              {/* Diversification Chart */}
              <div className="p-6 rounded-2xl border-2 bg-card sticky top-6">
                <h3 className="font-bold mb-4">{t('investorDashboard.portfolio')}</h3>
                <DonutChart data={chartData} />
              </div>

              {/* Profile Switch */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      setActiveProfile('borrower');
                      navigate('/borrower/dashboard');
                    }}
                    variant="outline"
                    className="w-full rounded-full bg-borrower/5 border-borrower text-borrower hover:bg-borrower/20 hover:border-borrower transition-colors"
                    aria-label={t('investorDashboard.switchProfile.tooltip')}
                  >
                    <TrendingDown className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t('investorDashboard.switchProfile.label')}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('investorDashboard.switchProfile.tooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default InvestorDashboard;
