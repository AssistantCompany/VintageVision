// OpenAI Service - World-Class Treasure Hunting Intelligence System
// January 2026 - Multi-Domain Expert System with Deal Analysis
// VintageVision v5.0 - Upgraded to GPT-5.2 for best-in-class vision capabilities

import OpenAI from 'openai';
import { env } from '../config/env.js';
import { ExternalServiceError, ValidationError } from '../middleware/error.js';
import { z } from 'zod';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// ============================================================================
// MODEL CONFIGURATION - GPT-5.2 for best multimodal performance
// Released December 11, 2025 - Strongest vision model, 400K context
// ============================================================================
const VISION_MODEL = 'gpt-5.2'; // GPT-5.2 Thinking - best for structured analysis & vision
const TEXT_MODEL = 'gpt-5.2';   // GPT-5.2 for text-only tasks

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely parse JSON with error handling
 * @throws ExternalServiceError if parsing fails
 */
function safeJsonParse(content: string, stage: string): unknown {
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ JSON parse error in ${stage}:`, content.substring(0, 200));
    throw new ExternalServiceError(
      `Failed to parse ${stage} response as JSON. The AI may have returned malformed data.`,
      'OpenAI'
    );
  }
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ProductCategory = 'antique' | 'vintage' | 'modern_branded' | 'modern_generic';

export type DomainExpert =
  | 'furniture'
  | 'ceramics'
  | 'glass'
  | 'silver'
  | 'jewelry'
  | 'watches'
  | 'art'
  | 'textiles'
  | 'toys'
  | 'books'
  | 'tools'
  | 'lighting'
  | 'electronics'
  | 'vehicles'
  | 'general';

export type DealRating = 'exceptional' | 'good' | 'fair' | 'overpriced';
export type FlipDifficulty = 'easy' | 'moderate' | 'hard' | 'very_hard';
export type AuthenticityRisk = 'low' | 'medium' | 'high' | 'very_high';
export type AuthCheckCategory = 'visual' | 'physical' | 'documentation' | 'provenance';
export type AuthCheckPriority = 'critical' | 'important' | 'helpful';
export type PhotoRequestPriority = 'required' | 'recommended' | 'optional';

// ============================================================================
// SCHEMA DEFINITIONS
// ============================================================================

// Stage 1: Triage Schema
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
  visibleModelNumber: z.string().nullable().optional(),
  allVisibleText: z.array(z.string()).optional(),
});

// Evidence extraction schema
const EvidenceSchema = z.object({
  visibleText: z.array(z.object({
    text: z.string(),
    location: z.string(),
    type: z.enum([
      // Antique/collectible identifiers
      'maker_mark', 'model_number', 'label', 'signature', 'stamp',
      // Book/publication identifiers
      'title', 'author', 'publisher', 'isbn', 'edition',
      // Vehicle identifiers
      'vin', 'license_plate', 'engine_number',
      // Electronics identifiers
      'serial_number', 'barcode', 'upc', 'sku',
      // Art identifiers
      'artist_signature', 'gallery_label', 'provenance_label',
      // General
      'date', 'price_tag', 'inventory_number', 'other'
    ]),
    confidence: z.number(),
  })),
  makerIndicators: z.object({
    makerName: z.string().nullable(),
    markType: z.string().nullable(),
    markLocation: z.string().nullable(),
    confidence: z.number(),
  }),
  construction: z.object({
    materials: z.array(z.string()),
    techniques: z.array(z.string()),
    qualityIndicators: z.array(z.string()),
    ageIndicators: z.array(z.string()),
  }),
  condition: z.object({
    overall: z.enum(['mint', 'excellent', 'good', 'fair', 'poor']),
    issues: z.array(z.string()),
    restorations: z.array(z.string()),
    originalityNotes: z.array(z.string()),
  }),
  distinctiveFeatures: z.array(z.string()),
  redFlags: z.array(z.string()),
});

// Candidate schema
const CandidateSchema = z.object({
  rank: z.number(),
  identification: z.string(),
  maker: z.string().nullable(),
  model: z.string().nullable(),
  period: z.string().nullable(),
  confidence: z.number(),
  evidenceFor: z.array(z.string()),
  evidenceAgainst: z.array(z.string()),
  valueEstimate: z.object({
    low: z.number().nullable(),
    high: z.number().nullable(),
    basis: z.string(),
  }),
});

// Comparable sale schema
const ComparableSaleSchema = z.object({
  description: z.string(),
  venue: z.string(),
  price: z.number(),
  date: z.string(),
  condition: z.string(),
  relevance: z.string(),
});

// Authentication check schema
const AuthenticationCheckSchema = z.object({
  id: z.string(),
  category: z.enum(['visual', 'physical', 'documentation', 'provenance']),
  priority: z.enum(['critical', 'important', 'helpful']),
  check: z.string(),
  howTo: z.string(),
  whatToLookFor: z.string(),
  redFlagSigns: z.array(z.string()),
  requiresExpert: z.boolean(),
  photoHelpful: z.boolean(),
});

// Photo request schema
const PhotoRequestSchema = z.object({
  id: z.string(),
  area: z.string(),
  reason: z.string(),
  whatToCapture: z.string(),
  priority: z.enum(['required', 'recommended', 'optional']),
});

// Authentication analysis schema
const AuthenticationAnalysisSchema = z.object({
  authenticationConfidence: z.number().min(0).max(1),
  authenticityRisk: z.enum(['low', 'medium', 'high', 'very_high']),
  checklist: z.array(AuthenticationCheckSchema),
  knownFakeIndicators: z.array(z.string()),
  photosRequested: z.array(PhotoRequestSchema),
  expertReferralRecommended: z.boolean(),
  expertReferralReason: z.string().nullable(),
  overallAssessment: z.string(),
});

export type AuthenticationCheck = z.infer<typeof AuthenticationCheckSchema>;
export type PhotoRequest = z.infer<typeof PhotoRequestSchema>;
export type AuthenticationAnalysis = z.infer<typeof AuthenticationAnalysisSchema>;

// Final analysis result schema (World-Class)
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

  // Valuation
  estimatedValueMin: z.number().nonnegative().nullable().optional().transform(v => v ? Math.round(v) : v),
  estimatedValueMax: z.number().nonnegative().nullable().optional().transform(v => v ? Math.round(v) : v),
  currentRetailPrice: z.number().nonnegative().nullable().optional().transform(v => v ? Math.round(v) : v),

  // Comparable sales - flexible schema to handle various GPT response formats
  comparableSales: z.array(z.object({
    description: z.string().optional().default(''),
    venue: z.string().optional().default(''),
    price: z.number().optional().default(0),
    date: z.string().optional().default(''),
    relevance: z.string().optional().default(''),
  }).passthrough()).nullable().optional(),

  // Confidence and evidence
  confidence: z.number().min(0).max(1),
  identificationConfidence: z.number().min(0).max(1).nullable().optional(),
  makerConfidence: z.number().min(0).max(1).nullable().optional(),
  evidenceFor: z.array(z.string()).nullable().optional(),
  evidenceAgainst: z.array(z.string()).nullable().optional(),

  // Alternative candidates - flexible schema
  alternativeCandidates: z.array(z.object({
    name: z.string().optional().default(''),
    confidence: z.number().optional().default(0),
    reason: z.string().optional().default(''),
  }).passthrough()).nullable().optional(),

  // Verification guidance
  verificationTips: z.array(z.string()).nullable().optional(),
  redFlags: z.array(z.string()).nullable().optional(),

  // Resale assessment
  flipDifficulty: z.enum(['easy', 'moderate', 'hard', 'very_hard']).nullable().optional(),
  flipTimeEstimate: z.string().nullable().optional(),
  resaleChannels: z.array(z.string()).nullable().optional(),

  // Legacy fields for compatibility
  productUrl: z.string().url().nullable().optional(),
  // stylingSuggestions can be array of strings OR array of objects
  stylingSuggestions: z.union([
    z.array(z.string()),
    z.array(
      z.object({
        title: z.string().optional().default(''),
        description: z.string().optional().default(''),
        roomType: z.string().optional().default(''),
        placement: z.string().nullable().optional(),
        complementaryItems: z.array(z.string()).optional().default([]),
        colorPalette: z.array(z.string()).optional().default([]),
        designTips: z.string().nullable().optional(),
      }).passthrough()
    ),
  ]).nullable().optional(),
});

export type AnalysisResult = z.infer<typeof WorldClassAnalysisSchema>;

// Extended result with deal analysis and authentication
export interface WorldClassResult extends AnalysisResult {
  askingPrice?: number | null;
  dealRating?: DealRating | null;
  dealExplanation?: string | null;
  profitPotentialMin?: number | null;
  profitPotentialMax?: number | null;
  // Authentication fields
  authenticationConfidence?: number | null;
  authenticityRisk?: AuthenticityRisk | null;
  authenticationChecklist?: AuthenticationCheck[] | null;
  knownFakeIndicators?: string[] | null;
  additionalPhotosRequested?: PhotoRequest[] | null;
  expertReferralRecommended?: boolean | null;
  expertReferralReason?: string | null;
  authenticationAssessment?: string | null;
}

// ============================================================================
// DOMAIN EXPERT PROMPTS
// ============================================================================

const DOMAIN_EXPERT_PROMPTS: Record<DomainExpert, string> = {
  furniture: `You are a world-class FURNITURE expert with encyclopedic knowledge of:

**PERIODS & STYLES:**
- Colonial American (1620-1780): William & Mary, Queen Anne, Chippendale
- Federal (1780-1820): Hepplewhite, Sheraton, American Empire
- Victorian (1840-1900): Gothic Revival, Rococo Revival, Renaissance Revival, Eastlake
- Arts & Crafts (1890-1920): Mission, Craftsman, Prairie
- Art Deco (1920-1940): Streamlined, geometric forms
- Mid-Century Modern (1945-1975): Danish, American, Italian
- European: Georgian, Regency, Biedermeier, Louis XV/XVI, Art Nouveau

**CONSTRUCTION ANALYSIS:**
- Joinery: Hand-cut dovetails (irregular), machine dovetails (uniform), mortise & tenon, pegged
- Secondary woods: Pine, poplar indicate American; oak indicates English
- Nail types: Rose-head (pre-1800), cut nails (1790-1890), wire nails (1890+)
- Saw marks: Circular (post-1830), straight (earlier)
- Hardware: Bail pulls, brasses, hinges, locks - original vs replacement

**KEY MAKERS TO IDENTIFY:**
- Arts & Crafts: Gustav Stickley (red decal, branded), L. & J.G. Stickley, Limbert, Roycroft
- Mid-Century: Eames, Herman Miller, Knoll, Nakashima, Wegner, Jacobsen
- Victorian: Belter, Herter Brothers, Meeks
- Early American: Duncan Phyfe, Newport/Boston makers

**AUTHENTICATION & FAKE DETECTION EXPERTISE:**

PERIOD FURNITURE VERIFICATION:
- Dovetails: Hand-cut = uneven spacing, varying angles; Machine = perfectly uniform spacing
- Screws: Flat-bottom slots (pre-1850), pointed slots (post-1850), Phillips head (post-1930)
- Saw marks: Circular patterns (post-1850), straight saw marks (hand saw, earlier)
- Secondary wood: Should be rough-cut poplar/pine on hidden surfaces; smooth = suspect
- Wood shrinkage: Old wood shrinks across grain over time, causing:
  * Round holes become oval
  * Tops/panels slightly warped
  * Slight gaps in joinery
- Patina: Authentic shows darker color in crevices, lighter on high-wear areas
- Hardware wear: Drawer pulls should show wear matching use (bottom pulls more worn)
- Backboards: Should be rough-hewn, often with saw marks; smooth plywood = modern
- Finish: Original shellac/lacquer has specific craquelure; modern poly is uniform
- Nail examination: Rose-head (pre-1800), cut nails (1790-1890), wire nails (1890+)

MAKER AUTHENTICATION:
- Gustav Stickley: Red decal (early), black branded "Stickley" in box, paper labels
- L. & J.G. Stickley: "Handcraft" or "Work of..." labels
- Roycroft: Orb and cross mark, "ROYCROFT" spelled out
- Limbert: Branded with "Limbert's Arts Crafts" in rectangle
- Herman Miller/Eames: Shock mounts, manufacturer label, dated production
- Knoll: Label with model number, production date range

CONSTRUCTION RED FLAGS (Reproductions/Fakes):
- Distressing that's too uniform across entire piece
- Stain/finish in crevices but not on high points (reversed patina)
- Modern screws or nails in supposedly antique pieces
- Plywood or particleboard ANYWHERE on supposed antique
- Joints too perfect for claimed age
- Wood species inconsistent with claimed period/region
- Hardware style wrong for claimed period
- Tool marks inconsistent (machine marks on "hand-made" piece)
- Glue types: Yellow/white glue = modern (hide glue on antiques)
- New wood smell when drawers opened
- Dovetails all identical (machine) vs slightly varied (hand)
- No evidence of shrinkage on supposedly 100+ year old piece
- Felt or fabric bottoms to hide plywood drawer bottoms

MARRIAGE DETECTION (Mismatched Parts):
- Top and base wood grain patterns don't match
- Different secondary wood species top vs bottom
- Hardware styles don't match period
- Construction techniques differ between components
- Patina inconsistent between parts
- Size proportions look "off"`,

  ceramics: `You are a world-class CERAMICS & POTTERY expert with encyclopedic knowledge of:

**AMERICAN ART POTTERY:**
- Roseville: Pattern ID (Futura, Pinecone, Sunflower), mark evolution
- Rookwood: Flame marks, date ciphers (1886-1960), artist signatures
- Weller: Louwelsa, Sicard, Hudson lines
- McCoy: NM marks, cookie jars, planters
- Hull: Little Red Riding Hood, Bow-Knot patterns
- Van Briggle: Dated marks (1901-1920 most valuable), Lorelei form
- Grueby: Matte green glazes, organic forms
- Newcomb College: Incised decoration, artist marks

**AMERICAN DINNERWARE:**
- Fiesta: Original 5 colors (red, cobalt, ivory, yellow, green), mark dating
- Bauer: Ring-ware, color identification
- Russel Wright: American Modern, Iroquois Casual

**EUROPEAN CERAMICS:**
- Meissen: Crossed swords marks (variations indicate date)
- Royal Copenhagen: Wave marks, Flora Danica (extremely valuable)
- Wedgwood: Jasperware (colors, quality), impressed marks
- Sèvres: Interlaced L's, date letters
- Limoges: Factory vs decorating studio marks

**ASIAN CERAMICS:**
- Chinese Export: Famille rose, famille verte, Canton, Nanking
- Japanese: Imari patterns, Satsuma, Kutani marks
- Reign marks vs apocryphal marks

**MARK ANALYSIS:**
- Backstamps: Printed, stamped, impressed
- Incised marks: Hand-carved
- Paper labels: Often lost
- Artist signatures`,

  glass: `You are a world-class GLASS expert with encyclopedic knowledge of:

**AMERICAN ART GLASS:**
- Tiffany: Favrile signatures (LCT, L.C.T. Favrile), iridescence quality, forms
- Steuben: Aurene (gold, blue), acid-etched signatures, Carder era
- Quezal: Similar to Tiffany, signed pieces
- Durand: King Tut pattern, Spider Webbing

**DEPRESSION GLASS (1920s-1940s):**
- Patterns: American Sweetheart, Cherry Blossom, Mayfair, Princess, Cameo
- Colors: Pink (most common), green, amber, cobalt, crystal
- Manufacturers: Anchor Hocking, Hazel Atlas, Jeannette, Federal

**CARNIVAL GLASS:**
- Patterns: Grape & Cable (Northwood), Orange Tree, Peacock at the Fountain
- Colors: Marigold (common), amethyst, green, blue, red (rare)
- Marks: Northwood N underlined, Fenton

**EUROPEAN GLASS:**
- Lalique: R. LALIQUE (early), Lalique France (later), frosted finishes
- Baccarat: Paperweights (millefiori, silhouette), stemware
- Murano/Venetian: Millefiori, latticino, sommerso techniques
- Czech/Bohemian: Cut glass, colored glass, Art Deco

**IDENTIFICATION POINTS:**
- Pontil marks: Rough (early), polished, fire-polished
- Mold seams and marks
- Signatures and acid stamps
- Weight, ring, and brilliance`,

  silver: `You are a world-class SILVER & METALWARE expert with encyclopedic knowledge of:

**STERLING SILVER (.925):**
- American makers: Gorham, Tiffany, Reed & Barton, Wallace, Kirk
- Pattern identification: Active vs discontinued, rare patterns
- Hollowware: Tea services, trays, bowls, candlesticks

**ENGLISH HALLMARKS:**
- Maker's mark (initials)
- Standard mark: Lion passant (sterling)
- Assay office: Leopard's head (London), anchor (Birmingham), crown (Sheffield)
- Date letter: Changes yearly, font and shield shape indicate year
- Monarch's head: Duty mark 1784-1890

**COIN SILVER (.900):**
- Early American silversmiths
- Regional makers
- Pseudo-hallmarks

**SILVERPLATE:**
- EPNS (Electroplated Nickel Silver)
- Quality designations: Triple, quadruple plate
- Manufacturers: Rogers, Meriden, Reed & Barton

**OTHER METALS:**
- Pewter: Touch marks, American vs English
- Bronze: Foundry marks, patina authenticity
- Copper: Arts & Crafts pieces (Roycroft, Stickley shops)

**VALUE FACTORS:**
- Weight (sterling), pattern rarity
- Condition: Monograms, repairs, replating
- Complete sets vs partial`,

  jewelry: `You are a world-class JEWELRY expert with encyclopedic knowledge of:

**PERIOD IDENTIFICATION:**
- Georgian (1714-1837): Closed-back settings, foil-backed stones, cannetille work
- Victorian: Early (romantic, serpents, hands), Mid (grand/mourning), Late (aesthetic)
- Edwardian (1901-1915): Platinum filigree, diamonds & pearls, lace-like
- Art Nouveau (1890-1910): Organic forms, enamel, plique-à-jour, Lalique
- Art Deco (1920-1935): Geometric, platinum, calibré-cut colored stones
- Retro (1935-1950): Bold rose gold, large colored stones, asymmetry

**HALLMARKS & MARKS:**
- Purity: 10K, 14K, 18K, 750, 585, 375, 925, PLAT, PT
- Maker's marks: Famous houses, regional makers
- Country marks and date letters (English)

**STONE IDENTIFICATION:**
- Diamond cuts: Old mine (cushion), old European (round), brilliant
- Setting styles: Bezel, prong, channel, pavé, invisible
- Quality indicators visible to the eye

**COSTUME JEWELRY:**
- High-end vintage: Miriam Haskell (unsigned early), Eisenberg, Weiss, Schiaparelli
- Designer: Chanel, Dior, Trifari (Crown mark), Coro
- Dating: © marks with years, construction methods

**AUTHENTICATION & FAKE DETECTION EXPERTISE:**

PRECIOUS METAL VERIFICATION:
- 10K/14K/18K stamps: Check with acid test or electronic tester
- 750 = 18K, 585 = 14K, 375 = 10K, 925 = Sterling
- Plating wear: Look for base metal showing through at edges
- Hallmarks: Research maker's marks against reference databases
- Weight: Precious metals have specific density feel
- Magnet test: Gold, silver, platinum are NOT magnetic

GEMSTONE AUTHENTICATION:
- Diamonds: Loupe for inclusions pattern (natural vs lab)
- Colored stones: Check for bubbles (glass), curved striae (flame fusion)
- Pearls: Tooth test (gritty = real, smooth = fake), weight (real heavier)
- Emeralds: Expect inclusions (jardin); too clean = synthetic or glass
- Rubies/Sapphires: Natural have silk inclusions; glass-filled are common

PERIOD JEWELRY AUTHENTICATION:
- Georgian: Hand-fabricated, foil-backed stones, cannetille work
- Victorian: Look for snake motifs (early), lockets, mourning jewelry
- Art Nouveau: Flowing organic forms, enamel work, plique-à-jour
- Art Deco: Geometric precision, calibré-cut stones, platinum filigree
- Retro: Bold rose gold, large stones, asymmetric designs

CLASP DATING:
- Barrel clasps: Pre-1900
- Hook & eye: Pre-1890
- Spring ring: 1900-present
- Lobster claw: 1970s-present
- Safety catch: Post-1900
- Tube hinges: Victorian and earlier

LUXURY BRAND AUTHENTICATION:
- Cartier: Serial numbers verifiable, specific box/papers
- Tiffany: Return to Tiffany hearts, T&Co stamps
- Van Cleef: Serial numbers on clasp, Alhambra clover details
- Bulgari: BVLGARI spelling, specific font

COSTUME JEWELRY AUTHENTICATION:
- Miriam Haskell: Wired construction, baroque pearls, Russian gold plating
- Eisenberg: Clear rhinestones, E mark or EISENBERG ORIGINAL
- Trifari: Crown mark (1930s+), quality rhinestones
- Weiss: Signed pieces, high-quality Austrian crystals

RED FLAGS (Fake Jewelry):
- Hallmarks in wrong location or wrong format
- Green discoloration on skin = base metal plating
- Lightweight for size = hollow or plated
- Glued stones (fine jewelry uses prongs/bezels)
- Spelling errors on designer marks
- Wrong font on hallmarks
- Stones that look too perfect (may be CZ or synthetic)
- Magnetic response (gold/silver/platinum aren't magnetic)
- Uniform wear patterns (real pieces wear unevenly)`,

  watches: `You are a world-class WATCHES & CLOCKS expert with encyclopedic knowledge of:

**LUXURY WATCHES:**
- Patek Philippe: Reference numbers, complications, value hierarchy
- Rolex: Model identification (Submariner, Daytona, Datejust), serial dating
- Omega: Speedmaster variants, Seamaster, Constellation
- Audemars Piguet: Royal Oak identification
- Cartier: Tank, Santos, Pasha

**VINTAGE & COLLECTIBLE:**
- Heuer: Pre-TAG chronographs (Carrera, Monaco, Autavia)
- Universal Genève: Compax, Tri-Compax
- Longines, LeCoultre, Hamilton

**AMERICAN POCKET WATCHES:**
- Railroad grade: Waltham, Elgin, Hamilton requirements
- Size, jewel count, adjustment markings
- Case materials: Gold, gold-filled, silver, nickel

**CLOCKS:**
- Tall case/Grandfather: American vs English, makers
- Mantel: French gilt bronze, American shelf clocks
- Wall: Vienna regulators, banjo (Willard), schoolhouse

**AUTHENTICATION & FAKE DETECTION EXPERTISE:**

ROLEX VERIFICATION (Critical - Highest Counterfeit Volume):
- Cyclops: MUST be 2.5x magnification, date fills window completely; fakes often 1.5x or less
- Crown logo: 3D coronet with 5 points, precise detail; fakes flat or poorly defined
- Case weight: Submariner ~155g, Datejust ~130g, GMT-Master II ~160g; fakes lighter
- Rehaut engraving: "ROLEX ROLEX ROLEX" laser-etched around dial edge (post-2007)
- Serial location: Between lugs at 6 o'clock (vintage) or on rehaut (post-2007)
- Movement: Cal. 3135/3235 with Geneva stripes, rose gold rotor; fakes have cheap movements
- Crystal: Authentic has green AR coating visible at angle (inner surface)
- Caseback: ALWAYS smooth for sport models; display back = FAKE (except Cellini)
- Bezel: 120 clicks for Submariner, 60 clicks for GMT; smooth action, no play
- Lume: SuperLuminova with even green glow; fakes have uneven or different color
- SEL (Solid End Links): No gap between case and bracelet on modern references
- Crown guards: Proportional to case, sharp edges; fakes often rounded or wrong size
- Date wheel: Font matches reference period, centered in window

OMEGA VERIFICATION:
- Serial format: 8 digits (modern), 7 digits (vintage); verify with production records
- Caseback medallion: Seahorse (Seamaster) or Observatory (Constellation)
- Co-Axial movement: Red "Co-Axial" text on rotor, specific finish patterns
- Font consistency: Same typeface across dial, date, bezel
- Speedmaster: "Professional" with manual wind; don't buy unseen movement

PATEK PHILIPPE VERIFICATION:
- Hallmarks: Geneva Seal until 2008, then Patek Philippe Seal
- Reference numbers: Verify format matches known references
- Caseback engravings: Laser-precision, specific depth
- Movement: Hand-finished to exceptional standard
- Papers: Essential for value; verify against Patek archives

CARTIER VERIFICATION:
- Secret signature: "Cartier" hidden in dial (usually at 7 or 10 o'clock)
- Case screws: Specific head shapes per model
- Blue hands: Must be actual blued steel or properly tinted

GENERAL WATCH RED FLAGS (Fakes):
- Spelling errors on dial or caseback
- Incorrect model/reference combinations
- Movement not matching claimed model
- Weight significantly off (use reference charts)
- Subdials misaligned or wrong position
- Cheap feeling crown, pusher, or clasp action
- Numerals or indices poorly applied
- Date window showing wrong font
- Cyclops not centered over date
- Misaligned rehaut engraving
- Exhibition caseback on model that never had one`,

  art: `You are a world-class ART & PRINTS expert with encyclopedic knowledge of:

**PAINTING ANALYSIS:**
- Signature identification: Location, style, period consistency
- Medium: Oil, watercolor, acrylic, gouache, pastel, mixed media
- Support: Canvas (weave, age), panel, paper
- Frame: Period-appropriate, later addition

**PRINT IDENTIFICATION:**
- Relief: Woodcut (raised lines), wood engraving (finer detail)
- Intaglio: Engraving (V-shaped lines), etching (softer), mezzotint, aquatint
- Planographic: Lithograph (crayon-like), silkscreen
- Photomechanical: Half-tone dots

**EDITION INFORMATION:**
- Numbering: Edition size, artist proofs (A/P, E/A)
- Signatures: Pencil (original), stamped, printed
- Publisher and printer marks

**PHOTOGRAPHY:**
- Process: Daguerreotype (mirror-like), ambrotype, tintype
- Paper prints: Albumen, platinum, silver gelatin
- Photographer identification

**PROVENANCE:**
- Gallery labels, exhibition stickers
- Collector marks
- Auction records

**AUTHENTICATION & FAKE DETECTION EXPERTISE:**

PAINTING AUTHENTICATION:
- Canvas age: Old canvas has irregular weave, natural fiber darkening
- Stretcher bars: Hand-cut (pre-1850), machine-cut (modern)
- Stretcher bar marks: Ghost lines from frame contact over decades
- Craquelure (fine cracks): Natural = irregular network; fake = uniform pattern
- Paint layer: Old oil paint has distinct brush stroke texture
- Signature analysis: Consistent with artist's known signatures; period-appropriate materials
- UV examination: Modern paint fluoresces differently than old paint
- Frame: Period-appropriate; old frames show wear consistent with age

PRINT AUTHENTICATION:
- Paper: Laid paper (handmade lines), wove paper (smooth), chain lines
- Watermarks: Research paper mill marks
- Plate marks: Intaglio prints have embossed plate edge
- Edition numbering: Must be consistent with known edition sizes
- Signature: Pencil signatures are hand-signed; printed signatures = reproduction
- Print quality: Original prints have crisp lines; reproductions may show dot patterns

PHOTOGRAPH AUTHENTICATION:
- Process identification: Daguerreotype (mirror surface), albumen (yellow-brown)
- Paper type: Fiber-based (pre-1970s), RC/resin-coated (modern)
- Stamp/signature: Period-appropriate placement and style
- Mount: Period-appropriate cardboard and design

SCULPTURE/3D AUTHENTICATION:
- Foundry marks: Research known foundries
- Edition numbers: Verify against catalogue raisonné
- Patina: Natural vs applied (chemical aging)
- Construction: Cast marks, welding style

RED FLAGS (Art Forgery):
- Craquelure in uniform pattern (artificial aging)
- Canvas threads too uniform (modern machine-made)
- Modern pigments in "old" painting (UV test)
- Signature looks hesitant or traced
- Provenance gaps or suspicious history
- Price too good for attributed artist
- Label/stamp appears artificially aged
- Paint over craquelure (later addition)
- Paper too white for claimed age
- Edition number higher than known edition size
- Multiple versions of "unique" work`,

  textiles: `You are a world-class TEXTILES & RUGS expert with encyclopedic knowledge of:

**ORIENTAL RUGS:**
- Persian/Iranian: Tabriz, Isfahan, Kashan, Kerman, Heriz (geometric), tribal
- Turkish: Oushak (soft colors), Hereke (fine silk), Kilim (flatweave)
- Caucasian: Kazak (bold), Shirvan, Kuba
- Chinese: Art Deco (Nichols), Peking, antique Ningxia

**RUG ANALYSIS:**
- Knot type: Persian/Senneh (asymmetric) vs Turkish/Ghiordes (symmetric)
- Knot density: KPSI (knots per square inch)
- Materials: Wool pile, cotton/silk foundation, silk pile
- Dyes: Natural (vegetable) vs synthetic (aniline, chrome)

**QUILTS:**
- Types: Pieced, appliqué, whole cloth, crazy quilts
- Patterns: Log Cabin, Double Wedding Ring, Star, Dresden Plate
- Regional: Amish (solid colors), Hawaiian, Baltimore Album
- Dating: Fabrics, batting type, quilting patterns

**VINTAGE CLOTHING & TEXTILES:**
- Labels: Union labels (help dating), designer labels
- Construction: Hand vs machine stitching
- Fabrics: Fiber identification, period-appropriate
- Condition: Stains, tears, moth damage`,

  toys: `You are a world-class TOYS & DOLLS expert with encyclopedic knowledge of:

**ANTIQUE TOYS:**
- Cast iron: Banks (mechanical, still), vehicles (Arcade, Hubley, Kenton)
- Tin lithograph: Wind-up, friction, German makers (Lehmann, Bing)
- Pressed steel: Buddy L, Keystone, Structo (larger vehicles)
- Die-cast: Dinky (British), Corgi, Matchbox, Hot Wheels (post-1968)

**MODEL TRAINS:**
- Lionel: Standard gauge (pre-1939), O gauge, postwar vs modern
- American Flyer: S gauge
- European: Märklin (German), Hornby (British)
- Condition: Original boxes multiply value

**DOLLS:**
- Bisque: French (Jumeau, Bru, Steiner - highest value), German (Kestner, Simon & Halbig)
- China head: 1840-1900, molded hair, painted features
- Composition: 1900-1950, painted features
- Barbie: #1 (1959, holes in feet), vintage accessories

**IDENTIFICATION:**
- Maker's marks and stamps
- Patent dates
- Original paint vs repaint (huge value difference)
- Completeness
- Original box (can double value)`,

  books: `You are a world-class BOOKS & EPHEMERA expert with encyclopedic knowledge of:

**FIRST EDITION IDENTIFICATION:**
- Publisher practices: Number lines, stated first editions
- Points: Specific textual variants identifying first printings
- Dust jackets: Present, condition, price-clipped

**VALUABLE CATEGORIES:**
- Modern first editions: Literature, mystery, science fiction
- Illustrated books: N.C. Wyeth, Rackham, Dulac
- Children's: Dr. Seuss, Sendak, Caldecott winners
- Americana: Early imprints, Western, travel

**CONDITION GRADING:**
- Fine, Near Fine, Very Good, Good, Fair, Poor
- Dust jacket: Same scale, plus price-clipped notation
- Ex-library indicators

**EPHEMERA:**
- Postcards: Real photo (RPPC), linen, chrome
- Trade cards: Victorian advertising
- Photographs: Process, subject matter
- Maps: Condition, hand-coloring
- Autographs: Authentication concerns

**PROVENANCE:**
- Bookplates
- Inscriptions
- Association copies`,

  tools: `You are a world-class TOOLS & SCIENTIFIC INSTRUMENTS expert with encyclopedic knowledge of:

**HAND TOOLS:**
- Stanley planes: Type study (type 1-20), rare models (#1, #2, specialty)
- Wooden planes: American vs European, makers (Ohio Tool, Sandusky)
- Edge tools: Chisels, axes, drawknives, spokeshaves
- Measuring: Folding rules (ivory, boxwood), levels, squares

**SCIENTIFIC INSTRUMENTS:**
- Surveying: Transits, theodolites, compasses, chains
- Navigation: Sextants, octants, ship's compasses
- Medical: Surgical sets, dental instruments, microscopes
- Optical: Telescopes, microscopes, cameras

**IDENTIFICATION:**
- Maker's marks
- Patent dates
- Materials: Rosewood, boxwood, brass, ivory
- Completeness (cases, accessories)
- Working condition

**VALUE FACTORS:**
- Maker reputation
- Rarity
- Condition (user grade vs collector grade)
- Completeness`,

  lighting: `You are a world-class LIGHTING expert with encyclopedic knowledge of:

**ART GLASS LAMPS:**
- Tiffany Studios: Shade patterns, base designs, signatures, authenticity
- Handel: Reverse-painted shades (landscape, floral), signatures
- Pairpoint: Puffy shades (blown-out), reverse painted
- Jefferson, Phoenix, Pittsburgh Lamp Company

**ANTIQUE LIGHTING:**
- Oil lamps: Whale oil (single burner), kerosene (chimney), Argand
- Gas fixtures: Victorian, converted vs unconverted
- Early electric: Carbon filament bulbs, original wiring

**CHANDELIERS:**
- Crystal: Baccarat, Waterford, Bohemian
- Bronze: French Empire, Victorian
- Art glass: Murano, Art Deco

**IDENTIFICATION:**
- Base and shade matching (married pieces less valuable)
- Signatures and marks
- Hardware: Original vs replacement
- Wiring: Safety consideration, period indicators

**AUTHENTICATION:**
- Tiffany: Lead lines, glass selection, patina
- Handel: Paint quality, signature placement
- Reproductions: Taiwan copies common`,

  electronics: `You are an expert at identifying modern ELECTRONICS:

**CATEGORIES:**
- Computers & tablets
- Smartphones
- Cameras & photography
- Audio equipment
- Gaming consoles & accessories
- Home appliances

**IDENTIFICATION:**
- Brand and exact model
- Generation/version
- Storage/memory variants
- Color variants
- Regional variants

**VALUE FACTORS:**
- Working condition
- Cosmetic condition
- Original packaging
- Included accessories
- Firmware/software version`,

  vehicles: `You are an expert at identifying VEHICLES:

**AUTOMOBILES:**
- Make, model, year
- Trim level and options
- VIN decode indicators
- Matching numbers (classics)
- Modifications

**MOTORCYCLES:**
- Make, model, year
- Engine size
- Special editions

**BICYCLES:**
- Vintage: Schwinn, Raleigh, French racing
- Modern: Brand and model

**CONDITION:**
- Body/frame
- Interior
- Mechanical
- Documentation`,

  general: `You are a knowledgeable expert at identifying a wide variety of items.

Analyze this item considering:
- What it is (specific identification)
- Who made it (maker/manufacturer)
- When it was made (era/period)
- Where it was made (origin)
- Current condition
- Market value
- Historical or cultural significance

Provide as specific an identification as possible based on visible evidence.`,
};

// ============================================================================
// STAGE 1: SMART TRIAGE
// ============================================================================

async function performTriage(imageBase64: string): Promise<z.infer<typeof TriageSchema>> {
  console.log('🔍 Stage 1: Smart Triage - Categorizing item...');

  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'system',
        content: `You are an expert at categorizing items for specialized analysis.

DETERMINE:
1. **Category**:
   - "antique": Pre-1920, shows age/patina, historical craftsmanship
   - "vintage": 1920-1990, retro aesthetic, collectible
   - "modern_branded": Post-1990 with clear brand identity
   - "modern_generic": Post-1990 without clear branding

2. **Domain Expert** (which specialist should analyze):
   - furniture: Tables, chairs, cabinets, case pieces, seating
   - ceramics: Pottery, porcelain, stoneware, dinnerware
   - glass: Art glass, depression glass, carnival glass, stemware
   - silver: Sterling, silverplate, pewter, metalware
   - jewelry: Fine jewelry, costume jewelry, gemstones
   - watches: Wristwatches, pocket watches, clocks
   - art: Paintings, prints, sculptures, photographs
   - textiles: Rugs, quilts, vintage clothing, tapestries
   - toys: Antique toys, dolls, trains, collectibles
   - books: Rare books, first editions, ephemera
   - tools: Hand tools, scientific instruments
   - lighting: Lamps, chandeliers, fixtures
   - electronics: Modern tech devices
   - vehicles: Cars, motorcycles, bicycles
   - general: Everything else

3. **Quality Tier**:
   - museum: Exceptional, museum-quality piece
   - high: Fine quality, significant value
   - mid: Good quality, collectible
   - low: Common, utilitarian
   - unknown: Cannot determine

CRITICAL: Read ALL text visible in the image including:
- Brand names, logos, model numbers
- Labels, stickers, engravings
- Serial numbers, part numbers
- Any printed or embossed text

Respond in JSON:
{
  "category": "antique" | "vintage" | "modern_branded" | "modern_generic",
  "domainExpert": "furniture" | "ceramics" | etc.,
  "itemType": "Specific item type (e.g., 'dining chair', 'art pottery vase')",
  "estimatedEra": "Time period or null",
  "qualityTier": "museum" | "high" | "mid" | "low" | "unknown",
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of categorization",
  "visibleBranding": "Any visible brand/maker or null",
  "visibleModelNumber": "Any visible model number/ID or null",
  "allVisibleText": ["Array of ALL text visible in image"]
}`,
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Categorize this item for expert analysis. IMPORTANT: Read and report ALL visible text including model numbers, labels, and engravings:' },
          { type: 'image_url', image_url: { url: imageBase64, detail: 'high' } },
        ],
      },
    ],
    max_completion_tokens: 600,
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new ExternalServiceError('No triage response', 'OpenAI');

  const validated = TriageSchema.parse(safeJsonParse(content, 'triage'));
  console.log(`📦 Category: ${validated.category}`);
  console.log(`🎯 Domain Expert: ${validated.domainExpert}`);
  console.log(`📊 Quality Tier: ${validated.qualityTier}`);
  console.log(`🕐 Era: ${validated.estimatedEra || 'Unknown'}`);

  return validated;
}

// ============================================================================
// STAGE 2: FORENSIC EVIDENCE EXTRACTION
// ============================================================================

async function extractEvidence(
  imageBase64: string,
  triage: z.infer<typeof TriageSchema>
): Promise<z.infer<typeof EvidenceSchema>> {
  console.log('🔬 Stage 2: Forensic Evidence Extraction...');

  const domainPrompt = DOMAIN_EXPERT_PROMPTS[triage.domainExpert];

  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'system',
        content: `${domainPrompt}

---

YOUR TASK: Extract ALL observable evidence from this ${triage.itemType}.

## CRITICAL: DOCUMENT EVERYTHING VISIBLE

**VISIBLE TEXT & MARKS:**
- Read and transcribe ALL text (labels, stamps, signatures, model numbers)
- Note exact location of each
- Categorize as one of: maker_mark, model_number, label, signature, stamp, title, author, publisher, isbn, edition, vin, license_plate, engine_number, serial_number, barcode, upc, sku, artist_signature, gallery_label, provenance_label, date, price_tag, inventory_number, other
- Rate confidence in reading

**MAKER INDICATORS:**
- Any identified maker/manufacturer
- Type of mark (paper label, impressed, stamped, branded, incised)
- Location of mark
- Confidence level

**CONSTRUCTION:**
- Materials used (wood species, metal type, fabric, etc.)
- Construction techniques visible
- Quality indicators
- Age indicators (wear patterns, oxidation, patina)

**CONDITION:**
- Overall condition (mint/excellent/good/fair/poor)
- Specific issues (chips, cracks, repairs, missing parts)
- Evidence of restoration
- Originality notes (original finish? replaced parts?)

**DISTINCTIVE FEATURES:**
- Unique identifying characteristics
- Design elements
- Unusual features

**RED FLAGS:**
- Warning signs (reproductions, marriages, heavy restoration)
- Inconsistencies
- Signs of fakery

Respond in JSON:
{
  "visibleText": [
    {"text": "exact text", "location": "where", "type": "maker_mark|model_number|label|signature|stamp|title|author|publisher|isbn|serial_number|barcode|artist_signature|date|price_tag|other", "confidence": 0.0-1.0}
  ],
  "makerIndicators": {
    "makerName": "identified maker or null",
    "markType": "type of mark or null",
    "markLocation": "where the mark is or null",
    "confidence": 0.0-1.0
  },
  "construction": {
    "materials": ["identified materials"],
    "techniques": ["construction methods observed"],
    "qualityIndicators": ["signs of quality or lack thereof"],
    "ageIndicators": ["evidence of age/period"]
  },
  "condition": {
    "overall": "mint|excellent|good|fair|poor",
    "issues": ["specific problems"],
    "restorations": ["evidence of repair/restoration"],
    "originalityNotes": ["notes on original vs replaced"]
  },
  "distinctiveFeatures": ["unique identifying features"],
  "redFlags": ["warning signs or concerns"]
}`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Extract ALL evidence from this ${triage.itemType}.

CRITICAL PRIORITY:
1. READ ALL VISIBLE TEXT - model numbers, serial numbers, brand names, labels, stickers, engravings
2. Look at EVERY surface for text including undersides, backs, labels
3. If you see partial text, report what you can read
4. Report the EXACT text you see, character by character

Every detail matters for precise identification and valuation.`,
          },
          { type: 'image_url', image_url: { url: imageBase64, detail: 'high' } },
        ],
      },
    ],
    max_completion_tokens: 2500,
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new ExternalServiceError('No evidence response', 'OpenAI');

  const validated = EvidenceSchema.parse(safeJsonParse(content, 'evidence'));

  console.log(`📋 Found ${validated.visibleText.length} text elements`);
  console.log(`📋 Maker: ${validated.makerIndicators.makerName || 'Unknown'}`);
  console.log(`📋 Condition: ${validated.condition.overall}`);
  if (validated.redFlags.length > 0) {
    console.log(`⚠️ Red flags: ${validated.redFlags.join(', ')}`);
  }

  return validated;
}

