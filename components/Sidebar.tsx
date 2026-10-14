import React from 'react';
import { ViewType } from '../types';
import { SIDEBAR_ITEMS, ICONS } from '../constants';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isOpen: boolean;
  onClose?: () => void;
  taskCounts?: {
    inbox: number;
    today: number;
    highPriority: number;
    completed: number;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  isOpen, 
  onClose,
  taskCounts 
}) => {
  const getBadgeCount = (id: string): number | null => {
    if (!taskCounts) return null;
    switch (id) {
      case 'inbox': return taskCounts.inbox;
      case 'today': return taskCounts.today;
      case 'high-priority': return taskCounts.highPriority;
      case 'completed': return taskCounts.completed;
      default: return null;
    }
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 w-72 bg-white/95 dark:bg-lumina-400/95 backdrop-blur-md border-r border-lumina-100/70 dark:border-lumina-400/80 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 flex flex-col justify-between
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6 md:p-8">
        {/* Header Branding */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-lumina-300 to-lumina-200 rounded-2xl flex items-center justify-center shadow-md shadow-lumina-300/30">
              <ICONS.Sparkles className="text-white" size={22} />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold tracking-tight text-lumina-300 dark:text-lumina-50">
                Lumina
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-lumina-200/80 dark:text-lumina-100/60 font-semibold">
                Tasks & Flow
              </span>
            </div>
          </div>
          
          {/* Close button for mobile */}
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden p-2 text-lumina-200 hover:text-lumina-300 dark:text-lumina-100 rounded-xl"
              aria-label="Close sidebar"
            >
              <ICONS.Plus size={20} className="rotate-45" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {SIDEBAR_ITEMS.map((item) => {
            const count = getBadgeCount(item.id);
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ViewType)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 text-sm
                  ${isActive 
                    ? 'bg-lumina-300 text-white font-semibold shadow-lg shadow-lumina-300/25 translate-x-1' 
                    : 'text-lumina-200 dark:text-lumina-100 hover:bg-lumina-50 dark:hover:bg-lumina-300/20'}
                `}
              >
                <div className="flex items-center gap-3.5">
                  <span className={isActive ? 'text-white' : 'text-lumina-200 dark:text-lumina-100'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {count !== null && count > 0 && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-lumina-100/50 dark:bg-lumina-500/50 text-lumina-300 dark:text-lumina-100'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-6 border-t border-lumina-100/60 dark:border-lumina-300/20 text-[11px] text-lumina-200/70 dark:text-lumina-100/50 flex items-center justify-between">
        <span>Lumina v2.0 • MERN Stack</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500" title="System Ready" />
      </div>
    </aside>
  );
};

export default Sidebar;
