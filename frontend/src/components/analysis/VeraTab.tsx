/**
 * VeraTab Component
 * VintageVision - World-Leading Antique AI as of January 2026
 *
 * The Vera Tab provides:
 * - Vera AI assistant interface for interactive authentication guidance
 * - Additional photo requests section with prioritized guidance
 * - Expert escalation option for high-value or uncertain items
 * - Interactive Q&A capability through the VeraAssistant component
 * - Help/guidance section with tips for improving analysis
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  Camera,
  Award,
  Clock,
  Shield,
  CheckCircle,
  X,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Image,
  Target,
  Sparkles,
  BookOpen,
  AlertCircle
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { VeraAssistant } from '@/components/enhanced/VeraAssistant'
import { ItemAnalysis, getDomainExpertName } from '@/types'
import { cn } from '@/lib/utils'
import type { InteractiveSession } from '@/hooks/useInteractiveSession'

interface VeraTabProps {
  analysis: ItemAnalysis
  displayAnalysis: ItemAnalysis
  shouldOfferVera: boolean
  showVeraAssistant: boolean
  veraSession: InteractiveSession | null
  veraLoading: boolean
  onStartVera: () => void
  onShowVeraAssistant: (show: boolean) => void
  onVeraSendMessage: (needId: string, type: 'photo' | 'text', content: string) => void
  onVeraReanalysis: () => void
  onClearVeraSession: () => void
  onShowExpertEscalation: () => void
  // Optional simplified callback for photo requests
  onRequestPhotos?: (photos: string[]) => void
}

// Common photography tips for improving analysis
const PHOTO_TIPS = [
  {
    icon: Image,
    title: 'Good Lighting',
    description: 'Natural daylight works best. Avoid harsh shadows or flash glare.'
  },
  {
    icon: Target,
    title: 'Focus on Details',
    description: 'Get close-up shots of maker marks, signatures, labels, and unique features.'
  },
  {
    icon: Camera,
    title: 'Multiple Angles',
    description: 'Include top, bottom, sides, and any hidden areas like drawer interiors.'
  },
  {
    icon: Sparkles,
    title: 'Show Condition',
    description: 'Capture any wear, damage, repairs, or patina that indicates age.'
  }
]

// FAQ items for the help section
const FAQ_ITEMS = [
  {
    question: 'How does Vera improve my analysis?',
    answer: 'Vera asks targeted questions and guides you to capture specific photos that can fill gaps in our knowledge. By providing this additional information, we can often significantly improve our confidence in the identification, authentication, and valuation.'
  },
  {
    question: 'What if Vera asks for photos I cannot take?',
    answer: 'No problem! Simply skip any photo requests that are not possible. Vera will work with whatever information you can provide. Even partial additional information can help improve the analysis.'
  },
  {
    question: 'When should I consult a human expert?',
    answer: 'Consider expert verification for high-value items (typically over $5,000), when authenticity is critical for insurance or sale, when our AI confidence is below 70%, or when you need a formal written appraisal.'
  },
  {
    question: 'How accurate is the AI analysis?',
    answer: 'Our AI achieves high accuracy on common items with clear identifying features. Accuracy varies based on image quality, item rarity, and available reference data. The confidence score reflects our certainty level.'
  }
]

export default function VeraTab({
  analysis,
  displayAnalysis,
  shouldOfferVera,
  showVeraAssistant,
  veraSession,
  veraLoading,
  onStartVera,
  onShowVeraAssistant,
  onVeraSendMessage,
  onVeraReanalysis,
  onClearVeraSession,
  onShowExpertEscalation,
  onRequestPhotos
}: VeraTabProps) {
  const [showPhotoTips, setShowPhotoTips] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showAllPhotoRequests, setShowAllPhotoRequests] = useState(false)

  // Check if expert referral should be shown
  const showExpertSection =
    analysis.expertReferralRecommended ||
    (analysis.estimatedValueMax && analysis.estimatedValueMax > 500000) ||
    analysis.confidence < 0.7 ||
    analysis.authenticityRisk === 'high' ||
    analysis.authenticityRisk === 'very_high'

  // Get photo requests sorted by priority
  const photoRequests = analysis.additionalPhotosRequested || []
  const sortedPhotoRequests = [...photoRequests].sort((a, b) => {
    const priorityOrder = { required: 0, recommended: 1, optional: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
  const visiblePhotoRequests = showAllPhotoRequests
    ? sortedPhotoRequests
    : sortedPhotoRequests.slice(0, 4)

  // Handle request photos action
  const handleRequestPhotos = () => {
    if (onRequestPhotos && photoRequests.length > 0) {
      onRequestPhotos(photoRequests.map(p => p.area))
    } else {
      onStartVera()
    }
  }

  return (
    <div className="space-y-6">
      {/* Vera Assistant CTA */}
      {shouldOfferVera && !showVeraAssistant && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6 border-2 border-amber-200/50" variant="brass">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">V</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Improve This Analysis with Vera
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {analysis.additionalPhotosRequested && analysis.additionalPhotosRequested.length > 0
                      ? `Vera can help improve confidence by guiding you to capture ${analysis.additionalPhotosRequested.length} additional photo${analysis.additionalPhotosRequested.length > 1 ? 's' : ''}.`
                      : `Current confidence is ${Math.round(displayAnalysis.confidence * 100)}%. Vera can help improve accuracy by asking targeted questions.`
                    }
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  onClick={onStartVera}
                  variant="brass"
                  size="default"
                  className="flex-1 md:flex-none justify-center"
                  disabled={veraLoading}
                >
                  {veraLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Starting...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      <span>Start with Vera</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick photo requests preview */}
            {analysis.additionalPhotosRequested && analysis.additionalPhotosRequested.length > 0 && (
              <div className="mt-4 pt-4 border-t border-primary/20">
                <p className="text-xs font-medium text-primary mb-2">Photos that would help:</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.additionalPhotosRequested.slice(0, 4).map((photo, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        photo.priority === 'required'
                          ? 'bg-danger-muted text-danger'
                          : 'bg-warning-muted text-warning'
                      )}
                    >
                      {photo.area}
                    </span>
                  ))}
                  {analysis.additionalPhotosRequested.length > 4 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      +{analysis.additionalPhotosRequested.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* Vera Assistant Panel - Inline when active */}
      {showVeraAssistant && veraSession && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <button
              onClick={() => {
                onShowVeraAssistant(false)
                onClearVeraSession()
              }}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-full text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <VeraAssistant
              session={veraSession}
              onSendMessage={onVeraSendMessage}
              onRequestReanalysis={onVeraReanalysis}
              isLoading={veraLoading}
              className="w-full"
            />
          </div>
        </motion.div>
      )}

      {/* Expert Escalation CTA */}
      {showExpertSection && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard className="p-6 border-2 border-accent/30 bg-gradient-to-r from-accent/10 to-accent/5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-foreground">Get Expert Verification</h3>
                  {analysis.expertReferralRecommended && (
                    <span className="px-2 py-0.5 bg-accent text-white text-xs font-bold rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">
                  {analysis.expertReferralReason ||
                    (analysis.estimatedValueMax && analysis.estimatedValueMax > 500000
                      ? 'High-value items benefit from professional authentication and appraisal.'
                      : analysis.confidence < 0.7
                      ? 'Our AI has some uncertainty about this item. A certified expert can provide definitive answers.'
                      : 'Connect with certified appraisers and specialists for authentication and professional valuation.'
                    )
                  }
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={onShowExpertEscalation}
                    className="px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-white font-semibold rounded-xl hover:from-accent/90 hover:to-accent/70 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    Connect with Expert
                  </button>
                  <div className="flex items-center gap-3 text-sm text-accent">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Verified Specialists
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      24hr Response
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Empty State when neither Vera nor Expert is needed */}
      {!shouldOfferVera && !showExpertSection && (
        <GlassCard className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-success to-success/70 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Analysis Complete
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            This analysis has high confidence ({Math.round(displayAnalysis.confidence * 100)}%).
            No additional assistance is needed at this time.
          </p>
        </GlassCard>
      )}

      {/* Additional Photo Requests Section - Detailed View */}
      {photoRequests.length > 0 && !showVeraAssistant && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Photos That Would Help
              </h3>
              <span className="text-sm text-muted-foreground">
                {photoRequests.length} request{photoRequests.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-3">
              {visiblePhotoRequests.map((photo, idx) => (
                <motion.div
                  key={photo.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all hover:shadow-md',
                    photo.priority === 'required'
                      ? 'bg-danger-muted border-danger/30'
                      : photo.priority === 'recommended'
                      ? 'bg-warning-muted border-warning/30'
                      : 'bg-info-muted border-info/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      photo.priority === 'required'
                        ? 'bg-danger/20'
                        : photo.priority === 'recommended'
                        ? 'bg-warning/20'
                        : 'bg-info/20'
                    )}>
                      <Camera className={cn(
                        'w-4 h-4',
                        photo.priority === 'required'
                          ? 'text-danger'
                          : photo.priority === 'recommended'
                          ? 'text-warning'
                          : 'text-info'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{photo.area}</span>
                        <span className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-full',
                          photo.priority === 'required'
                            ? 'bg-danger/20 text-danger'
                            : photo.priority === 'recommended'
                            ? 'bg-warning/20 text-warning'
                            : 'bg-info/20 text-info'
                        )}>
                          {photo.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{photo.reason}</p>
                      {photo.whatToCapture && (
                        <p className="text-xs text-muted-foreground/70 mt-1 italic">
                          Tip: {photo.whatToCapture}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {photoRequests.length > 4 && (
              <button
                onClick={() => setShowAllPhotoRequests(!showAllPhotoRequests)}
                className="mt-3 text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 mx-auto"
              >
                {showAllPhotoRequests ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show {photoRequests.length - 4} more
                  </>
                )}
              </button>
            )}

            <div className="mt-4 pt-4 border-t border-border">
              <Button
                onClick={handleRequestPhotos}
                variant="outline"
                size="default"
                className="w-full justify-center"
              >
                <Camera className="w-5 h-5" />
                <span>Add These Photos with Vera</span>
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Photography Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-6">
          <button
            onClick={() => setShowPhotoTips(!showPhotoTips)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Photography Tips for Better Results
            </h3>
            <motion.div
              animate={{ rotate: showPhotoTips ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showPhotoTips && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                  {PHOTO_TIPS.map((tip, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-warning-muted"
                    >
                      <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
                        <tip.icon className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Domain-specific tips */}
                {analysis.domainExpert && (
                  <div className="mt-4 p-4 rounded-lg bg-info-muted border border-info/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">
                          {getDomainExpertName(analysis.domainExpert)} Tip
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getDomainSpecificTip(analysis.domainExpert)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>

      {/* Help & FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-info" />
            Frequently Asked Questions
          </h3>

          <div className="space-y-2">
            {FAQ_ITEMS.map((faq, idx) => (
              <div
                key={idx}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="font-medium text-foreground text-sm pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-border pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Learn More
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'How AI Analysis Works', href: '/help/ai-analysis' },
                { label: 'Authentication Guide', href: '/help/authentication' },
                { label: 'Photography Best Practices', href: '/help/photography' },
                { label: 'Working with Experts', href: '/help/experts' }
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="px-3 py-1.5 text-xs font-medium text-info bg-info-muted rounded-full hover:bg-info/20 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}

/**
 * Get domain-specific photography tips
 */
function getDomainSpecificTip(domain: string): string {
  const tips: Record<string, string> = {
    furniture: 'Capture joinery details, underside labels, and any hardware stamps. Age wear patterns on feet and edges are valuable indicators.',
    ceramics: 'Photograph the bottom/base thoroughly for maker marks. Include any crazing patterns and show the translucency if porcelain.',
    glass: 'Use backlighting to show color and any internal features. Capture pontil marks on the base and any signatures or labels.',
    silver: 'Focus on hallmarks with good lighting. Show the patina and any monograms. Include weight indication if possible.',
    jewelry: 'Macro shots of hallmarks, signatures, and stone settings are crucial. Show clasp mechanisms and any maker stamps.',
    watches: 'Movement photos are ideal if possible. Capture serial numbers, case back engravings, and dial details including lume condition.',
    art: 'Photograph signature, date, and any labels on verso. Show canvas texture, paint thickness, and frame details.',
    textiles: 'Include selvage edges, weave structure close-ups, and any labels or stamps. Show color consistency in different areas.',
    toys: 'Focus on manufacturer marks, patents, and original labels. Show any mechanical functions and original packaging if available.',
    books: 'Photograph title page, copyright page, and spine. Include any bookplates, inscriptions, and binding details.',
    tools: 'Capture maker stamps, patent numbers, and any measuring marks. Show the tool from multiple angles to display mechanism.',
    lighting: 'Include any maker labels, patent stamps, and electrical components if visible. Show fixture from multiple angles.',
    electronics: 'Serial numbers, model numbers, and manufacturer labels are key. Show any patent numbers and condition of components.',
    vehicles: 'VIN, data plates, engine numbers, and original equipment are essential. Show unique trim and options.',
    general: 'Look for any text, labels, stamps, or marks that could indicate origin. Multiple angles always help our analysis.'
  }
  return tips[domain] || tips.general
}
