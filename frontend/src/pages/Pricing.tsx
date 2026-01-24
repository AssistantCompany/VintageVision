import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Glass from '@/components/ui/Glass';
import FloatingButton from '@/components/ui/FloatingButton';
import GradientText from '@/components/ui/GradientText';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

export default function PricingPage() {
  const navigate = useNavigate();
  const { user, redirectToLogin } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);

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
      color: 'from-gray-400 to-gray-600'
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
      color: 'from-amber-400 to-orange-500'
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
      color: 'from-purple-400 to-pink-500'
    }
  ];

  const handleSubscribe = async (planName: string, priceId: string) => {
    if (!user) {
      redirectToLogin();
      return;
    }

    // This would integrate with Stripe or another payment processor
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
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className="min-h-screen pb-28 md:pb-8">
      <AnimatedBackground variant="cool" />

      {/* Header */}
      <div className="relative z-10 p-4">
        <Glass className="p-4" blur="lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">VintageVision</span>
            </div>
          </div>
        </Glass>
      </div>

      <div className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Choose Your <GradientText gradient="cool">Plan</GradientText>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Start with our free plan and upgrade as your vintage journey grows
            </motion.p>

            {/* Billing Toggle */}
            <motion.div
              className="inline-flex items-center bg-white/50 backdrop-blur-sm border border-white/30 rounded-full p-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !isAnnual 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all relative ${
                  isAnnual 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = isAnnual ? plan.price.annual : plan.price.monthly;
              const monthlyPrice = isAnnual ? Math.round(plan.price.annual / 12) : plan.price.monthly;
              
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <Glass 
                    className={`p-8 h-full ${plan.popular ? 'ring-2 ring-amber-300' : ''}`}
                    hover
                  >
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900">
                          ${monthlyPrice}
                        </span>
                        <span className="text-gray-600">/month</span>
                        {isAnnual && plan.price.annual > 0 && (
                          <div className="text-sm text-green-600 font-medium">
                            Billed annually (${price})
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start gap-3 opacity-60">
                          <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                            <div className="w-3 h-3 border border-gray-400 rounded-full mx-auto mt-1" />
                          </div>
                          <span className="text-gray-600">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    <FloatingButton
                      onClick={() => {
                        if (plan.name === 'Free Explorer') {
                          navigate('/');
                        } else if (plan.name === 'Expert Enterprise') {
                          // Contact sales
                          window.location.href = 'mailto:sales@vintagevision.ai';
                        } else {
                          handleSubscribe(plan.name, `price_${plan.name.toLowerCase().replace(' ', '_')}`);
                        }
                      }}
                      variant={plan.popular ? 'primary' : 'secondary'}
                      className="w-full justify-center"
                    >
                      {plan.cta}
                    </FloatingButton>
                  </Glass>
                </motion.div>
              );
            })}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Glass className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Frequently Asked Questions
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I switch plans anytime?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Is there a free trial?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Our Free Explorer plan is available indefinitely. Pro plans include a 14-day free trial.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Do you offer refunds?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We offer a 30-day money-back guarantee on all paid plans. No questions asked.
                  </p>
                </div>
              </div>
            </Glass>
          </motion.div>

          {/* Enterprise CTA */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Glass className="p-8" gradient="warm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need a Custom Solution?
              </h2>
              <p className="text-gray-600 mb-6">
                We work with auction houses, museums, and large collectors to provide 
                tailored solutions for your specific needs.
              </p>
              <FloatingButton 
                onClick={() => window.location.href = 'mailto:enterprise@vintagevision.ai'}
                variant="secondary"
              >
                Contact Enterprise Sales
              </FloatingButton>
            </Glass>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
