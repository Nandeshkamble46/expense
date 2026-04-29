import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface StatCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  icon: React.ReactNode;
  index?: number;
}

const config = {
  income: {
    color: 'text-emerald-400',
    bg: 'from-emerald-500/10 to-transparent',
    border: 'border-emerald-500/20',
    TrendIcon: TrendingUp,
    label: 'Total Income',
  },
  expense: {
    color: 'text-red-400',
    bg: 'from-red-500/10 to-transparent',
    border: 'border-red-500/20',
    TrendIcon: TrendingDown,
    label: 'Total Expenses',
  },
  balance: {
    color: 'text-white',
    bg: 'from-white/5 to-transparent',
    border: 'border-white/10',
    TrendIcon: Minus,
    label: 'Net Balance',
  },
};

const StatCard: React.FC<StatCardProps> = ({ title, amount, type, icon, index = 0 }) => {
  const c = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        relative overflow-hidden rounded-2xl bg-zinc-900
        border ${c.border} p-6
        hover:border-zinc-600 transition-all duration-300
        group cursor-default
      `}
    >
      {/* Gradient glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-60`} />

      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
            {title}
          </span>
          <span className={`text-2xl font-bold tracking-tight ${c.color}`}>
            {formatCurrency(Math.abs(amount))}
            {type === 'balance' && amount < 0 && (
              <span className="text-red-400 text-sm ml-1">(deficit)</span>
            )}
          </span>
        </div>

        <div
          className={`
            p-3 rounded-xl bg-zinc-800/50 ${c.color}
            group-hover:scale-110 transition-transform duration-300
          `}
        >
          {icon}
        </div>
      </div>

      {/* Bottom trend indicator */}
      <div className="relative mt-4 flex items-center gap-1.5">
        <c.TrendIcon size={14} className={c.color} />
        <span className="text-xs text-zinc-500">
          {type === 'income' ? 'Money received' : type === 'expense' ? 'Money spent' : 'Current balance'}
        </span>
      </div>
    </motion.div>
  );
};

export default StatCard;
