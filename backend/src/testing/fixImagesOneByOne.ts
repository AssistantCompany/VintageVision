#!/usr/bin/env npx tsx
/**
 * Fix Wrong Test Images One by One
 * Uses multiple sources to find correct images
 */

import { writeFileSync, existsSync } from 'fs';
import path from 'path';

const IMAGE_DIR = path.join(process.cwd(), 'test-data', 'images');

interface ImageFix {
  id: string;
  name: string;
  metSearchTerms: string[];  // Met Museum search
  wikiArticles: string[];    // Wikipedia articles
  commonsSearch: string[];   // Wikimedia Commons search terms
}

const IMAGES_TO_FIX: ImageFix[] = [
  {
    id: 'silv-003',
    name: 'Tiffany Chrysanthemum Flatware',
    metSearchTerms: ['tiffany flatware', 'tiffany silver fork', 'chrysanthemum silver'],
    wikiArticles: ['Tiffany_%26_Co.'],
    commonsSearch: ['tiffany silver spoon', 'sterling silver flatware ornate', 'antique silver fork'],
  },
  {
    id: 'light-002',
    name: 'Art Deco Table Lamp',
    metSearchTerms: ['art deco lamp', 'table lamp 1930'],
    wikiArticles: ['Art_Deco'],
    commonsSearch: ['art deco lamp bronze', 'frankart lamp', '1930s table lamp'],
  },
  {
    id: 'toy-003',
    name: 'Vintage Barbie #1 Ponytail',
    metSearchTerms: [],
    wikiArticles: ['Barbie'],
    commonsSearch: ['barbie doll vintage 1959', 'barbie ponytail original', 'mattel barbie first'],
  },
  {
    id: 'toy-002',
    name: 'Cast Iron Toy Car',
    metSearchTerms: ['toy car', 'cast iron toy'],
    wikiArticles: ['Cast-iron_toy'],
    commonsSearch: ['cast iron toy automobile', 'hubley toy', 'arcade toy car', 'antique metal toy car'],
  },
  {
    id: 'toy-001',
    name: 'Steiff Teddy Bear',
    metSearchTerms: ['teddy bear'],
    wikiArticles: ['Steiff', 'Teddy_bear'],
    commonsSearch: ['steiff bear vintage', 'antique teddy bear mohair', 'early teddy bear'],
  },
  {
    id: 'furn-006',
    name: 'Chippendale Side Chair',
    metSearchTerms: ['chippendale chair', 'side chair 18th century', 'ball claw chair'],
    wikiArticles: ['Chippendale_furniture'],
    commonsSearch: ['chippendale side chair', 'ball and claw foot chair', 'philadelphia chippendale'],
  },
  {
    id: 'furn-008',
    name: 'Shaker Rocking Chair',
    metSearchTerms: ['shaker chair', 'rocking chair shaker'],
    wikiArticles: ['Shaker_furniture'],
    commonsSearch: ['shaker rocking chair', 'shaker rocker tape seat', 'mount lebanon chair'],
  },
  {
    id: 'silv-001',
    name: 'Georgian Sterling Silver Teapot',
    metSearchTerms: ['silver teapot', 'georgian teapot', 'sterling teapot 18th'],
    wikiArticles: ['Silver_teapot'],
    commonsSearch: ['georgian silver teapot', 'sterling silver teapot antique', 'english silver teapot'],
  },
  {
    id: 'ceram-001',
    name: 'Rookwood Standard Glaze Vase',
    metSearchTerms: ['rookwood pottery', 'rookwood vase'],
    wikiArticles: ['Rookwood_Pottery_Company'],
    commonsSearch: ['rookwood vase brown', 'rookwood standard glaze', 'rookwood pottery floral'],
  },
];

interface MetSearchResponse {
  objectIDs?: number[];
}

interface MetObjectResponse {
  title?: string;
  primaryImage?: string;
}

async function searchMetMuseum(term: string): Promise<string | null> {
  try {
    const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(term)}`;
    const searchResp = await fetch(searchUrl);
    const searchData = await searchResp.json() as MetSearchResponse;

    if (!searchData.objectIDs || searchData.objectIDs.length === 0) return null;

    // Try first 5 results to find one with a good image
    for (const objectId of searchData.objectIDs.slice(0, 5)) {
      const objUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
      const objResp = await fetch(objUrl);
      const objData = await objResp.json() as MetObjectResponse;

      if (objData.primaryImage && objData.primaryImage.length > 0) {
        console.log(`    Found Met object: ${objData.title}`);
        return objData.primaryImage;
      }
      await delay(200);
    }
    return null;
  } catch (error) {
    console.error(`    Met search error:`, error);
    return null;
  }
}

interface WikipediaImageResponse {
  query?: {
    pages?: Record<string, {
      thumbnail?: { source?: string };
    }>;
  };
}

async function getWikipediaImage(article: string): Promise<string | null> {
  try {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${article}&prop=pageimages&format=json&pithumbsize=1000&origin=*`;
    const response = await fetch(apiUrl);
    const data = await response.json() as WikipediaImageResponse;

    const pages = data.query?.pages || {};
    const page = Object.values(pages)[0];

    if (page?.thumbnail?.source) {
      return page.thumbnail.source;
    }
    return null;
  } catch (error) {
    return null;
  }
}

