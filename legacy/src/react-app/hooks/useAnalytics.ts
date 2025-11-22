import { useCallback } from 'react';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
}

export function useAnalytics() {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        user_id: event.userId
      });
    }

    // Custom analytics endpoint
    if (typeof window !== 'undefined') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      }).catch(() => {
        // Silently fail - analytics shouldn't break the app
      });
    }
  }, []);

  const trackPageView = useCallback((page: string) => {
    trackEvent({
      action: 'page_view',
      category: 'navigation',
      label: page
    });
  }, [trackEvent]);

  const trackIdentification = useCallback((success: boolean, confidence?: number) => {
    trackEvent({
      action: 'item_identified',
      category: 'analysis',
      label: success ? 'success' : 'failure',
      value: confidence ? Math.round(confidence * 100) : undefined
    });
  }, [trackEvent]);

  const trackCollection = useCallback((action: 'save' | 'view' | 'search') => {
    trackEvent({
      action: `collection_${action}`,
      category: 'collection',
      label: action
    });
  }, [trackEvent]);

  const trackSubscription = useCallback((plan: string, action: 'start_trial' | 'subscribe' | 'cancel') => {
    trackEvent({
      action: `subscription_${action}`,
      category: 'monetization',
      label: plan
    });
  }, [trackEvent]);

  const trackFeedback = useCallback((type: 'positive' | 'negative', category: string) => {
    trackEvent({
      action: 'feedback_submitted',
      category: 'engagement',
      label: `${type}_${category}`
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackIdentification,
    trackCollection,
    trackSubscription,
    trackFeedback
  };
}
