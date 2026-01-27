// EvidenceTab - Comprehensive Evidence & Authentication Display
// VintageVision Analysis Results v2.0

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Camera,
  ClipboardCheck,
  CheckSquare,
  Square,
  Search,
  HelpCircle,
  Layers,
  ArrowRight,
  UserCheck,
  Sparkles,
  Target,
  Lightbulb,
  Check,
  X,
  User
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import {
  ItemAnalysis,
  KnowledgeState,
  ItemAuthentication,
  AuthenticityRisk,
  AlternativeCandidate,
  AuthenticationFinding,
  ConfirmedFact,
  ProbableFact,
  VerificationNeed,
  getAuthenticityRiskColor,
  getAuthenticityRiskLabel,
  getKnowledgeLabel,
  getAuthVerdictStyle,
  getFindingStatusColor,
  formatConfidence
} from '@/types'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

interface EvidenceTabProps {
  analysis: ItemAnalysis
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

// Evidence Card for individual evidence items
interface EvidenceCardProps {
  type: 'for' | 'against' | 'warning'
  text: string
  index: number
}

function EvidenceCard({ type, text, index }: EvidenceCardProps) {
  const config = {
    for: {
      icon: CheckCircle2,
      bgColor: 'bg-success-muted',
      borderColor: 'border-success/30',
      iconColor: 'text-success',
      textColor: 'text-foreground'
    },
    against: {
      icon: XCircle,
      bgColor: 'bg-warning-muted',
      borderColor: 'border-warning/30',
      iconColor: 'text-warning',
      textColor: 'text-foreground'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-danger-muted',
      borderColor: 'border-danger/30',
      iconColor: 'text-danger',
      textColor: 'text-foreground'
    }
  }[type]

  const Icon = config.icon

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index }}
      className={cn(
        'flex items-start gap-3 rounded-xl p-3 border',
        config.bgColor,
        config.borderColor
      )}
    >
      <Icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', config.iconColor)} />
      <span className={cn('text-sm', config.textColor)}>{text}</span>
    </motion.li>
  )
}

// Confidence Meter component
interface ConfidenceMeterProps {
  label: string
  value: number | null
  delay?: number
}

function ConfidenceMeter({ label, value, delay = 0.5 }: ConfidenceMeterProps) {
  if (value === null) return null

  const percentage = value * 100
  const barColor = value >= 0.8 ? 'bg-success' : value >= 0.6 ? 'bg-warning' : 'bg-danger'

  return (
    <div className="bg-card/50 rounded-xl p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay, duration: 0.8 }}
            className={cn('h-full rounded-full', barColor)}
          />
        </div>
        <span className="text-sm font-bold text-foreground">{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}

// Risk Badge component
interface RiskBadgeProps {
  risk: AuthenticityRisk | null
}

function RiskBadge({ risk }: RiskBadgeProps) {
  const getShieldIcon = () => {
    switch (risk) {
      case 'low':
        return <ShieldCheck className="w-6 h-6 text-green-500" />
      case 'medium':
        return <Shield className="w-6 h-6 text-yellow-500" />
      case 'high':
      case 'very_high':
        return <ShieldAlert className="w-6 h-6 text-red-500" />
      default:
        return <Shield className="w-6 h-6 text-muted-foreground" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold text-sm',
        getAuthenticityRiskColor(risk)
      )}
    >
      {getShieldIcon()}
      <span>{getAuthenticityRiskLabel(risk)}</span>
    </motion.div>
  )
}

// Verification Checklist Item
interface ChecklistItemProps {
  tip: string
  index: number
  checked: boolean
  onToggle: () => void
}

function ChecklistItem({ tip, index, checked, onToggle }: ChecklistItemProps) {
  const getIcon = () => {
    const lowerTip = tip.toLowerCase()
    if (lowerTip.includes('look') || lowerTip.includes('check') || lowerTip.includes('examine')) {
      return Search
    }
    if (lowerTip.includes('photo') || lowerTip.includes('image')) {
      return Camera
    }
    if (lowerTip.includes('ask') || lowerTip.includes('verify')) {
      return HelpCircle
    }
    return ClipboardCheck
  }

  const Icon = getIcon()

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index }}
    >
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left',
          checked
            ? 'bg-success-muted border-success/50'
            : 'bg-card/50 border-border hover:border-primary/50 hover:bg-card'
        )}
      >
        <div className="flex-shrink-0 mt-0.5">
          {checked ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <CheckSquare className="w-5 h-5 text-success" />
            </motion.div>
          ) : (
            <Square className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <p className={cn(
          'text-sm leading-relaxed flex-1',
          checked ? 'text-success line-through' : 'text-foreground'
        )}>
          {tip}
        </p>
        <Icon className={cn(
          'w-4 h-4 flex-shrink-0',
          checked ? 'text-success/60' : 'text-muted-foreground/50'
        )} />
      </button>
    </motion.li>
  )
}

