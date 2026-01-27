/**
 * Mock Evaluation Mode
 * Tests the evaluation harness scoring logic without requiring external images
 *
 * This allows us to verify the scoring algorithms work correctly
 * while the actual image-based evaluation runs against real MinIO-stored images.
 */

import { GroundTruthItem, TestResult, EvaluationReport, formatReport } from './evaluationHarness.js'
import { GROUND_TRUTH_ITEMS } from './groundTruth.js'
import { logger } from '../utils/logger.js'

// Simulated AI outputs for testing the scoring logic
interface MockAnalysisResult {
  name: string
  maker: string | null
  era: string | null
  style: string | null
  productCategory: string
  domainExpert: string
  originRegion: string
  estimatedValueMin: number
  estimatedValueMax: number
  confidence: number
  description: string
  historicalContext: string
  evidenceFor: string[]
  evidenceAgainst: string[]
}

/**
 * Generate mock AI output based on ground truth with configurable accuracy
 * accuracy: 0.0 = random/wrong, 1.0 = perfect match
 */
function generateMockOutput(item: GroundTruthItem, accuracy: number): MockAnalysisResult {
  const expected = item.expected
  const rand = () => Math.random()

  // Name: with probability = accuracy, return correct name
  const name = rand() < accuracy
    ? expected.name
    : `Generic ${expected.domainExpert} item`

  // Maker: with probability = accuracy, return correct maker
  const maker = rand() < accuracy && expected.maker
    ? expected.maker
    : rand() < accuracy / 2 && expected.makerAlternatives?.[0]
      ? expected.makerAlternatives[0]
      : null

  // Era: with probability = accuracy, return correct era
  const eraStart = expected.eraRange.start
  const eraEnd = expected.eraRange.end
  const midYear = Math.round((eraStart + eraEnd) / 2)
  const era = rand() < accuracy
    ? `${eraStart}-${eraEnd}`
    : rand() < accuracy / 2
      ? `${midYear - 20}-${midYear + 20}`
      : `${1800 + Math.floor(rand() * 200)}`

  // Style: with probability = accuracy, return correct style
  const style = rand() < accuracy
    ? expected.style
    : rand() < accuracy / 2 && expected.styleAlternatives?.[0]
      ? expected.styleAlternatives[0]
      : 'Unknown Style'

  // Value: add some noise based on accuracy
  const expectedMid = (expected.valueMin + expected.valueMax) / 2
  const valueVariance = (1 - accuracy) * expectedMid * 2 // More inaccuracy = more variance
  const valueOffset = (rand() - 0.5) * valueVariance
  const estimatedMid = Math.max(100, expectedMid + valueOffset)
  const valueSpread = (expected.valueMax - expected.valueMin) / 2
  const estimatedValueMin = Math.round(Math.max(50, estimatedMid - valueSpread * (0.5 + rand())))
  const estimatedValueMax = Math.round(estimatedMid + valueSpread * (0.5 + rand()))

  // Features: include correct features based on accuracy
  const featuresFound = expected.mustIdentifyFeatures.filter(() => rand() < accuracy)
  const description = featuresFound.length > 0
    ? `This appears to be a ${name}. Notable features include: ${featuresFound.join(', ')}.`
    : `A ${expected.domainExpert} piece from the period.`

  // Authentication markers
  const markersFound = expected.authenticationMarkers?.filter(() => rand() < accuracy) || []

  return {
    name,
    maker,
    era,
    style,
    productCategory: rand() < accuracy ? expected.category : 'vintage',
    domainExpert: rand() < accuracy ? expected.domainExpert : 'general',
    originRegion: rand() < accuracy ? expected.originRegion : 'Unknown',
    estimatedValueMin,
    estimatedValueMax,
    confidence: Math.round(50 + accuracy * 50), // 50-100 based on accuracy
    description,
    historicalContext: `This piece represents ${expected.style} design from the ${era} period.`,
    evidenceFor: [
      ...featuresFound.map(f => `Identified feature: ${f}`),
      ...markersFound.map(m => `Authentication marker: ${m}`)
    ],
    evidenceAgainst: rand() > accuracy ? ['Some uncertainty in attribution'] : []
  }
}

// Scoring weights (same as main harness)
const SCORING_WEIGHTS = {
  nameMatch: 15,
  makerMatch: 15,
  eraMatch: 10,
  styleMatch: 10,
  categoryMatch: 5,
  domainMatch: 5,
  originMatch: 5,
  valueAccuracy: 20,
  featuresIdentified: 10,
  authenticationMarkers: 5
}

/**
 * Score functions (simplified versions from main harness)
 */
function scoreNameMatch(expected: GroundTruthItem['expected'], actual: MockAnalysisResult): number {
  const actualName = actual.name?.toLowerCase() || ''
  if (actualName.includes(expected.name.toLowerCase())) return 100
  const matchedKeywords = expected.nameKeywords.filter(kw => actualName.includes(kw.toLowerCase()))
  if (matchedKeywords.length === 0) return 0
  if (matchedKeywords.length === 1) return 40
  if (matchedKeywords.length === 2) return 70
  return Math.min(90, 40 + matchedKeywords.length * 20)
}

