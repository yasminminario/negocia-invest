import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvestorStats } from './InvestorStats';
import { ActiveProductsSection } from './ActiveProductsSection';
import { LoanCard } from './LoanCard';
import { ActionButtons } from './ActionButtons';

export const InvestorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const navigateTo = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleLoansClick = useCallback(() => {
    navigateTo('/app/investidor/emprestimos-concedidos');
  }, [navigateTo]);

  const handleNegotiationsClick = useCallback(() => {
    navigateTo('/app/investidor/negociacoes');
  }, [navigateTo]);

  const handleViewAll = useCallback(() => {
    navigateTo('/app/investidor/solicitacoes');
  }, [navigateTo]);

  const handleFindRequest = useCallback(() => {
    navigateTo('/app/investidor/solicitacoes');
  }, [navigateTo]);

  return (
    <main className="min-h-[926px] w-full overflow-hidden bg-[#F5F8FE]">
      <InvestorStats />

      <div className="w-full overflow-hidden flex-1 bg-white mt-6 py-6 rounded-[30px_30px_0_0]">
        <ActiveProductsSection
          userType="investor"
          loansCount={3}
          negotiationsCount={1}
          onLoansClick={handleLoansClick}
          onNegotiationsClick={handleNegotiationsClick}
        />

        <section className="w-full mt-6 px-4">
          <div className="flex w-full items-center gap-2.5 text-lg text-black font-semibold px-2">
            <h2 className="text-black self-stretch my-auto">
              Solicitações disponíveis no mercado
            </h2>
          </div>

          <LoanCard
            company="Teste"
            score={597}
            type="fixed"
            interestRate="1,5% a.m."
            period="12 m"
            monthlyPayment="R$912,69"
            total="R$10.952,28"
            offeredValue="R$10.000"
            iconBg="bg-[rgba(87,217,255,0.16)]"
            iconColor="#57D9FF"
            rateColor="text-[#9B59B6]"
            className="mt-2"
          />
        </section>

        <ActionButtons
          userType="investor"
          onViewAll={handleViewAll}
          onFindOffer={handleFindRequest}
        />
      </div>
    </main>
  );
};
