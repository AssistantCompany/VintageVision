/**
 * Image Quality Specification for VintageVision Test Suite
 *
 * This defines exactly what each test image MUST show to properly validate
 * our AI analysis capabilities. Every image is curated with specific
 * requirements to test identification, authentication, and valuation.
 *
 * Quality Gates:
 * 1. Resolution: Minimum 800x600 pixels
 * 2. Clarity: Key features clearly visible
 * 3. Lighting: Natural or professional, no harsh shadows
 * 4. Angle: Shows primary identifying features
 * 5. Content: Must include specific elements listed below
 */

export interface ImageQualitySpec {
  itemId: string
  itemName: string
  category: string

  // What MUST be visible in the image
  requiredElements: {
    element: string
    reason: string
    criticality: 'essential' | 'important' | 'helpful'
  }[]

  // Ideal image characteristics
  idealShot: {
    angle: string
    lighting: string
    distance: string
    background: string
  }

  // What tests this image enables
  testsCapabilities: {
    capability: string
    howItTests: string
  }[]

  // Quality validation criteria
  qualityChecklist: string[]

  // Alternative acceptable images
  alternatives: {
    description: string
    tradeoffs: string
  }[]

  // Best sources for this type of image
  recommendedSources: string[]
}

/**
 * FURNITURE IMAGE SPECIFICATIONS
 */
