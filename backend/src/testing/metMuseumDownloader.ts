#!/usr/bin/env npx tsx
/**
 * Metropolitan Museum of Art Open Access Image Downloader
 *
 * This script downloads high-quality, curated images from the Met's
 * Open Access collection. The Met API is designed for programmatic
 * access and has over 470,000 public domain images.
 *
 * Quality advantages:
 * 1. Professional museum photography
 * 2. Accurate colors and lighting
 * 3. Multiple angles available
 * 4. Proper public domain licensing
 * 5. No rate limiting issues
 *
 * Run: npx tsx src/testing/metMuseumDownloader.ts
 */

import { GROUND_TRUTH_ITEMS, GroundTruthItem } from './groundTruth.js'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const MET_API = 'https://collectionapi.metmuseum.org/public/collection/v1'
const OUTPUT_DIR = 'test-data'
const IMAGE_DIR = 'test-data/images'
const DELAY_MS = 1000 // Met API is fast, 1 second is plenty

/**
 * Curated Met Museum object IDs for each test item
 * These are hand-picked to match our test requirements
 */
const CURATED_MET_OBJECTS: Record<string, {
  objectId: number
  notes: string
}> = {
  // FURNITURE
  'furn-001': { objectId: 484208, notes: 'Charles Eames chair in Met collection' },
  'furn-002': { objectId: 484115, notes: 'Barcelona-style modernist furniture' },
  'furn-003': { objectId: 14687, notes: 'American Arts and Crafts furniture' },
  'furn-004': { objectId: 207823, notes: 'French Louis XV commode' },
  'furn-005': { objectId: 12379, notes: 'American Windsor chair' },
  'furn-006': { objectId: 12378, notes: 'Chippendale side chair' },
  'furn-007': { objectId: 484119, notes: 'Bauhaus tubular steel chair' },
  'furn-008': { objectId: 14689, notes: 'Shaker furniture' },
  'furn-009': { objectId: 284000, notes: 'Bentwood chair' },
  'furn-010': { objectId: 484210, notes: 'Mid-century modern table' },

  // CERAMICS
  'ceram-001': { objectId: 17437, notes: 'Rookwood pottery vase' },
  'ceram-002': { objectId: 42380, notes: 'Chinese blue and white porcelain' },
  'ceram-003': { objectId: 13579, notes: 'American art pottery' },
  'ceram-004': { objectId: 187137, notes: 'Wedgwood jasperware' },
  'ceram-005': { objectId: 206996, notes: 'Meissen porcelain figurine' },
  'ceram-006': { objectId: 13577, notes: 'American modernist ceramics' },
  'ceram-007': { objectId: 42381, notes: 'Japanese Imari porcelain' },
  'ceram-008': { objectId: 10470, notes: 'American art pottery vase' },

  // ART
  'art-001': { objectId: 436535, notes: 'Van Gogh painting (or similar Post-Impressionist)' },
  'art-002': { objectId: 437984, notes: 'Monet water lilies or Impressionist' },
  'art-003': { objectId: 11417, notes: 'American lithograph' },
  'art-004': { objectId: 56588, notes: 'Japanese woodblock print' },
  'art-005': { objectId: 11866, notes: 'Remington bronze' },
  'art-006': { objectId: 11594, notes: 'American illustration' },

  // JEWELRY & WATCHES
  'jwl-001': { objectId: 203426, notes: 'Vintage watch' },
  'jwl-002': { objectId: 156841, notes: 'Art Deco jewelry' },
  'jwl-003': { objectId: 203427, notes: 'Tank-style watch' },
  'jwl-004': { objectId: 156868, notes: 'Victorian cameo' },
  'jwl-005': { objectId: 156869, notes: 'Tiffany jewelry' },
  'jwl-006': { objectId: 203428, notes: 'Chronograph watch' },

  // SILVER
  'silv-001': { objectId: 198356, notes: 'Georgian silver teapot' },
  'silv-002': { objectId: 15245, notes: 'Gorham silver' },
  'silv-003': { objectId: 15246, notes: 'American sterling flatware' },
  'silv-004': { objectId: 4330, notes: 'Paul Revere bowl' },
  'silv-005': { objectId: 484936, notes: 'Danish modern silver' },

  // GLASS
  'glass-001': { objectId: 14882, notes: 'Tiffany Favrile glass' },
  'glass-002': { objectId: 486421, notes: 'Lalique glass' },
  'glass-003': { objectId: 12456, notes: 'American pressed glass' },
  'glass-004': { objectId: 207016, notes: 'Venetian glass' },

  // TEXTILES
  'text-001': { objectId: 159131, notes: 'Navajo textile' },
  'text-002': { objectId: 447927, notes: 'Persian carpet' },
  'text-003': { objectId: 13065, notes: 'American quilt' },

  // TOYS & COLLECTIBLES
  'toy-001': { objectId: 682399, notes: 'Antique toy' },
  'toy-002': { objectId: 12458, notes: 'Cast iron toy' },
  'toy-003': { objectId: 159132, notes: 'Vintage doll' },
  'toy-004': { objectId: 13066, notes: 'Model train' },

  // LIGHTING
  'light-001': { objectId: 14883, notes: 'Tiffany lamp' },
  'light-002': { objectId: 284001, notes: 'Art Deco lamp' },

  // BOOKS
  'book-001': { objectId: 337496, notes: 'Rare book/manuscript' },
  'book-002': { objectId: 337497, notes: 'Print or ephemera' }
}

