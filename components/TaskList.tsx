import React from 'react';
import { Task, Priority } from '../types';
import { PRIORITY_COLORS, CATEGORY_COLORS, ICONS } from '../constants';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onEditTask, 
  onDeleteTask, 
  onToggleComplete 
}) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center fade-in">
        <div className="w-20 h-20 bg-lumina-100/30 dark:bg-lumina-400/40 rounded-3xl flex items-center justify-center mb-5 shadow-inner">
          <ICONS.CheckCircle2 className="text-lumina-200 dark:text-lumina-100" size={40} />
        </div>
        <h3 className="text-xl font-serif font-bold text-lumina-300 dark:text-lumina-50 mb-1.5">
          Quiet and Clear
        </h3>
        <p className="text-xs text-lumina-200 dark:text-lumina-100/70 max-w-xs mx-auto leading-relaxed">
          No tasks match your current view. Click the plus button to create a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3.5 fade-in">
      {tasks.map((task) => {
        const isHigh = task.priority === Priority.HIGH && !task.isCompleted;
        const categoryClass = CATEGORY_COLORS[task.category || 'General'] || CATEGORY_COLORS['General'];

        return (
          <div 
            key={task.id}
            className={`
              group flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-lumina-400/80 border border-lumina-100/70 dark:border-lumina-300/25 shadow-sm hover:shadow-md transition-all duration-200
              ${task.isCompleted ? 'opacity-65 grayscale-[0.2]' : ''}
              ${isHigh ? 'border-rose-200/60 dark:border-rose-900/40' : ''}
            `}
          >
            {/* Custom Interactive Checkbox */}
            <button 
              onClick={() => onToggleComplete(task)}
              aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
              className={`
                mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shrink-0
                ${task.isCompleted 
                  ? 'bg-emerald-500 border-emerald-500 shadow-sm' 
                  : 'border-lumina-200/50 hover:border-lumina-300 dark:border-lumina-300/50 hover:bg-lumina-50 dark:hover:bg-lumina-300/20'}
              `}
            >
              {task.isCompleted && <ICONS.Check className="text-white stroke-[3]" size={14} />}
            </button>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h3 className={`text-base font-semibold truncate ${
                  task.isCompleted 
                    ? 'line-through text-lumina-200 dark:text-lumina-100/60' 
                    : 'text-lumina-500 dark:text-white'
                }`}>
                  {task.title}
                </h3>

                {/* Priority Badge */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${PRIORITY_COLORS[task.priority]}`}>
                  {task.priority}
                </span>

                {/* Category Badge */}
                {task.category && (
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryClass}`}>
                    {task.category}
                  </span>
                )}
              </div>

              {task.description && (
                <p className={`text-xs mb-2.5 line-clamp-2 leading-relaxed ${
                  task.isCompleted 
                    ? 'text-lumina-100 dark:text-lumina-100/50' 
                    : 'text-lumina-200 dark:text-lumina-100/80'
                }`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs font-medium text-lumina-200 dark:text-lumina-100/70">
                <div className="flex items-center gap-1.5">
                  <ICONS.Calendar size={13} className="text-lumina-300 dark:text-lumina-100" />
                  <span>Due: {task.dueDate}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEditTask(task)}
                className="p-2 text-lumina-200 hover:text-lumina-300 dark:text-lumina-100 dark:hover:text-white hover:bg-lumina-50 dark:hover:bg-lumina-300/30 rounded-xl transition-colors"
                title="Edit task"
              >
                <ICONS.Edit2 size={16} />
              </button>
              <button 
                onClick={() => onDeleteTask(task.id)}
                className="p-2 text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                title="Delete task"
              >
                <ICONS.Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
