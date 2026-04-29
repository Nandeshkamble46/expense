import { Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Expense, { CATEGORIES } from '../models/Expense';
import type { Category } from '../models/Expense';
import { AuthRequest } from '../middleware/authMiddleware';

type ExpenseFilter = {
  userId: mongoose.Types.ObjectId;
  category?: Category;
  type?: 'income' | 'expense';
  date?: {
    $gte?: Date;
    $lte?: Date;
  };
  $or?: Array<{
    title?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
};

/**
 * @desc    Get all expenses for the authenticated user with filters
 * @route   GET /api/expenses
 * @access  Private
 */
export const getExpenses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const {
      category,
      type,
      startDate,
      endDate,
      search,
      page = '1',
      limit = '20',
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query as Record<string, string>;

    // Build query filter
    const filter: ExpenseFilter = { userId };

    if (category && CATEGORIES.includes(category as Category)) {
      filter.category = category as Category;
    }
    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type as 'income' | 'expense';
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate + 'T23:59:59');
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort(sort).skip(skip).limit(limitNum),
      Expense.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard summary: total income, expenses, balance + monthly breakdown
 * @route   GET /api/expenses/summary
 * @access  Private
 */
export const getSummary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { year = new Date().getFullYear().toString() } = req.query as Record<string, string>;

    const yearNum = parseInt(year, 10);
    const startOfYear = new Date(yearNum, 0, 1);
    const endOfYear = new Date(yearNum, 11, 31, 23, 59, 59);

    // Overall totals
    const totals = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId.toString()) } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const incomeTotal = totals.find((t) => t._id === 'income')?.total || 0;
    const expenseTotal = totals.find((t) => t._id === 'expense')?.total || 0;

    // Monthly breakdown for selected year
    const monthly = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId.toString()),
          date: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    // Category breakdown
    const byCategory = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId.toString()),
          type: 'expense',
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalIncome: incomeTotal,
        totalExpense: expenseTotal,
        balance: incomeTotal - expenseTotal,
        monthly,
        byCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new expense
 * @route   POST /api/expenses
 * @access  Private
 */
export const createExpense = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('category').isIn(CATEGORIES).withMessage('Invalid category'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('date').isISO8601().withMessage('Invalid date format'),

  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      const expense = await Expense.create({
        ...req.body,
        userId: req.user!._id,
      });

      res.status(201).json({ success: true, data: expense });
    } catch (error) {
      next(error);
    }
  },
];

/**
 * @desc    Update an expense
 * @route   PUT /api/expenses/:id
 * @access  Private
 */
export const updateExpense = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!expense) {
      res.status(404).json({ success: false, message: 'Expense not found' });
      return;
    }

    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an expense
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
export const deleteExpense = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!expense) {
      res.status(404).json({ success: false, message: 'Expense not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
};
