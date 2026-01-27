// OpenAI Service - World-Class Treasure Hunting Intelligence System v2.0
// VintageVision - Multi-Image, Honest Confidence, Visual Evidence
// January 2026 - Complete Overhaul for Production Quality
// v2.1 - Self-Learning Integration

import OpenAI from 'openai';
import { env } from '../config/env.js';
import { ExternalServiceError, ValidationError } from '../middleware/error.js';
import { z } from 'zod';
import {
  getPromptEnhancements,
  getConfusionWarnings,
  recordGroundTruthResult
} from './selfLearning.js';

import {
  getEnhancedDomainPrompt,
  getMakerByName,
  getIdentificationPattern,
  getAuthenticationCriteria,
  MAKER_MARKS_DATABASE,
  IDENTIFICATION_PATTERNS,
} from './expertKnowledgeBase.js';

import {
  searchAllAuctionDatabases,
  calculatePriceRange,
} from './marketData.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// ============================================================================
// MODEL CONFIGURATION
// ============================================================================
const VISION_MODEL = 'gpt-4o'; // Best vision + reasoning for chat completions
const TEXT_MODEL = 'gpt-4o';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function safeJsonParse(content: string, stage: string): unknown {
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
    cleanContent = cleanContent.trim();

    // First try direct parse
    try {
      return JSON.parse(cleanContent);
    } catch {
      // Try to repair truncated JSON by closing open brackets
      let repaired = cleanContent;

      // Count unclosed brackets (simple heuristic)
      let openBraces = 0;
      let openBrackets = 0;
      let inString = false;
      let escaped = false;

      for (const char of repaired) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (char === '\\') {
          escaped = true;
          continue;
        }
        if (char === '"') {
          inString = !inString;
          continue;
        }
        if (!inString) {
          if (char === '{') openBraces++;
          else if (char === '}') openBraces--;
          else if (char === '[') openBrackets++;
          else if (char === ']') openBrackets--;
        }
      }

      // If we're in a string, close it
      if (inString) {
        repaired += '"';
      }

      // Remove trailing comma if present
      repaired = repaired.replace(/,\s*$/, '');

      // Close any unclosed arrays and objects
      while (openBrackets > 0) {
        repaired += ']';
        openBrackets--;
      }
      while (openBraces > 0) {
        repaired += '}';
        openBraces--;
      }

      // Try parsing the repaired JSON
      console.log(`⚠️ Repaired truncated JSON in ${stage}`);
      return JSON.parse(repaired);
    }
  } catch (error) {
    console.error(`❌ JSON parse error in ${stage}:`, content.substring(0, 500));
    throw new ExternalServiceError(
      `Failed to parse ${stage} response as JSON`,
      'OpenAI'
    );
  }
}

// Humanize prices to avoid fake precision
function humanizePrice(price: number): number {
  if (price < 100) return Math.round(price / 10) * 10;
  if (price < 1000) return Math.round(price / 50) * 50;
  if (price < 10000) return Math.round(price / 100) * 100;
  if (price < 100000) return Math.round(price / 500) * 500;
  return Math.round(price / 1000) * 1000;
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ProductCategory = 'antique' | 'vintage' | 'modern_branded' | 'modern_generic';

export type DomainExpert =
  | 'furniture' | 'ceramics' | 'glass' | 'silver' | 'jewelry' | 'watches'
  | 'art' | 'textiles' | 'toys' | 'books' | 'tools' | 'lighting'
  | 'electronics' | 'vehicles' | 'general';

export type DealRating = 'exceptional' | 'good' | 'fair' | 'overpriced';
export type FlipDifficulty = 'easy' | 'moderate' | 'hard' | 'very_hard';
export type AuthenticityRisk = 'low' | 'medium' | 'high' | 'very_high';
export type ImageRole = 'overview' | 'detail' | 'marks' | 'underside' | 'damage' | 'context' | 'additional';

// Image input for multi-image analysis
export interface CapturedImage {
  id: string;
  dataUrl: string;
  role: ImageRole;
  label: string;
}

// ============================================================================
// SCHEMA DEFINITIONS - ENHANCED FOR HONEST CONFIDENCE
// ============================================================================

// Knowledge State Schema - What we know vs what we need
const ConfirmedFactSchema = z.object({
  statement: z.string(),
  evidence: z.string(),
  confidence: z.number().min(0.9).max(1),
});

const ProbableFactSchema = z.object({
  statement: z.string(),
  evidence: z.string(),
  confidence: z.number().min(0.5).max(0.89),
  howToConfirm: z.string(),
});

const VerificationNeedSchema = z.object({
  question: z.string(),
  photoNeeded: z.string(),
  importance: z.enum(['critical', 'important', 'helpful']),
  impactOnValue: z.string(),
});

const KnowledgeStateSchema = z.object({
  confirmed: z.array(ConfirmedFactSchema),
  probable: z.array(ProbableFactSchema),
  needsVerification: z.array(VerificationNeedSchema),
  completeness: z.number().min(0).max(1),
});

// Visual Marker Schema - Bounding boxes for evidence
const BoundingBoxSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  width: z.number().min(0).max(100),
  height: z.number().min(0).max(100),
});

const VisualMarkerSchema = z.object({
  id: z.string(),
  imageId: z.string(),
  type: z.enum(['maker_mark', 'text', 'construction', 'damage', 'feature', 'red_flag', 'authentication']),
  bbox: BoundingBoxSchema,
  label: z.string(),
  finding: z.string(),
  confidence: z.number().min(0).max(1),
  isPositive: z.boolean(),
});

// Authentication Finding Schema - Item-specific, not generic
const AuthenticationFindingSchema = z.object({
  id: z.string(),
  area: z.string(),
  observation: z.string(),
  expectedFor: z.string(),
  status: z.enum(['pass', 'fail', 'inconclusive', 'needs_verification']),
  confidence: z.number().min(0).max(1),
  explanation: z.string(),
  imageId: z.string().optional(),
});

const ItemAuthenticationSchema = z.object({
  overallVerdict: z.enum(['likely_authentic', 'likely_fake', 'inconclusive', 'needs_expert']),
  confidenceScore: z.number().min(0).max(1),
  findings: z.array(AuthenticationFindingSchema),
  passedChecks: z.number(),
  failedChecks: z.number(),
  inconclusiveChecks: z.number(),
  criticalIssues: z.array(z.string()),
  recommendation: z.string(),
  expertNeeded: z.boolean(),
  expertType: z.string().optional(),
});

