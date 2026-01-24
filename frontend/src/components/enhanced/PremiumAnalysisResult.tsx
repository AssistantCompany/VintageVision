import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  MapPin,
  StickyNote,
  Sparkles,
  Layers
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import LiquidButton from '@/components/ui/LiquidButton'
import AnalysisTabs, { tabIcons } from '@/components/ui/AnalysisTabs'
import { useNotifications } from '@/components/enhanced/NotificationSystem'
import AuthenticationWizard from '@/components/enhanced/AuthenticationWizard'
import ShareAnalysisModal from '@/components/enhanced/ShareAnalysisModal'
import { ExpertEscalation } from '@/components/enhanced/ExpertEscalation'
import { useInteractiveSession } from '@/hooks/useInteractiveSession'
import { exportAnalysisToPDF } from '@/utils/pdfExport'

// Tab Content Components
import {
  OverviewTab,
  EvidenceTab,
  ValueTab,
  StyleTab,
  VeraTab
} from '@/components/analysis'

import {
  ItemAnalysis,
  VisualMarker,
  KnowledgeState,
  ItemAuthentication,
  DomainExpert as DomainExpertType,
  PhotoRequest
} from '@/types'
import { cn, trackEvent, vibrate } from '@/lib/utils'

interface PremiumAnalysisResultProps {
  analysis: ItemAnalysis
  onSaveToCollection?: (notes?: string, location?: string) => Promise<boolean>
  onSubmitFeedback?: (isCorrect: boolean, correctionText?: string, feedbackType?: string) => void
}