function scoreMakerMatch(expected: GroundTruthItem['expected'], actual: MockAnalysisResult): number {
  if (!expected.maker) {
    if (!actual.maker || actual.maker.toLowerCase().includes('unknown')) return 100
    return 50
  }
  const actualMaker = actual.maker?.toLowerCase() || ''
  if (actualMaker.includes(expected.maker.toLowerCase())) return 100
  if (expected.makerAlternatives?.some(alt => actualMaker.includes(alt.toLowerCase()))) return 90
  return 0
}

function scoreEraMatch(expected: GroundTruthItem['expected'], actual: MockAnalysisResult): number {
  if (!actual.era) return 0
  const yearMatches = actual.era.match(/\d{4}/g)
  if (yearMatches) {
    const years = yearMatches.map(Number)
    const avgYear = years.reduce((a, b) => a + b, 0) / years.length
    if (avgYear >= expected.eraRange.start && avgYear <= expected.eraRange.end) return 100
    const distance = Math.min(
      Math.abs(avgYear - expected.eraRange.start),
      Math.abs(avgYear - expected.eraRange.end)
    )
    if (distance <= 10) return 80
    if (distance <= 25) return 50
    if (distance <= 50) return 25
    return 0
  }
  return 20
}

function scoreStyleMatch(expected: GroundTruthItem['expected'], actual: MockAnalysisResult): number {
  if (!actual.style) return 0
  const actualStyle = actual.style.toLowerCase()
  if (actualStyle.includes(expected.style.toLowerCase())) return 100
  if (expected.styleAlternatives?.some(alt => actualStyle.includes(alt.toLowerCase()))) return 90
  return 0
}

function scoreValueAccuracy(expected: GroundTruthItem['expected'], actual: MockAnalysisResult): number {
  if (!actual.estimatedValueMin && !actual.estimatedValueMax) return 0
  const aiMin = actual.estimatedValueMin || 0
  const aiMax = actual.estimatedValueMax || aiMin
  const rangeOverlap = aiMax >= expected.valueMin && aiMin <= expected.valueMax
  if (rangeOverlap) {
    const overlapStart = Math.max(aiMin, expected.valueMin)
    const overlapEnd = Math.min(aiMax, expected.valueMax)
    const overlapSize = overlapEnd - overlapStart
    const expectedSize = expected.valueMax - expected.valueMin
    const overlapRatio = overlapSize / expectedSize
    return Math.min(100, Math.round(60 + overlapRatio * 40))
  }
  const aiMid = (aiMin + aiMax) / 2
  const expectedMid = (expected.valueMin + expected.valueMax) / 2
  const percentOff = Math.abs(aiMid - expectedMid) / expectedMid
  if (percentOff <= 0.25) return 60
  if (percentOff <= 0.50) return 40
  if (percentOff <= 1.00) return 20
  return 0
}

function scoreFeaturesIdentified(expected: GroundTruthItem['expected'], actual: MockAnalysisResult): number {
  const allText = [actual.description, actual.historicalContext, ...actual.evidenceFor, actual.name].join(' ').toLowerCase()
  const featuresFound = expected.mustIdentifyFeatures.filter(feature =>
    allText.includes(feature.toLowerCase()) ||
    feature.toLowerCase().split(' ').every(word => allText.includes(word))
  )
  return Math.round((featuresFound.length / expected.mustIdentifyFeatures.length) * 100)
}

function scoreAuthenticationMarkers(expected: GroundTruthItem['expected'], actual: MockAnalysisResult): number {
  if (!expected.authenticationMarkers || expected.authenticationMarkers.length === 0) return 100
  const allText = [actual.description, ...actual.evidenceFor, ...actual.evidenceAgainst].join(' ').toLowerCase()
  const markersFound = expected.authenticationMarkers.filter(marker =>
    allText.includes(marker.toLowerCase()) ||
    marker.toLowerCase().split(' ').every(word => allText.includes(word))
  )
  return Math.round((markersFound.length / expected.authenticationMarkers.length) * 100)
}

/**
 * Run mock test for a single item
 */
