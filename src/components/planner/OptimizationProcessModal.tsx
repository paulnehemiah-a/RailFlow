import React from 'react';
import {
  CheckCircle2,
  Loader2,
  Sliders,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { OPTIMIZATION_STAGES, useRailFlowStore } from '../../store/railflowStore';

export const OptimizationProcessModal: React.FC = () => {
  const { isOptimizing, optimizationStage, resetOptimization } = useRailFlowStore();

  if (!isOptimizing) return null;

  const currentStageInfo = OPTIMIZATION_STAGES[optimizationStage] || OPTIMIZATION_STAGES[0];
  const progressPercent = Math.round(
    ((optimizationStage + 1) / OPTIMIZATION_STAGES.length) * 100
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-railway-dark to-railway-blue text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-railway-teal text-slate-900 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white tracking-wide">
                OR-Tools CP-SAT Solver in Progress
              </h3>
              <p className="text-xs text-slate-300">
                Evaluating 12 Candidate Permutations on Bhadrak–Jajpur Section
              </p>
            </div>
          </div>
          <span className="font-mono text-sm font-extrabold text-railway-teal bg-white/10 px-2.5 py-1 rounded">
            {progressPercent}%
          </span>
        </div>

        {/* Live Progress Bar */}
        <div className="w-full bg-slate-100 h-2">
          <div
            className="bg-railway-teal h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          {/* Current Active Stage Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center space-x-3">
            <Loader2 className="w-5 h-5 text-railway-blue animate-spin shrink-0" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-railway-blue">
                Active Optimization Phase
              </div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                {currentStageInfo.label}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {currentStageInfo.description}
              </div>
            </div>
          </div>

          {/* Detailed Stages Checklist */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {OPTIMIZATION_STAGES.map((stage, idx) => {
              const isCompleted = idx < optimizationStage;
              const isCurrent = idx === optimizationStage;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-3 py-1.5 rounded text-[11px] transition-all ${
                    isCurrent
                      ? 'bg-railway-lightBlue/80 font-bold text-railway-blue border border-railway-blue/30'
                      : isCompleted
                      ? 'text-slate-700 font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 text-railway-blue animate-spin shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shrink-0" />
                    )}
                    <span>{stage.label}</span>
                  </div>

                  <span className="text-[9px] uppercase tracking-wider font-mono">
                    {isCompleted ? 'VERIFIED' : isCurrent ? 'SOLVING' : 'QUEUED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
          <span>Applying Indian Railway Section Working Rules (SWR)</span>
          <button
            onClick={resetOptimization}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
          >
            Cancel Solver
          </button>
        </div>
      </div>
    </div>
  );
};
