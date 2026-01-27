/**
 * VintageVision Expert Knowledge Base
 *
 * This file contains deep specialist knowledge for antique identification,
 * authentication, and valuation. It encodes decades of expert experience
 * into structured data that can be used to enhance AI analysis.
 *
 * This is our MOAT - proprietary knowledge that makes VintageVision indispensable.
 */

// ============================================================================
// MAKER MARKS DATABASE
// ============================================================================

export interface MakerMark {
  id: string;
  maker: string;
  markDescription: string;
  variations: string[];
  activeYears: string;
  origin: string;
  category: string;
  valueMultiplier: number; // 1.0 = average, 2.0 = premium, 0.5 = common
  notes: string;
}

export const MAKER_MARKS_DATABASE: MakerMark[] = [
  // FURNITURE MAKERS
  {
    id: 'furniture-stickley-gustav',
    maker: 'Gustav Stickley',
    markDescription: 'Red decal with joiner\'s compass and motto "Als Ik Kan"',
    variations: ['Craftsman', 'red decal', 'paper label', 'branded'],
    activeYears: '1900-1916',
    origin: 'Syracuse, NY',
    category: 'furniture',
    valueMultiplier: 2.5,
    notes: 'Most valuable Stickley. Look for original finish and paper labels.',
  },
  {
    id: 'furniture-stickley-l-jg',
    maker: 'L. & J.G. Stickley',
    markDescription: 'Handcraft decal or "The Work of..." label',
    variations: ['Handcraft', 'Work of L&JG'],
    activeYears: '1902-present',
    origin: 'Fayetteville, NY',
    category: 'furniture',
    valueMultiplier: 1.8,
    notes: 'Still in production. Vintage pieces command premium.',
  },
  {
    id: 'furniture-herman-miller',
    maker: 'Herman Miller',
    markDescription: 'Metal medallion or label with company name',
    variations: ['Zeeland, Michigan label', 'Made in U.S.A.', 'circular medallion'],
    activeYears: '1923-present',
    origin: 'Zeeland, MI',
    category: 'furniture',
    valueMultiplier: 2.0,
    notes: 'Eames and Nelson designs most valuable. Check for authenticity labels.',
  },
  {
    id: 'furniture-knoll',
    maker: 'Knoll',
    markDescription: 'Knoll label or stamp',
    variations: ['Knoll International', 'Knoll Associates'],
    activeYears: '1938-present',
    origin: 'East Greenville, PA',
    category: 'furniture',
    valueMultiplier: 1.8,
    notes: 'Barcelona Chair, Tulip series most sought after.',
  },
  {
    id: 'furniture-thonet',
    maker: 'Thonet',
    markDescription: 'Paper label or brand stamp "THONET"',
    variations: ['Thonet Vienna', 'Gebruder Thonet', 'Thonet Brothers'],
    activeYears: '1853-present',
    origin: 'Vienna, Austria',
    category: 'furniture',
    valueMultiplier: 1.5,
    notes: 'No. 14 chair most famous. Original 19th century pieces very valuable.',
  },

  // CERAMICS MAKERS
  {
    id: 'ceramics-rookwood',
    maker: 'Rookwood Pottery',
    markDescription: 'Reverse RP monogram with flames',
    variations: ['flames count = year after 1886', 'artist signatures below'],
    activeYears: '1880-1967',
    origin: 'Cincinnati, OH',
    category: 'ceramics',
    valueMultiplier: 2.0,
    notes: 'Count flames to date. Artists like Shirayamadani command premium.',
  },
  {
    id: 'ceramics-roseville',
    maker: 'Roseville Pottery',
    markDescription: 'Raised or impressed "ROSEVILLE" or "Rv"',
    variations: ['Roseville USA', 'pattern name impressed', 'paper labels'],
    activeYears: '1890-1954',
    origin: 'Roseville/Zanesville, OH',
    category: 'ceramics',
    valueMultiplier: 1.5,
    notes: 'Pinecone, Futura, Sunflower patterns most valuable.',
  },
  {
    id: 'ceramics-weller',
    maker: 'Weller Pottery',
    markDescription: 'Incised or stamped "WELLER"',
    variations: ['Weller Pottery', 'Weller Ware', 'script signature'],
    activeYears: '1872-1948',
    origin: 'Zanesville, OH',
    category: 'ceramics',
    valueMultiplier: 1.3,
    notes: 'Hudson, Sicard lines most valuable. Many art lines.',
  },
  {
    id: 'ceramics-grueby',
    maker: 'Grueby Faience',
    markDescription: 'Circular stamp "GRUEBY" with lotus',
    variations: ['Grueby Pottery', 'Grueby Faience Co.'],
    activeYears: '1894-1920',
    origin: 'Boston, MA',
    category: 'ceramics',
    valueMultiplier: 3.0,
    notes: 'Matte green glaze iconic. Lamp bases highly sought.',
  },
  {
    id: 'ceramics-meissen',
    maker: 'Meissen',
    markDescription: 'Crossed blue swords',
    variations: ['sword variations indicate era', 'sometimes with dot or star'],
    activeYears: '1710-present',
    origin: 'Meissen, Germany',
    category: 'ceramics',
    valueMultiplier: 3.0,
    notes: 'First European porcelain. Figurines and tableware valuable.',
  },
  {
    id: 'ceramics-wedgwood',
    maker: 'Wedgwood',
    markDescription: 'Impressed "WEDGWOOD"',
    variations: ['WEDGWOOD & BENTLEY (1769-80)', 'ENGLAND added 1891+'],
    activeYears: '1759-present',
    origin: 'Staffordshire, England',
    category: 'ceramics',
    valueMultiplier: 1.5,
    notes: 'Jasperware iconic. Portland Vase copies valuable.',
  },

  // SILVER MAKERS
  {
    id: 'silver-tiffany',
    maker: 'Tiffany & Co.',
    markDescription: 'TIFFANY & CO with pattern number',
    variations: ['STERLING', 'TIFFANY & CO MAKERS', 'T&CO'],
    activeYears: '1837-present',
    origin: 'New York, NY',
    category: 'silver',
    valueMultiplier: 2.5,
    notes: 'Chrysanthemum, Audubon patterns premium. Japanese style highly valued.',
  },
  {
    id: 'silver-gorham',
    maker: 'Gorham Manufacturing Co.',
    markDescription: 'Lion, anchor, G mark',
    variations: ['GORHAM', 'Martelé', 'STERLING', 'date marks'],
    activeYears: '1831-present',
    origin: 'Providence, RI',
    category: 'silver',
    valueMultiplier: 1.8,
    notes: 'Martelé art silver extremely valuable. Chantilly pattern popular.',
  },
  {
    id: 'silver-georg-jensen',
    maker: 'Georg Jensen',
    markDescription: 'GJ in dotted oval or beaded rectangle',
    variations: ['Georg Jensen DENMARK', 'STERLING', 'numbered designs'],
    activeYears: '1904-present',
    origin: 'Copenhagen, Denmark',
    category: 'silver',
    valueMultiplier: 2.5,
    notes: 'Blossom pattern iconic. Modernist designs highly collectible.',
  },
  {
    id: 'silver-paul-revere',
    maker: 'Paul Revere',
    markDescription: 'REVERE in rectangle or PR script',
    variations: ['Paul Revere script', 'REVERE block letters'],
    activeYears: '1765-1818',
    origin: 'Boston, MA',
    category: 'silver',
    valueMultiplier: 10.0,
    notes: 'Extremely rare and valuable. Sons of Liberty Bowl famous.',
  },

  // GLASS MAKERS
  {
    id: 'glass-tiffany-favrile',
    maker: 'Tiffany Studios',
    markDescription: 'L.C.T. or Louis C. Tiffany Favrile',
    variations: ['LCT', 'L.C. Tiffany Favrile', 'Tiffany Studios New York'],
    activeYears: '1893-1933',
    origin: 'Corona, NY',
    category: 'glass',
    valueMultiplier: 5.0,
    notes: 'Favrile glass iridescent. Lamp shades extremely valuable.',
  },
  {
    id: 'glass-lalique',
    maker: 'René Lalique / Lalique',
    markDescription: 'R. LALIQUE or LALIQUE FRANCE',
    variations: ['R. Lalique France', 'Lalique France', 'script vs block'],
    activeYears: '1885-present',
    origin: 'Paris, France',
    category: 'glass',
    valueMultiplier: 3.0,
    notes: 'R. Lalique (pre-1945) more valuable than Lalique (post-1945).',
  },
  {
    id: 'glass-steuben',
    maker: 'Steuben Glass',
    markDescription: 'Acid-etched fleur-de-lis or STEUBEN',
    variations: ['Aurene signature', 'fleur-de-lis', 'STEUBEN'],
    activeYears: '1903-2011',
    origin: 'Corning, NY',
    category: 'glass',
    valueMultiplier: 2.0,
    notes: 'Frederick Carder era (1903-1932) most valuable.',
  },

  // WATCH MAKERS
  {
    id: 'watch-rolex',
    maker: 'Rolex',
    markDescription: 'Crown logo, ROLEX on dial and case',
    variations: ['Oyster Perpetual', 'reference numbers on case'],
    activeYears: '1905-present',
    origin: 'Geneva, Switzerland',
    category: 'watches',
    valueMultiplier: 3.0,
    notes: 'Verify reference numbers. Vintage sports models extremely valuable.',
  },
  {
    id: 'watch-patek',
    maker: 'Patek Philippe',
    markDescription: 'Calatrava cross, PATEK PHILIPPE GENEVE',
    variations: ['reference numbers', 'case back engravings'],
    activeYears: '1839-present',
    origin: 'Geneva, Switzerland',
    category: 'watches',
    valueMultiplier: 5.0,
    notes: 'Holy grail of watches. Perpetual calendar, minute repeaters premium.',
  },
  {
    id: 'watch-omega',
    maker: 'Omega',
    markDescription: 'Omega symbol, reference numbers',
    variations: ['Seamaster', 'Speedmaster', 'Constellation'],
    activeYears: '1848-present',
    origin: 'Biel, Switzerland',
    category: 'watches',
    valueMultiplier: 1.5,
    notes: 'Speedmaster "Moon Watch" iconic. Early references valuable.',
  },

  // TOY MAKERS
  {
    id: 'toy-steiff',
    maker: 'Steiff',
    markDescription: 'Button in ear with "Steiff" tag',
    variations: ['blank button (pre-1905)', 'yellow tag', 'white tag'],
    activeYears: '1880-present',
    origin: 'Giengen, Germany',
    category: 'toys',
    valueMultiplier: 3.0,
    notes: 'Button in ear is authentication. Early teddy bears extremely valuable.',
  },
  {
    id: 'toy-hubley',
    maker: 'Hubley Manufacturing',
    markDescription: 'HUBLEY cast into iron',
    variations: ['Hubley USA', 'HUBLEY TOYS'],
    activeYears: '1894-1978',
    origin: 'Lancaster, PA',
    category: 'toys',
    valueMultiplier: 1.5,
    notes: 'Cast iron toys, doorstops. Original paint crucial for value.',
  },
  {
    id: 'toy-lionel',
    maker: 'Lionel Corporation',
    markDescription: 'LIONEL on trains and boxes',
    variations: ['Lionel Lines', 'Lionel Electric Trains'],
    activeYears: '1900-present',
    origin: 'New York, NY',
    category: 'toys',
    valueMultiplier: 2.0,
    notes: 'Pre-war O gauge most valuable. Original boxes add significant value.',
  },
];

