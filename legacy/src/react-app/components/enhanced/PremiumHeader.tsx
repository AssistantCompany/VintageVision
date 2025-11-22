import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@getmocha/users-service/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Search, 
  Heart, 
  Star, 
  User, 
  LogOut, 
  Settings,
  Command,
  Crown,
  Zap,
  Menu,
  X
} from 'lucide-react'
import GlassCard from '@/react-app/components/ui/GlassCard'
import MagneticButton from '@/react-app/components/ui/MagneticButton'
import { useCommandPalette } from '@/react-app/components/ui/CommandPalette'
import { cn, trackEvent, isStandalone } from '@/react-app/lib/utils'

interface PremiumHeaderProps {
  onReset?: () => void
}

export default function PremiumHeader({ onReset }: PremiumHeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, redirectToLogin, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
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
              'transition-all duration-500',
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
                  <div className="relative">
                    <MagneticButton
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      variant="glass"
                      size="md"
                      className="flex items-center gap-2"
                    >
                      {user.google_user_data.picture ? (
                        <motion.img 
                          src={user.google_user_data.picture} 
                          alt={user.google_user_data.name || user.email}
                          className="w-8 h-8 rounded-full object-cover border-2 border-white/50"
                          whileHover={{ scale: 1.1 }}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {user.google_user_data.given_name || user.email.split('@')[0]}
                        </div>
                        <div className="text-xs text-amber-600 flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Pro Member
                        </div>
                      </div>
                    </MagneticButton>

                    <AnimatePresence>
                      {showUserMenu && (
                        <>
                          {/* Backdrop */}
                          <motion.div
                            className="fixed inset-0 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUserMenu(false)}
                          />
                          
                          {/* Menu */}
                          <motion.div
                            className="absolute right-0 top-full mt-2 w-64 z-50"
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          >
                            <GlassCard gradient="default" className="overflow-hidden">
                              {/* User Info */}
                              <div className="p-4 border-b border-gray-200/50">
                                <div className="flex items-center gap-3">
                                  {user.google_user_data.picture ? (
                                    <img 
                                      src={user.google_user_data.picture} 
                                      alt={user.google_user_data.name || user.email}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                      <User className="w-6 h-6 text-white" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 truncate">
                                      {user.google_user_data.name || user.email}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate">{user.email}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Crown className="w-3 h-3 text-amber-500" />
                                      <span className="text-xs text-amber-600 font-medium">Pro Member</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Menu Items */}
                              <div className="p-2">
                                <motion.button
                                  onClick={() => {
                                    navigate('/profile')
                                    setShowUserMenu(false)
                                    trackEvent('user_menu_click', { item: 'profile' })
                                  }}
                                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-100/70 transition-colors text-left"
                                  whileHover={{ x: 4 }}
                                >
                                  <User className="w-5 h-5 text-blue-600" />
                                  <div>
                                    <div className="font-medium text-blue-700">Profile</div>
                                    <div className="text-sm text-blue-600">View your account</div>
                                  </div>
                                </motion.button>
                                
                                <motion.button
                                  onClick={() => {
                                    navigate('/preferences')
                                    setShowUserMenu(false)
                                    trackEvent('user_menu_click', { item: 'preferences' })
                                  }}
                                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100/70 transition-colors text-left"
                                  whileHover={{ x: 4 }}
                                >
                                  <Settings className="w-5 h-5 text-gray-600" />
                                  <div>
                                    <div className="font-medium text-gray-900">Preferences</div>
                                    <div className="text-sm text-gray-500">Customize your experience</div>
                                  </div>
                                </motion.button>
                                
                                <motion.button
                                  onClick={() => {
                                    navigate('/pricing')
                                    setShowUserMenu(false)
                                    trackEvent('user_menu_click', { item: 'upgrade' })
                                  }}
                                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-amber-100/70 transition-colors text-left"
                                  whileHover={{ x: 4 }}
                                >
                                  <Zap className="w-5 h-5 text-amber-600" />
                                  <div>
                                    <div className="font-medium text-amber-700">Upgrade Plan</div>
                                    <div className="text-sm text-amber-600">Unlock more features</div>
                                  </div>
                                </motion.button>
                                
                                <div className="border-t border-gray-200/50 my-2" />
                                
                                <motion.button
                                  onClick={() => {
                                    logout()
                                    setShowUserMenu(false)
                                    trackEvent('user_menu_click', { item: 'logout' })
                                  }}
                                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-100/70 transition-colors text-left"
                                  whileHover={{ x: 4 }}
                                >
                                  <LogOut className="w-5 h-5 text-red-600" />
                                  <div>
                                    <div className="font-medium text-red-700">Sign Out</div>
                                    <div className="text-sm text-red-600">Log out of your account</div>
                                  </div>
                                </motion.button>
                              </div>
                            </GlassCard>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
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

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                  <MagneticButton
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    variant="ghost"
                    size="sm"
                    className="!p-2"
                  >
                    {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </MagneticButton>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              className="lg:hidden absolute top-full left-0 right-0 z-40"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mx-4 mt-2">
                <GlassCard gradient="default" className="p-4">
                  <div className="space-y-2">
                    {navigationItems.map((item) => {
                      if (item.requiresAuth && !user) return null
                      
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => {
                            navigate(item.path)
                            setShowMobileMenu(false)
                            trackEvent('mobile_nav_click', { item: item.id })
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100/70 transition-colors text-left"
                          whileHover={{ x: 4 }}
                        >
                          <item.icon className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900">{item.label}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                          </div>
                        </motion.button>
                      )
                    })}
                    
                    <motion.button
                      onClick={() => {
                        toggleCommandPalette()
                        setShowMobileMenu(false)
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100/70 transition-colors text-left"
                      whileHover={{ x: 4 }}
                    >
                      <Command className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">Command Palette</div>
                        <div className="text-sm text-gray-500">Quick navigation</div>
                      </div>
                    </motion.button>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Command Palette */}
      <CommandPalette />
    </>
  )
}
