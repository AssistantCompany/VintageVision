import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@getmocha/users-service/react'
import { 
  ArrowLeft, 
  User, 
  Settings, 
  Crown, 
  Calendar,
  Mail,
  Shield,
  Star,
  Heart,
  TrendingUp,
  Download,
  Trash2
} from 'lucide-react'
import GlassCard from '@/react-app/components/ui/GlassCard'
import MagneticButton from '@/react-app/components/ui/MagneticButton'
import LiquidButton from '@/react-app/components/ui/LiquidButton'
import AnimatedBackground from '@/react-app/components/ui/AnimatedBackground'
import FloatingParticles from '@/react-app/components/ui/FloatingParticles'
import { useVintageAnalysis } from '@/react-app/hooks/useVintageAnalysis'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { getCollection, getWishlist } = useVintageAnalysis()
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    collectionSize: 0,
    wishlistSize: 0,
    memberSince: '',
    totalValue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    loadUserStats()
  }, [user, navigate])

  const loadUserStats = async () => {
    setLoading(true)
    try {
      const [collection, wishlist] = await Promise.all([
        getCollection(),
        getWishlist()
      ])

      const totalValue = collection.reduce((sum: number, item: any) => {
        const min = item.analysis?.estimatedValueMin || 0
        const max = item.analysis?.estimatedValueMax || 0
        return sum + ((min + max) / 2)
      }, 0)

      setStats({
        totalAnalyses: collection.length,
        collectionSize: collection.length,
        wishlistSize: wishlist.length,
        memberSince: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently',
        totalValue
      })
    } catch (error) {
      console.error('Failed to load user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const achievements = [
    {
      icon: Star,
      title: 'First Discovery',
      description: 'Identified your first vintage item',
      unlocked: stats.totalAnalyses > 0,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Heart,
      title: 'Collector',
      description: 'Saved 10 items to your collection',
      unlocked: stats.collectionSize >= 10,
      color: 'from-pink-400 to-red-500'
    },
    {
      icon: Crown,
      title: 'Connoisseur',
      description: 'Identified 50 vintage items',
      unlocked: stats.totalAnalyses >= 50,
      color: 'from-purple-400 to-indigo-500'
    },
    {
      icon: TrendingUp,
      title: 'Investor',
      description: 'Collection worth over $10,000',
      unlocked: stats.totalValue >= 10000,
      color: 'from-emerald-400 to-green-500'
    }
  ]

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen">
      <AnimatedBackground variant="warm" />
      <FloatingParticles count={40} className="opacity-20" />
      
      {/* Header */}
      <div className="relative z-10 p-4">
        <GlassCard className="p-4" blur="lg">
          <MagneticButton
            onClick={() => navigate('/')}
            variant="ghost"
            size="md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </MagneticButton>
        </GlassCard>
      </div>

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8" gradient="warm">
              <div className="flex items-start gap-6">
                {user.google_user_data.picture ? (
                  <motion.img
                    src={user.google_user_data.picture}
                    alt={user.google_user_data.name || user.email}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white/50 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center border-4 border-white/50 shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user.google_user_data.name || user.email.split('@')[0]}
                    </h1>
                    <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      <Crown className="w-4 h-4" />
                      Pro Member
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {stats.memberSince}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <LiquidButton
                      onClick={() => navigate('/preferences')}
                      variant="secondary"
                      size="sm"
                    >
                      <Settings className="w-4 h-4" />
                      Edit Profile
                    </LiquidButton>
                    
                    <MagneticButton
                      onClick={() => navigate('/collection')}
                      variant="glass"
                      size="sm"
                    >
                      <Heart className="w-4 h-4" />
                      View Collection
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              {
                label: 'Items Analyzed',
                value: stats.totalAnalyses,
                icon: Star,
                color: 'from-blue-400 to-cyan-500'
              },
              {
                label: 'Collection Size',
                value: stats.collectionSize,
                icon: Heart,
                color: 'from-pink-400 to-red-500'
              },
              {
                label: 'Wishlist Items',
                value: stats.wishlistSize,
                icon: Star,
                color: 'from-purple-400 to-indigo-500'
              },
              {
                label: 'Collection Value',
                value: `$${stats.totalValue.toLocaleString()}`,
                icon: TrendingUp,
                color: 'from-emerald-400 to-green-500'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard className="p-6 text-center" hover>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {loading ? '...' : stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Achievements */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Achievements</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GlassCard 
                    className={`p-6 text-center ${achievement.unlocked ? '' : 'opacity-50'}`}
                    hover={achievement.unlocked}
                    gradient={achievement.unlocked ? 'warm' : 'default'}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <achievement.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    {achievement.unlocked && (
                      <motion.div
                        className="mt-3 text-xs font-medium text-green-600"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        ✓ Unlocked
                      </motion.div>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <GlassCard className="p-8" gradient="cool">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.button
                  onClick={() => navigate('/preferences')}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100/70 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <Settings className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Preferences</div>
                    <div className="text-sm text-gray-600">Customize your experience</div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => navigate('/pricing')}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-amber-100/70 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <Crown className="w-6 h-6 text-amber-600" />
                  <div>
                    <div className="font-medium text-amber-700">Subscription</div>
                    <div className="text-sm text-amber-600">Manage your plan</div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => navigate('/privacy')}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100/70 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <Shield className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Privacy</div>
                    <div className="text-sm text-gray-600">Data and privacy settings</div>
                  </div>
                </motion.button>

                <motion.button
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100/70 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <Download className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Export Data</div>
                    <div className="text-sm text-gray-600">Download your data</div>
                  </div>
                </motion.button>

                <motion.button
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-red-100/70 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <Trash2 className="w-6 h-6 text-red-600" />
                  <div>
                    <div className="font-medium text-red-700">Delete Account</div>
                    <div className="text-sm text-red-600">Permanently delete account</div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => logout()}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-red-100/70 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <ArrowLeft className="w-6 h-6 text-red-600" />
                  <div>
                    <div className="font-medium text-red-700">Sign Out</div>
                    <div className="text-sm text-red-600">Log out of your account</div>
                  </div>
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
