import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { CategoryData } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../utils/categoryColors';

interface SpendingPieChartProps {
  data: CategoryData[];
}

interface PieTooltipPayload {
  name: string;
  value: number;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: PieTooltipPayload[];
}

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const CustomTooltip = ({ active, payload }: PieTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-xl">
      <p className="text-sm font-semibold text-white">{payload[0].name}</p>
      <p className="text-xs text-zinc-400 mt-0.5">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelProps) => {
  if (percent < 0.05) return null;

  const radian = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * radian);
  const y = cy + radius * Math.sin(-midAngle * radian);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

const SpendingPieChart: React.FC<SpendingPieChartProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    name: d._id,
    value: d.total,
    color: CATEGORY_COLORS[d._id] || '#6b7280',
  }));

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[280px] text-zinc-500 text-sm">
        No expense data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          labelLine={false}
          label={(props: unknown) => <CustomLabel {...(props as PieLabelProps)} />}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(v) => (
            <span style={{ color: '#a1a1aa', fontSize: 12 }}>{v}</span>
          )}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SpendingPieChart;
