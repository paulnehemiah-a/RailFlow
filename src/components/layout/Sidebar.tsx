import React from 'react';
import {
  Activity,
  Layers,
  Calendar,
  Sliders,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Settings,
  BarChart3,
  History,
  Zap,
  GitMerge,
} from 'lucide-react';
import { ActiveView, useRailFlowStore } from '../../store/railflowStore';

interface NavItem {
  id: ActiveView;
  label: string;
  category?: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useRailFlowStore();

  const navItems: NavItem[] = [
    {
      id: 'operations',
      label: 'Operations Dashboard',
      category: 'REAL-TIME CONTROL',
      icon: <Activity className="w-4 h-4" />,
      badge: 'Live',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'maintenance',
      label: 'Maintenance Intelligence',
      icon: <Zap className="w-4 h-4" />,
      badge: '3 Tasks',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'planner',
      label: 'Block Planner',
      category: 'DECISION & OPTIMIZATION',
      icon: <Sliders className="w-4 h-4" />,
      badge: 'CP-SAT',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      highlight: true,
    },
    {
      id: 'coordination',
      label: 'Multi-Dept Coordination',
      icon: <GitMerge className="w-4 h-4" />,
      badge: '3 → 1',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300 font-bold',
    },
    {
      id: 'scenarios',
      label: 'Scenario & What-If',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'emergency',
      label: 'Emergency Replanning',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: 'Urgent',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      id: 'weekly-monthly',
      label: 'Weekly & Monthly Plans',
      category: 'HORIZON & AUDIT',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'hero-before-after',
      label: 'Decision Audit History',
      icon: <History className="w-4 h-4" />
    },
    {
      id: 'analytics',
      label: 'Reports & Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'data-quality',
      label: 'Data Quality Center',
      category: 'GOVERNANCE & SYSTEM',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: '92%',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    {
      id: 'configuration',
      label: 'Configuration & Weights',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-railway-border flex flex-col justify-between shrink-0 shadow-card select-none">
      <div className="p-3 overflow-y-auto space-y-1">
        {navItems.map((item, index) => {
          const isActive = activeView === item.id;
          const showCategoryHeader = item.category && (index === 0 || navItems[index - 1].category !== item.category);

          return (
            <React.Fragment key={item.id}>
              {showCategoryHeader && (
                <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.category}
                </div>
              )}
              <button
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-railway-blue text-white shadow-sm font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-railway-blue'
                } ${item.highlight && !isActive ? 'border border-dashed border-railway-teal/40 bg-railway-tealLight/30' : ''}`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`${isActive ? 'text-white' : item.highlight ? 'text-railway-teal' : 'text-slate-500'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded border ${
                      isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Advisory Trust & Security Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-railway-teal shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight text-slate-600">
            <span className="font-semibold text-slate-800">Operational Advisory Mode</span>
            <p className="text-[10px] text-slate-500 mt-0.5">
              CP-SAT solver active with Indian Railway safety rules.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
