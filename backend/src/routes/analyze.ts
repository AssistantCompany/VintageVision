// Analysis Routes - World-Class Treasure Hunting System
// January 2026 - Full deal analysis with SSE streaming support

import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { requireAuth, optionalAuth, getUserId } from '../middleware/auth.js';
import { ValidationError, ExternalServiceError } from '../middleware/error.js';
import { analyzeAntiqueImage, generateMarketplaceLinks, ProductCategory, DomainExpert, AnalysisEventEmitter, CapturedImage, ImageRole } from '../services/openai.js';
import { analyzeWithConsensus, evaluateConsensusTriggers, ConsensusConfig } from '../services/consensusAnalysis.js';
import { createInteractiveSession, addUserResponse, updateWithReanalysis, detectInformationNeeds, generateAIVeraResponse, ASSISTANT_NAME, ASSISTANT_PERSONA, InteractiveSession } from '../services/interactiveAnalysis.js';
import { evaluateEscalation, getEscalationOptions } from '../services/expertEscalation.js';
import { uploadImage, getImageUrl } from '../storage/client.js';
import { db } from '../db/client.js';
import { itemAnalyses, marketplaceLinks, analyticsEvents } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const analyze = new Hono();

// Additional image schema for multi-image analysis
const AdditionalImageSchema = z.object({
  role: z.enum(['overview', 'detail', 'marks', 'underside', 'damage', 'context', 'additional']),
  dataUrl: z.string().min(1),
});

// Request validation schema - now includes asking price, multi-image, and consensus support
const AnalyzeRequestSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
  askingPrice: z.number().positive().optional(), // Price in cents
  additionalContext: z.string().optional(), // User notes
  additionalImages: z.array(AdditionalImageSchema).optional(), // Multi-image capture
  multiImageAnalysis: z.boolean().optional(), // Flag for world-class analysis
  // Consensus analysis options
  consensusMode: z.enum(['auto', 'always', 'never']).optional().default('auto'), // 'auto' = conditional based on triggers
  forceMultiRun: z.boolean().optional(), // Force multiple runs regardless of triggers
  useReasoningModel: z.boolean().optional().default(true), // Use o1/o1-pro for synthesis
});

