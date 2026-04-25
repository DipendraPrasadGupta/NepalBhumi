import React, { useEffect } from 'react';
import { FileText, AlertCircle, CheckCircle, DollarSign, Gavel } from 'lucide-react';

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-b border-slate-700 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-slate-300">Last updated: December 19, 2024</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
          <p className="text-slate-300">
            These Terms and Conditions ("Terms") govern your access to and use of the Nepal Bhumi website and services. By accessing and using Nepal Bhumi, you accept and agree to be bound by and comply with these Terms. If you do not agree, please do not use our services.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {/* 1. User Accounts */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <FileText className="text-blue-500 flex-shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-2xl font-bold text-white">1. User Accounts</h3>
              </div>
            </div>
            <div className="text-slate-300 space-y-4 ml-12">
              <div>
                <h4 className="font-semibold text-white mb-2">Account Registration:</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>You must be at least 18 years old to create an account</li>
                  <li>Provide accurate and complete information</li>
                  <li>You are responsible for maintaining account confidentiality</li>
                  <li>Notify us immediately of unauthorized access</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Account Termination:</h4>
                <p>We reserve the right to terminate accounts that violate these Terms or engage in fraudulent activity.</p>
              </div>
            </div>
          </section>

          {/* 2. Property Listings */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-2xl font-bold text-white">2. Property Listings</h3>
              </div>
            </div>
            <div className="text-slate-300 space-y-4 ml-12">
              <h4 className="font-semibold text-white">Listing Requirements:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>All property information must be accurate and truthful</li>
                <li>Photos must be of the actual property</li>
                <li>Do not list properties you don't have authority to list</li>
                <li>Prices must be clearly stated</li>
              </ul>
              <div className="mt-4">
                <h4 className="font-semibold text-white mb-2">Prohibited Content:</h4>
                <p>Do not list properties with false information, misleading photos, or offensive content.</p>
              </div>
            </div>
          </section>

          {/* 3. Fees & Payments */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <DollarSign className="text-yellow-500 flex-shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-2xl font-bold text-white">3. Fees & Payments</h3>
              </div>
            </div>
            <div className="text-slate-300 space-y-4 ml-12">
              <div>
                <h4 className="font-semibold text-white mb-2">Listing Fees:</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>Basic listings are FREE</li>
                  <li>Premium featured listings: Rs. 500-2000 for 30 days</li>
                  <li>Fees are non-refundable after 7 days</li>
                  <li>We accept credit cards, debit cards, and digital payments</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Payment Terms:</h4>
                <p>All prices are in Nepali Rupees (Rs) unless otherwise stated. Payment must be made in full before services are activated.</p>
              </div>
            </div>
          </section>

          {/* 4. User Conduct */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-2xl font-bold text-white">4. User Conduct</h3>
              </div>
            </div>
            <div className="text-slate-300 space-y-4 ml-12">
              <p className="font-semibold text-white">You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Post illegal, fraudulent, or misleading content</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Attempt to hack or gain unauthorized access</li>
                <li>Post spam or irrelevant content</li>
                <li>Violate intellectual property rights</li>
                <li>Use the platform for money laundering or illegal activities</li>
              </ul>
            </div>
          </section>

          {/* 5. Disclaimer */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="text-orange-500 flex-shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-2xl font-bold text-white">5. Disclaimer of Warranties</h3>
              </div>
            </div>
            <div className="text-slate-300 space-y-4 ml-12">
              <p>Nepal Bhumi is provided "AS IS" and "AS AVAILABLE" without warranties of any kind:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>We are not responsible for data loss or security breaches</li>
                <li>Listing accuracy and property details are user-provided</li>
                <li>We don't verify ownership or legal status of properties</li>
              </ul>
              <p className="mt-4 font-semibold text-white">Users are responsible for verifying property information independently.</p>
            </div>
          </section>

          {/* 6. Limitation of Liability */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Gavel className="text-purple-500 flex-shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-2xl font-bold text-white">6. Limitation of Liability</h3>
              </div>
            </div>
            <div className="text-slate-300 space-y-4 ml-12">
              <p>To the maximum extent permitted by law, Nepal Bhumi shall not be liable for:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits or business opportunities</li>
                <li>Fraudulent transactions between users</li>
                <li>Third-party claims or disputes</li>
              </ul>
              <p className="mt-4">Our total liability is limited to the fees you paid in the last 30 days.</p>
            </div>
          </section>

          {/* 7. Intellectual Property */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">7. Intellectual Property Rights</h3>
            <div className="text-slate-300 space-y-4">
              <p>All content on Nepal Bhumi (logos, designs, text, code) is owned by Nepal Bhumi or licensed partners. You may not reproduce, modify, or distribute without permission.</p>
              <p>User-posted content: You retain rights to your posted content. By posting, you grant us a license to display and distribute your content.</p>
            </div>
          </section>

          {/* 8. Dispute Resolution */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">8. Dispute Resolution</h3>
            <div className="text-slate-300 space-y-4">
              <p><span className="font-semibold text-white">Between Users:</span> Nepal Bhumi facilitates transactions but is not responsible for disputes between buyers and sellers. We recommend using escrow services and meeting in person.</p>
              <p><span className="font-semibold text-white">With Nepal Bhumi:</span> Disputes shall be governed by Nepal law. Arbitration will be pursued before legal action.</p>
            </div>
          </section>

          {/* 9. Modifications */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">9. Modifications to Terms</h3>
            <p className="text-slate-300">
              Nepal Bhumi reserves the right to modify these Terms at any time. Changes will be effective upon posting. Your continued use signifies acceptance of modified Terms.
            </p>
          </section>

          {/* 10. Governing Law */}
          <section className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">10. Governing Law & Contact</h3>
            <div className="space-y-4 text-slate-300">
              <p><span className="font-semibold text-white">Jurisdiction:</span> These Terms are governed by the laws of Nepal.</p>
              <p><span className="font-semibold text-white">Questions?</span> Contact us at support@nepalbhumi.com or +977 9807544395</p>
            </div>
          </section>
        </div>

        {/* Acceptance */}
        <div className="mt-16 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-8">
          <p className="text-slate-300">
            By using Nepal Bhumi, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
