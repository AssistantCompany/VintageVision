import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin,
  Send,
  Clock,
  Users,
  Briefcase,
  HelpCircle,
  Sparkles,
  CheckCircle
} from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import LiquidButton from '@/components/ui/LiquidButton'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import { useNotifications } from '@/components/enhanced/NotificationSystem'
import { cn } from '@/lib/utils'

interface ContactForm {
  name: string
  email: string
  subject: string
  category: string
  message: string
}

export default function ContactPage() {
  const navigate = useNavigate()
  const notifications = useNotifications()
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const categories = [
    { id: 'general', label: 'General Inquiry', icon: MessageSquare },
    { id: 'support', label: 'Technical Support', icon: HelpCircle },
    { id: 'business', label: 'Business Partnership', icon: Briefcase },
    { id: 'press', label: 'Press & Media', icon: Users }
  ]

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help from our expert team',
      contact: 'support@vintagevision.ai',
      availability: '24/7 support available'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      contact: 'Available in app',
      availability: 'Mon-Fri, 9AM-6PM PST'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our team',
      contact: '+1 (555) 123-4567',
      availability: 'Mon-Fri, 9AM-6PM PST'
    },
    {
      icon: MapPin,
      title: 'Office Location',
      description: 'Visit our headquarters',
      contact: 'San Francisco, CA',
      availability: 'By appointment only'
    }
  ]

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Innovation Drive, San Francisco, CA 94105',
      type: 'Headquarters',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      city: 'New York',
      address: '456 Tech Avenue, New York, NY 10001',
      type: 'Sales Office',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      city: 'London',
      address: '789 Digital Street, London, UK EC1A 1BB',
      type: 'European Hub',
      gradient: 'from-emerald-500 to-teal-500'
    }
  ]

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real implementation, send to backend
      console.log('Contact form submission:', form)
      
      setIsSubmitted(true)
      notifications.success('Message sent successfully!', 'We\'ll get back to you within 24 hours')
      
      // Reset form
      setForm({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      })
    } catch (error) {
      notifications.error('Failed to send message', 'Please try again or contact us directly')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground variant="cool" />
        <div className="relative z-10 px-4 max-w-lg mx-auto text-center">
          <GlassCard className="p-12" gradient="warm">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
              <p className="text-gray-600 mb-8">
                Your message has been sent successfully. Our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-4">
                <LiquidButton
                  onClick={() => navigate('/')}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <Sparkles className="w-5 h-5" />
                  Return to App
                </LiquidButton>
                
                <MagneticButton
                  onClick={() => setIsSubmitted(false)}
                  variant="ghost"
                  size="md"
                  className="w-full"
                >
                  Send Another Message
                </MagneticButton>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <AnimatedBackground variant="cool" />
      
      {/* Header */}
      <div className="relative z-10 p-4">
        <GlassCard className="p-4" blur="lg">
          <MagneticButton
            onClick={() => navigate('/')}
            variant="ghost"
            size="md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </MagneticButton>
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
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Get in{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about VintageVision? Want to partner with us? We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">How to Reach Us</h2>
            <p className="text-xl text-gray-600">Choose the method that works best for you</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 text-center h-full" hover>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                  <p className="text-blue-600 font-medium mb-2">{method.contact}</p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{method.availability}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <p className="text-xl text-gray-600">Fill out the form below and we'll get back to you soon</p>
          </motion.div>

          <GlassCard className="p-8 md:p-12" gradient="default">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What can we help you with?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      type="button"
                      onClick={() => handleInputChange('category', category.id)}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all duration-300 text-center',
                        form.category === category.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <category.icon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>

      {/* Office Locations */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Offices</h2>
            <p className="text-xl text-gray-600">Visit us at one of our global locations</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 h-full" hover>
                  <div className={`w-12 h-12 bg-gradient-to-r ${office.gradient} rounded-xl flex items-center justify-center mb-4`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{office.city}</h3>
                  <p className="text-blue-600 font-medium mb-3">{office.type}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{office.address}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Quick Links */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12" gradient="warm">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Need Quick Answers?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Check out our FAQ or browse our help center for instant answers to common questions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LiquidButton
                  onClick={() => navigate('/help')}
                  variant="primary"
                  size="lg"
                >
                  <HelpCircle className="w-5 h-5" />
                  Help Center
                </LiquidButton>
                
                <MagneticButton
                  onClick={() => navigate('/faq')}
                  variant="glass"
                  size="lg"
                >
                  <MessageSquare className="w-5 h-5" />
                  View FAQ
                </MagneticButton>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
