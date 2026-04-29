import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ExpenseForm from '../components/expenses/ExpenseForm';
import type { Expense } from '../types';

const Expenses: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">All Transactions</h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            Manage your income and expenses
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setEditingExpense(null);
            setFormOpen(true);
          }}
        >
          Add Transaction
        </Button>
      </motion.div>

      {/* Filters */}
      <ExpenseFilters />

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <ExpenseTable onEdit={handleEdit} />
      </div>

      {/* Add/Edit Modal */}
      <ExpenseForm
        isOpen={formOpen}
        onClose={handleClose}
        editingExpense={editingExpense}
      />
    </div>
  );
};

export default Expenses;
