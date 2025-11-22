import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassProps {
  children: ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: 'default' | 'warm' | 'cool' | 'vintage';
  hover?: boolean;
}

const blurClasses = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md', 
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl'
};

const shadowClasses = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
};

const gradientClasses = {
  default: 'bg-white/10 border-white/20',
  warm: 'bg-gradient-to-br from-amber-50/30 to-orange-100/20 border-amber-200/30',
  cool: 'bg-gradient-to-br from-blue-50/30 to-purple-100/20 border-blue-200/30',
  vintage: 'bg-gradient-to-br from-amber-50/40 to-orange-50/30 border-amber-300/40'
};

export default function Glass({
  children,
  className = '',
  blur = 'md',
  opacity = 0.1,
  border = true,
  shadow = 'lg',
  gradient = 'vintage',
  hover = false
}: GlassProps) {
  const baseClasses = [
    blurClasses[blur],
    shadowClasses[shadow],
    gradientClasses[gradient],
    border ? 'border' : '',
    'rounded-xl',
    'backdrop-saturate-150',
    hover ? 'transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={baseClasses}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${opacity})`
      }}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}
