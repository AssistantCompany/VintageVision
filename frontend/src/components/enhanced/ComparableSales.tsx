import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { ComparableSale, formatPrice } from '@/types'

interface ComparableSalesProps {
  sales: ComparableSale[] | null
  estimatedMin: number | null
  estimatedMax: number | null
}

export default function ComparableSales({
  sales,
  estimatedMin,
  estimatedMax
}: ComparableSalesProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Filter out empty or invalid sales (no description or zero price)
  const validSales = sales?.filter(
    s => s.description && s.description.trim() !== '' && s.price > 0
  ) ?? []

  if (validSales.length === 0) return null

  // Calculate average sale price from valid sales
  const avgPrice = validSales.reduce((sum, sale) => sum + sale.price, 0) / validSales.length
  const minPrice = Math.min(...validSales.map(s => s.price))
  const maxPrice = Math.max(...validSales.map(s => s.price))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <GlassCard className="overflow-hidden" >
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 flex items-center justify-between hover:bg-white/30 transition-colors"
          aria-expanded={isExpanded}
          aria-controls="comparable-sales-content"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center" aria-hidden="true">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-foreground">Market Comparables</h3>
              <p className="text-sm text-muted-foreground">
                {validSales.length} recent {validSales.length === 1 ? 'sale' : 'sales'} • Avg: {formatPrice(avgPrice)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
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
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Price Range from Comparables</span>
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>

                  {/* Visual Price Range Bar */}
                  <div className="relative h-8 bg-muted rounded-full overflow-hidden mb-3">
                    <div
                      className="absolute h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                      style={{
                        left: '0%',
                        width: '100%'
                      }}
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
                  {(estimatedMin || estimatedMax) && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-muted-foreground">Our estimate:</span>
                      <span className="font-bold text-indigo-600">
                        {estimatedMin && estimatedMax
                          ? `${formatPrice(estimatedMin)} - ${formatPrice(estimatedMax)}`
                          : formatPrice(estimatedMin || estimatedMax)}
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
                      className="bg-white/60 rounded-xl p-4 border border-border hover:border-blue-300 transition-colors"
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
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              Relevance: {sale.relevance}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-bold text-green-600">
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
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Market Insight:</strong> These comparable sales help establish fair market value.
                    Prices may vary based on condition, provenance, and current market demand.
                    {avgPrice > (estimatedMax || 0) && ' Market prices appear stronger than our estimate - consider adjusting expectations.'}
                    {avgPrice < (estimatedMin || Infinity) && ' Our estimate may be conservative based on recent sales data.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  )
}
