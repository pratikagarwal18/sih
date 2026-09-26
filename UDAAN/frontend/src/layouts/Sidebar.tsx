// UDAAN Sidebar — premium aviation navigation

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Route,
  Search,
  Plane,
  Clock,
  Sparkles,
  Database,
  ShieldCheck,
  BookOpen,
  X,
} from 'lucide-react';
import { NAV_SECTIONS } from '../constants';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Route: <Route className="w-4 h-4" />,
  Search: <Search className="w-4 h-4" />,
  Plane: <Plane className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isApiConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isApiConnected }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-udaan-surface border-r border-udaan-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="p-5 border-b border-udaan-border">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
              {/* UDAAN Logo Mark */}
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-udaan-cyan to-blue-600 flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 32 32" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 26 C10 18, 16 12, 26 6" strokeLinecap="round" />
                  <path d="M22 4 L26 6 L24 10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-widest">UDAAN</span>
                <span className="block text-[9px] text-udaan-text-muted tracking-[0.2em] uppercase leading-none mt-0.5">
                  Airfare Intelligence
                </span>
              </div>
            </NavLink>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-udaan-text-dim hover:text-white hover:bg-udaan-surface-light transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-5">
              <span className="px-3 text-[10px] font-semibold text-udaan-text-dim uppercase tracking-[0.15em]">
                {section.label}
              </span>
              <ul className="mt-2 space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-udaan-cyan/10 text-udaan-cyan border border-udaan-cyan/20'
                            : 'text-udaan-text-muted hover:text-udaan-text hover:bg-udaan-surface-light/50 border border-transparent'
                        }`
                      }
                      end={item.path === '/'}
                    >
                      {iconMap[item.icon] || <div className="w-4 h-4" />}
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* System Status */}
        <div className="p-4 border-t border-udaan-border">
          <div className="text-[10px] font-semibold text-udaan-text-dim uppercase tracking-[0.15em] mb-2">
            System Status
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isApiConnected ? 'bg-emerald-400 animate-pulse-glow' : 'bg-red-400'
              }`}
              aria-hidden="true"
            />
            <span className={`text-xs font-medium ${
              isApiConnected ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {isApiConnected ? 'Backend Connected' : 'Backend Not Connected'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
