import { motion } from 'framer-motion'
import {
  Heart,
  Share2,
  Download,
  FileText,
  Clock,
  DollarSign,
  Palette,
  Maximize2,
  Tag,
  ExternalLink,
  ShoppingCart,
  Globe,
  Calendar,
  Award,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import DealRatingBadge from '@/components/enhanced/DealRatingBadge'
import DomainExpertBadge from '@/components/enhanced/DomainExpertBadge'
import { VisualEvidenceOverlay } from '@/components/enhanced/VisualEvidenceOverlay'
import {
  ItemAnalysis,
  formatPrice,
  formatPriceRange,
  VisualMarker
} from '@/types'
import { cn, trackEvent } from '@/lib/utils'

interface OverviewTabProps {
  analysis: ItemAnalysis
  displayAnalysis: ItemAnalysis
  visualMarkers: VisualMarker[]
  activeView: 'classic' | 'world-class'
  user: any
  onShowFullImage: () => void
  onShowSaveDialog: () => void
  onShare: () => void
  onPDFExport: () => void
  onDownload: () => void
  onFeedback: (isCorrect: boolean) => void
}

export default function OverviewTab({
  analysis,
  displayAnalysis,
  visualMarkers,
  activeView,
  user,
  onShowFullImage,
  onShowSaveDialog,
  onShare,
  onPDFExport,
  onDownload,
  onFeedback
}: OverviewTabProps) {
  // Use semantic status colors that work on dark backgrounds
  const confidenceColor = displayAnalysis.confidence >= 0.8
    ? 'text-success'
    : displayAnalysis.confidence >= 0.6
      ? 'text-warning'
      : 'text-danger'

  const confidenceBackground = displayAnalysis.confidence >= 0.8
    ? 'bg-success-muted'
    : displayAnalysis.confidence >= 0.6
      ? 'bg-warning-muted'
      : 'bg-danger-muted'

  return (
    <GlassCard className="overflow-hidden w-full" variant="brass">
      <div className="relative p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-start">
            {/* Image Section */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {activeView === 'world-class' && visualMarkers.length > 0 ? (
                <VisualEvidenceOverlay
                  imageUrl={analysis.imageUrl}
                  markers={visualMarkers}
                  className="shadow-2xl"
                  interactive={true}
                />
              ) : (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={analysis.imageUrl}
                    alt={analysis.name}
                    className="w-full h-auto object-cover cursor-pointer"
                    onClick={onShowFullImage}
                    style={{ aspectRatio: '4/3' }}
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Expand Button */}
                  <motion.button
                    onClick={onShowFullImage}
                    className="absolute top-4 right-4 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Maximize2 className="w-5 h-5" />
                  </motion.button>

                  {/* Domain Expert Badge */}
                  {analysis.domainExpert && (
                    <div className="absolute top-4 left-4">
                      <DomainExpertBadge expert={analysis.domainExpert} size="sm" />
                    </div>
                  )}
                </div>
              )}

              {/* Confidence Badge */}
              <motion.div
                className={cn(
                  'absolute -top-2 -right-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg',
                  confidenceBackground,
                  confidenceColor
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
              >
                {Math.round(analysis.confidence * 100)}% Match
              </motion.div>
            </motion.div>

            {/* Content Section */}
            <div className="space-y-5">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3 leading-tight">
                  {analysis.name}
                </h1>

                {/* Maker Attribution */}
                {analysis.maker && (
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-lg text-foreground font-medium">
                      {analysis.maker}
                      {analysis.makerConfidence && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({Math.round(analysis.makerConfidence * 100)}% confidence)
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {/* Brand and Model */}
                {analysis.brand && !analysis.maker && (
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-lg text-foreground font-medium">
                      {analysis.brand}
                      {analysis.modelNumber && ` ${analysis.modelNumber}`}
                    </span>
                  </div>
                )}

                {/* Tags Row - using dark-theme appropriate colors */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {analysis.productCategory && (
                    <span className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5",
                      analysis.productCategory === 'antique' ? 'bg-warning-muted text-warning' :
                      analysis.productCategory === 'vintage' ? 'bg-primary/20 text-primary' :
                      analysis.productCategory === 'modern_branded' ? 'bg-info-muted text-info' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {analysis.productCategory === 'antique' ? 'Antique' :
                       analysis.productCategory === 'vintage' ? 'Vintage' :
                       analysis.productCategory === 'modern_branded' ? 'Modern Product' :
                       'Modern Item'}
                    </span>
                  )}

                  {analysis.era && (
                    <span className="px-3 py-1.5 bg-info-muted text-info rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {analysis.era}
                    </span>
                  )}

                  {analysis.style && (
                    <span className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <Palette className="w-3 h-3" />
                      {analysis.style}
                    </span>
                  )}

                  {analysis.originRegion && (
                    <span className="px-3 py-1.5 bg-patina/30 text-patina rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <Globe className="w-3 h-3" />
                      {analysis.originRegion}
                    </span>
                  )}

                  {analysis.periodStart && (
                    <span className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      c. {analysis.periodStart}{analysis.periodEnd && analysis.periodEnd !== analysis.periodStart ? `-${analysis.periodEnd}` : ''}
                    </span>
                  )}
                </div>

                {/* Value Display */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {analysis.currentRetailPrice && (
                    <span className="px-4 py-2 bg-success-muted text-success rounded-xl text-sm font-semibold flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      {formatPrice(analysis.currentRetailPrice)} retail
                    </span>
                  )}

                  {!analysis.currentRetailPrice && (analysis.estimatedValueMin || analysis.estimatedValueMax) && (
                    <span className="px-4 py-2 bg-success-muted text-success rounded-xl text-sm font-semibold flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {formatPriceRange(analysis.estimatedValueMin, analysis.estimatedValueMax)}
                    </span>
                  )}
                </div>

                {/* Deal Rating */}
                {analysis.dealRating && analysis.askingPrice && (
                  <DealRatingBadge
                    rating={analysis.dealRating}
                    askingPrice={analysis.askingPrice}
                    estimatedMin={analysis.estimatedValueMin}
                    estimatedMax={analysis.estimatedValueMax}
                    profitPotentialMin={analysis.profitPotentialMin}
                    profitPotentialMax={analysis.profitPotentialMax}
                    explanation={analysis.dealExplanation}
                    size="lg"
                    showDetails={true}
                  />
                )}

                {/* Product Link */}
                {analysis.productUrl && (
                  <motion.a
                    href={analysis.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => trackEvent('product_link_clicked', { itemName: analysis.name, url: analysis.productUrl })}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Product
                  </motion.a>
                )}
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-foreground/90 leading-relaxed">
                  {analysis.description}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={onShowSaveDialog}
                  variant="brass"
                  size="default"
                  className="w-full sm:w-auto justify-center"
                >
                  <Heart className="w-5 h-5" />
                  <span>Save</span>
                </Button>

                <div className="flex gap-2 sm:gap-3">
                  <Button
                    onClick={onShare}
                    variant="outline"
                    size="default"
                    className="flex-1 sm:flex-none justify-center"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </Button>

                  <Button
                    onClick={onPDFExport}
                    variant="outline"
                    size="default"
                  >
                    <FileText className="w-5 h-5" />
                  </Button>

                  <Button
                    onClick={onDownload}
                    variant="outline"
                    size="default"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>

              {/* Feedback Section */}
              {user && (
                <motion.div
                  className="border-t border-border pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-sm text-muted-foreground mb-3">
                    Is this identification accurate?
                  </p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onFeedback(true)}
                      variant="outline"
                      size="sm"
                      className="text-success hover:bg-success-muted"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Yes</span>
                    </Button>

                    <Button
                      onClick={() => onFeedback(false)}
                      variant="outline"
                      size="sm"
                      className="text-danger hover:bg-danger-muted"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>No</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
    </GlassCard>
  )
}
