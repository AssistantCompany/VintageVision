/**
 * Paywall Component - VintageVision Premium
 *
 * A reusable component that blocks premium features for free users.
 * Supports two variants:
 * - soft: Gentle upgrade prompt (non-blocking)
 * - hard: Full blocking overlay
 *
 * Can be displayed inline or as a modal.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Crown,
  Lock,
  Sparkles,
  ArrowRight,
  X,
  Infinity as InfinityIcon,
  Shield,
  Zap,
  Star,
  Gift
} from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'
import { SubscriptionTier, TIER_NAMES, TIER_PRICING } from '@/types'

// Feature definitions for display
export interface PaywallFeature {
  icon: React.ReactNode
  title: string
  description: string
}

// Preset features for common use cases
const PRESET_FEATURES: Record<string, PaywallFeature[]> = {
  collection: [
    { icon: <InfinityIcon className="w-5 h-5" />, title: 'Unlimited Collection', description: 'Save as many items as you want' },
    { icon: <Shield className="w-5 h-5" />, title: 'Cloud Backup', description: 'Never lose your treasures' },
    { icon: <Zap className="w-5 h-5" />, title: 'Instant Sync', description: 'Access from any device' },
  ],
  analysis: [
    { icon: <InfinityIcon className="w-5 h-5" />, title: 'Unlimited Analyses', description: 'Identify as many items as you need' },
    { icon: <Star className="w-5 h-5" />, title: 'Priority Processing', description: 'Skip the queue' },
    { icon: <Shield className="w-5 h-5" />, title: 'Detailed Reports', description: 'Export PDF certificates' },
  ],
  expert: [
    { icon: <Crown className="w-5 h-5" />, title: 'Expert Access', description: 'Real human expert verification' },
    { icon: <Shield className="w-5 h-5" />, title: 'Authentication Certificates', description: 'Official documentation' },
    { icon: <Zap className="w-5 h-5" />, title: 'Priority Response', description: '24-hour expert turnaround' },
  ],
  default: [
    { icon: <InfinityIcon className="w-5 h-5" />, title: 'Unlimited Everything', description: 'No limits on analyses or collection' },
    { icon: <Crown className="w-5 h-5" />, title: 'Expert Reviews', description: 'Human verification when you need it' },
    { icon: <Shield className="w-5 h-5" />, title: 'Premium Features', description: 'PDF exports, price alerts, and more' },
  ],
}

export interface PaywallProps {
  /** Display variant: soft is a gentle prompt, hard is blocking */
  variant?: 'soft' | 'hard'
  /** Whether to show as a modal overlay */
  isModal?: boolean
  /** Show/hide state for modal mode */
  isOpen?: boolean
  /** Callback when modal is closed */
  onClose?: () => void
  /** Custom title */
  title?: string
  /** Custom description */
  description?: string
  /** Feature preset to use (collection, analysis, expert, default) */
  featurePreset?: keyof typeof PRESET_FEATURES
  /** Custom features to display (overrides preset) */
  features?: PaywallFeature[]
  /** Which tier to recommend */
  recommendedTier?: 'collector' | 'professional'
  /** Custom CTA text */
  ctaText?: string
  /** Current user's tier (to show appropriate upgrade path) */
  currentTier?: SubscriptionTier
  /** Custom class name */
  className?: string
  /** Children to render behind/below the paywall (for hard variant) */
  children?: React.ReactNode
  /** Callback when upgrade is clicked */
  onUpgradeClick?: () => void
}

