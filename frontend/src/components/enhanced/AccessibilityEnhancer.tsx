import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, MousePointer } from 'lucide-react';
import Glass from '@/components/ui/Glass';

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: false,
    largeText: false,
    reduceMotion: false,
    screenReader: false
  });

  useEffect(() => {
    // Apply accessibility settings
    const root = document.documentElement;
    const body = document.body;
    
    console.log('Applying accessibility settings:', settings);
    
    if (settings.darkMode) {
      root.classList.add('dark-mode');
      body.classList.add('dark-mode');
      root.setAttribute('data-theme', 'dark');
      body.setAttribute('data-theme', 'dark');
      
      // Apply aggressive inline styles as backup
      body.style.backgroundColor = '#0f172a';
      body.style.color = '#f1f5f9';
      root.style.backgroundColor = '#0f172a';
      root.style.color = '#f1f5f9';
      
      console.log('Added dark-mode class and inline styles');
    } else {
      root.classList.remove('dark-mode');
      body.classList.remove('dark-mode');
      root.removeAttribute('data-theme');
      body.removeAttribute('data-theme');
      
      // Remove inline styles
      body.style.backgroundColor = '';
      body.style.color = '';
      root.style.backgroundColor = '';
      root.style.color = '';
      
      console.log('Removed dark-mode class and inline styles');
    }
    
    if (settings.largeText) {
      root.classList.add('large-text');
      body.classList.add('large-text');
      body.style.fontSize = '2rem';
      console.log('Added large-text class and inline styles');
    } else {
      root.classList.remove('large-text');
      body.classList.remove('large-text');
      body.style.fontSize = '';
      console.log('Removed large-text class and inline styles');
    }
    
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
      body.classList.add('reduce-motion');
      
      // Apply super aggressive motion reduction
      const motionStyle = document.createElement('style');
      motionStyle.id = 'reduce-motion-override';
      motionStyle.textContent = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          animation-iteration-count: 1 !important;
          animation-fill-mode: forwards !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          transform: none !important;
          filter: none !important;
        }
        [class*="animate-"], [class*="motion-"], [class*="transition-"] {
          animation: none !important;
          transition: none !important;
        }
      `;
      if (!document.getElementById('reduce-motion-override')) {
        document.head.appendChild(motionStyle);
      }
      
      // Also stop any currently running animations
      const animatedElements = document.querySelectorAll('*');
      animatedElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.animation = 'none';
          el.style.transition = 'none';
          el.style.transform = 'none';
        }
      });
      
      console.log('Added reduce-motion class and killed all animations');
    } else {
      root.classList.remove('reduce-motion');
      body.classList.remove('reduce-motion');
      
      const existingStyle = document.getElementById('reduce-motion-override');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      // Remove inline animation blocks
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.animation = '';
          el.style.transition = '';
          el.style.transform = '';
        }
      });
      
      console.log('Removed reduce-motion class and restored animations');
    }

    // Apply dark mode to all existing elements
    if (settings.darkMode) {
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.classList.add('dark-mode');
        }
      });
    } else {
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.classList.remove('dark-mode');
        }
      });
    }

    // Force multiple style recalculations
    document.body.offsetHeight;
    root.offsetHeight;
    
    // Force repaint
    document.body.style.display = 'none';
    document.body.offsetHeight; 
    document.body.style.display = '';

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    console.log('Current HTML classes:', root.className);
    console.log('Current body classes:', body.className);
    console.log('Current body styles:', body.style.cssText);
  }, [settings]);

  useEffect(() => {
    // Load saved settings - BUT force dark mode to false
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // FORCE dark mode to false regardless of saved settings
      setSettings({ ...parsed, darkMode: false });
    }

    // Check for system preferences (only reduced motion, NOT dark mode)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettings(prev => ({ ...prev, reduceMotion: true }));
    }

    // NEVER enable dark mode automatically
  }, []);

  const toggleSetting = (key: keyof typeof settings) => {
    console.log(`Toggling ${key} from ${settings[key]} to ${!settings[key]}`);
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="fixed bottom-20 left-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            className="mb-4"
          >
            <Glass className="p-6 min-w-72 shadow-2xl" gradient="cool" blur="xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-blue-900 text-lg">Accessibility Options</h3>
              </div>
              
              <div className="space-y-4">
                <motion.button
                  onClick={() => toggleSetting('darkMode')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                    settings.darkMode 
                      ? 'bg-gradient-to-r from-gray-800 to-slate-800 text-white shadow-md border-2 border-gray-600' 
                      : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      settings.darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <span className={`text-lg ${settings.darkMode ? 'text-yellow-400' : 'text-gray-600'}`}>🌙</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Dark Mode</div>
                      <div className="text-xs opacity-75">Easier on the eyes</div>
                    </div>
                  </div>
                  <motion.div 
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings.darkMode ? 'bg-gray-700' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                      animate={{ x: settings.darkMode ? 26 : 2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </motion.div>
                </motion.button>

                <motion.button
                  onClick={() => toggleSetting('largeText')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                    settings.largeText 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-900 shadow-md border-2 border-green-300' 
                      : 'hover:bg-green-50 border-2 border-transparent hover:border-green-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      settings.largeText ? 'bg-green-600' : 'bg-gray-200'
                    }`}>
                      <span className={`text-lg font-bold ${settings.largeText ? 'text-white' : 'text-gray-600'}`}>A</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Large Text</div>
                      <div className="text-xs opacity-75">Increases text size</div>
                    </div>
                  </div>
                  <motion.div 
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings.largeText ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                      animate={{ x: settings.largeText ? 26 : 2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </motion.div>
                </motion.button>

                <motion.button
                  onClick={() => toggleSetting('reduceMotion')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                    settings.reduceMotion 
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 shadow-md border-2 border-purple-300' 
                      : 'hover:bg-purple-50 border-2 border-transparent hover:border-purple-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      settings.reduceMotion ? 'bg-purple-600' : 'bg-gray-200'
                    }`}>
                      <MousePointer className={`w-4 h-4 ${settings.reduceMotion ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Reduce Motion</div>
                      <div className="text-xs opacity-75">Minimizes animations</div>
                    </div>
                  </div>
                  <motion.div 
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings.reduceMotion ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                      animate={{ x: settings.reduceMotion ? 26 : 2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </motion.div>
                </motion.button>
              </div>
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-xl flex items-center justify-center overflow-hidden"
        whileHover={{ 
          scale: 1.1, 
          boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        aria-label="Accessibility settings"
      >
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />
        
        {/* Icon */}
        <motion.div
          animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Eye className="w-6 h-6 text-white drop-shadow-sm" />
        </motion.div>
        
        {/* Active indicator */}
        {(settings.darkMode || settings.largeText || settings.reduceMotion) && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"
            animate={{
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity
            }}
          />
        )}
        
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 bg-white rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ 
            scale: 2,
            opacity: [0.3, 0],
            transition: { duration: 0.4 }
          }}
        />
      </motion.button>
    </div>
  );
}

// Skip navigation for keyboard users
export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
    >
      Skip to main content
    </a>
  );
}

// Focus management for modals and overlays
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Let parent component handle escape
        const escapeEvent = new CustomEvent('modal-escape');
        container.dispatchEvent(escapeEvent);
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);
    
    // Focus first element
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive]);

  return containerRef;
}

// Screen reader announcements
export function useScreenReader() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
}
