import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { loginAdminApi, loginAdminWithGoogleApi, logoutAdminApi, getAdminProfileApi } from '../services/api';

interface AuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('vpf_admin_token');
    if (!token) {
      setAdmin(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await getAdminProfileApi();
      setAdmin(profile);
    } catch {
      localStorage.removeItem('vpf_admin_token');
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await loginAdminApi(email, pass);
      localStorage.setItem('vpf_admin_token', data.token);
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
