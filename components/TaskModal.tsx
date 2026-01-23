
import React, { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description, dueDate, priority });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-lumina-400 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden fade-in">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold">
              {initialData ? 'Edit Task' : 'New Task'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-lumina-50 dark:hover:bg-lumina-300/20 rounded-full transition-colors">
              <ICONS.Plus size={24} className="rotate-45" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full text-xl font-semibold bg-transparent border-b-2 border-lumina-50 dark:border-lumina-300 pb-2 focus:border-lumina-300 dark:focus:border-lumina-100 focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-lumina-200 uppercase tracking-widest mb-2">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-lumina-50 dark:border-lumina-300 bg-transparent text-sm focus:ring-2 focus:ring-lumina-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-lumina-200 uppercase tracking-widest mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-4 py-3 rounded-xl border border-lumina-50 dark:border-lumina-300 bg-transparent text-sm focus:ring-2 focus:ring-lumina-100 focus:outline-none appearance-none"
                >
                  <option value={Priority.LOW}>Low Priority</option>
                  <option value={Priority.MEDIUM}>Medium Priority</option>
                  <option value={Priority.HIGH}>High Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-lumina-200 uppercase tracking-widest mb-2">Notes & Details</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Add more context here..."
                className="w-full px-4 py-3 rounded-xl border border-lumina-50 dark:border-lumina-300 bg-transparent text-sm focus:ring-2 focus:ring-lumina-100 focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-xl border border-lumina-100 hover:bg-lumina-50 dark:border-lumina-300 dark:hover:bg-lumina-300/20 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] px-6 py-4 rounded-xl bg-lumina-300 hover:bg-lumina-400 text-white font-bold shadow-lg shadow-lumina-300/30 transform active:scale-95 transition-all"
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
