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
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { useTranslation } from 'react-i18next';

const BorrowerDashboard = () => {
  const { user, score, setActiveProfile, isLoading, error } = useProfile();
  const navigate = useNavigate();
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();
  const { t } = useTranslation();

  const firstName = user?.nome?.split(' ')[0] ?? t('common.userFallback');
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
        title: t('borrowerDashboard.actions.findOffers.title'),
        description: t('borrowerDashboard.actions.findOffers.description'),
        action: () => navigate('/borrower/find-offers'),
        tone: 'borrower' as const,
        count: availableOffersCount,
        countLabel: t('borrowerDashboard.actions.findOffers.countLabel'),
      },
      {
        icon: FileText,
        title: t('borrowerDashboard.actions.activeLoans.title'),
        description: t('borrowerDashboard.actions.activeLoans.description'),
        action: () => navigate('/borrower/loans'),
        tone: 'success' as const,
        count: activeLoansCount,
        countLabel: t('borrowerDashboard.actions.activeLoans.countLabel'),
      },
      {
        icon: Handshake,
        title: t('borrowerDashboard.actions.negotiations.title'),
        description: t('borrowerDashboard.actions.negotiations.description'),
        action: () => navigate('/borrower/negotiations'),
        tone: 'warning' as const,
        count: ongoingNegotiationsCount,
        countLabel: t('borrowerDashboard.actions.negotiations.countLabel'),
      },
    ],
    [navigate, availableOffersCount, activeLoansCount, ongoingNegotiationsCount, t],
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
                  {t('borrowerDashboard.greeting', { name: firstName })}
                </h1>
                <p className="text-muted-foreground">{t('borrowerDashboard.subtitle')}</p>
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
              <div className="p-6 rounded-2xl bg-gradient-to-br from-borrower/20 via-borrower/10 to-borrower/5 border-2 border-borrower/40">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-borrower/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-borrower" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{t('borrowerDashboard.balanceCard')}</span>
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
                    aria-label={t('borrowerDashboard.createRequestAria')}
                  >
                    + {t('borrowerDashboard.createRequest')}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('borrowerDashboard.createRequestTooltip')}</p>
                </TooltipContent>
              </Tooltip>

              {/* Action Cards */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold">{t('borrowerDashboard.quickAccess.title')}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t('borrowerDashboard.quickAccess.description')}
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

            {/* Right Column - Score & Info */}
            <div className="space-y-6">
              {/* Score Ring */}
              <div className="flex flex-col items-center p-8 bg-gradient-to-br from-borrower/10 to-borrower/5 rounded-2xl border-2 border-borrower/30 sticky top-6">
                <ScoreRing score={scoreValue} size="lg" />
                <div className="mt-4 text-center">
                  <div className="text-lg font-bold text-borrower">{t('borrowerDashboard.score.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('borrowerDashboard.score.subtitle')}</div>
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
                    aria-label={t('borrowerDashboard.switchProfile.tooltip')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t('borrowerDashboard.switchProfile.label')}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('borrowerDashboard.switchProfile.tooltip')}</p>
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
