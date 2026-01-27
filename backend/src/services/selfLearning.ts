/**
 * Self-Learning System for VintageVision
 * ========================================
 * Collects feedback, analyzes patterns, and improves accuracy over time.
 *
 * Learning Signals:
 * 1. Expert corrections from human experts
 * 2. User corrections (with verification)
 * 3. Auction/sale outcome data
 * 4. Ground truth test results
 * 5. Pattern analysis from failure modes
 */

import { createLogger } from '../utils/logger.js'
import type { ItemAnalysis } from './openai'

const logger = createLogger('self-learning')

// ============================================================================
// TYPES
// ============================================================================

export interface FeedbackEntry {
  id: string
  analysisId: string
  imageHash: string
  timestamp: Date
  source: 'expert' | 'user' | 'auction' | 'ground_truth' | 'system'

  original: {
    name: string
    maker: string | null
    era: string
    style: string
    valueMin: number
    valueMax: number
    confidence: number
    category?: string
  }

  correction: {
    field: string
    originalValue: unknown
    correctedValue: unknown
    confidence: number  // How confident are we in the correction
    notes?: string
  }

  metadata: {
    verifiedBy?: string
    verificationCount: number
    imageQuality?: 'low' | 'medium' | 'high'
    category?: string
  }
}

export interface LearningInsight {
  type: 'pattern' | 'confusion' | 'calibration' | 'gap'
  severity: 'high' | 'medium' | 'low'
  description: string
  evidence: string[]
  suggestedAction: string
  frequency: number
  lastOccurred: Date
}

export interface PromptAdjustment {
  id: string
  category?: string
  condition: string
  adjustment: string
  effectiveness: number  // 0-1 score from testing
  createdAt: Date
  updatedAt: Date
  active: boolean
}

export interface LearningSystemState {
  totalFeedbackEntries: number
  totalInsightsGenerated: number
  activePromptAdjustments: number
  lastAnalysisDate: Date | null
  overallAccuracyTrend: {
    period: string
    accuracy: number
  }[]
  topIssues: LearningInsight[]
}

// ============================================================================
// IN-MEMORY STORES (Would be DB in production)
// ============================================================================

class LearningDataStore {
  private feedback: FeedbackEntry[] = []
  private insights: LearningInsight[] = []
  private promptAdjustments: PromptAdjustment[] = []
  private analysisHistory: Map<string, { original: Partial<ItemAnalysis>; corrected?: Partial<ItemAnalysis> }> = new Map()

  // Confusion matrix for maker/era combinations
  private confusionMatrix: Map<string, Map<string, number>> = new Map()

  addFeedback(entry: FeedbackEntry): void {
    this.feedback.push(entry)
    this.updateConfusionMatrix(entry)
    logger.debug('Added feedback entry', { id: entry.id, source: entry.source })
  }

  private updateConfusionMatrix(entry: FeedbackEntry): void {
    if (entry.correction.field === 'maker' || entry.correction.field === 'era') {
      const key = `${entry.correction.field}:${entry.correction.originalValue}`
      if (!this.confusionMatrix.has(key)) {
        this.confusionMatrix.set(key, new Map())
      }
      const corrections = this.confusionMatrix.get(key)!
      const correctedVal = String(entry.correction.correctedValue)
      corrections.set(correctedVal, (corrections.get(correctedVal) || 0) + 1)
    }
  }

  getFeedback(): FeedbackEntry[] {
    return [...this.feedback]
  }

  getFeedbackByCategory(category: string): FeedbackEntry[] {
    return this.feedback.filter(f => f.metadata.category === category)
  }

  getConfusionPatterns(): { original: string; confused_with: string; count: number }[] {
    const patterns: { original: string; confused_with: string; count: number }[] = []

    for (const [original, corrections] of this.confusionMatrix) {
      for (const [corrected, count] of corrections) {
        if (count >= 2) {  // Only report patterns seen multiple times
          patterns.push({ original, confused_with: corrected, count })
        }
      }
    }

    return patterns.sort((a, b) => b.count - a.count)
  }

  addInsight(insight: LearningInsight): void {
    // Merge with existing similar insight if present
    const existing = this.insights.find(
      i => i.type === insight.type && i.description === insight.description
    )

    if (existing) {
      existing.frequency += 1
      existing.lastOccurred = new Date()
      existing.evidence = [...new Set([...existing.evidence, ...insight.evidence])]
    } else {
      this.insights.push(insight)
    }
  }

  getInsights(): LearningInsight[] {
    return [...this.insights].sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
  }

