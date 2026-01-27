import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ArrowRight
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { AlternativeCandidate } from '@/types'
import { cn } from '@/lib/utils'

interface AlternativeCandidatesProps {
  candidates: AlternativeCandidate[] | null
  primaryName: string
  primaryConfidence: number
}

export default function AlternativeCandidates({
  candidates,
  primaryName,
  primaryConfidence
}: AlternativeCandidatesProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Filter out empty or invalid candidates (no name or zero confidence)
  const validCandidates = candidates?.filter(
    c => c.name && c.name.trim() !== '' && c.confidence > 0
  ) ?? []

  if (validCandidates.length === 0) return null

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success bg-success-muted'
    if (confidence >= 0.6) return 'text-warning bg-warning-muted'
    return 'text-muted-foreground bg-muted'
  }

  const getConfidenceBarColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-success'
    if (confidence >= 0.6) return 'bg-warning'
    return 'bg-muted-foreground'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <GlassCard className="overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 flex items-center justify-between hover:bg-white/30 transition-colors"
          aria-expanded={isExpanded}
          aria-controls="alternative-candidates-content"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center" aria-hidden="true">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-foreground">Alternative Identifications</h3>
              <p className="text-sm text-muted-foreground">
                {validCandidates.length} other possible {validCandidates.length === 1 ? 'match' : 'matches'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="alternative-candidates-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4">
                {/* Primary Identification */}
                <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-xl p-4 border-2 border-success/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-success text-white text-xs font-bold rounded-full">
                      PRIMARY
                    </span>
                    <span className={cn(
                      'px-2 py-0.5 text-xs font-bold rounded-full',
                      getConfidenceColor(primaryConfidence)
                    )}>
                      {Math.round(primaryConfidence * 100)}%
                    </span>
                  </div>
                  <p className="font-bold text-foreground text-lg">{primaryName}</p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${primaryConfidence * 100}%` }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className={cn('h-full rounded-full', getConfidenceBarColor(primaryConfidence))}
                    />
                  </div>
                </div>

                {/* Alternative Candidates */}
                <div className="space-y-3">
                  {validCandidates.map((candidate, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white/60 rounded-xl p-4 border border-border"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground font-medium">
                              #{index + 2}
                            </span>
                            <span className={cn(
                              'px-2 py-0.5 text-xs font-bold rounded-full',
                              getConfidenceColor(candidate.confidence)
                            )}>
                              {Math.round(candidate.confidence * 100)}%
                            </span>
                          </div>
                          <p className="font-semibold text-foreground">{candidate.name}</p>
                          {candidate.reason && (
                            <p className="text-sm text-muted-foreground mt-1 flex items-start gap-1">
                              <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0" />
                              {candidate.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${candidate.confidence * 100}%` }}
                          transition={{ delay: 0.4 + (0.1 * index), duration: 0.6 }}
                          className={cn('h-full rounded-full', getConfidenceBarColor(candidate.confidence))}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Info Text */}
                <div className="bg-info-muted rounded-xl p-4 border border-info/30">
                  <p className="text-sm text-info">
                    <strong>Note:</strong> These are alternative identifications the AI considered.
                    The primary identification remains the most likely match based on the evidence.
                    Use the verification checklist to confirm the correct identification.
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
