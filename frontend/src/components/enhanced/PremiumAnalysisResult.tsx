import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  MapPin,
  StickyNote,
  Sparkles,
  Share2,
  Download,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  FileDown,
  ChevronRight,
  Eye,
  Camera,
  Check,
  MessageCircle,
  Info
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useNotifications } from '@/components/enhanced/NotificationSystem'
import ConfidenceVisualization, { AuthenticationFindings } from '@/components/enhanced/ConfidenceVisualization'
import AuthenticationWizard from '@/components/enhanced/AuthenticationWizard'
import ShareAnalysisModal from '@/components/enhanced/ShareAnalysisModal'
import { ExpertEscalation } from '@/components/enhanced/ExpertEscalation'
import { useInteractiveSession } from '@/hooks/useInteractiveSession'
import { exportAnalysisToPDF } from '@/utils/pdfExport'
import {
  ItemAnalysis,
  DomainExpert as DomainExpertType,
  PhotoRequest
} from '@/types'
import { cn, trackEvent, vibrate, formatCurrency } from '@/lib/utils'

interface PremiumAnalysisResultProps {
  analysis: ItemAnalysis
  onSaveToCollection?: (notes?: string, location?: string) => Promise<boolean>
  onSubmitFeedback?: (isCorrect: boolean, correctionText?: string, feedbackType?: string) => void
}

