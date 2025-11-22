// Wishlist Routes - User's wishlist/search criteria
// November 2025
import { Hono } from 'hono';
import { requireAuth, getUserId } from '../middleware/auth.js';
import { ValidationError, NotFoundError } from '../middleware/error.js';
import { db } from '../db/client.js';
import { userWishlists } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';
const wishlist = new Hono();
// Schema for wishlist item
const WishlistItemSchema = z.object({
    itemAnalysisId: z.string().uuid().optional(),
    searchCriteria: z.object({
        keywords: z.array(z.string()).optional(),
        style: z.string().optional(),
        era: z.string().optional(),
        priceRange: z.object({
            min: z.number(),
            max: z.number(),
        }).optional(),
    }),
    notes: z.string().optional(),
});
const UpdateWishlistSchema = z.object({
    searchCriteria: z.object({
        keywords: z.array(z.string()).optional(),
        style: z.string().optional(),
        era: z.string().optional(),
        priceRange: z.object({
            min: z.number(),
            max: z.number(),
        }).optional(),
    }).optional(),
    notes: z.string().optional(),
    isActive: z.boolean().optional(),
});
// GET /api/wishlist - Get user's wishlist
wishlist.get('/', requireAuth, async (c) => {
    try {
        const userId = getUserId(c);
        const items = await db
            .select()
            .from(userWishlists)
            .where(and(eq(userWishlists.userId, userId), eq(userWishlists.isActive, true)))
            .orderBy(desc(userWishlists.createdAt));
        return c.json({
            success: true,
            items: items,
        });
    }
    catch (error) {
        console.error('Error fetching wishlist:', error);
        throw error;
    }
});
// POST /api/wishlist - Add item to wishlist
wishlist.post('/', requireAuth, async (c) => {
    try {
        const userId = getUserId(c);
        const body = await c.req.json();
        const { itemAnalysisId, searchCriteria, notes } = WishlistItemSchema.parse(body);
        // Create wishlist item
        const [newItem] = await db
            .insert(userWishlists)
            .values({
            userId,
            itemAnalysisId: itemAnalysisId || null,
            searchCriteria,
            notes: notes || null,
            isActive: true,
        })
            .returning();
        return c.json({
            success: true,
            item: newItem,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new ValidationError(error.errors[0]?.message || 'Invalid wishlist data');
        }
        console.error('Error creating wishlist item:', error);
        throw error;
    }
});
// PATCH /api/wishlist/:id - Update wishlist item
wishlist.patch('/:id', requireAuth, async (c) => {
    try {
        const userId = getUserId(c);
        const wishlistItemId = c.req.param('id');
        const body = await c.req.json();
        const updates = UpdateWishlistSchema.parse(body);
        // Check if wishlist item exists and belongs to user
        const [existing] = await db
            .select()
            .from(userWishlists)
            .where(and(eq(userWishlists.id, wishlistItemId), eq(userWishlists.userId, userId)))
            .limit(1);
        if (!existing) {
            throw new NotFoundError('Wishlist item not found');
        }
        // Update wishlist item
        const [updatedItem] = await db
            .update(userWishlists)
            .set({
            ...updates,
            updatedAt: new Date(),
        })
            .where(eq(userWishlists.id, wishlistItemId))
            .returning();
        return c.json({
            success: true,
            item: updatedItem,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new ValidationError(error.errors[0]?.message || 'Invalid update data');
        }
        console.error('Error updating wishlist item:', error);
        throw error;
    }
});
// DELETE /api/wishlist/:id - Remove wishlist item
wishlist.delete('/:id', requireAuth, async (c) => {
    try {
        const userId = getUserId(c);
        const wishlistItemId = c.req.param('id');
        // Check if wishlist item exists and belongs to user
        const [existing] = await db
            .select()
            .from(userWishlists)
            .where(and(eq(userWishlists.id, wishlistItemId), eq(userWishlists.userId, userId)))
            .limit(1);
        if (!existing) {
            throw new NotFoundError('Wishlist item not found');
        }
        // Delete wishlist item
        await db
            .delete(userWishlists)
            .where(eq(userWishlists.id, wishlistItemId));
        return c.json({
            success: true,
            message: 'Wishlist item removed',
        });
    }
    catch (error) {
        console.error('Error deleting wishlist item:', error);
        throw error;
    }
});
export default wishlist;
//# sourceMappingURL=wishlist.js.map