/**
 * VintageVision Expert Knowledge Base
 * World-Class Antiques & Collectibles Intelligence
 *
 * This database contains expert-level knowledge for each of our 50 ground truth items.
 * Think of this as having a 30-year antiques dealer's brain in code.
 *
 * Purpose:
 * 1. Train the AI to think like an expert
 * 2. Know what to look for in photos
 * 3. Ask the right questions when needed
 * 4. Provide transformative insights to users
 *
 * Each entry includes:
 * - instantRecognition: What an expert spots in 2 seconds
 * - visualCues: Specific things to look for in photos
 * - photographyGuidance: What additional photos to request
 * - authenticationDeep: Detailed authentication guidance
 * - marketIntelligence: Current market knowledge
 * - conversationTriggers: When to ask the user for more info
 * - expertInsights: Nuances only experts know
 */

export interface ExpertKnowledgeEntry {
  itemId: string

  // Instant Recognition - what screams the identity
  instantRecognition: {
    silhouette: string
    keyVisualMarkers: string[]
    instantRedFlags: string[]
  }

  // Visual Analysis - what to look for in photos
  visualCues: {
    construction: string[]
    materials: string[]
    proportions: string[]
    finish: string[]
    hardware: string[]
    marks: string[]
    wear: string[]
  }

  // Photography Guidance - what additional photos to request
  photographyGuidance: {
    essential: { location: string; reason: string }[]
    helpful: { location: string; reason: string }[]
    forAuthentication: { location: string; reason: string }[]
  }

  // Authentication Deep Dive
  authenticationDeep: {
    genuineIndicators: string[]
    fakeIndicators: string[]
    commonReproductions: string[]
    ageIndicators: string[]
    provenance: string[]
  }

  // Market Intelligence
  marketIntelligence: {
    currentDemand: 'hot' | 'strong' | 'steady' | 'declining' | 'niche' | 'moderate' | 'very strong' | 'moderate to strong'
    priceFactors: { factor: string; impact: string }[]
    bestVenues: string[]
    targetBuyers: string[]
    seasonality: string
    trend: string
  }

  // Smart Conversation Triggers
  conversationTriggers: {
    askAbout: { condition: string; question: string }[]
    requestPhoto: { condition: string; request: string; reason: string }[]
    clarify: { condition: string; clarification: string }[]
  }

  // Expert Insights - nuances only dealers know
  expertInsights: {
    sellerTips: string[]
    buyerTips: string[]
    commonMistakes: string[]
    hiddenValue: string[]
    storySellsFor: string
  }
}

/**
 * FURNITURE EXPERTISE
 */
