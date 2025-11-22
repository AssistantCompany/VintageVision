import { useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, Sparkles } from 'lucide-react'
import { cn, vibrate } from '@/lib/utils'

interface CustomNotificationProps {
  message: string
  type: 'success' | 'error' | 'warning' | 'info' | 'premium'
  description?: string
}

const CustomNotification = ({ message, type, description }: CustomNotificationProps) => {
  const config = {
    success: {
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-green-500',
      bg: 'bg-emerald-50/90',
      border: 'border-emerald-200/50',
      text: 'text-emerald-800'
    },
    error: {
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500',
      bg: 'bg-red-50/90',
      border: 'border-red-200/50',
      text: 'text-red-800'
    },
    warning: {
      icon: AlertTriangle,
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50/90',
      border: 'border-amber-200/50',
      text: 'text-amber-800'
    },
    info: {
      icon: Info,
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50/90',
      border: 'border-blue-200/50',
      text: 'text-blue-800'
    },
    premium: {
      icon: Sparkles,
      gradient: 'from-purple-500 via-pink-500 to-amber-500',
      bg: 'bg-gradient-to-r from-purple-50/90 to-pink-50/90',
      border: 'border-purple-200/50',
      text: 'text-purple-800'
    }
  }

  const { icon: Icon, gradient, bg, border, text } = config[type]

  return (
    <motion.div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-xl',
        'max-w-sm w-full',
        bg,
        border
      )}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Icon */}
      <motion.div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          `bg-gradient-to-r ${gradient}`
        )}
        whileHover={{ rotate: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Icon className="w-4 h-4 text-white" />
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <motion.p
          className={cn('font-semibold text-sm', text)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {message}
        </motion.p>
        
        {description && (
          <motion.p
            className={cn('text-xs mt-1 opacity-80', text)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Sparkle effect for premium notifications */}
      {type === 'premium' && (
        <div className="absolute -top-1 -right-1">
          <motion.div
            className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        </div>
      )}
    </motion.div>
  )
}

export const useNotifications = () => {
  const showNotification = (
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' | 'premium' = 'info',
    description?: string
  ) => {
    // Haptic feedback
    vibrate(type === 'error' ? [100, 50, 100] : type === 'success' ? 100 : 50)

    toast.custom(() => (
      <CustomNotification message={message} type={type} description={description} />
    ), {
      duration: type === 'error' ? 6000 : type === 'premium' ? 8000 : 4000,
      position: 'top-right',
    })
  }

  return {
    success: (message: string, description?: string) => 
      showNotification(message, 'success', description),
    error: (message: string, description?: string) => 
      showNotification(message, 'error', description),
    warning: (message: string, description?: string) => 
      showNotification(message, 'warning', description),
    info: (message: string, description?: string) => 
      showNotification(message, 'info', description),
    premium: (message: string, description?: string) => 
      showNotification(message, 'premium', description),
  }
}

export default function NotificationSystem() {
  useEffect(() => {
    // Request notification permission for PWA
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission()
    }
  }, [])

  return (
    <Toaster
      position="top-right"
      expand={true}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          border: 'none',
          padding: 0,
          boxShadow: 'none',
        },
      }}
    />
  )
}

// Push notification utilities for PWA
export function sendPushNotification(title: string, options?: NotificationOptions) {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          badge: '/icon-192.png',
          icon: '/icon-192.png',
          ...options
        })
      })
    }
  }
}

// Rich notification for analysis completion
export function notifyAnalysisComplete(itemName: string, estimatedValue?: string) {
  const notifications = useNotifications()
  
  notifications.premium(
    `Analysis complete: ${itemName}`,
    estimatedValue ? `Estimated value: ${estimatedValue}` : 'Discover its story and value!'
  )
  
  // Push notification for background
  sendPushNotification('VintageVision Analysis Complete', {
    body: `Your ${itemName} has been analyzed with AI precision`,
    tag: 'analysis-complete',
    requireInteraction: true
  })
}