// ============================================================================
// STAGE 3: CANDIDATE GENERATION
// ============================================================================

async function generateCandidates(
  imageBase64: string,
  triage: z.infer<typeof TriageSchema>,
  evidence: z.infer<typeof EvidenceSchema>
): Promise<z.infer<typeof CandidateSchema>[]> {
  console.log('🎯 Stage 3: Generating identification candidates...');

  const domainPrompt = DOMAIN_EXPERT_PROMPTS[triage.domainExpert];

  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'system',
        content: `${domainPrompt}

---

Based on the extracted evidence, generate the TOP 3 most likely identifications.

## EXTRACTED EVIDENCE:
${JSON.stringify(evidence, null, 2)}

## ITEM CONTEXT:
- Category: ${triage.category}
- Item Type: ${triage.itemType}
- Era: ${triage.estimatedEra || 'Unknown'}
- Quality Tier: ${triage.qualityTier}

## YOUR TASK:
Generate 3 candidates with supporting evidence.

## CONFIDENCE CALIBRATION:
- 0.95+: Maker's mark clearly visible and matches known examples
- 0.85-0.94: Strong construction/style evidence, consistent with known maker
- 0.70-0.84: Style/period identified, maker narrowed to possibilities
- 0.50-0.69: General identification solid, specifics uncertain
- <0.50: Best guess based on limited evidence

## VALUE ESTIMATION:
Provide realistic market values based on:
- Recent auction results
- Dealer prices
- Online marketplace (eBay sold, 1stDibs, Chairish)
- Condition adjustment

Respond in JSON:
{
  "candidates": [
    {
      "rank": 1,
      "identification": "Full specific identification (e.g., 'Gustav Stickley #354 Dining Chair')",
      "maker": "Maker/manufacturer name or null",
      "model": "Model/pattern name or null",
      "period": "Date range (e.g., '1905-1912')",
      "confidence": 0.0-1.0,
      "evidenceFor": ["evidence supporting this ID"],
      "evidenceAgainst": ["evidence that doesn't match or is uncertain"],
      "valueEstimate": {
        "low": minimum_USD,
        "high": maximum_USD,
        "basis": "How value was estimated (auction results, dealer prices, etc.)"
      }
    }
  ]
}`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Generate the top 3 identification candidates with evidence and values:',
          },
          { type: 'image_url', image_url: { url: imageBase64, detail: 'high' } },
        ],
      },
    ],
    max_completion_tokens: 2500,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new ExternalServiceError('No candidates response', 'OpenAI');

  const parsed = safeJsonParse(content, 'candidates') as { candidates?: unknown[] };
  const candidates = z.array(CandidateSchema).parse(parsed.candidates || []);

  for (const c of candidates) {
    console.log(`   #${c.rank}: ${c.identification} (${Math.round(c.confidence * 100)}%)`);
    if (c.valueEstimate.low && c.valueEstimate.high) {
      console.log(`       Value: $${c.valueEstimate.low} - $${c.valueEstimate.high}`);
    }
  }

  return candidates;
}

