import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Smartphone, 
  RefreshCw,
  Bell,
  X
} from 'lucide-react'
import GlassCard from '@/react-app/components/ui/GlassCard'
import MagneticButton from '@/react-app/components/ui/MagneticButton'
import { useNotifications } from './NotificationSystem'
import { cn, trackEvent, isStandalone } from '@/react-app/lib/utils'

// Enhanced Offline Detection
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [wasOffline, setWasOffline] = useState(false)
  const notifications = useNotifications()

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      if (wasOffline) {
        notifications.success('Back online!', 'Your connection has been restored')
        setWasOffline(false)
        trackEvent('app_back_online')
      }
    }

    const handleOffline = () => {
      setIsOffline(true)
      setWasOffline(true)
      notifications.warning('You are offline', 'Some features may be limited')
      trackEvent('app_went_offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [wasOffline, notifications])

  return { isOffline, wasOffline }
}

// Network Status Indicator
export function NetworkStatusIndicator() {
  const { isOffline } = useOfflineStatus()
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    if (isOffline) {
      setShowStatus(true)
    } else {
      const timer = setTimeout(() => setShowStatus(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOffline])

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          className="fixed bottom-4 left-4 z-40"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <GlassCard 
            className={cn(
              'p-3 border-2',
              isOffline ? 'border-red-200' : 'border-green-200'
            )}
          >
            <div className="flex items-center gap-2">
              {isOffline ? (
                <>
                  <WifiOff className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700 font-medium">Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Back online</span>
                </>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// App Update Notification
export function AppUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false)
  const [updating, setUpdating] = useState(false)
  const notifications = useNotifications()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdate(true)
        trackEvent('app_update_available')
      })

      // Check for updates
      const checkForUpdates = () => {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.update()
          })
        })
      }

      // Check for updates every 5 minutes
      const interval = setInterval(checkForUpdates, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [])

  const handleUpdate = async () => {
    setUpdating(true)
    trackEvent('app_update_accepted')
    
    try {
      // Clear caches and reload
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }
      
      window.location.reload()
    } catch (error) {
      notifications.error('Update failed', 'Please try refreshing the page manually')
      setUpdating(false)
    }
  }

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <GlassCard className="p-4 border-blue-200" gradient="cool">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Download className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900">App Update Available</h4>
                <p className="text-sm text-blue-700 mt-1">
                  A new version of VintageVision is ready with improvements and bug fixes.
                </p>
              </div>
              
              <button
                onClick={() => setShowUpdate(false)}
                className="text-blue-400 hover:text-blue-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-2 mt-4">
              <MagneticButton
                onClick={handleUpdate}
                disabled={updating}
                variant="primary"
                size="sm"
                className="flex-1"
              >
                {updating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Now'
                )}
              </MagneticButton>
              
              <MagneticButton
                onClick={() => setShowUpdate(false)}
                variant="ghost"
                size="sm"
              >
                Later
              </MagneticButton>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Background Sync Status
export function BackgroundSyncIndicator() {
  const [syncing, setSyncing] = useState(false)
  const [pendingSync, setPendingSync] = useState(0)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_START') {
          setSyncing(true)
        } else if (event.data.type === 'SYNC_COMPLETE') {
          setSyncing(false)
          setPendingSync(0)
        } else if (event.data.type === 'SYNC_PENDING') {
          setPendingSync(event.data.count)
        }
      })
    }
  }, [])

  if (!syncing && pendingSync === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-20 right-4 z-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <GlassCard className="p-3" gradient="default">
          <div className="flex items-center gap-2">
            {syncing ? (
              <>
                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-sm text-blue-700 font-medium">Syncing...</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-sm text-amber-700 font-medium">
                  {pendingSync} pending sync{pendingSync !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  )
}

// Enhanced PWA Install Prompt
export function EnhancedPWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [installable, setInstallable] = useState(false)
  const notifications = useNotifications()

  useEffect(() => {
    // Don't show if already in standalone mode
    if (isStandalone()) return

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setInstallable(true)
      
      // Show prompt after user engagement
      setTimeout(() => {
        if (!sessionStorage.getItem('pwa-prompt-dismissed')) {
          setShowPrompt(true)
          trackEvent('pwa_prompt_shown')
        }
      }, 30000) // Show after 30 seconds
    }

    const handleAppInstalled = () => {
      setShowPrompt(false)
      setInstallable(false)
      setDeferredPrompt(null)
      notifications.success('App installed!', 'VintageVision is now available on your home screen')
      trackEvent('pwa_installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [notifications])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    trackEvent('pwa_install_clicked')
    
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      trackEvent('pwa_prompt_result', { outcome })
      
      if (outcome === 'accepted') {
        setShowPrompt(false)
        setInstallable(false)
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      notifications.error('Installation failed', 'Please try again later')
      trackEvent('pwa_install_error', { error: String(error) })
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    trackEvent('pwa_prompt_dismissed')
  }

  return (
    <AnimatePresence>
      {showPrompt && installable && (
        <motion.div
          className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
        >
          <GlassCard className="overflow-hidden" gradient="warm">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">
                    Install VintageVision
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Get faster access with offline features and notifications
                  </p>
                  
                  <div className="flex gap-2">
                    <MagneticButton
                      onClick={handleInstall}
                      variant="primary"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                      Install
                    </MagneticButton>
                    
                    <MagneticButton
                      onClick={handleDismiss}
                      variant="ghost"
                      size="sm"
                    >
                      Maybe Later
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Push Notification Manager
export function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false)
  const notifications = useNotifications()

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
      
      // Show permission prompt for logged-in users
      if (Notification.permission === 'default') {
        setTimeout(() => {
          setShowPermissionPrompt(true)
        }, 60000) // Show after 1 minute
      }
    }
  }, [])

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      notifications.error('Notifications not supported')
      return
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      setShowPermissionPrompt(false)
      
      if (result === 'granted') {
        notifications.success('Notifications enabled!', 'You\'ll receive updates about your vintage finds')
        trackEvent('notifications_enabled')
        
        // Register for push notifications
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(registration => {
            // Subscribe to push notifications
            registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY' // Replace with actual VAPID key
            }).catch(console.error)
          })
        }
      } else {
        trackEvent('notifications_denied')
      }
    } catch (error) {
      notifications.error('Failed to enable notifications')
    }
  }

  const dismissPrompt = () => {
    setShowPermissionPrompt(false)
    trackEvent('notification_permission_dismissed')
  }

  return (
    <AnimatePresence>
      {showPermissionPrompt && permission === 'default' && (
        <motion.div
          className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <GlassCard className="p-4" gradient="cool">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900">Stay Updated</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Get notifications when we find matches for your wishlist items
                </p>
              </div>
              
              <button
                onClick={dismissPrompt}
                className="text-blue-400 hover:text-blue-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-2 mt-4">
              <MagneticButton
                onClick={requestPermission}
                variant="primary"
                size="sm"
                className="flex-1"
              >
                Enable Notifications
              </MagneticButton>
              
              <MagneticButton
                onClick={dismissPrompt}
                variant="ghost"
                size="sm"
              >
                Not Now
              </MagneticButton>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Complete PWA Enhancement Component
export default function PWAEnhancements() {
  return (
    <>
      <NetworkStatusIndicator />
      <AppUpdateNotification />
      <BackgroundSyncIndicator />
      <EnhancedPWAInstallPrompt />
      <PushNotificationManager />
    </>
  )
}
