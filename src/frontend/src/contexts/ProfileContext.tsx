import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProfileType, User } from '@/types';

interface ProfileContextType {
  activeProfile: ProfileType;
  setActiveProfile: (profile: ProfileType) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProfile, setActiveProfileState] = useState<ProfileType>('borrower');
  const [user, setUser] = useState<User | null>(null);

  // Atualiza a classe do body E as variáveis CSS quando o perfil muda
  useEffect(() => {
    document.body.classList.remove('profile-borrower', 'profile-investor');
    document.body.classList.add(`profile-${activeProfile}`);
    
    // Atualiza a variável CSS --primary baseado no perfil ativo
    const root = document.documentElement;
    if (activeProfile === 'borrower') {
      root.style.setProperty('--primary', '198 100% 55%'); // Azul
    } else {
      root.style.setProperty('--primary', '283 60% 50%'); // Roxo
    }
  }, [activeProfile]);

  const setActiveProfile = (profile: ProfileType) => {
    setActiveProfileState(profile);
    if (user) {
      setUser({ ...user, activeProfile: profile });
    }
  };

  const logout = () => {
    setUser(null);
    setActiveProfileState('borrower');
    localStorage.removeItem('negocia-user');
  };

  // Persist user in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('negocia-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('negocia-user');
    }
  }, [user]);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('negocia-user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setActiveProfileState(parsedUser.activeProfile || 'borrower');
    }
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        activeProfile,
        setActiveProfile,
        user,
        setUser,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};
