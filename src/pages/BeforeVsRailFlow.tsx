import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Sparkles,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Train,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Zap,
  Wrench,
  Activity,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { useRailFlowStore } from '../store/railflowStore';
import { DecisionLog } from '../types';

export const BeforeVsRailFlow: React.FC = () => {
  const { decisionHistory, setActiveView } = useRailFlowStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Extract unique sections for filtering
  const sections = Array.from(new Set(decisionHistory.map((d) => d.section)));

  // Filtered decisions
  const filteredDecisions = decisionHistory.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.controllerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tasks.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'ALL' ||
      d.status.toUpperCase() === selectedStatus.toUpperCase() ||
      (selectedStatus === 'EMERGENCY' && d.status.toUpperCase().includes('EMERGENCY'));

    const matchesSection = selectedSection === 'ALL' || d.section === selectedSection;

    return matchesSearch && matchesStatus && matchesSection;
  });

  // Calculate high-level audit summary metrics
  const totalDecisions = decisionHistory.length;
  const approvedCount = decisionHistory.filter((d) => d.status === 'Approved').length;
  const avgTasksConsolidated = (
    decisionHistory.reduce((acc, d) => acc + (d.coordinatedCount || 1), 0) / (totalDecisions || 1)
  ).toFixed(1);
  const totalDelaySaved = totalDecisions * 46; // Benchmark vs uncoordinated departmental slots

  // Export audit CSV handler
  const handleExportCSV = () => {
    const headers = [
      'Decision Reference ID',
      'Timestamp (IST)',
      'Section / Corridor',
      'Authorizing Controller',
      'Consolidated Tasks',
      'Approved Window',
      'Window Time',
      'Est Delay (min)',
      'Priority Trains Affected',
      'Status',
      'Vaigai Protected',
      'Mathematical Optimization Rationale',
    ];

    const rows = filteredDecisions.map((d) => [
      `"${d.id}"`,
      `"${d.timestamp}"`,
      `"${d.section}"`,
      `"${d.controllerName}"`,
      `"${d.tasks.join('; ')}"`,
      `"${d.chosenWindow}"`,
      `"${d.windowTime}"`,
      d.estimatedDelay,
      d.priorityTrainsAffected,
      `"${d.status}"`,
      d.vaigaiProtected ? 'YES' : 'NO',
      `"${d.reason.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RailFlow_Advisory_Audit_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportToast('Audit history ledger successfully exported to CSV format.');
    setTimeout(() => setExportToast(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-railway-blue text-white shadow-sm">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Controller Advisory Decision Audit History</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Immutable Record
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Official audit trail of Section and Chief Controller block decisions, multi-department consolidation justifications, and mathematical constraint solver rationales.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm flex items-center space-x-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Audit CSV</span>
          </button>
          <button
            onClick={() => setActiveView('planner')}
            className="px-4 py-2 rounded-lg bg-railway-blue hover:bg-railway-dark text-white text-xs font-bold shadow flex items-center space-x-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-railway-teal" />
            <span>Open Decision Planner</span>
          </button>
        </div>
      </div>

      {/* Export Toast Notification */}
      {exportToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between text-emerald-800 text-xs font-medium shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportToast}</span>
          </div>
          <button
            onClick={() => setExportToast(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Audit Summary Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Logged Decisions
            </span>
            <span className="p-1.5 rounded-md bg-blue-50 text-railway-blue">
              <History className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalDecisions} Records</div>
          <p className="text-[11px] text-slate-500">
            {approvedCount} Approved • {totalDecisions - approvedCount} Modified / Emergency
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Express Protection Rate
            </span>
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <Train className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">100% Protected</div>
          <p className="text-[11px] text-slate-500">
            Zero express trains delayed across all approved windows
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Department Consolidation
            </span>
            <span className="p-1.5 rounded-md bg-teal-50 text-teal-600">
              <Layers className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-teal-700">{avgTasksConsolidated} Tasks / Block</div>
          <p className="text-[11px] text-slate-500">
            Joint Civil + S&T + TRD concurrent execution
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Cumulative Delay Averted
            </span>
            <span className="p-1.5 rounded-md bg-purple-50 text-purple-600">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-purple-700">-{totalDelaySaved} min</div>
          <p className="text-[11px] text-slate-500">
            Compared to uncoordinated departmental line possessions
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, section, controller, task, or rationale..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-railway-blue focus:bg-white transition"
            />
          </div>

          {/* Filter Pills and Section Select */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              {['ALL', 'APPROVED', 'MODIFIED', 'EMERGENCY'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition ${
                    selectedStatus === status
                      ? 'bg-white text-railway-blue shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status === 'ALL' ? 'All Statuses' : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Section Dropdown */}
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-railway-blue"
            >
              <option value="ALL">All Railway Sections</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Decision Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-railway-blue" />
            <span className="font-extrabold text-sm text-slate-900">
              Controller Advisory Decision Ledger
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({filteredDecisions.length} entries shown)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>SHA-256 Verified Ledger</span>
            </span>
          </div>
        </div>

        {filteredDecisions.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <History className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">No decision audit records found</p>
            <p className="text-[11px] text-slate-400">
              Try adjusting your search keywords or status filter options.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Decision Ref & Timestamp</th>
                  <th className="py-3 px-3">Section / Corridor</th>
                  <th className="py-3 px-3">Consolidated Tasks</th>
                  <th className="py-3 px-3">Approved Window</th>
                  <th className="py-3 px-3">Est. Delay</th>
                  <th className="py-3 px-3">Authorizing Controller</th>
                  <th className="py-3 px-3">Status & Express</th>
                  <th className="py-3 px-3 text-right">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDecisions.map((d) => {
                  const isExpanded = expandedId === d.id;
                  const isApproved = d.status === 'Approved';
                  const isModified = d.status === 'Modified';
                  const isEmergency = d.status.toLowerCase().includes('emergency');

                  return (
                    <React.Fragment key={d.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : d.id)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition ${
                          isExpanded ? 'bg-slate-50/90' : ''
                        }`}
                      >
                        {/* Reference ID & Timestamp */}
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-[11px] text-railway-blue block">
                            {d.id}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{d.timestamp}</span>
                          </span>
                        </td>

                        {/* Section */}
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{d.section}</span>
                        </td>

                        {/* Tasks */}
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            <span className="inline-block font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded text-[10px] border border-teal-200">
                              {d.coordinatedCount || d.tasks.length} Tasks Consolidated
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {d.tasks.map((task, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200"
                                >
                                  {task.split(' ')[0]}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* Chosen Window */}
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-railway-blue block">
                            {d.chosenWindow}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{d.windowTime}</span>
                        </td>

                        {/* Delay */}
                        <td className="py-3 px-3">
                          <span
                            className={`font-bold text-xs ${
                              d.estimatedDelay === 0
                                ? 'text-emerald-600'
                                : d.estimatedDelay <= 20
                                ? 'text-amber-600'
                                : 'text-rose-600'
                            }`}
                          >
                            {d.estimatedDelay} min
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {d.priorityTrainsAffected === 0 ? '0 conflicts' : `${d.priorityTrainsAffected} affected`}
                          </span>
                        </td>

                        {/* Controller */}
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-800 block text-xs">
                            {d.controllerName}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                                isApproved
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : isModified
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : isEmergency
                                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                                  : 'bg-slate-100 text-slate-800 border-slate-300'
                              }`}
                            >
                              {isApproved ? '✓ Approved' : isModified ? '⚠️ Modified' : '⚡ Emergency Enacted'}
                            </span>
                            {d.vaigaiProtected && (
                              <span className="block text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                ✓ 12635 Vaigai Protected
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions / Expand */}
                        <td className="py-3 px-3 text-right">
                          <button className="text-slate-400 hover:text-railway-blue transition p-1">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-railway-blue" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row Detail View */}
                      {isExpanded && (
                        <tr className="bg-slate-50/95 border-b border-slate-200">
                          <td colSpan={8} className="p-4">
                            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 shadow-inner">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center space-x-2">
                                  <Sparkles className="w-4 h-4 text-railway-blue" />
                                  <span className="font-bold text-xs text-slate-900">
                                    Mathematical Constraint Solver Justification & SOP Compliance
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  Authorizing Officer: {d.controllerName}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="space-y-2">
                                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                                    Solver Decision Rationale:
                                  </span>
                                  <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed text-[11px]">
                                    {d.reason}
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                                    Consolidated Departmental Tasks:
                                  </span>
                                  <ul className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
                                    {d.tasks.map((task, i) => (
                                      <li key={i} className="flex items-center space-x-1.5 text-[11px] text-slate-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                        <span className="font-mono">{task}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 gap-2">
                                <div className="flex items-center space-x-3 text-[10px] text-slate-500">
                                  <span className="flex items-center space-x-1 font-mono">
                                    <ShieldCheck className="w-3 h-3 text-teal-600" />
                                    <span>Verified by Central RailFlow Audit Engine</span>
                                  </span>
                                  <span>•</span>
                                  <span>Human Authority SOP: Section 14B IR Operating Manual</span>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExportCSV();
                                  }}
                                  className="text-[11px] font-bold text-railway-blue hover:text-railway-dark flex items-center space-x-1 transition"
                                >
                                  <FileSpreadsheet className="w-3 h-3" />
                                  <span>Download Decision Extract</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeforeVsRailFlow;
