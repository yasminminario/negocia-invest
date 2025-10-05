import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onUserTypeChange?: (type: 'borrower' | 'investor') => void;
}

export const Header: React.FC<HeaderProps> = ({ onUserTypeChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeProfile, switchProfile, hasChosenProfile } = useAuth();

  const userType = useMemo(() => (activeProfile === 'investidor' ? 'investor' : 'borrower'), [activeProfile]);

  const isDashboardRoute = useMemo(() => {
    if (userType === 'borrower') {
      return location.pathname === '/app/tomador/dashboard';
    }
    if (userType === 'investor') {
      return location.pathname === '/app/investidor/dashboard';
    }
    return false;
  }, [location.pathname, userType]);

  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || (userType === 'borrower' ? '#57D9FF' : '#9B59B6');

  const handleBack = () => {
    navigate(-1);
  };

  const handleToggle = () => {
    // prefer the layout-level handler (for navigation) if provided
    const targetUser = userType === 'borrower' ? 'investor' : 'borrower';
    if (onUserTypeChange) {
      onUserTypeChange(targetUser as 'borrower' | 'investor');
      return;
    }

    // fallback: directly switch profile in auth context
    const target = userType === 'borrower' ? 'investidor' : 'tomador';
    switchProfile(target as any);
  };

  return (
    <header className="flex w-full gap-[34px] justify-between items-start pt-6 px-4">
      <div className="flex min-w-60 flex-col items-stretch font-normal">
        <div className="flex items-center gap-1 text-[28px] text-black justify-start">
          <img
            src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/ee41071de3f70c93118c0c4bf2ba2a64fce7afc0?placeholderIfAbsent=true"
            className="aspect-[1.29] object-contain w-11 self-stretch shrink-0 my-auto"
            alt="User avatar"
          />
          <div className="text-black self-stretch my-auto">
            Olá, <span className="font-bold">Carlos!</span>
          </div>
        </div>
        {hasChosenProfile && (
          <button
            onClick={handleToggle}
            className={`justify-center items-center border shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex gap-2 text-sm font-bold bg-opacity-16 mt-4 px-4 py-2 rounded-[1000px] border-solid transition-colors ${userType === 'borrower'
              ? 'text-[#9B59B6] bg-[rgba(155,89,182,0.16)] border-[#9B59B6]'
              : 'text-[#57D9FF] bg-[rgba(87,217,255,0.16)] border-[#57D9FF]'
              }`}
          >
            <span>
              {userType === 'borrower'
                ? 'Mudar para perfil de investidor'
                : 'Mudar para perfil de tomador'
              }
            </span>
            <img
              src={userType === 'borrower'
                ? "https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/972ee3e3cfe1c36d7d7b18f71354c6f3395b82c0?placeholderIfAbsent=true"
                : "https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/124470305ba1484a1385fde7fe08a67ea13db82c?placeholderIfAbsent=true"
              }
              className="aspect-[19/16] object-contain w-[19px] self-stretch shrink-0 my-auto"
              alt="Switch profile"
            />
          </button>
        )}
      </div>
      <div id="header-icons" className="flex items-center gap-6">
        {isDashboardRoute ? (
          <>
            <button className="aspect-[1] object-contain w-[34px] self-stretch shrink-0 my-auto">
              <img
                src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/49acde283ca471985aeb48a617d3afb64d1c56d2?placeholderIfAbsent=true"
                className="h-full w-full"
                alt="Notifications"
              />
            </button>
            <button className="aspect-[1] object-contain w-[34px] self-stretch shrink-0 my-auto">
              <img
                src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/abf1b11056eac9fa2d14e5ec12dd500f7c2f443f?placeholderIfAbsent=true"
                className="h-full w-full"
                alt="Settings"
              />
            </button>
          </>
        ) : (
          <button
            onClick={handleBack}
            className="justify-center items-center border shadow-[0_4px_4px_0_rgba(10,32,81,0.08)] flex gap-1 text-base text-white font-normal px-6 py-4 rounded-[10000px] border-solid transition-colors hover:opacity-90"
            style={{ backgroundColor: primaryColor.trim(), borderColor: primaryColor.trim() }}
          >
            <img
              src="https://api.builder.io/api/v1/image/assets/7672f9343bc0488a9cb06053f569dd73/4633cdae80e5de945df16a40dac0b99fef45623b?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-[18px] self-stretch shrink-0 my-auto"
              alt="Back arrow"
            />
            <span className="text-white self-stretch my-auto font-bold">Voltar</span>
          </button>
        )}
      </div>
    </header>
  );
};
