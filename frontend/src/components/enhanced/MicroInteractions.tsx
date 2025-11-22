import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

// Hover reveal animation component
export function HoverReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileHover={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.3,
          delay 
        }
      }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

// Magnetic button effect
export function MagneticButton({ children, strength = 0.3, ...props }: any) {
  const controls = useAnimation();

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    const x = (clientX - left - width / 2) * strength;
    const y = (clientY - top - height / 2) * strength;
    
    controls.start({ x, y });
  };

  const handleMouseLeave = () => {
    controls.start({ x: 0, y: 0 });
  };

  return (
    <motion.button
      animate={controls}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Stagger children animation
export function StaggerChildren({ 
  children, 
  staggerDelay = 0.1, 
  className = "" 
}: { 
  children: React.ReactNode; 
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// Scale on tap animation
export function TapScale({ children, scale = 0.95, ...props }: any) {
  return (
    <motion.div
      whileTap={{ scale }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Floating animation
export function FloatingElement({ 
  children, 
  amplitude = 10, 
  duration = 3, 
  delay = 0 
}: {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  );
}

// Pulse animation
export function PulseElement({ 
  children, 
  scale = 1.05, 
  duration = 2 
}: {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{
        scale: [1, scale, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

// Text reveal animation
export function TextReveal({ 
  text, 
  className = "",
  delay = 0 
}: { 
  text: string; 
  className?: string;
  delay?: number;
}) {
  const words = text.split(' ');
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delay
          }
        }
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-1"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Parallax scrolling effect
export function ParallaxElement({ 
  children, 
  className = "" 
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const y = scrollY * 0.5; // Parallax factor
      controls.set({ y });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  return (
    <motion.div
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
}
