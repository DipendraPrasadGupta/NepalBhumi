import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-b border-slate-700 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-slate-300 text-lg">Get in touch with our team. We're here to help!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition">
            <Phone size={40} className="mb-4" />
            <h3 className="text-xl font-bold mb-2">Phone</h3>
            <p className="text-blue-100 mb-4">Call us during business hours</p>
            <p className="text-2xl font-bold">+977 9807544395</p>
            <p className="text-sm text-blue-100 mt-4">9 AM - 9 PM (Mon-Sat)</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition">
            <Mail size={40} className="mb-4" />
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-green-100 mb-4">Send us a message</p>
            <p className="text-lg font-bold">support@nepalbhumi.com</p>
            <p className="text-sm text-green-100 mt-4">Response within 24 hours</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition">
            <MapPin size={40} className="mb-4" />
            <h3 className="text-xl font-bold mb-2">Office</h3>
            <p className="text-purple-100 mb-4">Visit us in person</p>
            <p className="font-bold">Nepal Bhumi Office</p>
            <p className="text-sm text-purple-100 mt-4">Lumbini, Nepal</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>
            {submitted ? (
              <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-8 flex flex-col items-center justify-center h-96">
                <CheckCircle size={48} className="text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-300 text-center">Thank you for reaching out. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                    placeholder="+977 98XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400 resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/40 transition flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Response Details */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Support Information</h2>
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition">
                <h3 className="text-lg font-bold text-white mb-2">🚀 Quick Response</h3>
                <p className="text-slate-300">We aim to respond to all inquiries within 24 hours during business days.</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition">
                <h3 className="text-lg font-bold text-white mb-2">📞 Phone Support</h3>
                <p className="text-slate-300">For urgent matters, call us directly. Phone support is available 9 AM to 9 PM.</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition">
                <h3 className="text-lg font-bold text-white mb-2">💬 Live Chat</h3>
                <p className="text-slate-300">Use our live chat feature for instant assistance with common questions.</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition">
                <h3 className="text-lg font-bold text-white mb-2">📧 Email Support</h3>
                <p className="text-slate-300">Email us for detailed issues that require documentation and follow-up.</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
                <p className="text-slate-300"><span className="text-white font-semibold">Business Hours:</span> Monday - Saturday, 9 AM - 9 PM NST</p>
                <p className="text-slate-300 mt-2"><span className="text-white font-semibold">Emergency:</span> For urgent issues outside business hours, please call our emergency line.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
