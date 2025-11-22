import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Search,
  Heart,
  Star,
  Command
} from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import UserMenu from '@/components/shared/UserMenu'
import { useCommandPalette } from '@/components/ui/CommandPalette'
import { cn, trackEvent, isStandalone } from '@/lib/utils'

interface PremiumHeaderProps {
  onReset?: () => void
}

export default function PremiumHeader({ onReset }: PremiumHeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, redirectToLogin } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const { toggle: toggleCommandPalette, CommandPalette } = useCommandPalette()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogoClick = () => {
    navigate('/')
    onReset?.()
    trackEvent('logo_click')
  }

  const navigationItems = [
    {
      id: 'identify',
      label: 'Identify',
      icon: Search,
      path: '/',
      description: 'AI item identification'
    },
    {
      id: 'collection',
      label: 'Collection',
      icon: Heart,
      path: '/collection',
      description: 'Your saved items',
      requiresAuth: true
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Star,
      path: '/wishlist',
      description: 'Items you want',
      requiresAuth: true
    }
  ]

  const isCurrentPath = (path: string) => location.pathname === path

  return (
    <>
      <motion.header
        className={cn(
          'sticky top-0 z-50 transition-all duration-500',
          scrolled || isStandalone() 
            ? 'py-2' 
            : 'py-4'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard
            className={cn(
              'transition-all duration-500 !overflow-visible',
              scrolled ? 'py-3 px-4' : 'py-4 px-6'
            )}
            gradient="default"
            blur="xl"
          >
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={handleLogoClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="relative w-10 h-10 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Sparkles className="w-6 h-6 text-white drop-shadow-sm" />
                  
                  {/* Floating sparkle */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                </motion.div>
                
                <div className="hidden sm:block">
                  <motion.h1 
                    className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    VintageVision
                  </motion.h1>
                  <motion.p 
                    className="text-xs text-gray-600 group-hover:text-amber-600 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    AI Antique Expert
                  </motion.p>
                </div>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-2">
                {navigationItems.map((item, index) => {
                  if (item.requiresAuth && !user) return null
                  
                  const isActive = isCurrentPath(item.path)
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path)
                        trackEvent('nav_click', { item: item.id })
                      }}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300',
                        isActive
                          ? 'bg-amber-100/70 text-amber-700 shadow-sm'
                          : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50/50'
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="hidden xl:inline">{item.label}</span>
                    </motion.button>
                  )
                })}
                
                {/* Command Palette Trigger */}
                <MagneticButton
                  onClick={toggleCommandPalette}
                  variant="ghost"
                  size="sm"
                  className="!p-2"
                >
                  <Command className="w-4 h-4" />
                </MagneticButton>
              </nav>

              {/* User Section */}
              <div className="flex items-center gap-3">
                {user ? (
                  <UserMenu />
                ) : (
                  <MagneticButton
                    onClick={() => {
                      redirectToLogin()
                      trackEvent('sign_in_click', { location: 'header' })
                    }}
                    variant="primary"
                    size="md"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Sign In</span>
                  </MagneticButton>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.header>

      {/* Command Palette */}
      <CommandPalette />
    </>
  )
}
