// Image Serving Route - Proxy for MinIO images
// Serves images from MinIO without exposing MinIO publicly

import { Hono } from 'hono';
import { getImage } from '../storage/client.js';
import { stream } from 'hono/streaming';

const images = new Hono();

// GET /api/images/:path - Serve image from MinIO
images.get('/*', async (c) => {
  try {
    // Get the full path after /api/images/
    const path = c.req.param('*');

    if (!path) {
      return c.json({ success: false, error: 'Image path required' }, 400);
    }

    console.log(`📸 Serving image: ${path}`);

    // Fetch image from MinIO
    const { body, contentType } = await getImage(path);

    // Set headers
    c.header('Content-Type', contentType);
    c.header('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    // Stream the image body
    return stream(c, async (stream) => {
      // Convert body to buffer and write
      const chunks: Uint8Array[] = [];
      for await (const chunk of body) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      await stream.write(buffer);
    });
  } catch (error: any) {
    console.error('❌ Error serving image:', error);

    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      return c.json({ success: false, error: 'Image not found' }, 404);
    }

    return c.json({ success: false, error: 'Failed to load image' }, 500);
  }
});

export default images;
