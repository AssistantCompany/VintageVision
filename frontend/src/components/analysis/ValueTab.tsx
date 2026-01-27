import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Repeat,
  Clock,
  TrendingUp,
  TrendingDown,
  Store,
  Globe,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  AlertCircle,
  BarChart3,
  Calendar,
  MapPin,
  DollarSign,
  ExternalLink,
  ShoppingBag,
  Search,
  Activity,
  Flame,
  Snowflake,
  LineChart
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import {
  ItemAnalysis,
  FlipDifficulty,
  formatPrice,
  getDemandLevelStyle
} from '@/types'
import { cn, trackEvent } from '@/lib/utils'

interface ValueTabProps {
  analysis: ItemAnalysis
}

// Flip difficulty configuration - using semantic dark-theme colors
const difficultyConfig: Record<FlipDifficulty, {
  label: string
  description: string
  icon: typeof Zap
  gradient: string
  bgColor: string
  borderColor: string
  textColor: string
}> = {
  easy: {
    label: 'Easy Flip',
    description: 'High demand, quick sale expected',
    icon: Zap,
    gradient: 'from-success to-success/80',
    bgColor: 'bg-success-muted',
    borderColor: 'border-success/30',
    textColor: 'text-success'
  },
  moderate: {
    label: 'Moderate',
    description: 'Decent demand, may take some time',
    icon: Target,
    gradient: 'from-warning to-warning/80',
    bgColor: 'bg-warning-muted',
    borderColor: 'border-warning/30',
    textColor: 'text-warning'
  },
  hard: {
    label: 'Challenging',
    description: 'Niche market, patience required',
    icon: TrendingUp,
    gradient: 'from-primary to-brass-dark',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    textColor: 'text-primary'
  },
  very_hard: {
    label: 'Very Difficult',
    description: 'Limited market, specialist buyers only',
    icon: AlertCircle,
    gradient: 'from-danger to-danger/80',
    bgColor: 'bg-danger-muted',
    borderColor: 'border-danger/30',
    textColor: 'text-danger'
  }
}

// Channel icons mapping
const channelIcons: Record<string, typeof Store> = {
  'ebay': Globe,
  'etsy': Store,
  'auction': TrendingUp,
  'consignment': Store,
  'dealer': Store,
  'default': Store
}

// Marketplace configuration - using dark-theme compatible colors
const marketplaceConfig: Record<string, {
  color: string
  bgColor: string
  borderColor: string
}> = {
  'ebay': {
    color: 'text-info',
    bgColor: 'bg-info-muted hover:bg-info/20',
    borderColor: 'border-info/30'
  },
  'amazon': {
    color: 'text-warning',
    bgColor: 'bg-warning-muted hover:bg-warning/20',
    borderColor: 'border-warning/30'
  },
  'etsy': {
    color: 'text-primary',
    bgColor: 'bg-primary/10 hover:bg-primary/20',
    borderColor: 'border-primary/30'
  },
  '1stdibs': {
    color: 'text-foreground',
    bgColor: 'bg-muted hover:bg-secondary',
    borderColor: 'border-border'
  },
  'chairish': {
    color: 'text-velvet',
    bgColor: 'bg-velvet/20 hover:bg-velvet/30',
    borderColor: 'border-velvet/30'
  },
  'ruby lane': {
    color: 'text-danger',
    bgColor: 'bg-danger-muted hover:bg-danger/20',
    borderColor: 'border-danger/30'
  },
  'liveauctioneers': {
    color: 'text-secondary-foreground',
    bgColor: 'bg-secondary hover:bg-secondary/80',
    borderColor: 'border-border'
  },
  'default': {
    color: 'text-muted-foreground',
    bgColor: 'bg-muted hover:bg-secondary',
    borderColor: 'border-border'
  }
}

function getMarketplaceConfig(name: string) {
  const lowerName = name.toLowerCase()
  for (const [key, config] of Object.entries(marketplaceConfig)) {
    if (lowerName.includes(key)) {
      return config
    }
  }
  return marketplaceConfig.default
}

