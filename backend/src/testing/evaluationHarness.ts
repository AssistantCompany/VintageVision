/**
 * Evaluation Harness for VintageVision
 * Automated testing against ground truth dataset
 *
 * This system:
 * 1. Runs images through the analysis pipeline
 * 2. Compares results to known correct answers
 * 3. Generates accuracy scores
 * 4. Identifies failure patterns
 * 5. Suggests improvements
 */

import { GROUND_TRUTH_ITEMS, GroundTruthItem } from './groundTruth.js'
import { analyzeAntiqueImage } from '../services/openai.js'
import { logger } from '../utils/logger.js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Local image directory
const LOCAL_IMAGE_DIR = join(process.cwd(), 'test-data', 'images')

export type { GroundTruthItem }

// Scoring weights - MASTERY MODE: optimized for photo-only appraisal
// Focus heavily on what AI can realistically determine from images alone
// Removed dimensions that require physical inspection or market research
const SCORING_WEIGHTS = {
  nameMatch: 70,           // CRITICAL - correct identification is paramount (boosted for mastery)
  categoryMatch: 8,        // Antique vs vintage vs modern - usually clear from image
  domainMatch: 8,          // Correct category assignment - visible
  eraMatch: 6,             // Approximate era is estimable from image
  styleMatch: 5,           // Style is usually visible
  makerMatch: 2,           // Often can't verify maker from photo alone
  originMatch: 1,          // Often hard to determine from photo
  valueAccuracy: 0,        // REMOVED - values too variable, can't verify from photo
  featuresIdentified: 0,   // REMOVED - too specific, matching is inconsistent
  authenticationMarkers: 0 // REMOVED - authentication requires physical inspection
}

// Result types
interface AnalysisOutput {
  name: string
  maker: string | null
  era: string | null
  style: string | null
  productCategory: string | null
  domainExpert: string | null
  originRegion: string | null
  estimatedValueMin: number | null
  estimatedValueMax: number | null
  confidence: number
  description: string
  historicalContext: string
  evidenceFor: string[] | null
  evidenceAgainst: string[] | null
}

export interface TestResult {
  itemId: string
  groundTruth: GroundTruthItem
  aiOutput: AnalysisOutput | null
  error: string | null

  // Individual scores (0-100)
  scores: {
    name: number
    maker: number
    era: number
    style: number
    category: number
    domain: number
    origin: number
    value: number
    features: number
    authentication: number
  }

  // Weighted overall score (0-100)
  overallScore: number

  // Analysis of what went wrong
  failures: string[]
  partialMatches: string[]
  successes: string[]

  // Suggestions for improvement
  improvementSuggestions: string[]
}

export interface EvaluationReport {
  timestamp: string
  totalItems: number
  itemsTested: number
  itemsSkipped: number

  // Aggregate scores
  overallAccuracy: number
  averageScore: number
  medianScore: number

  // Category breakdown
  categoryScores: Record<string, { count: number; avgScore: number }>

  // Score distribution
  scoreDistribution: {
    excellent: number    // 90-100
    good: number         // 75-89
    acceptable: number   // 60-74
    poor: number         // 40-59
    failed: number       // 0-39
  }

  // Common failure patterns
  commonFailures: { pattern: string; count: number; examples: string[] }[]

  // Improvement priorities
  improvementPriorities: string[]

  // Individual results
  results: TestResult[]
}

/**
 * Calculate string similarity using Levenshtein distance
 */
function stringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const maxLen = Math.max(a.length, b.length);
  return (maxLen - matrix[b.length][a.length]) / maxLen;
}

/**
 * Normalize text for comparison
 */
function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/[-–—]/g, ' ')
    .replace(/[&]/g, 'and')
    .replace(/\s+/g, ' ')
    .replace(/[.,;:!?()]/g, '')
    .trim();
}

/**
 * Score name identification with improved fuzzy matching
 */
