#!/usr/bin/env npx tsx
/**
 * Wikimedia Commons Image Downloader for VintageVision Test Suite
 *
 * Uses the actual Wikimedia API to find and download correct images
 * for all 50 ground truth test items.
 *
 * Run: npx tsx src/testing/wikimediaImageDownloader.ts
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const OUTPUT_DIR = 'test-data/images'
const MANIFEST_PATH = 'test-data/wikimedia-manifest.json'

// Wikipedia API endpoints
const WIKI_API = 'https://en.wikipedia.org/w/api.php'
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php'

interface TestItem {
  itemId: string
  name: string
  category: string
  wikiArticle: string  // Wikipedia article name
  searchTerms: string[] // Backup search terms for Commons
}

/**
 * Test items with Wikipedia articles for image lookup
 */
const TEST_ITEMS: TestItem[] = [
  // FURNITURE
  { itemId: 'furn-001', name: 'Eames Lounge Chair', category: 'furniture', wikiArticle: 'Eames_Lounge_Chair', searchTerms: ['Eames lounge chair'] },
  { itemId: 'furn-002', name: 'Barcelona Chair', category: 'furniture', wikiArticle: 'Barcelona_chair', searchTerms: ['Barcelona chair Mies'] },
  { itemId: 'furn-003', name: 'Gustav Stickley Sideboard', category: 'furniture', wikiArticle: 'Gustav_Stickley', searchTerms: ['Stickley furniture', 'Arts Crafts furniture'] },
  { itemId: 'furn-004', name: 'Louis XV Commode', category: 'furniture', wikiArticle: 'Commode', searchTerms: ['Louis XV commode', 'French rococo furniture'] },
  { itemId: 'furn-005', name: 'Windsor Chair', category: 'furniture', wikiArticle: 'Windsor_chair', searchTerms: ['Windsor chair'] },
  { itemId: 'furn-006', name: 'Chippendale Chair', category: 'furniture', wikiArticle: 'Thomas_Chippendale', searchTerms: ['Chippendale chair', 'Chippendale furniture'] },
  { itemId: 'furn-007', name: 'Wassily Chair', category: 'furniture', wikiArticle: 'Wassily_Chair', searchTerms: ['Wassily chair', 'Breuer chair'] },
  { itemId: 'furn-008', name: 'Shaker Furniture', category: 'furniture', wikiArticle: 'Shaker_furniture', searchTerms: ['Shaker rocking chair', 'Shaker chair'] },
  { itemId: 'furn-009', name: 'Thonet Chair No. 14', category: 'furniture', wikiArticle: 'No._14_chair', searchTerms: ['Thonet chair', 'bentwood chair'] },
  { itemId: 'furn-010', name: 'Noguchi Table', category: 'furniture', wikiArticle: 'Noguchi_table', searchTerms: ['Noguchi coffee table', 'Isamu Noguchi table'] },

  // CERAMICS
  { itemId: 'ceram-001', name: 'Rookwood Pottery', category: 'ceramics', wikiArticle: 'Rookwood_Pottery_Company', searchTerms: ['Rookwood pottery', 'Rookwood vase'] },
  { itemId: 'ceram-002', name: 'Chinese Blue White Porcelain', category: 'ceramics', wikiArticle: 'Blue_and_white_pottery', searchTerms: ['Chinese blue white porcelain', 'Ming vase'] },
  { itemId: 'ceram-003', name: 'Roseville Pottery', category: 'ceramics', wikiArticle: 'Roseville_Pottery', searchTerms: ['Roseville pottery', 'Roseville vase'] },
  { itemId: 'ceram-004', name: 'Wedgwood Jasperware', category: 'ceramics', wikiArticle: 'Jasperware', searchTerms: ['Wedgwood jasperware', 'Wedgwood blue'] },
  { itemId: 'ceram-005', name: 'Meissen Porcelain', category: 'ceramics', wikiArticle: 'Meissen_porcelain', searchTerms: ['Meissen figurine', 'Meissen porcelain'] },
  { itemId: 'ceram-006', name: 'Fiesta Dinnerware', category: 'ceramics', wikiArticle: 'Fiesta_(dinnerware)', searchTerms: ['Fiestaware', 'Fiesta dinnerware'] },
  { itemId: 'ceram-007', name: 'Imari Porcelain', category: 'ceramics', wikiArticle: 'Imari_ware', searchTerms: ['Imari porcelain', 'Japanese Imari'] },
  { itemId: 'ceram-008', name: 'Grueby Pottery', category: 'ceramics', wikiArticle: 'Grueby_Faience_Company', searchTerms: ['Grueby pottery', 'Grueby vase'] },

  // ART
  { itemId: 'art-001', name: 'Starry Night', category: 'art', wikiArticle: 'The_Starry_Night', searchTerms: ['Starry Night Van Gogh'] },
  { itemId: 'art-002', name: 'Water Lilies Monet', category: 'art', wikiArticle: 'Water_Lilies_(Monet_series)', searchTerms: ['Water Lilies Monet', 'Nympheas'] },
  { itemId: 'art-003', name: 'Currier and Ives', category: 'art', wikiArticle: 'Currier_and_Ives', searchTerms: ['Currier Ives print', 'Currier Ives winter'] },
  { itemId: 'art-004', name: 'Hiroshige Woodblock', category: 'art', wikiArticle: 'Hiroshige', searchTerms: ['Hiroshige Tokaido', 'ukiyo-e Hiroshige'] },
  { itemId: 'art-005', name: 'Frederic Remington Bronze', category: 'art', wikiArticle: 'Frederic_Remington', searchTerms: ['Remington bronze', 'Broncho Buster'] },
  { itemId: 'art-006', name: 'Maxfield Parrish', category: 'art', wikiArticle: 'Maxfield_Parrish', searchTerms: ['Maxfield Parrish Daybreak', 'Parrish painting'] },

  // JEWELRY & WATCHES
  { itemId: 'jwl-001', name: 'Rolex Submariner', category: 'watches', wikiArticle: 'Rolex_Submariner', searchTerms: ['Rolex Submariner', 'Rolex watch'] },
  { itemId: 'jwl-002', name: 'Art Deco Ring', category: 'jewelry', wikiArticle: 'Art_Deco', searchTerms: ['Art Deco ring', 'Art Deco jewelry'] },
  { itemId: 'jwl-003', name: 'Cartier Tank', category: 'watches', wikiArticle: 'Cartier_Tank', searchTerms: ['Cartier Tank watch'] },
  { itemId: 'jwl-004', name: 'Victorian Cameo', category: 'jewelry', wikiArticle: 'Cameo_(carving)', searchTerms: ['Victorian cameo', 'shell cameo brooch'] },
  { itemId: 'jwl-005', name: 'Tiffany Ring', category: 'jewelry', wikiArticle: 'Tiffany_%26_Co.', searchTerms: ['Tiffany engagement ring', 'Tiffany diamond'] },
  { itemId: 'jwl-006', name: 'Omega Speedmaster', category: 'watches', wikiArticle: 'Omega_Speedmaster', searchTerms: ['Omega Speedmaster', 'Moon watch'] },

  // SILVER
  { itemId: 'silv-001', name: 'Georgian Silver Teapot', category: 'silver', wikiArticle: 'Georgian_silver', searchTerms: ['Georgian silver teapot', 'English silver'] },
  { itemId: 'silv-002', name: 'Gorham Silver', category: 'silver', wikiArticle: 'Gorham_Manufacturing_Company', searchTerms: ['Gorham silver', 'Martele silver'] },
  { itemId: 'silv-003', name: 'Tiffany Silver', category: 'silver', wikiArticle: 'Tiffany_%26_Co.', searchTerms: ['Tiffany sterling flatware', 'Tiffany silver'] },
  { itemId: 'silv-004', name: 'Paul Revere Silver', category: 'silver', wikiArticle: 'Sons_of_Liberty_Bowl', searchTerms: ['Paul Revere bowl', 'Sons of Liberty Bowl'] },
  { itemId: 'silv-005', name: 'Georg Jensen Silver', category: 'silver', wikiArticle: 'Georg_Jensen_(company)', searchTerms: ['Georg Jensen silver', 'Danish silver'] },

  // GLASS
  { itemId: 'glass-001', name: 'Tiffany Glass', category: 'glass', wikiArticle: 'Louis_Comfort_Tiffany', searchTerms: ['Tiffany Favrile glass', 'Tiffany vase'] },
  { itemId: 'glass-002', name: 'Lalique Glass', category: 'glass', wikiArticle: 'René_Lalique', searchTerms: ['Lalique glass', 'Lalique vase'] },
  { itemId: 'glass-003', name: 'Depression Glass', category: 'glass', wikiArticle: 'Depression_glass', searchTerms: ['Depression glass', 'pink Depression glass'] },
  { itemId: 'glass-004', name: 'Murano Glass', category: 'glass', wikiArticle: 'Murano_glass', searchTerms: ['Murano glass vase', 'Venetian glass'] },

  // TEXTILES
  { itemId: 'text-001', name: 'Navajo Blanket', category: 'textiles', wikiArticle: 'Navajo_weaving', searchTerms: ['Navajo blanket', 'Navajo rug'] },
  { itemId: 'text-002', name: 'Persian Carpet', category: 'textiles', wikiArticle: 'Persian_carpet', searchTerms: ['Persian carpet', 'Tabriz rug'] },
  { itemId: 'text-003', name: 'Baltimore Album Quilt', category: 'textiles', wikiArticle: 'Baltimore_album_quilt', searchTerms: ['Baltimore album quilt', 'American quilt'] },

  // TOYS
  { itemId: 'toy-001', name: 'Steiff Teddy Bear', category: 'toys', wikiArticle: 'Steiff', searchTerms: ['Steiff teddy bear', 'antique teddy bear'] },
  { itemId: 'toy-002', name: 'Cast Iron Toy', category: 'toys', wikiArticle: 'Cast-iron_toy', searchTerms: ['cast iron toy car', 'Hubley toy'] },
  { itemId: 'toy-003', name: 'Barbie Doll', category: 'toys', wikiArticle: 'Barbie', searchTerms: ['vintage Barbie', 'Barbie 1959'] },
  { itemId: 'toy-004', name: 'Lionel Train', category: 'toys', wikiArticle: 'Lionel_Corporation', searchTerms: ['Lionel train', 'model train'] },

  // LIGHTING
  { itemId: 'light-001', name: 'Tiffany Lamp', category: 'lighting', wikiArticle: 'Tiffany_lamp', searchTerms: ['Tiffany lamp', 'Tiffany dragonfly'] },
  { itemId: 'light-002', name: 'Art Deco Lamp', category: 'lighting', wikiArticle: 'Art_Deco', searchTerms: ['Art Deco lamp', 'Art Deco lighting'] },

  // BOOKS
  { itemId: 'book-001', name: 'Great Gatsby First Edition', category: 'books', wikiArticle: 'The_Great_Gatsby', searchTerms: ['Great Gatsby cover', 'Great Gatsby first edition'] },
  { itemId: 'book-002', name: 'Beatles Butcher Cover', category: 'collectibles', wikiArticle: 'Yesterday_and_Today', searchTerms: ['Beatles butcher cover', 'Yesterday and Today album'] }
]

