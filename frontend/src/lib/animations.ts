/**
 * VintageVision Animation Library
 * Dramatic reveal animations inspired by Christie's auction house
 */

import type { Variants, Transition } from 'framer-motion'

/* ============================================================
   Transition Presets
   ============================================================ */

export const transitions = {
  /** Smooth, elegant entrance */
  smooth: {
    type: 'spring',
    stiffness: 100,
    damping: 20,
  } as Transition,

  /** Quick, snappy response */
  snappy: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  } as Transition,

  /** Dramatic, slow reveal */
  dramatic: {
    type: 'spring',
    stiffness: 60,
    damping: 15,
    mass: 1.2,
  } as Transition,

  /** Ease out for exits */
  exit: {
    duration: 0.2,
    ease: [0.4, 0, 1, 1],
  } as Transition,

  /** Value counter animation */
  counter: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94],
  } as Transition,
}

/* ============================================================
   Stagger Presets (for parent containers)
   ============================================================ */

export const stagger = {
  /** Fast stagger for lists */
  fast: 0.05,
  /** Default stagger */
  default: 0.1,
  /** Slow stagger for dramatic reveals */
  slow: 0.15,
  /** Very slow for hero sections */
  dramatic: 0.2,
}

/* ============================================================
   Fade Variants
   ============================================================ */

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.exit,
  },
}

export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: transitions.exit,
  },
}

export const fadeInScale: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.exit,
  },
}

/* ============================================================
   Dramatic Reveal Variants (The Money Shots)
   ============================================================ */

/** Item reveal - dramatic entrance for analysis results */
export const dramaticReveal: Variants = {
  initial: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      ...transitions.dramatic,
      filter: { duration: 0.4 },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: transitions.exit,
  },
}

/** Curtain lift - content revealed from bottom */
export const curtainLift: Variants = {
  initial: {
    clipPath: 'inset(100% 0 0 0)',
  },
  animate: {
    clipPath: 'inset(0% 0 0 0)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    clipPath: 'inset(0 0 100% 0)',
    transition: {
      duration: 0.4,
    },
  },
}

/** Spotlight reveal - item illuminated from darkness */
export const spotlightReveal: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    boxShadow: '0 0 0 0 hsl(var(--primary) / 0)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    boxShadow: '0 0 60px 10px hsl(var(--primary) / 0.15)',
    transition: {
      ...transitions.dramatic,
      boxShadow: { duration: 1.2, delay: 0.3 },
    },
  },
}

/** Value reveal - for price/value displays */
export const valueReveal: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...transitions.counter,
      delay: 0.2,
    },
  },
}

/* ============================================================
   Container Variants (for staggered children)
   ============================================================ */

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: stagger.default,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

export const dramaticStaggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: stagger.dramatic,
      delayChildren: 0.3,
    },
  },
}

export const fastStaggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: stagger.fast,
      delayChildren: 0.05,
    },
  },
}

/* ============================================================
   Tab/Section Variants
   ============================================================ */

export const tabContent: Variants = {
  initial: {
    opacity: 0,
    x: 10,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.15,
    },
  },
}

/* ============================================================
   Modal/Sheet Variants
   ============================================================ */

export const modalOverlay: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const modalContent: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: transitions.exit,
  },
}

export const bottomSheet: Variants = {
  initial: {
    y: '100%',
  },
  animate: {
    y: 0,
    transition: transitions.snappy,
  },
  exit: {
    y: '100%',
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

/* ============================================================
   List Item Variants
   ============================================================ */

export const listItem: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.snappy,
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
}

export const cardItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: transitions.exit,
  },
}

/* ============================================================
   Hover Variants
   ============================================================ */

export const hoverLift = {
  y: -4,
  transition: { duration: 0.2 },
}

export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 },
}

export const hoverGlow = {
  boxShadow: '0 0 30px hsl(var(--primary) / 0.3)',
  transition: { duration: 0.3 },
}

/* ============================================================
   Tap Variants
   ============================================================ */

export const tapScale = {
  scale: 0.98,
}

export const tapBounce = {
  scale: 0.95,
  transition: { duration: 0.1 },
}

/* ============================================================
   Loading/Skeleton Variants
   ============================================================ */

export const pulseAnimation: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const skeletonShimmer: Variants = {
  initial: {
    backgroundPosition: '-200% 0',
  },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

/* ============================================================
   Confidence Meter Animation
   ============================================================ */

export const confidenceFill: Variants = {
  initial: {
    pathLength: 0,
    opacity: 0,
  },
  animate: (confidence: number) => ({
    pathLength: confidence / 100,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 1.5,
        delay: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
      opacity: {
        duration: 0.2,
        delay: 0.3,
      },
    },
  }),
}

/* ============================================================
   Page Transition Variants
   ============================================================ */

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

/* ============================================================
   Utility: Get delay for staggered items
   ============================================================ */

export function getStaggerDelay(
  index: number,
  preset: keyof typeof stagger = 'default'
): number {
  return index * stagger[preset]
}

/* ============================================================
   Utility: Create custom stagger container
   ============================================================ */

export function createStaggerContainer(
  childDelay: number = stagger.default,
  initialDelay: number = 0.1
): Variants {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren: childDelay,
        delayChildren: initialDelay,
      },
    },
    exit: {
      transition: {
        staggerChildren: childDelay / 2,
        staggerDirection: -1,
      },
    },
  }
}
