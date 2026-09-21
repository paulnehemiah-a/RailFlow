import React from 'react';
import {
  X,
  Train as TrainIcon,
  ShieldCheck,
  ShieldAlert,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Train } from '../../types';
import { useRailFlowStore } from '../../store/railflowStore';

interface TrainDetailDrawerProps {
  train: Train | null;
  onClose: () => void;
}

export const TrainDetailDrawer: React.FC<TrainDetailDrawerProps> = ({ train, onClose }) => {
  const { selectedCandidateId, candidateWindows, setActiveView } = useRailFlowStore();

  if (!train) return null;

  const activeCandidate = candidateWindows.find((c) => c.id === selectedCandidateId) || candidateWindows[1];
  const isVaigaiConflict = selectedCandidateId === 'OPTION_C';
  const isVaigaiProtected = !isVaigaiConflict;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div>
          <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-railway-dark to-railway-blue text-white flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-railway-teal text-slate-900 flex items-center justify-center font-bold shadow-md">
                <TrainIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-extrabold text-sm px-2 py-0.5 rounded bg-white/20 text-white border border-white/30">
                    {train.number}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase tracking-wider">
                    PRIORITY: {train.operationalImportance}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white">
                    {train.status}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1.5">{train.name}</h3>
                <p className="text-xs text-slate-300">
                  {train.fromStation} ({train.fromStationCode}) → {train.toStation} ({train.toStationCode})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Operational Priority & Block Impact Banner */}
            <div
              className={`rounded-xl border p-4 flex items-center justify-between ${
                isVaigaiProtected
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/90 border-rose-400 text-rose-950 animate-pulse'
              }`}
            >
              <div className="flex items-center space-x-3">
                {isVaigaiProtected ? (
                  <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0" />
                ) : (
                  <ShieldAlert className="w-7 h-7 text-rose-600 shrink-0" />
                )}
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block">
                    Maintenance Block Interaction ({activeCandidate.name.split(':')[0]})
                  </span>
                  <div className="text-sm font-extrabold mt-0.5">
                    {isVaigaiProtected ? '✓ PRIORITY TRAIN 100% PROTECTED' : '⚠ PRIORITY TRAIN CONFLICT DETECTED'}
                  </div>
                  <p className="text-[11px] mt-0.5">
                    {isVaigaiProtected
                      ? 'Option B completes at 14:00 IST. Vaigai reaches section at 15:30 with 100% green aspect clearance.'
                      : 'Option C maintenance window (14:30–17:00) blocks UP Mainline during Vaigai scheduled crossing (15:30–16:16).'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Spec Matrix */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-medium block">Scheduled Dep.</span>
                <span className="font-mono font-extrabold text-slate-900 text-xs">
                  {train.passTimes?.MS || '13:15'} IST
                </span>
                <span className="text-[9px] text-slate-400">Chennai Egmore</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-medium block">Scheduled Arr.</span>
                <span className="font-mono font-extrabold text-slate-900 text-xs">
                  {train.passTimes?.MDU || '20:35'} IST
                </span>
                <span className="text-[9px] text-slate-400">Madurai Jn</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-medium block">Service / Classes</span>
                <span className="font-extrabold text-slate-800 text-xs">
                  {train.serviceType}
                </span>
                <span className="text-[9px] text-slate-500">
                  {train.classes ? train.classes.join(' / ') : 'CC / 2S / GN'}
                </span>
              </div>
            </div>

            {/* Timetable Reference Table */}
            {train.timetableStops && (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-railway-blue" />
                    <span className="font-bold text-xs text-slate-800">
                      Public Timetable Reference (12635 Vaigai SF Express)
                    </span>
                  </div>
                  <span className="text-[9px] bg-slate-200 text-slate-700 font-mono px-1.5 py-0.2 rounded font-bold">
                    Official Reference
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-[11px] text-slate-700">
                    <thead className="bg-slate-100/70 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky top-0">
                      <tr>
                        <th className="py-2 px-3">Station</th>
                        <th className="py-2 px-2">Arr.</th>
                        <th className="py-2 px-2">Dep.</th>
                        <th className="py-2 px-2">Halt</th>
                        <th className="py-2 px-3 text-right">Dist.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {train.timetableStops.map((stop, idx) => (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-50 transition ${
                            ['VM', 'VRI'].includes(stop.stationCode)
                              ? 'bg-amber-50/60 font-bold text-amber-950'
                              : ''
                          }`}
                        >
                          <td className="py-2 px-3 font-sans font-semibold">
                            {stop.stationName} ({stop.stationCode})
                            {['VM', 'VRI'].includes(stop.stationCode) && (
                              <span className="ml-1.5 text-[9px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-sans font-extrabold">
                                Active Corridor
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-slate-600">{stop.arrivalTime}</td>
                          <td className="py-2 px-2 text-slate-900 font-bold">{stop.departureTime}</td>
                          <td className="py-2 px-2 text-slate-500">{stop.haltMinutes > 0 ? `${stop.haltMinutes}m` : '--'}</td>
                          <td className="py-2 px-3 text-right text-slate-500">{stop.distanceKm} km</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Anti-Hallucination Disclaimer */}
            <div className="flex items-start space-x-2 text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Timetable reference is based on public Southern Railway schedules. Train movement and delay cascades are dynamically calculated by the RailFlow CP-SAT simulation engine.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-white transition"
          >
            Close Drawer
          </button>

          <button
            onClick={() => {
              onClose();
              setActiveView('planner');
            }}
            className="px-5 py-1.5 rounded text-xs font-bold text-white bg-railway-blue hover:bg-railway-dark shadow-sm flex items-center space-x-1.5 transition"
          >
            <span>Inspect in Block Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
