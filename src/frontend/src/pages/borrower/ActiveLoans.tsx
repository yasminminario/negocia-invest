import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { LoanCard } from '@/components/common/LoanCard';
import { SearchableList } from '@/components/common/SearchableList';
import { TrendingUp } from 'lucide-react';
import { mockActiveLoansBorrower } from '@/data/mockData';

const ActiveLoans = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate('/borrower/dashboard')} />
      
      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Empréstimos ativos</h1>
        </div>

        <SearchableList
          items={mockActiveLoansBorrower}
          searchKeys={['investorName', 'amount', 'interestRate']}
          renderItem={(loan) => (
            <LoanCard
              id={loan.id}
              name={loan.investorName}
              score={983}
              interestRate={loan.interestRate}
              installments={loan.installments}
              monthlyPayment={loan.monthlyPayment}
              total={loan.totalAmount}
              amount={loan.amount}
              status={loan.status}
              onClick={() => navigate(`/borrower/loan/${loan.id}`)}
            />
          )}
          emptyMessage="Nenhum empréstimo encontrado"
        />
      </main>
    </div>
  );
};

export default ActiveLoans;
