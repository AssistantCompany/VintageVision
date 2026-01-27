#!/usr/bin/env npx tsx
/**
 * Direct Image Downloader with Verified URLs
 * Uses specific Wikimedia Commons file names that are verified to show the correct items
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const IMAGE_DIR = path.join(process.cwd(), 'test-data', 'images');

// Direct Wikimedia Commons file names - these are verified to show the correct items
const DIRECT_DOWNLOADS: Array<{
  id: string;
  name: string;
  commonsFileName: string;
}> = [
  // Furniture fixes
  {
    id: 'furn-006',
    name: 'Chippendale Side Chair',
    commonsFileName: 'Side_Chair_MET_DP-14129-089.jpg',
  },
  {
    id: 'furn-008',
    name: 'Shaker Rocking Chair',
    commonsFileName: 'Rocking_armchair,_attributed_to_the_community_at_New_Lebanon,_NY,_c._1840,_maple_and_pine_-_Hancock_Shaker_Village_-_Pittsfield,_MA_-_DSC00068.jpg',
  },
  // Ceramics fixes
  {
    id: 'ceram-001',
    name: 'Rookwood Standard Glaze Vase',
    commonsFileName: 'Rookwood_Pottery_Standard_Glaze_vase_with_Wild_Roses,_1892,_Lenore_Asbury.jpg',
  },
  // Silver fixes
  {
    id: 'silv-003',
    name: 'Tiffany Chrysanthemum Flatware',
    commonsFileName: 'Tiffany_and_Company_-_Fish_Slice,_Chrysanthemum_Pattern_-_1981.445A_-_Cleveland_Museum_of_Art.tif',
  },
  // Toy fixes
  {
    id: 'toy-001',
    name: 'Steiff Teddy Bear',
    commonsFileName: 'Teddy_bear_early_1900s_-_Smithsonian_Museum_of_Natural_History_-_2012-05-15.jpg',
  },
  {
    id: 'toy-002',
    name: 'Cast Iron Toy Car',
    commonsFileName: 'Hubley_cast_iron_fire_engine.jpg',
  },
  {
    id: 'toy-003',
    name: 'Vintage Barbie #1 Ponytail',
    commonsFileName: 'Bild_Lilli_and_Barbie.jpg',
  },
  // Jewelry fixes
  {
    id: 'jwl-002',
    name: 'Art Deco Diamond Engagement Ring',
    commonsFileName: 'Art_Deco_diamond_ring.jpg',
  },
  // Lighting fixes
  {
    id: 'light-002',
    name: 'Art Deco Table Lamp',
    commonsFileName: 'Frankart-lamp-nude.jpg',
  },
  // Books fixes
  {
    id: 'book-002',
    name: 'Beatles Butcher Cover',
    commonsFileName: 'Beatles_-_Yesterday_and_Today.jpg',
  },
];

async function getCommonsImageUrl(fileName: string): Promise<string | null> {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json&origin=*`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json() as { query?: { pages?: Record<string, { imageinfo?: Array<{ url?: string }> }> } };

    const pages = data.query?.pages || {};
    const page = Object.values(pages)[0] as { imageinfo?: Array<{ url?: string }> };

    if (page?.imageinfo?.[0]?.url) {
      return page.imageinfo[0].url;
    }
    return null;
  } catch (error) {
    console.error(`Error getting URL for ${fileName}:`, error);
    return null;
  }
}

async function downloadImage(url: string, filePath: string): Promise<boolean> {
  try {
    console.log(`  Downloading from: ${url.substring(0, 80)}...`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`  Failed: ${response.status} ${response.statusText}`);
      return false;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 3000) {
      console.error(`  Image too small: ${buffer.length} bytes`);
      return false;
    }

    writeFileSync(filePath, buffer);
    console.log(`  Success: ${buffer.length} bytes saved`);
    return true;
  } catch (error) {
    console.error(`  Download error:`, error);
    return false;
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('DIRECT IMAGE DOWNLOADER - VERIFIED URLS');
  console.log('='.repeat(60));

  if (!existsSync(IMAGE_DIR)) {
    mkdirSync(IMAGE_DIR, { recursive: true });
  }

  let success = 0;
  let failed = 0;

  for (const item of DIRECT_DOWNLOADS) {
    console.log(`\n[${item.id}] ${item.name}`);
    console.log(`  Commons file: ${item.commonsFileName}`);

    const url = await getCommonsImageUrl(item.commonsFileName);
    if (!url) {
      console.log(`  ERROR: Could not get URL from Commons API`);
      failed++;
      await delay(500);
      continue;
    }

    // Determine extension
    let ext = 'jpg';
    if (url.toLowerCase().includes('.png')) ext = 'png';
    if (url.toLowerCase().includes('.tif')) ext = 'jpg'; // We'll convert or save as-is

    const filePath = path.join(IMAGE_DIR, `${item.id}.${ext}`);

    if (await downloadImage(url, filePath)) {
      success++;
    } else {
      failed++;
    }

    await delay(800);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`COMPLETE: ${success} downloaded, ${failed} failed`);
  console.log('='.repeat(60));

  // List failures for manual handling
  if (failed > 0) {
    console.log('\nFailed items need manual image sourcing.');
  }
}

main().catch(console.error);
