import React, { useEffect } from 'react';
import { Shield, Eye, Lock, Share2, Trash2 } from 'lucide-react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-b border-slate-700 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-300">Last updated: December 19, 2024</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Your Privacy Matters to Us</h2>
          <p className="text-slate-300">
            Nepal Bhumi ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {/* 1. Information We Collect */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Eye className="text-blue-500 flex-shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-2xl font-bold text-white">1. Information We Collect</h3>
              </div>
            </div>
            <div className="text-slate-300 space-y-4 ml-12">
              <div>
                <h4 className="font-semibold text-white mb-2">Information You Provide:</h4>
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                  <li>Name, email address, and phone number</li>
                  <li>Account credentials and profile information</li>
                  <li>Property details and images you upload</li>
                  <li>Payment information for transactions</li>
                  <li>Messages and communications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Information We Collect Automatically:</h4>
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                  <li>Browser type and IP address</li>
                  <li>Pages visited and time spent</li>
                  <li>Device information and cookies</li>
                  <li>Location data (with permission)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Share2 className="text-green-500 flex-shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-2xl font-bold text-white">2. How We Use Your Information</h3>
              </div>
            </div>
            <div className="text-slate-300 space-y-3 ml-12">
              <p>✓ To create and manage your account</p>
              <p>✓ To process property listings and transactions</p>
              <p>✓ To communicate with you about your account</p>
              <p>✓ To provide customer support</p>
              <p>✓ To improve our services and user experience</p>
              <p>✓ To send promotional updates (with your consent)</p>
              <p>✓ To comply with legal obligations</p>
            </div>
          </section>

          {/* 3. Information Sharing */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Share2 className="text-purple-500 flex-shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-2xl font-bold text-white">3. Information Sharing & Disclosure</h3>
              </div>
            </div>
            <div className="text-slate-300 space-y-4 ml-12">
              <p>We may share your information in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>With property owners/renters for transaction purposes</li>
                <li>With trusted service providers (payment processors, hosting)</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With your explicit consent</li>
              </ul>
              <p className="mt-4 font-semibold text-white">We do NOT sell your personal information to third parties.</p>
            </div>
          </section>

          {/* 4. Data Security */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Lock className="text-yellow-500 flex-shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-2xl font-bold text-white">4. Data Security</h3>
              </div>
            </div>
            <div className="text-slate-300 space-y-4 ml-12">
              <p>We implement appropriate technical and organizational measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>SSL encryption for data transmission</li>
                <li>Secure password policies</li>
                <li>Regular security audits</li>
                <li>Restricted access to personal data</li>
                <li>Multi-factor authentication options</li>
              </ul>
              <p className="mt-4 text-sm italic">However, no method of transmission over the Internet is 100% secure.</p>
            </div>
          </section>

          {/* 5. Your Rights */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Shield className="text-red-500 flex-shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-2xl font-bold text-white">5. Your Privacy Rights</h3>
              </div>
            </div>
            <div className="text-slate-300 space-y-4 ml-12">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
              <p className="mt-4">To exercise these rights, contact us at privacy@nepalbhumi.com</p>
            </div>
          </section>

          {/* 6. Cookies & Tracking */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Trash2 className="text-cyan-500 flex-shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-2xl font-bold text-white">6. Cookies & Tracking Technologies</h3>
              </div>
            </div>
            <div className="text-slate-300 space-y-4 ml-12">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Remember your preferences</li>
                <li>Track website analytics</li>
                <li>Personalize your experience</li>
                <li>Improve our services</li>
              </ul>
              <p className="mt-4">You can control cookies through your browser settings.</p>
            </div>
          </section>

          {/* 7. Third-Party Links */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">7. Third-Party Links</h3>
            <p className="text-slate-300">
              Our website may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies before sharing information.
            </p>
          </section>

          {/* 8. Children's Privacy */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h3>
            <p className="text-slate-300">
              Nepal Bhumi is not intended for children under 13 years of age. We do not knowingly collect information from children under 13. If we become aware of such collection, we will delete the information immediately.
            </p>
          </section>

          {/* 9. Changes to Policy */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">9. Changes to This Privacy Policy</h3>
            <p className="text-slate-300">
              We may update this Privacy Policy periodically. We will notify you of significant changes via email or prominent notification on our website. Your continued use constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 10. Contact Us */}
          <section className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">10. Contact Us</h3>
            <p className="text-slate-300 mb-4">If you have questions about this Privacy Policy, please contact us:</p>
            <div className="space-y-2 text-slate-300">
              <p><span className="font-semibold text-white">Email:</span> privacy@nepalbhumi.com</p>
              <p><span className="font-semibold text-white">Phone:</span> +977 9807544395</p>
              <p><span className="font-semibold text-white">Address:</span> Lumbini, Nepal</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