// Suggested Capture Schema - What photos would improve analysis
const CaptureRequestSchema = z.object({
  role: z.enum(['overview', 'detail', 'marks', 'underside', 'damage', 'context', 'additional']),
  priority: z.enum(['required', 'recommended', 'optional']),
  label: z.string(),
  instruction: z.string(),
  targetArea: z.string().optional(),
});

// Triage Schema
const TriageSchema = z.object({
  category: z.enum(['antique', 'vintage', 'modern_branded', 'modern_generic']),
  domainExpert: z.enum([
    'furniture', 'ceramics', 'glass', 'silver', 'jewelry', 'watches',
    'art', 'textiles', 'toys', 'books', 'tools', 'lighting',
    'electronics', 'vehicles', 'general'
  ]),
  itemType: z.string(),
  estimatedEra: z.string().nullable(),
  qualityTier: z.enum(['museum', 'high', 'mid', 'low', 'unknown']),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  visibleBranding: z.string().nullable(),
  allVisibleText: z.array(z.string()).optional(),
});

// Complete Analysis Schema
const WorldClassAnalysisSchema = z.object({
  // Core identification
  name: z.string().min(1),
  maker: z.string().nullable().optional(),
  modelNumber: z.string().nullable().optional(),
  brand: z.string().nullable().optional(),

  // Categorization
  productCategory: z.enum(['antique', 'vintage', 'modern_branded', 'modern_generic']),
  domainExpert: z.string(),
  itemSubcategory: z.string().nullable().optional(),

  // Period and origin
  era: z.string().nullable().optional(),
  style: z.string().nullable().optional(),
  periodStart: z.number().nullable().optional(),
  periodEnd: z.number().nullable().optional(),
  originRegion: z.string().nullable().optional(),

  // Description
  description: z.string().min(10),
  historicalContext: z.string().min(10),
  attributionNotes: z.string().nullable().optional(),

  // Valuation (will be humanized)
  estimatedValueMin: z.number().nonnegative().nullable().optional(),
  estimatedValueMax: z.number().nonnegative().nullable().optional(),
  currentRetailPrice: z.number().nonnegative().nullable().optional(),
  valuationBasis: z.string().optional(), // Explain how value was determined

  // Knowledge State (NEW)
  knowledgeState: KnowledgeStateSchema,

  // Confidence
  confidence: z.number().min(0).max(1),
  identificationConfidence: z.number().min(0).max(1).nullable().optional(),
  makerConfidence: z.number().min(0).max(1).nullable().optional(),

  // Evidence (legacy format for compatibility)
  evidenceFor: z.array(z.string()).nullable().optional(),
  evidenceAgainst: z.array(z.string()).nullable().optional(),

  // Visual Markers (NEW)
  visualMarkers: z.array(VisualMarkerSchema).optional(),

  // Alternative candidates
  alternativeCandidates: z.array(z.object({
    name: z.string(),
    confidence: z.number(),
    reason: z.string(),
  })).nullable().optional(),

  // Verification
  verificationTips: z.array(z.string()).nullable().optional(),
  redFlags: z.array(z.string()).nullable().optional(),

  // Resale
  flipDifficulty: z.enum(['easy', 'moderate', 'hard', 'very_hard']).nullable().optional(),
  flipTimeEstimate: z.string().nullable().optional(),
  resaleChannels: z.array(z.string()).nullable().optional(),

  // Item-specific Authentication (NEW)
  itemAuthentication: ItemAuthenticationSchema.optional(),

  // Suggested Captures (NEW)
  suggestedCaptures: z.array(CaptureRequestSchema).optional(),
});

// Legacy authentication for backward compatibility
const LegacyAuthenticationSchema = z.object({
  authenticationConfidence: z.number().min(0).max(1),
  authenticityRisk: z.enum(['low', 'medium', 'high', 'very_high']),
  checklist: z.array(z.object({
    id: z.string(),
    category: z.enum(['visual', 'physical', 'documentation', 'provenance']),
    priority: z.enum(['critical', 'important', 'helpful']),
    check: z.string(),
    howTo: z.string(),
    whatToLookFor: z.string(),
    redFlagSigns: z.array(z.string()),
    requiresExpert: z.boolean(),
    photoHelpful: z.boolean(),
  })),
  knownFakeIndicators: z.array(z.string()),
  photosRequested: z.array(z.object({
    id: z.string(),
    area: z.string(),
    reason: z.string(),
    whatToCapture: z.string(),
    priority: z.enum(['required', 'recommended', 'optional']),
  })),
  expertReferralRecommended: z.boolean(),
  expertReferralReason: z.string().nullable(),
  overallAssessment: z.string(),
});

export type AnalysisResult = z.infer<typeof WorldClassAnalysisSchema>;

// Extended result with deal analysis and legacy fields
export interface WorldClassResult extends AnalysisResult {
  askingPrice?: number | null;
  dealRating?: DealRating | null;
  dealExplanation?: string | null;
  profitPotentialMin?: number | null;
  profitPotentialMax?: number | null;
  // Legacy auth fields
  authenticationConfidence?: number | null;
  authenticityRisk?: AuthenticityRisk | null;
  authenticationChecklist?: z.infer<typeof LegacyAuthenticationSchema>['checklist'] | null;
  knownFakeIndicators?: string[] | null;
  additionalPhotosRequested?: z.infer<typeof LegacyAuthenticationSchema>['photosRequested'] | null;
  expertReferralRecommended?: boolean | null;
  expertReferralReason?: string | null;
  authenticationAssessment?: string | null;
  // Legacy fields for backward compatibility
  comparableSales?: Array<{
    description: string;
    venue: string;
    price: number;
    date: string;
    relevance: string;
  }> | null;
  stylingSuggestions?: unknown[] | null;
  productUrl?: string | null;
}

// Event emitter type
export type AnalysisEventEmitter = (event: {
  type: 'stage:start' | 'stage:complete' | 'error';
  stage?: string;
  message: string;
  progress: number;
  data?: Record<string, unknown>;
}) => void;

// ============================================================================
// DOMAIN EXPERT KNOWLEDGE BASE
// ============================================================================

