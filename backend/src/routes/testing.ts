/**
 * Testing API Routes for VintageVision
 * =====================================
 * Routes for running E2E tests, ground truth evaluation, and learning system management.
 * These routes should only be enabled in development/staging environments.
 */

import { Hono } from 'hono';
import { env } from '../config/env.js';
import {
  runAllE2ETests,
  runSmokeTest,
  formatE2EReport,
  GROUND_TRUTH_ITEMS,
  ANALYSIS_SUCCESS_CRITERIA,
  USER_JOURNEYS,
  E2E_TEST_CASES
} from '../testing/e2eTestRunner.js';
import { runSingleTest, runSmokeTest as runGroundTruthSmoke } from '../testing/evaluationHarness.js';
import {
  getLearningSystemState,
  getAllInsights,
  getAccuracyReport,
  exportLearningData,
  recordUserCorrection,
  recordExpertCorrection,
  recordSaleOutcome,
  addPromptAdjustment
} from '../services/selfLearning.js';
import { analyzeAntiqueImage } from '../services/openai.js';

const testingRouter = new Hono();

// ============================================================================
// MIDDLEWARE - Restrict to development only
// ============================================================================

testingRouter.use('*', async (c, next) => {
  // Only allow in development/staging
  if (env.NODE_ENV === 'production') {
    return c.json({ error: 'Testing routes disabled in production' }, 403);
  }
  await next();
});

// ============================================================================
// TEST EXECUTION ROUTES
// ============================================================================

/**
 * GET /api/testing/smoke
 * Quick health check - runs minimal tests
 */
