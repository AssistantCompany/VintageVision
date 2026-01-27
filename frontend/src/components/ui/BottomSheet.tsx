import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  /**
   * Height of the sheet. Can be 'auto', 'full', or a specific value like '50vh' or '400px'
   * Default: 'auto'
   */
  height?: 'auto' | 'full' | string;
  /**
   * Whether to show the drag handle indicator
   * Default: true
   */
  showHandle?: boolean;
  /**
   * Title to display at the top of the sheet
   */
  title?: string;
  /**
   * Whether clicking the backdrop closes the sheet
   * Default: true
   */
  closeOnBackdropClick?: boolean;
  /**
   * Threshold (in pixels) for drag-to-dismiss
   * Default: 100
   */
  dismissThreshold?: number;
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  className,
  height = 'auto',
  showHandle = true,
  title,
  closeOnBackdropClick = true,
  dismissThreshold = 100,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // If dragged down more than threshold, close
      if (info.offset.y > dismissThreshold) {
        onClose();
      }
    },
    [onClose, dismissThreshold]
  );

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdropClick) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose]);

  // Calculate height styles
  const getHeightStyle = () => {
    if (height === 'auto') {
      return { maxHeight: '90vh' };
    }
    if (height === 'full') {
      return { height: '100vh' };
    }
    return { height, maxHeight: '90vh' };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            style={getHeightStyle()}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'bg-card rounded-t-2xl',
              'shadow-2xl',
              'flex flex-col',
              'overflow-hidden',
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Bottom sheet'}
          >
            {/* Drag Handle */}
            {showHandle && (
              <div
                className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="w-10 h-1 bg-border rounded-full" />
              </div>
            )}

            {/* Title */}
            {title && (
              <div className="px-4 pb-3 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground text-center">
                  {title}
                </h2>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to manage BottomSheet state
 */
export function useBottomSheet(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
