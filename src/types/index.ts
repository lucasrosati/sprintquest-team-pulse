
// User related types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  points?: number;
  badges?: Badge[];
  level?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  dateEarned: Date;
}

// Project related types
export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: 'planning' | 'active' | 'completed' | 'archived';
  members: User[];
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  points: number;
  assignedTo?: User;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication related types
export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