// Alternative Candidate Card
interface CandidateCardProps {
  candidate: AlternativeCandidate
  rank: number
}

function CandidateCard({ candidate, rank }: CandidateCardProps) {
  const barColor = candidate.confidence >= 0.8 ? 'bg-success' :
    candidate.confidence >= 0.6 ? 'bg-warning' : 'bg-muted-foreground'

  const badgeColor = candidate.confidence >= 0.8 ? 'text-success bg-success-muted' :
    candidate.confidence >= 0.6 ? 'text-warning bg-warning-muted' : 'text-muted-foreground bg-muted'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * rank }}
      className="bg-card/60 rounded-xl p-4 border border-border"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground font-medium">#{rank + 2}</span>
            <span className={cn('px-2 py-0.5 text-xs font-bold rounded-full', badgeColor)}>
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
          transition={{ delay: 0.4 + (0.1 * rank), duration: 0.6 }}
          className={cn('h-full rounded-full', barColor)}
        />
      </div>
    </motion.div>
  )
}

// Knowledge State - Confirmed Fact Card
function ConfirmedFactCard({ fact, index }: { fact: ConfirmedFact; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-3 p-3 bg-success-muted border border-success/30 rounded-lg"
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success flex items-center justify-center">
        <Check className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{fact.statement}</p>
        <p className="text-sm text-success mt-1">{fact.evidence}</p>
      </div>
    </motion.div>
  )
}

// Knowledge State - Probable Fact Card
function ProbableFactCard({ fact, index }: { fact: ProbableFact; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-3 bg-warning-muted border border-warning/30 rounded-lg"
    >
      <div
        className="flex gap-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-warning flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground">{fact.statement}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-warning bg-warning/20 px-2 py-0.5 rounded-full">
                {Math.round(fact.confidence * 100)}% likely
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-warning" />
              ) : (
                <ChevronDown className="w-4 h-4 text-warning" />
              )}
            </div>
          </div>
          <p className="text-sm text-warning mt-1">{fact.evidence}</p>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-warning/30"
          >
            <div className="flex items-start gap-2 text-sm">
              <Target className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-foreground">To confirm:</span>
                <p className="text-warning">{fact.howToConfirm}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Knowledge State - Verification Need Card
