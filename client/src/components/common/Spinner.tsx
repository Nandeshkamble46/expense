import React from 'react';
import { motion } from 'framer-motion';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <motion.div
      className={`${sizes[size]} border-2 border-zinc-700 border-t-white rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: 'linear', duration: 0.8 }}
    />
  </div>
);

export default Spinner;

/**
 * Full-page loading overlay.
 */
export const PageLoader: React.FC = () => (
  <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-zinc-500 text-sm animate-pulse">Loading...</p>
    </div>
  </div>
);
