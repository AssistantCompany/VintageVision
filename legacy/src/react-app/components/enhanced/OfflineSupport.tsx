import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Download, RotateCcw, CheckCircle } from 'lucide-react'
import GlassCard from '@/react-app/components/ui/GlassCard'
import MagneticButton from '@/react-app/components/ui/MagneticButton'
import { useNotifications } from './NotificationSystem'
import { cn, trackEvent } from '@/react-app/lib/utils'

interface OfflineQueueItem {
  id: string
  type: 'analysis' | 'collection' | 'feedback'
  data: any
  timestamp: number
  retryCount: number
}

function useOfflineQueue() {
  const [queue, setQueue] = useState<OfflineQueueItem[]>([])
  const [syncing, setSyncing] = useState(false)
  const notifications = useNotifications()

  // Load queue from localStorage on mount
  useEffect(() => {
    const savedQueue = localStorage.getItem('offline-queue')
    if (savedQueue) {
      try {
        setQueue(JSON.parse(savedQueue))
      } catch (error) {
        console.error('Failed to parse offline queue:', error)
      }
    }
  }, [])

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('offline-queue', JSON.stringify(queue))
  }, [queue])

  const addToQueue = (type: 'analysis' | 'collection' | 'feedback', data: any) => {
    const item: OfflineQueueItem = {
      id: crypto.randomUUID(),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0
    }
    
    setQueue(prev => [...prev, item])
    trackEvent('offline_queue_add', { type })
  }

  const removeFromQueue = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id))
  }

  const processQueue = async () => {
    if (queue.length === 0 || syncing) return

    setSyncing(true)
    trackEvent('offline_sync_started', { queueSize: queue.length })

    const processed: string[] = []
    const failed: string[] = []

    for (const item of queue) {
      try {
        let endpoint = ''
        let method = 'POST'
        
        switch (item.type) {
          case 'analysis':
            endpoint = '/api/analyze'
            break
          case 'collection':
            endpoint = '/api/collection'
            break
          case 'feedback':
            endpoint = '/api/feedback'
            break
        }

        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        })

        if (response.ok) {
          processed.push(item.id)
        } else {
          failed.push(item.id)
        }
      } catch (error) {
        failed.push(item.id)
      }
    }

    // Remove processed items
    setQueue(prev => prev.filter(item => !processed.includes(item.id)))

    // Update retry count for failed items
    setQueue(prev => prev.map(item => 
      failed.includes(item.id) 
        ? { ...item, retryCount: item.retryCount + 1 }
        : item
    ))

    setSyncing(false)

    if (processed.length > 0) {
      notifications.success(
        `Synced ${processed.length} item${processed.length === 1 ? '' : 's'}`,
        'Your offline actions have been processed'
      )
      trackEvent('offline_sync_success', { processed: processed.length, failed: failed.length })
    }

    if (failed.length > 0) {
      notifications.warning(
        `${failed.length} item${failed.length === 1 ? '' : 's'} failed to sync`,
        'Will retry automatically when connection improves'
      )
    }
  }

  return {
    queue,
    syncing,
    addToQueue,
    removeFromQueue,
    processQueue,
    queueSize: queue.length
  }
}

