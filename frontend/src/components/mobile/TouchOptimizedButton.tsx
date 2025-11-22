import { motion, Variants } from 'framer-motion'
import { forwardRef } from 'react'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { useLongPress } from '@/hooks/useGestures'
import { cn, vibrate } from '@/lib/utils'

interface TouchOptimizedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'touch'
  fullWidth?: boolean
  loading?: boolean
  hapticFeedback?: boolean
  longPressAction?: () => void
  longPressDuration?: number
  icon?: React.ReactNode
  children?: React.ReactNode
}

const buttonVariants: Variants = {
  idle: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  loading: { scale: 1, opacity: 0.8 }
}

const TouchOptimizedButton = forwardRef<HTMLButtonElement, TouchOptimizedButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    hapticFeedback = true,
    longPressAction,
    longPressDuration = 500,
    icon,
    children,
    className,
    onClick,
    disabled,
    ...props
  }, ref) => {
    const deviceInfo = useMobileDetection()

    const longPressGesture = useLongPress(() => {
      if (longPressAction && !disabled && !loading) {
        if (hapticFeedback && deviceInfo.supportsHaptics) {
          vibrate([200, 100, 200])
        }
        longPressAction()
      }
    }, longPressDuration)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return
      
      if (hapticFeedback && deviceInfo.supportsHaptics) {
        vibrate(50)
      }
      
      onClick?.(e)
    }

    const variantStyles = {
      primary: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-lg shadow-amber-500/25 border-0',
      secondary: 'bg-white text-gray-900 border border-gray-300 shadow-md hover:shadow-lg',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200',
      glass: 'bg-white/10 backdrop-blur-xl border border-white/20 text-gray-900 shadow-xl',
      danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25'
    }

    const sizeStyles = {
      xs: 'px-2 py-1 text-xs min-h-[32px]',
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-2.5 text-base min-h-[40px]',
      lg: 'px-6 py-3 text-lg min-h-[44px]',
      xl: 'px-8 py-4 text-xl min-h-[52px]',
      touch: 'px-6 py-4 text-base min-h-[44px] min-w-[44px]' // Optimized for touch
    }

    // Use touch size on mobile if not specifically set
    const effectiveSize = deviceInfo.isMobile && size === 'md' ? 'touch' : size

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          'relative overflow-hidden rounded-xl font-medium transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center justify-center gap-2',
          
          // Variant styles
          variantStyles[variant],
          
          // Size styles
          sizeStyles[effectiveSize],
          
          // Full width
          fullWidth && 'w-full',
          
          // Loading state
          loading && 'cursor-wait',
          
          // Mobile optimizations
          deviceInfo.isMobile && [
            'active:scale-95', // More pronounced tap feedback on mobile
            'touch-manipulation', // Optimize for touch
            'select-none', // Prevent text selection on mobile
          ],
          
          className
        )}
        variants={buttonVariants}
        initial="idle"
        animate={loading ? "loading" : "idle"}
        whileHover={!disabled && !loading ? "hover" : "idle"}
        whileTap={!disabled && !loading ? "tap" : "idle"}
        onClick={handleClick}
        disabled={disabled || loading}
        {...(longPressAction ? longPressGesture.bind : {})}
        style={props.style}
        type={props.type}
        form={props.form}
        name={props.name}
        value={props.value}
      >
        {/* Loading spinner */}
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-inherit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}

        {/* Button content */}
        <motion.div
          className={cn(
            'flex items-center justify-center gap-2',
            loading && 'opacity-0'
          )}
          animate={{ opacity: loading ? 0 : 1 }}
        >
          {icon && (
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {icon}
            </motion.div>
          )}
          {children}
        </motion.div>

        {/* Ripple effect for touch */}
        {deviceInfo.isTouchDevice && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            initial={{ background: "transparent" }}
            whileTap={{
              background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
            }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Long press indicator */}
        {longPressAction && false && (
          <motion.div
            className="absolute inset-0 border-2 border-white/50 rounded-xl"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ 
              scale: [1, 1.05, 1], 
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ 
              duration: longPressDuration / 1000, 
              ease: "easeInOut" 
            }}
          />
        )}

        {/* Shine effect for primary buttons */}
        {variant === 'primary' && !loading && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
            whileHover={{ 
              opacity: 1,
              x: ['-100%', '100%']
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
      </motion.button>
    )
  }
)

TouchOptimizedButton.displayName = 'TouchOptimizedButton'

export default TouchOptimizedButton
