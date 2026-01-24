import { useState, useEffect, useRef, useCallback } from 'react'

interface UseAnimatedCounterOptions {
  /** Duration of the animation in milliseconds */
  duration?: number
  /** Whether to start the animation immediately on mount */
  startOnMount?: boolean
  /** Starting value for the animation */
  startValue?: number
  /** Easing function type */
  easing?: 'linear' | 'easeOut' | 'easeInOut' | 'spring'
  /** Decimal places to show (for floating point numbers) */
  decimals?: number
  /** Delay before starting the animation in milliseconds */
  delay?: number
  /** Callback when animation completes */
  onComplete?: () => void
}

interface AnimatedCounterResult {
  /** Current animated value */
  value: number
  /** Formatted string value */
  displayValue: string
  /** Whether the animation is currently running */
  isAnimating: boolean
  /** Start or restart the animation */
  start: () => void
  /** Reset to start value */
  reset: () => void
  /** Pause the animation */
  pause: () => void
  /** Resume a paused animation */
  resume: () => void
}

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  spring: (t: number) => {
    const c4 = (2 * Math.PI) / 3
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },
}

/**
 * A hook for animating numbers with smooth counting effects.
 * Perfect for confidence scores, prices, and other numerical reveals.
 *
 * @example
 * ```tsx
 * const { displayValue } = useAnimatedCounter(87, { duration: 1500 })
 * return <span>{displayValue}%</span>
 * ```
 */
export function useAnimatedCounter(
  targetValue: number,
  options: UseAnimatedCounterOptions = {}
): AnimatedCounterResult {
  const {
    duration = 1500,
    startOnMount = true,
    startValue = 0,
    easing = 'easeOut',
    decimals = 0,
    delay = 0,
    onComplete,
  } = options

  const [value, setValue] = useState(startValue)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)
  const isPausedRef = useRef(false)
  const currentStartValue = useRef(startValue)

  const easingFn = easingFunctions[easing]

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easingFn(progress)

      const currentValue =
        currentStartValue.current +
        (targetValue - currentStartValue.current) * easedProgress

      setValue(currentValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setValue(targetValue)
        setIsAnimating(false)
        animationRef.current = null
        onComplete?.()
      }
    },
    [targetValue, duration, easingFn, onComplete]
  )

  const start = useCallback(() => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    currentStartValue.current = value
    startTimeRef.current = 0
    isPausedRef.current = false
    setIsAnimating(true)

    if (delay > 0) {
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, delay)
    } else {
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [animate, delay, value])

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    setValue(startValue)
    setIsAnimating(false)
    startTimeRef.current = 0
    currentStartValue.current = startValue
  }, [startValue])

  const pause = useCallback(() => {
    if (animationRef.current && !isPausedRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
      isPausedRef.current = true
      pausedTimeRef.current = performance.now() - startTimeRef.current
    }
  }, [])

  const resume = useCallback(() => {
    if (isPausedRef.current && isAnimating) {
      isPausedRef.current = false
      startTimeRef.current = performance.now() - pausedTimeRef.current
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [animate, isAnimating])

  // Start animation on mount if enabled
  useEffect(() => {
    if (startOnMount) {
      currentStartValue.current = startValue
      setValue(startValue)

      if (delay > 0) {
        const timer = setTimeout(() => {
          setIsAnimating(true)
          animationRef.current = requestAnimationFrame(animate)
        }, delay)
        return () => clearTimeout(timer)
      } else {
        setIsAnimating(true)
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [startOnMount, animate, delay, startValue])

  // Update when target changes (restart animation)
  useEffect(() => {
    if (!startOnMount) return

    // Don't restart if already at target
    if (Math.abs(value - targetValue) < 0.001) return

    currentStartValue.current = value
    startTimeRef.current = 0
    setIsAnimating(true)
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [targetValue]) // Only react to target changes

  // Format the display value
  const displayValue = value.toFixed(decimals)

  return {
    value,
    displayValue,
    isAnimating,
    start,
    reset,
    pause,
    resume,
  }
}

/**
 * Format a number as currency with animated counting
 *
 * @example
 * ```tsx
 * const { displayValue } = useAnimatedCurrency(1500, { currency: 'USD' })
 * return <span>{displayValue}</span> // "$1,500"
 * ```
 */
export function useAnimatedCurrency(
  targetValue: number,
  options: UseAnimatedCounterOptions & {
    currency?: string
    locale?: string
  } = {}
) {
  const { currency = 'USD', locale = 'en-US', ...counterOptions } = options

  const { value, isAnimating, start, reset, pause, resume } = useAnimatedCounter(
    targetValue,
    counterOptions
  )

  const displayValue = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value))

  return {
    value,
    displayValue,
    isAnimating,
    start,
    reset,
    pause,
    resume,
  }
}

/**
 * Format a number as a percentage with animated counting
 *
 * @example
 * ```tsx
 * const { displayValue } = useAnimatedPercentage(87)
 * return <span>{displayValue}</span> // "87%"
 * ```
 */
export function useAnimatedPercentage(
  targetValue: number,
  options: UseAnimatedCounterOptions & {
    showDecimal?: boolean
  } = {}
) {
  const { showDecimal = false, ...counterOptions } = options

  const { value, isAnimating, start, reset, pause, resume } = useAnimatedCounter(
    targetValue,
    {
      ...counterOptions,
      decimals: showDecimal ? 1 : 0,
    }
  )

  const displayValue = `${value.toFixed(showDecimal ? 1 : 0)}%`

  return {
    value,
    displayValue,
    isAnimating,
    start,
    reset,
    pause,
    resume,
  }
}

export default useAnimatedCounter
