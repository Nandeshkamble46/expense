import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar } from 'lucide-react';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import SpendingPieChart from '../components/charts/SpendingPieChart';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';
import { CATEGORY_COLORS } from '../utils/categoryColors';

const YEARS = [2022, 2023, 2024, 2025, 2026];

const Reports: React.FC = () => {
  const { summary, expenses, isSummaryLoading, fetchSummary } = useExpenses();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isExporting, setIsExporting] = useState(false);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    fetchSummary(year);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { exportExpensesPDF } = await import('../utils/pdfExport');
      exportExpensesPDF(expenses, summary || undefined);
      toast.success('PDF exported successfully');
    } catch {
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  if (isSummaryLoading) return <Spinner size="lg" className="pt-20" />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            Detailed financial insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Year selector */}
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
            <Calendar size={16} className="text-zinc-500" />
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="bg-transparent text-sm text-white outline-none cursor-pointer"
            >
              {YEARS.map((y) => (
                <option key={y} value={y} className="bg-zinc-900">
                  {y}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="secondary"
            leftIcon={<Download size={16} />}
            onClick={handleExport}
            isLoading={isExporting}
          >
            Export PDF
          </Button>
        </div>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Income', value: summary?.totalIncome || 0, color: 'text-emerald-400' },
          { label: 'Total Expenses', value: summary?.totalExpense || 0, color: 'text-red-400' },
          { label: 'Net Balance', value: summary?.balance || 0, color: 'text-white' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
          >
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              {item.label}
            </p>
            <p className={`text-2xl font-bold ${item.color}`}>
              {formatCurrency(Math.abs(item.value))}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Monthly Breakdown - {selectedYear}</h3>
          <p className="text-zinc-500 text-xs mb-4">Income vs Expenses by month</p>
          <MonthlyBarChart data={summary?.monthly || []} />
        </div>

        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Spending by Category</h3>
          <p className="text-zinc-500 text-xs mb-4">All-time expense distribution</p>
          <SpendingPieChart data={summary?.byCategory || []} />
        </div>
      </div>

      {/* Category breakdown table */}
      {summary?.byCategory && summary.byCategory.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Category Analysis</h3>
          <div className="space-y-3">
            {summary.byCategory.map((cat) => {
              const pct = summary.totalExpense > 0
                ? (cat.total / summary.totalExpense) * 100
                : 0;
              const color = CATEGORY_COLORS[cat._id] || '#6b7280';
              return (
                <div key={cat._id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300 font-medium">{cat._id}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500 text-xs">{cat.count} txn</span>
                      <span className="text-white font-semibold">{formatCurrency(cat.total)}</span>
                      <span className="text-zinc-500 text-xs w-10 text-right">{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
