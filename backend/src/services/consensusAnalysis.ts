// Conditional Multi-Run Consensus Analysis System
// VintageVision - World-Leading Antique AI as of January 2026
// Implements intelligent re-analysis only when needed to optimize cost and accuracy

import OpenAI from 'openai';
import { env } from '../config/env.js';
import {
  analyzeAntiqueImage,
  type CapturedImage,
  type ItemAnalysis,
  type DomainExpert,
  type AnalysisEventEmitter,
  type AuthenticityRisk,
} from './openai.js';

// Domain experts list for type checking
const DOMAIN_EXPERTS: DomainExpert[] = [
  'furniture', 'ceramics', 'glass', 'silver', 'jewelry', 'watches',
  'art', 'textiles', 'toys', 'books', 'tools', 'lighting',
  'electronics', 'vehicles', 'general'
];

// Initialize OpenAI for reasoning model calls
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// ============================================================================
// CONFIGURATION - Consensus Triggers & Thresholds
// ============================================================================

export interface ConsensusConfig {
  // Confidence thresholds - trigger re-run if below
  confidenceThreshold: number; // Default: 0.75

  // Value thresholds - trigger re-run if above (high stakes)
  highValueThreshold: number; // Default: 5000
  veryHighValueThreshold: number; // Default: 25000

  // High-risk categories that often have variability
  highRiskCategories: DomainExpert[];

  // Maximum number of consensus runs
  maxRuns: number; // Default: 3

  // Enable reasoning model for synthesis
  useReasoningModel: boolean; // Default: true

  // Reasoning model to use (o1, o1-pro, o3-mini)
  reasoningModel: string;
}

const DEFAULT_CONFIG: ConsensusConfig = {
  confidenceThreshold: 0.75,
  highValueThreshold: 5000,
  veryHighValueThreshold: 25000,
  highRiskCategories: ['watches', 'silver', 'jewelry', 'art', 'ceramics'],
  maxRuns: 3,
  useReasoningModel: true,
  reasoningModel: 'o1', // OpenAI's reasoning model
};

// ============================================================================
// CONSENSUS TRIGGER EVALUATION
// ============================================================================

export interface TriggerEvaluation {
  shouldRerun: boolean;
  reasons: string[];
  suggestedRuns: number;
  useReasoning: boolean;
}

/**
 * Evaluate whether an analysis result should trigger additional runs
 */
export function evaluateConsensusTriggers(
  result: ItemAnalysis,
  config: ConsensusConfig = DEFAULT_CONFIG
): TriggerEvaluation {
  const reasons: string[] = [];
  let suggestedRuns = 1;
  let useReasoning = false;

  // Safely get values with defaults
  const valueMin = result.estimatedValueMin ?? 0;
  const valueMax = result.estimatedValueMax ?? 0;
  const domainExpert = (result.domainExpert || 'general') as DomainExpert;

  // 1. Low confidence trigger
  if (result.confidence < config.confidenceThreshold) {
    reasons.push(`Low confidence: ${(result.confidence * 100).toFixed(0)}% < ${(config.confidenceThreshold * 100).toFixed(0)}%`);
    suggestedRuns = Math.max(suggestedRuns, 2);
  }

  // 2. Very low confidence - use reasoning
  if (result.confidence < 0.6) {
    reasons.push(`Very low confidence: ${(result.confidence * 100).toFixed(0)}% - using reasoning model`);
    useReasoning = true;
    suggestedRuns = Math.max(suggestedRuns, 3);
  }

  // 3. High value threshold - more at stake
  const midValue = (valueMin + valueMax) / 2;
  if (midValue >= config.veryHighValueThreshold) {
    reasons.push(`Very high value: $${midValue.toLocaleString()} - maximum scrutiny`);
    suggestedRuns = config.maxRuns;
    useReasoning = true;
  } else if (midValue >= config.highValueThreshold) {
    reasons.push(`High value: $${midValue.toLocaleString()} - additional validation`);
    suggestedRuns = Math.max(suggestedRuns, 2);
  }

  // 4. High-risk category
  if (DOMAIN_EXPERTS.includes(domainExpert) && config.highRiskCategories.includes(domainExpert)) {
    reasons.push(`High-risk category: ${domainExpert} - known for variability`);
    suggestedRuns = Math.max(suggestedRuns, 2);
  }

  // 5. Authentication concerns
  if (result.authenticityRisk === 'high' || result.authenticityRisk === 'very_high') {
    reasons.push(`High authenticity risk: ${result.authenticityRisk}`);
    suggestedRuns = Math.max(suggestedRuns, 2);
    useReasoning = true;
  }

  // 6. Name ambiguity (generic names indicate uncertainty)
  const genericNames = ['decorative', 'vintage', 'antique', 'collectible', 'unknown'];
  const nameWords = result.name.toLowerCase().split(/\s+/);
  if (genericNames.some(g => nameWords[0] === g)) {
    reasons.push(`Ambiguous identification: "${result.name}" starts with generic term`);
    suggestedRuns = Math.max(suggestedRuns, 2);
  }

  // 7. Wide price range indicates uncertainty
  const priceRatio = valueMax / Math.max(valueMin, 1);
  if (priceRatio > 5) {
    reasons.push(`Wide price range: ${priceRatio.toFixed(1)}x spread indicates uncertainty`);
    suggestedRuns = Math.max(suggestedRuns, 2);
  }

  // Enable reasoning if configured and we're doing multiple runs
  if (config.useReasoningModel && suggestedRuns > 1) {
    useReasoning = true;
  }

  return {
    shouldRerun: suggestedRuns > 1,
    reasons,
    suggestedRuns: Math.min(suggestedRuns, config.maxRuns),
    useReasoning,
  };
}