// ============================================================================
// IDENTIFICATION PATTERNS BY CATEGORY
// ============================================================================

export interface IdentificationPattern {
  category: string;
  itemType: string;
  keyIdentifiers: string[];
  valueFactors: string[];
  commonMistakes: string[];
  redFlags: string[];
  periodIndicators: Record<string, string>;
}

export const IDENTIFICATION_PATTERNS: IdentificationPattern[] = [
  // FURNITURE PATTERNS
  {
    category: 'furniture',
    itemType: 'Eames Lounge Chair',
    keyIdentifiers: [
      'Herman Miller medallion on underside',
      'Rosewood or walnut veneer shells',
      'Down-filled leather cushions',
      'Five-star aluminum base',
      'Serial number and production date',
    ],
    valueFactors: [
      'Original leather condition',
      'Rosewood vs walnut (rosewood = premium)',
      'First generation (1956-1970) = highest value',
      'Matching ottoman',
      'Original shock mounts intact',
    ],
    commonMistakes: [
      'Confusing with reproductions (Plycraft, Selig)',
      'Missing production date = could be fake',
      'Replaced shock mounts reduce value',
    ],
    redFlags: [
      'No Herman Miller label',
      'Shells don\'t match in color/grain',
      'Vinyl instead of leather',
      'Wrong base style for era',
    ],
    periodIndicators: {
      '1956-1960': 'Down cushions, earliest HM labels',
      '1961-1970': 'Down cushions, updated labels',
      '1971-1990': 'Foam cushions introduced',
      '1990-present': 'Modern production, still valuable',
    },
  },
  {
    category: 'furniture',
    itemType: 'Chippendale Chair',
    keyIdentifiers: [
      'Ball and claw feet',
      'Acanthus leaf carving on knees',
      'Pierced splat back (ribbon, Gothic, or Chinese)',
      'Cabriole legs',
      'Typical era: 1750-1790',
    ],
    valueFactors: [
      'Original finish and patina',
      'Philadelphia origin = highest value',
      'Provenance documentation',
      'Matched set vs single chairs',
      'Quality of carving',
    ],
    commonMistakes: [
      'Confusing Centennial reproductions (1876+)',
      'Chippendale "style" ≠ period piece',
      'Refinished pieces worth less',
    ],
    redFlags: [
      'Machine-made dovetails',
      'Phillips head screws',
      'Uniform dark stain hiding repairs',
      'Wrong wood for claimed origin',
    ],
    periodIndicators: {
      'Period (1750-1790)': 'Hand-cut dovetails, rose-head nails',
      'Centennial (1876-1920)': 'Better machine work, still hand-finished',
      'Revival (1920-1960)': 'More uniform construction',
    },
  },

  // CERAMICS PATTERNS
  {
    category: 'ceramics',
    itemType: 'Rookwood Pottery Vase',
    keyIdentifiers: [
      'Reverse RP monogram on base',
      'Flame marks (count = years after 1886)',
      'Artist\'s cipher/signature',
      'Shape numbers',
      'Glaze type identification',
    ],
    valueFactors: [
      'Standard Glaze with portraits = high value',
      'Sea Green, Iris glazes premium',
      'Known artists (Shirayamadani, Valentien) = 2-10x value',
      'Large size pieces',
      'Exceptional decoration',
    ],
    commonMistakes: [
      'Not all Rookwood is valuable (mass production pieces)',
      'Confusing with similar Ohio potteries',
      'Overcleaning removes valuable patina',
    ],
    redFlags: [
      'Flame marks inconsistent with claimed date',
      'Artist signature doesn\'t match style',
      'Repair or restoration',
      'Secondary market marks added',
    ],
    periodIndicators: {
      '1880-1886': 'No flames, early marks',
      '1886-1900': 'Count flames + 1886 = year',
      '1900-1906': 'Fourteen flames max, then Roman numerals',
      '1906-1960': 'Roman numerals for year',
    },
  },

  // SILVER PATTERNS
  {
    category: 'silver',
    itemType: 'Georgian Sterling Silver Teapot',
    keyIdentifiers: [
      'Full English hallmarks (4-5 marks)',
      'Lion passant (sterling standard)',
      'City mark (leopard=London, anchor=Birmingham)',
      'Date letter (changes annually)',
      'Maker\'s mark (initials)',
    ],
    valueFactors: [
      'Famous makers (Hester Bateman, Paul Storr) = premium',
      'Weight (heavier = more valuable)',
      'Original condition vs repairs',
      'Provenance and family crests',
      'Period appropriate form',
    ],
    commonMistakes: [
      'Silverplate with worn marks mistaken for sterling',
      'Misreading date letters',
      'Fake or transposed marks',
    ],
    redFlags: [
      'Marks in wrong location',
      'Marks don\'t match claimed date',
      'Lead solder repairs',
      'Marks rubbed/illegible (possibly intentional)',
    ],
    periodIndicators: {
      'Georgian (1714-1830)': 'Hand-raised, heavier, simpler forms',
      'Victorian (1837-1901)': 'More ornate, thinner gauge',
      'Edwardian (1901-1910)': 'Lighter, Neo-classical revival',
    },
  },

  // JEWELRY PATTERNS
  {
    category: 'jewelry',
    itemType: 'Art Deco Diamond Ring',
    keyIdentifiers: [
      'Geometric design (step cuts, chevrons)',
      'Platinum setting (most common)',
      'Calibré-cut side stones',
      'Milgrain edging',
      'Filigree openwork',
    ],
    valueFactors: [
      'Center stone size and quality',
      'Original vs replaced stones',
      'Platinum vs white gold',
      'Signed pieces (Cartier, Van Cleef) = premium',
      'Condition of delicate filigree',
    ],
    commonMistakes: [
      'Confusing Art Deco with Art Deco "style"',
      'White gold repairs on platinum pieces',
      'Later stone replacements',
    ],
    redFlags: [
      'Modern round brilliant cuts (pre-1950 = old European)',
      'Wrong metal for period',
      'Modern safety catch on brooch',
      'Laser inscriptions (modern)',
    ],
    periodIndicators: {
      '1920-1935 (true Art Deco)': 'Platinum, old European/mine cuts, hand engraving',
      '1935-1945 (Retro)': 'Rose gold, larger stones, bolder designs',
      'Revival (1980s+)': 'Modern cuts, different metal quality',
    },
  },

  // WATCH PATTERNS
  {
    category: 'watches',
    itemType: 'Rolex Submariner',
    keyIdentifiers: [
      'Crown logo at 12 o\'clock',
      'Cyclops magnification over date (2.5x)',
      'Reference number between lugs',
      'Serial number on case',
      'Oyster bracelet or NATO strap',
    ],
    valueFactors: [
      'Reference number (5513, 1680, 16800 etc.)',
      'Dial variations (gilt, matte, tropical)',
      'Box and papers',
      'Service history',
      'Patina on dial/bezel (can add or subtract value)',
    ],
    commonMistakes: [
      'Frankenwatches (mixed parts from different years)',
      'Redials (refinished dials)',
      'Service dials replacing original',
    ],
    redFlags: [
      'Wrong magnification (should be 2.5x)',
      'Date wheel font incorrect',
      'Bezel insert color off',
      'Case serial doesn\'t match papers',
      'Movement serial doesn\'t match case',
    ],
    periodIndicators: {
      '1954-1969 (5512/5513)': 'No date, gilt dials, pointed crown guards',
      '1969-1979 (1680)': 'First date model, matte dials',
      '1979-1988 (16800)': 'Sapphire crystal, quickset date',
      '1988-present': 'Various updates, SuperLuminova',
    },
  },

  // ART PATTERNS
  {
    category: 'art',
    itemType: 'Currier and Ives Print',
    keyIdentifiers: [
      'Stone lithograph on period paper',
      'Publisher\'s address on print',
      'Hand-coloring typical',
      'Print size categories (small, medium, large folio)',
      'Title in decorative script below image',
    ],
    valueFactors: [
      'Subject matter (hunting, winter scenes = premium)',
      'Size (large folio most valuable)',
      'Condition (no foxing, tears, fading)',
      'Original frame',
      'Print state (first state most valuable)',
    ],
    commonMistakes: [
      'Photo-mechanical reproductions',
      'Later restrike editions',
      'Confusing with other 19th c. lithographers',
    ],
    redFlags: [
      'Printed dots visible (modern reproduction)',
      'Paper too white (should be aged)',
      'Colors too bright (fading expected)',
      'Wrong address for claimed date',
    ],
    periodIndicators: {
      '1834-1857': '"N. Currier" signature',
      '1857-1907': '"Currier & Ives" signature',
      'Reproductions': 'Many made in 1940s-1970s',
    },
  },

  // GLASS PATTERNS
  {
    category: 'glass',
    itemType: 'Tiffany Favrile Vase',
    keyIdentifiers: [
      'L.C.T. signature on base',
      'Iridescent surface finish',
      'Organic flowing forms',
      'Rich color variations',
      'Pontil mark characteristics',
    ],
    valueFactors: [
      'Form (jack-in-the-pulpit = premium)',
      'Paperweight style = extremely valuable',
      'Pulled feather decoration',
      'Rare colors (red, aqua)',
      'Size (larger = more valuable)',
    ],
    commonMistakes: [
      'Confusing with Loetz, Steuben, or modern reproductions',
      'Faked signatures on period art glass',
      'Assuming all iridescent glass is Tiffany',
    ],
    redFlags: [
      'Signature looks new or scratched',
      'Iridescence too uniform',
      'Wrong numbering system',
      'Modern pontil characteristics',
    ],
    periodIndicators: {
      '1893-1910': 'L.C.T. signature most common',
      '1910-1920': 'Louis C. Tiffany full name',
      '1920-1933': 'Tiffany Favrile mark',
    },
  },
  {
    category: 'glass',
    itemType: 'Lalique Glass',
    keyIdentifiers: [
      'Signature on base (R. LALIQUE or LALIQUE)',
      'Frosted or opalescent finish',
      'Molded relief decoration',
      'High-quality finish and detail',
      'Nature or figural motifs',
    ],
    valueFactors: [
      'R. LALIQUE (pre-1945) vs LALIQUE (post-1945)',
      'Rare models and colors',
      'Condition of frosted surface',
      'Original patina intact',
      'Size and complexity',
    ],
    commonMistakes: [
      'Not distinguishing pre-war from post-war',
      'Confusing with Sabino or other French glass',
      'Overlooking later production',
    ],
    redFlags: [
      'Wheel-cut vs molded signature (know the difference)',
      'Wrong signature style for claimed date',
      'Chips to frosted areas',
      'Replaced parts on compound pieces',
    ],
    periodIndicators: {
      '1885-1945': 'R. LALIQUE FRANCE',
      '1945-present': 'LALIQUE FRANCE (no R.)',
    },
  },

  // TEXTILE PATTERNS
  {
    category: 'textiles',
    itemType: 'Navajo Rug',
    keyIdentifiers: [
      'Hand-woven wool construction',
      'Characteristic geometric patterns',
      'Hand-spun vs commercial yarn',
      'Natural vs synthetic dyes',
      'Horizontal banded design (Chief blanket)',
    ],
    valueFactors: [
      'Phase (First, Second, Third for Chief blankets)',
      'Age (pre-1900 = highest value)',
      'Weaver identification if known',
      'Pattern complexity and execution',
      'Condition (no holes, repairs)',
    ],
    commonMistakes: [
      'Confusing Mexican with Navajo weaving',
      'Not recognizing synthetic dyes',
      'Overlooking condition issues',
    ],
    redFlags: [
      'Warp visible (wear issues)',
      'Aniline dye bleeding',
      'Machine-made construction',
      'Modern reproductions',
    ],
    periodIndicators: {
      '1800-1863': 'Classic period, simple patterns',
      '1863-1900': 'Transition period, more complex',
      '1900-1940': 'Rug period, regional styles emerge',
    },
  },
  {
    category: 'textiles',
    itemType: 'Persian Carpet',
    keyIdentifiers: [
      'Hand-knotted construction (check back)',
      'Knot type (Persian/Senneh vs Turkish/Ghiordes)',
      'Wool pile on cotton/silk foundation',
      'Regional design characteristics',
      'Natural dye colors',
    ],
    valueFactors: [
      'Knot density (higher = more valuable)',
      'Silk content',
      'Age and condition',
      'Workshop or city of origin',
      'Unusual colors or patterns',
    ],
    commonMistakes: [
      'Confusing machine-made with hand-knotted',
      'Misattributing regional origin',
      'Not recognizing repairs',
    ],
    redFlags: [
      'Machine-made fringe (should be integral)',
      'Latex backing (modern)',
      'Synthetic dyes in "antique"',
      'Cut pile hiding wear',
    ],
    periodIndicators: {
      'Antique (1850-1900)': 'Natural dyes, wool foundation',
      'Semi-antique (1900-1950)': 'Some synthetic dyes',
      'Modern (1950+)': 'Often synthetic dyes, cotton foundation',
    },
  },

  // LIGHTING PATTERNS
  {
    category: 'lighting',
    itemType: 'Tiffany Lamp',
    keyIdentifiers: [
      'Leaded glass shade with copper foil technique',
      'Bronze base with patina',
      'TIFFANY STUDIOS NEW YORK stamp',
      'Favrile glass used in shade',
      'Nature-inspired motifs (Dragonfly, Wisteria, etc.)',
    ],
    valueFactors: [
      'Pattern rarity (Dragonfly, Wisteria = premium)',
      'Size (larger = more valuable)',
      'Glass quality and color',
      'Base matches shade style',
      'Original patina intact',
    ],
    commonMistakes: [
      'Confusing with reproductions (many exist)',
      'Mixed bases and shades',
      'Replaced glass segments',
    ],
    redFlags: [
      'No stamp on base',
      'Lead lines too uniform (machine)',
      'Modern soldering technique',
      'Glass doesn\'t match period',
    ],
    periodIndicators: {
      '1895-1905': 'Early production, simpler designs',
      '1905-1920': 'Peak production, most patterns',
      '1920-1933': 'Later production, fewer designs',
    },
  },
  {
    category: 'lighting',
    itemType: 'Art Deco Lamp',
    keyIdentifiers: [
      'Geometric or streamlined forms',
      'Chrome, nickel, or bronze finish',
      'Frosted or milk glass shade',
      'Stepped or tiered design',
      'Machine Age aesthetics',
    ],
    valueFactors: [
      'Designer attribution',
      'Chrome quality and condition',
      'Original glass shade',
      'Period correct wiring',
      'Notable manufacturers',
    ],
    commonMistakes: [
      'Confusing Art Deco with Art Nouveau',
      'Reproductions from 1980s',
      'Replaced shades',
    ],
    redFlags: [
      'Modern wiring throughout',
      'Chrome too shiny (re-plated)',
      'Wrong bulb socket type',
    ],
    periodIndicators: {
      '1920-1935': 'True Art Deco, geometric',
      '1935-1945': 'Streamline Moderne, curved',
    },
  },

  // TOY PATTERNS
  {
    category: 'toys',
    itemType: 'Steiff Teddy Bear',
    keyIdentifiers: [
      'Button in left ear (critical)',
      'Mohair or plush covering',
      'Jointed limbs',
      'Glass or shoe-button eyes',
      'Excelsior or cotton stuffing',
    ],
    valueFactors: [
      'Age (pre-1910 = highest value)',
      'Condition of mohair',
      'Original features intact',
      'Button and tag presence',
      'Size (larger = more valuable)',
    ],
    commonMistakes: [
      'Confusing with other German makers',
      'Not recognizing restored pieces',
      'Button variations not understood',
    ],
    redFlags: [
      'No button or wrong button',
      'Modern synthetic materials',
      'Re-covered or restored',
      'Eyes replaced',
    ],
    periodIndicators: {
      '1902-1905': 'Blank button (no text)',
      '1905-1950': 'Steiff text on button',
      '1950-present': 'Various tag systems',
    },
  },
  {
    category: 'toys',
    itemType: 'Cast Iron Toy',
    keyIdentifiers: [
      'Cast iron construction',
      'Painted surface (original critical)',
      'Maker\'s mark cast in',
      'Period styling reflects era',
      'Moving parts (wheels, etc.)',
    ],
    valueFactors: [
      'Original paint condition',
      'Maker (Hubley, Arcade premium)',
      'Rarity of model',
      'Complete vs missing parts',
      'Box (extremely rare)',
    ],
    commonMistakes: [
      'Reproductions exist (some convincing)',
      'Repaints devalue significantly',
      'Not recognizing married parts',
    ],
    redFlags: [
      'Paint too bright/fresh',
      'Wrong casting details',
      'Modern fasteners',
      'Weight seems wrong',
    ],
    periodIndicators: {
      '1880-1900': 'Simpler designs, heavier',
      '1900-1940': 'Peak production, more detail',
    },
  },

  // BOOK PATTERNS
  {
    category: 'books',
    itemType: 'First Edition Book',
    keyIdentifiers: [
      'First edition statement on copyright page',
      'First printing points',
      'Original binding',
      'Period correct dust jacket',
      'Publisher\'s information correct',
    ],
    valueFactors: [
      'Author importance',
      'Title significance',
      'Dust jacket presence/condition',
      'Signature or inscription',
      'Binding condition',
    ],
    commonMistakes: [
      'Book club editions marked as first',
      'Later printings assumed to be first',
      'Facsimile dust jackets',
    ],
    redFlags: [
      'Wrong price on dust jacket',
      'Book club indicia',
      'Later printing numbers',
      'Restored dust jacket',
    ],
    periodIndicators: {
      'First Printing': 'No additional printings noted',
      'Later Printing': 'Numbers or statements indicate reprints',
    },
  },
];