export default function Paywall({
  variant = 'soft',
  isModal = false,
  isOpen = true,
  onClose,
  title,
  description,
  featurePreset = 'default',
  features,
  recommendedTier = 'collector',
  ctaText,
  currentTier: _currentTier = 'free',
  className,
  children,
  onUpgradeClick,
}: PaywallProps) {
  // currentTier is available for future use (e.g., showing different upgrade paths)
  void _currentTier
  const navigate = useNavigate()
  const [isHovering, setIsHovering] = useState(false)

  const displayFeatures = features || PRESET_FEATURES[featurePreset] || PRESET_FEATURES.default
  const tierName = TIER_NAMES[recommendedTier]
  const tierPrice = TIER_PRICING[recommendedTier]

  const defaultTitle = variant === 'hard'
    ? 'Unlock This Feature'
    : 'Upgrade for More'

  const defaultDescription = variant === 'hard'
    ? `This feature is available with ${tierName} and above.`
    : `Get even more out of VintageVision with ${tierName}.`

  const handleUpgradeClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick()
    } else {
      navigate('/pricing')
    }
  }

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        'relative',
        variant === 'hard' && !isModal && 'absolute inset-0 z-50',
        className
      )}
    >
      {/* Blur overlay for hard variant */}
      {variant === 'hard' && !isModal && children && (
        <div className="absolute inset-0 backdrop-blur-md bg-white/60 rounded-2xl" />
      )}

      <GlassCard
        className={cn(
          'relative overflow-hidden',
          variant === 'soft' ? 'p-6' : 'p-8',
          variant === 'hard' && !isModal && 'absolute inset-4 m-auto max-h-fit',
        )}
        gradient={variant === 'hard' ? 'warm' : 'purple'}
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 via-orange-400/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        {/* Close button for modal */}
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}

        <div className="relative z-10">
          {/* Icon */}
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6',
            variant === 'hard'
              ? 'bg-gradient-to-br from-amber-500 to-orange-500'
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
          )}>
            {variant === 'hard' ? (
              <Lock className="w-8 h-8 text-white" />
            ) : (
              <Sparkles className="w-8 h-8 text-white" />
            )}
          </div>

          {/* Title & Description */}
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {title || defaultTitle}
          </h3>
          <p className="text-gray-600 text-center mb-6 max-w-md mx-auto">
            {description || defaultDescription}
          </p>

          {/* Features List */}
          <div className="space-y-3 mb-8 max-w-sm mx-auto">
            {displayFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className={cn(
                  'p-2 rounded-lg flex-shrink-0',
                  variant === 'hard' ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'
                )}>
                  {feature.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{feature.title}</p>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pricing Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-baseline gap-1 bg-white/50 rounded-full px-4 py-2">
              <span className="text-3xl font-bold text-gray-900">
                ${tierPrice.monthly}
              </span>
              <span className="text-gray-600">/month</span>
            </div>
            {tierPrice.annual > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                or ${tierPrice.annual}/year (save {Math.round((1 - tierPrice.annual / (tierPrice.monthly * 12)) * 100)}%)
              </p>
            )}
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={handleUpgradeClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'w-full py-4 px-6 rounded-xl font-semibold text-lg',
              'flex items-center justify-center gap-2',
              'transition-all duration-300',
              variant === 'hard'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25'
            )}
          >
            <Crown className="w-5 h-5" />
            {ctaText || `Upgrade to ${tierName}`}
            <motion.div animate={{ x: isHovering ? 4 : 0 }}>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>

          {/* Secondary action for soft variant */}
          {variant === 'soft' && onClose && (
            <button
              onClick={onClose}
              className="w-full mt-3 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Maybe later
            </button>
          )}

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-1">
              <Gift className="w-3 h-3" />
              7-day free trial
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )

  // Modal mode
  if (isModal) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Content */}
            <div className="relative w-full max-w-md">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Inline hard variant with children
  if (variant === 'hard' && children) {
    return (
      <div className="relative">
        {children}
        {content}
      </div>
    )
  }

  // Simple inline mode
  return content
}

/**
 * Inline Paywall Banner - A smaller, less intrusive version
 */
export function PaywallBanner({
  message,
  ctaText = 'Upgrade',
  onUpgradeClick,
  className,
}: {
  message: string
  ctaText?: string
  onUpgradeClick?: () => void
  className?: string
}) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick()
    } else {
      navigate('/pricing')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center justify-between gap-4 p-4 rounded-xl',
        'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-100 rounded-lg">
          <Crown className="w-5 h-5 text-amber-600" />
        </div>
        <p className="text-sm text-gray-700">{message}</p>
      </div>
      <button
        onClick={handleClick}
        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all whitespace-nowrap"
      >
        {ctaText}
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

/**
 * Collection Limit Indicator - Shows remaining collection slots
 */
export function CollectionLimitIndicator({
  currentCount,
  maxCount,
  tier,
  onUpgradeClick,
  className,
}: {
  currentCount: number
  maxCount: number
  tier?: SubscriptionTier
  onUpgradeClick?: () => void
  className?: string
}) {
  const navigate = useNavigate()
  const isUnlimited = maxCount === Infinity
  const isFull = !isUnlimited && currentCount >= maxCount
  const isNearLimit = !isUnlimited && currentCount >= maxCount - 1

  const handleClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick()
    } else {
      navigate('/pricing')
    }
  }

  if (isUnlimited) {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-gray-500', className)}>
        <InfinityIcon className="w-4 h-4" />
        <span>Unlimited collection</span>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className={cn(
          'font-medium',
          isFull ? 'text-red-600' : isNearLimit ? 'text-amber-600' : 'text-gray-700'
        )}>
          {currentCount} / {maxCount} items
        </span>
        {(tier === 'free' || !tier) && (
          <button
            onClick={handleClick}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
          >
            <Crown className="w-3 h-3" />
            Upgrade
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (currentCount / maxCount) * 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            isFull
              ? 'bg-red-500'
              : isNearLimit
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
          )}
        />
      </div>

      {isFull && (
        <p className="text-xs text-red-600">
          Collection full! Upgrade to add more items.
        </p>
      )}
      {isNearLimit && !isFull && (
        <p className="text-xs text-amber-600">
          Almost full! Consider upgrading for unlimited storage.
        </p>
      )}
    </div>
  )
}
