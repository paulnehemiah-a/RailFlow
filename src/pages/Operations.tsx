import React from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  Train,
  Wrench,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  GitMerge,
  Layers,
  Sliders,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { GoogleMapsCorridorMap } from '../components/map/GoogleMapsCorridorMap';
import { KpiCard } from '../components/shared/KpiCard';
import { useRailFlowStore } from '../store/railflowStore';

export const Operations: React.FC = () => {
  const {
    tasks,
    sections,
    selectedSectionId,
    setSelectedSectionId,
    setActiveView,
    startOptimization,
  } = useRailFlowStore();

  const currentSection = sections.find((s) => s.id === selectedSectionId) || sections[0];
  const pendingSectionTasks = tasks.filter((t) => t.sectionId === currentSection.id);
  const criticalSectionTasksCount = pendingSectionTasks.filter(
    (t) => t.criticality === 'CRITICAL' || t.urgency === 'Immediate' || t.failureRiskScore >= 30
  ).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Title & Immediate Situation Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Operations Control & Corridor Situational Awareness
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              Live Network Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time track occupancy, corridor asset telemetry, and AI-assisted coordinated maintenance alerts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setActiveView('coordination');
            }}
            className="px-3.5 py-1.5 rounded-md text-xs font-bold bg-white hover:bg-slate-50 text-railway-blue border border-railway-blue/30 shadow-sm flex items-center space-x-1.5 transition"
          >
            <GitMerge className="w-3.5 h-3.5 text-railway-teal" />
            <span>Coordination Visualizer</span>
          </button>

          <button
            onClick={() => {
              setActiveView('planner');
              startOptimization();
            }}
            className="px-4 py-1.5 rounded-md text-xs font-bold bg-railway-blue hover:bg-railway-dark text-white shadow-sm flex items-center space-x-1.5 transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Open Block Planner</span>
          </button>
        </div>
      </div>

      {/* 7 KPI Operational Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <KpiCard
          label="Active Maintenance"
          value="12"
          sublabel="Gangs on track"
          icon={<Wrench className="w-4 h-4 text-railway-blue" />}
          trend="neutral"
          trendValue="Normal"
          variant="default"
        />

        <KpiCard
          label="Critical Tasks"
          value="3"
          sublabel="Overdue / Risk >30%"
          icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
          trend="up"
          trendValue="+1"
          variant="critical"
        />

        <KpiCard
          label="Today's Planned"
          value="4"
          sublabel="1 Coordinated Block"
          icon={<Layers className="w-4 h-4 text-teal-600" />}
          trend="down"
          trendValue="-2 closures"
          variant="success"
        />

        <KpiCard
          label="Trains Monitored"
          value="126"
          sublabel="Khurda Corridor"
          icon={<Train className="w-4 h-4 text-railway-steel" />}
          trend="neutral"
          trendValue="100% active"
          variant="default"
        />

        <KpiCard
          label="Estimated Delay"
          value="18 min"
          sublabel="Under Option B"
          icon={<Clock className="w-4 h-4 text-emerald-600" />}
          trend="down"
          trendValue="-46 min save"
          variant="success"
        />

        <KpiCard
          label="Active Conflicts"
          value="2"
          sublabel="Resolved in Option B"
          icon={<ShieldAlert className="w-4 h-4 text-amber-600" />}
          trend="down"
          trendValue="0 priority"
          variant="warning"
        />

        <KpiCard
          label="Asset Availability"
          value="94.2%"
          sublabel="+8.4% with RailFlow"
          icon={<Activity className="w-4 h-4 text-railway-teal" />}
          trend="up"
          trendValue="+8.4%"
          variant="accent"
        />
      </div>

      {/* Main Content Area: Left Google Maps Corridor / Right Section Operations Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Google Maps Corridor Map (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[520px]">
          <GoogleMapsCorridorMap />
        </div>

        {/* Right: Operational Status Panel & Pending Tasks on Selected Section (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Section Highlights Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-railway-blue px-2 py-0.5 rounded bg-railway-lightBlue border border-railway-blue/20">
                  Section Details: {currentSection.id}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {currentSection.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentSection.lengthKm} km • {currentSection.trackType} • Max {currentSection.maxSectionSpeed} km/h
                </p>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  criticalSectionTasksCount > 0
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : pendingSectionTasks.length > 0
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {criticalSectionTasksCount > 0 ? 'Maintenance Scheduled' : currentSection.currentStatus}
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500">Active Trains</span>
                <div className="font-extrabold text-slate-800 mt-0.5">
                  {currentSection.activeTrainsCount}
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500">Pending Tasks</span>
                <div className="font-extrabold text-amber-700 mt-0.5">
                  {pendingSectionTasks.length}
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500">Critical Risks</span>
                <div className="font-extrabold text-rose-600 mt-0.5">
                  {criticalSectionTasksCount}
                </div>
              </div>
            </div>

            {/* AI Recommendation Peek */}
            {currentSection.id === 'S-VM-VRI' ? (
              <div className="bg-teal-50/70 border border-teal-200 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-900 flex items-center space-x-1">
                    <span>Recommended Block Window</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded">
                    Option B (11:30–14:00)
                  </span>
                </div>
                <p className="text-[11px] text-teal-950">
                  Consolidates 3 departmental tasks into 1 synchronized window, producing lowest train delay (18 min).
                </p>
              </div>
            ) : pendingSectionTasks.length > 0 ? (
              <div className="bg-teal-50/60 border border-teal-200 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-900 flex items-center space-x-1">
                    <span>Recommended Maintenance Window</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded">
                    Off-Peak Slot
                  </span>
                </div>
                <p className="text-[11px] text-teal-950">
                  {pendingSectionTasks.length} task{pendingSectionTasks.length > 1 ? 's' : ''} queued ({pendingSectionTasks.map((t) => t.id).join(', ')}). Solver recommends non-peak window clearance.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900">
                    Corridor Asset Health
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                    Optimal
                  </span>
                </div>
                <p className="text-[11px] text-emerald-950">
                  All track, signal, and OHE assets operating nominally. Zero pending work blocks required.
                </p>
              </div>
            )}
          </div>

          {/* Pending Departmental Maintenance Tasks on this Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Pending Activities ({pendingSectionTasks.length})
                </span>
                <button
                  onClick={() => setActiveView('maintenance')}
                  className="text-[11px] font-bold text-railway-blue hover:underline"
                >
                  View All Tasks →
                </button>
              </div>

              <div className="space-y-2 mt-2 max-h-52 overflow-y-auto pr-1">
                {pendingSectionTasks.length === 0 ? (
                  <div className="text-center py-6 space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">No Pending Activities</p>
                    <p className="text-[10px] text-slate-400">
                      All assets on {currentSection.name} are operating nominally with zero pending work orders.
                    </p>
                  </div>
                ) : (
                  pendingSectionTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 transition text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-slate-900">{t.id}</span>
                          <span className="text-[10px] font-semibold px-1.5 rounded bg-slate-200 text-slate-800">
                            {t.department}
                          </span>
                        </div>
                        <span
                          className={`font-bold text-[11px] ${
                            t.failureRiskScore >= 30 ? 'text-rose-600' : 'text-slate-600'
                          }`}
                        >
                          Risk {t.failureRiskScore}%
                        </span>
                      </div>
                      <div className="font-medium text-slate-800">{t.workType}</div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between">
                        <span>{t.durationHours}h req. • {t.requiredTeam.split('(')[0]}</span>
                        <span className="text-teal-700 font-bold">
                          {t.compatibleTasks.length > 0 ? 'Compatible 3-in-1' : 'Isolated Slot'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Action button */}
            <button
              onClick={() => {
                setActiveView('planner');
                startOptimization();
              }}
              className="w-full py-2 bg-railway-lightBlue hover:bg-blue-100 text-railway-blue border border-railway-blue/20 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-railway-teal" />
              <span>Simulate Section Consolidation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
