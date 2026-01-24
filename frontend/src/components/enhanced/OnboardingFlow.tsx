import { useState, useCallback } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Camera,
  Cpu,
  FileSearch,
  DollarSign,
  History,
  CheckCircle,
  Crown,
  Zap,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'

interface OnboardingFlowProps {
  /** Called when user completes onboarding */
  onComplete: () => void
  /** Called when user skips onboarding */
  onSkip: () => void
}

type OnboardingStep = 'welcome' | 'how-it-works' | 'what-you-get' | 'plans'

interface StepConfig {
  id: OnboardingStep
  title: string
}

const steps: StepConfig[] = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'how-it-works', title: 'How It Works' },
  { id: 'what-you-get', title: 'What You Get' },
  { id: 'plans', title: 'Plans' }
]

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const navigate = useNavigate()

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  const goNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id)
    } else {
      onComplete()
    }
  }, [currentStepIndex, onComplete])

  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id)
    }
  }, [currentStepIndex])

  const handleViewPlans = useCallback(() => {
    onComplete()
    navigate('/pricing')
  }, [onComplete, navigate])

  const handleStartFree = useCallback(() => {
    onComplete()
  }, [onComplete])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0, 0, 0.2, 1] } // easeOut cubic-bezier
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } // easeIn cubic-bezier
    })
  }

  // Track slide direction for animation
  const [direction, setDirection] = useState(0)

  const navigateWithDirection = useCallback((newStep: OnboardingStep) => {
    const newIndex = steps.findIndex(s => s.id === newStep)
    setDirection(newIndex > currentStepIndex ? 1 : -1)
    setCurrentStep(newStep)
  }, [currentStepIndex])

  const handleNext = useCallback(() => {
    setDirection(1)
    goNext()
  }, [goNext])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    goPrev()
  }, [goPrev])

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard className="overflow-hidden bg-white/95" gradient="warm" blur="xl">
          {/* Header with Skip button */}
          <div className="flex items-center justify-between p-4 border-b border-brass-200/30">
            {/* Progress Dots */}
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => navigateWithDirection(step.id)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentStepIndex
                      ? 'w-8 bg-gradient-to-r from-brass-500 to-brass-600'
                      : index < currentStepIndex
                      ? 'bg-brass-400'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to ${step.title}`}
                />
              ))}
            </div>

            {/* Skip Button */}
            <button
              onClick={onSkip}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
              aria-label="Skip onboarding"
            >
              <span>Skip</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 min-h-[400px] overflow-y-auto">
            <AnimatePresence mode="wait" custom={direction}>
              {currentStep === 'welcome' && (
                <WelcomeStep key="welcome" variants={slideVariants} direction={direction} />
              )}
              {currentStep === 'how-it-works' && (
                <HowItWorksStep key="how-it-works" variants={slideVariants} direction={direction} />
              )}
              {currentStep === 'what-you-get' && (
                <WhatYouGetStep key="what-you-get" variants={slideVariants} direction={direction} />
              )}
              {currentStep === 'plans' && (
                <PlansStep
                  key="plans"
                  variants={slideVariants}
                  direction={direction}
                  onStartFree={handleStartFree}
                  onViewPlans={handleViewPlans}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="p-4 border-t border-brass-200/30 bg-brass-50/30 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-xl hover:bg-white/50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Step indicator */}
            <span className="text-sm text-gray-500">
              {currentStepIndex + 1} / {steps.length}
            </span>

            {currentStep !== 'plans' ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brass-500 to-brass-600 rounded-xl shadow-lg hover:shadow-xl hover:from-brass-600 hover:to-brass-700 transition-all min-w-[120px] justify-center"
              >
                <span>{currentStepIndex === 0 ? 'Get Started' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-patina-500 to-patina-600 rounded-xl shadow-lg hover:shadow-xl hover:from-patina-600 hover:to-patina-700 transition-all min-w-[120px] justify-center"
              >
                <span>Let's Go!</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

// Step Components
interface StepProps {
  variants: Variants
  direction: number
}

function WelcomeStep({ variants, direction }: StepProps) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className="text-center space-y-6"
    >
      {/* Logo/Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-24 h-24 mx-auto bg-gradient-to-br from-brass-400 to-brass-600 rounded-3xl flex items-center justify-center shadow-xl"
      >
        <Sparkles className="w-12 h-12 text-white" />
      </motion.div>

      {/* Title */}
      <div className="space-y-3">
        <h2 id="onboarding-title" className="text-3xl md:text-4xl font-display font-bold text-gray-900">
          Welcome to VintageVision
        </h2>
        <p className="text-lg text-brass-700 font-medium">
          Discover the stories behind your vintage treasures
        </p>
      </div>

      {/* Value Proposition */}
      <div className="space-y-4 max-w-md mx-auto text-left">
        {[
          { icon: Camera, text: 'Instantly identify any vintage or antique item with a photo' },
          { icon: History, text: 'Uncover fascinating histories, makers, and provenance' },
          { icon: DollarSign, text: 'Get accurate market valuations and investment insights' }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="flex items-start gap-4 p-3 rounded-xl bg-white/60 border border-brass-200/30"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brass-100 to-brass-200 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-brass-600" />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed pt-2">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function HowItWorksStep({ variants, direction }: StepProps) {
  const steps = [
    {
      step: 1,
      icon: Camera,
      title: 'Take or Upload a Photo',
      description: 'Snap a picture or upload an existing photo of your vintage item',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      step: 2,
      icon: Cpu,
      title: 'AI Analyzes Your Item',
      description: 'Our expert AI examines details, markings, and style characteristics',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      step: 3,
      icon: FileSearch,
      title: 'Get Detailed Insights',
      description: 'Receive identification, history, valuation, and styling suggestions',
      gradient: 'from-brass-400 to-orange-500'
    }
  ]

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
          How It Works
        </h2>
        <p className="text-gray-600">Three simple steps to unlock your item's story</p>
      </div>

      <div className="space-y-4">
        {steps.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.15 }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 border border-gray-200/50 shadow-sm"
          >
            {/* Step Number with Icon */}
            <div className="relative flex-shrink-0">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">{item.step}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            {/* Arrow connector (except last) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-full">
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function WhatYouGetStep({ variants, direction }: StepProps) {
  const benefits = [
    {
      icon: FileSearch,
      title: 'Item Identification',
      description: 'Discover the maker, period, style, and origin of your piece',
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      icon: CheckCircle,
      title: 'Condition Assessment',
      description: 'Understand wear patterns and restoration considerations',
      color: 'text-patina-600',
      bg: 'bg-patina-100'
    },
    {
      icon: DollarSign,
      title: 'Market Valuation',
      description: 'Get estimated value ranges based on current market data',
      color: 'text-brass-600',
      bg: 'bg-brass-100'
    },
    {
      icon: History,
      title: 'Historical Context',
      description: 'Learn the fascinating story and cultural significance',
      color: 'text-velvet-600',
      bg: 'bg-velvet-100'
    }
  ]

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
          What You'll Discover
        </h2>
        <p className="text-gray-600">Comprehensive insights for every item</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="p-4 rounded-2xl bg-white/70 border border-gray-200/50 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl ${benefit.bg} flex items-center justify-center mb-3`}>
              <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

