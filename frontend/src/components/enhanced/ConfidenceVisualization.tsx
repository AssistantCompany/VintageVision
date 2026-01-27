import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  HelpCircle,
  AlertCircle,
  ChevronDown,
  Camera,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface KnowledgeState {
  confirmed: string[]
  probable: string[]
  needsVerification: string[]
}

interface ConfidenceVisualizationProps {
  confidence: number
  knowledgeState?: KnowledgeState
  compact?: boolean
  className?: string
}

/**
 * Trust-building confidence display.
 * Shows WHAT we know, not just HOW SURE we are.
 *
 * Key insight: Users trust specifics more than percentages.
 * "We confirmed quarter-sawn oak" > "87% confident"
 */
export default function ConfidenceVisualization({
  confidence,
  knowledgeState,
  compact = false,
  className
}: ConfidenceVisualizationProps) {
  const [expanded, setExpanded] = useState(false)

  // Semantic confidence labels - more meaningful than percentages
  const getConfidenceLabel = () => {
    if (confidence >= 85) return { label: 'High Certainty', color: 'text-success', bg: 'bg-success' }
    if (confidence >= 70) return { label: 'Good Understanding', color: 'text-warning', bg: 'bg-warning' }
    if (confidence >= 50) return { label: 'Preliminary', color: 'text-info', bg: 'bg-info' }
    return { label: 'Needs More Info', color: 'text-muted-foreground', bg: 'bg-muted-foreground' }
  }

  const { label, color, bg } = getConfidenceLabel()

  const hasKnowledgeState = knowledgeState && (
    knowledgeState.confirmed.length > 0 ||
    knowledgeState.probable.length > 0 ||
    knowledgeState.needsVerification.length > 0
  )

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("w-2 h-2 rounded-full", bg)} />
        <span className={cn("text-sm font-medium", color)}>{label}</span>
        <span className="text-xs text-muted-foreground">({confidence}%)</span>
      </div>
    )
  }

  return (
    <div className={cn("rounded-xl bg-card border border-border overflow-hidden", className)}>
      {/* Header - always visible */}
      <button
        onClick={() => hasKnowledgeState && setExpanded(!expanded)}
        disabled={!hasKnowledgeState}
        className={cn(
          "w-full p-4 flex items-center justify-between transition-colors",
          hasKnowledgeState && "hover:bg-muted/30 cursor-pointer"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Confidence indicator */}
          <div className="relative">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-muted"
                strokeWidth="3"
              />
              {/* Progress arc */}
              <motion.circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className={cn("stroke-current", color)}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: `${confidence} 100` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn("text-xs font-bold", color)}>{confidence}%</span>
            </div>
          </div>

          <div className="text-left">
            <p className={cn("font-medium", color)}>{label}</p>
            {hasKnowledgeState && (
              <p className="text-xs text-muted-foreground">
                {knowledgeState!.confirmed.length} confirmed • {knowledgeState!.probable.length} probable
              </p>
            )}
          </div>
        </div>

        {hasKnowledgeState && (
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        )}
      </button>

      {/* Expandable knowledge state */}
      <AnimatePresence>
        {expanded && hasKnowledgeState && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              {/* Confirmed - High certainty */}
              {knowledgeState!.confirmed.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium text-success">Confirmed</span>
                  </div>
                  <ul className="space-y-1.5 pl-6">
                    {knowledgeState!.confirmed.map((item, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Probable - Good understanding */}
              {knowledgeState!.probable.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium text-warning">Probable</span>
                  </div>
                  <ul className="space-y-1.5 pl-6">
                    {knowledgeState!.probable.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Needs verification - Would help */}
              {knowledgeState!.needsVerification.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-info" />
                    <span className="text-sm font-medium text-info">Would help to see</span>
                  </div>
                  <ul className="space-y-1.5 pl-6">
                    {knowledgeState!.needsVerification.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-info mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Compact inline confidence badge.
 * For use in lists, cards, and headers.
 */
export function ConfidenceBadge({
  confidence,
  className
}: {
  confidence: number
  className?: string
}) {
  const getStyle = () => {
    if (confidence >= 85) return { label: 'High', color: 'text-success', bg: 'bg-success-muted', border: 'border-success/20' }
    if (confidence >= 70) return { label: 'Good', color: 'text-warning', bg: 'bg-warning-muted', border: 'border-warning/20' }
    if (confidence >= 50) return { label: 'Preliminary', color: 'text-info', bg: 'bg-info-muted', border: 'border-info/20' }
    return { label: 'Low', color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' }
  }

  const { label, color, bg, border } = getStyle()

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border",
      bg, border, className
    )}>
      <div className={cn("w-1.5 h-1.5 rounded-full", color.replace('text-', 'bg-'))} />
      <span className={cn("text-xs font-medium", color)}>{label}</span>
    </div>
  )
}

/**
 * Authentication findings display.
 * Shows pass/fail/inconclusive findings from item authentication.
 */
export function AuthenticationFindings({
  findings,
  className
}: {
  findings: Array<{
    name: string
    result: 'pass' | 'fail' | 'inconclusive'
    details?: string
  }>
  className?: string
}) {
  if (!findings || findings.length === 0) return null

  const getResultStyle = (result: string) => {
    switch (result) {
      case 'pass':
        return { icon: Check, color: 'text-success', bg: 'bg-success-muted' }
      case 'fail':
        return { icon: AlertCircle, color: 'text-danger', bg: 'bg-danger-muted' }
      default:
        return { icon: HelpCircle, color: 'text-warning', bg: 'bg-warning-muted' }
    }
  }

  const passCount = findings.filter(f => f.result === 'pass').length
  const failCount = findings.filter(f => f.result === 'fail').length

  return (
    <div className={cn("rounded-xl bg-card border border-border p-4", className)}>
      {/* Summary */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">Authentication</h4>
        <div className="flex items-center gap-2 text-xs">
          {passCount > 0 && (
            <span className="text-success">{passCount} passed</span>
          )}
          {failCount > 0 && (
            <span className="text-danger">{failCount} failed</span>
          )}
        </div>
      </div>

      {/* Individual findings */}
      <div className="space-y-2">
        {findings.map((finding, i) => {
          const { icon: Icon, color, bg } = getResultStyle(finding.result)
          return (
            <div key={i} className={cn("flex items-start gap-3 p-2 rounded-lg", bg)}>
              <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", color)} />
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium", color)}>{finding.name}</p>
                {finding.details && (
                  <p className="text-xs text-muted-foreground mt-0.5">{finding.details}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
