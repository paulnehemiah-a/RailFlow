import React from 'react';
import {
  GitCommit,
  ArrowDown,
  Train,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { useRailFlowStore } from '../../store/railflowStore';

export const DelayCascadeSimulator: React.FC = () => {
  const { delayCascade, selectedCandidateId } = useRailFlowStore();

  const isOptionA = selectedCandidateId === 'OPTION_A';
  const isOptionC = selectedCandidateId === 'OPTION_C';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-sm text-slate-900">
              Downstream Delay Cascade & Vaigai Express Impact
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
              Downstream Physics Simulated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrates secondary and tertiary signal headway propagation across Southern Railway chord line sections.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Cascade Total Delay
          </span>
          <span
            className={`text-xl font-extrabold ${
              isOptionA ? 'text-rose-600' : isOptionC ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {isOptionA ? '64 min' : isOptionC ? '40 min' : '18 min'}
          </span>
        </div>
      </div>

      {/* Visual Delay Cascade Tree Diagram */}
      <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
        {/* Origin Node: Maintenance Block Stoppage */}
        <div className="flex items-center justify-center">
          <div className="bg-railway-dark text-white px-4 py-2 rounded-lg shadow-md border border-slate-700 text-center max-w-md w-full">
            <div className="text-[10px] font-bold uppercase tracking-wider text-railway-teal">
              Originating Block Event
            </div>
            <div className="text-xs font-extrabold mt-0.5">
              {isOptionA
                ? 'Option A Block (08:30–11:00) Intercepts Morning Express Wave'
                : isOptionC
                ? 'Option C Block (14:30–17:00) Intercepts 12635 Vaigai SF Express'
                : 'Option B Coordinated Block (11:30–14:00 IST) on Villupuram–Vriddhachalam (S-VM-VRI)'}
            </div>
          </div>
        </div>

        {/* Down Arrow 1 */}
        <div className="flex flex-col items-center">
          <ArrowDown className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 my-0.5">
            Primary Line Regulation
          </span>
          <ArrowDown className="w-4 h-4 text-slate-400" />
        </div>

        {/* Level 1: First Affected Train */}
        <div className="flex items-center justify-center">
          <div
            className={`p-3 rounded-lg border shadow-sm max-w-lg w-full ${
              isOptionC
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : isOptionA
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOptionC || isOptionA ? 'bg-rose-600' : 'bg-slate-700'
                  }`}
                />
                <span className="font-extrabold text-xs">
                  {isOptionC
                    ? '🚆 12635 Vaigai Superfast Express (Priority)'
                    : isOptionA
                    ? '🚆 12606 Pallavan Superfast Express (Priority)'
                    : '56706 Villupuram–Madurai Passenger'}
                </span>
              </div>
              <span
                className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                  isOptionC || isOptionA ? 'bg-rose-600 text-white' : 'bg-slate-800 text-white'
                }`}
              >
                {isOptionC ? '+15 min Vaigai Delay' : isOptionA ? '+28 min Delay' : '+10 min Loop Regulation'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {isOptionC
                ? 'Held at Villupuram Outer Signal due to active possession on UP mainline.'
                : isOptionA
                ? 'Regulated at Vriddhachalam approach signal.'
                : 'Regulated into Villupuram Loop Line 2 to keep UP chord mainline clear for block execution.'}
            </p>
          </div>
        </div>

        {/* Down Arrow 2 */}
        <div className="flex flex-col items-center">
          <ArrowDown className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 my-0.5">
            Automatic Signalling Headway Cascade (3-Aspect Rule)
          </span>
          <ArrowDown className="w-4 h-4 text-slate-400" />
        </div>

        {/* Level 2: Second Affected Train */}
        <div className="flex items-center justify-center">
          <div
            className={`p-3 rounded-lg border shadow-sm max-w-lg w-full ${
              isOptionC
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOptionC ? 'bg-rose-600' : 'bg-railway-blue'
                  }`}
                />
                <span className="font-extrabold text-xs">
                  {isOptionC
                    ? '16127 Guruvayur Express'
                    : isOptionA
                    ? '12636 Vaigai SF Express (Up Return)'
                    : '16127 Guruvayur Express'}
                </span>
              </div>
              <span className="font-mono font-bold text-xs bg-railway-blue text-white px-2 py-0.5 rounded">
                {isOptionC ? '+16 min Delay' : isOptionA ? '+22 min Delay' : '+8 min Platform Hold'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {isOptionC
                ? 'Propagated double yellow signal aspects across 3 blocks behind delayed Vaigai Express.'
                : 'Maintains required 3km safety headway behind passenger train departure from Villupuram.'}
            </p>
          </div>
        </div>

        {/* Down Arrow 3 */}
        <div className="flex flex-col items-center">
          <ArrowDown className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 my-0.5">
            Terminal / Platform Approach Queue
          </span>
          <ArrowDown className="w-4 h-4 text-slate-400" />
        </div>

        {/* Level 3: Third Affected Train */}
        <div className="flex items-center justify-center">
          <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-sm max-w-lg w-full text-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-railway-steel" />
                <span className="font-extrabold text-xs">
                  {isOptionC ? '56706 Passenger' : isOptionA ? '56706 Passenger' : '12635 Vaigai Express (Protected)'}
                </span>
              </div>
              <span className="font-mono font-bold text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">
                {isOptionC ? '+9 min Delay' : isOptionA ? '+14 min Delay' : '0 min (100% On Time)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {isOptionC
                ? 'Held at approach to allow priority recovery.'
                : isOptionA
                ? 'Delayed departure from Villupuram to avoid congestion.'
                : 'Departs Chennai at 13:15, arrives at Villupuram at 15:30 with full green signal aspect.'}
            </p>
          </div>
        </div>
      </div>

      {/* Key Insight Footer */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between text-xs text-emerald-950">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            {isOptionC
              ? 'Option C creates an unacceptable +15m delay to 12635 Vaigai Superfast Express, violating priority constraints.'
              : 'Option B achieves 100% Vaigai Express protection: 18 min total delay absorbed entirely by ordinary passenger and regional scheduled trains without express disruption.'}
          </span>
        </div>
      </div>
    </div>
  );
};