const furnitureKnowledge: ExpertKnowledgeEntry[] = [
  {
    itemId: 'furn-001', // Eames Lounge Chair
    instantRecognition: {
      silhouette: 'Distinctive reclined profile at 15-degree angle with matching ottoman. The three-shell construction (headrest, back, seat) creates an unmistakable layered look.',
      keyVisualMarkers: [
        'Rosewood or walnut veneer shells with visible grain',
        'Black leather tufted cushions with specific button placement',
        'Five-star polished aluminum base',
        'Matching ottoman with same shell/cushion construction'
      ],
      instantRedFlags: [
        'Four-star base instead of five',
        'Proportions that look "off" - usually too tall or too narrow',
        'Shiny/cheap-looking leather',
        'Visible plywood edges without proper veneer wrapping'
      ]
    },
    visualCues: {
      construction: [
        'Three separate molded plywood shells (head, back, seat)',
        'Shells should have smooth curved edges, not sharp',
        'Back shell attaches to seat shell via rubber shock mounts',
        'Ottoman is single shell design'
      ],
      materials: [
        'Brazilian rosewood (pre-1992) has rich dark grain with orange highlights',
        'Walnut (current) has lighter, more consistent grain',
        'Santos Palisander (current) is darker, less grain variation',
        'Leather should have matte finish with natural grain, not glossy'
      ],
      proportions: [
        'Chair: 32.75"H x 32.75"W x 32.75"D',
        'Ottoman: 17.25"H x 25.5"W x 21"D',
        'Seat height approximately 15" from ground',
        'Headrest angle critical - too upright = fake'
      ],
      finish: [
        'Veneer should have depth - multiple coats of finish',
        'Base is polished, not brushed aluminum',
        'Hardware is black oxide finished steel',
        'Armrest pads should match chair leather'
      ],
      hardware: [
        'Shock mounts (rubber) connect shells - should be supple, not cracked',
        'Base attaches via center post mechanism',
        'Ottoman has independent tilt mechanism'
      ],
      marks: [
        'Herman Miller medallion on underside (style varies by era)',
        'Model 670 (chair) / 671 (ottoman) designation',
        'Date codes on some eras',
        'Vitra pieces marked differently (European production)'
      ],
      wear: [
        'Patina on armrests shows authentic use',
        'Leather develops fine creasing, not cracking',
        'Veneer may show minor chips at shell edges',
        'Base may show light scratches'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Underside of chair base', reason: 'Find Herman Miller medallion and model number' },
        { location: 'Profile view from side', reason: 'Verify proportions and recline angle' },
        { location: 'Close-up of veneer grain', reason: 'Identify wood species and authenticity' }
      ],
      helpful: [
        { location: 'Shock mounts where shells connect', reason: 'Assess condition and originality' },
        { location: 'Leather cushion detail', reason: 'Evaluate leather quality and button pattern' },
        { location: 'Base star from above', reason: 'Confirm five-star configuration' }
      ],
      forAuthentication: [
        { location: 'Any labels or stamps', reason: 'Date and verify production' },
        { location: 'Inside of shells (if accessible)', reason: 'Look for manufacturing marks' },
        { location: 'Ottoman base', reason: 'Should match chair medallion era' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Consistent veneer grain direction across all shells',
        'Specific button pattern: 3 on headrest, 3 on back, 3 on seat',
        'Weight: authentic chair weighs approximately 60 lbs',
        'Leather grain pattern natural and varied, not stamped',
        'Base has proper heft and polished, not chrome-plated finish'
      ],
      fakeIndicators: [
        'Lightweight construction (under 40 lbs)',
        'Vinyl or bonded leather (shiny, uniform surface)',
        'MDF or particleboard instead of plywood shells',
        'Chrome-plated base instead of polished aluminum',
        'Dimensions off by more than 1 inch',
        'No medallion or generic "Made in Italy" marks'
      ],
      commonReproductions: [
        'Chinese copies from Alibaba (very common, obvious quality issues)',
        'Italian reproductions (better quality but still distinguishable)',
        'Vintage knockoffs from 1970s-80s (can fool some buyers)',
        'Unlicensed "inspired by" pieces from furniture stores'
      ],
      ageIndicators: [
        '1956-1960s: Down-filled cushions, Santos Palisander',
        '1960s-1970s: Brazilian rosewood, most desirable era',
        '1971: Rosewood limited, walnut introduced',
        '1990s-present: Cherry, walnut, MCL leather options',
        'Medallion style helps date: evolved from paper label to metal disc'
      ],
      provenance: [
        'Original receipt dramatically increases value',
        'Celebrity ownership can add 50-100% premium',
        'Design store purchase history helpful',
        'Consecutive serial numbers for chair/ottoman valuable'
      ]
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Brazilian rosewood (pre-1992)', impact: '+40-60% over walnut' },
        { factor: 'Original leather in excellent condition', impact: '+30%' },
        { factor: 'Vintage 1960s-70s production', impact: '+20-40%' },
        { factor: 'Replaced leather/cushions', impact: '-20-30%' },
        { factor: 'Cracked shock mounts', impact: '-10-15%' },
        { factor: 'Missing ottoman', impact: '-30-40%' }
      ],
      bestVenues: [
        '1stDibs (high-end, verified dealers)',
        'Wright Auctions (design auctions)',
        'Chairish (curated vintage)',
        'Design Within Reach (for new/recent)',
        'Local consignment (faster but lower price)'
      ],
      targetBuyers: [
        'Mid-century modern collectors',
        'Interior designers for high-end projects',
        'Home office upgraders (post-COVID trend)',
        'Tech executives (Silicon Valley favorite)',
        'Investment buyers (proven appreciation)'
      ],
      seasonality: 'Strongest in fall (September-November) when people furnish homes. Slower in summer.',
      trend: 'Steady appreciation of 3-5% annually for vintage examples. New production stable at MSRP.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Cannot see medallion', question: 'Can you check the underside of the chair for a Herman Miller medallion or label?' },
        { condition: 'Color appears dark', question: 'Do you know if this is rosewood, walnut, or another wood? Rosewood is darker with orange/red highlights.' },
        { condition: 'Leather looks worn', question: 'Has the leather been restored or is it original? Original leather develops a specific patina.' }
      ],
      requestPhoto: [
        { condition: 'Cannot assess authenticity', request: 'Photo of the underside medallion/label', reason: 'To verify authentic Herman Miller production' },
        { condition: 'Cannot verify wood type', request: 'Close-up of the wood grain in good lighting', reason: 'To identify rosewood vs walnut (affects value by 40%+)' },
        { condition: 'Ottoman not visible', request: 'Photo of the ottoman if included', reason: 'Chair with matching ottoman worth 30-40% more' }
      ],
      clarify: [
        { condition: 'Age uncertain', clarification: 'Do you know approximately when this was purchased or any history about it?' },
        { condition: 'Condition unclear', clarification: 'Are there any issues with the chair that aren\'t visible in photos, like the tilt mechanism or squeaking?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Clean leather with appropriate conditioner before photographing',
        'Include the original receipt if available - adds significant value',
        'Highlight if you have matching ottoman - many chairs separated',
        'If rosewood, emphasize this in listing (CITES makes it rare now)',
        'Photograph in natural light to show true veneer color'
      ],
      buyerTips: [
        'Test the shock mounts - they should bounce back, not creak',
        'Sit in it - authentic chairs have specific resistance and recline feel',
        'Check all five base arms - cracks indicate stress or fake materials',
        'Ask about leather smell - genuine develops specific patina scent',
        'Verify ottoman matches - same era medallion, consistent wear'
      ],
      commonMistakes: [
        'Assuming all "Eames chairs" are the lounge chair (there are dozens of Eames designs)',
        'Not checking for replaced shock mounts (common repair)',
        'Overlooking Vitra versions (equally authentic, different market)',
        'Paying rosewood prices for walnut',
        'Not verifying chair and ottoman are matched set'
      ],
      hiddenValue: [
        'Early down-filled cushions (1956-1960s) particularly sought after',
        'Unusual leather colors (tan, white) can command premium',
        'Consecutive serial numbers for chair/ottoman very desirable',
        'Original box/packaging (rare) significant collector premium'
      ],
      storySellsFor: 'Designed in 1956 by Charles and Ray Eames for their friend Billy Wilder. This is THE icon of mid-century design, featured in countless films and homes of tastemakers. Every example tells a story of American design excellence.'
    }
  },

  {
    itemId: 'furn-002', // Barcelona Chair
    instantRecognition: {
      silhouette: 'Distinctive X-frame profile visible from any angle. Low, wide seating position with tufted cushions that appear to float on the frame.',
      keyVisualMarkers: [
        'Crossed steel X-frame legs on both sides',
        'Tufted leather cushions (40 individual tufts typical)',
        'No arms - open sides',
        'Leather straps supporting cushions'
      ],
      instantRedFlags: [
        'Frame proportions too thick or thin',
        'Machine-stitched cushions (should be hand-welted)',
        'Chrome plating that shows brass underneath',
        'Cushions sitting directly on frame (should be on straps)'
      ]
    },
    visualCues: {
      construction: [
        'Frame is two X-shaped pieces joined at seat',
        'Each X is welded from steel flat bar, not tubes',
        'Welds should be perfectly smooth and mirrored',
        'Frame meets floor at four points'
      ],
      materials: [
        'Stainless steel frame (post-1950) or chrome-plated (earlier)',
        'Top-grain leather cushions',
        'Leather straps (not webbing) support cushions',
        'Rubber or leather bumpers between cushion and frame'
      ],
      proportions: [
        '29.5"H x 30"W x 30"D standard',
        'Seat height 17" from floor',
        'Frame bars approximately 1.5" wide',
        'Cushion thickness about 5"'
      ],
      finish: [
        'Mirror polish on stainless (Knoll standard)',
        'Consistent color across entire frame',
        'No visible grinding marks on welds',
        'Leather has consistent grain and color'
      ],
      hardware: [
        'No visible hardware on frame (all welded)',
        'Cushions attach via hidden straps',
        'Bumpers may be visible underneath'
      ],
      marks: [
        'Knoll Studio stamp on frame (post-1968)',
        'Mies van der Rohe signature etched',
        'Serial number sometimes present',
        'Early Knoll pieces marked differently'
      ],
      wear: [
        'Frame should show minimal wear (stainless resists)',
        'Leather develops patina over time',
        'Straps may show stress at attachment points',
        'Floor contact points may show scratches'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Frame X-joint close-up', reason: 'Assess weld quality and authenticity' },
        { location: 'Frame signature/stamp', reason: 'Verify Knoll production' },
        { location: 'Cushion tufting detail', reason: 'Check hand-welted vs machine stitching' }
      ],
      helpful: [
        { location: 'Underneath showing straps', reason: 'Verify proper strap support system' },
        { location: 'Profile from side', reason: 'Confirm proportions and angles' }
      ],
      forAuthentication: [
        { location: 'All marks and stamps', reason: 'Date and verify production' },
        { location: 'Weld joints close-up', reason: 'Quality indicates authentic vs reproduction' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Mirror-quality stainless steel finish',
        'Hand-welted cushion seams (visible from edge)',
        'Knoll stamp or Mies signature on frame',
        'Weight: approximately 65 lbs for chair',
        'Leather straps, not webbing'
      ],
      fakeIndicators: [
        'Chrome plating showing wear/brass',
        'Machine-stitched cushions',
        'Lightweight (under 45 lbs)',
        'No manufacturer markings',
        'Proportions slightly off'
      ],
      commonReproductions: [
        'Italian reproductions (decent quality, lack signature)',
        'Chinese copies (obvious quality issues)',
        'Vintage knockoffs (can be confusing)',
        '"Inspired by" furniture store versions'
      ],
      ageIndicators: [
        '1929: Original prototype for Barcelona Exposition',
        '1948: Knoll acquires production rights',
        '1953: Knoll begins regular production',
        '1968: Knoll Studio signature series begins',
        'Modern: Stainless steel standard since 1960s'
      ],
      provenance: [
        'Knoll purchase documentation valuable',
        'Original Barcelona Exposition (1929) pieces museum-quality',
        'Gavina pieces (1960s) highly collectible'
      ]
    },
    marketIntelligence: {
      currentDemand: 'steady',
      priceFactors: [
        { factor: 'White leather', impact: '+15% (currently most popular)' },
        { factor: 'Vintage Gavina production (1960s)', impact: '+40-60%' },
        { factor: 'New Knoll with receipt', impact: 'Stable at MSRP' },
        { factor: 'No signature/stamps', impact: '-30-40%' },
        { factor: 'Worn leather needing replacement', impact: '-25%' }
      ],
      bestVenues: [
        'Knoll authorized dealers (new)',
        '1stDibs (vintage/used)',
        'Design Within Reach (Knoll partner)',
        'Wright Auctions (high-end vintage)'
      ],
      targetBuyers: [
        'Corporate offices and lobbies',
        'Architecture firms',
        'Modernist home collectors',
        'Design hotels and restaurants'
      ],
      seasonality: 'Steady year-round. Commercial purchases spike in Q1 (new budgets) and September (fiscal year).',
      trend: 'Classic status maintains value. White currently most requested color.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'No visible stamps', question: 'Is there a Knoll stamp or Mies signature on the frame? Usually on the lower crossbar.' },
        { condition: 'Leather appears worn', question: 'Has the leather been replaced or is it original to the chair?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify authenticity', request: 'Photo of any stamps or signatures on the frame', reason: 'To verify genuine Knoll production' },
        { condition: 'Cushion quality unclear', request: 'Close-up of cushion edges showing seams', reason: 'Hand-welted seams indicate authentic quality' }
      ],
      clarify: [
        { condition: 'Age uncertain', clarification: 'Do you know when this was purchased?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Clean frame with stainless steel cleaner before photographing',
        'Include Knoll documentation if available',
        'White leather photographs best in natural light',
        'Note matching ottoman if you have one'
      ],
      buyerTips: [
        'Check weld quality - should be perfectly smooth',
        'Sit in it - authentic has specific seat depth and firmness',
        'Verify cushion straps are leather, not webbing',
        'Ask about original purchase documentation'
      ],
      commonMistakes: [
        'Assuming all X-frame chairs are Barcelona (many knockoffs)',
        'Not checking for stamps/signatures',
        'Overlooking cushion quality (easy to reupholster poorly)',
        'Paying premium for unsigned pieces'
      ],
      hiddenValue: [
        'Gavina production (pre-Knoll acquisition) commands premium',
        'Original 1929 exposition pieces are museum-quality',
        'Matching ottoman (not always sold together)',
        'Corporate provenance (famous buildings)'
      ],
      storySellsFor: 'Designed by Mies van der Rohe for the King and Queen of Spain for the 1929 Barcelona International Exposition. This is the throne of modernism - pure geometric perfection in steel and leather.'
    }
  },

  {
    itemId: 'furn-003', // Gustav Stickley Sideboard
    instantRecognition: {
      silhouette: 'Massive, rectilinear form with strong horizontal emphasis. Visible joinery, particularly through-tenons, creates distinctive structural rhythm.',
      keyVisualMarkers: [
        'Quarter-sawn white oak with prominent ray fleck',
        'Exposed through-tenon joinery',
        'Hammered copper or iron hardware',
        'Fumed (ammonia-darkened) finish',
        'Plate rack or backboard common'
      ],
      instantRedFlags: [
        'Flat-sawn oak (no ray fleck)',
        'Machine-made hardware',
        'Orange/golden oak color (should be brown/gray)',
        'Hidden joinery',
        'Shiny modern finish'
      ]
    },
    visualCues: {
      construction: [
        'Through-tenons visible on sides and top',
        'Pegged mortise-and-tenon joints',
        'Panel construction for sides/doors',
        'Hand-cut dovetails on drawers'
      ],
      materials: [
        'Quarter-sawn white oak (ray fleck pattern essential)',
        'Hand-hammered hardware, not cast',
        'Original finish should be matte',
        'Iron or copper hardware, sometimes with strap hinges'
      ],
      proportions: [
        'Typically 48-72" wide',
        'Height around 42-48"',
        'Strong horizontal emphasis',
        'Proportions based on geometric ratios'
      ],
      finish: [
        'Fumed oak has gray-brown color',
        'Original finish is matte shellac or lacquer',
        'Should show age-appropriate patina',
        'Refinished pieces lose value'
      ],
      hardware: [
        'Hand-hammered copper plates with ring pulls',
        'Pyramid-head screws',
        'Strap hinges on doors',
        'Original hardware shows wear patterns'
      ],
      marks: [
        'Red decal ("Als Ik Kan") 1901-1916',
        'Paper label (various styles)',
        'Branded mark (shopmark)',
        'Model numbers sometimes branded'
      ],
      wear: [
        'Expected wear on drawer pulls',
        'Color variation from light exposure',
        'Minor scratches on top surface',
        'Hardware should show appropriate age'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Inside drawer or back panel', reason: 'Find decal, label, or branded mark' },
        { location: 'Close-up of joinery (through-tenons)', reason: 'Verify hand-cut construction' },
        { location: 'Hardware detail', reason: 'Confirm hand-hammered vs cast' }
      ],
      helpful: [
        { location: 'Oak grain close-up', reason: 'Verify quarter-sawn ray fleck' },
        { location: 'Overall front view', reason: 'Assess proportions and model' }
      ],
      forAuthentication: [
        { location: 'All marks/labels', reason: 'Essential for attribution and dating' },
        { location: 'Drawer dovetails', reason: 'Hand-cut vs machine indicates age' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Red decal with "Als Ik Kan" motto',
        'Quarter-sawn oak with prominent ray fleck',
        'Hand-hammered hardware (irregularities)',
        'Through-tenon construction',
        'Fumed finish (gray-brown, not orange)'
      ],
      fakeIndicators: [
        'Flat-sawn oak without ray fleck',
        'Cast or stamped hardware',
        'Machine-cut dovetails (uniform)',
        'Orange/golden finish',
        'No marks or labels'
      ],
      commonReproductions: [
        'L. & J.G. Stickley (different company, lower value)',
        'Stickley Brothers (Grand Rapids, even lower)',
        'Modern Stickley (clearly marked, lower value)',
        'Unmarked copies from period'
      ],
      ageIndicators: [
        '1901-1916: Red decal "Als Ik Kan" period (most valuable)',
        '1905-1912: Paper labels concurrent',
        'Branded shopmark on some pieces',
        'Hardware styles evolved during production'
      ],
      provenance: [
        'Original Craftsman Workshops documentation rare and valuable',
        'Documented original ownership adds premium',
        'Period photographs showing piece very helpful'
      ]
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Red decal present and clear', impact: 'Baseline value' },
        { factor: 'Rare form or early model', impact: '+50-100%' },
        { factor: 'Original finish intact', impact: '+30-50%' },
        { factor: 'No marks (attributed only)', impact: '-40-50%' },
        { factor: 'Refinished', impact: '-30%' },
        { factor: 'Hardware replacements', impact: '-15-25%' }
      ],
      bestVenues: [
        'Christie\'s and Sotheby\'s (major pieces)',
        'Rago Auctions (Arts & Crafts specialist)',
        'Toomey & Co. (Midwest focus)',
        'Specialist dealers (JMW Gallery, etc.)'
      ],
      targetBuyers: [
        'Arts & Crafts collectors',
        'American antiques collectors',
        'Period-appropriate home restorations',
        'Museum acquisitions'
      ],
      seasonality: 'Best in fall auction season. Grove Park Inn Arts & Crafts Conference (February) drives interest.',
      trend: 'Strong and stable. Museum exhibitions continue to drive appreciation.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'No visible marks', question: 'Have you checked inside the drawers or on the back for a Stickley mark? The red decal or paper label is usually hidden.' },
        { condition: 'Finish appears refinished', question: 'Do you know if this has been refinished? Original fumed finish is gray-brown and matte.' },
        { condition: 'Uncertain attribution', question: 'Is this confirmed Gustav Stickley, or could it be L. & J.G. or Stickley Brothers? The marks are different.' }
      ],
      requestPhoto: [
        { condition: 'Cannot find marks', request: 'Photo of inside drawers and back panel', reason: 'Stickley marks are often hidden in these locations' },
        { condition: 'Cannot assess joinery', request: 'Close-up of through-tenons or drawer dovetails', reason: 'Hand-cut joinery confirms period construction' }
      ],
      clarify: [
        { condition: 'Multiple Stickley brands', clarification: 'Just to confirm - is this Gustav Stickley (Craftsman), or one of the other Stickley companies?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Never refinish - original finish is essential to value',
        'Photograph marks with good lighting and include measurements',
        'Document any provenance or history',
        'If hardware has been replaced, disclose it'
      ],
      buyerTips: [
        'Always verify the mark - many period knockoffs exist',
        'Feel the hardware - hand-hammered has irregular surface',
        'Check drawer construction - machine dovetails mean wrong period',
        'Ask about refinishing history'
      ],
      commonMistakes: [
        'Confusing Gustav with L. & J.G. Stickley (different company)',
        'Assuming any Mission furniture is Stickley',
        'Not checking for marks (often hidden)',
        'Paying Gustav prices for unmarked pieces'
      ],
      hiddenValue: [
        'Early pieces with paper labels (before red decal)',
        'Signed by specific craftsmen',
        'Unusual forms not in catalogs',
        'Documented original Craftsman Workshops provenance'
      ],
      storySellsFor: 'Gustav Stickley\'s Craftsman Workshops embodied the American Arts & Crafts ideal - honest materials, visible craftsmanship, and designs "so simple that any child can understand." This is American design philosophy made tangible.'
    }
  },

  {
    itemId: 'furn-004', // Louis XV Bombé Commode
    instantRecognition: {
      silhouette: 'Dramatic curved "bombé" (swelling) form on all sides. Serpentine front, curved sides, cabriole legs. The ultimate expression of Rococo opulence.',
      keyVisualMarkers: [
        'Bombé (swelling) curved form',
        'Elaborate marquetry or veneer',
        'Gilt bronze (ormolu) mounts',
        'Marble top',
        'Cabriole legs with ormolu sabots'
      ],
      instantRedFlags: [
        'Flat or straight sides (not true bombé)',
        'Poor quality or plastic mounts',
        'Veneer lifting or poorly executed',
        'Wrong proportions for period'
      ]
    },
    visualCues: {
      construction: [
        'Complex curved carcass construction',
        'Multiple wood species in marquetry',
        'Dovetailed drawers (hand-cut for period)',
        'Oak secondary wood typical for French'
      ],
      materials: [
        'Exotic veneers: kingwood, tulipwood, rosewood',
        'Gilt bronze (ormolu) mounts - fire-gilt for period',
        'Marble top: typically veined white or breccia',
        'Brass or steel locks'
      ],
      proportions: [
        'Width typically 50-60 inches',
        'Height approximately 34-36 inches',
        'Dramatic depth due to bombé curve',
        'Legs shorter than later periods'
      ],
      finish: [
        'French polish or spirit varnish (period)',
        'Patina showing centuries of use',
        'Ormolu should have warm gold color, not bright',
        'Marble may show wear on edges'
      ],
      hardware: [
        'Ormolu mounts cast and chased',
        'Asymmetrical Rococo designs',
        'Escutcheons and handles integrated design',
        'Sabots (feet mounts) protect legs'
      ],
      marks: [
        'Estampille (maker\'s stamp) under marble top',
        'JME guild stamp (Jurande des Menuisiers-Ebénistes)',
        'Some pieces signed by famous ébénistes'
      ],
      wear: [
        'Veneer shrinkage and minor lifting acceptable',
        'Ormolu wear revealing bronze underneath',
        'Drawer runners show period use',
        'Marble may have old repairs'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Overall front view', reason: 'Show bombé form and marquetry quality' },
        { location: 'Stamp under marble top', reason: 'Find ébéniste mark and JME stamp' },
        { location: 'Ormolu mount detail', reason: 'Assess quality and authenticity' }
      ],
      helpful: [
        { location: 'Drawer interior', reason: 'Show construction and secondary woods' },
        { location: 'Side profile', reason: 'Demonstrate true bombé curve' }
      ],
      forAuthentication: [
        { location: 'All stamps and marks', reason: 'Critical for attribution' },
        { location: 'Lock and key mechanism', reason: 'Period locks are distinctive' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Estampille (maker\'s stamp) present',
        'JME guild mark',
        'Fire-gilt (mercuric) ormolu',
        'Hand-cut dovetails',
        'Period secondary woods (French oak)'
      ],
      fakeIndicators: [
        'Machine-cut dovetails',
        'Electro-plated "ormolu"',
        'Modern screws or nails',
        'Plywood or particleboard',
        'No stamps (though some genuine pieces lack them)'
      ],
      commonReproductions: [
        '19th century "style" reproductions (quality but later)',
        '20th century copies (often Italian)',
        'Modern reproductions (usually obvious quality issues)'
      ],
      ageIndicators: [
        '1730-1760: True Louis XV period, most valuable',
        '1760-1790: Transition to Neoclassical',
        '1850-1890: Revival period, good quality copies',
        '20th century: Generally obvious'
      ],
      provenance: [
        'Chateau provenance significantly increases value',
        'Exhibition history important',
        'Famous collection provenance valuable'
      ]
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Signed by major ébéniste (BVRB, Oeben)', impact: '+200-500%' },
        { factor: 'Royal provenance', impact: '+100-300%' },
        { factor: 'Original marble', impact: '+20%' },
        { factor: 'Replaced ormolu', impact: '-30-50%' },
        { factor: 'Major veneer repairs', impact: '-25-40%' }
      ],
      bestVenues: [
        'Christie\'s Paris (French furniture specialist)',
        'Sotheby\'s Paris',
        'Artcurial',
        'Major London sales'
      ],
      targetBuyers: [
        'French furniture collectors',
        'Interior designers for luxury projects',
        'Museums',
        'French aristocracy restoring properties'
      ],
      seasonality: 'Best in fall/winter Paris auction season. Monaco sales in summer.',
      trend: 'Stable at high end. Lesser pieces slower to sell than 20 years ago.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Cannot see stamps', question: 'Is there a maker\'s stamp (estampille) under the marble top or on the carcass?' },
        { condition: 'Ormolu quality uncertain', question: 'Do the mounts appear to be original fire-gilt bronze, or have they been replaced or replated?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify authenticity', request: 'Photo under the marble top showing any stamps', reason: 'Period stamps are essential for authentication and value' },
        { condition: 'Ormolu authenticity unclear', request: 'Close-up of ormolu showing wear patterns', reason: 'Original fire-gilt ormolu has distinctive wear' }
      ],
      clarify: [
        { condition: 'Attribution uncertain', clarification: 'Is this piece attributed to a specific ébéniste, or is it unattributed?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Have piece examined by French furniture specialist',
        'Document all stamps with photographs',
        'Provenance research can multiply value',
        'Consider selling in Paris for best prices'
      ],
      buyerTips: [
        'Always verify stamps - fakes exist',
        'Fire-gilt ormolu has distinctive wear pattern',
        'Check drawer construction carefully',
        'Get condition report from specialist'
      ],
      commonMistakes: [
        'Confusing Louis XV with Louis XVI (very different)',
        'Assuming all French commodes are valuable',
        'Not checking for later ormolu replacements',
        'Overlooking importance of stamps'
      ],
      hiddenValue: [
        'Signed pieces by lesser-known ébénistes still valuable',
        'Original marble often overlooked but important',
        'Complete sets (matching pair) very valuable',
        'Documented chateau provenance'
      ],
      storySellsFor: 'This represents the height of French court sophistication under Louis XV. The bombé form challenged the greatest craftsmen of the age - only masters could execute such complex curves. Every piece tells a story of Parisian luxury when France defined taste for all of Europe.'
    }
  },

  {
    itemId: 'furn-005', // Windsor Bow-Back Chair
    instantRecognition: {
      silhouette: 'Distinctive bow-shaped back with spindles. Saddle-shaped solid wood seat. Splayed turned legs with stretchers. Quintessentially American form.',
      keyVisualMarkers: [
        'Steam-bent bow forming back',
        'Multiple spindles through seat',
        'Saddle (sculpted) seat',
        'Turned splayed legs',
        'H-stretcher or swelled stretcher'
      ],
      instantRedFlags: [
        'Flat unsculpted seat',
        'Machine-made uniformity',
        'Wrong proportions',
        'Modern screws visible'
      ]
    },
    visualCues: {
      construction: [
        'Seat is single plank, sculpted (saddled)',
        'Legs and spindles driven through seat from above',
        'Bow steam-bent and pinned at ends',
        'Mixed woods typical: pine seat, ash/hickory spindles, maple legs'
      ],
      materials: [
        'Seat: pine or poplar (softwood for carving)',
        'Spindles: ash, oak, or hickory (flexible for steam bending)',
        'Legs and stretchers: maple, birch, or ash (hard for turning)',
        'Paint: often original green, red, or black'
      ],
      proportions: [
        'Seat height typically 16-18 inches',
        'Overall height approximately 36-40 inches',
        'Seat width 17-19 inches',
        'Legs splayed outward for stability'
      ],
      finish: [
        'Original paint highly valued',
        'Paint should show wear consistent with age',
        'Under-paint may reveal earlier colors',
        'Scrubbed/worn paint surface typical'
      ],
      hardware: [
        'No hardware on true Windsor',
        'Wedges visible in leg tops',
        'Pins in bow connections'
      ],
      marks: [
        'Branded maker\'s name rare but valuable',
        'Paper labels extremely rare',
        'Region determined by style features'
      ],
      wear: [
        'Seat worn from use',
        'Stretcher worn from feet',
        'Paint worn on arms and crest',
        'Legs may show shrinkage gaps in seat'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Overall front view', reason: 'Identify bow-back form and proportions' },
        { location: 'Seat underside', reason: 'Look for maker brands and construction' },
        { location: 'Paint close-up', reason: 'Assess originality and age' }
      ],
      helpful: [
        { location: 'Spindle detail', reason: 'Hand-turned vs machine indication' },
        { location: 'Stretcher wear', reason: 'Authentic age indicator' }
      ],
      forAuthentication: [
        { location: 'Leg joints in seat', reason: 'Hand-cut vs machine' },
        { location: 'Any brands or marks', reason: 'Maker identification' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Hand-turned legs (slight irregularities)',
        'Hand-sculpted seat saddle',
        'Appropriate wear patterns',
        'Period paint (if any) with proper aging',
        'Mixed wood construction'
      ],
      fakeIndicators: [
        'Machine-perfect turning',
        'Modern paint (too uniform)',
        'Phillips head screws',
        'Uniform wood throughout',
        'No wear in expected places'
      ],
      commonReproductions: [
        'Wallace Nutting reproductions (1920s, marked, collectible)',
        'D.R. Dimes quality reproductions',
        'Modern gift shop copies',
        'Assembled from old parts (marriages)'
      ],
      ageIndicators: [
        '1750-1780: Philadelphia region, refined details',
        '1780-1820: New England, varied styles',
        '1800-1830: Country examples, simpler',
        '1920s-1940s: Colonial Revival, often marked'
      ],
      provenance: [
        'Regional attribution valuable',
        'Original paint adds 50-200%',
        'Maker brand extremely valuable',
        'Period photo documentation rare but important'
      ]
    },
    marketIntelligence: {
      currentDemand: 'steady',
      priceFactors: [
        { factor: 'Original paint', impact: '+100-200%' },
        { factor: 'Maker brand', impact: '+50-100%' },
        { factor: 'Philadelphia origin', impact: '+30-50%' },
        { factor: 'Stripped or refinished', impact: '-40-60%' },
        { factor: 'Repaired bow or legs', impact: '-20-30%' }
      ],
      bestVenues: [
        'Skinner Auctions (American furniture specialist)',
        'Pook & Pook (Pennsylvania)',
        'Northeast Auctions',
        'Specialist dealers'
      ],
      targetBuyers: [
        'Americana collectors',
        'Period room installations',
        'Colonial home restoration',
        'Decorators seeking authentic country'
      ],
      seasonality: 'Americana sells well year-round. Peak interest in fall.',
      trend: 'Original paint examples strong. Refinished pieces slower.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Paint status unclear', question: 'Is this original paint, old paint, or has the chair been refinished?' },
        { condition: 'Origin uncertain', question: 'Do you know the regional origin or any history of this chair?' }
      ],
      requestPhoto: [
        { condition: 'Cannot see construction', request: 'Photo of seat underside', reason: 'Shows construction and any maker brands' },
        { condition: 'Paint authenticity uncertain', request: 'Close-up of paint surface showing wear', reason: 'Original paint dramatically increases value' }
      ],
      clarify: [
        { condition: 'Type unclear', clarification: 'Is this a bow-back, sack-back, or continuous-arm Windsor?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Never refinish or strip - original surface is everything',
        'Document any known history',
        'Show seat underside in photos',
        'Note regional characteristics'
      ],
      buyerTips: [
        'Look for wear in right places (seat, stretchers)',
        'Check paint layers carefully',
        'Feel for hand-sculpted seat',
        'Compare proportions to known examples'
      ],
      commonMistakes: [
        'Stripping valuable original paint',
        'Assuming all old Windsors are period',
        'Missing Wallace Nutting marks',
        'Overlooking regional differences'
      ],
      hiddenValue: [
        'Child\'s sizes command premium',
        'Unusual forms (writing arm, high-back) valuable',
        'Sets extremely valuable',
        'Documented regional attribution'
      ],
      storySellsFor: 'The Windsor chair was born in 18th century America and became the chair of the Revolution - George Washington ordered them for Mount Vernon. Each one was handmade by a craftsman using techniques unchanged for generations. This is American independence in furniture form.'
    }
  },

  {
    itemId: 'furn-006', // Chippendale Side Chair
    instantRecognition: {
      silhouette: 'Elegant Queen Anne evolution with pierced splat, cabriole legs, and ball-and-claw feet. The ultimate expression of 18th century American craftsmanship.',
      keyVisualMarkers: [
        'Pierced (carved through) back splat',
        'Yoke-shaped crest rail',
        'Cabriole legs with ball-and-claw feet',
        'Shaped seat frame',
        'Carved knee decoration'
      ],
      instantRedFlags: [
        'Machine-carved details (too uniform)',
        'Wrong proportions (typically too wide)',
        'Knee blocks missing',
        'Modern upholstery nails visible'
      ]
    },
    visualCues: {
      construction: [
        'Mortise and tenon joinery throughout',
        'Seat frame with corner blocks',
        'Rear legs are one piece through seat rails',
        'Slip seat (removable upholstered seat)'
      ],
      materials: [
        'Primary wood: mahogany (finest), walnut, cherry',
        'Secondary woods: pine, poplar, tulip (regional variations)',
        'Philadelphia: typically mahogany with Atlantic white cedar',
        'New England: often walnut or cherry'
      ],
      proportions: [
        'Seat height typically 17-18 inches',
        'Overall height 37-40 inches',
        'Seat width 20-22 inches',
        'Philadelphia chairs tend wider than New England'
      ],
      finish: [
        'Original finish extremely rare',
        'Old refinish acceptable',
        'Wood should have patina and depth',
        'Evidence of past waxing/polishing'
      ],
      hardware: [
        'No exposed hardware on chair itself',
        'Slip seat may have later fabric tacks',
        'Original corner blocks hand-cut'
      ],
      marks: [
        'Labeled examples extremely valuable',
        'Chalk numbers (shop inventory)',
        'Regional features serve as identification'
      ],
      wear: [
        'Stretchers worn from feet (if present)',
        'Seat rails show age shrinkage',
        'Crest rail worn from handling',
        'Ball-and-claw toes may show wear'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full front view', reason: 'Show splat design and proportions' },
        { location: 'Ball-and-claw feet close-up', reason: 'Regional style identification' },
        { location: 'Back splat from front', reason: 'Pattern identification' }
      ],
      helpful: [
        { location: 'Underside of seat frame', reason: 'Construction and secondary woods' },
        { location: 'Side profile', reason: 'Verify proportions and lines' }
      ],
      forAuthentication: [
        { location: 'Knee carving detail', reason: 'Hand-carved vs machine quality' },
        { location: 'Any labels or marks', reason: 'Maker identification' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Hand-carved splat with tool marks',
        'Asymmetrical ball-and-claw (hand-carved)',
        'Period secondary woods (regional)',
        'Original knee blocks',
        'Appropriate wear and patina'
      ],
      fakeIndicators: [
        'Machine-carved symmetrical details',
        'Wrong secondary woods for region',
        'Modern saw marks',
        'Replaced or missing knee blocks',
        'Too-perfect condition'
      ],
      commonReproductions: [
        'Centennial reproductions (1876+, quality)',
        'Colonial Revival (1920s-40s)',
        'Modern reproductions (often Asian)',
        'Composites from old parts'
      ],
      ageIndicators: [
        '1755-1780: Period production, highest value',
        '1876-1920: Centennial revival, collectible',
        '1920-1960: Colonial Revival, decorative value',
        'Modern: Usually obvious'
      ],
      provenance: [
        'Philadelphia/New York attribution most valuable',
        'Documented maker attribution extremely valuable',
        'Period family history helpful',
        'Famous collection provenance adds value'
      ]
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Philadelphia origin', impact: '+100-200%' },
        { factor: 'Documented maker', impact: '+200-500%' },
        { factor: 'Original slip seat', impact: '+10-15%' },
        { factor: 'Set of chairs (4+)', impact: '+50-100%' },
        { factor: 'Replaced feet', impact: '-50-70%' },
        { factor: 'Major repairs', impact: '-30-50%' }
      ],
      bestVenues: [
        'Christie\'s American furniture',
        'Sotheby\'s Important Americana',
        'Freeman\'s Philadelphia',
        'Specialist dealers'
      ],
      targetBuyers: [
        'Americana collectors',
        'Museum acquisitions',
        'Historic house furnishing',
        'Investment collectors'
      ],
      seasonality: 'Best in major January/October New York Americana weeks.',
      trend: 'Top-tier Philadelphia chairs continue strong. Lesser examples more price-sensitive.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Regional origin unclear', question: 'Do you know where this chair was made? Philadelphia, New York, and New England chairs have different characteristics.' },
        { condition: 'Condition uncertain', question: 'Are the ball-and-claw feet original, or have they been replaced?' }
      ],
      requestPhoto: [
        { condition: 'Cannot assess carving', request: 'Close-up of splat carving and knee carving', reason: 'Hand-carving quality indicates period and region' },
        { condition: 'Cannot verify construction', request: 'Photo of seat frame underside', reason: 'Secondary woods indicate regional origin' }
      ],
      clarify: [
        { condition: 'Set unclear', clarification: 'Is this from a known set? How many chairs are there?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Regional attribution adds significant value',
        'Photograph carving details thoroughly',
        'Document any provenance',
        'Consider major auction houses for finest examples'
      ],
      buyerTips: [
        'Study regional carving styles before buying',
        'Always check feet - replacements common',
        'Examine knee blocks carefully',
        'Compare to museum examples'
      ],
      commonMistakes: [
        'Assuming all Chippendale chairs are valuable',
        'Missing replaced feet',
        'Not recognizing Centennial pieces',
        'Overlooking regional differences'
      ],
      hiddenValue: [
        'Rhode Island examples often undervalued',
        'Matching sets dramatically more valuable',
        'Connecticut cherry chairs collected',
        'Documented shop attribution'
      ],
      storySellsFor: 'These chairs were the status symbols of Colonial America - only the wealthiest merchants could afford them. Each ball-and-claw foot was carved by hand, a skill that took years to master. Philadelphia chairmakers were the finest in the colonies, and their work competed with the best London had to offer.'
    }
  },

  {
    itemId: 'furn-007', // Wassily Chair
    instantRecognition: {
      silhouette: 'Angular, geometric frame of bent tubular steel with leather slings. The frame appears to suspend the sitter in space. Revolutionary 1920s Bauhaus design.',
      keyVisualMarkers: [
        'Tubular steel frame bent into angular form',
        'Leather or canvas sling seat, back, and arms',
        'Cantilevered structure',
        'Open, airy appearance',
        'Visible frame construction'
      ],
      instantRedFlags: [
        'Poor chrome quality (peeling/pitting)',
        'Cheap vinyl instead of leather',
        'Wrong proportions',
        'Poor weld quality at joints'
      ]
    },
    visualCues: {
      construction: [
        'Tubular steel frame welded at joints',
        'Frame is continuous bent tube',
        'Leather loops around frame',
        'No visible screws on frame'
      ],
      materials: [
        'Nickel-plated or chrome-plated steel',
        'Top-grain leather slings (Knoll/Gavina)',
        'Canvas an early option',
        'Frame diameter and gauge consistent'
      ],
      proportions: [
        '28.5"H x 30.5"W x 27"D typical',
        'Seat height approximately 17"',
        'Frame tubes approximately 7/8" diameter',
        'Angles precise and consistent'
      ],
      finish: [
        'Chrome should be mirror-quality',
        'Leather matte finish, natural grain',
        'Welds invisible or minimal',
        'End caps where tubes terminate'
      ],
      hardware: [
        'Leather attached by screws (hidden)',
        'Frame joints may have internal sleeves',
        'Floor glides on feet'
      ],
      marks: [
        'Knoll label (post-1968)',
        'Gavina label (1962-1968)',
        'Thonet marking (various periods)',
        'Modern Knoll has serial numbers'
      ],
      wear: [
        'Chrome may show fine scratches',
        'Leather develops patina',
        'Frame joints may show stress',
        'Floor glides wear'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full front view', reason: 'Show overall design and proportions' },
        { location: 'Label or marking', reason: 'Verify manufacturer' },
        { location: 'Chrome condition', reason: 'Assess quality and authenticity' }
      ],
      helpful: [
        { location: 'Leather detail', reason: 'Quality assessment' },
        { location: 'Frame joint', reason: 'Construction quality' }
      ],
      forAuthentication: [
        { location: 'All labels and marks', reason: 'Essential for dating and value' },
        { location: 'Leather attachment method', reason: 'Varies by manufacturer' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Manufacturer label or stamp',
        'Quality chrome finish',
        'Top-grain leather',
        'Proper weight and heft',
        'Precise proportions'
      ],
      fakeIndicators: [
        'No manufacturer marks',
        'Vinyl or bonded leather',
        'Poor chrome quality',
        'Lightweight construction',
        'Wrong proportions'
      ],
      commonReproductions: [
        'Quality Italian reproductions (various)',
        'Chinese mass-market copies',
        'Period knockoffs (1970s-80s)',
        'Furniture store "inspired by" pieces'
      ],
      ageIndicators: [
        '1925-1932: Original Thonet-Mundus production',
        '1962-1968: Gavina (most collectible)',
        '1968-present: Knoll (most common)',
        'Current: Knoll Studio continues production'
      ],
      provenance: [
        'Gavina pieces command premium',
        'Original Breuer-era extremely rare',
        'Corporate provenance interesting',
        'Designer ownership adds value'
      ]
    },
    marketIntelligence: {
      currentDemand: 'steady',
      priceFactors: [
        { factor: 'Gavina label', impact: '+50-100%' },
        { factor: 'White leather', impact: '+15%' },
        { factor: 'Original leather intact', impact: '+20%' },
        { factor: 'New leather replacement', impact: '-20%' },
        { factor: 'Chrome damage', impact: '-30-40%' },
        { factor: 'No label/marks', impact: '-40-50%' }
      ],
      bestVenues: [
        'Wright Auctions (design specialist)',
        '1stDibs (verified dealers)',
        'Chairish (curated vintage)',
        'Knoll dealers (new)'
      ],
      targetBuyers: [
        'Bauhaus collectors',
        'Modern design enthusiasts',
        'Interior designers',
        'Architecture firms'
      ],
      seasonality: 'Steady year-round. Design auctions in spring and fall.',
      trend: 'Classic design maintains value. Gavina pieces appreciate.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'No label visible', question: 'Is there a manufacturer label on the frame or leather? Knoll, Gavina, or Thonet?' },
        { condition: 'Leather condition unclear', question: 'Is this original leather or has it been replaced?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify manufacturer', request: 'Photo of any labels or stamps', reason: 'Manufacturer greatly affects value' },
        { condition: 'Chrome quality uncertain', request: 'Close-up of chrome showing any wear', reason: 'Chrome condition important for value' }
      ],
      clarify: [
        { condition: 'Age uncertain', clarification: 'Do you know when this was purchased?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Find and photograph all labels',
        'Clean chrome carefully with appropriate products',
        'Note if leather is original',
        'Gavina label significantly increases value'
      ],
      buyerTips: [
        'Verify manufacturer - many fakes',
        'Check chrome for pitting (hard to fix)',
        'Leather can be replaced (affects value)',
        'Sit in it - authentic has specific feel'
      ],
      commonMistakes: [
        'Assuming all tubular steel chairs are Wassily',
        'Not checking for labels',
        'Overlooking chrome damage',
        'Paying premium for unlabeled pieces'
      ],
      hiddenValue: [
        'Gavina production particularly collectible',
        'Original canvas versions rare',
        'Period Thonet examples valuable',
        'Documented design provenance'
      ],
      storySellsFor: 'Marcel Breuer created this chair in 1925-26 at the Bauhaus, reportedly inspired by his bicycle\'s handlebars. Named later for painter Wassily Kandinsky, who admired it. This chair literally invented tubular steel furniture - every office chair in the world owes something to this revolutionary design.'
    }
  },

  {
    itemId: 'furn-008', // Shaker Rocking Chair
    instantRecognition: {
      silhouette: 'Exceptionally refined proportions with ladder-back slats, tall thin posts, and gentle rockers. The ultimate expression of functional simplicity.',
      keyVisualMarkers: [
        'Ladder-back with 3-5 slats',
        'Woven tape or rush seat',
        'Mushroom-shaped finials (cap on posts)',
        'Tilter buttons on rear legs',
        'Thin elegant proportions'
      ],
      instantRedFlags: [
        'Thick chunky proportions',
        'Wrong finial shapes',
        'Machine-woven seat',
        'Proportions that look "off"'
      ]
    },
    visualCues: {
      construction: [
        'Mortise and tenon joinery',
        'Steam-bent back slats',
        'Rockers attached with tenons',
        'Hand-woven seat',
        'Ball-and-socket tilters (if present)'
      ],
      materials: [
        'Maple primary wood (usually stained)',
        'Birch, cherry also used',
        'Cotton or wool tape for seats',
        'Rush or splint alternative'
      ],
      proportions: [
        'Posts noticeably thin and elegant',
        'Overall height 40-44 inches typically',
        'Slats graduate in width (smaller at top)',
        'Rockers extend beyond posts'
      ],
      finish: [
        'Original stain (often dark)',
        'Varnish or shellac finish',
        'May retain paint (rare)',
        'Patina from handling'
      ],
      hardware: [
        'Tilter buttons (ball in socket)',
        'Possibly numbered tags',
        'Seat may have tacks (later)'
      ],
      marks: [
        'Stenciled community numbers',
        'Paper labels (rare)',
        'Stamp or brand (valuable)',
        'Size number on post'
      ],
      wear: [
        'Rockers worn from use',
        'Arms worn from hands',
        'Tape seats show wear patterns',
        'Tilters may be worn'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full view from front', reason: 'Show proportions and slat arrangement' },
        { location: 'Finial close-up', reason: 'Mushroom cap is diagnostic' },
        { location: 'Any marks or numbers', reason: 'Community identification' }
      ],
      helpful: [
        { location: 'Seat weave detail', reason: 'Original vs replacement' },
        { location: 'Tilter buttons', reason: 'Distinctive Shaker feature' }
      ],
      forAuthentication: [
        { location: 'All labels or stamps', reason: 'Critical for attribution' },
        { location: 'Proportions measurement', reason: 'Shaker proportions distinctive' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Extraordinarily refined proportions',
        'Mushroom-shaped finials',
        'Ball-and-socket tilter buttons',
        'Period construction techniques',
        'Original tape seat'
      ],
      fakeIndicators: [
        'Chunky or heavy proportions',
        'Wrong finial shape',
        'No tilters',
        'Machine-woven seat',
        'Modern screws or nails'
      ],
      commonReproductions: [
        'Modern Shaker reproductions (various makers)',
        'Colonial Revival pieces',
        'Assembled from parts',
        '"Shaker-style" commercial production'
      ],
      ageIndicators: [
        '1830-1880: Height of Shaker chair production',
        '1880-1930: Later Mount Lebanon production',
        'Post-1930: Revival and reproduction'
      ],
      provenance: [
        'Community attribution important',
        'Original sales documentation valuable',
        'Period photographs helpful',
        'Museum deaccession provenance'
      ]
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Community stamp/label', impact: '+50-100%' },
        { factor: 'Original tape seat', impact: '+30%' },
        { factor: 'Original finish', impact: '+25%' },
        { factor: 'Replaced seat', impact: '-15%' },
        { factor: 'Refinished', impact: '-20%' },
        { factor: 'Damaged rockers', impact: '-25%' }
      ],
      bestVenues: [
        'Willis Henry Auctions (Shaker specialist)',
        'Skinner Auctions',
        'Northeast Auctions',
        'Specialist Shaker dealers'
      ],
      targetBuyers: [
        'Shaker collectors',
        'Americana enthusiasts',
        'Design collectors (Shaker = original minimalism)',
        'Museum acquisitions'
      ],
      seasonality: 'Best in fall auction season. Shaker-specific sales periodic.',
      trend: 'Strong and stable. Appreciation for Shaker design continues.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Community unclear', question: 'Is this attributed to a specific Shaker community? Mount Lebanon, Hancock, Canterbury?' },
        { condition: 'Seat status unclear', question: 'Is this the original tape seat or a replacement?' }
      ],
      requestPhoto: [
        { condition: 'Cannot see marks', request: 'Photo of any stenciled numbers or labels', reason: 'Community marks essential for attribution' },
        { condition: 'Finials not visible', request: 'Close-up of finial tops', reason: 'Mushroom finials distinguish from other chairs' }
      ],
      clarify: [
        { condition: 'Type unclear', clarification: 'Is this a #0 (smallest) through #7 (largest) size?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Research community attribution before selling',
        'Document any provenance carefully',
        'Photograph all marks and numbers',
        'Original seats significantly add value'
      ],
      buyerTips: [
        'Study authentic proportions - fakes are usually wrong',
        'Look for tilter buttons (diagnostic feature)',
        'Check finial shape carefully',
        'Compare to museum examples'
      ],
      commonMistakes: [
        'Assuming all ladder-back rockers are Shaker',
        'Missing community attribution',
        'Overlooking the importance of proportions',
        'Replacing original tape seat'
      ],
      hiddenValue: [
        'Early (pre-1860) examples most valuable',
        'Original paint extremely rare and valuable',
        'Side chairs less common than rockers',
        'Complete sets extremely valuable'
      ],
      storySellsFor: 'The Shakers believed "beauty rests on utility" and created furniture of mathematical perfection. Each chair was a prayer made visible - function elevated to spiritual act. Their designs influenced everything from Danish Modern to Apple, and a Shaker chair is the original icon of minimalism.'
    }
  },

  {
    itemId: 'furn-009', // Thonet Bentwood Chair No. 14
    instantRecognition: {
      silhouette: 'Graceful curves formed from steam-bent beechwood. Simple hoop-back chair with circular seat. The most produced chair in history.',
      keyVisualMarkers: [
        'Steam-bent wood frame (no angles)',
        'Hoop-shaped back',
        'Cane or pressed-wood seat',
        'Simple curved legs',
        'Five or six components total'
      ],
      instantRedFlags: [
        'Laminated wood (not solid bent)',
        'Poor quality cane',
        'Wrong proportions',
        'Missing screws at joints'
      ]
    },
    visualCues: {
      construction: [
        'Solid beech steam-bent to shape',
        'Screws join frame components',
        'Back loop is single bent piece',
        'Legs and seat ring separate',
        'Designed for knock-down shipping'
      ],
      materials: [
        'Solid beech (Fagus sylvatica)',
        'Hand-woven cane seat (original)',
        'Pressed plywood seat (later)',
        'Metal screws at joints'
      ],
      proportions: [
        'Seat height approximately 18"',
        'Overall height 33-36"',
        'Seat diameter about 16"',
        'Back loop standardized dimensions'
      ],
      finish: [
        'Dark stain (walnut, ebonized) most common',
        'Natural finish less common',
        'Painted examples exist',
        'Shellac or varnish original finish'
      ],
      hardware: [
        'Visible screws at all joints',
        'Screw heads may be slotted (earlier) or Phillips',
        'Cane held by spline'
      ],
      marks: [
        'Paper label (various periods)',
        'Burned mark "THONET"',
        'Made in Austria/Czechoslovakia/Poland marks',
        'Model number may be present'
      ],
      wear: [
        'Cane seats wear through',
        'Legs show wear at floor',
        'Finish wear on back rail',
        'Screw holes may show wear'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Overall view', reason: 'Show classic bentwood form' },
        { location: 'Any labels or marks', reason: 'Dating and authentication' },
        { location: 'Seat detail', reason: 'Cane vs pressed wood condition' }
      ],
      helpful: [
        { location: 'Underside', reason: 'May show label or marks' },
        { location: 'Joint detail', reason: 'Construction quality' }
      ],
      forAuthentication: [
        { location: 'All marks and labels', reason: 'Period identification' },
        { location: 'Wood grain at bend', reason: 'Solid bent vs laminated' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Solid steam-bent beech',
        'Thonet label or mark',
        'Period screws and hardware',
        'Appropriate wear patterns',
        'Quality of bend execution'
      ],
      fakeIndicators: [
        'Laminated bent wood',
        'No marks or labels',
        'Modern screws throughout',
        'Plastic or cheap cane',
        'Poor quality bends'
      ],
      commonReproductions: [
        'Modern production Thonet (legitimate, marked)',
        'Other manufacturer copies (ZPM, etc.)',
        'Contemporary reproductions',
        'Unlicensed copies (various)'
      ],
      ageIndicators: [
        '1859-1900: Original Thonet production',
        '1900-1930: Peak production period',
        '1930-1950: Various ownership changes',
        'Post-1950: Modern production continues'
      ],
      provenance: [
        'Period labels important for dating',
        'Café or restaurant provenance interesting',
        'Sets more valuable'
      ]
    },
    marketIntelligence: {
      currentDemand: 'steady',
      priceFactors: [
        { factor: 'Pre-1900 with label', impact: '+100-200%' },
        { factor: 'Original cane seat', impact: '+30%' },
        { factor: 'Set of 4 or more', impact: '+50% per chair' },
        { factor: 'Cane damage/replacement', impact: '-15%' },
        { factor: 'No label/marks', impact: '-30%' }
      ],
      bestVenues: [
        '1stDibs (vintage)',
        'eBay (volume)',
        'Local vintage shops',
        'Estate sales'
      ],
      targetBuyers: [
        'Café and restaurant owners',
        'Home decorators',
        'Design history enthusiasts',
        'Set collectors'
      ],
      seasonality: 'Steady year-round. Restaurant buyers active in spring.',
      trend: 'Stable. Enduring classic design always in demand.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Age uncertain', question: 'Are there any labels or marks? Thonet marks help date the chair.' },
        { condition: 'Seat type unclear', question: 'Is this a hand-woven cane seat or pressed plywood?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify authenticity', request: 'Photo of any labels or stamps', reason: 'Period marks help with dating and value' },
        { condition: 'Seat condition unclear', request: 'Photo of seat from above', reason: 'Cane condition affects value' }
      ],
      clarify: [
        { condition: 'Model unclear', clarification: 'Is this the No. 14, No. 18, or another model?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Photograph labels clearly - essential for value',
        'Cane can be repaired/replaced affordably',
        'Sets sell much better than singles',
        'Original finish preferred over stripped'
      ],
      buyerTips: [
        'Check that bends are solid wood, not laminated',
        'Cane replacement is straightforward',
        'Look for matching sets',
        'Compare marks to dating guides'
      ],
      commonMistakes: [
        'Assuming all bentwood is Thonet (many manufacturers)',
        'Overlooking label importance',
        'Discarding chairs with broken cane',
        'Not recognizing value of sets'
      ],
      hiddenValue: [
        'Pre-1900 examples increasingly valuable',
        'Unusual models (armchairs, settees) command premium',
        'Restaurant/café provenance adds interest',
        'Original packaging (rare) valuable'
      ],
      storySellsFor: 'Michael Thonet\'s No. 14 is the most produced chair in history - over 50 million made and counting. With just six components and ten screws, it could be shipped worldwide knocked down, revolutionizing furniture. When you sit in one, you\'re sitting in design history - the same chair in Paris cafés since 1859.'
    }
  },

  {
    itemId: 'furn-010', // Noguchi Coffee Table
    instantRecognition: {
      silhouette: 'Organic, sculptural form. Freeform glass top floats on two interlocking curved wood pieces that seem to dance together.',
      keyVisualMarkers: [
        'Biomorphic curved glass top',
        'Two identical wood base pieces',
        'Base pieces interlock without hardware',
        'Glass sits on single point of each base',
        'Sculptural, art-meets-furniture appearance'
      ],
      instantRedFlags: [
        'Hardware connecting base pieces',
        'Glass shape incorrect (too regular)',
        'Base proportions wrong',
        'Poor quality wood or finish'
      ]
    },
    visualCues: {
      construction: [
        'Two identical ebonized or walnut base pieces',
        'Base pieces pivot and interlock',
        'Glass sits on small pads on base',
        'No mechanical connections',
        '3/4" thick glass standard'
      ],
      materials: [
        'Base: walnut or ebonized ash',
        'Top: 3/4" plate glass with polished edge',
        'Modern version: also birch option',
        'Rubber pads where glass meets base'
      ],
      proportions: [
        '15.75"H x 50"W x 36"D standard',
        'Glass thickness 3/4"',
        'Base curves are precise',
        'Proportions mathematically determined'
      ],
      finish: [
        'Base has satin finish',
        'Ebonized should be consistent',
        'Walnut should show grain',
        'Glass edge polished, not sharp'
      ],
      hardware: [
        'No visible hardware',
        'Rubber pads only contact points',
        'Some versions have felt pads'
      ],
      marks: [
        'Herman Miller medallion (varies by era)',
        'Noguchi signature stamp (some periods)',
        'Vitra marking (European production)',
        'Serial number on base'
      ],
      wear: [
        'Base may show minor scratches',
        'Glass edge may show chips',
        'Pads may need replacement',
        'Ebonized finish may show wear'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full table from above', reason: 'Show glass shape and base relationship' },
        { location: 'Base medallion/mark', reason: 'Verify manufacturer' },
        { location: 'Base detail', reason: 'Show wood and construction quality' }
      ],
      helpful: [
        { location: 'Glass edge', reason: 'Condition assessment' },
        { location: 'Profile view', reason: 'Show sculptural proportions' }
      ],
      forAuthentication: [
        { location: 'All marks and labels', reason: 'Essential for authentication' },
        { location: 'Where base pieces meet', reason: 'Show interlocking mechanism' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Herman Miller or Vitra medallion',
        'Correct glass shape (precise curves)',
        'Base pieces interlock without hardware',
        'Quality wood and finish',
        'Proper weight'
      ],
      fakeIndicators: [
        'No manufacturer marks',
        'Hardware joining base pieces',
        'Wrong glass shape',
        'Lightweight or poor quality',
        'Wrong proportions'
      ],
      commonReproductions: [
        'Quality licensed reproductions (exist)',
        'Unlicensed copies (numerous)',
        '"Inspired by" versions',
        'Period knockoffs'
      ],
      ageIndicators: [
        '1948: Original design',
        '1947-1973: First Herman Miller production',
        '1984: Reissued by Herman Miller',
        'Current: Herman Miller and Vitra'
      ],
      provenance: [
        'Original 1950s-60s production collectible',
        'First editions most valuable',
        'Receipt or documentation helpful'
      ]
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Vintage 1950s-60s production', impact: '+50-100%' },
        { factor: 'Ebonized ash finish', impact: '+10%' },
        { factor: 'Original glass intact', impact: '+15%' },
        { factor: 'Replacement glass', impact: '-15%' },
        { factor: 'No marks/medallion', impact: '-40-60%' }
      ],
      bestVenues: [
        'Wright Auctions (design specialist)',
        '1stDibs (verified dealers)',
        'Herman Miller dealers (new)',
        'Design Within Reach'
      ],
      targetBuyers: [
        'Mid-century modern collectors',
        'Interior designers',
        'Sculpture enthusiasts',
        'Architecture offices'
      ],
      seasonality: 'Steady year-round. Design auctions in spring/fall.',
      trend: 'Classic status maintains value. Early examples appreciate.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'No mark visible', question: 'Is there a Herman Miller medallion or any manufacturer mark on the base?' },
        { condition: 'Glass condition unclear', question: 'Is this the original glass or a replacement?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify authenticity', request: 'Photo of base showing any marks or medallion', reason: 'Marks essential for authentication and value' },
        { condition: 'Base construction unclear', request: 'Photo showing how base pieces interlock', reason: 'Authentic pieces interlock without hardware' }
      ],
      clarify: [
        { condition: 'Age uncertain', clarification: 'Do you know approximately when this was purchased?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Find and photograph medallion - essential for value',
        'Original glass adds significant value',
        'Vintage examples increasingly valuable',
        'Note any documentation'
      ],
      buyerTips: [
        'Verify manufacturer marks - many fakes exist',
        'Check that bases interlock properly',
        'Examine glass for original grinding',
        'Compare proportions to authentic examples'
      ],
      commonMistakes: [
        'Assuming all similar tables are Noguchi',
        'Not checking for marks',
        'Discounting importance of original glass',
        'Paying authentic prices for reproductions'
      ],
      hiddenValue: [
        'First production run (1947-49) very valuable',
        'Original packaging (rare)',
        'Documented provenance',
        'Prototype or unusual variations'
      ],
      storySellsFor: 'Isamu Noguchi was a sculptor first, and this table is really a sculpture you can use. He designed it in 1944 for the president of MoMA, and it became an instant icon. The two identical base pieces create an elegant visual puzzle - architecture, sculpture, and furniture merged into one timeless form.'
    }
  }
]

