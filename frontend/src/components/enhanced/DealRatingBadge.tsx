import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Sparkles, AlertTriangle, DollarSign } from 'lucide-react'
import { DealRating, formatPrice } from '@/types'
import { cn } from '@/lib/utils'

interface DealRatingBadgeProps {
  rating: DealRating | null
  askingPrice: number | null
  estimatedMin: number | null
  estimatedMax: number | null
  profitPotentialMin: number | null
  profitPotentialMax: number | null
  explanation: string | null
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
}

const ratingConfig: Record<DealRating, {
  label: string
  icon: typeof TrendingUp
  bgGradient: string
  textColor: string
  borderColor: string
  glowColor: string
  emoji: string
}> = {
  exceptional: {
    label: 'Exceptional Deal',
    icon: Sparkles,
    bgGradient: 'from-emerald-500 to-green-600',
    textColor: 'text-white',
    borderColor: 'border-emerald-400',
    glowColor: 'shadow-emerald-500/50',
    emoji: '🔥'
  },
  good: {
    label: 'Good Deal',
    icon: TrendingUp,
    bgGradient: 'from-blue-500 to-cyan-600',
    textColor: 'text-white',
    borderColor: 'border-blue-400',
    glowColor: 'shadow-blue-500/50',
    emoji: '👍'
  },
  fair: {
    label: 'Fair Price',
    icon: Minus,
    bgGradient: 'from-amber-500 to-yellow-600',
    textColor: 'text-white',
    borderColor: 'border-amber-400',
    glowColor: 'shadow-amber-500/50',
    emoji: '🤔'
  },
  overpriced: {
    label: 'Overpriced',
    icon: TrendingDown,
    bgGradient: 'from-red-500 to-rose-600',
    textColor: 'text-white',
    borderColor: 'border-red-400',
    glowColor: 'shadow-red-500/50',
    emoji: '⚠️'
  }
}

export default function DealRatingBadge({
  rating,
  askingPrice,
  estimatedMin,
  estimatedMax,
  profitPotentialMin,
  profitPotentialMax,
  explanation,
  size = 'md',
  showDetails = true
}: DealRatingBadgeProps) {
  if (!rating || askingPrice === null) return null

  const config = ratingConfig[rating]
  const Icon = config.icon

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="space-y-4"
    >
      {/* Main Badge */}
      <motion.div
        className={cn(
          'inline-flex items-center gap-2 rounded-2xl font-bold',
          `bg-gradient-to-r ${config.bgGradient}`,
          config.textColor,
          `shadow-lg ${config.glowColor}`,
          sizeClasses[size]
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className={iconSizes[size]} />
        <span>{config.emoji} {config.label}</span>
      </motion.div>

      {/* Deal Details */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 shadow-sm"
        >
          {/* Price Comparison */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Asking Price</p>
              <p className="text-xl font-bold text-gray-900">{formatPrice(askingPrice)}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Market Value</p>
              <p className="text-xl font-bold text-gray-900">
                {estimatedMin && estimatedMax
                  ? `${formatPrice(estimatedMin)} - ${formatPrice(estimatedMax)}`
                  : formatPrice(estimatedMin || estimatedMax)}
              </p>
            </div>
          </div>

          {/* Profit Potential */}
          {(profitPotentialMin != null || profitPotentialMax != null) && (
            <div className={cn(
              'p-4 rounded-xl mb-4',
              rating === 'exceptional' || rating === 'good'
                ? 'bg-green-50 border border-green-200'
                : rating === 'fair'
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-red-50 border border-red-200'
            )}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className={cn(
                  'w-5 h-5',
                  rating === 'exceptional' || rating === 'good'
                    ? 'text-green-600'
                    : rating === 'fair'
                      ? 'text-amber-600'
                      : 'text-red-600'
                )} />
                <span className="font-semibold text-gray-900">Profit Potential</span>
              </div>
              <p className={cn(
                'text-2xl font-bold',
                rating === 'exceptional' || rating === 'good'
                  ? 'text-green-600'
                  : rating === 'fair'
                    ? 'text-amber-600'
                    : 'text-red-600'
              )}>
                {profitPotentialMin != null && profitPotentialMax != null
                  ? `${formatPrice(profitPotentialMin)} - ${formatPrice(profitPotentialMax)}`
                  : profitPotentialMin != null
                    ? `${formatPrice(profitPotentialMin)}+`
                    : `Up to ${formatPrice(profitPotentialMax)}`
                }
              </p>
            </div>
          )}

          {/* Explanation */}
          {explanation && (
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 leading-relaxed">{explanation}</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
