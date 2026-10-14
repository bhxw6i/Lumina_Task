import React, { useState, useEffect } from 'react';
import { Task, Priority } from '../types';
import { ICONS } from '../constants';

interface TaskModalProps {
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
  initialData?: Task;
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<Priority>(initialData?.priority || Priority.MEDIUM);
  const [category, setCategory] = useState<string>(initialData?.category || 'General');

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), dueDate, priority, category });
  };

  const setRelativeDate = (daysAhead: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysAhead);
    setDueDate(target.toISOString().split('T')[0]);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-lumina-400 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden fade-in border border-lumina-100/60 dark:border-lumina-300/30">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-lumina-300 dark:text-lumina-50">
              {initialData ? 'Edit Task' : 'New Task'}
            </h2>
            <button 
              onClick={onClose} 
              aria-label="Close modal"
              className="p-2 hover:bg-lumina-50 dark:hover:bg-lumina-300/20 text-lumina-200 dark:text-lumina-100 rounded-full transition-colors"
            >
              <ICONS.Plus size={22} className="rotate-45" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <input
                autoFocus
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full text-lg md:text-xl font-semibold bg-transparent border-b-2 border-lumina-100 dark:border-lumina-300 pb-2 text-lumina-500 dark:text-white focus:border-lumina-300 dark:focus:border-lumina-100 focus:outline-none transition-all placeholder:text-lumina-200/50"
              />
            </div>

            {/* Quick Date Presets */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="text-lumina-200 dark:text-lumina-100/70 font-medium">Quick Date:</span>
              <button 
                type="button" 
                onClick={() => setRelativeDate(0)}
                className="px-2.5 py-1 rounded-lg bg-lumina-50 dark:bg-lumina-500 text-lumina-300 dark:text-lumina-100 hover:bg-lumina-100/50 transition-colors"
              >
                Today
              </button>
              <button 
                type="button" 
                onClick={() => setRelativeDate(1)}
                className="px-2.5 py-1 rounded-lg bg-lumina-50 dark:bg-lumina-500 text-lumina-300 dark:text-lumina-100 hover:bg-lumina-100/50 transition-colors"
              >
                Tomorrow
              </button>
              <button 
                type="button" 
                onClick={() => setRelativeDate(7)}
                className="px-2.5 py-1 rounded-lg bg-lumina-50 dark:bg-lumina-500 text-lumina-300 dark:text-lumina-100 hover:bg-lumina-100/50 transition-colors"
              >
                +1 Week
              </button>
            </div>

            {/* Date, Priority, Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-lumina-200 dark:text-lumina-100 uppercase tracking-wider mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-lumina-100 dark:border-lumina-300 bg-white/50 dark:bg-lumina-500/50 text-lumina-500 dark:text-white text-xs focus:ring-2 focus:ring-lumina-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-lumina-200 dark:text-lumina-100 uppercase tracking-wider mb-1.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2.5 rounded-xl border border-lumina-100 dark:border-lumina-300 bg-white dark:bg-lumina-500 text-lumina-500 dark:text-white text-xs focus:ring-2 focus:ring-lumina-200 outline-none"
                >
                  <option value={Priority.LOW}>Low</option>
                  <option value={Priority.MEDIUM}>Medium</option>
                  <option value={Priority.HIGH}>High</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-lumina-200 dark:text-lumina-100 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-lumina-100 dark:border-lumina-300 bg-white dark:bg-lumina-500 text-lumina-500 dark:text-white text-xs focus:ring-2 focus:ring-lumina-200 outline-none"
                >
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Health">Health</option>
                </select>
              </div>
            </div>

            {/* Description Notes */}
            <div>
              <label className="block text-[11px] font-bold text-lumina-200 dark:text-lumina-100 uppercase tracking-wider mb-1.5">
                Notes & Context
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Add details, links, or notes..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-lumina-100 dark:border-lumina-300 bg-white/50 dark:bg-lumina-500/50 text-lumina-500 dark:text-white text-xs focus:ring-2 focus:ring-lumina-200 outline-none resize-none placeholder:text-lumina-100/60"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border border-lumina-100 hover:bg-lumina-50 dark:border-lumina-300 dark:hover:bg-lumina-300/20 font-medium text-xs text-lumina-300 dark:text-lumina-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] px-4 py-3 rounded-xl bg-lumina-300 hover:bg-lumina-400 text-white font-semibold text-xs shadow-lg shadow-lumina-300/25 transform active:scale-95 transition-all"
              >
                {initialData ? 'Update Task' : 'Save Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
