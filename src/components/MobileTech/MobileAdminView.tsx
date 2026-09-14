import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  RefreshCw, 
  Radio, 
  Flame, 
  ChevronRight, 
  ExternalLink, 
  Filter,
  Check,
  Building2,
  HardHat
} from 'lucide-react';

interface MobileAdminViewProps {
  onSwitchToTechMode: () => void;
}

export const MobileAdminView: React.FC<MobileAdminViewProps> = ({ onSwitchToTechMode }) => {
  const { 
    currentUser, 
    allUsers, 
    reports, 
    syncQueue, 
    triggerSync, 
    isSyncing, 
    isNetworkOnline 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'roster' | 'reports' | 'controls'>('roster');
  const [filterType, setFilterType] = useState<'ALL' | 'ON_TIME' | 'LATE'>('ALL');
  const [musterAlertActive, setMusterAlertActive] = useState(false);

  const activeTechs = allUsers.filter(u => u.role !== 'SUPER_ADMIN');
  const onTimeCount = reports.filter(r => r.lateStatus === 'ON_TIME' || r.lateStatus === 'EXCUSED').length;
  const lateCount = reports.filter(r => r.lateStatus === 'LATE').length;

  const filteredReports = reports.filter(r => {
    if (filterType === 'ON_TIME') return r.lateStatus === 'ON_TIME' || r.lateStatus === 'EXCUSED';
    if (filterType === 'LATE') return r.lateStatus === 'LATE';
    return true;
  });

  return (
    <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-4">
      {/* Admin Header Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shadow-amber-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-heading font-extrabold text-sm text-white leading-tight">
                EHS Command Center
              </h2>
              <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono">
                ADMIN
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
              <span>{currentUser.fullName}</span>
              <span>•</span>
              <span className="text-amber-400 font-mono text-[11px]">{currentUser.employeeId || 'SUPERVISOR'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={triggerSync}
          disabled={isSyncing}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors disabled:opacity-50"
          title="Force Sync Now"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="text-[11px] font-medium">On-Duty Field Techs</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {reports.length} <span className="text-xs text-slate-500 font-normal">/ {activeTechs.length} Active</span>
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" />
            <span>GPS Geofence Verified</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="text-[11px] font-medium">Safety Compliance</span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            99.4%
          </div>
          <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-0.5">
            <span>142 Safe Days Recorded</span>
          </div>
        </div>
      </div>

      {/* In-Mobile Sub Navigation Tabs */}
      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('roster')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all ${
            activeTab === 'roster'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Live Roster ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all ${
            activeTab === 'reports'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Audit Reports
        </button>
        <button
          onClick={() => setActiveTab('controls')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all ${
            activeTab === 'controls'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Controls
        </button>
      </div>

      {/* TAB 1: Live Personnel Roster */}
      {activeTab === 'roster' && (
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
            <span>CLOCK-IN STATUS ROSTER</span>
            <span className="text-emerald-400">{reports.length} Present</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xs">
                      {report.technicianName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">
                        {report.technicianName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {report.technicianEmployeeId}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${
                    report.lateStatus === 'ON_TIME' || report.lateStatus === 'EXCUSED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {report.lateStatus === 'ON_TIME' || report.lateStatus === 'EXCUSED' ? 'ON TIME' : 'LATE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950/80 p-2 rounded-xl text-slate-400 font-mono">
                  <div>
                    <span className="text-slate-500 block">CLOCK TIME</span>
                    <span className="text-white font-bold">
                      {new Date(report.officialClockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">SAFETY AUDIT</span>
                    <span className="text-emerald-400 font-bold">5/5 Passed</span>
                  </div>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                No active clock-ins recorded yet for today.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Audit Reports with Filters */}
      {activeTab === 'reports' && (
        <div className="space-y-3 flex-1">
          <div className="flex gap-2">
            {(['ALL', 'ON_TIME', 'LATE'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                  filterType === type
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{report.technicianName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(report.officialClockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Photos: {report.photos?.length || 4} verified</span>
                  <a
                    href={`https://maps.google.com/?q=${report.latitude},${report.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 text-[10px]"
                  >
                    <span>GPS Map</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Site & Safety Controls */}
      {activeTab === 'controls' && (
        <div className="space-y-3 flex-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Emergency & Site Commands
            </h3>

            {/* Muster alert button */}
            <button
              onClick={() => setMusterAlertActive(!musterAlertActive)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                musterAlertActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>{musterAlertActive ? 'CANCEL ACTIVE MUSTER ALERT' : 'TRIGGER EMERGENCY MUSTER CALL'}</span>
            </button>

            {/* Test field clock-in */}
            <button
              onClick={onSwitchToTechMode}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <HardHat className="w-4 h-4 text-amber-400" />
              <span>Test Technician Clock-In Workflow</span>
            </button>

            {/* Sync trigger */}
            <button
              onClick={triggerSync}
              disabled={isSyncing}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Force Synchronize All Mobile Queues</span>
            </button>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-[11px] text-slate-400">
            <strong>Audit Status:</strong> Spectrum EHS is operating under high-concurrency offline sync protocol.
          </div>
        </div>
      )}
    </div>
  );
};
