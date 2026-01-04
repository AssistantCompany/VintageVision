import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Upload,
  X,
  RotateCcw,
  Palette,
  Zap,
  Sparkles,
  CheckCircle,
  DollarSign,
  TrendingUp
} from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import LiquidButton from '@/components/ui/LiquidButton'
import SpotlightEffect from '@/components/ui/SpotlightEffect'
import FloatingParticles from '@/components/ui/FloatingParticles'
import { cn, vibrate, trackEvent } from '@/lib/utils'

interface PremiumImageUploaderProps {
  onImageSelected: (dataUrl: string, askingPrice?: number) => void
  disabled?: boolean
  className?: string
  showAskingPrice?: boolean
}

export default function PremiumImageUploader({
  onImageSelected,
  disabled,
  className,
  showAskingPrice = true
}: PremiumImageUploaderProps) {
  const { uploading, error, selectFromFile, captureFromCamera } = useImageUpload()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [askingPrice, setAskingPrice] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Simulate upload progress
  useEffect(() => {
    if (uploading) {
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return prev
          }
          return prev + Math.random() * 15
        })
      }, 200)
      return () => clearInterval(interval)
    } else {
      setUploadProgress(0)
    }
  }, [uploading])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      vibrate(50) // Haptic feedback
      trackEvent('image_dropped', { fileType: imageFile.type })
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setSelectedImage(dataUrl)
        setShowPreview(true)
      }
      reader.readAsDataURL(imageFile)
    }
  }, [disabled])

  const handleFileSelect = async () => {
    if (disabled) return
    
    trackEvent('file_select_clicked')
    const result = await selectFromFile()
    
    if (result) {
      vibrate(50)
      setSelectedImage(result.dataUrl)
      setShowPreview(true)
    }
  }

  const handleCameraCapture = async () => {
    if (disabled) return

    console.log('📸 Camera capture clicked')
    trackEvent('camera_capture_clicked')
    const result = await captureFromCamera()

    console.log('📸 Camera capture result:', {
      hasResult: !!result,
      hasDataUrl: !!result?.dataUrl,
      dataUrlLength: result?.dataUrl?.length || 0
    })

    if (result) {
      vibrate(100)
      console.log('✅ Setting selectedImage and showPreview=true')
      setSelectedImage(result.dataUrl)
      setShowPreview(true)
    } else {
      console.error('❌ No result from camera capture')
    }
  }

  const confirmImage = () => {
    console.log('🔘 Confirm button clicked', {
      hasSelectedImage: !!selectedImage,
      imageLength: selectedImage?.length || 0,
      askingPrice: askingPrice || 'not provided'
    })

    if (selectedImage) {
      trackEvent('image_confirmed', { hasAskingPrice: !!askingPrice })
      vibrate([50, 50, 100])

      // Parse asking price - convert dollars to cents for API
      const priceInCents = askingPrice ? Math.round(parseFloat(askingPrice) * 100) : undefined

      console.log('🚀 Calling onImageSelected callback with dataUrl length:', selectedImage.length, 'askingPrice:', priceInCents)
      onImageSelected(selectedImage, priceInCents)
      setShowPreview(false)
      setSelectedImage(null)
      setAskingPrice('')
      console.log('✅ Callback sent, state reset')
    } else {
      console.error('❌ No selected image to confirm!')
    }
  }

  const retakeImage = () => {
    trackEvent('image_retake')
    setSelectedImage(null)
    setShowPreview(false)
    setAskingPrice('')
  }

  

  console.log('🎨 PremiumImageUploader render:', { showPreview, hasSelectedImage: !!selectedImage, selectedImageLength: selectedImage?.length || 0 })

  return (
    <div className={cn('w-full max-w-3xl mx-auto', className)}>
      <AnimatePresence mode="wait">
        {!showPreview ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <SpotlightEffect className="w-full">
              <GlassCard 
                className={cn(
                  'relative overflow-hidden transition-all duration-500',
                  dragActive && 'scale-105 border-amber-400/50 bg-amber-50/30'
                )}
                gradient="warm"
                hover={!uploading}
              >
                <FloatingParticles 
                  count={20} 
                  className="opacity-30"
                  colors={['#f59e0b', '#f97316', '#ef4444']}
                />
                
                {/* Drag & Drop Area */}
                <motion.div
                  ref={dropZoneRef}
                  className="relative p-12 border-2 border-dashed border-amber-200/50 rounded-2xl transition-all duration-300"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  whileHover={{ scale: 1.01 }}
                  style={{
                    borderColor: dragActive ? '#f59e0b' : undefined,
                    backgroundColor: dragActive ? 'rgba(245, 158, 11, 0.05)' : undefined
                  }}
                >
                  <div className="text-center space-y-8">
                    {/* Animated Icon */}
                    <motion.div
                      className="relative w-24 h-24 mx-auto"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl"
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: dragActive ? [1, 1.1, 1] : 1
                        }}
                        transition={{ 
                          rotate: { duration: 6, repeat: Infinity },
                          scale: { duration: 0.3 }
                        }}
                      />
                      
                      <motion.div
                        className="absolute inset-2 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center"
                        animate={{ 
                          scale: dragActive ? [1, 0.9, 1] : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Camera className="w-12 h-12 text-white drop-shadow-lg" />
                      </motion.div>
                      
                      {/* Floating sparkles */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                          style={{
                            top: `${20 + i * 15}%`,
                            right: `${10 + i * 5}%`,
                          }}
                          animate={{
                            y: [-5, -15, -5],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5
                          }}
                        />
                      ))}
                    </motion.div>

                    {/* Title */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <h3 className="text-3xl font-bold text-gray-900">
                        Discover Your Treasure's{' '}
                        <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                          Story
                        </span>
                      </h3>
                      
                      <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                        {dragActive 
                          ? "Drop your image here to begin the magic ✨" 
                          : "Drag & drop an image or choose how to capture your vintage treasure"
                        }
                      </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <MagneticButton
                        onClick={handleCameraCapture}
                        disabled={disabled || uploading}
                        variant="primary"
                        size="lg"
                        className="group"
                      >
                        <Camera className="w-5 h-5" />
                        <span>Camera</span>
                        <motion.div
                          className="absolute inset-0 bg-white/20 rounded-xl"
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </MagneticButton>

                      <MagneticButton
                        onClick={handleFileSelect}
                        disabled={disabled || uploading}
                        variant="glass"
                        size="lg"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Browse</span>
                      </MagneticButton>
                    </motion.div>

                    {/* Feature Pills */}
                    <motion.div
                      className="flex flex-wrap justify-center gap-3 pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {[
                        { icon: Zap, text: 'Instant AI', color: 'from-yellow-400 to-orange-500' },
                        { icon: Palette, text: 'Style Tips', color: 'from-purple-400 to-pink-500' },
                        { icon: Sparkles, text: 'Premium', color: 'from-emerald-400 to-teal-500' }
                      ].map((feature, i) => (
                        <motion.div
                          key={feature.text}
                          className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white',
                            `bg-gradient-to-r ${feature.color}`
                          )}
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                        >
                          <feature.icon className="w-4 h-4" />
                          <span>{feature.text}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          const dataUrl = event.target?.result as string
                          setSelectedImage(dataUrl)
                          setShowPreview(true)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="hidden"
                  />
                </motion.div>

                {/* Loading Overlay */}
                <AnimatePresence>
                  {uploading && (
                    <motion.div
                      className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="text-center space-y-4">
                        <motion.div
                          className="relative w-16 h-16 mx-auto"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <div className="absolute inset-0 border-4 border-amber-200 rounded-full" />
                          <motion.div
                            className="absolute inset-0 border-4 border-transparent border-t-amber-500 border-r-orange-500 rounded-full"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        </motion.div>
                        
                        <div className="space-y-2">
                          <p className="text-amber-700 font-semibold">Analyzing your treasure...</p>
                          <div className="w-48 h-2 bg-amber-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <p className="text-sm text-amber-600">
                            {uploadProgress < 30 && "Processing image..."}
                            {uploadProgress >= 30 && uploadProgress < 60 && "AI analyzing features..."}
                            {uploadProgress >= 60 && uploadProgress < 90 && "Researching history..."}
                            {uploadProgress >= 90 && "Almost done..."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </SpotlightEffect>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <GlassCard className="p-4 border-red-200/50" gradient="rose">
                    <div className="flex items-center gap-3">
                      <X className="w-5 h-5 text-red-600" />
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Format Support */}
            <motion.div
              className="text-center mt-6 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p>✨ Supports JPG, PNG, WebP • Max 10MB • Best results with good lighting</p>
            </motion.div>
          </motion.div>
        ) : (
          /* Image Preview */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <GlassCard className="p-8" gradient="warm">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Perfect! Ready to analyze?</h3>
                </div>
                
                <motion.div
                  className="relative inline-block rounded-2xl overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <img
                    src={selectedImage || ''}
                    alt="Preview"
                    className="max-w-full max-h-80 object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </motion.div>

                {/* Asking Price Input - Deal Analysis Feature */}
                {showAskingPrice && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-sm mx-auto"
                  >
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-800 text-sm">Deal Analysis</p>
                          <p className="text-xs text-gray-500">Optional: Get profit potential</p>
                        </div>
                      </div>

                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                        <input
                          type="number"
                          value={askingPrice}
                          onChange={(e) => setAskingPrice(e.target.value)}
                          placeholder="Asking price"
                          min="0"
                          step="0.01"
                          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-2 border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 text-lg font-semibold text-gray-800 placeholder:text-gray-400 placeholder:font-normal transition-all"
                        />
                      </div>

                      <p className="text-xs text-green-600 mt-2 text-center">
                        {askingPrice
                          ? `We'll compare $${parseFloat(askingPrice).toFixed(2)} to market value`
                          : 'Enter the seller\'s asking price for deal rating'
                        }
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <MagneticButton
                    onClick={retakeImage}
                    variant="secondary"
                    size="md"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake</span>
                  </MagneticButton>
                  
                  <LiquidButton
                    onClick={confirmImage}
                    variant="primary"
                    size="md"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Analyze Now</span>
                  </LiquidButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
