// Top header bar — page title, status, and mobile nav toggle

import React from 'react';
import { Menu, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  isApiConnected: boolean;
  lastUpdated: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  isApiConnected,
  lastUpdated,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-udaan-surface/80 backdrop-blur-xl border-b border-udaan-border">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md text-udaan-text-muted hover:text-white hover:bg-udaan-surface-light transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Left: UDAAN System Status label */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-[10px] font-mono text-udaan-text-dim uppercase tracking-[0.15em]">
            UDAAN System Status
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
              isApiConnected
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {isApiConnected
              ? <><Wifi className="w-3 h-3" /> Connected</>
              : <><WifiOff className="w-3 h-3" /> Disconnected</>
            }
          </span>
        </div>

        {/* Right: Last updated */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-udaan-text-dim font-mono">
            {lastUpdated
              ? `Last data: ${lastUpdated}`
              : 'Awaiting data'
            }
          </span>
        </div>
      </div>
    </header>
  );
};
