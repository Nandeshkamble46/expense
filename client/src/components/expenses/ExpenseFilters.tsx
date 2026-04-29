import React from 'react';
import { Filter, X } from 'lucide-react';
import { CATEGORIES } from '../../types';
import { useExpenses } from '../../context/ExpenseContext';
import Button from '../common/Button';
import { defaultFilters } from '../../context/ExpenseContext';

const ExpenseFilters: React.FC = () => {
  const { filters, setFilters } = useExpenses();

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const hasActiveFilters =
    filters.category || filters.type || filters.startDate || filters.endDate;

  const clearFilters = () => setFilters(defaultFilters);

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
      <Filter size={16} className="text-zinc-500 shrink-0" />

      {/* Category */}
      <select
        value={filters.category}
        onChange={(e) => updateFilter('category', e.target.value)}
        className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm text-zinc-300 outline-none focus:border-zinc-600 cursor-pointer"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat} className="bg-zinc-800">
            {cat}
          </option>
        ))}
      </select>

      {/* Type */}
      <select
        value={filters.type}
        onChange={(e) => updateFilter('type', e.target.value)}
        className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm text-zinc-300 outline-none focus:border-zinc-600 cursor-pointer"
      >
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Date range */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => updateFilter('startDate', e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm text-zinc-300 outline-none focus:border-zinc-600 cursor-pointer"
        />
        <span className="text-zinc-600 text-xs">to</span>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => updateFilter('endDate', e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm text-zinc-300 outline-none focus:border-zinc-600 cursor-pointer"
        />
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          leftIcon={<X size={14} />}
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default ExpenseFilters;
