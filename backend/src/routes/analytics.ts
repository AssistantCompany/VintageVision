// Analytics Events Route
// Collects anonymous usage analytics

import { Hono } from 'hono';
import { db } from '../db/client.js';
import { analyticsEvents } from '../db/schema.js';
import { optionalAuth, getUserId } from '../middleware/auth.js';

const app = new Hono();

// Track analytics event
app.post('/', optionalAuth, async (c) => {
  try {
    const body = await c.req.json();

    // Get user ID from session if available
    const userId = getUserId(c);

    // Insert analytics event
    await db.insert(analyticsEvents).values({
      userId: userId,
      eventType: body.action || 'unknown',
      eventData: {
        category: body.category,
        label: body.label,
        value: body.value,
        timestamp: body.timestamp,
        url: body.url,
        userAgent: body.userAgent,
        ...body
      }
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    // Don't fail the request if analytics fails
    return c.json({ success: false }, 200);
  }
});

export default app;
