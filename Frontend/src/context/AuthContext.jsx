import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { disconnectSocket } from '../services/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bus_token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('bus_token');
    setToken(null);
    setUser(null);
    disconnectSocket();
  }, []);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem('bus_token')) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await api.get('/auth/me');
      setUser(response.user || response.data || null);
      return response.user || response.data || null;
    } catch (error) {
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (payload) => {
    const response = await api.post('/auth/login', payload);
    const nextToken = response.token;
    const nextUser = response.user;

    localStorage.setItem('bus_token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setLoading(false);

    return response;
  }, []);

  const register = useCallback(async (payload) => {
    const response = await api.post('/auth/register', payload);
    const nextToken = response.token;
    const nextUser = response.user;

    localStorage.setItem('bus_token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setLoading(false);

    return response;
  }, []);

  const hasRole = useCallback((role) => user?.role === role, [user]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      refreshUser,
      hasRole,
      isAuthenticated: Boolean(token && user),
    }),
    [user, token, loading, login, register, logout, refreshUser, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};

export default AuthContext;
