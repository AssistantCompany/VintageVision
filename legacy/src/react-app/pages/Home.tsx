import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@getmocha/users-service/react';
import { Search, BookOpen, Heart } from 'lucide-react';
import Header from '@/react-app/components/Header';
import AdvancedImageUploader from '@/react-app/components/enhanced/AdvancedImageUploader';
import EnhancedAnalysisResult from '@/react-app/components/enhanced/EnhancedAnalysisResult';
import AnimatedBackground from '@/react-app/components/ui/AnimatedBackground';
import LoadingSpinner from '@/react-app/components/ui/LoadingSpinner';
import GradientText from '@/react-app/components/ui/GradientText';
import Glass from '@/react-app/components/ui/Glass';
import { useVintageAnalysis } from '@/react-app/hooks/useVintageAnalysis';
import { useNotifications } from '@/react-app/components/NotificationSystem';
import { ItemAnalysis } from '@/shared/types';

export default function Home() {
  const { user } = useAuth();
  const notifications = useNotifications();
  const [currentAnalysis, setCurrentAnalysis] = useState<ItemAnalysis | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { analyzing, error, analyzeItem, saveToCollection, submitFeedback } = useVintageAnalysis();

  const handleImageSelected = async (dataUrl: string) => {
    setShowResult(false);
    setCurrentAnalysis(null);
    
    const analysis = await analyzeItem(dataUrl);
    if (analysis) {
      setCurrentAnalysis(analysis);
      setShowResult(true);
    }
  };

  const handleSaveToCollection = async (notes?: string, location?: string) => {
    if (!currentAnalysis || !user) return false;
    const success = await saveToCollection(currentAnalysis.id, notes, location);
    if (success) {
      notifications.success('Item saved to your collection!');
    } else {
      notifications.error('Failed to save item to collection');
    }
    return success;
  };

  const handleSubmitFeedback = async (isCorrect: boolean, correctionText?: string, feedbackType?: string) => {
    if (!currentAnalysis || !user) return;
    const success = await submitFeedback(currentAnalysis.id, isCorrect, correctionText, feedbackType);
    if (success) {
      notifications.success('Thank you for your feedback!');
    } else {
      notifications.error('Failed to submit feedback');
    }
  };

  const resetToHome = () => {
    setShowResult(false);
    setCurrentAnalysis(null);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground variant="vintage" />
      <Header onReset={resetToHome} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              {/* Hero Section */}
              <div className="space-y-4 mb-12">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Turn your phone into an{' '}
                  <GradientText gradient="warm">antique expert</GradientText>
                </motion.h2>
                
                <motion.p 
                  className="text-lg text-gray-600 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Instantly identify vintage and antique items, learn their fascinating histories, 
                  discover their market value, and get expert styling tips with the power of AI.
                </motion.p>
              </div>

              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <AdvancedImageUploader 
                  onImageSelected={handleImageSelected}
                  disabled={analyzing}
                />
              </motion.div>

              {/* Analyzing State */}
              {analyzing && (
                <LoadingSpinner
                  variant="glass"
                  size="xl"
                  text="Analyzing your treasure... Our AI is examining the item, researching its history, and generating styling tips"
                />
              )}

              {/* Error State */}
              {error && (
                <Glass className="p-4 max-w-md mx-auto" gradient="default">
                  <div className="text-center">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </Glass>
              )}

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid md:grid-cols-3 gap-6 mt-16"
              >
                <Glass className="p-6 text-center" hover>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Instant Identification</h3>
                  <p className="text-gray-600 text-sm">Advanced AI recognizes vintage items from a simple photo with expert-level accuracy</p>
                </Glass>

                <Glass className="p-6 text-center" hover>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Rich Stories & Styling</h3>
                  <p className="text-gray-600 text-sm">Learn fascinating histories and get personalized styling tips for your space</p>
                </Glass>

                <Glass className="p-6 text-center" hover>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Build & Buy</h3>
                  <p className="text-gray-600 text-sm">Save discoveries to your collection and find similar items to purchase</p>
                </Glass>
              </motion.div>

              {/* User Status */}
              {!user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto mt-8"
                >
                  <p className="text-blue-700 text-sm">
                    <strong>💡 Pro tip:</strong> Sign in to save items to your personal collection, 
                    set style preferences, and get personalized recommendations!
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Back Button */}
              <div className="text-center">
                <button
                  onClick={resetToHome}
                  className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                >
                  ← Analyze Another Item
                </button>
              </div>

              {/* Analysis Result */}
              {currentAnalysis && (
                <EnhancedAnalysisResult
                  analysis={currentAnalysis}
                  onSaveToCollection={handleSaveToCollection}
                  onSubmitFeedback={handleSubmitFeedback}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
