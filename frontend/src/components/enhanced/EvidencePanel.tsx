import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Scale,
  AlertTriangle,
  Info
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils'

interface EvidencePanelProps {
  evidenceFor: string[] | null
  evidenceAgainst: string[] | null
  redFlags: string[] | null
  identificationConfidence: number | null
  makerConfidence: number | null
  attributionNotes: string | null
}

export default function EvidencePanel({
  evidenceFor,
  evidenceAgainst,
  redFlags,
  identificationConfidence,
  makerConfidence,
  attributionNotes
}: EvidencePanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const hasEvidence = (evidenceFor && evidenceFor.length > 0) ||
                     (evidenceAgainst && evidenceAgainst.length > 0)
  const hasRedFlags = redFlags && redFlags.length > 0

  if (!hasEvidence && !hasRedFlags) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <GlassCard className="overflow-hidden" >
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 flex items-center justify-between hover:bg-white/30 transition-colors"
          aria-expanded={isExpanded}
          aria-controls="evidence-panel-content"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-foreground">Evidence Analysis</h3>
              <p className="text-sm text-muted-foreground">
                {evidenceFor?.length || 0} supporting • {evidenceAgainst?.length || 0} against
                {hasRedFlags && ` • ${redFlags?.length} warnings`}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="evidence-panel-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-5">
                {/* Confidence Meters */}
                {(identificationConfidence !== null || makerConfidence !== null) && (
                  <div className="grid grid-cols-2 gap-4">
                    {identificationConfidence !== null && (
                      <div className="bg-white/50 rounded-xl p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                          Item Confidence
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${identificationConfidence * 100}%` }}
                              transition={{ delay: 0.5, duration: 0.8 }}
                              className={cn(
                                'h-full rounded-full',
                                identificationConfidence >= 0.8 ? 'bg-green-500' :
                                identificationConfidence >= 0.6 ? 'bg-amber-500' : 'bg-red-500'
                              )}
                            />
                          </div>
                          <span className="text-sm font-bold text-muted-foreground">
                            {Math.round(identificationConfidence * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                    {makerConfidence !== null && (
                      <div className="bg-white/50 rounded-xl p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                          Maker Confidence
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${makerConfidence * 100}%` }}
                              transition={{ delay: 0.6, duration: 0.8 }}
                              className={cn(
                                'h-full rounded-full',
                                makerConfidence >= 0.8 ? 'bg-green-500' :
                                makerConfidence >= 0.6 ? 'bg-amber-500' : 'bg-red-500'
                              )}
                            />
                          </div>
                          <span className="text-sm font-bold text-muted-foreground">
                            {Math.round(makerConfidence * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Evidence For */}
                {evidenceFor && evidenceFor.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-green-700 mb-3">
                      <CheckCircle2 className="w-5 h-5" />
                      Supporting Evidence
                    </h4>
                    <ul className="space-y-2">
                      {evidenceFor.map((evidence, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start gap-3 bg-green-50 rounded-xl p-3 border border-green-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-green-800">{evidence}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Evidence Against */}
                {evidenceAgainst && evidenceAgainst.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-amber-700 mb-3">
                      <XCircle className="w-5 h-5" />
                      Conflicting Evidence
                    </h4>
                    <ul className="space-y-2">
                      {evidenceAgainst.map((evidence, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start gap-3 bg-amber-50 rounded-xl p-3 border border-amber-200"
                        >
                          <XCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-amber-800">{evidence}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Red Flags */}
                {hasRedFlags && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-red-700 mb-3">
                      <AlertTriangle className="w-5 h-5" />
                      Red Flags
                    </h4>
                    <ul className="space-y-2">
                      {redFlags!.map((flag, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start gap-3 bg-red-50 rounded-xl p-3 border border-red-200"
                        >
                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-red-800">{flag}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Attribution Notes */}
                {attributionNotes && (
                  <div className="bg-muted/50 rounded-xl p-4 border border-border">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          Attribution Notes
                        </p>
                        <p className="text-sm text-muted-foreground">{attributionNotes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  )
}
