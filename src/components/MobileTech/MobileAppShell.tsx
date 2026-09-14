import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClockInWizard } from './ClockInWizard';
import { MobileAdminView } from './MobileAdminView';
import { 
  Wifi, 
  WifiOff, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  HardHat, 
  RefreshCw, 
  Smartphone, 
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
  Building2,
  LayoutDashboard
} from 'lucide-react';
import { PWAInstallButton } from '../Install/PWAInstallButton';

export const MobileAppShell: React.FC = () => {
  const { 
    currentUser, 
    todayReport, 
    isNetworkOnline, 
    syncQueue, 
    isSyncing, 
    triggerSync, 
    settings 
  } = useApp();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [useBezelFrame, setUseBezelFrame] = useState(true);
  const [mobileTab, setMobileTab] = useState<'tech' | 'admin'>(() => {
    return (currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN') ? 'admin' : 'tech';
  });

  const pendingItemForUser = syncQueue.find(item => item.technicianId === currentUser.id);

  return (
    <div className="py-6 px-3 sm:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      
      {/* Frame view switcher (Phone bezel vs wide full-bleed) */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setUseBezelFrame(!useBezelFrame)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
        >
          {useBezelFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          <span>{useBezelFrame ? 'Full-Width View' : 'Device Bezel Frame'}</span>
        </button>

        <PWAInstallButton />

        <span className="text-xs text-slate-500 hidden sm:inline">
          Ready for Android & iOS
        </span>
      </div>

      {/* Main Container: Mobile Frame or Full Container */}
      <div className={`w-full ${useBezelFrame ? 'max-w-[420px] rounded-[42px] border-[10px] border-slate-900 shadow-2xl p-2 bg-slate-900' : 'max-w-xl'}`}>
        
        {/* Device Inner Glass */}
        <div className="bg-slate-950 text-white rounded-[32px] overflow-hidden flex flex-col min-h-[640px] border border-slate-800">
          
          {/* Simulated Mobile Status Bar (Notch / Clock / Battery / WiFi) */}
          <div className="px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950 select-none">
            <span className="font-bold text-white tracking-wider">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            
            {/* Speaker notch if bezel */}
            {useBezelFrame && (
              <div className="w-16 h-3 bg-slate-900 rounded-full border border-slate-800" />
            )}

            <div className="flex items-center gap-2">
              {isNetworkOnline ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Wifi className="w-3 h-3" />
                  <span className="text-[9px] font-bold">5G</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-400 font-bold animate-pulse">
                  <WifiOff className="w-3 h-3" />
                  <span className="text-[9px]">OFFLINE</span>
                </span>
              )}
              <span className="text-[10px] font-bold">98%</span>
            </div>
          </div>

          {/* Offline Sync Banner if offline or queue > 0 */}
          {(!isNetworkOnline || syncQueue.length > 0) && (
            <div className={`px-4 py-2.5 text-xs flex items-center justify-between border-b ${
              !isNetworkOnline
                ? 'bg-rose-950 text-rose-200 border-rose-800/80'
                : 'bg-amber-950 text-amber-200 border-amber-800/80'
            }`}>
              <div className="flex items-center gap-2">
                {!isNetworkOnline ? (
                  <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="text-[11px] leading-tight">
                  {!isNetworkOnline 
                    ? 'Offline: Device SQLite will preserve official clock-in.' 
                    : `${syncQueue.length} report(s) queued for sync.`}
                </span>
              </div>

              {isNetworkOnline && syncQueue.length > 0 && (
                <button
                  onClick={triggerSync}
                  disabled={isSyncing}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg cursor-pointer"
                >
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </button>
              )}
            </div>
          )}

          {/* Active Wizard Modal, Admin Mobile Dashboard, or Main Tech Dashboard */}
          {isWizardOpen ? (
            <div className="p-2 sm:p-3 flex-1 flex flex-col">
              <ClockInWizard
                onCancel={() => setIsWizardOpen(false)}
                onCompleted={() => setIsWizardOpen(false)}
              />
            </div>
          ) : mobileTab === 'admin' ? (
            <MobileAdminView onSwitchToTechMode={() => setMobileTab('tech')} />
          ) : (
            <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-4">
              
              {/* Technician Identity Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shadow-amber-500/20">
                    {currentUser.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-sm text-white leading-tight">
                      {currentUser.fullName}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono font-bold text-amber-400">
                        {currentUser.employeeId}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-[11px] text-slate-400">
                        Field Tech
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Expected Start
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {currentUser.customExpectedStartTime || settings?.defaultExpectedStartTime || '08:00'} AM
                  </span>
                </div>
              </div>

              {/* CLOCK-IN STATUS SECTION */}
              {todayReport ? (
                /* ALREADY CLOCKED IN STATE */
                <div className="space-y-4">
                  <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 space-y-4 shadow-xl">
                    
                    {/* Top Status Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>CLOCKED IN FOR TODAY</span>
                      </div>

                      {todayReport.lateStatus === 'ON_TIME' || todayReport.lateStatus === 'EXCUSED' ? (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                          ON TIME
                        </span>
                      ) : (
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                          LATE ({todayReport.lateDurationMinutes}m)
                        </span>
                      )}
                    </div>

                    {/* Official Clock-in Timestamp Highlight (The core business rule!) */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                          Official Clock-In Time
                        </span>
                        <span className="text-[10px] font-mono bg-slate-800 text-amber-300 px-2 py-0.5 rounded">
                          Device Recorded
                        </span>
                      </div>
                      
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
                          {new Date(todayReport.officialClockInTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {todayReport.officialClockInTime.substring(0, 10)}
                        </span>
                      </div>

                      {/* Sync Time Details */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span>Sync Type:</span>
                        <span className={`font-bold ${
                          todayReport.submissionType === 'OFFLINE_SYNC' 
                            ? 'text-amber-400' 
                            : 'text-emerald-400'
                        }`}>
                          {todayReport.submissionType === 'OFFLINE_SYNC' ? '⚡ Offline Sync' : '● Online Direct'}
                        </span>
                      </div>
                      
                      {todayReport.submissionType === 'OFFLINE_SYNC' && (
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>Server Sync Time:</span>
                          <span className="text-slate-200">
                            {todayReport.serverSyncedAt.includes('T')
                              ? new Date(todayReport.serverSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : todayReport.serverSyncedAt}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* GPS Location & Map link */}
                    <div className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                        <div>
                          <span className="text-white block font-bold">
                            {todayReport.latitude.toFixed(4)}, {todayReport.longitude.toFixed(4)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Accuracy: ±{todayReport.locationAccuracyMeters}m
                          </span>
                        </div>
                      </div>
                      <a
                        href={`https://maps.google.com/?q=${todayReport.latitude},${todayReport.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1"
                      >
                        <span>Map</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* 4 Photo thumbnails */}
                    <div>
                      <span className="text-xs font-bold text-slate-400 block mb-2">
                        Verified Safety Photos ({todayReport.photos.length})
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {todayReport.photos.map((photo, i) => (
                          <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-700 bg-black relative">
                            <img src={photo.dataUrl} alt={photo.photoType} className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] font-bold text-center text-amber-300 py-0.5">
                              {photo.photoType.replace('_', ' ').substring(0, 7)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* EHS Checklist Completed confirmation */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">EHS Compliance:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        5 / 5 Mandatory Passed
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* NOT CLOCKED IN STATE - CALL TO ACTION */
                <div className="space-y-4 flex-1 flex flex-col justify-center">
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                      <Clock className="w-8 h-8" />
                    </div>

                    <div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400">
                        Status: Not Clocked In
                      </span>
                      <h3 className="font-heading font-extrabold text-xl text-white mt-1">
                        Daily Clock-In & EHS Report
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                        Complete your 4 mandatory photos (PPE, Tools, Vehicle, Ladder) and 5-point safety inspection to record your official arrival.
                      </p>
                    </div>

                    {/* Large Touch Target Action Button */}
                    <button
                      onClick={() => setIsWizardOpen(true)}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 active:scale-98 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <HardHat className="w-5 h-5" />
                      <span>START TODAY'S CLOCK-IN</span>
                    </button>

                    <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-500">
                      <span>• Est. Time: 3 mins</span>
                      <span>• Offline Supported</span>
                      <span>• GPS Watermarked</span>
                    </div>
                  </div>

                  {/* Offline simulation tip box */}
                  <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 text-[11px] text-slate-400 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-300 block">Want to test offline sync?</strong>
                      <span>Toggle the <strong>[Online / Offline]</strong> button in the top bar to simulate a cellular dead zone, complete clock-in at 07:42, and then reconnect!</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom simulated navigation bar */}
          <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-around text-xs select-none">
            <button
              onClick={() => {
                setIsWizardOpen(false);
                setMobileTab('tech');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
                mobileTab === 'tech' && !isWizardOpen
                  ? 'text-amber-400 font-bold bg-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-[10px]">Clock-In</span>
            </button>

            <button
              onClick={() => {
                setMobileTab('tech');
                setIsWizardOpen(true);
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
                isWizardOpen
                  ? 'text-amber-400 font-bold bg-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px]">EHS Safety</span>
            </button>

            <button
              onClick={() => {
                setIsWizardOpen(false);
                setMobileTab('admin');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
                mobileTab === 'admin'
                  ? 'text-amber-400 font-bold bg-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="text-[10px] flex items-center gap-0.5">
                <span>Admin</span>
                {(currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