// ============================================================================
// STAGE 4: FINAL ANALYSIS WITH DEAL & FLIP ASSESSMENT
// ============================================================================

async function generateFinalAnalysis(
  imageBase64: string,
  triage: z.infer<typeof TriageSchema>,
  evidence: z.infer<typeof EvidenceSchema>,
  candidates: z.infer<typeof CandidateSchema>[],
  askingPrice?: number
): Promise<WorldClassResult> {
  console.log('✨ Stage 4: Generating final analysis with deal assessment...');

  const topCandidate = candidates[0];
  const alternatives = candidates.slice(1);

  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'system',
        content: `You are finalizing a world-class antique/collectible analysis.

## TOP CANDIDATE:
${JSON.stringify(topCandidate, null, 2)}

## ALTERNATIVES:
${JSON.stringify(alternatives, null, 2)}

## EXTRACTED EVIDENCE:
${JSON.stringify(evidence, null, 2)}

## TRIAGE DATA:
${JSON.stringify(triage, null, 2)}

${askingPrice ? `## ASKING PRICE: $${askingPrice / 100}` : ''}

## YOUR TASK:
Generate a comprehensive analysis including:

1. **Identification** - Confirm or refine the top candidate
2. **Historical Context** - Rich narrative about this piece, maker, period, significance
3. **Valuation** - Market value estimate with reasoning
4. **Comparable Sales** - Reference recent sales of similar items
5. **Verification Tips** - What buyer should check/verify before purchasing
6. **Red Flags** - Any concerns about authenticity, condition, value
7. **Resale Assessment** - How easy to flip, where to sell, timeline
${askingPrice ? '8. **Deal Analysis** - Is this asking price a good deal?' : ''}

## DEAL RATING (if asking price provided):
- "exceptional": 50%+ below market value - incredible find
- "good": 20-50% below market - solid deal
- "fair": Within 20% of market - reasonable price
- "overpriced": Above market value - pass or negotiate

## FLIP DIFFICULTY:
- "easy": High demand, quick sale (2-4 weeks)
- "moderate": Decent demand, moderate timeline (1-3 months)
- "hard": Niche market, longer timeline (3-6 months)
- "very_hard": Very specialized, may take 6+ months

Respond in JSON:
{
  "name": "Full specific name",
  "maker": "Maker name or null",
  "modelNumber": "Model/pattern or null",
  "brand": "Brand (same as maker for antiques) or null",

  "productCategory": "${triage.category}",
  "domainExpert": "${triage.domainExpert}",
  "itemSubcategory": "Specific subcategory",

  "era": "Period (e.g., 'Arts & Crafts, c. 1905-1912')",
  "style": "Style/movement",
  "periodStart": year_number_or_null,
  "periodEnd": year_number_or_null,
  "originRegion": "Geographic origin",

  "description": "2-3 sentence physical description highlighting identifying features",
  "historicalContext": "3-4 paragraphs of rich historical narrative",
  "attributionNotes": "Notes on maker attribution confidence",

  "estimatedValueMin": USD_integer,
  "estimatedValueMax": USD_integer,
  "currentRetailPrice": null,

  "comparableSales": [
    {"description": "Similar item sold", "venue": "Auction house/dealer", "price": USD, "date": "Month Year", "relevance": "Why relevant"}
  ],

  "confidence": final_confidence_0_to_1,
  "identificationConfidence": identification_confidence,
  "makerConfidence": maker_attribution_confidence,
  "evidenceFor": ["supporting evidence"],
  "evidenceAgainst": ["contradicting or uncertain evidence"],

  "alternativeCandidates": [
    {"name": "Alternative ID", "confidence": score, "reason": "Why possible"}
  ],

  "verificationTips": ["What to check before buying"],
  "redFlags": ["Concerns or warnings"],

  "flipDifficulty": "easy" | "moderate" | "hard" | "very_hard",
  "flipTimeEstimate": "2-4 weeks" | "1-3 months" | etc.,
  "resaleChannels": ["Best places to sell"],

  "stylingSuggestions": [
    {
      "title": "Interior design suggestion",
      "description": "Details",
      "roomType": "Room",
      "complementaryItems": ["items"],
      "colorPalette": ["#hex"]
    }
  ]
}`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Generate the final comprehensive analysis${askingPrice ? ` with deal assessment for asking price $${askingPrice / 100}` : ''}:`,
          },
          { type: 'image_url', image_url: { url: imageBase64, detail: 'high' } },
        ],
      },
    ],
    max_completion_tokens: 4000,
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new ExternalServiceError('No final analysis response', 'OpenAI');

  const analysis = WorldClassAnalysisSchema.parse(safeJsonParse(content, 'final-analysis'));

  // Calculate deal analysis if asking price provided
  // Note: askingPrice is in cents, estimatedValueMin/Max are in dollars
  let dealAnalysis: Partial<WorldClassResult> = {};
  if (askingPrice && analysis.estimatedValueMin && analysis.estimatedValueMax) {
    const marketMid = (analysis.estimatedValueMin + analysis.estimatedValueMax) / 2;

    // Guard against division by zero
    if (marketMid <= 0) {
      console.warn('⚠️ Market value is zero or negative, skipping deal analysis');
    } else {
      // Convert asking price from cents to dollars for comparison
      const askingDollars = askingPrice / 100;
      const percentOfMarket = (askingDollars / marketMid) * 100;

      let dealRating: DealRating;
      let dealExplanation: string;

      if (percentOfMarket <= 50) {
        dealRating = 'exceptional';
        dealExplanation = `At $${askingDollars.toLocaleString()}, this is ${Math.round(100 - percentOfMarket)}% below market value ($${marketMid.toLocaleString()}). Exceptional find - buy immediately if authentic.`;
      } else if (percentOfMarket <= 80) {
        dealRating = 'good';
        dealExplanation = `At $${askingDollars.toLocaleString()}, this is ${Math.round(100 - percentOfMarket)}% below market value ($${marketMid.toLocaleString()}). Solid deal with good profit potential.`;
      } else if (percentOfMarket <= 120) {
        dealRating = 'fair';
        dealExplanation = `At $${askingDollars.toLocaleString()}, this is within market range ($${analysis.estimatedValueMin.toLocaleString()}-$${analysis.estimatedValueMax.toLocaleString()}). Fair price if you want the item for your collection.`;
      } else {
        dealRating = 'overpriced';
        dealExplanation = `At $${askingDollars.toLocaleString()}, this is ${Math.round(percentOfMarket - 100)}% above market value ($${marketMid.toLocaleString()}). Consider negotiating or passing.`;
      }

      // Calculate profit potential in dollars (can be negative for overpriced items)
      const profitMin = analysis.estimatedValueMin - askingDollars;
      const profitMax = analysis.estimatedValueMax - askingDollars;

      dealAnalysis = {
        askingPrice,
        dealRating,
        dealExplanation,
        // Show actual profit/loss - negative means potential loss
        profitPotentialMin: Math.round(profitMin),
        profitPotentialMax: Math.round(profitMax),
      };
    }
  }

  return { ...analysis, ...dealAnalysis };
}

