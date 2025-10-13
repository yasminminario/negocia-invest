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

const ActiveLoans = () => {
  const navigate = useNavigate();
  const { loans, loading } = useActiveLoans('borrower');
  const {
    proposals: borrowerRequests,
    loading: loadingRequests,
  } = useOwnProposals('tomador');

  const openRequests = borrowerRequests.filter(
    (request) => request.raw.status === 'pendente' && !request.raw.id_negociacoes,
  );

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate('/borrower/dashboard')} />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Empréstimos</h1>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Solicitações em aberto</h2>
          {loadingRequests ? (
            <div className="text-sm text-muted-foreground">Carregando solicitações...</div>
          ) : openRequests.length ? (
            openRequests.map((request) => (
              <div
                key={request.raw.id}
                className="space-y-3 rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Solicitação #{request.raw.id}
                    </p>
                    <p className="text-xl font-semibold text-primary">
                      {formatCurrency(request.amount)}
                    </p>
                  </div>
                  <StatusBadge status={request.raw.negociavel ? 'negotiable' : 'fixed'} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Taxa sugerida</p>
                    <p className="font-medium">{formatInterestRate(request.interestRate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Parcelas</p>
                    <p className="font-medium">{request.installments} meses</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Parcela estimada</p>
                    <p className="font-medium">{formatCurrency(request.monthlyPayment)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Criado em</p>
                    <p className="font-medium">
                      {request.createdAt.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Você não possui solicitações em aberto no momento.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Empréstimos</h2>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <SearchableList
              items={loans.map((loan) => ({
                id: loan.id,
                investorName: loan.investorName ?? 'Usuário',
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
                />
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
