// User Preferences Routes
// November 2025
import { Hono } from 'hono';
import { requireAuth, getUserId } from '../middleware/auth.js';
import { ValidationError } from '../middleware/error.js';
import { db } from '../db/client.js';
import { userPreferences } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
const preferences = new Hono();
// Schema for user preferences
const PreferencesSchema = z.object({
    preferredStyles: z.array(z.string()).optional(),
    roomTypes: z.array(z.string()).optional(),
    budgetRangeMin: z.number().int().positive().optional(),
    budgetRangeMax: z.number().int().positive().optional(),
});
// GET /api/preferences - Get user's preferences
preferences.get('/', requireAuth, async (c) => {
    try {
        const userId = getUserId(c);
        const [prefs] = await db
            .select()
            .from(userPreferences)
            .where(eq(userPreferences.userId, userId))
            .limit(1);
        if (!prefs) {
            // Return default empty preferences if none exist
            return c.json({
                success: true,
                preferences: {
                    preferredStyles: [],
                    roomTypes: [],
                    budgetRangeMin: null,
                    budgetRangeMax: null,
                },
            });
        }
        return c.json({
            success: true,
            preferences: prefs,
        });
    }
    catch (error) {
        console.error('Error fetching preferences:', error);
        throw error;
    }
});
// POST /api/preferences - Create or update user's preferences
preferences.post('/', requireAuth, async (c) => {
    try {
        const userId = getUserId(c);
        const body = await c.req.json();
        const validatedPrefs = PreferencesSchema.parse(body);
        // Check if preferences already exist
        const [existing] = await db
            .select()
            .from(userPreferences)
            .where(eq(userPreferences.userId, userId))
            .limit(1);
        let result;
        if (existing) {
            // Update existing preferences
            [result] = await db
                .update(userPreferences)
                .set({
                ...validatedPrefs,
                updatedAt: new Date(),
            })
                .where(eq(userPreferences.userId, userId))
                .returning();
        }
        else {
            // Create new preferences
            [result] = await db
                .insert(userPreferences)
                .values({
                userId,
                ...validatedPrefs,
            })
                .returning();
        }
        return c.json({
            success: true,
            preferences: result,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new ValidationError(error.errors[0]?.message || 'Invalid preferences data');
        }
        console.error('Error saving preferences:', error);
        throw error;
    }
});
export default preferences;
//# sourceMappingURL=preferences.js.map