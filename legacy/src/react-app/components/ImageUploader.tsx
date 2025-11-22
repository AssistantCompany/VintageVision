import { Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '@/react-app/hooks/useImageUpload';

interface ImageUploaderProps {
  onImageSelected: (dataUrl: string) => void;
  disabled?: boolean;
}

export default function ImageUploader({ onImageSelected, disabled }: ImageUploaderProps) {
  const { uploading, error, selectFromFile, captureFromCamera } = useImageUpload();

  const handleFileSelect = async () => {
    if (disabled) return;
    const result = await selectFromFile();
    if (result) {
      onImageSelected(result.dataUrl);
    }
  };

  const handleCameraCapture = async () => {
    if (disabled) return;
    const result = await captureFromCamera();
    if (result) {
      onImageSelected(result.dataUrl);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        {/* Main upload area */}
        <div className="border-2 border-dashed border-amber-200 rounded-xl p-8 text-center bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Discover Your Treasure's Story
          </h3>
          
          <p className="text-gray-600 mb-6 text-sm">
            Take a photo or upload an image of your vintage or antique item
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCameraCapture}
              disabled={disabled || uploading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Camera className="w-4 h-4" />
              <span className="text-sm">Camera</span>
            </button>

            <button
              onClick={handleFileSelect}
              disabled={disabled || uploading}
              className="flex items-center justify-center gap-2 bg-white border-2 border-amber-300 text-amber-700 px-4 py-3 rounded-lg font-medium hover:bg-amber-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Upload</span>
            </button>
          </div>
        </div>

        {uploading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-amber-600">
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Processing image...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="text-center text-xs text-gray-500">
          <p>Supported formats: JPG, PNG, WebP • Max size: 10MB</p>
        </div>
      </div>
    </div>
  );
}
