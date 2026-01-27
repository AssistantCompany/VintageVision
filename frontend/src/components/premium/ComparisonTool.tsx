/**
 * ComparisonTool - Premium Feature
 * Side-by-side item comparison for authentication and decision making
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeftRight,
  Plus,
  X,
  Crown,
  Lock,
  ChevronDown,
  ChevronUp,
  Scale,
  Eye,
  DollarSign
} from 'lucide-react'
import { ItemAnalysis } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'

interface ComparisonToolProps {
  items: ItemAnalysis[]
  isPremium?: boolean
  onUpgradeClick?: () => void
  onSelectItem?: () => void
}

interface ComparisonAttribute {
  label: string
  key: keyof ItemAnalysis | string
  type: 'text' | 'number' | 'confidence' | 'currency' | 'list'
}

const COMPARISON_ATTRIBUTES: ComparisonAttribute[] = [
  { label: 'Name', key: 'name', type: 'text' },
  { label: 'Category', key: 'productCategory', type: 'text' },
  { label: 'Era', key: 'era', type: 'text' },
  { label: 'Style', key: 'style', type: 'text' },
  { label: 'Maker', key: 'maker', type: 'text' },
  { label: 'Origin', key: 'originRegion', type: 'text' },
  { label: 'Confidence', key: 'confidence', type: 'confidence' },
  { label: 'Value (Low)', key: 'estimatedValueMin', type: 'currency' },
  { label: 'Value (High)', key: 'estimatedValueMax', type: 'currency' },
]

export default function ComparisonTool({
  items: availableItems,
  isPremium = false,
  onUpgradeClick,
  onSelectItem
}: ComparisonToolProps) {
  const [selectedItems, setSelectedItems] = useState<ItemAnalysis[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic', 'value'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  // Add an item to comparison (from available items)
  const addItemToComparison = (item: ItemAnalysis) => {
    if (selectedItems.length < 3 && !selectedItems.find(i => i.name === item.name)) {
      setSelectedItems(prev => [...prev, item])
    }
  }

  // Use available items when they exist
  const handleAddItem = () => {
    if (availableItems.length > 0) {
      const nextItem = availableItems.find(i => !selectedItems.find(s => s.name === i.name))
      if (nextItem) {
        addItemToComparison(nextItem)
        return
      }
    }
    onSelectItem?.()
  }

  const removeItem = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index))
  }

  const getValue = (item: ItemAnalysis, attr: ComparisonAttribute): string | number | null => {
    const value = (item as any)[attr.key]
    if (value === undefined || value === null) return null
    return value
  }

  const formatValue = (value: any, type: ComparisonAttribute['type']): string => {
    if (value === null || value === undefined) return '—'

    switch (type) {
      case 'confidence':
        return `${Math.round(value * 100)}%`
      case 'currency':
        return `$${value.toLocaleString()}`
      case 'list':
        return Array.isArray(value) ? value.join(', ') : String(value)
      default:
        return String(value)
    }
  }

  const getComparisonClass = (values: (string | number | null)[], currentValue: string | number | null, type: ComparisonAttribute['type']): string => {
    if (type === 'confidence' || type === 'currency') {
      const numericValues = values.filter(v => v !== null) as number[]
      if (numericValues.length < 2) return ''

      const max = Math.max(...numericValues)
      const min = Math.min(...numericValues)

      if (currentValue === max && max !== min) return 'bg-emerald-50 text-emerald-700'
      if (currentValue === min && max !== min) return 'bg-red-50 text-red-700'
    }
    return ''
  }

  if (!isPremium) {
    return (
      <GlassCard className="p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Comparison Tool</h3>
          <p className="text-muted-foreground mb-4">
            Compare items side-by-side for authentication and decision making.
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
      {/* Header */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Side-by-Side Comparison</h2>
              <p className="text-sm text-muted-foreground">Compare up to 3 items</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedItems.length}/3 selected</span>
          </div>
        </div>
      </GlassCard>

      {/* Item Selection */}
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map(index => {
          const item = selectedItems[index]

          return (
            <motion.div
              key={index}
              layout
              className={`
                relative rounded-xl border-2 border-dashed transition-all min-h-[200px]
                ${item ? 'border-transparent' : 'border-border hover:border-accent/50'}
              `}
            >
              {item ? (
                <GlassCard className="h-full p-4" variant="brass">
                  <button
                    onClick={() => removeItem(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {item.imageUrl && (
                    <div className="w-full h-24 mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.name || 'Item'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <h3 className="font-bold text-foreground text-sm line-clamp-2 mb-2">
                    {item.name || 'Unknown Item'}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className={`
                      px-2 py-0.5 rounded-full text-xs font-medium
                      ${(item.confidence || 0) >= 0.8 ? 'bg-emerald-100 text-emerald-700' :
                        (item.confidence || 0) >= 0.6 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'}
                    `}>
                      {Math.round((item.confidence || 0) * 100)}% confidence
                    </div>
                  </div>
                </GlassCard>
              ) : (
                <button
                  onClick={handleAddItem}
                  className="w-full h-full flex flex-col items-center justify-center p-4 text-muted-foreground hover:text-accent transition-colors"
                >
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="text-sm">Add Item</span>
                </button>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Comparison Table */}
      {selectedItems.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="overflow-hidden">
            {/* Basic Info Section */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleSection('basic')}
                className="w-full px-4 py-3 flex items-center justify-between bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Identification</span>
                </div>
                {expandedSections.includes('basic') ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {expandedSections.includes('basic') && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    {COMPARISON_ATTRIBUTES.slice(0, 6).map(attr => (
                      <div key={attr.key} className="grid grid-cols-4 border-b border-border/50 last:border-0">
                        <div className="px-4 py-3 bg-muted/50 font-medium text-sm text-muted-foreground">
                          {attr.label}
                        </div>
                        {[0, 1, 2].map(index => {
                          const item = selectedItems[index]
                          if (!item && index > 0) return <div key={index} className="px-4 py-3" />
                          if (!item) return null

                          const value = getValue(item, attr)
                          const allValues = selectedItems.map(i => getValue(i, attr))

                          return (
                            <div
                              key={index}
                              className={`px-4 py-3 text-sm ${getComparisonClass(allValues, value, attr.type)}`}
                            >
                              {formatValue(value, attr.type)}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Value Section */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleSection('value')}
                className="w-full px-4 py-3 flex items-center justify-between bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Valuation</span>
                </div>
                {expandedSections.includes('value') ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {expandedSections.includes('value') && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    {COMPARISON_ATTRIBUTES.slice(6).map(attr => (
                      <div key={attr.key} className="grid grid-cols-4 border-b border-border/50 last:border-0">
                        <div className="px-4 py-3 bg-muted/50 font-medium text-sm text-muted-foreground">
                          {attr.label}
                        </div>
                        {[0, 1, 2].map(index => {
                          const item = selectedItems[index]
                          if (!item && index > 0) return <div key={index} className="px-4 py-3" />
                          if (!item) return null

                          const value = getValue(item, attr)
                          const allValues = selectedItems.map(i => getValue(i, attr))

                          return (
                            <div
                              key={index}
                              className={`px-4 py-3 text-sm font-medium ${getComparisonClass(allValues, value, attr.type)}`}
                            >
                              {formatValue(value, attr.type)}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Recommendation */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">AI Recommendation</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedItems.length === 2 ? (
                      (selectedItems[0].confidence || 0) > (selectedItems[1].confidence || 0) ? (
                        <>
                          <span className="font-medium text-purple-600">{selectedItems[0].name}</span> has higher identification confidence
                          ({Math.round((selectedItems[0].confidence || 0) * 100)}% vs {Math.round((selectedItems[1].confidence || 0) * 100)}%).
                          Consider this when making your decision.
                        </>
                      ) : (
                        <>
                          Both items have similar confidence levels. Compare the value estimates and condition
                          to make your decision.
                        </>
                      )
                    ) : (
                      'Add items to see AI-powered comparison insights.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Instructions */}
      {selectedItems.length < 2 && (
        <div className="text-center py-8 text-muted-foreground">
          <Scale className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Select at least 2 items to compare</p>
        </div>
      )}
    </div>
  )
}
