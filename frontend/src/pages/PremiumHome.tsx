import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Search, BookOpen, Heart, Sparkles, Layers } from 'lucide-react'
import PremiumHeader from '@/components/enhanced/PremiumHeader'
import PremiumFooter from '@/components/enhanced/PremiumFooter'
import SimpleImageUploader, { ConsensusMode } from '@/components/enhanced/SimpleImageUploader'
import PremiumAnalysisResult from '@/components/enhanced/PremiumAnalysisResult'

import { useNotifications } from '@/components/enhanced/NotificationSystem'
import GlassCard from '@/components/ui/GlassCard'
import FloatingParticles from '@/components/ui/FloatingParticles'
import SpotlightEffect from '@/components/ui/SpotlightEffect'
import AdvancedLoadingSpinner from '@/components/ui/AdvancedLoadingSpinner'
import { useVintageAnalysis } from '@/hooks/useVintageAnalysis'
import { ItemAnalysis, CapturedImage } from '@/types'
import { trackEvent } from '@/lib/utils'

export default function PremiumHome() {
  const { user } = useAuth()
  const notifications = useNotifications()
  const [currentAnalysis, setCurrentAnalysis] = useState<ItemAnalysis | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [analysisMode, setAnalysisMode] = useState<'single' | 'multi'>('single')
  const { analyzing, error, analyzeItem, analyzeMultiImage, saveToCollection, submitFeedback } = useVintageAnalysis()

  const handleImageSelected = async (dataUrl: string, consensusMode: ConsensusMode = 'auto') => {
    console.log('🔥 handleImageSelected CALLED in PremiumHome', {
      dataUrlLength: dataUrl?.length || 0,
      dataUrlStart: dataUrl?.substring(0, 50) || 'undefined',
      consensusMode
    })

    setAnalysisMode('single')
    trackEvent('image_upload_started', { consensusMode, mode: 'single' })
    setShowResult(false)
    setCurrentAnalysis(null)

    console.log('🚀 Calling analyzeItem with consensusMode:', consensusMode)
    const analysis = await analyzeItem(dataUrl, undefined, consensusMode)
    console.log('📊 analyzeItem returned:', { hasAnalysis: !!analysis, error, dealRating: analysis?.dealRating })

    if (analysis) {
      console.log('✅ Analysis successful, setting state')
      setCurrentAnalysis(analysis)
      setShowResult(true)
      trackEvent('analysis_completed', {
        itemName: analysis.name,
        confidence: analysis.confidence,
        hasValue: !!(analysis.estimatedValueMin || analysis.estimatedValueMax),
        mode: 'single'
      })

      // Send premium notification
      notifications.premium(
        `Analysis complete: ${analysis.name}`,
        analysis.estimatedValueMin ? `Estimated value: $${analysis.estimatedValueMin.toLocaleString()}+` : undefined
      )
    } else if (error) {
      console.error('❌ Analysis failed with error:', error)
      notifications.error('Analysis failed', error)
      trackEvent('analysis_failed', { error, mode: 'single' })
    }
  }

  const handleMultiImageSelected = async (images: CapturedImage[], consensusMode: ConsensusMode = 'auto') => {
    console.log('🔥 handleMultiImageSelected CALLED in PremiumHome', {
      imageCount: images.length,
      roles: images.map(img => img.role),
      consensusMode
    })

    setAnalysisMode('multi')
    trackEvent('multi_image_upload_started', {
      imageCount: images.length,
      roles: images.map(img => img.role),
      consensusMode
    })
    setShowResult(false)
    setCurrentAnalysis(null)

    console.log('🚀 Calling analyzeMultiImage with consensusMode:', consensusMode)
    const analysis = await analyzeMultiImage(images, undefined, consensusMode)
    console.log('📊 analyzeMultiImage returned:', { hasAnalysis: !!analysis, error })

    if (analysis) {
      console.log('✅ Multi-image analysis successful, setting state')
      setCurrentAnalysis(analysis)
      setShowResult(true)
      trackEvent('analysis_completed', {
        itemName: analysis.name,
        confidence: analysis.confidence,
        hasValue: !!(analysis.estimatedValueMin || analysis.estimatedValueMax),
        mode: 'multi',
        imageCount: images.length
      })

      // Send premium notification with world-class badge
      notifications.premium(
        `World-Class Analysis: ${analysis.name}`,
        `Analyzed ${images.length} photos for expert-level identification`
      )
    } else if (error) {
      console.error('❌ Multi-image analysis failed with error:', error)
      notifications.error('Analysis failed', error)
      trackEvent('analysis_failed', { error, mode: 'multi' })
    }
  }

  const handleSaveToCollection = async (notes?: string, location?: string) => {
    if (!currentAnalysis || !user) return false

    trackEvent('collection_save_attempt')
    const success = await saveToCollection(currentAnalysis.id, notes, location)

    if (success) {
      notifications.success('Item saved to your collection!')
      trackEvent('collection_save_success')
    } else {
      notifications.error('Failed to save item to collection')
      trackEvent('collection_save_failed')
    }

    return success
  }

  const handleSubmitFeedback = async (isCorrect: boolean, correctionText?: string, feedbackType?: string) => {
    if (!currentAnalysis || !user) return

    trackEvent('feedback_submitted', { isCorrect, feedbackType })
    const success = await submitFeedback(currentAnalysis.id, isCorrect, correctionText, feedbackType)

    if (success) {
      notifications.success('Thank you for your feedback!')
    } else {
      notifications.error('Failed to submit feedback')
    }
  }

  const resetToHome = () => {
    setShowResult(false)
    setCurrentAnalysis(null)
    setAnalysisMode('single')
    trackEvent('reset_to_home')
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <FloatingParticles
          count={80}
          className="opacity-20"
          colors={['#f59e0b', '#f97316', '#ef4444', '#8b5cf6', '#06b6d4']}
        />
      </div>

      <PremiumHeader onReset={resetToHome} />

      {/* Main Content */}
      {/* Main Content - pb-28 on mobile to account for fixed bottom nav */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-8">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                    Turn your phone into an{' '}
                    <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                      antique expert
                    </span>
                  </h1>

                  <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    Instantly identify vintage and antique items, learn their fascinating histories,
                    discover their market value, and get expert styling tips with the power of AI.
                  </p>
                </motion.div>

                {/* Upload Section with Multi-Image Support */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <SimpleImageUploader
                    onImageSelected={handleImageSelected}
                    onMultiImageSelected={handleMultiImageSelected}
                    disabled={analyzing}
                    enableMultiImage={true}
                  />
                </motion.div>

                {/* Analyzing State */}
                {analyzing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <AdvancedLoadingSpinner
                      variant="glass"
                      size="xl"
                      text={analysisMode === 'multi'
                        ? "Performing world-class analysis on multiple photos for expert-level identification..."
                        : "Our AI is examining your treasure, researching its history, and generating expert styling tips..."
                      }
                    />
                    {analysisMode === 'multi' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 flex items-center justify-center gap-2 text-amber-600"
                      >
                        <Layers className="w-5 h-5" />
                        <span className="font-medium">Multi-Photo Analysis</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Error State */}
                {error && !analyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <GlassCard className="p-6 max-w-md mx-auto border-red-200/50" gradient="rose">
                      <div className="flex items-center gap-3 text-red-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <p className="font-medium">{error}</p>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {/* Features Grid */}
                {!analyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="grid md:grid-cols-3 gap-8 mt-20"
                  >
                    {[
                      {
                        icon: Search,
                        title: 'Instant AI Identification',
                        description: 'Advanced computer vision recognizes vintage items with expert-level accuracy',
                        gradient: 'from-blue-500 to-cyan-500'
                      },
                      {
                        icon: BookOpen,
                        title: 'Rich Stories & Styling',
                        description: 'Learn fascinating histories and get personalized styling tips for your space',
                        gradient: 'from-purple-500 to-pink-500'
                      },
                      {
                        icon: Heart,
                        title: 'Build & Discover',
                        description: 'Save discoveries to your collection and find similar items to purchase',
                        gradient: 'from-emerald-500 to-teal-500'
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <SpotlightEffect>
                          <GlassCard className="p-8 text-center h-full" hover gradient="default">
                            <motion.div
                              className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                              <feature.icon className="w-8 h-8 text-white" />
                            </motion.div>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                          </GlassCard>
                        </SpotlightEffect>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* User Status */}
                {!user && !analyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <GlassCard className="p-6 max-w-2xl mx-auto" gradient="cool">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-blue-900 mb-1">Unlock the Full Experience</h4>
                          <p className="text-blue-700 text-sm">
                            Sign in to save items to your personal collection, set style preferences,
                            and get personalized recommendations!
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Back Button */}
              <div className="text-center">
                <motion.button
                  onClick={resetToHome}
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-amber-50"
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Analyze Another Item
                </motion.button>
              </div>

              {/* Analysis Result */}
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



      <PremiumFooter />
    </div>
  )
}
