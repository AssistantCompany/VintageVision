import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Star, 
  Search, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Clock,
  ExternalLink,
  Bell,
  BellOff
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PremiumHeader from '@/components/enhanced/PremiumHeader'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import LiquidButton from '@/components/ui/LiquidButton'
import SpotlightEffect from '@/components/ui/SpotlightEffect'
import FloatingParticles from '@/components/ui/FloatingParticles'
import { useNotifications } from '@/components/enhanced/NotificationSystem'
import { cn, formatCurrency, formatRelativeTime, trackEvent } from '@/lib/utils'

interface WishlistItem {
  id: string
  item_analysis_id?: string
  name?: string
  search_criteria: {
    style?: string
    era?: string
    priceRange?: { min: number; max: number }
    keywords?: string[]
  }
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
  matches?: MarketplaceMatch[]
}

interface MarketplaceMatch {
  id: string
  marketplace_name: string
  link_url: string
  title: string
  price: number
  image_url?: string
  confidence_score: number
  found_at: string
}

export default function PremiumWishlistPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const notifications = useNotifications()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newItem, setNewItem] = useState({
    keywords: '',
    style: '',
    era: '',
    priceMin: '',
    priceMax: '',
    notes: ''
  })

  useEffect(() => {
    console.log('PremiumWishlistPage mounting, user:', user?.id)
    if (user) {
      fetchWishlistItems()
    } else {
      console.log('No user found, redirecting to home')
      notifications.info('Please sign in to access your wishlist')
      navigate('/')
    }
  }, [user, navigate, notifications])

  const fetchWishlistItems = async () => {
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        setWishlistItems(data.items || [])
      }
    } catch (error) {
      notifications.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const handleAddWishlistItem = async () => {
    if (!newItem.keywords.trim()) {
      notifications.error('Please enter search keywords')
      return
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          search_criteria: {
            keywords: newItem.keywords.split(',').map(k => k.trim()),
            style: newItem.style || undefined,
            era: newItem.era || undefined,
            priceRange: newItem.priceMin && newItem.priceMax ? {
              min: parseInt(newItem.priceMin),
              max: parseInt(newItem.priceMax)
            } : undefined
          },
          notes: newItem.notes || undefined
        })
      })

      if (response.ok) {
        const data = await response.json()
        setWishlistItems([data.item, ...wishlistItems])
        setNewItem({ keywords: '', style: '', era: '', priceMin: '', priceMax: '', notes: '' })
        setShowAddForm(false)
        notifications.success('Added to wishlist!')
        trackEvent('wishlist_item_added')
      }
    } catch (error) {
      notifications.error('Failed to add item to wishlist')
    }
  }

  const handleToggleActive = async (itemId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive })
      })

      if (response.ok) {
        setWishlistItems(items =>
          items.map(item =>
            item.id === itemId ? { ...item, is_active: !isActive } : item
          )
        )
        notifications.success(isActive ? 'Notifications paused' : 'Notifications enabled')
        trackEvent('wishlist_toggle_active', { isActive: !isActive })
      }
    } catch (error) {
      notifications.error('Failed to update wishlist item')
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setWishlistItems(items => items.filter(item => item.id !== itemId))
        notifications.success('Removed from wishlist')
        trackEvent('wishlist_item_deleted')
      }
    } catch (error) {
      notifications.error('Failed to remove item')
    }
  }

  const filteredItems = wishlistItems.filter(item => {
    const searchLower = searchQuery.toLowerCase()
    const keywords = item.search_criteria.keywords?.join(' ') || ''
    return (
      keywords.toLowerCase().includes(searchLower) ||
      item.search_criteria.style?.toLowerCase().includes(searchLower) ||
      item.search_criteria.era?.toLowerCase().includes(searchLower) ||
      item.notes?.toLowerCase().includes(searchLower)
    )
  })

  const activeItems = wishlistItems.filter(item => item.is_active).length
  const totalMatches = wishlistItems.reduce((sum, item) => sum + (item.matches?.length || 0), 0)

  if (!user) {
    console.log('PremiumWishlistPage: No user, returning null')
    return null
  }

  console.log('PremiumWishlistPage rendering, loading:', loading, 'items:', wishlistItems.length)

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <FloatingParticles 
          count={60} 
          className="opacity-20"
          colors={['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b']}
        />
      </div>

      <PremiumHeader />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <MagneticButton
              onClick={() => navigate('/')}
              variant="glass"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </MagneticButton>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">
                {wishlistItems.length} searches • {activeItems} active • {totalMatches} matches found
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Searches', value: wishlistItems.length, icon: Search },
              { label: 'Active', value: activeItems, icon: Bell },
              { label: 'Total Matches', value: totalMatches, icon: Star },
              { label: 'This Week', value: wishlistItems.filter(item => new Date(item.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: Clock }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-4 text-center" hover>
                  <stat.icon className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <GlassCard className="p-6" gradient="default">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <LiquidButton
                onClick={() => setShowAddForm(true)}
                variant="primary"
                size="md"
              >
                <Plus className="w-4 h-4" />
                Add Search
              </LiquidButton>
            </div>
          </GlassCard>
        </motion.div>

        {/* Add Form Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <GlassCard className="p-6" gradient="warm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Add to Wishlist</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Keywords *
                      </label>
                      <input
                        type="text"
                        value={newItem.keywords}
                        onChange={(e) => setNewItem(prev => ({ ...prev, keywords: e.target.value }))}
                        placeholder="e.g., vintage lamp, mid-century chair"
                        className="w-full px-3 py-2 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                        <input
                          type="text"
                          value={newItem.style}
                          onChange={(e) => setNewItem(prev => ({ ...prev, style: e.target.value }))}
                          placeholder="e.g., Art Deco"
                          className="w-full px-3 py-2 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Era</label>
                        <input
                          type="text"
                          value={newItem.era}
                          onChange={(e) => setNewItem(prev => ({ ...prev, era: e.target.value }))}
                          placeholder="e.g., 1950s"
                          className="w-full px-3 py-2 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                        <input
                          type="number"
                          value={newItem.priceMin}
                          onChange={(e) => setNewItem(prev => ({ ...prev, priceMin: e.target.value }))}
                          placeholder="100"
                          className="w-full px-3 py-2 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                        <input
                          type="number"
                          value={newItem.priceMax}
                          onChange={(e) => setNewItem(prev => ({ ...prev, priceMax: e.target.value }))}
                          placeholder="500"
                          className="w-full px-3 py-2 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        value={newItem.notes}
                        onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any additional details..."
                        rows={3}
                        className="w-full px-3 py-2 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <LiquidButton
                      onClick={handleAddWishlistItem}
                      variant="primary"
                      size="md"
                      className="flex-1"
                    >
                      Add to Wishlist
                    </LiquidButton>
                    
                    <MagneticButton
                      onClick={() => setShowAddForm(false)}
                      variant="ghost"
                      size="md"
                    >
                      Cancel
                    </MagneticButton>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishlist Items */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Loading your wishlist...</p>
            </motion.div>
          ) : filteredItems.length === 0 ? (
            <motion.div
              key="empty"
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SpotlightEffect>
                <GlassCard className="p-12 max-w-md mx-auto" gradient="warm">
                  <Star className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {searchQuery ? 'No matching searches' : 'Create Your First Search'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery 
                      ? 'Try a different search term to find your wishlist items.'
                      : 'Set up searches for vintage items you want to find, and we\'ll notify you when matches appear on marketplaces.'
                    }
                  </p>
                  {!searchQuery && (
                    <LiquidButton
                      onClick={() => setShowAddForm(true)}
                      variant="primary"
                      size="md"
                    >
                      <Plus className="w-4 h-4" />
                      Add First Search
                    </LiquidButton>
                  )}
                </GlassCard>
              </SpotlightEffect>
            </motion.div>
          ) : (
            <motion.div
              key="items"
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SpotlightEffect>
                    <GlassCard className="overflow-hidden" hover>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">
                              {item.search_criteria.keywords?.join(', ') || 'Search Query'}
                            </h3>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {item.search_criteria.style && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  {item.search_criteria.style}
                                </span>
                              )}
                              {item.search_criteria.era && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {item.search_criteria.era}
                                </span>
                              )}
                              {item.search_criteria.priceRange && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  {formatCurrency(item.search_criteria.priceRange.min)} - {formatCurrency(item.search_criteria.priceRange.max)}
                                </span>
                              )}
                              <span className={cn(
                                'px-2 py-1 rounded-full text-xs font-medium',
                                item.is_active 
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              )}>
                                {item.is_active ? 'Active' : 'Paused'}
                              </span>
                            </div>

                            {item.notes && (
                              <p className="text-gray-600 text-sm mb-3 italic">"{item.notes}"</p>
                            )}

                            <div className="text-sm text-gray-500">
                              Created {formatRelativeTime(item.created_at)} • 
                              {item.matches?.length || 0} matches found
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <MagneticButton
                              onClick={() => handleToggleActive(item.id, item.is_active)}
                              variant="glass"
                              size="sm"
                            >
                              {item.is_active ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                            </MagneticButton>
                            
                            <MagneticButton
                              onClick={() => handleDeleteItem(item.id)}
                              variant="glass"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </MagneticButton>
                          </div>
                        </div>

                        {/* Matches */}
                        {item.matches && item.matches.length > 0 && (
                          <div className="border-t border-gray-200/50 pt-4">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Recent Matches ({item.matches.length})
                            </h4>
                            
                            <div className="grid gap-3">
                              {item.matches.slice(0, 3).map((match) => (
                                <div key={match.id} className="flex items-center gap-4 p-3 bg-white/30 rounded-xl">
                                  {match.image_url && (
                                    <img 
                                      src={match.image_url} 
                                      alt={match.title}
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                  )}
                                  
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900 mb-1">{match.title}</h5>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                      <span className="font-semibold text-green-600">
                                        {formatCurrency(match.price)}
                                      </span>
                                      <span>{match.marketplace_name}</span>
                                      <span>{Math.round(match.confidence_score * 100)}% match</span>
                                    </div>
                                  </div>
                                  
                                  <MagneticButton
                                    onClick={() => window.open(match.link_url, '_blank')}
                                    variant="primary"
                                    size="sm"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </MagneticButton>
                                </div>
                              ))}
                              
                              {item.matches.length > 3 && (
                                <div className="text-center">
                                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                                    View all {item.matches.length} matches →
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </SpotlightEffect>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
