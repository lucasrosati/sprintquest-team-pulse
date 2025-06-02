import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  // Role, isAdmin e TeamId não são mais fornecidos pelo usuário no frontend
}

export interface Member {
  memberId: number;
  name: string;
  email: string;
  role: string;
  individual_score: number; // Corrigido para individual_score
  is_admin: boolean; // Corrigido para is_admin
  unlockedRewardIds: number[];
  receivedFeedbacks: {
    id: number;
    message: string;
    date: string;
    givenBy: number;
    relatedTaskId: number;
  }[];
}

export interface AuthResponse {
  token: string;
  user: Member;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Primeiro, vamos buscar o membro pelo email
    const response = await api.get('/api/members');
    const members = response.data;
    
    // Encontrar o membro pelo email
    const member = members.find((m: Member) => m.email === credentials.email);
    
    if (!member) {
      throw new Error('Usuário não encontrado');
    }
    
    // Em um ambiente real, a senha seria verificada no backend
    // Aqui estamos apenas simulando a autenticação
    if (member.password !== credentials.password) {
      throw new Error('Senha incorreta');
    }
    
    // Criar um token JWT simulado
    const token = btoa(JSON.stringify({ id: member.memberId, email: member.email }));
    
    return {
      token,
      user: member
    };
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      // Dados para enviar ao backend, com valores padrão para role e is_admin
      const dataToSend = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'DEV', // Padrão 'DEV'
        is_admin: false, // Padrão false
        individual_score: 0, // Padrão 0
        // teamId não é enviado pelo frontend nesta versão simplificada
      };

      // Criar novo membro
      const response = await api.post('/api/members', dataToSend);
      const newMember = response.data;
      
      // Criar token JWT simulado
      const token = btoa(JSON.stringify({ id: newMember.memberId, email: newMember.email }));
      
      return {
        token,
        user: newMember
      };
    } catch (error: unknown) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao criar conta. Tente novamente.');
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: (): Member | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  }
};

export default authService;
