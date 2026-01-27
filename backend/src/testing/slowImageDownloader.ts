#!/usr/bin/env npx tsx
/**
 * Slow Image Downloader
 * Downloads test images very slowly to avoid rate limiting
 *
 * This script:
 * 1. Uses Wikipedia REST API to find actual image URLs
 * 2. Waits 30+ seconds between requests
 * 3. Designed to run overnight
 * 4. Saves progress so it can be resumed
 *
 * Run: npx tsx src/testing/slowImageDownloader.ts
 */

import { GROUND_TRUTH_ITEMS, GroundTruthItem } from './groundTruth.js'
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Very slow - 30 seconds between requests to be respectful
const REQUEST_DELAY_MS = 30000

// Output directories
const OUTPUT_DIR = 'test-data'
const IMAGE_DIR = 'test-data/images'
const PROGRESS_FILE = 'test-data/download-progress.json'

// Browser-like headers
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
}

// Map item IDs to Wikipedia article names for REST API
const WIKIPEDIA_ARTICLES: Record<string, string> = {
  'furn-001': 'Eames_Lounge_Chair',
  'furn-002': 'Barcelona_chair',
  'furn-003': 'Gustav_Stickley',
  'furn-004': 'Louis_XV_furniture',
  'furn-005': 'Windsor_chair',
  'furn-006': 'Chippendale_furniture',
  'furn-007': 'Wassily_Chair',
  'furn-008': 'Shaker_furniture',
  'furn-009': 'Thonet',
  'furn-010': 'Noguchi_table',
  'ceram-001': 'Rookwood_Pottery_Company',
  'ceram-002': 'Chinese_ceramics',
  'ceram-003': 'Roseville_Pottery',
  'ceram-004': 'Jasperware',
  'ceram-005': 'Meissen_porcelain',
  'ceram-006': 'Fiesta_(dinnerware)',
  'ceram-007': 'Imari_ware',
  'ceram-008': 'Grueby_Faience_Company',
  'art-001': 'The_Starry_Night',
  'art-002': 'Water_Lilies_(Monet_series)',
  'art-003': 'Currier_and_Ives',
  'art-004': 'Hiroshige',
  'art-005': 'Frederic_Remington',
  'art-006': 'Maxfield_Parrish',
  'jwl-001': 'Rolex_Submariner',
  'jwl-002': 'Art_Deco_jewelry',
  'jwl-003': 'Cartier_Tank',
  'jwl-004': 'Cameo_(carving)',
  'jwl-005': 'Tiffany_%26_Co.',
  'jwl-006': 'Omega_Speedmaster',
  'silv-001': 'Georgian_era',
  'silv-002': 'Gorham_Manufacturing_Company',
  'silv-003': 'Tiffany_%26_Co.',
  'silv-004': 'Paul_Revere',
  'silv-005': 'Georg_Jensen',
  'glass-001': 'Tiffany_lamp',
  'glass-002': 'Lalique',
  'glass-003': 'Depression_glass',
  'glass-004': 'Murano_glass',
  'text-001': 'Navajo_textiles',
  'text-002': 'Persian_carpet',
  'text-003': 'Baltimore_Album_Quilt',
  'toy-001': 'Steiff',
  'toy-002': 'Cast_iron',
  'toy-003': 'Barbie',
  'toy-004': 'Lionel_Corporation',
  'light-001': 'Tiffany_lamp',
  'light-002': 'Art_Deco',
  'book-001': 'The_Great_Gatsby',
  'book-002': 'Yesterday_and_Today'
}

interface Progress {
  lastCompleted: number
  completed: string[]
  failed: string[]
  results: Record<string, { url: string; localPath: string }>
}

/**
 * Load progress from file
 */
function loadProgress(): Progress {
  const progressPath = join(process.cwd(), PROGRESS_FILE)
  if (existsSync(progressPath)) {
    try {
      return JSON.parse(readFileSync(progressPath, 'utf-8'))
    } catch {
      // Corrupted file, start fresh
    }
  }
  return { lastCompleted: -1, completed: [], failed: [], results: {} }
}

/**
 * Save progress to file
 */
function saveProgress(progress: Progress): void {
  const progressPath = join(process.cwd(), PROGRESS_FILE)
  writeFileSync(progressPath, JSON.stringify(progress, null, 2))
}

/**
 * Get image URL from Wikipedia REST API
 */
async function getWikipediaImageUrl(article: string): Promise<string | null> {
  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(article)}`

  try {
    const response = await fetch(apiUrl, { headers: HEADERS })
    if (!response.ok) {
      console.log(`  API returned ${response.status}`)
      return null
    }

    const data = await response.json() as any
    const items = data.items || []

    // Find first image with a valid source
    for (const item of items) {
      if (item.srcset && item.srcset.length > 0) {
        // Get highest resolution available
        const sources = item.srcset.sort((a: any, b: any) => (b.scale || 1) - (a.scale || 1))
        const src = sources[0]?.src
        if (src) {
          // Convert to full URL
          return src.startsWith('//') ? `https:${src}` : src
        }
      }
    }

    return null
  } catch (error) {
    console.log(`  API error: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

