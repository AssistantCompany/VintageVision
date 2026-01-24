import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Heart, 
  Search, 
  Grid3X3, 
  List, 
  Download, 
  Trash2,
  Calendar,
  DollarSign,
  Eye,
  Plus,
  ArrowLeft,
  Star
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
import PullToRefresh from '@/components/mobile/PullToRefresh'
import CollectionItemDetailModal from '@/components/enhanced/CollectionItemDetailModal'

interface CollectionItem {
  id: string
  item_analysis_id: string
  name: string
  era?: string
  style?: string
  description: string
  estimated_value_min?: number
  estimated_value_max?: number
  image_url: string
  notes?: string
  location?: string
  saved_at: string
  confidence: number
}

export default function PremiumCollectionPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const notifications = useNotifications()
  const [items, setItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [sortBy, setSortBy] = useState<'recent' | 'value' | 'name'>('recent')
  const [detailItem, setDetailItem] = useState<CollectionItem | null>(null)

  useEffect(() => {
    if (user) {
      fetchCollectionItems()
    } else {
      navigate('/')
    }
  }, [user, navigate])

  const fetchCollectionItems = async () => {
    try {
      console.log('Fetching collection items...')
      const response = await fetch('/api/collection', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Collection fetch response:', response.status, response.statusText)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Collection data:', {
          success: data.success,
          itemsCount: data.items?.length || 0,
          collectionCount: data.collection?.length || 0,
          rawData: data
        })
        
        // Use items array if available, otherwise fall back to collection format
        const collectionItems = data.items || data.collection?.map((item: any) => ({
          id: item.id,
          item_analysis_id: item.analysis?.id,
          name: item.analysis?.name,
          era: item.analysis?.era,
          style: item.analysis?.style,
          description: item.analysis?.description,
          estimated_value_min: item.analysis?.estimated_value_min,
          estimated_value_max: item.analysis?.estimated_value_max,
          image_url: item.analysis?.image_url,
          notes: item.notes,
          location: item.location,
          saved_at: item.savedAt,
          confidence: item.analysis?.confidence
        })) || []
        
        console.log('Setting items:', collectionItems.length)
        setItems(collectionItems)
      } else {
        const errorText = await response.text()
        console.error('Collection fetch failed:', response.status, errorText)
        if (response.status === 401) {
          notifications.error('Please sign in to view your collection')
        } else {
          notifications.error('Failed to load collection')
        }
      }
    } catch (error) {
      console.error('Collection fetch error:', error)
      notifications.error('Failed to load collection')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (itemId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/collection/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        setItems(items.filter(item => item.id !== itemId))
        trackEvent('collection_item_deleted')
      } else {
        throw new Error('Failed to delete item')
      }
    } catch (error) {
      notifications.error('Failed to remove item')
      throw error
    }
  }

  const handleUpdateNotes = async (itemId: string, notes: string, location: string): Promise<void> => {
    try {
      const response = await fetch(`/api/collection/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notes, location })
      })

      if (response.ok) {
        setItems(items.map(item =>
          item.id === itemId
            ? { ...item, notes, location }
            : item
        ))
        trackEvent('collection_item_updated')
      } else {
        throw new Error('Failed to update item')
      }
    } catch (error) {
      throw error
    }
  }

  const handleExport = async () => {
    try {
      const exportData = items.map(item => ({
        name: item.name,
        era: item.era,
        style: item.style,
        description: item.description,
        estimated_value: item.estimated_value_min && item.estimated_value_max 
          ? `$${item.estimated_value_min} - $${item.estimated_value_max}`
          : 'N/A',
        notes: item.notes,
        location: item.location,
        saved_date: item.saved_at
      }))
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vintage-collection-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      trackEvent('collection_exported')
      notifications.success('Collection exported successfully')
    } catch (error) {
      notifications.error('Failed to export collection')
    }
  }

  const filteredItems = items
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.era?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.style?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime()
        case 'value':
          const aValue = a.estimated_value_max || a.estimated_value_min || 0
          const bValue = b.estimated_value_max || b.estimated_value_min || 0
          return bValue - aValue
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const totalValue = items.reduce((sum, item) => {
    const value = item.estimated_value_max || item.estimated_value_min || 0
    return sum + value
  }, 0)

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <FloatingParticles 
          count={60} 
          className="opacity-20"
          colors={['#8b5cf6', '#ec4899', '#f43f5e', '#06b6d4']}
        />
      </div>

      <PremiumHeader />

      <PullToRefresh onRefresh={fetchCollectionItems}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-8">
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
                My Collection
              </h1>
              <p className="text-gray-600 mt-1">
                {items.length} items • Total estimated value: {formatCurrency(totalValue)}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Items', value: items.length, icon: Heart },
              { label: 'Total Value', value: formatCurrency(totalValue), icon: DollarSign },
              { label: 'Avg Confidence', value: `${Math.round(items.reduce((sum, item) => sum + item.confidence, 0) / items.length * 100) || 0}%`, icon: Star },
              { label: 'This Month', value: items.filter(item => new Date(item.saved_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, icon: Calendar }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-4 text-center" hover>
                  <stat.icon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
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
                  placeholder="Search your collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-white/50 border border-gray-200/50 rounded-xl text-sm"
                >
                  <option value="recent">Recently Added</option>
                  <option value="value">Highest Value</option>
                  <option value="name">Name A-Z</option>
                </select>

                <div className="flex bg-gray-100/50 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-3 min-h-12 rounded-lg transition-all',
                      viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-3 min-h-12 rounded-lg transition-all',
                      viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <MagneticButton
                  onClick={handleExport}
                  variant="glass"
                  size="sm"
                >
                  <Download className="w-4 h-4" />
                  Export
                </MagneticButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Collection Items */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Loading your collection...</p>
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
                  <Heart className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {searchQuery ? 'No matching items' : 'Start Your Collection'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery 
                      ? 'Try a different search term to find your items.'
                      : 'Identify your first vintage treasure to begin building your collection.'
                    }
                  </p>
                  {!searchQuery && (
                    <LiquidButton
                      onClick={() => navigate('/')}
                      variant="primary"
                      size="md"
                    >
                      <Plus className="w-4 h-4" />
                      Identify First Item
                    </LiquidButton>
                  )}
                </GlassCard>
              </SpotlightEffect>
            </motion.div>
          ) : (
            <motion.div
              key="items"
              className={cn(
                'grid gap-6',
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              )}
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
                    <GlassCard
                      className="overflow-hidden cursor-pointer group"
                      hover
                    >
                      <div
                        className={cn(
                          'flex',
                          viewMode === 'grid' ? 'flex-col' : 'flex-row gap-6'
                        )}
                        onClick={() => setDetailItem(item)}
                      >
                        {/* Image */}
                        <div className={cn(
                          'relative overflow-hidden',
                          viewMode === 'grid' ? 'aspect-square' : 'w-32 h-32 flex-shrink-0'
                        )}>
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Actions */}
                          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div
                              onClick={(e) => {
                                e.stopPropagation()
                                setDetailItem(item)
                              }}
                            >
                              <MagneticButton
                                onClick={() => setDetailItem(item)}
                                variant="glass"
                                size="sm"
                                className="!p-2"
                              >
                                <Eye className="w-4 h-4" />
                              </MagneticButton>
                            </div>
                            <div
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteItem(item.id)
                              }}
                            >
                              <MagneticButton
                                onClick={() => {}}
                                variant="glass"
                                size="sm"
                                className="!p-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </MagneticButton>
                            </div>
                          </div>

                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-700 transition-colors">
                              {item.name}
                            </h3>
                            {(item.estimated_value_min || item.estimated_value_max) && (
                              <div className="text-right">
                                <div className="text-sm font-semibold text-green-600">
                                  {item.estimated_value_min && item.estimated_value_max
                                    ? `${formatCurrency(item.estimated_value_min)} - ${formatCurrency(item.estimated_value_max)}`
                                    : formatCurrency(item.estimated_value_min || item.estimated_value_max || 0)
                                  }
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.era && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {item.era}
                              </span>
                            )}
                            {item.style && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {item.style}
                              </span>
                            )}
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              {Math.round(item.confidence * 100)}% confident
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {item.description}
                          </p>

                          {item.notes && (
                            <div className="mb-4 p-3 bg-amber-50/50 rounded-lg border border-amber-200/50">
                              <p className="text-amber-800 text-sm italic">"{item.notes}"</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatRelativeTime(item.saved_at)}</span>
                            </div>
                            {item.location && (
                              <div className="flex items-center gap-1">
                                <span>{item.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </SpotlightEffect>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </PullToRefresh>

      {/* Collection Item Detail Modal */}
      <CollectionItemDetailModal
        item={detailItem}
        isOpen={detailItem !== null}
        onClose={() => setDetailItem(null)}
        onDelete={handleDeleteItem}
        onUpdateNotes={handleUpdateNotes}
      />
    </div>
  )
}
