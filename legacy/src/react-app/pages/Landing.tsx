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
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router-dom';
import Glass from '@/react-app/components/ui/Glass';
import FloatingButton from '@/react-app/components/ui/FloatingButton';
import GradientText from '@/react-app/components/ui/GradientText';
import AnimatedBackground from '@/react-app/components/ui/AnimatedBackground';

export default function LandingPage() {
  const { user, redirectToLogin } = useAuth();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const featuresY = useTransform(scrollY, [0, 800], [0, -50]);

  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true });

  

  const handleGetStarted = () => {
    if (user) {
      navigate('/');
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
      
      {/* Navigation */}
      <nav className="relative z-10">
        <Glass className="mx-4 mt-4 p-4" blur="lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VintageVision</h1>
                <p className="text-xs text-gray-600">AI Antique Expert</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/pricing')}
                className="hidden md:block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="hidden md:block text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </button>
              {user ? (
                <FloatingButton onClick={() => navigate('/')}>
                  Go to App
                </FloatingButton>
              ) : (
                <FloatingButton onClick={redirectToLogin}>
                  Sign In
                </FloatingButton>
              )}
            </div>
          </div>
        </Glass>
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
            <motion.div
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">
                #1 AI Antique Identifier
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Turn your phone into an{' '}
              <GradientText gradient="warm">
                antique expert
              </GradientText>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Instantly identify vintage treasures, discover their fascinating stories, 
              and get expert styling tips with the power of AI
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <FloatingButton 
                size="lg" 
                onClick={handleGetStarted}
                className="px-8 py-4"
              >
                <Search className="w-5 h-5 mr-2" />
                Start Discovering
                <ArrowRight className="w-5 h-5 ml-2" />
              </FloatingButton>
              
              <motion.button
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </motion.button>
            </div>

            {/* Hero Image/Demo */}
            <motion.div
              className="relative max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Glass className="p-8" gradient="warm" blur="xl">
                <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                    <p className="text-amber-800 font-medium">Interactive Demo Coming Soon</p>
                  </div>
                </div>
              </Glass>
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
          <Glass className="p-8" blur="lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    <GradientText>{stat.number}</GradientText>
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </Glass>
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
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <GradientText>VintageVision?</GradientText>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of antique identification with cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Glass className="p-6 h-full" hover>
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </Glass>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by <GradientText>Collectors</GradientText>
            </h2>
            <p className="text-xl text-gray-600">
              See what our community is saying about VintageVision
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Glass className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                  <div className="flex gap-1 mt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </Glass>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Glass className="p-12" gradient="warm" blur="xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Ready to Start Your
                <br />
                <GradientText gradient="warm">Vintage Journey?</GradientText>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of collectors and discover the stories behind your treasures
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <FloatingButton 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="px-8 py-4"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Get Started Free
                </FloatingButton>
                
                <FloatingButton
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/pricing')}
                  className="px-8 py-4"
                >
                  View Pricing
                </FloatingButton>
              </div>

              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>
          </Glass>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-4 border-t border-white/20">
        <div className="max-w-7xl mx-auto">
          <Glass className="p-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-gray-900">VintageVision</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Discover the story behind every treasure with AI-powered vintage identification.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</a></li>
                  <li><a href="/features" className="hover:text-gray-900 transition-colors">Features</a></li>
                  <li><a href="/api" className="hover:text-gray-900 transition-colors">API</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/about" className="hover:text-gray-900 transition-colors">About</a></li>
                  <li><a href="/contact" className="hover:text-gray-900 transition-colors">Contact</a></li>
                  <li><a href="/careers" className="hover:text-gray-900 transition-colors">Careers</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</a></li>
                  <li><a href="/cookies" className="hover:text-gray-900 transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
              <p>&copy; 2025 VintageVision. All rights reserved.</p>
            </div>
          </Glass>
        </div>
      </footer>
    </div>
  );
}
