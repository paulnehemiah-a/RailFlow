import React from 'react';
import { Users, Truck, CheckCircle2, XCircle, Clock, MapPin } from 'lucide-react';
import { useRailFlowStore } from '../../store/railflowStore';

export const ResourceAvailabilityPanel: React.FC = () => {
  const { resources } = useRailFlowStore();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="font-extrabold text-sm text-slate-900">
            Resource Feasibility & Machine Allocation
          </span>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time readiness of departmental maintenance gangs and specialized track machines.
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
          6/7 Available
        </span>
      </div>

      {/* Grid of Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {resources.map((res) => {
          const isAvailable = res.status === 'AVAILABLE';

          return (
            <div
              key={res.id}
              className={`p-3 rounded-lg border transition ${
                isAvailable
                  ? 'bg-slate-50/70 border-slate-200'
                  : 'bg-rose-50/50 border-rose-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    {res.id}
                  </span>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">{res.name}</div>
                </div>

                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isAvailable
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {res.status}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800">{res.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-800">{res.currentLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Lead Contact:</span>
                  <span className="text-slate-700">{res.contactLead}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
