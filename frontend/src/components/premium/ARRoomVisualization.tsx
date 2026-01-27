/**
 * ARRoomVisualization - Premium Feature
 * Visualize how items would look in your space using AR
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Crown,
  Lock,
  Move,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  Smartphone,
  Sparkles,
  CheckCircle,
  Info
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

interface ARItem {
  id: string
  name: string
  imageUrl: string
  dimensions?: {
    width: number
    height: number
    depth?: number
  }
}

interface ARRoomVisualizationProps {
  item?: ARItem
  isPremium?: boolean
  onUpgradeClick?: () => void
  onCapture?: (imageData: string) => void
}

// Demo room backgrounds
const DEMO_ROOMS = [
  { id: 'living', name: 'Modern Living Room', gradient: 'from-amber-100 to-orange-50' },
  { id: 'bedroom', name: 'Cozy Bedroom', gradient: 'from-blue-50 to-indigo-100' },
  { id: 'dining', name: 'Dining Room', gradient: 'from-emerald-50 to-teal-100' },
  { id: 'office', name: 'Home Office', gradient: 'from-gray-100 to-slate-200' },
]

export default function ARRoomVisualization({
  item,
  isPremium = false,
  onUpgradeClick,
  onCapture
}: ARRoomVisualizationProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [selectedRoom, setSelectedRoom] = useState(DEMO_ROOMS[0])
  const [itemPosition, setItemPosition] = useState({ x: 50, y: 50 })
  const [itemScale, setItemScale] = useState(1)
  const [itemRotation, setItemRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showAR, setShowAR] = useState(false)
  const [arSupported, setArSupported] = useState(false)

  useEffect(() => {
    // Check for WebXR support
    if ('xr' in navigator) {
      (navigator as any).xr?.isSessionSupported?.('immersive-ar')?.then((supported: boolean) => {
        setArSupported(supported)
      })
    }
  }, [])

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setItemPosition({
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y))
    })
  }

  const captureScene = () => {
    // In production, this would use html2canvas or similar
    onCapture?.('scene-capture-data')
  }

  if (!isPremium) {
    return (
      <GlassCard className="p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">AR Room Visualization</h3>
          <p className="text-muted-foreground mb-4">
            See how vintage items would look in your space before you buy.
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
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">AR Room Visualization</h2>
              <p className="text-sm text-muted-foreground">Preview items in your space</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAR(true)}
              disabled={!arSupported}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                ${arSupported
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
            >
              <Smartphone className="w-4 h-4" />
              {arSupported ? 'Launch AR' : 'AR Not Available'}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Room Selection */}
      <div className="grid grid-cols-4 gap-2">
        {DEMO_ROOMS.map(room => (
          <button
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className={`
              p-3 rounded-xl text-center transition-all
              ${selectedRoom.id === room.id
                ? 'ring-2 ring-violet-500 bg-violet-50'
                : 'bg-muted/50 hover:bg-muted'
              }
            `}
          >
            <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${room.gradient} mb-2`} />
            <p className="text-xs font-medium text-muted-foreground">{room.name}</p>
          </button>
        ))}
      </div>

      {/* AR Canvas */}
      <GlassCard className="overflow-hidden">
        <div
          ref={canvasRef}
          className={`
            relative w-full aspect-[16/10] bg-gradient-to-br ${selectedRoom.gradient}
            cursor-move select-none
          `}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Room furniture placeholders */}
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/10 to-transparent" />

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(to right, #6b7280 1px, transparent 1px), linear-gradient(to bottom, #6b7280 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Draggable Item */}
          {item && (
            <motion.div
              className="absolute cursor-grab active:cursor-grabbing"
              style={{
                left: `${itemPosition.x}%`,
                top: `${itemPosition.y}%`,
                transform: `translate(-50%, -50%) scale(${itemScale}) rotate(${itemRotation}deg)`
              }}
              onMouseDown={handleMouseDown}
              animate={{
                boxShadow: isDragging
                  ? '0 20px 40px rgba(0,0,0,0.3)'
                  : '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="max-w-[200px] max-h-[200px] object-contain rounded-lg"
                  draggable={false}
                />
                {/* Selection ring */}
                <div className="absolute inset-0 border-2 border-violet-500 rounded-lg pointer-events-none">
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-violet-500 rounded-full" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-violet-500 rounded-full" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-violet-500 rounded-full" />
                </div>
              </div>
            </motion.div>
          )}

          {/* No item placeholder */}
          {!item && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl">
                <Sparkles className="w-12 h-12 text-violet-400 mx-auto mb-3" />
                <p className="font-medium text-foreground">Select an item to visualize</p>
                <p className="text-sm text-muted-foreground mt-1">Items from your collection or analysis</p>
              </div>
            </div>
          )}

          {/* Controls overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <button
              onClick={() => setItemScale(s => Math.max(0.3, s - 0.1))}
              className="p-1.5 hover:bg-muted rounded-full transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="w-px h-5 bg-border" />
            <button
              onClick={() => setItemScale(s => Math.min(2, s + 0.1))}
              className="p-1.5 hover:bg-muted rounded-full transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="w-px h-5 bg-border" />
            <button
              onClick={() => setItemRotation(r => r - 15)}
              className="p-1.5 hover:bg-muted rounded-full transition-colors"
              title="Rotate left"
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="w-px h-5 bg-border" />
            <button
              onClick={() => {
                setItemPosition({ x: 50, y: 50 })
                setItemScale(1)
                setItemRotation(0)
              }}
              className="p-1.5 hover:bg-muted rounded-full transition-colors"
              title="Reset"
            >
              <Move className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={captureScene}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-muted-foreground font-medium hover:bg-gray-50 transition-colors"
        >
          <Download className="w-5 h-5" />
          Save Image
        </button>
        <button
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-medium hover:from-violet-600 hover:to-fuchsia-600 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          Share
        </button>
      </div>

      {/* AR Launch Modal */}
      <AnimatePresence>
        {showAR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowAR(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">AR Experience</h3>
                <p className="text-muted-foreground mb-6">
                  Point your camera at a flat surface to place the item in your room.
                </p>

                <div className="space-y-3 text-left mb-6">
                  <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-violet-600" />
                    <span className="text-sm text-muted-foreground">Find a well-lit area</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-violet-600" />
                    <span className="text-sm text-muted-foreground">Point at floor or table</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-violet-600" />
                    <span className="text-sm text-muted-foreground">Move slowly for best tracking</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Would launch WebXR session here
                    setShowAR(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-medium hover:from-violet-600 hover:to-fuchsia-600 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  Start AR Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Note */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Pro Tip</p>
          <p>
            For the best AR experience, use a mobile device with a rear camera.
            Desktop preview mode lets you visualize items in preset room environments.
          </p>
        </div>
      </div>
    </div>
  )
}
