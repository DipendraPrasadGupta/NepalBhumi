import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, TrendingUp, Eye, Star, Plus, User, Settings,
  ArrowRight, MapPin, BarChart3, Activity, Bell,
  CheckCircle, Clock, AlertCircle, Loader, LogOut,
  MessageSquare, Heart, ChevronRight
} from 'lucide-react';
import { userAPI, propertyAPI } from '../api/endpoints';
import { useAuthStore } from '../store.js';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    averageRating: 0,
    ratingCount: 0,
  });
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/auth/login'); return; }
    loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [profileRes, listingsRes] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getMyListings({ limit: 100 }),
      ]);

      const profile = profileRes.data?.data || {};
      setProfileData(profile);

      const listings = listingsRes.data?.data || [];
      const active = listings.filter(p => p.status === 'active').length;
      const totalViews = listings.reduce((sum, p) => sum + (p.views || 0), 0);

      setStats({
        totalListings: listings.length,
        activeListings: active,
        totalViews,
        averageRating: profile.ratings?.average || 0,
        ratingCount: profile.ratings?.count || 0,
      });

      // Most recent 4
      setRecentListings(listings.slice(0, 4));
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const quickActions = [
    { icon: Plus, label: 'Post New Property', desc: 'Add a listing', color: 'from-blue-500 to-blue-600', onClick: () => navigate('/agent/properties') },
    { icon: Home, label: 'My Listings', desc: 'Manage properties', color: 'from-emerald-500 to-emerald-600', onClick: () => navigate('/agent/properties') },
    { icon: User, label: 'Edit Profile', desc: 'Update your info', color: 'from-violet-500 to-violet-600', onClick: () => navigate('/agent/profile') },
    { icon: BarChart3, label: 'View Analytics', desc: 'Track performance', color: 'from-amber-500 to-amber-600', onClick: () => navigate('/agent/properties') },
  ];

  const statCards = [
    { icon: Home, label: 'Total Listings', value: stats.totalListings, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { icon: CheckCircle, label: 'Active Listings', value: stats.activeListings, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { icon: Eye, label: 'Total Views', value: stats.totalViews, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { icon: Star, label: 'Avg Rating', value: stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', sub: stats.ratingCount ? `${stats.ratingCount} reviews` : 'No reviews yet' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader className="animate-spin text-blue-400" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-1">Agent Dashboard</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span>! 👋
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Here's what's happening with your listings today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/agent/properties')}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
            >
              <Plus size={18} /> Post Property
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-700/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all border border-slate-700 hover:border-red-500/30"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* ── Stat Cards ────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(({ icon: Icon, label, value, color, bg, sub }) => (
            <div key={label} className={`rounded-2xl border p-5 backdrop-blur-sm ${bg}`}>
              <div className="flex items-start justify-between mb-3">
                <Icon size={22} className={color} />
                <Activity size={14} className="text-slate-600" />
              </div>
              <p className={`text-3xl font-bold ${color} mb-0.5`}>{value}</p>
              <p className="text-xs text-slate-400 font-medium">{label}</p>
              {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick Actions */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity size={18} className="text-blue-400" /> Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map(({ icon: Icon, label, desc, color, onClick }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className="group flex flex-col items-center gap-2 p-4 bg-slate-700/40 hover:bg-slate-700/70 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-all"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <p className="text-xs font-semibold text-white text-center leading-tight">{label}</p>
                    <p className="text-[10px] text-slate-400 text-center">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Listings */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Home size={18} className="text-blue-400" /> Recent Listings
                </h2>
                <button
                  onClick={() => navigate('/agent/properties')}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight size={14} />
                </button>
              </div>

              {recentListings.length === 0 ? (
                <div className="text-center py-10 bg-slate-700/20 rounded-xl border border-slate-700/30 border-dashed">
                  <Home size={32} className="mx-auto text-slate-600 mb-2" />
                  <p className="text-slate-400 text-sm">No properties yet</p>
                  <button
                    onClick={() => navigate('/agent/properties')}
                    className="mt-3 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-600/30 transition"
                  >
                    Post your first listing
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentListings.map((listing) => (
                    <div
                      key={listing._id}
                      className="flex gap-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl p-3 border border-slate-700/40 hover:border-slate-600/60 transition-all cursor-pointer"
                      onClick={() => navigate('/agent/properties')}
                    >
                      <img
                        src={listing.images?.[0]?.url || listing.images?.[0] || 'https://placehold.co/64x64/334155/94a3b8?text=No+Image'}
                        alt={listing.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-white truncate">{listing.title}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={11} /> {listing.location?.city || 'N/A'}
                        </p>
                        <p className="text-xs text-blue-400 font-bold mt-1">
                          {listing.currency} {listing.price?.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${listing.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                          {listing.status}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Eye size={10} /> {listing.views || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right column ────────────────────────── */}
          <div className="space-y-6">

            {/* Profile Card */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm text-center">
              <div className="relative inline-block mb-4">
                {profileData?.avatarUrl ? (
                  <img
                    src={profileData.avatarUrl}
                    alt={user?.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-500/40 mx-auto"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center border-4 border-blue-500/30 mx-auto">
                    <User size={36} className="text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-800" />
              </div>
              <h3 className="text-white font-bold text-lg">{user?.name}</h3>
              <p className="text-slate-400 text-sm">{profileData?.agencyInfo?.name || 'Independent Agent'}</p>
              {stats.averageRating > 0 && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < Math.round(stats.averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} />
                  ))}
                  <span className="text-xs text-slate-400 ml-1">{stats.averageRating.toFixed(1)}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700">
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-400">{stats.totalListings}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Listings</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-emerald-400">{stats.totalViews}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Total Views</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/agent/profile')}
                className="mt-4 w-full py-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Settings size={14} /> Edit Profile
              </button>
            </div>

            {/* Performance Overview */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" /> Performance
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Active Rate', value: stats.totalListings > 0 ? Math.round((stats.activeListings / stats.totalListings) * 100) : 0, color: 'bg-emerald-500' },
                  { label: 'Avg Views / Listing', value: stats.totalListings > 0 ? Math.round(stats.totalViews / stats.totalListings) : 0, color: 'bg-blue-500', isCount: true },
                ].map(({ label, value, color, isCount }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{label}</span>
                      <span className="font-semibold text-white">{isCount ? value : `${value}%`}</span>
                    </div>
                    {!isCount && (
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
              {[
                { icon: Home, label: 'Manage Properties', path: '/agent/properties', color: 'text-blue-400' },
                { icon: User, label: 'My Profile', path: '/agent/profile', color: 'text-violet-400' },
                { icon: BarChart3, label: 'Find Local Agents', path: '/agents', color: 'text-amber-400' },
                { icon: MapPin, label: 'Explore Map', path: '/map', color: 'text-emerald-400' },
              ].map(({ icon: Icon, label, path, color }, idx, arr) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors text-sm font-medium ${idx < arr.length - 1 ? 'border-b border-slate-700/50' : ''}`}
                >
                  <Icon size={16} className={color} />
                  {label}
                  <ChevronRight size={14} className="ml-auto text-slate-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
