import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, Check, X, AlertTriangle } from 'lucide-react'
import GlassCard from '@/react-app/components/ui/GlassCard'
import MagneticButton from '@/react-app/components/ui/MagneticButton'
import { useImageUpload } from '@/react-app/hooks/useImageUpload'
import { useVintageAnalysis } from '@/react-app/hooks/useVintageAnalysis'

interface TestResult {
  test: string
  status: 'pass' | 'fail' | 'pending'
  message?: string
  error?: string
}

export default function ImageUploadTester() {
  const { uploading, error, selectFromFile, captureFromCamera } = useImageUpload()
  const { analyzing, analyzeItem } = useVintageAnalysis()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [currentTest, setCurrentTest] = useState<string | null>(null)

  const updateTest = (test: string, status: TestResult['status'], message?: string, error?: string) => {
    setTestResults(prev => {
      const existing = prev.find(t => t.test === test)
      if (existing) {
        existing.status = status
        existing.message = message
        existing.error = error
        return [...prev]
      }
      return [...prev, { test, status, message, error }]
    })
  }

  const runImageUploadTests = async () => {
    setTestResults([])
    setCurrentTest('File Upload Test')
    
    try {
      // Test 1: File selection API
      updateTest('File Selection API', 'pending')
      if (typeof FileReader !== 'undefined' && typeof File !== 'undefined') {
        updateTest('File Selection API', 'pass', 'FileReader and File APIs available')
      } else {
        updateTest('File Selection API', 'fail', 'FileReader or File API not available')
      }

      // Test 2: Camera API
      updateTest('Camera API', 'pending')
      if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        updateTest('Camera API', 'pass', 'getUserMedia API available')
      } else {
        updateTest('Camera API', 'fail', 'getUserMedia API not available')
      }

      // Test 3: Canvas API
      updateTest('Canvas API', 'pending')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        updateTest('Canvas API', 'pass', 'Canvas 2D context available')
      } else {
        updateTest('Canvas API', 'fail', 'Canvas 2D context not available')
      }

      // Test 4: Blob/URL APIs
      updateTest('Blob/URL APIs', 'pending')
      if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
        updateTest('Blob/URL APIs', 'pass', 'Blob and URL APIs available')
      } else {
        updateTest('Blob/URL APIs', 'fail', 'Blob or URL API not available')
      }

      // Test 5: Test image data URL creation
      updateTest('Image Data URL', 'pending')
      try {
        const testCanvas = document.createElement('canvas')
        testCanvas.width = 100
        testCanvas.height = 100
        const testCtx = testCanvas.getContext('2d')!
        testCtx.fillStyle = '#ff0000'
        testCtx.fillRect(0, 0, 100, 100)
        const dataUrl = testCanvas.toDataURL('image/jpeg', 0.8)
        if (dataUrl.startsWith('data:image/')) {
          updateTest('Image Data URL', 'pass', 'Canvas to data URL conversion works')
        } else {
          updateTest('Image Data URL', 'fail', 'Invalid data URL format')
        }
      } catch (err) {
        updateTest('Image Data URL', 'fail', 'Canvas to data URL conversion failed', String(err))
      }

    } catch (err) {
      updateTest('General Test', 'fail', 'Test suite failed', String(err))
    }
    
    setCurrentTest(null)
  }

  const testFileUpload = async () => {
    setCurrentTest('Testing File Upload...')
    try {
      const result = await selectFromFile()
      if (result) {
        updateTest('File Upload Flow', 'pass', 'File selected successfully')
        return result.dataUrl
      } else {
        updateTest('File Upload Flow', 'fail', 'No file selected or upload failed')
      }
    } catch (err) {
      updateTest('File Upload Flow', 'fail', 'File upload error', String(err))
    }
    setCurrentTest(null)
    return null
  }

  const testCameraCapture = async () => {
    setCurrentTest('Testing Camera Capture...')
    try {
      const result = await captureFromCamera()
      if (result) {
        updateTest('Camera Capture Flow', 'pass', 'Camera capture successful')
        return result.dataUrl
      } else {
        updateTest('Camera Capture Flow', 'fail', 'Camera capture failed or denied')
      }
    } catch (err) {
      updateTest('Camera Capture Flow', 'fail', 'Camera capture error', String(err))
    }
    setCurrentTest(null)
    return null
  }

  const testAnalysis = async (dataUrl: string) => {
    setCurrentTest('Testing AI Analysis...')
    try {
      const result = await analyzeItem(dataUrl)
      if (result) {
        updateTest('AI Analysis', 'pass', `Analysis successful: ${result.name}`)
      } else {
        updateTest('AI Analysis', 'fail', 'Analysis returned null result')
      }
    } catch (err) {
      updateTest('AI Analysis', 'fail', 'Analysis error', String(err))
    }
    setCurrentTest(null)
  }

  const testFullFlow = async () => {
    const dataUrl = await testFileUpload()
    if (dataUrl) {
      await testAnalysis(dataUrl)
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return <Check className="w-4 h-4 text-green-600" />
      case 'fail': return <X className="w-4 h-4 text-red-600" />
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-600 animate-pulse" />
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return 'bg-green-50 border-green-200'
      case 'fail': return 'bg-red-50 border-red-200'
      case 'pending': return 'bg-yellow-50 border-yellow-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <GlassCard className="p-6" gradient="cool">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Image Upload System Tester</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <MagneticButton onClick={runImageUploadTests} variant="primary">
            <AlertTriangle className="w-4 h-4" />
            Run API Tests
          </MagneticButton>
          
          <MagneticButton onClick={testFileUpload} variant="glass" disabled={uploading}>
            <Upload className="w-4 h-4" />
            Test File Upload
          </MagneticButton>
          
          <MagneticButton onClick={testCameraCapture} variant="glass" disabled={uploading}>
            <Camera className="w-4 h-4" />
            Test Camera
          </MagneticButton>
          
          <MagneticButton onClick={testFullFlow} variant="glass" disabled={uploading || analyzing}>
            <Check className="w-4 h-4" />
            Test Full Flow
          </MagneticButton>
        </div>

        {currentTest && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p className="text-blue-700 font-medium">{currentTest}</p>
          </motion.div>
        )}

        {(uploading || analyzing) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <p className="text-amber-700 font-medium">
              {uploading ? 'Processing upload...' : 'Running AI analysis...'}
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-700 font-medium">Error: {error}</p>
          </motion.div>
        )}
      </GlassCard>

      {testResults.length > 0 && (
        <GlassCard className="p-6" gradient="default">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Test Results</h3>
          
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 border rounded-lg ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{result.test}</h4>
                    {result.message && (
                      <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                    )}
                    {result.error && (
                      <p className="text-sm text-red-600 mt-1 font-mono">{result.error}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {testResults.filter(t => t.status === 'pass').length}
              </div>
              <div className="text-sm text-green-700">Passed</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {testResults.filter(t => t.status === 'fail').length}
              </div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {testResults.filter(t => t.status === 'pending').length}
              </div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
