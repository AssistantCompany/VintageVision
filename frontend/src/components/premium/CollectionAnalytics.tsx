/**
 * CollectionAnalytics - Premium Feature
 * Portfolio value tracking, appreciation charts, and insights
 */

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Crown,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  AlertTriangle
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

interface CollectionItem {
  id: string
  name: string
  category: string
  acquiredDate: string
  acquiredPrice?: number
  currentValueMin?: number
  currentValueMax?: number
  imageUrl?: string
}

interface CollectionAnalyticsProps {
  items: CollectionItem[]
  isPremium?: boolean
  onUpgradeClick?: () => void
}

// Mock historical data for demo - in production this would come from API
const generateMockHistory = (baseValue: number) => {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
  return months.map((month, i) => ({
    month,
    value: Math.round(baseValue * (0.85 + Math.random() * 0.3 + i * 0.02))
  }))
}

export default function CollectionAnalytics({
  items,
  isPremium = false,
  onUpgradeClick
}: CollectionAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | 'all'>('6m')

  // Calculate portfolio metrics
  const metrics = useMemo(() => {
    const totalMin = items.reduce((sum, item) => sum + (item.currentValueMin || 0), 0)
    const totalMax = items.reduce((sum, item) => sum + (item.currentValueMax || 0), 0)
    const totalAcquired = items.reduce((sum, item) => sum + (item.acquiredPrice || 0), 0)
    const avgValue = items.length > 0 ? (totalMin + totalMax) / 2 / items.length : 0

    // Calculate category breakdown
    const categoryBreakdown = items.reduce((acc, item) => {
      const cat = item.category || 'Other'
      if (!acc[cat]) acc[cat] = { count: 0, value: 0 }
      acc[cat].count++
      acc[cat].value += ((item.currentValueMin || 0) + (item.currentValueMax || 0)) / 2
      return acc
    }, {} as Record<string, { count: number; value: number }>)

    // Appreciation calculation
    const appreciationPercent = totalAcquired > 0
      ? (((totalMin + totalMax) / 2 - totalAcquired) / totalAcquired * 100)
      : 0

    return {
      totalMin,
      totalMax,
      totalAcquired,
      avgValue,
      categoryBreakdown,
      appreciationPercent,
      itemCount: items.length
    }
  }, [items])

  // Mock historical data for chart
  const historyData = useMemo(() => {
    return generateMockHistory((metrics.totalMin + metrics.totalMax) / 2)
  }, [metrics.totalMin, metrics.totalMax])

  // Top performers
  const topPerformers = useMemo(() => {
    return items
      .filter(item => item.acquiredPrice && item.currentValueMin)
      .map(item => ({
        ...item,
        appreciation: ((((item.currentValueMin || 0) + (item.currentValueMax || 0)) / 2 - (item.acquiredPrice || 0)) / (item.acquiredPrice || 1)) * 100
      }))
      .sort((a, b) => b.appreciation - a.appreciation)
      .slice(0, 3)
  }, [items])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    return `$${value.toFixed(0)}`
  }

  if (!isPremium) {
    return (
      <GlassCard className="p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Collection Analytics</h3>
          <p className="text-muted-foreground mb-4">
            Track your portfolio value, see appreciation trends, and get insights on your collection.
          </p>
          <button
            onClick={onUpgradeClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            <Crown className="w-5 h-5" />
            Upgrade to Pro
          </button>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Value Header */}
      <GlassCard className="p-6" variant="brass">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-bold text-foreground">
                {formatCurrency((metrics.totalMin + metrics.totalMax) / 2)}
              </h2>
              <span className="text-sm text-muted-foreground">
                ({formatCurrency(metrics.totalMin)} - {formatCurrency(metrics.totalMax)})
              </span>
            </div>
          </div>
          <div className={`
            flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
            ${metrics.appreciationPercent >= 0 ? 'bg-success-muted text-success' : 'bg-danger-muted text-danger'}
          `}>
            {metrics.appreciationPercent >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {Math.abs(metrics.appreciationPercent).toFixed(1)}% total return
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <p className="text-2xl font-bold text-foreground">{metrics.itemCount}</p>
            <p className="text-xs text-muted-foreground">Items</p>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <p className="text-2xl font-bold text-foreground">{formatCurrency(metrics.avgValue)}</p>
            <p className="text-xs text-muted-foreground">Avg Value</p>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <p className="text-2xl font-bold text-foreground">{Object.keys(metrics.categoryBreakdown).length}</p>
            <p className="text-xs text-muted-foreground">Categories</p>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <p className="text-2xl font-bold text-success">{formatCurrency(metrics.totalAcquired)}</p>
            <p className="text-xs text-muted-foreground">Total Invested</p>
          </div>
        </div>
      </GlassCard>

      {/* Value Trend Chart */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-info" />
            <h3 className="font-bold text-foreground">Portfolio Value Trend</h3>
          </div>
          <div className="flex gap-1">
            {(['6m', '1y', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-all
                  ${timeRange === range ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground hover:bg-muted'}
                `}
              >
                {range === 'all' ? 'All' : range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-2">
          {historyData.map((point, idx) => {
            const maxValue = Math.max(...historyData.map(p => p.value))
            const height = (point.value / maxValue) * 100
            const isLast = idx === historyData.length - 1

            return (
              <motion.div
                key={point.month}
                className="flex-1 flex flex-col items-center gap-2"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{ delay: idx * 0.1 }}
              >
                <div
                  className={`
                    w-full rounded-t-lg transition-all
                    ${isLast ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-muted'}
                  `}
                  style={{ height: `${height}%`, minHeight: 20 }}
                />
                <span className="text-xs text-muted-foreground">{point.month}</span>
              </motion.div>
            )
          })}
        </div>
      </GlassCard>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-foreground">Category Breakdown</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(metrics.categoryBreakdown)
              .sort((a, b) => b[1].value - a[1].value)
              .map(([category, data], idx) => {
                const percentage = metrics.totalMax > 0
                  ? (data.value / ((metrics.totalMin + metrics.totalMax) / 2)) * 100
                  : 0
                const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500']

                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-muted-foreground capitalize">{category}</span>
                      <span className="text-sm text-muted-foreground">{data.count} items</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${colors[idx % colors.length]} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: idx * 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-16 text-right">
                        {formatCurrency(data.value)}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </GlassCard>

        {/* Top Performers */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-foreground">Top Performers</h3>
          </div>
          {topPerformers.length > 0 ? (
            <div className="space-y-3">
              {topPerformers.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.acquiredPrice || 0)} → {formatCurrency(((item.currentValueMin || 0) + (item.currentValueMax || 0)) / 2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-success font-bold">
                      <ArrowUpRight className="w-4 h-4" />
                      {item.appreciation.toFixed(0)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Add acquisition prices to track performance</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Insights */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-info" />
          <h3 className="font-bold text-foreground">AI Insights</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-muted-foreground">Market Trend</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Vintage furniture is trending up 12% this quarter. Consider expanding this category.
            </p>
          </div>
          <div className="p-4 bg-white/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-muted-foreground">Diversification</span>
            </div>
            <p className="text-sm text-muted-foreground">
              70% of your value is in one category. Consider diversifying for stability.
            </p>
          </div>
          <div className="p-4 bg-white/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-info" />
              <span className="text-sm font-medium text-muted-foreground">Opportunity</span>
            </div>
            <p className="text-sm text-muted-foreground">
              3 items in your collection may be undervalued. Request expert reviews for better pricing.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
