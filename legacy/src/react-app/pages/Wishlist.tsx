import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@getmocha/users-service/react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Plus, 
  Search, 
  DollarSign,
  Clock,
  Palette,
  X,
  Calendar,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import Header from '@/react-app/components/Header';
import { useVintageAnalysis } from '@/react-app/hooks/useVintageAnalysis';

interface WishlistItem {
  id: string;
  notes?: string;
  searchCriteria?: {
    style?: string;
    era?: string;
    category?: string;
    maxPrice?: number;
  };
  createdAt: string;
  item?: {
    id: string;
    name: string;
    era?: string;
    style?: string;
    imageUrl: string;
    estimatedValueMin?: number;
    estimatedValueMax?: number;
  };
}

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getWishlist, addToWishlist } = useVintageAnalysis();
  
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Add form state
  const [newItemStyle, setNewItemStyle] = useState('');
  const [newItemEra, setNewItemEra] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemMaxPrice, setNewItemMaxPrice] = useState<number | undefined>();
  const [newItemNotes, setNewItemNotes] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    loadWishlist();
  }, [user, navigate]);

  const loadWishlist = async () => {
    setLoading(true);
    const data = await getWishlist();
    if (data) {
      setWishlist(data);
    }
    setLoading(false);
  };

  const handleAddWishlistItem = async () => {
    const success = await addToWishlist({
      searchCriteria: {
        style: newItemStyle || undefined,
        era: newItemEra || undefined,
        category: newItemCategory || undefined,
        maxPrice: newItemMaxPrice
      },
      notes: newItemNotes || undefined
    });
    
    if (success) {
      // Reset form
      setNewItemStyle('');
      setNewItemEra('');
      setNewItemCategory('');
      setNewItemMaxPrice(undefined);
      setNewItemNotes('');
      setShowAddForm(false);
      
      // Reload wishlist
      loadWishlist();
    }
  };

  const filteredWishlist = wishlist.filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      item.notes?.toLowerCase().includes(searchLower) ||
      item.searchCriteria?.style?.toLowerCase().includes(searchLower) ||
      item.searchCriteria?.era?.toLowerCase().includes(searchLower) ||
      item.searchCriteria?.category?.toLowerCase().includes(searchLower) ||
      item.item?.name?.toLowerCase().includes(searchLower)
    );
  });

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600">Items you want to find and collect</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add to Wishlist
            </button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your wishlist..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        ) : filteredWishlist.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Wishlist</h3>
            <p className="text-gray-600 mb-6">
              Add items you're looking for and we'll help you find them
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all"
            >
              Add Your First Wishlist Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredWishlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border border-yellow-200 p-6 hover:shadow-lg transition-shadow"
              >
                {item.item ? (
                  // Specific item from collection
                  <div className="flex gap-4">
                    <img
                      src={item.item.imageUrl}
                      alt={item.item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.item.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-2 text-xs">
                        {item.item.era && (
                          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                            {item.item.era}
                          </span>
                        )}
                        {item.item.style && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {item.item.style}
                          </span>
                        )}
                      </div>
                      {item.item.estimatedValueMin && (
                        <p className="text-sm text-green-600 font-medium">
                          ~${item.item.estimatedValueMin.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  // Search criteria based wishlist item
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold text-gray-900">Looking For</h3>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {item.searchCriteria?.style && (
                        <div className="flex items-center gap-2 text-sm">
                          <Palette className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-600">Style:</span>
                          <span className="font-medium">{item.searchCriteria.style}</span>
                        </div>
                      )}
                      
                      {item.searchCriteria?.era && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span className="text-gray-600">Era:</span>
                          <span className="font-medium">{item.searchCriteria.era}</span>
                        </div>
                      )}
                      
                      {item.searchCriteria?.category && (
                        <div className="flex items-center gap-2 text-sm">
                          <Search className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{item.searchCriteria.category}</span>
                        </div>
                      )}
                      
                      {item.searchCriteria?.maxPrice && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">Max Price:</span>
                          <span className="font-medium">${item.searchCriteria.maxPrice.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {item.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">{item.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                    <ExternalLink className="w-3 h-3" />
                    <span>Search Markets</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Add to Wishlist
                  </h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Style (optional)
                    </label>
                    <input
                      type="text"
                      value={newItemStyle}
                      onChange={(e) => setNewItemStyle(e.target.value)}
                      placeholder="e.g., Art Deco, Mid-Century Modern"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Era (optional)
                    </label>
                    <input
                      type="text"
                      value={newItemEra}
                      onChange={(e) => setNewItemEra(e.target.value)}
                      placeholder="e.g., 1920s, Victorian"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category (optional)
                    </label>
                    <input
                      type="text"
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      placeholder="e.g., Furniture, Jewelry, Art"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Price (optional)
                    </label>
                    <input
                      type="number"
                      value={newItemMaxPrice || ''}
                      onChange={(e) => setNewItemMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="e.g., 500"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={newItemNotes}
                      onChange={(e) => setNewItemNotes(e.target.value)}
                      placeholder="Describe what you're looking for..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddWishlistItem}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
                  >
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