export const FURNITURE_IMAGE_SPECS: ImageQualitySpec[] = [
  {
    itemId: 'furn-001',
    itemName: 'Eames Lounge Chair and Ottoman',
    category: 'furniture',

    requiredElements: [
      { element: 'Full chair with ottoman', reason: 'Complete set identification', criticality: 'essential' },
      { element: 'Visible wood grain on shells', reason: 'Wood type identification (rosewood vs walnut)', criticality: 'essential' },
      { element: 'Leather cushions with button pattern', reason: 'Authenticate construction quality', criticality: 'essential' },
      { element: 'Five-star base visible', reason: 'Distinguish from four-star fakes', criticality: 'important' },
      { element: 'Profile showing recline angle', reason: 'Verify proportions', criticality: 'important' },
      { element: 'Shock mounts (if possible)', reason: 'Condition assessment', criticality: 'helpful' }
    ],

    idealShot: {
      angle: '3/4 front view showing both chair and ottoman',
      lighting: 'Natural light or soft studio lighting to show wood grain',
      distance: 'Full chair in frame with some context',
      background: 'Clean, neutral background (white, gray, or tasteful interior)'
    },

    testsCapabilities: [
      { capability: 'Iconic design recognition', howItTests: 'AI must instantly identify Eames Lounge' },
      { capability: 'Material identification', howItTests: 'Distinguish rosewood vs walnut from grain pattern' },
      { capability: 'Era estimation', howItTests: 'Determine vintage vs modern from details' },
      { capability: 'Value assessment', howItTests: 'Price based on condition and materials' },
      { capability: 'Completeness check', howItTests: 'Identify if ottoman is included' }
    ],

    qualityChecklist: [
      '☐ Both chair and ottoman visible',
      '☐ Wood grain clearly visible on shells',
      '☐ Leather texture and condition apparent',
      '☐ Base configuration visible (five-star)',
      '☐ No harsh shadows obscuring details',
      '☐ Color accurate (not overly warm/cool)',
      '☐ Minimum 800x600 resolution'
    ],

    alternatives: [
      { description: 'Chair only without ottoman', tradeoffs: 'Cannot test completeness, but acceptable for ID' },
      { description: 'Closeup of shell and leather', tradeoffs: 'Good for authentication, less useful for overall ID' }
    ],

    recommendedSources: [
      'Metropolitan Museum of Art (has Eames pieces)',
      'Vitra Design Museum archive',
      'Herman Miller official photos',
      '1stDibs dealer listings',
      'High-end auction house catalogs (Christie\'s, Sotheby\'s)'
    ]
  },

  {
    itemId: 'furn-002',
    itemName: 'Barcelona Chair',
    category: 'furniture',

    requiredElements: [
      { element: 'Full X-frame base', reason: 'Iconic identification feature', criticality: 'essential' },
      { element: 'Tufted leather cushions', reason: 'Quality and authenticity assessment', criticality: 'essential' },
      { element: 'Chrome/steel finish visible', reason: 'Material and condition assessment', criticality: 'important' },
      { element: 'Cushion tufting pattern', reason: 'Hand-welted vs machine identification', criticality: 'important' },
      { element: 'Side profile', reason: 'Verify correct proportions', criticality: 'helpful' }
    ],

    idealShot: {
      angle: '3/4 front view showing X-frame and cushions',
      lighting: 'Studio lighting that shows chrome reflection without glare',
      distance: 'Full chair with cushions clearly visible',
      background: 'Clean white or gray to highlight chrome'
    },

    testsCapabilities: [
      { capability: 'Bauhaus design recognition', howItTests: 'Identify Barcelona within modernist designs' },
      { capability: 'Construction quality assessment', howItTests: 'Evaluate weld quality and tufting' },
      { capability: 'Brand identification', howItTests: 'Determine if authentic Knoll' },
      { capability: 'Material assessment', howItTests: 'Chrome condition and leather quality' }
    ],

    qualityChecklist: [
      '☐ X-frame base clearly visible',
      '☐ Leather cushions and tufting visible',
      '☐ Chrome finish condition apparent',
      '☐ Overall proportions visible',
      '☐ No excessive glare on chrome',
      '☐ Color accurate'
    ],

    alternatives: [
      { description: 'Top-down showing cushion detail', tradeoffs: 'Great for tufting analysis, less useful for frame' },
      { description: 'Side profile', tradeoffs: 'Good for proportions, may miss tufting detail' }
    ],

    recommendedSources: [
      'Knoll official photography',
      'Design museum collections',
      '1stDibs Barcelona chair listings',
      'Wright auction catalogs'
    ]
  },

  {
    itemId: 'furn-003',
    itemName: 'Gustav Stickley Sideboard',
    category: 'furniture',

    requiredElements: [
      { element: 'Through-tenon joinery', reason: 'Key authentication feature', criticality: 'essential' },
      { element: 'Quarter-sawn oak grain (ray fleck)', reason: 'Material identification', criticality: 'essential' },
      { element: 'Hammered hardware', reason: 'Period authenticity', criticality: 'important' },
      { element: 'Overall form and proportions', reason: 'Model identification', criticality: 'important' },
      { element: 'Finish appearance', reason: 'Original vs refinished assessment', criticality: 'helpful' }
    ],

    idealShot: {
      angle: 'Front view showing drawers, doors, and hardware',
      lighting: 'Natural or warm light to show oak grain accurately',
      distance: 'Full piece with joinery details visible',
      background: 'Period-appropriate or neutral setting'
    },

    testsCapabilities: [
      { capability: 'Arts & Crafts identification', howItTests: 'Recognize Mission/Craftsman style' },
      { capability: 'Maker attribution', howItTests: 'Distinguish Gustav from L&JG or Brothers' },
      { capability: 'Joinery assessment', howItTests: 'Identify hand-cut vs machine joinery' },
      { capability: 'Hardware authentication', howItTests: 'Hand-hammered vs cast hardware' },
      { capability: 'Condition evaluation', howItTests: 'Original finish vs refinished' }
    ],

    qualityChecklist: [
      '☐ Through-tenons visible on sides or top',
      '☐ Oak grain with ray fleck pattern visible',
      '☐ Hardware clearly visible',
      '☐ Overall proportions captured',
      '☐ Finish color accurate (fumed brown, not orange)',
      '☐ Details sharp enough for authentication'
    ],

    alternatives: [
      { description: 'Detail shot of joinery', tradeoffs: 'Excellent for authentication, less useful for overall ID' },
      { description: 'Hardware closeup', tradeoffs: 'Good for period confirmation' }
    ],

    recommendedSources: [
      'Rago auctions catalog',
      'Christie\'s American furniture',
      'Antiques Roadshow archives',
      'JMW Gallery inventory'
    ]
  }
]

/**
 * CERAMICS IMAGE SPECIFICATIONS
 */
