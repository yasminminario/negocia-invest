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
import { Button } from '@/components/ui/button';

const ActiveLoans = () => {
  const navigate = useNavigate();
  const { loans, loading } = useActiveLoans('investor');
  const {
    proposals: investorOffers,
    loading: loadingOffers,
  } = useOwnProposals('investidor');

  const openOffers = investorOffers.filter(
    (offer) => offer.raw.status === 'pendente' && !offer.raw.id_negociacoes,
  );

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate('/investor/dashboard')} />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Empréstimos</h1>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Ofertas em aberto</h2>
          {loadingOffers ? (
            <div className="text-sm text-muted-foreground">Carregando ofertas...</div>
          ) : openOffers.length ? (
            openOffers.map((offer) => (
              <div
                key={offer.raw.id}
                className="space-y-3 rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Oferta #{offer.raw.id}
                    </p>
                    <p className="text-xl font-semibold text-primary">
                      {formatCurrency(offer.amount)}
                    </p>
                  </div>
                  <StatusBadge status={offer.raw.negociavel ? 'negotiable' : 'fixed'} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Taxa sugerida</p>
                    <p className="font-medium">{formatInterestRate(offer.interestRate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Parcelas</p>
                    <p className="font-medium">{offer.installments} meses</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Parcela estimada</p>
                    <p className="font-medium">{formatCurrency(offer.monthlyPayment)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Criada em</p>
                    <p className="font-medium">
                      {offer.createdAt.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Você não possui ofertas em aberto no momento.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Empréstimos ativos</h2>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <SearchableList
              items={loans.map((loan) => ({
                id: loan.id,
                borrowerName: loan.borrowerName ?? 'Usuário',
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
                  />
                  {loan.status === 'active' && loan.installments > 0 && (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => navigate(`/investor/loan/${loan.id}/advance`)}
                    >
                      Antecipar parcelas
                    </Button>
                  )}
                </div>
              )}
              emptyMessage="Nenhum empréstimo encontrado"
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default ActiveLoans;
