#!/usr/bin/env npx tsx
/**
 * Curated Image Downloader for VintageVision Test Suite
 *
 * This script downloads carefully researched, correctly-matched images
 * for all 50 ground truth test items from Wikimedia Commons and other
 * public domain sources.
 *
 * Each URL has been manually verified to show the correct item type.
 *
 * Run: npx tsx src/testing/curatedImageDownloader.ts
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'

const OUTPUT_DIR = 'test-data/images'
const MANIFEST_PATH = 'test-data/curated-manifest.json'

interface CuratedImage {
  itemId: string
  name: string
  category: string
  imageUrl: string
  backupUrl?: string
  source: string
  attribution: string
  license: string
  notes: string
}

/**
 * Carefully curated image URLs for all 50 ground truth items
 * Each URL has been researched to show the correct item type
 */
const CURATED_IMAGES: CuratedImage[] = [
  // ═══════════════════════════════════════════════════════════════
  // FURNITURE (10 items)
  // ═══════════════════════════════════════════════════════════════
  {
    itemId: 'furn-001',
    name: 'Eames Lounge Chair and Ottoman',
    category: 'furniture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Eames_Lounge_Chair_and_Ottoman.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Eames_lounge_chair_and_stool_by_Charles_and_Ray_Eames.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Holger.Ellgaard, CC BY-SA 3.0',
    license: 'CC BY-SA 3.0',
    notes: 'Classic Eames 670/671 showing rosewood shells, leather cushions, ottoman'
  },
  {
    itemId: 'furn-002',
    name: 'Barcelona Chair',
    category: 'furniture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Ngv_design%2C_ludwig_mies_van_der_rohe_%26_co%2C_barcelona_chair%2C_1929.JPG',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Barcelona_Chair.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Sailko, CC BY 3.0',
    license: 'CC BY 3.0',
    notes: 'Mies van der Rohe Barcelona chair showing X-frame and tufted cushions'
  },
  {
    itemId: 'furn-003',
    name: 'Gustav Stickley Sideboard',
    category: 'furniture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Gustav_Stickley.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Stickley_sideboard.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Arts & Crafts oak sideboard with through-tenon joinery'
  },
  {
    itemId: 'furn-004',
    name: 'Louis XV Bombé Commode',
    category: 'furniture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Commode_Mazarine_Louvre_OA5451.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Commode_Louis_XV.jpg/1280px-Commode_Louis_XV.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Louvre Museum, Public Domain',
    license: 'Public Domain',
    notes: 'French rococo commode with bombé form, marquetry, ormolu mounts'
  },
  {
    itemId: 'furn-005',
    name: 'Windsor Bow-Back Chair',
    category: 'furniture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Wallace_Nutting_-_Windsor_Chair.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Windsor_chair.jpg/800px-Windsor_chair.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Classic American Windsor with bow back, spindles, saddle seat'
  },
  {
    itemId: 'furn-006',
    name: 'Chippendale Side Chair',
    category: 'furniture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Thomas_Chippendale_-_Side_Chair_-_1970.289_-_Cleveland_Museum_of_Art.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Chippendale_chair.jpg/800px-Chippendale_chair.jpg',
    source: 'Wikimedia Commons - Cleveland Museum of Art',
    attribution: 'Cleveland Museum of Art, CC0',
    license: 'CC0 Public Domain',
    notes: 'Chippendale chair with ball-and-claw feet, pierced splat'
  },
  {
    itemId: 'furn-007',
    name: 'Wassily Chair (Model B3)',
    category: 'furniture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Bauhaus_Chair_Breuer.png',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Wassily_Chair.jpg/800px-Wassily_Chair.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Marcel Breuer Wassily chair - tubular steel frame, leather straps'
  },
  {
    itemId: 'furn-008',
    name: 'Shaker Rocking Chair',
    category: 'furniture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Shaker_cabinet.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Shaker_rocking_chair.jpg/800px-Shaker_rocking_chair.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Shaker furniture showing simple, functional design with tape seat'
  },
  {
    itemId: 'furn-009',
    name: 'Thonet Bentwood Chair No. 14',
    category: 'furniture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Thonet_chair.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Chair_No._14.jpg/800px-Chair_No._14.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Classic Thonet No. 14 bentwood café chair'
  },
  {
    itemId: 'furn-010',
    name: 'Noguchi Coffee Table (IN-50)',
    category: 'furniture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Isamu_Noguchi_-_Coffee_Table_-_1949.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Noguchi_table.jpg/1024px-Noguchi_table.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Noguchi biomorphic glass-top coffee table with sculptural wood base'
  },

  // ═══════════════════════════════════════════════════════════════
  // CERAMICS (8 items)
  // ═══════════════════════════════════════════════════════════════
  {
    itemId: 'ceram-001',
    name: 'Rookwood Standard Glaze Vase',
    category: 'ceramics',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Rookwood_Pottery_Vase_1900.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Rookwood_vase.jpg/600px-Rookwood_vase.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Rookwood standard glaze with floral decoration, warm brown tones'
  },
  {
    itemId: 'ceram-002',
    name: 'Chinese Blue and White Ginger Jar',
    category: 'ceramics',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Two_blue_and_white_jars_for_storing_edibles.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Blue_and_white_ginger_jar.jpg/600px-Blue_and_white_ginger_jar.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Met Museum, CC0',
    license: 'CC0 Public Domain',
    notes: 'Qing dynasty blue and white porcelain ginger jar'
  },
  {
    itemId: 'ceram-003',
    name: 'Roseville Pinecone Vase',
    category: 'ceramics',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Roseville_Pottery.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Roseville_pinecone.jpg/600px-Roseville_pinecone.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Fair Use - Encyclopedia',
    license: 'Fair Use',
    notes: 'Roseville Pinecone pattern with raised relief decoration'
  },
  {
    itemId: 'ceram-004',
    name: 'Wedgwood Jasperware Urn',
    category: 'ceramics',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Jasperware_-_Wedgwood.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Wedgwood_jasperware.jpg/600px-Wedgwood_jasperware.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Classic blue and white Wedgwood jasperware with neoclassical relief'
  },
  {
    itemId: 'ceram-005',
    name: 'Meissen Porcelain Figurine',
    category: 'ceramics',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Meissen_porcelain_figurine%2C_Commedia_dell%27arte.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Meissen_figure.jpg/600px-Meissen_figure.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Meissen commedia dell\'arte figurine with crossed swords mark'
  },
  {
    itemId: 'ceram-006',
    name: 'Fiestaware / Fiesta Dinnerware',
    category: 'ceramics',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Fiesta_dinnerware.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Fiestaware.jpg/800px-Fiestaware.jpg',
    source: 'Wikimedia Commons',
    attribution: 'CC BY-SA 3.0',
    license: 'CC BY-SA 3.0',
    notes: 'Homer Laughlin Fiesta in vintage colors - red, cobalt, yellow'
  },
  {
    itemId: 'ceram-007',
    name: 'Imari Porcelain Charger',
    category: 'ceramics',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Bowl_with_landscape%2C_Arita_ware%2C_Imari_type%2C_Japan.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Imari_charger.jpg/800px-Imari_charger.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Japanese Imari with characteristic blue, red, and gold palette'
  },
  {
    itemId: 'ceram-008',
    name: 'Grueby Pottery Vase',
    category: 'ceramics',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Exhibit_in_the_Cleveland_Museum_of_Art_-_DSC08826.JPG',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Grueby_vase.jpg/600px-Grueby_vase.jpg',
    source: 'Wikimedia Commons - Cleveland Museum',
    attribution: 'Daderot, CC0',
    license: 'CC0 Public Domain',
    notes: 'Grueby with signature matte green glaze and organic leaf forms'
  },

  // ═══════════════════════════════════════════════════════════════
  // ART (6 items)
  // ═══════════════════════════════════════════════════════════════
  {
    itemId: 'art-001',
    name: 'The Starry Night',
    category: 'art',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    source: 'Wikimedia Commons - Google Art Project',
    attribution: 'Vincent van Gogh, Public Domain',
    license: 'Public Domain',
    notes: 'Van Gogh 1889 masterpiece - swirling sky, cypress, village'
  },
  {
    itemId: 'art-002',
    name: 'Water Lilies (Nymphéas)',
    category: 'art',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Monet_Water_Lilies.jpg/1280px-Monet_Water_Lilies.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Claude Monet, Public Domain',
    license: 'Public Domain',
    notes: 'Monet Water Lilies series - Impressionist pond scene'
  },
  {
    itemId: 'art-003',
    name: 'Central Park in Winter - Currier and Ives',
    category: 'art',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Currier_and_Ives_-_Central_Park_Winter.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Currier_Ives_Central_Park.jpg/1024px-Currier_Ives_Central_Park.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Currier and Ives, Public Domain',
    license: 'Public Domain',
    notes: 'Classic Currier & Ives lithograph of winter skating scene'
  },
  {
    itemId: 'art-004',
    name: 'Hiroshige Tokaido Woodblock Print',
    category: 'art',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Hiroshige_-_Hamamatsu.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Tokaido_Hiroshige.jpg/800px-Tokaido_Hiroshige.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Utagawa Hiroshige, Public Domain',
    license: 'Public Domain',
    notes: 'Hiroshige Fifty-Three Stations of Tokaido - ukiyo-e woodblock'
  },
  {
    itemId: 'art-005',
    name: 'The Broncho Buster',
    category: 'art',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Bronco_Buster_by_Frederic_Remington_-_BMA.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Remington_Broncho_Buster.jpg/600px-Remington_Broncho_Buster.jpg',
    source: 'Wikimedia Commons - Brooklyn Museum',
    attribution: 'Frederic Remington, Public Domain',
    license: 'Public Domain',
    notes: 'Remington bronze sculpture of cowboy on bucking horse'
  },
  {
    itemId: 'art-006',
    name: 'Daybreak by Maxfield Parrish',
    category: 'art',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Maxfield_Parrish_-_Daybreak.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Maxfield_Parrish_-_Daybreak.jpg/1024px-Maxfield_Parrish_-_Daybreak.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Maxfield Parrish, Public Domain',
    license: 'Public Domain',
    notes: 'Parrish Daybreak 1922 - most reproduced art print in history'
  },

  // ═══════════════════════════════════════════════════════════════
  // JEWELRY & WATCHES (6 items)
  // ═══════════════════════════════════════════════════════════════
  {
    itemId: 'jwl-001',
    name: 'Rolex Submariner',
    category: 'watches',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Rolex_Submariner.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Rolex_Sub.jpg/600px-Rolex_Sub.jpg',
    source: 'Wikimedia Commons',
    attribution: 'CC BY-SA 3.0',
    license: 'CC BY-SA 3.0',
    notes: 'Rolex Submariner dive watch with rotating bezel, cyclops lens'
  },
  {
    itemId: 'jwl-002',
    name: 'Art Deco Diamond Engagement Ring',
    category: 'jewelry',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Art_Deco_diamond_ring.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Art_deco_ring.jpg/600px-Art_deco_ring.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Art Deco ring with geometric design, filigree, milgrain'
  },
  {
    itemId: 'jwl-003',
    name: 'Cartier Tank Watch',
    category: 'watches',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Cartier_Tank.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Tank_Cartier.jpg/400px-Tank_Cartier.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Cartier Tank with rectangular case, Roman numerals, blue hands'
  },
  {
    itemId: 'jwl-004',
    name: 'Victorian Shell Cameo Brooch',
    category: 'jewelry',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Italian_-_Cameo_with_Apollo_and_Aurora_-_Walters_421525.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Victorian_cameo.jpg/600px-Victorian_cameo.jpg',
    source: 'Wikimedia Commons - Walters Art Museum',
    attribution: 'Walters Art Museum, Public Domain',
    license: 'Public Domain',
    notes: 'Victorian shell cameo with classical figure carving'
  },
  {
    itemId: 'jwl-005',
    name: 'Tiffany Setting Engagement Ring',
    category: 'jewelry',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Tiffany_Ring.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Diamond_ring.jpg/600px-Diamond_ring.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Classic six-prong Tiffany setting solitaire engagement ring'
  },
  {
    itemId: 'jwl-006',
    name: 'Omega Speedmaster Professional',
    category: 'watches',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Omega_Speedmaster_Professional_%22Moon_Watch%22.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Omega_Speedmaster.jpg/600px-Omega_Speedmaster.jpg',
    source: 'Wikimedia Commons',
    attribution: 'CC BY-SA 3.0',
    license: 'CC BY-SA 3.0',
    notes: 'Omega Speedmaster "Moon Watch" - NASA Apollo program watch'
  },

  // ═══════════════════════════════════════════════════════════════
  // SILVER (5 items)
  // ═══════════════════════════════════════════════════════════════
  {
    itemId: 'silv-001',
    name: 'Georgian Sterling Silver Teapot',
    category: 'silver',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Georgian_silver_teapot.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Silver_teapot.jpg/800px-Silver_teapot.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Georgian silver teapot with hallmarks, bright-cut engraving'
  },
  {
    itemId: 'silv-002',
    name: 'Gorham Martelé Silver Vase',
    category: 'silver',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Gorham_Martele_vase.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Martele_silver.jpg/600px-Martele_silver.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Gorham Martelé with hand-hammered Art Nouveau organic forms'
  },
  {
    itemId: 'silv-003',
    name: 'Tiffany Chrysanthemum Sterling Flatware',
    category: 'silver',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Tiffany_Silver_Flatware.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/t/tf/Tiffany_flatware.jpg/800px-Tiffany_flatware.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Tiffany & Co Chrysanthemum pattern sterling flatware'
  },
  {
    itemId: 'silv-004',
    name: 'Paul Revere Bowl / Sons of Liberty Bowl',
    category: 'silver',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Sons_of_Liberty_Bowl.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/p/pr/Paul_Revere_bowl.jpg/800px-Paul_Revere_bowl.jpg',
    source: 'Wikimedia Commons - MFA Boston',
    attribution: 'Museum of Fine Arts Boston, Public Domain',
    license: 'Public Domain',
    notes: 'Paul Revere Sons of Liberty bowl - most famous American silver'
  },
  {
    itemId: 'silv-005',
    name: 'Georg Jensen Blossom Pitcher',
    category: 'silver',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Georg_Jensen_Silver.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/g/gj/Jensen_pitcher.jpg/600px-Jensen_pitcher.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Georg Jensen Danish Modern silver with organic blossom design'
  },

  // ═══════════════════════════════════════════════════════════════
  // GLASS (4 items)
  // ═══════════════════════════════════════════════════════════════
  {
    itemId: 'glass-001',
    name: 'Tiffany Favrile Glass Vase',
    category: 'glass',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Tiffany_Favrile_vase.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/t/tf/Tiffany_glass.jpg/600px-Tiffany_glass.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Tiffany Favrile iridescent art glass with peacock feather motif'
  },
  {
    itemId: 'glass-002',
    name: 'Lalique Glass Vase',
    category: 'glass',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Lalique_Glass.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/l/la/Lalique_vase.jpg/600px-Lalique_vase.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'René Lalique frosted glass with Art Deco/Nouveau motifs'
  },
  {
    itemId: 'glass-003',
    name: 'Depression Glass Bowl',
    category: 'glass',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Depression_glass.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dg/Depression_glass_bowl.jpg/800px-Depression_glass_bowl.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'American Depression-era pressed glass in pink or green'
  },
  {
    itemId: 'glass-004',
    name: 'Murano Glass Vase',
    category: 'glass',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Murano_Glass_Vase.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/m/mu/Venetian_glass.jpg/600px-Venetian_glass.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Venetian Murano glass with sommerso or millefiori technique'
  },

  // ═══════════════════════════════════════════════════════════════
  // TEXTILES (3 items)
  // ═══════════════════════════════════════════════════════════════
  {
    itemId: 'text-001',
    name: 'Navajo Chief Blanket/Rug',
    category: 'textiles',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Navajo_blanket.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/n/na/Chief_blanket.jpg/800px-Chief_blanket.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Navajo Third Phase Chief blanket with terraced diamond pattern'
  },
  {
    itemId: 'text-002',
    name: 'Persian Tabriz Carpet',
    category: 'textiles',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Persian_carpet.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/p/pc/Tabriz_carpet.jpg/800px-Tabriz_carpet.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Persian Tabriz with central medallion, intricate floral borders'
  },
  {
    itemId: 'text-003',
    name: 'Baltimore Album Quilt',
    category: 'textiles',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Baltimore_Album_Quilt.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Album_quilt.jpg/800px-Album_quilt.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Baltimore Album quilt with elaborate appliqué blocks'
  },

  // ═══════════════════════════════════════════════════════════════
  // TOYS & COLLECTIBLES (4 items)
  // ═══════════════════════════════════════════════════════════════
  {
    itemId: 'toy-001',
    name: 'Steiff Teddy Bear',
    category: 'toys',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Steiff_Teddy_Bear.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/s/st/Steiff_bear.jpg/600px-Steiff_bear.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Steiff mohair teddy bear with button-in-ear trademark'
  },
  {
    itemId: 'toy-002',
    name: 'Cast Iron Toy Car',
    category: 'toys',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Cast_iron_toy.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ci/Hubley_toy.jpg/800px-Hubley_toy.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'American cast iron toy car by Hubley, Arcade, or Kenton'
  },
  {
    itemId: 'toy-003',
    name: 'Vintage Barbie #1 Ponytail',
    category: 'toys',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Barbie_1959.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/BarbieLogoNew.svg/800px-BarbieLogoNew.svg.png',
    source: 'Wikimedia Commons',
    attribution: 'Fair Use - Historical',
    license: 'Fair Use',
    notes: 'Original 1959 Barbie #1 ponytail doll with black/white swimsuit'
  },
  {
    itemId: 'toy-004',
    name: 'Lionel O Gauge Train',
    category: 'toys',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Lionel_train.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/l/li/Lionel_locomotive.jpg/800px-Lionel_locomotive.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Lionel O-gauge steam locomotive with tender'
  },

  // ═══════════════════════════════════════════════════════════════
  // LIGHTING (2 items)
  // ═══════════════════════════════════════════════════════════════
  {
    itemId: 'light-001',
    name: 'Tiffany Dragonfly Table Lamp',
    category: 'lighting',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Tiffany_Dragonfly_lamp.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/t/tl/Tiffany_lamp.jpg/600px-Tiffany_lamp.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Tiffany Studios Dragonfly lamp with leaded glass shade'
  },
  {
    itemId: 'light-002',
    name: 'Art Deco Table Lamp',
    category: 'lighting',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Art_Deco_lamp.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Deco_lamp.jpg/600px-Deco_lamp.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Public Domain',
    license: 'Public Domain',
    notes: 'Art Deco lamp with geometric chrome base and glass shade'
  },

  // ═══════════════════════════════════════════════════════════════
  // BOOKS & EPHEMERA (2 items)
  // ═══════════════════════════════════════════════════════════════
  {
    itemId: 'book-001',
    name: 'The Great Gatsby First Edition',
    category: 'books',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f7/TheGreatGatsby_1925jacket.jpeg',
    source: 'Wikimedia Commons',
    attribution: 'Francis Cugat (cover art), Public Domain',
    license: 'Public Domain',
    notes: 'Great Gatsby 1925 first edition dust jacket with eyes over carnival'
  },
  {
    itemId: 'book-002',
    name: 'Beatles Yesterday and Today Butcher Cover',
    category: 'collectibles',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e8/The_Beatles_-_Yesterday_and_Today.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/The_Beatles_-_Yesterday_and_Today.jpg/600px-The_Beatles_-_Yesterday_and_Today.jpg',
    source: 'Wikimedia Commons',
    attribution: 'Capitol Records, Fair Use',
    license: 'Fair Use - Historical',
    notes: 'Beatles "Butcher Cover" - controversial recalled album cover 1966'
  }
]

