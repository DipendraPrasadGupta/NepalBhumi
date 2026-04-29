import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, MapPin, Star, Briefcase, Globe, Globe2, Mail, Phone, 
  ChevronLeft, ChevronDown, Award, Home, CheckCircle2, Shield,
  ArrowRight, Share2, Facebook, Twitter, Instagram, Linkedin,
  AlertCircle, X, Info, Heart, Clock, Bookmark
} from 'lucide-react';
import { userAPI, reportAPI } from '../../../api/endpoints.js';

const PublicAgentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Report State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Saved Agent State
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const REPORT_REASONS = [
    { id: 'misleading', label: 'Misleading or False Information', icon: Info },
    { id: 'fraud', label: 'Fraudulent Activity or Scam', icon: Shield },
    { id: 'unprofessional', label: 'Unprofessional Behavior', icon: User },
    { id: 'spam', label: 'Spam or Harassment', icon: AlertCircle },
    { id: 'impersonation', label: 'Identity Impersonation', icon: User },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, listingsRes] = await Promise.all([
          userAPI.getPublicProfile(id),
          userAPI.getAgentListings(id)
        ]);
        
        setAgent(profileRes.data.data);
        setListings(listingsRes.data.data || []);
        
        // Check if agent is saved (silent fail if user not logged in)
        try {
          const savedRes = await userAPI.getSavedAgents();
          const savedList = savedRes.data.data;
          setIsSaved(savedList.some(savedAgent => savedAgent._id === id));
        } catch (e) {
          // User likely not authenticated, ignore
        }
      } catch (err) {
        console.error('Error fetching agent data:', err);
        setError('Failed to load agent profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason) return;
    
    setIsReporting(true);
    try {
      const reportData = {
        targetType: 'User',
        targetId: id,
        reason: reportReason,
        description: reportDescription
      };
      
      await reportAPI.submitReport(reportData);
      
      setReportSuccess(true);
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportSuccess(false);
        setReportReason('');
        setReportDescription('');
      }, 2500);
    } catch (err) {
      console.error('Reporting failed:', err);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsReporting(false);
    }
  };

  const handleToggleSave = async () => {
    try {
      setIsSaving(true);
      const res = await userAPI.toggleSaveAgent(id);
      setIsSaved(res.data.isSaved);
    } catch (err) {
      console.error('Error saving agent:', err);
      if (err.response?.status === 401) {
        alert('Please log in to save agents to your portfolio.');
      } else {
        alert(err.response?.data?.message || 'Failed to save agent.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Retrieving Dossier...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl mb-6">
          <Shield className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-black text-white tracking-tight">Access Denied</h2>
          <p className="text-slate-400 mt-2 font-medium">{error || 'Agent protocol not found.'}</p>
        </div>
        <button 
          onClick={() => navigate('/agents')}
          className="flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
        >
          <ChevronLeft size={18} /> Return to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 pb-24">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-950 to-slate-950"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#020617] to-transparent"></div>
        
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-48 -left-24 w-72 h-72 bg-indigo-600/10 blur-[100px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-4 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="relative group">
              <div className="w-44 h-44 rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl bg-slate-900 relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                <img 
                  src={agent.avatarUrl || agent.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.name}`} 
                  alt={agent.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-xl shadow-emerald-500/20 z-20 border-4 border-slate-950">
                <CheckCircle2 size={20} strokeWidth={3} />
              </div>
            </div>

            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{agent.name}</h1>
                <div className="px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-widest backdrop-blur-md">
                  Verified Platinum Agent
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-slate-400 font-bold text-sm">
                {(agent.address?.city || agent.location) && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    <span>{agent.address?.city || agent.location}</span>
                  </div>
                )}
                {agent.work && (
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-blue-500" />
                    <span>{agent.work}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-500 fill-amber-500/20" />
                  <span className="text-white">{agent.ratings?.average?.toFixed(1) || '5.0'}</span>
                  <span className="text-slate-600 text-xs">({agent.ratings?.count || 0} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pb-2">
              <button 
                onClick={() => setIsReportModalOpen(true)}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-all text-red-500 group relative backdrop-blur-md"
                title="Report Profile"
              >
                <AlertCircle size={20} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-red-500 text-white text-[8px] font-black uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Report Protocol</span>
              </button>
              <button 
                onClick={handleToggleSave}
                disabled={isSaving}
                className={`p-4 border rounded-2xl transition-all backdrop-blur-md group relative ${
                  isSaved 
                    ? 'bg-blue-600/10 border-blue-500/50 text-blue-500 hover:bg-blue-600/20' 
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Bookmark size={20} className={isSaved ? 'fill-blue-500' : ''} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[8px] font-black uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {isSaved ? 'Saved to Dashboard' : 'Save Agent'}
                </span>
              </button>
              <button className="p-4 bg-slate-900/50 border border-white/10 rounded-2xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white backdrop-blur-md">
                <Share2 size={20} />
              </button>
              <a 
                href={`mailto:${agent.email}`}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-3"
              >
                Inquiry Agent <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Professional Dossier */}
          <div className="bg-slate-900/30 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none"></div>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Professional Dossier</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                {(agent.bio || agent.description) && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Biography & Philosophy</p>
                    <p className="text-slate-300 leading-relaxed font-medium">
                      {agent.bio || agent.description}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Administrative Presence</p>
                  <div className="bg-slate-950/50 rounded-3xl p-6 border border-white/5 flex items-start gap-5 shadow-inner group">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">HQ Operations</p>
                      <p className="text-sm font-black text-slate-200 leading-relaxed">
                        {agent.address?.street ? `${agent.address.street}, ` : ''}
                        {agent.address?.city || agent.location || 'N/A'}
                        {agent.address?.state ? `, ${agent.address.state}` : ''}
                        {agent.address?.zipCode ? ` - ${agent.address.zipCode}` : ''}
                      </p>
                      <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-tighter">Verified Operational Zone</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-950/50 border border-white/5 rounded-2xl shadow-lg">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Experience</p>
                    <p className="text-lg font-black text-white">{agent.experienceYears || '0'} Years</p>
                  </div>
                  <div className="p-5 bg-slate-950/50 border border-white/5 rounded-2xl shadow-lg">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Market Closures</p>
                    <p className="text-lg font-black text-white">{agent.salesCount || '0'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  {(agent.languages && agent.languages.length > 0) && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 shadow-md"><Globe size={18} /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Linguistic Proficiencies</p>
                        <p className="text-sm font-bold text-slate-200">{agent.languages.join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {agent.licenseNumber && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shadow-md"><Award size={18} /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">License Authentication</p>
                        <p className="text-sm font-bold text-slate-200">#{agent.licenseNumber}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-purple-400 shadow-md"><Mail size={18} /></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Secure Communication</p>
                      <p className="text-sm font-bold text-slate-200">{agent.email}</p>
                    </div>
                  </div>

                  {agent.homePage && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 shadow-md"><Globe2 size={18} /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Personal Domain</p>
                        <a 
                          href={agent.homePage.startsWith('http') ? agent.homePage : `https://${agent.homePage}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-black text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {agent.homePage.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4">
                  {[
                    { Icon: Facebook, link: agent.socialLinks?.facebook, color: 'hover:bg-blue-600' },
                    { Icon: Twitter, link: agent.socialLinks?.twitter, color: 'hover:bg-sky-500' },
                    { Icon: Instagram, link: agent.socialLinks?.instagram, color: 'hover:bg-pink-600' },
                    { Icon: Linkedin, link: agent.socialLinks?.linkedin, color: 'hover:bg-blue-700' },
                    { Icon: Phone, link: agent.socialLinks?.whatsapp ? `https://wa.me/${agent.socialLinks.whatsapp.replace(/\D/g, '')}` : null, color: 'hover:bg-emerald-600' },
                  ].map((social, i) => social.link ? (
                    <a 
                      key={i} 
                      href={social.link.startsWith('http') ? social.link : `https://${social.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-xl bg-slate-800 ${social.color} text-slate-500 hover:text-white transition-all flex items-center justify-center shadow-md`}
                    >
                      <social.Icon size={18} />
                    </a>
                  ) : null)}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Personal Insights */}
          {(agent.funFacts || agent.dreamTravel || agent.obsession || agent.timeSink) && (
            <div className="bg-slate-900/30 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none"></div>
              
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400">
                  <User size={24} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Personal Insights</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {agent.funFacts && (
                  <div className="col-span-full p-6 bg-slate-950/50 border border-white/5 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">The "Fun Facts" Dossier</p>
                    <p className="text-slate-300 font-medium italic">"{agent.funFacts}"</p>
                  </div>
                )}
                
                {agent.dreamTravel && (
                  <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 flex-shrink-0">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Dream Expedition</p>
                      <p className="text-sm font-black text-slate-200">{agent.dreamTravel}</p>
                    </div>
                  </div>
                )}

                {agent.obsession && (
                  <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-400 flex-shrink-0">
                      <Heart size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Primary Obsession</p>
                      <p className="text-sm font-black text-slate-200">{agent.obsession}</p>
                    </div>
                  </div>
                )}

                {agent.timeSink && (
                  <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 flex-shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Daily Time-Sink</p>
                      <p className="text-sm font-black text-slate-200">{agent.timeSink}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Inventory */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 shadow-md">
                  <Home size={24} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Active Inventory</h2>
              </div>
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                {listings.length} Strategic Assets
              </div>
            </div>

            {listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map((prop) => (
                  <Link 
                    key={prop._id} 
                    to={`/property/${prop._id}`}
                    className="group bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-xl"
                  >
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img 
                        src={prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800'} 
                        alt={prop.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-white">
                        For {prop.purpose}
                      </div>
                      <div className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-sm shadow-lg">
                        Rs. {prop.price?.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-black text-white mb-2 group-hover:text-blue-400 transition-colors truncate">{prop.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-500" /> {prop.location?.city}</span>
                        <span className="flex items-center gap-1.5 uppercase tracking-widest">{prop.type}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 bg-slate-950/40 border border-dashed border-slate-800 rounded-[3rem] text-center shadow-inner">
                <Home size={48} className="text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active listings in the current cycle</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Agency Card */}
          <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl space-y-8 sticky top-24 shadow-2xl">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-blue-500 border border-white/5 shadow-md">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">{agent.agencyInfo?.name || 'Independent Specialist'}</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Affiliated Agency</p>
              </div>
            </div>

            <div className="space-y-4">
              {(agent.agencyInfo?.address || agent.address?.street) && (
                <div className="flex items-start gap-4 group">
                  <MapPin className="text-slate-600 mt-1 group-hover:text-blue-500 transition-colors" size={18} />
                  <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Headquarters</p>
                    <p className="text-sm font-bold text-slate-300">{agent.agencyInfo?.address || agent.address?.street}</p>
                  </div>
                </div>
              )}
              {(agent.phone || agent.agencyInfo?.phone) && (
                <div className="flex items-center gap-4 group">
                  <Phone className="text-slate-600 group-hover:text-blue-500 transition-colors" size={18} />
                  <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Secure Line</p>
                    <p className="text-sm font-bold text-slate-300">{agent.phone || agent.agencyInfo?.phone}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <button className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/5 shadow-lg active:scale-95">
                Visit Agency Portal
              </button>
              {(agent.ratings?.count > 0 || agent.salesCount > 0) && (
                <div className="p-5 bg-blue-600/5 border border-blue-500/10 rounded-2xl space-y-2 shadow-inner">
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Trust Metrics</p>
                  <div className="flex items-center gap-2">
                    <Star className="text-amber-500 fill-amber-500" size={14} />
                    <span className="text-sm font-black text-white">Verified Performance</span>
                  </div>
                  <p className="text-[9px] text-slate-600 font-medium leading-tight mt-1">
                    {agent.ratings?.average ? `Maintains a ${agent.ratings.average.toFixed(1)}/5.0 rating` : 'Highly rated'} 
                    {agent.salesCount ? ` across ${agent.salesCount} successfully verified transactions.` : ' across all property classifications.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsReportModalOpen(false)}></div>
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 shadow-md">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Report Protocol</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Agent ID: {id}</p>
                </div>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {reportSuccess ? (
                <div className="py-10 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20 shadow-lg">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-xl font-black text-white">Report Transmitted</h4>
                  <p className="text-sm text-slate-400">Our security team has been notified and will initiate an investigation within 24 hours.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Reason Selection Input */}
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nature of Violation</label>
                    <div className="relative group">
                      <select 
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-full pl-5 pr-12 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white font-bold appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer hover:border-slate-700"
                      >
                        <option value="" className="bg-slate-900">-- Choose a Reason --</option>
                        {REPORT_REASONS.map((reason) => (
                          <option key={reason.id} value={reason.id} className="bg-slate-900 py-4">
                            {reason.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-blue-500 transition-colors">
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Context Textarea */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Additional Evidence / Context</label>
                    <textarea 
                      rows="5"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="Please provide specific details to help our moderation team investigate this protocol violation..."
                      className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white font-medium focus:ring-2 focus:ring-red-500/20 outline-none resize-none transition-all shadow-inner hover:border-slate-700"
                    ></textarea>
                  </div>

                  <button 
                    onClick={handleReportSubmit}
                    disabled={!reportReason || isReporting}
                    className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    {isReporting ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Commit Official Report'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicAgentProfile;
