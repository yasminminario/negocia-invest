import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { usuariosApi, scoresCreditoApi, metricasInvestidorApi } from '@/services/api.service';
import type { ProfileType, Usuario, ScoreCredito, MetricasInvestidor } from '@/types';

interface ProfileContextType {
  activeProfile: ProfileType;
  setActiveProfile: (profile: ProfileType) => void;
  user: Usuario | null;
  profile: Usuario | null;
  score: ScoreCredito | null;
  investorMetrics: MetricasInvestidor | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  refetchProfile: () => Promise<void>;
}

const DEFAULT_USER_ID = Number(import.meta.env.VITE_DEFAULT_USER_ID ?? '1');

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProfile, setActiveProfileState] = useState<ProfileType>(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('activeProfile') : null;
    return (stored as ProfileType) || 'borrower';
  });
  const [userId] = useState<number>(DEFAULT_USER_ID);
  const [user, setUser] = useState<Usuario | null>(null);
  const [score, setScore] = useState<ScoreCredito | null>(null);
  const [investorMetrics, setInvestorMetrics] = useState<MetricasInvestidor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.remove('profile-borrower', 'profile-investor');
    document.body.classList.add(`profile-${activeProfile}`);

    const root = document.documentElement;
    if (activeProfile === 'borrower') {
      root.style.setProperty('--primary', '198 100% 55%');
      root.style.setProperty('--chart-principal', '198 100% 55%');
      root.style.setProperty('--chart-interest', '283 60% 50%');
      root.style.setProperty('--chart-profit', '142 76% 40%');
      root.style.setProperty('--chart-fee', '217 91% 60%');
    } else {
      root.style.setProperty('--primary', '283 60% 50%');
      root.style.setProperty('--chart-principal', '283 60% 50%');
      root.style.setProperty('--chart-interest', '198 100% 55%');
      root.style.setProperty('--chart-profit', '142 76% 40%');
      root.style.setProperty('--chart-fee', '28 92% 45%');
    }
  }, [activeProfile]);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setUser(null);
      setScore(null);
      setInvestorMetrics(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const usuario = await usuariosApi.obterPorId(userId);
      setUser(usuario);

      const [scoreResponse, metricasResponse] = await Promise.all([
        scoresCreditoApi.obterPorUsuario(userId).catch(() => null),
        metricasInvestidorApi.obterPorUsuario(userId).catch(() => null),
      ]);

      setScore(scoreResponse);
      setInvestorMetrics(metricasResponse);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível carregar o perfil.';
      console.error('Erro ao carregar perfil:', err);
      setError(message);
      setUser(null);
      setScore(null);
      setInvestorMetrics(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const setActiveProfile = useCallback((profile: ProfileType) => {
    setActiveProfileState(profile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeProfile', profile);
    }
  }, []);

  const refetchProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const logout = useCallback(() => {
    setUser(null);
    setScore(null);
    setInvestorMetrics(null);
    setActiveProfileState('borrower');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('activeProfile');
    }
  }, []);

  const value = useMemo<ProfileContextType>(
    () => ({
      activeProfile,
      setActiveProfile,
      user,
      profile: user,
      score,
      investorMetrics,
      isAuthenticated: true,
      isLoading,
      error,
      logout,
      refetchProfile,
    }),
    [activeProfile, error, investorMetrics, isLoading, logout, refetchProfile, setActiveProfile, score, user]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};