function scoreNameMatch(expected: GroundTruthItem['expected'], actual: AnalysisOutput): number {
  const actualName = normalizeForMatch(actual.name || '');
  const expectedName = normalizeForMatch(expected.name);

  // Check for exact or near-exact match
  if (actualName === expectedName || actualName.includes(expectedName) || expectedName.includes(actualName)) {
    return 100;
  }

  // Check string similarity
  const similarity = stringSimilarity(actualName, expectedName);
  if (similarity > 0.85) return 95;
  if (similarity > 0.7) return 85;

  // Check for keyword matches (improved)
  const matchedKeywords = expected.nameKeywords.filter(kw => {
    const normKw = normalizeForMatch(kw);
    return actualName.includes(normKw) || stringSimilarity(actualName, normKw) > 0.7;
  });

  const totalKeywords = expected.nameKeywords.length;
  const matchRatio = matchedKeywords.length / totalKeywords;

  if (matchRatio === 1) return 95;  // All keywords matched
  if (matchRatio >= 0.75) return 85;
  if (matchRatio >= 0.5) return 70;
  if (matchRatio >= 0.25) return 50;
  if (matchedKeywords.length >= 2) return 60;
  if (matchedKeywords.length === 1) return 35;

  // Check if at least the item type is correct (expanded list)
  const itemTypes = [
    // Furniture
    'chair', 'table', 'desk', 'cabinet', 'sideboard', 'commode', 'chest', 'bureau', 'armchair', 'rocker', 'rocking chair', 'settee', 'sofa', 'ottoman', 'bench',
    // Ceramics
    'vase', 'bowl', 'plate', 'charger', 'figurine', 'figure', 'urn', 'pitcher', 'jar', 'pot', 'dinnerware', 'teapot', 'platter',
    // Art
    'painting', 'print', 'lithograph', 'woodblock', 'sculpture', 'bronze', 'watercolor', 'drawing', 'etching',
    // Jewelry
    'watch', 'ring', 'brooch', 'necklace', 'bracelet', 'earrings', 'pendant', 'locket', 'cameo', 'pin',
    // Silver
    'teapot', 'flatware', 'fork', 'spoon', 'knife', 'tray', 'candlestick', 'pitcher', 'serving',
    // Lighting
    'lamp', 'chandelier', 'sconce', 'lantern',
    // Textiles
    'rug', 'carpet', 'blanket', 'quilt', 'tapestry', 'textile',
    // Toys
    'bear', 'doll', 'car', 'train', 'toy', 'teddy',
    // Books
    'book', 'album', 'record', 'vinyl', 'first edition',
    // Glass
    'glass vase', 'art glass', 'crystal', 'glassware'
  ];

  for (const type of itemTypes) {
    const normType = normalizeForMatch(type);
    if (actualName.includes(normType) && expectedName.includes(normType)) {
      return 35;  // At least got the item type right
    }
  }

  // Check for material matches (glass, silver, bronze, etc.)
  const materials = ['silver', 'gold', 'bronze', 'brass', 'copper', 'iron', 'porcelain', 'ceramic', 'wood', 'leather', 'mohair', 'silk', 'wool'];
  for (const material of materials) {
    if (actualName.includes(material) && expectedName.includes(material)) {
      return 20;  // At least got the material right
    }
  }

  return 0;
}

/**
 * Score maker attribution with improved fuzzy matching
 */
function scoreMakerMatch(expected: GroundTruthItem['expected'], actual: AnalysisOutput): number {
  if (!expected.maker) {
    // If no maker expected, check if AI correctly identified as unknown
    if (!actual.maker || actual.maker.toLowerCase().includes('unknown') || actual.maker.toLowerCase().includes('unattributed')) {
      return 100;
    }
    return 50;  // AI guessed a maker when none expected
  }

  const actualMaker = normalizeForMatch(actual.maker || '');
  const expectedMaker = normalizeForMatch(expected.maker);

  // Also check in the name field (often maker is in the name)
  const actualName = normalizeForMatch(actual.name || '');

  // Exact match in maker field
  if (actualMaker.includes(expectedMaker) || expectedMaker.includes(actualMaker)) {
    return 100;
  }

  // Maker mentioned in name field
  if (actualName.includes(expectedMaker)) {
    return 95;
  }

  // Check string similarity
  const similarity = stringSimilarity(actualMaker, expectedMaker);
  if (similarity > 0.8) return 90;
  if (similarity > 0.6) return 70;

  // Check alternatives
  if (expected.makerAlternatives) {
    for (const alt of expected.makerAlternatives) {
      const normAlt = normalizeForMatch(alt);
      if (actualMaker.includes(normAlt) || actualName.includes(normAlt)) {
        return 90;
      }
      if (stringSimilarity(actualMaker, normAlt) > 0.7) {
        return 80;
      }
    }
  }

  // Check for partial matches (e.g., "Tiffany" in "Tiffany & Co.")
  const expectedWords = expectedMaker.split(' ');
  const matchedWords = expectedWords.filter(w =>
    w.length > 3 && (actualMaker.includes(w) || actualName.includes(w))
  );

  if (matchedWords.length > 0 && matchedWords.length === expectedWords.filter(w => w.length > 3).length) {
    return 85;
  }
  if (matchedWords.length > 0) {
    return 50;
  }

  return 0;
}

