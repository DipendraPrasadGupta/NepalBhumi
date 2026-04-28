import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store.js';
import { Search, MapPin, User, Star, ChevronLeft, ChevronRight, Loader, Globe, X, Briefcase, ChevronDown } from 'lucide-react';
import { userAPI } from '../api/endpoints.js';

import imgKathmandu from '../assets/images/kathmandu.webp';
import imgPokhara from '../assets/images/pokhara.jpeg';
import imgLalitpur from '../assets/images/Lalitpur.jpeg';
import imgBhaktapur from '../assets/images/Bhaktapur.jpg';
import imgChitwan from '../assets/images/chitwan.jpg';
import imgLumbini from '../assets/images/lumbini.webp';

function Agents() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Quick popular cities for the carousel
  // Quick popular cities with high-quality images
  const popularCities = [
    { name: 'Lumbini', image: imgLumbini },
    { name: 'Kathmandu', image: imgKathmandu },
    { name: 'Pokhara', image: imgPokhara },
    { name: 'Lalitpur', image: imgLalitpur },
    { name: 'Bhaktapur', image: imgBhaktapur },
    { name: 'Chitwan', image: imgChitwan },
    { name: 'Butwal', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400&auto=format&fit=crop' },
    { name: 'Biratnagar', image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=400&auto=format&fit=crop' },
    { name: 'Dhangadhi', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=400&auto=format&fit=crop' }
  ];

  useEffect(() => {
    fetchAgents();
  }, [selectedCity]);

  const fetchAgents = async (search = searchQuery) => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCity) params.city = selectedCity;
      if (search) params.search = search;

      const response = await userAPI.getAgents(params);
      setAgents(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch agents', error);
      // Fallback empty state
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAgents();
  };

  const handleClearCity = () => {
    setSelectedCity('');
  };

  // Scroll logic for city carousel
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-6">
            Find a Local Agent
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Connect with top-rated real estate professionals in your area who can help you find your dream property.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-3xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-32 py-4 bg-slate-800/80 border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-slate-800 transition-all shadow-xl"
              placeholder="Search by agent name, agency, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* City Carousel Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <MapPin className="text-blue-400" size={28} />
                Explore Popular Cities
              </h2>
              <p className="text-slate-400 mt-2">Discover verified agents in your favorite locations</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-3 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-white transition-all shadow-lg active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-3 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-white transition-all shadow-lg active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="relative group">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-5 pb-6 snap-x hide-scrollbar scroll-smooth"
            >
              {popularCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => setSelectedCity(city.name)}
                  className={`snap-start relative flex-none w-48 sm:w-56 h-72 rounded-3xl overflow-hidden group/city transition-all duration-500 ${selectedCity === city.name
                    ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-slate-900 scale-[1.02]'
                    : 'hover:scale-[1.02]'
                    }`}
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/city:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${selectedCity === city.name
                    ? 'from-blue-900/90 via-blue-900/40 to-transparent'
                    : 'from-slate-900/90 via-slate-900/20 to-transparent group-hover/city:from-blue-900/60'
                    }`} />

                  <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="text-xl font-bold text-white mb-1 drop-shadow-md">{city.name}</h4>
                    <div className="h-1 w-8 bg-blue-500 rounded-full transition-all duration-300 group-hover/city:w-16" />
                  </div>

                  {selectedCity === city.name && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white p-1.5 rounded-full shadow-lg animate-in zoom-in duration-300">
                      <Star size={14} className="fill-current" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {selectedCity && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleClearCity}
                className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-full hover:bg-slate-700 hover:text-white transition-all animate-in fade-in slide-in-from-top-2"
              >
                <X size={16} />
                Showing result for <span className="text-blue-400 font-bold">{selectedCity}</span> — Clear
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-200">
            {loading ? 'Finding top agents...' : `${agents.length} Agent${agents.length !== 1 ? 's' : ''} Found ${selectedCity ? `in ${selectedCity}` : ''}`}
          </h3>
        </div>

        {/* Agent Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl border border-slate-700 h-[380px] animate-pulse"></div>
            ))}
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-800 border-dashed">
            <User size={64} className="mx-auto text-slate-600 mb-6" />
            <h3 className="text-2xl font-semibold text-slate-300 mb-2">No agents found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find any agents matching your current search criteria. Try selecting a different city or clearing your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('');
                fetchAgents('');
              }}
              className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map((agent) => (
              <div
                key={agent._id}
                className="group bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
              >
                {/* Agent Header / Avatar Background */}
                <div className="h-24 bg-gradient-to-r from-slate-700 to-slate-800 relative">
                  <div className="absolute -bottom-10 left-6">
                    <img
                      src={agent.avatarUrl || agent.profilePicture || agent.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.name}`}
                      alt={agent.name}
                      className="w-20 h-20 rounded-xl object-cover border-4 border-slate-800 bg-slate-700 shadow-md group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    <div className="bg-slate-900/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 border border-slate-600/50">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold text-white">{agent.ratings?.average ? agent.ratings.average.toFixed(1) : 'New'}</span>
                    </div>
                    {user && user._id === agent._id && (
                      <div className="bg-blue-600/80 backdrop-blur-sm px-2 py-1 rounded-md border border-blue-400/50">
                        <span className="text-[10px] uppercase font-bold text-white tracking-wider">You</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Agent Info Body */}
                <div className="pt-12 p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {agent.name}
                  </h3>

                  <p className="text-sm text-blue-400 font-medium mb-4 flex items-center gap-1.5">
                    {agent.work || 'Real Estate Agent'}
                  </p>

                  {/* Agent Stats Row */}
                  <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-900/40 rounded-xl p-3 border border-slate-700/50">
                    <div className="text-center">
                      <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">Sales</p>
                      <p className="text-sm font-bold text-white">{agent.salesCount || 0}</p>
                    </div>
                    <div className="text-center border-x border-slate-700/50">
                      <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">Props</p>
                      <p className="text-sm font-bold text-white">{agent.totalListings || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">Exp</p>
                      <p className="text-sm font-bold text-white">{agent.experienceYears || 0}y</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    {/* Detailed Address */}
                    <div className="flex items-start gap-2 text-sm text-slate-300">
                      <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2 leading-snug">
                        {agent.address?.street ? `${agent.address.street}, ` : ''}
                        {agent.address?.city || agent.location || agent.residence || 'Location N/A'}
                        {agent.address?.state ? `, ${agent.address.state}` : ''}
                      </span>
                    </div>

                    {agent.agencyInfo?.name ? (
                      <div className="flex items-start gap-2 text-sm text-slate-300">
                        <Briefcase className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{agent.agencyInfo.name}</span>
                      </div>
                    ) : null}

                    {agent.languages && agent.languages.length > 0 ? (
                      <div className="flex items-start gap-2 text-sm text-slate-300">
                        <Globe className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {agent.languages.slice(0, 2).map((lang, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-700/50 rounded-full border border-slate-600">
                              {lang}
                            </span>
                          ))}
                          {agent.languages.length > 2 && (
                            <span className="text-[10px] text-slate-500">+{agent.languages.length - 2}</span>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Optional Action Buttons */}
                  <div className="hidden group-hover:flex w-full pt-4 border-t border-slate-700 mt-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <button
                      onClick={() => navigate(`/agent/${agent._id}`)}
                      className="w-full py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      View Full Profile
                    </button>
                  </div>

                  {/* Keep spacing consistent when button is hidden */}
                  <div className="group-hover:hidden w-full pt-4 mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-400">Everything you need to know about finding and working with agents on NepalBhumi</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How do I verify an agent's credentials on NepalBhumi?",
              a: "Look for the 'Verified' badge on agent profiles. We verify government-issued licenses, contact information, and agency affiliations for our premium professionals."
            },
            {
              q: "Is there any fee to contact or chat with an agent?",
              a: "No, contacting agents through NepalBhumi is completely free for all users. We believe in making professional real estate advice accessible to everyone."
            },
            {
              q: "Can I work with multiple agents at the same time?",
              a: "Yes, you are free to explore listings from different agents. However, we recommend building a relationship with one specialized agent for the best representation."
            },
            {
              q: "What should I do if an agent is unresponsive?",
              a: "You can see the 'Last Active' status on most agent profiles. If an agent doesn't respond within 48 hours, feel free to contact another verified professional in the same area."
            },
            {
              q: "How can I report a fraudulent listing or misconduct?",
              a: "Your safety is our priority. Every agent profile and property listing has a 'Report' button. Our moderation team reviews all reports within 24 hours."
            }
          ].map((faq, index) => (
            <details key={index} className="group bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none outline-none">
                <span className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors pr-8">
                  {faq.q}
                </span>
                <ChevronDown className="text-slate-500 group-open:rotate-180 transition-transform duration-300 flex-shrink-0" size={20} />
              </summary>
              <div className="px-6 pb-6 text-slate-400 leading-relaxed animate-in slide-in-from-top-4 duration-300">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar while allowing scroll */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}

export default Agents;
