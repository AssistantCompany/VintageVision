import { useState, useEffect } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Camera, 
  Heart, 
  Star, 
  Settings, 
  User,
  Home,
  LogOut,
  Sparkles
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@getmocha/users-service/react'
import GlassCard from './GlassCard'
import { cn, trackEvent } from '@/react-app/lib/utils'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const commands = [
  {
    id: 'identify',
    label: 'Identify Item',
    description: 'Take a photo or upload an image',
    icon: Camera,
    action: 'navigate',
    path: '/',
    shortcut: 'I'
  },
  {
    id: 'collection',
    label: 'My Collection',
    description: 'View your saved vintage items',
    icon: Heart,
    action: 'navigate',
    path: '/collection',
    shortcut: 'C',
    requiresAuth: true
  },
  {
    id: 'wishlist',
    label: 'Wishlist',
    description: 'Items you want to find',
    icon: Star,
    action: 'navigate',
    path: '/wishlist',
    shortcut: 'W',
    requiresAuth: true
  },
  {
    id: 'preferences',
    label: 'Preferences',
    description: 'Customize your experience',
    icon: Settings,
    action: 'navigate',
    path: '/preferences',
    shortcut: 'P',
    requiresAuth: true
  },
  {
    id: 'pricing',
    label: 'Upgrade to Pro',
    description: 'Unlock unlimited identifications',
    icon: Sparkles,
    action: 'navigate',
    path: '/pricing',
    shortcut: 'U'
  },
  {
    id: 'home',
    label: 'Home',
    description: 'Return to main page',
    icon: Home,
    action: 'navigate',
    path: '/',
    shortcut: 'H'
  }
]

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
        trackEvent('command_palette_toggle', { method: 'keyboard' })
      }
      
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  const handleSelect = (command: any) => {
    trackEvent('command_palette_select', { commandId: command.id })
    
    switch (command.action) {
      case 'navigate':
        navigate(command.path)
        break
      case 'logout':
        logout()
        break
      default:
        break
    }
    
    onOpenChange(false)
    setSearch('')
  }

  const filteredCommands = commands.filter(cmd => {
    if (cmd.requiresAuth && !user) return false
    return cmd.label.toLowerCase().includes(search.toLowerCase()) ||
           cmd.description.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />

          {/* Command Palette */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <GlassCard className="overflow-hidden shadow-2xl" gradient="default">
              <Command className="w-full">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200/50">
                  <Search className="w-5 h-5 text-gray-400" />
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Search commands..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-lg"
                  />
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-300 text-gray-600">
                      Esc
                    </kbd>
                  </div>
                </div>

                {/* Commands List */}
                <Command.List className="max-h-96 overflow-y-auto p-2">
                  <Command.Empty className="p-8 text-center text-gray-500">
                    No commands found.
                  </Command.Empty>

                  {/* Main Commands */}
                  <Command.Group heading="Actions" className="mb-4">
                    {filteredCommands.map((command) => (
                      <Command.Item
                        key={command.id}
                        value={command.label}
                        onSelect={() => handleSelect(command)}
                        className="group"
                      >
                        <motion.div
                          className={cn(
                            'flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200',
                            'hover:bg-gray-100/70 cursor-pointer',
                            'data-[selected]:bg-amber-100/70 data-[selected]:text-amber-900'
                          )}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <command.icon className="w-4 h-4 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 group-hover:text-amber-900 transition-colors">
                              {command.label}
                            </div>
                            <div className="text-sm text-gray-500 group-hover:text-amber-700 transition-colors">
                              {command.description}
                            </div>
                          </div>
                          
                          {command.shortcut && (
                            <kbd className="px-2 py-1 text-xs bg-gray-200/70 rounded border border-gray-300/70 text-gray-600 group-hover:bg-amber-200/70 group-hover:text-amber-800 transition-colors">
                              {command.shortcut}
                            </kbd>
                          )}
                        </motion.div>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  {/* User Commands */}
                  {user && (
                    <Command.Group heading="Account" className="border-t border-gray-200/50 pt-2">
                      <Command.Item
                        value="profile"
                        onSelect={() => handleSelect({ action: 'navigate', path: '/profile' })}
                        className="group"
                      >
                        <motion.div
                          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100/70 cursor-pointer transition-all duration-200"
                          whileHover={{ x: 4 }}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{user.google_user_data.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </motion.div>
                      </Command.Item>

                      <Command.Item
                        value="logout"
                        onSelect={() => handleSelect({ action: 'logout' })}
                        className="group"
                      >
                        <motion.div
                          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-100/70 cursor-pointer transition-all duration-200"
                          whileHover={{ x: 4 }}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-500 rounded-lg flex items-center justify-center">
                            <LogOut className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 group-hover:text-red-900">Sign Out</div>
                            <div className="text-sm text-gray-500 group-hover:text-red-700">Log out of your account</div>
                          </div>
                        </motion.div>
                      </Command.Item>
                    </Command.Group>
                  )}
                </Command.List>

                {/* Footer */}
                <div className="border-t border-gray-200/50 p-3 bg-gray-50/50">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <kbd className="px-1.5 py-0.5 bg-gray-200 rounded border">↑↓</kbd>
                      <span>Navigate</span>
                      <kbd className="px-1.5 py-0.5 bg-gray-200 rounded border">↵</kbd>
                      <span>Select</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-200 rounded border">⌘</kbd>
                      <kbd className="px-1.5 py-0.5 bg-gray-200 rounded border">K</kbd>
                      <span>to toggle</span>
                    </div>
                  </div>
                </div>
              </Command>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook for using command palette
export function useCommandPalette() {
  const [open, setOpen] = useState(false)

  const toggle = () => {
    setOpen(!open)
    trackEvent('command_palette_toggle', { method: 'function' })
  }

  return {
    open,
    setOpen,
    toggle,
    CommandPalette: ({ className }: { className?: string }) => (
      <div className={className}>
        <CommandPalette open={open} onOpenChange={setOpen} />
      </div>
    )
  }
}