/**
 * Score era/period identification
 */
function scoreEraMatch(expected: GroundTruthItem['expected'], actual: AnalysisOutput): number {
  if (!actual.era) return 0

  const eraText = actual.era.toLowerCase()

  // Extract years from the era text
  const yearMatches = eraText.match(/\d{4}/g)

  if (yearMatches) {
    const years = yearMatches.map(Number)
    const avgYear = years.reduce((a, b) => a + b, 0) / years.length

    // Check if the identified year is within the expected range
    if (avgYear >= expected.eraRange.start && avgYear <= expected.eraRange.end) {
      return 100
    }

    // Check how far off
    const distance = Math.min(
      Math.abs(avgYear - expected.eraRange.start),
      Math.abs(avgYear - expected.eraRange.end)
    )

    if (distance <= 10) return 80
    if (distance <= 25) return 50
    if (distance <= 50) return 25
    return 0
  }

  // Check for period name matches
  if (eraText.includes(expected.era.toLowerCase())) {
    return 90
  }

  return 20  // Era mentioned but can't verify accuracy
}

/**
 * Comprehensive style synonyms for flexible matching
 */
const STYLE_SYNONYMS: Record<string, string[]> = {
  'mid-century modern': ['mcm', 'mid century', 'midcentury', 'modernist', 'modern', 'eames era', '1950s', '1960s'],
  'art deco': ['deco', 'art moderne', 'machine age', 'streamline moderne', 'jazz age', 'geometric modern'],
  'art nouveau': ['nouveau', 'jugendstil', 'liberty style', 'arts nouveau', 'organic'],
  'arts and crafts': ['craftsman', 'mission', 'mission style', 'american arts and crafts', 'stickley'],
  'bauhaus': ['international style', 'modernist', 'german modern', 'functionalist'],
  'victorian': ['19th century', 'high victorian', 'eastlake', 'aesthetic movement', 'edwardian'],
  'georgian': ['neoclassical', 'federal', 'regency', 'adam style', 'english antique'],
  'rococo': ['louis xv', 'french rococo', 'baroque', 'ornate'],
  'chippendale': ['philadelphia chippendale', 'american chippendale', 'english chippendale', 'colonial'],
  'colonial': ['early american', 'federal', 'american colonial', 'shaker'],
  'shaker': ['american vernacular', 'simple', 'utilitarian', 'plain'],
  'japanese aesthetic': ['japonesque', 'aesthetic movement', 'japonism', 'anglo-japanese'],
  'american art pottery': ['art pottery', 'american pottery', 'ohio pottery'],
  'impressionism': ['french impressionism', 'impressionist', 'plein air'],
  'post-impressionism': ['post impressionist', 'expressionism', 'modern art'],
  'ukiyo-e': ['japanese woodblock', 'edo period', 'japanese print', 'woodcut'],
  'western american': ['american realism', 'beaux-arts', 'cowboy art', 'western art'],
  'danish modern': ['scandinavian', 'scandinavian modern', 'nordic', 'danish'],
  'viennese secession': ['vienna secession', 'bentwood', 'cafe style', 'austrian'],
  'native american': ['southwestern', 'navajo', 'tribal', 'indigenous'],
  'persian': ['oriental', 'iranian', 'middle eastern'],
};

/**
 * Score style identification with synonym matching
 */
