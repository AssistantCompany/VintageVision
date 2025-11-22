import { useState, useCallback } from 'react';

export interface ImageUploadResult {
  file: File;
  dataUrl: string;
  preview: string;
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File): Promise<ImageUploadResult | null> => {
    setUploading(true);
    setError(null);

    try {
      // Validate file exists
      if (!file) {
        throw new Error('No file provided');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file (JPG, PNG, WebP, etc.)');
      }

      // Validate file size (max 20MB to match backend)
      if (file.size > 20 * 1024 * 1024) {
        throw new Error('Image must be less than 20MB');
      }

      // Check if file is too small (likely corrupted)
      if (file.size < 100) {
        throw new Error('Image file appears to be corrupted or too small');
      }

      // Convert to data URL with better error handling
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const result = event.target?.result;
          if (typeof result === 'string') {
            console.log('File read successfully, data URL length:', result.length);
            console.log('Data URL format:', result.substring(0, 50) + '...');
            resolve(result);
          } else {
            reject(new Error('Failed to read file as data URL'));
          }
        };
        
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          reject(new Error('Failed to read file. The file may be corrupted.'));
        };
        
        reader.onabort = () => {
          console.error('FileReader aborted');
          reject(new Error('File reading was aborted'));
        };
        
        console.log('Starting to read file:', { name: file.name, size: file.size, type: file.type });
        reader.readAsDataURL(file);
      });

      // Validate the data URL format
      if (!dataUrl.startsWith('data:image/')) {
        console.error('Invalid data URL format:', dataUrl.substring(0, 50));
        throw new Error('Invalid image format detected');
      }

      // Additional validation for supported formats
      const supportedFormats = ['data:image/jpeg', 'data:image/jpg', 'data:image/png', 'data:image/webp', 'data:image/gif'];
      const isValidFormat = supportedFormats.some(format => dataUrl.toLowerCase().startsWith(format));
      
      if (!isValidFormat) {
        console.error('Unsupported image format:', dataUrl.substring(0, 30));
        throw new Error('Unsupported image format. Please use JPG, PNG, WebP, or GIF images only.');
      }

      // Test base64 validity
      try {
        const base64Data = dataUrl.split(',')[1];
        if (!base64Data || base64Data.length < 100) {
          throw new Error('Invalid base64 data');
        }
        // Test decode a small portion
        atob(base64Data.substring(0, 100));
        console.log('Base64 validation passed');
      } catch (base64Error) {
        console.error('Base64 validation failed:', base64Error);
        throw new Error('Invalid image data. Please try uploading the image again.');
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);

      return {
        file,
        dataUrl,
        preview,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const selectFromFile = useCallback((): Promise<ImageUploadResult | null> => {
    return new Promise((resolve) => {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg,image/jpg,image/png,image/webp,image/gif';
        input.multiple = false;
        
        input.onchange = async (e) => {
          try {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              const result = await uploadImage(file);
              resolve(result);
            } else {
              setError('No file selected');
              resolve(null);
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'File selection failed');
            resolve(null);
          }
        };
        
        input.onerror = () => {
          setError('File selection failed');
          resolve(null);
        };
        
        input.click();
      } catch (err) {
        setError('Unable to open file selector');
        resolve(null);
      }
    });
  }, [uploadImage]);

  const captureFromCamera = useCallback((): Promise<ImageUploadResult | null> => {
    return new Promise((resolve) => {
      try {
        // Check if camera is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError('Camera not supported on this device');
          resolve(null);
          return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
        input.capture = 'environment'; // Use back camera on mobile
        input.multiple = false;
        
        input.onchange = async (e) => {
          try {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              const result = await uploadImage(file);
              resolve(result);
            } else {
              setError('No photo captured');
              resolve(null);
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Camera capture failed');
            resolve(null);
          }
        };
        
        input.onerror = () => {
          setError('Camera capture failed');
          resolve(null);
        };
        
        input.click();
      } catch (err) {
        setError('Unable to access camera');
        resolve(null);
      }
    });
  }, [uploadImage]);

  return {
    uploading,
    error,
    uploadImage,
    selectFromFile,
    captureFromCamera,
  };
}
