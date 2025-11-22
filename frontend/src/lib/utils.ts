import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatRelativeTime(date: string | Date): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = (targetDate.getTime() - now.getTime()) / 1000
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2628000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
    if (count >= 1) {
      return rtf.format(diffInSeconds < 0 ? -count : count, interval.label as Intl.RelativeTimeFormatUnit)
    }
  }
  
  return 'just now'
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function downloadAsJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function shareContent(data: {
  title: string
  text: string
  url?: string
}): Promise<void> {
  if (navigator.share) {
    return navigator.share(data)
  } else {
    // Fallback to clipboard
    return navigator.clipboard.writeText(
      `${data.title}\n${data.text}\n${data.url || window.location.href}`
    )
  }
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export function isIOSDevice(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

export function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as NavigatorWithStandalone).standalone === true
}

export function requestFullscreen(element?: Element): Promise<void> {
  const elem = element || document.documentElement
  if (elem.requestFullscreen) {
    return elem.requestFullscreen()
  }
  return Promise.reject(new Error('Fullscreen not supported'))
}

export function exitFullscreen(): Promise<void> {
  if (document.exitFullscreen) {
    return document.exitFullscreen()
  }
  return Promise.reject(new Error('Exit fullscreen not supported'))
}

export function vibrate(pattern: number | number[]): boolean {
  if ('vibrate' in navigator) {
    return navigator.vibrate(pattern)
  }
  return false
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      const { width, height } = img
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      
      canvas.width = width * ratio
      canvas.height = height * ratio

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        'image/jpeg',
        quality
      )
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export function createImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',')
  const mimeMatch = header.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream'
  const binary = atob(data)
  const array = new Uint8Array(binary.length)
  
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i)
  }
  
  return new Blob([array], { type: mime })
}

interface WindowWithGtag extends Window {
  gtag?: (command: string, eventName: string, properties?: Record<string, unknown>) => void
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  // Integration with analytics services
  const windowWithGtag = window as WindowWithGtag
  if (typeof window !== 'undefined' && windowWithGtag.gtag) {
    windowWithGtag.gtag('event', eventName, properties)
  }
  
  // Custom analytics endpoint
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: eventName,
      category: 'user_interaction',
      ...properties,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    }),
  }).catch(() => {
    // Silently fail
  })
}

export function isWebShareSupported(): boolean {
  return 'share' in navigator
}

export function getBrowserInfo() {
  const ua = navigator.userAgent
  let browser = 'Unknown'
  let version = 'Unknown'

  if (ua.includes('Chrome')) {
    browser = 'Chrome'
    version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown'
  } else if (ua.includes('Firefox')) {
    browser = 'Firefox'
    version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown'
  } else if (ua.includes('Safari')) {
    browser = 'Safari'
    version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown'
  } else if (ua.includes('Edge')) {
    browser = 'Edge'
    version = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown'
  }

  return { browser, version }
}

export function getPerformanceMetrics() {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType('paint')
    
    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      navigationStart: navigation.startTime,
    }
  }
  return null
}
