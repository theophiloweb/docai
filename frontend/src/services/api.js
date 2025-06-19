/**
 * Configuração do cliente Axios para comunicação com a API
 * 
 * Este módulo configura o cliente Axios com interceptors para
 * adicionar tokens de autenticação e tratar erros.
 * 
 * @author Doc.AI Team
 */

import axios from 'axios';

// Função para determinar o tipo de usuário com base na URL
const getUserType = () => {
  const path = window.location.pathname;
  return path.startsWith('/admin') ? 'admin' : 'client';
};

// Criar instância do Axios com configurações base
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 60000 // 60 segundos
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    // Determinar o tipo de usuário com base na URL ou no cabeçalho já definido
    const userType = config.headers['X-User-Type'] || getUserType();
    
    // Usar o token específico para o tipo de usuário
    const tokenKey = `token_${userType}`;
    const token = localStorage.getItem(tokenKey);
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['X-User-Type'] = userType;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Capturar erros de rede
    if (!error.response) {
      console.error('Erro de rede:', error);
      return Promise.reject({
        message: 'Erro de conexão. Verifique sua internet e tente novamente.'
      });
    }
    
    // Capturar erros de API
    const { status, data } = error.response;
    
    // Tratar erros específicos
    switch (status) {
      case 401:
        // Não tratar aqui, deixar para o AuthContext
        break;
      case 403:
        console.error('Acesso negado:', data);
        break;
      case 404:
        console.error('Recurso não encontrado:', data);
        break;
      case 422:
        console.error('Erro de validação:', data);
        break;
      case 429:
        console.error('Muitas requisições:', data);
        break;
      case 500:
        console.error('Erro interno do servidor:', data);
        break;
      default:
        console.error(`Erro ${status}:`, data);
    }
    
    // Formatar mensagem de erro
    let errorMessage = data?.message || 'Ocorreu um erro inesperado';
    
    // Se houver erros de validação, formatar mensagens
    if (data?.errors && Array.isArray(data.errors)) {
      const validationErrors = data.errors.map(err => err.msg || err.message).join(', ');
      errorMessage = `${errorMessage}: ${validationErrors}`;
    }
    
    // Retornar erro formatado
    return Promise.reject({
      status,
      message: errorMessage,
      errors: data?.errors || [],
      originalError: error
    });
  }
);

export default api;
