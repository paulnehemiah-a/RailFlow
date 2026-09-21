import React from 'react';
import {
  Settings,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useRailFlowStore } from '../store/railflowStore';
import { DEFAULT_OPTIMIZATION_WEIGHTS } from '../services/optimizationService';

export const Configuration: React.FC = () => {
  const { optimizationWeights, setOptimizationWeights } = useRailFlowStore();

  const handleResetWeights = () => {
    setOptimizationWeights(DEFAULT_OPTIMIZATION_WEIGHTS);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Configuration & Optimization Objective Policy
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
              Advisory Planning Parameters
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Fine-tune CP-SAT solver objective weights, safety thresholds, and inter-departmental compatibility matrices.
          </p>
        </div>

        <button
          onClick={handleResetWeights}
          className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm flex items-center space-x-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Default Weights</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CP-SAT Solver Objective Weights (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-railway-blue" />
              <span className="font-bold text-sm text-slate-900">
                CP-SAT Optimization Objective Weights
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Scale: 0 – 100</span>
          </div>

          {/* Weight 1: Priority Express Protection */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <label className="font-semibold text-slate-800">Priority Express Protection Weight:</label>
              <span className="font-mono font-extrabold text-railway-blue">
                {optimizationWeights.priorityProtectionWeight} / 100
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={optimizationWeights.priorityProtectionWeight}
              onChange={(e) =>
                setOptimizationWeights({ priorityProtectionWeight: parseInt(e.target.value) })
              }
              className="w-full accent-railway-blue cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <p className="text-[10px] text-slate-500">
              Penalizes any candidate window that delays Vande Bharat or Superfast Expresses.
            </p>
          </div>

          {/* Weight 2: Train Delay Minimization */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <label className="font-semibold text-slate-800">Cumulative Passenger Delay Minimization:</label>
              <span className="font-mono font-extrabold text-railway-steel">
                {optimizationWeights.trainDelayWeight} / 100
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              value={optimizationWeights.trainDelayWeight}
              onChange={(e) =>
                setOptimizationWeights({ trainDelayWeight: parseInt(e.target.value) })
              }
              className="w-full accent-railway-steel cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <p className="text-[10px] text-slate-500">
              Prioritizes temporal slots with low background traffic density.
            </p>
          </div>

          {/* Weight 3: Task Consolidation */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <label className="font-semibold text-slate-800">Multi-Department Consolidation Incentive:</label>
              <span className="font-mono font-extrabold text-teal-700">
                {optimizationWeights.taskConsolidationWeight} / 100
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={optimizationWeights.taskConsolidationWeight}
              onChange={(e) =>
                setOptimizationWeights({ taskConsolidationWeight: parseInt(e.target.value) })
              }
              className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <p className="text-[10px] text-slate-500">
              Heavily rewards solutions that consolidate multiple departmental work orders into 1 single possession.
            </p>
          </div>

          {/* Weight 4: Resource Utilization */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <label className="font-semibold text-slate-800">Track Machine Siding Feasibility:</label>
              <span className="font-mono font-extrabold text-slate-800">
                {optimizationWeights.resourceUtilizationWeight} / 100
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={optimizationWeights.resourceUtilizationWeight}
              onChange={(e) =>
                setOptimizationWeights({ resourceUtilizationWeight: parseInt(e.target.value) })
              }
              className="w-full accent-slate-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <p className="text-[10px] text-slate-500">
              Ensures tamping machines and tower wagons have valid siding tracks for swift run-in and run-out.
            </p>
          </div>
        </div>

        {/* Safety Invariants & Operating Policy (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-sm text-slate-900">
                Hard Indian Railway Safety Invariants
              </span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Locked Rules
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">1. Non-Overlapping Working Gang Safety:</span>
              <p className="text-[11px] text-slate-600">
                Mandatory minimum 500m longitudinal clearance between Civil Gang 01 and S&T Point machine testing teams.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">2. Maximum Continuous Block Duration:</span>
              <p className="text-[11px] text-slate-600">
                Capped at 4.5 hours on double line trunk corridors to prevent rolling stock crew hours-of-employment violations.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">3. Advisory Authority Protection:</span>
              <p className="text-[11px] text-slate-600">
                RailFlow is architected with zero write-access to physical signaling or interlock hardware. Final line possession is mediated by human operating controllers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
