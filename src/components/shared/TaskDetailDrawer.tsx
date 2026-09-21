import React from 'react';
import {
  X,
  AlertTriangle,
  Clock,
  Wrench,
  Users,
  CheckCircle2,
  GitMerge,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useRailFlowStore } from '../../store/railflowStore';
import { MaintenanceTask } from '../../types';

interface TaskDetailDrawerProps {
  task: MaintenanceTask | null;
  onClose: () => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({ task, onClose }) => {
  const { setActiveView, setSelectedCandidateId } = useRailFlowStore();

  if (!task) return null;

  const getDepartmentBadge = (dept: string) => {
    switch (dept) {
      case 'Engineering':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'S&T':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Traction/OHE':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div>
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-railway-dark text-white">
                  {task.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDepartmentBadge(
                    task.department
                  )}`}
                >
                  {task.department}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    task.status === 'Overdue'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                      : task.status === 'Due'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">{task.workType}</h3>
              <p className="text-xs text-slate-500">{task.assetName} • Section: {task.sectionName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Risk & Priority Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase">Model Failure Risk</span>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="text-xl font-extrabold text-rose-600 mt-1">
                  {task.failureRiskScore}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Prototype degradation estimate
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase">Priority Score</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-railway-blue" />
                </div>
                <div className="text-xl font-extrabold text-railway-blue mt-1">
                  {task.priorityScore}
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Ranked for immediate bundling
                </div>
              </div>
            </div>

            {/* Why Prioritized Explainability Box */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3.5 space-y-1.5">
              <div className="font-bold text-amber-900 flex items-center space-x-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Why is this task prioritized?</span>
              </div>
              <ul className="space-y-1 text-amber-950 text-[11px] list-disc list-inside">
                {task.reasonForPriority.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Multi-Department Compatibility */}
            <div className="border border-teal-200 bg-teal-50/60 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-teal-900 flex items-center space-x-1.5">
                  <GitMerge className="w-3.5 h-3.5 text-teal-600" />
                  <span>Coordination Compatibility</span>
                </div>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                  Consolidation Ready
                </span>
              </div>
              <p className="text-[11px] text-teal-950">
                {task.schedulingImpact}
              </p>
              {task.compatibleTasks.length > 0 && (
                <div className="pt-1 flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold text-teal-900">Compatible Tasks:</span>
                  {task.compatibleTasks.map((tId) => (
                    <span
                      key={tId}
                      className="font-mono text-[10px] bg-white border border-teal-300 text-teal-800 px-1.5 py-0.5 rounded font-bold"
                    >
                      {tId}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Duration & Resource Needs */}
            <div className="border border-slate-200 rounded-lg p-3.5 space-y-2.5">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Operational Requirements</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="text-slate-500 font-medium">Estimated Duration:</span>
                  <div className="font-bold text-slate-800">{task.durationHours} Hours</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="text-slate-500 font-medium">Historical Duration:</span>
                  <div className="font-bold text-slate-800">{task.historicalDurationHours} Hours</div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Assigned Gang:</span>
                <span className="font-semibold text-slate-800">{task.requiredTeam}</span>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Required Heavy Machinery:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {task.requiredEquipment.map((eq, i) => (
                    <span
                      key={i}
                      className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-white transition"
          >
            Close Drawer
          </button>
          <button
            onClick={() => {
              onClose();
              setSelectedCandidateId('OPTION_B');
              setActiveView('planner');
            }}
            className="px-4 py-1.5 rounded text-xs font-bold text-white bg-railway-blue hover:bg-railway-dark shadow-sm flex items-center space-x-1.5 transition"
          >
            <span>Schedule in Block Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
