import React from 'react';
import { Facebook, Globe, Linkedin, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white mt-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-dark group-hover:shadow-2xl group-hover:scale-110 transition-all">
                <span className="text-white font-bold text-2xl">NB</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Nepal</h3>
                <p className="text-sm font-semibold text-gray-300">Bhumi</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nepal's most trusted real estate platform. Connecting buyers, sellers, and renters with confidence.
            </p>
            <div className="flex space-x-3 pt-4">
              <a href="https://www.facebook.com/dipendraprasadgupta177" className="p-3 rounded-lg bg-gray-800/50 hover:bg-primary transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/30">
                <Facebook size={20} />
              </a>
              <a href="https://dipendraprasadgupta.vercel.app/" className="p-3 rounded-lg bg-gray-800/50 hover:bg-primary transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/30">
                <Globe size={20} />
              </a>
              <a href="https://www.linkedin.com/in/technicaldipendra/" className="p-3 rounded-lg bg-gray-800/50 hover:bg-primary transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/30">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-8 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-primary to-blue-400 rounded"></span>
              Explore
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <Link to="/" className="flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all">
                  <ChevronRight size={18} className="flex-shrink-0" />
                  <span className="font-medium">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all">
                  <ChevronRight size={18} className="flex-shrink-0" />
                  <span className="font-medium">About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/map" className="flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all">
                  <ChevronRight size={18} className="flex-shrink-0" />
                  <span className="font-medium">Browse on Map</span>
                </Link>
              </li>

              <li>
                <Link to="/explore" className="flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all">
                  <ChevronRight size={18} className="flex-shrink-0" />
                  <span className="font-medium">Rooms & Flats</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-8 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-primary to-blue-400 rounded"></span>
              Support
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <Link to="/help-center" className="flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all">
                  <ChevronRight size={18} className="flex-shrink-0" />
                  <span className="font-medium">Help Center</span>
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all">
                  <ChevronRight size={18} className="flex-shrink-0" />
                  <span className="font-medium">Contact Us</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all">
                  <ChevronRight size={18} className="flex-shrink-0" />
                  <span className="font-medium">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all">
                  <ChevronRight size={18} className="flex-shrink-0" />
                  <span className="font-medium">Terms & Conditions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-8 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-primary to-blue-400 rounded"></span>
              Get in Touch
            </h4>
            <div className="space-y-5">
              <div className="flex gap-4 group">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-blue-600/20 group-hover:from-primary/40 group-hover:to-blue-600/40 flex-shrink-0 transition-all">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Phone</p>
                  <p className="text-white font-bold text-lg mt-1">+977 9807544395</p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-blue-600/20 group-hover:from-primary/40 group-hover:to-blue-600/40 flex-shrink-0 transition-all">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Email</p>
                  <p className="text-white font-bold text-lg mt-1">info@nepalbhumi.com</p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-blue-600/20 group-hover:from-primary/40 group-hover:to-blue-600/40 flex-shrink-0 transition-all">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Address</p>
                  <p className="text-white font-bold text-lg mt-1">Lumbini, Nepal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 mt-16 pt-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p className="font-medium">© {currentYear} <span className="text-primary font-bold">NepalBhumi</span> - All rights reserved. || Developed By Dipendra Prasad Gupta</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="/privacy-policy" className="hover:text-primary transition-colors font-medium">Privacy</a>
            <a href="/terms-conditions" className="hover:text-primary transition-colors font-medium">Terms</a>
            <a href="#" className="hover:text-primary transition-colors font-medium">About</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
