import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, RotateCcw, Crop, Palette, Zap } from 'lucide-react';
import { useImageUpload } from '@/react-app/hooks/useImageUpload';
import Glass from '@/react-app/components/ui/Glass';
import FloatingButton from '@/react-app/components/ui/FloatingButton';
import { MagneticButton, TapScale } from './MicroInteractions';

interface AdvancedImageUploaderProps {
  onImageSelected: (dataUrl: string) => void;
  disabled?: boolean;
}

export default function AdvancedImageUploader({ onImageSelected, disabled }: AdvancedImageUploaderProps) {
  const { uploading, error, selectFromFile, captureFromCamera } = useImageUpload();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setSelectedImage(dataUrl);
        setShowPreview(true);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [disabled]);

  const handleFileSelect = async () => {
    if (disabled) return;
    const result = await selectFromFile();
    if (result) {
      setSelectedImage(result.dataUrl);
      setShowPreview(true);
    }
  };

  const handleCameraCapture = async () => {
    if (disabled) return;
    const result = await captureFromCamera();
    if (result) {
      setSelectedImage(result.dataUrl);
      setShowPreview(true);
    }
  };

  const confirmImage = () => {
    if (selectedImage) {
      onImageSelected(selectedImage);
      setShowPreview(false);
      setSelectedImage(null);
    }
  };

  const retakeImage = () => {
    setSelectedImage(null);
    setShowPreview(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!showPreview ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Glass className="relative overflow-hidden" gradient="vintage" blur="lg">
              {/* Drag & Drop Area */}
              <motion.div
                className={`
                  relative p-12 border-2 border-dashed transition-all duration-300
                  ${dragActive 
                    ? 'border-amber-400 bg-amber-50/50 scale-105' 
                    : 'border-amber-200 hover:border-amber-300'
                  }
                  rounded-xl
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="text-center space-y-6">
                  {/* Animated Icon */}
                  <motion.div
                    className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center relative overflow-hidden"
                    whileHover={{ rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                    <Camera className="w-10 h-10 text-white relative z-10" />
                  </motion.div>

                  <div>
                    <motion.h3
                      className="text-2xl font-bold text-gray-900 mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Discover Your Treasure's Story
                    </motion.h3>
                    
                    <motion.p
                      className="text-gray-600 mb-6 text-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Drag & drop an image or choose how to capture
                    </motion.p>
                  </div>

                  {/* Action Buttons */}
                  <motion.div
                    className="grid grid-cols-2 gap-4 max-w-sm mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <MagneticButton
                      onClick={handleCameraCapture}
                      disabled={disabled || uploading}
                      className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="relative flex items-center justify-center gap-2">
                        <Camera className="w-5 h-5" />
                        <span>Camera</span>
                      </div>
                    </MagneticButton>

                    <MagneticButton
                      onClick={handleFileSelect}
                      disabled={disabled || uploading}
                      className="group relative overflow-hidden bg-white border-2 border-amber-300 text-amber-700 px-6 py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:border-amber-400"
                    >
                      <motion.div
                        className="absolute inset-0 bg-amber-50"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="relative flex items-center justify-center gap-2">
                        <Upload className="w-5 h-5" />
                        <span>Browse</span>
                      </div>
                    </MagneticButton>
                  </motion.div>

                  {/* Quick Tips */}
                  <motion.div
                    className="grid grid-cols-3 gap-4 mt-8 text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Instant Results</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette className="w-3 h-3 text-purple-500" />
                      <span>Styling Tips</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Crop className="w-3 h-3 text-green-500" />
                      <span>Auto Crop</span>
                    </div>
                  </motion.div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const dataUrl = event.target?.result as string;
                        setSelectedImage(dataUrl);
                        setShowPreview(true);
                      };
                      reader.readAsDataURL(file);
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
                    <div className="text-center">
                      <motion.div
                        className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <p className="text-amber-700 font-medium">Processing image...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Glass>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Glass className="p-4 border border-red-200" gradient="default">
                    <p className="text-red-700 text-sm text-center">{error}</p>
                  </Glass>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Format Support */}
            <motion.div
              className="text-center mt-6 text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p>Supported formats: JPG, PNG, WebP • Max size: 10MB</p>
            </motion.div>
          </motion.div>
        ) : (
          /* Image Preview */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Glass className="p-6" gradient="warm" blur="lg">
              <div className="text-center space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Perfect! Ready to analyze?
                </h3>
                
                <div className="relative inline-block">
                  <motion.img
                    src={selectedImage || ''}
                    alt="Preview"
                    className="max-w-full max-h-64 rounded-lg shadow-lg"
                    layoutId="uploaded-image"
                  />
                </div>

                <div className="flex gap-4 justify-center">
                  <TapScale>
                    <FloatingButton
                      onClick={retakeImage}
                      variant="secondary"
                      className="px-6 py-3"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake
                    </FloatingButton>
                  </TapScale>
                  
                  <TapScale>
                    <FloatingButton
                      onClick={confirmImage}
                      variant="primary"
                      className="px-8 py-3"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze Now
                    </FloatingButton>
                  </TapScale>
                </div>
              </div>
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
