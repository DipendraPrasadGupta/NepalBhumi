import React, { useState, useEffect } from 'react';
import { 
  Users, Home, TrendingUp, AlertCircle, ChevronRight, Settings, BarChart3 
} from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-slate-800 ${colorClass} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-white mt-1">{value || 0}</p>
    </div>
  </div>
);

const AdminOverview = ({ stats, setActiveTab }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchRecentProperties = async () => {
      try {
        const response = await axiosInstance.get('/admin/properties?limit=6');
        setProperties(response.data.data || []);
      } catch (error) {
        console.error('Error fetching recent properties:', error);
      }
    };
    fetchRecentProperties();
  }, []);
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers} 
          icon={Users} 
          trend={12} 
          colorClass="text-blue-400"
        />
        <StatCard 
          title="Total Properties" 
          value={stats?.totalProperties} 
          icon={Home} 
          trend={8} 
          colorClass="text-emerald-400"
        />
        <StatCard 
          title="Active Listings" 
          value={stats?.activeListings} 
          icon={TrendingUp} 
          trend={5} 
          colorClass="text-indigo-400"
        />
        <StatCard 
          title="Pending Approval" 
          value={stats?.pendingProperties} 
          icon={AlertCircle} 
          trend={-2} 
          colorClass="text-amber-400"
        />
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Properties Table */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Recent Property Submissions</h3>
              <p className="text-xs text-slate-500 mt-1">Check and approve new listings</p>
            </div>
            <button onClick={() => setActiveTab('properties')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/30">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Property</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {properties.slice(0, 6).map((prop) => (
                  <tr key={prop._id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors">
                          <Home size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-200 truncate max-w-[200px]">{prop.title}</p>
                          <p className="text-[10px] text-slate-500">{new Date(prop.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400 capitalize">{prop.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-blue-400">Rs. {prop.price?.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        prop.status === 'active' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-500 hover:text-white transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Tasks */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-xl font-bold mb-2">Platform Control</h3>
            <p className="text-blue-100 text-sm mb-6">Access all administrative tools and management features.</p>
            <div className="space-y-3">
              <button onClick={() => setActiveTab('settings')} className="w-full py-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all">
                <Settings size={18} /> Configure System
              </button>
              <button onClick={() => setActiveTab('analytics')} className="w-full py-3 bg-white rounded-2xl text-blue-600 flex items-center justify-center gap-2 font-bold text-sm transition-all hover:shadow-xl">
                <BarChart3 size={18} /> View Reports
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-blue-400" /> System Tasks
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Pending property reviews', count: stats?.pendingProperties || 0, color: 'bg-amber-500' },
                { label: 'Unread user inquiries', count: 5, color: 'bg-blue-500' },
                { label: 'Agent verification requests', count: 2, color: 'bg-purple-500' },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-all cursor-pointer">
                  <div className={`w-1.5 h-8 ${task.color} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.label}</p>
                    <p className="text-[10px] text-slate-500">Requires attention</p>
                  </div>
                  <div className="text-sm font-bold text-white">{task.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
