#!/usr/bin/env npx tsx
/**
 * Test Image Download and Storage Script
 * Downloads all 50 ground truth images and stores them in MinIO
 *
 * Run with: npx tsx src/testing/downloadTestImages.ts
 *
 * This script:
 * 1. Reads all ground truth items
 * 2. Downloads each image slowly (with delays to avoid rate limits)
 * 3. Uploads to MinIO with metadata
 * 4. Generates enhanced expert knowledge for each item
 * 5. Creates a local manifest file
 */

import { GROUND_TRUTH_ITEMS, GroundTruthItem } from './groundTruth.js'
import { s3Client, initializeBucket, getImageUrl } from '../storage/client.js'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { env } from '../config/env.js'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Delay between requests (5 seconds to be respectful to Wikipedia)
const REQUEST_DELAY_MS = 5000

// Local save directory for backup
const LOCAL_IMAGE_DIR = 'test-data/images'

// User-Agent for Wikipedia
const USER_AGENT = 'VintageVision/1.0 (Antique Analysis Testing; https://vintagevision.space; polite-bot)'

/**
 * Expert-level knowledge database for each item
 * This is what a seasoned expert would know about each piece
 */
interface ExpertKnowledge {
  // Core identification
  quickIdentification: string // What an expert spots in first 2 seconds
  deepDiveNotes: string // Detailed analysis an expert would provide

  // Authentication guidance
  authenticityChecklist: string[]
  commonFakes: string[] // Known reproduction issues
  buyerBeware: string[] // Red flags to watch for

  // Market intelligence
  marketTrends: string
  bestSellingVenues: string[]
  targetBuyers: string[]

  // Condition assessment factors
  conditionFactors: string[]
  restorationImpact: string // How restoration affects value

  // Historical context
  historicalSignificance: string
  designerBackground: string | null
  culturalContext: string

  // Comparable sales (fictional but realistic)
  recentSalesExamples: { date: string; venue: string; price: number; condition: string }[]
}

/**
 * Generate expert knowledge for each item category
 */
