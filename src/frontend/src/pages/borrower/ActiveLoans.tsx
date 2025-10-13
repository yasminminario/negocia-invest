import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { LoanCard } from '@/components/common/LoanCard';
import { SearchableList } from '@/components/common/SearchableList';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TrendingUp } from 'lucide-react';
import { useActiveLoans } from '@/hooks/useActiveLoans';
import { useOwnProposals } from '@/hooks/useOwnProposals';
import { formatCurrency, formatInterestRate } from '@/utils/calculations';
import type { LoanStatus } from '@/types';
import { useTranslation } from 'react-i18next';

const ActiveLoans = () => {
  const navigate = useNavigate();
  const { loans, loading } = useActiveLoans('borrower');
  const {
    proposals: borrowerRequests,
    loading: loadingRequests,
  } = useOwnProposals('tomador');
  const { t, i18n } = useTranslation();

  const openRequests = borrowerRequests.filter(
    (request) => request.raw.status === 'pendente' && !request.raw.id_negociacoes,
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
      <Header showBackButton onBack={() => navigate('/borrower/dashboard')} />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">{t('activeLoans.borrower.title')}</h1>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">{t('activeLoans.borrower.openRequests')}</h2>
          {loadingRequests ? (
            <div className="text-sm text-muted-foreground">{t('activeLoans.borrower.loadingRequests')}</div>
          ) : openRequests.length ? (
            openRequests.map((request) => (
              <div
                key={request.raw.id}
                className="relative overflow-hidden rounded-3xl border border-borrower/20 bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-borrower/6 to-borrower/12" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('activeLoans.borrower.request.label', { id: request.raw.id })}
                    </p>
                    <p className="text-2xl font-bold text-borrower">
                      {formatCurrency(request.amount)}
                    </p>
                  </div>
                  <StatusBadge status={request.raw.negociavel ? 'negotiable' : 'fixed'} />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('activeLoans.borrower.request.rate')}</p>
                    <p className="mt-1 text-base font-semibold">{formatInterestRate(request.interestRate)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('activeLoans.borrower.request.installments')}</p>
                    <p className="mt-1 text-base font-semibold">{t('common.months', { count: request.installments })}</p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('activeLoans.borrower.request.monthlyPayment')}</p>
                    <p className="mt-1 text-base font-semibold">{formatCurrency(request.monthlyPayment)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('activeLoans.borrower.request.createdAt')}</p>
                    <p className="mt-1 text-base font-semibold">
                      {request.createdAt.toLocaleDateString(resolveLocale())}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('activeLoans.borrower.noOpenRequests')}
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">{t('activeLoans.borrower.availableLoans')}</h2>
          {loading ? (
            <div className="text-center py-8">{t('activeLoans.borrower.loadingLoans')}</div>
          ) : (
            <SearchableList
              items={loans.map((loan) => ({
                id: loan.id,
                investorName: loan.investorName ?? t('common.userFallback'),
                amount: loan.amount ?? 0,
                interestRate: loan.interestRate ?? 0,
                installments: loan.installments ?? 0,
                monthlyPayment: loan.monthlyPayment ?? 0,
                totalAmount: loan.totalAmount ?? 0,
                status: loan.status as LoanStatus,
              }))}
              searchKeys={['investorName', 'amount', 'interestRate']}
              renderItem={(loan) => (
                <LoanCard
                  id={loan.id}
                  name={loan.investorName}
                  score={0}
                  interestRate={loan.interestRate}
                  installments={loan.installments}
                  monthlyPayment={loan.monthlyPayment}
                  total={loan.totalAmount}
                  amount={loan.amount}
                  status={loan.status as LoanStatus}
                  onClick={() => navigate(`/borrower/loan/${loan.id}`)}
                  tone="borrower"
                />
              )}
              emptyMessage={t('activeLoans.borrower.empty')}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default ActiveLoans;
