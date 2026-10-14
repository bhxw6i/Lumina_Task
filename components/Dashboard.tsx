import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { User, Task, ViewType, Priority, TaskStats } from '../types';
import { storageService } from '../services/storageService';
import { api } from '../services/api';
import { ICONS, SIDEBAR_ITEMS } from '../constants';
import Sidebar from './Sidebar';
import TaskList from './TaskList';
import TaskCalendar from './TaskCalendar';
import TaskModal from './TaskModal';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, toggleTheme, isDarkMode }) => {
  const [activeView, setActiveView] = useState<ViewType>('inbox');
  const [tasks, setTasks] = useState<Task[]>(() => storageService.getLocalTasks(user.id));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [isWakingUp, setIsWakingUp] = useState<boolean>(false);
  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [showBackendModal, setShowBackendModal] = useState<boolean>(false);
  const [backendUrlInput, setBackendUrlInput] = useState<string>(() => api.getBaseUrl().replace(/\/api$/, ''));
  const [isTestingUrl, setIsTestingUrl] = useState<boolean>(false);
  const [configSuccessMsg, setConfigSuccessMsg] = useState<string>('');

  // Show a temporary toast notification
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // Fetch tasks and check backend status
  const loadTasks = useCallback(async () => {
    setIsSyncing(true);
    try {
      const health = await api.checkHealth();
      setBackendOnline(health.isHealthy);
      setDbConnected(health.databaseConnected);
      setIsWakingUp(!!health.isWakingUp);
      const fetchedTasks = await storageService.getTasks(user.id);
      setTasks(fetchedTasks);
    } catch {
      setBackendOnline(false);
      setTasks(storageService.getLocalTasks(user.id));
    } finally {
      setIsSyncing(false);
    }
  }, [user.id]);

  const handleSaveBackendUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingUrl(true);
    setConfigSuccessMsg('');
    try {
      const clean = backendUrlInput.trim();
      api.setBackendUrl(clean || null);
      const res = await api.checkHealth();
      setBackendOnline(res.isHealthy);
      setDbConnected(res.databaseConnected);
      setIsWakingUp(!!res.isWakingUp);
      if (res.isHealthy) {
        setConfigSuccessMsg('Connected successfully! Syncing tasks...');
        const fetchedTasks = await storageService.getTasks(user.id);
        setTasks(fetchedTasks);
      } else if (res.isWakingUp) {
        setConfigSuccessMsg('Render backend is waking up from sleep. Please wait ~40 seconds.');
      } else {
        setConfigSuccessMsg('Saved URL. Server not reachable yet.');
      }
    } catch (err: any) {
      setConfigSuccessMsg(`Error: ${err.message}`);
    } finally {
      setIsTestingUrl(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Aggregate stats
  const stats: TaskStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const total = tasks.length;
    const completed = tasks.filter(t => t.isCompleted).length;
    const pending = total - completed;
    const highPriority = tasks.filter(t => t.priority === Priority.HIGH && !t.isCompleted).length;
    const dueToday = tasks.filter(t => t.dueDate === today && !t.isCompleted).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, highPriority, dueToday, completionRate };
  }, [tasks]);

  // Filter tasks based on view, category, and search query
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(t => (t.category || 'General') === selectedCategory);
    }

    // View filter
    const today = new Date().toISOString().split('T')[0];
    switch (activeView) {
      case 'today':
        result = result.filter(t => t.dueDate === today);
        break;
      case 'high-priority':
        result = result.filter(t => t.priority === Priority.HIGH);
        break;
      case 'completed':
        result = result.filter(t => t.isCompleted);
        break;
      case 'calendar':
      case 'inbox':
      default:
        break;
    }

    return result.sort((a, b) => b.createdAt - a.createdAt);
  }, [tasks, activeView, searchQuery, selectedCategory]);

  const handleAddTask = async (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: editingTask?.id || `temp_${Date.now()}`,
      userId: user.id,
      title: taskData.title || '',
      description: taskData.description || '',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      priority: taskData.priority || Priority.MEDIUM,
      category: taskData.category || 'General',
      isCompleted: editingTask?.isCompleted || false,
      createdAt: editingTask?.createdAt || Date.now(),
    };

    setIsModalOpen(false);
    setEditingTask(undefined);
    showToast(editingTask ? 'Task updated' : 'Task created');

    const saved = await storageService.saveTask(newTask);
    setTasks(prev => {
      const idx = prev.findIndex(t => t.id === newTask.id || t.id === saved.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast('Task removed');
    await storageService.deleteTask(taskId);
  };

  const toggleComplete = async (task: Task) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t));
    showToast(!task.isCompleted ? 'Task completed! ✨' : 'Task marked active');
    await storageService.toggleComplete(task);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-lumina-50 dark:bg-lumina-500 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-lumina-400 dark:bg-lumina-50 text-white dark:text-lumina-500 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold slide-down border border-lumina-300 dark:border-lumina-200">
          <ICONS.Sparkles size={14} className="text-lumina-100 dark:text-lumina-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={(v) => { setActiveView(v); setIsSidebarOpen(false); }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        taskCounts={{
          inbox: tasks.length,
          today: stats.dueToday,
          highPriority: stats.highPriority,
          completed: stats.completed,
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-lumina-100/70 dark:border-lumina-400/80 bg-white/70 dark:bg-lumina-500/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-lumina-300 dark:text-lumina-50 hover:bg-lumina-100/40 dark:hover:bg-lumina-400/40"
              aria-label="Open menu"
            >
              <ICONS.MoreVertical size={20} />
            </button>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-lumina-300 dark:text-lumina-50 capitalize tracking-tight">
              {SIDEBAR_ITEMS.find(item => item.id === activeView)?.label || 'Dashboard'}
            </h1>
            {isSyncing && (
              <ICONS.Loader2 size={16} className="text-lumina-200 animate-spin ml-2" />
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <ICONS.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lumina-200 dark:text-lumina-100/60" size={16} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border border-lumina-100 dark:border-lumina-400 bg-white/80 dark:bg-lumina-400/70 text-lumina-500 dark:text-white focus:outline-none focus:ring-2 focus:ring-lumina-200 transition-all text-xs w-44 md:w-60"
              />
            </div>

            {/* Backend Connectivity Status Dot */}
            <button
              onClick={() => setShowBackendModal(true)}
              title="Click to check backend status or configure URL"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-lumina-100 dark:border-lumina-400 bg-white/60 dark:bg-lumina-400/50 text-[11px] font-medium text-lumina-200 dark:text-lumina-100 hover:scale-105 transition-all cursor-pointer"
            >
              {backendOnline === true ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Cloud Sync</span>
                </>
              ) : isWakingUp ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Waking Up (~40s)...</span>
                </>
              ) : backendOnline === false ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Local Mode</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
                  <span>Connecting...</span>
                </>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-lumina-100/50 dark:hover:bg-lumina-400 transition-colors text-lumina-300 dark:text-lumina-50"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <ICONS.Sun size={18} /> : <ICONS.Moon size={18} />}
            </button>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-lumina-100 dark:border-lumina-400">
              <div className="hidden md:block text-right">
                <p className="text-xs font-semibold text-lumina-500 dark:text-lumina-50 truncate max-w-[120px]">
                  {user.displayName}
                </p>
                <button 
                  onClick={onLogout} 
                  className="text-[11px] text-lumina-200 hover:text-rose-500 dark:text-lumina-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
              <div 
                title={user.displayName}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-lumina-300 to-lumina-200 text-white font-bold text-sm flex items-center justify-center shadow-md cursor-pointer select-none"
              >
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* Quick Productivity Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white/80 dark:bg-lumina-400/60 border border-lumina-100/70 dark:border-lumina-300/20 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between text-lumina-200 dark:text-lumina-100 text-xs font-medium mb-1">
                  <span>Total Tasks</span>
                  <ICONS.Inbox size={16} />
                </div>
                <div className="text-2xl font-bold font-serif text-lumina-300 dark:text-lumina-50">
                  {stats.total}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-lumina-400/60 border border-lumina-100/70 dark:border-lumina-300/20 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between text-lumina-200 dark:text-lumina-100 text-xs font-medium mb-1">
                  <span>Completed</span>
                  <ICONS.CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                <div className="text-2xl font-bold font-serif text-lumina-300 dark:text-lumina-50 flex items-baseline gap-2">
                  <span>{stats.completed}</span>
                  <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">
                    ({stats.completionRate}%)
                  </span>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-lumina-400/60 border border-lumina-100/70 dark:border-lumina-300/20 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between text-lumina-200 dark:text-lumina-100 text-xs font-medium mb-1">
                  <span>Due Today</span>
                  <ICONS.Clock size={16} className="text-amber-500" />
                </div>
                <div className="text-2xl font-bold font-serif text-lumina-300 dark:text-lumina-50">
                  {stats.dueToday}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-lumina-400/60 border border-lumina-100/70 dark:border-lumina-300/20 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between text-lumina-200 dark:text-lumina-100 text-xs font-medium mb-1">
                  <span>High Priority</span>
                  <ICONS.Star size={16} className="text-rose-500" />
                </div>
                <div className="text-2xl font-bold font-serif text-lumina-300 dark:text-lumina-50">
                  {stats.highPriority}
                </div>
              </div>
            </div>

            {/* Category Filter Pills (shown in list views) */}
            {activeView !== 'calendar' && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs">
                {['All', 'Work', 'Personal', 'Study', 'Health', 'General'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-lumina-300 text-white shadow-sm'
                        : 'bg-white/80 dark:bg-lumina-400/60 text-lumina-200 dark:text-lumina-100 hover:bg-lumina-100/50 border border-lumina-100/60 dark:border-lumina-400/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Main Views */}
            {activeView === 'calendar' ? (
              <TaskCalendar 
                tasks={tasks} 
                onEditTask={handleEdit} 
                onDeleteTask={handleDeleteTask}
                toggleComplete={toggleComplete}
              />
            ) : (
              <TaskList 
                tasks={filteredTasks} 
                onEditTask={handleEdit} 
                onDeleteTask={handleDeleteTask}
                onToggleComplete={toggleComplete}
              />
            )}
          </div>
        </div>

        {/* Floating Add Task Button */}
        <button 
          onClick={() => { setEditingTask(undefined); setIsModalOpen(true); }}
          aria-label="Create new task"
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-tr from-lumina-300 to-lumina-200 hover:from-lumina-400 hover:to-lumina-300 text-white rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all z-30 group"
        >
          <ICONS.Plus size={30} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </main>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddTask}
          initialData={editingTask}
        />
      )}

      {/* Backend Configuration Modal */}
      {showBackendModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-lumina-400 w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-lumina-100 dark:border-lumina-300/30 fade-in text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔌</span>
                <h3 className="text-lg font-serif font-bold text-lumina-300 dark:text-lumina-50">
                  Backend API Connection
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setShowBackendModal(false); setConfigSuccessMsg(''); }}
                className="p-1 rounded-full text-lumina-200 hover:text-lumina-300 dark:text-lumina-100"
              >
                <ICONS.Plus size={20} className="rotate-45" />
              </button>
            </div>

            <div className="text-xs text-lumina-200 dark:text-lumina-100/80 mb-4 space-y-1 bg-lumina-50/70 dark:bg-lumina-500/40 p-3 rounded-2xl border border-lumina-100/60 dark:border-lumina-300/20">
              <div className="flex justify-between">
                <span className="font-semibold">Active API Endpoint:</span>
                <span className="font-mono text-[11px] truncate max-w-[200px]" title={api.getBaseUrl()}>
                  {api.getBaseUrl()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Backend Status:</span>
                <span>{backendOnline ? '✅ Online' : isWakingUp ? '⏳ Waking Up (~40s)' : '⚠️ Offline / Local Mode'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Database:</span>
                <span>{dbConnected ? '✅ Connected' : '❌ Disconnected'}</span>
              </div>
            </div>

            <form onSubmit={handleSaveBackendUrl} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-lumina-300 dark:text-lumina-100 uppercase tracking-wider mb-1">
                  Render Backend URL
                </label>
                <input
                  type="url"
                  placeholder="https://lumina-task-backend.onrender.com"
                  value={backendUrlInput}
                  onChange={(e) => setBackendUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-lumina-100 dark:border-lumina-300 bg-white/70 dark:bg-lumina-500/50 text-lumina-500 dark:text-white text-xs focus:ring-2 focus:ring-lumina-200 outline-none font-mono"
                />
                <p className="text-[10px] text-lumina-200/70 dark:text-lumina-100/60 mt-1">
                  If hosted on Render, paste your web service URL here.
                </p>
              </div>

              {configSuccessMsg && (
                <div className={`p-2.5 rounded-xl text-xs text-center font-medium ${
                  configSuccessMsg.includes('success') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200'
                }`}>
                  {configSuccessMsg}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setBackendUrlInput('');
                    api.setBackendUrl(null);
                    loadTasks();
                    setConfigSuccessMsg('Reset to default URL');
                  }}
                  className="px-3 py-2 rounded-xl border border-lumina-100 hover:bg-lumina-50 dark:border-lumina-300 text-xs font-medium text-lumina-200 dark:text-lumina-100 transition-all"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isTestingUrl}
                  className="flex-1 px-4 py-2 rounded-xl bg-lumina-300 hover:bg-lumina-400 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isTestingUrl ? (
                    <>
                      <ICONS.Loader2 size={14} className="animate-spin" />
                      <span>Connecting (~10-40s)...</span>
                    </>
                  ) : (
                    <span>Save & Sync</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