export const CERAMICS_IMAGE_SPECS: ImageQualitySpec[] = [
  {
    itemId: 'ceram-003',
    itemName: 'Roseville Pinecone Vase',
    category: 'ceramics',

    requiredElements: [
      { element: 'Raised pinecone relief', reason: 'Pattern identification', criticality: 'essential' },
      { element: 'Matte glaze finish', reason: 'Authenticate period production', criticality: 'essential' },
      { element: 'Color (green, blue, or brown)', reason: 'Value and rarity assessment', criticality: 'important' },
      { element: 'Overall form', reason: 'Shape number identification', criticality: 'important' },
      { element: 'Base with marks (if possible)', reason: 'Authentication', criticality: 'helpful' }
    ],

    idealShot: {
      angle: 'Front view showing primary relief decoration',
      lighting: 'Soft lighting that shows matte glaze texture',
      distance: 'Full piece with detail visible',
      background: 'Neutral background'
    },

    testsCapabilities: [
      { capability: 'Pattern recognition', howItTests: 'Identify Pinecone among Roseville patterns' },
      { capability: 'Glaze assessment', howItTests: 'Distinguish matte from glossy (fakes often wrong)' },
      { capability: 'Color identification', howItTests: 'Determine colorway for value' },
      { capability: 'Condition evaluation', howItTests: 'Spot chips, crazing, repairs' }
    ],

    qualityChecklist: [
      '☐ Relief decoration clearly visible',
      '☐ Glaze texture apparent (matte, not shiny)',
      '☐ True color representation',
      '☐ Any damage visible for condition notes',
      '☐ Shape/form complete in frame'
    ],

    alternatives: [
      { description: 'Base with marks', tradeoffs: 'Essential for authentication, less useful for pattern ID' },
      { description: 'Multiple angles', tradeoffs: 'Comprehensive but may be overkill' }
    ],

    recommendedSources: [
      'Ruby Lane pottery dealers',
      'Replacements.com',
      'Rago auctions ceramics',
      'American art pottery specialists'
    ]
  }
]

/**
 * WATCHES & JEWELRY IMAGE SPECIFICATIONS
 */
export const JEWELRY_IMAGE_SPECS: ImageQualitySpec[] = [
  {
    itemId: 'jwl-001',
    itemName: 'Rolex Submariner',
    category: 'watches',

    requiredElements: [
      { element: 'Full dial view', reason: 'Model identification and dial authentication', criticality: 'essential' },
      { element: 'Bezel with minute markers', reason: 'Rotating bezel identification', criticality: 'essential' },
      { element: 'Cyclops lens over date', reason: 'Key authentication point (2.5x magnification)', criticality: 'essential' },
      { element: 'Mercedes hands', reason: 'Distinctive Rolex feature', criticality: 'important' },
      { element: 'Bracelet style', reason: 'Model and period identification', criticality: 'important' },
      { element: 'Crown position', reason: 'Triplock crown identification', criticality: 'helpful' }
    ],

    idealShot: {
      angle: 'Straight-on dial shot with slight angle to show cyclops',
      lighting: 'Soft, even lighting - no harsh reflections on crystal',
      distance: 'Close enough to read dial text',
      background: 'Clean, dark background for contrast'
    },

    testsCapabilities: [
      { capability: 'Luxury watch identification', howItTests: 'Identify Submariner within Rolex lineup' },
      { capability: 'Reference identification', howItTests: 'Determine specific reference number from details' },
      { capability: 'Authentication', howItTests: 'Spot fake indicators (wrong cyclops, ticking second hand)' },
      { capability: 'Condition assessment', howItTests: 'Evaluate dial, bezel, crystal condition' },
      { capability: 'Value estimation', howItTests: 'Price based on reference and condition' }
    ],

    qualityChecklist: [
      '☐ Dial legible - text can be read',
      '☐ Cyclops lens visible',
      '☐ Bezel markers visible',
      '☐ No excessive reflections obscuring dial',
      '☐ Hands position allows dial reading',
      '☐ Bracelet or strap visible',
      '☐ High resolution for text verification'
    ],

    alternatives: [
      { description: 'Wrist shot', tradeoffs: 'Natural context but may have angle issues' },
      { description: 'Movement shot', tradeoffs: 'Definitive authentication but requires opening' }
    ],

    recommendedSources: [
      'Chrono24 verified dealer listings',
      'Bob\'s Watches photography',
      'Hodinkee articles',
      'Phillips/Christie\'s watch auction catalogs'
    ]
  }
]