function VerificationNeedCard({ need, index }: { need: VerificationNeed; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-3 bg-info-muted border border-info/30 rounded-lg"
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-info flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground">{need.question}</p>
          <p className="text-sm text-info mt-1">{need.photoNeeded}</p>
          <div className="flex items-center justify-between mt-3">
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              need.importance === 'critical' ? 'bg-danger-muted text-danger' :
                need.importance === 'important' ? 'bg-warning-muted text-warning' :
                  'bg-info/20 text-info'
            )}>
              {need.importance}
            </span>
          </div>
          {need.impactOnValue && (
            <p className="text-xs text-info mt-2 italic">{need.impactOnValue}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Authentication Finding Card
function AuthFindingCard({ finding, index }: { finding: AuthenticationFinding; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const statusColor = getFindingStatusColor(finding.status)

  const StatusIcon = {
    pass: Check,
    fail: X,
    inconclusive: HelpCircle,
    needs_verification: AlertTriangle
  }[finding.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn('border rounded-lg overflow-hidden', statusColor)}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-start gap-3 text-left"
      >
        <div className={cn(
          'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
          finding.status === 'pass' ? 'bg-green-500' :
            finding.status === 'fail' ? 'bg-red-500' :
              finding.status === 'inconclusive' ? 'bg-yellow-500' : 'bg-blue-500'
        )}>
          <StatusIcon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-stone-900">{finding.area}</span>
            <span className="text-xs text-stone-500">
              {Math.round(finding.confidence * 100)}%
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-0.5">{finding.observation}</p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-stone-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-stone-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-current/10 overflow-hidden"
          >
            <div className="p-3 bg-white/50">
              <div className="text-sm space-y-2">
                <div>
                  <span className="font-medium text-stone-700">Expected for:</span>
                  <p className="text-stone-600">{finding.expectedFor}</p>
                </div>
                <div>
                  <span className="font-medium text-stone-700">Assessment:</span>
                  <p className="text-stone-600">{finding.explanation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

// Evidence Panel Section
interface EvidencePanelSectionProps {
  evidenceFor: string[] | null
  evidenceAgainst: string[] | null
  redFlags: string[] | null
  identificationConfidence: number | null
  makerConfidence: number | null
  attributionNotes: string | null
}

function EvidencePanelSection({
  evidenceFor,
  evidenceAgainst,
  redFlags,
  identificationConfidence,
  makerConfidence,
  attributionNotes
}: EvidencePanelSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const hasEvidence = (evidenceFor && evidenceFor.length > 0) ||
    (evidenceAgainst && evidenceAgainst.length > 0)
  const hasRedFlags = redFlags && redFlags.length > 0

  if (!hasEvidence && !hasRedFlags) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <GlassCard className="overflow-hidden" >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 flex items-center justify-between hover:bg-white/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-foreground">Evidence Analysis</h3>
              <p className="text-sm text-muted-foreground">
                {evidenceFor?.length || 0} supporting, {evidenceAgainst?.length || 0} against
                {hasRedFlags && `, ${redFlags?.length} warnings`}
              </p>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
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
                    <ConfidenceMeter label="Item Confidence" value={identificationConfidence} delay={0.5} />
                    <ConfidenceMeter label="Maker Confidence" value={makerConfidence} delay={0.6} />
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
                        <EvidenceCard key={index} type="for" text={evidence} index={index} />
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
                        <EvidenceCard key={index} type="against" text={evidence} index={index} />
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
                        <EvidenceCard key={index} type="warning" text={flag} index={index} />
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
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Attribution Notes</p>
                        <p className="text-sm text-foreground">{attributionNotes}</p>
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

// Verification Checklist Section
interface VerificationChecklistSectionProps {
  tips: string[] | null
}

function VerificationChecklistSection({ tips }: VerificationChecklistSectionProps) {
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
  }

  const completionPercent = (checkedItems.size / tips.length) * 100
  const allComplete = checkedItems.size === tips.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <GlassCard className="overflow-hidden" >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 flex items-center justify-between hover:bg-white/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
              allComplete
                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                : 'bg-gradient-to-br from-teal-500 to-cyan-600'
            )}>
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-foreground">Verification Checklist</h3>
              <p className="text-sm text-muted-foreground">{checkedItems.size} of {tips.length} completed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Progress Ring */}
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-muted" />
                <motion.circle
                  cx="20" cy="20" r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className={allComplete ? 'text-green-500' : 'text-teal-500'}
                  initial={{ strokeDasharray: '0 100' }}
                  animate={{ strokeDasharray: `${completionPercent} ${100 - completionPercent}` }}
                  transition={{ duration: 0.5 }}
                  style={{ strokeDasharray: '100', strokeDashoffset: 100 - completionPercent }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-muted-foreground">
                {Math.round(completionPercent)}%
              </span>
            </div>
            {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5">
                {allComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-4 bg-green-100 rounded-xl border border-green-200 text-center"
                  >
                    <span className="text-2xl mb-2 block">All verification steps complete!</span>
                    <p className="text-sm text-green-600">You've thoroughly checked this item.</p>
                  </motion.div>
                )}
                <ul className="space-y-2">
                  {tips.map((tip, index) => (
                    <ChecklistItem
                      key={index}
                      tip={tip}
                      index={index}
                      checked={checkedItems.has(index)}
                      onToggle={() => toggleItem(index)}
                    />
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground text-center">
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

// Alternative Candidates Section
interface AlternativeCandidatesSectionProps {
  candidates: AlternativeCandidate[] | null
  primaryName: string
  primaryConfidence: number
}

function AlternativeCandidatesSection({ candidates, primaryName, primaryConfidence }: AlternativeCandidatesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const validCandidates = candidates?.filter(c => c.name && c.name.trim() !== '' && c.confidence > 0) ?? []

  if (validCandidates.length === 0) return null

  const primaryBarColor = primaryConfidence >= 0.8 ? 'bg-success' :
    primaryConfidence >= 0.6 ? 'bg-warning' : 'bg-muted-foreground'

  const primaryBadgeColor = primaryConfidence >= 0.8 ? 'text-success bg-success-muted' :
    primaryConfidence >= 0.6 ? 'text-warning bg-warning-muted' : 'text-muted-foreground bg-muted'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <GlassCard className="overflow-hidden" >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 flex items-center justify-between hover:bg-white/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
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
            {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4">
                {/* Primary Identification */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">PRIMARY</span>
                    <span className={cn('px-2 py-0.5 text-xs font-bold rounded-full', primaryBadgeColor)}>
                      {Math.round(primaryConfidence * 100)}%
                    </span>
                  </div>
                  <p className="font-bold text-foreground text-lg">{primaryName}</p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${primaryConfidence * 100}%` }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className={cn('h-full rounded-full', primaryBarColor)}
                    />
                  </div>
                </div>

                {/* Alternative Candidates */}
                <div className="space-y-3">
                  {validCandidates.map((candidate, index) => (
                    <CandidateCard key={index} candidate={candidate} rank={index} />
                  ))}
                </div>

                <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
                  <p className="text-sm text-rose-800">
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

// Authenticity Risk Assessment Section
interface AuthenticityRiskSectionProps {
  analysis: ItemAnalysis
}

function AuthenticityRiskSection({ analysis }: AuthenticityRiskSectionProps) {
  const {
    authenticationConfidence,
    authenticityRisk,
    authenticationChecklist,
    knownFakeIndicators,
    additionalPhotosRequested,
    expertReferralRecommended,
    expertReferralReason,
    authenticationAssessment
  } = analysis

  if (!authenticityRisk) return null

  const criticalChecks = authenticationChecklist?.filter(c => c.priority === 'critical').length || 0
  const totalChecks = authenticationChecklist?.length || 0
  const requiredPhotos = additionalPhotosRequested?.filter(p => p.priority === 'required').length || 0

  const getConfidenceColor = (confidence: number | null) => {
    if (confidence === null) return 'text-muted-foreground'
    if (confidence >= 0.8) return 'text-success'
    if (confidence >= 0.6) return 'text-warning'
    if (confidence >= 0.4) return 'text-warning'
    return 'text-danger'
  }

  const isHighRisk = authenticityRisk === 'high' || authenticityRisk === 'very_high'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isHighRisk ? 0 : 0.4 }}
    >
      <GlassCard className="overflow-hidden" >
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="p-3 bg-white/80 rounded-2xl shadow-sm"
              >
                {authenticityRisk === 'low' && <ShieldCheck className="w-8 h-8 text-green-500" />}
                {authenticityRisk === 'medium' && <Shield className="w-8 h-8 text-yellow-500" />}
                {(authenticityRisk === 'high' || authenticityRisk === 'very_high') && <ShieldAlert className="w-8 h-8 text-red-500" />}
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Authenticity Assessment</h3>
                <p className="text-sm text-muted-foreground mt-1">Counterfeit risk and verification guidance</p>
              </div>
            </div>
            <RiskBadge risk={authenticityRisk} />
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="p-6 grid md:grid-cols-2 gap-6 border-b border-gray-200/50">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Authentication Confidence</span>
              <span className={cn('text-lg font-bold', getConfidenceColor(authenticationConfidence))}>
                {formatConfidence(authenticationConfidence)}
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(authenticationConfidence || 0) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={cn(
                  'h-full rounded-full',
                  (authenticationConfidence || 0) >= 0.8 ? 'bg-green-500' :
                    (authenticationConfidence || 0) >= 0.6 ? 'bg-yellow-500' :
                      (authenticationConfidence || 0) >= 0.4 ? 'bg-orange-500' : 'bg-red-500'
                )}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{criticalChecks}</div>
              <div className="text-xs text-muted-foreground">Critical Checks</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{totalChecks}</div>
              <div className="text-xs text-muted-foreground">Total Checks</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{requiredPhotos}</div>
              <div className="text-xs text-muted-foreground">Photos Needed</div>
            </div>
          </div>
        </div>

        {/* Assessment Summary */}
        {authenticationAssessment && (
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed">{authenticationAssessment}</p>
            </div>
          </div>
        )}

        {/* Expert Referral Warning */}
        {expertReferralRecommended && (
          <div className="p-4 mx-6 my-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800">Expert Authentication Recommended</h4>
                <p className="text-sm text-amber-700 mt-1">
                  {expertReferralReason || 'Due to the value and complexity of this item, professional authentication is recommended.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Known Fake Indicators */}
        {knownFakeIndicators && knownFakeIndicators.length > 0 && (
          <div className="p-6 border-b border-gray-200/50">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-danger" />
              Known Fake Indicators
            </h4>
            <div className="space-y-2">
              {knownFakeIndicators.map((indicator, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="w-1.5 h-1.5 bg-danger rounded-full mt-2 flex-shrink-0" />
                  <span className="text-foreground">{indicator}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Authentication Checklist Preview */}
        {authenticationChecklist && authenticationChecklist.length > 0 && (
          <div className="p-6">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Authentication Checklist
            </h4>
            <div className="space-y-2">
              {authenticationChecklist.slice(0, 5).map((check, index) => (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                >
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    check.priority === 'critical' ? 'bg-danger' :
                      check.priority === 'important' ? 'bg-warning' : 'bg-info'
                  )} />
                  <span className="text-sm text-foreground flex-1">{check.check}</span>
                  {check.photoHelpful && <Camera className="w-4 h-4 text-muted-foreground" />}
                </motion.div>
              ))}
              {authenticationChecklist.length > 5 && (
                <p className="text-sm text-muted-foreground pl-5">
                  +{authenticationChecklist.length - 5} more checks available
                </p>
              )}
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  )
}

// Knowledge State Section (World-Class View)
interface KnowledgeStateSectionProps {
  knowledgeState: KnowledgeState
}

function KnowledgeStateSection({ knowledgeState }: KnowledgeStateSectionProps) {
  const [activeTab, setActiveTab] = useState<'confirmed' | 'probable' | 'needed'>('confirmed')

  const { label, color } = getKnowledgeLabel(knowledgeState.completeness)

  const tabs = [
    { id: 'confirmed' as const, label: 'Confirmed', count: knowledgeState.confirmed.length, icon: Check, color: 'text-green-600' },
    { id: 'probable' as const, label: 'Probable', count: knowledgeState.probable.length, icon: Lightbulb, color: 'text-amber-600' },
    { id: 'needed' as const, label: 'Needs Info', count: knowledgeState.needsVerification.length, icon: HelpCircle, color: 'text-blue-600' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-lg text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            What We Know
          </h3>
          <div className={cn('px-3 py-1 rounded-full text-sm font-medium', color)}>{label}</div>
        </div>

        {/* Completeness Bar */}
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${knowledgeState.completeness * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-stone-500 mt-1">
          {Math.round(knowledgeState.completeness * 100)}% knowledge completeness
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative',
              activeTab === tab.id ? tab.color : 'text-stone-400 hover:text-stone-600'
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={cn(
                'px-1.5 py-0.5 text-xs rounded-full',
                activeTab === tab.id ? 'bg-current/10' : 'bg-stone-100 text-stone-500'
              )}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <motion.div layoutId="knowledgeActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-current" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'confirmed' && (
            <motion.div key="confirmed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              {knowledgeState.confirmed.length > 0 ? (
                knowledgeState.confirmed.map((fact, idx) => <ConfirmedFactCard key={idx} fact={fact} index={idx} />)
              ) : (
                <div className="text-center py-8 text-stone-400">
                  <Check className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No facts confirmed yet</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'probable' && (
            <motion.div key="probable" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              {knowledgeState.probable.length > 0 ? (
                knowledgeState.probable.map((fact, idx) => <ProbableFactCard key={idx} fact={fact} index={idx} />)
              ) : (
                <div className="text-center py-8 text-stone-400">
                  <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>All findings are confirmed</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'needed' && (
            <motion.div key="needed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              {knowledgeState.needsVerification.length > 0 ? (
                knowledgeState.needsVerification.map((need, idx) => <VerificationNeedCard key={idx} need={need} index={idx} />)
              ) : (
                <div className="text-center py-8 text-stone-400">
                  <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No additional information needed</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Item Authentication Display Section (World-Class View)
interface ItemAuthenticationSectionProps {
  authentication: ItemAuthentication
  itemName: string
}

function ItemAuthenticationSection({ authentication, itemName }: ItemAuthenticationSectionProps) {
  const [showAllFindings, setShowAllFindings] = useState(false)

  const style = getAuthVerdictStyle(authentication.overallVerdict)
  const displayedFindings = showAllFindings ? authentication.findings : authentication.findings.slice(0, 5)

  const VerdictIcon = {
    likely_authentic: ShieldCheck,
    likely_fake: ShieldAlert,
    inconclusive: ShieldQuestion,
    needs_expert: Shield
  }[authentication.overallVerdict]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-stone-100">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-amber-600" />
          <h3 className="font-serif text-lg text-stone-900">Authentication Analysis</h3>
        </div>

        {/* Verdict Badge */}
        <div className={cn('flex items-center gap-3 px-4 py-3 rounded-xl border-2', style.color)}>
          <VerdictIcon className="w-8 h-8" />
          <div>
            <div className="font-semibold text-lg">{style.label}</div>
            <div className="text-sm opacity-80">{Math.round(authentication.confidenceScore * 100)}% confidence</div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-stone-600">{authentication.passedChecks} passed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-stone-600">{authentication.failedChecks} failed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-stone-600">{authentication.inconclusiveChecks} uncertain</span>
          </div>
        </div>
      </div>

      {/* Critical Issues Alert */}
      {authentication.criticalIssues.length > 0 && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">Critical Concerns</h4>
              <ul className="mt-2 space-y-1">
                {authentication.criticalIssues.map((issue, idx) => (
                  <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                    <span className="text-red-400">-</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Findings */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-stone-700 mb-3">Specific Findings for This {itemName}</h4>
        <div className="space-y-2">
          {displayedFindings.map((finding, idx) => (
            <AuthFindingCard key={finding.id} finding={finding} index={idx} />
          ))}
        </div>
        {authentication.findings.length > 5 && (
          <button
            onClick={() => setShowAllFindings(!showAllFindings)}
            className="w-full mt-3 py-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            {showAllFindings ? 'Show fewer' : `Show ${authentication.findings.length - 5} more findings`}
          </button>
        )}
      </div>

      {/* Recommendation */}
      <div className="p-4 bg-stone-50 border-t border-stone-100">
        <h4 className="text-sm font-medium text-stone-700 mb-2">Recommendation</h4>
        <p className="text-stone-600">{authentication.recommendation}</p>

        {authentication.expertNeeded && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="font-medium text-purple-900">Expert Review Recommended</h5>
                {authentication.expertType && (
                  <p className="text-sm text-purple-700 mt-1">Suggested: {authentication.expertType}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EvidenceTab({ analysis }: EvidenceTabProps) {
  // Extract data from analysis
  const knowledgeState: KnowledgeState | null = analysis.knowledgeState || null
  const itemAuthentication: ItemAuthentication | null = analysis.itemAuthentication || null
  const hasWorldClassData = knowledgeState !== null || itemAuthentication !== null

  const isHighRisk = analysis.authenticityRisk === 'high' || analysis.authenticityRisk === 'very_high'

  return (
    <div className="space-y-6">
      {/* World-Class View - Knowledge State & Item Authentication */}
      {hasWorldClassData && (
        <div className="grid lg:grid-cols-2 gap-6">
          {knowledgeState && <KnowledgeStateSection knowledgeState={knowledgeState} />}
          {itemAuthentication && (
            <ItemAuthenticationSection
              authentication={itemAuthentication}
              itemName={analysis.name}
            />
          )}
        </div>
      )}

      {/* Authenticity Risk Assessment - Prominent for High Risk Items */}
      {isHighRisk && <AuthenticityRiskSection analysis={analysis} />}

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Authentication Section - For Medium/Low Risk */}
          {!isHighRisk && analysis.authenticityRisk && (
            <AuthenticityRiskSection analysis={analysis} />
          )}

          {/* Evidence Panel */}
          <EvidencePanelSection
            evidenceFor={analysis.evidenceFor}
            evidenceAgainst={analysis.evidenceAgainst}
            redFlags={analysis.redFlags}
            identificationConfidence={analysis.identificationConfidence}
            makerConfidence={analysis.makerConfidence}
            attributionNotes={analysis.attributionNotes}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Verification Checklist */}
          <VerificationChecklistSection tips={analysis.verificationTips} />

          {/* Alternative Candidates */}
          <AlternativeCandidatesSection
            candidates={analysis.alternativeCandidates}
            primaryName={analysis.name}
            primaryConfidence={analysis.confidence}
          />
        </div>
      </div>
    </div>
  )
}
