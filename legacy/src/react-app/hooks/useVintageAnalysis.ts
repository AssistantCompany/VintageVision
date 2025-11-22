import { useState, useCallback } from 'react'
import { ItemAnalysis } from '@/shared/types'

export function useVintageAnalysis() {
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeItem = useCallback(async (dataUrl: string): Promise<ItemAnalysis | null> => {
    setAnalyzing(true)
    setError(null)

    try {
      console.log('Starting image analysis...', {
        dataUrlLength: dataUrl.length,
        format: dataUrl.substring(0, 30)
      })

      // Validate data URL format
      if (!dataUrl || !dataUrl.startsWith('data:image/')) {
        throw new Error('Invalid image data format')
      }

      // Check data URL size (rough estimate: base64 is ~4/3 of binary size)
      const estimatedSize = (dataUrl.length * 3) / 4
      console.log('Estimated image size:', Math.round(estimatedSize / 1024), 'KB')
      
      if (estimatedSize > 20 * 1024 * 1024) { // 20MB limit to match backend
        throw new Error('Image too large. Please use an image under 20MB.')
      }

      if (estimatedSize < 500) { // 500 bytes minimum
        throw new Error('Image too small or corrupted. Please try a different image.')
      }

      console.log('Sending analysis request...')
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: dataUrl }),
      })

      console.log('Analysis response received:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Analysis failed' }))
        console.error('Analysis error response:', errorData)
        
        // Log error to backend for debugging
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: errorData.error || `Analysis failed (${response.status})`,
            context: 'image_analysis',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            details: { status: response.status, errorData }
          })
        }).catch(() => {}) // Silent fail for error logging
        
        throw new Error(errorData.error || `Analysis failed (${response.status})`)
      }

      const data = await response.json()
      console.log('Analysis data received:', { success: data.success, hasAnalysis: !!data.analysis })
      
      if (!data.success || !data.analysis) {
        throw new Error(data.error || 'Invalid response from analysis service')
      }
      
      // Transform the analysis to include computed properties for compatibility
      const rawAnalysis = data.analysis
      const analysis: ItemAnalysis = {
        ...rawAnalysis,
        historicalContext: rawAnalysis.historical_context || rawAnalysis.historicalContext || '',
        estimatedValueMin: rawAnalysis.estimated_value_min || rawAnalysis.estimatedValueMin,
        estimatedValueMax: rawAnalysis.estimated_value_max || rawAnalysis.estimatedValueMax,
        imageUrl: rawAnalysis.image_url || rawAnalysis.imageUrl || '',
        stylingSuggestions: rawAnalysis.styling_suggestions 
          ? (typeof rawAnalysis.styling_suggestions === 'string' 
              ? JSON.parse(rawAnalysis.styling_suggestions) 
              : rawAnalysis.styling_suggestions)
          : (rawAnalysis.stylingSuggestions || []),
        marketplaceLinks: rawAnalysis.marketplaceLinks || []
      }
      
      return analysis
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      return null
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const saveToCollection = useCallback(async (
    analysisId: string,
    notes?: string,
    location?: string
  ): Promise<boolean> => {
    try {
      console.log('Saving to collection:', { analysisId, notes, location })
      const response = await fetch('/api/collection', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_analysis_id: analysisId,
          notes,
          location,
        }),
      })

      console.log('Save to collection response:', response.status, response.statusText)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Save successful:', data)
        
        // Verify the save by immediately checking the collection
        setTimeout(async () => {
          try {
            const verifyResponse = await fetch('/api/collection', {
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            })
            
            if (verifyResponse.ok) {
              const verifyData = await verifyResponse.json()
              console.log('Collection verification:', {
                totalItems: verifyData.items?.length || verifyData.collection?.length || 0,
                savedItem: verifyData.items?.find((item: any) => item.item_analysis_id === analysisId) ||
                          verifyData.collection?.find((item: any) => item.analysis?.id === analysisId)
              })
            }
          } catch (e) {
            console.warn('Failed to verify collection save:', e)
          }
        }, 1000)
        
        return true
      } else {
        const errorData = await response.text()
        console.error('Save failed:', response.status, errorData)
        return false
      }
    } catch (error) {
      console.error('Failed to save to collection:', error)
      return false
    }
  }, [])

  const submitFeedback = useCallback(async (
    analysisId: string,
    isCorrect: boolean,
    correctionText?: string,
    feedbackType?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_analysis_id: analysisId,
          is_correct: isCorrect,
          correction_text: correctionText,
          feedback_type: feedbackType,
        }),
      })

      return response.ok
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      return false
    }
  }, [])

  const getCollection = useCallback(async () => {
    try {
      console.log('Fetching collection...')
      const response = await fetch('/api/collection', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Collection response:', response.status, response.statusText)
      
      if (response.status === 401) {
        console.log('Collection fetch failed: Not authenticated')
        return []
      }
      
      if (response.ok) {
        const data = await response.json()
        console.log('Collection data received:', { 
          success: data.success,
          itemsCount: data.items?.length || 0,
          collectionCount: data.collection?.length || 0,
          hasItems: !!(data.items || data.collection)
        })
        
        // Return the items array if available, otherwise fall back to collection
        return data.items || data.collection || []
      } else {
        const errorText = await response.text()
        console.error('Collection fetch failed:', response.status, errorText)
        return []
      }
    } catch (error) {
      console.error('Failed to get collection:', error)
      return []
    }
  }, [])

  const getPreferences = useCallback(async () => {
    try {
      const response = await fetch('/api/preferences')
      if (response.ok) {
        const data = await response.json()
        return data.preferences
      }
      return null
    } catch (error) {
      console.error('Failed to get preferences:', error)
      return null
    }
  }, [])

  const savePreferences = useCallback(async (preferences: any) => {
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })
      return response.ok
    } catch (error) {
      console.error('Failed to save preferences:', error)
      return false
    }
  }, [])

  const getWishlist = useCallback(async () => {
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        return data.wishlist || []
      }
      return []
    } catch (error) {
      console.error('Failed to get wishlist:', error)
      return []
    }
  }, [])

  const addToWishlist = useCallback(async (item: any) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      })
      return response.ok
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
      return false
    }
  }, [])

  return {
    analyzing,
    error,
    analyzeItem,
    saveToCollection,
    submitFeedback,
    getCollection,
    getPreferences,
    savePreferences,
    getWishlist,
    addToWishlist,
  }
}
