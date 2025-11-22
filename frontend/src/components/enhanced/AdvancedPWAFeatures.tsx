import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  Share, 
  Bookmark, 
  Download,
  Smartphone,
  Monitor,
  Wifi,
  Zap,
  Camera,
  Heart,
  Star,
  X
} from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import { useNotifications } from './NotificationSystem'
import { cn, trackEvent, vibrate, isStandalone, shareContent } from '@/lib/utils'

// Install Prompt Component
function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const notifications = useNotifications()

  useEffect(() => {
    // Don't show if already installed
    if (isStandalone()) return

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show after user engagement
      setTimeout(() => {
        if (!sessionStorage.getItem('install-dismissed')) {
          setShowPrompt(true)
          trackEvent('pwa_install_prompt_shown')
        }
      }, 30000)
    }

    const handleInstalled = () => {
      setShowPrompt(false)
      setDeferredPrompt(null)
      notifications.success('App installed successfully!')
      trackEvent('pwa_installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [notifications])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      trackEvent('pwa_install_clicked', { outcome })
      vibrate(100)
      
      if (outcome === 'accepted') {
        setShowPrompt(false)
      }
    } catch (error) {
      notifications.error('Installation failed')
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    sessionStorage.setItem('install-dismissed', 'true')
    trackEvent('pwa_install_dismissed')
  }

  if (!showPrompt || !deferredPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto"
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <GlassCard className="p-6" gradient="warm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-2">Install VintageVision</h4>
              <p className="text-sm text-gray-600 mb-4">
                Get faster access, offline support, and notifications when new matches are found!
              </p>
              
              <div className="flex gap-3">
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
                  Not Now
                </MagneticButton>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  )
}

// Share Features Component
function ShareFeatures({ analysis }: { analysis?: any }) {
  const notifications = useNotifications()

  const handleShare = async () => {
    try {
      await shareContent({
        title: analysis ? `Check out this ${analysis.name}!` : 'VintageVision - AI Antique Expert',
        text: analysis 
          ? `I just discovered this amazing ${analysis.name} using VintageVision AI!` 
          : 'Turn your phone into an antique expert with AI-powered identification',
        url: window.location.href
      })
      
      notifications.success('Shared successfully!')
      trackEvent('content_shared', { type: analysis ? 'analysis' : 'app' })
      vibrate(50)
    } catch (error) {
      notifications.error('Share failed')
    }
  }

  return (
    <MagneticButton
      onClick={handleShare}
      variant="glass"
      size="sm"
    >
      <Share className="w-4 h-4" />
      Share
    </MagneticButton>
  )
}

// Quick Actions Component - Enhanced with user authentication
function QuickActions() {
  const { user, redirectToLogin } = useAuth()
  const navigate = useNavigate()
  const notifications = useNotifications()
  const [showActions, setShowActions] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const actions = [
    { 
      icon: Camera, 
      label: 'Quick Scan',
      action: () => {
        setShowActions(false)
        // Navigate to home page first
        navigate('/')
        // Small delay to ensure navigation completes before triggering upload
        setTimeout(() => {
          // Try to trigger the upload functionality
          const uploadButton = document.querySelector('[data-testid="image-upload-trigger"]') as HTMLButtonElement
          if (uploadButton) {
            uploadButton.click()
          } else {
            // Look for other upload triggers
            const cameraButton = document.querySelector('button[data-camera-trigger]') as HTMLButtonElement
            const fileInput = document.querySelector('input[type="file"][accept*="image"]') as HTMLInputElement
            
            if (cameraButton) {
              cameraButton.click()
            } else if (fileInput) {
              fileInput.click()
            } else {
              // If no upload elements found, scroll to top where upload should be
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }
        }, 100)
        trackEvent('quick_action_camera')
      },
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Heart, 
      label: 'Collection',
      action: () => {
        setShowActions(false)
        if (!user) {
          notifications.info('Please sign in to view your collection')
          redirectToLogin()
          return
        }
        navigate('/collection')
        trackEvent('quick_action_collection')
      },
      color: 'from-pink-500 to-rose-500',
      requiresAuth: true
    },
    { 
      icon: Star, 
      label: 'Wishlist',
      action: () => {
        setShowActions(false)
        if (!user) {
          notifications.info('Please sign in to access your wishlist')
          redirectToLogin()
          return
        }
        navigate('/wishlist')
        trackEvent('quick_action_wishlist')
      },
      color: 'from-purple-500 to-indigo-500',
      requiresAuth: true
    }
  ]

  return (
    <>
      {/* Floating Action Button - Redesigned for clarity */}
      <div className="fixed bottom-32 right-4 z-40">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !showActions && (
            <motion.div
              className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              Quick Actions
              <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          className="relative w-16 h-16 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full shadow-xl flex items-center justify-center overflow-hidden"
          whileTap={{ scale: 0.9 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(245, 158, 11, 0.4)"
          }}
          onClick={() => {
            setShowActions(!showActions)
            setShowTooltip(false)
            vibrate(30)
          }}
          onHoverStart={() => !showActions && setShowTooltip(true)}
          onHoverEnd={() => setShowTooltip(false)}
          animate={{
            rotate: showActions ? 45 : 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Background glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
          
          {/* Icon */}
          <motion.div
            animate={{
              rotate: showActions ? 45 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {showActions ? (
              <X className="w-7 h-7 text-white drop-shadow-sm" />
            ) : (
              <div className="relative">
                <Zap className="w-7 h-7 text-white drop-shadow-sm" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                />
              </div>
            )}
          </motion.div>
          
          {/* Ripple effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white"
            initial={{ scale: 0, opacity: 0.5 }}
            whileTap={{ 
              scale: 2,
              opacity: 0,
              transition: { duration: 0.3 }
            }}
          />
        </motion.button>
      </div>

      {/* Quick Action Menu - Improved with labels */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            className="fixed bottom-52 right-4 space-y-4 z-40"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Label */}
                <motion.div
                  className={cn(
                    'bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap',
                    action.requiresAuth && !user && 'opacity-60'
                  )}
                  whileHover={{ scale: 1.05 }}
                >
                  {action.label}
                  {action.requiresAuth && !user && (
                    <span className="text-xs block text-gray-300">Sign in required</span>
                  )}
                </motion.div>
                
                {/* Action Button */}
                <motion.button
                  className={cn(
                    'w-14 h-14 rounded-full shadow-xl flex items-center justify-center relative overflow-hidden',
                    `bg-gradient-to-r ${action.color}`,
                    action.requiresAuth && !user && 'opacity-60'
                  )}
                  onClick={() => {
                    action.action()
                    vibrate(50)
                  }}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 15px 30px rgba(0,0,0,0.3)"
                  }}
                >
                  <action.icon className="w-6 h-6 text-white drop-shadow-sm z-10" />
                  
                  {/* Auth indicator */}
                  {action.requiresAuth && !user && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-amber-400 rounded-full border border-white" />
                  )}
                  
                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 bg-white rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ 
                      scale: 2,
                      opacity: [0.3, 0],
                      transition: { duration: 0.4 }
                    }}
                  />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            className="fixed inset-0 bg-black/20 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowActions(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// Bookmark Feature
function BookmarkFeature({ analysis }: { analysis: any }) {
  const [bookmarked, setBookmarked] = useState(false)
  const notifications = useNotifications()

  const handleBookmark = async () => {
    try {
      const response = await fetch('/api/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_analysis_id: analysis.id,
          notes: 'Bookmarked from PWA'
        })
      })

      if (response.ok) {
        setBookmarked(true)
        notifications.success('Added to collection!')
        trackEvent('analysis_bookmarked')
        vibrate(100)
      }
    } catch (error) {
      notifications.error('Failed to bookmark')
    }
  }

  return (
    <MagneticButton
      onClick={handleBookmark}
      variant={bookmarked ? "primary" : "glass"}
      size="sm"
    >
      <Bookmark className={cn("w-4 h-4", bookmarked && "fill-current")} />
      {bookmarked ? 'Saved' : 'Save'}
    </MagneticButton>
  )
}

// PWA Status Indicator
function PWAStatusIndicator() {
  const [isStandaloneMode] = useState(isStandalone())
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isStandaloneMode) return null

  return (
    <motion.div
      className="fixed top-4 left-4 z-40"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <GlassCard className="p-2">
        <div className="flex items-center gap-2">
          {isStandaloneMode && (
            <div className="flex items-center gap-1">
              <Monitor className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-700 font-medium">PWA</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Wifi className={cn("w-3 h-3", isOnline ? "text-green-600" : "text-red-600")} />
            <span className={cn("text-xs font-medium", isOnline ? "text-green-700" : "text-red-700")}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// Badge Component for App Shortcuts
function AppBadge({ count }: { count: number }) {
  useEffect(() => {
    if ('setAppBadge' in navigator) {
      (navigator as any).setAppBadge(count)
    }
  }, [count])

  return null
}

// Complete PWA Features Bundle
export default function AdvancedPWAFeatures({ badgeCount = 0 }: { 
  badgeCount?: number 
}) {
  return (
    <>
      <InstallPrompt />
      <QuickActions />
      <PWAStatusIndicator />
      <AppBadge count={badgeCount} />
    </>
  )
}

// Export individual components
export {
  InstallPrompt,
  ShareFeatures,
  QuickActions,
  BookmarkFeature,
  PWAStatusIndicator,
  AppBadge
}