// POST /api/analyze - Analyze item with world-class identification
analyze.post('/', optionalAuth, async (c) => {
  try {
    const userId = getUserId(c);
    const body = await c.req.json();

    // Validate request
    const {
      image: imageData,
      askingPrice,
      additionalContext,
      additionalImages,
      multiImageAnalysis,
      consensusMode = 'auto',
      forceMultiRun = false,
      useReasoningModel = true,
    } = AnalyzeRequestSchema.parse(body);

    const isMultiImage = multiImageAnalysis && additionalImages && additionalImages.length > 0;
    console.log(`🔍 Analysis request from user: ${userId || 'anonymous'} (${isMultiImage ? 'multi-image' : 'single-image'})`);
    if (isMultiImage) {
      console.log(`📸 Additional images: ${additionalImages.length} (roles: ${additionalImages.map(i => i.role).join(', ')})`);
    }
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

    // Build image array for multi-image analysis
    let analysisInput: string | CapturedImage[];
    if (isMultiImage && additionalImages) {
      // Multi-image analysis: create CapturedImage array
      const capturedImages: CapturedImage[] = [
        {
          id: 'primary',
          dataUrl: imageData,
          role: 'overview' as ImageRole,
          label: 'Overview'
        },
        ...additionalImages.map((img, idx) => ({
          id: `additional-${idx}`,
          dataUrl: img.dataUrl,
          role: img.role as ImageRole,
          label: img.role.charAt(0).toUpperCase() + img.role.slice(1).replace('_', ' ')
        }))
      ];
      analysisInput = capturedImages;
      console.log(`🔬 Starting world-class multi-image analysis with ${capturedImages.length} images`);
    } else {
      // Single image analysis
      analysisInput = imageData;
    }

    // Analyze with World-Class Identification System
    // Use consensus analysis for auto/always modes, direct analysis for never
    let analysisResult;
    if (consensusMode === 'never') {
      // Direct single-run analysis
      console.log('🎯 Consensus mode: DISABLED - using single-run analysis');
      analysisResult = await analyzeAntiqueImage(analysisInput, askingPrice);
    } else {
      // Consensus analysis (auto or always)
      console.log(`🎯 Consensus mode: ${consensusMode.toUpperCase()} - using conditional multi-run consensus`);
      analysisResult = await analyzeWithConsensus(analysisInput, askingPrice, {
        forceMultiRun: forceMultiRun || consensusMode === 'always',
        config: {
          useReasoningModel,
          reasoningModel: 'o1', // OpenAI's reasoning model for synthesis
        },
      });
    }

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
        // World-class analysis fields
        visualMarkers: analysisResult.visualMarkers || [],
        knowledgeState: analysisResult.knowledgeState || null,
        itemAuthentication: analysisResult.itemAuthentication || null,
        suggestedCaptures: analysisResult.suggestedCaptures || [],
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
    const { image: imageData, askingPrice, additionalImages, multiImageAnalysis } = AnalyzeRequestSchema.parse(body);
    const isMultiImage = multiImageAnalysis && additionalImages && additionalImages.length > 0;

    console.log(`🔍 Streaming analysis request from user: ${userId || 'anonymous'} (${isMultiImage ? 'multi-image' : 'single-image'})`);

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

    // Build analysis input for multi-image support
    let analysisInput: string | CapturedImage[];
    if (isMultiImage && additionalImages) {
      const capturedImages: CapturedImage[] = [
        { id: 'primary', dataUrl: imageData, role: 'overview' as ImageRole, label: 'Overview' },
        ...additionalImages.map((img, idx) => ({
          id: `additional-${idx}`,
          dataUrl: img.dataUrl,
          role: img.role as ImageRole,
          label: img.role.charAt(0).toUpperCase() + img.role.slice(1).replace('_', ' ')
        }))
      ];
      analysisInput = capturedImages;
    } else {
      analysisInput = imageData;
    }

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
          message: isMultiImage ? `${additionalImages!.length + 1} images uploaded` : 'Image uploaded successfully',
          progress: 5,
        });

        // Run analysis with event emitter (supports multi-image)
        analysisResult = await analyzeAntiqueImage(analysisInput, askingPrice, emitEvent);

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

        // Send final complete event with full data including world-class fields
        const completeData = {
          ...savedAnalysis,
          imageUrl,
          marketplaceLinks: marketplaceSearchLinks,
          // World-class analysis fields
          visualMarkers: analysisResult!.visualMarkers || [],
          knowledgeState: analysisResult!.knowledgeState || null,
          itemAuthentication: analysisResult!.itemAuthentication || null,
          suggestedCaptures: analysisResult!.suggestedCaptures || [],
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

// ============================================================================
// VERA INTERACTIVE SESSION ENDPOINTS
// ============================================================================

// In-memory session store (would be Redis in production)
const interactiveSessions = new Map<string, InteractiveSession>();

// GET /api/analyze/vera/info - Get Vera assistant information
analyze.get('/vera/info', (c) => {
  return c.json({
    success: true,
    data: {
      assistantName: ASSISTANT_NAME,
      title: ASSISTANT_PERSONA.title,
      greeting: ASSISTANT_PERSONA.greeting,
      style: ASSISTANT_PERSONA.style,
      expertise: ASSISTANT_PERSONA.expertise,
    },
  });
});

// POST /api/analyze/:id/interactive - Start interactive session for an analysis
analyze.post('/:id/interactive', optionalAuth, async (c) => {
  try {
    const analysisId = c.req.param('id');

    // Get the existing analysis
    const [analysis] = await db
      .select()
      .from(itemAnalyses)
      .where(eq(itemAnalyses.id, analysisId))
      .limit(1);

    if (!analysis) {
      return c.json({ success: false, error: 'Analysis not found' }, 404);
    }

    // Convert DB record to ItemAnalysis format
    const itemAnalysis = {
      name: analysis.name,
      maker: analysis.maker,
      confidence: analysis.confidence,
      estimatedValueMin: analysis.estimatedValueMin,
      estimatedValueMax: analysis.estimatedValueMax,
      domainExpert: analysis.domainExpert,
      authenticityRisk: analysis.authenticityRisk as 'low' | 'medium' | 'high' | 'very_high' | undefined,
      expertReferralRecommended: analysis.expertReferralRecommended,
      expertReferralReason: analysis.expertReferralReason,
      condition: null,
      datingConfidence: analysis.identificationConfidence,
      marketConfidence: analysis.confidence,
      era: analysis.era,
      description: analysis.description,
    };

    // Create interactive session
    const session = createInteractiveSession(analysisId, itemAnalysis as any);

    // Store session
    interactiveSessions.set(session.id, session);

    // Get escalation options
    const escalation = getEscalationOptions(itemAnalysis as any);

    console.log(`🤖 Vera session started: ${session.id} for analysis ${analysisId}`);
    console.log(`   Initial confidence: ${(itemAnalysis.confidence * 100).toFixed(0)}%`);
    console.log(`   Information needs: ${session.informationNeeds.length}`);

    return c.json({
      success: true,
      data: {
        session,
        escalation,
        assistantName: ASSISTANT_NAME,
      },
    });
  } catch (error) {
    throw error;
  }
});

// GET /api/analyze/interactive/:sessionId - Get interactive session
analyze.get('/interactive/:sessionId', optionalAuth, async (c) => {
  const sessionId = c.req.param('sessionId');
  const session = interactiveSessions.get(sessionId);

  if (!session) {
    return c.json({ success: false, error: 'Session not found' }, 404);
  }

  return c.json({
    success: true,
    data: session,
  });
});

// POST /api/analyze/interactive/:sessionId/respond - Add user response to session
analyze.post('/interactive/:sessionId/respond', optionalAuth, async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const session = interactiveSessions.get(sessionId);

    if (!session) {
      return c.json({ success: false, error: 'Session not found' }, 404);
    }

    const body = await c.req.json();
    const { needId, type, content } = z.object({
      needId: z.string(),
      type: z.enum(['photo', 'text', 'measurement', 'document']),
      content: z.string(),
    }).parse(body);

    console.log(`📝 Vera received ${type} response for need ${needId}`);

    // Add user's message to conversation history
    session.collectedResponses.push({
      needId,
      type: type as 'photo' | 'text' | 'measurement' | 'document',
      content,
      providedAt: new Date().toISOString(),
    });

    session.conversationHistory.push({
      role: 'user',
      content: type === 'photo' ? '[Photo provided]' : content,
      timestamp: new Date().toISOString(),
      relatedNeedId: needId,
    });

    // Generate AI-powered response from Vera
    const aiResponse = await generateAIVeraResponse(
      session,
      type === 'photo' ? 'User provided an additional photo for analysis.' : content,
      type as 'photo' | 'text'
    );

    // Add Vera's AI response to conversation
    session.conversationHistory.push(aiResponse);

    // Check if we should move to processing status
    const criticalNeeds = session.informationNeeds.filter(n => n.priority === 'critical');
    const answeredCritical = criticalNeeds.filter(
      n => session.collectedResponses.some(r => r.needId === n.id)
    );
    if (answeredCritical.length === criticalNeeds.length && session.collectedResponses.length >= 2) {
      session.status = 'processing';
    }

    session.updatedAt = new Date().toISOString();
    interactiveSessions.set(sessionId, session);

    console.log(`   Session status: ${session.status}`);
    console.log(`   Vera AI response generated`);

    return c.json({
      success: true,
      data: {
        session: session,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0]?.message || 'Invalid request data');
    }
    throw error;
  }
});

