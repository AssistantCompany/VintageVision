import { motion } from 'framer-motion'
import { GlassCard } from './glass-card'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'glass' | 'minimal'
  text?: string
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

export default function LoadingSpinner({
  size = 'md',
  variant = 'default',
  text,
  className = ''
}: LoadingSpinnerProps) {
  const SpinnerElement = (
    <div className={cn(sizeClasses[size], className)}>
      <motion.div
        className="w-full h-full border-3 border-muted border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )

  const content = (
    <div className="flex flex-col items-center gap-3">
      {SpinnerElement}
      {text && (
        <motion.p
          className="text-sm text-muted-foreground font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )

  if (variant === 'glass') {
    return (
      <GlassCard variant="brass" className="p-6">
        {content}
      </GlassCard>
    )
  }

  if (variant === 'minimal') {
    return SpinnerElement
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {content}
    </motion.div>
  )
}
