import { useState, useEffect } from "react"

/**
 * Hook to detect media query matches
 * @param query - CSS media query string (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window is defined (SSR safety)
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler)
      return () => mediaQuery.removeEventListener("change", handler)
    }
    // Fallback for older browsers
    mediaQuery.addListener(handler)
    return () => mediaQuery.removeListener(handler)
  }, [query])

  return matches
}

// Pre-configured breakpoint hooks
export function useIsMobile(): boolean {
  return !useMediaQuery("(min-width: 768px)")
}

export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 768px)") && !useMediaQuery("(min-width: 1024px)")
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)")
}

// Detect specific capabilities
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}

export function usePrefersDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)")
}

export function usePrefersHighContrast(): boolean {
  return useMediaQuery("(prefers-contrast: more)")
}
