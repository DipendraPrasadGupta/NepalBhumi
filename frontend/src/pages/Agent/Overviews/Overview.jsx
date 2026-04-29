import React from 'react';
import { 
  Home, CheckCircle, Eye, Star, Plus, Briefcase, MapPin, 
  TrendingUp, MessageSquare, Heart, ChevronRight
} from 'lucide-react';

const Overview = ({ stats, recentListings, navigate, setActiveTab }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Listings', value: stats.totalListings, icon: Home, color: 'blue', trend: 'Live' },
          { label: 'Active Market', value: stats.activeListings, icon: CheckCircle, color: 'emerald', trend: 'Active' },
          { label: 'Total Visibility', value: stats.totalViews, icon: Eye, color: 'purple', trend: 'Views' },
          { label: 'Client Rating', value: stats.averageRating ? stats.averageRating.toFixed(1) : '5.0', icon: Star, color: 'amber', trend: `${stats.ratingCount} Reviews` },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 p-6 rounded-[2rem] group hover:border-slate-700 transition-all relative overflow-hidden">
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${stat.color}-500/5 blur-[50px] rounded-full`}></div>
            <div className="flex items-start justify-between relative z-10">
              <div className={`p-3 bg-${stat.color}-500/10 rounded-2xl text-${stat.color}-400`}>
                <stat.icon size={20} />
              </div>
              <div className="px-2 py-1 bg-slate-800/50 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {stat.trend}
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-3xl font-black text-white mt-1 tracking-tight">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Access Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>
            <h3 className="text-xl font-black text-white tracking-tight mb-8">Operational Command</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setActiveTab('add-property')}
                className="flex items-center gap-5 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl hover:bg-slate-800/50 hover:border-blue-500/30 transition-all group"
              >
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/5">
                  <Plus size={24} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-white">Post New Asset</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Market Expansion</p>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('properties')}
                className="flex items-center gap-5 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/5">
                  <Briefcase size={24} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-white">Asset Inventory</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Portfolio Control</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Performance Table */}
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-white tracking-tight">Recent Activity</h3>
              <button onClick={() => setActiveTab('properties')} className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors">See Full Inventory</button>
            </div>
            <div className="space-y-4">
              {recentListings.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/20 rounded-3xl border border-slate-800 border-dashed">
                  <Home className="mx-auto text-slate-700 mb-4" size={40} />
                  <p className="text-slate-500 font-medium">Your inventory is currently empty.</p>
                </div>
              ) : (
                recentListings.map((listing) => (
                  <div key={listing._id} className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/50 rounded-3xl hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                        <img src={listing.images?.[0]?.url || listing.images?.[0] || 'https://placehold.co/64x64/334155/94a3b8?text=No+Image'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{listing.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                            <MapPin size={10} /> {listing.location?.city || 'N/A'}
                          </span>
                          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{listing.currency} {listing.price?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Status</p>
                        <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${listing.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                          {listing.status}
                        </span>
                      </div>
                      <button onClick={() => navigate(`/property/${listing._id}`)} className="p-2 text-slate-600 hover:text-white transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-xl font-black text-white tracking-tight mb-6">Market Intelligence</h3>
            <div className="space-y-6">
              {[
                { label: 'Active Inquiries', value: stats.activeInquiries || '0', icon: MessageSquare, color: 'text-blue-400' },
                { label: 'Profile Visibility', value: stats.totalViews || '0', icon: Eye, color: 'text-rose-400' },
                { label: 'Avg. Response', value: '2.4h', icon: TrendingUp, color: 'text-emerald-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 bg-slate-800/50 rounded-lg ${item.color}`}>
                      <item.icon size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-400">{item.label}</span>
                  </div>
                  <span className="text-sm font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800">
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Top Performing Area</p>
               <div className="flex items-center justify-between">
                 <span className="text-sm font-black text-white">{stats.topArea || 'N/A'}</span>
                 <span className="text-xs font-bold text-emerald-400">{stats.topAreaGrowth || '+0%'}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