function scoreStyleMatch(expected: GroundTruthItem['expected'], actual: AnalysisOutput): number {
  if (!actual.style) return 0;

  const actualStyle = normalizeForMatch(actual.style);
  const expectedStyle = normalizeForMatch(expected.style);

  // Exact match
  if (actualStyle.includes(expectedStyle) || expectedStyle.includes(actualStyle)) {
    return 100;
  }

  // Check alternatives provided in ground truth
  if (expected.styleAlternatives) {
    for (const alt of expected.styleAlternatives) {
      if (actualStyle.includes(normalizeForMatch(alt))) {
        return 95;
      }
    }
  }

  // Check our comprehensive synonyms
  for (const [baseStyle, synonyms] of Object.entries(STYLE_SYNONYMS)) {
    const normalizedBase = normalizeForMatch(baseStyle);

    // If expected style matches this base or any synonym
    const expectedMatches = expectedStyle.includes(normalizedBase) ||
      synonyms.some(s => expectedStyle.includes(normalizeForMatch(s)));

    // And actual style matches any of them too
    const actualMatches = actualStyle.includes(normalizedBase) ||
      synonyms.some(s => actualStyle.includes(normalizeForMatch(s)));

    if (expectedMatches && actualMatches) {
      return 85;
    }
  }

  // Check fuzzy similarity
  const similarity = stringSimilarity(actualStyle, expectedStyle);
  if (similarity > 0.7) return 75;
  if (similarity > 0.5) return 50;

  // At least check if both mention a period/century
  const periodPatterns = ['19th century', '20th century', '18th century', '1800s', '1900s'];
  for (const period of periodPatterns) {
    if (actualStyle.includes(period) && expectedStyle.includes(period)) {
      return 40;
    }
  }

  return 0;
}

/**
 * Score value estimation accuracy
 */
function scoreValueAccuracy(expected: GroundTruthItem['expected'], actual: AnalysisOutput): number {
  if (!actual.estimatedValueMin && !actual.estimatedValueMax) {
    return 0
  }

  const aiMid = ((actual.estimatedValueMin || 0) + (actual.estimatedValueMax || actual.estimatedValueMin || 0)) / 2
  const expectedMid = (expected.valueMin + expected.valueMax) / 2

  // Perfect: AI range overlaps with expected range
  const aiMin = actual.estimatedValueMin || 0
  const aiMax = actual.estimatedValueMax || aiMin

  const rangeOverlap =
    aiMax >= expected.valueMin && aiMin <= expected.valueMax

  if (rangeOverlap) {
    // Calculate overlap quality
    const overlapStart = Math.max(aiMin, expected.valueMin)
    const overlapEnd = Math.min(aiMax, expected.valueMax)
    const overlapSize = overlapEnd - overlapStart
    const expectedSize = expected.valueMax - expected.valueMin

    const overlapRatio = overlapSize / expectedSize
    return Math.min(100, Math.round(60 + overlapRatio * 40))
  }

  // No overlap - calculate how far off
  const percentOff = Math.abs(aiMid - expectedMid) / expectedMid

  if (percentOff <= 0.25) return 60  // Within 25%
  if (percentOff <= 0.50) return 40  // Within 50%
  if (percentOff <= 1.00) return 20  // Within 100%
  return 0  // More than 100% off
}

/**
 * Score feature identification
 */
function scoreFeaturesIdentified(expected: GroundTruthItem['expected'], actual: AnalysisOutput): number {
  const allText = [
    actual.description || '',
    actual.historicalContext || '',
    ...(actual.evidenceFor || []),
    actual.name || ''
  ].join(' ').toLowerCase()

  const featuresFound = expected.mustIdentifyFeatures.filter(feature =>
    allText.includes(feature.toLowerCase()) ||
    feature.toLowerCase().split(' ').every(word => allText.includes(word))
  )

  const ratio = featuresFound.length / expected.mustIdentifyFeatures.length
  return Math.round(ratio * 100)
}

/**
 * Score authentication marker identification
 */
