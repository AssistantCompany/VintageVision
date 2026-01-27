#!/usr/bin/env npx tsx
/**
 * Fix failing test images for jewelry and lighting
 */
import { writeFileSync } from 'fs';
import path from 'path';

const IMAGE_DIR = path.join(process.cwd(), 'test-data', 'images');

interface ImageFix {
  id: string;
  name: string;
  urls: string[];
}

const FIXES: ImageFix[] = [
  {
    id: 'light-002',
    name: 'Art Deco Table Lamp',
    urls: [
      // Art Deco desk lamp from reliable source
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Lampe_Art_D%C3%A9co.jpg/440px-Lampe_Art_D%C3%A9co.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Art_deco_desk_lamp_01.jpg/440px-Art_deco_desk_lamp_01.jpg',
    ]
  },
  {
    id: 'jwl-005',
    name: 'Tiffany Engagement Ring',
    urls: [
      // Tiffany style solitaire ring
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Tiffany_and_Company_-_Diamond_Ring_-_Walters_57939_-_View_A.jpg/440px-Tiffany_and_Company_-_Diamond_Ring_-_Walters_57939_-_View_A.jpg',
    ]
  }
];

async function downloadImage(url: string, filePath: string): Promise<boolean> {
  try {
    console.log(`  Trying: ${url.substring(0, 80)}...`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.log(`    HTTP ${response.status}`);
      return false;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Check if valid JPEG or PNG
    const header = buffer.slice(0, 4).toString('hex');
    if (!header.startsWith('ffd8') && !header.startsWith('89504e47')) {
      console.log(`    Not a valid image`);
      return false;
    }

    if (buffer.length < 5000) {
      console.log(`    Too small: ${buffer.length} bytes`);
      return false;
    }

    writeFileSync(filePath, buffer);
    console.log(`    SUCCESS: ${buffer.length} bytes`);
    return true;
  } catch (error) {
    console.log(`    Error: ${error}`);
    return false;
  }
}

async function main() {
  console.log('Fixing failing test images...\n');

  for (const fix of FIXES) {
    console.log(`[${fix.id}] ${fix.name}`);
    const filePath = path.join(IMAGE_DIR, `${fix.id}.jpg`);
    
    let success = false;
    for (const url of fix.urls) {
      if (await downloadImage(url, filePath)) {
        success = true;
        break;
      }
      await new Promise(r => setTimeout(r, 500));
    }

    if (!success) {
      console.log(`  FAILED to download ${fix.id}\n`);
    } else {
      console.log(`  Downloaded ${fix.id}\n`);
    }
  }
}

main().catch(console.error);