/**
 * ART IMAGE SPECIFICATIONS
 */
export const ART_IMAGE_SPECS: ImageQualitySpec[] = [
  {
    itemId: 'art-001',
    itemName: 'The Starry Night',
    category: 'art',

    requiredElements: [
      { element: 'Full composition', reason: 'Work identification', criticality: 'essential' },
      { element: 'Swirling sky patterns', reason: 'Signature Van Gogh element', criticality: 'essential' },
      { element: 'Cypress tree', reason: 'Key composition element', criticality: 'important' },
      { element: 'Village with church spire', reason: 'Composition identification', criticality: 'important' },
      { element: 'Visible brushwork (for original/reproduction assessment)', reason: 'Distinguish print from painting', criticality: 'helpful' }
    ],

    idealShot: {
      angle: 'Straight-on, level with painting',
      lighting: 'Museum lighting or even illumination',
      distance: 'Full painting with slight border',
      background: 'Museum wall or frame visible'
    },

    testsCapabilities: [
      { capability: 'Masterwork recognition', howItTests: 'Instant identification of iconic artwork' },
      { capability: 'Original vs reproduction', howItTests: 'Distinguish original from prints' },
      { capability: 'Artist attribution', howItTests: 'Identify Van Gogh style' },
      { capability: 'Context awareness', howItTests: 'Know original is at MoMA, assess reproduction type' }
    ],

    qualityChecklist: [
      '☐ Full composition visible',
      '☐ Colors accurate (not oversaturated)',
      '☐ No glare or reflections',
      '☐ Surface texture visible if original/painted reproduction',
      '☐ Frame or edges visible for context'
    ],

    alternatives: [
      { description: 'Detail shot of sky', tradeoffs: 'Shows brushwork but may not ID full work' },
      { description: 'With museum context', tradeoffs: 'Confirms location but may have crowds/reflections' }
    ],

    recommendedSources: [
      'MoMA official photography',
      'Google Arts & Culture high-res',
      'Art history textbooks',
      'Museum shop reproduction photos'
    ]
  }
]

/**
 * Compile all image specifications
 */
export const ALL_IMAGE_SPECS: ImageQualitySpec[] = [
  ...FURNITURE_IMAGE_SPECS,
  ...CERAMICS_IMAGE_SPECS,
  ...JEWELRY_IMAGE_SPECS,
  ...ART_IMAGE_SPECS
]

/**
 * Get image spec for an item
 */
export function getImageSpec(itemId: string): ImageQualitySpec | undefined {
  return ALL_IMAGE_SPECS.find(s => s.itemId === itemId)
}

/**
 * Validate an image against its spec (manual checklist)
 */
export function generateValidationChecklist(itemId: string): string {
  const spec = getImageSpec(itemId)
  if (!spec) return 'No spec found for this item'

  let checklist = `IMAGE VALIDATION CHECKLIST: ${spec.itemName}\n`
  checklist += '=' .repeat(60) + '\n\n'

  checklist += 'REQUIRED ELEMENTS:\n'
  for (const req of spec.requiredElements) {
    const marker = req.criticality === 'essential' ? '⚠️' : req.criticality === 'important' ? '📌' : '💡'
    checklist += `${marker} ☐ ${req.element}\n   Reason: ${req.reason}\n\n`
  }

  checklist += '\nIDEAL SHOT:\n'
  checklist += `• Angle: ${spec.idealShot.angle}\n`
  checklist += `• Lighting: ${spec.idealShot.lighting}\n`
  checklist += `• Distance: ${spec.idealShot.distance}\n`
  checklist += `• Background: ${spec.idealShot.background}\n`

  checklist += '\nQUALITY CHECKLIST:\n'
  for (const item of spec.qualityChecklist) {
    checklist += `${item}\n`
  }

  return checklist
}

console.log(`Image Quality Specifications loaded: ${ALL_IMAGE_SPECS.length} items with detailed requirements`)