  addPromptAdjustment(adjustment: PromptAdjustment): void {
    this.promptAdjustments.push(adjustment)
  }

  getActivePromptAdjustments(category?: string): PromptAdjustment[] {
    return this.promptAdjustments
      .filter(pa => pa.active && (!category || pa.category === category || !pa.category))
      .sort((a, b) => b.effectiveness - a.effectiveness)
  }

  recordAnalysis(id: string, analysis: Partial<ItemAnalysis>): void {
    this.analysisHistory.set(id, { original: analysis })
  }

  getState(): LearningSystemState {
    return {
      totalFeedbackEntries: this.feedback.length,
      totalInsightsGenerated: this.insights.length,
      activePromptAdjustments: this.promptAdjustments.filter(pa => pa.active).length,
      lastAnalysisDate: this.feedback.length > 0
        ? this.feedback[this.feedback.length - 1].timestamp
        : null,
      overallAccuracyTrend: this.calculateAccuracyTrend(),
      topIssues: this.insights.slice(0, 5)
    }
  }

  private calculateAccuracyTrend(): { period: string; accuracy: number }[] {
    // Group feedback by week and calculate correction rate
    const weeks = new Map<string, { total: number; correct: number }>()

    for (const entry of this.feedback) {
      const week = this.getWeekKey(entry.timestamp)
      if (!weeks.has(week)) {
        weeks.set(week, { total: 0, correct: 0 })
      }
      const w = weeks.get(week)!
      w.total += 1
      // Count as correct if correction confidence was low (original was right)
      if (entry.correction.confidence < 0.5) {
        w.correct += 1
      }
    }

    return Array.from(weeks.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)  // Last 12 weeks
      .map(([period, data]) => ({
        period,
        accuracy: data.total > 0 ? (1 - (data.correct / data.total)) * 100 : 100
      }))
  }

  private getWeekKey(date: Date): string {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - d.getDay())
    return d.toISOString().split('T')[0]
  }
}

// Singleton instance
const dataStore = new LearningDataStore()

// ============================================================================
// FEEDBACK COLLECTION
// ============================================================================

/**
 * Record user correction of an analysis
 */
export async function recordUserCorrection(
  analysisId: string,
  imageHash: string,
  original: FeedbackEntry['original'],
  field: string,
  correctedValue: unknown,
  notes?: string
): Promise<void> {
  const entry: FeedbackEntry = {
    id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    analysisId,
    imageHash,
    timestamp: new Date(),
    source: 'user',
    original,
    correction: {
      field,
      originalValue: original[field as keyof typeof original],
      correctedValue,
      confidence: 0.6, // User corrections start with moderate confidence
      notes
    },
    metadata: {
      verificationCount: 1,
      category: original.category
    }
  }

  dataStore.addFeedback(entry)
  logger.info('Recorded user correction', { analysisId, field })

  // Trigger pattern analysis if we have enough data
  await analyzePatterns()
}

/**
 * Record expert verification/correction
 */
export async function recordExpertCorrection(
  analysisId: string,
  imageHash: string,
  original: FeedbackEntry['original'],
  field: string,
  correctedValue: unknown,
  expertId: string,
  notes?: string
): Promise<void> {
  const entry: FeedbackEntry = {
    id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    analysisId,
    imageHash,
    timestamp: new Date(),
    source: 'expert',
    original,
    correction: {
      field,
      originalValue: original[field as keyof typeof original],
      correctedValue,
      confidence: 0.95, // Expert corrections are high confidence
      notes
    },
    metadata: {
      verifiedBy: expertId,
      verificationCount: 1,
      category: original.category
    }
  }

  dataStore.addFeedback(entry)
  logger.info('Recorded expert correction', { analysisId, field, expertId })

  // Expert corrections immediately trigger insight generation
  await generateInsightFromCorrection(entry)
}

/**
 * Record auction/sale outcome
 */
export async function recordSaleOutcome(
  analysisId: string,
  imageHash: string,
  original: FeedbackEntry['original'],
  salePrice: number,
  saleVenue: string
): Promise<void> {
  // Calculate value accuracy
  const midpoint = (original.valueMin + original.valueMax) / 2
  const deviation = Math.abs(salePrice - midpoint) / midpoint

  // Only record as correction if significantly off
  if (deviation > 0.25) {
    const entry: FeedbackEntry = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      analysisId,
      imageHash,
      timestamp: new Date(),
      source: 'auction',
      original,
      correction: {
        field: 'value',
        originalValue: { min: original.valueMin, max: original.valueMax },
        correctedValue: salePrice,
        confidence: 0.9, // Auction results are reliable
        notes: `Sold at ${saleVenue} for $${salePrice}`
      },
      metadata: {
        verificationCount: 1,
        category: original.category
      }
    }

    dataStore.addFeedback(entry)
    logger.info('Recorded sale outcome correction', {
      analysisId,
      predicted: midpoint,
      actual: salePrice,
      deviation: `${(deviation * 100).toFixed(1)}%`
    })
  }
}

