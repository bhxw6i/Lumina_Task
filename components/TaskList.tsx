
import React from 'react';
import { Task, Priority } from '../types';
import { PRIORITY_COLORS, ICONS } from '../constants';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, onDeleteTask, onToggleComplete }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center fade-in">
        <div className="w-24 h-24 bg-lumina-100/30 rounded-full flex items-center justify-center mb-6">
          <ICONS.CheckCircle2 className="text-lumina-200" size={48} />
        </div>
        <h3 className="text-xl font-semibold mb-2">Quiet here...</h3>
        <p className="text-lumina-200 max-w-xs mx-auto">
          No tasks found. Time to relax or start something new with the + button!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 fade-in">
      {tasks.map((task) => (
        <div 
          key={task.id}
          className={`
            group flex items-start gap-4 p-5 rounded-3xl bg-white dark:bg-lumina-400 border border-lumina-100 dark:border-lumina-300 shadow-sm hover:shadow-md transition-all duration-300
            ${task.isCompleted ? 'opacity-70 grayscale-[0.3]' : ''}
          `}
        >
          {/* Custom Checkbox */}
          <button 
            onClick={() => onToggleComplete(task)}
            className={`
              mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
              ${task.isCompleted 
                ? 'bg-lumina-300 border-lumina-300' 
                : 'border-lumina-100 hover:border-lumina-300'}
            `}
          >
            {task.isCompleted && <ICONS.Plus className="text-white rotate-45" size={16} />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-lg font-semibold truncate ${task.isCompleted ? 'line-through text-lumina-200' : ''}`}>
                {task.title}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </span>
            </div>
            {task.description && (
              <p className={`text-sm mb-3 line-clamp-2 ${task.isCompleted ? 'text-lumina-100' : 'text-lumina-200'}`}>
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs font-medium text-lumina-200">
              <div className="flex items-center gap-1.5">
                <ICONS.Plus size={14} />
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEditTask(task)}
              className="p-2 text-lumina-200 hover:text-lumina-300 hover:bg-lumina-50 dark:hover:bg-lumina-300/20 rounded-xl"
            >
              <ICONS.Edit2 size={18} />
            </button>
            <button 
              onClick={() => onDeleteTask(task.id)}
              className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
            >
              <ICONS.Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