const DOMAIN_EXPERT_PROMPTS: Record<DomainExpert, string> = {
  furniture: `FURNITURE EXPERTISE:

PERIOD IDENTIFICATION:
- Colonial (1620-1780): William & Mary, Queen Anne, Chippendale
- Federal (1780-1820): Hepplewhite, Sheraton, American Empire
- Victorian (1840-1900): Gothic, Rococo, Renaissance Revival, Eastlake
- Arts & Crafts (1890-1920): Mission, Craftsman - look for Stickley, Limbert, Roycroft marks
- Art Deco (1920-1940): Streamlined, geometric
- Mid-Century Modern (1945-1975): Eames, Knoll, Herman Miller, Danish

CONSTRUCTION TELLS:
- Dovetails: Hand-cut (irregular spacing) vs machine (uniform) - hand = pre-1860 typically
- Nails: Rose-head (pre-1800), cut nails (1790-1890), wire nails (1890+)
- Screws: Flat-bottom slots (pre-1850), pointed slots (post-1850), Phillips (post-1930)
- Secondary woods: Pine/poplar = American, oak = English

MAKER AUTHENTICATION:
- Gustav Stickley: Red decal (early), black branded "Stickley" in box
- L. & J.G. Stickley: "Handcraft" or "Work of..." labels
- Herman Miller/Eames: Shock mounts, manufacturer labels with dates
- Knoll: Labels with model numbers

RED FLAGS:
- Distressing too uniform across entire piece
- Modern screws/nails in "antique" pieces
- Plywood anywhere on supposed antique
- New wood smell when drawers opened`,

  ceramics: `CERAMICS & POTTERY EXPERTISE:

AMERICAN ART POTTERY:
- Roseville: Pattern ID (Futura, Pinecone, Sunflower), mark evolution
- Rookwood: Flame marks = 1886-1960, count flames for date
- Weller: Louwelsa, Sicard, Hudson lines
- McCoy: "NM" marks, cookie jars
- Van Briggle: Dated marks 1901-1920 most valuable

MARKS ANALYSIS:
- Backstamps: Location, style, color all indicate date
- Impressed vs printed marks
- Artist signatures (especially Rookwood)

EUROPEAN:
- Meissen: Crossed swords (check orientation for period)
- Royal Copenhagen: Wave marks
- Wedgwood: Impressed marks, jasperware colors

RED FLAGS:
- Marks too crisp/perfect on old pieces
- Wrong mark style for claimed period
- Paint over marks (hiding newer mark)`,

  glass: `GLASS EXPERTISE:

ART GLASS:
- Tiffany: LCT Favrile signatures, iridescence quality
- Steuben: Aurene signatures, Carder era
- Lalique: R. LALIQUE (early) vs Lalique France (later)

DEPRESSION ERA (1920s-1940s):
- Patterns: American Sweetheart, Cherry Blossom, Mayfair, Princess
- Colors: Pink, green, amber, cobalt (cobalt = more valuable)
- Makers: Anchor Hocking, Hazel Atlas, Jeannette

CARNIVAL GLASS:
- Patterns: Grape & Cable, Orange Tree, Peacock at Fountain
- Colors: Marigold (common), amethyst, green, blue, red (rare)

IDENTIFICATION:
- Pontil marks indicate hand-blown
- Mold seams = machine made
- Ring/tone when tapped`,

  silver: `SILVER & METALWARE EXPERTISE:

STERLING (.925):
- American makers: Gorham, Tiffany, Reed & Barton, Wallace
- Pattern identification crucial for value
- Weight matters - heavier = more valuable

ENGLISH HALLMARKS (read all 4-5 marks):
- Maker's mark (initials)
- Lion passant = sterling
- City mark: Leopard (London), Anchor (Birmingham), Crown (Sheffield)
- Date letter (font + shield shape = year)

SILVERPLATE:
- EPNS = Electroplated Nickel Silver
- Triple/quadruple plate designations
- Much less valuable than sterling

RED FLAGS:
- Marks rubbed/worn = possible fake
- Wrong marks for claimed maker
- Seams on supposedly hand-raised pieces`,

  jewelry: `JEWELRY EXPERTISE:

PERIODS:
- Georgian (1714-1837): Closed-back settings, foil-backed stones
- Victorian: Mourning jewelry, serpents, hearts, hands
- Edwardian (1901-1915): Platinum filigree, diamonds + pearls
- Art Nouveau (1890-1910): Organic forms, enamel, Lalique
- Art Deco (1920-1935): Geometric, platinum, calibré-cut
- Retro (1935-1950): Bold rose gold, large stones

HALLMARKS:
- 10K, 14K, 18K = Gold karat
- 750 = 18K, 585 = 14K, 375 = 9K
- 925 = Sterling silver
- PLAT/PT = Platinum

COSTUME BRANDS:
- Signed pieces more valuable: Miriam Haskell, Eisenberg, Trifari, Coro
- Bakelite testing: Simichrome, hot water smell

RED FLAGS:
- Modern findings on "antique" pieces
- Wrong cut for claimed period
- Glue where prongs should be`,

  watches: `WATCH EXPERTISE:

LUXURY AUTHENTICATION (HIGH FAKE RISK):

ROLEX:
- Crown at 12 o'clock (check for quality)
- Cyclops magnification = 2.5x (fakes often 1.5x)
- Case weight (solid vs hollow)
- Rehaut engraving (post-2007)
- Movement quality (requires opening)

OMEGA:
- Hippocampus logo
- Movement caliber matches model
- Correct date for reference number

PATEK PHILIPPE:
- Calatrava cross
- Movement finishing
- Case construction

RED FLAGS (COMMON FAKE TELLS):
- Date magnification wrong
- Wrong font on dial
- Ticking second hand (should sweep)
- Light weight
- Poor finishing
- Wrong crown position`,

  art: `ART & PRINTS EXPERTISE:

PAINTINGS:
- Signature location and style
- Canvas age and stretcher type
- Craquelure patterns (age vs fake aging)
- Paint layer analysis

PRINTS:
- Edition numbers (lower = more valuable usually)
- Paper quality and watermarks
- Printing technique (etching, lithograph, serigraph)
- Condition (foxing, toning, tears)

POSTERS:
- Original vs reproduction
- Linen-backing indicates value
- Size matches known examples

RED FLAGS:
- Signature too perfect
- Modern materials under old varnish
- Photo-mechanical dots (indicates print)`,

  textiles: `TEXTILES & RUGS EXPERTISE:

RUGS:
- Hand-knotted vs machine (flip over and check)
- KPSI = knots per square inch (higher = finer)
- Origin: Persian, Turkish, Chinese patterns
- Natural vs synthetic dyes

QUILTS:
- Hand vs machine stitching
- Pattern identification
- Fabric dating

VINTAGE CLOTHING:
- Labels and union tags
- Zipper types (metal = older)
- Construction techniques

RED FLAGS:
- Synthetic fibers in "antique" piece
- Modern dyes in old rug
- Wrong construction for claimed age`,

  toys: `TOYS & DOLLS EXPERTISE:

TIN TOYS:
- Lithography quality
- Maker marks (Marx, Chein, Schuco)
- Working mechanism

DOLLS:
- Head marks (Jumeau, Bru, Simon & Halbig)
- Body type and material
- Original clothing vs replacements

CAST IRON:
- Banks and vehicles
- Paint originality
- Reproduction detection

RED FLAGS:
- Too bright paint on "old" toys
- Wrong screws/fasteners
- Modern casting marks`,

  books: `BOOKS & EPHEMERA EXPERTISE:

FIRST EDITIONS:
- First edition, first printing indicators
- Number lines
- Dust jacket condition (crucial for value)

CONDITION GRADING:
- Fine, Very Good, Good, Fair, Poor
- Binding tightness
- Foxing, staining, inscriptions

RARE BOOKS:
- Early printed books (incunabula)
- Important bindings
- Association copies

RED FLAGS:
- Facsimile vs original
- Replaced pages
- Rebacked bindings`,

  tools: `TOOLS & INSTRUMENTS EXPERTISE:

HAND TOOLS:
- Stanley planes (type study for dating)
- Maker marks on chisels
- Patent dates

SCIENTIFIC INSTRUMENTS:
- Makers (Keuffel & Esser, etc.)
- Brass vs plastic components
- Working condition

MEDICAL INSTRUMENTS:
- Age indicators
- Maker marks
- Completeness of sets

RED FLAGS:
- Modern replacement parts
- Over-restoration
- Missing components`,

  lighting: `LIGHTING EXPERTISE:

LAMPS:
- Tiffany: Base + shade matching, signatures
- Handel: Reverse-painted shades
- Pairpoint: "Puffy" shades

IDENTIFICATION:
- Base and shade should be original pair
- Wiring age (cloth = old)
- Hardware style

CHANDELIERS:
- Crystal quality
- Original vs replacement parts
- Period appropriate

RED FLAGS:
- Married base and shade
- Modern wiring passed as original
- Wrong hardware for period`,

  electronics: `ELECTRONICS EXPERTISE:

VINTAGE AUDIO:
- Tube vs transistor era
- Brand value (McIntosh, Marantz)
- Working condition crucial

VINTAGE COMPUTERS:
- Apple, Commodore, etc.
- Completeness (all parts/manuals)
- Working condition

CAMERAS:
- Leica, Hasselblad premiums
- Lens condition
- Functionality

RED FLAGS:
- Non-working without disclosure
- Replacement parts
- Modified items`,

  vehicles: `VEHICLES EXPERTISE:

AUTOMOBILES:
- VIN decode for authenticity
- Matching numbers (engine, trans)
- Documentation (title history)

MOTORCYCLES:
- Frame and engine numbers
- Original vs restored
- Parts correctness

BICYCLES:
- Schwinn, Raleigh premiums
- Original paint vs repaint
- Component age

RED FLAGS:
- VIN tampering
- Non-matching numbers
- Title issues`,

  general: `GENERAL EXPERTISE:

Analyze considering:
- What is it exactly?
- Who made it?
- When was it made?
- Where was it made?
- What condition is it in?
- What comparable items sell for?

Look for any maker marks, labels, dates, or other identifying features.`,
};

