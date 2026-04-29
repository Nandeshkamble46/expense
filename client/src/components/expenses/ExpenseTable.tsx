import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../utils/categoryColors';
import { useExpenses } from '../../context/ExpenseContext';
import Spinner from '../common/Spinner';

interface ExpenseTableProps {
  onEdit: (expense: Expense) => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ onEdit }) => {
  const { expenses, isLoading, deleteExpense, filters, setFilters, pagination } =
    useExpenses();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;
    setDeletingId(id);
    try {
      await deleteExpense(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSort = (col: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: col,
      sortOrder: prev.sortBy === col && prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (filters.sortBy !== col) return <ChevronDown size={14} className="text-zinc-600" />;
    return filters.sortOrder === 'asc' ? (
      <ChevronUp size={14} className="text-white" />
    ) : (
      <ChevronDown size={14} className="text-white" />
    );
  };

  if (isLoading) {
    return <Spinner size="lg" className="py-16" />;
  }

  if (!expenses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
        <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
          <Trash2 size={22} className="text-zinc-600" />
        </div>
        <p className="text-sm font-medium">No transactions found</p>
        <p className="text-xs mt-1 text-zinc-700">Try adjusting your filters or add a new one</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            {[
              { label: 'Date', col: 'date' },
              { label: 'Title', col: 'title' },
              { label: 'Category', col: 'category' },
              { label: 'Type', col: 'type' },
              { label: 'Amount', col: 'amount' },
            ].map(({ label, col }) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 transition-colors select-none"
              >
                <span className="flex items-center gap-1">
                  {label}
                  <SortIcon col={col} />
                </span>
              </th>
            ))}
            <th className="py-3 px-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <AnimatePresence>
            {expenses.map((expense, i) => (
              <motion.tr
                key={expense._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group"
              >
                <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                  {formatDate(expense.date, 'dd MMM yyyy')}
                </td>
                <td className="py-3.5 px-4">
                  <div>
                    <p className="text-white font-medium">{expense.title}</p>
                    {expense.description && (
                      <p className="text-xs text-zinc-600 mt-0.5 truncate max-w-[200px]">
                        {expense.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[expense.category]}20`,
                      color: CATEGORY_COLORS[expense.category],
                    }}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-xs font-medium capitalize px-2.5 py-0.5 rounded-full border ${
                      expense.type === 'income'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-red-400 bg-red-500/10 border-red-500/20'
                    }`}
                  >
                    {expense.type}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-semibold ${
                      expense.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {expense.type === 'income' ? '+' : '-'}
                    {formatCurrency(expense.amount)}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      disabled={deletingId === expense._id}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === expense._id ? (
                        <Spinner size="sm" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-zinc-800">
          <p className="text-xs text-zinc-500">
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} entries
          </p>
          <div className="flex gap-2">
            <button
              disabled={filters.page <= 1}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
              className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            <button
              disabled={filters.page >= pagination.pages}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
              className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
