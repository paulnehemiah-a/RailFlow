import React, { useState } from 'react';
import {
  Zap,
  Activity,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpDown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Wrench,
  Layers,
  ChevronRight,
  GitMerge,
  Info,
} from 'lucide-react';
import { useRailFlowStore } from '../store/railflowStore';
import { MaintenanceTask, Asset, Department } from '../types';
import { TaskDetailDrawer } from '../components/shared/TaskDetailDrawer';

export const MaintenanceIntelligence: React.FC = () => {
  const { assets, tasks, setSelectedTaskId, selectedTaskId, setActiveView } = useRailFlowStore();

  const [activeTab, setActiveTab] = useState<'register' | 'priority' | 'health' | 'coordination'>('register');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedTaskForDrawer, setSelectedTaskForDrawer] = useState<MaintenanceTask | null>(null);

  // Filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.workType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.sectionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assetName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || task.department === selectedDept;
    const matchesPriority = selectedPriority === 'ALL' || task.criticality === selectedPriority;

    return matchesSearch && matchesDept && matchesPriority;
  });

  const getDeptColor = (dept: Department) => {
    switch (dept) {
      case 'Engineering':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'S&T':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Traction/OHE':
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Maintenance Intelligence & Asset Health Engine
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
              Ranked Prioritization
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Predictive asset risk modeling, multi-department task register, and automatic coordination detection.
          </p>
        </div>

        {/* Coordination Quick Button */}
        <button
          onClick={() => setActiveView('coordination')}
          className="px-4 py-1.5 rounded-md text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center space-x-1.5 transition"
        >
          <GitMerge className="w-3.5 h-3.5" />
          <span>Multi-Dept Coordination (3-in-1)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center space-x-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('register')}
          className={`pb-2.5 transition flex items-center space-x-1.5 border-b-2 ${
            activeTab === 'register'
              ? 'border-railway-blue text-railway-blue font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Activity Register ({tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('priority')}
          className={`pb-2.5 transition flex items-center space-x-1.5 border-b-2 ${
            activeTab === 'priority'
              ? 'border-railway-blue text-railway-blue font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Priority Engine & Ranking</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`pb-2.5 transition flex items-center space-x-1.5 border-b-2 ${
            activeTab === 'health'
              ? 'border-railway-blue text-railway-blue font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>Asset Health & Telemetry ({assets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('coordination')}
          className={`pb-2.5 transition flex items-center space-x-1.5 border-b-2 ${
            activeTab === 'coordination'
              ? 'border-railway-blue text-railway-blue font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitMerge className="w-4 h-4 text-teal-600" />
          <span>Coordination Opportunities</span>
        </button>
      </div>

      {/* 1. ACTIVITY REGISTER TAB */}
      {activeTab === 'register' && (
        <div className="space-y-4">
          {/* Search and Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Task ID, work type, section, or asset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500 font-medium">Department:</span>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Engineering">Civil Engineering</option>
                  <option value="S&T">S&T (Signals)</option>
                  <option value="Traction/OHE">Traction / OHE</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500 font-medium">Criticality:</span>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity Register Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Task ID</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Section & Asset</th>
                    <th className="py-3 px-4">Work Type</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Failure Risk</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Compatibility</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTaskForDrawer(t)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {t.id}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDeptColor(
                            t.department
                          )}`}
                        >
                          {t.department}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{t.sectionName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{t.assetId}</div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-900">
                        {t.workType}
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {t.durationHours} Hours
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`font-bold ${
                              t.failureRiskScore >= 35
                                ? 'text-rose-600'
                                : t.failureRiskScore >= 25
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {t.failureRiskScore}%
                          </span>
                          <span className="text-[9px] text-slate-400">est.</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            t.status === 'Overdue'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                              : t.status === 'Due'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {t.compatibleTasks.length > 0 ? (
                          <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded border border-teal-300">
                            ✓ Compatible (3-in-1)
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Standalone</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="text-xs font-bold text-railway-blue hover:underline inline-flex items-center space-x-1">
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAINTENANCE PRIORITY ENGINE TAB */}
      {activeTab === 'priority' && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start justify-between text-xs">
            <div className="flex items-start space-x-2.5">
              <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950">
                  Priority Scoring Formulation & Ranking
                </span>
                <p className="text-amber-900 text-[11px] mt-0.5">
                  Tasks are dynamically scored (0–100) based on Asset Criticality, Sensor Telemetry Failure Risk, Days Overdue, and Traffic Exposure. Risk influences scheduling priority; it does not automatically book track possession.
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-white border border-amber-300 px-2 py-1 rounded font-bold text-amber-800">
              Prototype Prediction
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tasks
              .sort((a, b) => b.priorityScore - a.priorityScore)
              .map((t, idx) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTaskForDrawer(t)}
                  className="bg-white rounded-xl border border-slate-200 shadow-card p-4 space-y-3 cursor-pointer hover:shadow-elevated transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-xs">{t.id}</span>
                        <div className="text-[10px] text-slate-500 font-semibold">{t.department}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Priority</span>
                      <div className="text-lg font-extrabold text-railway-blue">
                        {t.priorityScore}
                        <span className="text-[10px] text-slate-400 font-normal">/100</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.workType}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.assetName}</p>
                  </div>

                  {/* Why Prioritized Explainability Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1 text-[11px]">
                    <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider">
                      Why Ranked High:
                    </span>
                    <ul className="list-disc list-inside text-slate-600 text-[10px] space-y-0.5">
                      {t.reasonForPriority.slice(0, 2).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-rose-600">
                      Failure Risk: {t.failureRiskScore}%
                    </span>
                    <span className="text-railway-blue font-bold hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. ASSET HEALTH & TELEMETRY TAB */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-3.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-railway-blue px-2 py-0.5 rounded bg-railway-lightBlue border border-railway-blue/20">
                    {asset.id}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1.5">{asset.name}</h3>
                  <p className="text-xs text-slate-500">{asset.sectionName}</p>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                    asset.condition === 'Critical'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                      : asset.condition === 'Poor'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {asset.condition}
                </span>
              </div>

              {/* Health and Failure Risk Gauges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-medium block">Failure Risk</span>
                  <div className="text-base font-extrabold text-rose-600 mt-0.5">
                    {asset.failureRisk}%
                  </div>
                  <span className="text-[9px] text-slate-400">SMMS/TMS estimate</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-medium block">Asset Health</span>
                  <div className="text-base font-extrabold text-slate-800 mt-0.5">
                    {asset.healthScore}/100
                  </div>
                  <span className="text-[9px] text-slate-400">Condition index</span>
                </div>
              </div>

              {/* Live Telemetry Attributes */}
              <div className="border border-slate-200/80 rounded-lg p-2.5 bg-slate-50/50 space-y-1 text-[11px] text-slate-600">
                <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wider">
                  IoT Sensor Telemetry:
                </div>
                {asset.telemetry.vibration && (
                  <div className="flex justify-between">
                    <span>Track Vibration:</span>
                    <span className="font-mono font-semibold text-slate-800">{asset.telemetry.vibration}</span>
                  </div>
                )}
                {asset.telemetry.temperature && (
                  <div className="flex justify-between">
                    <span>Rail/Catenary Temp:</span>
                    <span className="font-mono font-semibold text-slate-800">{asset.telemetry.temperature}</span>
                  </div>
                )}
                {asset.telemetry.voltage && (
                  <div className="flex justify-between">
                    <span>Operating Voltage:</span>
                    <span className="font-mono font-semibold text-slate-800">{asset.telemetry.voltage}</span>
                  </div>
                )}
                {asset.telemetry.wearLevel && (
                  <div className="flex justify-between">
                    <span>Wear Degradation:</span>
                    <span className="font-mono font-semibold text-slate-800">{asset.telemetry.wearLevel}</span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-100">
                <span>Last Serviced: {asset.lastMaintenance.split(' ')[0]}</span>
                <span className="font-bold text-slate-700">Traffic: {asset.trafficExposure}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. COORDINATION TAB PEEK */}
      {activeTab === 'coordination' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
            <GitMerge className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Multi-Department Coordination Engine
            </h3>
            <p className="text-xs text-slate-600 max-w-lg mx-auto mt-1">
              3 maintenance tasks on Bhadrak–Jajpur section are confirmed compatible for single-closure bundling.
            </p>
          </div>
          <button
            onClick={() => setActiveView('coordination')}
            className="px-5 py-2 rounded-lg bg-railway-blue hover:bg-railway-dark text-white text-xs font-bold shadow transition inline-flex items-center space-x-1.5"
          >
            <span>Open Dedicated Coordination Showcase</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Slide-over Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTaskForDrawer}
        onClose={() => setSelectedTaskForDrawer(null)}
      />
    </div>
  );
};
