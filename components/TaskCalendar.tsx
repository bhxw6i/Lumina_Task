
import React, { useState } from 'react';
import { Task } from '../types';
import { PRIORITY_COLORS, ICONS } from '../constants';

interface TaskCalendarProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  toggleComplete: (task: Task) => void;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onEditTask, onDeleteTask, toggleComplete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Buffer for previous month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 md:h-32 border border-lumina-50/50 dark:border-lumina-400/50 bg-lumina-50/10" />);
  }

  // Days with tasks
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    
    days.push(
      <div key={d} className="h-24 md:h-32 border border-lumina-100 dark:border-lumina-400 p-2 overflow-hidden flex flex-col group relative bg-white dark:bg-lumina-400/20">
        <span className="text-xs font-bold text-lumina-200 mb-1">{d}</span>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
          {dayTasks.map(t => (
            <div 
              key={t.id}
              onClick={() => onEditTask(t)}
              className={`text-[9px] md:text-[10px] p-1 rounded truncate cursor-pointer hover:scale-105 transition-transform ${PRIORITY_COLORS[t.priority]} ${t.isCompleted ? 'opacity-50' : ''}`}
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

  return (
    <div className="bg-white dark:bg-lumina-400 rounded-3xl shadow-xl border border-lumina-100 dark:border-lumina-300 overflow-hidden fade-in">
      <div className="p-6 border-b border-lumina-50 dark:border-lumina-300 flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold">{monthNames[month]} {year}</h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-lumina-50 dark:hover:bg-lumina-300/20 rounded-xl"><ICONS.Plus className="rotate-180" size={20} /></button>
          <button onClick={nextMonth} className="p-2 hover:bg-lumina-50 dark:hover:bg-lumina-300/20 rounded-xl"><ICONS.Plus size={20} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center border-b border-lumina-50 dark:border-lumina-300">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-2 text-[10px] font-bold uppercase tracking-widest text-lumina-200">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days}
      </div>
    </div>
  );
};

export default TaskCalendar;