/**
 * CERAMICS & POTTERY EXPERTISE
 */
const ceramicsKnowledge: ExpertKnowledgeEntry[] = [
  {
    itemId: 'ceram-001', // Rookwood Standard Glaze Vase
    instantRecognition: {
      silhouette: 'Classic vase forms with hand-painted underglaze decoration. Warm amber/brown "Standard Glaze" creates a distinctive glow. Cincinnati\'s finest art pottery.',
      keyVisualMarkers: [
        'Warm amber/brown glaze (Standard Glaze)',
        'Hand-painted floral or portrait decoration',
        'Slip-painted technique showing brushwork',
        'Impressed flame mark on base',
        'Artist initials or cipher'
      ],
      instantRedFlags: [
        'Glossy uniform glaze (not slip-painted)',
        'Decal decoration (not hand-painted)',
        'No flame mark',
        'Wrong clay body color'
      ]
    },
    visualCues: {
      construction: [
        'Thrown or molded forms',
        'Hand-painted underglaze decoration',
        'Applied handles (some forms)',
        'Consistent wall thickness'
      ],
      materials: [
        'Fine-grained clay body',
        'Lead-based glaze (early) or zinc-based (later)',
        'Slip paints for decoration',
        'Properly vitrified body'
      ],
      proportions: [
        'Wide variety of sizes and shapes',
        'Shape numbers correspond to specific forms',
        'Proportions match period catalogs'
      ],
      finish: [
        'Standard Glaze: warm amber/brown with depth',
        'Iris Glaze: softer background colors',
        'Vellum: matte-like surface',
        'Sea Green, Aerial Blue other lines'
      ],
      hardware: [
        'N/A'
      ],
      marks: [
        'RP reverse flame mark',
        'Roman numeral date system (1886-1900)',
        'Arabic date codes (1901+)',
        'Shape numbers and size letters',
        'Artist initials or cipher'
      ],
      wear: [
        'Minor crazing acceptable in some glazes',
        'Chips affect value significantly',
        'Original condition most valuable'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full view showing decoration', reason: 'Identify pattern and artist work' },
        { location: 'Base showing marks', reason: 'Date, artist, shape number identification' },
        { location: 'Decoration close-up', reason: 'Assess hand-painted quality' }
      ],
      helpful: [
        { location: 'Artist signature detail', reason: 'Artist attribution affects value' },
        { location: 'Any damage areas', reason: 'Condition critical for value' }
      ],
      forAuthentication: [
        { location: 'Flame mark close-up', reason: 'Verify authentic Rookwood mark' },
        { location: 'Clay body at base', reason: 'Proper clay color and texture' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Reverse RP flame mark',
        'Consistent dating system',
        'Known artist ciphers',
        'Proper clay body (white to light pink)',
        'Hand-painted brushwork visible'
      ],
      fakeIndicators: [
        'Fuzzy or poorly struck marks',
        'Wrong date format',
        'Unknown artist ciphers',
        'Decal or transfer decoration',
        'Wrong clay body color'
      ],
      commonReproductions: [
        'Modern unmarked copies',
        'Roseville or Weller misattributed',
        'Transfer-decorated fakes'
      ],
      ageIndicators: [
        '1880-1890: Early experimental period',
        '1890-1910: Standard Glaze height',
        '1900-1915: Vellum and matte glazes',
        '1915-1940: Later production, industrial glazes'
      ],
      provenance: [
        'Exhibition pieces most valuable',
        'Important artist work premium',
        'Original sales receipts helpful',
        'Cincinnati collection history'
      ]
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Important artist (Valentien, Shirayamadani)', impact: '+100-500%' },
        { factor: 'Portrait decoration', impact: '+200-400%' },
        { factor: 'Large size (12"+)', impact: '+50-100%' },
        { factor: 'Chips or repairs', impact: '-50-75%' },
        { factor: 'Common floral decoration', impact: 'Baseline' }
      ],
      bestVenues: [
        'Humler & Nolan (Rookwood specialists)',
        'Rago Arts',
        'Treadway/Toomey',
        'Cowan\'s'
      ],
      targetBuyers: [
        'American art pottery collectors',
        'Arts & Crafts enthusiasts',
        'Cincinnati collectors',
        'Museum acquisitions'
      ],
      seasonality: 'Best at fall art pottery auctions. Steady year-round.',
      trend: 'Important pieces strong. Common production more price-sensitive.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Cannot see marks', question: 'Is there a Rookwood flame mark on the base? What date does it show?' },
        { condition: 'Artist unclear', question: 'Are there artist initials on the piece? Important artists add significant value.' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify marks', request: 'Photo of base showing flame mark and date', reason: 'Dating and authentication essential' },
        { condition: 'Artist uncertain', request: 'Close-up of any artist cipher or initials', reason: 'Artist attribution significantly affects value' }
      ],
      clarify: [
        { condition: 'Glaze type unclear', clarification: 'Is this Standard Glaze (amber/brown), Iris, Vellum, or another line?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Research artist - some are highly collected',
        'Photograph marks carefully',
        'Note any exhibition labels or history',
        'Condition is crucial - be transparent'
      ],
      buyerTips: [
        'Learn to read date codes',
        'Study important artist ciphers',
        'Check for restoration under UV light',
        'Compare to reference books'
      ],
      commonMistakes: [
        'Confusing Rookwood with Roseville',
        'Not identifying artist work',
        'Missing restoration',
        'Overpaying for damaged pieces'
      ],
      hiddenValue: [
        'Portrait pieces by any artist valuable',
        'Architectural tiles and plaques',
        'Art Deco period pieces rising',
        'Pieces with exhibition history'
      ],
      storySellsFor: 'Rookwood was America\'s first successful art pottery, founded in Cincinnati in 1880. Each piece was signed by the artist who decorated it - these weren\'t anonymous factory workers but trained artists. When you see a cipher, you\'re seeing a real person\'s mark from over a century ago.'
    }
  },

  {
    itemId: 'ceram-002', // Chinese Blue and White Ginger Jar
    instantRecognition: {
      silhouette: 'Classic ovoid ginger jar form with domed lid. Blue decoration on white porcelain body. Timeless form spanning centuries.',
      keyVisualMarkers: [
        'Ovoid body with high shoulder',
        'Domed lid (may be missing)',
        'Cobalt blue underglaze decoration',
        'White porcelain body',
        'Traditional Chinese motifs'
      ],
      instantRedFlags: [
        'Printed rather than hand-painted decoration',
        'Too-perfect brushwork',
        'Wrong blue tone for claimed period',
        'Modern base marks'
      ]
    },
    visualCues: {
      construction: [
        'Wheel-thrown porcelain body',
        'Hand-painted cobalt decoration',
        'Glazed overall',
        'Foot rim characteristics vary by period',
        'Lid may be original or later'
      ],
      materials: [
        'Porcelain (high-fired ceramic)',
        'Cobalt oxide pigment for blue',
        'Clear feldspathic glaze',
        'Kaolin clay body'
      ],
      proportions: [
        'Height typically 8-18 inches',
        'Width roughly 60-70% of height',
        'Foot rim proportional to body',
        'Lid height matches body period'
      ],
      finish: [
        'Glaze should have depth',
        'Cobalt tone varies by period',
        'Early: darker, often with heaping/piling',
        'Later: more even, controlled blue'
      ],
      hardware: [
        'N/A'
      ],
      marks: [
        'Reign marks (may not indicate actual period)',
        'Apocryphal marks common',
        'Foot rim and base characteristics',
        'Modern marks: "Made in China"'
      ],
      wear: [
        'Wear on foot rim expected',
        'Glaze pooling at base',
        'Appropriate wear for age',
        'Later versions may be perfect'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full jar with decoration visible', reason: 'Identify pattern and quality' },
        { location: 'Base showing foot rim and any marks', reason: 'Critical for dating and authentication' },
        { location: 'Decoration close-up', reason: 'Assess hand-painting quality' }
      ],
      helpful: [
        { location: 'Lid detail if present', reason: 'Matched vs replacement lid' },
        { location: 'Glaze pooling at base', reason: 'Age indicator' }
      ],
      forAuthentication: [
        { location: 'Foot rim profile', reason: 'Foot rim shape helps date' },
        { location: 'Blue pigment close-up', reason: 'Blue tone indicates period' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Foot rim characteristics match period',
        'Blue tone appropriate for era',
        'Hand-painted brushwork variations',
        'Proper weight and feel',
        'Glaze characteristics consistent'
      ],
      fakeIndicators: [
        'Too-perfect decoration',
        'Machine-printed patterns',
        'Wrong foot rim style for mark',
        'Artificially aged surfaces',
        'Wrong blue chemistry'
      ],
      commonReproductions: [
        '19th century copies of earlier pieces',
        '20th century reproductions',
        'Modern mass-produced copies',
        'Vietnamese and other Asian copies'
      ],
      ageIndicators: [
        'Ming Dynasty (1368-1644): darker, heaped cobalt',
        'Kangxi (1662-1722): finest quality, prized',
        '18th century: varied quality',
        '19th century: export and domestic',
        '20th century: reproduction and decorative'
      ],
      provenance: [
        'Old European collection provenance valuable',
        'Inventory numbers important',
        'Previous auction records helpful',
        'Documentation of age'
      ]
    },
    marketIntelligence: {
      currentDemand: 'steady',
      priceFactors: [
        { factor: 'Kangxi period (genuine)', impact: '+500-1000%' },
        { factor: 'Complete with original lid', impact: '+30-50%' },
        { factor: 'Fine painting quality', impact: '+50-100%' },
        { factor: 'Chips or hairlines', impact: '-40-60%' },
        { factor: '19th/20th century', impact: 'Baseline' }
      ],
      bestVenues: [
        'Christie\'s Asian art',
        'Sotheby\'s Asian art',
        'Bonhams',
        'Specialist Asian art dealers'
      ],
      targetBuyers: [
        'Chinese ceramics collectors',
        'Asian art collectors',
        'Interior designers',
        'Lamp converters (careful!)'
      ],
      seasonality: 'Major Asian art sales in spring and fall. Hong Kong sales important.',
      trend: 'Kangxi and earlier strong. Later pieces price-sensitive. Chinese buyers drive market.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Age uncertain', question: 'Is there any mark on the base, or has the period been professionally assessed?' },
        { condition: 'Lid status unclear', question: 'Is the lid original to the jar, or a later replacement?' }
      ],
      requestPhoto: [
        { condition: 'Cannot assess age', request: 'Photo of base showing foot rim and any marks', reason: 'Foot rim style is critical for dating' },
        { condition: 'Blue quality unclear', request: 'Close-up of decoration showing brushwork', reason: 'Brushwork quality affects value significantly' }
      ],
      clarify: [
        { condition: 'Period uncertain', clarification: 'Has this been dated by a specialist? Reign marks are often apocryphal.' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Get professional attribution if possible',
        'Photograph base and foot rim carefully',
        'Document any provenance',
        'Don\'t clean aggressively - patina matters'
      ],
      buyerTips: [
        'Study foot rim characteristics',
        'Reign marks don\'t indicate actual age',
        'Learn to spot modern printing',
        'Handle genuine pieces when possible'
      ],
      commonMistakes: [
        'Believing reign marks indicate actual period',
        'Missing later replacements of lids',
        'Not recognizing modern copies',
        'Overpaying for decorative pieces'
      ],
      hiddenValue: [
        'Provenance from old European collections',
        'Pieces converted to lamps (sometimes valuable underneath)',
        'Unusual subjects (dragons, figures)',
        'Pairs or sets'
      ],
      storySellsFor: 'Chinese blue and white porcelain has been treasured worldwide since the Ming Dynasty - Marco Polo brought pieces to Europe. The ginger jar form was used to transport ginger root, but became prized for beauty. Each one represents centuries of ceramic mastery that the West couldn\'t replicate until the 18th century.'
    }
  },

  {
    itemId: 'ceram-003', // Roseville Pinecone
    instantRecognition: {
      silhouette: 'Organic flowing forms with naturalistic pinecone and branch relief decoration. Distinctive matte glaze surface.',
      keyVisualMarkers: [
        'Raised pinecone motifs in high relief',
        'Branch/twig handles typical',
        'Matte glaze finish (not glossy)',
        'Green, blue, or brown colorways',
        'Sharp, crisp molded details'
      ],
      instantRedFlags: [
        'Glossy glaze finish',
        'Soft or mushy relief detail',
        'Wrong color palette',
        'Lightweight feel',
        'No impressed marks'
      ]
    },
    visualCues: {
      construction: [
        'Molded construction with applied handles',
        'Visible mold seams on some pieces',
        'Drain hole in bottom (most pieces)',
        'Consistent wall thickness'
      ],
      materials: [
        'Dense earthenware body',
        'Matte glaze with subtle variation',
        'Hand-applied glaze creates natural variation',
        'Proper weight for size'
      ],
      proportions: [
        'Wide range of sizes from 4" to 15"',
        'Proportions match catalog forms',
        'Shape numbers correspond to specific designs'
      ],
      finish: [
        'Matte glaze essential - no gloss',
        'Slight color variation within piece',
        'Glazed interior on vases',
        'Unglazed ring on base'
      ],
      hardware: [
        'N/A - no hardware'
      ],
      marks: [
        'ROSEVILLE impressed in block letters',
        'U.S.A. impressed (some pieces)',
        'Shape number impressed',
        'Paper label (rarely survives)'
      ],
      wear: [
        'Small chips acceptable if minor',
        'Crazing in glaze affects value',
        'Mint examples command premium'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Bottom/base', reason: 'Show impressed marks and shape number' },
        { location: 'Relief decoration close-up', reason: 'Assess mold detail quality' },
        { location: 'Overall form', reason: 'Identify specific shape/model' }
      ],
      helpful: [
        { location: 'Interior', reason: 'Show glaze coverage and any damage' },
        { location: 'Any damage areas', reason: 'Chips, cracks, repairs must be disclosed' }
      ],
      forAuthentication: [
        { location: 'Mark close-up with scale', reason: 'Verify authentic Roseville marks' },
        { location: 'Glaze texture close-up', reason: 'Confirm matte finish' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'ROSEVILLE impressed clearly',
        'Sharp, crisp relief detail',
        'Proper matte glaze',
        'Appropriate weight',
        'Shape numbers match catalog'
      ],
      fakeIndicators: [
        'Soft relief detail',
        'Wrong mark style or font',
        'Glossy glaze',
        'Lightweight',
        'Wrong proportions'
      ],
      commonReproductions: [
        'Modern reproductions (usually unmarked or wrong marks)',
        'Period reproductions by other potteries',
        'Fake Roseville marks on generic pottery'
      ],
      ageIndicators: [
        'Pinecone produced 1931-1954',
        'Early pieces may have paper labels',
        'Later production has clearer mold detail initially'
      ],
      provenance: [
        'Original purchase receipts rare',
        'Family ownership history helpful',
        'Documented collection history adds value'
      ]
    },
    marketIntelligence: {
      currentDemand: 'steady',
      priceFactors: [
        { factor: 'Blue colorway', impact: '+20-30% (most popular)' },
        { factor: 'Large floor vases (14"+)', impact: '+100-200%' },
        { factor: 'Unusual forms', impact: '+50-100%' },
        { factor: 'Chips or repairs', impact: '-50-75%' },
        { factor: 'Crazing', impact: '-20-40%' }
      ],
      bestVenues: [
        'Ruby Lane (online)',
        'eBay (high volume)',
        'American art pottery shows',
        'Local antique dealers'
      ],
      targetBuyers: [
        'Roseville pattern collectors',
        'American art pottery collectors',
        'Decorators seeking vintage pieces',
        'Beginning collectors (accessible prices)'
      ],
      seasonality: 'Steady year-round. Spring and fall antique show seasons slightly stronger.',
      trend: 'Stable. Less speculative than during 1990s boom but maintains collector interest.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Cannot see mark', question: 'Is there a ROSEVILLE mark impressed on the bottom?' },
        { condition: 'Color unclear', question: 'What is the primary color? Green, blue, and brown are the standard Pinecone colors.' },
        { condition: 'Condition uncertain', question: 'Are there any chips, cracks, or repairs that might not show in photos?' }
      ],
      requestPhoto: [
        { condition: 'Cannot see base', request: 'Photo of the bottom showing any marks', reason: 'Marks are essential for authentication and value' },
        { condition: 'Damage suspected', request: 'Close-up of any chips or damage areas', reason: 'Condition significantly affects value' }
      ],
      clarify: [
        { condition: 'Shape unclear', clarification: 'Do you know the shape number? It helps identify the specific form and value.' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Clean gently - never scrub matte glaze',
        'Photograph marks clearly with good lighting',
        'Measure height and include shape number',
        'Disclose any damage honestly'
      ],
      buyerTips: [
        'Check for hidden chips around handles',
        'Run finger around rim for chips',
        'Verify marks match authentic examples',
        'Compare proportions to catalog images'
      ],
      commonMistakes: [
        'Assuming all "Roseville" is valuable (many patterns are common)',
        'Not checking marks carefully',
        'Overlooking chips in relief decoration',
        'Paying premium for damaged pieces'
      ],
      hiddenValue: [
        'Wall pockets and jardinieres often undervalued',
        'Matching pairs worth more than double singles',
        'Unusual color variations (experimental)',
        'Large floor vases increasingly scarce'
      ],
      storySellsFor: 'Roseville Pottery brought art into American homes during the Depression. The Pinecone pattern, introduced in 1931, captures the Arts & Crafts love of nature with production efficiency - democratic luxury.'
    }
  },

  {
    itemId: 'ceram-004', // Wedgwood Jasperware Urn
    instantRecognition: {
      silhouette: 'Classical urn or vase form with white relief decoration on colored (typically blue) matte stoneware body. Neoclassical elegance.',
      keyVisualMarkers: [
        'Matte (unglazed) stoneware body',
        'White relief figures and decoration',
        'Blue, green, lilac, or black body colors',
        'Classical motifs: muses, sacrifice, etc.',
        'Crisp, sharp relief detail'
      ],
      instantRedFlags: [
        'Glossy surface',
        'Soft or mushy relief detail',
        'Wrong colors or proportions',
        'No WEDGWOOD mark'
      ]
    },
    visualCues: {
      construction: [
        'Solid jasper (colored throughout) or jasper dip (applied color)',
        'Relief decoration applied separately',
        'Thrown or molded forms',
        'Interiors may be glazed or unglazed'
      ],
      materials: [
        'Jasperware stoneware body',
        'Barium sulfate gives white color',
        'Metal oxides for body colors',
        'High-fired, vitrified body'
      ],
      proportions: [
        'Classical urn proportions',
        'Heights from 3 inches to 18+ inches',
        'Proportions follow classical models'
      ],
      finish: [
        'Matte, unglazed surface (most)',
        'Some pieces with glazed interior',
        'Relief should be crisp',
        'Body color even and consistent'
      ],
      hardware: [
        'N/A'
      ],
      marks: [
        'WEDGWOOD impressed (note: one D)',
        'ENGLAND (post-1891)',
        'MADE IN ENGLAND (post-1908)',
        'Letter date codes (1860-1929)',
        'Three-letter codes (1930+)'
      ],
      wear: [
        'Minor chips to relief acceptable',
        'Staining from display',
        'Firing cracks (period acceptable)',
        'Heavy damage affects value'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full piece showing form and decoration', reason: 'Pattern and form identification' },
        { location: 'Base showing marks', reason: 'Dating and authentication' },
        { location: 'Relief detail close-up', reason: 'Assess quality and crispness' }
      ],
      helpful: [
        { location: 'Any damage areas', reason: 'Condition assessment' },
        { location: 'Color in natural light', reason: 'Accurate color identification' }
      ],
      forAuthentication: [
        { location: 'WEDGWOOD mark close-up', reason: 'Verify authentic mark' },
        { location: 'Date letters if present', reason: 'Dating' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'WEDGWOOD impressed (not WEDGEWOOD)',
        'Crisp relief detail',
        'Proper matte surface',
        'Appropriate mark for period',
        'Correct body color chemistry'
      ],
      fakeIndicators: [
        'WEDGEWOOD (extra E = fake)',
        'Soft relief detail',
        'Wrong color tones',
        'No marks',
        'Glossy surface'
      ],
      commonReproductions: [
        'Adams jasperware (legitimate competitor)',
        'German and other European copies',
        'Modern reproductions',
        'Transfer-printed imitations'
      ],
      ageIndicators: [
        '1774-1795: Early period, most valuable',
        '1795-1850: Excellent quality continues',
        '1850-1900: Victorian production',
        '1900-present: Continues today'
      ],
      provenance: [
        'Early pieces rare and valuable',
        'Royal commissions premium',
        'Exhibition history important',
        'Color variations matter'
      ]
    },
    marketIntelligence: {
      currentDemand: 'steady',
      priceFactors: [
        { factor: '18th century production', impact: '+200-500%' },
        { factor: 'Rare colors (lilac, green)', impact: '+50-100%' },
        { factor: 'Large size (12"+)', impact: '+50-100%' },
        { factor: 'Portland Vase form', impact: '+100-200%' },
        { factor: 'Chips to relief', impact: '-30-50%' }
      ],
      bestVenues: [
        'Christie\'s and Sotheby\'s (fine examples)',
        'Skinner Auctions',
        'eBay (common pieces)',
        'Replacements.com'
      ],
      targetBuyers: [
        'Wedgwood collectors',
        'English ceramics enthusiasts',
        'Neoclassical decor',
        'Gift buyers'
      ],
      seasonality: 'Steady year-round. Gift-giving seasons slightly stronger.',
      trend: 'Early pieces strong. Later production stable. Black basalt also collected.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Age uncertain', question: 'Is there a WEDGWOOD mark, and are there date letters?' },
        { condition: 'Color uncertain', question: 'What is the body color? Blue is most common but others exist.' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify mark', request: 'Photo of base showing WEDGWOOD mark', reason: 'Mark style helps date and authenticate' },
        { condition: 'Condition unclear', request: 'Close-up of any damage areas', reason: 'Chips to relief significantly affect value' }
      ],
      clarify: [
        { condition: 'Type unclear', clarification: 'Is this solid jasper or jasper dip? (solid color throughout vs. applied)' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Verify spelling: WEDGWOOD not WEDGEWOOD',
        'Research date letters',
        'Note any damage honestly',
        'Rare colors worth more'
      ],
      buyerTips: [
        'Check for WEDGEWOOD (fake spelling)',
        'Learn date letter system',
        'Examine relief for chips',
        'Color affects value'
      ],
      commonMistakes: [
        'Accepting WEDGEWOOD as genuine (extra E = fake)',
        'Not recognizing date letters',
        'Overpaying for common pieces',
        'Missing chips in relief'
      ],
      hiddenValue: [
        '18th century pieces often underrecognized',
        'Unusual forms (medallions, plaques)',
        'Rare colors command premium',
        'Complete sets (tea services, etc.)'
      ],
      storySellsFor: 'Josiah Wedgwood invented jasperware in the 1770s after thousands of experiments. The white relief figures against the "Wedgwood blue" became an instant icon of British taste. Each piece represents the Industrial Revolution meeting classical beauty - democratic luxury that brought museum-quality decoration into middle-class homes.'
    }
  },

  {
    itemId: 'ceram-005', // Meissen Porcelain Figurine
    instantRecognition: {
      silhouette: 'Elegant porcelain figurine with delicate modeling and hand-painted decoration. Often pastoral or mythological subjects. Europe\'s first and finest porcelain.',
      keyVisualMarkers: [
        'Fine hard-paste porcelain',
        'Detailed modeling',
        'Hand-painted decoration',
        'Gilt highlights',
        'Crossed swords mark'
      ],
      instantRedFlags: [
        'Blurry crossed swords',
        'Poor quality painting',
        'Wrong mark style for claimed period',
        'Crude modeling'
      ]
    },
    visualCues: {
      construction: [
        'Slip-cast porcelain',
        'Multiple piece assembly',
        'Hand-finished details',
        'Hollow construction'
      ],
      materials: [
        'Hard-paste porcelain',
        'Overglaze enamel colors',
        'Gold gilding',
        'Proper weight for size'
      ],
      proportions: [
        'Heights from 3 inches to 24+ inches',
        'Figures have refined proportions',
        'Period-appropriate styling'
      ],
      finish: [
        'Smooth, glossy glaze',
        'Careful painting within lines',
        'Gilt showing appropriate wear',
        'Some unglazed areas (biscuit)'
      ],
      hardware: [
        'N/A'
      ],
      marks: [
        'Crossed swords (style varies by period)',
        'Incised model numbers',
        'Painter\'s marks sometimes present',
        'Modern pieces have additional marks'
      ],
      wear: [
        'Gilt wear expected on old pieces',
        'Minor chips affect value',
        'Repairs common - check carefully',
        'Fingers and extremities vulnerable'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full figurine, multiple angles', reason: 'Show modeling quality and condition' },
        { location: 'Base showing crossed swords', reason: 'Critical for authentication' },
        { location: 'Painting detail', reason: 'Assess quality' }
      ],
      helpful: [
        { location: 'Any damage areas', reason: 'Condition critical' },
        { location: 'Model number if visible', reason: 'Identification' }
      ],
      forAuthentication: [
        { location: 'Crossed swords close-up', reason: 'Mark style dates piece' },
        { location: 'Incised numbers', reason: 'Model identification' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Crossed swords appropriate for period',
        'High-quality modeling',
        'Careful painting',
        'Proper porcelain weight',
        'Incised model numbers'
      ],
      fakeIndicators: [
        'Wrong sword style for claimed age',
        'Crude modeling',
        'Sloppy painting',
        'Wrong weight',
        'Modern marks on "antique" piece'
      ],
      commonReproductions: [
        'Dresden copies (various makers)',
        'Sitzendorf reproductions',
        'Modern Chinese copies',
        'After-market decoration of blanks'
      ],
      ageIndicators: [
        '1710-1720: Very early, extremely valuable',
        '1720-1774: Great period',
        '1774-1814: Marcolini period',
        '1814-1860: Various mark styles',
        '1860-present: Modern production'
      ],
      provenance: [
        'Royal collections prestigious',
        'Period documentation valuable',
        'Exhibition history important',
        'Major collection provenance'
      ]
    },
    marketIntelligence: {
      currentDemand: 'steady',
      priceFactors: [
        { factor: '18th century production', impact: '+200-1000%' },
        { factor: 'Important modeler (Kandler, etc.)', impact: '+100-500%' },
        { factor: 'Pair or set', impact: '+50-100%' },
        { factor: 'Repairs or damage', impact: '-40-70%' },
        { factor: 'Modern production', impact: 'Baseline' }
      ],
      bestVenues: [
        'Christie\'s European ceramics',
        'Bonhams',
        'Specialist porcelain dealers',
        'European auction houses'
      ],
      targetBuyers: [
        'Meissen collectors',
        'European porcelain enthusiasts',
        'Decorators',
        'Museums'
      ],
      seasonality: 'Best at major European ceramics sales. London and Continental.',
      trend: '18th century masterpieces strong. Later production more price-sensitive.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Age uncertain', question: 'What style of crossed swords mark does it have? The style helps date the piece.' },
        { condition: 'Model uncertain', question: 'Is there an incised model number on the base?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify mark', request: 'Clear photo of crossed swords mark', reason: 'Mark style is essential for dating' },
        { condition: 'Condition unclear', request: 'Photos of any repairs or damage', reason: 'Condition significantly affects value' }
      ],
      clarify: [
        { condition: 'Origin uncertain', clarification: 'Is this marked Meissen or could it be Dresden/other?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Learn crossed swords dating',
        'Check for repairs under UV light',
        'Research model numbers',
        'Note any provenance'
      ],
      buyerTips: [
        'Study crossed swords mark evolution',
        'Dresden is not Meissen',
        'Check extremities for repairs',
        'Model numbers help authenticate'
      ],
      commonMistakes: [
        'Assuming all crossed swords are Meissen',
        'Missing hidden repairs',
        'Not checking sword style against claimed age',
        'Confusing Dresden with Meissen'
      ],
      hiddenValue: [
        '18th century pieces by major modelers',
        'Unusual models or subjects',
        'Complete groups or sets',
        'Documented provenance'
      ],
      storySellsFor: 'Meissen was Europe\'s first hard-paste porcelain factory, founded in 1710 after Johann Friedrich Böttger cracked the Chinese secret. For decades Meissen was the only European source of true porcelain. The crossed swords mark has been used since 1720 - the world\'s oldest continuous porcelain trademark.'
    }
  },

  {
    itemId: 'ceram-006', // Fiestaware
    instantRecognition: {
      silhouette: 'Art Deco dinnerware with distinctive concentric ring pattern and bold solid colors. Streamlined, modern forms.',
      keyVisualMarkers: [
        'Concentric ring design',
        'Bold solid colors',
        'Streamlined shapes',
        'FIESTA incised mark',
        'Glazed inside and out'
      ],
      instantRedFlags: [
        'Wrong colors for claimed period',
        'No FIESTA mark (most pieces)',
        'Wrong ring pattern',
        'Crude or uneven glaze'
      ]
    },
    visualCues: {
      construction: [
        'Molded earthenware',
        'Concentric rings are defining feature',
        'Consistent forms across colors',
        'Lead-glazed (original) or lead-free (later)'
      ],
      materials: [
        'Semi-vitreous earthenware',
        'Colored glazes',
        'Some early glazes contain uranium (radioactive red)',
        'Lead-free glazes post-1986'
      ],
      proportions: [
        'Standardized sizes',
        'Plates: 6", 7", 9", 10"',
        'Bowls, cups, serving pieces in consistent sizes'
      ],
      finish: [
        'High-gloss glaze',
        'Color consistent across surface',
        'Minor crazing acceptable (common)',
        'Foot ring usually unglazed'
      ],
      hardware: [
        'N/A'
      ],
      marks: [
        'FIESTA incised (most pieces)',
        'HLC USA (Homer Laughlin)',
        'GENUINE FIESTA (post-1986)',
        'Made in USA'
      ],
      wear: [
        'Utensil marks acceptable',
        'Minor chips affect value',
        'Crazing common',
        'Color consistency matters'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full piece showing color', reason: 'Color identification critical' },
        { location: 'Base showing marks', reason: 'Verify FIESTA mark' },
        { location: 'Any damage', reason: 'Condition affects value' }
      ],
      helpful: [
        { location: 'Rings pattern detail', reason: 'Verify authentic pattern' },
        { location: 'Color comparison if multiple', reason: 'Color variations' }
      ],
      forAuthentication: [
        { location: 'FIESTA mark close-up', reason: 'Verify authentic marking' },
        { location: 'Glaze quality', reason: 'Original vs reproduction' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'FIESTA incised mark',
        'Correct ring pattern',
        'Proper colors for period',
        'HLC USA mark',
        'Correct glaze weight'
      ],
      fakeIndicators: [
        'Wrong ring pattern',
        'Colors not in original palette',
        'No marks',
        'Wrong weight or proportions'
      ],
      commonReproductions: [
        'Post-1986 Fiesta (legitimate, different colors)',
        'Harlequin (related line, different pattern)',
        'Riviera (related line)',
        'Other companies\' solid color ware'
      ],
      ageIndicators: [
        '1936-1943: Original 5 colors (red, blue, green, yellow, ivory)',
        '1943-1959: Varied colors, no red',
        '1959-1969: Limited colors',
        '1986-present: Reintroduction, many new colors'
      ],
      provenance: [
        'Complete sets more valuable',
        'Original color groups',
        'Rare pieces well documented'
      ]
    },
    marketIntelligence: {
      currentDemand: 'steady',
      priceFactors: [
        { factor: 'Original red (radioactive orange)', impact: '+100-300%' },
        { factor: 'Medium green (1959-69)', impact: '+100-200%' },
        { factor: 'Rare forms (covered onion soup)', impact: '+200-500%' },
        { factor: 'Chips or cracks', impact: '-50-75%' },
        { factor: 'Post-1986 production', impact: 'Lower baseline' }
      ],
      bestVenues: [
        'eBay (most volume)',
        'Replacements.com',
        'Antique malls',
        'Estate sales'
      ],
      targetBuyers: [
        'Fiesta collectors',
        'Vintage dinnerware users',
        'Color/theme collectors',
        'General public (usable)'
      ],
      seasonality: 'Steady year-round. Gift seasons slightly stronger.',
      trend: 'Stable collector base. Rare colors and forms command premium.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Color uncertain', question: 'What color is this piece? Some colors are much more valuable than others.' },
        { condition: 'Age uncertain', question: 'Is this vintage (pre-1973) or post-1986 reissue?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify age', request: 'Photo of base showing marks', reason: 'Marks help distinguish vintage from modern' },
        { condition: 'Condition unclear', request: 'Photos of any chips or crazing', reason: 'Condition significantly affects value' }
      ],
      clarify: [
        { condition: 'Color name uncertain', clarification: 'Different names exist - is this "red" (radioactive orange) or "scarlet"?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Learn color names and values',
        'Original red commands premium',
        'Photograph color accurately',
        'Note any damage'
      ],
      buyerTips: [
        'Study color timeline',
        'Check for crazing and chips',
        'Rare forms matter more than color sometimes',
        'Post-1986 widely available'
      ],
      commonMistakes: [
        'Assuming all Fiesta is valuable',
        'Confusing post-1986 with vintage',
        'Not knowing color values',
        'Overpaying for common pieces'
      ],
      hiddenValue: [
        'Original radioactive red pieces',
        'Medium green (rarest color)',
        'Unusual forms (disk water pitcher, covered onion soup)',
        'Complete place settings in rare colors'
      ],
      storySellsFor: 'Designed by Frederick Hurten Rhead in 1936, Fiesta brought Art Deco style to everyday American tables during the Depression. The bold colors and modern design made it an instant hit. The original "radioactive red" used uranium oxide and is now a quirky piece of nuclear-age history.'
    }
  },

  {
    itemId: 'ceram-007', // Imari Porcelain Charger
    instantRecognition: {
      silhouette: 'Large decorative plate (charger) with complex paneled decoration in blue, red, and gold. Japanese export porcelain at its most elaborate.',
      keyVisualMarkers: [
        'Blue, iron-red, and gold color palette',
        'Paneled decoration',
        'Asymmetrical designs',
        'Floral and geometric patterns',
        'Large size (12"+ typically)'
      ],
      instantRedFlags: [
        'Printed decoration',
        'Wrong color chemistry',
        'Symmetrical Western designs',
        'Modern marks'
      ]
    },
    visualCues: {
      construction: [
        'Porcelain body',
        'Hand-painted decoration',
        'Blue underglaze, red and gold overglaze',
        'Foot rim characteristics vary'
      ],
      materials: [
        'Arita porcelain',
        'Cobalt blue (underglaze)',
        'Iron-red (overglaze)',
        'Gold gilding'
      ],
      proportions: [
        'Chargers typically 12-18 inches',
        'Deep dishes and plates various sizes',
        'Proportions follow Japanese standards'
      ],
      finish: [
        'Glossy glaze',
        'Gold may show wear',
        'Red should be iron-based (earthy tone)',
        'Blue varies by period'
      ],
      hardware: [
        'N/A'
      ],
      marks: [
        'Character marks (not always present)',
        'Foot rim style indicates period',
        '"Made in Japan" marks (20th century)',
        'European copies may have marks'
      ],
      wear: [
        'Gold wear expected on older pieces',
        'Edge chips affect value',
        'Hairlines reduce value',
        'Stacking marks on base'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full face showing decoration', reason: 'Pattern identification' },
        { location: 'Base showing foot rim', reason: 'Dating and attribution' },
        { location: 'Close-up of painting', reason: 'Assess hand-painting quality' }
      ],
      helpful: [
        { location: 'Gold detail', reason: 'Show gilding quality' },
        { location: 'Any damage', reason: 'Condition assessment' }
      ],
      forAuthentication: [
        { location: 'Foot rim profile', reason: 'Key for dating' },
        { location: 'Blue pigment detail', reason: 'Period indicator' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Hand-painted decoration',
        'Appropriate foot rim for period',
        'Correct color chemistry',
        'Proper weight and feel',
        'Period-appropriate design'
      ],
      fakeIndicators: [
        'Printed or transfer decoration',
        'Wrong colors (too bright, too even)',
        'Modern "Made in" marks',
        'Symmetrical European designs',
        'Wrong foot rim style'
      ],
      commonReproductions: [
        'Chinese copies (extensive)',
        'European Imari-style (Meissen, Derby, etc.)',
        'Modern Japanese production',
        'Southeast Asian copies'
      ],
      ageIndicators: [
        '1650-1750: Classic period, most valuable',
        '1750-1850: Continued production',
        '1850-1900: Late Edo/Meiji',
        '20th century: Various quality'
      ],
      provenance: [
        'European collection provenance valuable',
        'Ship cargo pieces documented',
        'Estate provenance helpful'
      ]
    },
    marketIntelligence: {
      currentDemand: 'steady',
      priceFactors: [
        { factor: 'Edo period (pre-1868)', impact: '+100-300%' },
        { factor: 'Large size (18"+)', impact: '+50-100%' },
        { factor: 'Fine painting quality', impact: '+50-100%' },
        { factor: 'Chips or cracks', impact: '-40-60%' },
        { factor: '20th century', impact: 'Lower baseline' }
      ],
      bestVenues: [
        'Bonhams Asian art',
        'Christie\'s Asian art',
        'Skinner',
        'eBay (common pieces)'
      ],
      targetBuyers: [
        'Imari collectors',
        'Asian art collectors',
        'Decorators',
        'Restaurant owners'
      ],
      seasonality: 'Asian art sales schedule. Spring and fall major sales.',
      trend: 'Early pieces hold value. Later pieces more decorative market.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Age uncertain', question: 'Has this been dated? The foot rim style is key for determining age.' },
        { condition: 'Origin uncertain', question: 'Is this Japanese Imari or Chinese export in Imari style?' }
      ],
      requestPhoto: [
        { condition: 'Cannot assess age', request: 'Photo of base showing foot rim profile', reason: 'Foot rim shape helps determine period' },
        { condition: 'Quality unclear', request: 'Close-up of painted decoration', reason: 'Hand-painting vs printing indicates age and value' }
      ],
      clarify: [
        { condition: 'Type uncertain', clarification: 'Is this Japanese Arita/Imari or Chinese export Imari style?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Photograph foot rim carefully',
        'Note hand-painting quality',
        'Document any provenance',
        'Size matters for chargers'
      ],
      buyerTips: [
        'Learn foot rim characteristics',
        'Distinguish Japanese from Chinese',
        'Check for repairs',
        'Early pieces show specific blue tones'
      ],
      commonMistakes: [
        'Assuming all Imari-style is Japanese',
        'Not checking for printing/transfer',
        'Missing repairs to gold',
        'Overpaying for common late pieces'
      ],
      hiddenValue: [
        'Early 18th century examples',
        'Unusual subjects or forms',
        'Dutch VOC commissioned pieces',
        'Complete services'
      ],
      storySellsFor: 'Imari porcelain was first made in Arita, Japan, for export through the port of Imari to the world. European nobles went mad for it - entire rooms were designed around Imari collections. The blue, red, and gold palette became so influential that European factories created their own versions, but original Japanese Imari remains the standard.'
    }
  },

  {
    itemId: 'ceram-008', // Grueby Pottery Vase
    instantRecognition: {
      silhouette: 'Organic vegetal forms with distinctive matte "cucumber green" glaze. Applied leaves and petals create three-dimensional sculptural surface.',
      keyVisualMarkers: [
        'Matte green glaze ("Grueby green")',
        'Applied leaf or petal decoration',
        'Organic vegetal forms',
        'Tooled surface texture',
        'Circular factory mark'
      ],
      instantRedFlags: [
        'Glossy glaze',
        'Wrong green shade',
        'Machine-made appearance',
        'No marks'
      ]
    },
    visualCues: {
      construction: [
        'Hand-thrown forms',
        'Hand-applied decoration',
        'Each leaf separately attached',
        'Tooling marks visible',
        'Thick walls'
      ],
      materials: [
        'Earthenware body',
        'Matte vegetable-organic glaze',
        'Copper oxide creates green',
        'Heavy, substantial weight'
      ],
      proportions: [
        'Heights from 4 to 16+ inches',
        'Forms often based on plant forms',
        'Thick walls relative to size'
      ],
      finish: [
        'Distinctive matte "cucumber" green',
        'Some yellow, blue, or other colors rare',
        'Glaze may pool at base',
        'Surface shows hand-finishing'
      ],
      hardware: [
        'N/A'
      ],
      marks: [
        'GRUEBY FAIENCE CO BOSTON USA (circular)',
        'GRUEBY circular mark',
        'Artist initials sometimes present',
        'Paper labels (rarely survive)'
      ],
      wear: [
        'Chips affect value significantly',
        'Glaze flakes possible',
        'Base wear acceptable',
        'Original condition premium'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full vase showing form and decoration', reason: 'Identify form and quality' },
        { location: 'Base showing marks', reason: 'Authentication critical' },
        { location: 'Leaf/petal detail', reason: 'Assess hand-work quality' }
      ],
      helpful: [
        { location: 'Glaze detail', reason: 'Show characteristic matte finish' },
        { location: 'Any damage', reason: 'Condition critical' }
      ],
      forAuthentication: [
        { location: 'Mark close-up', reason: 'Verify Grueby mark' },
        { location: 'Artist initials if present', reason: 'Attribution' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'GRUEBY circular mark',
        'Characteristic matte green',
        'Hand-applied decoration',
        'Proper weight and feel',
        'Boston, USA in mark'
      ],
      fakeIndicators: [
        'No marks',
        'Wrong green color',
        'Molded (not applied) decoration',
        'Glossy glaze',
        'Lightweight'
      ],
      commonReproductions: [
        'Hampshire Pottery similar pieces',
        'Teco in green',
        'Modern reproductions',
        'Unmarked copies'
      ],
      ageIndicators: [
        '1894-1909: Grueby Faience Company',
        '1909-1913: Grueby Pottery Company',
        '1913-1920: Grueby Faience and Tile Co',
        'Tiles continued longer than pottery'
      ],
      provenance: [
        'Exhibition history valuable',
        'Period photographs helpful',
        'Important artist attribution premium',
        'Documented original sales'
      ]
    },
    marketIntelligence: {
      currentDemand: 'hot',
      priceFactors: [
        { factor: 'Important artist (RE or other)', impact: '+100-200%' },
        { factor: 'Large size (12"+)', impact: '+100-200%' },
        { factor: 'Elaborate decoration', impact: '+50-100%' },
        { factor: 'Rare colors (yellow, blue)', impact: '+100-300%' },
        { factor: 'Chips or repairs', impact: '-40-60%' }
      ],
      bestVenues: [
        'Rago Arts (specialist)',
        'Skinner',
        'Christie\'s American decorative arts',
        'Specialist dealers'
      ],
      targetBuyers: [
        'Arts & Crafts collectors',
        'American art pottery collectors',
        'High-end decorators',
        'Museums'
      ],
      seasonality: 'Best at major pottery auctions. Fall season strongest.',
      trend: 'Strong and appreciating. Top-tier examples set records.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Mark uncertain', question: 'Is there a GRUEBY circular mark on the base?' },
        { condition: 'Artist unclear', question: 'Are there artist initials in addition to the factory mark?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify authenticity', request: 'Photo of base showing marks', reason: 'Grueby mark essential for value' },
        { condition: 'Quality unclear', request: 'Close-up of applied leaf decoration', reason: 'Quality of hand-work affects value' }
      ],
      clarify: [
        { condition: 'Color uncertain', clarification: 'Is this the typical "cucumber green" or another color?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Document marks carefully',
        'Note artist initials if present',
        'Condition critical - be transparent',
        'Quality of decoration matters'
      ],
      buyerTips: [
        'Study authentic marks',
        'Check for chips at leaf edges',
        'Artist attribution adds value',
        'Compare to published examples'
      ],
      commonMistakes: [
        'Confusing with Hampshire or other green pottery',
        'Missing artist initials',
        'Not checking leaf edges for chips',
        'Assuming all Grueby is equal'
      ],
      hiddenValue: [
        'Grueby tiles can be valuable',
        'Unusual colors (yellow especially)',
        'Forms with Tiffany lamp bases',
        'Exhibition or documented pieces'
      ],
      storySellsFor: 'Grueby Faience Company of Boston pioneered the American Arts and Crafts matte green glaze that became the era\'s signature color. Each vase was formed by hand, with leaves and petals individually applied and tooled. Grueby won medals at international expositions, and Tiffany Studios mounted their vases as lamp bases - the ultimate collaboration of Arts and Crafts masters.'
    }
  }
]

/**
 * ART EXPERTISE
 */
const artKnowledge: ExpertKnowledgeEntry[] = [
  {
    itemId: 'art-001', // Starry Night
    instantRecognition: {
      silhouette: 'Iconic swirling night sky over a village with prominent cypress tree in left foreground. Crescent moon and stars with distinctive halo effects.',
      keyVisualMarkers: [
        'Turbulent spiral patterns in sky',
        'Dark flame-like cypress tree',
        'Village with church spire',
        'Thick impasto brushwork',
        'Blue-dominated palette with yellow stars'
      ],
      instantRedFlags: [
        'N/A - Original is in MoMA, any other version is a copy/print',
        'This is the most recognized painting in the world'
      ]
    },
    visualCues: {
      construction: [
        'Oil on canvas, 29 × 36¼ inches',
        'Visible brushstrokes are essential feature',
        'Canvas weave may be visible in original',
        'Print versions show dot patterns under magnification'
      ],
      materials: [
        'Original: oil paint on canvas',
        'Prints: various papers and processes',
        'Reproductions: range from posters to hand-painted copies'
      ],
      proportions: [
        'Original: 73.7 cm × 92.1 cm',
        'Landscape format (wider than tall)',
        'Village takes lower third, sky dominates'
      ],
      finish: [
        'Original: thick impasto texture',
        'Museum-quality reproductions may show texture',
        'Prints are flat'
      ],
      hardware: [
        'N/A for artwork itself',
        'Frame may indicate era/quality of reproduction'
      ],
      marks: [
        'Original: not signed',
        'Prints: various publisher marks',
        'Authentication: MoMA provenance only for original'
      ],
      wear: [
        'Original: museum conservation',
        'Vintage prints: may show age-appropriate wear'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full image', reason: 'Identify reproduction type' },
        { location: 'Close-up of surface', reason: 'Determine if print or painted reproduction' }
      ],
      helpful: [
        { location: 'Any signatures or marks', reason: 'Identify print edition or publisher' },
        { location: 'Frame if included', reason: 'Frame can add or subtract value' }
      ],
      forAuthentication: [
        { location: 'Surface texture macro', reason: 'Distinguish print from painting' },
        { location: 'Back of canvas/print', reason: 'May show publisher, date, edition' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'The only genuine original is at MoMA, New York',
        'Everything else is a reproduction of some kind',
        'Quality varies enormously'
      ],
      fakeIndicators: [
        'Claims of being "original" Van Gogh',
        'Fake signatures (original is unsigned)',
        'Attempts to pass reproductions as original'
      ],
      commonReproductions: [
        'Museum shop prints (legitimate)',
        'Poster reproductions (very common)',
        'Hand-painted oil copies (various quality)',
        'Giclee prints (high quality digital)',
        'Vintage lithographs (may have collector value)'
      ],
      ageIndicators: [
        'Original painted June 1889 in Saint-Rémy',
        'Early reproductions from early 20th century rare',
        'Most prints are post-1950s'
      ],
      provenance: [
        'Original: MoMA since 1941, acquired from Lillie P. Bliss bequest',
        'Any claimed provenance for original is fraud',
        'Print edition provenance may matter for limited editions'
      ]
    },
    marketIntelligence: {
      currentDemand: 'hot',
      priceFactors: [
        { factor: 'Original', impact: 'Priceless, museum-owned, not for sale' },
        { factor: 'Vintage lithographs', impact: '$500-$2,000' },
        { factor: 'Quality oil reproductions', impact: '$100-$1,000' },
        { factor: 'Museum shop prints', impact: '$20-$100' },
        { factor: 'Posters', impact: '$10-$50' }
      ],
      bestVenues: [
        'Museum shops (for authorized reproductions)',
        'Art.com, AllPosters (prints)',
        'eBay (vintage reproductions)',
        'Local frame shops'
      ],
      targetBuyers: [
        'Home decorators',
        'Students and dormitories',
        'Van Gogh enthusiasts',
        'Gift buyers'
      ],
      seasonality: 'Steady. Gift-giving seasons (holiday, graduation) spike.',
      trend: 'Evergreen popularity. Van Gogh remains most merchandised artist.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Reproduction type unclear', question: 'Is this a print, poster, or hand-painted reproduction?' },
        { condition: 'Age uncertain', question: 'Do you know approximately when this was produced?' }
      ],
      requestPhoto: [
        { condition: 'Cannot determine type', request: 'Close-up showing surface texture', reason: 'To distinguish print from painting' },
        { condition: 'May have value as vintage print', request: 'Photo of back showing any publisher marks', reason: 'Vintage prints may have collector value' }
      ],
      clarify: [
        { condition: 'Claims of unusual provenance', clarification: 'To be clear - the original painting is permanently housed at MoMA. Is this a reproduction of some kind?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Be clear about reproduction type in listing',
        'Vintage prints (pre-1960) may have collector value',
        'Quality framing adds perceived value',
        'Hand-painted copies valued for craftsmanship'
      ],
      buyerTips: [
        'Understand what you\'re buying - there\'s no such thing as "an original Starry Night" for sale',
        'Quality varies enormously in reproductions',
        'Museum shop prints are guaranteed accurate color',
        'Consider giclée for quality display'
      ],
      commonMistakes: [
        'Believing claims of "original" or "authenticated" Van Gogh',
        'Paying premium for common reproductions',
        'Assuming hand-painted = more valuable (quality varies)'
      ],
      hiddenValue: [
        'Early 20th century reproductions/lithographs',
        'Unusual sizes or formats',
        'Limited edition museum prints',
        'Quality vintage frames'
      ],
      storySellsFor: 'Painted from memory and imagination in the asylum at Saint-Rémy in June 1889, Van Gogh wrote to his brother Theo about the morning star and the swirling skies. This image has become the universal symbol of artistic genius and passionate expression.'
    }
  },

  {
    itemId: 'art-002', // Water Lilies (Monet)
    instantRecognition: {
      silhouette: 'Expansive view of lily pond with floating pads and reflections. Soft, diffused brushwork in blues, greens, and purples. No horizon line in later versions.',
      keyVisualMarkers: [
        'Lily pads floating on water surface',
        'Reflections of sky and foliage',
        'Soft, broken brushwork',
        'Japanese bridge (in some versions)',
        'Pastel color palette with blues and greens'
      ],
      instantRedFlags: [
        'Hard edges or photographic clarity',
        'Wrong color relationships',
        'Modern printing artifacts',
        'Claims of "original" for sale'
      ]
    },
    visualCues: {
      construction: [
        'Canvas with oil paint buildup',
        'Multiple paint layers visible',
        'Impasto technique for texture',
        'No distinct horizon (later works)'
      ],
      materials: [
        'Oil on canvas',
        'Period canvas weave (for original)',
        'Lead white ground',
        'Prussian blue and chrome green pigments'
      ],
      proportions: [
        'Various sizes from studies to monumental',
        'Large decorative panels (Grandes Décorations)',
        'Approximately square or horizontal formats'
      ],
      finish: [
        'Matte surface typical of impressionism',
        'Visible brushwork throughout',
        'Color built up in layers'
      ],
      hardware: ['N/A'],
      marks: [
        'Monet signature (lower corner)',
        'Estate stamps on reverse',
        'Durand-Ruel gallery labels'
      ],
      wear: [
        'Age craquelure pattern',
        'Patina on varnish',
        'Canvas texture visible'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full composition', reason: 'Identify which series and period' },
        { location: 'Surface texture at angle', reason: 'Distinguish painting from print' },
        { location: 'Signature area', reason: 'Verify authentic Monet signature' }
      ],
      helpful: [
        { location: 'Reverse/back of canvas', reason: 'Check provenance labels and stretcher' },
        { location: 'Edge detail', reason: 'Period canvas and stretcher bars' }
      ],
      forAuthentication: [
        { location: 'Raking light photo', reason: 'Reveal paint texture and condition' },
        { location: 'Detail of lily pads', reason: 'Assess brushwork quality' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Documented provenance from Giverny studio',
        'Wildenstein catalogue raisonné listing',
        'Period canvas and stretcher',
        'Characteristic brushwork',
        'Appropriate pigment analysis'
      ],
      fakeIndicators: [
        'Unknown provenance',
        'Modern canvas or materials',
        'Mechanical or stiff brushwork',
        'Colors too bright or garish',
        'Missing from catalogue raisonné'
      ],
      commonReproductions: [
        'Poster prints (very common)',
        'Canvas transfer prints',
        'Hand-painted copies (Chinese export)',
        'Museum shop giclées'
      ],
      ageIndicators: [
        '1899-1900: First series with bridge',
        '1903-1908: Larger pond views',
        '1914-1926: Grandes Décorations (monumental)',
        'Later works more abstract'
      ],
      provenance: [
        'Original all at museums or major collections',
        'Durand-Ruel sales records',
        'Wildenstein documentation essential',
        'Major auction house provenance research'
      ]
    },
    marketIntelligence: {
      currentDemand: 'hot',
      priceFactors: [
        { factor: 'Original Monet painting', impact: '$20M-100M+' },
        { factor: 'Period print or lithograph', impact: '$2,000-20,000' },
        { factor: 'Quality museum reproduction', impact: '$100-500' },
        { factor: 'Hand-painted copy', impact: '$200-2,000' }
      ],
      bestVenues: [
        'Christie\'s, Sotheby\'s (authentic works)',
        'Major Impressionist dealers',
        'Museum shops (quality reproductions)'
      ],
      targetBuyers: [
        'Museum acquisitions',
        'Ultra-high-net-worth collectors',
        'Decorative buyers (reproductions)'
      ],
      seasonality: 'Major Impressionist sales in May and November.',
      trend: 'Original Monet prices at historic highs. Decorative market stable.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Claims authenticity', question: 'Is this documented in the Wildenstein catalogue raisonné?' },
        { condition: 'Reproduction type unclear', question: 'Is this a print, poster, or hand-painted reproduction?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify type', request: 'Close-up of surface showing brushwork or printing', reason: 'To determine if painting or print' },
        { condition: 'May be period print', request: 'Photo of any stamps or labels on reverse', reason: 'Period prints have collector value' }
      ],
      clarify: [
        { condition: 'Unusual price for original', clarification: 'Original Monet Water Lilies sell for $20-100+ million. Can you clarify what this is?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Be precise about what you have (print, reproduction, etc.)',
        'Quality reproductions sell well for decoration',
        'Period lithographs have collector value',
        'Good framing matters for presentation'
      ],
      buyerTips: [
        'Original Water Lilies are in museums or major collections',
        'Museum shop prints are reliable quality',
        'Hand-painted copies vary wildly in quality',
        'UV verification for serious purchases'
      ],
      commonMistakes: [
        'Believing "original" claims without provenance',
        'Paying painting prices for prints',
        'Assuming hand-painted means valuable'
      ],
      hiddenValue: [
        'Original exhibition posters',
        'Period lithographs from artist lifetime',
        'Unusual formats or vintage prints'
      ],
      storySellsFor: 'Claude Monet spent his last 30 years painting his water garden at Giverny obsessively. He painted approximately 250 water lily paintings, eventually going nearly blind. These paintings revolutionized modern art and inspired abstract expressionism.'
    }
  },

  {
    itemId: 'art-003', // Currier & Ives Print
    instantRecognition: {
      silhouette: 'Hand-colored lithograph with characteristic 19th century Americana scenes. Soft colors, nostalgic subjects, distinctive typography.',
      keyVisualMarkers: [
        'Hand-colored lithograph appearance',
        'CURRIER & IVES imprint at bottom',
        'Period American scenes (winter, rural, hunting)',
        'Characteristic soft pastel coloring',
        'NEW YORK address in text'
      ],
      instantRedFlags: [
        'Photomechanical dot pattern',
        'Too-bright modern colors',
        'Missing publisher text',
        'Wrong paper type'
      ]
    },
    visualCues: {
      construction: [
        'Stone lithograph base',
        'Hand-applied watercolors',
        'Wide margins around image',
        'Title text below image'
      ],
      materials: [
        'Period wove paper',
        'Lithographic ink',
        'Watercolor tinting',
        'Sometimes hand-applied gum arabic highlights'
      ],
      proportions: [
        'Small folio: ~8.8 x 12.8 inches',
        'Medium folio: ~14 x 20 inches',
        'Large folio: ~18 x 27+ inches (most valuable)',
        'Image area with margins'
      ],
      finish: [
        'Matte lithograph surface',
        'Watercolor tinting varies by colorist',
        'Some highlights in body color'
      ],
      hardware: ['N/A'],
      marks: [
        'CURRIER & IVES (or earlier: N. CURRIER)',
        'NEW YORK publisher address',
        'Copyright line when applicable',
        'Plate number (sometimes)'
      ],
      wear: [
        'Foxing spots (age spots) common',
        'Toning of paper normal',
        'Staining or water damage devalues',
        'Trimmed margins reduce value'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full image with margins', reason: 'Assess completeness and margins' },
        { location: 'Publisher imprint detail', reason: 'Verify authentic Currier & Ives text' },
        { location: 'Paper texture close-up', reason: 'Distinguish original from reproduction' }
      ],
      helpful: [
        { location: 'Any foxing or damage', reason: 'Condition critical for value' },
        { location: 'Back of print', reason: 'Check for labels, stamps, or repairs' }
      ],
      forAuthentication: [
        { location: 'Macro of colored areas', reason: 'Hand-coloring shows brush strokes' },
        { location: 'Text sharpness', reason: 'Original lithography vs. photo reproduction' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Hand-applied watercolor visible under magnification',
        'Period paper with appropriate texture',
        'Sharp lithographic lines',
        'Correct imprint text and address',
        'Original margins present'
      ],
      fakeIndicators: [
        'Halftone dot pattern (photomechanical)',
        'Modern paper (too white, wrong texture)',
        'Fuzzy lithographic lines',
        'Colors too uniform (machine printing)',
        'Incorrect publisher text'
      ],
      commonReproductions: [
        'Calendar reprints (1900s-present)',
        'Modern lithograph reproductions',
        'Photo offset prints',
        'Digital reproductions on aged paper'
      ],
      ageIndicators: [
        '1835-1856: N. CURRIER (before partnership)',
        '1857-1907: CURRIER & IVES',
        'Address changes help date prints',
        'Large folio prints: 1840s-1890s'
      ],
      provenance: [
        'Old collection labels',
        'Period frames',
        'Dealer stamps',
        'Exhibition history'
      ]
    },
    marketIntelligence: {
      currentDemand: 'moderate',
      priceFactors: [
        { factor: 'Large folio "best 50" subjects', impact: '+500-1000%' },
        { factor: 'Railroad, sailing ships, hunting', impact: '+100-300%' },
        { factor: 'Common winter scenes', impact: 'Baseline $200-500' },
        { factor: 'Trimmed margins', impact: '-30-50%' },
        { factor: 'Foxing or staining', impact: '-20-60%' },
        { factor: 'Modern reproduction', impact: '$10-50' }
      ],
      bestVenues: [
        'Heritage Auctions (Americana)',
        'Swann Galleries (prints)',
        'Regional American antique auctions',
        'eBay (common subjects)'
      ],
      targetBuyers: [
        'Americana collectors',
        'Subject collectors (trains, ships, etc.)',
        'Interior decorators',
        'Historical societies'
      ],
      seasonality: 'Winter scenes popular in fall. American history subjects around July 4th.',
      trend: 'Classic Americana stable. Best subjects hold value. Common prints price-sensitive.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Cannot see imprint clearly', question: 'What does the publisher text at the bottom say?' },
        { condition: 'Condition unclear', question: 'Are there any stains, foxing spots, or tears?' },
        { condition: 'Margins unclear', question: 'Are the original margins intact or has it been trimmed?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify authenticity', request: 'Close-up of publisher imprint and paper texture', reason: 'To distinguish original from reproduction' },
        { condition: 'Condition assessment needed', request: 'Photos showing any damage, foxing, or staining', reason: 'Condition significantly affects value' }
      ],
      clarify: [
        { condition: 'Reproduction suspected', clarification: 'Is this an original 19th century print or a later reproduction?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Never trim margins - destroys value',
        'Research the specific title - some are worth much more',
        'Condition is everything - be honest about flaws',
        'Period frames add value'
      ],
      buyerTips: [
        'Learn to spot hand-coloring vs. printed colors',
        'Check for the "Best 50" subjects (most valuable)',
        'Examine paper texture - originals have distinct feel',
        'Reproductions are everywhere - be skeptical'
      ],
      commonMistakes: [
        'Assuming all Currier & Ives are valuable',
        'Not distinguishing reproductions',
        'Framing with acidic materials',
        'Cleaning prints improperly'
      ],
      hiddenValue: [
        'Railroad and steamship subjects',
        'Political and historical subjects',
        'Large folio size prints',
        'Unusual subjects not commonly reproduced'
      ],
      storySellsFor: 'Currier & Ives produced over 7,500 different titles from 1835-1907, creating the visual record of 19th century America. These were the Instagram of their day - affordable art for middle-class homes showing idealized American life.'
    }
  },

  {
    itemId: 'art-004', // Hiroshige Woodblock Print
    instantRecognition: {
      silhouette: 'Japanese landscape with distinctive blue sky gradation, bold outlines, and flat color areas. Classic ukiyo-e style with publisher cartouches.',
      keyVisualMarkers: [
        'Blue bokashi (gradation) technique in sky',
        'Bold keyblock outlines',
        'Flat color areas',
        'Japanese text cartouches',
        'Characteristic Hiroshige landscape view'
      ],
      instantRedFlags: [
        'Photomechanical printing dots',
        'Colors printed in registration',
        'Wrong paper texture',
        'Modern printing artifacts'
      ]
    },
    visualCues: {
      construction: [
        'Woodblock printing (key block + color blocks)',
        'Hand-applied pigments on washi paper',
        'Embossing (karazuri) on some areas',
        'Multiple print runs create variations'
      ],
      materials: [
        'Mulberry (kozo) washi paper',
        'Water-based pigments',
        'Vegetable and mineral colorants',
        'Rice paste sizing'
      ],
      proportions: [
        'Oban size: ~10 x 15 inches (most common)',
        'Chuban size: ~7 x 10 inches',
        'Vertical or horizontal formats',
        'Image typically fills sheet with small margins'
      ],
      finish: [
        'Matte surface',
        'Color absorbed into paper fibers',
        'Gradation (bokashi) visible in sky',
        'Sometimes mica or metallic additions'
      ],
      hardware: ['N/A'],
      marks: [
        'Artist signature (Hiroshige ga)',
        'Publisher seal (Hoeido, Tsutaya, etc.)',
        'Censor seals (date by type)',
        'Carver or printer marks (sometimes)'
      ],
      wear: [
        'Worming (insect holes) common',
        'Color fading especially of blues and purples',
        'Fold lines or trimming',
        'Backing or mounting evidence'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full print with cartouches', reason: 'Identify series and print number' },
        { location: 'Publisher and censor seals', reason: 'Date and authenticate print' },
        { location: 'Paper texture close-up', reason: 'Verify original woodblock printing' }
      ],
      helpful: [
        { location: 'Artist signature detail', reason: 'Verify Hiroshige signature style' },
        { location: 'Any damage or repairs', reason: 'Condition critical for value' }
      ],
      forAuthentication: [
        { location: 'Bokashi gradation area', reason: 'Hand-applied gradation vs. printed' },
        { location: 'Back of print', reason: 'Paper quality and any backing' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Correct publisher seal for series',
        'Appropriate censor seals for date',
        'Washi paper texture visible',
        'Hand-applied bokashi gradation',
        'Color absorbed into paper (not sitting on top)'
      ],
      fakeIndicators: [
        'Photomechanical dot pattern',
        'Colors sitting on paper surface',
        'Wrong publisher or missing seals',
        'Modern paper (too white, wrong texture)',
        'Registration too perfect'
      ],
      commonReproductions: [
        'Meiji period reprints (1868-1912)',
        'Showa period restrikes',
        'Modern Japanese tourist prints',
        'Western photomechanical copies'
      ],
      ageIndicators: [
        '1833-1834: First Tokaido series publication',
        'Censor seal types date prints precisely',
        'Later editions show block wear',
        'Color variations between printings'
      ],
      provenance: [
        'Collection stamps (if present)',
        'Dealer documentation',
        'Exhibition history',
        'Frank Lloyd Wright collection items valuable'
      ]
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'First edition with fresh colors', impact: '+200-500%' },
        { factor: 'Famous views (Tokaido, Edo)', impact: '+50-100%' },
        { factor: 'Later editions/restrikes', impact: '-50-80%' },
        { factor: 'Fading or damage', impact: '-30-60%' },
        { factor: 'Trimmed or laid down', impact: '-40-60%' }
      ],
      bestVenues: [
        'Bonhams, Christie\'s Japanese art sales',
        'Specialized Japanese print dealers',
        'Scholten Japanese Art',
        'Japan Art Open'
      ],
      targetBuyers: [
        'Japanese art collectors',
        'Print collectors',
        'Interior designers (decorative)',
        'Museum acquisitions (important prints)'
      ],
      seasonality: 'Major Japanese art sales in spring and fall in New York.',
      trend: 'First editions increasingly rare. Later editions more accessible. Growing Western interest.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Edition unclear', question: 'Can you describe the publisher seal? This helps determine which edition.' },
        { condition: 'Series identification needed', question: 'Are there Japanese characters in cartouches that might identify the series?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify edition', request: 'Close-up of publisher seal and any censor marks', reason: 'These date the print and determine value' },
        { condition: 'Authenticity uncertain', request: 'Close-up of sky showing bokashi gradation', reason: 'Hand-applied gradation indicates original' }
      ],
      clarify: [
        { condition: 'Price seems low', clarification: 'Is this an original woodblock print or a modern reproduction?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Research your specific print in catalogs',
        'Edition matters enormously for value',
        'Document all seals and marks',
        'Condition is critical - note any damage'
      ],
      buyerTips: [
        'Learn the censor seal dating system',
        'First editions worth many times later printings',
        'Examine paper carefully for authenticity',
        'Buy from knowledgeable dealers with return policies'
      ],
      commonMistakes: [
        'Not distinguishing editions',
        'Assuming all old-looking prints are valuable',
        'Paying first edition prices for later printings',
        'Improper storage causing damage'
      ],
      hiddenValue: [
        'Unusual views not commonly reproduced',
        'First edition with strong color',
        'Important provenance (Frank Lloyd Wright, etc.)',
        'Complete series in uniform condition'
      ],
      storySellsFor: 'Hiroshige transformed Japanese printmaking with his poetic landscapes of the Tokaido road - 53 stations between Edo and Kyoto. These prints influenced Van Gogh and the Impressionists. You\'re holding a window into 1830s Japan.'
    }
  },

  {
    itemId: 'art-005', // Frederic Remington Bronze
    instantRecognition: {
      silhouette: 'Dynamic Western bronze sculpture showing cowboys, horses, or Native Americans in action. Characteristic American Western subject matter with naturalistic detail.',
      keyVisualMarkers: [
        'Dynamic action pose',
        'Western subject (cowboy, horse, Native American)',
        'Bronze casting with patina',
        'Naturalistic detail in tack and clothing',
        'Irregularly shaped naturalistic base'
      ],
      instantRedFlags: [
        'Smooth or uniform surfaces',
        'Missing foundry marks',
        'Crude or simplified details',
        'Hollow feeling when lifted',
        'Modern or reproduction appearance'
      ]
    },
    visualCues: {
      construction: [
        'Lost wax casting (authentic pieces)',
        'Hollow bronze (heavier than expected)',
        'Separately cast and assembled elements',
        'Hand-chased details after casting'
      ],
      materials: [
        'Bronze alloy',
        'Brown, green, or black patina',
        'Marble or bronze base',
        'Internal armature (not visible)'
      ],
      proportions: [
        'Broncho Buster: ~23 inches tall',
        'Coming Through the Rye: ~28 inches',
        'Various sizes exist',
        'Proportions should match original'
      ],
      finish: [
        'Rich patina with variation',
        'Hand-chased surface details',
        'Original foundry patination',
        'Some rubbing on high points acceptable'
      ],
      hardware: ['N/A'],
      marks: [
        'Frederic Remington signature',
        'Copyright date',
        'Foundry mark (Roman Bronze Works, Henry-Bonnard, etc.)',
        'Edition number (later casts)'
      ],
      wear: [
        'Original patina should be consistent',
        'Wear on high points normal',
        'Damage significantly affects value',
        'Replaced parts problematic'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full sculpture all angles', reason: 'Assess form, proportions, and condition' },
        { location: 'Signature and foundry marks', reason: 'Critical for authentication' },
        { location: 'Copyright date if present', reason: 'Helps date the cast' }
      ],
      helpful: [
        { location: 'Surface detail close-ups', reason: 'Assess casting quality and patina' },
        { location: 'Base underside', reason: 'Additional foundry marks often here' }
      ],
      forAuthentication: [
        { location: 'Foundry mark detail', reason: 'Authentic foundries documented' },
        { location: 'Surface texture at various points', reason: 'Quality of casting indicates authenticity' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Known foundry mark (Roman Bronze Works most valuable)',
        'Remington signature consistent with period',
        'Appropriate weight and feel',
        'High-quality chasing and detail',
        'Documented provenance'
      ],
      fakeIndicators: [
        'Unknown or no foundry mark',
        'Signature inconsistent with authentic examples',
        'Poor quality or soft details',
        'Wrong proportions',
        'Suspicious provenance or price'
      ],
      commonReproductions: [
        'Modern recasts from molds',
        'Unauthorized posthumous casts',
        'Surmoulage (cast from original bronze)',
        'Mexican and Asian copies'
      ],
      ageIndicators: [
        '1895-1909: Lifetime casts by Remington',
        'Roman Bronze Works: 1898-1909 (most valuable)',
        'Henry-Bonnard: earlier works',
        'Post-1909: posthumous (less valuable)',
        'Modern recasts: 1970s-present'
      ],
      provenance: [
        'Original purchaser documentation ideal',
        'Gallery or auction history',
        'Foundry records (when available)',
        'Publication in catalogs'
      ]
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Lifetime cast with Roman Bronze Works', impact: '$200,000-1,000,000+' },
        { factor: 'Early posthumous cast (1910-1920s)', impact: '$50,000-200,000' },
        { factor: 'Later authorized cast', impact: '$25,000-75,000' },
        { factor: 'Modern reproduction', impact: '$500-5,000' },
        { factor: 'Broncho Buster (most popular)', impact: 'Baseline' },
        { factor: 'Damage or repairs', impact: '-30-60%' }
      ],
      bestVenues: [
        'Christie\'s, Sotheby\'s American Art sales',
        'Coeur d\'Alene Art Auction (Western specialist)',
        'Scottsdale Art Auction',
        'Major Western art dealers'
      ],
      targetBuyers: [
        'Western art collectors',
        'American art museums',
        'Corporate Western collections',
        'Ranch and lodge decorators (reproductions)'
      ],
      seasonality: 'Major Western art sales in summer (Coeur d\'Alene) and fall.',
      trend: 'Lifetime casts increasingly rare and valuable. Clear distinction between authentic and reproductions.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Foundry unclear', question: 'Is there a foundry mark on the base or sculpture?' },
        { condition: 'Age uncertain', question: 'Do you have any provenance or history for this piece?' },
        { condition: 'Price seems low', question: 'Has this been authenticated or appraised by a Western art specialist?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify foundry', request: 'Close-up photos of all marks on base and sculpture', reason: 'Foundry marks are critical for authentication' },
        { condition: 'Quality unclear', request: 'Detail photos of face, hands, and horse tack', reason: 'Casting quality indicates authenticity' }
      ],
      clarify: [
        { condition: 'Reproduction suspected', clarification: 'Is this an original cast or a modern reproduction? The difference in value is enormous.' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Get authentication from Western art specialist',
        'Document all marks photographically',
        'Provenance increases value significantly',
        'Condition report essential for serious buyers'
      ],
      buyerTips: [
        'Only buy with documented authenticity',
        'Learn to recognize period patinas',
        'Lifetime casts are extremely valuable',
        'Modern reproductions have minimal resale value'
      ],
      commonMistakes: [
        'Assuming all Remington bronzes are valuable',
        'Not verifying foundry marks',
        'Paying authentic prices for reproductions',
        'Cleaning or re-patinating without expertise'
      ],
      hiddenValue: [
        'Roman Bronze Works marks most valuable',
        'Unusual patina (original green)',
        'Important provenance',
        'Early cast numbers'
      ],
      storySellsFor: 'Frederic Remington invented the American West in sculpture. The Broncho Buster was his first bronze, cast in 1895 - before then, no one had captured the violent energy of the frontier in three dimensions. Original casts were made under his personal supervision.'
    }
  },

  {
    itemId: 'art-006', // Maxfield Parrish Print
    instantRecognition: {
      silhouette: 'Richly saturated colors, especially distinctive "Parrish blue" sky. Romantic scenes with classical figures, columns, and dreamy landscapes.',
      keyVisualMarkers: [
        'Distinctive cobalt "Parrish blue"',
        'Glowing luminous quality',
        'Classical or romantic subjects',
        'Golden light effects',
        'Architectural elements (columns, urns)'
      ],
      instantRedFlags: [
        'Flat colors lacking luminosity',
        'Wrong blue tone',
        'Poor printing quality',
        'Modern paper'
      ]
    },
    visualCues: {
      construction: [
        'Color lithograph or print',
        'Multiple color separations',
        'Period paper stock',
        'Often in original frame'
      ],
      materials: [
        'Period lithograph paper',
        'Colored printing inks',
        'Sometimes on board backing',
        'Original frames valuable'
      ],
      proportions: [
        'Daybreak: 18 x 30 inches (most common)',
        'Various sizes produced',
        'Reissues in different sizes exist',
        'Magazine illustrations smaller'
      ],
      finish: [
        'Glossy or semi-gloss surface (prints)',
        'Rich saturation',
        'Luminous glazing (original paintings)',
        'Depth of color layers'
      ],
      hardware: ['N/A'],
      marks: [
        'Maxfield Parrish signature in image',
        'Publisher (House of Art, Brown & Bigelow)',
        'Copyright information',
        'Print number (sometimes)'
      ],
      wear: [
        'Foxing common on paper',
        'Fading especially in blues',
        'Frame damage from hanging',
        'Water damage problematic'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full image with good color', reason: 'Identify subject and assess color quality' },
        { location: 'Publisher information', reason: 'Date and authenticate print' },
        { location: 'Overall condition', reason: 'Assess value factors' }
      ],
      helpful: [
        { location: 'Surface detail', reason: 'Distinguish print type' },
        { location: 'Frame detail', reason: 'Period frames add value' }
      ],
      forAuthentication: [
        { location: 'Signature area', reason: 'Verify authentic Parrish signature' },
        { location: 'Paper texture', reason: 'Identify period vs. modern printing' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Period paper with appropriate texture',
        'Rich color saturation',
        'Correct publisher marks',
        'Appropriate print technology for date',
        'Luminous "Parrish blue"'
      ],
      fakeIndicators: [
        'Modern paper (too white)',
        'Flat or dull colors',
        'Photomechanical dot pattern (if claimed earlier)',
        'Missing publisher information',
        'Wrong size for subject'
      ],
      commonReproductions: [
        'Modern poster prints (very common)',
        'Art print reproductions',
        'Calendar reproductions',
        'Digital prints on aged paper'
      ],
      ageIndicators: [
        '1922: Daybreak original publication',
        '1920s-30s: Art print heyday',
        'Brown & Bigelow calendar era: 1930s-1960s',
        'Modern reproductions: 1970s-present'
      ],
      provenance: [
        'Original purchase documentation',
        'Period framer labels',
        'Family history',
        'Gallery records'
      ]
    },
    marketIntelligence: {
      currentDemand: 'moderate',
      priceFactors: [
        { factor: 'Original painting', impact: '$100,000-1,000,000+' },
        { factor: 'Period print, good condition', impact: '$200-2,000' },
        { factor: 'Daybreak (most popular)', impact: '+50%' },
        { factor: 'Period frame', impact: '+25-50%' },
        { factor: 'Fading or damage', impact: '-30-60%' },
        { factor: 'Modern reproduction', impact: '$20-100' }
      ],
      bestVenues: [
        'Heritage Auctions (Illustration art)',
        'Swann Galleries',
        'Specialized illustration dealers',
        'eBay (common prints)'
      ],
      targetBuyers: [
        'Illustration art collectors',
        'Art Nouveau/Deco collectors',
        'Decorative buyers',
        'Parrish specialists'
      ],
      seasonality: 'Steady year-round. Illustration art sales in spring.',
      trend: 'Original paintings rare and valuable. Period prints collectible. Market flooded with reproductions.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Age unclear', question: 'Do you know approximately when this was printed? Period prints from the 1920s-30s are most valuable.' },
        { condition: 'Condition unclear', question: 'Is there any fading, foxing, or damage to the print?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify period', request: 'Close-up of paper texture and any publisher marks', reason: 'To distinguish period print from reproduction' },
        { condition: 'Frame evaluation', request: 'Photo of frame and any labels on back', reason: 'Period frames add significant value' }
      ],
      clarify: [
        { condition: 'Original painting claimed', clarification: 'Original Parrish paintings are extremely rare - is this a print or the original?' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Period prints (1920s-30s) have collector value',
        'Keep original frames - they add value',
        'Condition is critical - store properly',
        'Research your specific print'
      ],
      buyerTips: [
        'Learn to distinguish period from modern prints',
        'Daybreak is most collected but also most reproduced',
        'Check color quality - fading reduces value',
        'Period frames enhance authenticity'
      ],
      commonMistakes: [
        'Paying period prices for reproductions',
        'Assuming all Parrish prints are valuable',
        'Discarding original frames',
        'Not checking for fading'
      ],
      hiddenValue: [
        'Early magazine illustrations',
        'Advertising commissions (Edison Mazda)',
        'Original paintings (extremely rare)',
        'Period frames with labels'
      ],
      storySellsFor: 'Daybreak was the most popular art print of the 20th century - it hung in one of every four American homes in 1925. Parrish developed a unique technique of layering glazes over photography to create that luminous "Parrish blue" that has never been duplicated.'
    }
  }
]