/**
 * Download image with retries
 */
async function downloadImage(url: string, localPath: string): Promise<boolean> {
  const maxRetries = 3

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  Downloading (attempt ${attempt})...`)

      const response = await fetch(url, { headers: HEADERS })

      if (response.status === 429) {
        console.log(`  Rate limited. Waiting 60 seconds...`)
        await sleep(60000)
        continue
      }

      if (!response.ok) {
        console.log(`  HTTP ${response.status}`)
        if (attempt < maxRetries) {
          console.log(`  Retrying in 10 seconds...`)
          await sleep(10000)
          continue
        }
        return false
      }

      const buffer = Buffer.from(await response.arrayBuffer())

      // Ensure directory exists
      const dir = join(process.cwd(), IMAGE_DIR)
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }

      writeFileSync(localPath, buffer)
      console.log(`  ✓ Saved ${(buffer.length / 1024).toFixed(1)}KB`)
      return true

    } catch (error) {
      console.log(`  Error: ${error instanceof Error ? error.message : String(error)}`)
      if (attempt < maxRetries) {
        console.log(`  Retrying in 10 seconds...`)
        await sleep(10000)
      }
    }
  }

  return false
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Main download function
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('       VINTAGEVISION SLOW IMAGE DOWNLOADER')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`📦 Total items: ${GROUND_TRUTH_ITEMS.length}`)
  console.log(`⏱️  Delay between requests: ${REQUEST_DELAY_MS / 1000}s`)
  console.log(`📂 Output: ${IMAGE_DIR}`)
  console.log('')

  // Ensure output directory exists
  const outputDir = join(process.cwd(), OUTPUT_DIR)
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  // Load progress
  const progress = loadProgress()
  const startIndex = progress.lastCompleted + 1

  if (startIndex > 0) {
    console.log(`📌 Resuming from item ${startIndex + 1} (${progress.completed.length} already done)`)
    console.log('')
  }

  // Process each item
  for (let i = startIndex; i < GROUND_TRUTH_ITEMS.length; i++) {
    const item = GROUND_TRUTH_ITEMS[i]
    const article = WIKIPEDIA_ARTICLES[item.id]

    console.log(`\n[${i + 1}/${GROUND_TRUTH_ITEMS.length}] ${item.id}: ${item.expected.name}`)

    if (!article) {
      console.log(`  ⚠️ No Wikipedia article mapped`)
      progress.failed.push(item.id)
      progress.lastCompleted = i
      saveProgress(progress)
      continue
    }

    console.log(`  📖 Wikipedia article: ${article}`)

    // Get image URL from REST API
    const imageUrl = await getWikipediaImageUrl(article)
    await sleep(2000) // Small delay after API call

    if (!imageUrl) {
      console.log(`  ❌ No image found in article`)
      progress.failed.push(item.id)
      progress.lastCompleted = i
      saveProgress(progress)

      // Still wait before next item
      if (i < GROUND_TRUTH_ITEMS.length - 1) {
        console.log(`  ⏳ Waiting ${REQUEST_DELAY_MS / 1000}s before next item...`)
        await sleep(REQUEST_DELAY_MS)
      }
      continue
    }

    console.log(`  🔗 Image URL: ${imageUrl.substring(0, 60)}...`)

    // Download the image
    const extension = imageUrl.match(/\.(jpg|jpeg|png|gif|webp)/i)?.[1] || 'jpg'
    const localPath = join(process.cwd(), IMAGE_DIR, `${item.id}.${extension}`)

    const success = await downloadImage(imageUrl, localPath)

    if (success) {
      progress.completed.push(item.id)
      progress.results[item.id] = { url: imageUrl, localPath }
    } else {
      progress.failed.push(item.id)
    }

    progress.lastCompleted = i
    saveProgress(progress)

    // Wait before next item
    if (i < GROUND_TRUTH_ITEMS.length - 1) {
      console.log(`  ⏳ Waiting ${REQUEST_DELAY_MS / 1000}s before next item...`)
      await sleep(REQUEST_DELAY_MS)
    }
  }

  // Final summary
  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('                         COMPLETE')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`✅ Downloaded: ${progress.completed.length}/${GROUND_TRUTH_ITEMS.length}`)
  console.log(`❌ Failed: ${progress.failed.length}/${GROUND_TRUTH_ITEMS.length}`)
  console.log(`📄 Progress saved to: ${PROGRESS_FILE}`)

  if (progress.failed.length > 0) {
    console.log('\nFailed items:')
    progress.failed.forEach(id => console.log(`  - ${id}`))
  }

  // Generate manifest
  const manifestPath = join(process.cwd(), OUTPUT_DIR, 'local-images-manifest.json')
  writeFileSync(manifestPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalItems: GROUND_TRUTH_ITEMS.length,
    downloaded: progress.completed.length,
    failed: progress.failed.length,
    images: progress.results
  }, null, 2))
  console.log(`\n📝 Manifest: ${manifestPath}`)
}

// Run
main().catch(console.error)