// ============================================================================
// AUTHENTICATION CRITERIA BY CATEGORY
// ============================================================================

export interface AuthenticationCriteria {
  category: string;
  checkpoints: Array<{
    name: string;
    description: string;
    passIndicators: string[];
    failIndicators: string[];
    weight: number; // 1-10, importance
  }>;
}

export const AUTHENTICATION_CRITERIA: AuthenticationCriteria[] = [
  {
    category: 'furniture',
    checkpoints: [
      {
        name: 'Construction Methods',
        description: 'Check joinery, hardware, and assembly techniques',
        passIndicators: [
          'Hand-cut dovetails (irregular spacing)',
          'Wooden pegs securing joints',
          'Rose-head or cut nails',
          'Hand-planed surfaces (slight irregularities)',
        ],
        failIndicators: [
          'Machine-cut uniform dovetails',
          'Phillips head screws',
          'Staples or modern fasteners',
          'Perfectly smooth machine surfaces',
        ],
        weight: 9,
      },
      {
        name: 'Wood and Patina',
        description: 'Examine wood type, aging, and surface condition',
        passIndicators: [
          'Appropriate wood for style and period',
          'Natural age patina on exposed surfaces',
          'Shrinkage across grain direction',
          'Oxidation on unseen surfaces',
        ],
        failIndicators: [
          'Wrong wood species for claimed origin',
          'Uniform artificial aging',
          'No shrinkage on wide boards',
          'Fresh wood smell',
        ],
        weight: 8,
      },
      {
        name: 'Hardware',
        description: 'Verify original vs replacement hardware',
        passIndicators: [
          'Period-appropriate style',
          'Evidence of hand filing',
          'Original attachment holes match hardware',
          'Natural wear patterns consistent with use',
        ],
        failIndicators: [
          'Modern reproduction hardware',
          'Extra screw holes from replacements',
          'Hardware inconsistent with furniture style',
          'No wear on high-touch areas',
        ],
        weight: 7,
      },
    ],
  },
  {
    category: 'ceramics',
    checkpoints: [
      {
        name: 'Marks and Signatures',
        description: 'Verify maker\'s marks and artist signatures',
        passIndicators: [
          'Marks consistent with documented examples',
          'Appropriate mark for claimed period',
          'Mark applied before firing',
          'Signature style matches known examples',
        ],
        failIndicators: [
          'Marks don\'t match documented variations',
          'Mark anachronistic for claimed date',
          'Mark painted over glaze (added later)',
          'Signature inconsistent with artist\'s work',
        ],
        weight: 10,
      },
      {
        name: 'Glaze and Decoration',
        description: 'Analyze glaze type and decorative techniques',
        passIndicators: [
          'Glaze appropriate for maker and period',
          'Hand-painted elements show variation',
          'Glaze pooling in crevices (natural)',
          'Colors match documented palette',
        ],
        failIndicators: [
          'Transfer print patterns (on hand-painted claim)',
          'Too perfect uniformity',
          'Colors unknown for this maker',
          'Modern fluorescent glazes',
        ],
        weight: 8,
      },
      {
        name: 'Form and Weight',
        description: 'Check shape and construction quality',
        passIndicators: [
          'Shape matches catalog examples',
          'Appropriate weight for material',
          'Evidence of hand-throwing (if claimed)',
          'Proportions correct for pattern',
        ],
        failIndicators: [
          'Shape doesn\'t match known examples',
          'Too light or heavy for type',
          'Mold seams on "hand-thrown" piece',
          'Proportions slightly off',
        ],
        weight: 7,
      },
    ],
  },
  {
    category: 'silver',
    checkpoints: [
      {
        name: 'Hallmarks',
        description: 'Read and verify all hallmarks',
        passIndicators: [
          'All four/five hallmarks present and clear',
          'Marks in correct location for type',
          'Date letter matches other period indicators',
          'Maker\'s mark documented for period',
        ],
        failIndicators: [
          'Marks in wrong position',
          'Date letter doesn\'t match style',
          'Marks from different periods on same piece',
          'Marks too crisp (fresh struck = fake)',
        ],
        weight: 10,
      },
      {
        name: 'Construction',
        description: 'Examine manufacturing technique',
        passIndicators: [
          'Hand-raising evidence (hammer marks inside)',
          'Period-appropriate soldering',
          'Consistent gauge throughout',
          'Hand-chased decoration',
        ],
        failIndicators: [
          'Spinning marks (modern technique)',
          'Lead solder (repairs)',
          'Thin spots from over-polishing',
          'Cast reproduction of hand-chased original',
        ],
        weight: 8,
      },
      {
        name: 'Weight and Feel',
        description: 'Assess silver content and quality',
        passIndicators: [
          'Substantial weight for size',
          'Warm feel (silver conducts heat)',
          'Musical ring when tapped',
          'Appropriate tarnish pattern',
        ],
        failIndicators: [
          'Too light for silver',
          'Magnetic response',
          'Dull thud when tapped',
          'Base metal visible through wear',
        ],
        weight: 7,
      },
    ],
  },
  {
    category: 'watches',
    checkpoints: [
      {
        name: 'External Authenticity',
        description: 'Verify case, dial, and hands',
        passIndicators: [
          'Serial number matches claimed year',
          'Reference number appropriate for model',
          'Dial printing quality correct',
          'Hands correct style for reference',
        ],
        failIndicators: [
          'Serial outside range for reference',
          'Dial text font incorrect',
          'Wrong hand style',
          'Case finishing inconsistent',
        ],
        weight: 9,
      },
      {
        name: 'Movement',
        description: 'Verify movement authenticity (if accessible)',
        passIndicators: [
          'Movement matches reference',
          'Serial matches case era',
          'Correct caliber for model',
          'Finishing consistent with era',
        ],
        failIndicators: [
          'Wrong movement for case',
          'Aftermarket modifications',
          'Movement serial mismatches case',
          'Poor finishing quality',
        ],
        weight: 10,
      },
      {
        name: 'Provenance',
        description: 'Documentation and history',
        passIndicators: [
          'Original box and papers',
          'Service history from authorized dealer',
          'Consistent ownership history',
          'Matching serial on all documents',
        ],
        failIndicators: [
          'No documentation',
          'Papers for different serial',
          'Unknown service history',
          'Gaps in ownership chain',
        ],
        weight: 6,
      },
    ],
  },
];