// POST /api/analyze/interactive/:sessionId/reanalyze - Trigger reanalysis with collected info
analyze.post('/interactive/:sessionId/reanalyze', optionalAuth, async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const session = interactiveSessions.get(sessionId);

    if (!session) {
      return c.json({ success: false, error: 'Session not found' }, 404);
    }

    if (session.collectedResponses.length === 0) {
      return c.json({ success: false, error: 'No additional information provided' }, 400);
    }

    console.log(`🔄 Reanalyzing with ${session.collectedResponses.length} additional inputs`);

    // Get original analysis
    const [originalAnalysis] = await db
      .select()
      .from(itemAnalyses)
      .where(eq(itemAnalyses.id, session.analysisId))
      .limit(1);

    if (!originalAnalysis) {
      return c.json({ success: false, error: 'Original analysis not found' }, 404);
    }

    // Build enhanced context from collected responses
    const additionalContext = session.collectedResponses
      .filter(r => r.type === 'text')
      .map(r => r.content)
      .join('\n');

    // Collect additional photos
    const additionalPhotos = session.collectedResponses
      .filter(r => r.type === 'photo')
      .map((r, idx) => ({
        id: `interactive-${idx}`,
        dataUrl: r.content,
        role: 'detail' as ImageRole,
        label: `Interactive Photo ${idx + 1}`,
      }));

    // Build input for reanalysis
    let analysisInput: string | CapturedImage[];
    if (additionalPhotos.length > 0 && originalAnalysis.imageUrl) {
      // Multi-image with new photos
      const primaryImageUrl = await getImageUrl(originalAnalysis.imageUrl);
      // For reanalysis, we'd need to fetch the original image
      // For now, use the additional photos
      analysisInput = additionalPhotos;
    } else {
      // Text-only enhancement - use original image key
      const imageUrl = await getImageUrl(originalAnalysis.imageUrl);
      analysisInput = imageUrl;
    }

    // Run enhanced analysis with consensus for better accuracy
    const newAnalysis = await analyzeWithConsensus(
      analysisInput,
      originalAnalysis.askingPrice ?? undefined,
      {
        forceMultiRun: true,
        config: { useReasoningModel: true },
      }
    );

    // Update session with new analysis
    const updatedSession = updateWithReanalysis(session, newAnalysis);
    interactiveSessions.set(sessionId, updatedSession);

    // Update database record
    await db
      .update(itemAnalyses)
      .set({
        name: newAnalysis.name,
        maker: newAnalysis.maker || null,
        confidence: newAnalysis.confidence,
        description: newAnalysis.description,
        authenticityRisk: newAnalysis.authenticityRisk || null,
        authenticationConfidence: newAnalysis.authenticationConfidence || null,
        estimatedValueMin: newAnalysis.estimatedValueMin || null,
        estimatedValueMax: newAnalysis.estimatedValueMax || null,
      })
      .where(eq(itemAnalyses.id, session.analysisId));

    console.log(`✅ Reanalysis complete`);
    console.log(`   New confidence: ${(newAnalysis.confidence * 100).toFixed(0)}%`);

    // Get updated escalation options
    const escalation = getEscalationOptions(newAnalysis);

    return c.json({
      success: true,
      data: {
        session: updatedSession,
        newAnalysis,
        escalation,
      },
    });
  } catch (error) {
    throw error;
  }
});

export default analyze;