/**
 * Record ground truth test result
 */
export async function recordGroundTruthResult(
  analysisId: string,
  imageHash: string,
  analysis: Partial<ItemAnalysis>,
  groundTruth: Record<string, unknown>,
  scores: Record<string, number>
): Promise<void> {
  // Find fields that scored poorly
  for (const [field, score] of Object.entries(scores)) {
    if (score < 0.7 && groundTruth[field] !== undefined) {
      const originalValue = analysis[field as keyof ItemAnalysis]

      const entry: FeedbackEntry = {
        id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        analysisId,
        imageHash,
        timestamp: new Date(),
        source: 'ground_truth',
        original: {
          name: analysis.name || '',
          maker: analysis.maker || null,
          era: analysis.era || '',
          style: analysis.style || '',
          valueMin: analysis.estimatedValueMin || 0,
          valueMax: analysis.estimatedValueMax || 0,
          confidence: analysis.confidence || 0,
          category: analysis.productCategory
        },
        correction: {
          field,
          originalValue,
          correctedValue: groundTruth[field],
          confidence: 1.0, // Ground truth is definitive
          notes: `Ground truth test - Score: ${(score * 100).toFixed(1)}%`
        },
        metadata: {
          verificationCount: 1,
          category: analysis.productCategory
        }
      }

      dataStore.addFeedback(entry)
    }
  }

  await analyzePatterns()
}

// ============================================================================
// PATTERN ANALYSIS
// ============================================================================

/**
 * Analyze feedback patterns to identify systematic issues
 */
async function analyzePatterns(): Promise<void> {
  const feedback = dataStore.getFeedback()

  if (feedback.length < 10) {
    logger.debug('Not enough feedback for pattern analysis', { count: feedback.length })
    return
  }

  // Group corrections by field
  const fieldCorrections = new Map<string, FeedbackEntry[]>()
  for (const entry of feedback) {
    const field = entry.correction.field
    if (!fieldCorrections.has(field)) {
      fieldCorrections.set(field, [])
    }
    fieldCorrections.get(field)!.push(entry)
  }

  // Identify patterns
  for (const [field, entries] of fieldCorrections) {
    // Check for systematic under/over estimation
    if (field === 'value' && entries.length >= 5) {
      await analyzeValueBias(entries)
    }

    // Check for confusion patterns (maker/era/style)
    if (['maker', 'era', 'style'].includes(field) && entries.length >= 3) {
      await analyzeConfusionPatterns(field, entries)
    }

    // Check for category-specific issues
    await analyzeCategoryIssues(field, entries)
  }
}

async function analyzeValueBias(entries: FeedbackEntry[]): Promise<void> {
  let totalBias = 0
  let overCount = 0
  let underCount = 0

  for (const entry of entries) {
    const original = entry.original.valueMin + (entry.original.valueMax - entry.original.valueMin) / 2
    const corrected = entry.correction.correctedValue as number
    const bias = (corrected - original) / original

    totalBias += bias
    if (bias > 0) underCount++  // We underestimated
    else overCount++  // We overestimated
  }

  const avgBias = totalBias / entries.length

  if (Math.abs(avgBias) > 0.15) {  // More than 15% systematic bias
    const direction = avgBias > 0 ? 'under' : 'over'

    dataStore.addInsight({
      type: 'calibration',
      severity: Math.abs(avgBias) > 0.3 ? 'high' : 'medium',
      description: `Systematic ${direction}estimation of values by ${(Math.abs(avgBias) * 100).toFixed(0)}%`,
      evidence: entries.slice(0, 5).map(e =>
        `${e.original.name}: predicted $${e.original.valueMin}-$${e.original.valueMax}, actual $${e.correction.correctedValue}`
      ),
      suggestedAction: direction === 'under'
        ? 'Increase value estimates, especially for high-demand categories'
        : 'Be more conservative with value estimates',
      frequency: entries.length,
      lastOccurred: entries[entries.length - 1].timestamp
    })

    logger.info('Detected value estimation bias', { direction, avgBias })
  }
}

