import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  Search,
  Heart,
  Star,
  User,
  Settings,
  X,
  Sparkles,
  Camera,
  Bell,
  Crown
} from 'lucide-react'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import { useCollectionCounts } from '@/hooks/useCollectionCounts'

import { GlassCard } from '@/components/ui/glass-card'
import { cn, vibrate } from '@/lib/utils'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  path: string
  badge?: number
  requiresAuth?: boolean
  primary?: boolean
}

export default function MobileNavigation() {
  const { user, redirectToLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const deviceInfo = useMobileDetection()
  const { counts } = useCollectionCounts()
  const [showMenu, setShowMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('/')

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Identify',
      icon: Search,
      path: '/',
      primary: true
    },
    {
      id: 'collection',
      label: 'Collection',
      icon: Heart,
      path: '/collection',
      requiresAuth: true,
      badge: counts.collection
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Star,
      path: '/wishlist',
      requiresAuth: true,
      badge: counts.wishlist
    },
    {
      id: 'profile',
      label: user ? 'Profile' : 'Sign In',
      icon: User,
      path: user ? '/preferences' : '/auth/login',
      requiresAuth: false
    }
  ]

  useEffect(() => {
    setActiveTab(location.pathname)
  }, [location.pathname])

  

  const handleNavigation = (item: NavigationItem) => {
    vibrate(30)
    
    if (item.requiresAuth && !user) {
      redirectToLogin()
      return
    }
    
    if (item.id === 'profile' && !user) {
      redirectToLogin()
      return
    }
    
    navigate(item.path)
    setShowMenu(false)
  }

  

  // Don't show on desktop
  if (deviceInfo.isDesktop) return null

  return (
    <>
      {/* Bottom Tab Bar */}
      <motion.div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40',
          deviceInfo.hasNotchSupport && 'pb-safe-area-inset-bottom'
        )}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <GlassCard className="mx-4 mb-4 overflow-hidden">
          <div className="flex items-center justify-around p-2">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.path
              const Icon = item.icon
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={cn(
                    'flex flex-col items-center justify-center p-3 min-h-12 rounded-xl transition-all duration-300 relative',
                    isActive 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/10',
                    item.primary && 'scale-110'
                  )}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: isActive ? 1 : 1.05 }}
                >
                  <Icon className={cn(
                    'mb-1',
                    item.primary ? 'w-6 h-6' : 'w-5 h-5'
                  )} />
                  
                  <span className={cn(
                    'text-xs font-medium',
                    item.primary && 'text-xs'
                  )}>
                    {item.label}
                  </span>
                  
                  {/* Badge */}
                  {item.badge && item.badge > 0 && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {item.badge}
                    </motion.div>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0, x: '-50%' }}
                      animate={{ scale: 1, x: '-50%' }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Floating Action Button for Camera - Only show on home/app pages */}
      {(location.pathname === '/' || location.pathname === '/app') && (
      <motion.div
        className={cn(
          'fixed right-4 z-50',
          deviceInfo.hasNotchSupport
            ? 'bottom-32'
            : 'bottom-28'
        )}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
      >
        <motion.button
          onClick={() => {
            vibrate(100)
            // Navigate to home page first
            navigate('/')
            // Small delay to trigger upload after navigation
            setTimeout(() => {
              const cameraButton = document.querySelector('[data-camera-trigger]') as HTMLButtonElement
              const browseButton = document.querySelector('[data-testid="browse-upload-trigger"]') as HTMLButtonElement
              const fileInput = document.querySelector('[data-testid="file-input-upload"]') as HTMLInputElement
              
              if (cameraButton) {
                cameraButton.click()
              } else if (browseButton) {
                browseButton.click()
              } else if (fileInput) {
                fileInput.click()
              }
            }, 100)
          }}
          className="w-14 h-14 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-xl flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          animate={{
            boxShadow: [
              "0 10px 30px rgba(245, 158, 11, 0.3)",
              "0 10px 40px rgba(245, 158, 11, 0.5)",
              "0 10px 30px rgba(245, 158, 11, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Camera className="w-7 h-7 text-white" />
        </motion.button>
      </motion.div>
      )}

      {/* Side Menu for Additional Options */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
            />
            
            {/* Side Menu */}
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] z-50"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: -100, right: 0 }}
              
            >
              <GlassCard className="h-full m-0 rounded-none rounded-r-2xl">
                <div className={cn(
                  'p-6 h-full overflow-y-auto',
                  deviceInfo.hasNotchSupport && 'pt-safe-area-inset-top'
                )}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-foreground">VintageVision</h2>
                        <p className="text-sm text-muted-foreground">AI Antique Expert</p>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => setShowMenu(false)}
                      className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </motion.button>
                  </div>

                  {/* User Info */}
                  {user && (
                    <div className="mb-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.displayName || user.email}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-primary">
                            {user.displayName || user.email.split('@')[0]}
                          </h3>
                          <p className="text-sm text-primary/80">Pro Member</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Menu Items */}
                  <div className="space-y-2">
                    {[
                      { icon: Crown, label: 'Pro Tools', path: '/premium' },
                      { icon: Settings, label: 'Preferences', path: '/preferences' },
                      { icon: Bell, label: 'Notifications', path: '/notifications' },
                      { icon: Sparkles, label: 'Upgrade', path: '/pricing' },
                    ].map((menuItem, index) => (
                      <motion.button
                        key={menuItem.label}
                        onClick={() => {
                          navigate(menuItem.path)
                          setShowMenu(false)
                          vibrate(30)
                        }}
                        className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-muted/70 transition-colors text-left"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <menuItem.icon className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium text-foreground">{menuItem.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Swipe hint for first-time users */}
      {!user && (
        <motion.div
          className="fixed left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: [0, 1, 0], x: [0, 20, 0] }}
          transition={{ duration: 2, repeat: 3, delay: 2 }}
        >
          <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Swipe →
          </div>
        </motion.div>
      )}
    </>
  )
}