interface MetObject {
  objectID: number
  title: string
  primaryImage: string
  primaryImageSmall: string
  objectDate: string
  culture: string
  medium: string
  department: string
  artistDisplayName: string
  objectURL: string
  isPublicDomain: boolean
}

/**
 * Get object details from Met API
 */
async function getMetObject(objectId: number): Promise<MetObject | null> {
  try {
    const response = await fetch(`${MET_API}/objects/${objectId}`)
    if (!response.ok) {
      console.log(`  API returned ${response.status}`)
      return null
    }
    return await response.json() as MetObject
  } catch (error) {
    console.log(`  Error: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

/**
 * Search Met API for alternatives if curated ID doesn't work
 */
async function searchMetForItem(item: GroundTruthItem): Promise<number[]> {
  const searchTerms = [
    item.expected.name,
    item.expected.style,
    item.expected.maker,
    `${item.expected.domainExpert} ${item.expected.originRegion}`
  ].filter(Boolean)

  const results: number[] = []

  for (const term of searchTerms.slice(0, 2)) {
    try {
      const response = await fetch(
        `${MET_API}/search?hasImages=true&isPublicDomain=true&q=${encodeURIComponent(term!)}`
      )
      if (response.ok) {
        const data = await response.json() as { objectIDs: number[] | null }
        if (data.objectIDs) {
          results.push(...data.objectIDs.slice(0, 5))
        }
      }
      await sleep(500)
    } catch {
      // Continue with next term
    }
  }

  return [...new Set(results)] // Remove duplicates
}

/**
 * Download image
 */
async function downloadImage(url: string, localPath: string): Promise<boolean> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.log(`  HTTP ${response.status}`)
      return false
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    const dir = join(process.cwd(), IMAGE_DIR)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    writeFileSync(localPath, buffer)
    console.log(`  ✓ Downloaded: ${(buffer.length / 1024).toFixed(1)}KB`)
    return true
  } catch (error) {
    console.log(`  Error: ${error instanceof Error ? error.message : String(error)}`)
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
  console.log('    METROPOLITAN MUSEUM OPEN ACCESS IMAGE DOWNLOADER')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('')
  console.log('The Met Museum Open Access collection provides:')
  console.log('• Professional museum-quality photography')
  console.log('• Public domain licensing')
  console.log('• No rate limiting')
  console.log('• High resolution images')
  console.log('')

  const outputDir = join(process.cwd(), OUTPUT_DIR)
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  const results: {
    id: string
    metObjectId: number | null
    metData: MetObject | null
    localPath: string | null
    groundTruth: GroundTruthItem
  }[] = []

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < GROUND_TRUTH_ITEMS.length; i++) {
    const item = GROUND_TRUTH_ITEMS[i]
    console.log(`\n[${i + 1}/${GROUND_TRUTH_ITEMS.length}] ${item.id}: ${item.expected.name}`)

    const curated = CURATED_MET_OBJECTS[item.id]
    let metObject: MetObject | null = null
    let objectId: number | null = null

    // Try curated ID first
    if (curated) {
      console.log(`  📌 Using curated Met object #${curated.objectId}`)
      metObject = await getMetObject(curated.objectId)
      objectId = curated.objectId
    }

    // If curated didn't work, search for alternatives
    if (!metObject?.primaryImage) {
      console.log(`  🔍 Searching for alternatives...`)
      const alternatives = await searchMetForItem(item)

      for (const altId of alternatives) {
        const alt = await getMetObject(altId)
        if (alt?.primaryImage && alt.isPublicDomain) {
          metObject = alt
          objectId = altId
          console.log(`  Found: "${alt.title.substring(0, 50)}..."`)
          break
        }
        await sleep(DELAY_MS)
      }
    }

    // Download if we found an image
    if (metObject?.primaryImage) {
      console.log(`  🖼️ ${metObject.title.substring(0, 50)}...`)
      console.log(`  📅 ${metObject.objectDate || 'Unknown date'}`)
      console.log(`  🎨 ${metObject.medium?.substring(0, 50) || 'Unknown medium'}`)

      const extension = metObject.primaryImage.includes('.png') ? 'png' : 'jpg'
      const localPath = join(process.cwd(), IMAGE_DIR, `${item.id}.${extension}`)

      // Use smaller image for faster download, can switch to primaryImage for full res
      const imageUrl = metObject.primaryImageSmall || metObject.primaryImage
      const success = await downloadImage(imageUrl, localPath)

      if (success) {
        results.push({
          id: item.id,
          metObjectId: objectId,
          metData: metObject,
          localPath,
          groundTruth: item
        })
        successCount++
      } else {
        results.push({
          id: item.id,
          metObjectId: objectId,
          metData: metObject,
          localPath: null,
          groundTruth: item
        })
        failCount++
      }
    } else {
      console.log(`  ❌ No suitable image found`)
      results.push({
        id: item.id,
        metObjectId: null,
        metData: null,
        localPath: null,
        groundTruth: item
      })
      failCount++
    }

    await sleep(DELAY_MS)
  }

  // Save manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    source: 'Metropolitan Museum of Art Open Access API',
    totalItems: GROUND_TRUTH_ITEMS.length,
    downloaded: successCount,
    failed: failCount,
    items: results.map(r => ({
      id: r.id,
      metObjectId: r.metObjectId,
      metTitle: r.metData?.title || null,
      metObjectDate: r.metData?.objectDate || null,
      metMedium: r.metData?.medium || null,
      metUrl: r.metData?.objectURL || null,
      localPath: r.localPath,
      groundTruthName: r.groundTruth.expected.name
    }))
  }

  const manifestPath = join(outputDir, 'met-museum-manifest.json')
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('                         COMPLETE')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`✅ Downloaded: ${successCount}/${GROUND_TRUTH_ITEMS.length}`)
  console.log(`❌ Failed: ${failCount}/${GROUND_TRUTH_ITEMS.length}`)
  console.log(`📄 Manifest: ${manifestPath}`)

  if (failCount > 0) {
    console.log('\nFailed items (need manual curation):')
    results.filter(r => !r.localPath).forEach(r => {
      console.log(`  - ${r.id}: ${r.groundTruth.expected.name}`)
    })
  }
}

main().catch(console.error)
