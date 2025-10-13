import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { LoanCard } from '@/components/common/LoanCard';
import { SearchableList } from '@/components/common/SearchableList';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Sparkles, TrendingUp } from 'lucide-react';
import { useActiveLoans } from '@/hooks/useActiveLoans';
import { useOwnProposals } from '@/hooks/useOwnProposals';
import { formatCurrency, formatInterestRate } from '@/utils/calculations';
import type { LoanStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const ActiveLoans = () => {
  const navigate = useNavigate();
  const { loans, loading } = useActiveLoans('investor');
  const {
    proposals: investorOffers,
    loading: loadingOffers,
  } = useOwnProposals('investidor');
  const { t, i18n } = useTranslation();

  const openOffers = investorOffers.filter(
    (offer) => offer.raw.status === 'pendente' && !offer.raw.id_negociacoes,
  );

  const resolveLocale = () => {
    const language = i18n.resolvedLanguage || i18n.language || 'pt-BR';
    if (language.startsWith('pt')) return 'pt-BR';
    if (language.startsWith('es')) return 'es-ES';
    if (language.startsWith('en')) return 'en-US';
    return language;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate('/investor/dashboard')} />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">{t('activeLoans.investor.title')}</h1>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">{t('activeLoans.investor.openOffers')}</h2>
          {loadingOffers ? (
            <div className="text-sm text-muted-foreground">{t('activeLoans.investor.loadingOffers')}</div>
          ) : openOffers.length ? (
            openOffers.map((offer) => (
              <div
                key={offer.raw.id}
                className="relative overflow-hidden rounded-3xl border border-investor/20 bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-investor/6 to-investor/12" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('activeLoans.investor.offer.label', { id: offer.raw.id })}
                    </p>
                    <p className="text-2xl font-bold text-investor">
                      {formatCurrency(offer.amount)}
                    </p>
                  </div>
                  <StatusBadge status={offer.raw.negociavel ? 'negotiable' : 'fixed'} />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('activeLoans.investor.offer.rate')}</p>
                    <p className="mt-1 text-base font-semibold">{formatInterestRate(offer.interestRate)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('activeLoans.investor.offer.installments')}</p>
                    <p className="mt-1 text-base font-semibold">{t('common.months', { count: offer.installments })}</p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('activeLoans.investor.offer.monthlyPayment')}</p>
                    <p className="mt-1 text-base font-semibold">{formatCurrency(offer.monthlyPayment)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('activeLoans.investor.offer.createdAt')}</p>
                    <p className="mt-1 text-base font-semibold">
                      {offer.createdAt.toLocaleDateString(resolveLocale())}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('activeLoans.investor.noOpenOffers')}
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">{t('activeLoans.investor.availableLoans')}</h2>
          {loading ? (
            <div className="text-center py-8">{t('activeLoans.investor.loadingLoans')}</div>
          ) : (
            <SearchableList
              items={loans.map((loan) => ({
                id: loan.id,
                borrowerName: loan.borrowerName ?? t('common.userFallback'),
                amount: loan.amount ?? 0,
                interestRate: loan.interestRate ?? 0,
                installments: loan.installments ?? 0,
                monthlyPayment: loan.monthlyPayment ?? 0,
                totalAmount: loan.totalAmount ?? 0,
                status: loan.status as LoanStatus,
              }))}
              searchKeys={['borrowerName', 'amount', 'interestRate']}
              renderItem={(loan) => (
                <div className="space-y-3">
                  <LoanCard
                    id={loan.id}
                    name={loan.borrowerName}
                    score={0}
                    interestRate={loan.interestRate}
                    installments={loan.installments}
                    monthlyPayment={loan.monthlyPayment}
                    total={loan.totalAmount}
                    amount={loan.amount}
                    status={loan.status as LoanStatus}
                    onClick={() => navigate(`/investor/loan/${loan.id}`)}
                    tone="investor"
                  />
                  {loan.status === 'active' && loan.installments > 0 && (
                    <Button
                      onClick={() => navigate(`/investor/loan/${loan.id}/advance`)}
                      className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-investor to-investor/80 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-investor/30 transition-all duration-200 hover:translate-y-[-1px] hover:from-investor/90 hover:to-investor/70 focus-visible:ring-2 focus-visible:ring-investor"
                    >
                      <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                      {t('activeLoans.investor.advance')}
                    </Button>
                  )}
                </div>
              )}
              emptyMessage={t('activeLoans.investor.empty')}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default ActiveLoans;
