import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail } from 'lucide-react';

const HelpCenter = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [expandedFAQ, setExpandedFAQ] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How do I list my property on Nepal Bhumi?',
      answer: 'To list your property, create an account, click "Post Property", fill in the details, add photos, and submit. Our team will review and approve it within 24 hours.'
    },
    {
      question: 'What documents are required to sell/rent a property?',
      answer: 'You\'ll need property documents (deed, land registration), ID proof, and recent property photos. For rentals, an agreement template is provided.'
    },
    {
      question: 'How safe are transactions on Nepal Bhumi?',
      answer: 'Nepal Bhumi uses encrypted connections, verified seller/buyer profiles, and secure payment gateways. We recommend meeting in person and using our escrow service for large transactions.'
    },
    {
      question: 'What are the listing fees?',
      answer: 'Basic property listing is free. Premium featured listings cost Rs. 500-2000 for 30 days. Commercial properties have different pricing tiers.'
    },
    {
      question: 'How long does property approval take?',
      answer: 'Most properties are approved within 24 hours. Complex listings may take up to 48 hours. You\'ll receive email notification once approved.'
    },
    {
      question: 'Can I edit my property listing?',
      answer: 'Yes, you can edit details, photos, and pricing anytime. For active listings, major changes require re-approval.'
    },
    {
      question: 'How do I contact the property owner?',
      answer: 'Click "Contact Owner" on any property. You can message directly or call if the owner has shared their phone number.'
    },
    {
      question: 'What is the refund policy?',
      answer: 'Premium listing fees are non-refundable after 7 days. Property removal requests are processed within 2 business days.'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-b border-slate-700 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
          <p className="text-slate-300 text-lg mb-8">Get answers to common questions about Nepal Bhumi</p>
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={22} />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 bg-slate-700/40 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition">
            <MessageCircle size={32} className="mb-3" />
            <h3 className="font-bold text-lg mb-2">Chat Support</h3>
            <p className="text-blue-100 text-sm">Available 9 AM - 9 PM</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition">
            <Phone size={32} className="mb-3" />
            <h3 className="font-bold text-lg mb-2">Call Us</h3>
            <p className="text-green-100 text-sm">+977 9807544395</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition">
            <Mail size={32} className="mb-3" />
            <h3 className="font-bold text-lg mb-2">Email Support</h3>
            <p className="text-purple-100 text-sm">support@nepalbhumi.com</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? -1 : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition"
                >
                  <span className="text-left text-white font-semibold">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="text-blue-500 flex-shrink-0" size={22} />
                  ) : (
                    <ChevronDown className="text-slate-400 flex-shrink-0" size={22} />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/30">
                    <p className="text-slate-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No FAQs match your search. Please contact our support team.</p>
            </div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-4">Didn't find what you're looking for?</h3>
          <p className="text-slate-300 mb-6">Our support team is here to help you.</p>
          <div className="flex gap-4 flex-wrap">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              Start Live Chat
            </button>
            <button className="px-6 py-3 border border-blue-500 text-blue-400 rounded-lg font-semibold hover:bg-blue-500/10 transition">
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