function generateExpertKnowledge(item: GroundTruthItem): ExpertKnowledge {
  const e = item.expected

  // Category-specific expert knowledge
  const expertKnowledge: Record<string, Partial<ExpertKnowledge>> = {
    'furn-001': {
      quickIdentification: 'Instantly recognizable Eames silhouette - the angle of recline, rosewood shells, and aluminum base are unmistakable. Check for proper proportions - fakes often have subtle dimensional errors.',
      deepDiveNotes: 'The Eames 670/671 has been in continuous production since 1956. Vintage examples (pre-1990s) command premium. Look for: quality of rosewood veneer grain, original shock mounts (rubber), leather patina. Herman Miller medallions changed over decades - research specific era. Vitra produces licensed European versions.',
      authenticityChecklist: [
        'Herman Miller medallion present on underside',
        'Model numbers 670 (chair) and 671 (ottoman) stamped',
        'Correct shock mount configuration',
        'Proper five-star aluminum base (not four-star)',
        'Correct arm height and back angle',
        'Quality rosewood or walnut veneer (not laminate)'
      ],
      commonFakes: [
        'Chinese reproductions with dimensional errors',
        'Lower quality leather that cracks differently',
        'Incorrect base configurations',
        'Wrong button tufting pattern'
      ],
      buyerBeware: [
        'Replaced shock mounts can indicate heavy use',
        'Re-veneered shells significantly reduce value',
        'Replaced leather is common but affects price',
        'Verify serial number matches production era'
      ],
      marketTrends: 'Strong steady demand. Vintage 1960s-70s examples with original leather in excellent condition fetch premiums. Rosewood increasingly scarce due to CITES restrictions on new production.',
      bestSellingVenues: ['1stDibs', 'Chairish', 'Wright Auctions', 'Design Within Reach (new)'],
      targetBuyers: ['Mid-century collectors', 'Interior designers', 'Home office upgraders', 'Investment buyers'],
      conditionFactors: [
        'Shell veneer condition (chips, lifting)',
        'Leather wear and patina (desirable vs damage)',
        'Base scratches and pitting',
        'Shock mount integrity',
        'Foam condition in cushions'
      ],
      restorationImpact: 'Professional restoration can maintain 70-80% of original value. Amateur restoration significantly damages value. Original condition always preferred.',
      historicalSignificance: 'Designed by Charles and Ray Eames as a modern interpretation of the English club chair. First publicly revealed on NBC\'s Home show in 1956. Became an icon of mid-century design and remains in production.',
      designerBackground: 'Charles and Ray Eames were the most influential American designers of the 20th century. Their Eames Office produced furniture, films, and exhibitions that defined modernism.',
      culturalContext: 'Represents the post-war American optimism and the democratization of good design. Featured in countless films and TV shows as a signifier of sophisticated taste.',
      recentSalesExamples: [
        { date: '2024-09', venue: 'Wright Auctions', price: 7200, condition: 'Original leather, vintage 1970s' },
        { date: '2024-06', venue: '1stDibs', price: 5800, condition: 'Restored, 1980s production' },
        { date: '2024-03', venue: 'Chairish', price: 4900, condition: 'Good, modern production' }
      ]
    },
    'furn-002': {
      quickIdentification: 'Barcelona Chair - the X-frame profile is unmistakable. Authentic versions have precise, mirrored chrome welds. Check cushion tufting pattern (should be hand-welted).',
      deepDiveNotes: 'Designed by Mies van der Rohe for the German Pavilion at 1929 Barcelona International Exposition. Knoll has produced since 1953. Vintage Gavina pieces (1960s) are particularly collectible.',
      authenticityChecklist: [
        'Knoll Studio stamp on frame',
        'Mies signature on frame',
        'Precise chrome welding quality',
        'Hand-welted leather cushions',
        'Correct strap tension system'
      ],
      commonFakes: [
        'Low-quality chrome that pits easily',
        'Machine-stitched cushions',
        'Incorrect X-frame proportions',
        'Vinyl instead of leather'
      ],
      marketTrends: 'Steady demand as design icon. White leather most popular currently. Vintage Gavina examples fetch premium.',
      bestSellingVenues: ['Knoll dealers', '1stDibs', 'Design Within Reach'],
      targetBuyers: ['Architects', 'Corporate offices', 'Modern home collectors']
    },
    'ceram-003': {
      quickIdentification: 'Roseville Pinecone - the matte glaze and naturalistic pinecone relief are signature. Check the sharp molding detail and look for impressed marks.',
      deepDiveNotes: 'Roseville Pottery of Zanesville, Ohio produced Pinecone from 1931-1954. Most desirable colors: green, blue, and brown. Large pieces and unusual forms command premium. Reproductions exist.',
      authenticityChecklist: [
        'Impressed ROSEVILLE mark',
        'U.S.A. mark present',
        'Sharp mold detail on pinecones',
        'Period-appropriate glaze',
        'Correct shape numbers'
      ],
      commonFakes: [
        'Modern reproductions with softer detail',
        'Unmarked pieces claimed as Roseville',
        'Incorrect color variations'
      ],
      marketTrends: 'American art pottery remains popular with collectors. Prices stable. Large floor vases and unusual shapes premium.',
      bestSellingVenues: ['Ruby Lane', 'eBay', 'Replacements.com', 'American art pottery shows']
    }
  }

  // Default expert knowledge for items without specific entries
  const defaultKnowledge: ExpertKnowledge = {
    quickIdentification: `${e.name} - Look for characteristic ${e.style} features and period-appropriate construction.`,
    deepDiveNotes: `A ${e.domainExpert} piece in the ${e.style} style from approximately ${e.era}. ${e.maker ? `Made by ${e.maker}.` : 'Maker attribution varies.'} Key features include: ${e.mustIdentifyFeatures.slice(0, 3).join(', ')}.`,
    authenticityChecklist: [
      ...(e.authenticationMarkers || []),
      'Period-appropriate materials',
      'Correct construction techniques',
      'Appropriate wear patterns'
    ],
    commonFakes: [
      `${e.style} reproductions are common`,
      'Look for modern materials or techniques',
      'Check for artificially aged surfaces'
    ],
    buyerBeware: e.redFlags || [
      'Verify provenance when possible',
      'Check for restoration or repairs',
      'Research current market prices'
    ],
    marketTrends: `${e.domainExpert} items in ${e.style} style maintain steady collector interest. Condition significantly impacts value.`,
    bestSellingVenues: ['1stDibs', 'Ruby Lane', 'Specialized auction houses', 'eBay'],
    targetBuyers: [`${e.domainExpert} collectors`, 'Interior designers', 'Museums'],
    conditionFactors: [
      'Surface wear and patina',
      'Structural integrity',
      'Original components present',
      'Previous restoration quality'
    ],
    restorationImpact: 'Professional restoration can maintain value if documented. Extensive restoration reduces collector appeal.',
    historicalSignificance: `Representative example of ${e.style} ${e.domainExpert} from ${e.era}. ${e.maker ? `${e.maker} was a significant producer in this category.` : 'Period piece with typical characteristics.'}`,
    designerBackground: e.maker || null,
    culturalContext: `${e.style} reflected the aesthetic values of ${e.era}. Collected by ${e.domainExpert} enthusiasts and design historians.`,
    recentSalesExamples: [
      { date: '2024-08', venue: 'Auction', price: Math.round((e.valueMin + e.valueMax) / 2), condition: 'Good' },
      { date: '2024-04', venue: 'Dealer', price: Math.round(e.valueMax * 0.9), condition: 'Excellent' },
      { date: '2023-12', venue: 'eBay', price: Math.round(e.valueMin * 1.1), condition: 'Fair' }
    ]
  }

  // Merge specific knowledge with defaults
  const specific = expertKnowledge[item.id] || {}
  return { ...defaultKnowledge, ...specific } as ExpertKnowledge
}

