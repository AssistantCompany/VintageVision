/**
 * useAnalysisStream Hook
 * SSE-based streaming analysis with real-time progress updates
 * January 2026 - Award-winning UX implementation
 */

import { useState, useCallback, useRef } from 'react'
import { ItemAnalysis } from '@/types'
import { formatErrorMessage } from '@/lib/utils'

export type AnalysisStage = 'idle' | 'upload' | 'triage' | 'evidence' | 'candidates' | 'analysis' | 'complete' | 'error'

export interface StageData {
  triage?: {
    category: string
    domain: string
    itemType: string
    era: string | null
    quality: string
  }
  evidence?: {
    maker: string | null
    condition: string
    textFound: number
    redFlags: number
  }
  candidates?: Array<{
    name: string
    confidence: number
    value: { low: number; high: number }
  }>
  analysis?: {
    name: string
    maker: string | null
    confidence: number
    authConfidence: number | null
    valueMin: number | null
    valueMax: number | null
  }
}

export interface AnalysisProgress {
  stage: AnalysisStage
  progress: number
  message: string
  stageData: StageData
  completedStages: AnalysisStage[]
  error: string | null
  result: ItemAnalysis | null
  startTime: number | null
  elapsedTime: number
}

const STAGE_ORDER: AnalysisStage[] = ['upload', 'triage', 'evidence', 'candidates', 'analysis', 'complete']

export function useAnalysisStream() {
  const [progress, setProgress] = useState<AnalysisProgress>({
    stage: 'idle',
    progress: 0,
    message: '',
    stageData: {},
    completedStages: [],
    error: null,
    result: null,
    startTime: null,
    elapsedTime: 0,
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startAnalysis = useCallback(async (
    imageData: string,
    askingPrice?: number,
    consensusMode: 'auto' | 'always' | 'never' = 'auto'
  ): Promise<ItemAnalysis | null> => {
    // Abort any existing analysis
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    const startTime = Date.now()

    // Start elapsed time counter
    timerRef.current = setInterval(() => {
      setProgress(prev => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - startTime) / 1000),
      }))
    }, 1000)

    // Reset state
    setProgress({
      stage: 'upload',
      progress: 0,
      message: 'Preparing your image...',
      stageData: {},
      completedStages: [],
      error: null,
      result: null,
      startTime,
      elapsedTime: 0,
    })

    return new Promise((resolve, reject) => {
      const handleComplete = (result: ItemAnalysis) => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        setProgress(prev => ({
          ...prev,
          stage: 'complete',
          progress: 100,
          message: 'Analysis complete!',
          result,
          completedStages: [...STAGE_ORDER],
        }))
        resolve(result)
      }

      const handleError = (error: string) => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        const userFriendlyError = formatErrorMessage(error)
        setProgress(prev => ({
          ...prev,
          stage: 'error',
          error: userFriendlyError,
          message: userFriendlyError,
        }))
        console.error('❌ Analysis failed:', error) // Keep technical error in console
        reject(new Error(userFriendlyError))
      }

      // Use regular fetch with POST body, then read as event stream
      fetch('/api/analyze/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          askingPrice,
          consensusMode,
        }),
        signal: abortControllerRef.current?.signal,
      })
        .then(async response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }

          const reader = response.body?.getReader()
          if (!reader) {
            throw new Error('No response body')
          }

          const decoder = new TextDecoder()
          let buffer = ''

          // Helper function to process SSE lines from buffer
          const processLines = (lines: string[]): boolean => {
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const eventData = JSON.parse(line.slice(6))

                  // Handle different event types
                  if (eventData.type === 'stage:start') {
                    setProgress(prev => ({
                      ...prev,
                      stage: eventData.stage as AnalysisStage,
                      progress: eventData.progress || prev.progress,
                      message: eventData.message || prev.message,
                    }))
                  } else if (eventData.type === 'stage:complete') {
                    const stage = eventData.stage as AnalysisStage
                    setProgress(prev => ({
                      ...prev,
                      stage,
                      progress: eventData.progress || prev.progress,
                      message: eventData.message || prev.message,
                      completedStages: [...prev.completedStages, stage],
                      stageData: {
                        ...prev.stageData,
                        [stage]: eventData.data,
                      },
                    }))
                  } else if (eventData.type === 'complete') {
                    handleComplete(eventData.data)
                    return true // Signal completion
                  } else if (eventData.type === 'error') {
                    handleError(eventData.message || 'Analysis failed')
                    return true // Signal completion
                  }
                } catch {
                  // Ignore parse errors for incomplete data
                }
              }
            }
            return false
          }

          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              // Process any remaining data in buffer when stream ends
              if (buffer.trim()) {
                const finalLines = buffer.split('\n').filter(l => l.trim())
                if (processLines(finalLines)) return
              }
              // Stream ended without complete event - this shouldn't happen
              handleError('Analysis stream ended unexpectedly')
              return
            }

            buffer += decoder.decode(value, { stream: true })

            // Parse SSE events from buffer
            const lines = buffer.split('\n')
            buffer = lines.pop() || '' // Keep incomplete line in buffer

            if (processLines(lines)) return
          }
        })
        .catch(error => {
          if (error.name === 'AbortError') {
            handleError('Analysis cancelled')
          } else {
            handleError(error.message || 'Analysis failed')
          }
        })
    })
  }, [])

  const cancelAnalysis = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setProgress(prev => ({
      ...prev,
      stage: 'idle',
      progress: 0,
      message: 'Cancelled',
      error: null,
    }))
  }, [])

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setProgress({
      stage: 'idle',
      progress: 0,
      message: '',
      stageData: {},
      completedStages: [],
      error: null,
      result: null,
      startTime: null,
      elapsedTime: 0,
    })
  }, [])

  return {
    progress,
    startAnalysis,
    cancelAnalysis,
    reset,
    isAnalyzing: !['idle', 'complete', 'error'].includes(progress.stage),
  }
}