/**
 * WATCHES & JEWELRY EXPERTISE
 */
const jewelryKnowledge: ExpertKnowledgeEntry[] = [
  {
    itemId: 'jwl-001', // Rolex Submariner
    instantRecognition: {
      silhouette: 'Classic diver watch silhouette with rotating bezel, cyclops lens over date, and Oyster bracelet. The Mercedes hands are distinctive.',
      keyVisualMarkers: [
        'Rotating bezel with minute markers',
        'Mercedes hour hand (distinctive shape)',
        'Cyclops lens magnifying date window',
        'Oyster-style bracelet with folding clasp',
        'Rolex crown logo at 12 o\'clock'
      ],
      instantRedFlags: [
        'Cyclops magnification less than 2.5x',
        'Second hand ticking not sweeping',
        'Crown logo not perfectly centered',
        'Date changes slowly around midnight',
        'Lightweight feel'
      ]
    },
    visualCues: {
      construction: [
        'Monobloc middle case (no caseback screws visible)',
        'Screw-down crown with Triplock system',
        'Sapphire crystal (post-1980s) or acrylic (vintage)',
        'Uni-directional bezel (only turns counter-clockwise)'
      ],
      materials: [
        'Oystersteel (904L stainless) post-2004',
        'Earlier models 316L steel',
        'Ceramic bezel insert (post-2008)',
        'Aluminum bezel insert (vintage)',
        'Sapphire crystal or Tropic plastic'
      ],
      proportions: [
        '40mm case diameter (traditional)',
        '41mm (current production)',
        'Lug-to-lug approximately 48mm',
        '12.5mm thickness'
      ],
      finish: [
        'Brushed surfaces on case and bracelet',
        'Polished accents on case sides',
        'Super-LumiNova or Tritium (vintage) lume',
        'Laser-etched Rolex crown on crystal (post-2002)'
      ],
      hardware: [
        'Oysterlock or Glidelock clasp',
        'Screw-down crown',
        'Spring bars at lugs',
        'Bezel clicks 120 times per rotation'
      ],
      marks: [
        'ROLEX and SUBMARINER on dial',
        'Model reference on case between lugs',
        'Serial number on case (location varies by era)',
        'Crown logo on crown, clasp, dial'
      ],
      wear: [
        'Desk diving marks on bracelet acceptable',
        'Bezel insert scratches normal',
        'Crystal scratches reduce value',
        'Polished case (redone) reduces value'
      ]
    },
    photographyGuidance: {
      essential: [
        { location: 'Full dial in good light', reason: 'Assess dial condition and authenticity' },
        { location: 'Serial/reference numbers between lugs', reason: 'Date and authenticate watch' },
        { location: 'Side profile', reason: 'Check crystal condition and case shape' }
      ],
      helpful: [
        { location: 'Clasp open', reason: 'Check clasp markings and model' },
        { location: 'Caseback', reason: 'Should be smooth with no engravings' },
        { location: 'Crown close-up', reason: 'Verify Rolex crown logo' }
      ],
      forAuthentication: [
        { location: 'Movement (if accessible)', reason: 'Internal movement markings are definitive' },
        { location: 'Dial printing macro', reason: 'Print quality indicates authentic vs fake' },
        { location: 'Cyclops magnification', reason: 'Must be 2.5x - fakes often wrong' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: [
        'Cyclops magnifies date exactly 2.5x',
        'Second hand sweeps smoothly (8 beats/second)',
        'Crown logo perfectly aligned',
        'Weight approximately 155g (steel, with bracelet)',
        'Date changes instantly at midnight'
      ],
      fakeIndicators: [
        'Second hand ticks (not sweeps)',
        'Cyclops magnification wrong (usually less)',
        'Light weight (under 130g)',
        'Crown logo quality poor',
        'Date changes slowly',
        'Misspellings on dial or caseback',
        'Caseback with display window (never on Sub)'
      ],
      commonReproductions: [
        'Chinatown/street fakes (obvious quality issues)',
        '"Super clones" (harder to spot, $500-1500 range)',
        '"Franken-watches" (mix of genuine and fake parts)',
        'Homage watches (legitimate, different brand)'
      ],
      ageIndicators: [
        '1953: First Submariner reference 6204',
        '1965: Date added (reference 1680)',
        '1980s: Sapphire crystal introduced',
        '2003: Maxi dial and Super-LumiNova',
        '2008: Ceramic bezel insert',
        '2010: Reference 116610 (current generation)',
        '2020: Reference 126610 (41mm)'
      ],
      provenance: [
        'Box and papers add 10-15% value',
        'Service history with Rolex documentation',
        'Original purchase receipt valuable',
        'Military-issued examples command premium'
      ]
    },
    marketIntelligence: {
      currentDemand: 'hot',
      priceFactors: [
        { factor: 'Full set (box, papers)', impact: '+10-15%' },
        { factor: 'Vintage references (5512, 5513, 1680)', impact: '+50-200%' },
        { factor: 'No date Submariner', impact: '+5-10% (less common)' },
        { factor: 'Recent service by Rolex', impact: '+5%' },
        { factor: 'Polished case', impact: '-10-20%' },
        { factor: 'Replacement parts', impact: '-15-40%' },
        { factor: 'No box/papers', impact: '-10-15%' }
      ],
      bestVenues: [
        'Chrono24 (verified dealer platform)',
        'Bob\'s Watches (established dealer)',
        'Crown & Caliber (verified pre-owned)',
        'Authorized Rolex dealers (new, waitlist)',
        'Christie\'s/Phillips (vintage pieces)'
      ],
      targetBuyers: [
        'Watch collectors',
        'Status purchasers',
        'Investment buyers',
        'Diving enthusiasts',
        'Brand loyalists'
      ],
      seasonality: 'Strong year-round. Slight uptick for gifting seasons. Waitlists at ADs are years long.',
      trend: 'Prices have appreciated 30-50% since 2020. New references sell above MSRP immediately.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'No papers/box shown', question: 'Do you have the original box, papers, or any documentation?' },
        { condition: 'Age uncertain', question: 'Do you know the reference number or approximate year?' },
        { condition: 'Service history unclear', question: 'Has it been serviced, and if so, by Rolex or independent watchmaker?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify authenticity', request: 'Photo of serial number between lugs at 6 o\'clock', reason: 'To verify reference and age' },
        { condition: 'Dial authenticity uncertain', request: 'Macro photo of dial text', reason: 'Print quality is key authentication point' },
        { condition: 'Cannot assess condition', request: 'Photos in different lighting showing case condition', reason: 'Polishing history affects value significantly' }
      ],
      clarify: [
        { condition: 'Reference unclear', clarification: 'Can you provide the exact reference number? Different references have very different values.' },
        { condition: 'Service unclear', clarification: 'Has any part been replaced during service? Non-original parts affect value.' }
      ]
    },
    expertInsights: {
      sellerTips: [
        'Include all documentation and box',
        'Get service done by Rolex before selling (controversial - affects collectibility)',
        'Photograph serial numbers clearly',
        'Disclose any service or replacement parts',
        'Consider professional authentication for high-value pieces'
      ],
      buyerTips: [
        'Buy from established dealers with return policies',
        'Verify serial numbers against Rolex database (via AD)',
        'Be wary of deals that seem too good',
        'Check cyclops magnification (easy first test)',
        'Consider authentication service for private purchases'
      ],
      commonMistakes: [
        'Buying based on price alone (too good = fake)',
        'Assuming all Submariners are the same value',
        'Polishing the case (destroys value)',
        'Not checking for replacement parts',
        'Overlooking box/papers importance'
      ],
      hiddenValue: [
        'Vintage gilt dials (1960s) command huge premiums',
        'Military-issue references (MilSub) extremely rare',
        'Tropical dials (color-changed from age) sought after',
        'Complete sets with hang tags, original receipt',
        'Specific reference variations (collectors know)'
      ],
      storySellsFor: 'The Submariner is the watch that defined the dive watch category in 1953 and became the ultimate symbol of achievement. It\'s been worn by James Bond, explorers, and executives. Every scratch tells a story of a life fully lived.'
    }
  },

  {
    itemId: 'jwl-002', // Art Deco Diamond Ring
    instantRecognition: {
      silhouette: 'Geometric platinum setting with stepped or angular design. Central diamond flanked by smaller stones in symmetric pattern.',
      keyVisualMarkers: [
        'Geometric Art Deco design',
        'Platinum or white gold setting',
        'Milgrain edge details',
        'Old European cut or transitional cut diamonds',
        'Filigree openwork'
      ],
      instantRedFlags: [
        'Modern round brilliant cut center stone',
        'Yellow gold setting (rare for period)',
        'Machine-perfect symmetry',
        'Missing milgrain details'
      ]
    },
    visualCues: {
      construction: ['Hand-pierced filigree', 'Hand-set stones', 'Period construction techniques', 'Knife-edge or tapered shank'],
      materials: ['Platinum (most common)', 'White gold (some)', 'Old cut diamonds', 'Accent sapphires or emeralds'],
      proportions: ['Lower crown angles on old cuts', 'Larger culets visible', 'Period-appropriate sizing'],
      finish: ['Hand-polished platinum', 'Milgrain beading', 'Engraved details'],
      hardware: ['N/A'],
      marks: ['PLAT or PLATINUM stamp', '10% IRID stamp (some)', 'Maker marks (if present)'],
      wear: ['Worn prongs need attention', 'Milgrain softening acceptable', 'Shank thinning from wear']
    },
    photographyGuidance: {
      essential: [
        { location: 'Top view of ring', reason: 'Show design and stone quality' },
        { location: 'Side profile', reason: 'Reveal construction and period details' },
        { location: 'Hallmarks inside band', reason: 'Verify platinum and identify maker' }
      ],
      helpful: [
        { location: 'Diamond face-up', reason: 'Assess cut and quality' },
        { location: 'Underside gallery', reason: 'Period construction techniques' }
      ],
      forAuthentication: [
        { location: 'Milgrain detail macro', reason: 'Hand-applied vs machine milgrain' },
        { location: 'Stone faceting', reason: 'Identify old vs modern cuts' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: ['Hand-pierced filigree work', 'Old European or transitional cut diamonds', 'Period platinum construction', 'Hand-applied milgrain', 'Appropriate wear patterns'],
      fakeIndicators: ['Modern brilliant cuts', 'Machine-made filigree', 'White gold claiming to be platinum', 'Too-perfect condition', 'Wrong proportions'],
      commonReproductions: ['Modern Art Deco style rings', 'Reproduction filigree settings', 'Re-set stones in new mountings'],
      ageIndicators: ['1920-1935: Classic Art Deco period', 'Transitional cut diamonds: 1920s-1930s', 'Platinum became standard: post-1900'],
      provenance: ['Family history valuable', 'Original box very rare', 'Period receipts exceptional']
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Signed pieces (Cartier, Tiffany)', impact: '+100-500%' },
        { factor: 'Original old cut center stone', impact: '+30-50%' },
        { factor: 'Re-cut or modern center', impact: '-20-40%' },
        { factor: 'Quality of filigree work', impact: '+/-25%' }
      ],
      bestVenues: ['Lang Antiques', '1stDibs estate jewelry', 'Christie\'s Jewels sales', 'Estate jewelry specialists'],
      targetBuyers: ['Vintage jewelry collectors', 'Engagement ring buyers seeking unique', 'Art Deco enthusiasts'],
      seasonality: 'Engagement season (Nov-Feb) strongest.',
      trend: 'Strong demand for authentic period pieces. Old cuts increasingly sought after.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Cut type unclear', question: 'Is the center diamond an old European cut or a modern brilliant?' },
        { condition: 'Metal unclear', question: 'Is there a platinum stamp inside the band?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify period', request: 'Photo of inside band showing any stamps', reason: 'Platinum marks help authenticate period' },
        { condition: 'Diamond cut unclear', request: 'Close-up of center stone showing faceting', reason: 'Old cuts have different appearance than modern' }
      ],
      clarify: [
        { condition: 'Condition concerns', clarification: 'Has the ring been restored or are stones original?' }
      ]
    },
    expertInsights: {
      sellerTips: ['Document platinum marks', 'Highlight old cut diamonds', 'Note any maker marks', 'Condition report essential'],
      buyerTips: ['Learn to identify old cuts', 'Verify platinum (not white gold)', 'Check prong condition', 'Consider independent appraisal'],
      commonMistakes: ['Assuming white metal is platinum', 'Not recognizing old cuts', 'Ignoring needed repairs', 'Paying retail for damaged pieces'],
      hiddenValue: ['Signed maker marks', 'Unusual colored stone accents', 'Exceptional filigree quality', 'Original fitted box'],
      storySellsFor: 'Art Deco rings represent the roaring twenties - an era of jazz, flappers, and geometric modernism. Each piece was hand-crafted by master jewelers using techniques that are nearly lost today.'
    }
  },

  {
    itemId: 'jwl-003', // Cartier Tank
    instantRecognition: {
      silhouette: 'Rectangular case with vertical brancards (side bars) that integrate into the strap. Roman numeral dial with blue hands.',
      keyVisualMarkers: ['Rectangular "tank tread" case shape', 'Brancards (vertical case sides)', 'Roman numeral dial', 'Blue steel "sword" hands', 'Sapphire cabochon crown'],
      instantRedFlags: ['Wrong case proportions', 'Missing sapphire crown', 'Arabic numerals (wrong for most models)', 'Poor quality finishing']
    },
    visualCues: {
      construction: ['Gold or steel case', 'Integrated brancards', 'Deployant or tang buckle', 'Manual or quartz movement'],
      materials: ['18k gold (yellow, white, rose)', 'Stainless steel', 'Leather strap', 'Sapphire crystal (modern)'],
      proportions: ['Various Tank models have specific dimensions', 'Tank Française vs Américaine vs Solo', 'Case length to width ratios specific'],
      finish: ['Polished case sides', 'Brushed or polished bracelet', 'Guilloche dial (some)'],
      hardware: ['Sapphire cabochon crown', 'Cartier signed buckle', 'Deployant clasp (some)'],
      marks: ['Cartier signature on dial', 'SWISS MADE text', 'Case back engravings', 'Reference and serial numbers'],
      wear: ['Strap wear normal', 'Case scratches acceptable', 'Crown replacement sometimes needed']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full dial view', reason: 'Verify design and condition' },
        { location: 'Case side showing brancards', reason: 'Characteristic Tank design' },
        { location: 'Case back with engravings', reason: 'Model identification' }
      ],
      helpful: [
        { location: 'Crown detail', reason: 'Sapphire cabochon verification' },
        { location: 'Buckle/clasp', reason: 'Cartier signed hardware' }
      ],
      forAuthentication: [
        { location: 'Dial printing macro', reason: 'Quality of Cartier text' },
        { location: 'Movement (if accessible)', reason: 'Cartier movements marked' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct proportions for model', 'Proper dial printing quality', 'Cartier signed movement', 'Sapphire cabochon crown', 'Correct reference markings'],
      fakeIndicators: ['Wrong proportions', 'Poor dial printing', 'Unsigned movement', 'Glass crown cap (not sapphire)', 'Misspellings'],
      commonReproductions: ['Asian market fakes', 'Fashion watch copies', 'Franken-watches with mix of parts'],
      ageIndicators: ['1917: Original Tank design', '1996: Tank Française', '2023: Current production', 'Vintage vs modern movements'],
      provenance: ['Cartier documentation', 'Service records', 'Original box and papers']
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Gold vs steel', impact: 'Gold 2-3x steel prices' },
        { factor: 'Vintage references', impact: '+25-100%' },
        { factor: 'Complete set (box/papers)', impact: '+15-25%' },
        { factor: 'Mechanical vs quartz', impact: 'Mechanical +30-50%' }
      ],
      bestVenues: ['Cartier boutiques (new)', 'Chrono24', 'Watchbox', 'Major auction houses (vintage)'],
      targetBuyers: ['Dress watch enthusiasts', 'Cartier collectors', 'Fashion-conscious buyers', 'Investment buyers'],
      seasonality: 'Strong year-round, slight holiday uptick.',
      trend: 'Tank enjoying renewed popularity. Vintage models increasingly collected.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Model unclear', question: 'What model Tank is this - Française, Américaine, Solo, or another?' },
        { condition: 'Movement type unknown', question: 'Is this manual-wind, automatic, or quartz?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify authenticity', request: 'Case back photo showing reference and serial numbers', reason: 'Verification of authentic Cartier' },
        { condition: 'Condition unclear', request: 'Close-up of dial and crystal', reason: 'Assess condition and originality' }
      ],
      clarify: [
        { condition: 'Papers unclear', clarification: 'Do you have the original Cartier warranty card and documentation?' }
      ]
    },
    expertInsights: {
      sellerTips: ['Include all documentation', 'Note service history', 'Specify exact model reference', 'Professional photos essential'],
      buyerTips: ['Verify reference numbers with Cartier', 'Examine dial printing quality', 'Check crown sapphire', 'Consider service history'],
      commonMistakes: ['Confusing Tank models', 'Not verifying authenticity', 'Ignoring service needs', 'Overpaying for quartz models'],
      hiddenValue: ['Vintage references', 'Unusual dial variations', 'Important provenance', 'Limited editions'],
      storySellsFor: 'Louis Cartier designed the Tank in 1917, inspired by the Renault tanks he saw on the Western Front. The case sides (brancards) represent the tank treads. It\'s been worn by everyone from Jackie Kennedy to Princess Diana.'
    }
  },

  {
    itemId: 'jwl-004', // Victorian Cameo Brooch
    instantRecognition: {
      silhouette: 'Oval carved shell or stone showing classical profile in relief. Set in decorative metal frame.',
      keyVisualMarkers: ['High-relief carved profile', 'Classical female subject', 'Shell or hardstone material', 'Period frame design', 'Pin mechanism on reverse'],
      instantRedFlags: ['Plastic or resin material', 'Molded rather than carved', 'Modern clasp mechanism', 'Flat or shallow carving']
    },
    visualCues: {
      construction: ['Hand-carved shell or stone', 'Bezel-set in frame', 'Period pin mechanism', 'Bail for pendant conversion (some)'],
      materials: ['Cornelian shell (most common)', 'Sardonyx or agate', 'Lava (volcanic)', 'Gold, gold-filled, or pinchbeck frame'],
      proportions: ['Typically 1.5-2.5 inches', 'Oval format standard', 'Relief height indicates quality'],
      finish: ['Smooth carved surfaces', 'Period frame patina', 'Original pin intact'],
      hardware: ['C-clasp (early)', 'Trombone clasp (Victorian)', 'Safety catch (later additions)'],
      marks: ['Gold marks on frame (if gold)', 'Maker marks rare', 'Test metal if unmarked'],
      wear: ['Shell chipping problematic', 'Frame wear acceptable', 'Pin mechanism function important']
    },
    photographyGuidance: {
      essential: [
        { location: 'Front view of carving', reason: 'Assess quality and subject' },
        { location: 'Profile/side showing depth', reason: 'Evaluate relief quality' },
        { location: 'Back with clasp', reason: 'Date by mechanism type' }
      ],
      helpful: [
        { location: 'Frame detail', reason: 'Assess frame quality and marks' },
        { location: 'Any damage areas', reason: 'Condition critical for shell' }
      ],
      forAuthentication: [
        { location: 'Carving detail macro', reason: 'Hand-carved vs molded evidence' },
        { location: 'Material edges', reason: 'Verify shell layers visible' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: ['Visible shell layers at edge', 'Hand-carved tool marks', 'Period clasp mechanism', 'Appropriate frame style', 'Natural material variation'],
      fakeIndicators: ['Uniform material (plastic)', 'Mold seams', 'Modern safety clasp on "antique"', 'Too-perfect carving', 'Wrong frame style for period'],
      commonReproductions: ['Modern shell carvings (still valuable)', 'Plastic/resin cameos', 'Machine-carved reproductions', 'Old frames with new carvings'],
      ageIndicators: ['1830-1850: Georgian to early Victorian', '1850-1890: High Victorian period', 'C-clasp suggests earlier', 'Trombone clasp: 1850-1900'],
      provenance: ['Family history adds interest', 'Grand Tour provenance desirable', 'Original box rare']
    },
    marketIntelligence: {
      currentDemand: 'moderate',
      priceFactors: [
        { factor: 'Exceptional carving quality', impact: '+100-300%' },
        { factor: 'Solid gold frame', impact: '+50-100%' },
        { factor: 'Large size (3+ inches)', impact: '+50%' },
        { factor: 'Hardstone (agate) vs shell', impact: '+100-200%' },
        { factor: 'Shell damage', impact: '-50-75%' }
      ],
      bestVenues: ['Ruby Lane', '1stDibs', 'Estate jewelry specialists', 'eBay (common pieces)'],
      targetBuyers: ['Victorian jewelry collectors', 'Cameo specialists', 'Costume jewelry buyers', 'Decorative buyers'],
      seasonality: 'Steady year-round. Victorian aesthetics currently in fashion.',
      trend: 'Quality pieces holding value. Common examples more price-sensitive.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Material unclear', question: 'Is this shell, hardstone, or another material?' },
        { condition: 'Frame metal unknown', question: 'Is the frame gold, gold-filled, or another metal?' }
      ],
      requestPhoto: [
        { condition: 'Quality assessment needed', request: 'Side profile showing carving depth', reason: 'Relief height indicates quality' },
        { condition: 'Material verification', request: 'Close-up of edge showing layers', reason: 'Shell shows distinct color layers' }
      ],
      clarify: [
        { condition: 'Condition unclear', clarification: 'Are there any chips or cracks in the carving?' }
      ]
    },
    expertInsights: {
      sellerTips: ['Note material type clearly', 'Photograph carving quality', 'Document frame metal', 'Condition disclosure essential'],
      buyerTips: ['Learn to identify shell layers', 'Check clasp type for dating', 'Examine carving under magnification', 'Test frame metal if possible'],
      commonMistakes: ['Confusing materials', 'Overvaluing common pieces', 'Ignoring condition issues', 'Missing frame value'],
      hiddenValue: ['Male subjects (rarer)', 'Mythological scenes', 'Signed by known carvers', 'Hardstone materials'],
      storySellsFor: 'Victorian cameos were the souvenir of the Grand Tour - wealthy travelers brought them back from Italy where generations of carvers created portraits from shells harvested in the Mediterranean. Each one required days of painstaking hand carving.'
    }
  },

  {
    itemId: 'jwl-005', // Tiffany Setting Engagement Ring
    instantRecognition: {
      silhouette: 'Classic six-prong solitaire setting lifting diamond above band. Knife-edge band profile.',
      keyVisualMarkers: ['Six platinum prongs', 'Diamond raised high', 'Knife-edge band', 'Minimal design', 'Tiffany blue box'],
      instantRedFlags: ['Four-prong setting', 'Low-set diamond', 'Yellow gold (less common)', 'Poor quality finishing']
    },
    visualCues: {
      construction: ['Six-prong head', 'Platinum construction', 'Knife-edge shank', 'Minimal gallery'],
      materials: ['Platinum (standard)', '18k gold option', 'Tiffany-graded diamond', 'GIA certified stones'],
      proportions: ['Classic proportions established 1886', 'Head height lifts diamond', 'Band width varies by ring size'],
      finish: ['High polish platinum', 'Precise prong placement', 'Quality craftsmanship throughout'],
      hardware: ['N/A'],
      marks: ['T&CO hallmark', 'TIFFANY & CO.', 'PT950 or 750', 'Diamond serial number (laser inscribed)'],
      wear: ['Prong tips may need re-tipping', 'Platinum scratches (normal)', 'Polish restores appearance']
    },
    photographyGuidance: {
      essential: [
        { location: 'Top view showing diamond', reason: 'Assess diamond and setting' },
        { location: 'Side profile', reason: 'Classic Tiffany setting height' },
        { location: 'Inside band hallmarks', reason: 'Verify Tiffany authenticity' }
      ],
      helpful: [
        { location: 'Prong detail', reason: 'Assess prong condition' },
        { location: 'Documentation', reason: 'Certificate and appraisal' }
      ],
      forAuthentication: [
        { location: 'Hallmark macro', reason: 'Verify genuine Tiffany marks' },
        { location: 'Diamond inscription', reason: 'Tiffany serial number verification' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct Tiffany hallmarks', 'Tiffany diamond certificate', 'Laser inscribed serial', 'Proper construction quality', 'Original documentation'],
      fakeIndicators: ['Wrong or missing hallmarks', 'Generic GIA certificate', 'No serial inscription', 'Poor quality construction', 'Suspicious price'],
      commonReproductions: ['Generic solitaire rings', 'Fake Tiffany boxes/paperwork', 'Stamped with fake hallmarks'],
      ageIndicators: ['1886: Setting design introduced', 'Modern production consistent', 'Vintage Tiffany (pre-1960s) slightly different'],
      provenance: ['Original Tiffany receipt', 'Certificate of authenticity', 'Original packaging']
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Diamond size/quality', impact: 'Primary driver' },
        { factor: 'Complete documentation', impact: '+10-20%' },
        { factor: 'Original packaging', impact: '+5-10%' },
        { factor: 'Vintage pieces', impact: '+15-30%' }
      ],
      bestVenues: ['Tiffany directly (new)', 'Worthy.com', 'I Do Now I Don\'t', 'Consignment specialists'],
      targetBuyers: ['Engagement ring buyers', 'Brand loyalists', 'Investment buyers', 'Collectors (vintage)'],
      seasonality: 'Engagement season (Nov-Feb) strongest demand.',
      trend: 'Tiffany brand premium remains strong. Resale typically 50-60% of retail.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Documentation unclear', question: 'Do you have the original Tiffany certificate and documentation?' },
        { condition: 'Diamond details unknown', question: 'What are the carat weight and quality grades of the diamond?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify authenticity', request: 'Photo of hallmarks inside band', reason: 'Essential for Tiffany authentication' },
        { condition: 'Documentation verification', request: 'Photo of Tiffany certificate', reason: 'Certificate should match ring' }
      ],
      clarify: [
        { condition: 'Price questions', clarification: 'Tiffany rings typically resell for 50-60% of retail - is pricing realistic?' }
      ]
    },
    expertInsights: {
      sellerTips: ['Keep all documentation', 'Original packaging adds value', 'Get Tiffany service history', 'Professional photos essential'],
      buyerTips: ['Verify with Tiffany directly if possible', 'Check serial number matches certificate', 'Understand resale value vs retail', 'Consider certified pre-owned from Tiffany'],
      commonMistakes: ['Expecting retail prices at resale', 'Not verifying authenticity', 'Losing documentation', 'Generic appraisals vs Tiffany certificate'],
      hiddenValue: ['Vintage settings (pre-1960)', 'Unusual diamond shapes', 'Important provenance', 'Complete original packaging'],
      storySellsFor: 'Charles Tiffany introduced this setting in 1886, revolutionizing engagement rings by lifting the diamond above the band to maximize brilliance. It became the world\'s most iconic engagement ring design.'
    }
  },

  {
    itemId: 'jwl-006', // Omega Speedmaster
    instantRecognition: {
      silhouette: 'Chronograph with tachymeter bezel, three subdials, and asymmetric case with crown guards. The "Moonwatch."',
      keyVisualMarkers: ['Tachymeter bezel scale', 'Three subdials (30 min, 12 hour, seconds)', 'Asymmetric case with crown guards', 'Hesalite crystal (original)', 'Stepped dial'],
      instantRedFlags: ['Wrong subdial layout', 'Missing tachymeter', 'Incorrect case shape', 'Modern features on claimed vintage']
    },
    visualCues: {
      construction: ['Manual-wind chronograph (Professional)', 'Asymmetric twisted lugs', 'Push-pull crown', 'Pump pushers'],
      materials: ['Stainless steel (standard)', 'Hesalite or sapphire crystal', 'Steel bracelet or straps', 'Gold variations exist'],
      proportions: ['42mm case diameter', 'Specific lug-to-lug distance', 'Correct subdial placement'],
      finish: ['Brushed case top', 'Polished sides', 'Matte dial finish', 'Applied Omega logo (some)'],
      hardware: ['Omega signed crown', 'Chronograph pushers', 'Omega deployant bracelet'],
      marks: ['Omega logo on dial', 'SPEEDMASTER text', 'Reference on case back', 'Caliber number inside'],
      wear: ['Hesalite scratches easily (polish out)', 'Case scratches normal', 'Bracelet stretch over time']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full dial view', reason: 'Assess dial configuration and condition' },
        { location: 'Case back', reason: 'Reference number and "First Watch on Moon" text' },
        { location: 'Side profile', reason: 'Verify asymmetric case and crystal type' }
      ],
      helpful: [
        { location: 'Movement (if opened)', reason: 'Caliber verification' },
        { location: 'Bracelet/strap detail', reason: 'Omega authenticity' }
      ],
      forAuthentication: [
        { location: 'Dial printing macro', reason: 'Quality indicates authenticity' },
        { location: 'Case back engravings', reason: 'Verify Omega text quality' }
      ]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct movement caliber (1861, 3861)', 'Proper dial proportions', 'Correct case back text', 'Omega signed components', 'Appropriate weight'],
      fakeIndicators: ['Automatic movement (if claiming Pro)', 'Wrong dial spacing', 'Poor quality printing', 'Missing case back text', 'Light weight'],
      commonReproductions: ['Asian market fakes', 'Franken-watches with mixed parts', 'Homage watches (Alpha, etc.)'],
      ageIndicators: ['1957: First Speedmaster', '1969: Moon landing', 'Caliber 321 (early, valuable)', 'Caliber 861 (1968)', 'Caliber 1861 (1996)', 'Caliber 3861 (2021)'],
      provenance: ['NASA documentation exceptional', 'Astronaut provenance premium', 'Full box/papers add value']
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Pre-moon references', impact: '+100-500%' },
        { factor: 'Full set (box/papers)', impact: '+15-25%' },
        { factor: 'Caliber 321', impact: '+200-400%' },
        { factor: 'NASA provenance', impact: '+500%+' },
        { factor: 'Hesalite vs sapphire', impact: 'Collectors prefer Hesalite' }
      ],
      bestVenues: ['Chrono24', 'Omega boutiques (new)', 'Specialized watch dealers', 'Phillips/Christie\'s (rare refs)'],
      targetBuyers: ['Watch collectors', 'Space enthusiasts', 'Chronograph collectors', 'Omega brand loyalists'],
      seasonality: 'Anniversary dates (July moon landing) drive interest.',
      trend: 'Steady appreciation. Vintage references increasingly valuable.'
    },
    conversationTriggers: {
      askAbout: [
        { condition: 'Reference unclear', question: 'What is the reference number on the case back?' },
        { condition: 'Movement unknown', question: 'Is this manual-wind or automatic?' }
      ],
      requestPhoto: [
        { condition: 'Cannot verify model', request: 'Case back photo showing reference and text', reason: 'Reference determines model and value' },
        { condition: 'Crystal type unclear', request: 'Side profile showing crystal', reason: 'Hesalite vs sapphire affects collector preference' }
      ],
      clarify: [
        { condition: 'Documentation unclear', clarification: 'Do you have the original box, papers, and purchase history?' }
      ]
    },
    expertInsights: {
      sellerTips: ['Document reference number clearly', 'Note movement caliber', 'Include all documentation', 'Service history important'],
      buyerTips: ['Learn reference numbers', 'Hesalite is collector choice', 'Manual-wind is the "real" Moonwatch', 'Verify with Omega if possible'],
      commonMistakes: ['Confusing Pro with automatic models', 'Not knowing reference importance', 'Polishing cases', 'Ignoring caliber differences'],
      hiddenValue: ['Pre-moon references', 'Tropical (color-changed) dials', 'Alaska Project and special editions', 'NASA-issued examples'],
      storySellsFor: 'The Speedmaster is the only watch qualified by NASA for spaceflight. It was worn on the moon in 1969 and helped save Apollo 13 by timing crucial engine burns. Every Moonwatch carries that heritage.'
    }
  }
]

