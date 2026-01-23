
import { Task, User } from '../types';

const TASKS_KEY = 'lumina_tasks';
const USERS_KEY = 'lumina_users';
const CURRENT_USER_KEY = 'lumina_current_user';

export const storageService = {
  getTasks: (userId: string): Task[] => {
    const data = localStorage.getItem(TASKS_KEY);
    if (!data) return [];
    const allTasks: Task[] = JSON.parse(data);
    return allTasks.filter(t => t.userId === userId);
  },

  saveTask: (task: Task) => {
    const data = localStorage.getItem(TASKS_KEY);
    const allTasks: Task[] = data ? JSON.parse(data) : [];
    const index = allTasks.findIndex(t => t.id === task.id);
    
    if (index !== -1) {
      allTasks[index] = task;
    } else {
      allTasks.push(task);
    }
    localStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
  },

  deleteTask: (taskId: string) => {
    const data = localStorage.getItem(TASKS_KEY);
    if (!data) return;
    const allTasks: Task[] = JSON.parse(data);
    const filtered = allTasks.filter(t => t.id !== taskId);
    localStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  registerUser: (email: string, pass: string, name: string): User => {
    const data = localStorage.getItem(USERS_KEY);
    const users = data ? JSON.parse(data) : [];
    const newUser = { id: Date.now().toString(), email, displayName: name };
    users.push({ ...newUser, password: btoa(pass) }); // Simple mock hash
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  loginUser: (email: string, pass: string): User | null => {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) return null;
    const users = JSON.parse(data);
    const user = users.find((u: any) => u.email === email && u.password === btoa(pass));
    if (user) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }
};
