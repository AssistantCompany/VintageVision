import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Search,
  Heart,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Zap,
  Crown,
  TrendingUp,
  Palette,
  BookOpen
} from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import LiquidButton from '@/components/ui/LiquidButton'
import SpotlightEffect from '@/components/ui/SpotlightEffect'
import FloatingParticles from '@/components/ui/FloatingParticles'
import UserMenu from '@/components/shared/UserMenu'
import SimpleImageUploader from '@/components/enhanced/SimpleImageUploader'
import PremiumAnalysisResult from '@/components/enhanced/PremiumAnalysisResult'
import AdvancedLoadingSpinner from '@/components/ui/AdvancedLoadingSpinner'
import { useNotifications } from '@/components/enhanced/NotificationSystem'
import { useVintageAnalysis } from '@/hooks/useVintageAnalysis'
import { ItemAnalysis } from '@/types'

import { trackEvent } from '@/lib/utils'

export default function PremiumLandingPage() {
  const { user, redirectToLogin } = useAuth()
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const notifications = useNotifications()
  const [currentAnalysis, setCurrentAnalysis] = useState<ItemAnalysis | null>(null)
  const [showResult, setShowResult] = useState(false)
  const { analyzing, error, analyzeItem, saveToCollection, submitFeedback } = useVintageAnalysis()

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 800], [0, -200])
  const featuresY = useTransform(scrollY, [0, 1200], [0, -100])

  // Refs for intersection observer
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)

  const featuresInView = useInView(featuresRef, { once: true })
  const statsInView = useInView(statsRef, { once: true })
  const testimonialsInView = useInView(testimonialsRef, { once: true })
  const ctaInView = useInView(ctaRef, { once: true })

  const handleImageSelected = async (dataUrl: string) => {
    console.log('🔥 handleImageSelected CALLED in PremiumLandingPage', {
      dataUrlLength: dataUrl?.length || 0,
      dataUrlStart: dataUrl?.substring(0, 50) || 'undefined'
    })

    trackEvent('image_upload_started')
    setShowResult(false)
    setCurrentAnalysis(null)

    console.log('🚀 Calling analyzeItem...')
    const analysis = await analyzeItem(dataUrl)
    console.log('📊 analyzeItem returned:', { hasAnalysis: !!analysis, error })

    if (analysis) {
      console.log('✅ Setting analysis result state')
      setCurrentAnalysis(analysis)
      setShowResult(true)
      trackEvent('analysis_completed', {
        itemName: analysis.name,
        confidence: analysis.confidence,
        hasValue: !!(analysis.estimatedValueMin || analysis.estimatedValueMax)
      })

      // Send premium notification
      notifications.premium(
        `Analysis complete: ${analysis.name}`,
        analysis.estimatedValueMin ? `Estimated value: $${analysis.estimatedValueMin.toLocaleString()}+` : undefined
      )
    } else if (error) {
      console.error('❌ Analysis failed:', error)
      notifications.error('Analysis failed', error)
      trackEvent('analysis_failed', { error })
    }
  }

  const handleSaveToCollection = async (notes?: string, location?: string) => {
    if (!currentAnalysis) return false

    if (!user) {
      notifications.info('Please sign in to save items to your collection')
      redirectToLogin()
      return false
    }

    trackEvent('collection_save_attempt')
    const success = await saveToCollection(currentAnalysis.id, notes, location)

    if (success) {
      notifications.success('Item saved to your collection!')
      trackEvent('collection_save_success')
    } else {
      notifications.error('Failed to save item to collection')
      trackEvent('collection_save_failed')
    }

    return success
  }

  const handleSubmitFeedback = async (isCorrect: boolean, correctionText?: string, feedbackType?: string) => {
    if (!currentAnalysis) return

    if (!user) {
      notifications.info('Please sign in to submit feedback')
      redirectToLogin()
      return
    }

    trackEvent('feedback_submitted', { isCorrect, feedbackType })
    const success = await submitFeedback(currentAnalysis.id, isCorrect, correctionText, feedbackType)

    if (success) {
      notifications.success('Thank you for your feedback!')
    } else {
      notifications.error('Failed to submit feedback')
    }
  }

  const resetToHome = () => {
    setShowResult(false)
    setCurrentAnalysis(null)
    trackEvent('reset_to_home')
  }

  const handleGetStarted = () => {
    trackEvent('landing_get_started_click')
    if (user) {
      navigate('/app')
    } else {
      redirectToLogin()
    }
  }

  const features = [
    {
      icon: Search,
      title: 'AI-Powered Identification',
      description: 'Advanced computer vision instantly recognizes vintage items with expert-level accuracy',
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0.1
    },
    {
      icon: Heart,
      title: 'Personal Collection',
      description: 'Save discoveries, add notes, and build your curated vintage treasure collection',
      gradient: 'from-pink-500 to-rose-500',
      delay: 0.2
    },
    {
      icon: Palette,
      title: 'Styling Suggestions',
      description: 'Get personalized design tips on how to incorporate items into your modern space',
      gradient: 'from-purple-500 to-indigo-500',
      delay: 0.3
    },
    {
      icon: Globe,
      title: 'Marketplace Integration',
      description: 'Find similar items across top marketplaces with direct purchase links',
      gradient: 'from-emerald-500 to-teal-500',
      delay: 0.4
    },
    {
      icon: Shield,
      title: 'Authenticity Insights',
      description: 'Learn about historical context, craftsmanship, and authentication markers',
      gradient: 'from-amber-500 to-orange-500',
      delay: 0.5
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get comprehensive analysis in seconds, not hours of research',
      gradient: 'from-red-500 to-pink-500',
      delay: 0.6
    }
  ]

  const stats = [
    { number: '2M+', label: 'Items Identified', icon: Search },
    { number: '500K+', label: 'Happy Users', icon: Heart },
    { number: '99%', label: 'Accuracy Rate', icon: Star },
    { number: '150+', label: 'Style Periods', icon: Palette }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Interior Designer',
      location: 'San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&crop=face&auto=format',
      quote: 'VintageVision has revolutionized how I source authentic pieces for my clients. The styling suggestions are incredibly valuable and save me hours of research.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Antique Collector',
      location: 'New York, NY',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format',
      quote: 'I can now confidently identify and value pieces at estate sales. The historical context feature is amazing - it\'s like having an expert in my pocket.',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      role: 'Vintage Enthusiast',
      location: 'London, UK',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format',
      quote: 'Finally found my grandmother\'s china pattern after years of searching! The accuracy is incredible and the app is so beautifully designed.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <FloatingParticles 
          count={100} 
          className="opacity-30"
          colors={['#f59e0b', '#f97316', '#ef4444', '#8b5cf6', '#06b6d4']}
        />
      </div>
      
      {/* Navigation */}
      <nav className="relative z-[100] p-4">
        <GlassCard className="max-w-7xl mx-auto overflow-visible" blur="xl">
          <div className="flex items-center justify-between p-4 overflow-visible">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VintageVision</h1>
                <p className="text-xs text-gray-600">AI Antique Expert</p>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <MagneticButton 
                  onClick={() => navigate('/features')}
                  variant="ghost"
                  size="md"
                >
                  Features
                </MagneticButton>
                <MagneticButton 
                  onClick={() => navigate('/about')}
                  variant="ghost"
                  size="md"
                >
                  About
                </MagneticButton>
                <MagneticButton 
                  onClick={() => navigate('/pricing')}
                  variant="ghost"
                  size="md"
                >
                  Pricing
                </MagneticButton>
                <MagneticButton 
                  onClick={() => navigate('/help')}
                  variant="ghost"
                  size="md"
                >
                  Help
                </MagneticButton>
              </div>
              
              {user ? (
                <UserMenu />
              ) : (
                <LiquidButton onClick={redirectToLogin}>
                  <Crown className="w-4 h-4" />
                  Sign In
                </LiquidButton>
              )}
            </div>
          </div>
        </GlassCard>
      </nav>

      {/* Hero Section */}
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.section
            key="upload"
            ref={heroRef}
            style={{ y: heroY }}
            className="relative z-10 pt-12 pb-8 md:pt-16 md:pb-12 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="max-w-7xl mx-auto">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-8"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  #1 AI Antique Identifier
                </span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </motion.div>

              <div className="text-center space-y-6 md:space-y-8">
                {/* Main Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                    Turn your phone into an{' '}
                    <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                      antique expert
                    </span>
                  </h1>

                  <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    Instantly identify vintage and antique items, learn their fascinating histories,
                    discover their market value, and get expert styling tips with the power of AI.
                  </p>
                </motion.div>

                {/* Upload Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <SimpleImageUploader
                    onImageSelected={handleImageSelected}
                    disabled={analyzing}
                  />
                </motion.div>

                {/* Analyzing State */}
                {analyzing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <AdvancedLoadingSpinner
                      variant="glass"
                      size="xl"
                      text="Our AI is examining your treasure, researching its history, and generating expert styling tips..."
                    />
                  </motion.div>
                )}

                {/* Error State */}
                {error && !analyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <GlassCard className="p-6 max-w-md mx-auto border-red-200/50" gradient="rose">
                      <div className="flex items-center gap-3 text-red-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <p className="font-medium">{error}</p>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {/* Features Grid */}
                {!analyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="grid md:grid-cols-3 gap-6 md:gap-8 mt-10 md:mt-12"
                  >
                    {[
                      {
                        icon: Search,
                        title: 'Instant AI Identification',
                        description: 'Advanced computer vision recognizes vintage items with expert-level accuracy',
                        gradient: 'from-blue-500 to-cyan-500'
                      },
                      {
                        icon: BookOpen,
                        title: 'Rich Stories & Styling',
                        description: 'Learn fascinating histories and get personalized styling tips for your space',
                        gradient: 'from-purple-500 to-pink-500'
                      },
                      {
                        icon: Heart,
                        title: 'Build & Discover',
                        description: 'Save discoveries to your collection and find similar items to purchase',
                        gradient: 'from-emerald-500 to-teal-500'
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <SpotlightEffect>
                          <GlassCard className="p-8 text-center h-full" hover gradient="default">
                            <motion.div
                              className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                              <feature.icon className="w-8 h-8 text-white" />
                            </motion.div>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                          </GlassCard>
                        </SpotlightEffect>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* User Status */}
                {!user && !analyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <GlassCard className="p-6 max-w-2xl mx-auto" gradient="cool">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-blue-900 mb-1">Unlock the Full Experience</h4>
                          <p className="text-blue-700 text-sm">
                            Sign in to save items to your personal collection, set style preferences,
                            and get personalized recommendations!
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="result"
            ref={heroRef}
            className="relative z-10 pt-12 pb-8 md:pt-16 md:pb-12 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="max-w-7xl mx-auto">
              {/* Back Button */}
              <div className="text-center mb-8">
                <motion.button
                  onClick={resetToHome}
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-amber-50"
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Analyze Another Item
                </motion.button>
              </div>

              {/* Analysis Result */}
              {currentAnalysis && (
                <PremiumAnalysisResult
                  analysis={currentAnalysis}
                  onSaveToCollection={handleSaveToCollection}
                  onSubmitFeedback={handleSubmitFeedback}
                />
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Stats Section */}
      <motion.section
        ref={statsRef}
        className="relative z-10 py-8 md:py-12 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-8 overflow-hidden" blur="lg" gradient="cool">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div 
                    className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {stat.number}
                    </span>
                  </motion.div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        style={{ y: featuresY }}
        className="relative z-10 py-10 md:py-14 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-10 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                VintageVision?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of antique identification with cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: feature.delay }}
                >
                  <SpotlightEffect>
                    <GlassCard 
                      className="p-8 h-full group cursor-pointer" 
                      hover
                      gradient="default"
                    >
                      <motion.div
                        className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                        {feature.description}
                      </p>

                      {/* Hover arrow */}
                      <motion.div
                        className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        <ArrowRight className="w-5 h-5 text-purple-600" />
                      </motion.div>
                    </GlassCard>
                  </SpotlightEffect>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="relative z-10 py-10 md:py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-10 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Loved by{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Collectors
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              See what our community is saying about VintageVision
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <GlassCard className="p-8 h-full" gradient="warm" hover>
                  <div className="flex items-center gap-4 mb-6">
                    <motion.img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/50"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <blockquote className="text-gray-700 italic mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, starIdx) => (
                      <motion.div
                        key={starIdx}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + idx * 0.2 + starIdx * 0.1 }}
                      >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative z-10 py-10 md:py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <SpotlightEffect>
            <GlassCard className="p-8 md:p-12 lg:p-16 overflow-hidden" gradient="warm" blur="xl">
              <FloatingParticles 
                count={30} 
                className="opacity-40"
                colors={['#f59e0b', '#f97316', '#ef4444']}
              />
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
                  Ready to Start Your
                  <br />
                  <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    Vintage Journey?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                  Join millions of collectors and discover the stories behind your treasures
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                  <LiquidButton 
                    onClick={handleGetStarted}
                    variant="primary"
                    size="lg"
                    className="px-10 py-5 text-xl"
                  >
                    <Search className="w-6 h-6" />
                    <span>Get Started Free</span>
                  </LiquidButton>
                  
                  <MagneticButton
                    onClick={() => navigate('/pricing')}
                    variant="glass"
                    size="lg"
                    className="px-10 py-5 text-xl"
                  >
                    <Crown className="w-6 h-6" />
                    <span>View Pricing</span>
                  </MagneticButton>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
                  {[
                    { icon: CheckCircle, text: 'Free to start' },
                    { icon: CheckCircle, text: 'No credit card required' },
                    { icon: CheckCircle, text: 'Cancel anytime' }
                  ].map((item, itemIdx) => (
                    <motion.div
                      key={item.text}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 1 + itemIdx * 0.1 }}
                    >
                      <item.icon className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </GlassCard>
          </SpotlightEffect>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 md:py-16 px-4 border-t border-white/20">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-8" blur="lg">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">VintageVision</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Discover the story behind every treasure with AI-powered vintage identification.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <button onClick={() => navigate('/features')} className="text-gray-600 hover:text-gray-900 transition-colors">
                      Features
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/pricing')} className="text-gray-600 hover:text-gray-900 transition-colors">
                      Pricing
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/help')} className="text-gray-600 hover:text-gray-900 transition-colors">
                      Help & Support
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <button onClick={() => navigate('/about')} className="text-gray-600 hover:text-gray-900 transition-colors">
                      About Us
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/contact')} className="text-gray-600 hover:text-gray-900 transition-colors">
                      Contact
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <button onClick={() => navigate('/privacy')} className="text-gray-600 hover:text-gray-900 transition-colors">
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/terms')} className="text-gray-600 hover:text-gray-900 transition-colors">
                      Terms of Service
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/cookies')} className="text-gray-600 hover:text-gray-900 transition-colors">
                      Cookie Policy
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-8 pt-8 text-center">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} VintageVision. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Made with care for antique enthusiasts worldwide
              </p>
            </div>
          </GlassCard>
        </div>
      </footer>
    </div>
  )
}
