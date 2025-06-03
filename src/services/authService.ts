import api from './api';
import { teamService } from './teamService'; // Import teamService
import { Member } from '@/types/Member'; // Importando Member do arquivo de tipos

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  teamId: number;
  role: string;
  // Role, isAdmin e TeamId não são mais fornecidos pelo usuário no frontend
}

export interface AuthResponse {
  token: string;
  user: Member;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Primeiro, vamos buscar o membro pelo email
    const response = await api.get('/api/members');
    const members: Member[] = response.data;
    console.log('Membros encontrados:', members);
    
    // Encontrar o membro pelo email
    const member = members.find((m) => m.email === credentials.email);
    console.log('Membro encontrado:', member);
    
    if (!member) {
      throw new Error('Usuário não encontrado');
    }
    
    // Em um ambiente real, a senha seria verificada no backend
    // Aqui estamos apenas simulando a autenticação
    if (member.password !== credentials.password) { // Note: Comparing plain text passwords is not secure in production
      throw new Error('Senha incorreta');
    }
    
    // Agora, buscamos todos os times para encontrar o teamId do membro
    let memberTeamId: number | undefined;
    try {
      const teams = await teamService.getAll();
      console.log('Times encontrados:', teams);
      const memberTeam = teams.find(team => team.members?.some(m => m.value === member.memberId));
      console.log('Time do membro encontrado:', memberTeam);
      if (memberTeam) {
        memberTeamId = memberTeam.id?.value;
        console.log('TeamId do membro:', memberTeamId);
      }
    } catch (error) {
      console.error('Error fetching teams in login:', error);
      // Continue login even if fetching teams fails, but memberTeamId will be undefined
    }

    // Criar um token JWT simulado
    const token = btoa(JSON.stringify({ id: member.memberId, email: member.email }));
    
    // Ensure teamId is included in the user object before storing
    const userToStore: Member = {
      ...member,
      teamId: memberTeamId
    };
    console.log('Usuário a ser armazenado:', userToStore);

    return {
      token,
      user: userToStore
    };
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      // Dados para enviar ao backend, apenas com os campos esperados
      const dataToSend = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        teamId: userData.teamId,
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
  },

  setCurrentUser: (user: Member): void => {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export default authService;