testingRouter.get('/smoke', async (c) => {
  try {
    const result = await runSmokeTest();

    return c.json({
      success: result.healthy,
      issues: result.issues,
      duration: result.duration,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({
      success: false,
      error: String(error),
      timestamp: new Date().toISOString()
    }, 500);
  }
});

/**
 * POST /api/testing/run
 * Run full E2E test suite
 */
testingRouter.post('/run', async (c) => {
  try {
    const body = await c.req.json<{
      skipAccuracy?: boolean;
      skipPerformance?: boolean;
      skipFunctional?: boolean;
      verbose?: boolean;
    }>();

    const report = await runAllE2ETests({
      skipAccuracy: body.skipAccuracy,
      skipPerformance: body.skipPerformance,
      skipFunctional: body.skipFunctional,
      verbose: body.verbose
    });

    return c.json({
      success: report.summary.passRate === 100,
      report,
      formattedReport: formatE2EReport(report)
    });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * POST /api/testing/ground-truth/:id
 * Run a single ground truth test
 */
testingRouter.post('/ground-truth/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const item = GROUND_TRUTH_ITEMS.find((i: { id: string }) => i.id === id);

    if (!item) {
      return c.json({ error: `Ground truth item ${id} not found` }, 404);
    }

    const result = await runSingleTest(item);

    return c.json({
      itemId: id,
      result,
      passed: result.overallScore >= 80
    });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// ============================================================================
// DATA ACCESS ROUTES
// ============================================================================

/**
 * GET /api/testing/ground-truth
 * List all ground truth items
 */
testingRouter.get('/ground-truth', (c) => {
  const items = GROUND_TRUTH_ITEMS.map((item: any) => ({
    id: item.id,
    name: item.expected.name,
    category: item.expected.domainExpert,
    difficulty: item.expected.difficulty,
    imageUrl: item.imageUrl
  }));

  return c.json({
    count: items.length,
    items,
    byCateory: items.reduce((acc: Record<string, number>, item: any) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {}),
    byDifficulty: items.reduce((acc: Record<string, number>, item: any) => {
      acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
      return acc;
    }, {})
  });
});

/**
 * GET /api/testing/criteria
 * List all success criteria
 */
testingRouter.get('/criteria', (c) => {
  return c.json({
    count: ANALYSIS_SUCCESS_CRITERIA.length,
    criteria: ANALYSIS_SUCCESS_CRITERIA,
    byCategory: ANALYSIS_SUCCESS_CRITERIA.reduce((acc: Record<string, number>, c: any) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {}),
    byPriority: ANALYSIS_SUCCESS_CRITERIA.reduce((acc: Record<string, number>, c: any) => {
      acc[c.priority] = (acc[c.priority] || 0) + 1;
      return acc;
    }, {})
  });
});

/**
 * GET /api/testing/journeys
 * List all user journeys
 */
testingRouter.get('/journeys', (c) => {
  return c.json({
    count: USER_JOURNEYS.length,
    journeys: USER_JOURNEYS.map((j: any) => ({
      id: j.id,
      name: j.name,
      persona: j.persona,
      priority: j.priority,
      stepsCount: j.steps.length
    }))
  });
});

/**
 * GET /api/testing/e2e-tests
 * List all E2E test cases
 */
testingRouter.get('/e2e-tests', (c) => {
  return c.json({
    count: E2E_TEST_CASES.length,
    tests: E2E_TEST_CASES.map((t: any) => ({
      id: t.id,
      name: t.name,
      type: t.type,
      journeyId: t.journeyId,
      automated: t.automated,
      criteriaCount: t.criteriaIds.length
    })),
    byType: E2E_TEST_CASES.reduce((acc: Record<string, number>, t: any) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {})
  });
});

// ============================================================================
// LEARNING SYSTEM ROUTES
// ============================================================================

/**
 * GET /api/testing/learning/state
 * Get current learning system state
 */
testingRouter.get('/learning/state', (c) => {
  const state = getLearningSystemState();
  return c.json(state);
});

/**
 * GET /api/testing/learning/insights
 * Get all learning insights
 */
testingRouter.get('/learning/insights', (c) => {
  const insights = getAllInsights();
  return c.json({
    count: insights.length,
    insights
  });
});

/**
 * GET /api/testing/learning/accuracy
 * Get accuracy report from learning data
 */
testingRouter.get('/learning/accuracy', (c) => {
  const report = getAccuracyReport();
  return c.json(report);
});

/**
 * GET /api/testing/learning/export
 * Export all learning data
 */
testingRouter.get('/learning/export', (c) => {
  const data = exportLearningData();
  return c.json(data);
});

/**
 * POST /api/testing/learning/correction
 * Record a correction from user or expert
 */
testingRouter.post('/learning/correction', async (c) => {
  try {
    const body = await c.req.json<{
      type: 'user' | 'expert';
      analysisId: string;
      imageHash: string;
      original: {
        name: string;
        maker: string | null;
        era: string;
        style: string;
        valueMin: number;
        valueMax: number;
        confidence: number;
        category?: string;
      };
      field: string;
      correctedValue: unknown;
      expertId?: string;
      notes?: string;
    }>();

    if (body.type === 'expert' && body.expertId) {
      await recordExpertCorrection(
        body.analysisId,
        body.imageHash,
        body.original,
        body.field,
        body.correctedValue,
        body.expertId,
        body.notes
      );
    } else {
      await recordUserCorrection(
        body.analysisId,
        body.imageHash,
        body.original,
        body.field,
        body.correctedValue,
        body.notes
      );
    }

    return c.json({ success: true, message: 'Correction recorded' });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * POST /api/testing/learning/sale-outcome
 * Record a sale outcome for learning
 */
testingRouter.post('/learning/sale-outcome', async (c) => {
  try {
    const body = await c.req.json<{
      analysisId: string;
      imageHash: string;
      original: {
        name: string;
        maker: string | null;
        era: string;
        style: string;
        valueMin: number;
        valueMax: number;
        confidence: number;
        category?: string;
      };
      salePrice: number;
      saleVenue: string;
    }>();

    await recordSaleOutcome(
      body.analysisId,
      body.imageHash,
      body.original,
      body.salePrice,
      body.saleVenue
    );

    return c.json({ success: true, message: 'Sale outcome recorded' });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * POST /api/testing/learning/prompt-adjustment
 * Add a new prompt adjustment rule
 */
testingRouter.post('/learning/prompt-adjustment', async (c) => {
  try {
    const body = await c.req.json<{
      condition: string;
      adjustment: string;
      category?: string;
    }>();

    const id = addPromptAdjustment(body.condition, body.adjustment, body.category);

    return c.json({ success: true, id });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// ============================================================================
// ANALYSIS TEST ROUTES
// ============================================================================

/**
 * POST /api/testing/analyze
 * Run actual analysis on a test image (for integration testing)
 */
testingRouter.post('/analyze', async (c) => {
  try {
    const body = await c.req.json<{
      imageBase64: string;
      askingPrice?: number;
    }>();

    if (!body.imageBase64) {
      return c.json({ error: 'imageBase64 required' }, 400);
    }

    const result = await analyzeAntiqueImage(
      body.imageBase64,
      body.askingPrice
    );

    return c.json({
      success: true,
      result
    });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

export default testingRouter;
