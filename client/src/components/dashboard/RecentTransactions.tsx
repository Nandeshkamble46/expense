import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Trash2, Pencil } from 'lucide-react';
import type { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../utils/categoryColors';

interface RecentTransactionsProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  limit?: number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  expenses,
  onEdit,
  onDelete,
  limit = 8,
}) => {
  const displayed = expenses.slice(0, limit);

  if (!displayed.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-3">
          <ArrowUpRight size={20} />
        </div>
        <p className="text-sm">No transactions yet</p>
        <p className="text-xs mt-1 text-zinc-700">Add your first expense above</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {displayed.map((expense, i) => (
          <motion.div
            key={expense._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors group"
          >
            {/* Category dot */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${CATEGORY_COLORS[expense.category]}20` }}
            >
              {expense.type === 'income' ? (
                <ArrowUpRight size={16} style={{ color: CATEGORY_COLORS[expense.category] }} />
              ) : (
                <ArrowDownRight size={16} style={{ color: CATEGORY_COLORS[expense.category] }} />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{expense.title}</p>
              <p className="text-xs text-zinc-500">
                {expense.category} · {formatDate(expense.date, 'dd MMM')}
              </p>
            </div>

            {/* Amount */}
            <span
              className={`text-sm font-semibold shrink-0 ${
                expense.type === 'income' ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount)}
            </span>

            {/* Actions (visible on hover) */}
            {(onEdit || onDelete) && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {onEdit && (
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(expense._id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RecentTransactions;
