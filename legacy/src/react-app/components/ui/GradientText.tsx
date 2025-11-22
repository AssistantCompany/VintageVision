import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  gradient?: 'primary' | 'secondary' | 'accent' | 'warm' | 'cool';
}

const gradientClasses = {
  primary: 'bg-gradient-to-r from-amber-500 to-orange-500',
  secondary: 'bg-gradient-to-r from-purple-500 to-pink-500',
  accent: 'bg-gradient-to-r from-blue-500 to-teal-500',
  warm: 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500',
  cool: 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500'
};

export default function GradientText({
  children,
  className = '',
  gradient = 'primary'
}: GradientTextProps) {
  return (
    <span className={`${gradientClasses[gradient]} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}
