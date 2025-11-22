// Analysis Routes - Image Upload & AI Analysis
// October 2025
import { Hono } from 'hono';
import { optionalAuth, getUserId } from '../middleware/auth.js';
import { ValidationError } from '../middleware/error.js';
import { analyzeAntiqueImage, generateMarketplaceLinks } from '../services/openai.js';
import { uploadImage } from '../storage/client.js';
import { db } from '../db/client.js';
import { itemAnalyses, marketplaceLinks, analyticsEvents } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
const analyze = new Hono();
// Request validation schema
const AnalyzeRequestSchema = z.object({
    image: z.string().min(1, 'Image data is required'),
});
// POST /api/analyze - Analyze antique image
analyze.post('/', optionalAuth, async (c) => {
    try {
        const userId = getUserId(c);
        const body = await c.req.json();
        // Validate request
        const { image: imageData } = AnalyzeRequestSchema.parse(body);
        console.log(`🔍 Analysis request from user: ${userId || 'anonymous'}`);
        // Validate image format and size
        if (!imageData.startsWith('data:image/')) {
            throw new ValidationError('Invalid image format. Must be a data URL.');
        }
        // Extract content type and buffer
        const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new ValidationError('Invalid image data format');
        }
        const contentType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        // Check file size (max 20MB)
        const maxSize = 20 * 1024 * 1024;
        if (buffer.length > maxSize) {
            throw new ValidationError('Image size exceeds 20MB limit');
        }
        console.log(`📊 Image size: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
        // Upload to MinIO
        const imageKey = await uploadImage({
            buffer,
            contentType,
            userId: userId || undefined,
        });
        // Generate public image URL using our proxy route
        const imageUrl = `/api/images/${imageKey}`;
        // Analyze with OpenAI GPT-4o Vision
        const analysisResult = await analyzeAntiqueImage(imageData);
        // Save analysis to database
        const [savedAnalysis] = await db
            .insert(itemAnalyses)
            .values({
            name: analysisResult.name,
            era: analysisResult.era || null,
            style: analysisResult.style || null,
            description: analysisResult.description,
            historicalContext: analysisResult.historicalContext,
            estimatedValueMin: analysisResult.estimatedValueMin || null,
            estimatedValueMax: analysisResult.estimatedValueMax || null,
            confidence: analysisResult.confidence,
            imageUrl: imageKey, // Store S3 key, not presigned URL
            stylingSuggestions: analysisResult.stylingSuggestions || null,
        })
            .returning();
        // Generate and save marketplace links
        const marketplaceSearchLinks = generateMarketplaceLinks(analysisResult.name, analysisResult.era, analysisResult.estimatedValueMin);
        if (marketplaceSearchLinks.length > 0) {
            await db.insert(marketplaceLinks).values(marketplaceSearchLinks.map((link) => ({
                itemAnalysisId: savedAnalysis.id,
                marketplaceName: link.marketplace,
                linkUrl: link.url,
                priceMin: analysisResult.estimatedValueMin || null,
                priceMax: analysisResult.estimatedValueMax || null,
                confidenceScore: analysisResult.confidence,
            })));
        }
        // Log analytics event
        await db.insert(analyticsEvents).values({
            userId: userId || null,
            eventType: 'analysis_completed',
            eventData: {
                analysisId: savedAnalysis.id,
                itemName: analysisResult.name,
                confidence: analysisResult.confidence,
            },
        });
        console.log(`✅ Analysis complete: ${analysisResult.name}`);
        // Return analysis with presigned URL for image
        return c.json({
            success: true,
            data: {
                ...savedAnalysis,
                imageUrl, // Replace S3 key with presigned URL
                marketplaceLinks: marketplaceSearchLinks,
            },
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new ValidationError(error.errors[0]?.message || 'Invalid request data');
        }
        throw error;
    }
});
// GET /api/analyze/:id - Get specific analysis
analyze.get('/:id', optionalAuth, async (c) => {
    try {
        const analysisId = c.req.param('id');
        const [analysis] = await db
            .select()
            .from(itemAnalyses)
            .where(eq(itemAnalyses.id, analysisId))
            .limit(1);
        if (!analysis) {
            return c.json({ success: false, error: 'Analysis not found' }, 404);
        }
        // Get marketplace links
        const links = await db
            .select()
            .from(marketplaceLinks)
            .where(eq(marketplaceLinks.itemAnalysisId, analysisId));
        // Generate public image URL using our proxy route
        const imageUrl = `/api/images/${analysis.imageUrl}`;
        return c.json({
            success: true,
            data: {
                ...analysis,
                imageUrl,
                marketplaceLinks: links,
            },
        });
    }
    catch (error) {
        throw error;
    }
});
export default analyze;
//# sourceMappingURL=analyze.js.map