/**
 * SILVER & METALWARE EXPERTISE
 */
const silverKnowledge: ExpertKnowledgeEntry[] = [
  {
    itemId: 'silv-001', // Georgian Silver Teapot
    instantRecognition: {
      silhouette: 'Classic oval or drum-shaped teapot with wooden handle. Bright-cut engraving and period form typical of late Georgian era.',
      keyVisualMarkers: ['Sterling silver body', 'Bright-cut engraving', 'Wooden scroll handle', 'Hinged lid with finial', 'Pedestal foot'],
      instantRedFlags: ['No hallmarks', 'Wrong period style', 'Modern construction', 'Silver-plate appearance']
    },
    visualCues: {
      construction: ['Raised from sheet silver', 'Soldered seams', 'Applied foot ring', 'Hinged lid mechanism'],
      materials: ['Sterling silver (.925)', 'Ebony or fruitwood handle', 'Silver or ivory finial'],
      proportions: ['Period-appropriate form', 'Handle and spout balance', 'Lid fits properly'],
      finish: ['Period patina', 'Bright-cut decoration', 'Original engraving'],
      hardware: ['Hinge mechanism', 'Handle insulators'],
      marks: ['Lion passant (sterling)', 'Date letter', 'Maker\'s mark', 'Town mark', 'Duty mark'],
      wear: ['Handle replacement acceptable', 'Wear to foot rim normal', 'Dents affect value']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full profile view', reason: 'Assess form and condition' },
        { location: 'Hallmarks close-up', reason: 'Date and authenticate piece' },
        { location: 'Engraving detail', reason: 'Assess period decoration' }
      ],
      helpful: [{ location: 'Interior condition', reason: 'Check for repairs' }, { location: 'Handle attachment', reason: 'Original vs replacement' }],
      forAuthentication: [{ location: 'All hallmarks individually', reason: 'Full mark identification' }, { location: 'Construction seams', reason: 'Period technique verification' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Complete set of hallmarks', 'Appropriate marks for date', 'Period construction', 'Consistent wear patterns', 'Correct weight'],
      fakeIndicators: ['Fake or transposed hallmarks', 'Modern solder', 'Wrong weight for size', 'Anachronistic features'],
      commonReproductions: ['Victorian reproductions', 'Modern Sheffield copies', 'Electroplate with fake marks'],
      ageIndicators: ['1760-1790: Bright-cut engraving peak', '1780-1820: Oval drum forms', 'Date letter identifies exact year'],
      provenance: ['Armorial engraving adds interest', 'Family history', 'Important maker attribution']
    },
    marketIntelligence: {
      currentDemand: 'moderate',
      priceFactors: [
        { factor: 'Important maker (Hester Bateman, etc.)', impact: '+100-300%' },
        { factor: 'Complete tea service', impact: '+50-100%' },
        { factor: 'Armorial engraving', impact: '+25-50%' },
        { factor: 'Dents or damage', impact: '-30-50%' }
      ],
      bestVenues: ['Christie\'s silver sales', 'Bonhams', 'Specialist silver dealers', 'S.J. Shrubsole'],
      targetBuyers: ['Silver collectors', 'Georgian period enthusiasts', 'Decorator market'],
      seasonality: 'Silver sales in spring and fall at major houses.',
      trend: 'Georgian silver holds value well. Important makers commanding premiums.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Hallmarks unclear', question: 'Can you describe the hallmarks? Are there four or five marks present?' }],
      requestPhoto: [{ condition: 'Cannot read marks', request: 'Clear photos of each hallmark', reason: 'Marks determine date, maker, and value' }],
      clarify: [{ condition: 'Condition unclear', clarification: 'Are there any dents, repairs, or replaced parts?' }]
    },
    expertInsights: {
      sellerTips: ['Research maker marks', 'Note hallmark date', 'Document any armorials', 'Weigh piece accurately'],
      buyerTips: ['Learn hallmark system', 'Check for repairs', 'Verify weight vs size', 'Research maker importance'],
      commonMistakes: ['Misreading hallmarks', 'Missing repairs', 'Confusing plate for silver', 'Ignoring maker importance'],
      hiddenValue: ['Important woman silversmiths', 'Provincial marks', 'Colonial American connections', 'Royal armorials'],
      storySellsFor: 'Georgian silver represents the pinnacle of English silver craftsmanship. The bright-cut engraving was done by hand with a specialized tool - each cut reflecting light like a tiny mirror. This teapot witnessed the birth of American independence.'
    }
  },

  {
    itemId: 'silv-002', // Gorham Martelé Vase
    instantRecognition: {
      silhouette: 'Organic flowing Art Nouveau form with hand-hammered surface. Naturalistic decoration with floral motifs.',
      keyVisualMarkers: ['Hand-hammered surface texture', 'Organic flowing form', 'Floral/nature decoration', '.950 silver purity', 'MARTELÉ stamp'],
      instantRedFlags: ['Machine-smooth surface', 'Geometric design (wrong period)', 'Sterling .925 mark', 'Missing Gorham marks']
    },
    visualCues: {
      construction: ['Hand-raised from sheet', 'Planished surface', 'Chased decoration', 'Applied elements'],
      materials: ['.950 fine silver (higher than sterling)', 'Hand-finished throughout'],
      proportions: ['Asymmetric Art Nouveau forms', 'Each piece unique', 'Various sizes produced'],
      finish: ['Hammered texture visible', 'Original patina', 'Soft gray tone'],
      hardware: ['N/A'],
      marks: ['GORHAM mark', 'MARTELÉ stamp', '.950 fine', 'Serial number', 'Date letter', 'Artist initials'],
      wear: ['Light scratches acceptable', 'Dents problematic', 'Patina desirable']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full piece multiple angles', reason: 'Show organic form' },
        { location: 'All marks on base', reason: 'Authentication and dating' },
        { location: 'Surface texture detail', reason: 'Verify hand-hammered' }
      ],
      helpful: [{ location: 'Decoration detail', reason: 'Assess chasing quality' }],
      forAuthentication: [{ location: 'Artist initials if present', reason: 'Attribution adds value' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Complete Gorham mark set', '.950 fine mark', 'Genuine hand-hammering', 'Consistent quality throughout', 'Serial number in records'],
      fakeIndicators: ['Machine hammering (too regular)', 'Sterling mark on claimed Martelé', 'Incomplete marks', 'Poor quality chasing'],
      commonReproductions: ['Modern Art Nouveau style pieces', 'Other makers\' similar work'],
      ageIndicators: ['1897-1912: Martelé production period', 'Date letters document year', 'Style evolution over period'],
      provenance: ['Original purchase records rare', 'Exhibition history valuable', 'Published examples']
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Large impressive size', impact: '+50-100%' },
        { factor: 'Known artist attribution', impact: '+25-50%' },
        { factor: 'Exhibition history', impact: '+50%' },
        { factor: 'Damage or repairs', impact: '-40-60%' }
      ],
      bestVenues: ['Christie\'s American silver', 'Rago Arts', 'Specialist American silver dealers'],
      targetBuyers: ['American silver collectors', 'Art Nouveau collectors', 'Museum acquisitions'],
      seasonality: 'American silver sales in spring and fall.',
      trend: 'Martelé consistently strong. Quality pieces in high demand.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Marks unclear', question: 'Does it have the MARTELÉ stamp and .950 fine mark?' }],
      requestPhoto: [{ condition: 'Cannot verify', request: 'All base marks clearly photographed', reason: 'Authentication requires complete marks' }],
      clarify: [{ condition: 'Condition unclear', clarification: 'Any dents, repairs, or damage to the surface?' }]
    },
    expertInsights: {
      sellerTips: ['Document all marks', 'Research serial number', 'Note artist initials', 'Condition critical'],
      buyerTips: ['Verify .950 fineness', 'Check for repairs', 'Research comparable sales', 'Buy from knowledgeable sources'],
      commonMistakes: ['Confusing with regular Gorham', 'Missing the higher silver content', 'Not researching artist'],
      hiddenValue: ['Known designer attribution', 'Exhibition pieces', 'Important provenance', 'Matching sets'],
      storySellsFor: 'Gorham\'s Martelé line represented the pinnacle of American Art Nouveau silver. Each piece was hand-raised by master craftsmen, taking weeks to complete. The .950 fine silver was purer than sterling, and no two pieces were identical.'
    }
  },

  {
    itemId: 'silv-003', // Tiffany Chrysanthemum Flatware
    instantRecognition: {
      silhouette: 'Ornate sterling flatware with detailed chrysanthemum flower pattern in relief.',
      keyVisualMarkers: ['Chrysanthemum flower design', 'High relief decoration', 'Sterling silver weight', 'Tiffany marks'],
      instantRedFlags: ['Lightweight feel', 'Silver-plate', 'Missing marks', 'Poor detail quality']
    },
    visualCues: {
      construction: ['Die-struck pattern', 'Hand-finished details', 'Solid sterling construction'],
      materials: ['Sterling silver (.925)', 'Appropriate weight for form'],
      proportions: ['Period-correct sizing', 'Balanced proportions', 'Consistent within set'],
      finish: ['Bright or French gray finish', 'Detail crisp', 'Pattern complete'],
      hardware: ['N/A'],
      marks: ['TIFFANY & CO', 'STERLING', 'M mark (post-1902)', 'Pattern name (sometimes)'],
      wear: ['Handle wear normal', 'Bowl wear from use', 'Monograms may be present']
    },
    photographyGuidance: {
      essential: [
        { location: 'Pattern detail', reason: 'Identify pattern and quality' },
        { location: 'Hallmarks', reason: 'Verify Tiffany and sterling' },
        { location: 'Full piece', reason: 'Assess condition and size' }
      ],
      helpful: [{ location: 'Set overview', reason: 'Document completeness' }],
      forAuthentication: [{ location: 'Mark detail', reason: 'Verify authentic Tiffany marks' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct Tiffany marks', 'Proper sterling weight', 'Crisp pattern detail', 'Consistent quality'],
      fakeIndicators: ['Wrong marks', 'Lightweight', 'Soft pattern detail', 'Poor quality'],
      commonReproductions: ['International Silver copies', 'Other makers\' similar patterns'],
      ageIndicators: ['1880: Pattern introduced', 'M mark: post-1902', 'Pattern variations over time'],
      provenance: ['Original purchase documentation', 'Tiffany service records']
    },
    marketIntelligence: {
      currentDemand: 'moderate',
      priceFactors: [
        { factor: 'Complete service', impact: '+25-50%' },
        { factor: 'No monograms', impact: '+10-15%' },
        { factor: 'Serving pieces', impact: '+50-100% vs place pieces' },
        { factor: 'Condition issues', impact: '-20-40%' }
      ],
      bestVenues: ['Replacements.com', 'Beverly Bremer Silver', 'Estate sales', 'eBay'],
      targetBuyers: ['Pattern completers', 'New brides', 'Sterling collectors'],
      seasonality: 'Wedding season (spring/summer) strongest.',
      trend: 'Classic patterns hold value. Market well-established.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Set size unknown', question: 'How many place settings and what pieces are included?' }],
      requestPhoto: [{ condition: 'Cannot verify marks', request: 'Close-up of Tiffany marks', reason: 'Verify authenticity' }],
      clarify: [{ condition: 'Monograms present', clarification: 'Are there any monograms on the pieces?' }]
    },
    expertInsights: {
      sellerTips: ['Count and list all pieces', 'Note any monograms', 'Weigh pieces', 'Group by type'],
      buyerTips: ['Verify Tiffany marks', 'Check pattern name matches', 'Compare weights', 'Note condition'],
      commonMistakes: ['Paying Tiffany prices for other makers', 'Ignoring damage', 'Not counting pieces'],
      hiddenValue: ['Unusual serving pieces', 'Pre-1902 marks', 'Complete services', 'Original chest'],
      storySellsFor: 'The Chrysanthemum pattern was introduced by Tiffany in 1880 during the height of the Aesthetic Movement\'s love affair with Japanese art. It remains one of the most collected flatware patterns in the world.'
    }
  },

  {
    itemId: 'silv-004', // Paul Revere Bowl
    instantRecognition: {
      silhouette: 'Classic American bowl form with rounded body, flared rim, and foot ring. Simple elegant profile.',
      keyVisualMarkers: ['Simple round form', 'Flared lip', 'Foot ring base', 'Possible engraving', 'Sterling construction'],
      instantRedFlags: ['Wrong proportions', 'No marks', 'Plated construction', 'Modern manufacture tells']
    },
    visualCues: {
      construction: ['Raised or spun from sheet', 'Applied foot ring', 'Period techniques'],
      materials: ['Sterling silver', 'Proper weight for size'],
      proportions: ['Classic bowl ratios', 'Foot ring in proportion', 'Lip flare consistent'],
      finish: ['Polish or patina', 'Engraving if present', 'Surface condition'],
      hardware: ['N/A'],
      marks: ['STERLING mark', 'Maker\'s mark', 'Possible retailer mark'],
      wear: ['Base wear normal', 'Interior wear from use', 'Polish wear on high points']
    },
    photographyGuidance: {
      essential: [
        { location: 'Profile view', reason: 'Show classic form' },
        { location: 'All marks', reason: 'Identify maker and verify silver' },
        { location: 'Any engraving', reason: 'Documentation and interest' }
      ],
      helpful: [{ location: 'Interior', reason: 'Assess condition' }],
      forAuthentication: [{ location: 'Construction detail at base', reason: 'Period technique verification' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Proper marks', 'Correct weight', 'Period construction', 'Appropriate proportions'],
      fakeIndicators: ['Missing marks', 'Wrong weight', 'Modern spinning marks', 'Incorrect proportions'],
      commonReproductions: ['Inexpensive modern copies', 'Silver-plate examples', 'Import copies'],
      ageIndicators: ['1768: Original Revere design', 'Various makers reproduced form', 'Maker marks date pieces'],
      provenance: ['Engraved presentations', 'Trophy awards', 'Family history']
    },
    marketIntelligence: {
      currentDemand: 'moderate',
      priceFactors: [
        { factor: 'Important maker', impact: '+50-200%' },
        { factor: 'Large size', impact: '+25-50%' },
        { factor: 'Presentation engraving', impact: '+/-varies' },
        { factor: 'Damage', impact: '-30-50%' }
      ],
      bestVenues: ['Antique silver dealers', 'Estate sales', 'eBay', 'Auction houses'],
      targetBuyers: ['Americana collectors', 'Trophy collectors', 'Decorator market'],
      seasonality: 'Steady year-round.',
      trend: 'Classic form remains popular. Quality varies widely.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Maker unclear', question: 'What maker\'s mark is on the bowl?' }],
      requestPhoto: [{ condition: 'Cannot verify', request: 'Clear photos of all marks', reason: 'Maker determines value' }],
      clarify: [{ condition: 'Engraving present', clarification: 'What does the engraving say? Trophy inscriptions can add or detract.' }]
    },
    expertInsights: {
      sellerTips: ['Research maker', 'Document engraving', 'Weigh accurately', 'Note condition'],
      buyerTips: ['Verify maker quality', 'Check proportions', 'Consider engraving\'s appeal', 'Test weight'],
      commonMistakes: ['Assuming all are valuable', 'Ignoring maker quality', 'Overvaluing generic examples'],
      hiddenValue: ['Important makers', 'Historical presentation pieces', 'Early examples', 'Colonial period (very rare)'],
      storySellsFor: 'This bowl form was made famous by Paul Revere in 1768 as the Sons of Liberty Bowl. The simple, elegant form became the quintessential American silver shape, reproduced by every major silver maker since.'
    }
  },

  {
    itemId: 'silv-005', // Georg Jensen Silver
    instantRecognition: {
      silhouette: 'Organic flowing forms with Danish modern sensibility. Nature-inspired motifs, especially grapes and blossoms.',
      keyVisualMarkers: ['Organic Art Nouveau/Deco forms', 'Grape or blossom motifs', 'Hand-hammered finish', 'Danish silver marks', 'Jensen quality'],
      instantRedFlags: ['Wrong marks', 'Poor quality', 'Machine finish', 'Incorrect designs']
    },
    visualCues: {
      construction: ['Hand-raised forms', 'Applied decoration', 'Exceptional craftsmanship', 'Weighted bases (holloware)'],
      materials: ['Danish sterling .925', 'Ivory/wood accents (vintage)', 'Stainless additions (modern)'],
      proportions: ['Design-specific proportions', 'Consistent with catalogs', 'Balanced forms'],
      finish: ['Hand-finished surface', 'Oxidized details', 'Original or restored patina'],
      hardware: ['Ivory insulators (early)', 'Wood handles', 'Hinge mechanisms'],
      marks: ['GEORG JENSEN in dotted oval', 'Design number', 'DENMARK', 'Sterling', 'Date marks'],
      wear: ['Light wear acceptable', 'Oxidation in recesses', 'Polishing reduces some value']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full piece', reason: 'Show design and form' },
        { location: 'All marks', reason: 'Authentication and dating' },
        { location: 'Design number', reason: 'Identify specific design' }
      ],
      helpful: [{ location: 'Detail of decoration', reason: 'Assess quality' }],
      forAuthentication: [{ location: 'Mark detail', reason: 'Verify genuine Jensen marks' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct Jensen marks', 'Proper design numbers', 'Quality consistent with Jensen', 'Weight appropriate'],
      fakeIndicators: ['Wrong marks', 'Poor quality', 'Unknown design numbers', 'Wrong weight'],
      commonReproductions: ['Mexican copies', 'Asian reproductions', 'Other Danish makers'],
      ageIndicators: ['1904-1935: Georg Jensen lifetime', '1935-1977: Post-founder period', 'Mark changes date pieces', 'Design introduction dates'],
      provenance: ['Jensen documentation', 'Original boxes', 'Design attribution']
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Early Georg Jensen period', impact: '+50-100%' },
        { factor: 'Iconic designs (Blossom, Acorn)', impact: '+25-50%' },
        { factor: 'Large holloware', impact: 'Premium' },
        { factor: 'Damage or repairs', impact: '-30-50%' }
      ],
      bestVenues: ['Georg Jensen boutiques (new)', 'Bonhams Nordic design', 'Specialist Danish design dealers', '1stDibs'],
      targetBuyers: ['Scandinavian design collectors', 'Silver collectors', 'Design museums', 'Interior designers'],
      seasonality: 'Steady year-round. Nordic design sales in spring.',
      trend: 'Consistently strong. Iconic designs in high demand.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Design unclear', question: 'What is the design number? This identifies the specific pattern.' }],
      requestPhoto: [{ condition: 'Cannot verify', request: 'Clear photo of all marks including design number', reason: 'Essential for identification and value' }],
      clarify: [{ condition: 'Age uncertain', clarification: 'What do the marks look like? Mark style helps date the piece.' }]
    },
    expertInsights: {
      sellerTips: ['Research design number', 'Document marks carefully', 'Note condition', 'Original boxes valuable'],
      buyerTips: ['Learn mark dating', 'Verify design numbers', 'Check condition carefully', 'Buy from knowledgeable dealers'],
      commonMistakes: ['Not knowing design numbers', 'Confusing periods', 'Missing mark changes', 'Overpaying for later production'],
      hiddenValue: ['Pre-1935 pieces', 'Designer attribution (Johan Rohde, etc.)', 'Rare designs', 'Important commissions'],
      storySellsFor: 'Georg Jensen founded his Copenhagen silversmithy in 1904, creating a uniquely Danish aesthetic that combined Art Nouveau organicism with the coming modern movement. His pieces have been collected by royalty and museums worldwide.'
    }
  }
]

