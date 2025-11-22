import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Heart, 
  User, 
  LogOut, 
  Settings,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onReset?: () => void;
}

export default function Header({ onReset }: HeaderProps) {
  const navigate = useNavigate();
  const { user, redirectToLogin, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
    onReset?.();
  };

  return (
    <header className="border-b border-amber-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">VintageVision</h1>
              <p className="text-xs text-gray-600">Discover the story behind every treasure</p>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors"
              >
                <Search className="w-4 h-4" />
                Identify
              </button>
              
              {user && (
                <>
                  <button
                    onClick={() => navigate('/collection')}
                    className="flex items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    Collection
                  </button>
                  <button
                    onClick={() => navigate('/wishlist')}
                    className="flex items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    Wishlist
                  </button>
                </>
              )}
              
              <a href="#" className="flex items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors">
                <BookOpen className="w-4 h-4" />
                Learn
              </a>
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName || user.email}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.displayName || user.email}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          navigate('/preferences');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Preferences
                      </button>
                      
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={redirectToLogin}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
