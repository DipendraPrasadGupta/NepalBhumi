import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Camera, Save, 
  Shield, CheckCircle, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import { useAuthStore } from '../../../store';

const AdminProfile = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    country: user?.address?.country || 'Nepal'
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show instant local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      // Temporarily update UI for immediate feedback
      setUser({ ...user, avatarUrl: reader.result });
    };
    reader.readAsDataURL(file);

    // Upload to server
    const uploadData = new FormData();
    uploadData.append('avatar', file);
    
    setLoading(true);
    try {
      const response = await axiosInstance.put('/users/profile', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setUser(response.data.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        name: formData.name,
        bio: formData.bio,
        phone: formData.phone,
        city: formData.city,
        address: formData.street // Backend expects 'address' for street string
      };
      const response = await axiosInstance.put('/users/profile', payload);
      if (response.data.success) {
        setUser(response.data.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-10 pb-20">
      {/* Header section with profile overview */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-[#0f172a]/80 backdrop-blur-xl p-10 rounded-[2rem] border border-slate-800/50 shadow-2xl flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <input 
              type="file" 
              id="admin-avatar-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
            <label 
              htmlFor="admin-avatar-upload"
              className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-6xl font-black shadow-2xl relative overflow-hidden group/avatar cursor-pointer"
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'A'
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                <Camera className="text-white" size={32} />
              </div>
            </label>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-[#0f172a] flex items-center justify-center text-white shadow-lg pointer-events-none">
              <Shield size={20} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight leading-none">{user?.name}</h2>
              <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs mt-3">Principal Administrator</p>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-800">
                <Mail size={14} className="text-slate-500" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-800">
                <Shield size={14} className="text-purple-400" />
                <span className="capitalize">{user?.role} Tier</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between border-b border-slate-800/50 pb-6">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Identity & Credentials</h3>
                  <p className="text-slate-500 text-xs font-medium mt-1">Update your professional information and public persona.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Identity Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Electronic Mail (Read Only)</label>
                  <div className="relative opacity-60">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full pl-12 pr-5 py-4 bg-slate-800/20 border border-slate-800 rounded-2xl text-slate-400 font-bold cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Phone Line</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-12 pr-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Administrative City</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="City, Nepal"
                      className="w-full pl-12 pr-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Office Address (Street)</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={formData.street}
                      onChange={(e) => setFormData({...formData, street: e.target.value})}
                      placeholder="Street, Area"
                      className="w-full pl-12 pr-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Biography</label>
                <textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows="5"
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium resize-none"
                  placeholder="Share your professional journey and expertise..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Account Status & Actions */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Account Protection</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-emerald-500" />
                  <span className="text-[13px] font-bold text-white">System Verified</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
                <p className="text-[10px] text-slate-500 font-black uppercase">Permissions</p>
                <p className="text-sm font-bold text-white">Full Super-Admin Access</p>
                <p className="text-[9px] text-slate-600 font-medium leading-tight mt-2">You have global authority to manage users, properties, and system configurations.</p>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={18} />
                    Commit Changes
                  </>
                )}
              </button>
              <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-widest">Last synchronized: Just now</p>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-red-600/10 to-transparent border border-red-500/10 rounded-[2.5rem] space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={18} className="text-red-500" />
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Security Zone</p>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">Updating your email address requires formal verification from the technical security team.</p>
          </div>
        </div>
      </div>

      {success && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 bg-emerald-500 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-500 z-[100]">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-tight">Identity Synchronized</p>
            <p className="text-[10px] text-white/80 font-bold">Your administrative profile has been updated successfully.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 bg-red-500 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(239,68,68,0.3)] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-500 z-[100]">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-tight">Synchronization Failed</p>
            <p className="text-[10px] text-white/80 font-bold">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
