import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyReport } from '../../types';
import { ReportsTable } from './ReportsTable';
import { TechniciansView } from './TechniciansView';
import { SettingsView } from './SettingsView';
import { AuditLogsView } from './AuditLogsView';
import { ReportDetailModal } from './ReportDetailModal';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  WifiOff, 
  Clock, 
  FileText, 
  Sliders, 
  ShieldAlert,
  Download,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    adminTab, 
    setAdminTab, 
    summary, 
    syncQueue, 
    refreshDashboard 
  } = useApp();

  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleSelectReport = (report: DailyReport) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* EXECUTIVE KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Techs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Roster Techs
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-extrabold text-slate-900">
              {summary?.totalTechnicians ?? 3}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">Field Active</span>
          </div>
        </div>

        {/* Clocked In Today */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Clocked In
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-extrabold text-slate-900">
              {summary?.clockedIn ?? 0}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">Today</span>
          </div>
        </div>

        {/* On-Time Arrivals */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
            On-Time
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-extrabold text-emerald-900">
              {summary?.onTime ?? 0}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">Verified</span>
          </div>
        </div>

        {/* Late Arrivals */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">
            Late Arrivals
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-extrabold text-rose-900">
              {summary?.late ?? 0}
            </span>
            <span className="text-[10px] text-rose-700 font-semibold">&gt; 5m grace</span>
          </div>
        </div>

        {/* Offline-Synced Reports (Core Feature Showcase!) */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
            Offline Synced
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-extrabold text-amber-900">
              {summary?.offlineSynced ?? 0}
            </span>
            <span className="text-[10px] text-amber-800 font-semibold">Attested</span>
          </div>
        </div>

        {/* Pending Sync in Local Queue */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xs border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Client Queue
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-mono font-extrabold ${syncQueue.length > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
              {syncQueue.length}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Awaiting Uplink</span>
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setAdminTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'reports'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Daily Clock-In Reports</span>
        </button>

        <button
          onClick={() => setAdminTab('technicians')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'technicians'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Technician Roster</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'settings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Rules & Settings</span>
        </button>

        <button
          onClick={() => setAdminTab('audit_logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'audit_logs'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit Trail</span>
        </button>
      </div>

      {/* ACTIVE TAB CONTENT */}
      <div>
        {adminTab === 'reports' && (
          <ReportsTable onSelectReport={handleSelectReport} />
        )}
        {adminTab === 'technicians' && <TechniciansView />}
        {adminTab === 'settings' && <SettingsView />}
        {adminTab === 'audit_logs' && <AuditLogsView />}
      </div>

      {/* REPORT DOSSIER MODAL */}
      <ReportDetailModal
        report={selectedReport}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReport(null);
        }}
      />
    </div>
  );
};