// ============================================================================
// CORE ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Stage 1: Smart Triage - Quick categorization
 */
async function performTriage(
  images: CapturedImage[]
): Promise<z.infer<typeof TriageSchema>> {
  console.log('🔍 Stage 1: Smart Triage...');

  const imageContents = images.map(img => ({
    type: 'image_url' as const,
    image_url: { url: img.dataUrl, detail: 'high' as const },
  }));

  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'system',
        content: `You are an expert appraiser doing initial triage of an item.

CRITICAL FIRST STEP: Carefully examine the image and transcribe ALL visible text, including:
- Brand names (e.g., "POLAROID", "Rolex", "Tiffany & Co.")
- Model names/numbers (e.g., "OneStep 2", "Submariner", "Model 1234")
- Maker's marks, signatures, stamps
- Labels, tags, engravings
- Any other text visible in the image

This text is ESSENTIAL for accurate identification.

THEN categorize:
1. Category (REQUIRED - must be EXACTLY one of these 4 values):
   - "antique": Pre-1920, shows authentic age/patina
   - "vintage": 1920-1990, collectible
   - "modern_branded": Post-1990 with identifiable brand (MUST have visible brand)
   - "modern_generic": Post-1990, no clear brand, OR if uncertain use this
2. Domain Expert (REQUIRED - must be EXACTLY one of these 15 values):
   furniture, ceramics, glass, silver, jewelry, watches, art, textiles, toys, books, tools, lighting, electronics, vehicles, general
   NOTE: If the item doesn't clearly fit, use "general"
3. Assess quality tier

Respond in JSON:
{
  "category": "REQUIRED: EXACTLY one of: antique | vintage | modern_branded | modern_generic",
  "domainExpert": "REQUIRED: EXACTLY one of: furniture | ceramics | glass | silver | jewelry | watches | art | textiles | toys | books | tools | lighting | electronics | vehicles | general",
  "itemType": "specific item description WITH brand/model if visible (e.g., 'Polaroid OneStep 2 Camera' not just 'camera')",
  "estimatedEra": "specific time period (e.g., '2017' or '1890-1910') or null",
  "qualityTier": "REQUIRED: EXACTLY one of: museum | high | mid | low | unknown",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation including any visible text that helped identify",
  "visibleBranding": "EXACT brand name as visible in image, or null if none",
  "allVisibleText": ["transcribe", "every", "piece", "of", "visible", "text"]
}

CRITICAL RULES:
- "category" MUST be exactly: "antique", "vintage", "modern_branded", or "modern_generic". NEVER use "unknown" or any other value.
- "domainExpert" MUST be exactly one of the 15 allowed values. For photographs use "art". For architecture use "art". For anything not fitting, use "general".
- "qualityTier" MUST be exactly: "museum", "high", "mid", "low", or "unknown".

IMPORTANT: 'category' is the AGE category (antique/vintage/modern), NOT the item type.
For a painting from 1890, category="antique" and domainExpert="art".
For modern jewelry, category="modern_generic" and domainExpert="jewelry".
For a photograph, category based on age and domainExpert="art".`,
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'First, carefully read and transcribe ALL visible text in this image. Then categorize the item:' },
          ...imageContents,
        ],
      },
    ],
    max_tokens: 800,
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new ExternalServiceError('No triage response', 'OpenAI');

  const rawData = safeJsonParse(content, 'triage') as Record<string, unknown>;

  // Normalize invalid enum values to valid fallbacks before parsing
  const categoryFallback = (val: unknown): 'antique' | 'vintage' | 'modern_branded' | 'modern_generic' => {
    const valid = ['antique', 'vintage', 'modern_branded', 'modern_generic'];
    if (typeof val === 'string' && valid.includes(val)) return val as 'antique' | 'vintage' | 'modern_branded' | 'modern_generic';
    console.log(`⚠️ Invalid category "${val}", defaulting to "vintage"`);
    return 'vintage';
  };

  const domainFallback = (val: unknown): DomainExpert => {
    const valid = ['furniture', 'ceramics', 'glass', 'silver', 'jewelry', 'watches', 'art', 'textiles', 'toys', 'books', 'tools', 'lighting', 'electronics', 'vehicles', 'general'];
    if (typeof val === 'string' && valid.includes(val)) return val as DomainExpert;
    // Map common invalid values
    const mappings: Record<string, DomainExpert> = {
      'architecture': 'art',
      'photography': 'art',
      'photograph': 'art',
      'photos': 'art',
      'music': 'general',
      'records': 'general',
      'collectibles': 'general',
      'memorabilia': 'general',
      'unknown': 'general',
    };
    const lower = String(val).toLowerCase();
    if (mappings[lower]) {
      console.log(`⚠️ Mapping domainExpert "${val}" to "${mappings[lower]}"`);
      return mappings[lower];
    }
    console.log(`⚠️ Invalid domainExpert "${val}", defaulting to "general"`);
    return 'general';
  };

  const qualityFallback = (val: unknown): 'museum' | 'high' | 'mid' | 'low' | 'unknown' => {
    const valid = ['museum', 'high', 'mid', 'low', 'unknown'];
    if (typeof val === 'string' && valid.includes(val)) return val as 'museum' | 'high' | 'mid' | 'low' | 'unknown';
    console.log(`⚠️ Invalid qualityTier "${val}", defaulting to "mid"`);
    return 'mid';
  };

  // Normalize the data before parsing
  const normalizedData = {
    ...rawData,
    category: categoryFallback(rawData.category),
    domainExpert: domainFallback(rawData.domainExpert),
    qualityTier: qualityFallback(rawData.qualityTier),
  };

  const parseResult = TriageSchema.safeParse(normalizedData);
  if (!parseResult.success) {
    console.error('❌ Triage validation failed after normalization:', parseResult.error.issues);
    // Return a minimal valid response
    return {
      category: 'vintage' as const,
      domainExpert: 'general' as const,
      itemType: String(rawData.itemType || 'Unknown Item'),
      estimatedEra: null,
      qualityTier: 'mid' as const,
      confidence: 0.3,
      reasoning: 'Fallback due to parsing error',
      visibleBranding: null,
      allVisibleText: [],
    };
  }

  console.log(`📦 ${parseResult.data.category} | ${parseResult.data.domainExpert} | ${parseResult.data.qualityTier}`);
  return parseResult.data;
}

