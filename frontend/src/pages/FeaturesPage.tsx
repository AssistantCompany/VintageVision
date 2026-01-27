import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Camera, 
  Sparkles, 
  Brain,
  Heart,
  Star,
  Palette,
  Globe,
  Zap,
  TrendingUp,
  Users,
  Crown,
  CheckCircle,
  Smartphone,
  Cloud,
  Lock,
  BarChart
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'

export default function FeaturesPage() {
  const navigate = useNavigate()

  const coreFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Identification',
      description: 'Advanced computer vision and machine learning algorithms trained on millions of vintage items',
      features: [
        'GPT-4 Vision powered analysis',
        'Recognizes 150+ style periods',
        'Reads visible text and maker marks',
        'Honest confidence scoring'
      ],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Market Value Analysis',
      description: 'Real-time market data and pricing intelligence for accurate valuations',
      features: [
        'Current market value estimates',
        'Price trend analysis',
        'Condition-based adjustments',
        'Auction and marketplace data'
      ],
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Palette,
      title: 'Styling Suggestions',
      description: 'Expert interior design recommendations to incorporate vintage pieces beautifully',
      features: [
        'Room-specific placement ideas',
        'Color palette recommendations',
        'Complementary item suggestions',
        'Modern integration tips'
      ],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Marketplace Integration',
      description: 'Find similar items across top vintage and antique marketplaces worldwide',
      features: [
        'eBay, Etsy, and Chairish integration',
        'Direct purchase links',
        'Price comparison',
        'Availability alerts'
      ],
      gradient: 'from-amber-500 to-orange-500'
    }
  ]

  const premiumFeatures = [
    {
      icon: Heart,
      title: 'Personal Collection',
      description: 'Organize and manage your vintage treasures',
      features: ['Unlimited saves', 'Custom categories', 'Notes and tags', 'Export options']
    },
    {
      icon: Star,
      title: 'Smart Wishlist',
      description: 'Get notified when matching items appear',
      features: ['Automated alerts', 'Custom search criteria', 'Price thresholds', 'Style preferences']
    },
    {
      icon: BarChart,
      title: 'Analytics Dashboard',
      description: 'Track your collection\'s value and trends',
      features: ['Portfolio value tracking', 'Market trend insights', 'Investment analysis', 'Growth reports']
    },
    {
      icon: Users,
      title: 'Community Features',
      description: 'Connect with fellow collectors',
      features: ['Share discoveries', 'Expert consultations', 'Community forums', 'Collector profiles']
    }
  ]

  const technicalFeatures = [
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Perfect experience on any device',
      details: 'Progressive Web App with offline support, touch-optimized interface, and native app feel'
    },
    {
      icon: Cloud,
      title: 'Cloud Sync',
      description: 'Access your data anywhere',
      details: 'Automatic synchronization across all devices with enterprise-grade security and backup'
    },
    {
      icon: Lock,
      title: 'Privacy & Security',
      description: 'Your data is protected',
      details: 'End-to-end encryption, GDPR compliance, and granular privacy controls'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant results and responses',
      details: 'Edge computing, advanced caching, and optimized algorithms for sub-second analysis'
    }
  ]

  const useCases = [
    {
      title: 'Estate Sale Shopping',
      description: 'Quickly identify valuable items and make informed purchases',
      icon: '🏠'
    },
    {
      title: 'Interior Design',
      description: 'Find perfect vintage pieces that complement your modern aesthetic',
      icon: '🎨'
    },
    {
      title: 'Collection Management',
      description: 'Organize, catalog, and track the value of your vintage collection',
      icon: '📚'
    },
    {
      title: 'Investment Research',
      description: 'Analyze market trends and make strategic vintage investments',
      icon: '📈'
    },
    {
      title: 'Inheritance Evaluation',
      description: 'Understand the value and significance of inherited items',
      icon: '💎'
    },
    {
      title: 'Educational Exploration',
      description: 'Learn about different periods, styles, and historical contexts',
      icon: '🎓'
    }
  ]

  return (
    <div className="min-h-screen pb-28 md:pb-8 bg-background">
      {/* Header */}
      <div className="relative z-10 p-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="default"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <Button
              onClick={() => navigate('/pricing')}
              variant="brass"
              size="sm"
            >
              <Crown className="w-4 h-4 mr-2" />
              View Pricing
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Powerful{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Features
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover everything VintageVision offers to help you identify, value, and style 
              vintage treasures with the power of artificial intelligence.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Core Features */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Core Features</h2>
            <p className="text-xl text-muted-foreground">The foundation of VintageVision's powerful AI platform</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-8 h-full" hover="scale">
                    <div className="flex items-start gap-6 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-3">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Features */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Premium Features</h2>
            <p className="text-xl text-muted-foreground">Advanced tools for serious collectors and professionals</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 h-full text-center" hover="scale" variant="brass">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                        <div className="w-1 h-1 bg-amber-500 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Features */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Technical Excellence</h2>
            <p className="text-xl text-muted-foreground">Built with cutting-edge technology for the best user experience</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technicalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 h-full" hover="scale">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-info font-medium text-sm mb-3">{feature.description}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.details}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Perfect For</h2>
            <p className="text-xl text-muted-foreground">See how VintageVision fits into your vintage journey</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 text-center h-full" hover="scale">
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{useCase.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12" variant="brass">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Experience These Features?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start your vintage journey today and discover the stories behind your treasures.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/')}
                  variant="brass"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Try for Free
                </Button>

                <Button
                  onClick={() => navigate('/pricing')}
                  variant="outline"
                  size="lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  View Plans
                </Button>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
