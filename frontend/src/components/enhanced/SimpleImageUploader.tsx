import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, RotateCcw, Zap, Layers, Sparkles, Shield, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { compressImage } from '@/lib/utils'
import { GuidedCaptureFlow } from './GuidedCaptureFlow'
import { CapturedImage } from '@/types'

export type ConsensusMode = 'auto' | 'always' | 'never'

interface SimpleImageUploaderProps {
  onImageSelected: (dataUrl: string, consensusMode?: ConsensusMode) => void
  onMultiImageSelected?: (images: CapturedImage[], consensusMode?: ConsensusMode) => void
  disabled?: boolean
  enableMultiImage?: boolean
}

export default function SimpleImageUploader({
  onImageSelected,
  onMultiImageSelected,
  disabled,
  enableMultiImage = true
}: SimpleImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [showGuidedCapture, setShowGuidedCapture] = useState(false)
  const [highConfidenceMode, setHighConfidenceMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCompressing(true)

    try {
      const compressedBlob = await compressImage(file, 1920, 1080, 0.85)

      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setSelectedImage(dataUrl)
        setShowPreview(true)
        setCompressing(false)
      }
      reader.onerror = () => {
        alert('Failed to read compressed image')
        setCompressing(false)
      }
      reader.readAsDataURL(compressedBlob)
    } catch {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setSelectedImage(dataUrl)
        setShowPreview(true)
        setCompressing(false)
      }
      reader.onerror = () => {
        alert('Failed to read file')
        setCompressing(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const handleConfirm = () => {
    if (selectedImage) {
      const consensusMode: ConsensusMode = highConfidenceMode ? 'always' : 'auto'
      onImageSelected(selectedImage, consensusMode)
      setSelectedImage(null)
      setShowPreview(false)
      setHighConfidenceMode(false)
    }
  }

  const handleRetake = () => {
    setSelectedImage(null)
    setShowPreview(false)
  }

  const handleGuidedCaptureComplete = (images: CapturedImage[]) => {
    setShowGuidedCapture(false)
    const consensusMode: ConsensusMode = highConfidenceMode ? 'always' : 'auto'

    if (onMultiImageSelected) {
      onMultiImageSelected(images, consensusMode)
    } else if (images.length > 0) {
      const overviewImage = images.find(img => img.role === 'overview') || images[0]
      onImageSelected(overviewImage.dataUrl, consensusMode)
    }
    setHighConfidenceMode(false)
  }

  // Show guided capture flow
  if (showGuidedCapture) {
    return (
      <GuidedCaptureFlow
        onComplete={handleGuidedCaptureComplete}
        onCancel={() => setShowGuidedCapture(false)}
      />
    )
  }

  if (compressing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto"
      >
        <GlassCard variant="brass" className="p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-medium text-foreground">Optimizing image...</p>
            <p className="text-sm text-muted-foreground">Compressing for faster upload</p>
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  if (showPreview && selectedImage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto"
      >
        <GlassCard variant="brass" className="p-4 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-display font-bold text-center mb-4 sm:mb-6 text-foreground">
            Ready to analyze?
          </h3>
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-64 sm:max-h-96 mx-auto rounded-xl shadow-lg mb-4 sm:mb-6 border border-border"
          />

          {/* High Confidence Mode Toggle */}
          <div className="mb-6 max-w-md mx-auto">
            <button
              onClick={() => setHighConfidenceMode(!highConfidenceMode)}
              className={`w-full p-3 rounded-xl border-2 transition-all ${
                highConfidenceMode
                  ? 'bg-primary/20 border-primary shadow-md'
                  : 'bg-card border-border hover:border-muted-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  highConfidenceMode ? 'bg-primary' : 'bg-muted'
                }`}>
                  {highConfidenceMode ? (
                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Shield className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-foreground">High Confidence Mode</div>
                  <p className="text-xs text-muted-foreground">
                    {highConfidenceMode
                      ? 'Multiple AI passes will verify the analysis'
                      : 'Enable for valuable or uncertain items'}
                  </p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  highConfidenceMode ? 'bg-primary' : 'bg-muted'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-foreground shadow-md transform transition-transform mt-0.5 ${
                    highConfidenceMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button onClick={handleRetake} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake
            </Button>
            <Button onClick={handleConfirm} variant="brass" size="lg">
              <Zap className="w-4 h-4 mr-2" />
              {highConfidenceMode ? 'Analyze (High Confidence)' : 'Analyze Now'}
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
      data-testid="simple-uploader"
    >
      <GlassCard variant="brass" className="p-6 sm:p-12">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-primary via-brass-light to-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-primary-foreground" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Discover Your Treasure's <span className="text-primary">Story</span>
          </h3>

          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
            Take a photo or upload an image of your vintage item
          </p>

          {/* Multi-image option - World Class Analysis */}
          {enableMultiImage && onMultiImageSelected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <button
                onClick={() => setShowGuidedCapture(true)}
                disabled={disabled}
                className="w-full max-w-md mx-auto p-4 bg-primary/10 border-2 border-primary/40 rounded-2xl hover:border-primary hover:bg-primary/20 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-brass-light rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">World-Class Analysis</span>
                      <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">Recommended</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Guided multi-photo capture for expert-level identification
                    </p>
                  </div>
                  <Layers className="w-5 h-5 text-primary" />
                </div>
              </button>
            </motion.div>
          )}

          <div className="relative">
            {enableMultiImage && onMultiImageSelected && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">or quick single photo</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <Button
                onClick={handleCameraClick}
                disabled={disabled}
                variant="brass"
                size="lg"
                className="w-full"
              >
                <Camera className="w-5 h-5 mr-2" />
                Camera
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Upload className="w-5 h-5 mr-2" />
                Browse
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </GlassCard>
    </motion.div>
  )
}
