/**
 * useInteractiveSession - Hook for Vera Interactive Assistant
 *
 * Manages the interactive session with Vera for additional photo collection
 * and confidence improvement workflows.
 */

import { useState, useCallback } from 'react'
import { PhotoRequest } from '@/types'

// Types matching backend
export interface InformationNeed {
  id: string
  type: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  question: string
  explanation: string
  expectedConfidenceGain: number
  photoGuidance?: string
  examples?: string[]
}

export interface ConversationMessage {
  role: 'assistant' | 'user' | 'system'
  content: string
  timestamp: string
  relatedNeedId?: string
}

export interface ConfidenceProgress {
  timestamp: string
  overallConfidence: number
  reason: string
}

export interface InteractiveSession {
  id: string
  analysisId: string
  informationNeeds: InformationNeed[]
  conversationHistory: ConversationMessage[]
  confidenceProgress: ConfidenceProgress[]
  status: 'gathering_info' | 'processing' | 'complete' | 'abandoned'
  collectedResponses?: Array<{
    needId: string
    type: 'photo' | 'text'
    content: string
    timestamp: string
  }>
}

export interface EscalationOption {
  tier: 'quick_review' | 'full_authentication' | 'premium_appraisal'
  name: string
  price: number
  turnaround: string
  description: string
  includes: string[]
}

export interface EscalationInfo {
  recommended: boolean
  reason?: string
  options: EscalationOption[]
}

export interface VeraInfo {
  assistantName: string
  title: string
  greeting: string
  style: string
  expertise: string
}

export function useInteractiveSession() {
  const [session, setSession] = useState<InteractiveSession | null>(null)
  const [escalation, setEscalation] = useState<EscalationInfo | null>(null)
  const [veraInfo, setVeraInfo] = useState<VeraInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get Vera assistant info
  const getVeraInfo = useCallback(async (): Promise<VeraInfo | null> => {
    try {
      const response = await fetch('/api/analyze/vera/info')
      if (response.ok) {
        const data = await response.json()
        setVeraInfo(data.data)
        return data.data
      }
      return null
    } catch (err) {
      console.error('Failed to get Vera info:', err)
      return null
    }
  }, [])

  // Start interactive session for an analysis
  const startSession = useCallback(async (analysisId: string): Promise<InteractiveSession | null> => {
    setLoading(true)
    setError(null)

    try {
      console.log('🎭 Starting Vera interactive session for analysis:', analysisId)

      const response = await fetch(`/api/analyze/${analysisId}/interactive`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to start session' }))
        throw new Error(errorData.error || `Failed to start session (${response.status})`)
      }

      const data = await response.json()
      console.log('✅ Vera session started:', data.data.session.id)

      setSession(data.data.session)
      setEscalation(data.data.escalation || null)

      return data.data.session
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start interactive session'
      setError(message)
      console.error('❌ Failed to start Vera session:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Get existing session
  const getSession = useCallback(async (sessionId: string): Promise<InteractiveSession | null> => {
    try {
      const response = await fetch(`/api/analyze/interactive/${sessionId}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      setSession(data.data.session)
      return data.data.session
    } catch (err) {
      console.error('Failed to get session:', err)
      return null
    }
  }, [])

  // Send a response (photo or text) to the current need
  const sendResponse = useCallback(async (
    needId: string,
    type: 'photo' | 'text',
    content: string
  ): Promise<InteractiveSession | null> => {
    if (!session) {
      setError('No active session')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      console.log(`📤 Sending ${type} response to Vera for need:`, needId)

      const response = await fetch(`/api/analyze/interactive/${session.id}/respond`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ needId, type, content }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to send response' }))
        throw new Error(errorData.error || `Failed to send response (${response.status})`)
      }

      const data = await response.json()
      console.log('✅ Response received, session status:', data.data.session.status)

      setSession(data.data.session)
      return data.data.session
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send response'
      setError(message)
      console.error('❌ Failed to send response:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [session])

  // Trigger reanalysis with collected information
  const triggerReanalysis = useCallback(async (): Promise<any | null> => {
    if (!session) {
      setError('No active session')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      console.log('🔄 Triggering reanalysis with collected information...')

      const response = await fetch(`/api/analyze/interactive/${session.id}/reanalyze`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Reanalysis failed' }))
        throw new Error(errorData.error || `Reanalysis failed (${response.status})`)
      }

      const data = await response.json()
      console.log('✅ Reanalysis complete, new confidence:', data.data.analysis?.confidence)

      setSession(data.data.session)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to trigger reanalysis'
      setError(message)
      console.error('❌ Reanalysis failed:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [session])

  // Submit photos from AuthenticationWizard
  const submitAdditionalPhotos = useCallback(async (
    analysisId: string,
    photos: { photoRequest: PhotoRequest; imageData: string }[]
  ): Promise<any | null> => {
    setLoading(true)
    setError(null)

    try {
      console.log('📸 Submitting additional photos for analysis:', photos.length)

      // Start or get session
      let currentSession = session
      if (!currentSession || currentSession.analysisId !== analysisId) {
        currentSession = await startSession(analysisId)
        if (!currentSession) {
          throw new Error('Failed to start interactive session')
        }
      }

      // Submit each photo as a response
      for (const photo of photos) {
        // Find matching need or create a generic one
        const needId = photo.photoRequest.id || `photo-${photo.photoRequest.area}`
        await sendResponse(needId, 'photo', photo.imageData)
      }

      // Trigger reanalysis
      const result = await triggerReanalysis()
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit photos'
      setError(message)
      console.error('❌ Failed to submit photos:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [session, startSession, sendResponse, triggerReanalysis])

  // Clear session
  const clearSession = useCallback(() => {
    setSession(null)
    setEscalation(null)
    setError(null)
  }, [])

  return {
    // State
    session,
    escalation,
    veraInfo,
    loading,
    error,

    // Actions
    getVeraInfo,
    startSession,
    getSession,
    sendResponse,
    triggerReanalysis,
    submitAdditionalPhotos,
    clearSession,
  }
}

export default useInteractiveSession
