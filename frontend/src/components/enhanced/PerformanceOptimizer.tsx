import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Zap } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <GlassCard className={`p-3 ${isOnline ? 'border-green-200' : 'border-red-200'}`}>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Back online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700 font-medium">You're offline</span>
                </>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<{
    cls: number;
    fid: number;
    lcp: number;
  } | null>(null);

  useEffect(() => {
    // Web Vitals monitoring
    if ('web-vitals' in window) {
      const vitals = (window as any)['web-vitals'];
      
      vitals.getCLS(setMetrics);
      vitals.getFID(setMetrics);
      vitals.getLCP(setMetrics);
    }

    // Performance observer for custom metrics
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Track custom performance metrics
          console.log('Performance entry:', entry);
        }
      });

      observer.observe({ entryTypes: ['measure', 'navigation'] });

      return () => observer.disconnect();
    }
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !metrics) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <GlassCard className="p-2 text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-amber-600" />
          <span>Perf: {Math.round(metrics.lcp)}ms</span>
        </div>
      </GlassCard>
    </div>
  );
}

// Image optimization hook
export function useImageOptimization() {
  const [supportsWebP, setSupportsWebP] = useState(false);
  const [supportsAVIF, setSupportsAVIF] = useState(false);

  useEffect(() => {
    // Check WebP support
    const webp = new Image();
    webp.onload = webp.onerror = () => {
      setSupportsWebP(webp.height === 2);
    };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

    // Check AVIF support
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      setSupportsAVIF(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
  }, []);

  const getOptimalImageUrl = (baseUrl: string) => {
    if (!baseUrl) return baseUrl;

    // If it's a data URL, return as-is
    if (baseUrl.startsWith('data:')) return baseUrl;

    // For external URLs, we'd typically use a service like Cloudinary or ImageKit
    // For now, return the original URL
    return baseUrl;
  };

  return { supportsWebP, supportsAVIF, getOptimalImageUrl };
}

// Lazy loading utility
export function useLazyLoading() {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const ref = (node: HTMLElement | null) => {
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(node);
    }
  };

  return { ref, isIntersecting };
}
