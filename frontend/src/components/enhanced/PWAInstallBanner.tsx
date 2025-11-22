import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone, Sparkles, Check } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import LiquidButton from '@/components/ui/LiquidButton'
import { trackEvent, vibrate, isStandalone, isIOSDevice } from '@/lib/utils'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (isStandalone()) {
      setIsInstalled(true)
      return
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after user has interacted with the app
      setTimeout(() => {
        if (!sessionStorage.getItem('pwa-prompt-dismissed')) {
          setShowPrompt(true)
          trackEvent('pwa_prompt_shown')
        }
      }, 10000) // Show after 10 seconds
    }

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      trackEvent('pwa_installed', { method: 'prompt' })
      vibrate([100, 50, 100])
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // For iOS or other browsers without prompt
      if (isIOSDevice()) {
        setShowIOSInstructions(true)
        trackEvent('pwa_ios_instructions_shown')
        return
      }
      return
    }

    try {
      setInstalling(true)
      trackEvent('pwa_install_clicked')
      
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      trackEvent('pwa_prompt_result', { outcome })
      
      if (outcome === 'accepted') {
        setShowPrompt(false)
        setIsInstalled(true)
        vibrate([100, 50, 100])
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Error installing PWA:', error)
      trackEvent('pwa_install_error', { error: String(error) })
    } finally {
      setInstalling(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    trackEvent('pwa_prompt_dismissed')
  }

  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <GlassCard className="overflow-hidden" gradient="warm">
            {/* Header with sparkles animation */}
            <div className="relative p-4 pb-2">
              <div className="absolute top-2 right-2 opacity-20">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-6 h-6 text-amber-500" />
                </motion.div>
              </div>
              
              <div className="flex items-start gap-3">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Smartphone className="w-6 h-6 text-white" />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <motion.h3
                    className="font-bold text-gray-900 text-lg mb-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Install VintageVision
                  </motion.h3>
                  
                  <motion.p
                    className="text-sm text-gray-600 leading-relaxed"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Get the full app experience with offline access, faster loading, and native notifications
                  </motion.p>
                </div>
                
                <MagneticButton
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="!p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </MagneticButton>
              </div>
            </div>

            {/* Features */}
            <motion.div
              className="px-4 py-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { icon: "⚡", text: "Instant Loading" },
                  { icon: "📱", text: "Native Feel" },
                  { icon: "🔔", text: "Push Notifications" },
                  { icon: "📶", text: "Offline Access" }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    className="flex items-center gap-2 text-gray-600"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <span className="text-base">{feature.icon}</span>
                    <span className="font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <div className="p-4 pt-3">
              <div className="flex gap-3">
                <LiquidButton
                  onClick={handleInstall}
                  disabled={installing}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  {installing ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Installing...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Install App</span>
                    </>
                  )}
                </LiquidButton>
                
                <MagneticButton
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="px-3"
                >
                  Later
                </MagneticButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* iOS Instructions Modal */}
      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowIOSInstructions(false)}
          >
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-6" gradient="cool">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900">
                    Install on iOS
                  </h3>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 font-bold text-sm">1</span>
                      </div>
                      <p className="text-gray-700">Tap the Share button in Safari</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 font-bold text-sm">2</span>
                      </div>
                      <p className="text-gray-700">Scroll down and tap "Add to Home Screen"</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 font-bold text-sm">3</span>
                      </div>
                      <p className="text-gray-700">Tap "Add" to install VintageVision</p>
                    </div>
                  </div>
                  
                  <MagneticButton
                    onClick={() => setShowIOSInstructions(false)}
                    variant="primary"
                    size="md"
                    className="w-full mt-6"
                  >
                    <Check className="w-4 h-4" />
                    <span>Got it!</span>
                  </MagneticButton>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
