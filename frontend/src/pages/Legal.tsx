import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText, Cookie } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';
import MagneticButton from '@/components/ui/MagneticButton';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

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
          lastUpdated: 'November 16, 2025',
          content: (
            <div className="space-y-8">
              <section>
                <p className="text-gray-700 mb-4">
                  This Privacy Policy describes how VintageVision ("we," "us," or "our") collects, uses, and shares your personal information
                  when you use our website and services (collectively, the "Service"). By using the Service, you agree to the collection and
                  use of information in accordance with this policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <div className="space-y-4 text-gray-700">

                  <h3 className="text-lg font-medium text-gray-900 mt-4">1.1 Information You Provide</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Account Information:</strong> When you create an account through Google OAuth, we collect your email address, name, and profile picture from your Google account.</li>
                    <li><strong>Uploaded Content:</strong> Images of vintage and antique items you upload for analysis.</li>
                    <li><strong>User-Generated Content:</strong> Notes, descriptions, and other information you add to your collection or wishlist.</li>
                    <li><strong>Communications:</strong> Information you provide when you contact our support team or provide feedback.</li>
                  </ul>

                  <h3 className="text-lg font-medium text-gray-900 mt-4">1.2 Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Usage Data:</strong> Information about how you interact with the Service, including pages visited, features used, and time spent.</li>
                    <li><strong>Device Information:</strong> Device type, operating system, browser type, IP address, and unique device identifiers.</li>
                    <li><strong>Cookies and Similar Technologies:</strong> We use cookies, web beacons, and similar tracking technologies to track activity and store certain information. See our Cookie Policy for details.</li>
                    <li><strong>Log Data:</strong> Server logs that include IP address, browser type, pages visited, time and date of visit, and time spent on pages.</li>
                  </ul>

                  <h3 className="text-lg font-medium text-gray-900 mt-4">1.3 Information from Third Parties</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Google OAuth:</strong> Authentication and profile information from Google when you sign in.</li>
                    <li><strong>Analytics Services:</strong> Aggregated usage statistics from analytics providers.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use the information we collect for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>Service Delivery:</strong> To provide, maintain, and improve the Service, including AI-powered image analysis and identification.</li>
                  <li><strong>Personalization:</strong> To personalize your experience and maintain your collection and preferences.</li>
                  <li><strong>Communication:</strong> To send you technical notices, updates, security alerts, and support messages.</li>
                  <li><strong>Analytics:</strong> To understand usage patterns and improve Service functionality and user experience.</li>
                  <li><strong>Security:</strong> To detect, prevent, and address technical issues, fraud, and security violations.</li>
                  <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
                  <li><strong>AI Training:</strong> With your consent, to improve our AI models and analysis accuracy. You may opt out at any time.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Share Your Information</h2>
                <p className="text-gray-700 mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., hosting, analytics, payment processing) under strict confidentiality obligations.</li>
                  <li><strong>AI Service Providers:</strong> Your uploaded images are processed by OpenAI's GPT-4 Vision API for analysis. OpenAI's use of your data is governed by their privacy policy.</li>
                  <li><strong>Legal Requirements:</strong> When required by law, subpoena, or other legal process, or when necessary to protect our rights or the safety of others.</li>
                  <li><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of company assets, subject to the same privacy protections.</li>
                  <li><strong>With Your Consent:</strong> When you explicitly consent to sharing your information.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Retention</h2>
                <p className="text-gray-700">
                  We retain your personal information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy.
                  When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law or
                  for legitimate business purposes (e.g., fraud prevention, resolving disputes).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Encryption of data in transit using TLS/SSL</li>
                  <li>Encryption of data at rest</li>
                  <li>Secure authentication via Google OAuth 2.0</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and authentication for our systems</li>
                  <li>Secure cloud infrastructure with enterprise-grade protection</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information,
                  we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Privacy Rights</h2>
                <p className="text-gray-700 mb-4">Depending on your location, you may have certain rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>Access:</strong> Request access to the personal information we hold about you.</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information (right to be forgotten).</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a structured, machine-readable format.</li>
                  <li><strong>Objection:</strong> Object to certain processing of your personal information.</li>
                  <li><strong>Restriction:</strong> Request restriction of processing under certain circumstances.</li>
                  <li><strong>Withdrawal of Consent:</strong> Withdraw consent for processing that requires consent.</li>
                  <li><strong>Opt-Out:</strong> Opt out of marketing communications at any time.</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  To exercise these rights, please contact us at privacy@vintagevision.space. We will respond to your request within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. International Data Transfers</h2>
                <p className="text-gray-700">
                  Your information may be transferred to and processed in countries other than your country of residence. These countries may have
                  data protection laws that differ from your jurisdiction. We ensure appropriate safeguards are in place to protect your information
                  when transferred internationally, including standard contractual clauses and adequacy decisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
                <p className="text-gray-700">
                  The Service is not directed to individuals under the age of 13 (or 16 in the European Economic Area). We do not knowingly collect
                  personal information from children. If you are a parent or guardian and believe your child has provided us with personal information,
                  please contact us, and we will delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. California Privacy Rights (CCPA)</h2>
                <p className="text-gray-700 mb-4">
                  If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Right to know what personal information is collected, used, shared, or sold</li>
                  <li>Right to delete personal information</li>
                  <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
                  <li>Right to non-discrimination for exercising your privacy rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. European Privacy Rights (GDPR)</h2>
                <p className="text-gray-700 mb-4">
                  If you are located in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR),
                  including the rights listed in Section 6 above. Our legal basis for processing your information includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>Consent:</strong> You have given consent for specific processing activities</li>
                  <li><strong>Contract:</strong> Processing is necessary to perform our contract with you</li>
                  <li><strong>Legal Obligation:</strong> Processing is required by law</li>
                  <li><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate business interests</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy
                  on this page and updating the "Last Updated" date. Your continued use of the Service after changes become effective constitutes
                  acceptance of the revised policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="text-gray-700 ml-4">
                  <p><strong>Email:</strong> <a href="mailto:privacy@vintagevision.space" className="text-amber-600 hover:text-amber-700">privacy@vintagevision.space</a></p>
                  <p><strong>Address:</strong> VintageVision, 123 Antique Lane, San Francisco, CA 94102, United States</p>
                </div>
              </section>
            </div>
          )
        };
        
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: FileText,
          lastUpdated: 'November 16, 2025',
          content: (
            <div className="space-y-8">
              <section>
                <p className="text-gray-700 mb-4">
                  These Terms of Service ("Terms") govern your access to and use of VintageVision's website, services, and applications
                  (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not
                  agree to these Terms, do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By creating an account, accessing, or using VintageVision, you acknowledge that you have read, understood, and agree to be bound by these Terms
                  and our Privacy Policy. These Terms constitute a legally binding agreement between you and VintageVision ("we," "us," or "our").
                </p>
                <p className="text-gray-700">
                  You must be at least 13 years old (or 16 in the European Economic Area) to use the Service. By using the Service, you represent
                  and warrant that you meet this age requirement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                <p className="text-gray-700 mb-4">
                  VintageVision provides an AI-powered platform for identifying, analyzing, and cataloging vintage and antique items. The Service includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>AI-powered image analysis and item identification using GPT-4 Vision technology</li>
                  <li>Historical context, era identification, and style period information</li>
                  <li>Estimated value ranges based on market data and comparable items</li>
                  <li>Styling suggestions and interior design recommendations</li>
                  <li>Personal collection management and wishlist features</li>
                  <li>Marketplace integration and price comparison tools</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">3.1 Account Creation</h3>
                <p className="text-gray-700 mb-4">
                  To access certain features, you must create an account using Google OAuth authentication. You agree to provide accurate,
                  current, and complete information during registration and to update such information to keep it accurate and current.
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">3.2 Account Security</h3>
                <p className="text-gray-700 mb-4">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under
                  your account. You must immediately notify us of any unauthorized use of your account or any other security breach.
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">3.3 Account Termination</h3>
                <p className="text-gray-700">
                  We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity,
                  or any other reason at our sole discretion. You may delete your account at any time through your account settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
                <p className="text-gray-700 mb-4">You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Violate any applicable laws, regulations, or third-party rights</li>
                  <li>Upload content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                  <li>Infringe upon any intellectual property rights, including copyrights, trademarks, or patents</li>
                  <li>Attempt to reverse engineer, decompile, or disassemble any part of the Service or AI models</li>
                  <li>Use automated systems (bots, scrapers) to access the Service without authorization</li>
                  <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                  <li>Attempt to gain unauthorized access to any portion of the Service or other users' accounts</li>
                  <li>Use the Service for any commercial purpose without our express written permission</li>
                  <li>Transmit any viruses, malware, or other harmful code</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Content and Intellectual Property</h2>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">5.1 Your Content</h3>
                <p className="text-gray-700 mb-4">
                  You retain all rights to the images and content you upload to the Service ("User Content"). By uploading User Content,
                  you grant us a worldwide, non-exclusive, royalty-free license to use, store, process, and display your User Content solely
                  for the purpose of providing and improving the Service.
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">5.2 Our Intellectual Property</h3>
                <p className="text-gray-700 mb-4">
                  The Service, including all software, algorithms, AI models, text, graphics, logos, images, and other content (excluding
                  User Content), is owned by VintageVision and protected by copyright, trademark, patent, and other intellectual property laws.
                  You may not copy, modify, distribute, sell, or lease any part of the Service without our express written permission.
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">5.3 Analysis Results</h3>
                <p className="text-gray-700">
                  The AI-generated analysis results, including identifications, value estimates, and styling suggestions, are provided to you
                  for your personal use. You may not redistribute, sell, or commercially exploit these results without our permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Disclaimers and Limitations</h2>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">6.1 No Professional Appraisal</h3>
                <p className="text-gray-700 mb-4">
                  <strong>IMPORTANT:</strong> VintageVision provides AI-generated estimates and identifications for informational purposes only.
                  Our Service does NOT constitute professional appraisal services, and our value estimates should NOT be used as the sole basis
                  for purchase, sale, insurance, or investment decisions. For formal appraisals, consult a certified professional appraiser.
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">6.2 Accuracy Disclaimer</h3>
                <p className="text-gray-700 mb-4">
                  While we strive for accuracy, AI-generated analysis may contain errors or inaccuracies. We make no guarantees regarding the
                  accuracy, completeness, or reliability of any identifications, value estimates, or other information provided by the Service.
                  Market values fluctuate, and actual values may differ significantly from our estimates.
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">6.3 Service Availability</h3>
                <p className="text-gray-700">
                  We do not guarantee that the Service will be available at all times or that it will be uninterrupted or error-free. We may
                  suspend, modify, or discontinue the Service (or any part thereof) at any time without notice or liability.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, VINTAGEVISION AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES
                  SHALL NOT BE LIABLE FOR:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Loss of profits, revenue, data, or business opportunities</li>
                  <li>Costs of procurement of substitute goods or services</li>
                  <li>Any damages resulting from your use of or inability to use the Service</li>
                  <li>Any damages arising from errors, inaccuracies, or omissions in AI-generated analysis</li>
                  <li>Any financial losses resulting from reliance on value estimates or identifications</li>
                  <li>Unauthorized access to or alteration of your transmissions or data</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE EVENT
                  GIVING RISE TO LIABILITY, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Indemnification</h2>
                <p className="text-gray-700">
                  You agree to indemnify, defend, and hold harmless VintageVision and its officers, directors, employees, agents, and affiliates
                  from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising
                  out of or relating to: (a) your use of the Service; (b) your User Content; (c) your violation of these Terms; or (d) your
                  violation of any rights of another party.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Services and Links</h2>
                <p className="text-gray-700">
                  The Service may contain links to third-party websites, services, or marketplaces. We do not control, endorse, or assume
                  responsibility for any third-party content, products, or services. Your use of third-party services is at your own risk
                  and subject to their terms and privacy policies. We are not responsible for any transactions between you and third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Payments and Subscriptions</h2>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">10.1 Pricing</h3>
                <p className="text-gray-700 mb-4">
                  Certain features of the Service may require payment. All fees are in U.S. dollars and are non-refundable except as
                  required by law or as explicitly stated in our refund policy.
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">10.2 Subscriptions</h3>
                <p className="text-gray-700 mb-4">
                  Subscription fees are billed in advance on a recurring basis (monthly or annually). Subscriptions automatically renew
                  unless cancelled before the renewal date. You may cancel your subscription at any time through your account settings.
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">10.3 Price Changes</h3>
                <p className="text-gray-700">
                  We reserve the right to change our pricing at any time. Price changes for existing subscribers will be communicated
                  at least 30 days in advance and will take effect at the next billing cycle.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Dispute Resolution and Arbitration</h2>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">11.1 Informal Resolution</h3>
                <p className="text-gray-700 mb-4">
                  Before filing a claim, you agree to contact us at legal@vintagevision.space to attempt to resolve the dispute informally.
                  We will attempt to resolve the dispute within 60 days.
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">11.2 Binding Arbitration</h3>
                <p className="text-gray-700 mb-4">
                  If informal resolution fails, any dispute arising out of or relating to these Terms or the Service shall be resolved through
                  binding arbitration in accordance with the American Arbitration Association's Consumer Arbitration Rules. The arbitration
                  shall take place in San Francisco, California, or remotely via video conference.
                </p>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">11.3 Class Action Waiver</h3>
                <p className="text-gray-700">
                  YOU AGREE THAT DISPUTES WILL BE RESOLVED ON AN INDIVIDUAL BASIS ONLY, AND NOT AS A CLASS ACTION, CLASS ARBITRATION, OR
                  OTHER REPRESENTATIVE ACTION. You may opt out of this arbitration provision by contacting us within 30 days of first using
                  the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law and Jurisdiction</h2>
                <p className="text-gray-700">
                  These Terms shall be governed by and construed in accordance with the laws of the State of California, United States,
                  without regard to its conflict of law provisions. For disputes not subject to arbitration, you agree to submit to the
                  exclusive jurisdiction of the courts located in San Francisco County, California.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
                <p className="text-gray-700">
                  We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated
                  Terms on our website and updating the "Last Updated" date. Your continued use of the Service after changes become effective
                  constitutes acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Severability</h2>
                <p className="text-gray-700">
                  If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue
                  in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and
                  enforceable.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Entire Agreement</h2>
                <p className="text-gray-700">
                  These Terms, together with our Privacy Policy and any additional terms you agree to when using specific features, constitute
                  the entire agreement between you and VintageVision regarding the Service and supersede all prior agreements and understandings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  For questions, concerns, or notices regarding these Terms of Service, please contact us:
                </p>
                <div className="text-gray-700 ml-4">
                  <p><strong>Email:</strong> <a href="mailto:legal@vintagevision.space" className="text-amber-600 hover:text-amber-700">legal@vintagevision.space</a></p>
                  <p><strong>Address:</strong> VintageVision, 123 Antique Lane, San Francisco, CA 94102, United States</p>
                </div>
              </section>
            </div>
          )
        };
        
      case 'cookies':
        return {
          title: 'Cookie Policy',
          icon: Cookie,
          lastUpdated: 'November 16, 2025',
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
