// Analysis Feedback Routes
// Collects user feedback on AI analysis accuracy
// November 2025

import { Hono } from 'hono';
import { requireAuth, getUserId } from '../middleware/auth.js';
import { ValidationError, NotFoundError } from '../middleware/error.js';
import { db } from '../db/client.js';
import { analysisFeedback, itemAnalyses } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const feedback = new Hono();

// Schema for feedback submission
const FeedbackSchema = z.object({
  item_analysis_id: z.string().uuid(),
  is_correct: z.boolean(),
  correction_text: z.string().optional(),
  feedback_type: z.enum(['accuracy', 'styling', 'value']).optional(),
});

// POST /api/feedback - Submit feedback on analysis
feedback.post('/', requireAuth, async (c) => {
  try {
    const userId = getUserId(c)!;
    const body = await c.req.json();

    // Validate request body
    const validated = FeedbackSchema.parse(body);

    // Check if the analysis exists
    const [analysis] = await db
      .select()
      .from(itemAnalyses)
      .where(eq(itemAnalyses.id, validated.item_analysis_id))
      .limit(1);

    if (!analysis) {
      throw new NotFoundError('Item analysis not found');
    }

    // Insert feedback
    const [result] = await db
      .insert(analysisFeedback)
      .values({
        userId,
        itemAnalysisId: validated.item_analysis_id,
        isCorrect: validated.is_correct,
        correctionText: validated.correction_text || null,
        feedbackType: validated.feedback_type || null,
      })
      .returning();

    console.log('📝 Feedback received:', {
      analysisId: validated.item_analysis_id,
      isCorrect: validated.is_correct,
      feedbackType: validated.feedback_type,
      userId: userId.substring(0, 8) + '...',
    });

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0]?.message || 'Invalid feedback data');
    }
    console.error('Error saving feedback:', error);
    throw error;
  }
});

export default feedback;