/**
 * Stage 2: Deep Analysis with Honest Confidence
 */
async function performDeepAnalysis(
  images: CapturedImage[],
  triage: z.infer<typeof TriageSchema>,
  askingPrice?: number
): Promise<WorldClassResult> {
  console.log('🔬 Stage 2: Deep Analysis with Honest Confidence...');

  // Use enhanced domain prompts from knowledge base when available
  const enhancedPrompt = getEnhancedDomainPrompt(triage.domainExpert);
  const basePrompt = DOMAIN_EXPERT_PROMPTS[triage.domainExpert];
  const domainPrompt = enhancedPrompt || basePrompt;

  // Get relevant maker marks for context
  const relevantMakers = MAKER_MARKS_DATABASE
    .filter(m => m.category === triage.domainExpert)
    .slice(0, 10)
    .map(m => `• ${m.maker}: ${m.markDescription} (${m.activeYears})`)
    .join('\n');

  // Get identification patterns for this category
  const patterns = IDENTIFICATION_PATTERNS
    .filter(p => p.category === triage.domainExpert)
    .slice(0, 3);

  const makerContext = relevantMakers
    ? `\n\nKEY MAKER MARKS TO LOOK FOR:\n${relevantMakers}`
    : '';

  const patternContext = patterns.length > 0
    ? `\n\nIDENTIFICATION PATTERNS:\n${patterns.map(p =>
        `${p.itemType}:\n  - Look for: ${p.keyIdentifiers.slice(0, 3).join(', ')}\n  - Red flags: ${p.redFlags.slice(0, 2).join(', ')}`
      ).join('\n')}`
    : '';
  const imageContents = images.map((img, idx) => ({
    type: 'image_url' as const,
    image_url: { url: img.dataUrl, detail: 'high' as const },
  }));

  const imageDescriptions = images.map((img, idx) =>
    `Image ${idx + 1}: ${img.label} (${img.role})`
  ).join('\n');

  // Get self-learning enhancements based on accumulated knowledge
  const learningEnhancements = getPromptEnhancements(triage.domainExpert);
  const learningContext = learningEnhancements.length > 0
    ? `\n\nLEARNED INSIGHTS (from previous analyses):\n${learningEnhancements.map(e => `• ${e}`).join('\n')}`
    : '';

  // Get confusion warnings for detected terms
  const detectedTerms = [
    triage.itemType,
    triage.visibleBranding,
    ...(triage.allVisibleText || [])
  ].filter(Boolean) as string[];
  const confusionWarnings = getConfusionWarnings(detectedTerms);
  const confusionContext = confusionWarnings.length > 0
    ? `\n\nCONFUSION WARNINGS:\n${confusionWarnings.map(w => `⚠️ ${w}`).join('\n')}`
    : '';

  // Include triage visible text context
  const triageContext = triage.visibleBranding || triage.allVisibleText?.length
    ? `\nPREVIOUSLY DETECTED TEXT FROM TRIAGE:
${triage.visibleBranding ? `- Brand/Maker: "${triage.visibleBranding}"` : ''}
${triage.allVisibleText?.length ? `- All visible text: ${triage.allVisibleText.join(', ')}` : ''}
Use this text in your identification. The name field should include the brand if detected.`
    : '';

  const dealPrompt = askingPrice ? `
DEAL ANALYSIS (Asking Price: $${askingPrice / 100}):
Rate as: exceptional (50%+ below market), good (20-50% below), fair (within 20%), overpriced
Calculate actual profit potential considering fees and time.` : '';

  // Build the JSON schema example for the prompt
  const jsonSchemaExample = `{
  "name": "Specific item name with maker/model if visible (e.g., 'Polaroid OneStep 2 i-Type Camera')",
  "maker": "Manufacturer name if identifiable, or null",
  "brand": "Brand name if visible/identifiable, or null",
  "modelNumber": "Model number if visible, or null",
  "era": "Specific time period (e.g., '2017', '1890-1910', 'Victorian Era')",
  "style": "Design style or movement (e.g., 'Art Deco', 'Mid-Century Modern')",
  "periodStart": 1890,
  "periodEnd": 1910,
  "originRegion": "Country or region of manufacture",
  "description": "Detailed 2-4 sentence description of what this item IS, its key features, materials, and condition. Be specific about what you observe.",
  "historicalContext": "2-4 sentences about the historical significance, why this item matters, who used it, and its place in history.",
  "estimatedValueMin": 100,
  "estimatedValueMax": 300,
  "confidence": 0.85,
  "identificationConfidence": 0.9,
  "makerConfidence": 0.7,
  "knowledgeState": {
    "confirmed": [
      {"statement": "Fact you can prove", "evidence": "What you see that proves it", "confidence": 0.95}
    ],
    "probable": [
      {"statement": "Likely fact", "evidence": "Why you think so", "confidence": 0.7, "howToConfirm": "How to verify"}
    ],
    "needsVerification": [
      {"question": "What you need to know", "photoNeeded": "What photo would help", "importance": "critical", "impactOnValue": "How it affects value"}
    ],
    "completeness": 0.7
  },
  "evidenceFor": ["List of observations supporting your identification"],
  "evidenceAgainst": ["Any observations that don't fit or raise questions"],
  "verificationTips": ["Specific things owner could check to confirm authenticity"],
  "redFlags": ["Any warning signs of reproduction, fake, or damage"],
  "flipDifficulty": "easy|moderate|hard|very_hard",
  "flipTimeEstimate": "1-2 weeks",
  "resaleChannels": ["eBay", "1stDibs", "specialty dealers"]
}`;

  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a world-class ${triage.domainExpert} expert providing brutally honest analysis.

${domainPrompt}
${makerContext}
${patternContext}
${triageContext}
${learningContext}
${confusionContext}

---

CRITICAL INSTRUCTIONS:

1. **IDENTIFY WHAT THE IMAGE ACTUALLY SHOWS** - Focus on the PRIMARY object in the image. Is it furniture, a vase, a watch, silver, a painting, etc.? Your identification MUST match what you see.

2. **READ ALL VISIBLE TEXT** - Look for brand names, model numbers, maker's marks, labels, or text. This is essential for identification.

3. **USE PRECISE NAMES** - Be as specific as possible:
   - BAD: "Windsor Chair" → GOOD: "Windsor Bow-Back Side Chair"
   - BAD: "Art Pottery Vase" → GOOD: "Roseville Pinecone Jardiniere, Pattern 632-4"
   - BAD: "Vintage Watch" → GOOD: "Rolex Submariner Reference 5513"
   - BAD: "Silver Flatware" → GOOD: "Tiffany & Co. Chrysanthemum Pattern Sterling Fork"
   Include the full name with maker, pattern, model, or reference when identifiable.

4. **IDENTIFY THE MAKER/BRAND** - For antiques and collectibles, maker attribution is crucial:
   - Furniture: Look for labels, stamps, construction style (Stickley, Herman Miller, Thonet, etc.)
   - Ceramics: Check base marks, glazes, patterns (Rookwood, Roseville, Meissen, etc.)
   - Silver: Read hallmarks, look for maker's marks (Tiffany, Gorham, Georg Jensen, etc.)
   - Glass: Check signatures, style (Tiffany Favrile, Lalique, etc.)

5. **DESCRIBE WHAT YOU ACTUALLY SEE** - Your description must be about THIS specific item, not generic category information.

6. **HONEST CONFIDENCE** - Set confidence based on certainty:
   - 0.9+ = Brand/maker clearly visible and positively identified
   - 0.7-0.9 = Strong identification based on style/construction
   - 0.5-0.7 = Reasonable guess, some uncertainty
   - Below 0.5 = Uncertain, need more information

7. **KNOWLEDGE STATE** - Fill in with:
   - confirmed: Facts proven by what you see
   - probable: Likely but not fully verifiable
   - needsVerification: What additional info would help

${dealPrompt}

Available images:
${imageDescriptions}

You MUST respond with a JSON object matching this EXACT structure:
${jsonSchemaExample}

All fields should be filled with real data based on your analysis. Do NOT leave description or historicalContext empty or generic.`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this ${triage.itemType} in detail.

STEP 1: Look at the PRIMARY OBJECT in this image. What is it? (furniture, ceramics, silver, glass, painting, watch, etc.)

STEP 2: Read ALL visible text (brand names, model numbers, labels, markings, signatures).

STEP 3: Identify the specific item with its FULL NAME including:
- Maker/brand (e.g., "Herman Miller", "Tiffany & Co.", "Rookwood")
- Pattern/model name if applicable (e.g., "Chrysanthemum", "Pinecone", "Lounge Chair 670")
- Type variant (e.g., "Bow-Back Chair", "Standard Glaze Vase", "Dragonfly Shade")

STEP 4: Provide:
- Real description of what you ACTUALLY SEE in this specific item
- Historical context about this maker, pattern, or item type
- Honest confidence levels based on visibility of identifying features
- What you know for certain vs what you're inferring

Fill in ALL fields with real data based on what you observe.`,
          },
          ...imageContents,
        ],
      },
    ],
    max_tokens: 4500,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new ExternalServiceError('No analysis response', 'OpenAI');

  const parsed = safeJsonParse(content, 'analysis') as Record<string, unknown>;

  // Build result with proper defaults
  const result: WorldClassResult = {
    // Core identification
    name: String(parsed.name || triage.itemType),
    maker: parsed.maker as string | null || null,
    modelNumber: parsed.modelNumber as string | null || null,
    brand: parsed.brand as string | null || null,

    // Categorization
    productCategory: triage.category,
    domainExpert: triage.domainExpert,
    itemSubcategory: parsed.itemSubcategory as string | null || null,

    // Period and origin
    era: parsed.era as string | null || triage.estimatedEra,
    style: parsed.style as string | null || null,
    periodStart: parsed.periodStart as number | null || null,
    periodEnd: parsed.periodEnd as number | null || null,
    originRegion: parsed.originRegion as string | null || null,

    // Description
    description: String(parsed.description || 'No description available'),
    historicalContext: String(parsed.historicalContext || 'Historical context not available'),
    attributionNotes: parsed.attributionNotes as string | null || null,

    // Valuation - humanize prices
    estimatedValueMin: parsed.estimatedValueMin
      ? humanizePrice(Number(parsed.estimatedValueMin))
      : null,
    estimatedValueMax: parsed.estimatedValueMax
      ? humanizePrice(Number(parsed.estimatedValueMax))
      : null,
    currentRetailPrice: parsed.currentRetailPrice
      ? humanizePrice(Number(parsed.currentRetailPrice))
      : null,

    // Knowledge State (NEW)
    knowledgeState: parsed.knowledgeState as typeof result.knowledgeState || {
      confirmed: [],
      probable: [],
      needsVerification: [],
      completeness: 0.5,
    },

    // Confidence
    confidence: Number(parsed.confidence) || 0.5,
    identificationConfidence: parsed.identificationConfidence as number | null || null,
    makerConfidence: parsed.makerConfidence as number | null || null,

    // Evidence
    evidenceFor: (parsed.evidenceFor as string[]) || [],
    evidenceAgainst: (parsed.evidenceAgainst as string[]) || [],

    // Visual Markers (NEW)
    visualMarkers: (parsed.visualMarkers as typeof result.visualMarkers) || [],

    // Alternatives
    alternativeCandidates: (parsed.alternativeCandidates as typeof result.alternativeCandidates) || [],

    // Verification
    verificationTips: (parsed.verificationTips as string[]) || [],
    redFlags: (parsed.redFlags as string[]) || [],

    // Resale
    flipDifficulty: (parsed.flipDifficulty as FlipDifficulty) || null,
    flipTimeEstimate: parsed.flipTimeEstimate as string | null || null,
    resaleChannels: (parsed.resaleChannels as string[]) || [],

    // Item Authentication (NEW)
    itemAuthentication: parsed.itemAuthentication as typeof result.itemAuthentication || undefined,

    // Suggested Captures (NEW)
    suggestedCaptures: (parsed.suggestedCaptures as typeof result.suggestedCaptures) || [],
  };

  // Deal analysis
  if (askingPrice) {
    result.askingPrice = askingPrice;
    result.dealRating = parsed.dealRating as DealRating || null;
    result.dealExplanation = parsed.dealExplanation as string || null;
    result.profitPotentialMin = parsed.profitPotentialMin as number || null;
    result.profitPotentialMax = parsed.profitPotentialMax as number || null;
  }

  // Convert item authentication to legacy format for compatibility
  if (result.itemAuthentication) {
    result.authenticationConfidence = result.itemAuthentication.confidenceScore;
    result.authenticityRisk = determineRisk(result.itemAuthentication);
    result.expertReferralRecommended = result.itemAuthentication.expertNeeded;
    result.expertReferralReason = result.itemAuthentication.expertType || null;
    result.authenticationAssessment = result.itemAuthentication.recommendation;
    result.knownFakeIndicators = result.itemAuthentication.criticalIssues;
  }

  // Fetch real market data from auction databases
  try {
    const searchQuery = `${result.maker || ''} ${result.name}`.trim();
    console.log(`📊 Fetching market data for: "${searchQuery}"`);

    const marketData = await searchAllAuctionDatabases(searchQuery, {
      category: result.domainExpert || undefined,
      minPrice: result.estimatedValueMin ? Math.floor(result.estimatedValueMin * 0.3) : undefined,
      maxPrice: result.estimatedValueMax ? Math.ceil(result.estimatedValueMax * 3) : undefined,
      limit: 10,
    });

    if (marketData.allResults.length > 0) {
      console.log(`   Found ${marketData.allResults.length} comparable sales from ${marketData.sourcesQueried.join(', ')}`);

      // Convert to our comparableSales format
      result.comparableSales = marketData.allResults.slice(0, 5).map(sale => ({
        description: sale.title,
        venue: sale.marketplace,
        price: sale.soldPrice,
        date: sale.soldDate,
        relevance: `${Math.round(sale.similarity * 100)}% match`,
      }));

      // Optionally adjust estimates based on real market data
      const priceRange = calculatePriceRange(marketData.allResults);
      if (priceRange && priceRange.count >= 3) {
        console.log(`   Market range: $${priceRange.min / 100} - $${priceRange.max / 100} (${priceRange.count} sales)`);
        // Blend AI estimate with market data for more accurate pricing
        if (result.estimatedValueMin && result.estimatedValueMax) {
          const aiMid = (result.estimatedValueMin + result.estimatedValueMax) / 2;
          const marketMid = (priceRange.min + priceRange.max) / 2;
          // Weight: 60% AI, 40% market data
          const blendedMid = aiMid * 0.6 + marketMid * 0.4;
          const range = (priceRange.max - priceRange.min) / 2;
          result.estimatedValueMin = Math.round(Math.max(priceRange.min, blendedMid - range));
          result.estimatedValueMax = Math.round(Math.min(priceRange.max * 1.2, blendedMid + range));
        }
      }
    } else {
      console.log(`   No comparable sales found in auction databases`);
    }
  } catch (marketError) {
    // Don't fail the whole analysis if market data lookup fails
    console.warn(`⚠️ Market data lookup failed (non-fatal):`, marketError);
  }

  console.log(`✅ Analysis complete: ${result.name} (${Math.round(result.confidence * 100)}% confidence)`);
  return result;
}

