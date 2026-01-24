/**
 * Premium Features - VintageVision Pro
 * Export all premium components for easy imports
 */

// Paywall component for gating premium features
export { default as Paywall, PaywallBanner, CollectionLimitIndicator } from './Paywall'
export type { PaywallProps, PaywallFeature } from './Paywall'

// PDF Export for insurance and resale reports
export { default as PDFExportButton } from './PDFExportButton'

// Expert escalation for human verification
export { default as ExpertEscalationCard } from './ExpertEscalationCard'

// Collection analytics dashboard
export { default as CollectionAnalytics } from './CollectionAnalytics'

// Side-by-side item comparison
export { default as ComparisonTool } from './ComparisonTool'

// Market price alerts
export { default as MarketPriceAlerts } from './MarketPriceAlerts'

// Batch analysis for estate sales
export { default as BatchAnalysis } from './BatchAnalysis'

// AR room visualization
export { default as ARRoomVisualization } from './ARRoomVisualization'

// Re-export types
export type { } from './PDFExportButton'