interface PlansStepProps extends StepProps {
  onStartFree: () => void
  onViewPlans: () => void
}

function PlansStep({ variants, direction, onStartFree, onViewPlans }: PlansStepProps) {
  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      features: ['5 analyses/month', 'Basic insights', 'Collection saves'],
      gradient: 'from-gray-400 to-gray-500',
      popular: false
    },
    {
      name: 'Collector',
      icon: Crown,
      features: ['Unlimited analyses', 'Advanced insights', 'Priority support'],
      gradient: 'from-brass-400 to-brass-600',
      popular: true
    },
    {
      name: 'Pro',
      icon: Zap,
      features: ['Everything in Collector', 'API access', 'Team features'],
      gradient: 'from-purple-400 to-pink-500',
      popular: false
    }
  ]

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
          Choose Your Path
        </h2>
        <p className="text-gray-600">Start free, upgrade when you're ready</p>
      </div>

      {/* Simplified Plan Cards */}
      <div className="grid grid-cols-3 gap-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`relative p-4 rounded-2xl text-center ${
              plan.popular
                ? 'bg-gradient-to-br from-brass-50 to-brass-100 border-2 border-brass-300'
                : 'bg-white/70 border border-gray-200/50'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="px-2 py-0.5 text-xs font-bold text-white bg-brass-500 rounded-full">
                  Popular
                </span>
              </div>
            )}

            <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-2`}>
              <plan.icon className="w-5 h-5 text-white" />
            </div>

            <h3 className="font-semibold text-gray-900 text-sm mb-2">{plan.name}</h3>

            <ul className="space-y-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3 text-patina-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onStartFree}
          className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-patina-500 to-patina-600 rounded-xl shadow-lg hover:shadow-xl hover:from-patina-600 hover:to-patina-700 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Start Free
        </button>
        <button
          onClick={onViewPlans}
          className="flex-1 px-6 py-3 text-sm font-semibold text-brass-700 bg-brass-100 hover:bg-brass-200 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Crown className="w-4 h-4" />
          View All Plans
        </button>
      </div>
    </motion.div>
  )
}
