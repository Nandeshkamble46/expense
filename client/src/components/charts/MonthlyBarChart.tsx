import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyChartData, MonthlyData } from '../../types';
import { formatCurrency, getMonthName } from '../../utils/formatters';

interface MonthlyBarChartProps {
  data: MonthlyData[];
}

interface TooltipPayload {
  dataKey: string;
  color?: string;
  value: number;
}

interface MonthlyTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: MonthlyTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-xl">
      <p className="text-zinc-400 text-xs mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="text-sm font-semibold">
          {p.dataKey === 'income' ? 'Income' : 'Expense'}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ data }) => {
  const chartData: MonthlyChartData[] = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const income = data.find((d) => d._id.month === month && d._id.type === 'income')?.total || 0;
    const expense = data.find((d) => d._id.month === month && d._id.type === 'expense')?.total || 0;
    return { month: getMonthName(month), income, expense };
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#71717a', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#71717a', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `Rs. ${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a' }} />
        <Legend
          formatter={(v) => (
            <span style={{ color: '#a1a1aa', fontSize: 12 }}>
              {v === 'income' ? 'Income' : 'Expense'}
            </span>
          )}
        />
        <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyBarChart;
