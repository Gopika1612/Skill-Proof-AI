import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, setCurrentUserId, getCurrentUserId } from '../api';

export type ScreenState = 'landing' | 'login' | 'signup' | 'onboarding' | 'assessment' | 'app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  activeScreen: ScreenState;
  setActiveScreen: (screen: ScreenState) => void;
  login: (email: string, password?: string) => Promise<User>;
  loginAsDemo: (userId: string) => Promise<void>;
  register: (data: Partial<User>) => Promise<User>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  completeOnboarding: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeScreen, setActiveScreen] = useState<ScreenState>('landing');

  const refreshUser = async () => {
    try {
      const storedId = localStorage.getItem('skillproof_userId');
      if (!storedId) {
        setUser(null);
        setActiveScreen('landing');
        setLoading(false);
        return;
      }

      const res = await api.getMe();
      if (res.user) {
        setUser(res.user);
        if (res.user.role === 'student' && !res.user.onboardingCompleted) {
          setActiveScreen('onboarding');
        } else {
          setActiveScreen('app');
        }
      } else {
        setUser(null);
        setActiveScreen('landing');
      }
    } catch (err) {
      console.warn('Could not load user session:', err);
      setUser(null);
      setActiveScreen('landing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password?: string): Promise<User> => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setCurrentUserId(res.user.id);
      setUser(res.user);
      if (res.user.role === 'student' && !res.user.onboardingCompleted) {
        setActiveScreen('onboarding');
      } else {
        setActiveScreen('app');
      }
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async (userId: string) => {
    setLoading(true);
    try {
      setCurrentUserId(userId);
      const res = await api.getMe();
      setUser(res.user);
      setActiveScreen('app');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: Partial<User>): Promise<User> => {
    setLoading(true);
    try {
      const res = await api.register(data);
      setCurrentUserId(res.user.id);
      setUser(res.user);
      if (res.user.role === 'student') {
        setActiveScreen('onboarding');
      } else {
        setActiveScreen('app');
      }
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (data: Partial<User>) => {
    if (!user) return;
    setLoading(true);
    try {
      const updates = {
        ...data,
        onboardingCompleted: true,
      };
      const res = await api.updateProfile(updates);
      setUser(res.user);
      setActiveScreen('app');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const res = await api.updateProfile(updates);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('skillproof_userId');
    setCurrentUserId('');
    setUser(null);
    setActiveScreen('landing');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        activeScreen,
        setActiveScreen,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile,
        completeOnboarding,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
