// Analysis Routes - World-Class Treasure Hunting System
// January 2026 - Full deal analysis with SSE streaming support

import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { requireAuth, optionalAuth, getUserId } from '../middleware/auth.js';
import { ValidationError, ExternalServiceError } from '../middleware/error.js';
import { analyzeAntiqueImage, generateMarketplaceLinks, ProductCategory, DomainExpert, AnalysisEventEmitter } from '../services/openai.js';
import { uploadImage, getImageUrl } from '../storage/client.js';
import { db } from '../db/client.js';
import { itemAnalyses, marketplaceLinks, analyticsEvents } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const analyze = new Hono();

// Request validation schema - now includes asking price
const AnalyzeRequestSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
  askingPrice: z.number().positive().optional(), // Price in cents
  additionalContext: z.string().optional(), // User notes
});

// POST /api/analyze - Analyze item with world-class identification
analyze.post('/', optionalAuth, async (c) => {
  try {
    const userId = getUserId(c);
    const body = await c.req.json();

    // Validate request
    const { image: imageData, askingPrice, additionalContext } = AnalyzeRequestSchema.parse(body);

    console.log(`🔍 Analysis request from user: ${userId || 'anonymous'}`);
    if (askingPrice) {
      console.log(`💰 Asking price provided: $${askingPrice / 100}`);
    }

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
    // imageKey already includes "images/" prefix, so we just need /api/
    const imageUrl = `/api/${imageKey}`;

    // Analyze with World-Class Identification System
    const analysisResult = await analyzeAntiqueImage(imageData, askingPrice);

    // Save analysis to database with ALL world-class fields
    const [savedAnalysis] = await db
      .insert(itemAnalyses)
      .values({
        // Core identification
        name: analysisResult.name,
        maker: analysisResult.maker || null,
        modelNumber: analysisResult.modelNumber || null,
        brand: analysisResult.brand || null,

        // Categorization
        productCategory: analysisResult.productCategory || null,
        domainExpert: analysisResult.domainExpert || null,
        itemSubcategory: analysisResult.itemSubcategory || null,

        // Period and origin
        era: analysisResult.era || null,
        style: analysisResult.style || null,
        periodStart: analysisResult.periodStart || null,
        periodEnd: analysisResult.periodEnd || null,
        originRegion: analysisResult.originRegion || null,

        // Description
        description: analysisResult.description,
        historicalContext: analysisResult.historicalContext,
        attributionNotes: analysisResult.attributionNotes || null,

        // Valuation
        estimatedValueMin: analysisResult.estimatedValueMin || null,
        estimatedValueMax: analysisResult.estimatedValueMax || null,
        currentRetailPrice: analysisResult.currentRetailPrice || null,

        // Comparable sales
        comparableSales: analysisResult.comparableSales || null,

        // Confidence and evidence
        confidence: analysisResult.confidence,
        identificationConfidence: analysisResult.identificationConfidence || null,
        makerConfidence: analysisResult.makerConfidence || null,
        evidenceFor: analysisResult.evidenceFor || null,
        evidenceAgainst: analysisResult.evidenceAgainst || null,

        // Alternative candidates
        alternativeCandidates: analysisResult.alternativeCandidates || null,

        // Verification guidance
        verificationTips: analysisResult.verificationTips || null,
        redFlags: analysisResult.redFlags || null,

        // Deal analysis
        askingPrice: askingPrice || null,
        dealRating: analysisResult.dealRating || null,
        dealExplanation: analysisResult.dealExplanation || null,
        profitPotentialMin: analysisResult.profitPotentialMin || null,
        profitPotentialMax: analysisResult.profitPotentialMax || null,

        // Flip assessment
        flipDifficulty: analysisResult.flipDifficulty || null,
        flipTimeEstimate: analysisResult.flipTimeEstimate || null,
        resaleChannels: analysisResult.resaleChannels || null,

        // Legacy fields
        imageUrl: imageKey,
        stylingSuggestions: analysisResult.stylingSuggestions || null,
        productUrl: analysisResult.productUrl || null,

        // Authentication fields (Stage 5)
        authenticationConfidence: analysisResult.authenticationConfidence || null,
        authenticityRisk: analysisResult.authenticityRisk || null,
        authenticationChecklist: analysisResult.authenticationChecklist || null,
        knownFakeIndicators: analysisResult.knownFakeIndicators || null,
        additionalPhotosRequested: analysisResult.additionalPhotosRequested || null,
        expertReferralRecommended: analysisResult.expertReferralRecommended || null,
        expertReferralReason: analysisResult.expertReferralReason || null,
        authenticationAssessment: analysisResult.authenticationAssessment || null,
      })
      .returning();

    // Generate and save marketplace links (domain-aware)
    const marketplaceSearchLinks = generateMarketplaceLinks(
      analysisResult.name,
      analysisResult.era ?? undefined,
      analysisResult.estimatedValueMin ?? undefined,
      analysisResult.productCategory as ProductCategory | undefined,
      analysisResult.brand ?? undefined,
      analysisResult.modelNumber ?? undefined,
      analysisResult.domainExpert ?? undefined
    );

    if (marketplaceSearchLinks.length > 0) {
      await db.insert(marketplaceLinks).values(
        marketplaceSearchLinks.map((link) => ({
          itemAnalysisId: savedAnalysis.id,
          marketplaceName: link.marketplaceName,
          linkUrl: link.linkUrl,
          priceMin: analysisResult.estimatedValueMin || null,
          priceMax: analysisResult.estimatedValueMax || null,
          confidenceScore: analysisResult.confidence,
        }))
      );
    }

    // Log analytics event with enhanced data
    await db.insert(analyticsEvents).values({
      userId: userId || null,
      eventType: 'analysis_completed',
      eventData: {
        analysisId: savedAnalysis.id,
        itemName: analysisResult.name,
        confidence: analysisResult.confidence,
        productCategory: analysisResult.productCategory,
        domainExpert: analysisResult.domainExpert,
        maker: analysisResult.maker || null,
        dealRating: analysisResult.dealRating || null,
        askingPrice: askingPrice || null,
        estimatedValue: analysisResult.estimatedValueMin && analysisResult.estimatedValueMax
          ? `$${analysisResult.estimatedValueMin}-$${analysisResult.estimatedValueMax}`
          : null,
      },
    });

    console.log(`✅ Analysis complete: ${analysisResult.name}`);
    if (analysisResult.maker) {
      console.log(`   Maker: ${analysisResult.maker}`);
    }
    console.log(`   Domain: ${analysisResult.domainExpert}`);
    console.log(`   Category: ${analysisResult.productCategory}`);
    if (analysisResult.dealRating) {
      console.log(`   Deal: ${analysisResult.dealRating.toUpperCase()}`);
    }

    // Return complete analysis
    return c.json({
      success: true,
      data: {
        ...savedAnalysis,
        imageUrl, // Replace S3 key with proxy URL
        marketplaceLinks: marketplaceSearchLinks,
        // Include calculated deal analysis if asking price was provided
        ...(askingPrice && {
          dealRating: analysisResult.dealRating,
          dealExplanation: analysisResult.dealExplanation,
          profitPotentialMin: analysisResult.profitPotentialMin,
          profitPotentialMax: analysisResult.profitPotentialMax,
        }),
        // Include authentication analysis
        authenticationConfidence: analysisResult.authenticationConfidence,
        authenticityRisk: analysisResult.authenticityRisk,
        authenticationChecklist: analysisResult.authenticationChecklist,
        knownFakeIndicators: analysisResult.knownFakeIndicators,
        additionalPhotosRequested: analysisResult.additionalPhotosRequested,
        expertReferralRecommended: analysisResult.expertReferralRecommended,
        expertReferralReason: analysisResult.expertReferralReason,
        authenticationAssessment: analysisResult.authenticationAssessment,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0]?.message || 'Invalid request data');
    }
    throw error;
  }
});