export default function PremiumAnalysisResult({
  analysis,
  onSaveToCollection,
  onSubmitFeedback
}: PremiumAnalysisResultProps) {
  const { user, redirectToLogin } = useAuth()
  const notifications = useNotifications()

  // UI State
  const [showFullImage, setShowFullImage] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [saveNotes, setSaveNotes] = useState('')
  const [saveLocation, setSaveLocation] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [selectedFeedbackType, setSelectedFeedbackType] = useState<string>('')
  const [showAuthWizard, setShowAuthWizard] = useState(false)
  const [showExpertEscalation, setShowExpertEscalation] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [activeView, setActiveView] = useState<'classic' | 'world-class'>('world-class')
  const [showVeraAssistant, setShowVeraAssistant] = useState(false)
  const [updatedAnalysis, setUpdatedAnalysis] = useState<ItemAnalysis | null>(null)

  // Vera Interactive Session Hook
  const {
    session: veraSession,
    loading: veraLoading,
    error: veraError,
    startSession: startVeraSession,
    sendResponse: sendVeraResponse,
    triggerReanalysis: triggerVeraReanalysis,
    submitAdditionalPhotos,
    clearSession: clearVeraSession,
  } = useInteractiveSession()

  // Use updated analysis if available (after Vera reanalysis)
  const displayAnalysis = updatedAnalysis || analysis

  // Check if Vera should be offered
  const shouldOfferVera = analysis.confidence < 0.9 ||
    !!(analysis.additionalPhotosRequested && analysis.additionalPhotosRequested.length > 0)

  // Extract data from analysis
  const visualMarkers: VisualMarker[] = (analysis as any).visualMarkers || []
  const knowledgeState: KnowledgeState | null = (analysis as any).knowledgeState || null
  const itemAuthentication: ItemAuthentication | null = (analysis as any).itemAuthentication || null
  const hasWorldClassData = visualMarkers.length > 0 || knowledgeState !== null || itemAuthentication !== null

  useEffect(() => {
    trackEvent('analysis_result_viewed', {
      itemName: analysis.name,
      confidence: analysis.confidence,
      domainExpert: analysis.domainExpert,
      productCategory: analysis.productCategory,
      hasDealRating: !!analysis.dealRating,
      hasValue: !!(analysis.estimatedValueMin || analysis.estimatedValueMax)
    })
  }, [analysis])

  // Handlers
  const handleShare = () => {
    trackEvent('share_modal_opened', { itemName: analysis.name })
    setShowShareModal(true)
  }

  const handlePDFExport = () => {
    trackEvent('pdf_export', { itemName: analysis.name })
    exportAnalysisToPDF(displayAnalysis)
    notifications.success('Opening PDF export...')
  }

  const handleSaveToCollection = async () => {
    if (!user) {
      redirectToLogin()
      return
    }

    if (!onSaveToCollection) {
      notifications.error('Save functionality not available')
      return
    }

    setSaving(true)
    trackEvent('collection_save_attempted', { itemName: analysis.name })

    const success = await onSaveToCollection(saveNotes || undefined, saveLocation || undefined)

    if (success) {
      setShowSaveDialog(false)
      setSaveNotes('')
      setSaveLocation('')
      vibrate([50, 50, 100])
      notifications.premium(`Saved to your collection!`, `${analysis.name} is now in your personal collection`)
    }

    setSaving(false)
  }

  const handleFeedback = (isCorrect: boolean) => {
    if (!user) {
      redirectToLogin()
      return
    }

    if (isCorrect) {
      onSubmitFeedback?.(true, undefined, 'accuracy')
      vibrate(100)
      notifications.success('Thanks for the positive feedback!')
      trackEvent('feedback_positive', { itemName: analysis.name })
    } else {
      setShowFeedbackDialog(true)
      trackEvent('feedback_negative_started', { itemName: analysis.name })
    }
  }

  const submitDetailedFeedback = () => {
    onSubmitFeedback?.(false, feedbackText, selectedFeedbackType)
    setShowFeedbackDialog(false)
    setFeedbackText('')
    setSelectedFeedbackType('')
    notifications.success('Feedback submitted! Thank you for helping us improve.')
    trackEvent('feedback_negative_submitted', {
      itemName: analysis.name,
      feedbackType: selectedFeedbackType
    })
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = analysis.imageUrl
    link.download = `${analysis.name}.jpg`
    link.click()
    trackEvent('analysis_downloaded', { itemName: analysis.name })
  }

  // Vera Handlers
  const handleStartVera = async () => {
    trackEvent('vera_session_started', { itemName: analysis.name, confidence: analysis.confidence })
    const session = await startVeraSession(analysis.id)
    if (session) {
      setShowVeraAssistant(true)
      notifications.info('Vera is ready to help improve your analysis!')
    } else if (veraError) {
      notifications.error('Failed to start Vera session', veraError)
    }
  }

  const handleVeraSendMessage = async (needId: string, type: 'photo' | 'text', content: string) => {
    const result = await sendVeraResponse(needId, type, content)
    if (result) {
      trackEvent('vera_response_sent', { needId, type })
    }
  }

  const handleVeraReanalysis = async () => {
    notifications.info('Vera is reanalyzing with your new information...')
    const result = await triggerVeraReanalysis()
    if (result?.analysis) {
      setUpdatedAnalysis(result.analysis)
      notifications.premium(
        'Analysis Updated!',
        `Confidence improved to ${Math.round(result.analysis.confidence * 100)}%`
      )
      trackEvent('vera_reanalysis_complete', {
        itemName: result.analysis.name,
        newConfidence: result.analysis.confidence
      })
    }
  }

  const handleSubmitPhotosFromWizard = async (photos: { photoRequest: PhotoRequest; imageData: string }[]) => {
    trackEvent('auth_wizard_photos_submitted', { count: photos.length })
    notifications.info(`Submitting ${photos.length} photos for analysis...`)

    const result = await submitAdditionalPhotos(analysis.id, photos)
    if (result?.analysis) {
      setUpdatedAnalysis(result.analysis)
      notifications.premium(
        'Photos Analyzed!',
        `Analysis updated with ${photos.length} additional photos`
      )
    } else {
      notifications.error('Failed to analyze photos. Please try again.')
    }
  }

  // Build tabs configuration
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: tabIcons.overview,
      content: (
        <OverviewTab
          analysis={analysis}
          displayAnalysis={displayAnalysis}
          visualMarkers={visualMarkers}
          activeView={activeView}
          user={user}
          onShowFullImage={() => setShowFullImage(true)}
          onShowSaveDialog={() => setShowSaveDialog(true)}
          onShare={handleShare}
          onPDFExport={handlePDFExport}
          onDownload={handleDownload}
          onFeedback={handleFeedback}
        />
      )
    },
    {
      id: 'evidence',
      label: 'Evidence',
      icon: tabIcons.evidence,
      badge: (analysis.evidenceFor?.length || 0) + (analysis.evidenceAgainst?.length || 0) || undefined,
      content: (
        <EvidenceTab analysis={analysis} />
      )
    },
    {
      id: 'value',
      label: 'Value',
      icon: tabIcons.value,
      content: (
        <ValueTab
          analysis={analysis}
        />
      )
    },
    {
      id: 'style',
      label: 'Style',
      icon: tabIcons.style,
      content: <StyleTab analysis={analysis} />
    },
    {
      id: 'vera',
      label: 'Vera',
      icon: tabIcons.vera,
      badge: shouldOfferVera ? '!' : undefined,
      content: (
        <VeraTab
          analysis={analysis}
          displayAnalysis={displayAnalysis}
          shouldOfferVera={shouldOfferVera}
          showVeraAssistant={showVeraAssistant}
          veraSession={veraSession}
          veraLoading={veraLoading}
          onStartVera={handleStartVera}
          onShowVeraAssistant={setShowVeraAssistant}
          onVeraSendMessage={handleVeraSendMessage}
          onVeraReanalysis={handleVeraReanalysis}
          onClearVeraSession={clearVeraSession}
          onShowExpertEscalation={() => setShowExpertEscalation(true)}
        />
      )
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* View Toggle - Only show if world-class data available */}
      {hasWorldClassData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="inline-flex bg-stone-100 rounded-full p-1">
            <button
              onClick={() => setActiveView('world-class')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
                activeView === 'world-class'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-800'
              )}
            >
              <Sparkles className="w-4 h-4" />
              World-Class View
            </button>
            <button
              onClick={() => setActiveView('classic')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
                activeView === 'classic'
                  ? 'bg-stone-800 text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-800'
              )}
            >
              <Layers className="w-4 h-4" />
              Classic View
            </button>
          </div>
        </motion.div>
      )}

      {/* Tab-Based Layout */}
      <AnalysisTabs
        tabs={tabs}
        defaultIndex={0}
        stickyHeader={true}
      />

      {/* Full Image Modal */}
      <AnimatePresence>
        {showFullImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullImage(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={analysis.imageUrl}
                alt={analysis.name}
                className="w-full h-auto object-contain rounded-xl shadow-2xl"
              />

              <motion.button
                onClick={() => setShowFullImage(false)}
                className="absolute top-4 right-4 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-6" gradient="default">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Save to Collection</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <StickyNote className="w-4 h-4 inline mr-2" />
                      Notes (optional)
                    </label>
                    <textarea
                      value={saveNotes}
                      onChange={(e) => setSaveNotes(e.target.value)}
                      placeholder="Add any personal notes about this item..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white/50 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Location (optional)
                    </label>
                    <input
                      type="text"
                      value={saveLocation}
                      onChange={(e) => setSaveLocation(e.target.value)}
                      placeholder="Where did you find this item?"
                      className="w-full px-3 py-2 bg-white/50 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <LiquidButton
                    onClick={handleSaveToCollection}
                    disabled={saving}
                    variant="primary"
                    size="md"
                    className="flex-1"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </LiquidButton>

                  <MagneticButton
                    onClick={() => setShowSaveDialog(false)}
                    variant="ghost"
                    size="md"
                  >
                    Cancel
                  </MagneticButton>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Dialog */}
      <AnimatePresence>
        {showFeedbackDialog && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFeedbackDialog(false)}
          >
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-6" gradient="default">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Help Us Improve</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What type of feedback?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'accuracy', label: 'Accuracy' },
                        { value: 'styling', label: 'Styling' },
                        { value: 'value', label: 'Value' }
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setSelectedFeedbackType(type.value)}
                          className={cn(
                            'p-3 text-sm rounded-xl border-2 transition-all',
                            selectedFeedbackType === type.value
                              ? 'border-amber-500 bg-amber-50 text-amber-700'
                              : 'border-gray-300 hover:border-gray-400'
                          )}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What would be more accurate?
                    </label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Please share the correct information..."
                      rows={4}
                      className="w-full px-3 py-2 bg-white/50 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <LiquidButton
                    onClick={submitDetailedFeedback}
                    disabled={!feedbackText.trim() || !selectedFeedbackType}
                    variant="primary"
                    size="md"
                    className="flex-1"
                  >
                    Submit Feedback
                  </LiquidButton>

                  <MagneticButton
                    onClick={() => setShowFeedbackDialog(false)}
                    variant="ghost"
                    size="md"
                  >
                    Cancel
                  </MagneticButton>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Authentication Wizard Modal */}
      <AnimatePresence>
        {showAuthWizard && (
          <AuthenticationWizard
            analysis={displayAnalysis}
            onClose={() => setShowAuthWizard(false)}
            onSubmitPhotos={handleSubmitPhotosFromWizard}
          />
        )}
      </AnimatePresence>

      {/* Expert Escalation Modal */}
      <AnimatePresence>
        {showExpertEscalation && analysis.domainExpert && (
          <ExpertEscalation
            itemName={analysis.name}
            domainExpert={analysis.domainExpert as DomainExpertType}
            estimatedValue={analysis.estimatedValueMin || analysis.estimatedValueMax || undefined}
            onClose={() => setShowExpertEscalation(false)}
          />
        )}
      </AnimatePresence>

      {/* Share Analysis Modal */}
      <ShareAnalysisModal
        analysis={displayAnalysis}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  )
}