/**
 * GLASS EXPERTISE
 */
const glassKnowledge: ExpertKnowledgeEntry[] = [
  {
    itemId: 'glass-001', // Tiffany Favrile Vase
    instantRecognition: {
      silhouette: 'Organic flowing art glass form with distinctive iridescent surface. Rich golden or peacock coloring.',
      keyVisualMarkers: ['Iridescent surface', 'Organic form', 'Rich color depth', 'Pulled decoration (some)', 'L.C.T. mark'],
      instantRedFlags: ['Painted iridescence', 'Applied decoration', 'Wrong mark format', 'Poor quality glass']
    },
    visualCues: {
      construction: ['Free-blown glass', 'Integral decoration', 'Period techniques'],
      materials: ['Art glass with metallic oxides', 'Iridescent surface treatment', 'Period glass formulas'],
      proportions: ['Organic proportions', 'Balance and flow', 'Period-appropriate sizes'],
      finish: ['True iridescence from glass', 'Smooth surface', 'Period patina on metal parts'],
      hardware: ['N/A'],
      marks: ['L.C.T.', 'L.C. Tiffany', 'Tiffany Favrile', 'Number codes'],
      wear: ['Light scratches acceptable', 'Iridescence should be integral', 'Damage devalues significantly']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full piece showing form', reason: 'Assess shape and color' },
        { location: 'Signature/mark', reason: 'Authentication essential' },
        { location: 'Surface iridescence', reason: 'Verify quality and type' }
      ],
      helpful: [{ location: 'Different lighting angles', reason: 'Show iridescence fully' }],
      forAuthentication: [{ location: 'Pontil mark', reason: 'Period characteristics' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct signature format', 'Quality iridescence integral to glass', 'Period glass characteristics', 'Correct number codes'],
      fakeIndicators: ['Applied or painted iridescence', 'Wrong signature format', 'Poor quality glass', 'Modern manufacturing tells'],
      commonReproductions: ['Lundberg Studios pieces', 'Czech copies', 'Modern art glass with fake marks'],
      ageIndicators: ['1893-1933: Tiffany production', 'Mark styles evolved', 'Number codes date pieces'],
      provenance: ['Tiffany records', 'Period purchases', 'Exhibition history']
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Rare forms or decorations', impact: '+100-500%' },
        { factor: 'Paperweight techniques', impact: '+200-400%' },
        { factor: 'Large impressive size', impact: '+50-100%' },
        { factor: 'Damage', impact: '-50-80%' }
      ],
      bestVenues: ['Christie\'s Tiffany sales', 'Rago Arts', 'Lillian Nassau gallery', 'Major auction houses'],
      targetBuyers: ['Tiffany collectors', 'Art glass collectors', 'Museums', 'Decorators (modern)'],
      seasonality: 'Art glass and Tiffany sales in spring and fall.',
      trend: 'Exceptional pieces command premiums. Good examples steady.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Mark unclear', question: 'What does the signature look like? L.C.T., Tiffany Favrile, or another format?' }],
      requestPhoto: [{ condition: 'Cannot verify', request: 'Clear photo of signature and pontil area', reason: 'Essential for authentication' }],
      clarify: [{ condition: 'Condition unclear', clarification: 'Any chips, cracks, or repairs?' }]
    },
    expertInsights: {
      sellerTips: ['Document signature carefully', 'Photograph in different light', 'Note any provenance', 'Condition critical'],
      buyerTips: ['Learn signature formats', 'Verify iridescence is integral', 'Buy from specialists', 'Authentication service for major pieces'],
      commonMistakes: ['Confusing with other art glass', 'Missing signature', 'Not recognizing quality differences', 'Paying Tiffany prices for others'],
      hiddenValue: ['Paperweight pieces', 'Unusual techniques', 'Important provenances', 'Exhibition pieces'],
      storySellsFor: 'Louis Comfort Tiffany was the American pioneer of art glass, creating his "Favrile" glass in 1894. The name means "handmade" in Old English. Each piece captures light in ways that seem almost magical - colors shift and glow from within.'
    }
  },

  {
    itemId: 'glass-002', // Lalique Glass
    instantRecognition: {
      silhouette: 'Frosted or opalescent glass with molded relief decoration. Art Deco or Art Nouveau styling.',
      keyVisualMarkers: ['Frosted/satin finish', 'Molded relief decoration', 'Nature or figural motifs', 'R. LALIQUE or LALIQUE mark'],
      instantRedFlags: ['Wrong mark format', 'Poor mold quality', 'Hand-painted details', 'Wrong glass type']
    },
    visualCues: {
      construction: ['Press-molded glass', 'Acid-etched finish', 'Wheel-cut or molded mark'],
      materials: ['Lead crystal or demi-crystal', 'Opalescent glass (some)', 'Colored glass (rare, valuable)'],
      proportions: ['Design-specific proportions', 'Consistent with catalogs', 'Match known examples'],
      finish: ['Satin/frosted areas', 'Polished highlights', 'Original finish intact'],
      hardware: ['N/A'],
      marks: ['R. LALIQUE (pre-1945)', 'LALIQUE FRANCE (post-1945)', 'Model numbers', 'Wheel-cut vs molded marks'],
      wear: ['Light scratches acceptable', 'Chips problematic', 'Finish wear affects value']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full piece', reason: 'Show design and form' },
        { location: 'Signature close-up', reason: 'R. LALIQUE vs LALIQUE FRANCE critical' },
        { location: 'Mold detail', reason: 'Assess quality and design' }
      ],
      helpful: [{ location: 'Back-lit image', reason: 'Show opalescence if present' }],
      forAuthentication: [{ location: 'Mark type', reason: 'Wheel-cut marks indicate earlier/better pieces' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct mark for period', 'Quality mold detail', 'Proper glass type', 'Known design'],
      fakeIndicators: ['Wrong mark format', 'Poor mold quality', 'Wrong glass type', 'Unknown designs'],
      commonReproductions: ['Czech copies', 'Asian reproductions', 'Modern Lalique (genuine but different value)'],
      ageIndicators: ['R. LALIQUE: 1885-1945 (René Lalique lifetime)', 'LALIQUE FRANCE: post-1945', 'Design introduction dates', 'Mark style evolution'],
      provenance: ['Original purchase documentation', 'Exhibition history', 'Published examples']
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'R. LALIQUE (pre-1945)', impact: '+100-500%' },
        { factor: 'Colored glass', impact: '+200-1000%' },
        { factor: 'Rare designs', impact: '+100-400%' },
        { factor: 'Chips or damage', impact: '-40-70%' }
      ],
      bestVenues: ['Bonhams decorative arts', 'Christie\'s', 'Specialist Lalique dealers', 'Rago Arts'],
      targetBuyers: ['Lalique collectors', 'Art Deco collectors', 'French decorative arts collectors'],
      seasonality: 'Decorative arts sales year-round.',
      trend: 'Pre-war pieces increasingly valuable. Modern pieces steady.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Mark unclear', question: 'Does the signature read R. LALIQUE or just LALIQUE FRANCE?' }],
      requestPhoto: [{ condition: 'Cannot verify period', request: 'Clear photo of signature showing exact text', reason: 'R. LALIQUE vs LALIQUE FRANCE determines value' }],
      clarify: [{ condition: 'Condition unclear', clarification: 'Any chips, scratches, or damage?' }]
    },
    expertInsights: {
      sellerTips: ['Photograph mark clearly', 'Note exact wording', 'Document any provenance', 'Condition critical'],
      buyerTips: ['Learn mark differences', 'Colored glass commands premium', 'Verify with reference books', 'Buy from specialists'],
      commonMistakes: ['Not distinguishing R. LALIQUE from LALIQUE', 'Paying R. LALIQUE prices for post-war', 'Missing colored glass value'],
      hiddenValue: ['R. LALIQUE period pieces', 'Rare colors (red, black)', 'Unusual designs', 'Exhibition pieces'],
      storySellsFor: 'René Lalique revolutionized glass design in the early 20th century. His opalescent glass captured the Art Deco spirit perfectly. Pieces signed "R. LALIQUE" were made during his lifetime, making them especially prized.'
    }
  },

  {
    itemId: 'glass-003', // Depression Glass
    instantRecognition: {
      silhouette: 'Machine-pressed colored glass in characteristic patterns. Pink, green, or clear most common.',
      keyVisualMarkers: ['Pressed pattern glass', 'Characteristic colors (green, pink)', 'Machine mold marks', 'Lightweight construction'],
      instantRedFlags: ['Heavy weight', 'Hand-blown characteristics', 'Wrong colors for pattern']
    },
    visualCues: {
      construction: ['Machine-pressed in molds', 'Mold seams visible', 'Consistent pattern throughout'],
      materials: ['Soda-lime glass', 'Period color formulas', 'Lightweight construction'],
      proportions: ['Pattern-specific shapes', 'Consistent within pattern', 'Period sizing'],
      finish: ['May have roughness from mold', 'Characteristic color saturation', 'Fire-polished rims'],
      hardware: ['N/A'],
      marks: ['Usually unmarked', 'Some have maker marks', 'Pattern identification by design'],
      wear: ['Use marks common', 'Chips reduce value', 'Dishwasher damage on some']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full piece', reason: 'Show pattern and color' },
        { location: 'Pattern detail', reason: 'Identify specific pattern' },
        { location: 'Any damage', reason: 'Condition affects value' }
      ],
      helpful: [{ location: 'Back-lit for color', reason: 'Show true color' }],
      forAuthentication: [{ location: 'Mold seams', reason: 'Period characteristics' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct color for pattern', 'Period mold characteristics', 'Appropriate weight', 'Pattern matches references'],
      fakeIndicators: ['Wrong color for pattern', 'Hand-blown characteristics', 'Too heavy', 'Pattern variations'],
      commonReproductions: ['Indiana Glass reproductions', 'Modern colored glass', 'Import copies'],
      ageIndicators: ['1929-1939: Peak Depression glass', 'Some patterns earlier or later', 'Maker-specific dating'],
      provenance: ['Family history common', 'Collection documentation', 'Original packaging rare']
    },
    marketIntelligence: {
      currentDemand: 'moderate',
      priceFactors: [
        { factor: 'Rare patterns', impact: '+100-500%' },
        { factor: 'Rare colors in common patterns', impact: '+50-200%' },
        { factor: 'Complete sets', impact: '+25-50%' },
        { factor: 'Chips or damage', impact: '-50-90%' }
      ],
      bestVenues: ['Ruby Lane', 'EAPG/Depression glass shows', 'eBay', 'Antique malls'],
      targetBuyers: ['Pattern collectors', 'Color collectors', 'Nostalgia buyers', 'Set completers'],
      seasonality: 'Steady year-round. Show season spring/fall.',
      trend: 'Common pieces more price-sensitive. Rare patterns and colors hold value.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Pattern unclear', question: 'Can you identify the pattern name? This determines value.' }],
      requestPhoto: [{ condition: 'Cannot identify pattern', request: 'Close-up of pattern detail', reason: 'Pattern identification essential' }],
      clarify: [{ condition: 'Condition unclear', clarification: 'Any chips, cracks, or cloudiness?' }]
    },
    expertInsights: {
      sellerTips: ['Identify pattern correctly', 'Note any chips', 'Group by pattern', 'Research rare pieces'],
      buyerTips: ['Learn to identify patterns', 'Check for damage carefully', 'Know reproduction marks', 'Buy reference books'],
      commonMistakes: ['Misidentifying patterns', 'Confusing reproductions', 'Overpaying for common pieces', 'Missing damage'],
      hiddenValue: ['Rare colors in common patterns', 'Unusual pieces within patterns', 'Complete sets', 'Original packaging'],
      storySellsFor: 'Depression glass was given away free at gas stations and movie theaters during the Great Depression. It brought color and beauty to struggling households. Today, these colorful pieces are nostalgic reminders of resilience and hope during hard times.'
    }
  },

  {
    itemId: 'glass-004', // Murano Glass
    instantRecognition: {
      silhouette: 'Vibrant hand-blown Italian glass with complex techniques. Bold colors and elaborate forms.',
      keyVisualMarkers: ['Bright vivid colors', 'Hand-blown characteristics', 'Italian techniques (millefiori, sommerso)', 'Organic flowing forms'],
      instantRedFlags: ['Machine-made characteristics', 'Poor color quality', 'Crude workmanship', 'Wrong techniques for claimed type']
    },
    visualCues: {
      construction: ['Hand-blown glass', 'Traditional techniques', 'Complex layering (some)', 'Applied elements'],
      materials: ['Venetian glass formulas', 'Gold or silver inclusions (some)', 'Multiple color layers'],
      proportions: ['Design-specific', 'Organic asymmetry', 'Italian aesthetic'],
      finish: ['Polished pontil (quality pieces)', 'Smooth surfaces', 'Applied labels (some)'],
      hardware: ['N/A'],
      marks: ['Factory labels (if present)', 'Vetro Artistico Murano certification', 'Artist signatures (important pieces)'],
      wear: ['Scratches reduce value', 'Chips problematic', 'Label preservation important']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full piece', reason: 'Show form and color' },
        { location: 'Technique detail', reason: 'Identify technique and quality' },
        { location: 'Any labels or marks', reason: 'Attribution and authentication' }
      ],
      helpful: [{ location: 'Base/pontil', reason: 'Quality indicator' }],
      forAuthentication: [{ location: 'Label detail if present', reason: 'Factory identification' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Quality hand-blown characteristics', 'Proper technique execution', 'Original labels', 'Italian aesthetic'],
      fakeIndicators: ['Machine-made tells', 'Poor technique', 'Wrong glass formula', 'Asian copies'],
      commonReproductions: ['Chinese copies', 'Czech glass', 'Modern tourist pieces'],
      ageIndicators: ['Pre-1950: Earlier Venini, Barovier', '1950s-70s: Mid-century peak', 'Modern production continues', 'Factory histories help date'],
      provenance: ['Factory documentation', 'Designer attribution', 'Gallery history', 'Original labels']
    },
    marketIntelligence: {
      currentDemand: 'moderate to strong',
      priceFactors: [
        { factor: 'Important factory (Venini, Seguso)', impact: '+100-500%' },
        { factor: 'Designer attribution', impact: '+50-300%' },
        { factor: 'Original labels', impact: '+25-50%' },
        { factor: 'Damage', impact: '-40-70%' }
      ],
      bestVenues: ['1stDibs', 'Wright auctions', 'Italian glass specialists', 'eBay (common pieces)'],
      targetBuyers: ['Italian glass collectors', 'Mid-century modern collectors', 'Interior designers', 'Decorators'],
      seasonality: 'Steady year-round. Design sales in spring/fall.',
      trend: 'Documented pieces from major factories strong. Generic tourist pieces soft.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Factory unknown', question: 'Are there any labels or marks indicating the factory?' }],
      requestPhoto: [{ condition: 'Cannot verify origin', request: 'Photos of any labels, stickers, or marks', reason: 'Factory attribution affects value' }],
      clarify: [{ condition: 'Provenance unclear', clarification: 'Do you know where this was purchased or any history?' }]
    },
    expertInsights: {
      sellerTips: ['Preserve original labels', 'Research factory attribution', 'Document any provenance', 'Quality photography essential'],
      buyerTips: ['Learn major factories', 'Original labels add value', 'Buy from knowledgeable sources', 'Research comparable sales'],
      commonMistakes: ['Not researching factory', 'Removing labels', 'Confusing with Chinese copies', 'Overpaying for tourist pieces'],
      hiddenValue: ['Designer attribution', 'Original labels', 'Exhibition pieces', 'Rare techniques'],
      storySellsFor: 'Murano glass has been made on the island near Venice since the 13th century. The master glassblowers passed their secrets through generations, creating techniques found nowhere else. Mid-century pieces from great houses like Venini are collected by museums worldwide.'
    }
  }
]

