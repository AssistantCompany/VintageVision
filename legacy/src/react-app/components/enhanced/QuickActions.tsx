import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@getmocha/users-service/react'
import { 
  Zap, 
  Camera, 
  Heart, 
  Star, 
  X,
  Plus,
  ArrowRight
} from 'lucide-react'
import GlassCard from '@/react-app/components/ui/GlassCard'
import { useNotifications } from '@/react-app/components/enhanced/NotificationSystem'
import { cn, vibrate, trackEvent } from '@/react-app/lib/utils'

interface QuickActionsProps {
  onQuickScan?: () => void
  className?: string
}

export default function QuickActions({ onQuickScan, className }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { user, redirectToLogin } = useAuth()
  const notifications = useNotifications()

  const actions = [
    {
      id: 'scan',
      label: 'Quick Scan',
      description: 'Take a photo to analyze',
      icon: Camera,
      gradient: 'from-blue-500 to-cyan-500',
      onClick: () => {
        setIsOpen(false)
        onQuickScan?.()
        vibrate(50)
        trackEvent('quick_action_scan')
      }
    },
    {
      id: 'collection',
      label: 'My Collection',
      description: 'View saved items',
      icon: Heart,
      gradient: 'from-rose-500 to-pink-500',
      requiresAuth: true,
      onClick: () => {
        setIsOpen(false)
        if (!user) {
          notifications.info('Please sign in to view your collection')
          redirectToLogin()
          return
        }
        navigate('/collection')
        vibrate(50)
        trackEvent('quick_action_collection')
      }
    },
    {
      id: 'wishlist',
      label: 'My Wishlist',
      description: 'Items you want to find',
      icon: Star,
      gradient: 'from-amber-500 to-orange-500',
      requiresAuth: true,
      onClick: () => {
        setIsOpen(false)
        if (!user) {
          notifications.info('Please sign in to access your wishlist')
          redirectToLogin()
          return
        }
        console.log('Navigating to wishlist for user:', user.id)
        navigate('/wishlist')
        vibrate(50)
        trackEvent('quick_action_wishlist')
      }
    }
  ]

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    vibrate(30)
    trackEvent('quick_actions_toggle', { isOpen: !isOpen })
  }

  return (
    <div className={cn('fixed bottom-24 right-4 z-40', className)}>
      {/* Quick Actions Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Actions List */}
            <motion.div
              className="absolute bottom-20 right-0 w-72"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <GlassCard className="overflow-hidden" gradient="default" shadow="2xl">
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900">Quick Actions</h3>
                    </div>
                    
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-6 h-6 bg-gray-100/50 hover:bg-gray-200/50 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2">
                  {actions.map((action, index) => (
                    <motion.button
                      key={action.id}
                      onClick={action.onClick}
                      className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300',
                        'hover:bg-white/50 active:scale-[0.98]',
                        action.requiresAuth && !user && 'opacity-60'
                      )}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Icon */}
                      <motion.div
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
                          `bg-gradient-to-r ${action.gradient}`
                        )}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <action.icon className="w-6 h-6 text-white" />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{action.label}</h4>
                          {action.requiresAuth && !user && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              Sign in required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{action.description}</p>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  ))}
                </div>

                {/* Add New Action Hint */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Plus className="w-4 h-4" />
                    <span>More actions coming soon!</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onClick={toggleMenu}
        className={cn(
          'relative w-16 h-16 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full',
          'shadow-2xl hover:shadow-3xl flex items-center justify-center overflow-hidden',
          'hover:scale-110 active:scale-95 transition-all duration-300',
          'focus:outline-none focus:ring-4 focus:ring-amber-500/30'
        )}
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 20px 40px rgba(245, 158, 11, 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 10px 30px rgba(245, 158, 11, 0.3)",
            "0 15px 35px rgba(245, 158, 11, 0.4)",
            "0 10px 30px rgba(245, 158, 11, 0.3)"
          ]
        }}
        transition={{ 
          boxShadow: { duration: 2, repeat: Infinity },
          scale: { type: "spring", stiffness: 400, damping: 17 }
        }}
      >
        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Icon */}
        <motion.div
          animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {isOpen ? (
            <X className="w-8 h-8 text-white drop-shadow-sm" />
          ) : (
            <Zap className="w-8 h-8 text-white drop-shadow-sm" />
          )}
        </motion.div>

        {/* Ripple Effect */}
        <motion.div
          className="absolute inset-0 bg-white rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ 
            scale: 2,
            opacity: [0.3, 0],
            transition: { duration: 0.4 }
          }}
        />

        {/* Tooltip */}
        {!isOpen && (
          <motion.div
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
              Quick Actions
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
            </div>
          </motion.div>
        )}
      </motion.button>
    </div>
  )
}
