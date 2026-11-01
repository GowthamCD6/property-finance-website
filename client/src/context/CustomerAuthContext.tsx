import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CustomerUser, Enquiry } from '../types';
import {
  loginUserWithGoogleApi,
  loginCustomerDirectApi,
  getCustomerProfileApi,
  getCustomerEnquiriesApi,
  logoutUserApi,
} from '../services/api';

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  enquiries: Enquiry[];
  loginWithGoogle: (credential: string) => Promise<CustomerUser>;
  loginDirect: (identifier: string) => Promise<CustomerUser>;
  setAuthenticatedCustomer: (customer: CustomerUser, token?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshEnquiries: () => Promise<Enquiry[]>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('vpf_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchEnquiries = useCallback(async () => {
    try {
      const list = await getCustomerEnquiriesApi();
      setEnquiries(list);
      return list;
    } catch {
      return [];
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('vpf_user_token');
    if (!token) {
      setCustomer(null);
      setEnquiries([]);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await getCustomerProfileApi();
      setCustomer(profile);
      localStorage.setItem('vpf_user_profile', JSON.stringify(profile));
      await fetchEnquiries();
    } catch (err: any) {
      // Only clear if server explicitly returns 401 or not found
      if (
        err?.message &&
        (err.message.includes('401') ||
          err.message.toLowerCase().includes('not found') ||
          err.message.toLowerCase().includes('authentication required'))
      ) {
        localStorage.removeItem('vpf_user_token');
        localStorage.removeItem('vpf_user_profile');
        setCustomer(null);
        setEnquiries([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchEnquiries]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginWithGoogle = async (credential: string): Promise<CustomerUser> => {
    setIsLoading(true);
    try {
      const data = await loginUserWithGoogleApi(credential);
      localStorage.setItem('vpf_user_token', data.token);
      localStorage.setItem('vpf_user_profile', JSON.stringify(data.customer));
      setCustomer(data.customer);
      await fetchEnquiries();
      return data.customer;
    } finally {
      setIsLoading(false);
    }
  };

  const loginDirect = async (identifier: string): Promise<CustomerUser> => {
    setIsLoading(true);
    try {
      const data = await loginCustomerDirectApi(identifier);
      localStorage.setItem('vpf_user_token', data.token);
      localStorage.setItem('vpf_user_profile', JSON.stringify(data.customer));
      setCustomer(data.customer);
      await fetchEnquiries();
      return data.customer;
    } finally {
      setIsLoading(false);
    }
  };

  const setAuthenticatedCustomer = async (cust: CustomerUser, token?: string) => {
    if (token) {
      localStorage.setItem('vpf_user_token', token);
    }
    localStorage.setItem('vpf_user_profile', JSON.stringify(cust));
    setCustomer(cust);
    await fetchEnquiries();
  };

  const logout = async () => {
    try {
      await logoutUserApi();
    } finally {
      localStorage.removeItem('vpf_user_token');
      localStorage.removeItem('vpf_user_profile');
      setCustomer(null);
      setEnquiries([]);
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        isLoading,
        enquiries,
        loginWithGoogle,
        loginDirect,
        setAuthenticatedCustomer,
        logout,
        refreshEnquiries: fetchEnquiries,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}

