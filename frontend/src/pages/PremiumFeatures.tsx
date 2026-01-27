/**
 * PremiumFeatures - Showcase all Pro features in one place
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Crown,
  FileText,
  BarChart3,
  ArrowLeftRight,
  Bell,
  Package,
  Camera,
  UserCheck,
  ChevronRight,
  Lock,
  Sparkles
} from 'lucide-react'
import PremiumHeader from '@/components/enhanced/PremiumHeader'
import { GlassCard } from '@/components/ui/glass-card'
import {
  PDFExportButton,
  CollectionAnalytics,
  ComparisonTool,
  MarketPriceAlerts,
  BatchAnalysis,
  ARRoomVisualization,
  ExpertEscalationCard
} from '@/components/premium'

// Mock data for demos
const MOCK_COLLECTION_ITEMS = [
  {
    id: '1',
    name: 'Victorian Mahogany Writing Desk',
    category: 'furniture',
    acquiredDate: '2024-06-15',
    acquiredPrice: 450,
    currentValueMin: 800,
    currentValueMax: 1200
  },
  {
    id: '2',
    name: 'Art Deco Table Lamp',
    category: 'lighting',
    acquiredDate: '2024-08-20',
    acquiredPrice: 150,
    currentValueMin: 280,
    currentValueMax: 350
  },
  {
    id: '3',
    name: 'Mid-Century Eames Chair',
    category: 'furniture',
    acquiredDate: '2024-10-01',
    acquiredPrice: 1200,
    currentValueMin: 1800,
    currentValueMax: 2500
  }
]

const MOCK_ANALYSIS = {
  name: 'Victorian Mahogany Writing Desk',
  productCategory: 'furniture',
  era: '1880-1900',
  style: 'Victorian',
  confidence: 0.92,
  description: 'A beautifully preserved Victorian writing desk in solid mahogany with brass hardware.',
  estimatedValueMin: 800,
  estimatedValueMax: 1200,
  maker: 'Unknown British Maker'
}

type FeatureTab = 'analytics' | 'comparison' | 'alerts' | 'batch' | 'ar' | 'expert' | 'pdf'

const FEATURES = [
  { id: 'analytics' as const, name: 'Analytics', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
  { id: 'comparison' as const, name: 'Compare', icon: ArrowLeftRight, color: 'from-purple-500 to-pink-500' },
  { id: 'alerts' as const, name: 'Alerts', icon: Bell, color: 'from-rose-500 to-pink-500' },
  { id: 'batch' as const, name: 'Batch', icon: Package, color: 'from-indigo-500 to-purple-500' },
  { id: 'ar' as const, name: 'AR View', icon: Camera, color: 'from-violet-500 to-fuchsia-500' },
  { id: 'expert' as const, name: 'Expert', icon: UserCheck, color: 'from-amber-500 to-orange-500' },
  { id: 'pdf' as const, name: 'Reports', icon: FileText, color: 'from-green-500 to-emerald-500' }
]

export default function PremiumFeatures() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<FeatureTab>('analytics')

  // For demo purposes, treat all users as premium
  // In production, this would check user.isPremium or subscription status
  const isPremium = true

  const handleUpgradeClick = () => {
    navigate('/pricing')
  }

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-8">
      <PremiumHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Premium Features</h1>
              <p className="text-muted-foreground">Powerful tools for serious collectors</p>
            </div>
          </div>

          {!isPremium && (
            <GlassCard className="p-6 mb-6" variant="brass">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Unlock All Features</h2>
                    <p className="text-muted-foreground">Get access to the complete premium toolkit</p>
                  </div>
                </div>
                <button
                  onClick={handleUpgradeClick}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
                >
                  <Crown className="w-5 h-5" />
                  Upgrade to Pro
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Feature Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {FEATURES.map(feature => (
            <button
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all
                ${activeTab === feature.id
                  ? `bg-gradient-to-r ${feature.color} text-white shadow-lg`
                  : 'bg-card text-muted-foreground hover:bg-muted border border-border'
                }
              `}
            >
              <feature.icon className="w-4 h-4" />
              {feature.name}
            </button>
          ))}
        </div>

        {/* Feature Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'analytics' && (
            <CollectionAnalytics
              items={MOCK_COLLECTION_ITEMS}
              isPremium={isPremium}
              onUpgradeClick={handleUpgradeClick}
            />
          )}

          {activeTab === 'comparison' && (
            <ComparisonTool
              items={[]}
              isPremium={isPremium}
              onUpgradeClick={handleUpgradeClick}
              onSelectItem={() => navigate('/collection')}
            />
          )}

          {activeTab === 'alerts' && (
            <MarketPriceAlerts
              alerts={[]}
              isPremium={isPremium}
              maxAlerts={10}
              onUpgradeClick={handleUpgradeClick}
            />
          )}

          {activeTab === 'batch' && (
            <BatchAnalysis
              isPremium={isPremium}
              maxItems={50}
              onUpgradeClick={handleUpgradeClick}
            />
          )}

          {activeTab === 'ar' && (
            <ARRoomVisualization
              isPremium={isPremium}
              onUpgradeClick={handleUpgradeClick}
            />
          )}

          {activeTab === 'expert' && (
            <ExpertEscalationCard
              analysis={MOCK_ANALYSIS as any}
              isPremium={isPremium}
              remainingEscalations={3}
              onUpgradeClick={handleUpgradeClick}
            />
          )}

          {activeTab === 'pdf' && (
            <div className="space-y-6">
              <GlassCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">Professional PDF Reports</h3>
                    <p className="text-muted-foreground mb-4">
                      Generate detailed appraisal reports perfect for insurance documentation,
                      estate planning, or resale listings. Each report includes identification
                      details, valuation, authentication evidence, and professional formatting.
                    </p>
                    <PDFExportButton
                      analysis={MOCK_ANALYSIS as any}
                      isPremium={isPremium}
                      onUpgradeClick={handleUpgradeClick}
                    />
                  </div>
                </div>
              </GlassCard>

              {/* Report Features */}
              <div className="grid md:grid-cols-3 gap-4">
                <GlassCard className="p-4">
                  <h4 className="font-medium text-foreground mb-2">Insurance Ready</h4>
                  <p className="text-sm text-muted-foreground">
                    Reports include all details insurers need: images, valuations, and provenance.
                  </p>
                </GlassCard>
                <GlassCard className="p-4">
                  <h4 className="font-medium text-foreground mb-2">Professional Format</h4>
                  <p className="text-sm text-muted-foreground">
                    Clean, branded PDF layout that looks professional when shared or printed.
                  </p>
                </GlassCard>
                <GlassCard className="p-4">
                  <h4 className="font-medium text-foreground mb-2">Complete Records</h4>
                  <p className="text-sm text-muted-foreground">
                    Includes analysis date, confidence scores, and authentication evidence.
                  </p>
                </GlassCard>
              </div>
            </div>
          )}
        </motion.div>

        {/* Bottom CTA for non-premium */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <GlassCard className="p-6 text-center" variant="brass">
              <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Unlock the Full VintageVision Experience
              </h3>
              <p className="text-muted-foreground mb-4 max-w-xl mx-auto">
                Join collectors who use Pro features to make smarter decisions,
                track their portfolios, and connect with experts.
              </p>
              <button
                onClick={handleUpgradeClick}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg text-lg"
              >
                <Crown className="w-5 h-5" />
                Start Pro Trial
              </button>
            </GlassCard>
          </motion.div>
        )}
      </main>
    </div>
  )
}