/**
 * Extract filename from Wikipedia Commons URL
 */
function extractWikipediaFilename(url: string): string | null {
  // URLs like: https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Eames_Lounge_Chair.jpg/800px-Eames_Lounge_Chair.jpg
  const match = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif)/i)
  if (match) {
    // Extract the original filename (before the thumbnail size prefix)
    const parts = match[0].split('/')
    const filename = parts[parts.length - 1]
    // Remove size prefix like "800px-"
    const cleanName = filename.replace(/^\d+px-/, '')
    return cleanName
  }
  return null
}

/**
 * Get proper thumbnail URL from Wikipedia Commons API
 */
async function getWikipediaApiThumbnail(originalUrl: string): Promise<string | null> {
  const filename = extractWikipediaFilename(originalUrl)
  if (!filename) return null

  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`

  try {
    const response = await fetch(apiUrl, {
      headers: { 'User-Agent': USER_AGENT }
    })

    if (!response.ok) return null

    const data = await response.json() as any
    const pages = data.query?.pages
    if (!pages) return null

    const pageId = Object.keys(pages)[0]
    const thumbUrl = pages[pageId]?.imageinfo?.[0]?.thumburl
    return thumbUrl || null
  } catch (error) {
    return null
  }
}

/**
 * Download image with retry and delay
 */
async function downloadImage(url: string, itemId: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  console.log(`  📥 Fetching: ${url.substring(0, 70)}...`)

  // First, try to get a proper API thumbnail URL (less likely to be blocked)
  const apiThumbnail = await getWikipediaApiThumbnail(url)
  const fetchUrl = apiThumbnail || url

  if (apiThumbnail && apiThumbnail !== url) {
    console.log(`  🔄 Using API thumbnail URL instead`)
  }

  try {
    const response = await fetch(fetchUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'image/webp,image/*,*/*;q=0.8'
      }
    })

    if (!response.ok) {
      console.log(`  ⚠️ HTTP ${response.status}: ${response.statusText.substring(0, 50)}`)

      // Try one more time with original URL if we used API URL
      if (apiThumbnail && fetchUrl !== url) {
        console.log(`  🔁 Retrying with original URL after delay...`)
        await sleep(2000)
        const retry = await fetch(url, {
          headers: {
            'User-Agent': USER_AGENT,
            'Accept': 'image/webp,image/*,*/*;q=0.8'
          }
        })
        if (retry.ok) {
          const buffer = Buffer.from(await retry.arrayBuffer())
          const mimeType = retry.headers.get('content-type') || 'image/jpeg'
          console.log(`  ✓ Downloaded on retry: ${(buffer.length / 1024).toFixed(1)}KB`)
          return { buffer, mimeType }
        }
      }

      return null
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const mimeType = response.headers.get('content-type') || 'image/jpeg'
    console.log(`  ✓ Downloaded: ${(buffer.length / 1024).toFixed(1)}KB (${mimeType})`)

    // Save locally as backup
    const localDir = join(process.cwd(), LOCAL_IMAGE_DIR)
    if (!existsSync(localDir)) {
      mkdirSync(localDir, { recursive: true })
    }
    const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg'
    const localPath = join(localDir, `${itemId}.${ext}`)
    writeFileSync(localPath, buffer)
    console.log(`  💾 Saved locally: ${localPath}`)

    return { buffer, mimeType }
  } catch (error) {
    console.log(`  ✗ Error: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Upload image to MinIO and return URL
 */
async function uploadToMinIO(buffer: Buffer, mimeType: string, itemId: string): Promise<string | null> {
  try {
    const extension = mimeType.includes('png') ? 'png' : 'jpg'
    const key = `test-images/${itemId}.${extension}`

    // Upload directly using S3 client
    await s3Client.send(new PutObjectCommand({
      Bucket: env.MINIO_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      Metadata: {
        itemId: itemId,
        uploadedAt: new Date().toISOString(),
        source: 'ground-truth-test-set'
      }
    }))

    // Get presigned URL (valid for 7 days)
    const url = await getImageUrl(key, 7 * 24 * 60 * 60)

    console.log(`  ✓ Uploaded to MinIO: ${key}`)
    return url
  } catch (error) {
    console.log(`  ✗ MinIO upload failed: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

/**
 * Main download process
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('           VINTAGEVISION TEST IMAGE DOWNLOADER')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`📦 Total items: ${GROUND_TRUTH_ITEMS.length}`)
  console.log(`⏱️  Delay between requests: ${REQUEST_DELAY_MS / 1000}s`)
  console.log('')

  // Initialize MinIO bucket
  try {
    await initializeBucket()
    console.log('✅ MinIO storage ready')
  } catch (error) {
    console.log('⚠️  MinIO not available - images will be saved locally only')
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`)
  }

  // Create local output directory
  const outputDir = join(process.cwd(), 'test-data')
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  // Track results
  const manifest: {
    downloadedAt: string
    totalItems: number
    successful: number
    failed: number
    items: {
      id: string
      originalUrl: string
      minioUrl: string | null
      minioKey: string | null
      expertKnowledge: ExpertKnowledge
      groundTruth: GroundTruthItem
    }[]
  } = {
    downloadedAt: new Date().toISOString(),
    totalItems: GROUND_TRUTH_ITEMS.length,
    successful: 0,
    failed: 0,
    items: []
  }

  for (let i = 0; i < GROUND_TRUTH_ITEMS.length; i++) {
    const item = GROUND_TRUTH_ITEMS[i]
    console.log(`\n[${i + 1}/${GROUND_TRUTH_ITEMS.length}] ${item.id}: ${item.expected.name}`)

    // Generate expert knowledge
    const expertKnowledge = generateExpertKnowledge(item)

    // Download image
    const downloadResult = await downloadImage(item.imageUrl, item.id)

    let minioUrl: string | null = null
    let minioKey: string | null = null

    if (downloadResult) {
      // Upload to MinIO
      minioUrl = await uploadToMinIO(downloadResult.buffer, downloadResult.mimeType, item.id)
      if (minioUrl) {
        minioKey = `test-images/${item.id}.${downloadResult.mimeType.includes('png') ? 'png' : 'jpg'}`
        manifest.successful++
      } else {
        manifest.failed++
      }
    } else {
      manifest.failed++
    }

    // Add to manifest
    manifest.items.push({
      id: item.id,
      originalUrl: item.imageUrl,
      minioUrl,
      minioKey,
      expertKnowledge,
      groundTruth: item
    })

    // Delay before next request
    if (i < GROUND_TRUTH_ITEMS.length - 1) {
      console.log(`  ⏳ Waiting ${REQUEST_DELAY_MS / 1000}s before next request...`)
      await sleep(REQUEST_DELAY_MS)
    }
  }

  // Save manifest
  const manifestPath = join(outputDir, 'test-manifest.json')
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`\n📄 Manifest saved to: ${manifestPath}`)

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('                         SUMMARY')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`✅ Successful: ${manifest.successful}/${manifest.totalItems}`)
  console.log(`❌ Failed: ${manifest.failed}/${manifest.totalItems}`)
  console.log('')

  if (manifest.failed > 0) {
    console.log('Failed items:')
    manifest.items.filter(i => !i.minioUrl).forEach(i => {
      console.log(`  - ${i.id}: ${i.groundTruth.expected.name}`)
    })
  }

  // Generate updated ground truth file
  const updatedGroundTruthPath = join(outputDir, 'groundTruthWithMinIO.ts')
  const gtContent = generateUpdatedGroundTruth(manifest)
  writeFileSync(updatedGroundTruthPath, gtContent)
  console.log(`\n📝 Updated ground truth saved to: ${updatedGroundTruthPath}`)
}

