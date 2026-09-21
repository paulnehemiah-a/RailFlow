import React, { useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  Clock,
  Train,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Flame,
  Wrench,
  ShieldAlert,
} from 'lucide-react';
import { useRailFlowStore } from '../store/railflowStore';
import { generateEmergencyReplanWindow } from '../services/optimizationService';
import confetti from 'canvas-confetti';

export const EmergencyReplanning: React.FC = () => {
  const {
    sections,
    selectedSectionId,
    approveCandidateWindow,
    setActiveView,
  } = useRailFlowStore();

  const [isReplanned, setIsReplanned] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const emergencyCandidate = generateEmergencyReplanWindow('S-VM-VRI');

  const handleReplan = () => {
    setIsReplanned(true);
  };

  const handleConfirmEmergency = () => {
    approveCandidateWindow(
      emergencyCandidate,
      'EMERGENCY DISPATCH: Immediate 90-min rail weld fracture block authorized on S-VM-VRI. 12635 Vaigai Express protected via Villupuram loop regulation.'
    );
    setIsApproved(true);
    confetti({ particleCount: 80, spread: 60 });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Emergency Maintenance Dynamic Replanning
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
              Urgent Incident Response
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic re-solving of active corridor schedules in response to unexpected rail fractures, OHE tears, or signal lockouts.
          </p>
        </div>
      </div>

      {/* Emergency Incident Banner featuring 12635 Vaigai Express */}
      <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-rose-600 text-white rounded-lg shadow-md shrink-0">
              <Flame className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-rose-700 text-white tracking-wide">
                  CRITICAL DEFECT DETECTED
                </span>
                <span className="text-xs text-rose-800 font-bold">
                  Track Fracture on KM 165/2 (Villupuram–Vriddhachalam Chord)
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">
                Affected Priority Train: 12635 Vaigai Superfast Express
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Location: <span className="font-bold text-slate-900">Villupuram–Vriddhachalam (S-VM-VRI)</span> • Requires immediate 90-minute emergency rail joint welding before 12635 Vaigai scheduled crossing.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold text-rose-800 uppercase block">Urgency Level</span>
            <span className="text-sm font-extrabold text-rose-700 bg-white px-2 py-1 rounded border border-rose-300">
              IMMEDIATE
            </span>
          </div>
        </div>

        {/* Action button to trigger dynamic replanning */}
        {!isReplanned ? (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleReplan}
              className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>REPLAN CORRIDOR SCHEDULE (CP-SAT)</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-3 border border-rose-300 flex items-center justify-between text-xs text-rose-950 font-semibold">
            <span>✓ Dynamic CP-SAT Re-Optimization Complete: Shifted emergency possession to 10:00–11:30 IST to repair defect prior to 12635 Vaigai Express entry at Villupuram.</span>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
              Vaigai Protected ✓
            </span>
          </div>
        )}
      </div>

      {/* Replanning Comparison (Original Scheduled vs Emergency Plan) */}
      {isReplanned && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* 1. Original Scheduled Plan */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-3 opacity-80">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Original Scheduled Plan (Option B)
              </span>
              <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                Pre-Incident
              </span>
            </div>

            <div className="text-base font-extrabold text-slate-800">
              11:30 – 14:00 IST (2.5 Hours)
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Estimated Train Delay:</span>
                <span className="font-bold text-slate-800">18 min</span>
              </div>
              <div className="flex justify-between">
                <span>Vaigai SF Express:</span>
                <span className="font-bold text-emerald-700">Protected</span>
              </div>
              <div className="flex justify-between">
                <span>Incident Status:</span>
                <span className="font-bold text-rose-600">Unsafe (Leaves fracture exposed)</span>
              </div>
            </div>
          </div>

          {/* 2. Emergency Replanned Plan */}
          <div className="bg-white rounded-xl border-2 border-emerald-500 shadow-elevated p-5 space-y-3 relative">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Emergency Optimized Plan</span>
              </span>
              <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded shadow">
                Immediate Safety Window
              </span>
            </div>

            <div className="text-base font-extrabold text-slate-900">
              10:00 – 11:30 IST (1.5 Hours Urgent Window)
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 font-medium">
              <div className="flex justify-between">
                <span>Total Delay Cascade:</span>
                <span className="font-extrabold text-amber-700">27 min (Delta: +9 min)</span>
              </div>
              <div className="flex justify-between">
                <span>12635 Vaigai SF Express:</span>
                <span className="font-extrabold text-emerald-700">100% Protected (Clears before arrival)</span>
              </div>
              <div className="flex justify-between">
                <span>56706 Passenger:</span>
                <span className="font-bold text-slate-800">15 min Regulated Departure</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 italic">
                Advisory emergency proposal for Chief Controller
              </span>
              <button
                onClick={handleConfirmEmergency}
                disabled={isApproved}
                className="px-5 py-2 rounded-lg bg-railway-blue hover:bg-railway-dark text-white font-bold text-xs shadow transition flex items-center space-x-1.5 disabled:bg-emerald-700"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isApproved ? '✓ Emergency Window Enacted' : 'Authorize Emergency Window'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
