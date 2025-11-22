import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  Mail, 
  Twitter, 
  Instagram, 
  Linkedin,
  Github,
  Heart,
  Shield,
  FileText,
  Cookie,
  Phone,
  MapPin
} from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { trackEvent } from '@/lib/utils'

export default function PremiumFooter() {
  const navigate = useNavigate()

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', path: '/features' },
        { label: 'Pricing', path: '/pricing' },
        { label: 'How it Works', path: '/#how-it-works' },
        { label: 'API Access', path: '/api' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Contact', path: '/contact' },
        { label: 'Careers', path: '/careers' },
        { label: 'Press Kit', path: '/press' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '/help' },
        { label: 'Community', path: '/community' },
        { label: 'Status', path: '/status' },
        { label: 'Bug Reports', path: '/bugs' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Cookie Policy', path: '/cookies' },
        { label: 'GDPR', path: '/gdpr' }
      ]
    }
  ]

  const socialLinks = [
    { icon: Twitter, url: 'https://twitter.com/vintagevision', label: 'Twitter' },
    { icon: Instagram, url: 'https://instagram.com/vintagevision', label: 'Instagram' },
    { icon: Linkedin, url: 'https://linkedin.com/company/vintagevision', label: 'LinkedIn' },
    { icon: Github, url: 'https://github.com/vintagevision', label: 'GitHub' }
  ]

  const handleLinkClick = (path: string, label: string) => {
    trackEvent('footer_link_click', { link: label, path })
    if (path.startsWith('http')) {
      window.open(path, '_blank')
    } else if (path.startsWith('/#')) {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(path.substring(2))
        element?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      navigate(path)
    }
  }

  return (
    <footer className="relative mt-20">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent opacity-5" />
      
      <div className="relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-12" gradient="default" blur="xl">
            {/* Main Footer Content */}
            <div className="grid lg:grid-cols-6 gap-12 mb-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">VintageVision</h3>
                    <p className="text-sm text-gray-600">AI Antique Expert</p>
                  </div>
                </motion.div>
                
                <motion.p
                  className="text-gray-600 mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  Turn your phone into an antique expert. Instantly identify vintage treasures with AI-powered analysis, get styling suggestions, and discover the stories behind your finds.
                </motion.p>

                {/* Contact Info */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:hello@vintagevision.ai" className="hover:text-amber-600 transition-colors">
                      hello@vintagevision.ai
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>San Francisco, CA</span>
                  </div>
                </motion.div>
              </div>

              {/* Links Sections */}
              {footerSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  className="lg:col-span-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-bold text-gray-900 mb-4">{section.title}</h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <button
                          onClick={() => handleLinkClick(link.path, link.label)}
                          className="text-gray-600 hover:text-amber-600 transition-colors text-sm"
                        >
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              className="border-t border-gray-200/50 pt-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Follow Us</h4>
                  <div className="flex gap-4">
                    {socialLinks.map((social) => (
                      <motion.button
                        key={social.label}
                        onClick={() => handleLinkClick(social.url, social.label)}
                        className="w-10 h-10 bg-gray-100 hover:bg-amber-100 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <social.icon className="w-5 h-5 text-gray-600 hover:text-amber-600" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <h4 className="font-bold text-gray-900 mb-3">Newsletter</h4>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                    <motion.button
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Subscribe
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Bar */}
            <motion.div
              className="border-t border-gray-200/50 pt-8 flex items-center justify-between flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>© 2025 VintageVision. Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>in San Francisco</span>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <button
                  onClick={() => handleLinkClick('/privacy', 'Privacy Policy')}
                  className="text-gray-600 hover:text-amber-600 transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Privacy
                </button>
                <button
                  onClick={() => handleLinkClick('/terms', 'Terms')}
                  className="text-gray-600 hover:text-amber-600 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Terms
                </button>
                <button
                  onClick={() => handleLinkClick('/cookies', 'Cookies')}
                  className="text-gray-600 hover:text-amber-600 transition-colors flex items-center gap-2"
                >
                  <Cookie className="w-4 h-4" />
                  Cookies
                </button>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </div>
    </footer>
  )
}
