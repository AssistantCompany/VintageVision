import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useAuth } from '@getmocha/users-service/react'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  Search, 
  Heart, 
  Star, 
  ArrowRight, 
  CheckCircle,
  PlayCircle,
  Globe,
  Shield,
  Zap,
  Crown,
  TrendingUp,
  Camera,
  Palette
} from 'lucide-react'
import GlassCard from '@/react-app/components/ui/GlassCard'
import MagneticButton from '@/react-app/components/ui/MagneticButton'
import LiquidButton from '@/react-app/components/ui/LiquidButton'
import SpotlightEffect from '@/react-app/components/ui/SpotlightEffect'
import FloatingParticles from '@/react-app/components/ui/FloatingParticles'

import { trackEvent } from '@/react-app/lib/utils'

export default function PremiumLandingPage() {
  const { user, redirectToLogin } = useAuth()
  const navigate = useNavigate()
  const { scrollY } = useScroll()

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 800], [0, -200])
  const featuresY = useTransform(scrollY, [0, 1200], [0, -100])

  // Refs for intersection observer
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true })
  const featuresInView = useInView(featuresRef, { once: true })
  const statsInView = useInView(statsRef, { once: true })
  const testimonialsInView = useInView(testimonialsRef, { once: true })
  const ctaInView = useInView(ctaRef, { once: true })

  const handleGetStarted = () => {
    trackEvent('landing_get_started_click')
    if (user) {
      navigate('/')
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
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face&auto=format',
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
      <nav className="relative z-10 p-4">
        <GlassCard className="max-w-7xl mx-auto" blur="xl">
          <div className="flex items-center justify-between p-4">
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
                <LiquidButton onClick={() => navigate('/')}>
                  <Zap className="w-4 h-4" />
                  Go to App
                </LiquidButton>
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
      <motion.section 
        ref={heroRef}
        style={{ y: heroY }}
        className="relative z-10 pt-20 pb-32 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
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

            {/* Main Headline */}
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Turn your phone into an{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                antique expert
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Instantly identify vintage treasures, discover their fascinating stories, 
              and get expert styling tips with the power of AI
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <LiquidButton 
                onClick={handleGetStarted}
                variant="primary"
                size="lg"
                className="px-8 py-4 text-lg"
              >
                <Search className="w-5 h-5" />
                <span>Start Discovering</span>
                <ArrowRight className="w-5 h-5" />
              </LiquidButton>
              
              <MagneticButton
                onClick={() => trackEvent('watch_demo_click')}
                variant="glass"
                size="lg"
                className="px-8 py-4 text-lg"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Watch Demo</span>
              </MagneticButton>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              className="relative max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 1 }}
            >
              <SpotlightEffect>
                <GlassCard className="p-8 overflow-hidden" gradient="warm" blur="xl">
                  <div className="aspect-video bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 rounded-2xl flex items-center justify-center relative">
                    <div className="text-center space-y-4">
                      <motion.div
                        className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl"
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 6, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Camera className="w-12 h-12 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-amber-800 mb-2">Interactive Demo</h3>
                        <p className="text-amber-600 font-medium">Experience AI-powered identification</p>
                      </div>
                    </div>
                    
                    {/* Floating elements */}
                    {[...Array(6)].map((_, idx) => (
                      <motion.div
                        key={idx}
                        className="absolute w-3 h-3 bg-amber-400 rounded-full"
                        style={{
                          top: `${20 + Math.random() * 60}%`,
                          left: `${10 + Math.random() * 80}%`,
                        }}
                        animate={{
                          y: [-10, -30, -10],
                          opacity: [0.3, 1, 0.3],
                          scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                      />
                    ))}
                  </div>
                </GlassCard>
              </SpotlightEffect>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        ref={statsRef}
        className="relative z-10 py-20 px-4"
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
        className="relative z-10 py-32 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section ref={testimonialsRef} className="relative z-10 py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
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

          <div className="grid md:grid-cols-3 gap-8">
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
      <section ref={ctaRef} className="relative z-10 py-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <SpotlightEffect>
            <GlassCard className="p-16 overflow-hidden" gradient="warm" blur="xl">
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
    </div>
  )
}