/**
 * Fetch with retry and rate limit handling
 */
async function fetchWithRetry(url: string, retries = 3): Promise<Response | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'VintageVision/1.0 (https://vintagevision.space; Testing purposes)'
        }
      })

      if (response.status === 429) {
        console.log(`    Rate limited, waiting ${30 * (i + 1)}s...`)
        await sleep(30000 * (i + 1))
        continue
      }

      return response
    } catch (error) {
      console.log(`    Fetch error: ${error instanceof Error ? error.message : String(error)}`)
      await sleep(5000)
    }
  }
  return null
}

interface WikiApiPageImageResponse {
  query?: {
    pages?: Record<string, {
      thumbnail?: { source?: string };
    }>;
  };
}

interface WikiApiSearchResponse {
  query?: {
    search?: Array<{ title: string }>;
  };
}

interface WikiApiImageInfoResponse {
  query?: {
    pages?: Record<string, {
      imageinfo?: Array<{
        url?: string;
        thumburl?: string;
      }>;
    }>;
  };
}

/**
 * Get image URL from Wikipedia article
 */
async function getWikiArticleImage(article: string): Promise<string | null> {
  const url = `${WIKI_API}?action=query&titles=${encodeURIComponent(article)}&prop=pageimages&format=json&pithumbsize=1024&origin=*`

  const response = await fetchWithRetry(url)
  if (!response || !response.ok) return null

  try {
    const data = await response.json() as WikiApiPageImageResponse
    const pages = data?.query?.pages
    if (!pages) return null

    const page = Object.values(pages)[0]
    return page?.thumbnail?.source || null
  } catch {
    return null
  }
}