// ============================================================================
// VALUE ESTIMATION GUIDELINES
// ============================================================================

export interface ValueRange {
  category: string;
  itemType: string;
  conditions: Record<string, { min: number; max: number; notes: string }>;
}

export const VALUE_RANGES: ValueRange[] = [
  {
    category: 'furniture',
    itemType: 'Eames Lounge Chair and Ottoman',
    conditions: {
      'mint_with_provenance': { min: 8000, max: 15000, notes: 'First generation, museum quality' },
      'excellent': { min: 5000, max: 8000, notes: 'Vintage, all original, minimal wear' },
      'good': { min: 3500, max: 5000, notes: 'Vintage, some wear, minor restoration' },
      'fair': { min: 2000, max: 3500, notes: 'Significant wear, replaced parts' },
      'modern_production': { min: 5000, max: 7000, notes: 'New from Herman Miller' },
    },
  },
  {
    category: 'watches',
    itemType: 'Rolex Submariner',
    conditions: {
      'vintage_with_box_papers': { min: 15000, max: 50000, notes: 'Depends on reference, patina' },
      'vintage_watch_only': { min: 10000, max: 35000, notes: 'Desirable references command premium' },
      'modern_with_box_papers': { min: 8000, max: 15000, notes: 'Current production' },
      'modern_watch_only': { min: 7000, max: 12000, notes: 'No documentation' },
    },
  },
  {
    category: 'ceramics',
    itemType: 'Rookwood Pottery Vase',
    conditions: {
      'exceptional_artist': { min: 5000, max: 50000, notes: 'Shirayamadani, large portraits' },
      'standard_glaze_good': { min: 500, max: 3000, notes: 'Typical production, good decoration' },
      'production_piece': { min: 100, max: 500, notes: 'Mass production, simple glaze' },
      'damaged': { min: 50, max: 200, notes: 'Chips, cracks, repairs' },
    },
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getMakerByName(name: string): MakerMark | undefined {
  const normalizedName = name.toLowerCase();
  return MAKER_MARKS_DATABASE.find(m =>
    m.maker.toLowerCase().includes(normalizedName) ||
    normalizedName.includes(m.maker.toLowerCase())
  );
}

export function getIdentificationPattern(category: string, itemType: string): IdentificationPattern | undefined {
  return IDENTIFICATION_PATTERNS.find(p =>
    p.category === category &&
    itemType.toLowerCase().includes(p.itemType.toLowerCase().split(' ')[0])
  );
}

export function getAuthenticationCriteria(category: string): AuthenticationCriteria | undefined {
  return AUTHENTICATION_CRITERIA.find(c => c.category === category);
}

export function getValueRange(category: string, itemType: string): ValueRange | undefined {
  return VALUE_RANGES.find(v =>
    v.category === category &&
    itemType.toLowerCase().includes(v.itemType.toLowerCase().split(' ')[0])
  );
}

// ============================================================================
// ENHANCED DOMAIN PROMPTS
// ============================================================================

export function getEnhancedDomainPrompt(domain: string): string {
  const basePrompts: Record<string, string> = {
    furniture: `WORLD-CLASS FURNITURE EXPERTISE:

You are a master furniture appraiser with 40+ years experience at Christie's, Sotheby's, and major museums.

CRITICAL IDENTIFICATION SKILLS:

**American Furniture (highest values)**
- Federal Period (1789-1820): Shield-back chairs, inlaid work, Hepplewhite/Sheraton
- Colonial/Chippendale (1750-1790): Ball & claw feet, shell carvings, Philadelphia vs Newport
- Arts & Crafts (1880-1920): Gustav Stickley (red decal), Harvey Ellis designs
- Mid-Century Modern (1945-1970): Eames, Nelson, Bertoia, Nakashima

**MAKER IDENTIFICATION (Value Multipliers)**
- Gustav Stickley (red decal): 3-5x value of unmarked
- Herman Miller: Eames designs command premium
- George Nakashima: Hand-signed, one-of-a-kind = museum value
- Paul McCobb: Planner Group, Directional pieces
- Knoll: Saarinen, Bertoia, Mies van der Rohe designs

**AUTHENTICATION CHECKPOINTS**
1. Construction: Hand-cut vs machine dovetails
2. Hardware: Period appropriate? Original?
3. Wood: Correct species for claimed origin?
4. Finish: Original surface? Over-refinished?
5. Labels: Paper labels, stamps, brands

**RED FLAGS FOR FAKES**
- Phillips head screws in "antique"
- Uniform machine dovetails
- Wrong wood for style
- Fresh smell from artificial aging
- Labels look too crisp/clean`,

    ceramics: `WORLD-CLASS CERAMICS EXPERTISE:

You are a master ceramics appraiser specializing in American art pottery, European porcelain, and Asian ceramics.

CRITICAL IDENTIFICATION SKILLS:

**American Art Pottery (1880-1940)**
- Rookwood: Reverse RP + flames (count for year), artist ciphers
- Roseville: Patterns (Pinecone, Futura = premium), shape numbers
- Weller: Hudson line = highest value, Sicard with metallic
- Grueby: Matte green iconic, lamp bases exceptional
- Van Briggle: Despondency figure, early Colorado Springs

**EUROPEAN PORCELAIN**
- Meissen: Crossed swords (variations indicate era)
- Sèvres: Interlaced Ls, date letters
- Royal Copenhagen: Wave mark, pattern numbers
- Wedgwood: Jasperware, Portland Vase copies

**ASIAN CERAMICS**
- Imari: Japanese export, orange/blue/gold
- Chinese Export: Famille rose, Canton
- Korean Celadon: Jade-green glaze, crackle

**MARKS ARE EVERYTHING**
1. Location: Bottom center typical
2. Method: Impressed, painted, stamped
3. Color: Blue underglaze common
4. Period: Marks changed over time

**VALUE DRIVERS**
- Artist signatures (Shirayamadani = 5-10x)
- Glaze quality and rarity
- Size (larger = more valuable)
- Condition (chips devastate value)
- Form rarity`,

    silver: `WORLD-CLASS SILVER EXPERTISE:

You are a master silver appraiser with 40+ years expertise in English hallmarks, American makers, and Continental silver.

CRITICAL IDENTIFICATION - ENGLISH HALLMARK SYSTEM:

**THE FIVE HALLMARKS (Master these for dating and authentication)**

1. MAKER'S MARK: Initials in a shield
   - Each silversmith registered unique initials
   - Famous makers: Hester Bateman (HB), Paul Storr (PS), Paul de Lamerie
   - Format changed over centuries

2. STANDARD MARK (Purity):
   - LION PASSANT = Sterling (92.5% pure) - walking lion facing left
   - BRITANNIA = Higher purity (95.8%) - seated female figure
   - Different marks for Scotland, Ireland

3. ASSAY OFFICE MARK (City of testing):
   - LONDON: Leopard's head (crowned until 1821)
   - BIRMINGHAM: Anchor
   - SHEFFIELD: Crown (post-1773), Rose (pre-1773)
   - EDINBURGH: Castle
   - DUBLIN: Harp

4. DATE LETTER (Year of assay):
   - Letter style + shield shape = specific year
   - Cycles through alphabet, changing every 20-25 years
   - Different fonts each cycle (Gothic, Roman, etc.)
   - CRITICAL: Cross-reference letter style with shield shape

5. DUTY MARK (1784-1890):
   - Monarch's head = tax paid
   - George III, George IV, William IV, Victoria profiles
   - Absence after 1890 helps date

**READING HALLMARKS - STEP BY STEP:**
1. Find all marks (usually on base, handles, or lid)
2. Identify assay office (city)
3. Find date letter (determines year)
4. Check maker's mark (identifies silversmith)
5. Confirm sterling standard (lion passant)

**AMERICAN SILVER MAKERS (Identification Guide):**

TIFFANY & CO. (1837-present, New York):
- Marks: "TIFFANY & CO." "MAKERS" "STERLING SILVER"
- Pattern numbers (4-5 digits)
- Quality: Exceptional weight and craftsmanship
- Premium patterns: Chrysanthemum, Audubon, Wave Edge, Japanese
- Values: 2-5x standard silver prices

GORHAM (1831-present, Providence, RI):
- Marks: Lion-Anchor-G (trademark), "STERLING"
- Date marks: Letters indicate year of manufacture
- Martelé line (hand-hammered Art Nouveau) = extremely valuable
- Pattern names: Chantilly, Buttercup, Fairfax

GEORG JENSEN (1904-present, Copenhagen):
- Marks: "GJ" in dotted oval, "GEORG JENSEN" "DENMARK" "STERLING"
- Pattern numbers (correspond to designs)
- Blossom pattern iconic
- Danish modernist design = highly collectible

REED & BARTON (1824-present):
- Marks: "R&B" or eagle with R&B
- Francis I pattern = most famous

KIRK STIEFF (1815-present, Baltimore):
- Marks: K with 11 oz or STIEFF, shield with S
- Repousse pattern = signature design

INTERNATIONAL SILVER:
- Many acquired patterns from defunct makers
- "1847 ROGERS BROS" = silverplate, NOT sterling!

**STERLING VS SILVERPLATE (Critical distinction!):**

STERLING SILVER (92.5% pure):
- Marks: "STERLING", "925", Lion passant
- Heavy, substantial feel
- Musical ring when tapped
- Tarnishes with warm patina
- Value: Weight × silver spot + antique premium

SILVERPLATE (Base metal coated):
- Marks: "EPNS" (Electroplated Nickel Silver), "SILVERPLATE"
- "TRIPLE PLATE", "QUADRUPLE PLATE", "A1"
- "1847 ROGERS BROS", "WM ROGERS"
- Lighter weight
- May show copper/brass at wear points
- Value: Minimal (decorative only)

**FLATWARE PATTERN IDENTIFICATION:**
- Critical for set value (incomplete sets worth much less)
- Match patterns exactly for additions
- Popular patterns: Chantilly, Francis I, King Richard, Grand Baroque
- Measure pieces - patterns have specific dimensions
- Count pieces: 4-piece, 5-piece, or 6-piece place settings
- Serving pieces often most valuable

**HOLLOW WARE IDENTIFICATION:**
- Tea services: Teapot, coffee pot, sugar, creamer, waste bowl
- Matched sets more valuable than individual pieces
- Check for repairs, dents, replating
- Original finishes preferred over polished

**VALUE FACTORS:**
- Maker reputation (Tiffany, Gorham, Jensen = premium)
- Pattern rarity and demand
- Condition (no dents, repairs, monogram removal)
- Weight (heavier = more valuable)
- Complete sets vs individual pieces
- Melt value floor (troy oz × spot silver price)

**RED FLAGS - FAKES AND MISATTRIBUTIONS:**
- EPNS marked pieces sold as "sterling" (common fraud!)
- Fake hallmarks (wrong placement, poor quality strikes)
- Lead solder repairs (gray color, doesn't match)
- Buffed-out marks (trying to hide plating wear)
- "German Silver" = nickel alloy, no actual silver
- Modern reproduction marks too crisp/fresh looking
- Sheffield Plate (copper core) passed as sterling`,

    watches: `WORLD-CLASS WATCH EXPERTISE:

You are a master horologist and watch appraiser specializing in luxury Swiss timepieces.

CRITICAL IDENTIFICATION SKILLS:

**ROLEX AUTHENTICATION**
1. Cyclops: Must magnify 2.5x (fakes often 1.5x)
2. Dial: Printing quality, font consistency
3. Serial: Between lugs, matches claimed year
4. Movement: Caliber correct for reference
5. Case: Finishing, proportions, weight

**ROLEX REFERENCE IMPORTANCE**
- 5513: No-date Sub, 1962-1989
- 1680: First date Sub, 1969-1979
- 16610: Modern classic, 1988-2010
- 116610: Current production

**PATEK PHILIPPE**
- Calatrava cross logo
- Perpetual calendar, minute repeater = highest values
- Reference numbers crucial
- Provenance from authorized dealers

**OMEGA**
- Speedmaster: "Moon Watch" 1969 space heritage
- Seamaster: James Bond association
- Reference and caliber numbers

**AUTHENTICATION CHECKLIST**
□ Serial/reference match documentation
□ Dial elements consistent with reference
□ Hands correct for year
□ Case finishing appropriate
□ Movement matches case era
□ No frankenwatching (mixed parts)

**VALUE FACTORS**
- Box and papers: +20-50%
- Service history: Important
- Tropical dials (color change): Premium or discount
- Patina: Can add significant value if original`,

    jewelry: `WORLD-CLASS JEWELRY EXPERTISE:

You are a master gemologist and jewelry appraiser with GIA credentials and 40+ years museum experience.

CRITICAL PERIOD IDENTIFICATION (Master these visual cues):

**Georgian (1714-1837)**
- Closed-back settings with foil behind stones to enhance color
- Silver-topped gold construction (silver front for diamonds, gold back for strength)
- Rose-cut diamonds (flat bottom, faceted dome)
- Handmade construction - no two pieces identical
- Cannetille (fine gold wire work), repoussé
- Nature motifs: flowers, insects, feathers
- Memorial/mourning pieces with woven hair

**Victorian (1837-1901) - Three Sub-Periods:**
- Early/Romantic (1837-1860): Serpents (symbolizing eternal love), hands, hearts
- Grand (1860-1885): Heavy, bold, Etruscan revival, mourning jewelry (jet, black enamel)
- Late/Aesthetic (1885-1901): Lighter designs, half-pearl borders, star and crescent motifs
- Look for: C-catch and tube hinge (NOT modern roll-over safety catch)

**Edwardian/Belle Époque (1901-1915)**
- PLATINUM filigree (first widespread platinum use)
- Diamonds + pearls + platinum = signature combination
- Garland style: bows, swags, wreaths, laurel leaves
- Delicate, lacy openwork - "frozen lace"
- Millegrain edges (tiny beaded borders)
- Old European cut diamonds

**Art Nouveau (1890-1910)**
- Organic, flowing, asymmetrical forms
- Enamel work (plique-à-jour = stained glass effect)
- Nature motifs: dragonflies, orchids, flowing hair, mythical women
- René Lalique, Georges Fouquet = master jewelers
- Less emphasis on stones, more on artistic design

**ART DECO (1920-1935) - CRITICAL RECOGNITION:**
GEOMETRIC DESIGN ELEMENTS (Must identify!):
- Stepped/tiered designs (ziggurat shapes)
- Chevron patterns (V-shapes)
- Fan/sunburst motifs
- Greek key patterns
- Bold contrasting colors

METAL & CONSTRUCTION:
- PLATINUM is standard (white, heavy, takes fine detail)
- White gold may substitute but is lighter
- Milgrain edging (tiny beaded metal borders)
- Filigree openwork (delicate pierced metalwork)
- Hand-engraved details

STONE SETTINGS:
- Calibré-cut colored stones (emeralds, rubies, sapphires cut to fit)
- Baguette-cut diamonds (rectangular step-cut)
- French-cut diamonds (square step-cut)
- Old European cut center stones (1900-1930 cutting style)
- Bezel and channel settings

IDENTIFYING TRUE ART DECO VS MODERN REPRODUCTIONS:
- Real: Old European cut diamonds (rounded facets, smaller table, higher crown)
- Fake: Modern round brilliant (57-58 sharp facets, larger table) in "Art Deco" setting
- Real: Hand-engraved milgrain (slightly irregular)
- Fake: Machine-perfect milgrain (too uniform)
- Real: Platinum shows wear, develops patina
- Fake: Rhodium-plated white gold looks too shiny/new

**Retro/Cocktail (1935-1950)**
- Bold rose gold (pink/yellow tones)
- Large, architectural designs
- Mechanical elements (tank tracks, scrolls)
- Semi-precious stones (citrine, aquamarine, amethyst)
- Machine Age influence

**CAMEO IDENTIFICATION (Critical for accuracy):**

PENDANT vs BROOCH - Check for:
- PENDANT: Has bail (loop) at top for chain, hangs vertically
- BROOCH: Has pin mechanism on back, worn horizontally
- BOTH: Some pieces convert (check for dual mechanisms)

CAMEO MATERIALS:
- Shell (most common): Layered colors from shell, warm tones, lightweight
- Hardstone (more valuable): Agate, sardonyx - heavier, cooler colors, sharper detail
- Coral: Pink to deep red, organic origin
- Lava: Gray/black, from Mt. Vesuvius area, matte finish
- Glass/Ceramic: Too uniform, no natural variations

SHELL CAMEO AUTHENTICATION:
- Look for: Natural color gradations in shell layers
- Test: Slight translucency when backlit
- Quality: Delicacy of carving, undercutting, facial features

**DIAMOND CUT IDENTIFICATION BY ERA:**

OLD MINE CUT (Pre-1900):
- Cushion-shaped (squarish with rounded corners)
- Small table (top flat facet)
- High crown (top portion above girdle)
- Large culet (visible facet at bottom point)
- 58 facets but very different proportions from modern
- Cut by eye, not machine - each stone unique

OLD EUROPEAN CUT (1900-1930):
- Round shape (rounder than old mine)
- Still small table, high crown
- Visible culet (not pointed like modern)
- Distinctive "chunky" facet pattern
- Romantic, soft sparkle vs modern fire

TRANSITIONAL CUT (1930-1950):
- Between old European and modern
- Smaller culet, larger table
- Lower crown than old European

MODERN ROUND BRILLIANT (Post-1950):
- 57-58 precisely calculated facets
- Large table, low crown
- Pointed or no culet
- Machine precision
- Maximum fire and brilliance

**TIFFANY & CO. AUTHENTICATION:**
- The "Tiffany Setting" (1886): Six-prong platinum mount lifting stone above band
- Marks: "TIFFANY & CO." "750" (18K) or "PT950" (platinum)
- Quality: Exceptional stone grading, precise craftsmanship
- Modern pieces have laser-inscribed serial numbers
- Boxes: Robin's egg blue, white ribbon (but boxes can be faked!)

**SIGNED PIECES (Major Premium Values):**
- Cartier: French, English, NY marks differ; numbered pieces
- Van Cleef & Arpels: VCA mark, mystery settings
- Tiffany & Co.: Script or block letters, "T&CO"
- Bulgari: "BVLGARI" engraved (Roman V for U)
- Harry Winston: HW mark, exceptional stones
- David Webb: Enamel work, animal motifs

**RED FLAGS FOR FAKES/REPRODUCTIONS:**
- Modern round brilliant cuts in "antique" Art Deco settings
- Machine-perfect milgrain (should show slight hand irregularity)
- Wrong metal for period (platinum rare before 1900)
- Modern findings: spring-ring clasps, modern safety catches
- Laser inscriptions on stones claiming pre-1990 origin
- Glue visible (period pieces are prong or bezel set)
- Too perfect, too uniform - antiques show handwork variation`,

    art: `WORLD-CLASS ART EXPERTISE:

You are a master art appraiser specializing in paintings, prints, and works on paper.

CRITICAL IDENTIFICATION SKILLS:

**ORIGINAL VS REPRODUCTION**
1. Examine print method (lithograph vs photo-mechanical)
2. Check paper age and watermarks
3. Look for plate marks on etchings
4. Verify signature authenticity

**PAINTINGS AUTHENTICATION**
- Canvas: Age, weave, stretcher type
- Paint: Craquelure patterns (age vs artificial)
- Signature: Location, style, consistency
- Provenance: Exhibition labels, collector stamps

**PRINTS VALUATION**
- Edition: Lower numbers = higher value
- State: Earlier states more valuable
- Condition: Foxing, toning, tears
- Signature: Pencil signed > stamped

**FAMOUS PRINTMAKERS**
- Currier & Ives: Stone lithographs, hand-colored
- Audubon: Birds of America, elephant folio
- Hiroshige: Ukiyo-e woodblocks
- Remington: Western bronzes and prints

**CURRIER & IVES SPECIFICS**
- N. Currier (1834-1857)
- Currier & Ives (1857-1907)
- Folio sizes: Small, Medium, Large (most valuable)
- Subjects: Winter scenes, hunting, racing = premium

**VALUE FACTORS**
- Subject matter (genre scenes vs landscapes)
- Condition (crucial for works on paper)
- Provenance (museum, notable collection)
- Size (generally larger = more valuable)
- Frame (original period frame adds value)`,

    toys: `WORLD-CLASS TOY EXPERTISE:

You are a master toy and doll appraiser specializing in antique and vintage toys.

CRITICAL IDENTIFICATION SKILLS:

**CAST IRON TOYS (1880-1940)**
- Makers: Hubley, Arcade, Kenton, Kilgore
- Original paint: Crucial for value (repaint = -50-80%)
- Mechanical banks: Condition, operation
- Authentication: Casting quality, weight, marks

**TIN TOYS**
- Lithography quality
- German (Lehmann, Bing) vs American (Marx, Chein)
- Working mechanisms add value
- Box: Original box can double value

**DOLLS**
- Bisque heads: Jumeau, Bru, Simon & Halbig marks
- Check head for mold numbers
- Original clothing vs replacements
- Composition, cloth, celluloid bodies

**TEDDY BEARS**
- Steiff: BUTTON IN EAR is key
- Button colors/tags indicate era
- Mohair vs synthetic fur
- Condition of eyes, stitching, stuffing

**TRAINS**
- Lionel: Pre-war O gauge = highest values
- American Flyer, Ives
- Standard gauge vs O gauge
- Original boxes essential

**RED FLAGS**
- Too bright paint ("fresh" look)
- Modern fasteners
- Wrong weight for material
- Missing parts or obvious repairs
- Reproduction marks`,

    glass: `WORLD-CLASS GLASS EXPERTISE:

You are a master glass appraiser specializing in art glass, studio glass, and antique glassware.

CRITICAL IDENTIFICATION SKILLS:

**TIFFANY FAVRILE GLASS (1893-1933)**
- L.C.T. signature on pontil
- Iridescent surface (gold, blue, green)
- Organic flowing forms
- Pulled feather, peacock feather designs
- Jack-in-the-pulpit vases = premium

**LALIQUE GLASS**
- R. LALIQUE FRANCE (pre-1945) = more valuable
- LALIQUE FRANCE (post-1945)
- Frosted and opalescent finishes
- Molded relief decoration
- Car mascots, vases, figurines

**STEUBEN GLASS**
- Aurene glass (gold and blue iridescent)
- Frederick Carder era (1903-1932) = highest value
- Fleur-de-lis mark
- Later clear crystal pieces

**DEPRESSION GLASS (1929-1939)**
- Machine pressed, inexpensive
- Green, pink, amber, clear
- Many patterns (Cameo, American Sweetheart)
- Uranium glass glows under UV

**MURANO/VENETIAN**
- Hand-blown techniques
- Millefiori, sommerso, latticino
- Venini, Seguso, Barovier marks
- Modern fakes common

**AUTHENTICATION POINTS**
1. Pontil marks (hand-blown vs machine)
2. Signature placement and style
3. Glass quality and color
4. Weight appropriate for type
5. UV light test for some types`,

    lighting: `WORLD-CLASS LIGHTING EXPERTISE:

You are a master lighting appraiser specializing in antique and vintage lamps with 40+ years museum experience.

CRITICAL IDENTIFICATION - TIFFANY STUDIOS LAMPS (1895-1933):

**TIFFANY SHADE AUTHENTICATION (Values: $50,000 - $3,000,000+)**

SHADE PATTERNS (Learn to identify by sight):
- DRAGONFLY: Dragonfly bodies with jeweled eyes, wing patterns, irregular lower border
- WISTERIA: Cascading purple/blue wisteria blooms, organic irregular border, tree-trunk base
- PEONY: Large pink/red peony flowers, green foliage, dome shape
- DAFFODIL: Yellow daffodils with green stems and leaves
- POPPY: Red/orange poppies, often with blue background
- POND LILY: Water lily motifs, often blues and greens
- DOGWOOD: Delicate white/pink dogwood flowers
- LABURNUM: Yellow cascading flowers (extremely valuable)
- GEOMETRIC: Simpler patterns - less valuable but still authentic Tiffany
- NAUTILUS: Shell-shaped with spiral pattern

TIFFANY SHADE CONSTRUCTION:
- Copper foil technique (NOT lead came like church windows)
- Each glass piece wrapped in thin copper foil, soldered together
- Glass selection: Confetti glass, rippled glass, striated glass, opalescent
- Favrile glass cabochons (jewel-like bumps) in premium shades
- Irregular, organic lower borders (drip edge) on floral patterns
- Each shade unique - no two exactly alike

TIFFANY BASE AUTHENTICATION:
- STAMP: "TIFFANY STUDIOS NEW YORK" with pattern number
- Bronze with original patina (green/brown, NOT polished bright)
- Tree trunk bases for Wisteria, Laburnum
- Lily pad bases for Pond Lily designs
- Geometric bases for geometric shades
- Weight: Heavy, solid bronze (reproductions often lighter)
- Base and shade should be ORIGINAL PAIR (married pairs less valuable)

TIFFANY RED FLAGS:
- Lead came instead of copper foil = NOT Tiffany
- No stamp on base = suspicious
- Glass too uniform in color = likely reproduction
- Base too light = reproduction
- Bright polished bronze (should have aged patina)
- Married base and shade (check pattern numbers match)

COMPETITORS & SIMILAR MAKERS:
- HANDEL: Reverse-painted glass shades (not leaded), "HANDEL" mark
- PAIRPOINT: "Puffy" 3D molded shades, blown-out designs
- JEFFERSON: Reverse-painted, generally less valuable
- MILLER: Similar to Handel quality
- DUFFNER & KIMBERLY: Leaded glass, can approach Tiffany quality
- QUEZAL: Art glass (not leaded shades), often confused with Tiffany Favrile

**ART DECO LAMPS (1920-1940) - CRITICAL RECOGNITION:**

DESIGN ELEMENTS (Must identify!):
- GEOMETRIC forms: Stepped/tiered shapes, ziggurats, chevrons, circles
- STREAMLINED: Aerodynamic curves, speed lines, machine aesthetic
- FIGURAL: Stylized human/animal forms, often female nudes
- Symmetrical, balanced designs (unlike organic Art Nouveau)

MATERIALS:
- CHROME: Bright, mirror-like finish - signature Art Deco metal
- NICKEL: Slightly warmer than chrome
- BRONZE: Often with geometric patinas
- BAKELITE: Early plastic, brown/amber/green colors
- ALUMINUM: Polished or brushed finishes

GLASS TYPES:
- FROSTED GLASS: Acid-etched for soft diffused light
- MILK GLASS: Opaque white glass
- OPALINE: Translucent white/pale blue glass
- GLASS WITH GEOMETRIC PATTERNS: Molded or cut designs
- CRACKLE GLASS: Intentionally crazed surface

NOTABLE ART DECO LAMP MAKERS:
- FRANKART (1920s-1930s): Figural lamps with nude female figures
  - Marks: "FRANKART INC" or "FRANKART PAT APPL'D"
  - Bronze-finished metal, often green patina
  - Female figures holding globes, geometric shapes

- CHASE CHROME: Sleek machine-age designs
- WALTER VON NESSEN: Modernist chrome/aluminum designs
- FARIES MFG: Industrial-style articulating lamps
- LIGHTOLIER: Quality commercial/residential fixtures
- MARKEL: Art Deco torchieres and table lamps

ART DECO LAMP FORMS:
- TORCHIERES: Tall floor lamps with upward-facing bowls
- BOUDOIR LAMPS: Small table lamps, often figural
- DESK LAMPS: Articulating, industrial designs
- SKYSCRAPER STYLE: Stepped, architectural forms
- AIRPLANE/ROCKET: Streamlined moderne

**ART NOUVEAU LAMPS (1890-1910)**
- Organic, flowing, asymmetrical forms
- Nature motifs: flowers, vines, insects, women with flowing hair
- Bronze, pewter, patinated metals
- Figural bases featuring women in flowing robes
- Slag glass, bent glass shades (not leaded like Tiffany)
- Makers: Émile Gallé, Daum Nancy, Austrian bronze makers

**OIL LAMPS (Pre-1900)**
- Whale oil (Pre-1860): Small, simple fonts, two-tube burners
- Kerosene/paraffin (1850s-1920s): Larger fonts, Argand-style burners
- GWTW (Gone With The Wind): Large globular fonts and shades
- Banquet lamps: Tall, ornate, often brass or bronze
- Student lamps: Double-arm for desk use

AUTHENTICATION CHECKPOINTS:
□ Base stamp, maker's mark, pattern numbers
□ Lead line quality and consistency (Tiffany)
□ Glass age and authenticity (patina, wear)
□ Original vs replaced shade
□ Married bases/shades (should match in period and style)
□ Period wiring: Cloth-covered wire = pre-1960s
□ Socket types: Porcelain with turn-key = early; push-through = later
□ Hardware period-appropriate

RED FLAGS - REPRODUCTIONS:
- Too perfect, too uniform
- Base stamps that look freshly cast
- Modern wiring throughout (no evidence of rewiring)
- Plastic parts in "antique" lamp
- Wrong style socket for claimed period
- Lead came on supposed "Tiffany" (should be copper foil)
- Glass too uniform (period glass has character, variation)`,

    textiles: `WORLD-CLASS TEXTILE EXPERTISE:

You are a master textile appraiser specializing in rugs, quilts, and antique fabrics.

CRITICAL IDENTIFICATION SKILLS:

**NAVAJO TEXTILES**
- Chief blankets: First, Second, Third Phase
- Regional styles: Ganado red, Two Grey Hills, Crystal
- Hand-spun vs commercial yarn
- Natural vs aniline dyes
- Values: $1,000 - $500,000+

**PERSIAN/ORIENTAL RUGS**
- Cities: Tabriz, Isfahan, Kashan, Kerman
- Tribal: Bakhtiari, Qashqai, Turkoman
- Knot types: Persian (Senneh) vs Turkish (Ghiordes)
- Knot density indicates quality
- Silk highlights or all-silk = premium

**AMERICAN QUILTS**
- Baltimore Album quilts = highest values
- Amish quilts: Bold colors, simple patterns
- Crazy quilts: Victorian, decorative stitching
- Signature/album quilts: Historical value

**AUTHENTICATION CHECKPOINTS**
1. Hand-knotted vs machine-made (rug back)
2. Natural vs synthetic dyes (look for bleeding)
3. Age-appropriate wear patterns
4. Fiber content and construction
5. Regional characteristics

**VALUE FACTORS**
- Condition (holes, repairs, stains)
- Age and documentation
- Size (larger generally more valuable)
- Pattern rarity
- Provenance`,

    books: `WORLD-CLASS RARE BOOK EXPERTISE:

You are a master rare book appraiser and bibliographer.

CRITICAL IDENTIFICATION SKILLS:

**FIRST EDITION IDENTIFICATION**
- Publisher's first edition statement
- First printing points (errors, states)
- Copyright page analysis
- Correct price on dust jacket
- Binding variants

**HIGH-VALUE BOOKS**
- American literature first editions
- Science fiction/fantasy firsts
- Children's books (illustrated)
- Signed/inscribed copies
- Association copies

**DUST JACKET IMPORTANCE**
- Original DJ can be 90% of value
- Condition grading critical
- Reproductions exist
- Price clipping devalues

**AUTHENTICATION POINTS**
□ Binding: Original, rebacked, or restored?
□ Paper: Period appropriate?
□ Printing: First state or later?
□ Provenance: Bookplates, inscriptions
□ Condition: Foxing, toning, tears

**CONDITION GRADES**
- Fine: Near perfect
- Very Good: Light wear
- Good: Average used copy
- Fair: Heavy wear
- Poor: Serious damage

**EPHEMERA & RECORDS**
- Vinyl records: Butcher covers, first pressings
- Posters: Concert, movie, political
- Sports memorabilia: Authenticity critical
- Photographs: Vintage prints vs later`,
  };

  return basePrompts[domain] || basePrompts.furniture;
}

// ============================================================================
// FAMOUS MUSEUM PIECES RECOGNITION
// ============================================================================

export interface FamousItem {
  id: string;
  name: string;
  alternateNames: string[];
  museum: string;
  visualCues: string[];
  inscriptions: string[];
  valueNote: string;
}

export const FAMOUS_MUSEUM_PIECES: FamousItem[] = [
  {
    id: 'paul-revere-bowl',
    name: 'Paul Revere Sons of Liberty Bowl',
    alternateNames: ['Liberty Bowl', 'Sons of Liberty Bowl'],
    museum: 'Museum of Fine Arts, Boston',
    visualCues: [
      'Silver punch bowl in museum case',
      'Portrait of Paul Revere behind it',
      'Engraved text around body',
      'Simple elegant form'
    ],
    inscriptions: ['Sons of Liberty', '1768', 'To the Memory of the glorious NINETY-TWO'],
    valueNote: 'Priceless - one of the most important pieces of American silver'
  },
  {
    id: 'tiffany-wisteria',
    name: 'Tiffany Wisteria Lamp',
    alternateNames: ['Wisteria Table Lamp', 'Purple Wisteria'],
    museum: 'Various museums and private collections',
    visualCues: [
      'Cascading purple/blue wisteria blooms',
      'Irregular drip border',
      'Tree trunk bronze base',
      'Leaded glass construction'
    ],
    inscriptions: ['TIFFANY STUDIOS NEW YORK'],
    valueNote: '$500,000 - $3,000,000+ at auction'
  },
  {
    id: 'tiffany-dragonfly',
    name: 'Tiffany Dragonfly Lamp',
    alternateNames: ['Dragonfly Table Lamp'],
    museum: 'Metropolitan Museum of Art, various collections',
    visualCues: [
      'Dragonfly bodies with jeweled eyes',
      'Wing patterns in shade',
      'Blue/green iridescent tones',
      'Irregular lower border'
    ],
    inscriptions: ['TIFFANY STUDIOS NEW YORK'],
    valueNote: '$100,000 - $2,000,000+ at auction'
  }
];

/**
 * Check if an item might be a famous museum piece
 */
export function checkForFamousItem(description: string, visibleText: string[]): FamousItem | null {
  const combinedText = [description, ...visibleText].join(' ').toLowerCase();

  for (const item of FAMOUS_MUSEUM_PIECES) {
    // Check for inscriptions
    const hasInscription = item.inscriptions.some(i => combinedText.includes(i.toLowerCase()));

    // Check for visual cues
    const matchingCues = item.visualCues.filter(c => combinedText.includes(c.toLowerCase()));

    if (hasInscription || matchingCues.length >= 2) {
      return item;
    }
  }

  return null;
}