/**
 * TEXTILES EXPERTISE
 */
const textilesKnowledge: ExpertKnowledgeEntry[] = [
  {
    itemId: 'text-001', // Navajo Chief Blanket
    instantRecognition: {
      silhouette: 'Hand-woven wool textile with horizontal banded design. Bold geometric patterns in natural and dyed colors.',
      keyVisualMarkers: ['Horizontal banded design', 'Hand-spun wool', 'Natural and dyed colors', 'Geometric patterns', 'Weft-faced weaving'],
      instantRedFlags: ['Machine-woven edges', 'Synthetic fibers', 'Wrong pattern structure', 'Too-regular weaving']
    },
    visualCues: {
      construction: ['Hand-woven on upright loom', 'Weft-faced tapestry weave', 'Wool warp and weft', 'Hand-spun yarn'],
      materials: ['Churro sheep wool (early)', 'Commercial yarn (later)', 'Natural and aniline dyes'],
      proportions: ['Wider than long (wearing blankets)', 'Various sizes', 'Period-appropriate dimensions'],
      finish: ['Soft hand feel', 'Irregular weft tension', 'Natural fiber characteristics'],
      hardware: ['N/A'],
      marks: ['No formal marks', 'Attribution by style/technique', 'Carbon dating for early pieces'],
      wear: ['Appropriate wear for age', 'Moth damage problematic', 'Color fading from use']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full textile', reason: 'Pattern and proportion assessment' },
        { location: 'Weave detail', reason: 'Verify hand-woven' },
        { location: 'Color/dye detail', reason: 'Date by dye types' }
      ],
      helpful: [{ location: 'Back of textile', reason: 'Weave structure visible' }],
      forAuthentication: [{ location: 'Edge/selvage', reason: 'Hand vs machine evidence' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Hand-spun yarn visible', 'Appropriate dyes for period', 'Correct weave structure', 'Period-consistent wear'],
      fakeIndicators: ['Machine-spun yarn', 'Synthetic dyes on "early" piece', 'Wrong weave structure', 'No appropriate wear'],
      commonReproductions: ['Mexican copies', 'Modern Navajo tourist pieces', 'Machine-woven copies'],
      ageIndicators: ['First Phase: 1800-1850 (stripes only)', 'Second Phase: 1850-1870 (red boxes)', 'Third Phase: 1870-1890 (diamonds)', 'Aniline dyes: post-1880'],
      provenance: ['Trading post history', 'Early collection documentation', 'Carbon dating', 'Expert opinion']
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'First Phase classic', impact: '$100,000-500,000+' },
        { factor: 'Second Phase', impact: '$20,000-100,000' },
        { factor: 'Third Phase', impact: '$5,000-50,000' },
        { factor: 'Condition issues', impact: '-30-60%' }
      ],
      bestVenues: ['Bonhams Native American sales', 'Cowan\'s', 'Santa Fe sales', 'Specialist dealers'],
      targetBuyers: ['Native American art collectors', 'Southwest collectors', 'Museums', 'Serious decorators'],
      seasonality: 'Major Native American sales in fall.',
      trend: 'Classic pieces increasingly rare and valuable. Authentication critical.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Phase unclear', question: 'What is the overall pattern structure? Stripes, boxes, or diamonds?' }],
      requestPhoto: [{ condition: 'Cannot assess quality', request: 'Close-up of weave and yarn showing spinning', reason: 'Hand-spun vs commercial critical' }],
      clarify: [{ condition: 'Condition unclear', clarification: 'Any moth damage, holes, or repairs?' }]
    },
    expertInsights: {
      sellerTips: ['Get expert authentication for valuable pieces', 'Document any provenance', 'Condition report essential', 'Photograph extensively'],
      buyerTips: ['Learn phases and dating', 'Verify with specialists', 'Check for condition issues', 'Understand dye dating'],
      commonMistakes: ['Not understanding phases', 'Missing reproduction indicators', 'Overvaluing late pieces', 'Ignoring condition'],
      hiddenValue: ['First Phase examples', 'Important provenances', 'Classic Second Phase', 'Museum-quality condition'],
      storySellsFor: 'Navajo chief blankets were among the most valuable trade items in the 19th century West. A First Phase blanket could cost more than a horse. Worn as status symbols by tribal leaders across the Plains, these are among the most sought-after American textiles.'
    }
  },

  {
    itemId: 'text-002', // Persian Tabriz Carpet
    instantRecognition: {
      silhouette: 'Hand-knotted wool carpet with central medallion design. Elaborate field and border patterns.',
      keyVisualMarkers: ['Central medallion', 'Elaborate corner brackets', 'Fine knotting visible', 'Traditional color palette', 'Wool pile'],
      instantRedFlags: ['Machine-made backing', 'Too-regular patterns', 'Synthetic fibers', 'Printed designs']
    },
    visualCues: {
      construction: ['Hand-knotted pile', 'Cotton or silk foundation', 'Symmetrical or asymmetrical knots', 'Hand-finished fringes'],
      materials: ['Wool pile (silk in finest)', 'Cotton warp and weft', 'Natural or chrome dyes'],
      proportions: ['Various sizes', 'Traditional proportions', 'Room-sized examples common'],
      finish: ['Even pile height', 'Controlled wear patterns', 'Original selvages'],
      hardware: ['N/A'],
      marks: ['Signature cartouches (some)', 'Dated examples (some)', 'Attribution by design'],
      wear: ['Even wear acceptable', 'Foundation damage problematic', 'Professional repairs ok']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full carpet', reason: 'Pattern and proportion' },
        { location: 'Back showing knots', reason: 'Verify hand-knotted' },
        { location: 'Detail of pile', reason: 'Assess quality and condition' }
      ],
      helpful: [{ location: 'Selvage/fringe', reason: 'Original or replaced' }],
      forAuthentication: [{ location: 'Knot structure', reason: 'Region identification' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Hand-tied knots visible on back', 'Appropriate knot structure', 'Consistent materials', 'Period-appropriate wear'],
      fakeIndicators: ['Machine backing', 'Printed designs', 'Synthetic fibers', 'Artificial aging'],
      commonReproductions: ['Indian copies', 'Chinese copies', 'Machine-made rugs'],
      ageIndicators: ['Pre-1900: Natural dyes', '1900-1940: Chrome dyes introduced', 'Post-1940: Modern production', 'Dye testing helps date'],
      provenance: ['Collection history', 'Dealer documentation', 'Exhibition history']
    },
    marketIntelligence: {
      currentDemand: 'moderate',
      priceFactors: [
        { factor: 'Silk or part-silk', impact: '+100-300%' },
        { factor: 'Antique (pre-1920)', impact: '+50-200%' },
        { factor: 'Fine knot count', impact: '+25-100%' },
        { factor: 'Wear or damage', impact: '-30-60%' }
      ],
      bestVenues: ['Christie\'s carpet sales', 'Bonhams', 'Specialist dealers', 'Major auction houses'],
      targetBuyers: ['Carpet collectors', 'Interior designers', 'Decorator market'],
      seasonality: 'Carpet sales in spring and fall.',
      trend: 'Antique pieces steady. Modern/semi-antique more price-sensitive.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Age unclear', question: 'Do you know approximately how old this carpet is?' }],
      requestPhoto: [{ condition: 'Cannot verify hand-made', request: 'Photo of back showing knot structure', reason: 'Verify hand-knotted' }],
      clarify: [{ condition: 'Condition unclear', clarification: 'Any worn areas, repairs, or damage?' }]
    },
    expertInsights: {
      sellerTips: ['Measure accurately', 'Document condition', 'Note any signatures', 'Research comparable sales'],
      buyerTips: ['Learn to check backs', 'Understand knot structures', 'Check for repairs', 'Buy from knowledgeable sources'],
      commonMistakes: ['Not checking back', 'Confusing machine for hand', 'Ignoring condition', 'Overpaying for common pieces'],
      hiddenValue: ['Silk examples', 'Antique pieces', 'Important signatures', 'Museum-quality examples'],
      storySellsFor: 'Tabriz has been a center of carpet weaving for 500 years. These carpets were woven by skilled artisans who spent months or years on a single piece. Each knot was tied by hand - a room-sized carpet might contain over a million knots.'
    }
  },

  {
    itemId: 'text-003', // Baltimore Album Quilt
    instantRecognition: {
      silhouette: 'Elaborately appliquéd quilt with red and green motifs on white ground. Album block format.',
      keyVisualMarkers: ['Red and green on white', 'Appliquéd blocks', 'Floral and patriotic motifs', 'Album format', 'Fine hand quilting'],
      instantRedFlags: ['Machine stitching', 'Synthetic fabrics', 'Wrong color palette', 'Printed rather than appliquéd']
    },
    visualCues: {
      construction: ['Hand appliqué', 'Hand quilting', 'Album block format', 'Period construction'],
      materials: ['Period cotton fabrics', 'Natural dyes (early)', 'Cotton batting', 'Hand-spun thread'],
      proportions: ['Bed-sized typical', 'Square or rectangular', 'Block format'],
      finish: ['Fine hand stitching', 'Consistent quilting', 'Bound edges'],
      hardware: ['N/A'],
      marks: ['Maker signatures (some)', 'Dated blocks (some)', 'Inscriptions (some)'],
      wear: ['Age-appropriate fading', 'Wear patterns consistent', 'Period repairs acceptable']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full quilt', reason: 'Overall design assessment' },
        { location: 'Individual block detail', reason: 'Assess appliqué quality' },
        { location: 'Quilting detail', reason: 'Hand vs machine' }
      ],
      helpful: [{ location: 'Any signatures or dates', reason: 'Documentation and attribution' }],
      forAuthentication: [{ location: 'Stitch detail', reason: 'Hand vs machine evidence' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Hand stitching throughout', 'Period fabrics', 'Appropriate wear', 'Period construction'],
      fakeIndicators: ['Machine stitching', 'Modern fabrics', 'Too-perfect condition', 'Wrong techniques'],
      commonReproductions: ['Modern reproductions', 'Kit quilts', 'Album-style modern quilts'],
      ageIndicators: ['1840-1860: Classic period', 'Fabric dating helps', 'Construction techniques', 'Dye analysis'],
      provenance: ['Maker documentation', 'Family history', 'Publication history']
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Documented Baltimore maker', impact: '+100-300%' },
        { factor: 'Exceptional design complexity', impact: '+50-100%' },
        { factor: 'Signatures and dates', impact: '+25-75%' },
        { factor: 'Condition issues', impact: '-30-60%' }
      ],
      bestVenues: ['Sotheby\'s Folk Art', 'Skinner', 'Specialist quilt auctions', 'Major Americana dealers'],
      targetBuyers: ['Quilt collectors', 'Folk art collectors', 'Museums', 'Serious Americana collectors'],
      seasonality: 'Folk art and Americana sales in spring and fall.',
      trend: 'Museum-quality examples rare and valuable. Condition critical.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Maker unknown', question: 'Are there any signatures or inscriptions on the blocks?' }],
      requestPhoto: [{ condition: 'Cannot assess quality', request: 'Detail of appliqué and quilting stitches', reason: 'Quality and hand-work assessment' }],
      clarify: [{ condition: 'Condition unclear', clarification: 'Any stains, tears, or fabric damage?' }]
    },
    expertInsights: {
      sellerTips: ['Document any signatures', 'Research comparable sales', 'Professional condition report', 'Photograph extensively'],
      buyerTips: ['Learn period characteristics', 'Check all stitching by hand', 'Verify fabrics', 'Buy from specialists'],
      commonMistakes: ['Confusing styles', 'Missing signatures', 'Ignoring condition', 'Not researching makers'],
      hiddenValue: ['Known Baltimore makers', 'Important inscriptions', 'Exhibition history', 'Museum provenance'],
      storySellsFor: 'Baltimore Album quilts represent the pinnacle of American quilt making. Created in Baltimore around 1840-1860, often by ladies\' groups, each block might be made by a different person and presented as friendship offerings. The best examples are true textile paintings.'
    }
  }
]

/**
 * TOYS & COLLECTIBLES EXPERTISE
 */
