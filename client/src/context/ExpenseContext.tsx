import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import axiosInstance from '../api/axiosInstance';
import type {
  Expense,
  ExpenseFormData,
  ExpenseFilters,
  SummaryData,
  Pagination,
} from '../types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '../utils/apiError';

interface ExpenseContextType {
  expenses: Expense[];
  summary: SummaryData | null;
  pagination: Pagination | null;
  filters: ExpenseFilters;
  isLoading: boolean;
  isSummaryLoading: boolean;
  fetchExpenses: () => Promise<void>;
  fetchSummary: (year?: number) => Promise<void>;
  addExpense: (data: ExpenseFormData) => Promise<void>;
  updateExpense: (id: string, data: Partial<ExpenseFormData>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  setFilters: React.Dispatch<React.SetStateAction<ExpenseFilters>>;
}

export const defaultFilters: ExpenseFilters = {
  search: '',
  category: '',
  type: '',
  startDate: '',
  endDate: '',
  page: 1,
  sortBy: 'date',
  sortOrder: 'desc',
};

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const fetchExpenses = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.category) params.set('category', filters.category);
      if (filters.type) params.set('type', filters.type);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
      params.set('page', String(filters.page));
      params.set('sortBy', filters.sortBy);
      params.set('sortOrder', filters.sortOrder);

      const { data } = await axiosInstance.get(`/expenses?${params.toString()}`);
      setExpenses(data.data);
      setPagination(data.pagination);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to fetch expenses'));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, filters]);

  const fetchSummary = useCallback(
    async (year = new Date().getFullYear()) => {
      if (!isAuthenticated) return;
      setIsSummaryLoading(true);
      try {
        const { data } = await axiosInstance.get(`/expenses/summary?year=${year}`);
        setSummary(data.data);
      } catch (err: unknown) {
        toast.error(getApiErrorMessage(err, 'Failed to fetch summary'));
      } finally {
        setIsSummaryLoading(false);
      }
    },
    [isAuthenticated]
  );

  const addExpense = useCallback(async (formData: ExpenseFormData) => {
    const { data } = await axiosInstance.post('/expenses', formData);
    setExpenses((prev) => [data.data, ...prev]);
    toast.success('Expense added successfully! ✅');
    fetchSummary();
  }, [fetchSummary]);

  const updateExpense = useCallback(
    async (id: string, formData: Partial<ExpenseFormData>) => {
      const { data } = await axiosInstance.put(`/expenses/${id}`, formData);
      setExpenses((prev) =>
        prev.map((e) => (e._id === id ? data.data : e))
      );
      toast.success('Expense updated! ✏️');
      fetchSummary();
    },
    [fetchSummary]
  );

  const deleteExpense = useCallback(async (id: string) => {
    await axiosInstance.delete(`/expenses/${id}`);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
    toast.success('Expense deleted 🗑️');
    fetchSummary();
  }, [fetchSummary]);

  // Fetch expenses whenever filters or auth state changes
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        summary,
        pagination,
        filters,
        isLoading,
        isSummaryLoading,
        fetchExpenses,
        fetchSummary,
        addExpense,
        updateExpense,
        deleteExpense,
        setFilters,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = (): ExpenseContextType => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenses must be used within ExpenseProvider');
  return ctx;
};