interface TestManifest {
  downloadedAt: string
  totalItems: number
  successful: number
  failed: number
  items: {
    id: string
    originalUrl: string
    minioUrl: string | null
    minioKey: string | null
    expertKnowledge: ExpertKnowledge
    groundTruth: GroundTruthItem
  }[]
}

/**
 * Generate TypeScript file with MinIO URLs
 */
function generateUpdatedGroundTruth(manifest: TestManifest): string {
  const lines = [
    '/**',
    ' * Ground Truth Test Dataset - With MinIO URLs',
    ' * Auto-generated from downloadTestImages.ts',
    ' * Generated: ' + new Date().toISOString(),
    ' */',
    '',
    'export interface LocalGroundTruthItem {',
    '  id: string',
    '  imageUrl: string  // MinIO URL',
    '  originalUrl: string  // Original Wikipedia URL',
    '  groundTruth: any',
    '  expertKnowledge: any',
    '}',
    '',
    'export const LOCAL_GROUND_TRUTH: LocalGroundTruthItem[] = ['
  ]

  for (const item of manifest.items) {
    if (item.minioUrl) {
      lines.push(`  {`)
      lines.push(`    id: '${item.id}',`)
      lines.push(`    imageUrl: '${item.minioUrl}',`)
      lines.push(`    originalUrl: '${item.originalUrl}',`)
      lines.push(`    groundTruth: ${JSON.stringify(item.groundTruth, null, 4).split('\n').join('\n    ')},`)
      lines.push(`    expertKnowledge: ${JSON.stringify(item.expertKnowledge, null, 4).split('\n').join('\n    ')}`)
      lines.push(`  },`)
    }
  }

  lines.push(']')
  lines.push('')

  return lines.join('\n')
}

// Run
main().catch(console.error)
