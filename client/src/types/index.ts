// ─── Expense & Auth Types ───────────────────────────────────────────────────

export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Housing',
  'Personal Care',
  'Investments',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];
export type TransactionType = 'income' | 'expense';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Expense {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string;
  description?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ExpenseFilters {
  search: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  page: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// ─── API Response Types ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
  user?: User;
  pagination?: Pagination;
}

export interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthly: MonthlyData[];
  byCategory: CategoryData[];
}

export interface MonthlyData {
  _id: { month: number; type: string };
  total: number;
}

export interface CategoryData {
  _id: string;
  total: number;
  count: number;
}

// ─── Chart Types ────────────────────────────────────────────────────────────

export interface MonthlyChartData {
  month: string;
  income: number;
  expense: number;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}