async function analyzeConfusionPatterns(field: string, entries: FeedbackEntry[]): Promise<void> {
  // Group by original value
  const confusions = new Map<string, Map<string, number>>()

  for (const entry of entries) {
    const original = String(entry.correction.originalValue)
    const corrected = String(entry.correction.correctedValue)

    if (!confusions.has(original)) {
      confusions.set(original, new Map())
    }
    const corrections = confusions.get(original)!
    corrections.set(corrected, (corrections.get(corrected) || 0) + 1)
  }

  // Find significant confusion patterns
  for (const [original, corrections] of confusions) {
    for (const [corrected, count] of corrections) {
      if (count >= 2) {
        dataStore.addInsight({
          type: 'confusion',
          severity: count >= 5 ? 'high' : count >= 3 ? 'medium' : 'low',
          description: `${field}: "${original}" frequently confused with "${corrected}"`,
          evidence: entries
            .filter(e => e.correction.originalValue === original && e.correction.correctedValue === corrected)
            .slice(0, 3)
            .map(e => `Item: ${e.original.name}`),
          suggestedAction: `Add disambiguation guidance for ${field} when "${original}" or "${corrected}" is detected`,
          frequency: count,
          lastOccurred: entries.find(e =>
            e.correction.originalValue === original && e.correction.correctedValue === corrected
          )?.timestamp || new Date()
        })
      }
    }
  }
}

async function analyzeCategoryIssues(field: string, entries: FeedbackEntry[]): Promise<void> {
  // Group by category
  const byCategory = new Map<string, FeedbackEntry[]>()

  for (const entry of entries) {
    const cat = entry.metadata.category || 'unknown'
    if (!byCategory.has(cat)) {
      byCategory.set(cat, [])
    }
    byCategory.get(cat)!.push(entry)
  }

  // Find categories with high error rates
  for (const [category, catEntries] of byCategory) {
    if (catEntries.length >= 3) {
      dataStore.addInsight({
        type: 'gap',
        severity: catEntries.length >= 10 ? 'high' : catEntries.length >= 5 ? 'medium' : 'low',
        description: `${field} errors concentrated in "${category}" category`,
        evidence: catEntries.slice(0, 3).map(e =>
          `${e.original.name}: ${e.correction.originalValue} → ${e.correction.correctedValue}`
        ),
        suggestedAction: `Enhance ${category} domain knowledge for ${field} identification`,
        frequency: catEntries.length,
        lastOccurred: catEntries[catEntries.length - 1].timestamp
      })
    }
  }
}

async function generateInsightFromCorrection(entry: FeedbackEntry): Promise<void> {
  // Expert corrections get immediate attention
  if (entry.source === 'expert') {
    dataStore.addInsight({
      type: 'pattern',
      severity: 'medium',
      description: `Expert correction on ${entry.correction.field}`,
      evidence: [
        `Item: ${entry.original.name}`,
        `Original: ${entry.correction.originalValue}`,
        `Corrected: ${entry.correction.correctedValue}`,
        `Notes: ${entry.correction.notes || 'None'}`
      ],
      suggestedAction: `Review ${entry.correction.field} logic for similar items`,
      frequency: 1,
      lastOccurred: entry.timestamp
    })
  }
}

// ============================================================================
// PROMPT ENHANCEMENT
// ============================================================================

/**
 * Get dynamic prompt adjustments based on learned patterns
 */
export function getPromptEnhancements(category?: string): string[] {
  const adjustments = dataStore.getActivePromptAdjustments(category)
  const insights = dataStore.getInsights()

  const enhancements: string[] = []

  // Add adjustments from explicitly defined rules
  for (const adj of adjustments) {
    enhancements.push(adj.adjustment)
  }

  // Generate dynamic adjustments from insights
  for (const insight of insights.filter(i => i.severity !== 'low')) {
    if (insight.type === 'confusion') {
      // Extract the confused terms from the description
      const match = insight.description.match(/"([^"]+)" frequently confused with "([^"]+)"/)
      if (match) {
        enhancements.push(
          `IMPORTANT: "${match[1]}" and "${match[2]}" are commonly confused. ` +
          `Look carefully at distinguishing features before assigning either.`
        )
      }
    }

    if (insight.type === 'calibration') {
      if (insight.description.includes('under')) {
        enhancements.push(
          'NOTE: Value estimates have been running low. Consider current market demand and rarity.'
        )
      } else if (insight.description.includes('over')) {
        enhancements.push(
          'NOTE: Be conservative with value estimates. Consider condition issues and market saturation.'
        )
      }
    }

    if (insight.type === 'gap' && category && insight.description.includes(category)) {
      enhancements.push(
        `ATTENTION: This category (${category}) has shown accuracy issues. ` +
        'Be especially thorough in your analysis and consider requesting additional photos.'
      )
    }
  }

  return enhancements
}