// ============================================================================
// STAGE 5: AUTHENTICATION ANALYSIS
// ============================================================================

// High-risk categories for counterfeiting
const HIGH_COUNTERFEIT_RISK: Record<string, AuthenticityRisk> = {
  watches: 'very_high',   // Luxury watches are most counterfeited
  jewelry: 'high',        // Fine jewelry commonly faked
  art: 'high',            // Art forgery is prevalent
  silver: 'medium',       // Sterling marks can be forged
  ceramics: 'medium',     // Marks can be added to reproductions
  furniture: 'medium',    // Reproductions and marriages common
  glass: 'medium',        // Art glass reproductions exist
  textiles: 'low',        // Rugs sometimes misattributed
  toys: 'low',            // Reproductions of tin toys exist
  books: 'low',           // First edition fraud less common
  tools: 'low',           // Rarely counterfeited
  lighting: 'medium',     // Tiffany reproductions common
  electronics: 'low',     // Mostly genuine but may be refurbished
  vehicles: 'low',        // VIN fraud rare
  general: 'low',
};

async function generateAuthenticationAnalysis(
  imageBase64: string,
  triage: z.infer<typeof TriageSchema>,
  evidence: z.infer<typeof EvidenceSchema>,
  analysis: WorldClassResult
): Promise<AuthenticationAnalysis> {
  console.log('🔐 Stage 5: Authentication Analysis...');

  const domainPrompt = DOMAIN_EXPERT_PROMPTS[triage.domainExpert];
  const baseRisk = HIGH_COUNTERFEIT_RISK[triage.domainExpert] || 'low';

  // Determine if this specific item has elevated risk
  const isLuxuryBrand = analysis.maker?.toLowerCase().match(
    /rolex|patek|omega|cartier|tiffany|louis vuitton|hermes|chanel|audemars|vacheron|breguet/
  );
  const isHighValue = (analysis.estimatedValueMax || 0) > 5000;
  const hasRedFlags = (analysis.redFlags?.length || 0) > 0;

  let adjustedRisk = baseRisk;
  if (isLuxuryBrand || isHighValue) {
    if (baseRisk === 'low') adjustedRisk = 'medium';
    else if (baseRisk === 'medium') adjustedRisk = 'high';
    else if (baseRisk === 'high') adjustedRisk = 'very_high';
  }
  if (hasRedFlags && adjustedRisk !== 'very_high') {
    const riskOrder: AuthenticityRisk[] = ['low', 'medium', 'high', 'very_high'];
    const currentIndex = riskOrder.indexOf(adjustedRisk);
    adjustedRisk = riskOrder[Math.min(currentIndex + 1, 3)];
  }

  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'system',
        content: `${domainPrompt}

---

You are now performing an AUTHENTICATION ANALYSIS for this item.

## IDENTIFIED ITEM:
- Name: ${analysis.name}
- Maker: ${analysis.maker || 'Unknown'}
- Era: ${analysis.era || 'Unknown'}
- Value Range: $${analysis.estimatedValueMin || 0} - $${analysis.estimatedValueMax || 0}
- Domain: ${triage.domainExpert}
- Base Counterfeit Risk: ${adjustedRisk}

## EXTRACTED EVIDENCE:
${JSON.stringify(evidence, null, 2)}

## YOUR TASK:
Generate a comprehensive authentication analysis with:

1. **Authentication Confidence** (0.0-1.0): How confident are you this is AUTHENTIC (not a fake/reproduction)?
   - 0.95+: Clear maker marks, construction consistent, no red flags
   - 0.80-0.94: Most indicators positive, minor uncertainties
   - 0.60-0.79: Some concerns, additional verification recommended
   - 0.40-0.59: Significant concerns, expert examination needed
   - <0.40: Likely fake/reproduction, major red flags

2. **Domain-Specific Checklist**: Generate 5-8 authentication checks specific to this item type
   - Each check should have clear instructions
   - Include what to look for (authentic) vs red flags (fake)
   - Mark priority: critical/important/helpful
   - Note if requires expert or if photo would help

3. **Known Fake Indicators**: What do fakes/reproductions of THIS specific item typically show?

4. **Additional Photos Needed**: What specific photos would help verify authenticity?
   - Be specific: "caseback close-up", "signature detail", "construction underneath"

5. **Expert Referral**: Should a professional authentication be recommended?

Respond in JSON:
{
  "authenticationConfidence": 0.0-1.0,
  "authenticityRisk": "${adjustedRisk}",
  "checklist": [
    {
      "id": "unique-id-1",
      "category": "visual" | "physical" | "documentation" | "provenance",
      "priority": "critical" | "important" | "helpful",
      "check": "What to verify (e.g., 'Cyclops magnification')",
      "howTo": "How to perform the check",
      "whatToLookFor": "Signs of authenticity",
      "redFlagSigns": ["Signs of fake 1", "Signs of fake 2"],
      "requiresExpert": boolean,
      "photoHelpful": boolean
    }
  ],
  "knownFakeIndicators": [
    "What fakes of this item type typically show"
  ],
  "photosRequested": [
    {
      "id": "photo-1",
      "area": "Specific area (e.g., 'caseback', 'signature', 'joints')",
      "reason": "Why this photo helps authentication",
      "whatToCapture": "Specific instructions for the photo",
      "priority": "required" | "recommended" | "optional"
    }
  ],
  "expertReferralRecommended": boolean,
  "expertReferralReason": "Why expert is recommended or null",
  "overallAssessment": "2-3 sentence summary of authentication status and key concerns"
}`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Generate authentication analysis for this ${analysis.name}. Provide domain-specific checks that a buyer should perform to verify authenticity.`,
          },
          { type: 'image_url', image_url: { url: imageBase64, detail: 'high' } },
        ],
      },
    ],
    max_completion_tokens: 3000,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new ExternalServiceError('No authentication response', 'OpenAI');

  const authAnalysis = AuthenticationAnalysisSchema.parse(safeJsonParse(content, 'authentication'));

  console.log(`🔐 Authentication Confidence: ${Math.round(authAnalysis.authenticationConfidence * 100)}%`);
  console.log(`⚠️ Risk Level: ${authAnalysis.authenticityRisk}`);
  console.log(`📋 Checklist Items: ${authAnalysis.checklist.length}`);
  console.log(`📸 Photos Requested: ${authAnalysis.photosRequested.length}`);
  if (authAnalysis.expertReferralRecommended) {
    console.log(`👨‍🔬 Expert Referral: Recommended`);
  }

  return authAnalysis;
}

// ============================================================================
// EVENT EMITTER TYPE FOR SSE STREAMING
// ============================================================================

export type AnalysisEventEmitter = (event: {
  type: string;
  stage?: string;
  message?: string;
  progress?: number;
  data?: unknown;
}) => void;

// ============================================================================
// MAIN ORCHESTRATOR - OPTIMIZED WITH PARALLEL EXECUTION
// ============================================================================

export async function analyzeAntiqueImage(
  imageBase64: string,
  askingPrice?: number,
  emitEvent?: AnalysisEventEmitter
): Promise<WorldClassResult> {
  const emit = emitEvent || (() => {}); // No-op if no emitter

  try {
    // Validate image format
    if (!imageBase64.startsWith('data:image/')) {
      throw new ValidationError('Invalid image format. Must be a data URL.');
    }

    // Prevent SVG (potential XSS vector) and other non-image formats
    const allowedFormats = ['data:image/jpeg', 'data:image/png', 'data:image/gif', 'data:image/webp'];
    const hasAllowedFormat = allowedFormats.some(format => imageBase64.startsWith(format));
    if (!hasAllowedFormat) {
      throw new ValidationError('Unsupported image format. Please use JPEG, PNG, GIF, or WebP.');
    }

    // Validate image size (max 30MB base64 = ~22MB raw)
    const MAX_BASE64_SIZE = 30 * 1024 * 1024; // 30MB
    if (imageBase64.length > MAX_BASE64_SIZE) {
      throw new ValidationError(`Image too large. Maximum size is approximately 22MB. Your image is approximately ${Math.round(imageBase64.length / 1024 / 1024 * 0.75)}MB.`);
    }

    const startTime = Date.now();
    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🏺 VINTAGEVISION v5.1 - OPTIMIZED PARALLEL PIPELINE (GPT-5.2)');
    console.log('════════════════════════════════════════════════════════════════');
    if (askingPrice) {
      console.log(`💰 Asking Price: $${askingPrice / 100}`);
    }

    // ========== STAGE 1: TRIAGE (Required first - determines expert domain) ==========
    emit({ type: 'stage:start', stage: 'triage', message: 'Identifying item category...', progress: 5 });
    const triage = await performTriage(imageBase64);
    emit({
      type: 'stage:complete',
      stage: 'triage',
      message: 'Category identified',
      progress: 20,
      data: {
        category: triage.category,
        domain: triage.domainExpert,
        itemType: triage.itemType,
        era: triage.estimatedEra,
        quality: triage.qualityTier,
      },
    });

    // ========== STAGES 2+3: PARALLEL EXECUTION ==========
    // Evidence extraction and candidate generation can run in parallel
    // since both only need triage data, not each other
    console.log('⚡ Running Evidence + Candidates in PARALLEL...');
    emit({ type: 'stage:start', stage: 'evidence', message: 'Examining maker marks and details...', progress: 25 });
    emit({ type: 'stage:start', stage: 'candidates', message: 'Matching against knowledge base...', progress: 25 });

    const [evidence, candidates] = await Promise.all([
      extractEvidence(imageBase64, triage),
      generateCandidatesParallel(imageBase64, triage), // Use parallel-safe version
    ]);

    emit({
      type: 'stage:complete',
      stage: 'evidence',
      message: 'Evidence extracted',
      progress: 45,
      data: {
        maker: evidence.makerIndicators.makerName,
        condition: evidence.condition.overall,
        textFound: evidence.visibleText.length,
        redFlags: evidence.redFlags.length,
      },
    });

    emit({
      type: 'stage:complete',
      stage: 'candidates',
      message: `Found ${candidates.length} candidates`,
      progress: 50,
      data: candidates.slice(0, 3).map(c => ({
        name: c.identification,
        confidence: c.confidence,
        value: c.valueEstimate,
      })),
    });

    if (candidates.length === 0) {
      throw new ExternalServiceError('Could not generate identification candidates', 'OpenAI');
    }

    // ========== STAGE 4: COMBINED FINAL ANALYSIS + AUTHENTICATION ==========
    // These are combined into a single API call for efficiency
    emit({ type: 'stage:start', stage: 'analysis', message: 'Generating comprehensive analysis...', progress: 55 });

    const fullResult = await generateCombinedAnalysis(
      imageBase64,
      triage,
      evidence,
      candidates,
      askingPrice
    );

    emit({
      type: 'stage:complete',
      stage: 'analysis',
      message: 'Analysis complete',
      progress: 95,
      data: {
        name: fullResult.name,
        maker: fullResult.maker,
        confidence: fullResult.confidence,
        authConfidence: fullResult.authenticationConfidence,
        valueMin: fullResult.estimatedValueMin,
        valueMax: fullResult.estimatedValueMax,
      },
    });

    // ========== COMPLETE ==========
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    emit({ type: 'complete', progress: 100, data: fullResult });

    console.log('');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`✅ ANALYSIS COMPLETE in ${totalTime}s (optimized pipeline)`);
    console.log(`   Item: ${fullResult.name}`);
    if (fullResult.maker) console.log(`   Maker: ${fullResult.maker}`);
    console.log(`   Era: ${fullResult.era || 'Unknown'}`);
    console.log(`   ID Confidence: ${Math.round(fullResult.confidence * 100)}%`);
    console.log(`   Auth Confidence: ${Math.round((fullResult.authenticationConfidence || 0) * 100)}%`);
    console.log(`   Risk Level: ${fullResult.authenticityRisk || 'Unknown'}`);
    if (fullResult.estimatedValueMin && fullResult.estimatedValueMax) {
      console.log(`   Value: $${fullResult.estimatedValueMin} - $${fullResult.estimatedValueMax}`);
    }
    if (fullResult.dealRating) {
      const emoji = fullResult.dealRating === 'exceptional' ? '🔥' :
                    fullResult.dealRating === 'good' ? '✅' :
                    fullResult.dealRating === 'fair' ? '➖' : '❌';
      console.log(`   ${emoji} Deal Rating: ${fullResult.dealRating.toUpperCase()}`);
    }
    if (fullResult.flipDifficulty) {
      console.log(`   Flip: ${fullResult.flipDifficulty} (${fullResult.flipTimeEstimate})`);
    }
    if (fullResult.expertReferralRecommended) {
      console.log(`   ⚠️ EXPERT REFERRAL RECOMMENDED`);
    }
    console.log('════════════════════════════════════════════════════════════════');
    console.log('');

    return fullResult;
  } catch (error) {
    emit({ type: 'error', message: error instanceof Error ? error.message : 'Analysis failed' });

    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', JSON.stringify(error.errors, null, 2));
      throw new ValidationError('Analysis result validation failed');
    }

    if (error instanceof OpenAI.APIError) {
      console.error('❌ OpenAI API error:', error.message);
      throw new ExternalServiceError(`OpenAI API error: ${error.message}`, 'OpenAI');
    }

    throw error;
  }
}

// ============================================================================
// PARALLEL-SAFE CANDIDATE GENERATION (doesn't need evidence)
// ============================================================================

async function generateCandidatesParallel(
  imageBase64: string,
  triage: z.infer<typeof TriageSchema>
): Promise<z.infer<typeof CandidateSchema>[]> {
  console.log('🎯 Stage 3 (Parallel): Generating identification candidates...');

  const domainPrompt = DOMAIN_EXPERT_PROMPTS[triage.domainExpert];

  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'system',
        content: `${domainPrompt}

---

Based on visual analysis, generate the TOP 3 most likely identifications.

## ITEM CONTEXT:
- Category: ${triage.category}
- Item Type: ${triage.itemType}
- Era: ${triage.estimatedEra || 'Unknown'}
- Quality Tier: ${triage.qualityTier}
- Visible Branding: ${triage.visibleBranding || 'None'}
- Visible Model: ${triage.visibleModelNumber || 'None'}
- All Visible Text: ${triage.allVisibleText?.join(', ') || 'None'}

## YOUR TASK:
Generate 3 candidates with supporting evidence. Look closely at the image for:
- Maker marks, logos, signatures
- Model numbers, serial numbers
- Construction details
- Style/period indicators

## CONFIDENCE CALIBRATION:
- 0.95+: Maker's mark clearly visible and matches known examples
- 0.85-0.94: Strong construction/style evidence, consistent with known maker
- 0.70-0.84: Style/period identified, maker narrowed to possibilities
- 0.50-0.69: General identification solid, specifics uncertain
- <0.50: Best guess based on limited evidence

## VALUE ESTIMATION:
Provide realistic market values based on recent auction results, dealer prices, online marketplaces.

Respond in JSON:
{
  "candidates": [
    {
      "rank": 1,
      "identification": "Full specific identification",
      "maker": "Maker name or null",
      "model": "Model/pattern or null",
      "period": "Date range",
      "confidence": 0.0-1.0,
      "evidenceFor": ["evidence supporting"],
      "evidenceAgainst": ["evidence against"],
      "valueEstimate": {
        "low": USD,
        "high": USD,
        "basis": "How estimated"
      }
    }
  ]
}`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Generate the top 3 identification candidates with evidence and values. Examine the image carefully for all text, marks, and details:',
          },
          { type: 'image_url', image_url: { url: imageBase64, detail: 'high' } },
        ],
      },
    ],
    max_completion_tokens: 2500,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new ExternalServiceError('No candidates response', 'OpenAI');

  const parsed = safeJsonParse(content, 'candidates') as { candidates?: unknown[] };
  const candidates = z.array(CandidateSchema).parse(parsed.candidates || []);

  for (const c of candidates) {
    console.log(`   #${c.rank}: ${c.identification} (${Math.round(c.confidence * 100)}%)`);
    if (c.valueEstimate.low && c.valueEstimate.high) {
      console.log(`       Value: $${c.valueEstimate.low} - $${c.valueEstimate.high}`);
    }
  }

  return candidates;
}

