// src/components/layout/AppLayout.jsx
import { useState } from 'react';
import { Menu, Bell, RefreshCw } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AppLayout({ children, isAdmin = false, title = '', onRefresh, lastUpdated }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar isAdmin={isAdmin} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <div className="lg:ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            {title && <h1 className="font-display font-semibold text-gray-900 text-lg">{title}</h1>}
            {lastUpdated && (
              <p className="text-xs text-gray-400 mt-0.5">
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
