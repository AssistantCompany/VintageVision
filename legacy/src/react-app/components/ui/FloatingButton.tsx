import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FloatingButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
  loading?: boolean;
}

const sizeClasses = {
  sm: 'p-2 text-sm',
  md: 'p-3 text-base',
  lg: 'p-4 text-lg'
};

const variantClasses = {
  primary: 'from-amber-400 to-orange-500 text-white shadow-amber-500/25',
  secondary: 'from-gray-100 to-gray-200 text-gray-700 shadow-gray-500/25',
  accent: 'from-purple-400 to-pink-500 text-white shadow-purple-500/25'
};

export default function FloatingButton({
  children,
  onClick,
  className = '',
  size = 'md',
  variant = 'primary',
  disabled = false,
  loading = false
}: FloatingButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${sizeClasses[size]}
        ${className}
        relative overflow-hidden rounded-full
        bg-gradient-to-r ${variantClasses[variant]}
        font-medium
        transform transition-all duration-200
        hover:scale-105 hover:shadow-lg
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
      `}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
          Loading...
        </div>
      ) : (
        children
      )}
      
      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full" />
      
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
}
