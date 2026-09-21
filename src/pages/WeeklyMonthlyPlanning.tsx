import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Wrench,
  GitMerge,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useRailFlowStore } from '../store/railflowStore';

export const WeeklyMonthlyPlanning: React.FC = () => {
  const { setActiveView, startOptimization } = useRailFlowStore();
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  const daysOfWeek = ['Monday (25 Aug)', 'Tuesday (26 Aug)', 'Wednesday (27 Aug - Today)', 'Thursday (28 Aug)', 'Friday (29 Aug)', 'Saturday (30 Aug)', 'Sunday (31 Aug)'];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Weekly & Monthly Maintenance Horizon Planning
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300">
              Horizon View
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Medium and long-range multi-department track occupation schedules and recurring periodic block slots.
          </p>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center space-x-3">
          <div className="bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold flex items-center shadow-sm">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-md transition ${
                viewMode === 'weekly' ? 'bg-railway-blue text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Weekly Gantt
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded-md transition ${
                viewMode === 'monthly' ? 'bg-railway-blue text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Monthly Calendar
            </button>
          </div>

          <button
            onClick={() => {
              setActiveView('coordination');
            }}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow flex items-center space-x-1.5 transition"
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Find Consolidation Opportunities</span>
          </button>
        </div>
      </div>

      {/* 1. WEEKLY GANTT VIEW */}
      {viewMode === 'weekly' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900">Current Week Timeline (25 Aug – 31 Aug 2026)</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">
                Khurda Division Mainline
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] text-slate-600">
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
                <span>Civil Engineering</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                <span>S&T Signals</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded bg-purple-600 inline-block" />
                <span>Traction/OHE</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded bg-teal-600 inline-block" />
                <span>Coordinated 3-in-1</span>
              </span>
            </div>
          </div>

          {/* Weekly Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[750px] space-y-3">
              {/* Day Columns Header */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200">
                {daysOfWeek.map((d, i) => (
                  <div key={i} className={i === 2 ? 'text-railway-blue font-extrabold' : ''}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Department Rows */}
              <div className="space-y-2 text-xs">
                {/* Civil Engineering Row */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold text-blue-900 text-[11px] uppercase tracking-wider block">
                    Civil Engineering (P-Way)
                  </span>
                  <div className="grid grid-cols-7 gap-2">
                    <div className="p-1.5 bg-blue-100/70 rounded border border-blue-200 text-[10px] font-semibold text-blue-900">
                      S-KGP-BLS Tamping (2h)
                    </div>
                    <div className="p-1.5 bg-slate-100 rounded text-[10px] text-slate-400 text-center">
                      --
                    </div>
                    {/* Wednesday Hero Coordinated Slot */}
                    <div className="p-1.5 bg-teal-100 rounded border border-teal-400 text-[10px] font-bold text-teal-900 shadow-sm">
                      ⚡ S-BHC-JJKR Tamping (Option B)
                    </div>
                    <div className="p-1.5 bg-slate-100 rounded text-[10px] text-slate-400 text-center">
                      --
                    </div>
                    <div className="p-1.5 bg-blue-100/70 rounded border border-blue-200 text-[10px] font-semibold text-blue-900">
                      S-CTC-BBS Rail Weld (2h)
                    </div>
                    <div className="p-1.5 bg-slate-100 rounded text-[10px] text-slate-400 text-center">
                      --
                    </div>
                    <div className="p-1.5 bg-slate-100 rounded text-[10px] text-slate-400 text-center">
                      --
                    </div>
                  </div>
                </div>

                {/* S&T Row */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold text-amber-900 text-[11px] uppercase tracking-wider block">
                    Signal & Telecom (S&T)
                  </span>
                  <div className="grid grid-cols-7 gap-2">
                    <div className="p-1.5 bg-slate-100 rounded text-[10px] text-slate-400 text-center">
                      --
                    </div>
                    <div className="p-1.5 bg-amber-100/70 rounded border border-amber-200 text-[10px] font-semibold text-amber-900">
                      BLS Axle Counter (1h)
                    </div>
                    {/* Wednesday Coordinated Slot */}
                    <div className="p-1.5 bg-teal-100 rounded border border-teal-400 text-[10px] font-bold text-teal-900 shadow-sm">
                      ⚡ S-BHC-JJKR Point 104A (Option B)
                    </div>
                    <div className="p-1.5 bg-slate-100 rounded text-[10px] text-slate-400 text-center">
                      --
                    </div>
                    <div className="p-1.5 bg-slate-100 rounded text-[10px] text-slate-400 text-center">
                      --
                    </div>
                    <div className="p-1.5 bg-amber-100/70 rounded border border-amber-200 text-[10px] font-semibold text-amber-900">
                      CTC Interlocking Test
                    </div>
                    <div className="p-1.5 bg-slate-100 rounded text-[10px] text-slate-400 text-center">
                      --
                    </div>
                  </div>
                </div>

                {/* Traction / OHE Row */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold text-purple-900 text-[11px] uppercase tracking-wider block">
                    Traction Distribution (TRD / OHE)
                  </span>
                  <div className="grid grid-cols-7 gap-2">
                    <div className="p-1.5 bg-slate-100 rounded text-[10px] text-slate-400 text-center">
                      --
                    </div>
                    <div className="p-1.5 bg-slate-100 rounded text-[10px] text-slate-400 text-center">
                      --
                    </div>
                    {/* Wednesday Coordinated Slot */}
                    <div className="p-1.5 bg-teal-100 rounded border border-teal-400 text-[10px] font-bold text-teal-900 shadow-sm">
                      ⚡ S-BHC-JJKR Catenary (Option B)
                    </div>
                    <div className="p-1.5 bg-purple-100/70 rounded border border-purple-200 text-[10px] font-semibold text-purple-900">
                      S-JJKR-CTC Insulator (2.5h)
                    </div>
                    <div className="p-1.5 bg-slate-100 rounded text-[10px] text-slate-400 text-center">
                      --
                    </div>
                    <div className="p-1.5 bg-slate-100 rounded text-[10px] text-slate-400 text-center">
                      --
                    </div>
                    <div className="p-1.5 bg-slate-100 rounded text-[10px] text-slate-400 text-center">
                      --
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MONTHLY CALENDAR VIEW */}
      {viewMode === 'monthly' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
            <span className="font-extrabold text-sm text-slate-900">August 2026 Maintenance Calendar</span>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
                14 Planned Blocks
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                9 Approved
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isToday = day === 27;
              const hasBlock = [3, 9, 15, 20, 26, 27, 30].includes(day);

              return (
                <div
                  key={day}
                  className={`h-24 p-2 rounded-lg border flex flex-col justify-between transition ${
                    isToday
                      ? 'border-2 border-railway-blue bg-railway-lightBlue/40 shadow-sm'
                      : hasBlock
                      ? 'border-slate-200 bg-slate-50/80'
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-mono font-bold text-xs ${isToday ? 'text-railway-blue font-extrabold' : 'text-slate-700'}`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-[9px] bg-railway-blue text-white px-1 rounded font-bold">
                        Today
                      </span>
                    )}
                  </div>

                  {hasBlock && (
                    <div className="text-[9px] bg-white p-1 rounded border border-slate-200 text-slate-700 leading-tight">
                      {day === 27 ? (
                        <span className="text-teal-800 font-extrabold">⚡ 3-in-1 Block (Option B)</span>
                      ) : (
                        <span>Periodic Track/OHE</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