// POST /api/analyze/stream - Analyze with SSE streaming progress
analyze.post('/stream', optionalAuth, async (c) => {
  const userId = getUserId(c);

  try {
    const body = await c.req.json();
    const { image: imageData, askingPrice } = AnalyzeRequestSchema.parse(body);

    console.log(`🔍 Streaming analysis request from user: ${userId || 'anonymous'}`);

    // Validate image format
    if (!imageData.startsWith('data:image/')) {
      throw new ValidationError('Invalid image format. Must be a data URL.');
    }

    // Extract content type and buffer for upload
    const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new ValidationError('Invalid image data format');
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Check file size (max 20MB)
    if (buffer.length > 20 * 1024 * 1024) {
      throw new ValidationError('Image size exceeds 20MB limit');
    }

    // Upload image first
    const imageKey = await uploadImage({
      buffer,
      contentType,
      userId: userId || undefined,
    });

    // imageKey already includes "images/" prefix, so we just need /api/
    const imageUrl = `/api/${imageKey}`;

    // Return SSE stream
    return streamSSE(c, async (stream) => {
      let analysisResult: Awaited<ReturnType<typeof analyzeAntiqueImage>> | null = null;

      // Event emitter for progress updates
      const emitEvent: AnalysisEventEmitter = async (event) => {
        await stream.writeSSE({
          data: JSON.stringify(event),
          event: event.type,
        });
      };

      try {
        // Send initial event
        await emitEvent({
          type: 'stage:start',
          stage: 'upload',
          message: 'Image uploaded successfully',
          progress: 5,
        });

        // Run analysis with event emitter
        analysisResult = await analyzeAntiqueImage(imageData, askingPrice, emitEvent);

        // Save to database
        const [savedAnalysis] = await db
          .insert(itemAnalyses)
          .values({
            name: analysisResult.name,
            maker: analysisResult.maker || null,
            modelNumber: analysisResult.modelNumber || null,
            brand: analysisResult.brand || null,
            productCategory: analysisResult.productCategory || null,
            domainExpert: analysisResult.domainExpert || null,
            itemSubcategory: analysisResult.itemSubcategory || null,
            era: analysisResult.era || null,
            style: analysisResult.style || null,
            periodStart: analysisResult.periodStart || null,
            periodEnd: analysisResult.periodEnd || null,
            originRegion: analysisResult.originRegion || null,
            description: analysisResult.description,
            historicalContext: analysisResult.historicalContext,
            attributionNotes: analysisResult.attributionNotes || null,
            estimatedValueMin: analysisResult.estimatedValueMin || null,
            estimatedValueMax: analysisResult.estimatedValueMax || null,
            currentRetailPrice: analysisResult.currentRetailPrice || null,
            comparableSales: analysisResult.comparableSales || null,
            confidence: analysisResult.confidence,
            identificationConfidence: analysisResult.identificationConfidence || null,
            makerConfidence: analysisResult.makerConfidence || null,
            evidenceFor: analysisResult.evidenceFor || null,
            evidenceAgainst: analysisResult.evidenceAgainst || null,
            alternativeCandidates: analysisResult.alternativeCandidates || null,
            verificationTips: analysisResult.verificationTips || null,
            redFlags: analysisResult.redFlags || null,
            askingPrice: askingPrice || null,
            dealRating: analysisResult.dealRating || null,
            dealExplanation: analysisResult.dealExplanation || null,
            profitPotentialMin: analysisResult.profitPotentialMin || null,
            profitPotentialMax: analysisResult.profitPotentialMax || null,
            flipDifficulty: analysisResult.flipDifficulty || null,
            flipTimeEstimate: analysisResult.flipTimeEstimate || null,
            resaleChannels: analysisResult.resaleChannels || null,
            imageUrl: imageKey,
            stylingSuggestions: analysisResult.stylingSuggestions || null,
            productUrl: analysisResult.productUrl || null,
            authenticationConfidence: analysisResult.authenticationConfidence || null,
            authenticityRisk: analysisResult.authenticityRisk || null,
            authenticationChecklist: analysisResult.authenticationChecklist || null,
            knownFakeIndicators: analysisResult.knownFakeIndicators || null,
            additionalPhotosRequested: analysisResult.additionalPhotosRequested || null,
            expertReferralRecommended: analysisResult.expertReferralRecommended || null,
            expertReferralReason: analysisResult.expertReferralReason || null,
            authenticationAssessment: analysisResult.authenticationAssessment || null,
          })
          .returning();

        // Generate marketplace links
        const marketplaceSearchLinks = generateMarketplaceLinks(
          analysisResult.name,
          analysisResult.era ?? undefined,
          analysisResult.estimatedValueMin ?? undefined,
          analysisResult.productCategory as ProductCategory | undefined,
          analysisResult.brand ?? undefined,
          analysisResult.modelNumber ?? undefined,
          analysisResult.domainExpert ?? undefined
        );

        if (marketplaceSearchLinks.length > 0) {
          await db.insert(marketplaceLinks).values(
            marketplaceSearchLinks.map((link) => ({
              itemAnalysisId: savedAnalysis.id,
              marketplaceName: link.marketplaceName,
              linkUrl: link.linkUrl,
              priceMin: analysisResult!.estimatedValueMin || null,
              priceMax: analysisResult!.estimatedValueMax || null,
              confidenceScore: analysisResult!.confidence,
            }))
          );
        }

        // Send final complete event with full data
        const completeData = {
          ...savedAnalysis,
          imageUrl,
          marketplaceLinks: marketplaceSearchLinks,
        };
        console.log(`🖼️ Image URL being sent: ${completeData.imageUrl}`);

        await stream.writeSSE({
          data: JSON.stringify({
            type: 'complete',
            progress: 100,
            data: completeData,
          }),
          event: 'complete',
        });

        console.log(`✅ Streaming analysis complete: ${analysisResult.name}`);
      } catch (error) {
        // Send error event
        await stream.writeSSE({
          data: JSON.stringify({
            type: 'error',
            message: error instanceof Error ? error.message : 'Analysis failed',
          }),
          event: 'error',
        });
      }
    });
  } catch (error) {
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
    // analysis.imageUrl already includes "images/" prefix
    const imageUrl = `/api/${analysis.imageUrl}`;

    return c.json({
      success: true,
      data: {
        ...analysis,
        imageUrl,
        marketplaceLinks: links,
      },
    });
  } catch (error) {
    throw error;
  }
});

export default analyze;
