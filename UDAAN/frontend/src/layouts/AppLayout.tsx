// Main application layout — sidebar + header + content area

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApiHealth } from '../hooks/useApiHealth';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isConnected } = useApiHealth();

  return (
    <div className="min-h-screen bg-udaan-bg">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isApiConnected={isConnected}
      />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header
          onMenuToggle={() => setSidebarOpen(true)}
          isApiConnected={isConnected}
          lastUpdated={null}
        />

        <main className="flex-1 p-4 lg:p-6 page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
