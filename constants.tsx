
import React from 'react';
import { 
  Inbox, 
  Calendar, 
  Star, 
  CheckCircle2, 
  LayoutDashboard,
  Search,
  Plus,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
  MoreVertical,
  Trash2,
  Edit2,
  Sparkles
} from 'lucide-react';

export const COLORS = {
  lightBg: '#FBE4D8',
  lightAccent: '#DFB6B2',
  mediumAccent: '#854F6C',
  darkAccent: '#522B5B',
  deepPurple: '#2B124C',
  blackPurple: '#190019',
};

export const PRIORITY_COLORS = {
  LOW: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300',
  HIGH: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300',
};

export const SIDEBAR_ITEMS = [
  { id: 'inbox', label: 'Inbox', icon: <Inbox size={20} /> },
  { id: 'today', label: 'Today', icon: <Calendar size={20} /> },
  { id: 'calendar', label: 'Calendar View', icon: <LayoutDashboard size={20} /> },
  { id: 'high-priority', label: 'High Priority', icon: <Star size={20} /> },
  { id: 'completed', label: 'Completed', icon: <CheckCircle2 size={20} /> },
];

export const ICONS = {
  Search,
  Plus,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
  MoreVertical,
  Trash2,
  Edit2,
  Sparkles,
  // Added CheckCircle2 to fix the property error in TaskList.tsx
  CheckCircle2
};
