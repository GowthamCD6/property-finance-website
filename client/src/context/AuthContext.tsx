import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { loginAdminApi, loginAdminWithGoogleApi, logoutAdminApi, getAdminProfileApi } from '../services/api';

interface AuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneOrIdentifier: string, pass: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const cached = localStorage.getItem('vpf_admin_profile');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    const token = localStorage.getItem('vpf_admin_token');
    const cached = localStorage.getItem('vpf_admin_profile');
    // If we have token and cached profile, don't block the layout with full-screen loading
    return Boolean(token && !cached);
  });

  const checkAuth = async () => {
    const token = localStorage.getItem('vpf_admin_token');
    if (!token) {
      setAdmin(null);
      localStorage.removeItem('vpf_admin_profile');
      setIsLoading(false);
      return;
    }

    try {
      const profile = await getAdminProfileApi();
      setAdmin(profile);
      localStorage.setItem('vpf_admin_profile', JSON.stringify(profile));
    } catch {
      localStorage.removeItem('vpf_admin_token');
      localStorage.removeItem('vpf_admin_profile');
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (phoneOrIdentifier: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await loginAdminApi(phoneOrIdentifier, pass);
      localStorage.setItem('vpf_admin_token', data.token);
      localStorage.setItem('vpf_admin_profile', JSON.stringify(data.admin));
      setAdmin(data.admin);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true);
    try {
      const data = await loginAdminWithGoogleApi(credential);
      localStorage.setItem('vpf_admin_token', data.token);
      localStorage.setItem('vpf_admin_profile', JSON.stringify(data.admin));
      setAdmin(data.admin);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutAdminApi();
    } finally {
      localStorage.removeItem('vpf_admin_token');
      localStorage.removeItem('vpf_admin_profile');
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        checkAuth,
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
