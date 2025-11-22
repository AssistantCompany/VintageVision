import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Share2, 
  Download, 
  Clock, 
  DollarSign,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Palette,
  Eye,
  Maximize2,
  X,
  MapPin,
  StickyNote
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import LiquidButton from '@/components/ui/LiquidButton'
import SpotlightEffect from '@/components/ui/SpotlightEffect'
import FloatingParticles from '@/components/ui/FloatingParticles'
import { useNotifications } from '@/components/enhanced/NotificationSystem'
import { ItemAnalysis } from '@/types'
import { cn, formatCurrency, shareContent, copyToClipboard, trackEvent, vibrate } from '@/lib/utils'

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
  const [showFullImage, setShowFullImage] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [saveNotes, setSaveNotes] = useState('')
  const [saveLocation, setSaveLocation] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [selectedFeedbackType, setSelectedFeedbackType] = useState<string>('')

  useEffect(() => {
    // Track result view
    trackEvent('analysis_result_viewed', {
      itemName: analysis.name,
      confidence: analysis.confidence,
      hasValue: !!(analysis.estimatedValueMin || analysis.estimatedValueMax)
    })
  }, [analysis])

  const handleShare = async () => {
    trackEvent('analysis_shared', { itemName: analysis.name })
    
    const shareData = {
      title: `Check out this ${analysis.name}!`,
      text: `I discovered this ${analysis.name} ${analysis.era ? `from the ${analysis.era}` : ''}${analysis.estimatedValueMin ? ` worth $${analysis.estimatedValueMin.toLocaleString()}+` : ''} using VintageVision AI!`,
      url: window.location.href
    }

    try {
      await shareContent(shareData)
      notifications.success('Shared successfully!')
    } catch (error) {
      await copyToClipboard(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
      notifications.success('Copied to clipboard!')
    }
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

  const confidenceColor = analysis.confidence >= 0.8 
    ? 'text-green-600' 
    : analysis.confidence >= 0.6 
      ? 'text-amber-600' 
      : 'text-red-600'

  const confidenceBackground = analysis.confidence >= 0.8 
    ? 'bg-green-100' 
    : analysis.confidence >= 0.6 
      ? 'bg-amber-100' 
      : 'bg-red-100'

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <SpotlightEffect className="w-full">
          <GlassCard className="overflow-hidden" gradient="warm" blur="xl">
            <FloatingParticles 
              count={30} 
              className="opacity-20"
              colors={['#f59e0b', '#f97316', '#ef4444', '#8b5cf6']}
            />
            
            <div className="relative p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Image Section */}
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={analysis.imageUrl}
                      alt={analysis.name}
                      className="w-full h-auto object-cover cursor-pointer"
                      onClick={() => setShowFullImage(true)}
                      style={{ aspectRatio: '4/3' }}
                    />
                    
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Expand Button */}
                    <motion.button
                      onClick={() => setShowFullImage(true)}
                      className="absolute top-4 right-4 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Maximize2 className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Confidence Badge */}
                  <motion.div
                    className={cn(
                      'absolute -top-2 -right-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg',
                      confidenceBackground,
                      confidenceColor
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {Math.round(analysis.confidence * 100)}% Match
                  </motion.div>
                </motion.div>

                {/* Content Section */}
                <div className="space-y-6">
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                      {analysis.name}
                    </h1>
                    
                    <div className="flex flex-wrap gap-3">
                      {analysis.era && (
                        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {analysis.era}
                        </span>
                      )}
                      
                      {analysis.style && (
                        <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center gap-2">
                          <Palette className="w-4 h-4" />
                          {analysis.style}
                        </span>
                      )}

                      {(analysis.estimatedValueMin || analysis.estimatedValueMax) && (
                        <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          {analysis.estimatedValueMin && analysis.estimatedValueMax
                            ? `${formatCurrency(analysis.estimatedValueMin)} - ${formatCurrency(analysis.estimatedValueMax)}`
                            : analysis.estimatedValueMin
                              ? `${formatCurrency(analysis.estimatedValueMin)}+`
                              : `Up to ${formatCurrency(analysis.estimatedValueMax!)}`
                          }
                        </span>
                      )}
                    </div>
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {analysis.description}
                    </p>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    className="flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <LiquidButton
                      onClick={() => setShowSaveDialog(true)}
                      variant="primary"
                      size="md"
                    >
                      <Heart className="w-5 h-5" />
                      <span>Save to Collection</span>
                    </LiquidButton>

                    <MagneticButton
                      onClick={handleShare}
                      variant="glass"
                      size="md"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </MagneticButton>

                    <MagneticButton
                      onClick={() => {
                        // Download functionality
                        const link = document.createElement('a')
                        link.href = analysis.imageUrl
                        link.download = `${analysis.name}.jpg`
                        link.click()
                        trackEvent('analysis_downloaded', { itemName: analysis.name })
                      }}
                      variant="ghost"
                      size="md"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download</span>
                    </MagneticButton>
                  </motion.div>

                  {/* Feedback Section */}
                  {user && (
                    <motion.div
                      className="border-t border-gray-200/50 pt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <p className="text-sm text-gray-600 mb-4">
                        Is this identification accurate?
                      </p>
                      
                      <div className="flex gap-3">
                        <MagneticButton
                          onClick={() => handleFeedback(true)}
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:bg-green-50"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>Yes</span>
                        </MagneticButton>
                        
                        <MagneticButton
                          onClick={() => handleFeedback(false)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>No</span>
                        </MagneticButton>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </SpotlightEffect>
      </motion.div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Historical Context */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SpotlightEffect>
            <GlassCard className="p-8 h-full" gradient="cool">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Historical Context</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {analysis.historicalContext}
                  </p>
                </div>
              </div>
            </GlassCard>
          </SpotlightEffect>
        </motion.div>

        {/* Styling Suggestions */}
        {analysis.stylingSuggestions && analysis.stylingSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SpotlightEffect>
              <GlassCard className="p-8" gradient="warm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Style It Like a Pro</h3>
                    <p className="text-amber-700 text-sm">Expert styling suggestions for your space</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {analysis.stylingSuggestions.map((suggestion: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="font-bold text-gray-900 text-lg">{suggestion.title}</h4>
                              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                                {suggestion.roomType}
                              </span>
                            </div>

                            <p className="text-gray-700 leading-relaxed mb-4">
                              {suggestion.description}
                            </p>
                            
                            {suggestion.complementaryItems && suggestion.complementaryItems.length > 0 && (
                              <div className="mb-4">
                                <h5 className="font-medium text-gray-800 mb-2 text-sm">Complementary Pieces:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {suggestion.complementaryItems.map((item: string, itemIndex: number) => (
                                    <span
                                      key={itemIndex}
                                      className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {suggestion.colorPalette && suggestion.colorPalette.length > 0 && (
                              <div>
                                <h5 className="font-medium text-gray-800 mb-2 text-sm">Color Palette:</h5>
                                <div className="flex gap-3">
                                  {suggestion.colorPalette.map((color: string, colorIndex: number) => (
                                    <div key={colorIndex} className="flex items-center gap-2">
                                      <div 
                                        className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                                        style={{ backgroundColor: color.toLowerCase() }}
                                      />
                                      <span className="text-xs text-gray-600 font-medium">{color}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  }
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-xs text-amber-600">
                    💡 Save this item to get personalized styling updates and more ideas
                  </p>
                </div>
              </GlassCard>
            </SpotlightEffect>
          </motion.div>
        )}
      </div>

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
    </div>
  )
}