interface WikimediaSearchResponse {
  query?: {
    search?: Array<{ title: string }>;
  };
}

interface WikimediaImageInfoResponse {
  query?: {
    pages?: Record<string, {
      imageinfo?: Array<{
        url?: string;
        width?: number;
        height?: number;
      }>;
    }>;
  };
}

async function searchWikimediaCommons(term: string): Promise<string | null> {
  try {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srnamespace=6&srlimit=10&format=json&origin=*`;
    const searchResp = await fetch(searchUrl);
    const searchData = await searchResp.json() as WikimediaSearchResponse;

    const results = searchData.query?.search || [];

    for (const result of results) {
      // Skip PDFs and SVGs
      const title = result.title;
      if (title.endsWith('.pdf') || title.endsWith('.svg')) continue;

      const fileName = title.replace('File:', '');
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url|size&format=json&origin=*`;
      const infoResp = await fetch(infoUrl);
      const infoData = await infoResp.json() as WikimediaImageInfoResponse;

      const pages = infoData.query?.pages || {};
      const page = Object.values(pages)[0];

      if (page?.imageinfo?.[0]) {
        const info = page.imageinfo[0];
        // Check size - skip tiny images
        if (info.width && info.width >= 400 && info.height && info.height >= 300 && info.url) {
          console.log(`    Found Commons: ${fileName.substring(0, 50)}...`);
          return info.url;
        }
      }
      await delay(100);
    }
    return null;
  } catch (error) {
    console.error(`    Commons search error:`, error);
    return null;
  }
}

async function downloadImage(url: string, filePath: string): Promise<boolean> {
  try {
    console.log(`    Downloading: ${url.substring(0, 70)}...`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`    HTTP ${response.status}`);
      return false;
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Verify it's actually an image
    const header = buffer.slice(0, 4).toString('hex');
    if (!header.startsWith('ffd8') && !header.startsWith('89504e47')) {
      console.error(`    Not a valid image (header: ${header})`);
      return false;
    }

    if (buffer.length < 5000) {
      console.error(`    Image too small: ${buffer.length} bytes`);
      return false;
    }

    writeFileSync(filePath, buffer);
    console.log(`    Saved: ${buffer.length} bytes`);
    return true;
  } catch (error) {
    console.error(`    Download error:`, error);
    return false;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fixImage(item: ImageFix): Promise<boolean> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[${item.id}] ${item.name}`);
  console.log('='.repeat(60));

  const filePath = path.join(IMAGE_DIR, `${item.id}.jpg`);

  // Try Met Museum first (best quality)
  for (const term of item.metSearchTerms) {
    console.log(`  Trying Met Museum: "${term}"`);
    const url = await searchMetMuseum(term);
    if (url) {
      if (await downloadImage(url, filePath)) return true;
    }
    await delay(500);
  }

  // Try Wikimedia Commons search
  for (const term of item.commonsSearch) {
    console.log(`  Trying Commons: "${term}"`);
    const url = await searchWikimediaCommons(term);
    if (url) {
      if (await downloadImage(url, filePath)) return true;
    }
    await delay(500);
  }

  // Try Wikipedia articles
  for (const article of item.wikiArticles) {
    console.log(`  Trying Wikipedia: "${article}"`);
    const url = await getWikipediaImage(article);
    if (url) {
      if (await downloadImage(url, filePath)) return true;
    }
    await delay(500);
  }

  console.log(`  FAILED: No suitable image found for ${item.id}`);
  return false;
}

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('FIXING WRONG TEST IMAGES ONE BY ONE');
  console.log('='.repeat(60));

  let fixed = 0;
  let failed = 0;
  const failures: string[] = [];

  for (const item of IMAGES_TO_FIX) {
    try {
      const success = await fixImage(item);
      if (success) {
        fixed++;
      } else {
        failed++;
        failures.push(item.id);
      }
    } catch (error) {
      console.error(`Error fixing ${item.id}:`, error);
      failed++;
      failures.push(item.id);
    }
    await delay(1000);
  }

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Fixed: ${fixed}`);
  console.log(`Failed: ${failed}`);
  if (failures.length > 0) {
    console.log(`\nFailed items: ${failures.join(', ')}`);
  }
}

main().catch(console.error);
