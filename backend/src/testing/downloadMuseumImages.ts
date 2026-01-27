#!/usr/bin/env npx tsx
/**
 * Museum Image Download Script
 * Downloads antique images from the Metropolitan Museum of Art Open Access API
 *
 * This provides reliable, high-quality test images without rate limiting.
 * The Met's Open Access program allows free use of images of public domain works.
 *
 * Run with: npx tsx src/testing/downloadMuseumImages.ts
 */

import { GROUND_TRUTH_ITEMS, GroundTruthItem } from './groundTruth.js'
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'

// Met Museum API base URL
const MET_API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1'

// Delay between requests (1 second for politeness)
const REQUEST_DELAY_MS = 1000

// Local save directory
const LOCAL_IMAGE_DIR = 'test-data/images'
const OUTPUT_DIR = 'test-data'

/**
 * Search Met Museum for objects matching a query
 */
async function searchMetMuseum(query: string, department?: number): Promise<number[]> {
  let url = `${MET_API_BASE}/search?hasImages=true&q=${encodeURIComponent(query)}`
  if (department) {
    url += `&departmentId=${department}`
  }

  try {
    const response = await fetch(url)
    if (!response.ok) return []

    const data = await response.json() as { total: number; objectIDs: number[] | null }
    return data.objectIDs?.slice(0, 10) || [] // Get top 10 results
  } catch (error) {
    console.log(`  Search error: ${error instanceof Error ? error.message : String(error)}`)
    return []
  }
}

/**
 * Get object details from Met Museum
 */
async function getMetObject(objectId: number): Promise<{
  title: string
  primaryImage: string | null
  primaryImageSmall: string | null
  objectDate: string
  culture: string
  medium: string
  department: string
  artistDisplayName: string
} | null> {
  try {
    const response = await fetch(`${MET_API_BASE}/objects/${objectId}`)
    if (!response.ok) return null

    const data = await response.json() as any
    return {
      title: data.title,
      primaryImage: data.primaryImage || null,
      primaryImageSmall: data.primaryImageSmall || null,
      objectDate: data.objectDate,
      culture: data.culture,
      medium: data.medium,
      department: data.department,
      artistDisplayName: data.artistDisplayName || null
    }
  } catch (error) {
    return null
  }
}

/**
 * Download image from URL
 */
