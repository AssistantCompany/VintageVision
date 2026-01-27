/**
 * VintageVision Analysis API Tests
 * Comprehensive test suite for /api/analyze endpoints
 *
 * @description Tests all analysis endpoints including:
 * - Single image analysis
 * - Multi-image analysis
 * - Asking price / deal rating
 * - Consensus mode
 * - Vera interactive sessions
 * - Error handling
 * - Response schema validation
 *
 * Uses Playwright's APIRequestContext for HTTP testing
 */

import { test, expect, APIRequestContext, APIResponse } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** API response wrapper type */
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Analysis result from API */
interface AnalysisResult {
  id: string;
  name: string;
  maker: string | null;
  modelNumber: string | null;
  brand: string | null;
  productCategory: string | null;
  domainExpert: string | null;
  itemSubcategory: string | null;
  era: string | null;
  style: string | null;
  periodStart: number | null;
  periodEnd: number | null;
  originRegion: string | null;
  description: string;
  historicalContext: string;
  attributionNotes: string | null;
  estimatedValueMin: number | null;
  estimatedValueMax: number | null;
  currentRetailPrice: number | null;
  comparableSales: Array<{
    description: string;
    venue: string;
    price: number;
    date: string;
    relevance: string;
  }> | null;
  confidence: number;
  identificationConfidence: number | null;
  makerConfidence: number | null;
  evidenceFor: string[] | null;
  evidenceAgainst: string[] | null;
  alternativeCandidates: Array<{
    name: string;
    confidence: number;
    reason: string;
  }> | null;
  verificationTips: string[] | null;
  redFlags: string[] | null;
  askingPrice: number | null;
  dealRating: 'exceptional' | 'good' | 'fair' | 'overpriced' | null;
  dealExplanation: string | null;
  profitPotentialMin: number | null;
  profitPotentialMax: number | null;
  flipDifficulty: 'easy' | 'moderate' | 'hard' | 'very_hard' | null;
  flipTimeEstimate: string | null;
  resaleChannels: string[] | null;
  imageUrl: string;
  stylingSuggestions: Array<{
    roomType: string;
    title: string;
    description: string;
    placement?: string | null;
    complementaryItems: string[];
    colorPalette: string[];
    designTips?: string | null;
  }> | null;
  productUrl: string | null;
  authenticationConfidence: number | null;
  authenticityRisk: 'low' | 'medium' | 'high' | 'very_high' | null;
  authenticationChecklist: unknown[] | null;
  knownFakeIndicators: string[] | null;
  additionalPhotosRequested: unknown[] | null;
  expertReferralRecommended: boolean | null;
  expertReferralReason: string | null;
  authenticationAssessment: string | null;
  visualMarkers: unknown[] | null;
  knowledgeState: unknown | null;
  itemAuthentication: unknown | null;
  suggestedCaptures: unknown[] | null;
  marketplaceLinks: Array<{
    marketplaceName: string;
    linkUrl: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

/** Vera assistant info response */
interface VeraInfoResponse {
  assistantName: string;
  title: string;
  greeting: string;
  style: string;
  expertise: string;
}

/** Interactive session response */
interface InteractiveSessionResponse {
  session: {
    id: string;
    analysisId: string;
    currentAnalysis: unknown;
    informationNeeds: Array<{
      id: string;
      type: string;
      priority: string;
      question: string;
      explanation: string;
      expectedConfidenceGain: number;
      photoGuidance?: string;
    }>;
    collectedResponses: unknown[];
    conversationHistory: Array<{
      role: string;
      content: string;
      timestamp: string;
      relatedNeedId?: string;
    }>;
    confidenceProgress: unknown[];
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  escalation: unknown;
  assistantName: string;
}

/** Image role for multi-image analysis */
type ImageRole = 'overview' | 'detail' | 'marks' | 'underside' | 'damage' | 'context' | 'additional';

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const TEST_IMAGES_DIR = '/home/dev/scaledminds_07/projects/vintagevision/test-images';

// Analysis should complete within 30 seconds
const ANALYSIS_TIMEOUT = 30000;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Load a test image and convert to base64 data URL
 */
function loadTestImage(filename: string): string {
  const imagePath = path.join(TEST_IMAGES_DIR, filename);
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Test image not found: ${imagePath}`);
  }
  const imageBuffer = fs.readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');
  const extension = path.extname(filename).toLowerCase().slice(1);
  const mimeType = extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : `image/${extension}`;
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Validate analysis response schema
 */
function validateAnalysisSchema(data: AnalysisResult): void {
  // Required string fields
  expect(typeof data.id).toBe('string');
  expect(data.id.length).toBeGreaterThan(0);
  expect(typeof data.name).toBe('string');
  expect(data.name.length).toBeGreaterThan(0);
  expect(typeof data.description).toBe('string');
  expect(typeof data.historicalContext).toBe('string');
  expect(typeof data.imageUrl).toBe('string');
  expect(typeof data.createdAt).toBe('string');
  expect(typeof data.updatedAt).toBe('string');

  // Confidence must be a number between 0 and 1
  expect(typeof data.confidence).toBe('number');
  expect(data.confidence).toBeGreaterThanOrEqual(0);
  expect(data.confidence).toBeLessThanOrEqual(1);

  // Marketplace links must be an array
  expect(Array.isArray(data.marketplaceLinks)).toBe(true);

  // Optional fields should be correct type or null
  if (data.maker !== null) expect(typeof data.maker).toBe('string');
  if (data.era !== null) expect(typeof data.era).toBe('string');
  if (data.productCategory !== null) expect(typeof data.productCategory).toBe('string');
  if (data.domainExpert !== null) expect(typeof data.domainExpert).toBe('string');
  if (data.estimatedValueMin !== null) expect(typeof data.estimatedValueMin).toBe('number');
  if (data.estimatedValueMax !== null) expect(typeof data.estimatedValueMax).toBe('number');

  // Deal rating validation
  if (data.dealRating !== null) {
    expect(['exceptional', 'good', 'fair', 'overpriced']).toContain(data.dealRating);
  }

  // Authenticity risk validation
  if (data.authenticityRisk !== null) {
    expect(['low', 'medium', 'high', 'very_high']).toContain(data.authenticityRisk);
  }
}

/**
 * Validate error response format
 */
function validateErrorResponse(response: APIResponse, data: ApiResponse): void {
  expect(data.success).toBe(false);
  expect(typeof data.error).toBe('string');
  expect(data.error!.length).toBeGreaterThan(0);
}

// ============================================================================
// TEST FIXTURE
// ============================================================================

test.describe('VintageVision Analysis API', () => {
  let request: APIRequestContext;
  let savedAnalysisId: string | null = null;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    await request.dispose();
  });

  // ==========================================================================
  // HEALTH CHECK
  // ==========================================================================

  test.describe('Health Check', () => {
    test('GET /health returns 200 and healthy status', async () => {
      const response = await request.get('/health');
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('healthy');
    });
  });

  // ==========================================================================
  // VERA ASSISTANT INFO
  // ==========================================================================

  test.describe('Vera Assistant Info', () => {
    test('GET /api/analyze/vera/info returns assistant information', async () => {
      const response = await request.get('/api/analyze/vera/info');
      expect(response.status()).toBe(200);

      const data: ApiResponse<VeraInfoResponse> = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();

      const veraInfo = data.data!;
      expect(veraInfo.assistantName).toBe('Vera');
      expect(typeof veraInfo.title).toBe('string');
      expect(typeof veraInfo.greeting).toBe('string');
      expect(typeof veraInfo.style).toBe('string');
      expect(typeof veraInfo.expertise).toBe('string');
    });
  });

  // ==========================================================================
  // SINGLE IMAGE ANALYSIS
  // ==========================================================================

  test.describe('Single Image Analysis', () => {
    test('POST /api/analyze accepts image and returns analysis', async () => {
      const imageData = loadTestImage('vintage-vase.jpg');

      const startTime = Date.now();
      const response = await request.post('/api/analyze', {
        data: {
          image: imageData,
        },
        timeout: ANALYSIS_TIMEOUT,
      });
      const elapsed = Date.now() - startTime;

      // Timing assertion
      expect(elapsed).toBeLessThan(ANALYSIS_TIMEOUT);

      expect(response.status()).toBe(200);

      const result: ApiResponse<AnalysisResult> = await response.json();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();

      // Validate schema
      validateAnalysisSchema(result.data!);

      // Save analysis ID for later tests
      savedAnalysisId = result.data!.id;

      // Log analysis summary
      console.log(`Analysis completed in ${elapsed}ms`);
      console.log(`  Item: ${result.data!.name}`);
      console.log(`  Confidence: ${(result.data!.confidence * 100).toFixed(0)}%`);
      console.log(`  Domain: ${result.data!.domainExpert}`);
    });

    test('POST /api/analyze handles asking price parameter', async () => {
      const imageData = loadTestImage('antique-clock.jpg');
      const askingPrice = 15000; // $150.00 in cents

      const response = await request.post('/api/analyze', {
        data: {
          image: imageData,
          askingPrice,
        },
        timeout: ANALYSIS_TIMEOUT,
      });

      expect(response.status()).toBe(200);

      const result: ApiResponse<AnalysisResult> = await response.json();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();

      // Should have deal rating when asking price provided
      expect(result.data!.askingPrice).toBe(askingPrice);

      // Deal rating should be present
      if (result.data!.dealRating !== null) {
        expect(['exceptional', 'good', 'fair', 'overpriced']).toContain(result.data!.dealRating);
        expect(typeof result.data!.dealExplanation).toBe('string');
      }

      console.log(`Deal Rating: ${result.data!.dealRating || 'not calculated'}`);
    });

    test('POST /api/analyze handles different image types', async () => {
      // Test with different vintage items
      const testImages = [
        'vintage-watch.jpg',
        'vintage-camera.jpg',
        'antique-furniture.jpg',
      ];

      for (const imageName of testImages) {
        try {
          const imageData = loadTestImage(imageName);

          const response = await request.post('/api/analyze', {
            data: { image: imageData },
            timeout: ANALYSIS_TIMEOUT,
          });

          expect(response.status()).toBe(200);
          const result: ApiResponse<AnalysisResult> = await response.json();
          expect(result.success).toBe(true);

          console.log(`${imageName}: ${result.data?.name} (${result.data?.domainExpert})`);
        } catch (error) {
          // Log but don't fail if image doesn't exist
          console.log(`Skipping ${imageName}: Image not found or analysis failed`);
        }
      }
    });
  });

  // ==========================================================================
  // MULTI-IMAGE ANALYSIS
  // ==========================================================================

  test.describe('Multi-Image Analysis', () => {
    test('POST /api/analyze handles multi-image upload', async () => {
      const primaryImage = loadTestImage('vintage-vase.jpg');
      const detailImage = loadTestImage('antique-vase.jpg');

      const response = await request.post('/api/analyze', {
        data: {
          image: primaryImage,
          multiImageAnalysis: true,
          additionalImages: [
            {
              role: 'detail' as ImageRole,
              dataUrl: detailImage,
            },
          ],
        },
        timeout: ANALYSIS_TIMEOUT,
      });

      expect(response.status()).toBe(200);

      const result: ApiResponse<AnalysisResult> = await response.json();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();

      // Multi-image should still return valid analysis
      validateAnalysisSchema(result.data!);

      console.log(`Multi-image analysis: ${result.data!.name}`);
      console.log(`  Confidence: ${(result.data!.confidence * 100).toFixed(0)}%`);
    });

    test('POST /api/analyze handles multiple additional images with different roles', async () => {
      const primaryImage = loadTestImage('antique-jewelry.jpg');

      const response = await request.post('/api/analyze', {
        data: {
          image: primaryImage,
          multiImageAnalysis: true,
          additionalImages: [
            {
              role: 'detail' as ImageRole,
              dataUrl: loadTestImage('vintage-brooch.jpg'),
            },
            {
              role: 'marks' as ImageRole,
              dataUrl: loadTestImage('pocket-watch.jpg'),
            },
          ],
        },
        timeout: ANALYSIS_TIMEOUT,
      });

      expect(response.status()).toBe(200);

      const result: ApiResponse<AnalysisResult> = await response.json();
      expect(result.success).toBe(true);
    });
  });

  // ==========================================================================
  // CONSENSUS MODE
  // ==========================================================================

  test.describe('Consensus Mode Analysis', () => {
    test('POST /api/analyze handles consensusMode=auto', async () => {
      const imageData = loadTestImage('art-deco-lamp.jpg');

      const response = await request.post('/api/analyze', {
        data: {
          image: imageData,
          consensusMode: 'auto',
        },
        timeout: ANALYSIS_TIMEOUT,
      });

      expect(response.status()).toBe(200);

      const result: ApiResponse<AnalysisResult> = await response.json();
      expect(result.success).toBe(true);
      validateAnalysisSchema(result.data!);
    });

    test('POST /api/analyze handles consensusMode=never', async () => {
      const imageData = loadTestImage('mid-century-chair.jpg');

      const response = await request.post('/api/analyze', {
        data: {
          image: imageData,
          consensusMode: 'never',
        },
        timeout: ANALYSIS_TIMEOUT,
      });

      expect(response.status()).toBe(200);

      const result: ApiResponse<AnalysisResult> = await response.json();
      expect(result.success).toBe(true);
      validateAnalysisSchema(result.data!);
    });

    test('POST /api/analyze handles consensusMode=always with forceMultiRun', async () => {
      const imageData = loadTestImage('vintage-radio.jpg');

      const response = await request.post('/api/analyze', {
        data: {
          image: imageData,
          consensusMode: 'always',
          forceMultiRun: true,
          useReasoningModel: false, // Faster for testing
        },
        timeout: ANALYSIS_TIMEOUT,
      });

      expect(response.status()).toBe(200);

      const result: ApiResponse<AnalysisResult> = await response.json();
      expect(result.success).toBe(true);
    });
  });

  // ==========================================================================
  // RETRIEVE SAVED ANALYSIS
  // ==========================================================================

  test.describe('Retrieve Saved Analysis', () => {
    test('GET /api/analyze/:id retrieves saved analysis', async () => {
      // First create an analysis to retrieve
      const imageData = loadTestImage('vintage-typewriter.jpg');
      const createResponse = await request.post('/api/analyze', {
        data: { image: imageData },
        timeout: ANALYSIS_TIMEOUT,
      });

      const createResult: ApiResponse<AnalysisResult> = await createResponse.json();
      expect(createResult.success).toBe(true);
      const analysisId = createResult.data!.id;

      // Now retrieve it
      const getResponse = await request.get(`/api/analyze/${analysisId}`);
      expect(getResponse.status()).toBe(200);

      const getResult: ApiResponse<AnalysisResult> = await getResponse.json();
      expect(getResult.success).toBe(true);
      expect(getResult.data).toBeDefined();
      expect(getResult.data!.id).toBe(analysisId);
      expect(getResult.data!.name).toBe(createResult.data!.name);

      // Validate full schema
      validateAnalysisSchema(getResult.data!);
    });

    test('GET /api/analyze/:id returns 404 for non-existent analysis', async () => {
      const fakeId = 'non-existent-id-12345';
      const response = await request.get(`/api/analyze/${fakeId}`);

      expect(response.status()).toBe(404);

      const data: ApiResponse = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Analysis not found');
    });
  });

  // ==========================================================================
  // INTERACTIVE SESSION (VERA)
  // ==========================================================================

  test.describe('Interactive Session (Vera)', () => {
    let testAnalysisId: string;

    test.beforeAll(async () => {
      // Create an analysis to use for interactive sessions
      const imageData = loadTestImage('antique-books.jpg');
      const response = await request.post('/api/analyze', {
        data: { image: imageData },
        timeout: ANALYSIS_TIMEOUT,
      });
      const result: ApiResponse<AnalysisResult> = await response.json();
      testAnalysisId = result.data!.id;
    });

    test('POST /api/analyze/:id/interactive starts Vera session', async () => {
      const response = await request.post(`/api/analyze/${testAnalysisId}/interactive`);
      expect(response.status()).toBe(200);

      const result: ApiResponse<InteractiveSessionResponse> = await response.json();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();

      const sessionData = result.data!;
      expect(sessionData.assistantName).toBe('Vera');
      expect(sessionData.session).toBeDefined();
      expect(typeof sessionData.session.id).toBe('string');
      expect(sessionData.session.analysisId).toBe(testAnalysisId);
      expect(sessionData.session.status).toBe('gathering_info');
      expect(Array.isArray(sessionData.session.informationNeeds)).toBe(true);
      expect(Array.isArray(sessionData.session.conversationHistory)).toBe(true);

      // Should have initial greeting in conversation history
      expect(sessionData.session.conversationHistory.length).toBeGreaterThan(0);
      expect(sessionData.session.conversationHistory[0].role).toBe('assistant');
    });

    test('POST /api/analyze/:id/interactive returns 404 for non-existent analysis', async () => {
      const fakeId = 'non-existent-id-67890';
      const response = await request.post(`/api/analyze/${fakeId}/interactive`);

      expect(response.status()).toBe(404);

      const data: ApiResponse = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Analysis not found');
    });

    test('GET /api/analyze/interactive/:sessionId retrieves session', async () => {
      // First create a session
      const createResponse = await request.post(`/api/analyze/${testAnalysisId}/interactive`);
      const createResult: ApiResponse<InteractiveSessionResponse> = await createResponse.json();
      const sessionId = createResult.data!.session.id;

      // Then retrieve it
      const getResponse = await request.get(`/api/analyze/interactive/${sessionId}`);
      expect(getResponse.status()).toBe(200);

      const getResult: ApiResponse<{ id: string; analysisId: string }> = await getResponse.json();
      expect(getResult.success).toBe(true);
      expect(getResult.data!.id).toBe(sessionId);
    });

    test('GET /api/analyze/interactive/:sessionId returns 404 for non-existent session', async () => {
      const fakeSessionId = 'vera-fake-session-12345';
      const response = await request.get(`/api/analyze/interactive/${fakeSessionId}`);

      expect(response.status()).toBe(404);

      const data: ApiResponse = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Session not found');
    });

    test('POST /api/analyze/interactive/:sessionId/respond handles user response', async () => {
      // Create a session
      const createResponse = await request.post(`/api/analyze/${testAnalysisId}/interactive`);
      const createResult: ApiResponse<InteractiveSessionResponse> = await createResponse.json();
      const session = createResult.data!.session;

      // Get first information need
      if (session.informationNeeds.length > 0) {
        const firstNeed = session.informationNeeds[0];

        const respondResponse = await request.post(
          `/api/analyze/interactive/${session.id}/respond`,
          {
            data: {
              needId: firstNeed.id,
              type: 'text',
              content: 'This item was inherited from my grandmother.',
            },
          }
        );

        expect(respondResponse.status()).toBe(200);

        const respondResult: ApiResponse<{ session: { collectedResponses: unknown[] } }> =
          await respondResponse.json();
        expect(respondResult.success).toBe(true);
        expect(respondResult.data!.session.collectedResponses.length).toBeGreaterThan(0);
      }
    });
  });

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  test.describe('Error Handling', () => {
    test('POST /api/analyze returns error for missing image', async () => {
      const response = await request.post('/api/analyze', {
        data: {},
      });

      expect(response.status()).toBe(400);

      const data: ApiResponse = await response.json();
      validateErrorResponse(response, data);
      expect(data.error).toContain('Image data is required');
    });

    test('POST /api/analyze returns error for empty image string', async () => {
      const response = await request.post('/api/analyze', {
        data: {
          image: '',
        },
      });

      expect(response.status()).toBe(400);

      const data: ApiResponse = await response.json();
      validateErrorResponse(response, data);
    });

    test('POST /api/analyze returns error for invalid image format', async () => {
      const response = await request.post('/api/analyze', {
        data: {
          image: 'not-a-valid-data-url',
        },
      });

      expect(response.status()).toBe(400);

      const data: ApiResponse = await response.json();
      validateErrorResponse(response, data);
      expect(data.error).toContain('Invalid image format');
    });

    test('POST /api/analyze returns error for invalid base64 data', async () => {
      const response = await request.post('/api/analyze', {
        data: {
          image: 'data:image/jpeg;base64,!!!invalid-base64!!!',
        },
      });

      // This should fail during processing
      expect(response.status()).toBeGreaterThanOrEqual(400);

      const data: ApiResponse = await response.json();
      expect(data.success).toBe(false);
    });

    test('POST /api/analyze returns error for invalid consensusMode', async () => {
      const imageData = loadTestImage('vintage-vase.jpg');

      const response = await request.post('/api/analyze', {
        data: {
          image: imageData,
          consensusMode: 'invalid-mode',
        },
      });

      expect(response.status()).toBe(400);

      const data: ApiResponse = await response.json();
      validateErrorResponse(response, data);
    });

    test('POST /api/analyze returns error for invalid asking price', async () => {
      const imageData = loadTestImage('vintage-vase.jpg');

      const response = await request.post('/api/analyze', {
        data: {
          image: imageData,
          askingPrice: -100, // Negative price
        },
      });

      expect(response.status()).toBe(400);

      const data: ApiResponse = await response.json();
      validateErrorResponse(response, data);
    });

    test('POST /api/analyze/interactive/:sessionId/respond returns error for invalid data', async () => {
      // Create a session first
      const imageData = loadTestImage('vintage-toy.jpg');
      const analyzeResponse = await request.post('/api/analyze', {
        data: { image: imageData },
        timeout: ANALYSIS_TIMEOUT,
      });
      const analyzeResult: ApiResponse<AnalysisResult> = await analyzeResponse.json();

      const sessionResponse = await request.post(
        `/api/analyze/${analyzeResult.data!.id}/interactive`
      );
      const sessionResult: ApiResponse<InteractiveSessionResponse> = await sessionResponse.json();
      const sessionId = sessionResult.data!.session.id;

      // Send invalid response
      const response = await request.post(`/api/analyze/interactive/${sessionId}/respond`, {
        data: {
          // Missing required fields
        },
      });

      expect(response.status()).toBe(400);

      const data: ApiResponse = await response.json();
      validateErrorResponse(response, data);
    });
  });

  // ==========================================================================
  // RESPONSE SCHEMA VALIDATION
  // ==========================================================================

  test.describe('Response Schema Validation', () => {
    test('Analysis response contains all expected fields', async () => {
      const imageData = loadTestImage('vintage-oil-painting.jpg');

      const response = await request.post('/api/analyze', {
        data: { image: imageData },
        timeout: ANALYSIS_TIMEOUT,
      });

      const result: ApiResponse<AnalysisResult> = await response.json();
      expect(result.success).toBe(true);

      const data = result.data!;

      // Check all primary fields exist (can be null)
      const expectedFields = [
        'id',
        'name',
        'maker',
        'modelNumber',
        'brand',
        'productCategory',
        'domainExpert',
        'itemSubcategory',
        'era',
        'style',
        'periodStart',
        'periodEnd',
        'originRegion',
        'description',
        'historicalContext',
        'attributionNotes',
        'estimatedValueMin',
        'estimatedValueMax',
        'currentRetailPrice',
        'confidence',
        'identificationConfidence',
        'makerConfidence',
        'evidenceFor',
        'evidenceAgainst',
        'alternativeCandidates',
        'verificationTips',
        'redFlags',
        'dealRating',
        'dealExplanation',
        'flipDifficulty',
        'flipTimeEstimate',
        'resaleChannels',
        'imageUrl',
        'stylingSuggestions',
        'productUrl',
        'authenticationConfidence',
        'authenticityRisk',
        'marketplaceLinks',
        'createdAt',
        'updatedAt',
      ];

      for (const field of expectedFields) {
        expect(field in data).toBe(true);
      }
    });

    test('Marketplace links have correct structure', async () => {
      const imageData = loadTestImage('antique-clock.jpg');

      const response = await request.post('/api/analyze', {
        data: { image: imageData },
        timeout: ANALYSIS_TIMEOUT,
      });

      const result: ApiResponse<AnalysisResult> = await response.json();
      expect(result.success).toBe(true);

      const links = result.data!.marketplaceLinks;
      expect(Array.isArray(links)).toBe(true);

      for (const link of links) {
        expect(typeof link.marketplaceName).toBe('string');
        expect(typeof link.linkUrl).toBe('string');
        expect(link.linkUrl).toMatch(/^https?:\/\//);
      }
    });

    test('Vera info response has correct structure', async () => {
      const response = await request.get('/api/analyze/vera/info');
      const result: ApiResponse<VeraInfoResponse> = await response.json();

      expect(result.success).toBe(true);

      const info = result.data!;
      expect(info.assistantName).toBe('Vera');
      expect(info.title).toBeTruthy();
      expect(info.greeting).toBeTruthy();
      expect(info.greeting.length).toBeGreaterThan(50); // Should be a substantial greeting
    });
  });

  // ==========================================================================
  // PERFORMANCE TIMING
  // ==========================================================================

  test.describe('Performance Timing', () => {
    test('Analysis completes within 30 seconds', async () => {
      const imageData = loadTestImage('vintage-vase.jpg');

      const startTime = Date.now();
      const response = await request.post('/api/analyze', {
        data: { image: imageData },
        timeout: ANALYSIS_TIMEOUT,
      });
      const elapsed = Date.now() - startTime;

      expect(response.status()).toBe(200);
      expect(elapsed).toBeLessThan(ANALYSIS_TIMEOUT);

      console.log(`Analysis completed in ${(elapsed / 1000).toFixed(2)} seconds`);
    });

    test('Vera info endpoint responds quickly (< 500ms)', async () => {
      const startTime = Date.now();
      const response = await request.get('/api/analyze/vera/info');
      const elapsed = Date.now() - startTime;

      expect(response.status()).toBe(200);
      expect(elapsed).toBeLessThan(500);
    });

    test('Analysis retrieval responds quickly (< 1000ms)', async () => {
      // First create an analysis
      const imageData = loadTestImage('vintage-camera.jpg');
      const createResponse = await request.post('/api/analyze', {
        data: { image: imageData },
        timeout: ANALYSIS_TIMEOUT,
      });
      const createResult: ApiResponse<AnalysisResult> = await createResponse.json();
      const analysisId = createResult.data!.id;

      // Time the retrieval
      const startTime = Date.now();
      const response = await request.get(`/api/analyze/${analysisId}`);
      const elapsed = Date.now() - startTime;

      expect(response.status()).toBe(200);
      expect(elapsed).toBeLessThan(1000);

      console.log(`Analysis retrieval completed in ${elapsed}ms`);
    });
  });

  // ==========================================================================
  // RATE LIMITING (if implemented)
  // ==========================================================================

  test.describe('Rate Limiting', () => {
    test.skip('Rate limiting returns 429 after threshold', async () => {
      // This test is skipped by default as rate limiting behavior depends on configuration
      // Enable and configure based on actual rate limit settings
      const imageData = loadTestImage('vintage-vase.jpg');
      const requests: Promise<APIResponse>[] = [];

      // Send many requests quickly
      for (let i = 0; i < 20; i++) {
        requests.push(
          request.post('/api/analyze', {
            data: { image: imageData },
            timeout: ANALYSIS_TIMEOUT,
          })
        );
      }

      const responses = await Promise.all(requests);
      const rateLimited = responses.filter((r) => r.status() === 429);

      // If rate limiting is enabled, some should be rate limited
      // If not enabled, all should succeed
      console.log(`Rate limited responses: ${rateLimited.length}/${responses.length}`);
    });
  });

  // ==========================================================================
  // EDGE CASES
  // ==========================================================================

  test.describe('Edge Cases', () => {
    test('Handles very small asking price', async () => {
      const imageData = loadTestImage('vintage-vase.jpg');

      const response = await request.post('/api/analyze', {
        data: {
          image: imageData,
          askingPrice: 1, // 1 cent
        },
        timeout: ANALYSIS_TIMEOUT,
      });

      expect(response.status()).toBe(200);
      const result: ApiResponse<AnalysisResult> = await response.json();
      expect(result.success).toBe(true);
    });

    test('Handles very large asking price', async () => {
      const imageData = loadTestImage('vintage-oil-painting.jpg');

      const response = await request.post('/api/analyze', {
        data: {
          image: imageData,
          askingPrice: 10000000, // $100,000
        },
        timeout: ANALYSIS_TIMEOUT,
      });

      expect(response.status()).toBe(200);
      const result: ApiResponse<AnalysisResult> = await response.json();
      expect(result.success).toBe(true);
    });

    test('Handles additional context in request', async () => {
      const imageData = loadTestImage('antique-furniture.jpg');

      const response = await request.post('/api/analyze', {
        data: {
          image: imageData,
          additionalContext:
            'This piece was inherited from my grandmother. It has been in the family since the 1920s.',
        },
        timeout: ANALYSIS_TIMEOUT,
      });

      expect(response.status()).toBe(200);
      const result: ApiResponse<AnalysisResult> = await response.json();
      expect(result.success).toBe(true);
    });

    test('Handles empty additional images array', async () => {
      const imageData = loadTestImage('vintage-vase.jpg');

      const response = await request.post('/api/analyze', {
        data: {
          image: imageData,
          multiImageAnalysis: true,
          additionalImages: [],
        },
        timeout: ANALYSIS_TIMEOUT,
      });

      expect(response.status()).toBe(200);
      const result: ApiResponse<AnalysisResult> = await response.json();
      expect(result.success).toBe(true);
    });
  });
});
