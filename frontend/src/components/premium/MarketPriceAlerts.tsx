/**
 * MarketPriceAlerts - Premium Feature
 * Real-time market monitoring with customizable alerts
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  BellRing,
  Crown,
  Lock,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Settings,
  Mail,
  Smartphone
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

interface PriceAlert {
  id: string
  itemName: string
  category: string
  targetType: 'above' | 'below' | 'any_change'
  targetValue?: number
  currentValue?: number
  percentChange?: number
  isActive: boolean
  lastTriggered?: string
  createdAt: string
}

interface MarketPriceAlertsProps {
  alerts?: PriceAlert[]
  isPremium?: boolean
  maxAlerts?: number
  onUpgradeClick?: () => void
  onCreateAlert?: (alert: Partial<PriceAlert>) => Promise<void>
  onDeleteAlert?: (id: string) => Promise<void>
  onToggleAlert?: (id: string, isActive: boolean) => Promise<void>
}

// Mock recent market changes for demo
const MOCK_MARKET_UPDATES = [
  { category: 'Mid-Century Furniture', change: 8.2, direction: 'up' as const },
  { category: 'Art Deco Jewelry', change: -3.1, direction: 'down' as const },
  { category: 'Vintage Watches', change: 12.5, direction: 'up' as const },
  { category: 'Victorian Silver', change: 2.8, direction: 'up' as const },
]

export default function MarketPriceAlerts({
  alerts = [],
  isPremium = false,
  maxAlerts = 10,
  onUpgradeClick,
  onCreateAlert,
  onDeleteAlert,
  onToggleAlert
}: MarketPriceAlertsProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [newAlert, setNewAlert] = useState<Partial<PriceAlert>>({
    targetType: 'above',
    isActive: true
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: false
  })

  const handleCreateAlert = async () => {
    if (!newAlert.itemName || !isPremium) return

    try {
      await onCreateAlert?.({
        ...newAlert,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      })
      setNewAlert({ targetType: 'above', isActive: true })
      setIsCreating(false)
    } catch (error) {
      console.error('Failed to create alert:', error)
    }
  }

  if (!isPremium) {
    return (
      <GlassCard className="p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Market Price Alerts</h3>
          <p className="text-muted-foreground mb-4">
            Get notified when market values change for items in your collection or watchlist.
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
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BellRing className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Market Price Alerts</h2>
              <p className="text-sm text-muted-foreground">{alerts.length}/{maxAlerts} alerts active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsCreating(true)}
              disabled={alerts.length >= maxAlerts}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                ${alerts.length >= maxAlerts
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600'
                }
              `}
            >
              <Plus className="w-4 h-4" />
              New Alert
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassCard className="p-4">
              <h3 className="font-medium text-foreground mb-3">Notification Preferences</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                    className="w-4 h-4 rounded border-border text-rose-500 focus:ring-rose-500"
                  />
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Email alerts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                    className="w-4 h-4 rounded border-border text-rose-500 focus:ring-rose-500"
                  />
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Push notifications</span>
                </label>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Alert Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <GlassCard className="p-6" variant="brass">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">Create Price Alert</h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Item/Category Name */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Item or Category Name
                  </label>
                  <input
                    type="text"
                    value={newAlert.itemName || ''}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, itemName: e.target.value }))}
                    placeholder="e.g., Eames Lounge Chair, Mid-Century Furniture"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                {/* Alert Type */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Alert When Price Goes
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'above', label: 'Above', icon: TrendingUp },
                      { value: 'below', label: 'Below', icon: TrendingDown },
                      { value: 'any_change', label: 'Any Change', icon: Bell }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setNewAlert(prev => ({ ...prev, targetType: option.value as any }))}
                        className={`
                          flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${newAlert.targetType === option.value
                            ? 'bg-rose-500 text-white'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }
                        `}
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Value */}
                {newAlert.targetType !== 'any_change' && (
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Target Value
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        value={newAlert.targetValue || ''}
                        onChange={(e) => setNewAlert(prev => ({ ...prev, targetValue: Number(e.target.value) }))}
                        placeholder="0.00"
                        className="w-full pl-9 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Create Button */}
                <button
                  onClick={handleCreateAlert}
                  disabled={!newAlert.itemName}
                  className={`
                    w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium
                    ${newAlert.itemName
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }
                  `}
                >
                  <Bell className="w-5 h-5" />
                  Create Alert
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-muted-foreground">Your Alerts</h3>
          {alerts.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${alert.isActive ? 'bg-rose-100' : 'bg-muted'}
                    `}>
                      {alert.targetType === 'above' ? (
                        <TrendingUp className={`w-5 h-5 ${alert.isActive ? 'text-rose-600' : 'text-muted-foreground'}`} />
                      ) : alert.targetType === 'below' ? (
                        <TrendingDown className={`w-5 h-5 ${alert.isActive ? 'text-rose-600' : 'text-muted-foreground'}`} />
                      ) : (
                        <Bell className={`w-5 h-5 ${alert.isActive ? 'text-rose-600' : 'text-muted-foreground'}`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{alert.itemName}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.targetType === 'above' && `Alert when above $${alert.targetValue?.toLocaleString()}`}
                        {alert.targetType === 'below' && `Alert when below $${alert.targetValue?.toLocaleString()}`}
                        {alert.targetType === 'any_change' && 'Alert on any price change'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleAlert?.(alert.id, !alert.isActive)}
                      className={`
                        w-12 h-6 rounded-full transition-colors relative
                        ${alert.isActive ? 'bg-rose-500' : 'bg-muted'}
                      `}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                        animate={{ left: alert.isActive ? 26 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                    <button
                      onClick={() => onDeleteAlert?.(alert.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-danger-muted rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Market Trends */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-info" />
          <h3 className="font-bold text-foreground">Market Trends This Week</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {MOCK_MARKET_UPDATES.map((update, idx) => (
            <motion.div
              key={update.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`
                p-3 rounded-lg
                ${update.direction === 'up' ? 'bg-success-muted' : 'bg-danger-muted'}
              `}
            >
              <p className="text-sm font-medium text-muted-foreground truncate">{update.category}</p>
              <div className={`
                flex items-center gap-1 text-sm font-bold
                ${update.direction === 'up' ? 'text-success' : 'text-danger'}
              `}>
                {update.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {update.direction === 'up' ? '+' : ''}{update.change}%
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Empty State */}
      {alerts.length === 0 && !isCreating && (
        <div className="text-center py-8 text-muted-foreground">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="mb-2">No alerts set up yet</p>
          <p className="text-sm">Create alerts to track market prices for your items</p>
        </div>
      )}
    </div>
  )
}
