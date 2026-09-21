import React from 'react';
import {
  Clock,
  Train,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  Check,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CandidateWindow } from '../../types';

interface CandidateCardProps {
  candidate: CandidateWindow;
  isSelected: boolean;
  onSelect: () => void;
  onApprove: (candidate: CandidateWindow) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected,
  onSelect,
  onApprove,
}) => {
  const isRecommended = candidate.isRecommended;

  const getImpactBadge = () => {
    switch (candidate.overallImpactLevel) {
      case 'LOW':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'HIGH COMPLEXITY':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const isVaigaiConflict = candidate.vaigaiImpactStatus === 'CONFLICT' || candidate.id === 'OPTION_C';

  return (
    <div
      onClick={onSelect}
      className={`rounded-xl border transition-all cursor-pointer relative overflow-hidden bg-white ${
        isSelected
          ? 'border-2 border-railway-blue shadow-elevated ring-2 ring-railway-blue/10'
          : 'border-slate-200 hover:border-slate-300 shadow-card hover:shadow-elevated'
      }`}
    >
      {/* Top recommendation banner */}
      {isRecommended && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-extrabold px-3.5 py-1 flex items-center justify-between tracking-wide">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>RECOMMENDED BY CP-SAT OPTIMIZER</span>
          </div>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-bold">
            12635 Vaigai Protected ✓
          </span>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-slate-900">{candidate.name}</span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${getImpactBadge()}`}
              >
                {candidate.overallImpactLevel} IMPACT
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 mt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{candidate.timeSlot}</span>
              <span>({candidate.durationHours}h continuous)</span>
            </div>
          </div>

          {/* Impact Score Badge */}
          <div className="text-right">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Impact Score
            </span>
            <div
              className={`text-xl font-extrabold ${
                candidate.impactScore <= 30
                  ? 'text-emerald-600'
                  : candidate.impactScore <= 60
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {candidate.impactScore}
              <span className="text-xs text-slate-400 font-normal">/100</span>
            </div>
          </div>
        </div>

        {/* Vaigai Express Protection Callout Banner */}
        <div
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-between ${
            !isVaigaiConflict
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-rose-50 text-rose-900 border-rose-300 animate-pulse'
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <Train className="w-3.5 h-3.5 shrink-0 text-current" />
            <span>12635 Vaigai SF Exp:</span>
          </div>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
              !isVaigaiConflict ? 'bg-emerald-200 text-emerald-950' : 'bg-rose-600 text-white'
            }`}
          >
            {!isVaigaiConflict ? '✓ Protected (0 Min Delay)' : '⚠ Direct Conflict (+15m)'}
          </span>
        </div>

        {/* 4-Item Operational Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium block">Est. Delay</span>
            <span
              className={`font-bold text-sm ${
                candidate.estimatedDelayMinutes <= 20
                  ? 'text-emerald-700'
                  : candidate.estimatedDelayMinutes <= 45
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {candidate.estimatedDelayMinutes} min
            </span>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium block">Priority Trains</span>
            <span
              className={`font-bold text-sm ${
                candidate.priorityTrainsAffected === 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {candidate.priorityTrainsAffected} Affected
            </span>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium block">Trains Total</span>
            <span className="font-bold text-slate-800 text-sm">
              {candidate.trainsAffected}
            </span>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium block">TSR Required</span>
            <span
              className={`font-bold text-xs ${
                candidate.speedRestrictionRequired ? 'text-amber-700' : 'text-slate-600'
              }`}
            >
              {candidate.speedRestrictionRequired ? '⚠️ 45 km/h' : '✓ None'}
            </span>
          </div>
        </div>

        {/* Rejection / Concern warnings if not recommended */}
        {!isRecommended && candidate.rejectedReasons && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-2 text-rose-900 space-y-0.5 text-[11px]">
            <div className="font-bold flex items-center space-x-1 text-[10px]">
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              <span>Why is this window suboptimal?</span>
            </div>
            <ul className="list-disc list-inside text-[10px] text-rose-800">
              {candidate.rejectedReasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Rationale if recommended */}
        {isRecommended && (
          <div className="bg-teal-50/80 border border-teal-200 rounded-md p-2 text-teal-900 space-y-0.5 text-[11px]">
            <div className="font-bold flex items-center space-x-1 text-[10px]">
              <ShieldCheck className="w-3 h-3 text-teal-600" />
              <span>Why this window is recommended:</span>
            </div>
            <p className="text-[10px] text-teal-950">
              {candidate.rationale[1]}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`text-xs font-semibold px-3 py-1.5 rounded transition ${
              isSelected
                ? 'bg-slate-100 text-slate-800 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {isSelected ? '✓ Window Active' : 'Inspect Impact'}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onApprove(candidate);
            }}
            className={`px-3.5 py-1.5 rounded text-xs font-bold transition flex items-center space-x-1 shadow-sm ${
              isRecommended
                ? 'bg-railway-blue hover:bg-railway-dark text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            <span>{isRecommended ? 'Approve Recommendation' : 'Select Alternative'}</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
