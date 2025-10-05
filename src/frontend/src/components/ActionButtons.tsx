import React from 'react';

interface ActionButtonsProps {
  userType: 'borrower' | 'investor';
  onViewAll?: () => void;
  onFindOffer?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ userType, onViewAll, onFindOffer }) => {
  const primaryColor = userType === 'borrower' ? '#57D9FF' : '#9B59B6';
  const buttonText = userType === 'borrower' ? 'Encontrar oferta' : 'Encontrar solicitação';

  return (
    <div className="flex w-full gap-4 text-lg font-semibold justify-center flex-1 h-full mt-6 px-4">
      <button 
        onClick={onViewAll}
        className="justify-center items-center border shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex gap-2.5 px-8 py-4 rounded-[10000px] border-solid transition-colors hover:opacity-80"
        style={{ 
          color: primaryColor, 
          backgroundColor: `${primaryColor}16`, 
          borderColor: primaryColor 
        }}
      >
        <span className="self-stretch my-auto">Ver tudo</span>
      </button>
      <button 
        onClick={onFindOffer}
        className="justify-center items-center border shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex gap-2.5 text-white px-8 py-4 rounded-[10000px] border-solid transition-colors hover:opacity-90"
        style={{ 
          backgroundColor: primaryColor, 
          borderColor: primaryColor 
        }}
      >
        <span className="text-white self-stretch my-auto">{buttonText}</span>
      </button>
    </div>
  );
};
