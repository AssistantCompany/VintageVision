import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, RotateCcw, Zap } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import LiquidButton from '@/components/ui/LiquidButton'
import { compressImage } from '@/lib/utils'

interface SimpleImageUploaderProps {
  onImageSelected: (dataUrl: string) => void
  disabled?: boolean
}

export default function SimpleImageUploader({ onImageSelected, disabled }: SimpleImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }

    console.log('📸 File selected:', file.name, file.size, file.type)
    setCompressing(true)

    try {
      // Compress image before creating data URL
      console.log('🗜️ Compressing image...')
      const compressedBlob = await compressImage(file, 1920, 1080, 0.85)
      console.log('✅ Compression complete:', {
        originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
        compressedSize: (compressedBlob.size / 1024 / 1024).toFixed(2) + 'MB',
        reduction: (((file.size - compressedBlob.size) / file.size) * 100).toFixed(1) + '%'
      })

      // Convert compressed blob to data URL
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        console.log('📊 Data URL created, length:', dataUrl.length)
        setSelectedImage(dataUrl)
        setShowPreview(true)
        setCompressing(false)
      }
      reader.onerror = () => {
        console.error('Failed to read compressed image')
        alert('Failed to read compressed image')
        setCompressing(false)
      }
      reader.readAsDataURL(compressedBlob)
    } catch (error) {
      console.error('❌ Compression failed:', error)
      // Fallback to original file if compression fails
      console.log('⚠️ Using original file without compression')
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        console.log('Data URL created (uncompressed), length:', dataUrl.length)
        setSelectedImage(dataUrl)
        setShowPreview(true)
        setCompressing(false)
      }
      reader.onerror = () => {
        console.error('Failed to read file')
        alert('Failed to read file')
        setCompressing(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraClick = () => {
    console.log('Camera button clicked')
    fileInputRef.current?.click()
  }

  const handleConfirm = () => {
    console.log('Confirm clicked, image length:', selectedImage?.length)
    if (selectedImage) {
      onImageSelected(selectedImage)
      setSelectedImage(null)
      setShowPreview(false)
    }
  }

  const handleRetake = () => {
    console.log('Retake clicked')
    setSelectedImage(null)
    setShowPreview(false)
  }

  if (compressing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto"
      >
        <GlassCard className="p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-medium text-gray-700">Optimizing image...</p>
            <p className="text-sm text-gray-500">Compressing for faster upload</p>
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
        <GlassCard className="p-8">
          <h3 className="text-2xl font-bold text-center mb-6">Ready to analyze?</h3>
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-96 mx-auto rounded-xl shadow-lg mb-6"
          />
          <div className="flex gap-4 justify-center">
            <MagneticButton onClick={handleRetake} variant="secondary">
              <RotateCcw className="w-4 h-4" />
              Retake
            </MagneticButton>
            <LiquidButton onClick={handleConfirm} variant="primary">
              <Zap className="w-4 h-4" />
              Analyze Now
            </LiquidButton>
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
    >
      <GlassCard className="p-12">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
            <Camera className="w-12 h-12 text-white" />
          </div>

          <h3 className="text-3xl font-bold">
            Discover Your Treasure's <span className="text-amber-500">Story</span>
          </h3>

          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Take a photo or upload an image of your vintage item
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <MagneticButton
              onClick={handleCameraClick}
              disabled={disabled}
              variant="primary"
              size="lg"
            >
              <Camera className="w-5 h-5" />
              Camera
            </MagneticButton>

            <MagneticButton
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              variant="glass"
              size="lg"
            >
              <Upload className="w-5 h-5" />
              Browse
            </MagneticButton>
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