/**
 * Determine authenticity risk from item authentication
 */
function determineRisk(auth: NonNullable<WorldClassResult['itemAuthentication']>): AuthenticityRisk {
  if (auth.overallVerdict === 'likely_fake') return 'very_high';
  if (auth.overallVerdict === 'likely_authentic' && auth.confidenceScore > 0.8) return 'low';
  if (auth.failedChecks > 0) return 'high';
  if (auth.inconclusiveChecks > auth.passedChecks) return 'medium';
  return 'low';
}

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Analyze item from one or more images
 * @param imageBase64 - Primary image OR array of images with roles
 * @param askingPrice - Optional asking price in cents
 * @param emitEvent - Optional event emitter for progress
 */
export async function analyzeAntiqueImage(
  imageBase64: string | CapturedImage[],
  askingPrice?: number,
  emitEvent?: AnalysisEventEmitter
): Promise<WorldClassResult> {
  const emit = emitEvent || (() => {});

  try {
    // Normalize to array of captured images
    let images: CapturedImage[];
    if (typeof imageBase64 === 'string') {
      // Single image - validate format
      if (!imageBase64.startsWith('data:image/')) {
        throw new ValidationError('Invalid image format. Must be a data URL.');
      }
      const allowedFormats = ['data:image/jpeg', 'data:image/png', 'data:image/gif', 'data:image/webp'];
      if (!allowedFormats.some(f => imageBase64.startsWith(f))) {
        throw new ValidationError('Unsupported format. Use JPEG, PNG, GIF, or WebP.');
      }
      images = [{
        id: 'primary',
        dataUrl: imageBase64,
        role: 'overview',
        label: 'Primary Image',
      }];
    } else {
      images = imageBase64;
    }

    // Validate size
    const totalSize = images.reduce((sum, img) => sum + img.dataUrl.length, 0);
    if (totalSize > 50 * 1024 * 1024) {
      throw new ValidationError('Total image size too large. Maximum ~35MB.');
    }

    const startTime = Date.now();
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🏺 VINTAGEVISION v2.0 - WORLD-CLASS ANALYSIS');
    console.log(`📸 Analyzing ${images.length} image(s)`);
    console.log('═══════════════════════════════════════════════════════════════');

    // Stage 1: Triage
    emit({ type: 'stage:start', stage: 'triage', message: 'Identifying item...', progress: 5 });
    const triage = await performTriage(images);
    emit({
      type: 'stage:complete',
      stage: 'triage',
      message: `Identified as ${triage.itemType}`,
      progress: 20,
      data: {
        category: triage.category,
        domain: triage.domainExpert,
        itemType: triage.itemType,
        era: triage.estimatedEra,
        quality: triage.qualityTier,
      },
    });

    // Stage 2: Deep Analysis
    emit({ type: 'stage:start', stage: 'analysis', message: 'Deep analysis in progress...', progress: 25 });
    const result = await performDeepAnalysis(images, triage, askingPrice);
    emit({
      type: 'stage:complete',
      stage: 'analysis',
      message: 'Analysis complete',
      progress: 100,
      data: {
        name: result.name,
        confidence: result.confidence,
        value: result.estimatedValueMax,
      },
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`⏱️  Completed in ${elapsed}s`);
    console.log('═══════════════════════════════════════════════════════════════');

    return result;

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    emit({
      type: 'error',
      message: error instanceof Error ? error.message : 'Analysis failed',
      progress: 0,
    });
    throw error;
  }
}

// ============================================================================
// SUPPLEMENTARY EXPORTS
// ============================================================================

/**
 * Check OpenAI API health
 */
export async function checkOpenAIHealth(): Promise<boolean> {
  try {
    const response = await openai.models.list();
    return response.data.length > 0;
  } catch (error) {
    console.error('OpenAI health check failed:', error);
    return false;
  }
}

/**
 * Generate marketplace search links
 * Accepts multiple optional parameters for backward compatibility
 */
export function generateMarketplaceLinks(
  name: string,
  era?: string,
  estimatedValueMin?: number,
  productCategory?: ProductCategory,
  brand?: string | null,
  modelNumber?: string | null,
  domainExpert?: string
): { marketplaceName: string; linkUrl: string }[] {
  // Build search terms with available info
  const searchTerms = [brand, name].filter(Boolean).join(' ');
  const encoded = encodeURIComponent(searchTerms);

  return [
    {
      marketplaceName: 'eBay',
      linkUrl: `https://www.ebay.com/sch/i.html?_nkw=${encoded}&_sop=12&LH_Complete=1&LH_Sold=1`,
    },
    {
      marketplaceName: 'Chairish',
      linkUrl: `https://www.chairish.com/search?q=${encoded}`,
    },
    {
      marketplaceName: '1stDibs',
      linkUrl: `https://www.1stdibs.com/search/?q=${encoded}`,
    },
    {
      marketplaceName: 'Ruby Lane',
      linkUrl: `https://www.rubylane.com/search?q=${encoded}`,
    },
    {
      marketplaceName: 'Etsy',
      linkUrl: `https://www.etsy.com/search?q=${encoded}`,
    },
  ];
}

/**
 * Analyze additional photo to update existing analysis
 */
export async function analyzeAdditionalPhoto(
  existingAnalysis: WorldClassResult,
  newImage: CapturedImage
): Promise<Partial<WorldClassResult>> {
  console.log(`📸 Analyzing additional ${newImage.role} image...`);

  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'system',
        content: `You previously analyzed this item:
Name: ${existingAnalysis.name}
Maker: ${existingAnalysis.maker || 'Unknown'}
Confidence: ${existingAnalysis.confidence}

The user has provided a new ${newImage.role} image (${newImage.label}).

Analyze this new image and provide:
1. Any NEW findings that update your previous analysis
2. Changes to confidence levels
3. Resolution of any "needs verification" items
4. New visual markers for this image

Respond in JSON with only the CHANGED fields.`,
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: `Analyze this ${newImage.label} and tell me what new information it provides:` },
          { type: 'image_url', image_url: { url: newImage.dataUrl, detail: 'high' } },
        ],
      },
    ],
    max_tokens: 2000,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new ExternalServiceError('No response', 'OpenAI');

  return safeJsonParse(content, 'additional_photo') as Partial<WorldClassResult>;
}

// Type alias for external use
export type ItemAnalysis = WorldClassResult;
