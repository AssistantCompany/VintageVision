/**
 * BatchAnalysis - Premium Feature
 * Bulk analysis for estate sales, collections, and high-volume scanning
 */

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Image as ImageIcon,
  Crown,
  Lock,
  X,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  FileSpreadsheet,
  Package
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { GlassCard } from '@/components/ui/glass-card'

interface BatchItem {
  id: string
  file: File
  preview: string
  status: 'pending' | 'analyzing' | 'completed' | 'error'
  analysis?: {
    name: string
    category: string
    era: string
    confidence: number
    valueMin?: number
    valueMax?: number
  }
  error?: string
}

interface BatchAnalysisProps {
  isPremium?: boolean
  maxItems?: number
  onUpgradeClick?: () => void
  onExport?: (format: 'csv' | 'pdf') => void
}

export default function BatchAnalysis({
  isPremium = false,
  maxItems = 50,
  onUpgradeClick,
  onExport
}: BatchAnalysisProps) {
  const [items, setItems] = useState<BatchItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newItems: BatchItem[] = acceptedFiles.slice(0, maxItems - items.length).map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }))
    setItems(prev => [...prev, ...newItems])
  }, [items.length, maxItems])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']
    },
    disabled: !isPremium || items.length >= maxItems
  })

  const removeItem = (id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item) URL.revokeObjectURL(item.preview)
      return prev.filter(i => i.id !== id)
    })
  }

  const clearAll = () => {
    items.forEach(item => URL.revokeObjectURL(item.preview))
    setItems([])
    setCurrentIndex(0)
    setIsProcessing(false)
    setIsPaused(false)
  }

  const startProcessing = async () => {
    if (items.length === 0) return

    setIsProcessing(true)
    setIsPaused(false)

    // Simulate batch analysis
    for (let i = currentIndex; i < items.length; i++) {
      if (isPaused) break

      setCurrentIndex(i)
      setItems(prev => prev.map((item, idx) =>
        idx === i ? { ...item, status: 'analyzing' } : item
      ))

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

      // Simulate analysis result (in production this would be actual API response)
      const mockAnalysis = {
        name: `Vintage Item ${i + 1}`,
        category: ['antique', 'vintage', 'modern_branded'][Math.floor(Math.random() * 3)],
        era: ['Victorian', '1920s', '1950s', '1970s'][Math.floor(Math.random() * 4)],
        confidence: 0.7 + Math.random() * 0.25,
        valueMin: Math.round(50 + Math.random() * 500),
        valueMax: Math.round(200 + Math.random() * 1500)
      }

      // 10% chance of error for demo
      const hasError = Math.random() < 0.1

      setItems(prev => prev.map((item, idx) =>
        idx === i ? {
          ...item,
          status: hasError ? 'error' : 'completed',
          analysis: hasError ? undefined : mockAnalysis,
          error: hasError ? 'Could not identify item' : undefined
        } : item
      ))
    }

    if (!isPaused) {
      setIsProcessing(false)
    }
  }

  const pauseProcessing = () => {
    setIsPaused(true)
    setIsProcessing(false)
  }

  const completedItems = items.filter(i => i.status === 'completed')
  const totalValue = completedItems.reduce((sum, item) => {
    if (item.analysis) {
      return sum + ((item.analysis.valueMin || 0) + (item.analysis.valueMax || 0)) / 2
    }
    return sum
  }, 0)

  if (!isPremium) {
    return (
      <GlassCard className="p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Batch Analysis</h3>
          <p className="text-muted-foreground mb-4">
            Perfect for estate sales and large collections. Analyze up to {maxItems} items at once.
          </p>
          <button
            onClick={onUpgradeClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            <Crown className="w-5 h-5" />
            Upgrade to Pro
          </button>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Batch Analysis</h2>
              <p className="text-sm text-muted-foreground">{items.length}/{maxItems} items loaded</p>
            </div>
          </div>
          {items.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={clearAll}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Clear All
              </button>
              {!isProcessing ? (
                <button
                  onClick={startProcessing}
                  disabled={completedItems.length === items.length}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                    ${completedItems.length === items.length
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                    }
                  `}
                >
                  <Play className="w-4 h-4" />
                  {currentIndex > 0 ? 'Resume' : 'Start Analysis'}
                </button>
              ) : (
                <button
                  onClick={pauseProcessing}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-amber-500 text-white hover:bg-amber-600"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              )}
            </div>
          )}
        </div>
      </GlassCard>

      {/* Progress Bar */}
      {items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedItems.length} of {items.length} analyzed
            </span>
            <span className="text-muted-foreground">
              {Math.round((completedItems.length / items.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(completedItems.length / items.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-border hover:border-indigo-400 hover:bg-muted/50'}
          ${items.length >= maxItems ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-indigo-500' : 'text-muted-foreground'}`} />
          <p className="text-lg font-medium text-foreground mb-2">
            {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to select files • Up to {maxItems} images • JPG, PNG, WebP
          </p>
        </div>
      </div>

      {/* Item Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.05 }}
                className="relative group"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                  <img
                    src={item.preview}
                    alt={`Item ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Status Overlay */}
                  <div className={`
                    absolute inset-0 flex items-center justify-center transition-all
                    ${item.status === 'analyzing' ? 'bg-black/50' : ''}
                    ${item.status === 'completed' ? 'bg-success/20' : ''}
                    ${item.status === 'error' ? 'bg-danger/20' : ''}
                  `}>
                    {item.status === 'analyzing' && (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    )}
                    {item.status === 'completed' && (
                      <CheckCircle className="w-8 h-8 text-success" />
                    )}
                    {item.status === 'error' && (
                      <AlertCircle className="w-8 h-8 text-danger" />
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeItem(item.id)
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Queue Number */}
                  {item.status === 'pending' && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-white text-xs">
                      #{idx + 1}
                    </div>
                  )}
                </div>

                {/* Analysis Preview */}
                {item.status === 'completed' && item.analysis && (
                  <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium text-foreground truncate">{item.analysis.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{item.analysis.era}</span>
                      <span className="text-xs font-medium text-success">
                        ${item.analysis.valueMin?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Summary & Export */}
      {completedItems.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground">Batch Summary</h3>
              <p className="text-sm text-muted-foreground">{completedItems.length} items analyzed</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Estimated Total Value</p>
              <p className="text-2xl font-bold text-success">
                ${totalValue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-white/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Antiques</p>
              <p className="text-lg font-bold text-foreground">
                {completedItems.filter(i => i.analysis?.category === 'antique').length}
              </p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Vintage</p>
              <p className="text-lg font-bold text-foreground">
                {completedItems.filter(i => i.analysis?.category === 'vintage').length}
              </p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">High Value (80%+)</p>
              <p className="text-lg font-bold text-foreground">
                {completedItems.filter(i => (i.analysis?.confidence || 0) >= 0.8).length}
              </p>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onExport?.('csv')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-muted-foreground font-medium hover:bg-muted/50 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => onExport?.('pdf')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF Report
            </button>
          </div>
        </GlassCard>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="mb-2">No images loaded yet</p>
          <p className="text-sm">Drop images above or click to browse</p>
        </div>
      )}
    </div>
  )
}