// ============================================================================
// COMBINED FINAL ANALYSIS + AUTHENTICATION (Single API Call)
// ============================================================================

async function generateCombinedAnalysis(
  imageBase64: string,
  triage: z.infer<typeof TriageSchema>,
  evidence: z.infer<typeof EvidenceSchema>,
  candidates: z.infer<typeof CandidateSchema>[],
  askingPrice?: number
): Promise<WorldClassResult> {
  console.log('✨ Stage 4: Combined Analysis + Authentication (single call)...');

  const topCandidate = candidates[0];
  const alternatives = candidates.slice(1);
  const domainPrompt = DOMAIN_EXPERT_PROMPTS[triage.domainExpert];

  // Determine authentication risk
  const HIGH_COUNTERFEIT_RISK: Record<string, AuthenticityRisk> = {
    watches: 'very_high',
    jewelry: 'high',
    art: 'high',
    silver: 'medium',
    ceramics: 'medium',
    furniture: 'medium',
    glass: 'medium',
    textiles: 'low',
    toys: 'low',
    books: 'low',
    tools: 'low',
    lighting: 'medium',
    electronics: 'low',
    vehicles: 'low',
    general: 'low',
  };

  const baseRisk = HIGH_COUNTERFEIT_RISK[triage.domainExpert] || 'low';
  const isLuxuryBrand = topCandidate.maker?.toLowerCase().match(
    /rolex|patek|omega|cartier|tiffany|louis vuitton|hermes|chanel|audemars|vacheron|breguet/
  );
  const isHighValue = (topCandidate.valueEstimate.high || 0) > 5000;

  let adjustedRisk = baseRisk;
  if (isLuxuryBrand || isHighValue) {
    if (baseRisk === 'low') adjustedRisk = 'medium';
    else if (baseRisk === 'medium') adjustedRisk = 'high';
    else if (baseRisk === 'high') adjustedRisk = 'very_high';
  }

  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'system',
        content: `${domainPrompt}

---

You are finalizing a COMBINED analysis and authentication for this item.

## TOP CANDIDATE:
${JSON.stringify(topCandidate, null, 2)}

## ALTERNATIVES:
${JSON.stringify(alternatives, null, 2)}

## EXTRACTED EVIDENCE:
${JSON.stringify(evidence, null, 2)}

## TRIAGE DATA:
${JSON.stringify(triage, null, 2)}

${askingPrice ? `## ASKING PRICE: $${askingPrice / 100}` : ''}

## BASE COUNTERFEIT RISK: ${adjustedRisk}

## YOUR TASK:
Generate a COMBINED response with BOTH identification analysis AND authentication assessment.

### PART 1: IDENTIFICATION ANALYSIS
- Confirm/refine top candidate
- Historical context (3-4 paragraphs)
- Market valuation with reasoning
- Comparable sales references
- Resale assessment

### PART 2: AUTHENTICATION ANALYSIS
- Authentication confidence (0-1): How confident this is AUTHENTIC
- Domain-specific verification checklist (5-8 checks)
- Known fake indicators for this specific item
- Additional photos that would help verify
- Expert referral recommendation

## DEAL RATING (if asking price provided):
- "exceptional": 50%+ below market
- "good": 20-50% below market
- "fair": Within 20% of market
- "overpriced": Above market

Respond in JSON with this structure:
{
  // Identification fields
  "name": "Full specific name",
  "maker": "Maker or null",
  "modelNumber": "Model or null",
  "brand": "Brand or null",
  "productCategory": "${triage.category}",
  "domainExpert": "${triage.domainExpert}",
  "itemSubcategory": "Subcategory",
  "era": "Period description",
  "style": "Style/movement",
  "periodStart": year_or_null,
  "periodEnd": year_or_null,
  "originRegion": "Region",
  "description": "Physical description",
  "historicalContext": "Rich historical narrative",
  "attributionNotes": "Attribution notes",
  "estimatedValueMin": USD,
  "estimatedValueMax": USD,
  "currentRetailPrice": null,
  "comparableSales": [...],
  "confidence": 0-1,
  "identificationConfidence": 0-1,
  "makerConfidence": 0-1,
  "evidenceFor": [...],
  "evidenceAgainst": [...],
  "alternativeCandidates": [...],
  "verificationTips": [...],
  "redFlags": [...],
  "flipDifficulty": "easy|moderate|hard|very_hard",
  "flipTimeEstimate": "timeline",
  "resaleChannels": [...],
  "stylingSuggestions": [...],

  // Authentication fields (REQUIRED)
  "authenticationConfidence": 0-1,
  "authenticityRisk": "low|medium|high|very_high",
  "authenticationChecklist": [
    {
      "id": "check-1",
      "category": "visual|physical|documentation|provenance",
      "priority": "critical|important|helpful",
      "check": "What to verify",
      "howTo": "How to check",
      "whatToLookFor": "Signs of authenticity",
      "redFlagSigns": ["Fake indicators"],
      "requiresExpert": boolean,
      "photoHelpful": boolean
    }
  ],
  "knownFakeIndicators": ["What fakes show"],
  "additionalPhotosRequested": [
    {
      "id": "photo-1",
      "area": "Specific area",
      "reason": "Why helpful",
      "whatToCapture": "Instructions",
      "priority": "required|recommended|optional"
    }
  ],
  "expertReferralRecommended": boolean,
  "expertReferralReason": "Reason or null",
  "authenticationAssessment": "Summary of authentication status"
}`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Generate the COMBINED final analysis and authentication${askingPrice ? ` with deal assessment for $${askingPrice / 100}` : ''}. Include both identification details AND authentication checklist.`,
          },
          { type: 'image_url', image_url: { url: imageBase64, detail: 'high' } },
        ],
      },
    ],
    max_completion_tokens: 6000, // Larger for combined response
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new ExternalServiceError('No combined analysis response', 'OpenAI');

  const parsed = safeJsonParse(content, 'combined-analysis') as Record<string, unknown>;

  // Validate core analysis fields
  const analysis = WorldClassAnalysisSchema.parse(parsed);

  // Extract authentication fields
  const authenticationConfidence = typeof parsed.authenticationConfidence === 'number'
    ? parsed.authenticationConfidence
    : 0.5;
  const authenticityRisk = ['low', 'medium', 'high', 'very_high'].includes(parsed.authenticityRisk as string)
    ? (parsed.authenticityRisk as AuthenticityRisk)
    : adjustedRisk;
  const authenticationChecklist = Array.isArray(parsed.authenticationChecklist)
    ? (parsed.authenticationChecklist as AuthenticationCheck[])
    : [];
  const knownFakeIndicators = Array.isArray(parsed.knownFakeIndicators)
    ? (parsed.knownFakeIndicators as string[])
    : [];
  const additionalPhotosRequested = Array.isArray(parsed.additionalPhotosRequested)
    ? (parsed.additionalPhotosRequested as PhotoRequest[])
    : [];
  const expertReferralRecommended = typeof parsed.expertReferralRecommended === 'boolean'
    ? parsed.expertReferralRecommended
    : false;
  const expertReferralReason = typeof parsed.expertReferralReason === 'string'
    ? parsed.expertReferralReason
    : null;
  const authenticationAssessment = typeof parsed.authenticationAssessment === 'string'
    ? parsed.authenticationAssessment
    : null;

  console.log(`🔐 Authentication Confidence: ${Math.round(authenticationConfidence * 100)}%`);
  console.log(`⚠️ Risk Level: ${authenticityRisk}`);
  console.log(`📋 Checklist Items: ${authenticationChecklist.length}`);
  console.log(`📸 Photos Requested: ${additionalPhotosRequested.length}`);
  if (expertReferralRecommended) {
    console.log(`👨‍🔬 Expert Referral: Recommended`);
  }

  // Calculate deal analysis if asking price provided
  let dealAnalysis: Partial<WorldClassResult> = {};
  if (askingPrice && analysis.estimatedValueMin && analysis.estimatedValueMax) {
    const marketMid = (analysis.estimatedValueMin + analysis.estimatedValueMax) / 2;

    if (marketMid > 0) {
      const askingDollars = askingPrice / 100;
      const percentOfMarket = (askingDollars / marketMid) * 100;

      let dealRating: DealRating;
      let dealExplanation: string;

      if (percentOfMarket <= 50) {
        dealRating = 'exceptional';
        dealExplanation = `At $${askingDollars.toLocaleString()}, this is ${Math.round(100 - percentOfMarket)}% below market value. Exceptional find!`;
      } else if (percentOfMarket <= 80) {
        dealRating = 'good';
        dealExplanation = `At $${askingDollars.toLocaleString()}, this is ${Math.round(100 - percentOfMarket)}% below market value. Solid deal.`;
      } else if (percentOfMarket <= 120) {
        dealRating = 'fair';
        dealExplanation = `At $${askingDollars.toLocaleString()}, this is within market range. Fair price.`;
      } else {
        dealRating = 'overpriced';
        dealExplanation = `At $${askingDollars.toLocaleString()}, this is ${Math.round(percentOfMarket - 100)}% above market value.`;
      }

      dealAnalysis = {
        askingPrice,
        dealRating,
        dealExplanation,
        profitPotentialMin: Math.round(analysis.estimatedValueMin - askingDollars),
        profitPotentialMax: Math.round(analysis.estimatedValueMax - askingDollars),
      };
    }
  }

  return {
    ...analysis,
    ...dealAnalysis,
    authenticationConfidence,
    authenticityRisk,
    authenticationChecklist,
    knownFakeIndicators,
    additionalPhotosRequested,
    expertReferralRecommended,
    expertReferralReason,
    authenticationAssessment,
  };
}

