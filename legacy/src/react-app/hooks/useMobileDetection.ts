import { useState, useEffect } from 'react'

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouchDevice: boolean
  isStandalone: boolean
  isIOS: boolean
  isAndroid: boolean
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  orientation: 'portrait' | 'landscape'
  devicePixelRatio: number
  hasNotchSupport: boolean
  supportsHaptics: boolean
  connectionType: string
}

export function useMobileDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        isStandalone: false,
        isIOS: false,
        isAndroid: false,
        screenSize: 'lg',
        orientation: 'landscape',
        devicePixelRatio: 1,
        hasNotchSupport: false,
        supportsHaptics: false,
        connectionType: 'unknown'
      }
    }

    const userAgent = navigator.userAgent.toLowerCase()
    const width = window.innerWidth
    const height = window.innerHeight
    
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || width < 768
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent) || (width >= 768 && width < 1024)
    const isDesktop = !isMobile && !isTablet
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true
    const isIOS = /ipad|iphone|ipod/.test(userAgent)
    const isAndroid = /android/.test(userAgent)
    
    const getScreenSize = () => {
      if (width < 475) return 'xs'
      if (width < 640) return 'sm'
      if (width < 768) return 'md'
      if (width < 1024) return 'lg'
      if (width < 1280) return 'xl'
      return '2xl'
    }
    
    const orientation = height > width ? 'portrait' : 'landscape'
    const devicePixelRatio = window.devicePixelRatio || 1
    
    // Check for notch support (iPhone X+)
    const hasNotchSupport = isIOS && (window.screen.height >= 812 && window.screen.width >= 375)
    
    // Check for haptic feedback support
    const supportsHaptics = 'vibrate' in navigator || 
                           ('hapticFeedback' in navigator) ||
                           isIOS // iOS has haptic feedback
    
    // Network information
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    const connectionType = connection?.effectiveType || 'unknown'

    return {
      isMobile,
      isTablet,
      isDesktop,
      isTouchDevice,
      isStandalone,
      isIOS,
      isAndroid,
      screenSize: getScreenSize(),
      orientation,
      devicePixelRatio,
      hasNotchSupport,
      supportsHaptics,
      connectionType
    }
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const orientation = height > width ? 'portrait' : 'landscape'
      
      const getScreenSize = () => {
        if (width < 475) return 'xs'
        if (width < 640) return 'sm'
        if (width < 768) return 'md'
        if (width < 1024) return 'lg'
        if (width < 1280) return 'xl'
        return '2xl'
      }
      
      setDeviceInfo(prev => ({
        ...prev,
        screenSize: getScreenSize(),
        orientation
      }))
    }

    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', updateDeviceInfo)

    // Listen for connection changes
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      const updateConnection = () => {
        setDeviceInfo(prev => ({
          ...prev,
          connectionType: connection.effectiveType || 'unknown'
        }))
      }
      connection.addEventListener('change', updateConnection)
      
      return () => {
        window.removeEventListener('resize', updateDeviceInfo)
        window.removeEventListener('orientationchange', updateDeviceInfo)
        connection.removeEventListener('change', updateConnection)
      }
    }

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}
