import React from 'react';

interface ActiveProductsSectionProps {
  userType: 'borrower' | 'investor';
  loansCount: number;
  negotiationsCount: number;
  onLoansClick?: () => void;
  onNegotiationsClick?: () => void;
}

export const ActiveProductsSection: React.FC<ActiveProductsSectionProps> = ({
  userType,
  loansCount,
  negotiationsCount,
  onLoansClick,
  onNegotiationsClick,
}) => {
  const primaryColor = userType === 'borrower' ? '#57D9FF' : '#9B59B6';
  const sectionTitle = userType === 'borrower' ? 'solicitados' : 'ofertados';

  const baseCardClass =
    'items-center shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex flex-col flex-1 shrink basis-[0%] bg-[#F5F8FE] p-4 rounded-2xl transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F5F8FE]';

  return (
    <section className="w-full px-4">
      <div className="flex w-full gap-2 text-lg text-black font-semibold px-2">
        <h2>
          Produtos{' '}
          <span style={{ color: primaryColor }}>{sectionTitle}</span>{' '}
          ativos
        </h2>
      </div>
      <div className="flex w-full gap-4 font-normal mt-2">
        <button
          type="button"
          onClick={onLoansClick}
          className={`${baseCardClass} ${onLoansClick ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}`}
          disabled={!onLoansClick}
        >
          <div className="text-[28px]" style={{ color: primaryColor }}>
            <span className="font-bold">{loansCount}</span>
          </div>
          <div className="text-[#4A4A55] text-sm mt-2">Empréstimos</div>
        </button>
        <button
          type="button"
          onClick={onNegotiationsClick}
          className={`${baseCardClass} ${onNegotiationsClick ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}`}
          disabled={!onNegotiationsClick}
        >
          <div className="text-[28px]" style={{ color: primaryColor }}>
            <span className="font-bold">{negotiationsCount}</span>
          </div>
          <div className="text-[#4A4A55] text-sm mt-2">Negociações</div>
        </button>
      </div>
    </section>
  );
};