// ============================================================================
// MARKETPLACE LINKS
// ============================================================================

export function generateMarketplaceLinks(
  itemName: string,
  era?: string,
  estimatedValueMin?: number,
  productCategory?: ProductCategory,
  brand?: string,
  modelNumber?: string,
  domainExpert?: string
) {
  const isModernProduct = productCategory === 'modern_branded' || productCategory === 'modern_generic';

  if (isModernProduct) {
    const searchTerm = brand && modelNumber
      ? encodeURIComponent(`${brand} ${modelNumber}`)
      : encodeURIComponent(itemName);

    return [
      { marketplaceName: 'Amazon', linkUrl: `https://www.amazon.com/s?k=${searchTerm}` },
      { marketplaceName: 'Best Buy', linkUrl: `https://www.bestbuy.com/site/searchpage.jsp?st=${searchTerm}` },
      { marketplaceName: 'eBay', linkUrl: `https://www.ebay.com/sch/i.html?_nkw=${searchTerm}` },
      { marketplaceName: 'Walmart', linkUrl: `https://www.walmart.com/search?q=${searchTerm}` },
    ];
  }

  // Antique/vintage items - domain-specific marketplaces
  const searchTerm = encodeURIComponent(`${itemName} ${era || ''}`);
  const priceFilter = estimatedValueMin ? `&_udlo=${Math.round(estimatedValueMin * 0.5)}` : '';

  const links = [
    { marketplaceName: 'eBay', linkUrl: `https://www.ebay.com/sch/i.html?_nkw=${searchTerm}${priceFilter}&LH_Complete=1&LH_Sold=1` },
    { marketplaceName: 'Etsy', linkUrl: `https://www.etsy.com/search?q=${searchTerm}` },
  ];

  // Domain-specific additions
  if (domainExpert === 'furniture') {
    links.push(
      { marketplaceName: 'Chairish', linkUrl: `https://www.chairish.com/search?q=${searchTerm}` },
      { marketplaceName: '1stDibs', linkUrl: `https://www.1stdibs.com/search/?q=${searchTerm}` }
    );
  } else if (domainExpert === 'art') {
    links.push(
      { marketplaceName: 'Artnet', linkUrl: `https://www.artnet.com/search/?q=${searchTerm}` },
      { marketplaceName: '1stDibs', linkUrl: `https://www.1stdibs.com/search/?q=${searchTerm}` }
    );
  } else if (domainExpert === 'jewelry' || domainExpert === 'watches') {
    links.push(
      { marketplaceName: '1stDibs', linkUrl: `https://www.1stdibs.com/search/?q=${searchTerm}` },
      { marketplaceName: 'Ruby Lane', linkUrl: `https://www.rubylane.com/search?q=${searchTerm}` }
    );
  } else if (domainExpert === 'ceramics' || domainExpert === 'glass') {
    links.push(
      { marketplaceName: 'Replacements', linkUrl: `https://www.replacements.com/search?query=${searchTerm}` },
      { marketplaceName: 'Ruby Lane', linkUrl: `https://www.rubylane.com/search?q=${searchTerm}` }
    );
  } else if (domainExpert === 'books') {
    links.push(
      { marketplaceName: 'AbeBooks', linkUrl: `https://www.abebooks.com/servlet/SearchResults?kn=${searchTerm}` },
      { marketplaceName: 'Biblio', linkUrl: `https://www.biblio.com/search.php?keyisbn=${searchTerm}` }
    );
  } else {
    links.push(
      { marketplaceName: 'Ruby Lane', linkUrl: `https://www.rubylane.com/search?q=${searchTerm}` },
      { marketplaceName: '1stDibs', linkUrl: `https://www.1stdibs.com/search/?q=${searchTerm}` }
    );
  }

  return links;
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

export async function checkOpenAIHealth(): Promise<boolean> {
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 5000)
    );
    const check = openai.models.list();
    const response = await Promise.race([check, timeout]);
    return response.data.length > 0;
  } catch {
    return false;
  }
}

console.log('✅ OpenAI service initialized (World-Class Treasure Hunting v5.0 - GPT-5.2)');
