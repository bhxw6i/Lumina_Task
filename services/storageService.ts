import { Task, User } from '../types';
import { api } from './api';

const TASKS_KEY = 'lumina_tasks';
const USERS_KEY = 'lumina_users';
const CURRENT_USER_KEY = 'lumina_current_user';

export const storageService = {
  // Sync fallback methods for initial render
  getLocalTasks: (userId: string): Task[] => {
    try {
      const data = localStorage.getItem(TASKS_KEY);
      if (!data) return [];
      const allTasks: Task[] = JSON.parse(data);
      return allTasks.filter(t => t.userId === userId);
    } catch {
      return [];
    }
  },

  setLocalTasks: (tasks: Task[]) => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save tasks to localStorage', e);
    }
  },

  // Asynchronous task fetching with API first, fallback to localStorage
  getTasks: async (userId: string): Promise<Task[]> => {
    try {
      const serverTasks = await api.getTasks();
      // Sync local cache
      const local = storageService.getLocalTasks(userId);
      const otherUserTasks = (localStorage.getItem(TASKS_KEY) ? JSON.parse(localStorage.getItem(TASKS_KEY)!) : [])
        .filter((t: Task) => t.userId !== userId);
      localStorage.setItem(TASKS_KEY, JSON.stringify([...otherUserTasks, ...serverTasks]));
      return serverTasks;
    } catch (err) {
      console.warn('API getTasks failed, using local fallback:', err);
      return storageService.getLocalTasks(userId);
    }
  },

  saveTask: async (task: Task): Promise<Task> => {
    // Optimistically update local cache
    const data = localStorage.getItem(TASKS_KEY);
    const allTasks: Task[] = data ? JSON.parse(data) : [];
    const index = allTasks.findIndex(t => t.id === task.id);
    
    if (index !== -1) {
      allTasks[index] = task;
    } else {
      allTasks.push(task);
    }
    localStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));

    // Try backend API if task has a valid mongo ID or needs creation
    try {
      if (task.id && task.id.length === 24 && !task.id.startsWith('temp_')) {
        return await api.updateTask(task.id, task);
      } else {
        const created = await api.createTask({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          category: task.category,
        });
        // Replace temp task with created task in local cache
        const updatedTasks = allTasks.filter(t => t.id !== task.id);
        updatedTasks.push(created);
        localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
        return created;
      }
    } catch (err) {
      console.warn('Backend saveTask failed, saved locally:', err);
      return task;
    }
  },

  deleteTask: async (taskId: string): Promise<void> => {
    // Update local storage
    const data = localStorage.getItem(TASKS_KEY);
    if (data) {
      const allTasks: Task[] = JSON.parse(data);
      const filtered = allTasks.filter(t => t.id !== taskId);
      localStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
    }

    try {
      await api.deleteTask(taskId);
    } catch (err) {
      console.warn('Backend deleteTask failed, removed locally:', err);
    }
  },

  toggleComplete: async (task: Task): Promise<Task> => {
    const updated: Task = { ...task, isCompleted: !task.isCompleted };
    
    // Update local cache
    const data = localStorage.getItem(TASKS_KEY);
    if (data) {
      const allTasks: Task[] = JSON.parse(data);
      const idx = allTasks.findIndex(t => t.id === task.id);
      if (idx !== -1) {
        allTasks[idx] = updated;
        localStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
      }
    }

    try {
      if (task.id && task.id.length === 24) {
        return await api.toggleTask(task.id);
      }
    } catch (err) {
      console.warn('Backend toggleTask failed, updated locally:', err);
    }

    return updated;
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      if (user.token) {
        api.setToken(user.token);
      }
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
      api.setToken(null);
    }
  },

  registerUser: async (email: string, pass: string, name: string): Promise<User> => {
    try {
      // Try backend first
      const { user, token } = await api.register(name, email, pass);
      const fullUser = { ...user, token };
      storageService.setCurrentUser(fullUser);
      return fullUser;
    } catch (err: any) {
      console.warn('Backend registration failed, fallback to local storage:', err.message);
      
      // If error is specific (like "An account with this email already exists"), re-throw it
      if (err.message && (err.message.includes('already exists') || err.message.includes('at least 6 characters'))) {
        throw err;
      }

      // Offline / LocalStorage fallback
      const data = localStorage.getItem(USERS_KEY);
      const users = data ? JSON.parse(data) : [];
      if (users.some((u: any) => u.email === email)) {
        throw new Error('An account with this email already exists');
      }

      const newUser: User = { id: `local_${Date.now()}`, email, displayName: name };
      users.push({ ...newUser, password: btoa(pass) });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      storageService.setCurrentUser(newUser);
      return newUser;
    }
  },

  loginUser: async (email: string, pass: string): Promise<User> => {
    try {
      // Try backend first
      const { user, token } = await api.login(email, pass);
      const fullUser = { ...user, token };
      storageService.setCurrentUser(fullUser);
      return fullUser;
    } catch (err: any) {
      console.warn('Backend login failed, checking local credentials:', err.message);

      if (err.message && err.message.includes('Invalid email or password')) {
        throw err;
      }

      // Offline / LocalStorage fallback
      const data = localStorage.getItem(USERS_KEY);
      if (!data) throw new Error('Invalid email or password');
      const users = JSON.parse(data);
      const user = users.find((u: any) => u.email === email && u.password === btoa(pass));
      if (user) {
        const { password, ...safeUser } = user;
        storageService.setCurrentUser(safeUser);
        return safeUser;
      }
      throw new Error('Invalid email or password');
    }
  },

  checkBackendStatus: async () => {
    return api.checkHealth();
  }
};