/**
 * Bento grid analysis result display.
 * Shows everything at a glance - no tabs hiding information.
 *
 * Key principle: Most important info is always visible.
 * Visual evidence, confidence state, and value are immediately apparent.
 */
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
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null)
  const [updatedAnalysis, setUpdatedAnalysis] = useState<ItemAnalysis | null>(null)

  // Vera Interactive Session Hook
  const {
    loading: veraLoading,
    error: veraError,
    startSession: startVeraSession,
    triggerReanalysis: triggerVeraReanalysis,
    submitAdditionalPhotos,
  } = useInteractiveSession()

  // Use updated analysis if available (after Vera reanalysis)
  const displayAnalysis = updatedAnalysis || analysis
  const confidencePercent = Math.round(displayAnalysis.confidence * 100)

  // Check if Vera should be offered
  const shouldOfferVera = displayAnalysis.confidence < 0.9 ||
    !!(displayAnalysis.additionalPhotosRequested && displayAnalysis.additionalPhotosRequested.length > 0)

  // Build knowledge state from analysis data
  const knowledgeState = {
    confirmed: displayAnalysis.evidenceFor || [],
    probable: displayAnalysis.evidenceAgainst?.filter(e => !e.toLowerCase().includes('uncertain')) || [],
    needsVerification: displayAnalysis.additionalPhotosRequested?.map(p => p.reason) || []
  }

  // Build authentication findings from the findings array
  const authFindings = displayAnalysis.itemAuthentication?.findings?.map(finding => ({
    name: finding.area,
    result: finding.status === 'pass' ? 'pass' as const :
            finding.status === 'fail' ? 'fail' as const : 'inconclusive' as const,
    details: finding.explanation
  })) || []

  useEffect(() => {
    trackEvent('analysis_result_viewed', {
      itemName: displayAnalysis.name,
      confidence: displayAnalysis.confidence,
      domainExpert: displayAnalysis.domainExpert,
      productCategory: displayAnalysis.productCategory,
      hasDealRating: !!displayAnalysis.dealRating,
      hasValue: !!(displayAnalysis.estimatedValueMin || displayAnalysis.estimatedValueMax)
    })
  }, [displayAnalysis])

  // Handlers
  const handleShare = () => {
    trackEvent('share_modal_opened', { itemName: displayAnalysis.name })
    setShowShareModal(true)
  }

  const handlePDFExport = () => {
    trackEvent('pdf_export', { itemName: displayAnalysis.name })
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
    trackEvent('collection_save_attempted', { itemName: displayAnalysis.name })

    const success = await onSaveToCollection(saveNotes || undefined, saveLocation || undefined)

    if (success) {
      setShowSaveDialog(false)
      setSaveNotes('')
      setSaveLocation('')
      vibrate([50, 50, 100])
      notifications.premium(`Saved to your collection!`, `${displayAnalysis.name} is now in your personal collection`)
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
      trackEvent('feedback_positive', { itemName: displayAnalysis.name })
    } else {
      setShowFeedbackDialog(true)
      trackEvent('feedback_negative_started', { itemName: displayAnalysis.name })
    }
  }

  const submitDetailedFeedback = () => {
    onSubmitFeedback?.(false, feedbackText, selectedFeedbackType)
    setShowFeedbackDialog(false)
    setFeedbackText('')
    setSelectedFeedbackType('')
    notifications.success('Feedback submitted! Thank you for helping us improve.')
    trackEvent('feedback_negative_submitted', {
      itemName: displayAnalysis.name,
      feedbackType: selectedFeedbackType
    })
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = displayAnalysis.imageUrl
    link.download = `${displayAnalysis.name}.jpg`
    link.click()
    trackEvent('analysis_downloaded', { itemName: displayAnalysis.name })
  }

  // Vera Handlers
  const handleStartVera = async () => {
    trackEvent('vera_session_started', { itemName: displayAnalysis.name, confidence: displayAnalysis.confidence })
    const session = await startVeraSession(displayAnalysis.id)
    if (session) {
      notifications.info('Vera is ready to help improve your analysis!')
    } else if (veraError) {
      notifications.error('Failed to start Vera session', veraError)
    }
  }

  const handleVeraReanalysisCallback = async () => {
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

  // Export for Vera integration
  void handleVeraReanalysisCallback

  const handleSubmitPhotosFromWizard = async (photos: { photoRequest: PhotoRequest; imageData: string }[]) => {
    trackEvent('auth_wizard_photos_submitted', { count: photos.length })
    notifications.info(`Submitting ${photos.length} photos for analysis...`)

    const result = await submitAdditionalPhotos(displayAnalysis.id, photos)
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

  // Format value range
  const valueRange = displayAnalysis.estimatedValueMin && displayAnalysis.estimatedValueMax
    ? `${formatCurrency(displayAnalysis.estimatedValueMin)} - ${formatCurrency(displayAnalysis.estimatedValueMax)}`
    : displayAnalysis.estimatedValueMin
      ? formatCurrency(displayAnalysis.estimatedValueMin)
      : displayAnalysis.estimatedValueMax
        ? formatCurrency(displayAnalysis.estimatedValueMax)
        : null

  // Visual markers from analysis (if available)
  const visualMarkers = displayAnalysis.visualMarkers || []

  return (
    <div className="space-y-6">
      {/* Bento Grid - All key info visible at once */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Large Image Card - spans 2 columns on lg */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 lg:col-span-2 lg:row-span-2"
        >
          <GlassCard variant="default" padding="none" className="overflow-hidden h-full">
            <div
              className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px] cursor-pointer group"
              onClick={() => setShowFullImage(true)}
            >
              <img
                src={displayAnalysis.imageUrl}
                alt={displayAnalysis.name}
                className="w-full h-full object-cover"
              />

              {/* Visual Evidence Markers */}
              {visualMarkers.map((marker, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedMarker(selectedMarker === index ? null : index)
                  }}
                  className={cn(
                    "absolute w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    marker.confidence >= 0.8
                      ? "bg-success/80 border-2 border-success"
                      : marker.confidence >= 0.6
                        ? "bg-warning/80 border-2 border-warning"
                        : "bg-info/80 border-2 border-info",
                    selectedMarker === index && "ring-2 ring-white ring-offset-2 ring-offset-black/50"
                  )}
                  style={{
                    left: `${marker.bbox?.x || 20 + index * 15}%`,
                    top: `${marker.bbox?.y || 20 + index * 20}%`
                  }}
                >
                  {marker.confidence >= 0.8 ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : marker.confidence >= 0.6 ? (
                    <Eye className="w-4 h-4 text-white" />
                  ) : (
                    <Info className="w-4 h-4 text-white" />
                  )}
                </motion.button>
              ))}

              {/* Marker detail popup */}
              <AnimatePresence>
                {selectedMarker !== null && visualMarkers[selectedMarker] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-black/80 backdrop-blur-sm"
                  >
                    <p className="text-sm text-white font-medium">
                      {visualMarkers[selectedMarker].label}: {visualMarkers[selectedMarker].finding}
                    </p>
                    <p className="text-xs text-white/70 mt-1">
                      {Math.round(visualMarkers[selectedMarker].confidence * 100)}% confidence
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Domain Expert Badge */}
              {displayAnalysis.domainExpert && (
                <div className="absolute top-4 left-4">
                  <Badge variant="brass" className="backdrop-blur-sm">
                    {displayAnalysis.domainExpert}
                  </Badge>
                </div>
              )}

              {/* View full image hint */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="text-white flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="w-5 h-5" />
                  <span className="text-sm font-medium">View full image</span>
                </motion.div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Identification Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="brass" className="h-full">
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground leading-tight">
                {displayAnalysis.name}
              </h2>

              <div className="flex flex-wrap gap-2">
                {displayAnalysis.productCategory && (
                  <Badge variant="secondary">{displayAnalysis.productCategory}</Badge>
                )}
                {displayAnalysis.era && (
                  <Badge variant="outline">{displayAnalysis.era}</Badge>
                )}
              </div>

              <div className="space-y-2 pt-2">
                {displayAnalysis.maker && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Maker</span>
                    <span className="text-foreground font-medium">{displayAnalysis.maker}</span>
                  </div>
                )}
                {displayAnalysis.originRegion && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Origin</span>
                    <span className="text-foreground">{displayAnalysis.originRegion}</span>
                  </div>
                )}
                {displayAnalysis.periodStart && displayAnalysis.periodEnd && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Period</span>
                    <span className="text-foreground">{displayAnalysis.periodStart} - {displayAnalysis.periodEnd}</span>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Value Card */}
        {valueRange && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard
              variant="default"
              className="h-full bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20"
            >
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimated Value</p>
                <p className="font-display text-3xl font-bold text-primary">
                  {valueRange}
                </p>

                {displayAnalysis.dealRating && (
                  <Badge
                    variant={
                      displayAnalysis.dealRating === 'exceptional' ? 'success' :
                      displayAnalysis.dealRating === 'good' ? 'brass' : 'muted'
                    }
                  >
                    {displayAnalysis.dealRating.charAt(0).toUpperCase() + displayAnalysis.dealRating.slice(1)} Deal
                  </Badge>
                )}

                {displayAnalysis.comparableSales && displayAnalysis.comparableSales.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Recent sales</p>
                    {displayAnalysis.comparableSales.slice(0, 2).map((sale, i) => (
                      <div key={i} className="flex justify-between text-xs py-1">
                        <span className="text-muted-foreground">{sale.venue || 'Private'}</span>
                        <span className="text-primary font-medium">{formatCurrency(sale.price)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Confidence Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(!valueRange && "md:col-span-2 lg:col-span-1")}
        >
          <ConfidenceVisualization
            confidence={confidencePercent}
            knowledgeState={knowledgeState}
            className="h-full"
          />
        </motion.div>

        {/* Authentication Card (if has findings) */}
        {authFindings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AuthenticationFindings
              findings={authFindings}
              className="h-full"
            />
          </motion.div>
        )}

        {/* Vera CTA Card (if should offer) */}
        {shouldOfferVera && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard variant="default" className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Want more certainty?</h4>
                    <p className="text-sm text-muted-foreground">
                      Vera can help with additional photos
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStartVera}
                    disabled={veraLoading}
                    className="w-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {veraLoading ? 'Starting...' : 'Ask Vera'}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>

      {/* Description Section */}
      {displayAnalysis.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard variant="default">
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">About This Item</h3>
            <p className="text-muted-foreground leading-relaxed">
              {displayAnalysis.description}
            </p>
            {displayAnalysis.historicalContext && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Historical context:</span>{' '}
                  {displayAnalysis.historicalContext}
                </p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* Action Bar - Sticky on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="sticky bottom-4 z-10"
      >
        <GlassCard variant="default" className="backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Primary Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="brass"
                onClick={() => setShowSaveDialog(true)}
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>

              <Button
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handlePDFExport}
              >
                <FileDown className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>

            {/* Feedback */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">Accurate?</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback(true)}
                  className="text-muted-foreground hover:text-success"
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback(false)}
                  className="text-muted-foreground hover:text-danger"
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Additional Photos Request - if Vera suggests */}
      {displayAnalysis.additionalPhotosRequested && displayAnalysis.additionalPhotosRequested.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard variant="default" className="border-info/20 bg-info-muted">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-info" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">Additional photos would help</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  These specific photos could improve confidence
                </p>
                <ul className="space-y-2">
                  {displayAnalysis.additionalPhotosRequested.slice(0, 3).map((request, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{request.reason}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthWizard(true)}
                  className="mt-4"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Add Photos
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Full Image Modal */}
      <AnimatePresence>
        {showFullImage && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullImage(false)}
          >
            <motion.div
              className="relative max-w-5xl max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={displayAnalysis.imageUrl}
                alt={displayAnalysis.name}
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />

              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShowFullImage(false)}
                className="absolute top-4 right-4"
              >
                <X className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save to Collection</DialogTitle>
            <DialogDescription>
              Add this item to your personal collection with optional notes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-muted-foreground" />
                Notes (optional)
              </label>
              <textarea
                value={saveNotes}
                onChange={(e) => setSaveNotes(e.target.value)}
                placeholder="Add any personal notes about this item..."
                rows={3}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Location (optional)
              </label>
              <Input
                value={saveLocation}
                onChange={(e) => setSaveLocation(e.target.value)}
                placeholder="Where did you find this item?"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button variant="brass" onClick={handleSaveToCollection} disabled={saving}>
              {saving ? 'Saving...' : 'Save to Collection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Help Us Improve</DialogTitle>
            <DialogDescription>
              Your feedback helps train our AI to be more accurate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
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
                      'p-3 text-sm rounded-md border-2 transition-all',
                      selectedFeedbackType === type.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-muted-foreground text-muted-foreground'
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                What would be more accurate?
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Please share the correct information..."
                rows={4}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="brass"
              onClick={submitDetailedFeedback}
              disabled={!feedbackText.trim() || !selectedFeedbackType}
            >
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
        {showExpertEscalation && displayAnalysis.domainExpert && (
          <ExpertEscalation
            itemName={displayAnalysis.name}
            domainExpert={displayAnalysis.domainExpert as DomainExpertType}
            estimatedValue={displayAnalysis.estimatedValueMin || displayAnalysis.estimatedValueMax || undefined}
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
