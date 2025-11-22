// Collection Routes - User's saved items
// October 2025
import { Hono } from 'hono';
import { requireAuth, getUserId } from '../middleware/auth.js';
import { ValidationError, NotFoundError } from '../middleware/error.js';
import { db } from '../db/client.js';
import { collectionItems, itemAnalyses, userWishlists } from '../db/schema.js';
import { eq, and, desc, sql } from 'drizzle-orm';
import { getImageUrl } from '../storage/client.js';
import { z } from 'zod';
const collection = new Hono();
// POST /api/collection - Save item to collection
const SaveItemSchema = z.object({
    itemAnalysisId: z.string().uuid(),
    notes: z.string().optional(),
    location: z.string().optional(),
});
collection.post('/', requireAuth, async (c) => {
    try {
        const userId = getUserId(c);
        const body = await c.req.json();
        const { itemAnalysisId, notes, location } = SaveItemSchema.parse(body);
        // Check if item exists
        const [item] = await db
            .select()
            .from(itemAnalyses)
            .where(eq(itemAnalyses.id, itemAnalysisId))
            .limit(1);
        if (!item) {
            throw new NotFoundError('Item analysis not found');
        }
        // Check if already in collection
        const [existing] = await db
            .select()
            .from(collectionItems)
            .where(and(eq(collectionItems.userId, userId), eq(collectionItems.itemAnalysisId, itemAnalysisId)))
            .limit(1);
        if (existing) {
            throw new ValidationError('Item already in collection');
        }
        // Save to collection
        const [savedItem] = await db
            .insert(collectionItems)
            .values({
            userId,
            itemAnalysisId,
            notes: notes || null,
            location: location || null,
        })
            .returning();
        return c.json({
            success: true,
            data: savedItem,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new ValidationError(error.errors[0]?.message || 'Invalid request data');
        }
        throw error;
    }
});
// GET /api/collection - Get user's collection
collection.get('/', requireAuth, async (c) => {
    try {
        const userId = getUserId(c);
        const items = await db
            .select({
            collectionItem: collectionItems,
            analysis: itemAnalyses,
        })
            .from(collectionItems)
            .innerJoin(itemAnalyses, eq(collectionItems.itemAnalysisId, itemAnalyses.id))
            .where(eq(collectionItems.userId, userId))
            .orderBy(desc(collectionItems.savedAt));
        // Get presigned URLs for all images
        const itemsWithUrls = await Promise.all(items.map(async (item) => ({
            ...item.collectionItem,
            analysis: {
                ...item.analysis,
                imageUrl: await getImageUrl(item.analysis.imageUrl),
            },
        })));
        return c.json({
            success: true,
            data: itemsWithUrls,
        });
    }
    catch (error) {
        throw error;
    }
});
// DELETE /api/collection/:id - Remove item from collection
collection.delete('/:id', requireAuth, async (c) => {
    try {
        const userId = getUserId(c);
        const collectionItemId = c.req.param('id');
        const [item] = await db
            .select()
            .from(collectionItems)
            .where(and(eq(collectionItems.id, collectionItemId), eq(collectionItems.userId, userId)))
            .limit(1);
        if (!item) {
            throw new NotFoundError('Collection item not found');
        }
        await db
            .delete(collectionItems)
            .where(eq(collectionItems.id, collectionItemId));
        return c.json({
            success: true,
            message: 'Item removed from collection',
        });
    }
    catch (error) {
        throw error;
    }
});
// PATCH /api/collection/:id - Update collection item
const UpdateItemSchema = z.object({
    notes: z.string().optional(),
    location: z.string().optional(),
});
collection.patch('/:id', requireAuth, async (c) => {
    try {
        const userId = getUserId(c);
        const collectionItemId = c.req.param('id');
        const body = await c.req.json();
        const updates = UpdateItemSchema.parse(body);
        const [item] = await db
            .select()
            .from(collectionItems)
            .where(and(eq(collectionItems.id, collectionItemId), eq(collectionItems.userId, userId)))
            .limit(1);
        if (!item) {
            throw new NotFoundError('Collection item not found');
        }
        const [updatedItem] = await db
            .update(collectionItems)
            .set({
            ...updates,
            updatedAt: new Date(),
        })
            .where(eq(collectionItems.id, collectionItemId))
            .returning();
        return c.json({
            success: true,
            data: updatedItem,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new ValidationError(error.errors[0]?.message || 'Invalid request data');
        }
        throw error;
    }
});
// GET /api/collection/counts - Get user's collection and wishlist counts
collection.get('/counts', requireAuth, async (c) => {
    try {
        const userId = getUserId(c);
        // Get collection count
        const [collectionCount] = await db
            .select({ count: sql `count(*)::int` })
            .from(collectionItems)
            .where(eq(collectionItems.userId, userId));
        // Get wishlist count
        const [wishlistCount] = await db
            .select({ count: sql `count(*)::int` })
            .from(userWishlists)
            .where(and(eq(userWishlists.userId, userId), eq(userWishlists.isActive, true)));
        return c.json({
            success: true,
            data: {
                collection: collectionCount?.count || 0,
                wishlist: wishlistCount?.count || 0,
            },
        });
    }
    catch (error) {
        throw error;
    }
});
export default collection;
//# sourceMappingURL=collection.js.map