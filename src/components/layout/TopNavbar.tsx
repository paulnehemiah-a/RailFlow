import React, { useState, useEffect } from 'react';
import {
  Bell,
  Play,
  ShieldCheck,
  Train,
  Clock,
  Sparkles,
  User,
  Radio,
  ChevronDown,
} from 'lucide-react';
import { useRailFlowStore } from '../../store/railflowStore';

export const TopNavbar: React.FC = () => {
  const {
    unreadNotifsCount,
    startDemoMode,
    isDemoMode,
    selectedSectionId,
    setSelectedSectionId,
    sections,
    setActiveView,
  } = useRailFlowStore();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [syncSeconds, setSyncSeconds] = useState<number>(14);
  const [showSectionMenu, setShowSectionMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const syncTimer = setInterval(() => {
      setSyncSeconds((prev) => (prev >= 45 ? 5 : prev + 1));
    }, 1000);
    return () => clearInterval(syncTimer);
  }, []);

  const currentSection = sections.find((s) => s.id === selectedSectionId) || sections[3];

  return (
    <header className="h-16 bg-white border-b border-railway-border px-4 flex items-center justify-between z-50 shadow-card shrink-0 relative">
      {/* Brand & Title */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-railway-blue flex items-center justify-center text-white shadow-md">
          <Train className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xl tracking-tight text-railway-dark">
              RAIL<span className="text-railway-teal">FLOW</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            AI-Assisted Railway Maintenance Decision Support & Coordinated Block Planning
          </p>
        </div>
      </div>

      {/* Center: Corridor Selector & Operational Context */}
      <div className="hidden lg:flex items-center space-x-3">
        <div className="relative">
          <button
            onClick={() => setShowSectionMenu(!showSectionMenu)}
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 transition"
          >
            <Radio className="w-3.5 h-3.5 text-railway-teal animate-pulse" />
            <span>SR / Chord Line:</span>
            <span className="text-railway-blue font-bold">{currentSection.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showSectionMenu && (
            <>
              {/* Invisible Click Outside Backdrop */}
              <div
                className="fixed inset-0 z-[9998]"
                onClick={() => setShowSectionMenu(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-84 bg-white border border-slate-200 rounded-xl shadow-2xl z-[9999] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-1 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Southern Railway (Chennai–Madurai Chord Line)
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setSelectedSectionId(sec.id);
                        setShowSectionMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition border-b border-slate-50 last:border-0 ${
                        sec.id === selectedSectionId ? 'bg-railway-lightBlue font-bold text-railway-blue' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{sec.name}</div>
                        <div className="text-[10px] text-slate-500">{sec.lengthKm} km • {sec.trackType}</div>
                      </div>
                      {sec.id === 'S-VM-VRI' && (
                        <span className="text-[9px] bg-teal-100 text-teal-800 font-extrabold px-2 py-0.5 rounded-full border border-teal-300">
                          Focus Corridor
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Controls: Status, Live Clock, Demo Button, Profile */}
      <div className="flex items-center space-x-3">
        {/* System Health / Sync */}
        <div className="hidden md:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-md text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-700">System Ready</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-500">Sync: {syncSeconds}s ago</span>
        </div>

        {/* Live Clock */}
        <div className="hidden xl:flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-md text-xs font-mono font-medium text-slate-700">
          <Clock className="w-3.5 h-3.5 text-railway-blue" />
          <span>{currentTime || '13:15:00 IST'}</span>
        </div>

        {/* High-Visibility SIH Demo Walkthrough Button */}
        <button
          onClick={startDemoMode}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md font-bold text-xs shadow-sm transition border ${
            isDemoMode
              ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
              : 'bg-gradient-to-r from-railway-blue to-railway-steel hover:from-railway-dark hover:to-railway-blue text-white border-railway-blue'
          }`}
        >
          
          <span>{isDemoMode ? 'Demo In Progress' : 'Demo'}</span>
          <Play className="w-3 h-3 fill-current ml-0.5" />
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => setActiveView('maintenance')}
          className="relative p-2 rounded-md hover:bg-slate-100 text-slate-600 border border-transparent hover:border-slate-200 transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-railway-crimson text-white font-bold text-[9px] rounded-full flex items-center justify-center shadow">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        {/* Controller Profile Badge */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-railway-blue font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden 2xl:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">S.K. Ray</div>
            <div className="text-[10px] font-semibold text-slate-500 leading-tight">Chief Controller</div>
          </div>
        </div>
      </div>
    </header>
  );
};
