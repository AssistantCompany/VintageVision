import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const ONBOARDING_STORAGE_KEY = 'vintagevision_onboarding_complete'

interface UseOnboardingReturn {
  /** Whether to show the onboarding flow */
  showOnboarding: boolean
  /** Mark onboarding as completed */
  completeOnboarding: () => void
  /** Skip the onboarding flow */
  skipOnboarding: () => void
  /** Reset onboarding state (for testing) */
  resetOnboarding: () => void
  /** Current loading state */
  isLoading: boolean
}

/**
 * Hook to manage onboarding flow state
 * Shows onboarding for authenticated users who haven't completed it
 */
export function useOnboarding(): UseOnboardingReturn {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check localStorage on mount
  useEffect(() => {
    const checkOnboardingStatus = () => {
      try {
        const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY)
        setHasCompletedOnboarding(stored === 'true')
      } catch (error) {
        // localStorage might not be available - show onboarding anyway
        console.warn('[Onboarding] Could not access localStorage:', error)
        setHasCompletedOnboarding(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [])

  const completeOnboarding = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
      setHasCompletedOnboarding(true)
      console.log('[Onboarding] Onboarding completed')
    } catch (error) {
      console.warn('[Onboarding] Could not save to localStorage:', error)
      setHasCompletedOnboarding(true)
    }
  }, [])

  const skipOnboarding = useCallback(() => {
    // Skip behaves the same as complete - user chose not to see it
    completeOnboarding()
    console.log('[Onboarding] Onboarding skipped')
  }, [completeOnboarding])

  const resetOnboarding = useCallback(() => {
    try {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY)
      setHasCompletedOnboarding(false)
      console.log('[Onboarding] Onboarding reset')
    } catch (error) {
      console.warn('[Onboarding] Could not reset localStorage:', error)
    }
  }, [])

  // Determine if we should show onboarding:
  // - User must be authenticated
  // - User must not have completed onboarding
  // - Loading must be complete
  const showOnboarding = !isAuthLoading &&
    !isLoading &&
    !!user &&
    hasCompletedOnboarding === false

  return {
    showOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    isLoading: isLoading || isAuthLoading
  }
}

export default useOnboarding