function getChannelIcon(channel: string) {
  const lowerChannel = channel.toLowerCase()
  for (const [key, icon] of Object.entries(channelIcons)) {
    if (lowerChannel.includes(key)) {
      return icon
    }
  }
  return channelIcons.default
}

export default function ValueTab({ analysis }: ValueTabProps) {
  const [flipExpanded, setFlipExpanded] = useState(true)
  const [comparablesExpanded, setComparablesExpanded] = useState(true)
  const [marketInsightsExpanded, setMarketInsightsExpanded] = useState(true)

  // Extract data from analysis
  const {
    flipDifficulty,
    flipTimeEstimate,
    resaleChannels,
    profitPotentialMin,
    profitPotentialMax,
    comparableSales,
    estimatedValueMin,
    estimatedValueMax,
    marketplaceLinks,
    marketIntelligence,
    name: itemName
  } = analysis

  // Prepare marketplace links in consistent format
  const formattedMarketplaceLinks = marketplaceLinks?.map(link => ({
    marketplace: 'marketplaceName' in link ? link.marketplaceName : (link as { marketplace: string }).marketplace,
    url: 'linkUrl' in link ? link.linkUrl : (link as { url: string }).url
  })) || null

  // Filter valid comparable sales
  const validSales = comparableSales?.filter(
    s => s.description && s.description.trim() !== '' && s.price > 0
  ) ?? []

  // Calculate comparable sales statistics
  const avgPrice = validSales.length > 0
    ? validSales.reduce((sum, sale) => sum + sale.price, 0) / validSales.length
    : 0
  const minPrice = validSales.length > 0 ? Math.min(...validSales.map(s => s.price)) : 0
  const maxPrice = validSales.length > 0 ? Math.max(...validSales.map(s => s.price)) : 0

  // Check if flip assessment has data
  const hasFlipData = flipDifficulty || flipTimeEstimate || (resaleChannels && resaleChannels.length > 0)

  // Flip difficulty config
  const diffConfig = flipDifficulty ? difficultyConfig[flipDifficulty] : null
  const DifficultyIcon = diffConfig?.icon || Target

  // Handle marketplace link click tracking
  const handleLinkClick = (marketplace: string, url: string) => {
    trackEvent('marketplace_link_clicked', {
      itemName,
      marketplace,
      url
    })
  }

  return (
    <div className="space-y-6">
      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Flip Assessment Section */}
          {hasFlipData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="overflow-hidden" >
                {/* Header */}
                <button
                  onClick={() => setFlipExpanded(!flipExpanded)}
                  className="w-full p-5 flex items-center justify-between hover:bg-card/50 transition-colors"
                  aria-expanded={flipExpanded}
                  aria-controls="flip-assessment-content"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      diffConfig ? `bg-gradient-to-br ${diffConfig.gradient}` : 'bg-gradient-to-br from-secondary to-muted'
                    )} aria-hidden="true">
                      <Repeat className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-foreground">Flip Assessment</h3>
                      <p className="text-sm text-muted-foreground">
                        {diffConfig?.label || 'Resale potential analysis'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {flipDifficulty && diffConfig && (
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-bold',
                        diffConfig.bgColor,
                        diffConfig.borderColor,
                        'border',
                        diffConfig.textColor
                      )}>
                        {diffConfig.label}
                      </span>
                    )}
                    {flipExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Content */}
                <AnimatePresence>
                  {flipExpanded && (
                    <motion.div
                      id="flip-assessment-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4">
                        {/* Difficulty & Time Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Difficulty */}
                          {flipDifficulty && diffConfig && (
                            <div className={cn(
                              'p-4 rounded-xl border',
                              diffConfig.bgColor,
                              diffConfig.borderColor
                            )}>
                              <div className="flex items-center gap-2 mb-2">
                                <DifficultyIcon className={cn('w-5 h-5', diffConfig.textColor)} />
                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Difficulty</span>
                              </div>
                              <p className={cn('font-bold text-lg', diffConfig.textColor)}>
                                {diffConfig.label}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{diffConfig.description}</p>
                            </div>
                          )}

                          {/* Time Estimate */}
                          {flipTimeEstimate && (
                            <div className="p-4 rounded-xl border bg-info-muted border-info/30">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-info" />
                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Time to Sell</span>
                              </div>
                              <p className="font-bold text-lg text-info">{flipTimeEstimate}</p>
                              <p className="text-xs text-muted-foreground mt-1">Estimated selling timeline</p>
                            </div>
                          )}
                        </div>

                        {/* Profit Potential */}
                        {(profitPotentialMin !== null || profitPotentialMax !== null) && (
                          <div className="p-4 rounded-xl border bg-success-muted border-success/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-success" />
                                <span className="font-semibold text-foreground">Potential Profit</span>
                              </div>
                              <p className="font-bold text-xl text-success">
                                {profitPotentialMin != null && profitPotentialMax != null
                                  ? `$${profitPotentialMin.toLocaleString()} - $${profitPotentialMax.toLocaleString()}`
                                  : profitPotentialMin != null
                                    ? `$${profitPotentialMin.toLocaleString()}+`
                                    : profitPotentialMax != null
                                      ? `Up to $${profitPotentialMax.toLocaleString()}`
                                      : 'N/A'
                                }
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Resale Channels */}
                        {resaleChannels && resaleChannels.length > 0 && (
                          <div>
                            <h4 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                              <Store className="w-4 h-4" />
                              Recommended Selling Channels
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {resaleChannels.map((channel, index) => {
                                const ChannelIcon = getChannelIcon(channel)
                                return (
                                  <motion.span
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-xl border border-border text-sm text-foreground shadow-sm"
                                  >
                                    <ChannelIcon className="w-4 h-4 text-primary" />
                                    {channel}
                                  </motion.span>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Pro Tip */}
                        <div className="bg-secondary rounded-xl p-4 border border-border">
                          <p className="text-sm text-foreground">
                            <strong>Pro Tip:</strong> {
                              flipDifficulty === 'easy'
                                ? 'List quickly! High-demand items move fast. Consider multiple platforms for best results.'
                                : flipDifficulty === 'moderate'
                                  ? 'Take quality photos and write detailed descriptions. Patience pays off with the right buyer.'
                                  : flipDifficulty === 'hard'
                                    ? 'Target specialist collectors and niche communities. Auction houses may yield better prices.'
                                    : 'Consider consignment with a specialized dealer who has access to the right buyers.'
                            }
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          )}

          {/* Market Insights Section */}
          {marketIntelligence && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="overflow-hidden" variant="brass">
                {/* Header */}
                <button
                  onClick={() => setMarketInsightsExpanded(!marketInsightsExpanded)}
                  className="w-full p-5 flex items-center justify-between hover:bg-card/50 transition-colors"
                  aria-expanded={marketInsightsExpanded}
                  aria-controls="market-insights-content"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-brass-dark rounded-xl flex items-center justify-center" aria-hidden="true">
                      <LineChart className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-foreground">Market Insights</h3>
                      <p className="text-sm text-muted-foreground">Current market conditions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {marketInsightsExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Content */}
                <AnimatePresence>
                  {marketInsightsExpanded && (
                    <motion.div
                      id="market-insights-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4">
                        {/* Demand & Trend Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Demand Level */}
                          {marketIntelligence.demandLevel && (
                            <div className={cn(
                              'p-4 rounded-xl border',
                              marketIntelligence.demandLevel === 'hot' ? 'bg-danger-muted border-danger/30' :
                              marketIntelligence.demandLevel === 'steady' ? 'bg-success-muted border-success/30' :
                              marketIntelligence.demandLevel === 'slow' ? 'bg-warning-muted border-warning/30' :
                              'bg-info-muted border-info/30'
                            )}>
                              <div className="flex items-center gap-2 mb-2">
                                {marketIntelligence.demandLevel === 'hot' && <Flame className="w-5 h-5 text-danger" />}
                                {marketIntelligence.demandLevel === 'steady' && <Activity className="w-5 h-5 text-success" />}
                                {marketIntelligence.demandLevel === 'slow' && <TrendingDown className="w-5 h-5 text-warning" />}
                                {marketIntelligence.demandLevel === 'cold' && <Snowflake className="w-5 h-5 text-info" />}
                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Demand</span>
                              </div>
                              <p className={cn(
                                'font-bold text-lg',
                                marketIntelligence.demandLevel === 'hot' ? 'text-danger' :
                                marketIntelligence.demandLevel === 'steady' ? 'text-success' :
                                marketIntelligence.demandLevel === 'slow' ? 'text-warning' :
                                'text-info'
                              )}>
                                {getDemandLevelStyle(marketIntelligence.demandLevel).label}
                              </p>
                            </div>
                          )}

                          {/* Price Trend */}
                          {marketIntelligence.pricetrend && (
                            <div className={cn(
                              'p-4 rounded-xl border',
                              marketIntelligence.pricetrend === 'rising' ? 'bg-success-muted border-success/30' :
                              marketIntelligence.pricetrend === 'declining' ? 'bg-danger-muted border-danger/30' :
                              'bg-muted border-border'
                            )}>
                              <div className="flex items-center gap-2 mb-2">
                                {marketIntelligence.pricetrend === 'rising' && <TrendingUp className="w-5 h-5 text-success" />}
                                {marketIntelligence.pricetrend === 'declining' && <TrendingDown className="w-5 h-5 text-danger" />}
                                {marketIntelligence.pricetrend === 'stable' && <Activity className="w-5 h-5 text-muted-foreground" />}
                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Price Trend</span>
                              </div>
                              <p className={cn(
                                'font-bold text-lg capitalize',
                                marketIntelligence.pricetrend === 'rising' ? 'text-success' :
                                marketIntelligence.pricetrend === 'declining' ? 'text-danger' :
                                'text-muted-foreground'
                              )}>
                                {marketIntelligence.pricetrend}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Sales Velocity */}
                        {marketIntelligence.salesVelocity && (
                          <div className="p-4 rounded-xl border bg-info-muted border-info/30">
                            <div className="flex items-center gap-2 mb-2">
                              <BarChart3 className="w-5 h-5 text-info" />
                              <span className="text-sm font-medium text-foreground">Sales Velocity</span>
                            </div>
                            <p className="text-sm text-info">{marketIntelligence.salesVelocity}</p>
                          </div>
                        )}

                        {/* Best Venues */}
                        {marketIntelligence.bestVenues && marketIntelligence.bestVenues.length > 0 && (
                          <div>
                            <h4 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                              <Store className="w-4 h-4" />
                              Best Selling Venues
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {marketIntelligence.bestVenues.map((venue, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1.5 bg-warning-muted text-warning rounded-lg text-sm font-medium"
                                >
                                  {venue}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Seasonality */}
                        {marketIntelligence.seasonality && (
                          <div className="bg-warning-muted rounded-xl p-4 border border-warning/30">
                            <p className="text-sm text-foreground">
                              <strong className="text-warning">Seasonality:</strong> {marketIntelligence.seasonality}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Comparable Sales Section */}
          {validSales.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="overflow-hidden" >
                {/* Header */}
                <button
                  onClick={() => setComparablesExpanded(!comparablesExpanded)}
                  className="w-full p-5 flex items-center justify-between hover:bg-card/50 transition-colors"
                  aria-expanded={comparablesExpanded}
                  aria-controls="comparable-sales-content"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-info to-info/70 rounded-xl flex items-center justify-center" aria-hidden="true">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-foreground">Market Comparables</h3>
                      <p className="text-sm text-muted-foreground">
                        {validSales.length} recent {validSales.length === 1 ? 'sale' : 'sales'} - Avg: {formatPrice(avgPrice)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {comparablesExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Content */}
                <AnimatePresence>
                  {comparablesExpanded && (
                    <motion.div
                      id="comparable-sales-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4">
                        {/* Price Range Visualization */}
                        <div className="bg-info-muted rounded-xl p-4 border border-info/30">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground">Price Range from Comparables</span>
                            <TrendingUp className="w-4 h-4 text-info" />
                          </div>

                          {/* Visual Price Range Bar */}
                          <div className="relative h-8 bg-muted rounded-full overflow-hidden mb-3">
                            <div
                              className="absolute h-full bg-gradient-to-r from-info to-info/70 rounded-full"
                              style={{ left: '0%', width: '100%' }}
                            />
                            {/* Markers */}
                            <div className="absolute inset-0 flex items-center justify-between px-3">
                              <span className="text-xs font-bold text-white drop-shadow">
                                {formatPrice(minPrice)}
                              </span>
                              <span className="text-xs font-bold text-white drop-shadow bg-white/20 px-2 py-0.5 rounded">
                                AVG: {formatPrice(avgPrice)}
                              </span>
                              <span className="text-xs font-bold text-white drop-shadow">
                                {formatPrice(maxPrice)}
                              </span>
                            </div>
                          </div>

                          {/* Our Estimate Comparison */}
                          {(estimatedValueMin || estimatedValueMax) && (
                            <div className="flex items-center justify-center gap-2 text-sm">
                              <span className="text-muted-foreground">Our estimate:</span>
                              <span className="font-bold text-info">
                                {estimatedValueMin && estimatedValueMax
                                  ? `${formatPrice(estimatedValueMin)} - ${formatPrice(estimatedValueMax)}`
                                  : formatPrice(estimatedValueMin || estimatedValueMax)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Individual Sales */}
                        <div className="space-y-3">
                          {validSales.map((sale, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className="bg-card/60 rounded-xl p-4 border border-border hover:border-info/50 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <p className="font-medium text-foreground mb-2">{sale.description}</p>
                                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5" />
                                      {sale.venue}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5" />
                                      {sale.date}
                                    </span>
                                  </div>
                                  {sale.relevance && (
                                    <p className="text-xs text-muted-foreground/70 mt-2 italic">
                                      Relevance: {sale.relevance}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-lg font-bold text-success">
                                    <DollarSign className="w-4 h-4" />
                                    {sale.price?.toLocaleString() ?? 'N/A'}
                                  </div>
                                  <span className="text-xs text-muted-foreground">Sold</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Market Insight */}
                        <div className="bg-info-muted rounded-xl p-4 border border-info/30">
                          <p className="text-sm text-foreground">
                            <strong>Market Insight:</strong> These comparable sales help establish fair market value.
                            Prices may vary based on condition, provenance, and current market demand.
                            {avgPrice > (estimatedValueMax || 0) && ' Market prices appear stronger than our estimate - consider adjusting expectations.'}
                            {avgPrice < (estimatedValueMin || Infinity) && ' Our estimate may be conservative based on recent sales data.'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>

      {/* Marketplace Links - Full Width */}
      {formattedMarketplaceLinks && formattedMarketplaceLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-5" >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-success to-patina rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Shop Similar Items</h3>
                <p className="text-sm text-muted-foreground">Find this item or similar on marketplaces</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formattedMarketplaceLinks.map((link, index) => {
                const config = getMarketplaceConfig(link.marketplace)

                return (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(link.marketplace, link.url)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all',
                      config.bgColor,
                      config.borderColor
                    )}
                  >
                    <Search className={cn('w-4 h-4', config.color)} />
                    <span className={cn('font-medium text-sm', config.color)}>
                      {link.marketplace}
                    </span>
                    <ExternalLink className={cn('w-3 h-3 opacity-60', config.color)} />
                  </motion.a>
                )
              })}
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Links open in a new tab. Prices and availability may vary.
            </p>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}
