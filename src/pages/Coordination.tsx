import React from 'react';
import {
  GitMerge,
  ArrowDown,
  Wrench,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { useRailFlowStore } from '../store/railflowStore';

export const Coordination: React.FC = () => {
  const { setActiveView, startOptimization } = useRailFlowStore();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Multi-Department Maintenance Coordination Engine
            </h1>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-300">
              3 Departments → 1 Coordinated Block
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidating fragmented Civil Engineering, S&T, and Traction/OHE requests into synchronized, low-impact corridor possessions.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveView('planner');
            startOptimization();
          }}
          className="px-4 py-2 rounded-lg bg-railway-blue hover:bg-railway-dark text-white text-xs font-bold shadow transition flex items-center space-x-1.5"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Launch CP-SAT Optimizer</span>
        </button>
      </div>

      {/* Hero Visual Transformation: 3 Fragmented Blocks vs 1 Coordinated Block */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 space-y-6">
        <div className="text-center space-y-1 max-w-2xl mx-auto">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-railway-blue bg-railway-lightBlue px-3 py-1 rounded-full border border-railway-blue/20">
            Core RailFlow Breakthrough
          </span>
          <h2 className="text-lg font-extrabold text-slate-900">
            From 3 Fragmented Departmental Closures to 1 Coordinated Block
          </h2>
          <p className="text-xs text-slate-600">
            Traditional railway planning executes departmental requests in isolation, shutting down the section 3 separate times. RailFlow identifies spatial-temporal compatibility to execute all work in a single synchronized possession.
          </p>
        </div>

        {/* The Visual Comparison Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Left: Traditional Fragmented Approach */}
          <div className="p-5 rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/40 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-200 pb-2">
              <span className="text-xs font-extrabold text-rose-900 uppercase tracking-wider">
                Traditional Siloed Planning
              </span>
              <span className="text-[10px] font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded">
                3 Separate Closures
              </span>
            </div>

            {/* 3 Separate Bars */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                  <span>1. Civil Engineering Track Tamping (MT-ENG-041)</span>
                  <span className="font-bold text-rose-700">Closure 1 (2.5h)</span>
                </div>
                <div className="h-6 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                  Track Block: 08:30 – 11:00 IST
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                  <span>2. S&T Point Machine 104A Overhaul (MT-SNT-018)</span>
                  <span className="font-bold text-rose-700">Closure 2 (1.5h)</span>
                </div>
                <div className="h-6 bg-amber-500 rounded flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                  Signal Interlocking Block: 13:00 – 14:30 IST
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                  <span>3. Traction/OHE 25kV Catenary Inspection (MT-TRD-007)</span>
                  <span className="font-bold text-rose-700">Closure 3 (2.5h)</span>
                </div>
                <div className="h-6 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                  OHE Power Isolation: 15:30 – 18:00 IST
                </div>
              </div>
            </div>

            {/* Impact Penalty */}
            <div className="pt-2 border-t border-rose-200/80 space-y-1 text-xs text-rose-950 font-medium">
              <div className="flex justify-between">
                <span>Total Section Occupation:</span>
                <span className="font-bold">6.5 Hours</span>
              </div>
              <div className="flex justify-between">
                <span>Cumulative Passenger Delay:</span>
                <span className="font-bold text-rose-700">64 min (5 trains)</span>
              </div>
              <div className="flex justify-between">
                <span>Priority Express Conflicts:</span>
                <span className="font-bold text-rose-700">2 (Purushottam & Coromandel)</span>
              </div>
            </div>
          </div>

          {/* Right: RailFlow Coordinated Solution */}
          <div className="p-5 rounded-xl border-2 border-teal-500 bg-teal-50/40 space-y-4 shadow-sm relative">
            <div className="flex items-center justify-between border-b border-teal-200 pb-2">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-extrabold text-teal-950 uppercase tracking-wider">
                  RailFlow Coordinated Solution
                </span>
              </div>
              <span className="text-[10px] font-extrabold bg-teal-600 text-white px-2.5 py-0.5 rounded shadow">
                1 Synchronized Block
              </span>
            </div>

            {/* 1 Synchronized Block Bar */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-teal-300 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold text-teal-900">
                  <span>Coordinated Window: Option B</span>
                  <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-mono">
                    11:30 – 14:00 IST (2.5h)
                  </span>
                </div>

                <div className="h-10 bg-[#123B5D] hover:bg-[#0F324F] rounded-lg flex items-center justify-center text-white font-semibold text-xs shadow-sm border border-[#0D304D] tracking-wide">
                  ONE SINGLE MULTI-DEPARTMENT BLOCK
                </div>

                <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-semibold pt-1">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded">
                    Track Gang 01 (CSM-09)
                  </span>
                  <span className="bg-amber-100 text-amber-800 p-1 rounded">
                    Signal Gang 01 (ST-01)
                  </span>
                  <span className="bg-purple-100 text-purple-800 p-1 rounded">
                    TRD Gang 01 (TW-04)
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits Metrics */}
            <div className="pt-2 border-t border-teal-200 space-y-1 text-xs text-teal-950 font-medium">
              <div className="flex justify-between">
                <span>Total Section Possession:</span>
                <span className="font-extrabold text-teal-800">2.5 Hours (61.5% Uptime Saved)</span>
              </div>
              <div className="flex justify-between">
                <span>Cumulative Train Delay:</span>
                <span className="font-extrabold text-teal-800">18 min (71.9% Delay Reduction)</span>
              </div>
              <div className="flex justify-between">
                <span>Priority Express Conflicts:</span>
                <span className="font-extrabold text-teal-800">0 (100% Protection)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compatibility Rules Engine Explanation */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <div className="font-bold text-slate-900 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-railway-blue" />
            <span>Multi-Department Safety Compatibility Rule Validation:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-600">
            <div className="p-2.5 bg-white rounded border border-slate-200">
              <span className="font-bold text-slate-800 block">1. Track & OHE Safety Clearance</span>
              <span>Track tamping machine CSM-09 safely operates under 25kV de-energized catenary without mast vibration hazards.</span>
            </div>
            <div className="p-2.5 bg-white rounded border border-slate-200">
              <span className="font-bold text-slate-800 block">2. Signal Point & Track Interlock</span>
              <span>Point Machine 104A throw testing synchronized with tamping run-over to verify sensor reconnection.</span>
            </div>
            <div className="p-2.5 bg-white rounded border border-slate-200">
              <span className="font-bold text-slate-800 block">3. Power Block Consolidation</span>
              <span>Eliminates 2 redundant traction power shut-down notices to ECoR State Load Dispatch Centre (SLDC).</span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              setActiveView('planner');
              startOptimization();
            }}
            className="px-6 py-2.5 rounded-lg bg-railway-blue hover:bg-railway-dark text-white text-xs font-bold shadow-md transition flex items-center space-x-2"
          >
            <span>Proceed to Optimal Block Scheduling</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
