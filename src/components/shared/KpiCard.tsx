import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'accent' | 'warning' | 'critical' | 'success';
  isSimulated?: boolean;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  sublabel,
  icon,
  trend,
  trendValue,
  variant = 'default',
  isSimulated = true,
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'accent':
        return 'border-l-4 border-l-railway-blue bg-white';
      case 'success':
        return 'border-l-4 border-l-railway-teal bg-white';
      case 'warning':
        return 'border-l-4 border-l-railway-amber bg-white';
      case 'critical':
        return 'border-l-4 border-l-railway-crimson bg-white';
      default:
        return 'border-l-4 border-l-slate-300 bg-white';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-lg border border-slate-200 shadow-card hover:shadow-elevated transition ${getVariantStyles()} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <div className="p-1.5 rounded-md bg-slate-50 text-slate-700 border border-slate-100">
          {icon}
        </div>
      </div>

      <div className="mt-1.5 flex items-baseline justify-between">
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>

        {trendValue && (
          <div
            className={`flex items-center space-x-0.5 text-[11px] font-bold ${
              trend === 'up'
                ? 'text-emerald-600'
                : trend === 'down'
                ? 'text-rose-600'
                : 'text-slate-500'
            }`}
          >
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : trend === 'down' ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
        <span>{sublabel}</span>
        {isSimulated && (
          <span className="text-[9px] text-slate-400 bg-slate-100 px-1 rounded border border-slate-200">
            Model est.
          </span>
        )}
      </div>
    </div>
  );
};
