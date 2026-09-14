import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Smartphone, 
  LayoutDashboard, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  RotateCcw,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Clock,
  LogOut
} from 'lucide-react';
import { PWAInstallButton } from './Install/PWAInstallButton';

export const TopBar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    currentUser, 
    setCurrentUser, 
    allUsers, 
    isNetworkOnline, 
    toggleNetworkSimulation,
    syncQueue,
    isSyncing,
    triggerSync,
    resetDemoData,
    logout
  } = useApp();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm tracking-tight shadow-sm">
                SE
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-white text-base sm:text-lg tracking-tight">
                    Spectrum Engineering EHS
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-mono uppercase font-bold tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    Field Safety
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium block leading-none">
                  Field Operations, Clock-In & Safety Engine
                </span>
              </div>
            </div>

            {/* View Switcher: Mobile Tech App vs Admin Dashboard */}
            <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveView('mobile_tech')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeView === 'mobile_tech'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Field Tech Mobile</span>
                {syncQueue.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveView('admin_dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeView === 'admin_dashboard'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin Operations</span>
              </button>
            </div>
          </div>

          {/* Right Controls: Offline Simulator, Sync Queue, Persona, Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* OFFLINE NETWORK SIMULATOR TOGGLE */}
            <button
              onClick={toggleNetworkSimulation}
              title={isNetworkOnline ? 'Click to simulate offline field dead zone' : 'Click to restore cellular connectivity'}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                isNetworkOnline
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80'
                  : 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse shadow-sm shadow-rose-950'
              }`}
            >
              {isNetworkOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden xl:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-extrabold text-rose-300 text-[11px]">OFFLINE</span>
                </>
              )}
            </button>

            {/* Offline Sync Queue indicator */}
            {syncQueue.length > 0 && (
              <button
                onClick={triggerSync}
                disabled={!isNetworkOnline || isSyncing}
                title="Pending offline reports queued in local storage"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                  isNetworkOnline
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700 opacity-80 cursor-not-allowed'
                }`}
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
                <span className="hidden sm:inline">{syncQueue.length} Pending</span>
                <span className="sm:hidden">{syncQueue.length}</span>
              </button>
            )}

            {/* Persona Switcher Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const selected = allUsers.find(u => u.id === e.target.value);
                  if (selected) {
                    setCurrentUser(selected);
                    if (selected.role === 'ADMIN' || selected.role === 'SUPER_ADMIN') {
                      setActiveView('admin_dashboard');
                    } else {
                      setActiveView('mobile_tech');
                    }
                  }
                }}
                className="bg-transparent text-white font-medium text-xs focus:outline-hidden cursor-pointer max-w-[130px] sm:max-w-none truncate"
              >
                <optgroup label="Field Technicians">
                  {allUsers
                    .filter(u => u.role === 'TECHNICIAN')
                    .map(u => (
                      <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                        {u.fullName} ({u.employeeId})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="EHS Management">
                  {allUsers
                    .filter(u => u.role !== 'TECHNICIAN')
                    .map(u => (
                      <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                        {u.fullName} ({u.role})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Log Out Button */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              title="Log Out of Spectrum Engineering EHS"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-700/60 border border-slate-700 text-slate-300 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>

            {/* PWA / Android APK Launch Button */}
            <PWAInstallButton />

            {/* Reset Demo State */}
            <button
              onClick={resetDemoData}
              title="Reset system state to clean seed data"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer hidden sm:block"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-bar toggle */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveView('mobile_tech')}
            className={`flex items-center gap-1.5 py-1 px-3 rounded-md font-semibold cursor-pointer ${
              activeView === 'mobile_tech' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Field Tech Mobile</span>
          </button>
          <button
            onClick={() => setActiveView('admin_dashboard')}
            className={`flex items-center gap-1.5 py-1 px-3 rounded-md font-semibold cursor-pointer ${
              activeView === 'admin_dashboard' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin Dashboard</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Log Out of Spectrum EHS?</h3>
                <p className="text-xs text-slate-400 mt-0.5">End active session for {currentUser.fullName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to log out? Any queued offline reports and local timecards will remain securely stored on this browser.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-sm cursor-pointer"
              >
                Confirm Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
