import { useState } from 'react';
import { StyleSuggestion } from '@/shared/types';
import { 
  Palette, 
  Home, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StylingSuggestionsProps {
  suggestions: StyleSuggestion[];
}

export default function StylingSuggestions({ suggestions }: StylingSuggestionsProps) {
  const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(null);

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-purple-800">Style It Like a Pro</h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="bg-white rounded-lg border border-purple-100 overflow-hidden">
            <button
              onClick={() => setExpandedSuggestion(expandedSuggestion === index ? null : index)}
              className="w-full p-4 text-left hover:bg-purple-50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                  <p className="text-sm text-purple-600">{suggestion.roomType}</p>
                </div>
              </div>
              {expandedSuggestion === index ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {expandedSuggestion === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {suggestion.description}
                    </p>

                    {suggestion.complementaryItems && suggestion.complementaryItems.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Plus className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Complementary Pieces</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {suggestion.complementaryItems.map((item, itemIndex) => (
                            <span
                              key={itemIndex}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {suggestion.colorPalette && suggestion.colorPalette.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Palette className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Color Palette</span>
                        </div>
                        <div className="flex gap-2">
                          {suggestion.colorPalette.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="flex items-center gap-1"
                            >
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-200"
                                style={{ backgroundColor: color.toLowerCase() }}
                              />
                              <span className="text-xs text-gray-600">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-purple-100">
                      <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium">
                        <Lightbulb className="w-4 h-4" />
                        Get More Ideas
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-purple-600">
          💡 Pro tip: Save this item to your collection to get personalized styling updates
        </p>
      </div>
    </div>
  );
}
