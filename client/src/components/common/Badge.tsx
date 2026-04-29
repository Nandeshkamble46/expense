import React from 'react';

interface BadgeProps {
  variant?: 'income' | 'expense' | 'default';
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  income: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  expense: 'bg-red-500/15 text-red-400 border border-red-500/20',
  default: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
