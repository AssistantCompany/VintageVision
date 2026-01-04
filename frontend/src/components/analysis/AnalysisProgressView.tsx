/**
 * AnalysisProgressView Component
 * Award-winning loading experience with micro-interactions
 * January 2026 - Transformative UX for AI analysis
 */

import { motion, AnimatePresence } from 'framer-motion'
import { AnalysisProgress, AnalysisStage } from '@/hooks/useAnalysisStream'
import { cn } from '@/lib/utils'

interface AnalysisProgressViewProps {
  progress: AnalysisProgress
  imagePreview?: string
  onCancel?: () => void
}

// Stage configuration
const STAGES: Array<{
  id: AnalysisStage
  label: string
  icon: string
  description: string
}> = [
  { id: 'upload', label: 'Upload', icon: '📤', description: 'Preparing image' },
  { id: 'triage', label: 'Categorize', icon: '🔍', description: 'Identifying type' },
  { id: 'evidence', label: 'Examine', icon: '🔬', description: 'Finding details' },
  { id: 'candidates', label: 'Match', icon: '🎯', description: 'Expert matching' },
  { id: 'analysis', label: 'Analyze', icon: '✨', description: 'Final report' },
]

// Educational facts to show during long waits
const ANTIQUE_FACTS = [
  "Vintage Rolex watches have increased in value by 300% over the past decade.",
  "Original finish on antique furniture can add 50% or more to its value.",
  "The term 'antique' typically refers to items over 100 years old.",
  "Mid-century modern furniture is now considered vintage, not antique.",
  "Maker's marks are like fingerprints - each tells a unique story.",
  "Patina is the natural aging that collectors prize highly.",
  "Authentication experts can spot fakes by microscopic details.",
  "Provenance can double or triple an item's value.",
]

export function AnalysisProgressView({
  progress,
  imagePreview,
  onCancel,
}: AnalysisProgressViewProps) {
  const currentStageIndex = STAGES.findIndex(s => s.id === progress.stage)
  const randomFact = ANTIQUE_FACTS[Math.floor(progress.elapsedTime / 10) % ANTIQUE_FACTS.length]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-amber-50/95 via-orange-50/95 to-yellow-50/95 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg mx-4"
      >
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-amber-200/50">
          {/* Header with Image Preview */}
          <div className="relative h-32 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full bg-white"
                  initial={{ x: Math.random() * 400, y: Math.random() * 128 }}
                  animate={{
                    x: Math.random() * 400,
                    y: Math.random() * 128,
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Image preview thumbnail */}
            {imagePreview && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="absolute -bottom-8 left-6"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={imagePreview}
                    alt="Analyzing"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            )}

            {/* Title */}
            <div className="absolute bottom-4 right-6 text-right">
              <h2 className="text-white font-bold text-xl">Analyzing Your Item</h2>
              <p className="text-amber-100 text-sm">Expert AI identification in progress</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="p-6 pt-12">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-amber-900">
                  {progress.message}
                </span>
                <span className="text-sm font-bold text-amber-600">
                  {progress.progress}%
                </span>
              </div>
              <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Stage Indicators */}
            <div className="flex justify-between mb-6">
              {STAGES.map((stage, index) => {
                const isComplete = progress.completedStages.includes(stage.id)
                const isCurrent = progress.stage === stage.id
                const isPending = index > currentStageIndex

                return (
                  <motion.div
                    key={stage.id}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Icon Circle */}
                    <motion.div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300",
                        isComplete && "bg-green-500 text-white",
                        isCurrent && "bg-amber-500 text-white ring-4 ring-amber-200",
                        isPending && "bg-gray-100 text-gray-400"
                      )}
                      animate={isCurrent ? {
                        scale: [1, 1.1, 1],
                      } : {}}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {isComplete ? (
                        <motion.span
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", bounce: 0.5 }}
                        >
                          ✓
                        </motion.span>
                      ) : (
                        stage.icon
                      )}
                    </motion.div>

                    {/* Label */}
                    <span className={cn(
                      "text-xs mt-1.5 font-medium",
                      isComplete && "text-green-600",
                      isCurrent && "text-amber-600",
                      isPending && "text-gray-400"
                    )}>
                      {stage.label}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            {/* Partial Results Preview */}
            <AnimatePresence mode="wait">
              {progress.stageData.triage && (
                <motion.div
                  key="triage-preview"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🏷️</span>
                      <span className="font-semibold text-amber-900">Identified Category</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-amber-600">Type:</span>{' '}
                        <span className="font-medium">{progress.stageData.triage.itemType}</span>
                      </div>
                      <div>
                        <span className="text-amber-600">Domain:</span>{' '}
                        <span className="font-medium capitalize">{progress.stageData.triage.domain}</span>
                      </div>
                      {progress.stageData.triage.era && (
                        <div className="col-span-2">
                          <span className="text-amber-600">Era:</span>{' '}
                          <span className="font-medium">{progress.stageData.triage.era}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {progress.stageData.candidates && progress.stageData.candidates.length > 0 && (
                <motion.div
                  key="candidates-preview"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🎯</span>
                      <span className="font-semibold text-green-900">Top Match</span>
                    </div>
                    <p className="font-medium text-green-800 mb-1">
                      {progress.stageData.candidates[0].name}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600">
                        {Math.round(progress.stageData.candidates[0].confidence * 100)}% confidence
                      </span>
                      {progress.stageData.candidates[0].value &&
                        (progress.stageData.candidates[0].value.low != null || progress.stageData.candidates[0].value.high != null) && (
                        <span className="text-green-700 font-medium">
                          ${progress.stageData.candidates[0].value.low?.toLocaleString() ?? 'N/A'} - ${progress.stageData.candidates[0].value.high?.toLocaleString() ?? 'N/A'}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Educational Content (for longer waits) */}
            {progress.elapsedTime > 10 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-4"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div>
                    <span className="font-semibold text-blue-900 text-sm">Did you know?</span>
                    <p className="text-blue-800 text-sm mt-1">{randomFact}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Timer and Cancel */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span className="font-mono">{formatTime(progress.elapsedTime)}</span> elapsed
              </div>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -z-10 inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 -left-20 w-40 h-40 bg-amber-300/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-20 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default AnalysisProgressView
