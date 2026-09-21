import React from 'react';
import {
  Layers,
  Sliders,
  Sparkles,
  RotateCcw,
  Clock,
  Train,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ArrowRight,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { useRailFlowStore } from '../store/railflowStore';
import { WhatIfParameters } from '../services/optimizationService';

export const ScenarioAnalysis: React.FC = () => {
  const {
    whatIfParams,
    setWhatIfParams,
    whatIfResult,
    candidateWindows,
    setActiveView,
  } = useRailFlowStore();

  const baselineCandidate = candidateWindows.find((c) => c.id === 'OPTION_B') || candidateWindows[1];

  const handleResetToBaseline = () => {
    setWhatIfParams({
      blockStartTime: '11:30',
      blockDurationHours: 2.5,
      trafficMultiplier: 1.0,
      protectPriorityTrains: true,
      requireNoTSR: true,
      activeDepartments: { engineering: true, snt: true, trd: true },
    });
  };

  const handleApplyPreset = (preset: 'vaigai' | 'peak' | 'night' | 'afternoon') => {
    switch (preset) {
      case 'vaigai':
        setWhatIfParams({
          blockStartTime: '11:30',
          blockDurationHours: 2.5,
          trafficMultiplier: 1.0,
          protectPriorityTrains: true,
        });
        break;
      case 'afternoon':
        setWhatIfParams({
          blockStartTime: '14:30',
          blockDurationHours: 2.5,
          trafficMultiplier: 1.0,
          protectPriorityTrains: false,
        });
        break;
      case 'peak':
        setWhatIfParams({
          blockStartTime: '08:30',
          blockDurationHours: 2.5,
          trafficMultiplier: 1.3,
          protectPriorityTrains: true,
        });
        break;
      case 'night':
        setWhatIfParams({
          blockStartTime: '01:30',
          blockDurationHours: 3.0,
          trafficMultiplier: 0.6,
          protectPriorityTrains: true,
        });
        break;
    }
  };

  const isWorse = whatIfResult.statusComparison === 'WORSE';
  const isBetter = whatIfResult.statusComparison === 'BETTER';
  const isVaigaiIntersected =
    parseFloat(whatIfParams.blockStartTime.split(':')[0]) +
      parseFloat(whatIfParams.blockStartTime.split(':')[1]) / 60 >=
      14.0 &&
    parseFloat(whatIfParams.blockStartTime.split(':')[0]) <= 16.5;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Scenario Analysis & What-If Simulator
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300">
              Interactive Stress-Testing
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate alternative block windows, peak passenger traffic surges, and Vaigai Express protection trade-offs in real time.
          </p>
        </div>

        {/* Quick Scenario Presets */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleApplyPreset('vaigai')}
            className="px-3 py-1.5 rounded-md text-xs font-extrabold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 shadow-sm transition flex items-center space-x-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Protect Vaigai Express</span>
          </button>
          <button
            onClick={() => handleApplyPreset('afternoon')}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm transition"
          >
            Afternoon (Vaigai Conflict)
          </button>
          <button
            onClick={() => handleApplyPreset('peak')}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm transition"
          >
            Peak Traffic (1.3x)
          </button>
          <button
            onClick={handleResetToBaseline}
            className="px-3 py-1.5 rounded-md text-xs font-bold text-railway-blue hover:bg-slate-100 border border-railway-blue/30 transition flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Controls (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-railway-blue" />
              <span className="font-bold text-sm text-slate-900">
                What-If Simulation Parameters
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Real-Time Solver</span>
          </div>

          {/* 1. Block Start Time Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700">Block Start Time:</label>
              <span className="font-mono font-extrabold text-sm text-railway-blue bg-railway-lightBlue px-2.5 py-0.5 rounded border border-railway-blue/20">
                {whatIfParams.blockStartTime} IST
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="22"
              step="0.5"
              value={
                parseInt(whatIfParams.blockStartTime.split(':')[0]) +
                (parseInt(whatIfParams.blockStartTime.split(':')[1]) === 30 ? 0.5 : 0)
              }
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                const h = Math.floor(val);
                const m = val % 1 === 0.5 ? '30' : '00';
                setWhatIfParams({ blockStartTime: `${String(h).padStart(2, '0')}:${m}` });
              }}
              className="w-full accent-railway-blue cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>06:00</span>
              <span className="text-teal-700 font-bold">11:30 (Option B)</span>
              <span className="text-rose-600 font-bold">15:30 (Vaigai Crosses)</span>
              <span>22:00</span>
            </div>
          </div>

          {/* 2. Block Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700">Required Block Duration:</label>
              <span className="font-mono font-extrabold text-sm text-railway-steel bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                {whatIfParams.blockDurationHours} Hours
              </span>
            </div>
            <input
              type="range"
              min="1.5"
              max="5.0"
              step="0.5"
              value={whatIfParams.blockDurationHours}
              onChange={(e) =>
                setWhatIfParams({ blockDurationHours: parseFloat(e.target.value) })
              }
              className="w-full accent-railway-steel cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1.5h (Emergency Patch)</span>
              <span>2.5h (Standard 3-in-1)</span>
              <span>5.0h (Major Overhaul)</span>
            </div>
          </div>

          {/* 3. Traffic Density Multiplier */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700">Corridor Traffic Density:</label>
              <span
                className={`font-mono font-extrabold text-sm px-2.5 py-0.5 rounded border ${
                  whatIfParams.trafficMultiplier > 1.0
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {whatIfParams.trafficMultiplier}x Normal Density
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={whatIfParams.trafficMultiplier}
              onChange={(e) =>
                setWhatIfParams({ trafficMultiplier: parseFloat(e.target.value) })
              }
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Priority Policy */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={whatIfParams.protectPriorityTrains}
                onChange={(e) =>
                  setWhatIfParams({ protectPriorityTrains: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-railway-blue focus:ring-railway-blue"
              />
              <span className="font-semibold text-slate-800">
                Hard Constraint: 100% Protection for 12635 Vaigai Superfast Express
              </span>
            </label>
          </div>
        </div>

        {/* Right: Live Delta Comparison (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-slate-900">
                Live Scenario Delta Comparison
              </span>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                  isWorse
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : isBetter
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {isWorse ? 'Suboptimal (Higher Delay)' : isBetter ? 'Lower Disruption' : 'Comparable Impact'}
              </span>
            </div>

            {/* Side-by-side metric comparison */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Baseline (Option B) */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Current Baseline (Option B)
                </span>
                <div className="text-xs font-bold text-slate-800">
                  {baselineCandidate.timeSlot}
                </div>
                <div className="pt-2 space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Vaigai Status:</span>
                    <span className="font-bold text-emerald-700">✓ Protected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Train Delay:</span>
                    <span className="font-bold text-emerald-700">18 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority Conflicts:</span>
                    <span className="font-bold text-emerald-700">0 Trains</span>
                  </div>
                </div>
              </div>

              {/* What-If Customized Scenario */}
              <div
                className={`p-3 rounded-lg border space-y-1 ${
                  isWorse
                    ? 'bg-rose-50/70 border-rose-300'
                    : isBetter
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Custom Scenario
                </span>
                <div className="text-xs font-extrabold text-slate-900">
                  {whatIfResult.candidateWindow.timeSlot}
                </div>
                <div className="pt-2 space-y-1 text-[11px] text-slate-800 font-semibold">
                  <div className="flex justify-between">
                    <span>Vaigai Status:</span>
                    <span
                      className={`font-extrabold ${
                        isVaigaiIntersected ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      {isVaigaiIntersected ? '⚠ Regulated (+15m)' : '✓ Protected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Train Delay:</span>
                    <span
                      className={`font-extrabold ${
                        whatIfResult.deltaDelayMinutes > 0 ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      {whatIfResult.candidateWindow.estimatedDelayMinutes} min (
                      {whatIfResult.deltaDelayMinutes >= 0 ? '+' : ''}
                      {whatIfResult.deltaDelayMinutes}m)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority Conflicts:</span>
                    <span
                      className={`font-extrabold ${
                        whatIfResult.deltaPriorityConflicts > 0 ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      {whatIfResult.candidateWindow.priorityTrainsAffected} Affected
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Operational Verdict */}
            <div
              className={`p-3.5 rounded-lg border space-y-1 text-xs ${
                isWorse
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-teal-50 border-teal-300 text-teal-950'
              }`}
            >
              <div className="font-bold flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-railway-blue" />
                <span>RailFlow Advisory Verdict:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {isVaigaiIntersected
                  ? 'Option B remains strictly preferable: Scheduling maintenance in the afternoon directly delays 12635 Vaigai Superfast Express by 15 minutes, propagating red signal cascades into Madurai.'
                  : whatIfResult.aiVerdict}
              </p>
            </div>

            {/* Action Footer */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setActiveView('planner')}
                className="px-4 py-2 rounded-lg bg-railway-blue hover:bg-railway-dark text-white text-xs font-bold shadow transition flex items-center space-x-1.5"
              >
                <span>Return to Optimal Block Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
