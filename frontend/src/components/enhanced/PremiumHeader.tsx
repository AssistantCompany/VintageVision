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
import { Button } from '@/components/ui/button'
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
          {/* Glass header card */}
          <div
            className={cn(
              'glass-brass rounded-lg transition-all duration-500',
              scrolled ? 'py-3 px-4' : 'py-4 px-6'
            )}
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
                  className="relative w-10 h-10 bg-gradient-to-br from-primary via-brass-light to-primary rounded-lg flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Sparkles className="w-6 h-6 text-primary-foreground drop-shadow-sm" />

                  {/* Floating sparkle */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-brass-light rounded-full"
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
                    className="text-xl font-display font-bold text-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    VintageVision
                  </motion.h1>
                  <motion.p
                    className="text-xs text-muted-foreground group-hover:text-primary transition-colors"
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
                        'flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300',
                        isActive
                          ? 'bg-primary/20 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
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
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={toggleCommandPalette}
                  className="text-muted-foreground"
                >
                  <Command className="w-4 h-4" />
                </Button>
              </nav>

              {/* User Section */}
              <div className="flex items-center gap-3">
                {user ? (
                  <UserMenu />
                ) : (
                  <Button
                    variant="brass"
                    size="default"
                    onClick={() => {
                      redirectToLogin()
                      trackEvent('sign_in_click', { location: 'header' })
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Command Palette */}
      <CommandPalette />
    </>
  )
}
