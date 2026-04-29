import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { CATEGORIES } from '../../types';
import type { Expense, ExpenseFormData } from '../../types';
import { useExpenses } from '../../context/ExpenseContext';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '../../utils/apiError';

// Zod validation schema
const schema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  amount: z.coerce.number().positive('Amount must be positive'),
  category: z.enum(CATEGORIES),
  type: z.enum(['income', 'expense'] as const),
  date: z.string().min(1, 'Date is required'),
  description: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingExpense?: Expense | null;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ isOpen, onClose, editingExpense }) => {
  const { addExpense, updateExpense } = useExpenses();
  const isEditing = !!editingExpense;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      amount: 0,
      category: 'Food & Dining' as const,
      type: 'expense' as const,
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      reset({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        type: editingExpense.type,
        date: format(new Date(editingExpense.date), 'yyyy-MM-dd'),
        description: editingExpense.description || '',
      });
    } else {
      reset({
        title: '',
        amount: 0,
        category: 'Food & Dining',
        type: 'expense',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
      });
    }
  }, [editingExpense, reset]);

  const selectedType = useWatch({ control, name: 'type' });

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing && editingExpense) {
        await updateExpense(editingExpense._id, values as ExpenseFormData);
      } else {
        await addExpense(values as ExpenseFormData);
      }
      onClose();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Something went wrong'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Expense' : 'Add New Transaction'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type toggle */}
        <div className="flex rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 p-1 gap-1">
          {(['expense', 'income'] as const).map((t) => (
            <label
              key={t}
              className={`flex-1 text-center py-2 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ${
                selectedType === t
                  ? t === 'expense'
                    ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                    : 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <input type="radio" value={t} {...register('type')} className="sr-only" />
              {t === 'expense' ? '↓ Expense' : '↑ Income'}
            </label>
          ))}
        </div>

        {/* Title */}
        <Input
          label="Title"
          placeholder="e.g. Grocery shopping"
          required
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Amount + Date row */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Amount (₹)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            required
            error={errors.amount?.message}
            {...register('amount')}
          />
          <Input
            label="Date"
            type="date"
            required
            error={errors.date?.message}
            {...register('date')}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            {...register('category')}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-zinc-600 focus:ring-2 focus:ring-white/5 transition-all"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-zinc-900">
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-400">{errors.category.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Description</label>
          <textarea
            {...register('description')}
            placeholder="Optional notes..."
            rows={2}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-white/5 transition-all resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isSubmitting}
          >
            {isEditing ? 'Update' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseForm;
