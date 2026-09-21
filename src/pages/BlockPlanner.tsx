import React from 'react';
import {
  Sliders,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Train,
  Wrench,
  Layers,
  ArrowRight,
  GitMerge,
  Cpu,
} from 'lucide-react';
import { useRailFlowStore } from '../store/railflowStore';
import { CandidateCard } from '../components/planner/CandidateCard';
import { TrainImpactGantt } from '../components/planner/TrainImpactGantt';
import { DelayCascadeSimulator } from '../components/planner/DelayCascadeSimulator';
import { ExplainableAiPanel } from '../components/planner/ExplainableAiPanel';
import { ResourceAvailabilityPanel } from '../components/planner/ResourceAvailabilityPanel';
import { OptimizationProcessModal } from '../components/planner/OptimizationProcessModal';
import { CandidateWindow } from '../types';

export const BlockPlanner: React.FC = () => {
  const {
    sections,
    selectedSectionId,
    candidateWindows,
    selectedCandidateId,
    setSelectedCandidateId,
    startOptimization,
    setApprovalModalOpen,
    setCandidateToApprove,
    setActiveView,
  } = useRailFlowStore();

  const activeSection = sections.find((s) => s.id === selectedSectionId) || sections[2];
  const activeCandidate =
    candidateWindows.find((c) => c.id === selectedCandidateId) || candidateWindows[1];

  const handleApprove = (candidate: CandidateWindow) => {
    setCandidateToApprove(candidate);
    setApprovalModalOpen(true);
  };

  return (
    <div className="p-6 pb-40 space-y-6 max-w-7xl mx-auto">
      {/* Header & Primary Optimization Action Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-lg bg-railway-blue text-white flex items-center justify-center font-bold">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Maintenance Block Planner & Decision Support
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-300">
                  3 Activities Pending
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Section: <span className="font-bold text-slate-800">{activeSection.name}</span> ({activeSection.id}) • Engineering • S&T • Traction/OHE
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Button: "FIND OPTIMAL BLOCK WINDOW" */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView('scenarios')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            What-If Simulator
          </button>

          <button
            onClick={startOptimization}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-railway-blue to-railway-dark hover:from-railway-dark hover:to-railway-blue text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-railway-teal animate-pulse" />
            <span>FIND OPTIMAL BLOCK WINDOW</span>
          </button>
        </div>
      </div>

      {/* 1. Candidate Block Windows Grid (Option A, Option B [Recommended], Option C) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Evaluated Candidate Block Windows
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              (CP-SAT Solved across 24h Timetable Horizon)
            </span>
          </div>
          <span className="text-[11px] font-bold text-railway-blue bg-railway-lightBlue px-2 py-0.5 rounded">
            Option B Recommended
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {candidateWindows.map((cand) => (
            <CandidateCard
              key={cand.id}
              candidate={cand}
              isSelected={cand.id === selectedCandidateId}
              onSelect={() => setSelectedCandidateId(cand.id)}
              onApprove={handleApprove}
            />
          ))}
        </div>
      </div>

      {/* 2. Interactive Train Impact Gantt Chart (Marey diagram) */}
      <TrainImpactGantt selectedCandidate={activeCandidate} />

      {/* 3. Downstream Delay Cascade Propagation Model */}
      <DelayCascadeSimulator />

      {/* 4. Explainable AI Decision Support Panel ("WHY THIS BLOCK?") */}
      <ExplainableAiPanel candidate={activeCandidate} />

      {/* 5. Resource Feasibility & Staging Panel */}
      <ResourceAvailabilityPanel />

      {/* Bottom Floating Advisory Action Bar */}
      <div className="sticky bottom-10 z-20 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-popover p-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900">
                Selected Advisory Decision: {activeCandidate.name} ({activeCandidate.timeSlot})
              </span>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                Impact Score: {activeCandidate.impactScore}/100
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Cumulative delay: {activeCandidate.estimatedDelayMinutes}m • 0 priority express conflicts • 3 departments consolidated.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView('hero-before-after')}
            className="px-4 py-2 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            View Decision Audit History
          </button>
          <button
            onClick={() => handleApprove(activeCandidate)}
            className="px-6 py-2 rounded-lg bg-railway-blue hover:bg-railway-dark text-white text-xs font-bold shadow-md transition flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Approve Advisory Block</span>
          </button>
        </div>
      </div>

      {/* Processing Solver Simulation Modal */}
      <OptimizationProcessModal />
    </div>
  );
};
