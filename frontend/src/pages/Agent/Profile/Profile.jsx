import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store.js';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../../api/endpoints.js';
import {
  User, Mail, Phone, MapPin, Edit, Save, X, Camera, 
  Briefcase, Globe, Globe2, Calendar, Info, Clock, 
  Navigation, Heart, CheckCircle, AlertCircle, Loader,
  Star, Hash, Link as LinkIcon, Building, Award
} from 'lucide-react';

const AgentProfile = () => {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl || user?.profilePicture || '');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || user?.description || '',
    username: user?.username || '',
    work: user?.work || '',
    dreamTravel: user?.dreamTravel || '',
    languages: user?.languages ? user.languages.join(', ') : '',
    birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
    funFacts: user?.funFacts || '',
    timeSink: user?.timeSink || '',
    residence: user?.residence || '',
    obsession: user?.obsession || '',
    licenseNumber: user?.licenseNumber || '',
    homePage: user?.homePage || '',
    streetAddress: user?.address?.street || '',
    apartment: user?.address?.apartment || '',
    agencyName: user?.agencyInfo?.name || '',
    agencyAddress: user?.agencyInfo?.address || '',
    agencyPhone: user?.agencyInfo?.phone || '',
    experienceYears: user?.experienceYears || 0,
    salesCount: user?.salesCount || 0,
    city: user?.location || user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    whatsapp: user?.socialLinks?.whatsapp || '',
    facebook: user?.socialLinks?.facebook || '',
    twitter: user?.socialLinks?.twitter || '',
    instagram: user?.socialLinks?.instagram || '',
    linkedin: user?.socialLinks?.linkedin || '',
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = new FormData();
      // Basic Fields
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('bio', formData.bio);
      data.append('username', formData.username);
      
      // Professional Fields
      data.append('work', formData.work);
      data.append('licenseNumber', formData.licenseNumber);
      data.append('experienceYears', formData.experienceYears);
      data.append('salesCount', formData.salesCount);
      data.append('agencyInfo[name]', formData.agencyName);
      data.append('agencyInfo[address]', formData.agencyAddress);
      data.append('agencyInfo[phone]', formData.agencyPhone);
      
      // Personal Fields
      data.append('dreamTravel', formData.dreamTravel);
      data.append('birthDate', formData.birthDate);
      data.append('funFacts', formData.funFacts);
      data.append('timeSink', formData.timeSink);
      data.append('obsession', formData.obsession);
      data.append('homePage', formData.homePage);
      
      // Location Fields
      data.append('residence', formData.residence);
      data.append('address', formData.streetAddress);
      data.append('city', formData.city);
      data.append('state', formData.state);
      data.append('zipCode', formData.zipCode);
      data.append('apartment', formData.apartment);
      
      data.append('socialLinks[whatsapp]', formData.whatsapp);
      data.append('socialLinks[facebook]', formData.facebook);
      data.append('socialLinks[twitter]', formData.twitter);
      data.append('socialLinks[instagram]', formData.instagram);
      data.append('socialLinks[linkedin]', formData.linkedin);
      
      if (formData.languages) {
        const langs = formData.languages.split(',').map(l => l.trim()).filter(l => l);
        langs.forEach(l => data.append('languages', l));
      }

      if (profileImage) {
        data.append('avatar', profileImage);
      }

      const response = await userAPI.updateProfile(data);
      if (response.data.success) {
        setUser(response.data.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Synchronization Failed');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, icon: Icon, value, onChange, placeholder, type = "text", fullWidth = false }) => (
    <div className={`space-y-2 ${fullWidth ? 'col-span-full' : ''}`}>
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
        />
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10 pb-20">
      {/* Header Profile Section */}
      <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
          <div className="relative group/avatar">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl group-hover/avatar:border-blue-500/50 transition-all duration-500">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <User size={64} className="text-slate-600" />
                </div>
              )}
            </div>
            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-full opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-all duration-300">
              <Camera size={32} className="text-white mb-2" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Change Identity</span>
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>

          <div className="flex-1 text-center lg:text-left space-y-6">
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                <h1 className="text-4xl font-black text-white tracking-tight">{formData.name}</h1>
                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Agent</div>
              </div>
              <p className="text-slate-500 font-bold tracking-tight">@{formData.username || 'username'}</p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
              {[
                { label: 'License ID', value: formData.licenseNumber || 'PENDING', icon: Hash, color: 'text-blue-400' },
                { label: 'Experience', value: `${formData.experienceYears} Years`, icon: Award, color: 'text-emerald-400' },
                { label: 'Market Closures', value: formData.salesCount, icon: Star, color: 'text-amber-400' },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`p-2 bg-slate-800/50 rounded-lg ${m.color}`}>
                    <m.icon size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{m.label}</p>
                    <p className="text-sm font-black text-slate-200">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          
          {/* Section: Professional Command */}
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl space-y-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Professional Command</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Credentials & Agency</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Full Professional Name" icon={User} value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
              <InputField label="Direct Phone Line" icon={Phone} value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
              <InputField label="Assigned Username" icon={Hash} value={formData.username} onChange={(v) => setFormData({...formData, username: v})} />
              <InputField label="Current Agency" icon={Building} value={formData.agencyName} onChange={(v) => setFormData({...formData, agencyName: v})} />
              <InputField label="License ID Number" icon={Hash} value={formData.licenseNumber} onChange={(v) => setFormData({...formData, licenseNumber: v})} />
              <InputField label="Years in Industry" icon={Award} value={formData.experienceYears} onChange={(v) => setFormData({...formData, experienceYears: v})} type="number" />
              <InputField label="Total Sales Count" icon={Star} value={formData.salesCount} onChange={(v) => setFormData({...formData, salesCount: v})} type="number" />
              <InputField label="Agency Address" icon={MapPin} value={formData.agencyAddress} onChange={(v) => setFormData({...formData, agencyAddress: v})} />
              <InputField label="Agency Phone" icon={Phone} value={formData.agencyPhone} onChange={(v) => setFormData({...formData, agencyPhone: v})} />
            </div>
          </div>

          {/* Section: Geographic Presence */}
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl space-y-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Geographic Presence</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Location & Operations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Primary Residence" icon={Navigation} value={formData.residence} onChange={(v) => setFormData({...formData, residence: v})} />
              <InputField label="Operating City" icon={MapPin} value={formData.city} onChange={(v) => setFormData({...formData, city: v})} />
              <InputField label="Province / State" icon={Navigation} value={formData.state} onChange={(v) => setFormData({...formData, state: v})} />
              <InputField label="Street Address" icon={MapPin} value={formData.streetAddress} onChange={(v) => setFormData({...formData, streetAddress: v})} />
              <InputField label="Zip / Postal Code" icon={Hash} value={formData.zipCode} onChange={(v) => setFormData({...formData, zipCode: v})} />
              <InputField label="Apartment / Suite" icon={Hash} value={formData.apartment} onChange={(v) => setFormData({...formData, apartment: v})} />
            </div>
          </div>

          {/* Section: Social Connectivity */}
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl space-y-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                <Globe2 size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Social Connectivity</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Platform Syndicate</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="WhatsApp Number" icon={Phone} value={formData.whatsapp} onChange={(v) => setFormData({...formData, whatsapp: v})} placeholder="+977..." />
              <InputField label="Facebook Profile" icon={LinkIcon} value={formData.facebook} onChange={(v) => setFormData({...formData, facebook: v})} placeholder="https://facebook.com/..." />
              <InputField label="Twitter Profile" icon={LinkIcon} value={formData.twitter} onChange={(v) => setFormData({...formData, twitter: v})} placeholder="https://twitter.com/..." />
              <InputField label="Instagram Handle" icon={LinkIcon} value={formData.instagram} onChange={(v) => setFormData({...formData, instagram: v})} placeholder="@username" />
              <InputField label="LinkedIn Profile" icon={LinkIcon} value={formData.linkedin} onChange={(v) => setFormData({...formData, linkedin: v})} placeholder="https://linkedin.com/in/..." fullWidth />
            </div>
          </div>

          {/* Section: Personal Background */}
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl space-y-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Personal Background</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Bio & Life Info</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Primary Occupation" icon={Briefcase} value={formData.work} onChange={(v) => setFormData({...formData, work: v})} />
              <InputField label="Birth Date" icon={Calendar} value={formData.birthDate} onChange={(v) => setFormData({...formData, birthDate: v})} type="date" />
              <InputField label="Dream Travel Destination" icon={Navigation} value={formData.dreamTravel} onChange={(v) => setFormData({...formData, dreamTravel: v})} />
              <InputField label="Languages (Comma separated)" icon={Globe} value={formData.languages} onChange={(v) => setFormData({...formData, languages: v})} />
              <InputField label="Daily Time Sink" icon={Clock} value={formData.timeSink} onChange={(v) => setFormData({...formData, timeSink: v})} />
              <InputField label="Main Obsession" icon={Heart} value={formData.obsession} onChange={(v) => setFormData({...formData, obsession: v})} />
              <InputField label="Personal Website" icon={LinkIcon} value={formData.homePage} onChange={(v) => setFormData({...formData, homePage: v})} fullWidth />
              <div className="col-span-full space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fun Facts</label>
                <textarea 
                  rows="3"
                  value={formData.funFacts}
                  onChange={(e) => setFormData({...formData, funFacts: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold resize-none"
                  placeholder="Share something interesting..."
                ></textarea>
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Bio</label>
                <textarea 
                  rows="5"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold resize-none"
                  placeholder="Your real estate journey..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Control & Status */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl space-y-8 sticky top-24">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Account Controls</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-emerald-500" />
                  <span className="text-[13px] font-bold text-white">System Verified</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              
              {success && (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-400 text-xs font-bold text-center animate-bounce">
                  ✓ Credentials Synchronized
                </div>
              )}
              
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-400 text-xs font-bold text-center">
                  ⚠️ {error}
                </div>
              )}
            </div>

            <div className="pt-4 space-y-4">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {loading ? <Loader className="animate-spin" size={18} /> : <><Save size={18} /> Sync Command Center</>}
              </button>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Publicity Protocol</p>
              <p className="text-sm font-bold text-white">Global Agent Exposure</p>
              <p className="text-[9px] text-slate-600 font-medium leading-tight mt-2">These details populate your public agent profile, increasing your reach to potential investors.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
