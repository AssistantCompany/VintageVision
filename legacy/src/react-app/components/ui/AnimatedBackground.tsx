import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'warm' | 'cool' | 'vintage';
  className?: string;
}

export default function AnimatedBackground({ 
  variant = 'vintage',
  className = ''
}: AnimatedBackgroundProps) {
  const variants = {
    default: {
      colors: ['#f3f4f6', '#e5e7eb', '#d1d5db'],
      gradients: [
        'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
        'radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
        'radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.3) 0%, transparent 50%)'
      ]
    },
    warm: {
      colors: ['#fef3e2', '#fed7aa', '#fdba74'],
      gradients: [
        'radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.3) 0%, transparent 50%)',
        'radial-gradient(circle at 80% 20%, rgba(245, 101, 101, 0.3) 0%, transparent 50%)',
        'radial-gradient(circle at 40% 40%, rgba(251, 191, 36, 0.3) 0%, transparent 50%)'
      ]
    },
    cool: {
      colors: ['#eff6ff', '#dbeafe', '#bfdbfe'],
      gradients: [
        'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
        'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
        'radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)'
      ]
    },
    vintage: {
      colors: ['#fefbf3', '#fef3e2', '#fed7aa'],
      gradients: [
        'radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.2) 0%, transparent 50%)',
        'radial-gradient(circle at 80% 20%, rgba(251, 146, 60, 0.2) 0%, transparent 50%)',
        'radial-gradient(circle at 40% 40%, rgba(217, 119, 6, 0.2) 0%, transparent 50%)'
      ]
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${currentVariant.colors[0]} 0%, ${currentVariant.colors[1]} 50%, ${currentVariant.colors[2]} 100%)`
        }}
      />
      
      {/* Animated gradient orbs */}
      {currentVariant.gradients.map((gradient, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{ background: gradient }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
