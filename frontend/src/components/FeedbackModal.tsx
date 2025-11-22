import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (isCorrect: boolean, correctionText?: string, feedbackType?: string) => Promise<void>;
  itemName: string;
}

export default function FeedbackModal({ isOpen, onClose, onSubmitFeedback, itemName }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<'accuracy' | 'styling' | 'value' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctionText, setCorrectionText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isCorrect === null) return;
    
    setSubmitting(true);
    try {
      await onSubmitFeedback(
        isCorrect, 
        correctionText || undefined, 
        feedbackType || 'accuracy'
      );
      onClose();
      // Reset form
      setIsCorrect(null);
      setCorrectionText('');
      setFeedbackType(null);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Help Us Improve
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Item Context */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  Providing feedback for: <span className="font-medium text-gray-900">{itemName}</span>
                </p>
              </div>

              {/* Feedback Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What would you like to give feedback on?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'accuracy', label: 'Identification', icon: '🔍' },
                    { id: 'styling', label: 'Style Tips', icon: '🎨' },
                    { id: 'value', label: 'Value Estimate', icon: '💰' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFeedbackType(type.id as any)}
                      className={`p-3 text-center border rounded-lg transition-all ${
                        feedbackType === type.id
                          ? 'border-amber-300 bg-amber-50 text-amber-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg mb-1">{type.icon}</div>
                      <div className="text-xs font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Correct/Incorrect Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Was our {feedbackType === 'accuracy' ? 'identification' : feedbackType === 'styling' ? 'styling suggestion' : 'value estimate'} accurate?
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsCorrect(true)}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${
                      isCorrect === true
                        ? 'border-green-300 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Yes, accurate
                  </button>
                  <button
                    onClick={() => setIsCorrect(false)}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${
                      isCorrect === false
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Needs improvement
                  </button>
                </div>
              </div>

              {/* Correction Text (if incorrect) */}
              {isCorrect === false && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    How can we improve? (Optional)
                  </label>
                  <textarea
                    value={correctionText}
                    onChange={(e) => setCorrectionText(e.target.value)}
                    placeholder="Tell us what was incorrect or how we could do better..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isCorrect === null || !feedbackType || submitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
