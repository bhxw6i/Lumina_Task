
import React, { useState, useMemo, useEffect } from 'react';
import { User, Task, ViewType, Priority } from '../types';
import { storageService } from '../services/storageService';
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    setTasks(storageService.getTasks(user.id));
  }, [user.id]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    
    // Search filter
    if (searchQuery) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
        // No additional filtering for inbox
        break;
    }

    return result.sort((a, b) => b.createdAt - a.createdAt);
  }, [tasks, activeView, searchQuery]);

  const handleAddTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: editingTask?.id || Date.now().toString(),
      userId: user.id,
      title: taskData.title || '',
      description: taskData.description || '',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      priority: taskData.priority || Priority.MEDIUM,
      isCompleted: editingTask?.isCompleted || false,
      createdAt: editingTask?.createdAt || Date.now(),
    };
    storageService.saveTask(newTask);
    setTasks(storageService.getTasks(user.id));
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const handleDeleteTask = (taskId: string) => {
    storageService.deleteTask(taskId);
    setTasks(storageService.getTasks(user.id));
  };

  const toggleComplete = (task: Task) => {
    const updated = { ...task, isCompleted: !task.isCompleted };
    storageService.saveTask(updated);
    setTasks(storageService.getTasks(user.id));
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-lumina-50 dark:bg-lumina-500">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={(v) => { setActiveView(v); setIsSidebarOpen(false); }} 
        isOpen={isSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-lumina-100 dark:border-lumina-400">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-lumina-300 dark:text-lumina-50"
            >
              <ICONS.MoreVertical />
            </button>
            <h1 className="text-xl font-bold md:text-2xl text-lumina-300 dark:text-lumina-50 capitalize">
              {SIDEBAR_ITEMS.find(item => item.id === activeView)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden sm:block">
              <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lumina-200" size={18} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border border-lumina-100 dark:border-lumina-400 bg-white dark:bg-lumina-400 focus:outline-none focus:ring-2 focus:ring-lumina-200 transition-all text-sm w-48 md:w-64"
              />
            </div>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-lumina-100 dark:hover:bg-lumina-400 transition-colors"
            >
              {isDarkMode ? <ICONS.Sun size={20} /> : <ICONS.Moon size={20} />}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-lumina-100 dark:border-lumina-400">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold">{user.displayName}</p>
                <button onClick={onLogout} className="text-xs text-lumina-200 hover:text-lumina-300">Sign Out</button>
              </div>
              <div className="w-10 h-10 rounded-full bg-lumina-200 flex items-center justify-center text-white font-bold">
                {user.displayName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
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

        {/* Floating Add Button */}
        <button 
          onClick={() => { setEditingTask(undefined); setIsModalOpen(true); }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-lumina-300 hover:bg-lumina-400 text-white rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 active:scale-90 transition-all z-30"
        >
          <ICONS.Plus size={32} />
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
    </div>
  );
};

export default Dashboard;
