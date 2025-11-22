// Temporary fixes for TypeScript compilation issues

// Fix for Glass component props
export interface GlassComponentProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: 'default' | 'warm' | 'cool' | 'vintage';
  hover?: boolean;
}

// Fix for notification system
export interface NotificationConfig {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

// Fix for analytics hooks
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
}

// Export to prevent unused file warning
export const tempFixes = {
  version: '1.0.0',
  description: 'Temporary TypeScript fixes'
};