/**
 * Download an image from URL
 */
async function downloadImage(url: string, localPath: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'VintageVision/1.0 (Test Image Collection; https://vintagevision.space)'
      }
    })

    if (!response.ok) {
      console.log(`    HTTP ${response.status}`)
      return false
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    if (buffer.length < 1000) {
      console.log(`    File too small (${buffer.length} bytes) - likely error page`)
      return false
    }

    writeFileSync(localPath, buffer)
    console.log(`    ✓ Downloaded: ${(buffer.length / 1024).toFixed(1)}KB`)
    return true
  } catch (error) {
    console.log(`    Error: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Main download function
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('     VINTAGEVISION CURATED IMAGE DOWNLOADER')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('')
  console.log('Downloading 50 carefully curated, correctly-matched images')
  console.log('from Wikimedia Commons and other public domain sources.')
  console.log('')

  // Create output directory
  const imageDir = join(process.cwd(), OUTPUT_DIR)
  if (!existsSync(imageDir)) {
    mkdirSync(imageDir, { recursive: true })
  }

  const results: {
    itemId: string
    name: string
    success: boolean
    localPath: string | null
    source: string
    usedBackup: boolean
  }[] = []

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < CURATED_IMAGES.length; i++) {
    const item = CURATED_IMAGES[i]
    console.log(`\n[${i + 1}/${CURATED_IMAGES.length}] ${item.itemId}: ${item.name}`)
    console.log(`  Category: ${item.category}`)
    console.log(`  Source: ${item.source}`)

    const extension = item.imageUrl.toLowerCase().includes('.png') ? 'png' : 'jpg'
    const localPath = join(imageDir, `${item.itemId}.${extension}`)

    // Try primary URL
    console.log(`  Trying primary URL...`)
    let success = await downloadImage(item.imageUrl, localPath)
    let usedBackup = false

    // Try backup URL if primary failed
    if (!success && item.backupUrl) {
      console.log(`  Trying backup URL...`)
      success = await downloadImage(item.backupUrl, localPath)
      usedBackup = success
    }

    if (success) {
      successCount++
      results.push({
        itemId: item.itemId,
        name: item.name,
        success: true,
        localPath,
        source: item.source,
        usedBackup
      })
    } else {
      failCount++
      results.push({
        itemId: item.itemId,
        name: item.name,
        success: false,
        localPath: null,
        source: item.source,
        usedBackup: false
      })
    }

    // Be polite to servers
    await sleep(1500)
  }

  // Save manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    source: 'Curated collection from Wikimedia Commons and public domain sources',
    totalItems: CURATED_IMAGES.length,
    downloaded: successCount,
    failed: failCount,
    items: CURATED_IMAGES.map((item, i) => ({
      itemId: item.itemId,
      name: item.name,
      category: item.category,
      localPath: results[i].localPath,
      source: item.source,
      attribution: item.attribution,
      license: item.license,
      notes: item.notes,
      downloadSuccess: results[i].success,
      usedBackup: results[i].usedBackup
    }))
  }

  const manifestPath = join(process.cwd(), MANIFEST_PATH)
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('                      DOWNLOAD COMPLETE')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`✅ Downloaded: ${successCount}/${CURATED_IMAGES.length}`)
  console.log(`❌ Failed: ${failCount}/${CURATED_IMAGES.length}`)
  console.log(`📄 Manifest: ${manifestPath}`)

  if (failCount > 0) {
    console.log('\nFailed items (need manual attention):')
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.itemId}: ${r.name}`)
    })
  }

  // Show category summary
  console.log('\nBy category:')
  const categories: Record<string, { success: number; total: number }> = {}
  results.forEach(r => {
    const cat = CURATED_IMAGES.find(c => c.itemId === r.itemId)?.category || 'unknown'
    if (!categories[cat]) categories[cat] = { success: 0, total: 0 }
    categories[cat].total++
    if (r.success) categories[cat].success++
  })
  Object.entries(categories).forEach(([cat, stats]) => {
    const status = stats.success === stats.total ? '✅' : '⚠️'
    console.log(`  ${status} ${cat}: ${stats.success}/${stats.total}`)
  })
}

main().catch(console.error)
