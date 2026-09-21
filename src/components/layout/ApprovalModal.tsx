import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Clock,
  Train,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { useRailFlowStore } from '../../store/railflowStore';
import confetti from 'canvas-confetti';

export const ApprovalModal: React.FC = () => {
  const {
    approvalModalOpen,
    setApprovalModalOpen,
    candidateToApprove,
    approveCandidateWindow,
    setActiveView,
  } = useRailFlowStore();

  const [notes, setNotes] = useState('');
  const [controllerConfirmed, setControllerConfirmed] = useState(false);

  if (!approvalModalOpen || !candidateToApprove) return null;

  const handleConfirm = () => {
    approveCandidateWindow(
      candidateToApprove,
      notes || 'Advisory block approved by Chief Controller after checking siding availability.'
    );
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setActiveView('hero-before-after');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-railway-dark to-railway-blue text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-railway-teal text-slate-900 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Confirm Maintenance Block Advisory Approval
              </h3>
              <p className="text-xs text-slate-300">
                Authorized Operating Decision Record (Section S-VM-VRI)
              </p>
            </div>
          </div>
          <button
            onClick={() => setApprovalModalOpen(false)}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          {/* Summary Banner */}
          <div className="bg-railway-lightBlue/60 border border-railway-blue/20 rounded-lg p-3.5 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-railway-blue">
                Recommended Window
              </span>
              <div className="text-base font-extrabold text-railway-dark mt-0.5">
                {candidateToApprove.name}
              </div>
              <div className="text-xs font-semibold text-railway-steel flex items-center space-x-1.5 mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{candidateToApprove.timeSlot}</span>
                <span>•</span>
                <span>{candidateToApprove.durationHours} Hours Track Occupation</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Impact Score
              </span>
              <div className="text-xl font-extrabold text-emerald-600">
                {candidateToApprove.impactScore}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                Lowest Impact
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="text-[10px] font-medium text-slate-500">Cumulative Delay</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">
                {candidateToApprove.estimatedDelayMinutes} min
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">Downstream calculated</div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="text-[10px] font-medium text-slate-500">Priority Expresses</div>
              <div className="text-sm font-bold text-emerald-700 mt-0.5">
                0 Affected
              </div>
              <div className="text-[10px] text-slate-500">12801 & 12841 protected</div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="text-[10px] font-medium text-slate-500">Consolidated Tasks</div>
              <div className="text-sm font-bold text-railway-blue mt-0.5">
                3 Departments
              </div>
              <div className="text-[10px] text-slate-500">Eng + S&T + TRD</div>
            </div>
          </div>

          {/* Tasks in this block */}
          <div className="border border-slate-200 rounded-lg p-3 space-y-1.5">
            <div className="font-semibold text-slate-800 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Wrench className="w-3.5 h-3.5 text-railway-blue" />
                <span>Consolidated Maintenance Activities (1 Coordinated Block):</span>
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
                66.7% Closure Reduction
              </span>
            </div>
            <ul className="space-y-1 text-slate-600 pl-1">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="font-mono font-bold text-slate-800">MT-ENG-041:</span>
                <span>Track Tamping & Lining (CSM-09 + Civil Gang 01)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="font-mono font-bold text-slate-800">MT-SNT-018:</span>
                <span>Point Machine 104A Overhaul (Signal Gang 01)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="font-mono font-bold text-slate-800">MT-TRD-007:</span>
                <span>25kV Catenary Inspection (Tower Wagon TW-04 + TRD Gang 01)</span>
              </li>
            </ul>
          </div>

          {/* Mandatory Human Review Checkbox */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 space-y-2">
            <label className="flex items-start space-x-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={controllerConfirmed}
                onChange={(e) => setControllerConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-railway-blue focus:ring-railway-blue"
              />
              <div className="text-[11px] text-slate-700">
                <span className="font-bold text-slate-900">
                  Controller Operational Verification:
                </span>{' '}
                I have verified resource availability at Bhadrak Siding and confirm this advisory window for execution.
              </div>
            </label>

            <input
              type="text"
              placeholder="Optional operational remarks (e.g., Bhadrak loop line 3 clear)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-railway-blue"
            />
          </div>

          <div className="text-[10px] text-slate-400 italic">
            * RailFlow logs this confirmation as an advisory planning record. Final physical line possession remains with station master token authority.
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-end space-x-3">
          <button
            onClick={() => setApprovalModalOpen(false)}
            className="px-4 py-1.5 rounded text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!controllerConfirmed}
            className="px-5 py-1.5 rounded text-xs font-bold text-white bg-railway-blue hover:bg-railway-dark disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Advisory Approval</span>
          </button>
        </div>
      </div>
    </div>
  );
};
