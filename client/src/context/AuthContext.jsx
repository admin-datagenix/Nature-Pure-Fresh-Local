import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { notifyInfo } from '../utils/notify';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.getCurrentUser();
      setUser(res.data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    try {
      const res = await api.login({ email, password });
      setUser(res.data);
      return res;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const sendLoginOtp = useCallback(async (mobile) => {
    setAuthLoading(true);
    try {
      return await api.sendLoginOtp({ mobile });
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const resendLoginOtp = useCallback(async (mobile) => {
    setAuthLoading(true);
    try {
      return await api.resendLoginOtp({ mobile });
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const verifyLoginOtp = useCallback(async (mobile, otp) => {
    setAuthLoading(true);
    try {
      const res = await api.verifyLoginOtp({ mobile, otp });
      setUser(res.data);
      return res;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const sendRegistrationOtp = useCallback(async (payload) => {
    setAuthLoading(true);
    try {
      return await api.sendRegistrationOtp(payload);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const resendRegistrationOtp = useCallback(async (mobile) => {
    setAuthLoading(true);
    try {
      return await api.resendRegistrationOtp({ mobile });
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const verifyRegistrationOtp = useCallback(async (mobile, otp) => {
    setAuthLoading(true);
    try {
      const res = await api.verifyRegistrationOtp({ mobile, otp });
      setUser(res.data);
      return res;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthLoading(true);
    try {
      await api.logout();
      setUser(null);
      notifyInfo('Signed out');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const sendPasswordReset = useCallback(async (payload) => {
    setAuthLoading(true);
    try {
      return await api.sendPasswordReset(payload);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (payload) => {
    setAuthLoading(true);
    try {
      return await api.resetPassword(payload);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authLoading,
        isAuthenticated: !!user,
        login,
        sendLoginOtp,
        resendLoginOtp,
        verifyLoginOtp,
        sendRegistrationOtp,
        resendRegistrationOtp,
        verifyRegistrationOtp,
        sendPasswordReset,
        resetPassword,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
