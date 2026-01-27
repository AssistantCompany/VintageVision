import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Camera,
  Check,
  ChevronRight,
  X,
  Eye,
  ShieldCheck,
  TrendingUp,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OnboardingFlowProps {
  onComplete: () => void
  onSkip: () => void
}

/**
 * Onboarding that SHOWS the product instead of describing it.
 * One real example analysis demonstrates all key features.
 */
export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [step, setStep] = useState<'demo' | 'features'>('demo')
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSkip])

  const handleGetStarted = useCallback(() => {
    onComplete()
    navigate('/')
  }, [onComplete, navigate])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-background overflow-hidden"
    >
      {/* Skip button - always visible */}
      <button
        onClick={onSkip}
        className="absolute top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-card"
      >
        Skip <X className="w-4 h-4" />
      </button>

      <AnimatePresence mode="wait">
        {step === 'demo' && (
          <DemoStep
            key="demo"
            onNext={() => setStep('features')}
          />
        )}
        {step === 'features' && (
          <FeaturesStep
            key="features"
            onGetStarted={handleGetStarted}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Demo step: Show a real analysis example
function DemoStep({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState(0)

  // Animate through the demo phases
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),   // Show image
      setTimeout(() => setPhase(2), 1600),  // Show identification
      setTimeout(() => setPhase(3), 2400),  // Show confidence
      setTimeout(() => setPhase(4), 3200),  // Show value
      setTimeout(() => setPhase(5), 4000),  // Show all complete
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 p-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-primary font-medium mb-2"
        >
          See it in action
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-display font-semibold text-foreground"
        >
          One photo. Full story.
        </motion.h1>
      </div>

      {/* Demo area */}
      <div className="flex-1 px-4 md:px-8 pb-4 overflow-hidden">
        <div className="h-full max-w-2xl mx-auto flex flex-col md:flex-row gap-4">

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
            className="relative flex-1 min-h-[200px] md:min-h-0 rounded-2xl overflow-hidden bg-card border border-border"
          >
            {/* Example vintage item image */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-amber-800/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-3">
                  <Camera className="w-12 h-12 text-primary/60" />
                </div>
                <p className="text-sm text-muted-foreground">Arts & Crafts Side Chair</p>
                <p className="text-xs text-muted-foreground/60">c. 1910</p>
              </div>
            </div>

            {/* Visual evidence markers */}
            {phase >= 3 && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-[20%] left-[15%] w-8 h-8 rounded-full bg-success-muted border-2 border-success flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-success" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="absolute top-[60%] right-[20%] w-8 h-8 rounded-full bg-success-muted border-2 border-success flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-success" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-[25%] left-[25%] w-8 h-8 rounded-full bg-warning-muted border-2 border-warning flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 text-warning" />
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Results side */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Identification */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 20 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <p className="text-xs text-muted-foreground mb-1">Identified as</p>
              <p className="font-display font-semibold text-foreground">Gustav Stickley Side Chair</p>
              <p className="text-sm text-muted-foreground">Model No. 306, c. 1905-1910</p>
            </motion.div>

            {/* Confidence breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 20 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <p className="text-xs text-muted-foreground mb-3">What we know</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm text-foreground">Quarter-sawn oak construction</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm text-foreground">Mortise-and-tenon joinery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-sm text-muted-foreground">Maker's mark needs photo</span>
                </div>
              </div>
            </motion.div>

            {/* Value */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: phase >= 4 ? 1 : 0, x: phase >= 4 ? 0 : 20 }}
              className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
            >
              <p className="text-xs text-primary/70 mb-1">Estimated value</p>
              <p className="text-2xl font-display font-bold text-foreground">$1,800 - $2,400</p>
              <p className="text-xs text-muted-foreground mt-1">Based on 12 recent auction sales</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: phase >= 5 ? 1 : 0, y: phase >= 5 ? 0 : 20 }}
        className="flex-shrink-0 p-6 border-t border-border bg-card/50"
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-muted" />
          </div>
          <Button onClick={onNext} variant="brass" size="lg" className="min-w-[140px]">
            See more <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Features step: Quick highlight of unique capabilities
function FeaturesStep({ onGetStarted }: { onGetStarted: () => void }) {
  const features = [
    {
      icon: Eye,
      title: "Visual Evidence",
      description: "See exactly what we found and where",
      color: "text-info",
      bg: "bg-info-muted"
    },
    {
      icon: ShieldCheck,
      title: "Authentication",
      description: "Real checks, not generic checklists",
      color: "text-success",
      bg: "bg-success-muted"
    },
    {
      icon: TrendingUp,
      title: "Real Market Data",
      description: "Actual sales, not asking prices",
      color: "text-warning",
      bg: "bg-warning-muted"
    },
    {
      icon: MessageCircle,
      title: "Ask Vera",
      description: "Questions? She'll help clarify",
      color: "text-accent",
      bg: "bg-accent/10"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 p-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-primary font-medium mb-2"
        >
          What makes us different
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-display font-semibold text-foreground"
        >
          Expert analysis, honestly presented
        </motion.h1>
      </div>

      {/* Features grid */}
      <div className="flex-1 px-4 md:px-8 pb-4 overflow-auto">
        <div className="max-w-lg mx-auto grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", feature.bg)}>
                <feature.icon className={cn("w-5 h-5", feature.color)} />
              </div>
              <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-lg mx-auto mt-6 p-4 rounded-xl bg-muted/30 text-center"
        >
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Free tier:</span> 3 analyses/month
            <span className="mx-2">•</span>
            <span className="text-foreground font-medium">Collector:</span> Unlimited for $9.99/mo
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex-shrink-0 p-6 border-t border-border bg-card/50"
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted" />
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <Button onClick={onGetStarted} variant="brass" size="lg" className="min-w-[180px]">
            <Camera className="w-4 h-4 mr-2" />
            Start identifying
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
