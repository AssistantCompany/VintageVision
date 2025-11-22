import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface SafeAreaInsets {
  top: number
  right: number
  bottom: number
  left: number
}

interface SafeAreaContextType {
  insets: SafeAreaInsets
  isStandalone: boolean
  hasNotch: boolean
}

const SafeAreaContext = createContext<SafeAreaContextType | null>(null)

export function useSafeArea() {
  const context = useContext(SafeAreaContext)
  if (!context) {
    throw new Error('useSafeArea must be used within SafeAreaProvider')
  }
  return context
}

interface SafeAreaProviderProps {
  children: ReactNode
}

export function SafeAreaProvider({ children }: SafeAreaProviderProps) {
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  })
  const [isStandalone, setIsStandalone] = useState(false)
  const [hasNotch, setHasNotch] = useState(false)

  useEffect(() => {
    // Check if running in standalone mode (PWA)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                     (window.navigator as any).standalone === true

    setIsStandalone(standalone)

    // Detect notch/safe areas
    const updateSafeArea = () => {
      // Get CSS environment variables for safe area
      const getEnvValue = (variable: string) => {
        const value = getComputedStyle(document.documentElement)
          .getPropertyValue(`env(${variable})`)
        return parseInt(value) || 0
      }

      const top = getEnvValue('safe-area-inset-top')
      const right = getEnvValue('safe-area-inset-right')
      const bottom = getEnvValue('safe-area-inset-bottom')
      const left = getEnvValue('safe-area-inset-left')

      setInsets({ top, right, bottom, left })

      // Detect if device has a notch
      setHasNotch(top > 20) // iOS devices with notch typically have top inset > 20px
    }

    updateSafeArea()

    // Update on orientation change
    window.addEventListener('orientationchange', updateSafeArea)
    window.addEventListener('resize', updateSafeArea)

    return () => {
      window.removeEventListener('orientationchange', updateSafeArea)
      window.removeEventListener('resize', updateSafeArea)
    }
  }, [])

  // Add CSS custom properties for safe area
  useEffect(() => {
    document.documentElement.style.setProperty('--safe-area-inset-top', `${insets.top}px`)
    document.documentElement.style.setProperty('--safe-area-inset-right', `${insets.right}px`)
    document.documentElement.style.setProperty('--safe-area-inset-bottom', `${insets.bottom}px`)
    document.documentElement.style.setProperty('--safe-area-inset-left', `${insets.left}px`)
  }, [insets])

  const value = {
    insets,
    isStandalone,
    hasNotch
  }

  return (
    <SafeAreaContext.Provider value={value}>
      {children}
    </SafeAreaContext.Provider>
  )
}

// Utility component for safe area padding
interface SafeAreaViewProps {
  children: ReactNode
  className?: string
  edges?: ('top' | 'right' | 'bottom' | 'left')[]
}

export function SafeAreaView({ 
  children, 
  className = '', 
  edges = ['top', 'right', 'bottom', 'left'] 
}: SafeAreaViewProps) {
  const { insets } = useSafeArea()

  const paddingStyle = {
    paddingTop: edges.includes('top') ? `${insets.top}px` : undefined,
    paddingRight: edges.includes('right') ? `${insets.right}px` : undefined,
    paddingBottom: edges.includes('bottom') ? `${insets.bottom}px` : undefined,
    paddingLeft: edges.includes('left') ? `${insets.left}px` : undefined,
  }

  return (
    <div className={className} style={paddingStyle}>
      {children}
    </div>
  )
}