// ============================================================================
// CONSENSUS MERGING ALGORITHMS
// ============================================================================

interface ConsensusResult {
  finalResult: ItemAnalysis;
  allRuns: ItemAnalysis[];
  consensusDetails: {
    nameAgreement: number;
    valueAgreement: number;
    categoryAgreement: number;
    mergeStrategy: string;
  };
}

/**
 * Calculate similarity between two item names using token overlap
 */
function calculateNameSimilarity(name1: string, name2: string): number {
  const tokens1 = new Set(name1.toLowerCase().split(/\s+/).filter(t => t.length > 2));
  const tokens2 = new Set(name2.toLowerCase().split(/\s+/).filter(t => t.length > 2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  const intersection = [...tokens1].filter(t => tokens2.has(t)).length;
  const union = new Set([...tokens1, ...tokens2]).size;

  return intersection / union; // Jaccard similarity
}

/**
 * Merge multiple analysis runs into a consensus result
 */
function mergeResults(runs: ItemAnalysis[]): ConsensusResult {
  if (runs.length === 1) {
    return {
      finalResult: runs[0],
      allRuns: runs,
      consensusDetails: {
        nameAgreement: 1,
        valueAgreement: 1,
        categoryAgreement: 1,
        mergeStrategy: 'single_run',
      },
    };
  }

  // Calculate name agreement matrix
  let totalNameSimilarity = 0;
  let nameComparisons = 0;
  for (let i = 0; i < runs.length; i++) {
    for (let j = i + 1; j < runs.length; j++) {
      totalNameSimilarity += calculateNameSimilarity(runs[i].name, runs[j].name);
      nameComparisons++;
    }
  }
  const nameAgreement = nameComparisons > 0 ? totalNameSimilarity / nameComparisons : 1;

  // Calculate value agreement (coefficient of variation inverse)
  const values = runs.map(r => ((r.estimatedValueMin ?? 0) + (r.estimatedValueMax ?? 0)) / 2);
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
  const valueStdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - avgValue, 2), 0) / values.length);
  const valueCV = avgValue > 0 ? valueStdDev / avgValue : 0;
  const valueAgreement = Math.max(0, 1 - valueCV);

  // Calculate category agreement
  const categories = runs.map(r => r.productCategory);
  const categoryMode = categories.sort((a, b) =>
    categories.filter(v => v === a).length - categories.filter(v => v === b).length
  ).pop()!;
  const categoryAgreement = categories.filter(c => c === categoryMode).length / categories.length;

  // Determine merge strategy based on agreement levels
  let mergeStrategy: string;
  let finalResult: ItemAnalysis;

  if (nameAgreement > 0.7 && valueAgreement > 0.8) {
    // High agreement - use weighted average by confidence
    mergeStrategy = 'confidence_weighted_average';
    finalResult = confidenceWeightedMerge(runs);
  } else if (nameAgreement < 0.3) {
    // Low name agreement - pick highest confidence result but flag uncertainty
    mergeStrategy = 'highest_confidence_with_flag';
    finalResult = highestConfidenceResult(runs);
    // Add warning to description
    finalResult = {
      ...finalResult,
      description: finalResult.description +
        `\n\n⚠️ Low consensus (${(nameAgreement * 100).toFixed(0)}% name agreement across ${runs.length} analyses). Consider expert verification.`,
    };
  } else {
    // Medium agreement - use median approach
    mergeStrategy = 'median_consensus';
    finalResult = medianConsensus(runs);
  }

  return {
    finalResult,
    allRuns: runs,
    consensusDetails: {
      nameAgreement,
      valueAgreement,
      categoryAgreement,
      mergeStrategy,
    },
  };
}

