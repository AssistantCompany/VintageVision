import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@getmocha/users-service/react';
import { ItemAnalysis } from '@/shared/types';
import { 
  Clock, 
  Palette, 
  DollarSign, 
  BookOpen, 
  Heart,
  StickyNote,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  MessageSquare,
  Star,
  Share2,
  Eye,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import Glass from '@/react-app/components/ui/Glass';
import FloatingButton from '@/react-app/components/ui/FloatingButton';
import GradientText from '@/react-app/components/ui/GradientText';
import StylingSuggestions from '@/react-app/components/StylingSuggestions';
import MarketplaceLinks from '@/react-app/components/MarketplaceLinks';
import FeedbackModal from '@/react-app/components/FeedbackModal';
import { MagneticButton, TapScale, StaggerChildren } from './MicroInteractions';

interface EnhancedAnalysisResultProps {
  analysis: ItemAnalysis;
  onSaveToCollection: (notes?: string, location?: string) => Promise<boolean>;
  onSubmitFeedback: (isCorrect: boolean, correctionText?: string, feedbackType?: string) => Promise<void>;
}

export default function EnhancedAnalysisResult({ 
  analysis, 
  onSaveToCollection, 
  onSubmitFeedback 
}: EnhancedAnalysisResultProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [expandedHistory, setExpandedHistory] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    const success = await onSaveToCollection(notes.trim() || undefined, location.trim() || undefined);
    if (success) {
      setSaved(true);
      setShowSaveForm(false);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${analysis.name} - VintageVision`,
          text: analysis.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatValue = (min?: number, max?: number) => {
    if (!min && !max) return 'Value estimate unavailable';
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    return `~$${(min || max)?.toLocaleString()}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 0.6) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Glass className="overflow-hidden" gradient="vintage" blur="lg">
        {/* Hero Section */}
        <div className="relative">
          <motion.img 
            src={analysis.imageUrl} 
            alt={analysis.name}
            className="w-full h-80 object-cover"
            layoutId="analyzed-image"
          />
          
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Floating Elements */}
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.div
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(analysis.confidence)}`}
              whileHover={{ scale: 1.05 }}
            >
              {getConfidenceText(analysis.confidence)}
            </motion.div>
            
            <TapScale>
              <button
                onClick={handleShare}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </TapScale>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {analysis.name}
              </h2>
              <div className="flex flex-wrap gap-3 text-sm">
                {analysis.era && (
                  <div className="flex items-center gap-1 text-amber-200 bg-amber-900/30 px-2 py-1 rounded-full backdrop-blur-sm">
                    <Clock className="w-4 h-4" />
                    <span>{analysis.era}</span>
                  </div>
                )}
                {analysis.style && (
                  <div className="flex items-center gap-1 text-purple-200 bg-purple-900/30 px-2 py-1 rounded-full backdrop-blur-sm">
                    <Palette className="w-4 h-4" />
                    <span>{analysis.style}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-6 space-y-8">
          <StaggerChildren className="space-y-6">
            {/* Description */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <Glass className="p-6" gradient="default" blur="sm">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">At First Glance</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{analysis.description}</p>
              </Glass>
            </motion.div>

            {/* Value Section */}
            {(analysis.estimatedValueMin || analysis.estimatedValueMax) && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Glass className="p-6 border-2 border-green-200" gradient="cool" blur="sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-green-600" />
                      <h3 className="font-semibold text-green-800 text-xl">Market Value</h3>
                    </div>
                    <motion.div
                      className="flex items-center gap-1 text-green-600"
                      whileHover={{ scale: 1.05 }}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Live Market Data</span>
                    </motion.div>
                  </div>
                  
                  <div className="mb-4">
                    <GradientText gradient="accent" className="text-3xl font-bold">
                      {formatValue(analysis.estimatedValueMin, analysis.estimatedValueMax)}
                    </GradientText>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                    <div>
                      <span className="font-medium">Condition:</span> Estimated Good
                    </div>
                    <div>
                      <span className="font-medium">Market:</span> Retail/Auction
                    </div>
                  </div>
                  
                  <p className="text-sm text-green-600 mt-3 italic">
                    *Market values fluctuate. Actual value depends on condition, provenance, and demand.
                  </p>
                </Glass>
              </motion.div>
            )}

            {/* Historical Context */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <Glass className="p-6" gradient="warm" blur="sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-amber-800">The Story Behind</h3>
                  </div>
                  <TapScale>
                    <button
                      onClick={() => setExpandedHistory(!expandedHistory)}
                      className="p-2 rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      {expandedHistory ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-amber-600" />}
                    </button>
                  </TapScale>
                </div>
                
                <AnimatePresence>
                  {expandedHistory ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="prose prose-amber max-w-none">
                        {analysis.historicalContext.split('\n').map((paragraph, index) => (
                          <p key={index} className="text-amber-800 leading-relaxed mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p 
                      className="text-amber-800 leading-relaxed"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                    >
                      {analysis.historicalContext.split('\n')[0]}...
                      <span className="text-amber-600 font-medium cursor-pointer ml-2">
                        Read more
                      </span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </Glass>
            </motion.div>

            {/* Styling Suggestions */}
            {((analysis.styling_suggestions && analysis.styling_suggestions !== '[]') || 
              (analysis.stylingSuggestions && analysis.stylingSuggestions.length > 0)) && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                {(() => {
                  let suggestions = [];
                  
                  // Parse styling suggestions from string or use parsed array
                  try {
                    if (typeof analysis.styling_suggestions === 'string' && analysis.styling_suggestions !== '[]') {
                      suggestions = JSON.parse(analysis.styling_suggestions);
                    } else if (analysis.stylingSuggestions) {
                      suggestions = analysis.stylingSuggestions;
                    }
                  } catch (e) {
                    console.warn('Failed to parse styling suggestions:', e);
                    suggestions = [];
                  }
                  
                  return suggestions.length > 0 ? <StylingSuggestions suggestions={suggestions} /> : null;
                })()}
              </motion.div>
            )}

            {/* Marketplace Links */}
            {analysis.marketplaceLinks && analysis.marketplaceLinks.length > 0 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <MarketplaceLinks links={analysis.marketplaceLinks} itemName={analysis.name} />
              </motion.div>
            )}

            {/* Action Bar */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <Glass className="p-6" gradient="default" blur="sm">
                <div className="flex flex-wrap gap-4 justify-center">
                  {user ? (
                    saved ? (
                      <motion.div
                        className="flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-xl border border-green-200"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Saved to Collection!</span>
                      </motion.div>
                    ) : (
                      <MagneticButton
                        onClick={() => setShowSaveForm(!showSaveForm)}
                        disabled={saving}
                        className="group relative overflow-hidden bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="relative flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          <span>Save to Collection</span>
                        </div>
                      </MagneticButton>
                    )
                  ) : (
                    <Glass className="px-6 py-3 border border-blue-200" gradient="cool">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Star className="w-5 h-5" />
                        <span className="font-medium">Sign in to save items</span>
                      </div>
                    </Glass>
                  )}

                  <MagneticButton
                    onClick={() => setShowFeedbackModal(true)}
                    className="group relative overflow-hidden bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:border-gray-400"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gray-50"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="relative flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      <span>Give Feedback</span>
                    </div>
                  </MagneticButton>

                  <TapScale>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share Discovery</span>
                    </button>
                  </TapScale>
                </div>
              </Glass>
            </motion.div>

            {/* Save Form */}
            <AnimatePresence>
              {showSaveForm && user && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <Glass className="p-6" gradient="warm" blur="sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <h4 className="font-semibold text-gray-900">Add to Your Collection</h4>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="w-4 h-4" />
                          Location (optional)
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g., Living room, Attic, Shop"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <StickyNote className="w-4 h-4" />
                          Notes (optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add any notes about this item..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <FloatingButton
                        onClick={handleSave}
                        disabled={saving}
                        loading={saving}
                        className="flex-1"
                      >
                        {saving ? 'Saving...' : 'Save Item'}
                      </FloatingButton>
                      
                      <FloatingButton
                        onClick={() => setShowSaveForm(false)}
                        variant="secondary"
                        className="px-6"
                      >
                        Cancel
                      </FloatingButton>
                    </div>
                  </Glass>
                </motion.div>
              )}
            </AnimatePresence>
          </StaggerChildren>
        </div>
      </Glass>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmitFeedback={onSubmitFeedback}
        itemName={analysis.name}
      />
    </motion.div>
  );
}
