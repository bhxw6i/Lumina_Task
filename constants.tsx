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
  Sparkles,
  Eye,
  EyeOff,
  Cloud,
  CloudOff,
  Loader2,
  Check,
  Activity,
  Filter,
  Tag,
  AlertCircle,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight
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
  LOW: 'bg-emerald-100/80 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40',
  MEDIUM: 'bg-amber-100/80 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40',
  HIGH: 'bg-rose-100/80 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40',
};

export const CATEGORY_COLORS: Record<string, string> = {
  Work: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
  Personal: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  Study: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  Health: 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  General: 'bg-stone-100 text-stone-700 dark:bg-stone-800/60 dark:text-stone-300',
};

export const SIDEBAR_ITEMS = [
  { id: 'inbox', label: 'Inbox', icon: <Inbox size={20} /> },
  { id: 'today', label: 'Today', icon: <Calendar size={20} /> },
  { id: 'calendar', label: 'Calendar View', icon: <LayoutDashboard size={20} /> },
  { id: 'high-priority', label: 'High Priority', icon: <Star size={20} /> },
  { id: 'completed', label: 'Completed', icon: <CheckCircle2 size={20} /> },
];

export const ICONS = {
  Inbox,
  Calendar,
  LayoutDashboard,
  Star,
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
  CheckCircle2,
  Eye,
  EyeOff,
  Cloud,
  CloudOff,
  Loader2,
  Check,
  Activity,
  Filter,
  Tag,
  AlertCircle,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight
};