/**
 * Confidence-weighted merge for high-agreement scenarios
 */
function confidenceWeightedMerge(runs: ItemAnalysis[]): ItemAnalysis {
  const totalConfidence = runs.reduce((sum, r) => sum + r.confidence, 0);
  const weights = runs.map(r => r.confidence / totalConfidence);

  // Use highest confidence result as base
  const base = runs.reduce((best, r) => r.confidence > best.confidence ? r : best);

  // Weight-average the numeric values
  const weightedMinValue = runs.reduce((sum, r, i) => sum + (r.estimatedValueMin ?? 0) * weights[i], 0);
  const weightedMaxValue = runs.reduce((sum, r, i) => sum + (r.estimatedValueMax ?? 0) * weights[i], 0);
  const weightedConfidence = runs.reduce((sum, r, i) => sum + r.confidence * weights[i], 0);

  return {
    ...base,
    estimatedValueMin: Math.round(weightedMinValue),
    estimatedValueMax: Math.round(weightedMaxValue),
    confidence: weightedConfidence,
    description: base.description +
      `\n\n✅ Consensus from ${runs.length} analyses with ${(weightedConfidence * 100).toFixed(0)}% weighted confidence.`,
  };
}

/**
 * Return highest confidence result for low-agreement scenarios
 */
function highestConfidenceResult(runs: ItemAnalysis[]): ItemAnalysis {
  return runs.reduce((best, r) => r.confidence > best.confidence ? r : best);
}

/**
 * Median-based consensus for medium-agreement scenarios
 */
function medianConsensus(runs: ItemAnalysis[]): ItemAnalysis {
  // Sort by confidence and pick middle
  const sorted = [...runs].sort((a, b) => a.confidence - b.confidence);
  const median = sorted[Math.floor(sorted.length / 2)];

  // Use median values
  const sortedMin = runs.map(r => r.estimatedValueMin ?? 0).sort((a, b) => a - b);
  const sortedMax = runs.map(r => r.estimatedValueMax ?? 0).sort((a, b) => a - b);

  return {
    ...median,
    estimatedValueMin: sortedMin[Math.floor(sortedMin.length / 2)],
    estimatedValueMax: sortedMax[Math.floor(sortedMax.length / 2)],
    description: median.description +
      `\n\n📊 Median consensus from ${runs.length} analyses.`,
  };
}

// ============================================================================
// REASONING MODEL SYNTHESIS
// ============================================================================

/**
 * Use OpenAI's reasoning model (o1) to synthesize multiple analyses
 * This provides deeper analysis for high-stakes items
 */
