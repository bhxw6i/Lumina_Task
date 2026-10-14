import React, { useState } from 'react';
import { Task } from '../types';
import { PRIORITY_COLORS, ICONS } from '../constants';

interface TaskCalendarProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  toggleComplete: (task: Task) => void;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onEditTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const todayStr = new Date().toISOString().split('T')[0];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Buffer for previous month
  for (let i = 0; i < startDay; i++) {
    days.push(
      <div 
        key={`empty-${i}`} 
        className="h-24 md:h-32 border border-lumina-100/40 dark:border-lumina-400/40 bg-lumina-50/20 dark:bg-lumina-500/20" 
      />
    );
  }

  // Days with tasks
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    const isToday = dateStr === todayStr;

    days.push(
      <div 
        key={d} 
        className={`h-24 md:h-32 border border-lumina-100/70 dark:border-lumina-400/60 p-2 overflow-hidden flex flex-col group relative bg-white/90 dark:bg-lumina-400/30 transition-colors ${
          isToday ? 'bg-lumina-50/70 dark:bg-lumina-300/10' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
            isToday 
              ? 'bg-lumina-300 text-white font-extrabold' 
              : 'text-lumina-200 dark:text-lumina-100'
          }`}>
            {d}
          </span>
          {dayTasks.length > 0 && (
            <span className="text-[10px] text-lumina-200/80 dark:text-lumina-100/60 font-semibold hidden md:inline">
              {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
          {dayTasks.map(t => (
            <div 
              key={t.id}
              onClick={() => onEditTask(t)}
              title={`${t.title} (${t.priority})`}
              className={`text-[9px] md:text-[10px] p-1 rounded-md truncate cursor-pointer hover:scale-[1.02] transition-transform border ${
                PRIORITY_COLORS[t.priority]
              } ${t.isCompleted ? 'opacity-50 line-through' : ''}`}
            >
              {t.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <div className="bg-white/95 dark:bg-lumina-400/95 backdrop-blur-md rounded-3xl shadow-xl border border-lumina-100/70 dark:border-lumina-300/30 overflow-hidden fade-in">
      <div className="p-5 md:p-6 border-b border-lumina-100/70 dark:border-lumina-300/30 flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold text-lumina-300 dark:text-lumina-50">
          {monthNames[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-lumina-100 dark:border-lumina-300/40 text-lumina-300 dark:text-lumina-100 hover:bg-lumina-50 dark:hover:bg-lumina-300/20 transition-all"
          >
            Today
          </button>
          <button 
            onClick={prevMonth} 
            aria-label="Previous month"
            className="p-2 hover:bg-lumina-50 dark:hover:bg-lumina-300/20 rounded-xl text-lumina-200 dark:text-lumina-100 transition-colors"
          >
            <ICONS.ChevronLeft size={18} />
          </button>
          <button 
            onClick={nextMonth} 
            aria-label="Next month"
            className="p-2 hover:bg-lumina-50 dark:hover:bg-lumina-300/20 rounded-xl text-lumina-200 dark:text-lumina-100 transition-colors"
          >
            <ICONS.ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center border-b border-lumina-100/70 dark:border-lumina-300/30 bg-lumina-50/50 dark:bg-lumina-500/30">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-2.5 text-[10px] font-bold uppercase tracking-widest text-lumina-200 dark:text-lumina-100/70">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days}
      </div>
    </div>
  );
};

export default TaskCalendar;
