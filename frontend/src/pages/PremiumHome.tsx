import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Layers } from 'lucide-react'
import PremiumHeader from '@/components/enhanced/PremiumHeader'
import SimpleImageUploader, { ConsensusMode } from '@/components/enhanced/SimpleImageUploader'
import PremiumAnalysisResult from '@/components/enhanced/PremiumAnalysisResult'
import { useNotifications } from '@/components/enhanced/NotificationSystem'
import AdvancedLoadingSpinner from '@/components/ui/AdvancedLoadingSpinner'
import { useVintageAnalysis } from '@/hooks/useVintageAnalysis'
import { ItemAnalysis, CapturedImage } from '@/types'
import { trackEvent } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * Camera-first home page.
 * The upload interface is the hero - no marketing fluff.
 */
export default function PremiumHome() {
  const { user } = useAuth()
  const notifications = useNotifications()
  const [currentAnalysis, setCurrentAnalysis] = useState<ItemAnalysis | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [analysisMode, setAnalysisMode] = useState<'single' | 'multi'>('single')
  const { analyzing, error, analyzeItem, analyzeMultiImage, saveToCollection, submitFeedback } = useVintageAnalysis()

  const handleImageSelected = async (dataUrl: string, consensusMode: ConsensusMode = 'auto') => {
    setAnalysisMode('single')
    trackEvent('image_upload_started', { consensusMode, mode: 'single' })
    setShowResult(false)
    setCurrentAnalysis(null)

    const analysis = await analyzeItem(dataUrl, undefined, consensusMode)

    if (analysis) {
      setCurrentAnalysis(analysis)
      setShowResult(true)
      trackEvent('analysis_completed', {
        itemName: analysis.name,
        confidence: analysis.confidence,
        hasValue: !!(analysis.estimatedValueMin || analysis.estimatedValueMax),
        mode: 'single'
      })
      notifications.premium(
        `Analysis complete: ${analysis.name}`,
        analysis.estimatedValueMin ? `Estimated value: $${analysis.estimatedValueMin.toLocaleString()}+` : undefined
      )
    } else if (error) {
      notifications.error('Analysis failed', error)
      trackEvent('analysis_failed', { error, mode: 'single' })
    }
  }

  const handleMultiImageSelected = async (images: CapturedImage[], consensusMode: ConsensusMode = 'auto') => {
    setAnalysisMode('multi')
    trackEvent('multi_image_upload_started', {
      imageCount: images.length,
      roles: images.map(img => img.role),
      consensusMode
    })
    setShowResult(false)
    setCurrentAnalysis(null)

    const analysis = await analyzeMultiImage(images, undefined, consensusMode)

    if (analysis) {
      setCurrentAnalysis(analysis)
      setShowResult(true)
      trackEvent('analysis_completed', {
        itemName: analysis.name,
        confidence: analysis.confidence,
        hasValue: !!(analysis.estimatedValueMin || analysis.estimatedValueMax),
        mode: 'multi',
        imageCount: images.length
      })
      notifications.premium(
        `Analysis complete: ${analysis.name}`,
        `Analyzed ${images.length} photos`
      )
    } else if (error) {
      notifications.error('Analysis failed', error)
      trackEvent('analysis_failed', { error, mode: 'multi' })
    }
  }

  const handleSaveToCollection = async (notes?: string, location?: string) => {
    if (!currentAnalysis || !user) return false
    trackEvent('collection_save_attempt')
    const success = await saveToCollection(currentAnalysis.id, notes, location)
    if (success) {
      notifications.success('Saved to collection')
      trackEvent('collection_save_success')
    } else {
      notifications.error('Failed to save')
      trackEvent('collection_save_failed')
    }
    return success
  }

  const handleSubmitFeedback = async (isCorrect: boolean, correctionText?: string, feedbackType?: string) => {
    if (!currentAnalysis || !user) return
    trackEvent('feedback_submitted', { isCorrect, feedbackType })
    const success = await submitFeedback(currentAnalysis.id, isCorrect, correctionText, feedbackType)
    if (success) {
      notifications.success('Thanks for the feedback')
    }
  }

  const resetToHome = () => {
    setShowResult(false)
    setCurrentAnalysis(null)
    setAnalysisMode('single')
    trackEvent('reset_to_home')
  }

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader onReset={resetToHome} />

      <main className="relative max-w-5xl mx-auto px-4 py-6 pb-28 md:pb-8">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Minimal header - just enough context */}
              <div className="text-center pt-4 md:pt-8">
                <h1 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
                  What do you have?
                </h1>
                <p className="text-muted-foreground">
                  Upload a photo to identify, authenticate, and value your item
                </p>
              </div>

              {/* THE MAIN EVENT: Upload interface */}
              <div className="max-w-2xl mx-auto">
                <SimpleImageUploader
                  onImageSelected={handleImageSelected}
                  onMultiImageSelected={handleMultiImageSelected}
                  disabled={analyzing}
                  enableMultiImage={true}
                />
              </div>

              {/* Analyzing state */}
              {analyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <AdvancedLoadingSpinner
                    variant="glass"
                    size="lg"
                    text={analysisMode === 'multi'
                      ? "Analyzing multiple photos..."
                      : "Identifying your item..."
                    }
                  />
                  {analysisMode === 'multi' && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-primary">
                      <Layers className="w-4 h-4" />
                      <span className="text-sm">Multi-photo analysis</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Error state */}
              {error && !analyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-md mx-auto p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center"
                >
                  <p className="text-destructive font-medium">{error}</p>
                  <button
                    onClick={resetToHome}
                    className="mt-2 text-sm text-destructive/70 hover:text-destructive underline"
                  >
                    Try again
                  </button>
                </motion.div>
              )}

              {/* Trust indicators - minimal, below the fold */}
              {!analyzing && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-8 md:pt-12"
                >
                  <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
                    <div>
                      <p className="text-2xl font-display font-semibold text-foreground">15+</p>
                      <p className="text-xs text-muted-foreground">Expert domains</p>
                    </div>
                    <div>
                      <p className="text-2xl font-display font-semibold text-foreground">Real</p>
                      <p className="text-xs text-muted-foreground">Auction data</p>
                    </div>
                    <div>
                      <p className="text-2xl font-display font-semibold text-foreground">Honest</p>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>

                  {/* Sign in prompt for non-users */}
                  {!user && (
                    <div className="mt-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        <a href="/auth" className="text-primary hover:underline">Sign in</a>
                        {' '}to save items and get unlimited analyses
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Back button */}
              <Button
                onClick={resetToHome}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Analyze another
              </Button>

              {/* Analysis result */}
              {currentAnalysis && (
                <PremiumAnalysisResult
                  analysis={currentAnalysis}
                  onSaveToCollection={handleSaveToCollection}
                  onSubmitFeedback={handleSubmitFeedback}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
