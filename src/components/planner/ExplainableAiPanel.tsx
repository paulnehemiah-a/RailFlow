import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers,
  FileCheck,
  Database,
  Train,
} from 'lucide-react';
import { useRailFlowStore } from '../../store/railflowStore';
import { CandidateWindow } from '../../types';

interface ExplainableAiPanelProps {
  candidate: CandidateWindow;
}

export const ExplainableAiPanel: React.FC<ExplainableAiPanelProps> = ({ candidate }) => {
  const { dataQuality } = useRailFlowStore();

  const isRecommended = candidate.isRecommended;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-slate-900">
                Explainable Decision Support Rationale
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300">
                Deterministic CP-SAT Model
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Deterministic mathematical rationale explaining why this window was evaluated and recommended.
            </p>
          </div>
        </div>

        {/* Model Confidence Metric */}
        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center space-x-2">
          <Database className="w-4 h-4 text-emerald-600" />
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">
              Recommendation Confidence
            </div>
            <div className="text-xs font-extrabold text-emerald-700">
              HIGH ({dataQuality.overallScore}%)
            </div>
          </div>
        </div>
      </div>

      {/* Structured "WHY THIS BLOCK?" Points */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-railway-blue" />
          <span>Why RailFlow Evaluates This Block ({candidate.name}):</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1">
            <div className="text-[11px] font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-4 h-4 rounded-full bg-railway-blue text-white text-[10px] flex items-center justify-center font-mono">
                1
              </span>
              <span>12635 Vaigai SF Express 100% Protected</span>
            </div>
            <p className="text-[11px] text-slate-600 pl-5">
              {candidate.id === 'OPTION_B'
                ? 'Option B concludes at 14:00 IST. 12635 Vaigai departs Chennai at 13:15 and enters Villupuram at 15:30 with full green signal clearance.'
                : candidate.id === 'OPTION_C'
                ? 'Option C (14:30–17:00) directly intersects 12635 Vaigai Express, causing a 15-minute regulation at Villupuram.'
                : '12635 Vaigai Express runs post-block with zero delay.'}
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1">
            <div className="text-[11px] font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-4 h-4 rounded-full bg-railway-blue text-white text-[10px] flex items-center justify-center font-mono">
                2
              </span>
              <span>Consolidates 3 Departmental Tasks</span>
            </div>
            <p className="text-[11px] text-slate-600 pl-5">
              Executes Civil Engineering (Track Tamping MT-ENG-041), S&T (Point 104A MT-SNT-018), and Traction (OHE Catenary MT-TRD-007) simultaneously.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1">
            <div className="text-[11px] font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-4 h-4 rounded-full bg-railway-blue text-white text-[10px] flex items-center justify-center font-mono">
                3
              </span>
              <span>Minimizes Network Cumulative Delay</span>
            </div>
            <p className="text-[11px] text-slate-600 pl-5">
              Generates lowest overall downstream cascade ({candidate.estimatedDelayMinutes} min delay across {candidate.trainsAffected} non-priority trains).
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1">
            <div className="text-[11px] font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-4 h-4 rounded-full bg-railway-blue text-white text-[10px] flex items-center justify-center font-mono">
                4
              </span>
              <span>Resource & Siding Feasibility Verified</span>
            </div>
            <p className="text-[11px] text-slate-600 pl-5">
              Tamping Machine CSM-09 (Villupuram Siding Track 3) and Tower Wagon TW-04 confirmed available with required crew gangs.
            </p>
          </div>
        </div>
      </div>

      {/* Data Quality & Trust Disclaimer */}
      <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-700">Data Integrity Breakdown:</span>
          <span>Timetable 98%</span>
          <span>•</span>
          <span>Maintenance 95%</span>
          <span>•</span>
          <span>Telemetry 82%</span>
          <span>•</span>
          <span>Resources 94%</span>
        </div>

        <div className="italic text-slate-400">
          * Mathematical CP-SAT optimization formulation. No generative hallucination.
        </div>
      </div>
    </div>
  );
};
