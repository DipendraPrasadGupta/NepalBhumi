import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Shield, Home, Users, Facebook } from 'lucide-react';

import adminImage from '../assets/images/Dipendra.png';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-primary">NepalBhumi</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Nepal's most trusted and innovative real estate platform, designed to make finding your dream property seamless, secure, and smart.
          </p>
        </div>

        {/* Mission & Vision grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
              <Home size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">
              To simplify the real estate journey in Nepal by providing a transparent, user-friendly platform where buyers, sellers, and renters can connect with absolute confidence.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
              <Shield size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Promise</h3>
            <p className="text-slate-600 leading-relaxed">
              We ensure every listing is verified and every transaction is secure. Trust and transparency are the foundations of everything we build.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Community First</h3>
            <p className="text-slate-600 leading-relaxed">
              Real estate is about people, not just properties. We strive to build a community-driven ecosystem that benefits all Nepalese citizens.
            </p>
          </div>
        </div>

        {/* Admin/Developer Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Image Side */}
            <div className="relative h-64 md:h-auto overflow-hidden bg-slate-900">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-primary/20 z-10 mix-blend-overlay"></div>
              <img
                src={adminImage}
                alt="Dipendra Prasad Gupta"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 z-20">
                <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                  Founder & Lead Developer
                </div>
                <h2 className="text-3xl font-bold text-white">Dipendra Prasad Gupta</h2>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Meet the Visionary</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                As the sole developer and administrator of NepalBhumi, this platform has been designed and built from the ground up with a clear purpose to address the real estate challenges faced by modern Nepalese citizens. The vision behind NepalBhumi is to seamlessly bridge the gap between technology and real estate, creating a reliable and user-friendly digital ecosystem.
                By leveraging modern web technologies and a user-centric approach, NepalBhumi aims to simplify the process of buying, selling, and renting properties. The goal is to transform property discovery into an intuitive experience  making it as effortless and accessible as browsing the web. </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-slate-700">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-4 text-primary">
                    <Mail size={18} />
                  </div>
                  <span className="font-medium">admin@nepalbhumi.com</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-4 text-primary">
                    <Phone size={18} />
                  </div>
                  <span className="font-medium">+977 9807544395</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-4 text-primary">
                    <MapPin size={18} />
                  </div>
                  <span className="font-medium">Lumbini, Nepal</span>
                </div>
              </div>

              <div className="flex gap-4">
                <a href="https://www.facebook.com/dipendraprasadgupta177" className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-primary transition-colors shadow-lg hover:shadow-primary/30">
                  <Facebook size={20} />
                </a>
                <a href="https://www.linkedin.com/in/technicaldipendra/" className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-600/30">
                  <Linkedin size={20} />
                </a>
                <a href="https://dipendraprasadgupta.vercel.app/" className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-500/30">
                  <Globe size={20} />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
