import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { 
  ShieldCheck, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Smartphone, 
  Building2,
  HardHat
} from 'lucide-react';

export const WebLoginScreen: React.FC = () => {
  const { allUsers, login } = useApp();
  const [badgeId, setBadgeId] = useState('SE-7842');
  const [pin, setPin] = useState('7842');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const cleanBadge = badgeId.trim().toLowerCase();
      const matched = allUsers.find(
        (u) =>
          u.employeeId?.toLowerCase() === cleanBadge ||
          u.email.toLowerCase() === cleanBadge ||
          u.id.toLowerCase() === cleanBadge ||
          u.fullName.toLowerCase().includes(cleanBadge)
      );

      if (matched) {
        login(matched);
      } else {
        // Fallback demo technician if custom entered
        const fallbackTech: User = {
          id: `usr-${Date.now()}`,
          fullName: badgeId.includes('@') ? badgeId.split('@')[0] : `Technician ${badgeId}`,
          email: badgeId.includes('@') ? badgeId : `${badgeId.toLowerCase()}@spectrum-ehs.com`,
          employeeId: badgeId.toUpperCase(),
          role: badgeId.toLowerCase().includes('admin') ? 'ADMIN' : 'TECHNICIAN',
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        login(fallbackTech);
      }
      setIsLoading(false);
    }, 250);
  };

  const handleQuickSelect = (user: User) => {
    setBadgeId(user.employeeId || user.email);
    setPin('7842');
    login(user);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Subtle industrial background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Glow accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black text-2xl tracking-tighter">
            SE
          </div>
          <div>
            <div className="inline-block text-[11px] font-mono uppercase font-bold tracking-widest bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full mb-2">
              Field Operations & Safety Division
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Spectrum Engineering EHS
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Field Technician Clock-In, Hazard Audit & Safety Portal
            </p>
          </div>
        </div>

        {/* Credentials Form Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl backdrop-blur-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Technician & Staff Sign In</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your Spectrum badge credentials or work email
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Employee Badge ID or Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  placeholder="e.g. SE-7842 or c.mendez@spectrum-ehs.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Safety PIN or Password</span>
                <span className="text-[11px] text-slate-500 font-normal">Default demo PIN: 7842</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Spectrum EHS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Offline Ready Notice */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Local offline authentication available in remote dead-zones</span>
          </div>
        </div>

        {/* Fast Select Demo Profiles */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Fast 1-Tap Personnel Sign-In
            </span>
            <span className="text-[10px] text-slate-500">Demo Testing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allUsers.slice(0, 4).map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickSelect(user)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center font-bold text-xs text-amber-400 transition-colors shrink-0">
                  {user.role === 'SUPER_ADMIN' ? (
                    <Building2 className="w-4 h-4" />
                  ) : (
                    <HardHat className="w-4 h-4" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-white truncate">
                    {user.fullName}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {user.employeeId || user.role} • {user.role === 'SUPER_ADMIN' ? 'EHS Admin' : 'Field Tech'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