function runMockTest(item: GroundTruthItem, accuracy: number): TestResult {
  const mockOutput = generateMockOutput(item, accuracy)

  const scores = {
    name: scoreNameMatch(item.expected, mockOutput),
    maker: scoreMakerMatch(item.expected, mockOutput),
    era: scoreEraMatch(item.expected, mockOutput),
    style: scoreStyleMatch(item.expected, mockOutput),
    category: mockOutput.productCategory === item.expected.category ? 100 : 0,
    domain: mockOutput.domainExpert === item.expected.domainExpert ? 100 : 0,
    origin: mockOutput.originRegion?.toLowerCase().includes(item.expected.originRegion.toLowerCase()) ? 100 : 0,
    value: scoreValueAccuracy(item.expected, mockOutput),
    features: scoreFeaturesIdentified(item.expected, mockOutput),
    authentication: scoreAuthenticationMarkers(item.expected, mockOutput)
  }

  const overallScore = Math.round(
    (scores.name * SCORING_WEIGHTS.nameMatch +
     scores.maker * SCORING_WEIGHTS.makerMatch +
     scores.era * SCORING_WEIGHTS.eraMatch +
     scores.style * SCORING_WEIGHTS.styleMatch +
     scores.category * SCORING_WEIGHTS.categoryMatch +
     scores.domain * SCORING_WEIGHTS.domainMatch +
     scores.origin * SCORING_WEIGHTS.originMatch +
     scores.value * SCORING_WEIGHTS.valueAccuracy +
     scores.features * SCORING_WEIGHTS.featuresIdentified +
     scores.authentication * SCORING_WEIGHTS.authenticationMarkers) /
    Object.values(SCORING_WEIGHTS).reduce((a, b) => a + b, 0)
  )

  const failures: string[] = []
  const partialMatches: string[] = []
  const successes: string[] = []

  for (const [key, score] of Object.entries(scores)) {
    if (score === 100) successes.push(`${key}: Perfect match`)
    else if (score >= 70) partialMatches.push(`${key}: ${score}% match`)
    else if (score > 0) failures.push(`${key}: Only ${score}% - needs improvement`)
    else failures.push(`${key}: Complete miss`)
  }

  return {
    itemId: item.id,
    groundTruth: item,
    aiOutput: mockOutput as any,
    error: null,
    scores,
    overallScore,
    failures,
    partialMatches,
    successes,
    improvementSuggestions: []
  }
}

/**
 * Run mock evaluation with configurable accuracy
 */
export async function runMockEvaluation(
  items: GroundTruthItem[] = GROUND_TRUTH_ITEMS,
  options: { accuracy?: number; maxItems?: number } = {}
): Promise<EvaluationReport> {
  const accuracy = options.accuracy ?? 0.8 // Default 80% accuracy
  const itemsToTest = items.slice(0, options.maxItems || items.length)

  logger.info(`Running mock evaluation with ${(accuracy * 100).toFixed(0)}% target accuracy`)

  const results: TestResult[] = []
  for (const item of itemsToTest) {
    const result = runMockTest(item, accuracy)
    results.push(result)
    logger.info(`[${results.length}/${itemsToTest.length}] ${item.id}: Score ${result.overallScore}%`)
  }

  // Calculate aggregate metrics
  const scores = results.map(r => r.overallScore).sort((a, b) => a - b)
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
  const medianScore = scores[Math.floor(scores.length / 2)]

  // Category breakdown
  const categoryScores: Record<string, { count: number; avgScore: number }> = {}
  for (const result of results) {
    const cat = result.groundTruth.expected.domainExpert
    if (!categoryScores[cat]) categoryScores[cat] = { count: 0, avgScore: 0 }
    categoryScores[cat].count++
    categoryScores[cat].avgScore += result.overallScore
  }
  for (const cat of Object.keys(categoryScores)) {
    categoryScores[cat].avgScore /= categoryScores[cat].count
  }

  // Score distribution
  const distribution = {
    excellent: scores.filter(s => s >= 90).length,
    good: scores.filter(s => s >= 75 && s < 90).length,
    acceptable: scores.filter(s => s >= 60 && s < 75).length,
    poor: scores.filter(s => s >= 40 && s < 60).length,
    failed: scores.filter(s => s < 40).length
  }

  return {
    timestamp: new Date().toISOString(),
    totalItems: items.length,
    itemsTested: results.length,
    itemsSkipped: items.length - results.length,
    overallAccuracy: avgScore >= 70 ? avgScore : 0,
    averageScore: avgScore,
    medianScore: medianScore,
    categoryScores,
    scoreDistribution: distribution,
    commonFailures: [],
    improvementPriorities: [],
    results
  }
}

// CLI runner - use import.meta for ESM
const isMainModule = import.meta.url === `file://${process.argv[1]}` ||
                     process.argv[1]?.includes('mockEvaluation')

if (isMainModule) {
  const accuracy = parseFloat(process.argv[2] || '0.85')
  const maxItems = parseInt(process.argv[3] || '10')

  console.log('═══════════════════════════════════════════════════════════════')
  console.log('           VINTAGEVISION MOCK EVALUATION')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`📊 Target Accuracy: ${(accuracy * 100).toFixed(0)}%`)
  console.log(`📦 Items to Test: ${maxItems}`)
  console.log('')

  runMockEvaluation(GROUND_TRUTH_ITEMS, { accuracy, maxItems }).then(report => {
    console.log('')
    console.log(formatReport(report))

    const passRate = report.averageScore
    if (passRate >= 70) {
      console.log(`✅ MOCK TEST PASSED (${passRate.toFixed(1)}% average score)`)
    } else {
      console.log(`❌ MOCK TEST FAILED (${passRate.toFixed(1)}% average score)`)
    }
  })
}
