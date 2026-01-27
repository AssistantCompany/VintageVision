#!/usr/bin/env npx tsx
/**
 * Fix Wrong Test Images
 * Downloads correct images for items that have wrong images
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const IMAGE_DIR = path.join(process.cwd(), 'test-data', 'images');

// Items with wrong images and their correct Wikipedia articles
const FIXES_NEEDED = [
  {
    id: 'furn-006',
    name: 'Chippendale Side Chair',
    articles: ['Chippendale_furniture', 'Thomas_Chippendale'],
    searchTerms: ['chippendale chair 18th century'],
  },
  {
    id: 'furn-008',
    name: 'Shaker Rocking Chair',
    articles: ['Shaker_furniture', 'Shaker_style'],
    searchTerms: ['shaker rocking chair simple'],
  },
  {
    id: 'ceram-001',
    name: 'Rookwood Standard Glaze Vase',
    articles: ['Rookwood_Pottery_Company'],
    searchTerms: ['rookwood pottery vase brown glaze'],
  },
  {
    id: 'silv-001',
    name: 'Georgian Sterling Silver Teapot',
    articles: ['Georgian_silver', 'Silver_teapot'],
    searchTerms: ['georgian silver teapot 18th century'],
  },
  {
    id: 'silv-003',
    name: 'Tiffany Chrysanthemum Flatware',
    articles: ['Tiffany_%26_Co.'],
    searchTerms: ['tiffany sterling silver flatware chrysanthemum pattern'],
  },
  {
    id: 'glass-001',
    name: 'Tiffany Favrile Glass Vase',
    articles: ['Favrile_glass', 'Louis_Comfort_Tiffany'],
    searchTerms: ['tiffany favrile glass vase iridescent'],
  },
  {
    id: 'glass-002',
    name: 'Lalique Glass Vase',
    articles: ['Ren%C3%A9_Lalique', 'Lalique'],
    searchTerms: ['lalique glass vase art deco'],
  },
  {
    id: 'toy-001',
    name: 'Steiff Teddy Bear',
    articles: ['Steiff', 'Teddy_bear'],
    searchTerms: ['steiff teddy bear vintage'],
  },
  {
    id: 'toy-002',
    name: 'Cast Iron Toy Car',
    articles: ['Cast-iron_toy', 'Antique_toy'],
    searchTerms: ['cast iron toy car antique'],
  },
  {
    id: 'toy-003',
    name: 'Vintage Barbie #1 Ponytail',
    articles: ['Barbie'],
    searchTerms: ['barbie doll 1959 ponytail original'],
  },
  {
    id: 'jwl-002',
    name: 'Art Deco Diamond Engagement Ring',
    articles: ['Art_Deco', 'Engagement_ring'],
    searchTerms: ['art deco diamond ring platinum'],
  },
  {
    id: 'light-002',
    name: 'Art Deco Table Lamp',
    articles: ['Art_Deco'],
    searchTerms: ['art deco table lamp 1930s'],
  },
  {
    id: 'book-002',
    name: 'Beatles Butcher Cover',
    articles: ['Yesterday_and_Today'],
    searchTerms: ['beatles yesterday today butcher cover album'],
  },
];

interface WikipediaImageApiResponse {
  query?: {
    pages?: Record<string, { thumbnail?: { source?: string } }>;
  };
}

interface WikimediaSearchApiResponse {
  query?: {
    search?: Array<{ title: string }>;
  };
}

interface WikimediaImageInfoApiResponse {
  query?: {
    pages?: Record<string, { imageinfo?: Array<{ url?: string }> }>;
  };
}

async function fetchWikipediaImage(articleTitle: string): Promise<string | null> {
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=pageimages&format=json&pithumbsize=1000&origin=*`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json() as WikipediaImageApiResponse;

    const pages = data.query?.pages || {};
    const page = Object.values(pages)[0];

    if (page?.thumbnail?.source) {
      return page.thumbnail.source;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching from Wikipedia API for ${articleTitle}:`, error);
    return null;
  }
}

async function fetchWikimediaCommonsImage(searchTerm: string): Promise<string | null> {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srnamespace=6&srlimit=5&format=json&origin=*`;

  try {
    const searchResponse = await fetch(apiUrl);
    const searchData = await searchResponse.json() as WikimediaSearchApiResponse;

    const results = searchData.query?.search || [];
    if (results.length === 0) return null;

    // Get the first image result
    const fileName = results[0].title.replace('File:', '');

    // Get actual image URL
    const imageInfoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
    const infoResponse = await fetch(imageInfoUrl);
    const infoData = await infoResponse.json() as WikimediaImageInfoApiResponse;

    const pages = infoData.query?.pages || {};
    const page = Object.values(pages)[0];

    if (page?.imageinfo?.[0]?.url) {
      return page.imageinfo[0].url;
    }
    return null;
  } catch (error) {
    console.error(`Error searching Wikimedia Commons for ${searchTerm}:`, error);
    return null;
  }
}

async function downloadImage(url: string, filePath: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to download: ${response.status} ${response.statusText}`);
      return false;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 5000) {
      console.error(`Downloaded image too small: ${buffer.length} bytes`);
      return false;
    }

    writeFileSync(filePath, buffer);
    console.log(`  Downloaded: ${buffer.length} bytes`);
    return true;
  } catch (error) {
    console.error(`Download error:`, error);
    return false;
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fixImage(item: typeof FIXES_NEEDED[0]): Promise<boolean> {
  console.log(`\nFixing: ${item.id} - ${item.name}`);

  // Try Wikipedia articles first
  for (const article of item.articles) {
    console.log(`  Trying Wikipedia article: ${article}`);
    const url = await fetchWikipediaImage(article);
    if (url) {
      console.log(`  Found image URL: ${url.substring(0, 80)}...`);
      const ext = url.includes('.png') ? 'png' : 'jpg';
      const filePath = path.join(IMAGE_DIR, `${item.id}.${ext}`);

      if (await downloadImage(url, filePath)) {
        return true;
      }
    }
    await delay(500);
  }

  // Try Wikimedia Commons search
  for (const term of item.searchTerms) {
    console.log(`  Trying Commons search: ${term}`);
    const url = await fetchWikimediaCommonsImage(term);
    if (url) {
      console.log(`  Found image URL: ${url.substring(0, 80)}...`);
      const ext = url.includes('.png') ? 'png' : 'jpg';
      const filePath = path.join(IMAGE_DIR, `${item.id}.${ext}`);

      if (await downloadImage(url, filePath)) {
        return true;
      }
    }
    await delay(500);
  }

  console.log(`  FAILED to find suitable image for ${item.id}`);
  return false;
}

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('FIXING WRONG TEST IMAGES');
  console.log('='.repeat(60));

  if (!existsSync(IMAGE_DIR)) {
    mkdirSync(IMAGE_DIR, { recursive: true });
  }

  let fixed = 0;
  let failed = 0;

  for (const item of FIXES_NEEDED) {
    try {
      const success = await fixImage(item);
      if (success) {
        fixed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`Error fixing ${item.id}:`, error);
      failed++;
    }
    await delay(1000);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`SUMMARY: ${fixed} fixed, ${failed} failed`);
  console.log('='.repeat(60));
}

main().catch(console.error);
