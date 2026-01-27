import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Send, X } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'

interface ErrorReport {
  id: string
  timestamp: string
  error: string
  component?: string
  stack?: string
  userAgent: string
  url: string
  userId?: string
}

interface ErrorReportSystemProps {
  onErrorReported?: (error: ErrorReport) => void
}

export function ErrorReportSystem({ onErrorReported }: ErrorReportSystemProps) {
  const [errors, setErrors] = useState<ErrorReport[]>([])
  const [showError, setShowError] = useState<ErrorReport | null>(null)
  const [reporting, setReporting] = useState(false)

  useEffect(() => {
    // Global error handler
    const handleError = (event: ErrorEvent) => {
      const errorReport: ErrorReport = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        error: event.message,
        stack: event.error?.stack,
        userAgent: navigator.userAgent,
        url: window.location.href,
      }
      
      setErrors(prev => [...prev, errorReport])
      setShowError(errorReport)
      
      // Auto-report in production
      if (process.env.NODE_ENV === 'production') {
        reportError(errorReport)
      }
    }

    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorReport: ErrorReport = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        error: `Unhandled Promise Rejection: ${event.reason}`,
        userAgent: navigator.userAgent,
        url: window.location.href,
      }
      
      setErrors(prev => [...prev, errorReport])
      setShowError(errorReport)
      
      if (process.env.NODE_ENV === 'production') {
        reportError(errorReport)
      }
    }

    // React error boundary errors (captured via window events)
    const handleReactError = (event: CustomEvent) => {
      const { error, errorInfo } = event.detail
      const errorReport: ErrorReport = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack,
        component: errorInfo?.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
      }
      
      setErrors(prev => [...prev, errorReport])
      setShowError(errorReport)
      
      if (process.env.NODE_ENV === 'production') {
        reportError(errorReport)
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('react-error' as any, handleReactError)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('react-error' as any, handleReactError)
    }
  }, [])

  const reportError = async (errorReport: ErrorReport) => {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport)
      })
      onErrorReported?.(errorReport)
    } catch (err) {
      console.warn('Failed to report error:', err)
    }
  }

  const handleManualReport = async (errorReport: ErrorReport) => {
    setReporting(true)
    await reportError(errorReport)
    setReporting(false)
    setShowError(null)
  }

  const dismissError = (errorId: string) => {
    setErrors(prev => prev.filter(e => e.id !== errorId))
    if (showError?.id === errorId) {
      setShowError(null)
    }
  }

  return (
    <>
      {/* Error Toast */}
      <AnimatePresence>
        {showError && process.env.NODE_ENV === 'development' && (
          <motion.div
            className="fixed bottom-4 right-4 z-[100] max-w-md"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <GlassCard className="p-4 border-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-danger mb-1">Error Detected</h4>
                  <p className="text-sm text-danger mb-3 break-words">
                    {showError.error}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleManualReport(showError)}
                      disabled={reporting}
                      variant="brass"
                      size="sm"
                    >
                      {reporting ? (
                        <>
                          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                          Reporting...
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          Report
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => dismissError(showError.id)}
                      variant="outline"
                      size="sm"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
                
                <button
                  onClick={() => dismissError(showError.id)}
                  className="text-danger/70 hover:text-danger"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {showError.stack && (
                <details className="mt-3">
                  <summary className="text-xs text-danger cursor-pointer">
                    Stack Trace
                  </summary>
                  <pre className="text-xs text-danger mt-2 p-2 bg-danger-muted rounded overflow-auto max-h-32">
                    {showError.stack}
                  </pre>
                </details>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error List (Development Only) */}
      {process.env.NODE_ENV === 'development' && errors.length > 0 && (
        <div className="fixed top-4 left-4 z-[90] max-w-sm">
          <GlassCard className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-foreground">
                {errors.length} Error{errors.length !== 1 ? 's' : ''} Detected
              </span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Check browser console for details
            </div>
            
            <button
              onClick={() => setErrors([])}
              className="mt-2 text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear All
            </button>
          </GlassCard>
        </div>
      )}
    </>
  )
}

// Hook for manual error reporting
export function useErrorReporting() {
  const reportError = async (error: Error, context?: string) => {
    const errorReport: ErrorReport = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      component: context,
    }

    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport)
      })
    } catch (err) {
      console.warn('Failed to report error:', err)
    }
  }

  return { reportError }
}

export default ErrorReportSystem
