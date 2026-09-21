import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { KpiCard } from '../components/shared/KpiCard';

const ASSET_AVAILABILITY_TREND = [
  { week: 'W1 (Aug)', traditional: 84.5, railflow: 92.1 },
  { week: 'W2 (Aug)', traditional: 86.2, railflow: 93.4 },
  { week: 'W3 (Aug)', traditional: 85.1, railflow: 94.0 },
  { week: 'W4 (Aug)', traditional: 85.8, railflow: 94.2 },
];

const DELAY_COMPARISON_DATA = [
  { section: 'KGP-BLS', traditionalDelay: 45, railflowDelay: 12 },
  { section: 'BLS-BHC', traditionalDelay: 38, railflowDelay: 10 },
  { section: 'BHC-JJKR', traditionalDelay: 64, railflowDelay: 18 },
  { section: 'JJKR-CTC', traditionalDelay: 52, railflowDelay: 14 },
  { section: 'CTC-BBS', traditionalDelay: 30, railflowDelay: 8 },
  { section: 'BBS-KUR', traditionalDelay: 22, railflowDelay: 5 },
];

const DEPARTMENT_DISTRIBUTION = [
  { name: 'Civil Engineering', value: 45, color: '#2563EB' },
  { name: 'S&T (Signals)', value: 30, color: '#D97706' },
  { name: 'Traction / OHE', value: 25, color: '#7C3AED' },
];

export const Analytics: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Operational Analytics & Continuous Improvement Reports
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              Validated Simulation Data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Corridor-wide asset availability gains, train delay reduction curves, and multi-departmental block efficiency.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Corridor Asset Uptime"
          value="94.2%"
          sublabel="Target: 95.0%"
          icon={<Activity className="w-4 h-4 text-emerald-600" />}
          trend="up"
          trendValue="+8.4%"
          variant="success"
        />

        <KpiCard
          label="Cumulative Delay Reduction"
          value="71.9%"
          sublabel="Across 6 corridor sections"
          icon={<Clock className="w-4 h-4 text-railway-blue" />}
          trend="down"
          trendValue="-192 min/wk"
          variant="accent"
        />

        <KpiCard
          label="Multi-Dept Consolidation"
          value="66.7%"
          sublabel="3 requests → 1 block"
          icon={<Layers className="w-4 h-4 text-teal-600" />}
          trend="up"
          trendValue="High Efficiency"
          variant="success"
        />

        <KpiCard
          label="Priority Express Punctuality"
          value="99.4%"
          sublabel="Zero CP-SAT violations"
          icon={<Sparkles className="w-4 h-4 text-purple-600" />}
          trend="up"
          trendValue="+4.2%"
          variant="default"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Delay Reduction by Corridor Section (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-sm text-slate-900">
              Train Delay Reduction by Section (Traditional vs RailFlow)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Minutes / Weekly Block</span>
          </div>

          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DELAY_COMPARISON_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="section" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="traditionalDelay" name="Traditional Planning Delay (min)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="railflowDelay" name="RailFlow Coordinated Delay (min)" fill="#0FAF9A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Departmental Task Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-sm text-slate-900">
              Departmental Maintenance Share
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Activity Distribution</span>
          </div>

          <div className="h-72 w-full flex items-center justify-center text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEPARTMENT_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {DEPARTMENT_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Asset Availability Gain Trend (12 cols) */}
        <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-sm text-slate-900">
              Asset Availability Evolution (Month-over-Month Gain)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Corridor Availability %</span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ASSET_AVAILABILITY_TREND} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis domain={[80, 100]} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="traditional" name="Traditional Baseline (%)" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="railflow" name="RailFlow Optimized (%)" stroke="#123B5D" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
