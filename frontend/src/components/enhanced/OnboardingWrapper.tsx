import { AnimatePresence } from 'framer-motion'
import { useOnboarding } from '@/hooks/useOnboarding'
import OnboardingFlow from './OnboardingFlow'

/**
 * Wrapper component that conditionally renders the onboarding flow
 * Place this inside the Router but after AuthProvider
 */
export default function OnboardingWrapper() {
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding()

  return (
    <AnimatePresence>
      {showOnboarding && (
        <OnboardingFlow
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}
    </AnimatePresence>
  )
}
