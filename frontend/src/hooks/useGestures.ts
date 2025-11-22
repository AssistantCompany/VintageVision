import { useRef, useState } from 'react'

interface GestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  enableHaptics?: boolean
  swipeThreshold?: number
  hapticIntensity?: 'light' | 'medium' | 'heavy'
}

export function useSwipeGesture(options: GestureOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    enableHaptics = true,
    swipeThreshold = 50,
    hapticIntensity = 'light'
  } = options

  const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHaptics) return
    
    if ('vibrate' in navigator) {
      const patterns = {
        light: [50],
        medium: [100],
        heavy: [200]
      }
      navigator.vibrate(patterns[intensity])
    }
  }

  let startX = 0
  let startY = 0

  const handleTouchStart = (e: TouchEvent | React.TouchEvent) => {
    const touch = e.touches[0]
    startX = touch.clientX
    startY = touch.clientY
  }

  const handleTouchEnd = (e: TouchEvent | React.TouchEvent) => {
    if (!startX || !startY) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - startX
    const deltaY = touch.clientY - startY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance > swipeThreshold) {
      triggerHaptic(hapticIntensity)
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }

    startX = 0
    startY = 0
  }

  return () => ({
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  })
}

export function usePullToRefresh(onRefresh: () => Promise<void>, threshold = 80) {
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)

  const handleTouchStart = (e: TouchEvent | React.TouchEvent) => {
    startY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: TouchEvent | React.TouchEvent) => {
    if (window.scrollY > 0) return

    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY.current)
    setPullDistance(Math.min(distance, threshold * 1.5))
  }

  const handleTouchEnd = async () => {
    if (pullDistance > threshold && !refreshing) {
      setRefreshing(true)
      
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100])
      }
      
      try {
        await onRefresh()
      } finally {
        setRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
    startY.current = 0
  }

  const bind = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }

  return { 
    bind, 
    refreshing, 
    pullDistance: { get: () => pullDistance }
  }
}

export function useLongPress(callback: () => void, duration = 500) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const start = () => {
    timeoutRef.current = setTimeout(() => {
      callback()
      // Haptic feedback for long press
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200])
      }
    }, duration)
  }

  const stop = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const bind = {
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchCancel: stop,
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop
  }

  return { bind }
}

export function usePinchZoom() {
  const [scale, setScale] = useState(1)

  const bind = {}

  const resetZoom = () => {
    setScale(1)
  }

  return { 
    bind,
    scale, 
    resetZoom 
  }
}
