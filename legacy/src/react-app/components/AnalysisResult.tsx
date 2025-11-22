import { useState } from 'react';
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
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StylingSuggestions from './StylingSuggestions';
import MarketplaceLinks from './MarketplaceLinks';
import FeedbackModal from './FeedbackModal';

interface AnalysisResultProps {
  analysis: ItemAnalysis;
  onSaveToCollection: (notes?: string, location?: string) => Promise<boolean>;
  onSubmitFeedback: (isCorrect: boolean, correctionText?: string, feedbackType?: string) => Promise<void>;
}

export default function AnalysisResult({ analysis, onSaveToCollection, onSubmitFeedback }: AnalysisResultProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [expandedHistory, setExpandedHistory] = useState(false);

  const handleSave = async () => {
    if (!user) {
      // Redirect to login or show login prompt
      return;
    }
    
    setSaving(true);
    const success = await onSaveToCollection(notes.trim() || undefined, location.trim() || undefined);
    if (success) {
      setSaved(true);
      setShowSaveForm(false);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const formatValue = (min?: number, max?: number) => {
    if (!min && !max) return 'Value estimate unavailable';
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    return `~$${(min || max)?.toLocaleString()}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
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
      className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
    >
      {/* Image */}
      <div className="relative">
        <img 
          src={analysis.imageUrl} 
          alt={analysis.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(analysis.confidence)}`}>
            {getConfidenceText(analysis.confidence)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{analysis.name}</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            {analysis.era && (
              <div className="flex items-center gap-1 text-amber-600">
                <Clock className="w-4 h-4" />
                <span>{analysis.era}</span>
              </div>
            )}
            {analysis.style && (
              <div className="flex items-center gap-1 text-purple-600">
                <Palette className="w-4 h-4" />
                <span>{analysis.style}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-gray-700 leading-relaxed">{analysis.description}</p>
        </div>

        {/* Value */}
        {(analysis.estimatedValueMin || analysis.estimatedValueMax) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Estimated Value</h3>
            </div>
            <p className="text-2xl font-bold text-green-700">
              {formatValue(analysis.estimatedValueMin, analysis.estimatedValueMax)}
            </p>
            <p className="text-sm text-green-600 mt-1">
              *Estimated market value - actual value may vary based on condition, authenticity, and demand
            </p>
          </div>
        )}

        {/* Historical Context */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800">Historical Context</h3>
            </div>
            <button
              onClick={() => setExpandedHistory(!expandedHistory)}
              className="text-amber-600 hover:text-amber-700"
            >
              {expandedHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          <AnimatePresence>
            {expandedHistory ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-amber-800 leading-relaxed whitespace-pre-wrap">
                  {analysis.historicalContext}
                </p>
              </motion.div>
            ) : (
              <motion.p 
                className="text-amber-800 leading-relaxed line-clamp-3"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                {analysis.historicalContext.split('\n')[0]}...
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Styling Suggestions */}
        {((analysis.styling_suggestions && analysis.styling_suggestions !== '[]') || 
          (analysis.stylingSuggestions && analysis.stylingSuggestions.length > 0)) && (
          (() => {
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
          })()
        )}

        {/* Marketplace Links */}
        {analysis.marketplaceLinks && analysis.marketplaceLinks.length > 0 && (
          <MarketplaceLinks links={analysis.marketplaceLinks} itemName={analysis.name} />
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {user ? (
            saved ? (
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Saved to Collection!</span>
              </div>
            ) : (
              <button
                onClick={() => setShowSaveForm(!showSaveForm)}
                disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50"
              >
                <Heart className="w-4 h-4" />
                <span>Save to Collection</span>
              </button>
            )
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Sign in to save items to your personal collection
              </span>
            </div>
          )}

          <button 
            onClick={() => setShowFeedbackModal(true)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Give Feedback</span>
          </button>
        </div>

        {/* Save Form */}
        <AnimatePresence>
          {showSaveForm && user && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border border-gray-200 rounded-lg p-4 space-y-4 overflow-hidden"
            >
              <h4 className="font-medium text-gray-900">Add to Your Collection</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4" />
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Living room, Attic, Shop"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <StickyNote className="w-4 h-4" />
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this item..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Item'}
                </button>
                <button
                  onClick={() => setShowSaveForm(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
