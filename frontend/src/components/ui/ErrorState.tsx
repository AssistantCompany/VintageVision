import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, HelpCircle, WifiOff, ServerCrash, FileQuestion } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ErrorType = 'generic' | 'network' | 'server' | 'not-found' | 'auth'

interface ErrorStateProps {
  title?: string
  message?: string
  type?: ErrorType
  onRetry?: () => void
  onHelp?: () => void
  retryLabel?: string
  helpLabel?: string
  helpUrl?: string
  className?: string
  compact?: boolean
}

const errorConfig: Record<ErrorType, { icon: typeof AlertCircle; defaultTitle: string; defaultMessage: string }> = {
  generic: {
    icon: AlertCircle,
    defaultTitle: 'Something went wrong',
    defaultMessage: 'We encountered an unexpected error. Please try again.'
  },
  network: {
    icon: WifiOff,
    defaultTitle: 'Connection problem',
    defaultMessage: 'Unable to connect to the server. Check your internet connection and try again.'
  },
  server: {
    icon: ServerCrash,
    defaultTitle: 'Server error',
    defaultMessage: 'Our servers are experiencing issues. Please try again in a few moments.'
  },
  'not-found': {
    icon: FileQuestion,
    defaultTitle: 'Not found',
    defaultMessage: 'The item you\'re looking for couldn\'t be found.'
  },
  auth: {
    icon: AlertCircle,
    defaultTitle: 'Authentication required',
    defaultMessage: 'Please sign in to continue.'
  }
}

export default function ErrorState({
  title,
  message,
  type = 'generic',
  onRetry,
  onHelp,
  retryLabel = 'Try again',
  helpLabel = 'Get help',
  helpUrl,
  className,
  compact = false
}: ErrorStateProps) {
  const config = errorConfig[type]
  const Icon = config.icon
  const displayTitle = title || config.defaultTitle
  const displayMessage = message || config.defaultMessage

  if (compact) {
    return (
      <div className={cn('flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl', className)}>
        <Icon className="w-5 h-5 text-destructive flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-destructive truncate">{displayTitle}</p>
          <p className="text-xs text-destructive/80 truncate">{displayMessage}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('w-full', className)}
    >
      <GlassCard className="p-8 md:p-12 text-center max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6',
            type === 'generic' || type === 'auth' ? 'bg-destructive/20' :
            type === 'network' ? 'bg-orange-500/20' :
            type === 'server' ? 'bg-primary/20' :
            'bg-muted'
          )}
        >
          <Icon className={cn(
            'w-8 h-8',
            type === 'generic' || type === 'auth' ? 'text-destructive' :
            type === 'network' ? 'text-orange-500' :
            type === 'server' ? 'text-primary' :
            'text-muted-foreground'
          )} />
        </motion.div>

        <h3 className="text-xl font-display font-bold text-foreground mb-2">
          {displayTitle}
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {displayMessage}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="brass" className="justify-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              {retryLabel}
            </Button>
          )}

          {(onHelp || helpUrl) && (
            helpUrl ? (
              <a
                href={helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                {helpLabel}
              </a>
            ) : (
              <Button onClick={onHelp} variant="ghost" className="justify-center">
                <HelpCircle className="w-4 h-4 mr-2" />
                {helpLabel}
              </Button>
            )
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}

// Empty State Component (related to error state)
interface EmptyStateProps {
  title: string
  message: string
  icon?: typeof AlertCircle
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  title,
  message,
  icon: Icon = FileQuestion,
  action,
  className
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('w-full', className)}
    >
      <GlassCard className="p-8 md:p-12 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>

        <h3 className="text-xl font-display font-bold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {message}
        </p>

        {action && (
          <Button onClick={action.onClick} variant="brass" className="justify-center">
            {action.label}
          </Button>
        )}
      </GlassCard>
    </motion.div>
  )
}
