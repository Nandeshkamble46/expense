import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingDown, Scale, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import SpendingPieChart from '../components/charts/SpendingPieChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { summary, expenses, isSummaryLoading } = useExpenses();

  if (isSummaryLoading) return <Spinner size="lg" className="pt-20" />;

  const totalIncome = summary?.totalIncome || 0;
  const totalExpense = summary?.totalExpense || 0;
  const balance = summary?.balance || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">
            Hello, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            Here's your financial overview
          </p>
        </div>
        <Link to="/expenses">
          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
            Add Transaction
          </Button>
        </Link>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Income"
          amount={totalIncome}
          type="income"
          icon={<Wallet size={20} />}
          index={0}
        />
        <StatCard
          title="Total Expenses"
          amount={totalExpense}
          type="expense"
          icon={<TrendingDown size={20} />}
          index={1}
        />
        <StatCard
          title="Net Balance"
          amount={balance}
          type="balance"
          icon={<Scale size={20} />}
          index={2}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Monthly bar chart - wider */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Monthly Overview</h3>
              <p className="text-zinc-500 text-xs mt-0.5">Income vs Expenses</p>
            </div>
          </div>
          <MonthlyBarChart data={summary?.monthly || []} />
        </div>

        {/* Pie chart - narrower */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="text-white font-semibold">Spending by Category</h3>
            <p className="text-zinc-500 text-xs mt-0.5">All time breakdown</p>
          </div>
          <SpendingPieChart data={summary?.byCategory || []} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold">Recent Transactions</h3>
            <p className="text-zinc-500 text-xs mt-0.5">Latest activity</p>
          </div>
          <Link
            to="/expenses"
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <RecentTransactions expenses={expenses} limit={8} />
      </div>
    </div>
  );
};

export default Dashboard;