const toysKnowledge: ExpertKnowledgeEntry[] = [
  {
    itemId: 'toy-001', // Steiff Teddy Bear
    instantRecognition: {
      silhouette: 'Classic jointed teddy bear with mohair body, button in ear, and distinctive hump back.',
      keyVisualMarkers: ['Button in ear', 'Mohair or plush body', 'Jointed limbs and head', 'Glass or shoe-button eyes', 'Distinctive hump back'],
      instantRedFlags: ['No button or tag', 'Synthetic fabric', 'Fixed joints', 'Wrong eye style for claimed age']
    },
    visualCues: {
      construction: ['Jointed arms, legs, head', 'Excelsior or kapok stuffing', 'Disc joints', 'Hand-stitched details'],
      materials: ['Mohair plush (best quality)', 'Wool plush', 'Glass or shoe-button eyes', 'Felt paw pads'],
      proportions: ['Long snout (early)', 'Hump back (early)', 'Long limbs (early)', 'More compact (later)'],
      finish: ['Original mohair intact', 'Nose hand-stitched', 'Paw pads condition'],
      hardware: ['Disc joints', 'Growler mechanism (some)'],
      marks: ['Button in ear', 'Yellow tag (post-1980)', 'White tag (limited)', 'Blank button (earliest)'],
      wear: ['Some wear acceptable', 'Bald spots reduce value', 'Replaced pads noted']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full bear', reason: 'Overall condition and style' },
        { location: 'Button/ear close-up', reason: 'Authentication essential' },
        { location: 'Face detail', reason: 'Eye style and nose stitching' }
      ],
      helpful: [{ location: 'Paw pads', reason: 'Condition and material' }],
      forAuthentication: [{ location: 'Button detail', reason: 'Button style dates bear' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct button style for age', 'Appropriate materials', 'Quality construction', 'Period-consistent features'],
      fakeIndicators: ['Wrong button style', 'Modern materials', 'Poor construction', 'Anachronistic features'],
      commonReproductions: ['Modern Steiff (genuine but different value)', 'Asian copies', 'Other maker bears'],
      ageIndicators: ['1902-1905: Blank button', '1905-1950s: FF button', '1980s+: Yellow/white tags', 'Style evolution by decade'],
      provenance: ['Family history common', 'Original tags valuable', 'Purchase documentation rare']
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: 'Pre-WWII vintage', impact: '+100-500%' },
        { factor: 'Original button intact', impact: '+50-100%' },
        { factor: 'Excellent condition', impact: '+50-100%' },
        { factor: 'Large size', impact: '+25-50%' },
        { factor: 'Moth damage or bald', impact: '-40-70%' }
      ],
      bestVenues: ['Christie\'s teddy bear sales', 'Specialist bear auctions', 'eBay', 'Antique toy shows'],
      targetBuyers: ['Teddy bear collectors', 'Steiff specialists', 'Childhood nostalgia buyers'],
      seasonality: 'Holiday season strong. Specialist auctions spring/fall.',
      trend: 'Vintage Steiff consistently strong. Condition increasingly important.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Age unclear', question: 'What does the button look like? This helps date the bear.' }],
      requestPhoto: [{ condition: 'Cannot verify', request: 'Close-up of button in ear', reason: 'Button style essential for dating and authentication' }],
      clarify: [{ condition: 'Condition unclear', clarification: 'Is the mohair intact or are there bald spots?' }]
    },
    expertInsights: {
      sellerTips: ['Document button carefully', 'Note any tags', 'Photograph condition honestly', 'Research by button style'],
      buyerTips: ['Learn button chronology', 'Check for repairs', 'Verify materials', 'Buy from specialists'],
      commonMistakes: ['Not knowing button types', 'Confusing modern for vintage', 'Ignoring condition', 'Overpaying for common examples'],
      hiddenValue: ['Pre-1910 examples', 'Unusual colors', 'Original accessories', 'Documented provenance'],
      storySellsFor: 'Steiff invented the teddy bear in 1902 after Margarete Steiff\'s nephew Richard designed a bear with jointed limbs. When President Roosevelt refused to shoot a tied-up bear on a hunting trip, the "teddy bear" was born and Steiff sold nearly a million by 1907.'
    }
  },

  {
    itemId: 'toy-002', // Cast Iron Toy Car
    instantRecognition: {
      silhouette: 'Heavy cast iron toy automobile with painted finish. Period styling reflects real cars of the era.',
      keyVisualMarkers: ['Cast iron construction', 'Painted finish', 'Period automobile styling', 'Rubber or metal wheels', 'Embossed details'],
      instantRedFlags: ['Lightweight (reproduction)', 'Wrong paint style', 'Modern casting tells', 'Incorrect wheel type']
    },
    visualCues: {
      construction: ['Cast iron parts', 'Assembled components', 'Paint over casting', 'Period wheel types'],
      materials: ['Cast iron body', 'Rubber or cast wheels', 'Original paint', 'Sometimes nickel trim'],
      proportions: ['Scale to real vehicles', 'Period-appropriate details', 'Maker-specific styles'],
      finish: ['Original paint layers', 'Period color palette', 'Age-appropriate wear'],
      hardware: ['Axle mechanisms', 'Articulated parts (some)', 'Towing hooks (some)'],
      marks: ['Embossed maker name', 'Model numbers', 'Patent dates'],
      wear: ['Paint wear normal', 'Rust problematic', 'Missing parts reduce value']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full toy all angles', reason: 'Assess form and paint' },
        { location: 'Any maker marks', reason: 'Identify manufacturer' },
        { location: 'Paint condition', reason: 'Original vs repaint critical' }
      ],
      helpful: [{ location: 'Wheels', reason: 'Period and condition' }],
      forAuthentication: [{ location: 'Casting details', reason: 'Original vs reproduction' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Proper weight', 'Period casting details', 'Original paint patina', 'Correct maker marks'],
      fakeIndicators: ['Too light', 'Sharp casting edges', 'Modern paint', 'Wrong marks'],
      commonReproductions: ['Modern cast iron copies', 'Asian reproductions', 'Repaints of originals'],
      ageIndicators: ['1900-1920: Earliest examples', '1920s-1940: Peak production', 'Style matches real cars of era'],
      provenance: ['Original box (very rare)', 'Family history', 'Collection documentation']
    },
    marketIntelligence: {
      currentDemand: 'moderate',
      priceFactors: [
        { factor: 'Original paint', impact: '+100-300%' },
        { factor: 'Rare maker (Arcade, Hubley)', impact: '+50-200%' },
        { factor: 'Large size', impact: '+50-100%' },
        { factor: 'Repainted', impact: '-50-70%' },
        { factor: 'Missing parts', impact: '-30-50%' }
      ],
      bestVenues: ['Bertoia Auctions', 'RSL Auctions', 'Specialist toy shows', 'eBay'],
      targetBuyers: ['Cast iron toy collectors', 'Automotive toy collectors', 'Americana collectors'],
      seasonality: 'Major toy auctions spring/fall.',
      trend: 'Original paint examples increasingly rare and valuable.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Maker unclear', question: 'Are there any embossed marks on the toy?' }],
      requestPhoto: [{ condition: 'Cannot verify paint', request: 'Close-ups showing paint detail and any wear', reason: 'Original paint vs repaint crucial' }],
      clarify: [{ condition: 'Completeness unclear', clarification: 'Are all original parts present?' }]
    },
    expertInsights: {
      sellerTips: ['Never repaint originals', 'Document maker marks', 'Note any missing parts', 'Research comparable sales'],
      buyerTips: ['Learn to identify repaints', 'Check weight (reproductions lighter)', 'Know maker marks', 'Inspect casting quality'],
      commonMistakes: ['Confusing repaint for original', 'Not checking weight', 'Missing reproduction tells', 'Overpaying for damaged pieces'],
      hiddenValue: ['Original boxes', 'Rare variations', 'Unusual makers', 'Complete sets'],
      storySellsFor: 'American cast iron toys captured the excitement of the automobile age. Companies like Arcade and Hubley created miniature versions of real cars that children could actually afford. These heavy, virtually indestructible toys survived generations of play.'
    }
  },

  {
    itemId: 'toy-003', // Vintage Barbie
    instantRecognition: {
      silhouette: 'Fashion doll with distinctive face paint, pointed arched eyebrows, and period-specific body type.',
      keyVisualMarkers: ['Arched eyebrows (early)', 'Ponytail hairstyle (#1-6)', 'Black and white swimsuit', 'Japan marking on foot', 'Holes in feet (early)'],
      instantRedFlags: ['Wrong face paint', 'Reproduction body', 'Missing or wrong marks', 'Wrong hair color/style']
    },
    visualCues: {
      construction: ['Vinyl body', 'Rooted hair', 'Jointed limbs', 'Period-specific body type'],
      materials: ['Vinyl head and body', 'Saran or other period hair', 'Period fabrics on clothing'],
      proportions: ['Period-specific body style', 'Face mold identification', 'Correct markings'],
      finish: ['Face paint quality', 'Eye paint style', 'Lip color'],
      hardware: ['Stand holes in feet (early)', 'Earring holes (some)'],
      marks: ['Japan mark on foot', 'Mattel marking', 'Body marks help date'],
      wear: ['Green ear (from earrings)', 'Hair condition', 'Face paint wear']
    },
    photographyGuidance: {
      essential: [
        { location: 'Face straight on', reason: 'Eye paint and face mold' },
        { location: 'Full body', reason: 'Body type and markings' },
        { location: 'Foot markings', reason: 'Authentication' }
      ],
      helpful: [{ location: 'Original outfit', reason: 'Adds significant value' }],
      forAuthentication: [{ location: 'Face detail', reason: 'Paint style identifies issue' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct face paint for issue', 'Proper body marks', 'Period materials', 'Appropriate wear'],
      fakeIndicators: ['Reproduction face paint', 'Wrong body marks', 'Modern materials', 'Too-perfect condition'],
      commonReproductions: ['Reproduction Barbies (Mattel makes)', 'Replacement parts', 'Repaints'],
      ageIndicators: ['#1 (1959): Holes in feet, metal cylinders in legs', '#2 (1959-60): No metal cylinders', '#3-6: Various face paint changes', 'Body marks evolved'],
      provenance: ['Original box critical', 'Stand and accessories', 'Family history']
    },
    marketIntelligence: {
      currentDemand: 'strong',
      priceFactors: [
        { factor: '#1 Ponytail mint', impact: '$8,000-27,000' },
        { factor: 'Complete with box/stand', impact: '+50-100%' },
        { factor: 'Original outfit', impact: '+25-50%' },
        { factor: 'Hair issues', impact: '-30-60%' },
        { factor: 'Face paint damage', impact: '-40-70%' }
      ],
      bestVenues: ['Heritage Auctions', 'Specialist doll auctions', 'eBay', 'Doll shows'],
      targetBuyers: ['Barbie collectors', 'Childhood nostalgia', 'Vintage toy collectors'],
      seasonality: 'Strong year-round. Holiday season peaks.',
      trend: 'Early issues increasingly valuable. Complete examples command premiums.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Issue unclear', question: 'What do the feet look like? Any holes or markings?' }],
      requestPhoto: [{ condition: 'Cannot identify issue', request: 'Face close-up and foot markings', reason: 'Critical for identification and value' }],
      clarify: [{ condition: 'Condition unclear', clarification: 'Is the hair original? Any face paint wear?' }]
    },
    expertInsights: {
      sellerTips: ['Research specific issue', 'Document all markings', 'Note any flaws', 'Include accessories'],
      buyerTips: ['Learn face paint variations', 'Check body marks', 'Verify originality', 'Buy from knowledgeable sellers'],
      commonMistakes: ['Misidentifying issues', 'Confusing reproductions', 'Ignoring condition details', 'Missing replacement parts'],
      hiddenValue: ['#1 and #2 Ponytails', 'Rare hair colors', 'Complete original outfits', 'Mint boxes'],
      storySellsFor: 'When Ruth Handler created Barbie in 1959, she changed toys forever. The first Barbie (#1 Ponytail) sold for $3. Named after Handler\'s daughter Barbara, Barbie became the best-selling toy in history and a cultural icon.'
    }
  },

  {
    itemId: 'toy-004', // Lionel Train
    instantRecognition: {
      silhouette: 'O gauge model train locomotive with detailed casting and Lionel markings.',
      keyVisualMarkers: ['O gauge size', 'Lionel logo', 'Detailed locomotive', 'Three-rail track compatible', 'Period styling'],
      instantRedFlags: ['Wrong gauge', 'Missing Lionel marks', 'Poor quality', 'Wrong scale details']
    },
    visualCues: {
      construction: ['Die-cast or stamped metal', 'Electric motor', 'Detailed components', 'Period mechanisms'],
      materials: ['Metal body', 'Bakelite or plastic details', 'Period electronics'],
      proportions: ['O gauge (1:48 scale)', 'Period locomotive styles', 'Correct tender match'],
      finish: ['Original paint', 'Decals intact', 'Rubber-stamped lettering'],
      hardware: ['Couplers', 'Wheels', 'Pantographs (electric)'],
      marks: ['Lionel name', 'Model number', 'Made in USA'],
      wear: ['Running wear acceptable', 'Paint chips noted', 'Decal condition']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full locomotive', reason: 'Model identification' },
        { location: 'Markings', reason: 'Verify Lionel and model' },
        { location: 'Condition detail', reason: 'Assess paint and decals' }
      ],
      helpful: [{ location: 'With tender', reason: 'Complete set' }],
      forAuthentication: [{ location: 'Underside', reason: 'Additional markings' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct Lionel markings', 'Period construction', 'Appropriate details', 'Runs properly'],
      fakeIndicators: ['Wrong marks', 'Poor quality', 'Wrong details', 'Modern parts'],
      commonReproductions: ['Modern Lionel (genuine)', 'Other maker copies', 'Parts replacements'],
      ageIndicators: ['Pre-war (1901-1942)', 'Post-war (1945-1969)', 'MPC era (1970-1986)', 'Modern (1987+)'],
      provenance: ['Original box adds value', 'Complete sets', 'Operating documentation']
    },
    marketIntelligence: {
      currentDemand: 'moderate',
      priceFactors: [
        { factor: 'Pre-war examples', impact: '+50-300%' },
        { factor: 'Original box', impact: '+50-100%' },
        { factor: 'Rare variations', impact: '+100-500%' },
        { factor: 'Non-working', impact: '-30-50%' },
        { factor: 'Missing parts', impact: '-20-40%' }
      ],
      bestVenues: ['Train collector shows', 'eBay', 'Train collector auctions', 'Specialized dealers'],
      targetBuyers: ['Train collectors', 'Childhood nostalgia', 'Operating enthusiasts'],
      seasonality: 'Holiday season strong. Major train meets year-round.',
      trend: 'Pre-war examples appreciate. Common post-war more price-sensitive.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Model unclear', question: 'What model number is marked on the locomotive?' }],
      requestPhoto: [{ condition: 'Cannot identify model', request: 'Photos showing all markings', reason: 'Model number determines value' }],
      clarify: [{ condition: 'Function unclear', clarification: 'Does it run? Any mechanical issues?' }]
    },
    expertInsights: {
      sellerTips: ['Research model number', 'Note condition accurately', 'Include original box', 'Test operation'],
      buyerTips: ['Learn model numbers', 'Check for repairs', 'Verify completeness', 'Test before buying'],
      commonMistakes: ['Not knowing model values', 'Confusing eras', 'Ignoring condition', 'Missing variations'],
      hiddenValue: ['Pre-war examples', 'Rare color variations', 'Complete sets', 'Original boxes'],
      storySellsFor: 'Joshua Lionel Cowen founded Lionel in 1900 and created the American Christmas tradition of trains around the tree. During the golden age, every boy dreamed of a Lionel train set. These miniature marvels captured the romance of American railroading.'
    }
  }
]

/**
 * LIGHTING EXPERTISE
 */
const lightingKnowledge: ExpertKnowledgeEntry[] = [
  {
    itemId: 'light-001', // Tiffany Dragonfly Lamp
    instantRecognition: {
      silhouette: 'Leaded glass shade with dragonfly motifs, Favrile glass cabochons, on bronze base. Art Nouveau masterpiece.',
      keyVisualMarkers: ['Leaded glass shade', 'Dragonfly design', 'Favrile glass cabochons', 'Bronze base', 'TIFFANY STUDIOS marks'],
      instantRedFlags: ['Wrong lead line style', 'Poor glass quality', 'Missing stamps', 'Modern construction']
    },
    visualCues: {
      construction: ['Copper foil technique', 'Hand-selected glass', 'Cast bronze base', 'Period wiring'],
      materials: ['Favrile art glass', 'Copper foil and solder', 'Cast bronze', 'Favrile cabochons'],
      proportions: ['Shade-to-base ratios', 'Period-correct sizes', 'Design-specific dimensions'],
      finish: ['Original patina on bronze', 'Glass iridescence', 'Solder lines'],
      hardware: ['Period sockets', 'Finials', 'Pull chains'],
      marks: ['TIFFANY STUDIOS NEW YORK', 'Model number on base', 'Shade tags (if present)'],
      wear: ['Patina acceptable', 'Glass cracks problematic', 'Replaced parts noted']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full lamp lit and unlit', reason: 'Show glass quality' },
        { location: 'Base stamps', reason: 'Authentication' },
        { location: 'Shade detail', reason: 'Lead work and glass quality' }
      ],
      helpful: [{ location: 'Interior of shade', reason: 'Construction quality' }],
      forAuthentication: [{ location: 'All marks', reason: 'Verify genuine Tiffany' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct stamps', 'Period glass quality', 'Proper lead work', 'Authentic bronze base', 'Documented model'],
      fakeIndicators: ['Wrong stamps', 'Poor glass', 'Modern solder', 'Cast reproduction base', 'Unknown model'],
      commonReproductions: ['Museum copies', 'Asian reproductions', 'Modern "Tiffany style" lamps'],
      ageIndicators: ['1899-1933: Tiffany Studios period', 'Model numbers help date', 'Construction evolved'],
      provenance: ['Tiffany Studios records', 'Period purchases', 'Exhibition history', 'Major auction history']
    },
    marketIntelligence: {
      currentDemand: 'very strong',
      priceFactors: [
        { factor: 'Dragonfly design', impact: '$100,000-500,000' },
        { factor: 'Rare colorways', impact: '+25-100%' },
        { factor: 'Exceptional glass selection', impact: '+25-50%' },
        { factor: 'Repairs or replaced glass', impact: '-20-50%' }
      ],
      bestVenues: ['Christie\'s Tiffany sales', 'Sotheby\'s', 'Lillian Nassau gallery', 'Macklowe Gallery'],
      targetBuyers: ['Tiffany collectors', 'American decorative arts collectors', 'Museums'],
      seasonality: 'Major Tiffany sales in December and spring.',
      trend: 'Iconic designs at record prices. Authentication increasingly important.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Cannot see marks', question: 'Are there TIFFANY STUDIOS marks on the base?' }],
      requestPhoto: [{ condition: 'Cannot verify', request: 'Clear photos of all stamps and marks', reason: 'Authentication essential' }],
      clarify: [{ condition: 'Provenance unclear', clarification: 'Do you have any documentation or history for this lamp?' }]
    },
    expertInsights: {
      sellerTips: ['Get professional authentication', 'Document all marks', 'Note any repairs', 'Include provenance'],
      buyerTips: ['Only buy authenticated pieces', 'Verify with specialists', 'Understand mark system', 'Check for repairs'],
      commonMistakes: ['Confusing reproductions for originals', 'Not verifying marks', 'Missing repairs', 'Paying authentic prices for copies'],
      hiddenValue: ['Rare shades', 'Important provenances', 'Exhibition history', 'Unusual colorways'],
      storySellsFor: 'Tiffany Studios created the most beautiful leaded glass lamps ever made. The Dragonfly design is among the most desired - each shade contains hundreds of hand-selected glass pieces, and the dragonfly bodies are three-dimensional Favrile glass cabochons.'
    }
  },

  {
    itemId: 'light-002', // Art Deco Lamp
    instantRecognition: {
      silhouette: 'Geometric chrome and glass lamp with streamlined Art Deco styling.',
      keyVisualMarkers: ['Chrome or nickel finish', 'Geometric forms', 'Frosted or milk glass', 'Streamlined design', 'Machine Age aesthetic'],
      instantRedFlags: ['Plastic parts (if claiming early)', 'Wrong period style', 'Poor quality', 'Modern components']
    },
    visualCues: {
      construction: ['Chrome plating on metal', 'Glass shade integration', 'Period wiring', 'Quality manufacturing'],
      materials: ['Chrome or nickel plate', 'Frosted glass', 'Bakelite (some)', 'Period metals'],
      proportions: ['Geometric proportions', 'Period-appropriate scale', 'Design-specific ratios'],
      finish: ['Chrome quality', 'Glass condition', 'Original patina'],
      hardware: ['Period sockets', 'Switches', 'Cords'],
      marks: ['Maker marks (if present)', 'Patent numbers', 'Country of origin'],
      wear: ['Chrome wear acceptable', 'Glass chips problematic', 'Rewiring acceptable']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full lamp', reason: 'Design and condition' },
        { location: 'Chrome detail', reason: 'Quality and condition' },
        { location: 'Any marks', reason: 'Identification' }
      ],
      helpful: [{ location: 'Glass shade detail', reason: 'Condition' }],
      forAuthentication: [{ location: 'Construction detail', reason: 'Period verification' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Period chrome quality', 'Appropriate glass', 'Correct styling', 'Period wiring'],
      fakeIndicators: ['Modern chrome', 'Wrong glass type', 'Mixed period elements', 'Modern wiring only'],
      commonReproductions: ['Modern Art Deco style', 'Import copies', 'Assembled pieces'],
      ageIndicators: ['1920s: Early Deco', '1930s: Streamline peak', '1940s: Late period', 'Material dating'],
      provenance: ['Designer attribution', 'Manufacturer records', 'Original purchase']
    },
    marketIntelligence: {
      currentDemand: 'moderate to strong',
      priceFactors: [
        { factor: 'Known designer', impact: '+100-500%' },
        { factor: 'Quality manufacturer', impact: '+50-100%' },
        { factor: 'Exceptional design', impact: '+50-100%' },
        { factor: 'Damage or repairs', impact: '-30-50%' }
      ],
      bestVenues: ['1stDibs', 'Design auctions', 'Art Deco dealers', 'eBay'],
      targetBuyers: ['Art Deco collectors', 'Interior designers', 'Mid-century enthusiasts'],
      seasonality: 'Steady year-round. Design sales in spring/fall.',
      trend: 'Quality examples steady. Designer pieces appreciate.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Maker unknown', question: 'Are there any maker marks or labels?' }],
      requestPhoto: [{ condition: 'Cannot assess quality', request: 'Detail of chrome and glass condition', reason: 'Quality assessment' }],
      clarify: [{ condition: 'Age unclear', clarification: 'Do you know the approximate age or origin?' }]
    },
    expertInsights: {
      sellerTips: ['Research maker if possible', 'Note condition accurately', 'Original wiring status', 'Quality photography'],
      buyerTips: ['Check chrome carefully', 'Verify glass original', 'Consider rewiring needs', 'Research designers'],
      commonMistakes: ['Ignoring chrome condition', 'Not checking glass', 'Missing designer value', 'Overpaying for common pieces'],
      hiddenValue: ['Designer attribution', 'Quality manufacturers', 'Unusual forms', 'Complete original condition'],
      storySellsFor: 'Art Deco lighting captured the optimism of the Machine Age - streamlined forms that celebrated modern industry while bringing beauty into everyday life. These geometric chrome and glass forms defined an era that believed in progress.'
    }
  }
]

/**
 * BOOKS & EPHEMERA EXPERTISE
 */
const booksKnowledge: ExpertKnowledgeEntry[] = [
  {
    itemId: 'book-001', // The Great Gatsby First Edition
    instantRecognition: {
      silhouette: 'First edition book with distinctive Francis Cugat dust jacket showing eyes and cityscape.',
      keyVisualMarkers: ['Cugat dust jacket art', 'Scribner\'s publishing', '1925 date', 'First printing points', 'Dark blue cloth binding'],
      instantRedFlags: ['Facsimile dust jacket', 'Wrong binding', 'Book club edition', 'Later printing points']
    },
    visualCues: {
      construction: ['Publisher\'s cloth binding', 'Period paper quality', 'Dust jacket construction', 'Printing quality'],
      materials: ['Dark blue cloth', 'Period paper', 'Gilt lettering on spine', 'Original dust jacket'],
      proportions: ['Standard book format', 'Period sizing', 'Dust jacket fits properly'],
      finish: ['Original cloth condition', 'Gilt brightness', 'Dust jacket color retention'],
      hardware: ['N/A'],
      marks: ['Scribner\'s colophon', 'First printing points', 'Copyright 1925'],
      wear: ['Dust jacket condition critical', 'Binding wear acceptable', 'Pages should be clean']
    },
    photographyGuidance: {
      essential: [
        { location: 'Dust jacket front', reason: 'Condition and authenticity' },
        { location: 'Copyright page', reason: 'First printing identification' },
        { location: 'Spine', reason: 'Condition and binding' }
      ],
      helpful: [{ location: 'Dust jacket back and flaps', reason: 'Complete assessment' }],
      forAuthentication: [{ location: 'Title page and copyright', reason: 'Verify first printing' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct first printing points', 'Original dust jacket', 'Appropriate wear', 'Period materials'],
      fakeIndicators: ['Facsimile jacket', 'Wrong printing points', 'Married book and jacket', 'Modern materials'],
      commonReproductions: ['Facsimile dust jackets', 'Later printings claimed as first', 'Book club editions'],
      ageIndicators: ['1925: First printing only year', 'First printing points documented', 'Dust jacket pricing ($2.00)'],
      provenance: ['Ownership history', 'Bookplate value varies', 'Signed copies extremely rare']
    },
    marketIntelligence: {
      currentDemand: 'very strong',
      priceFactors: [
        { factor: 'Original dust jacket, fine', impact: '$150,000-400,000' },
        { factor: 'Original dust jacket, good', impact: '$50,000-150,000' },
        { factor: 'No dust jacket', impact: '$3,000-10,000' },
        { factor: 'Signed by Fitzgerald', impact: '+500%+' }
      ],
      bestVenues: ['Christie\'s books sales', 'Heritage Auctions', 'Sotheby\'s', 'Major rare book dealers'],
      targetBuyers: ['Rare book collectors', 'American literature collectors', 'Institutions'],
      seasonality: 'Major book sales in spring and fall.',
      trend: 'Consistently one of the most valuable American first editions. Jacket condition drives value.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'Jacket unclear', question: 'Is the dust jacket original or a facsimile reproduction?' }],
      requestPhoto: [{ condition: 'Cannot verify edition', request: 'Photo of copyright page showing publisher colophon', reason: 'First printing identification' }],
      clarify: [{ condition: 'Condition unclear', clarification: 'What is the condition of the dust jacket - any chips, tears, or fading?' }]
    },
    expertInsights: {
      sellerTips: ['Get professional authentication', 'Document jacket condition carefully', 'Note all flaws', 'Consider professional grading'],
      buyerTips: ['Verify first printing points', 'Check jacket originality', 'Understand condition grading', 'Buy from specialists'],
      commonMistakes: ['Accepting facsimile jackets', 'Not checking printing points', 'Overpaying for worn copies', 'Missing condition issues'],
      hiddenValue: ['Fitzgerald association copies', 'Important provenance', 'Fine condition jackets', 'Original publisher archive'],
      storySellsFor: 'The Great Gatsby failed commercially when published in 1925 - Fitzgerald was disappointed by sales of about 20,000 copies. Now recognized as the Great American Novel, original copies with the iconic Francis Cugat cover are among the most valuable American books.'
    }
  },

  {
    itemId: 'book-002', // Beatles Butcher Cover
    instantRecognition: {
      silhouette: 'Yesterday and Today LP with Beatles in butcher smocks holding raw meat and doll parts.',
      keyVisualMarkers: ['Butcher photo visible', 'Capitol rainbow label', 'Yesterday and Today title', 'First state or peeled condition'],
      instantRedFlags: ['Third state (trunk cover over)', 'Fake peel', 'Wrong pressing', 'Reproduction cover']
    },
    visualCues: {
      construction: ['Vinyl LP', 'Period jacket printing', 'Capitol pressing', 'Paste-over construction (some)'],
      materials: ['Vinyl record', 'Period sleeve materials', 'Capitol label'],
      proportions: ['Standard LP size', 'Period sleeve construction'],
      finish: ['Jacket printing quality', 'Label condition', 'Vinyl condition'],
      hardware: ['N/A'],
      marks: ['Capitol rainbow label', 'Matrix numbers', 'First pressing indicators'],
      wear: ['Appropriate wear acceptable', 'Condition critical for value', 'Peel damage noted']
    },
    photographyGuidance: {
      essential: [
        { location: 'Full cover', reason: 'Butcher image and condition' },
        { location: 'Record label', reason: 'Pressing identification' },
        { location: 'Cover state', reason: 'First state vs peeled' }
      ],
      helpful: [{ location: 'Matrix numbers', reason: 'Pressing verification' }],
      forAuthentication: [{ location: 'Edge detail if peeled', reason: 'Authentic peel evidence' }]
    },
    authenticationDeep: {
      genuineIndicators: ['Correct Capitol pressing', 'Period materials', 'Authentic peel (if second state)', 'Matrix numbers match'],
      fakeIndicators: ['Fake peel job', 'Wrong pressing', 'Reproduction sleeve', 'Modern materials'],
      commonReproductions: ['Reproduction covers', 'Fake peels', 'Modern repressings'],
      ageIndicators: ['June 1966: Original release and recall', 'First state: Never covered', 'Second state: Professionally peeled', 'Third state: Trunk cover intact'],
      provenance: ['Original purchase history', 'Capitol records provenance', 'Beatles collection history']
    },
    marketIntelligence: {
      currentDemand: 'very strong',
      priceFactors: [
        { factor: 'First state (never covered)', impact: '$50,000-125,000' },
        { factor: 'Second state (professional peel)', impact: '$10,000-30,000' },
        { factor: 'Third state (paste-over intact)', impact: '$1,500-5,000' },
        { factor: 'Mono vs Stereo', impact: 'Mono more valuable' }
      ],
      bestVenues: ['Heritage Auctions', 'Discogs', 'Specialist record dealers', 'Beatles memorabilia auctions'],
      targetBuyers: ['Beatles collectors', 'Record collectors', 'Rock memorabilia collectors'],
      seasonality: 'Major music memorabilia sales year-round.',
      trend: 'Beatles items consistently strong. Butcher cover increasingly rare in first state.'
    },
    conversationTriggers: {
      askAbout: [{ condition: 'State unclear', question: 'Is this first state (original), second state (peeled), or third state (covered)?' }],
      requestPhoto: [{ condition: 'Cannot verify state', request: 'Edge detail showing any paste-over evidence', reason: 'State determination critical' }],
      clarify: [{ condition: 'Condition unclear', clarification: 'What is the condition of both the sleeve and the record?' }]
    },
    expertInsights: {
      sellerTips: ['Document state clearly', 'Get professional authentication for first state', 'Note condition carefully', 'Include record condition'],
      buyerTips: ['Learn to identify states', 'Verify with experts', 'Check for fake peels', 'Understand value by state'],
      commonMistakes: ['Confusing states', 'Accepting fake peels', 'Not checking pressing', 'Ignoring record condition'],
      hiddenValue: ['First state examples', 'Sealed copies (extremely rare)', 'Beatles-owned copies', 'Important provenance'],
      storySellsFor: 'Capitol Records recalled Yesterday and Today just days after release when retailers complained about the gruesome "butcher cover" photo. Most copies were covered with a new photo (trunk cover). Those that survived uncovered became the most sought-after Beatles collectible.'
    }
  }
]

/**
 * Compile all expert knowledge
 */
export const EXPERT_KNOWLEDGE_BASE: ExpertKnowledgeEntry[] = [
  ...furnitureKnowledge,
  ...ceramicsKnowledge,
  ...artKnowledge,
  ...jewelryKnowledge,
  ...silverKnowledge,
  ...glassKnowledge,
  ...textilesKnowledge,
  ...toysKnowledge,
  ...lightingKnowledge,
  ...booksKnowledge
]

/**
 * Get expert knowledge for a specific item
 */
export function getExpertKnowledge(itemId: string): ExpertKnowledgeEntry | undefined {
  return EXPERT_KNOWLEDGE_BASE.find(k => k.itemId === itemId)
}

/**
 * Get all visual cues for a category
 */
export function getVisualCuesForCategory(category: string): string[] {
  return EXPERT_KNOWLEDGE_BASE
    .filter(k => k.itemId.startsWith(category.substring(0, 4)))
    .flatMap(k => [
      ...k.visualCues.construction,
      ...k.visualCues.materials,
      ...k.visualCues.marks
    ])
}

/**
 * Get authentication checklist for an item
 */
export function getAuthenticationChecklist(itemId: string): string[] {
  const knowledge = getExpertKnowledge(itemId)
  if (!knowledge) return []

  return [
    ...knowledge.authenticationDeep.genuineIndicators.map(i => `✓ ${i}`),
    ...knowledge.authenticationDeep.fakeIndicators.map(i => `✗ ${i}`)
  ]
}

console.log(`Expert Knowledge Base loaded: ${EXPERT_KNOWLEDGE_BASE.length} items with deep expertise`)