async function downloadImage(url: string, filename: string): Promise<boolean> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.log(`  ⚠️ HTTP ${response.status} fetching image`)
      return false
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    // Ensure directory exists
    const localDir = join(process.cwd(), LOCAL_IMAGE_DIR)
    if (!existsSync(localDir)) {
      mkdirSync(localDir, { recursive: true })
    }

    const localPath = join(localDir, filename)
    writeFileSync(localPath, buffer)
    console.log(`  ✓ Saved: ${filename} (${(buffer.length / 1024).toFixed(1)}KB)`)

    return true
  } catch (error) {
    console.log(`  ✗ Error: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Met Museum department IDs for our categories
 */
const DEPARTMENT_MAP: Record<string, number> = {
  furniture: 12,  // European Sculpture and Decorative Arts
  ceramics: 12,
  silver: 12,
  glass: 12,
  art: 11,        // European Paintings
  jewelry: 4,     // Costume Institute / Egyptian Art for ancient jewelry
  textiles: 4,    // Costume Institute
  toys: 12,
  lighting: 12,
  books: 14,      // Drawings and Prints
  watches: 5      // Asian Art (has some watches)
}

/**
 * Search queries for each item category to find similar Met objects
 */
const SEARCH_QUERIES: Record<string, string[]> = {
  furniture: ['chair antique', 'cabinet furniture', 'desk antique', 'table furniture'],
  ceramics: ['porcelain vase', 'pottery antique', 'ceramic bowl', 'stoneware'],
  art: ['painting oil', 'portrait canvas', 'landscape painting', 'watercolor'],
  jewelry: ['gold ring', 'silver brooch', 'necklace antique', 'bracelet'],
  silver: ['silver teapot', 'sterling flatware', 'silver bowl', 'candelabra'],
  glass: ['glass vase', 'crystal decanter', 'stained glass', 'cut glass'],
  textiles: ['tapestry', 'quilt antique', 'rug carpet', 'embroidery'],
  toys: ['automaton', 'doll antique', 'toy soldier', 'music box'],
  lighting: ['chandelier', 'lamp antique', 'sconce', 'lantern'],
  books: ['illuminated manuscript', 'print engraving', 'lithograph', 'woodblock'],
  watches: ['pocket watch', 'clock antique']
}

/**
 * Main function to download Met Museum images
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('      MET MUSEUM IMAGE DOWNLOADER FOR VINTAGEVISION')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('')
  console.log('This script downloads real antique images from the Met Museum')
  console.log('Open Access collection to use as reliable test images.')
  console.log('')

  // Create output directory
  const outputDir = join(process.cwd(), OUTPUT_DIR)
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  // Track results
  const results: {
    id: string
    originalGroundTruth: GroundTruthItem
    metObjectId: number | null
    metData: any
    localImagePath: string | null
    imageUrl: string | null
  }[] = []

  let successCount = 0
  let failCount = 0

  // Process each ground truth item
  for (let i = 0; i < GROUND_TRUTH_ITEMS.length; i++) {
    const item = GROUND_TRUTH_ITEMS[i]
    console.log(`\n[${i + 1}/${GROUND_TRUTH_ITEMS.length}] ${item.id}: ${item.expected.name}`)

    // Get search queries for this category
    const category = item.expected.domainExpert
    const queries = SEARCH_QUERIES[category] || ['antique']

    let foundImage = false

    // Try each search query until we find an image
    for (const query of queries) {
      if (foundImage) break

      console.log(`  🔍 Searching for: "${query}"`)
      const objectIds = await searchMetMuseum(query, DEPARTMENT_MAP[category])
      await sleep(REQUEST_DELAY_MS / 2)

      // Try to find an object with an image
      for (const objId of objectIds) {
        if (foundImage) break

        const obj = await getMetObject(objId)
        await sleep(REQUEST_DELAY_MS / 2)

        if (obj && obj.primaryImage) {
          console.log(`  📦 Found: "${obj.title}" (${obj.objectDate})`)

          // Download the image
          const extension = obj.primaryImage.includes('.png') ? 'png' : 'jpg'
          const filename = `${item.id}.${extension}`

          // Use small image for faster download, fall back to primary
          const imageUrl = obj.primaryImageSmall || obj.primaryImage
          const downloaded = await downloadImage(imageUrl, filename)

          if (downloaded) {
            results.push({
              id: item.id,
              originalGroundTruth: item,
              metObjectId: objId,
              metData: obj,
              localImagePath: join(LOCAL_IMAGE_DIR, filename),
              imageUrl: imageUrl
            })
            successCount++
            foundImage = true
          }
        }
      }
    }

    if (!foundImage) {
      console.log(`  ❌ No suitable image found`)
      results.push({
        id: item.id,
        originalGroundTruth: item,
        metObjectId: null,
        metData: null,
        localImagePath: null,
        imageUrl: null
      })
      failCount++
    }

    // Delay before next item
    if (i < GROUND_TRUTH_ITEMS.length - 1) {
      console.log(`  ⏳ Waiting ${REQUEST_DELAY_MS / 1000}s...`)
      await sleep(REQUEST_DELAY_MS)
    }
  }

  // Save manifest
  const manifestPath = join(outputDir, 'met-images-manifest.json')
  writeFileSync(manifestPath, JSON.stringify({
    downloadedAt: new Date().toISOString(),
    source: 'Metropolitan Museum of Art Open Access API',
    totalItems: GROUND_TRUTH_ITEMS.length,
    successful: successCount,
    failed: failCount,
    items: results
  }, null, 2))

  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('                         SUMMARY')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`✅ Downloaded: ${successCount}/${GROUND_TRUTH_ITEMS.length}`)
  console.log(`❌ Failed: ${failCount}/${GROUND_TRUTH_ITEMS.length}`)
  console.log(`📄 Manifest: ${manifestPath}`)
  console.log('')

  // Generate updated test configuration
  const testConfigPath = join(outputDir, 'localTestConfig.ts')
  generateLocalTestConfig(results, testConfigPath)
  console.log(`📝 Test config: ${testConfigPath}`)
}

/**
 * Generate TypeScript config for local images
 */
function generateLocalTestConfig(results: any[], outputPath: string) {
  const lines = [
    '/**',
    ' * Local Test Configuration',
    ' * Generated from Met Museum images download',
    ' * ' + new Date().toISOString(),
    ' */',
    '',
    'export interface LocalTestItem {',
    '  id: string',
    '  localImagePath: string',
    '  metObjectId: number | null',
    '  metTitle: string | null',
    '  metDate: string | null',
    '  groundTruthExpected: any',
    '}',
    '',
    'export const LOCAL_TEST_ITEMS: LocalTestItem[] = ['
  ]

  for (const item of results) {
    if (item.localImagePath) {
      lines.push(`  {`)
      lines.push(`    id: '${item.id}',`)
      lines.push(`    localImagePath: '${item.localImagePath}',`)
      lines.push(`    metObjectId: ${item.metObjectId},`)
      lines.push(`    metTitle: ${item.metData ? `'${item.metData.title.replace(/'/g, "\\'")}'` : 'null'},`)
      lines.push(`    metDate: ${item.metData?.objectDate ? `'${item.metData.objectDate}'` : 'null'},`)
      lines.push(`    groundTruthExpected: ${JSON.stringify(item.originalGroundTruth.expected)}`)
      lines.push(`  },`)
    }
  }

  lines.push(']')
  lines.push('')

  writeFileSync(outputPath, lines.join('\n'))
}

// Run
main().catch(console.error)