async function reasoningSynthesis(
  runs: ItemAnalysis[],
  images: CapturedImage[],
  config: ConsensusConfig
): Promise<ItemAnalysis> {
  console.log(`🧠 Using reasoning model (${config.reasoningModel}) for synthesis...`);

  // Prepare the analysis summaries for the reasoning model
  const analysisSummaries = runs.map((run, i) => ({
    run: i + 1,
    name: run.name,
    maker: run.maker,
    era: run.era,
    valueRange: `$${run.estimatedValueMin ?? 0} - $${run.estimatedValueMax ?? 0}`,
    confidence: `${(run.confidence * 100).toFixed(0)}%`,
    category: run.productCategory,
    domain: run.domainExpert,
    style: run.style,
    authentication: run.authenticityRisk,
    keyFeatures: run.evidenceFor?.slice(0, 3),
  }));

  // Get first image for context (reasoning models support vision)
  const imageContent = images[0]?.dataUrl ? [{
    type: 'image_url' as const,
    image_url: { url: images[0].dataUrl, detail: 'high' as const },
  }] : [];

  try {
    const response = await openai.chat.completions.create({
      model: config.reasoningModel,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a world-class antique appraiser synthesizing multiple AI analyses of the same item. Your job is to determine the most accurate identification and valuation.

MULTIPLE ANALYSIS RESULTS:
${JSON.stringify(analysisSummaries, null, 2)}

TASK:
1. Analyze the agreement and disagreement between the analyses
2. Determine the most likely correct identification
3. Synthesize a final, authoritative assessment
4. Explain your reasoning

RESPOND IN JSON:
{
  "synthesizedName": "Most accurate item name",
  "synthesizedMaker": "Most likely maker/brand or null",
  "synthesizedEra": "Most accurate era estimate",
  "synthesizedValueMin": number,
  "synthesizedValueMax": number,
  "finalConfidence": 0.0-1.0,
  "reasoning": "Detailed explanation of synthesis decision",
  "agreementLevel": "high" | "medium" | "low",
  "recommendExpert": boolean,
  "expertReason": "If recommending expert, explain why"
}`,
            },
            ...imageContent,
          ],
        },
      ],
      // Note: o1 models use max_completion_tokens instead of max_tokens
      max_completion_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.log('⚠️ No reasoning synthesis response, falling back to merge');
      return mergeResults(runs).finalResult;
    }

    // Parse the reasoning response
    let synthesis: {
      synthesizedName: string;
      synthesizedMaker: string | null;
      synthesizedEra: string;
      synthesizedValueMin: number;
      synthesizedValueMax: number;
      finalConfidence: number;
      reasoning: string;
      agreementLevel: string;
      recommendExpert: boolean;
      expertReason?: string;
    };

    try {
      // Handle potential markdown code blocks
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      synthesis = JSON.parse(cleanContent.trim());
    } catch {
      console.log('⚠️ Failed to parse reasoning response, falling back to merge');
      return mergeResults(runs).finalResult;
    }

    // Use the highest confidence run as base and apply synthesis
    const baseResult = runs.reduce((best, r) => r.confidence > best.confidence ? r : best);

    return {
      ...baseResult,
      name: synthesis.synthesizedName || baseResult.name,
      maker: synthesis.synthesizedMaker || baseResult.maker,
      era: synthesis.synthesizedEra || baseResult.era,
      estimatedValueMin: synthesis.synthesizedValueMin || baseResult.estimatedValueMin,
      estimatedValueMax: synthesis.synthesizedValueMax || baseResult.estimatedValueMax,
      confidence: synthesis.finalConfidence || baseResult.confidence,
      description: baseResult.description +
        `\n\n🧠 REASONING MODEL SYNTHESIS:\n${synthesis.reasoning}` +
        (synthesis.recommendExpert ? `\n⚠️ Expert review recommended: ${synthesis.expertReason}` : ''),
    };

  } catch (error) {
    console.error('❌ Reasoning synthesis error:', error);
    // Fall back to standard merge
    return mergeResults(runs).finalResult;
  }
}

// ============================================================================
// MAIN CONSENSUS ANALYSIS FUNCTION
// ============================================================================

export interface ConsensusAnalysisOptions {
  config?: Partial<ConsensusConfig>;
  forceMultiRun?: boolean;
  emitEvent?: AnalysisEventEmitter;
}

/**
 * Perform consensus analysis with conditional multi-run
 * This is the main entry point that wraps analyzeAntiqueImage
 */
export async function analyzeWithConsensus(
  imageBase64: string | CapturedImage[],
  askingPrice?: number,
  options: ConsensusAnalysisOptions = {}
): Promise<ItemAnalysis & { consensusMetadata?: ConsensusResult['consensusDetails'] }> {
  const config: ConsensusConfig = { ...DEFAULT_CONFIG, ...options.config };
  const emit = options.emitEvent || (() => {});

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║ 🎯 CONSENSUS ANALYSIS SYSTEM - VintageVision Elite           ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  // First run
  emit({ type: 'stage:start', stage: 'consensus', message: 'Initial analysis...', progress: 10 });
  const firstResult = await analyzeAntiqueImage(imageBase64, askingPrice, emit);

  // Evaluate if we need more runs
  const evaluation = evaluateConsensusTriggers(firstResult, config);

  if (!evaluation.shouldRerun && !options.forceMultiRun) {
    console.log('✅ First run meets confidence criteria - no consensus needed');
    console.log(`   Confidence: ${(firstResult.confidence * 100).toFixed(0)}%`);
    console.log(`   Value: $${firstResult.estimatedValueMin} - $${firstResult.estimatedValueMax}`);
    return firstResult;
  }

  // Log why we're doing multiple runs
  console.log('');
  console.log('🔄 TRIGGERING CONSENSUS ANALYSIS:');
  evaluation.reasons.forEach(reason => console.log(`   → ${reason}`));
  console.log(`   → Running ${evaluation.suggestedRuns} total analyses`);
  if (evaluation.useReasoning) {
    console.log(`   → Will use reasoning model (${config.reasoningModel}) for synthesis`);
  }

  // Collect all runs
  const allRuns: ItemAnalysis[] = [firstResult];

  // Normalize images for additional runs
  let images: CapturedImage[];
  if (typeof imageBase64 === 'string') {
    images = [{
      id: 'primary',
      dataUrl: imageBase64,
      role: 'overview',
      label: 'Primary Image',
    }];
  } else {
    images = imageBase64;
  }

  // Perform additional runs
  for (let run = 2; run <= evaluation.suggestedRuns; run++) {
    console.log(`\n📊 Running analysis ${run}/${evaluation.suggestedRuns}...`);
    emit({
      type: 'stage:start',
      stage: 'consensus',
      message: `Consensus run ${run}/${evaluation.suggestedRuns}...`,
      progress: 10 + (run * 25),
    });

    try {
      const result = await analyzeAntiqueImage(images, askingPrice);
      allRuns.push(result);
    } catch (error) {
      console.error(`⚠️ Run ${run} failed:`, error);
      // Continue with other runs
    }
  }

  // Synthesize results
  console.log('\n🔀 Synthesizing consensus...');
  emit({ type: 'stage:start', stage: 'synthesis', message: 'Synthesizing results...', progress: 85 });

  let finalResult: ItemAnalysis;
  let consensusDetails: ConsensusResult['consensusDetails'];

  if (evaluation.useReasoning && config.useReasoningModel) {
    // Use reasoning model for synthesis
    finalResult = await reasoningSynthesis(allRuns, images, config);
    consensusDetails = {
      nameAgreement: 0, // Will be calculated
      valueAgreement: 0,
      categoryAgreement: 0,
      mergeStrategy: 'reasoning_model_synthesis',
    };

    // Calculate actual agreement scores
    const merged = mergeResults(allRuns);
    consensusDetails.nameAgreement = merged.consensusDetails.nameAgreement;
    consensusDetails.valueAgreement = merged.consensusDetails.valueAgreement;
    consensusDetails.categoryAgreement = merged.consensusDetails.categoryAgreement;
  } else {
    // Use algorithmic merge
    const merged = mergeResults(allRuns);
    finalResult = merged.finalResult;
    consensusDetails = merged.consensusDetails;
  }

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║ 📊 CONSENSUS COMPLETE                                        ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║ Runs: ${allRuns.length}                                                       `);
  console.log(`║ Name Agreement: ${(consensusDetails.nameAgreement * 100).toFixed(0)}%                                       `);
  console.log(`║ Value Agreement: ${(consensusDetails.valueAgreement * 100).toFixed(0)}%                                      `);
  console.log(`║ Strategy: ${consensusDetails.mergeStrategy}                         `);
  console.log('╚══════════════════════════════════════════════════════════════╝');

  emit({
    type: 'stage:complete',
    stage: 'consensus',
    message: `Consensus from ${allRuns.length} analyses`,
    progress: 100,
  });

  return {
    ...finalResult,
    consensusMetadata: consensusDetails,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export { DEFAULT_CONFIG as CONSENSUS_DEFAULT_CONFIG };
