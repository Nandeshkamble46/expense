import React, { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useExpenses } from '../../context/ExpenseContext';

interface TopbarProps {
  onMenuClick: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/expenses': 'Expenses',
  '/reports': 'Reports',
};

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'FinTrack';
  const { filters, setFilters } = useExpenses();
  const [searchVal, setSearchVal] = useState(filters.search);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    // Debounce via timeout stored in ref would be ideal, but for simplicity:
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Page Title */}
      <h1 className="text-xl font-bold text-white mr-auto lg:ml-0">{title}</h1>

      {/* Search — only shown on expenses page */}
      {location.pathname === '/expenses' && (
        <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 w-72">
          <Search size={16} className="text-zinc-500 shrink-0" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchVal}
            onChange={handleSearch}
            className="bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none w-full"
          />
        </div>
      )}

      {/* Notification Bell */}
      <button className="relative p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full" />
      </button>
    </header>
  );
};

export default Topbar;