/**
 * Search Wikimedia Commons for an image
 */
async function searchCommonsImage(searchTerm: string): Promise<string | null> {
  const url = `${COMMONS_API}?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srnamespace=6&srlimit=5&format=json&origin=*`

  const response = await fetchWithRetry(url)
  if (!response || !response.ok) return null

  try {
    const data = await response.json() as WikiApiSearchResponse
    const results = data?.query?.search
    if (!results || results.length === 0) return null

    // Get the first image file
    for (const result of results) {
      const title = result.title
      if (title.match(/\.(jpg|jpeg|png|gif)$/i)) {
        // Get the actual image URL
        const imageUrl = await getCommonsImageUrl(title)
        if (imageUrl) return imageUrl
      }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Get actual image URL from Commons file title
 */
async function getCommonsImageUrl(title: string): Promise<string | null> {
  const url = `${COMMONS_API}?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=1024&format=json&origin=*`

  const response = await fetchWithRetry(url)
  if (!response || !response.ok) return null

  try {
    const data = await response.json() as WikiApiImageInfoResponse
    const pages = data?.query?.pages
    if (!pages) return null

    const page = Object.values(pages)[0]
    return page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url || null
  } catch {
    return null
  }
}

/**
 * Download image from URL
 */
async function downloadImage(url: string, localPath: string): Promise<boolean> {
  const response = await fetchWithRetry(url)
  if (!response || !response.ok) {
    console.log(`    HTTP ${response?.status || 'error'}`)
    return false
  }

  try {
    const buffer = Buffer.from(await response.arrayBuffer())

    if (buffer.length < 1000) {
      console.log(`    File too small (${buffer.length} bytes)`)
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
  console.log('     WIKIMEDIA API IMAGE DOWNLOADER')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('')
  console.log('Downloading images using Wikipedia/Wikimedia Commons API')
  console.log('This ensures we get the correct, actual images.')
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
    imageUrl: string | null
    source: 'wikipedia' | 'commons' | null
  }[] = []

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < TEST_ITEMS.length; i++) {
    const item = TEST_ITEMS[i]
    console.log(`\n[${i + 1}/${TEST_ITEMS.length}] ${item.itemId}: ${item.name}`)
    console.log(`  Category: ${item.category}`)

    let imageUrl: string | null = null
    let source: 'wikipedia' | 'commons' | null = null

    // Try Wikipedia article first
    console.log(`  Trying Wikipedia article: ${item.wikiArticle}`)
    imageUrl = await getWikiArticleImage(item.wikiArticle)
    if (imageUrl) {
      source = 'wikipedia'
      console.log(`  Found via Wikipedia`)
    }

    // Fall back to Commons search
    if (!imageUrl) {
      for (const searchTerm of item.searchTerms) {
        console.log(`  Searching Commons: "${searchTerm}"`)
        imageUrl = await searchCommonsImage(searchTerm)
        if (imageUrl) {
          source = 'commons'
          console.log(`  Found via Commons search`)
          break
        }
        await sleep(2000)
      }
    }

    if (imageUrl) {
      const extension = imageUrl.toLowerCase().includes('.png') ? 'png' : 'jpg'
      const localPath = join(imageDir, `${item.itemId}.${extension}`)

      console.log(`  Downloading image...`)
      const success = await downloadImage(imageUrl, localPath)

      if (success) {
        successCount++
        results.push({
          itemId: item.itemId,
          name: item.name,
          success: true,
          localPath,
          imageUrl,
          source
        })
      } else {
        failCount++
        results.push({
          itemId: item.itemId,
          name: item.name,
          success: false,
          localPath: null,
          imageUrl,
          source
        })
      }
    } else {
      console.log(`  ❌ No image found`)
      failCount++
      results.push({
        itemId: item.itemId,
        name: item.name,
        success: false,
        localPath: null,
        imageUrl: null,
        source: null
      })
    }

    // Rate limit protection
    await sleep(3000)
  }

  // Save manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    source: 'Wikipedia and Wikimedia Commons API',
    totalItems: TEST_ITEMS.length,
    downloaded: successCount,
    failed: failCount,
    items: results
  }

  const manifestPath = join(process.cwd(), MANIFEST_PATH)
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('                      DOWNLOAD COMPLETE')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`✅ Downloaded: ${successCount}/${TEST_ITEMS.length}`)
  console.log(`❌ Failed: ${failCount}/${TEST_ITEMS.length}`)
  console.log(`📄 Manifest: ${manifestPath}`)

  if (failCount > 0) {
    console.log('\nFailed items:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.itemId}: ${r.name}`)
    })
  }

  // Category summary
  console.log('\nBy category:')
  const categories: Record<string, { success: number; total: number }> = {}
  TEST_ITEMS.forEach((item, i) => {
    if (!categories[item.category]) categories[item.category] = { success: 0, total: 0 }
    categories[item.category].total++
    if (results[i].success) categories[item.category].success++
  })
  Object.entries(categories).forEach(([cat, stats]) => {
    const status = stats.success === stats.total ? '✅' : stats.success > 0 ? '⚠️' : '❌'
    console.log(`  ${status} ${cat}: ${stats.success}/${stats.total}`)
  })
}

main().catch(console.error)
