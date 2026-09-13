import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/TopBar';
import { MobileAppShell } from './components/MobileTech/MobileAppShell';
import { AdminDashboard } from './components/Admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      <TopBar />
      <main className="flex-1">
        {activeView === 'mobile_tech' ? (
          <MobileAppShell />
        ) : (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