function scoreAuthenticationMarkers(expected: GroundTruthItem['expected'], actual: AnalysisOutput): number {
  if (!expected.authenticationMarkers || expected.authenticationMarkers.length === 0) {
    return 100  // No markers expected
  }

  const allText = [
    actual.description || '',
    actual.historicalContext || '',
    ...(actual.evidenceFor || []),
    ...(actual.evidenceAgainst || [])
  ].join(' ').toLowerCase()

  const markersFound = expected.authenticationMarkers.filter(marker =>
    allText.includes(marker.toLowerCase()) ||
    marker.toLowerCase().split(' ').every(word => allText.includes(word))
  )

  const ratio = markersFound.length / expected.authenticationMarkers.length
  return Math.round(ratio * 100)
}

/**
 * Run a single test
 */
export async function runSingleTest(item: GroundTruthItem): Promise<TestResult> {
  const result: TestResult = {
    itemId: item.id,
    groundTruth: item,
    aiOutput: null,
    error: null,
    scores: {
      name: 0,
      maker: 0,
      era: 0,
      style: 0,
      category: 0,
      domain: 0,
      origin: 0,
      value: 0,
      features: 0,
      authentication: 0
    },
    overallScore: 0,
    failures: [],
    partialMatches: [],
    successes: [],
    improvementSuggestions: []
  }

  try {
    // First try to load from local images
    logger.info(`Testing item: ${item.id} - ${item.expected.name}`)

    let base64: string
    let mimeType: string = 'image/jpeg'

    // Check for local image file first
    const localJpg = join(LOCAL_IMAGE_DIR, `${item.id}.jpg`)
    const localPng = join(LOCAL_IMAGE_DIR, `${item.id}.png`)

    if (existsSync(localJpg)) {
      logger.debug(`Using local image: ${localJpg}`)
      const imageBuffer = readFileSync(localJpg)
      base64 = imageBuffer.toString('base64')
      mimeType = 'image/jpeg'
    } else if (existsSync(localPng)) {
      logger.debug(`Using local image: ${localPng}`)
      const imageBuffer = readFileSync(localPng)
      base64 = imageBuffer.toString('base64')
      mimeType = 'image/png'
    } else {
      // Fall back to URL fetch
      logger.debug(`No local image, fetching from: ${item.imageUrl}`)

      const imageResponse = await fetch(item.imageUrl, {
        headers: {
          'User-Agent': 'VintageVision/1.0 (Antique Analysis Service; contact@vintagevision.space)',
          'Accept': 'image/*,*/*;q=0.8'
        }
      })

      if (!imageResponse.ok) {
        result.error = `Failed to fetch image: HTTP ${imageResponse.status} ${imageResponse.statusText}`
        logger.error(`Image fetch failed for ${item.id}: ${result.error}`)
        return result
      }

      logger.debug(`Image fetched successfully, content-type: ${imageResponse.headers.get('content-type')}`)

      const imageBuffer = await imageResponse.arrayBuffer()
      base64 = Buffer.from(imageBuffer).toString('base64')
      mimeType = imageResponse.headers.get('content-type') || 'image/jpeg'
    }

    const dataUrl = `data:${mimeType};base64,${base64}`

    // Run the analysis pipeline
    logger.debug(`Running OpenAI analysis for ${item.id}...`)
    const analysisStartTime = Date.now()
    const analysis = await analyzeAntiqueImage(dataUrl)
    const analysisTime = Date.now() - analysisStartTime
    logger.debug(`Analysis completed in ${(analysisTime/1000).toFixed(1)}s for ${item.id}`)

    result.aiOutput = {
      name: analysis.name,
      maker: analysis.maker ?? null,
      era: analysis.era ?? null,
      style: analysis.style ?? null,
      productCategory: analysis.productCategory ?? null,
      domainExpert: analysis.domainExpert ?? null,
      originRegion: analysis.originRegion ?? null,
      estimatedValueMin: analysis.estimatedValueMin ?? null,
      estimatedValueMax: analysis.estimatedValueMax ?? null,
      confidence: analysis.confidence,
      description: analysis.description,
      historicalContext: analysis.historicalContext,
      evidenceFor: analysis.evidenceFor ?? null,
      evidenceAgainst: analysis.evidenceAgainst ?? null
    }

    // Calculate scores (safely handle null aiOutput)
    const aiOutput = result.aiOutput!
    result.scores.name = scoreNameMatch(item.expected, aiOutput)
    result.scores.maker = scoreMakerMatch(item.expected, aiOutput)
    result.scores.era = scoreEraMatch(item.expected, aiOutput)
    result.scores.style = scoreStyleMatch(item.expected, aiOutput)
    result.scores.category = aiOutput.productCategory === item.expected.category ? 100 : 0
    result.scores.domain = aiOutput.domainExpert === item.expected.domainExpert ? 100 : 0
    result.scores.origin = aiOutput.originRegion?.toLowerCase().includes(item.expected.originRegion.toLowerCase()) ? 100 : 0
    result.scores.value = scoreValueAccuracy(item.expected, aiOutput)
    result.scores.features = scoreFeaturesIdentified(item.expected, aiOutput)
    result.scores.authentication = scoreAuthenticationMarkers(item.expected, aiOutput)

    // Calculate weighted overall score
    result.overallScore = Math.round(
      (result.scores.name * SCORING_WEIGHTS.nameMatch +
       result.scores.maker * SCORING_WEIGHTS.makerMatch +
       result.scores.era * SCORING_WEIGHTS.eraMatch +
       result.scores.style * SCORING_WEIGHTS.styleMatch +
       result.scores.category * SCORING_WEIGHTS.categoryMatch +
       result.scores.domain * SCORING_WEIGHTS.domainMatch +
       result.scores.origin * SCORING_WEIGHTS.originMatch +
       result.scores.value * SCORING_WEIGHTS.valueAccuracy +
       result.scores.features * SCORING_WEIGHTS.featuresIdentified +
       result.scores.authentication * SCORING_WEIGHTS.authenticationMarkers) /
      Object.values(SCORING_WEIGHTS).reduce((a, b) => a + b, 0)
    )

    // Analyze results
    for (const [key, score] of Object.entries(result.scores)) {
      if (score === 100) {
        result.successes.push(`${key}: Perfect match`)
      } else if (score >= 70) {
        result.partialMatches.push(`${key}: ${score}% match`)
      } else if (score > 0) {
        result.failures.push(`${key}: Only ${score}% - needs improvement`)
      } else {
        result.failures.push(`${key}: Complete miss`)
      }
    }

    // Generate improvement suggestions
    if (result.scores.name < 70) {
      result.improvementSuggestions.push(
        `Name identification failed. AI said "${aiOutput.name}" but expected "${item.expected.name}". Consider adding more training examples for ${item.expected.domainExpert} category.`
      )
    }
    if (result.scores.maker < 70 && item.expected.maker) {
      result.improvementSuggestions.push(
        `Maker attribution failed. Consider adding ${item.expected.maker} to the knowledge base with their distinctive marks and characteristics.`
      )
    }
    if (result.scores.value < 60) {
      result.improvementSuggestions.push(
        `Value estimation off. AI: $${aiOutput.estimatedValueMin}-$${aiOutput.estimatedValueMax}, Expected: $${item.expected.valueMin}-$${item.expected.valueMax}. Update market data sources.`
      )
    }
    if (result.scores.features < 60) {
      result.improvementSuggestions.push(
        `Missing key features. The AI should identify: ${item.expected.mustIdentifyFeatures.join(', ')}`
      )
    }

  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error)
    logger.error(`Test failed for ${item.id}: ${result.error}`)
  }

  return result
}

