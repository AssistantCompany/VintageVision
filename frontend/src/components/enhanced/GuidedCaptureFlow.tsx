// GuidedCaptureFlow - Multi-Image Capture with Guidance
// VintageVision v2.0 - World-Class Analysis

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  Check,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Info,
  X,
  Plus,
  Eye,
} from 'lucide-react';
import {
  CapturedImage,
  ImageRole,
  getImageRoleLabel,
} from '../../types';

// ============================================================================
// TYPES
// ============================================================================

interface GuidedCaptureFlowProps {
  onComplete: (images: CapturedImage[]) => void;
  onCancel: () => void;
  itemType?: string; // If known from previous analysis
}

interface CaptureStep {
  role: ImageRole;
  label: string;
  instruction: string;
  priority: 'required' | 'recommended' | 'optional';
  tip?: string;
  example?: string;
}

// ============================================================================
// DEFAULT CAPTURE STEPS
// ============================================================================

const DEFAULT_CAPTURE_STEPS: CaptureStep[] = [
  {
    role: 'overview',
    label: 'Full Item',
    instruction: 'Capture the complete item from the front. Make sure the entire piece is visible and well-lit.',
    priority: 'required',
    tip: 'Natural daylight works best. Avoid harsh shadows.',
  },
  {
    role: 'marks',
    label: "Maker's Marks",
    instruction: "Look for any labels, stamps, signatures, or maker's marks. Check the bottom, back, or inside.",
    priority: 'recommended',
    tip: "Maker's marks are often on the underside, inside drawers, or on the back.",
  },
  {
    role: 'detail',
    label: 'Key Details',
    instruction: 'Capture any distinctive features, decorative elements, or unique characteristics.',
    priority: 'recommended',
    tip: 'Focus on what makes this item special or different.',
  },
  {
    role: 'underside',
    label: 'Underside/Back',
    instruction: 'Show the bottom or back of the item. This reveals construction details and age indicators.',
    priority: 'recommended',
    tip: 'This often shows the most authentic evidence of age and craftsmanship.',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function GuidedCaptureFlow({
  onComplete,
  onCancel,
  itemType: _itemType,
}: GuidedCaptureFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showQuickMode, setShowQuickMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const steps = DEFAULT_CAPTURE_STEPS;
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const hasRequiredImages = capturedImages.some(img => img.role === 'overview');

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      setIsCapturing(false);
      // Fall back to file input
      fileInputRef.current?.click();
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  // Capture from camera
  const captureFromCamera = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPreviewImage(dataUrl);
    stopCamera();
  }, [stopCamera]);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress and convert to data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1920;
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height / width) * maxDim;
            width = maxDim;
          } else {
            width = (width / height) * maxDim;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPreviewImage(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  }, []);

  // Confirm captured image
  const confirmImage = useCallback(() => {
    if (!previewImage || !currentStepData) return;

    const newImage: CapturedImage = {
      id: `${currentStepData.role}-${Date.now()}`,
      dataUrl: previewImage,
      role: currentStepData.role,
      label: currentStepData.label,
      instruction: currentStepData.instruction,
      capturedAt: new Date().toISOString(),
    };

    setCapturedImages(prev => [...prev, newImage]);
    setPreviewImage(null);

    // Move to next step or complete
    if (isLastStep) {
      // Show completion
    } else {
      setCurrentStep(prev => prev + 1);
    }
  }, [previewImage, currentStepData, isLastStep]);

  // Retake current image
  const retakeImage = useCallback(() => {
    setPreviewImage(null);
  }, []);

  // Skip current step
  const skipStep = useCallback(() => {
    if (isLastStep) return;
    setCurrentStep(prev => prev + 1);
  }, [isLastStep]);

  // Complete capture flow
  const handleComplete = useCallback(() => {
    stopCamera();
    onComplete(capturedImages);
  }, [capturedImages, onComplete, stopCamera]);

  // Quick mode - single image
  const handleQuickAnalysis = useCallback(() => {
    if (capturedImages.length > 0) {
      onComplete(capturedImages);
    } else {
      fileInputRef.current?.click();
    }
  }, [capturedImages, onComplete]);

  // Remove a captured image
  const removeImage = useCallback((id: string) => {
    setCapturedImages(prev => prev.filter(img => img.id !== id));
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-amber-50 to-stone-100 z-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-amber-200">
        <button
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-amber-100 transition-colors"
        >
          <X className="w-6 h-6 text-amber-800" />
        </button>

        <div className="text-center">
          <h1 className="text-lg font-serif text-amber-900">Capture Your Item</h1>
          <p className="text-xs text-amber-600">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <button
          onClick={() => setShowQuickMode(!showQuickMode)}
          className="p-2 rounded-full hover:bg-amber-100 transition-colors"
        >
          <Sparkles className="w-6 h-6 text-amber-600" />
        </button>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-amber-100">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Camera/Preview area */}
        <div className="flex-1 relative bg-black">
          <AnimatePresence mode="wait">
            {isCapturing ? (
              // Live camera feed
              <motion.div
                key="camera"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={captureFromCamera}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white border-4 border-amber-400 shadow-xl flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-amber-500" />
                </button>
              </motion.div>
            ) : previewImage ? (
              // Image preview
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 flex items-center justify-center p-4"
              >
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                />
              </motion.div>
            ) : (
              // Capture prompt
              <motion.div
                key="prompt"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white"
              >
                <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center mb-6">
                  <Camera className="w-12 h-12 text-amber-400" />
                </div>

                <h2 className="text-2xl font-serif mb-2 text-center">
                  {currentStepData?.label}
                </h2>

                <p className="text-amber-200 text-center max-w-md mb-6">
                  {currentStepData?.instruction}
                </p>

                {currentStepData?.tip && (
                  <div className="flex items-start gap-2 text-sm text-amber-300/80 max-w-sm">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>{currentStepData.tip}</p>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-medium shadow-lg hover:bg-amber-600 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Take Photo
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    Upload
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Captured images strip */}
        {capturedImages.length > 0 && (
          <div className="bg-stone-900 p-3">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {capturedImages.map((img) => (
                <div
                  key={img.id}
                  className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden group"
                >
                  <img
                    src={img.dataUrl}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-1 bg-red-500 rounded-full"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-0.5 truncate">
                    {getImageRoleLabel(img.role)}
                  </span>
                </div>
              ))}

              {/* Add more button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-stone-600 flex items-center justify-center text-stone-500 hover:text-stone-300 hover:border-stone-400 transition-colors"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="p-4 bg-white border-t border-amber-200">
          {previewImage ? (
            // Preview actions
            <div className="flex gap-3">
              <button
                onClick={retakeImage}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-amber-300 text-amber-700 font-medium"
              >
                <RotateCcw className="w-5 h-5" />
                Retake
              </button>
              <button
                onClick={confirmImage}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-white font-medium"
              >
                <Check className="w-5 h-5" />
                Use Photo
              </button>
            </div>
          ) : (
            // Navigation actions
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-4 py-3 rounded-xl border-2 border-amber-300 text-amber-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {currentStepData?.priority !== 'required' && (
                <button
                  onClick={skipStep}
                  className="flex-1 py-3 rounded-xl border-2 border-amber-200 text-amber-600 font-medium"
                >
                  Skip This
                </button>
              )}

              {hasRequiredImages && (
                <button
                  onClick={handleComplete}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  Analyze {capturedImages.length} Photo{capturedImages.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick mode modal */}
      <AnimatePresence>
        {showQuickMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-end justify-center z-50"
            onClick={() => setShowQuickMode(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white rounded-t-3xl p-6 w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mb-4" />

              <h3 className="text-xl font-serif text-amber-900 mb-2">
                Quick Analysis
              </h3>
              <p className="text-stone-600 mb-4">
                Skip the guided flow and analyze with just one photo. Best for quick identification.
              </p>

              <button
                onClick={handleQuickAnalysis}
                className="w-full py-3 rounded-xl bg-amber-500 text-white font-medium"
              >
                {capturedImages.length > 0
                  ? `Analyze Now (${capturedImages.length} photo${capturedImages.length !== 1 ? 's' : ''})`
                  : 'Upload Single Photo'}
              </button>

              <p className="text-xs text-stone-500 text-center mt-3">
                Multiple photos provide more accurate results
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

export default GuidedCaptureFlow;
