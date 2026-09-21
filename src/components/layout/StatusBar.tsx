import React from 'react';
import { Shield, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { useRailFlowStore } from '../../store/railflowStore';

export const StatusBar: React.FC = () => {
  const { dataQuality, isOptimizing } = useRailFlowStore();

  return (
    <footer className="h-8 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-600 shrink-0 select-none z-20">
      {/* Left: Core Safety & Advisory Disclaimer */}
      <div className="flex items-center space-x-2 truncate">
        <Shield className="w-3.5 h-3.5 text-railway-blue shrink-0" />
        <span className="font-semibold text-slate-700">Advisory Decision Support:</span>
        <span className="text-slate-500 truncate">
          RailFlow generates constraint-validated recommendations. Final authorization remains with Section & Chief Controllers.
        </span>
      </div>

      {/* Right: Operational Health & Trust Metadata */}
      <div className="hidden sm:flex items-center space-x-4 shrink-0 pl-3">
        <div className="flex items-center space-x-1">
          <Database className="w-3 h-3 text-slate-400" />
          <span>Data Quality:</span>
          <span className="font-bold text-emerald-700">{dataQuality.overallScore}%</span>
        </div>

        <div className="flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>CP-SAT Engine:</span>
          <span className="font-semibold text-slate-700">{isOptimizing ? 'Solving...' : 'Optimal Ready'}</span>
        </div>

        <div className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Simulated Prototype Environment
        </div>
      </div>
    </footer>
  );
};
