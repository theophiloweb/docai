import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import jwt_decode from 'jwt-decode';

// Criar contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Função para determinar o tipo de usuário com base na URL
const getUserType = () => {
  const path = window.location.pathname;
  return path.startsWith('/admin') ? 'admin' : 'client';
};

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  // Determinar o tipo de usuário atual
  const userType = getUserType();
  
  // Chaves de armazenamento específicas para cada tipo de usuário
  const tokenKey = `token_${userType}`;
  const refreshTokenKey = `refreshToken_${userType}`;
  const userDataKey = `userData_${userType}`;
  
  // Estados
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(tokenKey));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem(refreshTokenKey));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // Função para verificar se o token está expirado
  const isTokenExpired = (token) => {
    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // Função para atualizar o token
  const refreshTokenFn = useCallback(async () => {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken }, {
        headers: { 'X-User-Type': userType }
      });
      const newToken = response.data.data.token;
      const newRefreshToken = response.data.data.refreshToken;
      
      localStorage.setItem(tokenKey, newToken);
      localStorage.setItem(refreshTokenKey, newRefreshToken);
      
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      
      return newToken;
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      throw error;
    }
  }, [refreshToken, userType, tokenKey, refreshTokenKey]);

  // Função para fazer logout
  const logout = useCallback(() => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshTokenKey);
    localStorage.removeItem(userDataKey);
    
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Não limpar o cabeçalho global, pois pode afetar outras sessões
  }, [tokenKey, refreshTokenKey, userDataKey]);

  // Configurar interceptor para atualizar token automaticamente
  useEffect(() => {
    const setupInterceptors = () => {
      const interceptorId = api.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          
          // Se o erro for 401 (Não autorizado) e não for uma tentativa de refresh
          if (error.response?.status === 401 && !originalRequest._retry && token) {
            originalRequest._retry = true;
            
            try {
              const newToken = await refreshTokenFn();
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              originalRequest.headers['X-User-Type'] = userType;
              return api(originalRequest);
            } catch (refreshError) {
              return Promise.reject(refreshError);
            }
          }
          
          return Promise.reject(error);
        }
      );
      
      // Limpar interceptor quando o componente for desmontado
      return () => {
        api.interceptors.response.eject(interceptorId);
      };
    };
    
    return setupInterceptors();
  }, [token, refreshToken, refreshTokenFn, userType]);

  // Carregar usuário a partir do token
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      // Verificar se o token está expirado
      if (isTokenExpired(token)) {
        try {
          // Tentar atualizar o token
          await refreshTokenFn();
        } catch (error) {
          // Se falhar, fazer logout
          logout();
          setLoading(false);
          return;
        }
      }
      
      try {
        // Tentar carregar do localStorage primeiro para resposta mais rápida
        const storedUserData = localStorage.getItem(userDataKey);
        if (storedUserData) {
          setUser(JSON.parse(storedUserData));
        }
        
        // Buscar dados do usuário atualizados
        const response = await api.get('/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-User-Type': userType
          }
        });
        const userData = response.data.data.user;
        
        // Atualizar localStorage e estado
        localStorage.setItem(userDataKey, JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [token, refreshTokenFn, logout, userType, userDataKey]);

  // Atualizar estado de autenticação quando o token mudar
  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  // Função para fazer login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password }, {
        headers: { 'X-User-Type': userType }
      });
      
      const { token, refreshToken, user } = response.data.data;
      
      localStorage.setItem(tokenKey, token);
      localStorage.setItem(refreshTokenKey, refreshToken);
      localStorage.setItem(userDataKey, JSON.stringify(user));
      
      setToken(token);
      setRefreshToken(refreshToken);
      setUser(user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  // Função para registrar usuário
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData, {
        headers: { 'X-User-Type': userType }
      });
      
      const { token, refreshToken, user } = response.data.data;
      
      localStorage.setItem(tokenKey, token);
      localStorage.setItem(refreshTokenKey, refreshToken);
      localStorage.setItem(userDataKey, JSON.stringify(user));
      
      setToken(token);
      setRefreshToken(refreshToken);
      setUser(user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return false;
    }
  };

  // Função para solicitar redefinição de senha
  const forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot-password', { email });
      return true;
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      return false;
    }
  };

  // Função para redefinir senha
  const resetPassword = async (token, password) => {
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      return true;
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return false;
    }
  };

  // Função para atualizar perfil
  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/profile', userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-Type': userType
        }
      });
      const updatedUser = response.data.data.user;
      
      localStorage.setItem(userDataKey, JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    }
  };

  // Função para atualizar senha
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/profile/password', 
        { currentPassword, newPassword },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-User-Type': userType
          }
        }
      );
      return true;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      return false;
    }
  };

  // Valores do contexto
  const value = {
    user,
    token,
    refreshToken,
    loading,
    isAuthenticated,
    userType,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    updateProfile,
    updatePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
