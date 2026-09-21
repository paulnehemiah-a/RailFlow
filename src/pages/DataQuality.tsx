import React from 'react';
import {
  ShieldCheck,
  Database,
  AlertTriangle,
  CheckCircle2,
  Info,
  Layers,
  Radio,
  Server,
  Sparkles,
} from 'lucide-react';
import { useRailFlowStore } from '../store/railflowStore';

export const DataQuality: React.FC = () => {
  const { dataQuality } = useRailFlowStore();

  const metrics = [
    { name: 'Train Timetable & Passenger Schedule (COA)', score: dataQuality.timetableCompleteness, source: 'Control Office Application', status: 'Optimal' },
    { name: 'Maintenance Tasks & Work Orders (TMS/SMMS)', score: dataQuality.maintenanceRecords, source: 'Track Management System', status: 'Optimal' },
    { name: 'Asset Health IoT Telemetry (Track & Point)', score: dataQuality.assetHealthTelemetry, source: 'Wayside Vibration & Wear Feeds', status: 'Partial Telemetry' },
    { name: 'Resource & Gang Stabling Records', score: dataQuality.resourceAvailability, source: 'Divisional Resource Master', status: 'Optimal' },
    { name: 'Corridor Topology & Crossover Interlocks', score: dataQuality.corridorTopology, source: 'Electronic Interlocking SIP Database', status: 'Optimal' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Data Quality & Sensor Telemetry Governance Center
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              Confidence Engine Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent data completeness monitoring. Incomplete or lagging feeds directly modulate AI recommendation confidence scores.
          </p>
        </div>
      </div>

      {/* Top Banner: Overall Score & AI Impact */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-700 font-extrabold text-2xl shadow-sm">
            {dataQuality.overallScore}%
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Overall Data Health Index
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              High Decision Confidence (92/100)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Corridor data completeness satisfies CP-SAT optimization thresholds for deterministic scheduling.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1 max-w-xs">
          <div className="font-bold flex items-center space-x-1.5 text-railway-blue">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Anti-Hallucination Policy:</span>
          </div>
          <p className="text-[11px] text-slate-600">
            RailFlow applies an explicit confidence penalty when sensor feeds are lagging, preventing false operational precision.
          </p>
        </div>
      </div>

      {/* Sub-Scores Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-bold text-sm text-slate-900">
            Data Source Integrity & Telemetry Ingestion Breakdown
          </span>
          <span className="text-[10px] text-slate-400 font-mono">5 Active Data Pipes</span>
        </div>

        <div className="space-y-3">
          {metrics.map((m, idx) => (
            <div key={idx} className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{m.name}</span>
                  <div className="text-[10px] text-slate-500">Source: {m.source}</div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono font-extrabold text-sm ${
                      m.score >= 90 ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {m.score}%
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ml-2 ${
                      m.score >= 90
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    m.score >= 90 ? 'bg-emerald-600' : 'bg-amber-500'
                  }`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Quality Warnings & Penalties */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Active Data Quality Notices & Confidence Penalties</span>
          </span>
          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
            2 Warnings Monitored
          </span>
        </div>

        <div className="space-y-2.5">
          {dataQuality.warnings.map((w) => (
            <div
              key={w.id}
              className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 text-xs space-y-1 text-amber-950"
            >
              <div className="flex items-center justify-between font-bold">
                <span>{w.source}</span>
                <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-mono">
                  Penalty: -{w.recommendationConfidencePenalty}% Confidence
                </span>
              </div>
              <p className="text-[11px] text-slate-700">{w.message}</p>
              <div className="text-[10px] text-amber-900 font-semibold pt-0.5">
                Impact: {w.impact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
