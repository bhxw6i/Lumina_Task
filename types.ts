export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  isCompleted: boolean;
  category?: string;
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  token?: string;
}

export type ViewType = 'inbox' | 'today' | 'calendar' | 'high-priority' | 'completed';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
  dueToday: number;
  completionRate: number;
}

export type BackendStatus = 'connected' | 'waking_up' | 'local_mode' | 'error';
