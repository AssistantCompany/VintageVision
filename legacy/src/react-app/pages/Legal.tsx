import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText, Cookie } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import GlassCard from '@/react-app/components/ui/GlassCard';
import MagneticButton from '@/react-app/components/ui/MagneticButton';
import AnimatedBackground from '@/react-app/components/ui/AnimatedBackground';

export default function LegalPage() {
  const navigate = useNavigate();
  const { type } = useParams();
  const location = useLocation();
  
  // Determine the page type from either URL params or pathname
  const pageType = type || location.pathname.replace('/', '');
  
  const getContent = () => {
    switch (pageType) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: Shield,
          lastUpdated: 'October 14, 2025',
          content: (
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us.</p>
                  
                  <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Email address and authentication data via Google OAuth</li>
                    <li>Profile information (name, profile picture)</li>
                    <li>User preferences and settings</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium text-gray-900">Usage Information</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Images you upload for analysis</li>
                    <li>Analysis results and feedback</li>
                    <li>Collection and wishlist data</li>
                    <li>Device information and usage analytics</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide and improve our AI identification services</li>
                  <li>Maintain your personal collection and preferences</li>
                  <li>Send you relevant updates and recommendations</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Analyze usage patterns to enhance our services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
                <p className="text-gray-700">
                  We implement industry-standard security measures to protect your data, including encryption, 
                  secure servers, and regular security audits. Your uploaded images are processed securely and 
                  stored with enterprise-grade protection.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Access and download your data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Control data sharing preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700">
                  If you have questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@vintagevision.ai" className="text-amber-600 hover:text-amber-700">
                    privacy@vintagevision.ai
                  </a>
                </p>
              </section>
            </div>
          )
        };
        
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: FileText,
          lastUpdated: 'October 14, 2025',
          content: (
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
                <p className="text-gray-700">
                  By accessing and using VintageVision, you accept and agree to be bound by the terms 
                  and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
                <p className="text-gray-700">
                  VintageVision provides AI-powered identification and analysis of vintage and antique items. 
                  Our service includes image analysis, historical context, value estimation, and styling suggestions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide accurate information when using our services</li>
                  <li>Use the service only for lawful purposes</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not attempt to reverse engineer our AI systems</li>
                  <li>Not upload inappropriate or harmful content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accuracy Disclaimer</h2>
                <p className="text-gray-700">
                  While our AI provides highly accurate identifications, all analysis results are estimates 
                  and should not be considered definitive appraisals. We recommend consulting with professional 
                  appraisers for formal valuations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
                <p className="text-gray-700">
                  The VintageVision service, including AI models, algorithms, and interface design, is 
                  proprietary and protected by intellectual property laws. Users retain rights to their 
                  uploaded content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
                <p className="text-gray-700">
                  VintageVision shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages resulting from your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <p className="text-gray-700">
                  For questions about these Terms of Service, contact us at{' '}
                  <a href="mailto:legal@vintagevision.ai" className="text-amber-600 hover:text-amber-700">
                    legal@vintagevision.ai
                  </a>
                </p>
              </section>
            </div>
          )
        };
        
      case 'cookies':
        return {
          title: 'Cookie Policy',
          icon: Cookie,
          lastUpdated: 'October 14, 2025',
          content: (
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies</h2>
                <p className="text-gray-700">
                  Cookies are small text files stored on your device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences 
                  and improving our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">Essential Cookies</h3>
                <p className="text-gray-700 mb-4">
                  Required for basic website functionality, including user authentication and security.
                </p>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Cookies</h3>
                <p className="text-gray-700 mb-4">
                  Help us understand how users interact with our website to improve performance and user experience.
                </p>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">Preference Cookies</h3>
                <p className="text-gray-700 mb-4">
                  Remember your settings and preferences to provide a personalized experience.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
                <p className="text-gray-700">
                  You can control and manage cookies through your browser settings. However, 
                  disabling certain cookies may affect the functionality of our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
                <p className="text-gray-700">
                  We may use third-party services like Google Analytics and Stripe for payment processing. 
                  These services may set their own cookies according to their privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
                <p className="text-gray-700">
                  We may update this Cookie Policy from time to time. We will notify you of any 
                  changes by posting the new policy on this page.
                </p>
              </section>
            </div>
          )
        };
        
      default:
        return {
          title: 'Legal Documents',
          icon: FileText,
          lastUpdated: '',
          content: (
            <div className="text-center py-12">
              <p className="text-gray-600">Page not found</p>
            </div>
          )
        };
    }
  };

  const { title, icon: Icon, lastUpdated, content } = getContent();

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

      {/* Content */}
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
                  {lastUpdated && (
                    <p className="text-gray-600">Last updated: {lastUpdated}</p>
                  )}
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                {content}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