/**
 * Get confusion warnings for specific terms
 */
export function getConfusionWarnings(detectedTerms: string[]): string[] {
  const patterns = dataStore.getConfusionPatterns()
  const warnings: string[] = []

  for (const term of detectedTerms) {
    for (const pattern of patterns) {
      if (pattern.original.includes(term) || pattern.confused_with === term) {
        warnings.push(
          `"${pattern.original.split(':')[1]}" is often confused with "${pattern.confused_with}" ` +
          `(${pattern.count} occurrences). Verify carefully.`
        )
      }
    }
  }

  return warnings
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * Get current learning system state
 */
export function getLearningSystemState(): LearningSystemState {
  return dataStore.getState()
}

/**
 * Get all insights sorted by severity
 */
export function getAllInsights(): LearningInsight[] {
  return dataStore.getInsights()
}

/**
 * Get accuracy report
 */
export function getAccuracyReport(): {
  totalFeedback: number
  bySource: Record<string, number>
  byField: Record<string, number>
  confusionPatterns: { original: string; confused_with: string; count: number }[]
  accuracyTrend: { period: string; accuracy: number }[]
} {
  const feedback = dataStore.getFeedback()
  const state = dataStore.getState()

  const bySource: Record<string, number> = {}
  const byField: Record<string, number> = {}

  for (const entry of feedback) {
    bySource[entry.source] = (bySource[entry.source] || 0) + 1
    byField[entry.correction.field] = (byField[entry.correction.field] || 0) + 1
  }

  return {
    totalFeedback: feedback.length,
    bySource,
    byField,
    confusionPatterns: dataStore.getConfusionPatterns(),
    accuracyTrend: state.overallAccuracyTrend
  }
}

/**
 * Export learning data for analysis
 */
export function exportLearningData(): {
  feedback: FeedbackEntry[]
  insights: LearningInsight[]
  state: LearningSystemState
} {
  return {
    feedback: dataStore.getFeedback(),
    insights: dataStore.getInsights(),
    state: dataStore.getState()
  }
}

// ============================================================================
// PROMPT ADJUSTMENT MANAGEMENT
// ============================================================================

/**
 * Add a new prompt adjustment rule
 */
export function addPromptAdjustment(
  condition: string,
  adjustment: string,
  category?: string
): string {
  const id = `pa-${Date.now()}`

  dataStore.addPromptAdjustment({
    id,
    category,
    condition,
    adjustment,
    effectiveness: 0.5,  // Start neutral
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true
  })

  logger.info('Added prompt adjustment', { id, condition })
  return id
}

/**
 * Update effectiveness score based on test results
 */
export function updateAdjustmentEffectiveness(id: string, effectivenessChange: number): void {
  const adjustments = dataStore.getActivePromptAdjustments()
  const adjustment = adjustments.find(a => a.id === id)

  if (adjustment) {
    adjustment.effectiveness = Math.max(0, Math.min(1, adjustment.effectiveness + effectivenessChange))
    adjustment.updatedAt = new Date()

    // Deactivate ineffective adjustments
    if (adjustment.effectiveness < 0.2) {
      adjustment.active = false
      logger.info('Deactivated ineffective prompt adjustment', { id })
    }
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize with some baseline adjustments based on domain knowledge
 */
export function initializeLearningSystem(): void {
  // Add baseline prompt adjustments for known challenges
  addPromptAdjustment(
    'furniture_victorian',
    'Victorian furniture spans 1837-1901. Early Victorian (1837-1860) features heavier ornamentation than Late Victorian. Check for machine vs hand carving.',
    'furniture'
  )

  addPromptAdjustment(
    'ceramics_marks',
    'Ceramic marks can be deceptive. Look for wear patterns consistent with age. Modern reproductions often have too-perfect marks.',
    'ceramics'
  )

  addPromptAdjustment(
    'jewelry_hallmarks',
    'Precious metal hallmarks vary by country and period. British hallmarks include date letters. Continental marks differ significantly.',
    'jewelry'
  )

  addPromptAdjustment(
    'art_signature',
    'Artist signatures should show appropriate age. Beware of signatures added to unsigned works. Compare style to documented examples.',
    'art'
  )

  logger.info('Self-learning system initialized with baseline adjustments')
}

// Initialize on module load
initializeLearningSystem()
