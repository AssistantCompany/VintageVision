import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Repeat,
  Clock,
  TrendingUp,
  Store,
  Globe,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  AlertCircle
} from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { FlipDifficulty, getFlipDifficultyColor } from '@/types'
import { cn } from '@/lib/utils'

interface FlipAssessmentProps {
  difficulty: FlipDifficulty | null
  timeEstimate: string | null
  resaleChannels: string[] | null
  profitPotentialMin: number | null
  profitPotentialMax: number | null
}

const difficultyConfig: Record<FlipDifficulty, {
  label: string
  description: string
  icon: typeof Zap
  gradient: string
  bgColor: string
  borderColor: string
}> = {
  easy: {
    label: 'Easy Flip',
    description: 'High demand, quick sale expected',
    icon: Zap,
    gradient: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  moderate: {
    label: 'Moderate',
    description: 'Decent demand, may take some time',
    icon: Target,
    gradient: 'from-amber-500 to-yellow-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  },
  hard: {
    label: 'Challenging',
    description: 'Niche market, patience required',
    icon: TrendingUp,
    gradient: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  very_hard: {
    label: 'Very Difficult',
    description: 'Limited market, specialist buyers only',
    icon: AlertCircle,
    gradient: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
}

const channelIcons: Record<string, typeof Store> = {
  'ebay': Globe,
  'etsy': Store,
  'auction': TrendingUp,
  'consignment': Store,
  'dealer': Store,
  'default': Store
}

export default function FlipAssessment({
  difficulty,
  timeEstimate,
  resaleChannels,
  profitPotentialMin,
  profitPotentialMax
}: FlipAssessmentProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  if (!difficulty && !timeEstimate && (!resaleChannels || resaleChannels.length === 0)) {
    return null
  }

  const config = difficulty ? difficultyConfig[difficulty] : null
  const DifficultyIcon = config?.icon || Target

  const getChannelIcon = (channel: string) => {
    const lowerChannel = channel.toLowerCase()
    for (const [key, icon] of Object.entries(channelIcons)) {
      if (lowerChannel.includes(key)) {
        return icon
      }
    }
    return channelIcons.default
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <GlassCard className="overflow-hidden" gradient="purple">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 flex items-center justify-between hover:bg-white/30 transition-colors"
          aria-expanded={isExpanded}
          aria-controls="flip-assessment-content"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              config ? `bg-gradient-to-br ${config.gradient}` : 'bg-gradient-to-br from-purple-500 to-violet-600'
            )} aria-hidden="true">
              <Repeat className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900">Flip Assessment</h3>
              <p className="text-sm text-gray-500">
                {config?.label || 'Resale potential analysis'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {difficulty && (
              <span className={cn(
                'px-3 py-1 rounded-full text-xs font-bold',
                config?.bgColor,
                config?.borderColor,
                'border',
                getFlipDifficultyColor(difficulty)
              )}>
                {config?.label}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="flip-assessment-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4">
                {/* Difficulty & Time Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Difficulty */}
                  {difficulty && config && (
                    <div className={cn(
                      'p-4 rounded-xl border',
                      config.bgColor,
                      config.borderColor
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                        <DifficultyIcon className={cn('w-5 h-5', getFlipDifficultyColor(difficulty))} />
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Difficulty</span>
                      </div>
                      <p className={cn('font-bold text-lg', getFlipDifficultyColor(difficulty))}>
                        {config.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{config.description}</p>
                    </div>
                  )}

                  {/* Time Estimate */}
                  {timeEstimate && (
                    <div className="p-4 rounded-xl border bg-blue-50 border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Time to Sell</span>
                      </div>
                      <p className="font-bold text-lg text-blue-700">{timeEstimate}</p>
                      <p className="text-xs text-gray-500 mt-1">Estimated selling timeline</p>
                    </div>
                  )}
                </div>

                {/* Profit Potential */}
                {(profitPotentialMin !== null || profitPotentialMax !== null) && (
                  <div className="p-4 rounded-xl border bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-gray-700">Potential Profit</span>
                      </div>
                      <p className="font-bold text-xl text-green-600">
                        {profitPotentialMin != null && profitPotentialMax != null
                          ? `$${profitPotentialMin.toLocaleString()} - $${profitPotentialMax.toLocaleString()}`
                          : profitPotentialMin != null
                            ? `$${profitPotentialMin.toLocaleString()}+`
                            : profitPotentialMax != null
                              ? `Up to $${profitPotentialMax.toLocaleString()}`
                              : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Resale Channels */}
                {resaleChannels && resaleChannels.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
                      <Store className="w-4 h-4" />
                      Recommended Selling Channels
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resaleChannels.map((channel, index) => {
                        const ChannelIcon = getChannelIcon(channel)
                        return (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-purple-200 text-sm text-gray-700 shadow-sm"
                          >
                            <ChannelIcon className="w-4 h-4 text-purple-500" />
                            {channel}
                          </motion.span>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <p className="text-sm text-purple-800">
                    <strong>Pro Tip:</strong> {
                      difficulty === 'easy'
                        ? 'List quickly! High-demand items move fast. Consider multiple platforms for best results.'
                        : difficulty === 'moderate'
                          ? 'Take quality photos and write detailed descriptions. Patience pays off with the right buyer.'
                          : difficulty === 'hard'
                            ? 'Target specialist collectors and niche communities. Auction houses may yield better prices.'
                            : 'Consider consignment with a specialized dealer who has access to the right buyers.'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  )
}
