
import React from 'react';
import { ViewType } from '../types';
import { SIDEBAR_ITEMS, ICONS } from '../constants';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen }) => {
  return (
    <aside className={`
      fixed inset-y-0 left-0 w-72 bg-white dark:bg-lumina-400 border-r border-lumina-100 dark:border-lumina-400 z-30 transform transition-transform duration-300 md:relative md:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-lumina-300 rounded-xl flex items-center justify-center">
            <ICONS.Sparkles className="text-white" size={24} />
          </div>
          <span className="text-2xl font-serif font-bold tracking-tight">Lumina</span>
        </div>

        <nav className="space-y-2">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                ${activeView === item.id 
                  ? 'bg-lumina-50 dark:bg-lumina-300 text-lumina-300 dark:text-white font-semibold shadow-sm' 
                  : 'text-lumina-200 hover:bg-lumina-50 dark:hover:bg-lumina-300/20'}
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
