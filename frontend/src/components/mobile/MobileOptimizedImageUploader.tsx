import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, RotateCcw, CheckCircle, Maximize2 } from 'lucide-react'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { useSwipeGesture, useLongPress, usePinchZoom } from '@/hooks/useGestures'
import { useImageUpload } from '@/hooks/useImageUpload'
import GlassCard from '@/components/ui/GlassCard'
import { cn, vibrate } from '@/lib/utils'

interface MobileOptimizedImageUploaderProps {
  onImageSelected: (dataUrl: string) => void
  disabled?: boolean
  className?: string
}

export default function MobileOptimizedImageUploader({
  onImageSelected,
  disabled,
  className
}: MobileOptimizedImageUploaderProps) {
  const deviceInfo = useMobileDetection()
  const { } = useImageUpload()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)

  // Gesture handlers for mobile interactions
  const swipeGesture = useSwipeGesture({
    onSwipeRight: () => {
      if (showPreview) {
        retakeImage()
      }
    },
    onSwipeLeft: () => {
      if (showPreview && selectedImage) {
        confirmImage()
      }
    },
    enableHaptics: deviceInfo.supportsHaptics,
    hapticIntensity: 'light'
  })

  const longPressGesture = useLongPress(() => {
    if (!showPreview && !cameraActive) {
      handleCameraCapture()
    }
  }, 800)

  const { bind: pinchBind, scale, resetZoom } = usePinchZoom()

  // Enhanced camera capture with mobile optimizations
  const handleCameraCapture = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera not supported on this device. Please use the file upload option instead.')
      return
    }

    try {
      vibrate(50)

      const constraints = {
        video: {
          facingMode: deviceInfo.isMobile ? 'environment' : 'user', // Back camera on mobile
          width: { ideal: deviceInfo.isMobile ? 1920 : 1280 },
          height: { ideal: deviceInfo.isMobile ? 1080 : 720 }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setCameraPermission('granted')
      setCameraActive(true)

      if (cameraRef.current) {
        cameraRef.current.srcObject = stream
        cameraRef.current.play()
      }
    } catch (error: any) {
      console.error('Camera access error:', error)
      setCameraPermission('denied')
      vibrate([100, 50, 100])

      // Show user-friendly error message
      let errorMessage = 'Unable to access camera. ';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += 'Camera permission was denied. Please allow camera access in your browser settings and try again.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage += 'No camera found on this device. Please use the file upload option instead.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage += 'Camera is already in use by another application. Please close other apps using the camera and try again.';
      } else {
        errorMessage += 'Please use the file upload option instead.';
      }

      alert(errorMessage);
    }
  }

  const capturePhoto = () => {
    if (!cameraRef.current || !canvasRef.current) return

    vibrate([50, 50, 100])
    
    const video = cameraRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas size to video dimensions
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0)

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    
    // Stop camera stream
    const stream = video.srcObject as MediaStream
    stream?.getTracks().forEach(track => track.stop())
    
    setCameraActive(false)
    setSelectedImage(dataUrl)
    setShowPreview(true)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    vibrate(50)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setSelectedImage(dataUrl)
      setShowPreview(true)
    }
    reader.readAsDataURL(file)
  }

  const confirmImage = () => {
    if (selectedImage) {
      vibrate([50, 50, 100])
      onImageSelected(selectedImage)
      resetState()
    }
  }

  const retakeImage = () => {
    vibrate(100)
    resetState()
  }

  const resetState = () => {
    setSelectedImage(null)
    setShowPreview(false)
    setCameraActive(false)
    resetZoom()
    setIsFullscreen(false)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    vibrate(50)
  }

  // Handle drag for mobile file upload
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = Array.from(e.dataTransfer.files).find(f => f.type.startsWith('image/'))
    if (file) {
      vibrate(100)
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setSelectedImage(dataUrl)
        setShowPreview(true)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  // Mobile-optimized layout based on device
  const getMobileLayout = () => {
    if (deviceInfo.screenSize === 'xs' || deviceInfo.screenSize === 'sm') {
      return 'mobile-sm'
    }
    if (deviceInfo.isTablet) {
      return 'tablet'
    }
    return 'desktop'
  }

  const layout = getMobileLayout()

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      <AnimatePresence mode="wait">
        {cameraActive ? (
          // Camera View
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'fixed inset-0 z-50 bg-black flex flex-col',
              deviceInfo.hasNotchSupport && 'pt-safe-area-inset-top'
            )}
          >
            <video
              ref={cameraRef}
              autoPlay
              playsInline
              muted
              className="flex-1 object-cover w-full"
            />
            
            {/* Camera Controls */}
            <div className="p-6 bg-black/50 backdrop-blur-sm">
              <div className="flex items-center justify-between max-w-md mx-auto">
                <motion.button
                  onClick={() => {
                    console.log('X button clicked - force closing camera')
                    
                    // Immediately stop camera stream
                    if (cameraRef.current?.srcObject) {
                      const stream = cameraRef.current.srcObject as MediaStream
                      stream.getTracks().forEach(track => track.stop())
                      cameraRef.current.srcObject = null
                    }
                    
                    // Force immediate state reset - no batching
                    setCameraActive(false)
                    console.log('Camera closed, should return to upload interface')
                  }}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>

                <motion.button
                  onClick={capturePhoto}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-600" />
                  </div>
                </motion.button>

                <div className="w-12 h-12" />
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        ) : showPreview && selectedImage ? (
          // Preview Mode
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              isFullscreen ? 'fixed inset-0 z-50' : 'relative',
              isFullscreen && 'bg-black flex flex-col'
            )}
          >
            <GlassCard 
              className={cn(
                'overflow-hidden',
                isFullscreen ? 'flex-1 m-0 rounded-none' : 'p-4'
              )} 
              gradient="warm"
            >
              <div className="text-center space-y-4">
                {!isFullscreen && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Ready to analyze?</h3>
                  </div>
                )}
                
                <div 
                  {...pinchBind}
                  className={cn(
                    'relative overflow-hidden',
                    isFullscreen ? 'flex-1 flex items-center justify-center' : 'max-h-96'
                  )}
                >
                  <motion.img
                    src={selectedImage}
                    alt="Preview"
                    className={cn(
                      'object-contain cursor-pointer',
                      isFullscreen ? 'max-h-full max-w-full' : 'w-full h-auto rounded-xl'
                    )}
                    style={{ scale }}
                    onClick={toggleFullscreen}
                    whileHover={{ scale: isFullscreen ? scale : scale * 1.02 }}
                  />
                  
                  {/* Fullscreen toggle */}
                  {!isFullscreen && (
                    <motion.button
                      onClick={toggleFullscreen}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Maximize2 className="w-4 h-4 text-white" />
                    </motion.button>
                  )}
                </div>

                {/* Mobile gesture hints */}
                {deviceInfo.isMobile && !isFullscreen && (
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>👈 Swipe right to retake • Swipe left to confirm 👉</p>
                    <p>🔍 Tap image to zoom • Pinch to zoom in/out</p>
                  </div>
                )}

                {/* Action buttons */}
                <div 
                  className={cn(
                    'flex gap-3',
                    layout === 'mobile-sm' ? 'flex-col' : 'flex-row justify-center',
                    isFullscreen && 'p-4 bg-black/50'
                  )}
                  {...swipeGesture()}
                >
                  <motion.button
                    onClick={retakeImage}
                    className={cn(
                      'flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors hover:bg-gray-300',
                      layout === 'mobile-sm' && 'w-full'
                    )}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={confirmImage}
                    className={cn(
                      'flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium shadow-lg',
                      layout === 'mobile-sm' && 'w-full'
                    )}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Analyze Now</span>
                  </motion.button>
                </div>
              </div>
            </GlassCard>

            {/* Close fullscreen */}
            {isFullscreen && (
              <motion.button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center z-10"
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            )}
          </motion.div>
        ) : (
          // Upload Interface
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <GlassCard 
              className={cn(
                'overflow-hidden transition-all duration-300',
                dragActive && 'scale-105 border-amber-400/50'
              )}
              gradient="warm"
            >
              <div
                className={cn(
                  'p-8 border-2 border-dashed border-amber-200/50 rounded-2xl transition-colors',
                  dragActive && 'border-amber-400 bg-amber-50/30'
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                {...longPressGesture.bind}
              >
                <div className={cn(
                  'text-center space-y-6',
                  layout === 'mobile-sm' && 'space-y-4'
                )}>
                  {/* Animated Icon */}
                  <motion.div
                    className="relative w-20 h-20 mx-auto"
                    animate={{ 
                      rotate: dragActive ? [0, 5, -5, 0] : 0,
                      scale: dragActive ? 1.1 : 1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl" />
                    <div className="absolute inset-2 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                      <Camera className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <div className="space-y-2">
                    <h3 className={cn(
                      'font-bold text-gray-900',
                      layout === 'mobile-sm' ? 'text-xl' : 'text-2xl'
                    )}>
                      Discover Your Treasure
                    </h3>
                    <p className={cn(
                      'text-gray-600 max-w-sm mx-auto',
                      layout === 'mobile-sm' ? 'text-sm' : 'text-base'
                    )}>
                      {dragActive 
                        ? "Drop your image here! ✨" 
                        : deviceInfo.isMobile
                          ? "Tap camera or browse to upload"
                          : "Drag & drop an image or choose how to capture"
                      }
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className={cn(
                    'grid gap-3 max-w-sm mx-auto',
                    layout === 'mobile-sm' ? 'grid-cols-1' : 'grid-cols-2'
                  )}>
                    {/* Camera Button */}
                    <motion.button
                      onClick={handleCameraCapture}
                      disabled={disabled}
                      data-camera-trigger="true"
                      data-testid="camera-upload-trigger"
                      className={cn(
                        'flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium shadow-lg disabled:opacity-50',
                        layout === 'mobile-sm' && 'w-full text-lg py-5'
                      )}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Camera className={cn(layout === 'mobile-sm' ? 'w-6 h-6' : 'w-5 h-5')} />
                      <span>Camera</span>
                    </motion.button>

                    {/* Browse Button */}
                    <motion.button
                      onClick={() => inputRef.current?.click()}
                      disabled={disabled}
                      data-testid="browse-upload-trigger"
                      className={cn(
                        'flex items-center justify-center gap-2 px-6 py-4 bg-white/50 border border-gray-300/50 text-gray-700 rounded-xl font-medium backdrop-blur-sm hover:bg-white/70',
                        layout === 'mobile-sm' && 'w-full text-lg py-5'
                      )}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Upload className={cn(layout === 'mobile-sm' ? 'w-6 h-6' : 'w-5 h-5')} />
                      <span>Browse</span>
                    </motion.button>
                  </div>

                  {/* Mobile hints */}
                  {deviceInfo.isMobile && (
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>💡 Hold camera button for quick capture</p>
                      <p>📱 Works best with good lighting</p>
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  capture={deviceInfo.isMobile ? "environment" : undefined}
                  data-testid="file-input-upload"
                />
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
