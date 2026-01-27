import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Heart,
  Star,
  User,
  Settings,
  Crown,
  Zap,
  HelpCircle,
  LogOut
} from 'lucide-react'

export default function UserMenu() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  if (!user) return null

  return (
    <div className="relative z-[101]">
      <motion.button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {user.avatarUrl && (
          <img
            src={user.avatarUrl}
            alt={user.displayName || user.email}
            className="w-6 h-6 rounded-full"
          />
        )}
        <div className="text-left">
          <div className="text-sm font-medium text-foreground">
            {user.displayName || user.email.split('@')[0]}
          </div>
          <div className="text-xs text-amber-600 flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Pro Member
          </div>
        </div>
      </motion.button>

      {/* User Dropdown Menu */}
      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-border/50 overflow-hidden z-[9999]"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-border bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="flex items-center gap-3">
                {user.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName || user.email}
                    className="w-12 h-12 rounded-full border-2 border-amber-200"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground truncate">
                    {user.displayName || user.email}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3 text-amber-600" />
                    <span className="text-xs text-amber-600 font-medium">Pro Member</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Actions */}
            <div className="py-2">
              <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Main
              </div>
              <button
                onClick={() => { navigate('/app'); setShowUserMenu(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-amber-50 flex items-center gap-3 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="font-medium">Analyze Items</span>
              </button>
              <button
                onClick={() => { navigate('/collection'); setShowUserMenu(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-pink-50 flex items-center gap-3 transition-colors"
              >
                <Heart className="w-4 h-4 text-pink-600" />
                <span className="font-medium">My Collection</span>
              </button>
              <button
                onClick={() => { navigate('/wishlist'); setShowUserMenu(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-yellow-50 flex items-center gap-3 transition-colors"
              >
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="font-medium">Wishlist</span>
              </button>
            </div>

            {/* Settings Section */}
            <div className="border-t border-border py-2">
              <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Settings
              </div>
              <button
                onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-blue-50 flex items-center gap-3 transition-colors"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Profile</span>
              </button>
              <button
                onClick={() => { navigate('/preferences'); setShowUserMenu(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted/50 flex items-center gap-3 transition-colors"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Preferences</span>
              </button>
            </div>

            {/* Account Management */}
            <div className="border-t border-border py-2">
              <button
                onClick={() => { navigate('/pricing'); setShowUserMenu(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-purple-50 flex items-center gap-3 transition-colors"
              >
                <Zap className="w-4 h-4 text-purple-600" />
                <div>
                  <div className="font-medium">Upgrade Plan</div>
                  <div className="text-xs text-muted-foreground">Unlock more features</div>
                </div>
              </button>
              <button
                onClick={() => { navigate('/help'); setShowUserMenu(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-green-50 flex items-center gap-3 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">Help & Support</span>
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-border py-2">
              <button
                onClick={logout}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
