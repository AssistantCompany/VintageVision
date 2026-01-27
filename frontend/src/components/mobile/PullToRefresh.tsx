import React, { ReactNode } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { usePullToRefresh } from '@/hooks/useGestures'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { RefreshCw, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  threshold?: number
  disabled?: boolean
  className?: string
}

export default function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false,
  className
}: PullToRefreshProps) {
  const deviceInfo = useMobileDetection()
  const { bind, refreshing, pullDistance: pullDistanceState } = usePullToRefresh(onRefresh, threshold)
  
  // Create motion value for smooth animations
  const pullDistance = useMotionValue(0)

  // Update motion value when state changes
  React.useEffect(() => {
    pullDistance.set(pullDistanceState.get())
  }, [pullDistanceState.get(), pullDistance])

  // Don't render on desktop or when disabled
  if (!deviceInfo.isMobile || disabled) {
    return <div className={className}>{children}</div>
  }

  const currentDistance = pullDistanceState.get()
  const iconRotation = (currentDistance / threshold) * 360
  const iconScale = 0.8 + (currentDistance / threshold) * 0.4
  const opacity = Math.min(1, currentDistance / (threshold * 0.3))

  return (
    <div className={cn('relative', className)}>
      {/* Pull to refresh indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex justify-center z-10"
        style={{ 
          transform: `translateY(${currentDistance}px)`,
          opacity
        }}
      >
        <motion.div
          className={cn(
            'flex flex-col items-center justify-center p-4 bg-white/90 backdrop-blur-sm rounded-b-2xl shadow-lg border border-border/50',
            'transition-all duration-300'
          )}
          style={{
            scale: iconScale
          }}
        >
          {refreshing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-6 h-6 text-amber-500" />
            </motion.div>
          ) : (
            <motion.div style={{ rotate: iconRotation }}>
              <ArrowDown className={cn(
                'w-6 h-6 transition-colors duration-300',
                currentDistance >= threshold ? 'text-green-500' : 'text-amber-500'
              )} />
            </motion.div>
          )}
          
          <motion.p 
            className="text-xs font-medium mt-1 text-muted-foreground"
            animate={{
              color: refreshing 
                ? '#10b981' 
                : currentDistance >= threshold 
                  ? '#10b981' 
                  : '#6b7280'
            }}
          >
            {refreshing 
              ? 'Refreshing...' 
              : currentDistance >= threshold 
                ? 'Release to refresh'
                : 'Pull to refresh'
            }
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Content */}
      <div
        {...bind}
        className="min-h-full"
        style={{ 
          transform: `translateY(${currentDistance}px)`,
          touchAction: 'none'
        }}
      >
        {children}
      </div>

      {/* Loading overlay during refresh */}
      {refreshing && (
        <motion.div
          className="absolute inset-0 bg-white/20 backdrop-blur-sm z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <motion.div
              className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Wrapper component for easy integration
export function withPullToRefresh<T extends object>(
  Component: React.ComponentType<T>,
  onRefresh: () => Promise<void>,
  options?: { threshold?: number; disabled?: boolean }
) {
  return function PullToRefreshWrapper(props: T) {
    return (
      <PullToRefresh 
        onRefresh={onRefresh} 
        threshold={options?.threshold}
        disabled={options?.disabled}
      >
        <Component {...props} />
      </PullToRefresh>
    )
  }
}
