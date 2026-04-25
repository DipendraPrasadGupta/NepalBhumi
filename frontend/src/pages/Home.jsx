import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Heart, Search as SearchIcon, Bed, Bath, Square, Zap, CheckCircle, TrendingUp, ShieldCheck, MessageSquare, PlusCircle, Settings, Map, Home as HomeIcon, Key, DollarSign, Building2, ClipboardCheck, Users, Star, CheckCircle2, ChevronDown, HelpCircle, ArrowRight, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { propertyAPI } from '../api/endpoints.js';
import PropertyCard from '../components/PropertyCard.jsx';

function Home() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const isInitialMount = useRef(true);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 400;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertyAPI.getProperties({ limit: 6 });
        setProperties(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isInitialMount.current) {
      fetchProperties();
      isInitialMount.current = false;
    }
  }, [refreshKey]);

  const handleSearch = (e) => {
    e.preventDefault();

    // Define room types
    const roomTypes = ['single-room', 'sharing-room', 'premium-room', '1bhk', '2bhk', '3bhk'];

    // Build query parameters
    const params = new URLSearchParams();
    if (searchLocation) params.append('search', searchLocation);
    if (searchType) params.append('type', searchType);
    if (priceRange) params.append('priceRange', priceRange);

    console.log('Search params:', params.toString());

    // Route based on property type
    if (searchType && roomTypes.includes(searchType)) {
      // Navigate to RoomsAndFlats for room types
      navigate(`/explore?${params.toString()}`);
    } else {
      // Navigate to PropertyMap for property types
      navigate(`/map?${params.toString()}`);
    }
  };

  const handlePopularSearch = (city) => {
    // Default popular searches to map view (property types)
    navigate(`/map?search=${city}`);
  };

  const stats = [
    { label: 'Properties Listed', value: '1,250+', icon: TrendingUp },
    { label: 'Happy Customers', value: '5,000+', icon: CheckCircle },
    { label: 'Cities Covered', value: '15+', icon: MapPin },
    { label: 'Success Rate', value: '98%', icon: Zap },
  ];

  const services = [
    {
      title: 'Buy a home',
      description: 'Discover your dream home from our extensive listings of houses and apartments for sale.',
      icon: HomeIcon,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      glowColor: 'bg-blue-400/20',
      path: '/map?purpose=sale'
    },
    {
      title: 'Find rentals',
      description: 'Browse thousands of verified rental properties, from single rooms to luxury flats.',
      icon: Key,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      glowColor: 'bg-indigo-400/20',
      path: '/explore?purpose=rent'
    },
    {
      title: 'Sell a home',
      description: 'List your property for sale and reach thousands of potential buyers across Nepal.',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      glowColor: 'bg-green-400/20',
      path: '/agent/properties'
    },
    {
      title: 'Rent your place',
      description: 'Find the perfect tenants for your property by listing it on our trusted platform.',
      icon: Building2,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      glowColor: 'bg-orange-400/20',
      path: '/agent/properties'
    },
    {
      title: 'Verified Listings',
      description: 'All properties are thoroughly checked to ensure a safe and secure experience.',
      icon: ShieldCheck,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      glowColor: 'bg-purple-400/20',
      path: '/map'
    },
    {
      title: 'Interactive Maps',
      description: 'Explore neighborhoods and locate properties precisely with our integrated map view.',
      icon: Map,
      color: 'pink',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      glowColor: 'bg-pink-400/20',
      path: '/map'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#0F172A] text-white overflow-hidden min-h-[95vh] flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Text Content */}
            <div className="relative z-10 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full animate-fadeInUp">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-sm font-bold tracking-wide uppercase text-blue-200">🏆 Nepal's #1 Real Estate Site</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                  Finding Your <br />
                  <span className=" text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 bg-300% animate-gradientFlow">
                    Dream Home
                  </span>
                </h1>
                <p className="text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                  Explore thousands of verified properties across Nepal. Whether it's a cozy room or a luxury villa, we find the perfect space for your lifestyle.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 pt-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <button
                  onClick={() => navigate('/explore')}
                  className="group relative px-8 py-5 bg-gradient-to-r from-primary to-blue-600 text-white font-black rounded-2xl transition-all duration-300 shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.5)] hover:-translate-y-1 active:scale-95 overflow-hidden w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <SearchIcon size={22} className="group-hover:rotate-12 transition-transform" />
                    <span className="text-lg">Start Exploring</span>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/map')}
                  className="px-8 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black rounded-2xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <Map size={20} className="text-blue-400" />
                  View on Map
                </button>
              </div>

              {/* Quick Stats in Hero */}
              <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/5 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <div>
                  <p className="text-3xl font-black text-white">12k+</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Properties</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white">8k+</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Happy Clients</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white">4.9/5</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rating</p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Element */}
            <div className="relative hidden lg:block animate-fadeInRight" style={{ animationDelay: '0.2s' }}>
              <div className="relative z-4 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group active:scale-[0.98] transition-all duration-500">
                <img
                  src="/hero_image.png"
                  alt="Modern Home in Nepal"
                  className="w-full h-[650px] object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60"></div>

                {/* Floating Property Card Overlay */}
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 animate-floating">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                        <HomeIcon size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-200 uppercase tracking-tighter">Premium Listing</p>
                        <h4 className="text-xl font-black text-white">Everest Heights Villa</h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">रू 5.4Cr</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 text-sm font-medium">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><Bed size={16} className="text-blue-400" /> 5 Beds</span>
                      <span className="flex items-center gap-1.5"><Bath size={16} className="text-blue-400" /> 4 Baths</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">Status: Verified</span>
                  </div>
                </div>
              </div>

              {/* Decorative Floating Elements */}
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-blue-600/30 rounded-full blur-[60px] animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-600/30 rounded-full blur-[60px]"></div>

              {/* Trust Badge Floating */}
              <div className="absolute -top-6 -left-6 px-6 py-4 bg-white rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce-slow">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase leading-none mb-1">Guaranteed</p>
                  <p className="text-sm font-black text-slate-900 leading-none">Safe Properties</p>
                </div>
              </div>

              {/* Users Count Floating */}
              <div className="absolute top-1/2 -right-12 px-6 py-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center gap-4 animate-floating" style={{ animationDelay: '1s' }}>
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-blue-${i + 3}00 overflow-hidden`}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">+5k</div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Active Now</p>
                  <p className="text-sm font-black text-white leading-none">Join the Community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Search */}
      <section className="relative -mt-20 mb-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Find Your Perfect Property</h2>

          <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-primary transition-colors">📍 Location</label>
              <input
                type="text"
                placeholder="Enter city or area"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="input w-full h-10 py-2 text-sm group-hover:border-primary/50 transition-colors focus:ring-primary/20"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-primary transition-colors">🏠 Property Type</label>
              <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="input w-full h-10 py-2 text-sm group-hover:border-primary/50 transition-colors focus:ring-primary/20">
                <option value="">All Types</option>
                <option value="single-room">🛏️ Single Room</option>
                <option value="sharing-room">👥 Sharing Room</option>
                <option value="premium-room">⭐ Premium Room</option>
                <option value="1bhk">🏠 1 BHK</option>
                <option value="2bhk">🏠 2 BHK</option>
                <option value="3bhk">3 BHK</option>
                <option value="apartment">🏢 Apartment</option>
                <option value="single-family">🏡 Single Family</option>
                <option value="multi-family">🏘️ Multi Family</option>
                <option value="studio">📦 Studio</option>
                <option value="penthouse">🏰 Penthouse</option>
                <option value="office-space">💼 Office Space</option>
                <option value="store-front">🏬 Store Front</option>
                <option value="warehouse">🏭 Warehouse</option>
                <option value="workshop">🔧 Workshop</option>
                <option value="food-services">🍽️ Food Services</option>
                <option value="guest-services">🛏️ Guest Services</option>
                <option value="medical-services">🏥 Medical Services</option>
                <option value="mixed-commercial">🏢 Mixed Commercial</option>
                <option value="agricultural">🌾 Agricultural</option>
                <option value="residential">🏠 Residential</option>
                <option value="commercial">🏪 Commercial</option>
                <option value="industrial">🏗️ Industrial</option>
                <option value="mixed-use">🌆 Mixed Use</option>
                <option value="house">🏠 House</option>
                <option value="land">🌍 Land</option>

              </select>
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-primary transition-colors">💰 Price Range</label>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="input w-full h-10 py-2 text-sm group-hover:border-primary/50 transition-colors focus:ring-primary/20">
                <option value="">Any Price</option>
                <option value="0-10000">Under 10,000</option>
                <option value="10000-25000">10,000 - 50,000</option>
                <option value="25000-50000">50,000 - 100,000</option>
                <option value="25000-50000">1,00,000 - 5,00,000</option>
                <option value="25000-50000">5,00,000 - 10,000</option>
                <option value="25000-50000">10,00,000 - 25,00,000</option>
                <option value="25000-50000">25,00,000 - 50,00,000</option>
                <option value="50000">50,00,000+</option>
              </select>
            </div>

            <div className="flex items-end">
              <button type="submit" className="btn btn-primary w-full h-10 py-2 text-sm font-bold hover:shadow-xl transition-all duration-300 group">
                <SearchIcon size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                Search Now
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-600">Popular Searches:</span>
            {['Kathmandu', 'Pokhara', 'Bhaktapur', 'Lalitpur'].map((city) => (
              <button
                key={city}
                onClick={() => handlePopularSearch(city)}
                type="button"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-100 text-primary font-medium text-sm hover:from-primary/20 hover:to-blue-200 transition-all hover:shadow-md cursor-pointer"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="space-y-6 mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary/10 to-blue-100 rounded-full border border-primary/20">
            <Zap className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-bold text-primary">✨ FEATURED LISTINGS</span>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Popular Properties</h2>
            <p className="text-xl text-gray-600 max-w-2xl">Discover our most viewed and highest-rated properties from across Nepal</p>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {properties.slice(0, 6).map((property, idx) => (
              <div
                key={property._id}
                className="group relative transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                style={{
                  animation: `slideUp 0.6s ease-out ${idx * 0.1}s both`
                }}
              >
                {/* Badge */}
                {/* <div className="absolute top-4 right-4 z-10 flex gap-2">
                  {idx < 2 && (
                    <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold shadow-lg">
                      🔥 Hot
                    </div>
                  )}
                  <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-blue-600 text-white text-xs font-bold shadow-lg">
                    ⭐ Popular
                  </div>
                </div> */}

                {/* Shadow Effect */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div> */}

                {/* Enhanced Card */}
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <PropertyCard
                    property={property}
                    onSaveSuccess={() => setRefreshKey((prev) => prev + 1)}
                  />
                </div>


              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-gray-600 text-lg font-semibold">No properties found</p>
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-20">
          <Link to="/map" className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
            <SearchIcon size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            View All Properties
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .animate-fadeInRight {
          animation: fadeInRight 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .animate-floating {
          animation: floating 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-gradientFlow {
          background-size: 200% auto;
          animation: gradientFlow 5s ease-in-out infinite;
        }
        .bg-300% {
          background-size: 300% auto;
        }
      `}</style>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-blue-500 to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur text-white mb-4 group-hover:bg-white/30 transition-all group-hover:scale-110 shadow-lg">
                  <stat.icon size={28} className="group-hover:rotate-12 transition-transform" />
                </div>
                <p className="text-4xl font-bold mb-2 text-white">{stat.value}</p>
                <p className="text-blue-100 font-semibold text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-50/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-white shadow-xl shadow-blue-500/10 rounded-full mb-6 border border-blue-50">
                <Zap size={16} className="text-primary animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Everything You Need</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Services</span>
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
                We've redefined the property experience in Nepal with cutting-edge tools and verified data at your fingertips.
              </p>
            </div>

            {/* Scroll Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => scroll('left')}
                className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all duration-300 hover:scale-110 active:scale-95 group"
              >
                <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-14 h-14 rounded-2xl bg-primary shadow-xl shadow-blue-500/30 flex items-center justify-center text-white hover:bg-blue-600 transition-all duration-300 hover:scale-110 active:scale-95 group"
              >
                <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-12 hide-scrollbar snap-x snap-mandatory"
            style={{ scrollBehavior: 'smooth' }}
          >
            {services.map((service, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[350px] md:w-[400px] snap-start"
              >
                {/* Card Background with Glass Effect */}
                <div className="relative h-full p-10 bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 flex flex-col items-start overflow-hidden active:scale-95 group">

                  {/* Decorative Gradient Glow (Visible on Hover) */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white via-transparent to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-[2.5] transition-transform duration-700 ease-out opacity-20`}></div>

                  {/* Icon Area */}
                  <div className={`relative w-20 h-20 rounded-3xl ${service.bgColor} flex items-center justify-center ${service.iconColor} mb-8 shadow-sm group-hover:rotate-6 transition-all duration-500`}>
                    <div className={`absolute inset-0 ${service.glowColor} blur-xl rounded-full scale-0 group-hover:scale-110 transition-transform duration-500`}></div>
                    <service.icon size={36} className="relative z-10 transition-transform duration-500 group-hover:scale-110" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex-grow">
                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors duration-300 tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed font-medium mb-8">
                      {service.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={service.path}
                    className="relative z-10 mt-auto flex items-center gap-3 no-underline group/btn"
                  >
                    <div className={`w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 group-hover:translate-x-1`}>
                      <span className="text-xl font-bold">→</span>
                    </div>
                    <span className="text-sm font-bold text-slate-400 group-hover:text-primary transition-colors duration-300">
                      Explore More
                    </span>
                  </Link>

                  {/* Background Number Ornament */}
                  <div className="absolute -bottom-6 -right-4 text-9xl font-black text-slate-50/50 group-hover:text-primary/5 transition-colors duration-500 select-none pointer-events-none italic">
                    {idx + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section className="relative py-20 overflow-hidden bg-slate-950">
        {/* Decorative Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Left Header Section */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-wide uppercase">
                <HelpCircle size={16} />
                <span>Got Questions?</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] text-left">
                Frequently Asked <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Questions
                </span>
              </h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed text-left">
                Everything you need to know about finding and working with real estate professionals on NepalBhumi.
              </p>

              <div className="pt-8 hidden lg:block text-left">
                <div className="p-1 rounded-3xl bg-gradient-to-br from-blue-500/20 to-transparent">
                  <div className="p-8 rounded-[22px] bg-slate-900/50 backdrop-blur-xl border border-slate-700/30">
                    <MessageSquare size={32} className="text-blue-400 mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Need more help?</h4>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">Cant find the answer you are looking for? Our dedicated team is just a message away.</p>
                    <Link to="/contact-us" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors group">
                      Talk to Support
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right FAQ List Section */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  id: "01",
                  q: "How do I verify an agent's credentials on NepalBhumi?",
                  a: "Look for the 'Verified' badge on agent profiles. We verify government-issued licenses, contact information, and agency affiliations for our premium professionals to ensure security and trust."
                },
                {
                  id: "02",
                  q: "Is there any fee to contact or chat with an agent?",
                  a: "No, contacting agents through NepalBhumi is completely free for all users. We believe in making professional real estate advice accessible to everyone without barriers."
                },
                {
                  id: "03",
                  q: "Can I work with multiple agents at the same time?",
                  a: "Yes, you are free to explore listings from different agents. However, building a relationship with one specialized agent often leads to more personalized service and better representation."
                },
                {
                  id: "04",
                  q: "What should I do if an agent is unresponsive?",
                  a: "You can see the 'Last Active' status on profiles. If an agent doesn't respond within 48 hours, feel free to contact another verified professional in the same area or use our support system."
                },
                {
                  id: "05",
                  q: "How can I report a fraudulent listing or misconduct?",
                  a: "Your safety is our priority. Every agent profile and property listing has a 'Report' button. Our moderation team reviews all reports within 24 hours to maintain the platform's integrity."
                },
                {
                  id: "06",
                  q: "How do I list my property for sale or rent?",
                  a: "To list your property, simply sign up as an agent or owner and click the 'Post Property' button. Fill in the details, upload photos, and our team will verify and publish your listing."
                }
              ].map((faq, index) => (
                <details
                  key={index}
                  className="group bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden transition-all duration-500 hover:border-blue-500/30 hover:bg-slate-800/60 shadow-lg"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none outline-none">
                    <div className="flex items-start gap-6 text-left">
                      <span className="hidden sm:block text-2xl font-black text-slate-700/50 group-hover:text-blue-500/30 transition-colors duration-500">
                        {faq.id}
                      </span>
                      <span className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors duration-300 pr-4">
                        {faq.q}
                      </span>
                    </div>
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-300">
                      <ChevronDown className="text-slate-400 group-open:rotate-180 group-hover:text-blue-400 transition-all duration-500" size={24} />
                    </div>
                  </summary>
                  <div className="px-8 pb-10 sm:pl-20">
                    <div className="h-px w-24 bg-gradient-to-r from-blue-500/40 to-transparent mb-6"></div>
                    <p className="text-slate-400 leading-relaxed text-lg animate-in fade-in slide-in-from-top-4 duration-500 text-left">
                      {faq.a}
                    </p>
                  </div>
                </details>
              ))}

              {/* Mobile Only Help CTA */}
              <div className="lg:hidden mt-12 bg-slate-900/60 p-8 rounded-3xl border border-slate-800/50 text-left">
                <h4 className="text-xl font-bold text-white mb-2">Still have questions?</h4>
                <p className="text-slate-400 mb-6">Cant find the answer you are looking for? Our team is available to help.</p>
                <Link to="/contact-us" className="btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all">
                  Contact Support
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Simple steps to find your perfect property</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Search', desc: 'Browse thousands of properties across Nepal', icon: '🔍' },
              { num: '02', title: 'Connect', desc: 'Chat directly with property owners and agents', icon: '💬' },
              { num: '03', title: 'Visit', desc: 'Schedule and visit properties that interest you', icon: '🏠' },
              { num: '04', title: 'Close Deal', desc: 'Complete the transaction securely', icon: '✅' },
            ].map((step, idx) => (
              <div key={idx} className="group relative">
                {idx < 3 && <div className="hidden md:block absolute right-0 top-12 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent\"></div>}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-blue-100 text-4xl mb-6 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                    {step.icon}
                  </div>
                  <div className="inline-block bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-1 rounded-full text-sm font-bold mb-4">Step {step.num}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



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



      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary via-blue-600 to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl\"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl\"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream homes on NepalBhumi
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to="/map" className="btn bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              Start Exploring Properties With Map View Now →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
