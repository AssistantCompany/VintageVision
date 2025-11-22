import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@getmocha/users-service/react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Search,
  Grid,
  List,
  StickyNote,
  Clock,
  Palette
} from 'lucide-react';
import Header from '@/react-app/components/Header';
import { useVintageAnalysis } from '@/react-app/hooks/useVintageAnalysis';

interface CollectionItem {
  id: string;
  notes?: string;
  location?: string;
  savedAt: string;
  analysis: {
    id: string;
    name: string;
    era?: string;
    style?: string;
    description: string;
    estimatedValueMin?: number;
    estimatedValueMax?: number;
    imageUrl: string;
    confidence: number;
  };
}

export default function CollectionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getCollection } = useVintageAnalysis();
  
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStyle, setFilterStyle] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'value'>('newest');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    loadCollection();
  }, [user, navigate]);

  const loadCollection = async () => {
    setLoading(true);
    try {
      console.log('Loading collection for user:', user?.id)
      const data = await getCollection();
      console.log('Collection loaded:', { count: data?.length || 0, data })
      if (data) {
        setCollection(data);
      } else {
        console.warn('No collection data returned')
        setCollection([])
      }
    } catch (error) {
      console.error('Error loading collection:', error)
      setCollection([])
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (min?: number, max?: number) => {
    if (!min && !max) return 'No estimate';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    return `~$${(min || max)?.toLocaleString()}`;
  };

  const calculateTotalValue = () => {
    return collection.reduce((total, item) => {
      const value = item.analysis.estimatedValueMax || item.analysis.estimatedValueMin || 0;
      return total + value;
    }, 0);
  };

  const filteredAndSortedCollection = collection
    .filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.analysis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStyle = filterStyle === '' || item.analysis.style === filterStyle;
      
      return matchesSearch && matchesStyle;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
        case 'oldest':
          return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
        case 'value':
          const aValue = a.analysis.estimatedValueMax || a.analysis.estimatedValueMin || 0;
          const bValue = b.analysis.estimatedValueMax || b.analysis.estimatedValueMin || 0;
          return bValue - aValue;
        default:
          return 0;
      }
    });

  const uniqueStyles = Array.from(new Set(collection.map(item => item.analysis.style).filter(Boolean)));

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Collection</h1>
              <p className="text-gray-600">Your curated vintage treasures</p>
            </div>
          </div>

          {/* Stats */}
          {!loading && collection.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <span className="text-sm text-gray-600">Total Items</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{collection.length}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Estimated Value</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">${calculateTotalValue().toLocaleString()}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Unique Styles</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{uniqueStyles.length}</p>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading your collection...</p>
          </div>
        ) : collection.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Collection</h3>
            <p className="text-gray-600 mb-6">
              Scan vintage items to add them to your personal collection
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              Scan Your First Item
            </button>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg border border-amber-200 p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search your collection..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <select
                  value={filterStyle}
                  onChange={(e) => setFilterStyle(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">All Styles</option>
                  {uniqueStyles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="value">Highest Value</option>
                </select>
                
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Collection Items */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedCollection.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg border border-amber-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={item.analysis.imageUrl}
                      alt={item.analysis.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.analysis.name}</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3 text-xs">
                        {item.analysis.era && (
                          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.analysis.era}
                          </span>
                        )}
                        {item.analysis.style && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center gap-1">
                            <Palette className="w-3 h-3" />
                            {item.analysis.style}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.analysis.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Value:</span>
                          <span className="font-medium text-green-600">
                            {formatValue(item.analysis.estimatedValueMin, item.analysis.estimatedValueMax)}
                          </span>
                        </div>
                        
                        {item.location && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
                          </div>
                        )}
                        
                        {item.notes && (
                          <div className="flex items-start gap-1 text-gray-500">
                            <StickyNote className="w-3 h-3 mt-0.5" />
                            <span className="line-clamp-2">{item.notes}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>Added {new Date(item.savedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedCollection.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg border border-amber-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.analysis.imageUrl}
                        alt={item.analysis.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.analysis.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.analysis.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {item.analysis.era && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.analysis.era}
                            </span>
                          )}
                          {item.analysis.style && (
                            <span className="flex items-center gap-1">
                              <Palette className="w-3 h-3" />
                              {item.analysis.style}
                            </span>
                          )}
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.savedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          {formatValue(item.analysis.estimatedValueMin, item.analysis.estimatedValueMax)}
                        </div>
                        {item.notes && (
                          <div className="text-xs text-gray-500 mt-1 max-w-32 line-clamp-2">
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
