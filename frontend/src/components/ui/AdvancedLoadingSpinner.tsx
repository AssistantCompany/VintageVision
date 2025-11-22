import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import GlassCard from './GlassCard'

interface AdvancedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'glass' | 'minimal' | 'pulsing' | 'orbital'
  text?: string
  className?: string
  progress?: number
}

const sizes = {
  sm: { spinner: 'w-6 h-6', text: 'text-xs', container: 'gap-2' },
  md: { spinner: 'w-10 h-10', text: 'text-sm', container: 'gap-3' },
  lg: { spinner: 'w-16 h-16', text: 'text-base', container: 'gap-4' },
  xl: { spinner: 'w-24 h-24', text: 'text-lg', container: 'gap-6' }
}

const SpinnerVariant = ({ variant, size, progress }: {
  variant: string
  size: string
  progress?: number
}) => {
  const sizeClass = sizes[size as keyof typeof sizes].spinner

  switch (variant) {
    case 'orbital':
      return (
        <div className={cn('relative', sizeClass)}>
          {/* Central core */}
          <motion.div
            className="absolute inset-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Orbiting particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              <div 
                className="absolute w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                style={{
                  top: '10%',
                  left: '50%',
                  transformOrigin: '50% 200%',
                  transform: 'translateX(-50%)'
                }}
              />
            </motion.div>
          ))}
        </div>
      )

    case 'pulsing':
      return (
        <div className={cn('relative', sizeClass)}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-4 border-amber-400/30 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
          <div className="absolute inset-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
        </div>
      )

    case 'minimal':
      return (
        <motion.div
          className={cn('border-4 border-amber-200/30 border-t-amber-500 rounded-full', sizeClass)}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )

    default:
      return (
        <div className={cn('relative', sizeClass)}>
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 border-4 border-amber-200/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Inner spinning element */}
          <motion.div
            className="absolute inset-2 border-4 border-transparent border-t-amber-500 border-r-orange-500 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Center gradient */}
          <div className="absolute inset-4 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full" />
          
          {/* Progress indicator */}
          {progress !== undefined && (
            <motion.div
              className="absolute inset-1 border-4 border-transparent border-t-green-500 rounded-full"
              initial={{ rotate: 0 }}
              animate={{ rotate: (progress / 100) * 360 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      )
  }
}

export default function AdvancedLoadingSpinner({
  size = 'md',
  variant = 'default',
  text,
  className = '',
  progress
}: AdvancedLoadingSpinnerProps) {
  const sizeConfig = sizes[size]

  const content = (
    <div className={cn('flex flex-col items-center', sizeConfig.container)}>
      <SpinnerVariant variant={variant} size={size} progress={progress} />
      
      {text && (
        <motion.div
          className="text-center space-y-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className={cn('font-medium text-gray-700', sizeConfig.text)}>
            {text}
          </p>
          
          {progress !== undefined && (
            <motion.div
              className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )

  if (variant === 'glass') {
    return (
      <GlassCard className={cn('p-8 text-center', className)} gradient="warm">
        {content}
      </GlassCard>
    )
  }

  return (
    <motion.div
      className={cn('flex flex-col items-center', className)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {content}
    </motion.div>
  )
}
