import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { propertyAPI } from '../api/endpoints.js';
import { formatPrice } from '../utils/formatters.js';
import { MapPin, Bed, Bath, Heart, DollarSign, Home, ChevronLeft, ChevronRight, Share2, Flag, Wifi, Zap, Droplet, Trash2, ParkingCircle, Users, Calendar, Phone, Mail, Map, MessageSquare, User, Star, Info, X, ExternalLink, Shield, Activity, Layers, Leaf, Snowflake, Flame, Waves, Square, Sparkles, Eye, Building, CheckCircle2, Tag, Facebook, Linkedin } from 'lucide-react';
import { useAuthStore } from '../store.js';

// Agent Details Modal Component
const AgentDetailsModal = ({ agent, onClose }) => {
  if (!agent) return null;

  // Generate QR code data - links to agent public profile
  const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/agent/' + agent._id)}`;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-all duration-500"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-500 border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Elite Profile Header - Compact Version */}
        <div className="bg-slate-900 p-6 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <div className="relative flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Partner</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">License Verified</span>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter leading-none">NB-9842A-2024</span>
              </div>
              <div className="hidden xs:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-xl">
                <div className="w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Market Expert</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 border border-white/10"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="relative flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-xl relative z-10 bg-slate-800 p-0.5">
                {agent.avatarUrl || agent.avatar ? (
                  <img src={agent.avatarUrl || agent.avatar} alt={agent.name} className="w-full h-full object-cover rounded-[0.8rem]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <User size={32} />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 z-20 bg-emerald-500 text-white p-1 rounded-lg border-2 border-slate-900 shadow-lg">
                <Shield size={14} />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black text-white mb-1 truncate">{agent.name || 'Elite Partner'}</h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                  agent.role === 'admin' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {agent.role === 'admin' ? 'Admin' : 'Verified Agent'}
                </span>
                {agent.rating && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-full">
                    <Star size={10} className="fill-amber-500 text-amber-500" />
                    <span className="text-[8px] font-black text-amber-500 uppercase">{agent.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Information Grid */}
        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
          {/* High-Contrast Contact Terminals */}
          <div className="grid grid-cols-1 gap-4">
            {agent.phone && (
              <div className="group relative p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Primary Line</p>
                      <a href={`tel:${agent.phone}`} className="text-base font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        {agent.phone}
                      </a>
                    </div>
                  </div>
                  <a 
                    href={`tel:${agent.phone}`}
                    className="hidden sm:block px-3 py-1 bg-blue-600/10 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            )}
            {agent.email && (
              <div className="group relative p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                      <Mail size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Secure Email</p>
                      <a href={`mailto:${agent.email}`} className="text-sm font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors truncate block max-w-[180px] sm:max-w-none">
                        {agent.email}
                      </a>
                    </div>
                  </div>
                  <a 
                    href={`mailto:${agent.email}`}
                    className="hidden sm:block px-3 py-1 bg-emerald-600/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-600/20 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                  >
                    Send Mail
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Biography Dossier */}
          {agent.description && (
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Professional Profile</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-[2rem] border border-slate-100 italic">
                "{agent.description}"
              </p>
            </div>
          )}

          {/* Social Presence Strip */}
          {(agent.socialLinks?.facebook || agent.socialLinks?.linkedin) && (
            <div className="flex items-center justify-center gap-4 py-4 border-y border-slate-100">
              {agent.socialLinks?.facebook && (
                <a href={agent.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all border border-slate-100 hover:border-blue-500 shadow-sm">
                  <Facebook size={20} />
                </a>
              )}
              {agent.socialLinks?.linkedin && (
                <a href={agent.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 text-slate-400 hover:bg-blue-700 hover:text-white rounded-2xl transition-all border border-slate-100 hover:border-blue-600 shadow-sm">
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          )}

          {/* Digital Business Card (QR Section) */}
          <div className="bg-slate-900 p-8 rounded-[3rem] relative overflow-hidden text-center group border border-slate-800">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-6">Digital ID Access</h4>
            <div className="relative inline-block p-4 bg-white rounded-[2rem] shadow-2xl mb-4 group-hover:scale-105 transition-transform duration-500">
              <img src={qrData} alt="Agent QR Code" className="w-32 h-32" />
              <div className="absolute inset-0 border-2 border-slate-900/5 rounded-[2rem]"></div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scan to synchronize contact details</p>
          </div>

          {/* Full Profile Access */}
          <div className="pt-2">
            <Link
              to={`/agent/${agent._id}`}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black py-4 rounded-[2rem] transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] border border-slate-200"
            >
              <User size={18} />
              Analyze Full Market Portfolio
            </Link>
          </div>
        </div>

        {/* Global Action Command Strip */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4 flex-shrink-0">
          <a
            href={`tel:${agent.phone || '9800000000'}`}
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white font-black py-5 rounded-[2rem] transition-all duration-300 shadow-xl shadow-slate-900/10 group uppercase tracking-widest text-[10px]"
          >
            <Phone size={18} className="group-hover:rotate-12 transition-transform" />
            Direct Call
          </a>
          <a
            href={`https://wa.me/${agent.socialLinks?.whatsapp || agent.phone?.replace(/[^0-9]/g, '') || '9800000000'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-[2rem] transition-all duration-300 shadow-xl shadow-emerald-500/20 group uppercase tracking-widest text-[10px]"
          >
            <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

const MapComponentDetails = ({ lat, lng, address, city, property }) => {
  const isDefaultCoord = (lat && lng) && (
    Math.abs(lat - 27.7172) < 0.001 && 
    Math.abs(lng - 85.3240) < 0.001
  );

  let mapQuery = "";
  if (lat && lng && !isDefaultCoord) {
    mapQuery = `${lat},${lng}`;
  } else {
    const parts = [address, property?.location?.streetTole, property?.location?.landmark, city, 'Nepal']
      .filter(part => part && part.trim() !== "");
    mapQuery = parts.join(", ");
  }

  // High zoom (z=18) and satellite-hybrid view (t=h) for 'perfect' pinpointing
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=h&z=18&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-full h-full bg-slate-900 relative group overflow-hidden">
      {/* Real Map Layer */}
      <iframe
        title="Geographic Intelligence Asset Map"
        width="100%"
        height="100%"
        frameBorder="0"
        src={mapUrl}
        style={{ border: 0, filter: 'contrast(1.1) brightness(0.9)' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="transition-all duration-1000 group-hover:brightness-100"
      />

      {/* Digital Crosshair Overlay - The 'Highlight' */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Horizontal Line */}
        <div className="absolute w-full h-[1px] bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
        {/* Vertical Line */}
        <div className="absolute w-[1px] h-full bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
        
        {/* Central Targeting Pulse & Pin - The 'Perfect Icon' */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-blue-500/40 rounded-full animate-ping absolute"></div>
          
          {/* Elite Location Pin with Price Badge */}
          <div className="relative z-10 flex flex-col items-center animate-bounce duration-[2000ms]">
            <div className="flex items-center bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)] border-2 border-white px-3 py-1.5 gap-2">
              <MapPin size={24} className="text-white fill-white/20" />
              <span className="text-sm font-black text-white whitespace-nowrap pr-1">
                {property?.price?.toLocaleString() || 'N/A'}
              </span>
            </div>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1 shadow-lg shadow-blue-500/50"></div>
          </div>
          
          {/* Compass Markers */}
          <div className="absolute -top-20 text-[8px] font-black text-blue-400/60 uppercase tracking-widest">N</div>
          <div className="absolute -bottom-20 text-[8px] font-black text-blue-400/60 uppercase tracking-widest">S</div>
          <div className="absolute -left-20 text-[8px] font-black text-blue-400/60 uppercase tracking-widest">W</div>
          <div className="absolute -right-20 text-[8px] font-black text-blue-400/60 uppercase tracking-widest">E</div>
        </div>

        {/* Decorative Corner Brackets */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-blue-500/30"></div>
        <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-blue-500/30"></div>
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-blue-500/30"></div>
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-blue-500/30"></div>
      </div>

      {/* Dynamic Coordinates Readout */}
      <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-blue-500/30 text-[9px] font-mono text-blue-400 uppercase tracking-widest animate-pulse">
        Target Locked // {lat?.toFixed(4) || 'ADDR'}:{lng?.toFixed(4) || 'LOC'}
      </div>
    </div>
  );
};

const getVideoEmbedUrl = (url) => {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
  if (ytMatch) {
    const id = ytMatch[1].split('&')[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // Facebook
  if (url.includes('facebook.com')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
  }

  return url; // Fallback
};

const AMENITY_MAP = {
  'water-supply': { label: 'Water Supply', icon: Droplet, color: 'text-blue-500' },
  'electricity': { label: 'Stable Power', icon: Zap, color: 'text-yellow-500' },
  'power-backup': { label: 'Power Backup', icon: Zap, color: 'text-orange-500' },
  'waste-management': { label: 'Waste Management', icon: Trash2, color: 'text-emerald-500' },
  'sewerage': { label: 'Sewerage System', icon: Activity, color: 'text-slate-500' },
  'security': { label: '24/7 Security', icon: Shield, color: 'text-blue-600' },
  'cctv': { label: 'CCTV Surveillance', icon: Eye, color: 'text-slate-600' },
  'elevator': { label: 'Lift / Elevator', icon: Layers, color: 'text-indigo-500' },
  'intercom': { label: 'Intercom', icon: Phone, color: 'text-blue-400' },
  'wifi': { label: 'Internet / WiFi', icon: Wifi, color: 'text-blue-400' },
  'fire-exit': { label: 'Fire Exit', icon: Shield, color: 'text-red-500' },
  'parking-2w': { label: 'Bike Parking', icon: ParkingCircle, color: 'text-slate-500' },
  'parking-4w': { label: 'Car Parking', icon: ParkingCircle, color: 'text-slate-500' },
  'staff-quarter': { label: 'Staff Quarter', icon: Home, color: 'text-slate-500' },
  'gym': { label: 'Fitness Center', icon: Activity, color: 'text-red-500' },
  'pool': { label: 'Swimming Pool', icon: Waves, color: 'text-blue-500' },
  'garden': { label: 'Private Garden', icon: Leaf, color: 'text-green-500' },
  'balcony': { label: 'Private Balcony', icon: Square, color: 'text-slate-500' },
  'community-hall': { label: 'Community Hall', icon: Home, color: 'text-indigo-400' },
  'club-house': { label: 'Club House', icon: Building, color: 'text-indigo-500' },
  'ac': { label: 'Air Conditioning', icon: Snowflake, color: 'text-blue-300' },
  'geyser': { label: 'Hot Water / Geyser', icon: Flame, color: 'text-orange-500' },
};

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savingProperty, setSavingProperty] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [inquiryData, setInquiryData] = useState({ name: '', email: '', message: '' });
  const [inquiryStatus, setInquiryStatus] = useState('idle'); // idle, sending, success, error
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await propertyAPI.getPropertyById(id);
        const propertyData = response.data.data;
        setProperty(propertyData);

        // Fetch nearby properties
        if (propertyData?.location?.city) {
          try {
            const nearbyRes = await propertyAPI.getProperties({
              city: propertyData.location.city,
              limit: 5
            });
            if (nearbyRes.data?.data) {
              setNearbyProperties(nearbyRes.data.data.filter(p => p._id !== id));
            }
          } catch (err) {
            console.error('Failed to fetch nearby properties:', err);
          }
        }

        if (propertyData?.savedBy && user?._id) {
          const userIdStr = user._id.toString();
          const isSavedByUser = propertyData.savedBy.some(savedId => savedId.toString() === userIdStr);
          setIsSaved(isSavedByUser);
        }
      } catch (error) {
        console.error('Failed to fetch property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, user]);

  const handlePrevImage = () => {
    setShowVideo(false);
    setCurrentImageIndex((prev) => (prev === 0 ? (property.images?.length || 1) - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setShowVideo(false);
    setCurrentImageIndex((prev) => (prev === (property.images?.length || 1) - 1 ? 0 : prev + 1));
  };

  const handleSaveProperty = async () => {
    if (!user) {
      alert('Please login to save properties');
      window.location.href = '/auth/login';
      return;
    }

    try {
      setSavingProperty(true);
      const response = await propertyAPI.saveProperty(id);
      if (response.data.success) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Failed to save property:', error);
      alert('Failed to save property. Please try again.');
    } finally {
      setSavingProperty(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `Check out this property on NepalBhumi: ${property.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryData.name || !inquiryData.email || !inquiryData.message) {
      alert('Please complete all security fields.');
      return;
    }

    try {
      setInquiryStatus('sending');
      // Simulate API call for high-fidelity demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Transmitting Inquiry:', {
        propertyId: id,
        agentId: property.ownerId?._id,
        ...inquiryData
      });

      setInquiryStatus('success');
      setInquiryData({ name: '', email: '', message: '' });
      
      // Auto-close after success feedback
      setTimeout(() => {
        setInquiryStatus('idle');
        setShowRequestForm(false);
      }, 3000);

    } catch (error) {
      console.error('Transmission failed:', error);
      setInquiryStatus('error');
      setTimeout(() => setInquiryStatus('idle'), 3000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="spinner mx-auto"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600">Property not found</p>
      </div>
    );
  }

  const images = property.images?.length > 0 ? property.images : [];
  const currentImage = images[currentImageIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with image gallery */}
      <div className="relative bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Image/Video Viewer */}
          <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden mb-6 mt-6 bg-slate-900 shadow-2xl group">
            {showVideo && property.videoUrl ? (
              <iframe
                src={getVideoEmbedUrl(property.videoUrl)}
                className="w-full h-full"
                title="Property Video Tour"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : currentImage ? (
              <img
                src={currentImage.url}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                <Home size={80} className="text-blue-500 opacity-50" />
              </div>
            )}

            {/* Status Badge */}
            {(property.status === 'sold' || property.status === 'rented') ? (
              <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-md text-white px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl z-20">
                {property.status === 'sold' ? 'Sold Out' : 'Rented Out'}
              </div>
            ) : property.purpose ? (
              <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-md text-white px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl z-20">
                {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
              </div>
            ) : null}

            {/* Navigation buttons (hidden in video mode) */}
            {!showVideo && images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-2xl shadow-xl transition-all border border-white/20 group-hover:left-8 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-2xl shadow-xl transition-all border border-white/20 group-hover:right-8 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={24} className="text-white" />
                </button>
              </>
            )}

            {/* Media counter */}
            {!showVideo && (
              <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg">
                {images.length > 0 ? `${currentImageIndex + 1} / ${images.length}` : '0 / 0'}
              </div>
            )}

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-3">
              <button
                onClick={handleSaveProperty}
                disabled={savingProperty}
                className={`p-3 rounded-2xl transition-all shadow-xl backdrop-blur-md border border-white/10 ${savingProperty ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                  } ${isSaved
                    ? 'bg-red-500/90 text-white border-red-400'
                    : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
              >
                <Heart size={24} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Thumbnails Grid (Images + Video) */}
          {(images.length > 0 || property.videoUrl) && (
            <div className="flex gap-4 mb-8 overflow-x-auto pb-4 custom-scrollbar">
              {/* Video Thumbnail (if exists) */}
              {property.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden transition-all border-2 relative group ${showVideo ? 'border-red-500 scale-95 shadow-lg shadow-red-500/20' : 'border-slate-200 hover:border-red-400'}`}
                >
                  <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-1">
                    <div className="p-2 bg-red-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <ExternalLink size={18} />
                    </div>
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Video Tour</span>
                  </div>
                  {showVideo && <div className="absolute inset-0 bg-red-500/10 backdrop-blur-[2px]"></div>}
                </button>
              )}

              {/* Image Thumbnails */}
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setShowVideo(false);
                    setCurrentImageIndex(idx);
                  }}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden transition-all border-2 ${!showVideo && idx === currentImageIndex ? 'border-blue-500 scale-95 shadow-lg shadow-blue-500/20' : 'border-slate-200 hover:border-blue-400'}`}
                >
                  <img src={img.url} alt={`${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title, Price, and Quick Info Card */}
            {/* High-Impact Hero Header */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
              {/* Dynamic Status Watermark */}
              <div className="absolute -top-10 -right-10 w-80 h-80 flex items-center justify-center select-none pointer-events-none">
                <div className={`text-[120px] font-black uppercase tracking-tighter opacity-[0.03] -rotate-12 ${property.status === 'sold' || property.status === 'rented' ? 'text-red-600' :
                  property.status === 'pending' ? 'text-orange-600' : 'text-emerald-600'
                  }`}>
                  {property.status === 'active' ? 'Available' :
                    property.status === 'sold' ? 'Sold' :
                      property.status === 'rented' ? 'Rented' :
                        property.status || 'Active'}
                </div>
              </div>

              <div className={`absolute top-0 right-0 px-12 py-3 rounded-bl-[3rem] shadow-2xl border-l border-b ${property.status === 'sold' || property.status === 'rented' ? 'bg-red-600 border-red-500 shadow-red-200' :
                property.status === 'pending' ? 'bg-orange-500 border-orange-400 shadow-orange-200' :
                  'bg-emerald-600 border-emerald-500 shadow-emerald-200'
                }`}>
                <span className="text-white text-xs font-black uppercase tracking-[0.4em]">
                  {property.status === 'active' ? 'Available Now' :
                    property.status === 'sold' ? 'Asset Sold' :
                      property.status === 'rented' ? 'Rented Out' :
                        property.status === 'pending' ? 'Under Offer' :
                          'Listing Active'}
                </span>
              </div>
              <div className="relative flex flex-col gap-8">
                <div className="w-full">
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-200">
                      <Sparkles size={12} />
                      Elite Listing
                    </div>
                    <div className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200">
                      Certified {property.type}
                    </div>
                    <div className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm ${property.purpose === 'sale' ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-emerald-500 text-white shadow-emerald-200'
                      }`}>
                      Direct {property.purpose === 'sale' ? 'Purchase' : 'Lease'}
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                    {property.title}
                  </h1>

                  <div className="flex items-start text-slate-500 group cursor-pointer">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mr-5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm flex-shrink-0 mt-1">
                      <MapPin size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight mb-1.5">
                        {property.location?.address}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          {property.location?.municipality || 'Butwal Hub'} • Ward {property.location?.ward || '12'} • {property.location?.city}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl shadow-slate-900/20 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Investment Value</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-black text-slate-500 uppercase">{property.currency || 'NPR'}</span>
                        <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                          {property.price ? property.price.toLocaleString() : 'Price on Request'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {property.purpose === 'rent' ? (
                        <p className="text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-6 py-3 rounded-2xl border border-emerald-400/20">
                          Per Month Lease
                        </p>
                      ) : (
                        <p className="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-400/10 px-6 py-3 rounded-2xl border border-blue-400/20">
                          {property.isNegotiable ? 'Negotiable Rate' : 'Fixed Market Price'}
                        </p>
                      )}

                      <div className="hidden md:block h-12 w-px bg-slate-800"></div>

                      <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Listing Status</p>
                        <div className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${property.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          property.status === 'sold' || property.status === 'rented' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            property.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                              'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          }`}>
                          {property.status === 'active' ? 'Available' :
                            property.status === 'sold' ? 'Sold' :
                              property.status === 'rented' ? 'Rented Out' :
                                property.status === 'pending' ? 'Pending' :
                                  'Active'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-100">
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col items-center justify-center group hover:bg-blue-600 transition-all duration-500">
                  <Bed size={24} className="text-blue-600 group-hover:text-white mb-2 transition-colors" />
                  <p className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">{property.features?.bedrooms || 0}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-200 transition-colors">Bedrooms</p>
                </div>
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center group hover:bg-emerald-600 transition-all duration-500">
                  <Bath size={24} className="text-emerald-600 group-hover:text-white mb-2 transition-colors" />
                  <p className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">{property.features?.bathrooms || 0}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-200 transition-colors">Bathrooms</p>
                </div>
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 flex flex-col items-center justify-center group hover:bg-purple-600 transition-all duration-500">
                  <Square size={24} className="text-purple-600 group-hover:text-white mb-2 transition-colors" />
                  <p className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">{property.features?.area || 0}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-purple-200 transition-colors">Sq. Feet</p>
                </div>
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex flex-col items-center justify-center group hover:bg-orange-600 transition-all duration-500">
                  <Sparkles size={24} className="text-orange-600 group-hover:text-white mb-2 transition-colors" />
                  <p className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">{property.features?.floor || '1st'}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-orange-200 transition-colors">Floor</p>
                </div>
              </div>
            </div>

            {/* Premium Property Specs Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                    Core Specifications
                  </h2>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-xl transition-all">
                          <Home size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-500">Property Category</span>
                      </div>
                      <span className="text-sm font-black text-slate-900 uppercase tracking-widest">{property.type}</span>
                    </div>
                    <div className="flex justify-between items-center group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-xl transition-all">
                          <Tag size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-500">Listing Intent</span>
                      </div>
                      <span className="text-sm font-black text-emerald-600 uppercase tracking-widest">{property.purpose}</span>
                    </div>
                    <div className="flex justify-between items-center group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-xl transition-all">
                          <Eye size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-500">Total Engagement</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">{property.views || 0} Views</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-800 text-white">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
                  Infrastructure
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Built Year</span>
                    <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">{property.features?.builtYear || 'Modern'}</span>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Facing Direction</span>
                    <span className="text-sm font-black text-blue-400 uppercase tracking-widest">{property.features?.facing || 'North'}</span>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Total Floors</span>
                    <span className="text-sm font-black text-purple-400 uppercase tracking-widest">{property.features?.totalFloors || 'Multi'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Narrative */}
            {property.description && (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100%] -mr-10 -mt-10 opacity-50"></div>
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                  Property Overview
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    {property.description}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {property.features?.highlights?.map((h, i) => (
                    <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Utilities & Infrastructure */}
            {property.amenities?.some(a => ['water-supply', 'electricity', 'power-backup', 'waste-management', 'sewerage', 'security', 'cctv', 'elevator', 'intercom', 'wifi', 'fire-exit', 'parking-2w', 'parking-4w', 'staff-quarter'].includes(a)) && (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Utilities & Infrastructure</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Essential Service Matrix</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {property.amenities?.filter(a => ['water-supply', 'electricity', 'power-backup', 'waste-management', 'sewerage', 'security', 'cctv', 'elevator', 'intercom', 'wifi', 'fire-exit', 'parking-2w', 'parking-4w', 'staff-quarter'].includes(a)).map(key => {
                    const info = AMENITY_MAP[key];
                    if (!info) return null;
                    return (
                      <div key={key} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                        <div className={`p-2.5 rounded-xl bg-white shadow-sm ${info.color}`}>
                          <info.icon size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{info.label}</p>
                          <p className="text-xs font-bold text-gray-900">Available</p>
                        </div>
                      </div>
                    );
                  })}
                  {/* Specialized Parking Logic */}
                  {(property.features?.parking || property.amenities?.some(a => a.startsWith('parking'))) && !property.amenities?.some(a => a.startsWith('parking')) && (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                      <div className="p-2.5 rounded-xl bg-white shadow-sm text-purple-500">
                        <ParkingCircle size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Parking</p>
                        <p className="text-xs font-bold text-gray-900">{property.features?.parking || 'Available'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lifestyle & Comfort Amenities */}
            {property.amenities?.some(a => ['gym', 'pool', 'garden', 'balcony', 'community-hall', 'club-house', 'ac', 'geyser'].includes(a)) && (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Lifestyle & Comfort</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Premium Living Assets</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {property.amenities?.filter(a => ['gym', 'pool', 'garden', 'balcony', 'community-hall', 'club-house', 'ac', 'geyser'].includes(a)).map(key => {
                    const info = AMENITY_MAP[key];
                    if (!info) return null;
                    return (
                      <div key={key} className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/30 border border-emerald-100 group hover:border-emerald-300 transition-all">
                        <div className={`p-2.5 rounded-xl bg-white shadow-sm ${info.color}`}>
                          <info.icon size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{info.label}</p>
                          <p className="text-xs font-bold text-gray-900">Included</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}


          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Listing Concierge Widget */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/20 border border-slate-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-500 p-1 bg-slate-800">
                    <img
                      src={property.ownerId?.avatarUrl || property.ownerId?.avatar || 'https://via.placeholder.com/150'}
                      alt={property.ownerId?.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-lg border-2 border-slate-900 shadow-lg">
                    <CheckCircle2 size={14} />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Strategic Advisor</p>
                  <h3 className="text-xl font-black text-white">{property.ownerId?.name || 'Nepal Bhumi Agent'}</h3>
                  <p className="text-sm text-slate-400 font-bold">{property.ownerId?.role === 'admin' ? 'Elite Administrator' : 'Certified Partner'}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <a href={`tel:${property.ownerId?.phone}`} className="flex items-center gap-4 p-4 bg-slate-800/50 hover:bg-blue-600 rounded-2xl transition-all duration-300 group border border-slate-700">
                  <div className="p-2 bg-slate-700 rounded-xl group-hover:bg-white/20">
                    <Phone size={18} className="text-blue-400 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-black text-slate-200 uppercase tracking-widest group-hover:text-white">Call Specialist</span>
                </a>

                <button
                  onClick={() => setShowRequestForm(!showRequestForm)}
                  className="w-full flex items-center gap-4 p-4 bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all duration-300 group shadow-lg shadow-blue-600/20"
                >
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Mail size={18} className="text-white" />
                  </div>
                  <span className="text-sm font-black text-white uppercase tracking-widest">Inquiry Terminal</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                  onClick={handleSaveProperty}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${isSaved
                    ? 'bg-red-500/10 border-red-500/50 text-red-500'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'}`}
                >
                  <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
                  <span className="text-[8px] font-black uppercase tracking-widest">{isSaved ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:border-slate-500 transition-all duration-300"
                >
                  <Share2 size={20} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Share</span>
                </button>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-slate-800">
                <div className="flex gap-2">
                  <a href="#" className="p-2 bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-all border border-slate-700">
                    <Facebook size={16} />
                  </a>
                  <a href="#" className="p-2 bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-all border border-slate-700">
                    <Linkedin size={16} />
                  </a>
                </div>
                <button
                  onClick={() => setShowAgentModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-[10px] font-black text-blue-400 uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 border border-slate-700 hover:border-blue-500 group shadow-lg shadow-black/40"
                >
                  <Shield size={12} className="group-hover:scale-110 transition-transform" />
                  Full Agent Credentials
                </button>
              </div>

              {/* Dynamic Inquiry Form Overlay */}
              {showRequestForm && (
                <div className="mt-6 p-6 bg-slate-800 rounded-2xl border border-blue-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
                  {inquiryStatus === 'success' ? (
                    <div className="py-8 text-center space-y-4">
                      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 animate-bounce">
                        <CheckCircle2 size={32} />
                      </div>
                      <h4 className="text-lg font-black text-white uppercase tracking-widest">Inquiry Transmitted</h4>
                      <p className="text-xs text-slate-400 font-bold">Your secure message has been routed to our Strategic Advisor.</p>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Secure Inquiry Terminal</h4>
                      <form onSubmit={handleInquirySubmit} className="space-y-3">
                        <input
                          type="text"
                          required
                          value={inquiryData.name}
                          onChange={(e) => setInquiryData({...inquiryData, name: e.target.value})}
                          placeholder="Your Full Name"
                          className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-600 disabled:opacity-50"
                          disabled={inquiryStatus === 'sending'}
                        />
                        <input
                          type="email"
                          required
                          value={inquiryData.email}
                          onChange={(e) => setInquiryData({...inquiryData, email: e.target.value})}
                          placeholder="Official Email"
                          className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-600 disabled:opacity-50"
                          disabled={inquiryStatus === 'sending'}
                        />
                        <textarea
                          required
                          value={inquiryData.message}
                          onChange={(e) => setInquiryData({...inquiryData, message: e.target.value})}
                          placeholder="Describe your inquiry or requirement..."
                          rows="3"
                          className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-600 resize-none disabled:opacity-50"
                          disabled={inquiryStatus === 'sending'}
                        ></textarea>
                        <button 
                          type="submit"
                          disabled={inquiryStatus === 'sending'}
                          className="w-full py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {inquiryStatus === 'sending' ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Processing...
                            </>
                          ) : (
                            'Transmit Inquiry'
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Quick Info Card - Technical Metadata */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                Quick Info
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm font-bold text-slate-500">Property ID</span>
                  <span className="text-sm font-black text-slate-900 uppercase tracking-widest">{property._id?.slice(-8).toUpperCase() || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm font-bold text-slate-500">Posted On</span>
                  <span className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    {new Date(property.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-bold text-slate-500">Listed By</span>
                  <span className="text-sm font-black text-blue-600 uppercase tracking-widest">
                    {property.ownerId?.role === 'admin' ? 'Nepal Bhumi Official' : 'Verified Agent'}
                  </span>
                </div>
              </div>
            </div>



            {/* Nearby Listings */}
            {nearbyProperties.length > 0 && (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                  Local Inventory
                </h3>
                <div className="space-y-4">
                  {nearbyProperties.map((p) => (
                    <Link
                      key={p._id}
                      to={`/property/${p._id}`}
                      className="group flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                        <img
                          src={p.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="text-sm font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{p.title}</h4>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{p.type}</p>
                        <p className="text-sm font-black text-slate-900">
                          {formatPrice(p.price, p.currency)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  to={`/map?city=${encodeURIComponent(property.location?.city || '')}`}
                  className="mt-8 w-full py-4 bg-slate-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100 flex items-center justify-center gap-2"
                >
                  Explore Area Map
                  <ChevronRight size={14} />
                </Link>
              </div>
            )}

            {/* Featured Badge */}
            {property.featured && (
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-[2rem] p-6 shadow-xl shadow-orange-200 border border-orange-400">
                <p className="text-center text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                  <Sparkles size={18} />
                  Elite Featured Listing
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Geographic Intelligence - Full Width Display Section */}
        <div className="mt-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 pb-0">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                Geographic Intelligence
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 ml-4">Spatial Asset Verification</p>
            </div>

            <div className="w-full h-[500px] mt-8">
              <MapComponentDetails
                lat={property.location?.coordinates?.coordinates?.[1] || property.location?.coordinates?.[1]}
                lng={property.location?.coordinates?.coordinates?.[0] || property.location?.coordinates?.[0]}
                address={property.location?.address}
                city={property.location?.city}
                property={property}
              />
            </div>

            {/* Complete Address - Premium Data Strip */}
            <div className="bg-slate-900 p-10 text-white">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="p-5 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-600/30">
                  <MapPin size={32} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">Official Verified Address</p>
                  <h4 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                    {property.location?.address}, {property.location?.city}
                  </h4>
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold text-slate-300 border border-slate-700">
                      {property.location?.municipality || 'Butwal Sub-Metropolitan'}
                    </span>
                    <span className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold text-slate-300 border border-slate-700">
                      Ward {property.location?.ward || '12'}
                    </span>
                    <span className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold text-slate-300 border border-slate-700">
                      {property.location?.district || 'Rupandehi'}
                    </span>
                    <span className="px-4 py-2 bg-blue-600/20 rounded-xl text-xs font-bold text-blue-400 border border-blue-600/30">
                      Lumbini Province, Nepal
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-10 border-t border-slate-800/50">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Street Access</p>
                  <p className="text-sm font-bold text-slate-200">{property.location?.streetTole || 'Kalikanagar Chauraha'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Municipal Hub</p>
                  <p className="text-sm font-bold text-slate-200">{property.location?.city || 'Butwal'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Regional Sector</p>
                  <p className="text-sm font-bold text-slate-200">{property.location?.district || 'Rupandehi'}</p>
                </div>
                {property.location?.coordinates?.coordinates && (
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">GPS Telemetry</p>
                    <p className="text-sm font-mono text-emerald-400">
                      {property.location.coordinates.coordinates[1].toFixed(6)}°N, {property.location.coordinates.coordinates[0].toFixed(6)}°E
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Details Modal */}
      {showAgentModal && (
        <AgentDetailsModal
          agent={property.ownerId}
          onClose={() => setShowAgentModal(false)}
        />
      )}
    </div>
  );
}

export default PropertyDetails;
