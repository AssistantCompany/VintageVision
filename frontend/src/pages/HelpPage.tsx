import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Search, 
  HelpCircle, 
  Book,
  PlayCircle,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Camera,
  Heart,
  Star,
  Settings,
  CreditCard,
  Shield,
  Smartphone,
  Globe
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

interface GuideSection {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  items: string[]
}

export default function HelpPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: 'All Topics', icon: Book },
    { id: 'getting-started', label: 'Getting Started', icon: PlayCircle },
    { id: 'identification', label: 'AI Identification', icon: Camera },
    { id: 'collection', label: 'Collection', icon: Heart },
    { id: 'account', label: 'Account & Settings', icon: Settings },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'technical', label: 'Technical Support', icon: Smartphone }
  ]

  const faqs: FAQItem[] = [
    {
      id: '1',
      category: 'getting-started',
      question: 'How do I get started with VintageVision?',
      answer: 'Simply download the app or visit our website, create your free account, and start uploading photos of vintage items you want to identify. Our AI will analyze them instantly and provide detailed information.'
    },
    {
      id: '2',
      category: 'identification',
      question: 'How accurate is the AI identification?',
      answer: 'Our AI uses advanced vision models to identify vintage and antique items. Accuracy varies by item type - items with visible brand names or maker\'s marks get the most reliable identifications. The AI provides honest confidence scores to indicate how certain it is about each identification.'
    },
    {
      id: '3',
      category: 'identification',
      question: 'What types of items can VintageVision identify?',
      answer: 'VintageVision can identify furniture, jewelry, art, ceramics, textiles, toys, books, and many other vintage and antique items from various eras and styles including Victorian, Art Deco, Mid-Century Modern, and more.'
    },
    {
      id: '4',
      category: 'collection',
      question: 'How do I save items to my collection?',
      answer: 'After analyzing an item, tap the heart icon or "Save to Collection" button. You can add notes, specify location, and organize your collection by categories or custom tags.'
    },
    {
      id: '5',
      category: 'account',
      question: 'Can I use VintageVision without creating an account?',
      answer: 'You can try a limited number of identifications without an account, but creating a free account unlocks features like saving your collection, getting styling suggestions, and tracking your discovery history.'
    },
    {
      id: '6',
      category: 'billing',
      question: 'What\'s included in the free plan?',
      answer: 'The free plan includes 5 identifications per month, basic historical information, and the ability to save items to your collection. Pro plans offer unlimited identifications, advanced styling suggestions, and marketplace integration.'
    },
    {
      id: '7',
      category: 'technical',
      question: 'Why isn\'t my photo uploading?',
      answer: 'Make sure your photo is clear, well-lit, and under 10MB. Supported formats are JPG, PNG, and HEIC. If you\'re still having issues, try using a different device or contact our support team.'
    },
    {
      id: '8',
      category: 'identification',
      question: 'Can I get professional appraisals through VintageVision?',
      answer: 'VintageVision provides estimated values based on market data, but for formal appraisals needed for insurance or legal purposes, we recommend consulting with certified professional appraisers.'
    },
    {
      id: '9',
      category: 'collection',
      question: 'Can I export my collection data?',
      answer: 'Yes! Pro users can export their collection data in various formats including CSV, JSON, and PDF reports. This feature is available in your account settings under Data Export.'
    },
    {
      id: '10',
      category: 'technical',
      question: 'Is VintageVision available offline?',
      answer: 'The app works offline for viewing your saved collection and previously analyzed items. However, new AI identifications require an internet connection to access our servers.'
    }
  ]

  const guides: GuideSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started Guide',
      description: 'Learn the basics of using VintageVision',
      icon: PlayCircle,
      items: [
        'Creating your account',
        'Taking the perfect photo',
        'Understanding analysis results',
        'Building your first collection'
      ]
    },
    {
      id: 'advanced-features',
      title: 'Advanced Features',
      description: 'Master all of VintageVision\'s capabilities',
      icon: Star,
      items: [
        'Using styling suggestions',
        'Setting up wishlist alerts',
        'Marketplace integration',
        'Sharing your discoveries'
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Solutions to common issues',
      icon: Settings,
      items: [
        'Photo upload problems',
        'Account sync issues',
        'Payment and billing',
        'Performance optimization'
      ]
    },
    {
      id: 'privacy-security',
      title: 'Privacy & Security',
      description: 'Protecting your data and privacy',
      icon: Shield,
      items: [
        'Data privacy settings',
        'Account security',
        'Image storage policies',
        'Sharing controls'
      ]
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen pb-28 md:pb-8 bg-background">
      {/* Header */}
      <div className="relative z-10 p-4">
        <GlassCard className="p-4">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="default"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Help{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Center
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Find answers to your questions and learn how to get the most out of VintageVision
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <GlassCard className="p-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for help articles, FAQs, and guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
                  />
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 text-center h-full" hover="scale">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Contact Support</h3>
                <p className="text-muted-foreground mb-4">Get personalized help from our expert team</p>
                <Button
                  onClick={() => navigate('/contact')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Contact Us
                </Button>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 text-center h-full" hover="scale">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Video Tutorials</h3>
                <p className="text-muted-foreground mb-4">Watch step-by-step guides and tutorials</p>
                <Button
                  onClick={() => window.open('https://youtube.com/@vintagevision', '_blank')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Watch Videos
                </Button>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 text-center h-full" hover="scale">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Community Forum</h3>
                <p className="text-muted-foreground mb-4">Connect with other vintage enthusiasts</p>
                <Button
                  onClick={() => window.open('https://community.vintagevision.ai', '_blank')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Join Community
                </Button>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>

      {/* User Guides */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">User Guides</h2>
            <p className="text-xl text-muted-foreground">Step-by-step guides to help you master VintageVision</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {guides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-8 h-full" hover="scale">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <guide.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{guide.title}</h3>
                      <p className="text-muted-foreground">{guide.description}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {guide.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-3 text-muted-foreground">
                        <ChevronRight className="w-4 h-4 text-info flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => navigate(`/guides/${guide.id}`)}
                    variant="outline"
                    size="default"
                    className="w-full"
                  >
                    View Guide
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Quick answers to common questions</p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={activeCategory === category.id ? "brass" : "outline"}
                size="sm"
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.label}
              </Button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto">
            <GlassCard className="divide-y divide-border">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-6 text-left hover:bg-muted/50 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground pr-4">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Still Need Help */}
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
                Still Need Help?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Can't find what you're looking for? Our support team is here to help you succeed.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/contact')}
                  variant="brass"
                  size="lg"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Support
                </Button>

                <Button
                  onClick={() => window.open('mailto:support@vintagevision.ai', '_blank')}
                  variant="outline"
                  size="lg"
                >
                  Email Us Directly
                </Button>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
