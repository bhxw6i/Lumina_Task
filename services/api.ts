import { Task, User, TaskStats } from '../types';

export const BACKEND_URL_KEY = 'lumina_backend_url';

export const getApiUrl = (): string => {
  // 1. Check for manual override saved in localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(BACKEND_URL_KEY);
    if (saved && saved.trim()) {
      const clean = saved.trim().replace(/\/+$/, '');
      return clean.endsWith('/api') ? clean : `${clean}/api`;
    }
  }

  // 2. Check environment variable VITE_API_URL
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (envUrl) {
    const clean = envUrl.replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }

  // 3. Fallback for localhost development
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:5000/api';
  }

  // 4. Default for production fallback
  return 'http://localhost:5000/api';
};

const TOKEN_KEY = 'lumina_auth_token';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  public getBaseUrl(): string {
    return getApiUrl();
  }

  public setBackendUrl(url: string | null) {
    if (typeof window !== 'undefined') {
      if (url && url.trim()) {
        localStorage.setItem(BACKEND_URL_KEY, url.trim());
      } else {
        localStorage.removeItem(BACKEND_URL_KEY);
      }
    }
  }

  public getStoredBackendUrl(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(BACKEND_URL_KEY) : null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    // 60s timeout to allow Render free tier spin-up from cold sleep
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg = data?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      return data as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Connection timed out. The Render backend may be waking up from sleep (~50s). Please retry in a moment.');
      }
      throw err;
    }
  }

  // Health check
  async checkHealth(): Promise<{ isHealthy: boolean; databaseConnected: boolean; message: string; isWakingUp?: boolean }> {
    try {
      const res = await this.request<any>('/health', { method: 'GET' });
      return {
        isHealthy: res.status === 'OK',
        databaseConnected: res.database?.connected ?? false,
        message: 'Server operational',
      };
    } catch (err: any) {
      const isTimeout = err.name === 'AbortError' || err.message?.includes('waking up') || err.message?.includes('timed out');
      return {
        isHealthy: false,
        databaseConnected: false,
        isWakingUp: isTimeout,
        message: err.message || 'Cannot connect to backend',
      };
    }
  }

  // Auth endpoints
  async register(name: string, email: string, pass: string): Promise<{ user: User; token: string }> {
    const data = await this.request<{ success: boolean; user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password: pass }),
    });
    this.setToken(data.token);
    return { user: { ...data.user, token: data.token }, token: data.token };
  }

  async login(email: string, pass: string): Promise<{ user: User; token: string }> {
    const data = await this.request<{ success: boolean; user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });
    this.setToken(data.token);
    return { user: { ...data.user, token: data.token }, token: data.token };
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.getToken()) return null;
    try {
      const data = await this.request<{ success: boolean; user: User }>('/auth/me', {
        method: 'GET',
      });
      return { ...data.user, token: this.getToken() || undefined };
    } catch {
      return null;
    }
  }

  // Task endpoints
  async getTasks(params?: { view?: string; search?: string; priority?: string }): Promise<Task[]> {
    const query = new URLSearchParams();
    if (params?.view) query.append('view', params.view);
    if (params?.search) query.append('search', params.search);
    if (params?.priority) query.append('priority', params.priority);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ success: boolean; tasks: Task[] }>(`/tasks${queryString}`, {
      method: 'GET',
    });
    return res.tasks || [];
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    const res = await this.request<{ success: boolean; task: Task }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    return res.task;
  }

  async updateTask(id: string, taskData: Partial<Task>): Promise<Task> {
    const res = await this.request<{ success: boolean; task: Task }>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
    return res.task;
  }

  async toggleTask(id: string): Promise<Task> {
    const res = await this.request<{ success: boolean; task: Task }>(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    return res.task;
  }

  async deleteTask(id: string): Promise<void> {
    await this.request<{ success: boolean }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async getStats(): Promise<TaskStats | null> {
    try {
      const res = await this.request<{ success: boolean; stats: TaskStats }>('/tasks/stats', {
        method: 'GET',
      });
      return res.stats;
    } catch {
      return null;
    }
  }
}

export const api = new ApiService();
