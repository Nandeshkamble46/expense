import { format, parseISO, isValid } from 'date-fns';

/**
 * Format a number as Indian Rupee currency string.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string to a readable format.
 */
export const formatDate = (dateStr: string, fmt = 'dd MMM yyyy'): string => {
  try {
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, fmt) : 'Invalid date';
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format a date for an input[type="date"] field (YYYY-MM-DD).
 */
export const formatDateInput = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
  } catch {
    return '';
  }
};

/**
 * Get the short month name for a month index (1-based).
 */
export const getMonthName = (month: number): string => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return months[month - 1] || '';
};

/**
 * Truncate text to a max length with ellipsis.
 */
export const truncate = (text: string, maxLen = 40): string =>
  text.length > maxLen ? text.slice(0, maxLen) + '…' : text;

/**
 * Get initials from a full name.
 */
export const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || '')
    .join('');
