/**
 * Analysis Stream Service
 * Server-Sent Events helper for real-time analysis progress
 * January 2026 - Award-winning UX implementation
 */

export type AnalysisStage =
  | 'upload'
  | 'triage'
  | 'evidence'
  | 'candidates'
  | 'analysis'
  | 'complete';

export interface StageEvent {
  type: 'stage:start' | 'stage:complete' | 'stage:error';
  stage: AnalysisStage;
  message: string;
  progress: number; // 0-100
  data?: unknown;
}

export interface PartialEvent {
  type: 'partial';
  stage: AnalysisStage;
  field: string;
  data: unknown;
}

export interface CompleteEvent {
  type: 'complete';
  data: unknown;
}

export interface ErrorEvent {
  type: 'error';
  message: string;
  stage?: AnalysisStage;
}

export type AnalysisEvent = StageEvent | PartialEvent | CompleteEvent | ErrorEvent;

// Stage messages for user-friendly progress
export const STAGE_MESSAGES: Record<AnalysisStage, { start: string; complete: string }> = {
  upload: {
    start: 'Preparing your image...',
    complete: 'Image ready for analysis',
  },
  triage: {
    start: 'Identifying item category...',
    complete: 'Category identified',
  },
  evidence: {
    start: 'Examining maker marks and details...',
    complete: 'Evidence extracted',
  },
  candidates: {
    start: 'Matching against expert knowledge base...',
    complete: 'Identification candidates found',
  },
  analysis: {
    start: 'Generating comprehensive analysis...',
    complete: 'Analysis complete',
  },
  complete: {
    start: 'Finalizing results...',
    complete: 'Ready to view',
  },
};

// Progress percentages for each stage
export const STAGE_PROGRESS: Record<AnalysisStage, { start: number; end: number }> = {
  upload: { start: 0, end: 5 },
  triage: { start: 5, end: 20 },
  evidence: { start: 20, end: 45 },
  candidates: { start: 20, end: 45 }, // Parallel with evidence
  analysis: { start: 45, end: 95 },
  complete: { start: 95, end: 100 },
};

/**
 * Format SSE data for transmission
 */
export function formatSSE(event: AnalysisEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

/**
 * Create a stage start event
 */
export function stageStart(stage: AnalysisStage): StageEvent {
  return {
    type: 'stage:start',
    stage,
    message: STAGE_MESSAGES[stage].start,
    progress: STAGE_PROGRESS[stage].start,
  };
}

/**
 * Create a stage complete event
 */
export function stageComplete(stage: AnalysisStage, data?: unknown): StageEvent {
  return {
    type: 'stage:complete',
    stage,
    message: STAGE_MESSAGES[stage].complete,
    progress: STAGE_PROGRESS[stage].end,
    data,
  };
}

/**
 * Create a partial data event
 */
export function partialData(stage: AnalysisStage, field: string, data: unknown): PartialEvent {
  return {
    type: 'partial',
    stage,
    field,
    data,
  };
}

/**
 * Create complete event
 */
export function completeEvent(data: unknown): CompleteEvent {
  return {
    type: 'complete',
    data,
  };
}

/**
 * Create error event
 */
export function errorEvent(message: string, stage?: AnalysisStage): ErrorEvent {
  return {
    type: 'error',
    message,
    stage,
  };
}

console.log('✅ Analysis stream service initialized');
