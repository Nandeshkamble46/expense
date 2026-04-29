import { Router } from 'express';
import protect from '../middleware/authMiddleware';
import {
  getExpenses,
  getSummary,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController';

const router = Router();

// All expense routes require authentication
router.use(protect);

/**
 * Expense Routes
 * GET    /api/expenses          - Get all expenses (with filters)
 * POST   /api/expenses          - Create new expense
 * GET    /api/expenses/summary  - Get dashboard summary & aggregations
 * PUT    /api/expenses/:id      - Update expense
 * DELETE /api/expenses/:id      - Delete expense
 */
router.get('/summary', getSummary);
router.route('/').get(getExpenses).post(createExpense);
router.route('/:id').put(updateExpense).delete(deleteExpense);

export default router;
