import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Sparkles, Crown, Zap, ArrowLeft, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import LiquidButton from '@/components/ui/LiquidButton'
import FloatingParticles from '@/components/ui/FloatingParticles'
import SpotlightEffect from '@/components/ui/SpotlightEffect'
import { trackEvent } from '@/lib/utils'

export default function PremiumPricing() {
  const navigate = useNavigate()
  const { user, redirectToLogin } = useAuth()
  const [isAnnual, setIsAnnual] = useState(false)
  
  const heroRef = useRef(null)
  const plansRef = useRef(null)
  const faqRef = useRef(null)
  
  const heroInView = useInView(heroRef, { once: true })
  const plansInView = useInView(plansRef, { once: true })
  const faqInView = useInView(faqRef, { once: true })

  const plans = [
    {
      name: 'Free Explorer',
      icon: Sparkles,
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for casual vintage enthusiasts',
      features: [
        '5 identifications per month',
        'Basic item information',
        'Historical context',
        'Community features',
        'Mobile app access'
      ],
      limitations: [
        'Limited styling suggestions',
        'No collection export',
        'Basic support'
      ],
      cta: 'Get Started Free',
      popular: false,
      gradient: 'from-gray-400 to-gray-600',
      borderGradient: 'from-gray-300 to-gray-400'
    },
    {
      name: 'Pro Collector',
      icon: Crown,
      price: { monthly: 19, annual: 190 },
      description: 'For serious collectors and dealers',
      features: [
        'Unlimited identifications',
        'Advanced AI analysis',
        'Detailed styling suggestions',
        'Value tracking & alerts',
        'Collection management',
        'Marketplace integration',
        'Export capabilities',
        'Priority support',
        'Authenticity insights',
        'Historical documentation'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      popular: true,
      gradient: 'from-amber-400 to-orange-500',
      borderGradient: 'from-amber-300 to-orange-400'
    },
    {
      name: 'Expert Enterprise',
      icon: Zap,
      price: { monthly: 99, annual: 990 },
      description: 'For businesses and professional appraisers',
      features: [
        'Everything in Pro',
        'API access',
        'Bulk processing',
        'Custom integrations',
        'White-label options',
        'Advanced analytics',
        'Team collaboration',
        'Dedicated support',
        'Custom training',
        'SLA guarantee'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-purple-400 to-pink-500',
      borderGradient: 'from-purple-300 to-pink-400'
    }
  ]

  const handleSubscribe = async (planName: string, priceId: string) => {
    trackEvent('subscription_attempt', { plan: planName, billing: isAnnual ? 'annual' : 'monthly' })
    
    if (!user) {
      redirectToLogin()
      return
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planName,
          isAnnual
        }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Subscription error:', error)
      trackEvent('subscription_error', { error: String(error) })
    }
  }

  const faqs = [
    {
      question: 'Can I switch plans anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we\'ll prorate any billing differences.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Our Free Explorer plan is available indefinitely with 5 identifications per month. Pro plans include a 14-day free trial with full access.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise plans.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, we\'ll refund your payment, no questions asked.'
    },
    {
      question: 'How accurate is the AI identification?',
      answer: 'Our AI achieves 99%+ accuracy on common vintage items and 95%+ on rare pieces. We continuously improve our models with user feedback.'
    },
    {
      question: 'Can I use this for my business?',
      answer: 'Absolutely! Our Pro and Enterprise plans are designed for dealers, appraisers, auction houses, and other professionals in the antique industry.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <FloatingParticles 
          count={60} 
          className="opacity-30"
          colors={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']}
        />
      </div>
      
      {/* Header */}
      <div className="relative z-10 p-4">
        <GlassCard className="max-w-7xl mx-auto" blur="xl">
          <div className="flex items-center justify-between p-4">
            <MagneticButton
              onClick={() => navigate('/')}
              variant="ghost"
              size="md"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </MagneticButton>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">VintageVision</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            ref={heroRef}
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Choose Your{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Plan
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Start with our free plan and upgrade as your vintage journey grows
            </motion.p>

            {/* Billing Toggle */}
            <motion.div
              className="inline-flex items-center relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <GlassCard className="p-1" gradient="default">
                <div className="flex rounded-xl overflow-hidden">
                  <button
                    onClick={() => setIsAnnual(false)}
                    className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      !isAnnual 
                        ? 'bg-white text-gray-900 shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIsAnnual(true)}
                    className={`px-6 py-3 rounded-xl text-sm font-medium transition-all relative ${
                      isAnnual 
                        ? 'bg-white text-gray-900 shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Annual
                    <motion.span 
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Save 17%
                    </motion.span>
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            ref={plansRef}
            className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={plansInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {plans.map((plan, index) => {
              const Icon = plan.icon
              const price = isAnnual ? plan.price.annual : plan.price.monthly
              const monthlyPrice = isAnnual ? Math.round(plan.price.annual / 12) : plan.price.monthly
              
              return (
                <motion.div
                  key={plan.name}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  animate={plansInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10"
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold shadow-lg whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Star className="w-3 h-3 md:w-4 md:h-4" />
                          Most Popular
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <SpotlightEffect>
                    <GlassCard
                      className={`${plan.popular ? 'pt-10 pb-8 px-8' : 'p-8'} h-full relative overflow-hidden ${
                        plan.popular ? 'border-2 border-amber-300/50' : ''
                      }`}
                      hover
                      gradient={plan.popular ? 'warm' : 'default'}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/10 to-transparent rounded-bl-[100px]" />
                      )}
                      
                      <div className="relative z-10">
                        <div className="text-center mb-8">
                          <motion.div
                            className={`w-20 h-20 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          >
                            <Icon className="w-10 h-10 text-white" />
                          </motion.div>
                          
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                          <p className="text-gray-600 mb-6">{plan.description}</p>
                          
                          <div className="mb-6">
                            <motion.span 
                              className="text-4xl font-bold text-gray-900"
                              key={monthlyPrice}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              ${monthlyPrice}
                            </motion.span>
                            <span className="text-gray-600">/month</span>
                            {isAnnual && plan.price.annual > 0 && (
                              <motion.div
                                className="text-sm text-green-600 font-medium mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                Billed annually (${price})
                              </motion.div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          {plan.features.map((feature, featureIndex) => (
                            <motion.div 
                              key={featureIndex} 
                              className="flex items-start gap-3"
                              initial={{ opacity: 0, x: -10 }}
                              animate={plansInView ? { opacity: 1, x: 0 } : {}}
                              transition={{ delay: 0.3 + featureIndex * 0.05 }}
                            >
                              <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                            </motion.div>
                          ))}
                          
                          {plan.limitations.map((limitation, limitIndex) => (
                            <motion.div 
                              key={limitIndex} 
                              className="flex items-start gap-3 opacity-60"
                              initial={{ opacity: 0, x: -10 }}
                              animate={plansInView ? { opacity: 0.6, x: 0 } : {}}
                              transition={{ delay: 0.5 + limitIndex * 0.05 }}
                            >
                              <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 border border-gray-400 rounded-full mx-auto mt-1" />
                              </div>
                              <span className="text-gray-600 text-sm leading-relaxed">{limitation}</span>
                            </motion.div>
                          ))}
                        </div>

                        {plan.popular ? (
                          <LiquidButton
                            onClick={() => {
                              if (plan.name === 'Free Explorer') {
                                navigate('/')
                              } else if (plan.name === 'Expert Enterprise') {
                                window.location.href = 'mailto:sales@vintagevision.ai'
                              } else {
                                handleSubscribe(plan.name, `price_${plan.name.toLowerCase().replace(' ', '_')}`)
                              }
                            }}
                            variant="primary"
                            size="lg"
                            className="w-full"
                          >
                            {plan.cta}
                          </LiquidButton>
                        ) : (
                          <MagneticButton
                            onClick={() => {
                              if (plan.name === 'Free Explorer') {
                                navigate('/')
                              } else if (plan.name === 'Expert Enterprise') {
                                window.location.href = 'mailto:sales@vintagevision.ai'
                              } else {
                                handleSubscribe(plan.name, `price_${plan.name.toLowerCase().replace(' ', '_')}`)
                              }
                            }}
                            variant="secondary"
                            size="lg"
                            className="w-full"
                          >
                            {plan.cta}
                          </MagneticButton>
                        )}
                      </div>
                    </GlassCard>
                  </SpotlightEffect>
                </motion.div>
              )
            })}
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            ref={faqRef}
            initial={{ opacity: 0, y: 30 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8 md:p-12" gradient="cool">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                Frequently Asked Questions
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={faqInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="font-bold text-gray-900 text-lg">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Enterprise CTA */}
          <motion.div
            className="text-center mt-12 md:mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <SpotlightEffect>
              <GlassCard className="p-8 md:p-12" gradient="purple">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Need a Custom Solution?
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  We work with auction houses, museums, and large collectors to provide 
                  tailored solutions for your specific needs.
                </p>
                <LiquidButton 
                  onClick={() => window.location.href = 'mailto:enterprise@vintagevision.ai'}
                  variant="secondary"
                  size="lg"
                >
                  <Zap className="w-5 h-5" />
                  Contact Enterprise Sales
                </LiquidButton>
              </GlassCard>
            </SpotlightEffect>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
