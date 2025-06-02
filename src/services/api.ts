import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Importante para CORS
});

// Log de requisições para debug
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Requisição:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
    });
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Log de respostas para debug
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ Erro na resposta:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Melhor mensagem de erro para o usuário
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080');
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw error;
  }
);

export default api;