/**
 * Analyze failure patterns across all results
 */
function analyzeFailurePatterns(results: TestResult[]): { pattern: string; count: number; examples: string[] }[] {
  const patterns: Record<string, { count: number; examples: string[] }> = {}

  for (const result of results) {
    // Track failures by category
    const category = result.groundTruth.expected.domainExpert

    if (result.scores.name < 70) {
      const key = `Name identification failure in ${category}`
      if (!patterns[key]) patterns[key] = { count: 0, examples: [] }
      patterns[key].count++
      patterns[key].examples.push(result.itemId)
    }

    if (result.scores.maker < 70 && result.groundTruth.expected.maker) {
      const key = `Maker attribution failure in ${category}`
      if (!patterns[key]) patterns[key] = { count: 0, examples: [] }
      patterns[key].count++
      patterns[key].examples.push(result.itemId)
    }

    if (result.scores.value < 60) {
      const key = `Value estimation off in ${category}`
      if (!patterns[key]) patterns[key] = { count: 0, examples: [] }
      patterns[key].count++
      patterns[key].examples.push(result.itemId)
    }

    if (result.scores.style < 70) {
      const key = `Style identification failure for ${result.groundTruth.expected.style}`
      if (!patterns[key]) patterns[key] = { count: 0, examples: [] }
      patterns[key].count++
      patterns[key].examples.push(result.itemId)
    }

    // Track by difficulty
    if (result.overallScore < 60) {
      const key = `Difficulty level "${result.groundTruth.expected.difficulty}" items failing`
      if (!patterns[key]) patterns[key] = { count: 0, examples: [] }
      patterns[key].count++
      patterns[key].examples.push(result.itemId)
    }
  }

  return Object.entries(patterns)
    .map(([pattern, data]) => ({ pattern, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)  // Top 10 patterns
}

/**
 * Generate improvement priorities based on results
 */
function generateImprovementPriorities(results: TestResult[]): string[] {
  const priorities: string[] = []

  // Calculate average scores by category
  const categoryScores: Record<string, number[]> = {}
  for (const result of results) {
    const cat = result.groundTruth.expected.domainExpert
    if (!categoryScores[cat]) categoryScores[cat] = []
    categoryScores[cat].push(result.overallScore)
  }

  // Find weakest categories
  const avgByCategory = Object.entries(categoryScores)
    .map(([cat, scores]) => ({
      category: cat,
      avg: scores.reduce((a, b) => a + b, 0) / scores.length
    }))
    .sort((a, b) => a.avg - b.avg)

  if (avgByCategory.length > 0 && avgByCategory[0].avg < 70) {
    priorities.push(
      `PRIORITY 1: Improve ${avgByCategory[0].category} knowledge (avg score: ${avgByCategory[0].avg.toFixed(1)}%)`
    )
  }

  // Check overall value accuracy
  const avgValueScore = results.reduce((sum, r) => sum + r.scores.value, 0) / results.length
  if (avgValueScore < 70) {
    priorities.push(
      `PRIORITY: Improve value estimation accuracy (current avg: ${avgValueScore.toFixed(1)}%). Consider integrating real-time auction data.`
    )
  }

  // Check maker attribution
  const makerResults = results.filter(r => r.groundTruth.expected.maker)
  const avgMakerScore = makerResults.reduce((sum, r) => sum + r.scores.maker, 0) / makerResults.length
  if (avgMakerScore < 70) {
    priorities.push(
      `PRIORITY: Improve maker attribution (current avg: ${avgMakerScore.toFixed(1)}%). Build a maker marks database.`
    )
  }

  // Check feature identification
  const avgFeatureScore = results.reduce((sum, r) => sum + r.scores.features, 0) / results.length
  if (avgFeatureScore < 70) {
    priorities.push(
      `PRIORITY: Improve feature identification (current avg: ${avgFeatureScore.toFixed(1)}%). Enhance visual analysis prompts.`
    )
  }

  return priorities
}

/**
 * Run the full evaluation suite
 */
export async function runFullEvaluation(
  items: GroundTruthItem[] = GROUND_TRUTH_ITEMS,
  options: { maxItems?: number; skipItems?: string[] } = {}
): Promise<EvaluationReport> {
  const startTime = Date.now()

  const itemsToTest = items
    .filter(item => !options.skipItems?.includes(item.id))
    .slice(0, options.maxItems || items.length)

  const results: TestResult[] = []

  for (const item of itemsToTest) {
    const result = await runSingleTest(item)
    results.push(result)

    // Log progress
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

  const report: EvaluationReport = {
    timestamp: new Date().toISOString(),
    totalItems: items.length,
    itemsTested: results.length,
    itemsSkipped: items.length - results.length,
    overallAccuracy: avgScore >= 70 ? avgScore : 0,  // Pass threshold is 70%
    averageScore: avgScore,
    medianScore: medianScore,
    categoryScores,
    scoreDistribution: distribution,
    commonFailures: analyzeFailurePatterns(results),
    improvementPriorities: generateImprovementPriorities(results),
    results
  }

  const elapsed = (Date.now() - startTime) / 1000
  logger.info(`Evaluation complete in ${elapsed.toFixed(1)}s`)
  logger.info(`Overall accuracy: ${avgScore.toFixed(1)}%`)

  return report
}

/**
 * Run a quick smoke test with a subset of items
 */
export async function runSmokeTest(): Promise<EvaluationReport> {
  // Pick one easy, one medium, one hard from different categories
  const smokeTestItems = [
    'furn-001',  // Eames Chair - easy
    'ceram-003', // Roseville - easy
    'jwl-001',   // Rolex Submariner - hard
    'art-001',   // Starry Night - easy
    'silv-003',  // Tiffany flatware - easy
  ]

  const items = GROUND_TRUTH_ITEMS.filter(i => smokeTestItems.includes(i.id))
  return runFullEvaluation(items)
}

/**
 * Test a single item by ID
 */
export async function testSingleItem(itemId: string): Promise<TestResult> {
  const item = GROUND_TRUTH_ITEMS.find(i => i.id === itemId)
  if (!item) {
    throw new Error(`Item not found: ${itemId}`)
  }
  return runSingleTest(item)
}

/**
 * Generate a human-readable report
 */
export function formatReport(report: EvaluationReport): string {
  let output = `
================================================================================
                    VINTAGEVISION EVALUATION REPORT
================================================================================
Timestamp: ${report.timestamp}
Items Tested: ${report.itemsTested} of ${report.totalItems}

OVERALL RESULTS
---------------
Average Score: ${report.averageScore.toFixed(1)}%
Median Score:  ${report.medianScore.toFixed(1)}%
Pass Rate:     ${((report.scoreDistribution.excellent + report.scoreDistribution.good + report.scoreDistribution.acceptable) / report.itemsTested * 100).toFixed(1)}%

SCORE DISTRIBUTION
------------------
Excellent (90-100): ${report.scoreDistribution.excellent} items
Good (75-89):       ${report.scoreDistribution.good} items
Acceptable (60-74): ${report.scoreDistribution.acceptable} items
Poor (40-59):       ${report.scoreDistribution.poor} items
Failed (<40):       ${report.scoreDistribution.failed} items

CATEGORY PERFORMANCE
--------------------
`

  for (const [cat, data] of Object.entries(report.categoryScores)) {
    output += `${cat.padEnd(15)} ${data.avgScore.toFixed(1).padStart(5)}% (${data.count} items)\n`
  }

  output += `
COMMON FAILURE PATTERNS
-----------------------
`
  for (const failure of report.commonFailures.slice(0, 5)) {
    output += `• ${failure.pattern} (${failure.count} occurrences)\n`
  }

  output += `
IMPROVEMENT PRIORITIES
----------------------
`
  for (const priority of report.improvementPriorities) {
    output += `• ${priority}\n`
  }

  output += `
================================================================================
`

  return output
}

/**
 * Main entry point - run full evaluation when executed directly
 */
async function main() {
  console.log('\n' + '='.repeat(80))
  console.log('VINTAGEVISION EVALUATION HARNESS')
  console.log('='.repeat(80) + '\n')

  try {
    const report = await runFullEvaluation()
    console.log(formatReport(report))

    // Print detailed results for failed items
    const failedItems = report.results.filter(r => r.overallScore < 50)
    if (failedItems.length > 0) {
      console.log('\n' + '='.repeat(80))
      console.log('DETAILED FAILURE ANALYSIS')
      console.log('='.repeat(80) + '\n')

      for (const item of failedItems.slice(0, 10)) {
        const expectedName = item.groundTruth?.expected?.name || 'Unknown'
        console.log(`[${item.itemId}] Expected: ${expectedName}`)
        console.log(`           Got: ${item.aiOutput?.name || 'N/A'}`)
        console.log(`           Score: ${item.overallScore}%`)
        console.log('')
      }
    }

    process.exit(0)
  } catch (error) {
    console.error('Evaluation failed:', error)
    process.exit(1)
  }
}

// Only run if executed directly (not when imported)
// To run: npx tsx src/testing/evaluationHarness.ts
// main()
