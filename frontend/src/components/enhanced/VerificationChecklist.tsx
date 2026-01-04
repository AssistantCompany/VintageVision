import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardCheck,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Search,
  Camera,
  HelpCircle
} from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface VerificationChecklistProps {
  tips: string[] | null
  onComplete?: (completedCount: number, totalCount: number) => void
}

export default function VerificationChecklist({
  tips,
  onComplete
}: VerificationChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  if (!tips || tips.length === 0) return null

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedItems(newChecked)
    onComplete?.(newChecked.size, tips.length)
  }

  const completionPercent = (checkedItems.size / tips.length) * 100
  const allComplete = checkedItems.size === tips.length

  const getIcon = (tip: string) => {
    const lowerTip = tip.toLowerCase()
    if (lowerTip.includes('look') || lowerTip.includes('check') || lowerTip.includes('examine') || lowerTip.includes('inspect')) {
      return Search
    }
    if (lowerTip.includes('photo') || lowerTip.includes('image')) {
      return Camera
    }
    if (lowerTip.includes('ask') || lowerTip.includes('verify') || lowerTip.includes('confirm')) {
      return HelpCircle
    }
    return ClipboardCheck
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <GlassCard className="overflow-hidden" gradient="emerald">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 flex items-center justify-between hover:bg-white/30 transition-colors"
          aria-expanded={isExpanded}
          aria-controls="verification-checklist-content"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
              allComplete
                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                : 'bg-gradient-to-br from-teal-500 to-cyan-600'
            )} aria-hidden="true">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900">Verification Checklist</h3>
              <p className="text-sm text-gray-500">
                {checkedItems.size} of {tips.length} completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Progress Ring */}
            <div className="relative w-10 h-10" role="progressbar" aria-valuenow={Math.round(completionPercent)} aria-valuemin={0} aria-valuemax={100} aria-label={`${Math.round(completionPercent)}% complete`}>
              <svg className="w-10 h-10 transform -rotate-90" aria-hidden="true">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-gray-200"
                />
                <motion.circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className={allComplete ? 'text-green-500' : 'text-teal-500'}
                  initial={{ strokeDasharray: '0 100' }}
                  animate={{ strokeDasharray: `${completionPercent} ${100 - completionPercent}` }}
                  transition={{ duration: 0.5 }}
                  style={{
                    strokeDasharray: '100',
                    strokeDashoffset: 100 - completionPercent
                  }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-600">
                {Math.round(completionPercent)}%
              </span>
            </div>
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
              id="verification-checklist-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5">
                {/* All Complete Message */}
                {allComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-4 bg-green-100 rounded-xl border border-green-200 text-center"
                  >
                    <span className="text-2xl mb-2 block">🎉</span>
                    <p className="font-semibold text-green-800">All verification steps complete!</p>
                    <p className="text-sm text-green-600">You've thoroughly checked this item.</p>
                  </motion.div>
                )}

                {/* Checklist Items */}
                <ul className="space-y-2">
                  {tips.map((tip, index) => {
                    const Icon = getIcon(tip)
                    const isChecked = checkedItems.has(index)

                    return (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <button
                          onClick={() => toggleItem(index)}
                          className={cn(
                            'w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left',
                            isChecked
                              ? 'bg-green-50 border-green-300'
                              : 'bg-white/50 border-gray-200 hover:border-teal-300 hover:bg-teal-50/50'
                          )}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {isChecked ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                              >
                                <CheckSquare className="w-5 h-5 text-green-500" />
                              </motion.div>
                            ) : (
                              <Square className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={cn(
                              'text-sm leading-relaxed',
                              isChecked ? 'text-green-800 line-through' : 'text-gray-700'
                            )}>
                              {tip}
                            </p>
                          </div>
                          <Icon className={cn(
                            'w-4 h-4 flex-shrink-0',
                            isChecked ? 'text-green-400' : 'text-gray-300'
                          )} />
                        </button>
                      </motion.li>
                    )
                  })}
                </ul>

                {/* Helper Text */}
                <p className="mt-4 text-xs text-gray-500 text-center">
                  Check each item as you verify it before making a purchase decision
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  )
}
