
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
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export type ViewType = 'inbox' | 'today' | 'calendar' | 'high-priority' | 'completed';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
