/**
 * ExpertEscalationCard - Premium Feature
 * Request human expert review for high-value or uncertain items
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserCheck,
  Crown,
  Lock,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Award
} from 'lucide-react'
import { ItemAnalysis } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'

interface ExpertEscalationCardProps {
  analysis: ItemAnalysis
  isPremium?: boolean
  remainingEscalations?: number
  onUpgradeClick?: () => void
  onSubmit?: (data: EscalationRequest) => Promise<void>
}

interface EscalationRequest {
  analysisId?: string
  itemName: string
  urgency: 'standard' | 'priority' | 'urgent'
  questionType: 'authentication' | 'valuation' | 'history' | 'condition' | 'other'
  specificQuestion: string
  additionalContext?: string
}

const EXPERT_DOMAINS = {
  furniture: { name: 'Dr. James Mitchell', specialty: 'American & European Furniture', credential: 'ISA Certified' },
  ceramics: { name: 'Sarah Tanaka', specialty: 'Asian Ceramics & Porcelain', credential: 'Sotheby\'s Alum' },
  jewelry: { name: 'Elena Rodriguez', specialty: 'Fine Jewelry & Gemstones', credential: 'GIA Graduate' },
  art: { name: 'Prof. Michael Chen', specialty: 'Fine Art & Prints', credential: 'Christie\'s Expert' },
  watches: { name: 'Hans Weber', specialty: 'Horology & Timepieces', credential: 'AWCI Certified' },
  silver: { name: 'Catherine Blackwell', specialty: 'Silver & Metalwork', credential: 'V&A Consultant' },
  general: { name: 'Expert Panel', specialty: 'Multi-Domain Specialists', credential: 'Verified Experts' }
}

export default function ExpertEscalationCard({
  analysis,
  isPremium = false,
  remainingEscalations = 0,
  onUpgradeClick,
  onSubmit
}: ExpertEscalationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<Partial<EscalationRequest>>({
    urgency: 'standard',
    questionType: 'authentication',
    specificQuestion: ''
  })

  const domain = (analysis.domainExpert as keyof typeof EXPERT_DOMAINS) || 'general'
  const expert = EXPERT_DOMAINS[domain] || EXPERT_DOMAINS.general

  const handleSubmit = async () => {
    if (!isPremium || !formData.specificQuestion) return

    setIsSubmitting(true)
    try {
      await onSubmit?.({
        itemName: analysis.name || 'Unknown Item',
        urgency: formData.urgency as 'standard' | 'priority' | 'urgent',
        questionType: formData.questionType as EscalationRequest['questionType'],
        specificQuestion: formData.specificQuestion,
        additionalContext: formData.additionalContext
      })
      setIsSubmitted(true)
    } catch (error) {
      console.error('Escalation failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <GlassCard className="p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-success-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Expert Review Requested</h3>
          <p className="text-muted-foreground mb-4">
            {expert.name} will review your item within{' '}
            {formData.urgency === 'urgent' ? '4 hours' : formData.urgency === 'priority' ? '24 hours' : '48-72 hours'}.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            You'll receive an email notification when the review is complete.
          </div>
        </motion.div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="overflow-hidden" variant={isPremium ? 'brass' : 'default'}>
      {/* Header */}
      <div
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => isPremium ? setIsExpanded(!isExpanded) : onUpgradeClick?.()}
      >
        <div className="flex items-center gap-3">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${isPremium ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-muted'}
          `}>
            {isPremium ? (
              <UserCheck className="w-6 h-6 text-white" />
            ) : (
              <Lock className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground">Request Expert Review</h3>
              {!isPremium && <Crown className="w-4 h-4 text-amber-500" />}
            </div>
            <p className="text-sm text-muted-foreground">
              {isPremium
                ? `${remainingEscalations} reviews remaining this month`
                : 'Upgrade to Pro for human expert verification'
              }
            </p>
          </div>
        </div>

        {isPremium && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-muted-foreground"
          >
            <AlertCircle className="w-5 h-5" />
          </motion.div>
        )}
      </div>

      {/* Expanded Form */}
      <AnimatePresence>
        {isExpanded && isPremium && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-4">
              {/* Expert Info */}
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{expert.name}</p>
                  <p className="text-sm text-muted-foreground">{expert.specialty}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-warning bg-warning-muted px-2 py-1 rounded-full">
                  <Shield className="w-3 h-3" />
                  {expert.credential}
                </div>
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  What do you need help with?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'authentication', label: 'Authentication' },
                    { value: 'valuation', label: 'Valuation' },
                    { value: 'history', label: 'History/Provenance' },
                    { value: 'condition', label: 'Condition Report' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, questionType: option.value as any }))}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${formData.questionType === option.value
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Response time
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'standard', label: '48-72 hrs', sublabel: 'Free' },
                    { value: 'priority', label: '24 hrs', sublabel: '+$10' },
                    { value: 'urgent', label: '4 hrs', sublabel: '+$25' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, urgency: option.value as any }))}
                      className={`
                        flex-1 px-3 py-2 rounded-lg text-center transition-all
                        ${formData.urgency === option.value
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
                        }
                      `}
                    >
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="text-xs opacity-75">{option.sublabel}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Your specific question
                </label>
                <textarea
                  value={formData.specificQuestion}
                  onChange={(e) => setFormData(prev => ({ ...prev, specificQuestion: e.target.value }))}
                  placeholder="e.g., Is this an original piece or a reproduction? What specific markings should I look for to verify authenticity?"
                  className="w-full px-3 py-2 border border-border bg-card rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!formData.specificQuestion || isSubmitting}
                className={`
                  w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium
                  transition-all duration-200
                  ${formData.specificQuestion
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                    : 'bg-gray-200 text-muted-foreground cursor-not-allowed'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Clock className="w-5 h-5" />
                    </motion.div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Request Expert Review
                  </>
                )}
              </button>

              <p className="text-xs text-center text-muted-foreground">
                Expert reviews include detailed written analysis and recommendations
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