function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [showIndicator, setShowIndicator] = useState(false)
  const { syncing, processQueue, queueSize } = useOfflineQueue()

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      setShowIndicator(true)
      
      // Auto-sync when coming back online
      setTimeout(() => {
        processQueue()
      }, 1000)
      
      // Hide indicator after showing "back online" briefly
      setTimeout(() => setShowIndicator(false), 3000)
    }

    const handleOffline = () => {
      setIsOffline(true)
      setShowIndicator(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [processQueue])

  // Show indicator when offline or when there are queued items
  const shouldShow = showIndicator || isOffline || queueSize > 0

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className="fixed bottom-4 left-4 z-50"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <GlassCard 
            className={cn(
              'p-4 border-2',
              isOffline ? 'border-red-200/50' : 'border-green-200/50'
            )}
            gradient={isOffline ? "rose" : "default"}
          >
            <div className="flex items-center gap-3">
              {/* Status Icon */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                isOffline 
                  ? 'bg-red-100'
                  : syncing 
                    ? 'bg-blue-100'
                    : 'bg-green-100'
              )}>
                {isOffline ? (
                  <WifiOff className="w-4 h-4 text-red-600" />
                ) : syncing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RotateCcw className="w-4 h-4 text-blue-600" />
                  </motion.div>
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>

              {/* Status Text */}
              <div className="flex-1">
                <p className={cn(
                  'font-semibold text-sm',
                  isOffline ? 'text-red-700' : 'text-green-700'
                )}>
                  {isOffline ? 'You are offline' : syncing ? 'Syncing...' : 'Back online'}
                </p>
                
                {queueSize > 0 && (
                  <p className="text-xs text-gray-600">
                    {queueSize} action{queueSize === 1 ? '' : 's'} pending
                  </p>
                )}
              </div>

              {/* Sync Button */}
              {!isOffline && queueSize > 0 && !syncing && (
                <MagneticButton
                  onClick={processQueue}
                  variant="primary"
                  size="sm"
                >
                  <Download className="w-3 h-3" />
                  Sync
                </MagneticButton>
              )}
            </div>

            {/* Offline Instructions */}
            {isOffline && (
              <motion.div
                className="mt-3 pt-3 border-t border-red-200/50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs text-red-600">
                  You can still browse your collection and take photos. 
                  Actions will sync when connection is restored.
                </p>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function OfflineCache() {
  const [cacheStatus, setCacheStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')
  const [cacheSize, setCacheSize] = useState<number>(0)

  useEffect(() => {
    checkCacheStatus()
  }, [])

  const checkCacheStatus = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        let totalSize = 0
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const keys = await cache.keys()
          
          for (const request of keys) {
            const response = await cache.match(request)
            if (response) {
              const blob = await response.blob()
              totalSize += blob.size
            }
          }
        }
        
        setCacheSize(totalSize)
        setCacheStatus('available')
      } else {
        setCacheStatus('unavailable')
      }
    } catch (error) {
      setCacheStatus('unavailable')
    }
  }

  const clearCache = async () => {
    try {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
      setCacheSize(0)
      trackEvent('offline_cache_cleared')
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (cacheStatus === 'unavailable') return null

  return (
    <GlassCard className="p-4" gradient="default">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">Offline Storage</h4>
          <p className="text-sm text-gray-600">
            {cacheStatus === 'checking' ? 'Checking...' : `${formatSize(cacheSize)} cached`}
          </p>
        </div>
        
        {cacheStatus === 'available' && cacheSize > 0 && (
          <MagneticButton
            onClick={clearCache}
            variant="ghost"
            size="sm"
          >
            Clear Cache
          </MagneticButton>
        )}
      </div>
    </GlassCard>
  )
}

// Download for Offline Component
function DownloadForOffline() {
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const notifications = useNotifications()

  const handleDownload = async () => {
    setDownloading(true)
    setProgress(0)

    try {
      // Download key app resources for offline use
      const resourcesToCache = [
        '/',
        '/collection',
        '/wishlist', 
        '/manifest.json',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
      ]

      const cache = await caches.open('vintagevision-offline-v1')
      
      for (let i = 0; i < resourcesToCache.length; i++) {
        try {
          await cache.add(resourcesToCache[i])
          setProgress(((i + 1) / resourcesToCache.length) * 100)
        } catch (error) {
          console.warn(`Failed to cache ${resourcesToCache[i]}:`, error)
        }
      }

      notifications.success('App ready for offline use!')
      trackEvent('offline_download_completed')
    } catch (error) {
      notifications.error('Download failed')
      trackEvent('offline_download_failed')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <GlassCard className="p-4" gradient="cool">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto">
          <Download className="w-6 h-6 text-white" />
        </div>
        
        <div>
          <h4 className="font-bold text-blue-900 mb-2">Download for Offline</h4>
          <p className="text-sm text-blue-700">
            Download app data to use VintageVision without an internet connection
          </p>
        </div>

        {downloading && (
          <div className="space-y-2">
            <div className="w-full bg-blue-100 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-blue-600">{Math.round(progress)}% complete</p>
          </div>
        )}

        <MagneticButton
          onClick={handleDownload}
          disabled={downloading}
          variant="primary"
          size="md"
          className="w-full"
        >
          {downloading ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Now
            </>
          )}
        </MagneticButton>
      </div>
    </GlassCard>
  )
}

// Main Offline Support Component
export default function OfflineSupport() {
  return (
    <>
      <OfflineIndicator />
    </>
  )
}

export { useOfflineQueue, OfflineIndicator, OfflineCache, DownloadForOffline }
