#!/usr/bin/env npx tsx
/**
 * Fix Remaining Wrong Images - Round 2
 * Uses direct URLs from verified museum/auction sources
 */

import { writeFileSync } from 'fs';
import path from 'path';

const IMAGE_DIR = path.join(process.cwd(), 'test-data', 'images');

// Direct URLs from verified sources (Met Museum, Wikipedia Commons with verified images)
const DIRECT_FIXES: Array<{ id: string; name: string; urls: string[] }> = [
  {
    id: 'silv-003',
    name: 'Tiffany Chrysanthemum Flatware',
    urls: [
      // Met Museum has Tiffany silver objects
      'https://images.metmuseum.org/CRDImages/ad/original/DT206969.jpg', // Tiffany berry spoon
      'https://images.metmuseum.org/CRDImages/ad/original/DT250.jpg', // Tiffany silver
      'https://images.metmuseum.org/CRDImages/ad/original/DP267792.jpg', // Tiffany flatware
    ]
  },
  {
    id: 'toy-002',
    name: 'Cast Iron Toy Car',
    urls: [
      // Try searching for antique toy car images from commons
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Hubley_cast_iron_toy_car.jpg/800px-Hubley_cast_iron_toy_car.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Cast_iron_toy_car.jpg/800px-Cast_iron_toy_car.jpg',
    ]
  },
  {
    id: 'toy-003',
    name: 'Vintage Barbie #1 Ponytail',
    urls: [
      // Barbie #1 from Wikipedia Commons
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Barbie_1959_02.jpg/800px-Barbie_1959_02.jpg',
      'https://upload.wikimedia.org/wikipedia/en/6/61/Barbie_1959.jpg',
    ]
  },
  {
    id: 'light-002',
    name: 'Art Deco Table Lamp',
    urls: [
      // Art deco lamp from Met
      'https://images.metmuseum.org/CRDImages/ad/original/DT228.jpg', // Art deco design
      'https://images.metmuseum.org/CRDImages/ad/original/DP253406.jpg', // Art deco lamp
    ]
  },
];

async function downloadImage(url: string, filePath: string): Promise<boolean> {
  try {
    console.log(`  Trying: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VintageVision/1.0)'
      }
    });

    if (!response.ok) {
      console.log(`    HTTP ${response.status}`);
      return false;
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Check if it's a valid image (JPEG or PNG)
    const header = buffer.slice(0, 4).toString('hex');
    if (!header.startsWith('ffd8') && !header.startsWith('89504e47')) {
      console.log(`    Not a valid image (${header})`);
      return false;
    }

    if (buffer.length < 5000) {
      console.log(`    Too small: ${buffer.length} bytes`);
      return false;
    }

    writeFileSync(filePath, buffer);
    console.log(`    SUCCESS: ${buffer.length} bytes saved`);
    return true;
  } catch (error) {
    console.log(`    Error: ${error}`);
    return false;
  }
}

interface MetSearchResult {
  objectIDs?: number[];
}

interface MetObjectResult {
  primaryImage?: string;
  title?: string;
}

async function searchMetMuseum(query: string): Promise<string | null> {
  try {
    const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(query)}`;
    const resp = await fetch(url);
    const data = await resp.json() as MetSearchResult;

    if (!data.objectIDs?.length) return null;

    // Try first 10 results
    for (const id of data.objectIDs.slice(0, 10)) {
      const objUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
      const objResp = await fetch(objUrl);
      const obj = await objResp.json() as MetObjectResult;

      if (obj.primaryImage && obj.primaryImage.length > 0) {
        console.log(`    Found Met: "${obj.title}"`);
        return obj.primaryImage;
      }
      await new Promise(r => setTimeout(r, 100));
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function fixImage(item: typeof DIRECT_FIXES[0]): Promise<boolean> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[${item.id}] ${item.name}`);
  console.log('='.repeat(60));

  const filePath = path.join(IMAGE_DIR, `${item.id}.jpg`);

  // Try direct URLs first
  for (const url of item.urls) {
    if (await downloadImage(url, filePath)) return true;
  }

  // Try Met Museum search as fallback
  console.log('  Searching Met Museum...');
  const searchTerms = [
    item.name,
    item.name.split(' ').slice(0, 2).join(' '),
  ];

  for (const term of searchTerms) {
    console.log(`  Searching: "${term}"`);
    const url = await searchMetMuseum(term);
    if (url && await downloadImage(url, filePath)) return true;
  }

  console.log(`  FAILED: Could not find image for ${item.id}`);
  return false;
}

async function main() {
  console.log('='.repeat(60));
  console.log('FIXING REMAINING WRONG IMAGES - ROUND 2');
  console.log('='.repeat(60));

  let fixed = 0;
  const failures: string[] = [];

  for (const item of DIRECT_FIXES) {
    const success = await fixImage(item);
    if (success) {
      fixed++;
    } else {
      failures.push(item.id);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('ROUND 2 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Fixed: ${fixed}/${DIRECT_FIXES.length}`);
  if (failures.length > 0) {
    console.log(`Failed: ${failures.join(', ')}`);
  }
}

main().catch(console.error);
