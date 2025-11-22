import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Sparkles, 
  Search, 
  Heart, 
  Star, 
  ArrowRight, 
  CheckCircle,
  PlayCircle,
  Smartphone,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Glass from '@/components/ui/Glass';
import FloatingButton from '@/components/ui/FloatingButton';
import GradientText from '@/components/ui/GradientText';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

export default function LandingPage() {
  const { user, redirectToLogin } = useAuth();
  const navigate = useNavigate();

  // Simple intersection observers for animations - NO parallax to prevent overlap
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  

  const handleGetStarted = () => {
    if (user) {
      navigate('/app');
    } else {
      redirectToLogin();
    }
  };

  const features = [
    {
      icon: Search,
      title: 'AI-Powered Identification',
      description: 'Advanced computer vision instantly recognizes vintage items with expert-level accuracy',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: Heart,
      title: 'Personal Collection',
      description: 'Save discoveries, add notes, and build your curated vintage treasure collection',
      color: 'from-pink-400 to-pink-600'
    },
    {
      icon: Sparkles,
      title: 'Styling Suggestions',
      description: 'Get personalized design tips on how to incorporate items into your modern space',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: Globe,
      title: 'Marketplace Integration',
      description: 'Find similar items across top marketplaces with direct purchase links',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: Shield,
      title: 'Authenticity Insights',
      description: 'Learn about historical context, craftsmanship, and authentication markers',
      color: 'from-amber-400 to-amber-600'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get comprehensive analysis in seconds, not hours of research',
      color: 'from-orange-400 to-orange-600'
    }
  ];

  const stats = [
    { number: '1M+', label: 'Items Identified' },
    { number: '150K+', label: 'Happy Users' },
    { number: '98%', label: 'Accuracy Rate' },
    { number: '50+', label: 'Style Periods' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Interior Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      quote: 'VintageVision has revolutionized how I source authentic pieces for my clients. The styling suggestions are incredibly valuable.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Antique Collector',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      quote: 'I can now confidently identify and value pieces at estate sales. The historical context feature is amazing.'
    },
    {
      name: 'Emma Thompson',
      role: 'Vintage Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      quote: 'Finally found my grandmother\'s china pattern after years of searching. The accuracy is incredible!'
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      <AnimatedBackground variant="vintage" />

      {/*
        RESPONSIVE BREAKPOINTS:
        - Mobile: < 640px (sm)
        - Tablet: 640px - 1024px (sm to lg)
        - Desktop: > 1024px (lg+)

        Container max-width: 1152px (max-w-6xl)
        All sections use consistent spacing: py-16 or py-16 md:py-20
      */}

      {/* Navigation */}
      <nav className="relative z-10">
        <Glass className="mx-4 mt-4 p-3 sm:p-4" blur="lg">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">VintageVision</h1>
                <p className="text-xs text-gray-600 hidden sm:block">AI Antique Expert</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/pricing')}
                className="hidden md:block text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('/about')}
                className="hidden md:block text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </button>
              {user ? (
                <FloatingButton onClick={() => navigate('/app')} className="text-sm">
                  Go to App
                </FloatingButton>
              ) : (
                <FloatingButton onClick={redirectToLogin} className="text-sm">
                  Sign In
                </FloatingButton>
              )}
            </div>
          </div>
        </Glass>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div
            className={heroInView ? 'animate-fade-in' : 'opacity-0'}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">
                #1 AI Antique Identifier
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight px-4">
              Turn your phone into an{' '}
              <GradientText gradient="warm">
                antique expert
              </GradientText>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Instantly identify vintage treasures, discover their fascinating stories,
              and get expert styling tips with the power of AI
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <FloatingButton
                size="lg"
                onClick={handleGetStarted}
                className="px-8 py-4 w-full sm:w-auto"
              >
                <Search className="w-5 h-5 mr-2" />
                Start Discovering
                <ArrowRight className="w-5 h-5 ml-2" />
              </FloatingButton>

              <motion.button
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors w-full sm:w-auto justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </motion.button>
            </div>

            {/* Hero Image/Demo */}
            <div className="relative max-w-4xl mx-auto">
              <Glass className="p-4 sm:p-6 lg:p-8" gradient="warm" blur="xl">
                <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600 mx-auto mb-3" />
                    <p className="text-sm sm:text-base text-amber-800 font-medium">Interactive Demo Coming Soon</p>
                  </div>
                </div>
              </Glass>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="relative z-10 py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <Glass className="p-6 sm:p-8" blur="lg">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    <GradientText>{stat.number}</GradientText>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </Glass>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="relative z-10 py-16 md:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-12 ${featuresInView ? 'animate-fade-in' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <GradientText>VintageVision?</GradientText>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of antique identification with cutting-edge AI technology
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title}>
                  <Glass className="p-6 h-full" hover>
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </Glass>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Loved by <GradientText>Collectors</GradientText>
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              See what our community is saying about VintageVision
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name}>
                <Glass className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 truncate">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex gap-1 mt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </Glass>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Glass className="p-6 sm:p-8 lg:p-10" gradient="warm" blur="xl">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Ready to Start Your{' '}
                <GradientText gradient="warm">Vintage Journey?</GradientText>
              </h2>

              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Join thousands of collectors and discover the stories behind your treasures
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <FloatingButton
                  size="lg"
                  onClick={handleGetStarted}
                  className="px-8 py-4 w-full sm:w-auto"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Get Started Free
                </FloatingButton>

                <FloatingButton
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/pricing')}
                  className="px-8 py-4 w-full sm:w-auto"
                >
                  View Pricing
                </FloatingButton>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </Glass>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-white/20">
        <div className="max-w-6xl mx-auto">
          <Glass className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-gray-900">VintageVision</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Discover the story behind every treasure with AI-powered vintage identification.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</a></li>
                  <li><a href="/features" className="hover:text-gray-900 transition-colors">Features</a></li>
                  <li><a href="/api" className="hover:text-gray-900 transition-colors">API</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/about" className="hover:text-gray-900 transition-colors">About</a></li>
                  <li><a href="/contact" className="hover:text-gray-900 transition-colors">Contact</a></li>
                  <li><a href="/careers" className="hover:text-gray-900 transition-colors">Careers</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</a></li>
                  <li><a href="/cookies" className="hover:text-gray-900 transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
              <p>&copy; 2025 VintageVision. All rights reserved.</p>
            </div>
          </Glass>
        </div>
      </footer>
    </div>
  );
}
