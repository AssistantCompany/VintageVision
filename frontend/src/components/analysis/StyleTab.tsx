import { motion } from 'framer-motion'
import {
  Eye,
  Sparkles,
  Home,
  Palette,
  Lightbulb,
  Clock,
  MapPin,
  Sofa,
  Lamp,
  TreeDeciduous
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { ItemAnalysis, StylingSuggestion } from '@/types'
import { cn } from '@/lib/utils'

interface StyleTabProps {
  analysis: ItemAnalysis
}

// Room type icons mapping
const roomIcons: Record<string, React.ReactNode> = {
  'living room': <Sofa className="w-4 h-4" />,
  'bedroom': <Home className="w-4 h-4" />,
  'dining room': <Home className="w-4 h-4" />,
  'office': <Lamp className="w-4 h-4" />,
  'entryway': <MapPin className="w-4 h-4" />,
  'outdoor': <TreeDeciduous className="w-4 h-4" />,
  'kitchen': <Home className="w-4 h-4" />,
  'bathroom': <Home className="w-4 h-4" />,
}

// Get icon for room type
function getRoomIcon(roomType: string): React.ReactNode {
  const normalizedRoom = roomType.toLowerCase()
  for (const [key, icon] of Object.entries(roomIcons)) {
    if (normalizedRoom.includes(key)) {
      return icon
    }
  }
  return <Home className="w-4 h-4" />
}

// Color utility - determine if color is valid CSS color
function isValidColor(color: string): boolean {
  if (!color) return false
  // Check for hex colors, rgb, rgba, hsl, hsla, or named colors
  const colorPattern = /^(#[0-9A-Fa-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|[a-zA-Z]+)$/
  return colorPattern.test(color.trim())
}

// Get contrasting text color for background
function getContrastColor(bgColor: string): string {
  // Simple heuristic - if color name or hex starts dark, use white
  const darkColors = ['black', 'navy', 'dark', 'brown', 'maroon', 'purple', 'indigo']
  const lowerColor = bgColor.toLowerCase()
  if (darkColors.some(dc => lowerColor.includes(dc))) {
    return 'white'
  }
  if (bgColor.startsWith('#')) {
    const hex = bgColor.slice(1)
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      return luminance > 0.5 ? '#1f2937' : 'white'
    }
  }
  return '#1f2937'
}

export default function StyleTab({ analysis }: StyleTabProps) {
  // Filter out empty styling suggestions
  const validSuggestions = analysis.stylingSuggestions?.filter(
    (s: StylingSuggestion) => (s.title || s.roomType) && (s.description || s.designTips)
  ) ?? []

  // Extract all unique complementary items across suggestions
  const allComplementaryItems = validSuggestions
    .flatMap((s: StylingSuggestion) => s.complementaryItems || [])
    .filter((item, index, arr) => arr.indexOf(item) === index)
    .slice(0, 8)

  // Extract all unique colors across suggestions
  const allColors = validSuggestions
    .flatMap((s: StylingSuggestion) => s.colorPalette || [])
    .filter((color, index, arr) => arr.indexOf(color) === index && isValidColor(color))
    .slice(0, 8)

  // Extract all design tips
  const allDesignTips = validSuggestions
    .map((s: StylingSuggestion) => s.designTips)
    .filter((tip): tip is string => !!tip)
    .slice(0, 4)

  const hasContent = analysis.historicalContext ||
                     validSuggestions.length > 0 ||
                     allComplementaryItems.length > 0 ||
                     allColors.length > 0

  return (
    <div className="space-y-6">
      {/* Historical Context Section */}
      {analysis.historicalContext && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
                      <GlassCard className="p-6" >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-info to-info/70 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">Historical Context</h3>
                  <p className="text-info text-sm mb-3">Understanding the origins and significance</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {analysis.historicalContext}
                  </p>

                  {/* Era and Style badges */}
                  {(analysis.era || analysis.style || analysis.originRegion) && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {analysis.era && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-info-muted text-info text-sm rounded-full">
                          <Clock className="w-3 h-3" />
                          {analysis.era}
                        </span>
                      )}
                      {analysis.style && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">
                          <Eye className="w-3 h-3" />
                          {analysis.style}
                        </span>
                      )}
                      {analysis.originRegion && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-success-muted text-success text-sm rounded-full">
                          <MapPin className="w-3 h-3" />
                          {analysis.originRegion}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
                  </motion.div>
      )}

      {/* Main Grid Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Styling Suggestions by Room Type */}
        {validSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
                          <GlassCard className="p-6" variant="brass">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Style It Like a Pro</h3>
                    <p className="text-primary text-sm">Expert styling suggestions for different spaces</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {validSuggestions.slice(0, 6).map((suggestion: StylingSuggestion, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index + 1) }}
                      className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-primary/20 hover:border-primary/40 transition-colors"
                    >
                      {/* Room Type Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center text-white shadow-sm">
                          {getRoomIcon(suggestion.roomType)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-foreground truncate">
                            {suggestion.title || suggestion.roomType}
                          </h4>
                          {suggestion.roomType && suggestion.title && (
                            <span className="text-xs text-primary">
                              {suggestion.roomType}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                        {suggestion.description || suggestion.designTips}
                      </p>

                      {/* Placement hint if available */}
                      {suggestion.placement && (
                        <div className="flex items-start gap-1.5 mb-3 p-2 bg-warning-muted rounded-lg">
                          <MapPin className="w-3.5 h-3.5 text-warning mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-warning">{suggestion.placement}</span>
                        </div>
                      )}

                      {/* Color Palette Preview */}
                      {suggestion.colorPalette && suggestion.colorPalette.length > 0 && (
                        <div className="flex gap-1.5 mt-auto">
                          {suggestion.colorPalette.slice(0, 4).map((color: string, colorIndex: number) => (
                            <div
                              key={colorIndex}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                              style={{ backgroundColor: isValidColor(color) ? color : '#e5e7eb' }}
                              title={color}
                            />
                          ))}
                          {suggestion.colorPalette.length > 4 && (
                            <span className="w-6 h-6 rounded-full bg-muted border-2 border-card shadow-sm flex items-center justify-center text-xs text-muted-foreground">
                              +{suggestion.colorPalette.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
                      </motion.div>
        )}

        {/* Complementary Items Recommendations */}
        {allComplementaryItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
                          <GlassCard className="p-6 h-full" >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-success to-success/70 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Sofa className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Pairs Well With</h3>
                    <p className="text-success text-sm">Complementary items to consider</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {allComplementaryItems.map((item: string, index: number) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 cursor-default',
                        index % 3 === 0 && 'bg-success-muted text-success border border-success/30',
                        index % 3 === 1 && 'bg-info-muted text-info border border-info/30',
                        index % 3 === 2 && 'bg-warning-muted text-warning border border-warning/30'
                      )}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </GlassCard>
                      </motion.div>
        )}

        {/* Color Palette Display */}
        {allColors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
                          <GlassCard className="p-6 h-full" >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Suggested Color Palette</h3>
                    <p className="text-accent text-sm">Colors that complement this piece</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {allColors.map((color: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index, type: 'spring', stiffness: 200 }}
                      className="group relative"
                    >
                      <div
                        className="aspect-square rounded-xl border-2 border-white shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105 flex items-end justify-center overflow-hidden"
                        style={{ backgroundColor: color }}
                      >
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 bg-black/20 backdrop-blur-sm rounded-t-md opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: getContrastColor(color) }}
                        >
                          {color}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
                      </motion.div>
        )}

        {/* Design Tips */}
        {allDesignTips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={cn(
              allColors.length === 0 && allComplementaryItems.length === 0 ? 'md:col-span-2' : ''
            )}
          >
                          <GlassCard className="p-6 h-full" >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-danger to-danger/70 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Pro Design Tips</h3>
                    <p className="text-danger text-sm">Expert advice for styling this piece</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {allDesignTips.map((tip: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-danger/20"
                    >
                      <span className="w-6 h-6 bg-gradient-to-br from-danger to-danger/70 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className="text-muted-foreground text-sm leading-relaxed">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
                      </motion.div>
        )}
      </div>

      {/* Empty State */}
      {!hasContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              No Styling Information Available
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              Historical context and styling suggestions will appear here when available.
              Try analyzing a vintage or antique item to see expert styling recommendations.
            </p>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}
