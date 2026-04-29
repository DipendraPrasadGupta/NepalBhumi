import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, TrendingUp, Eye, Star, Plus, User, Settings as SettingsIcon,
  ArrowRight, MapPin, BarChart3, Activity, Bell,
  CheckCircle, Clock, AlertCircle, Loader, LogOut,
  MessageSquare, Heart, ChevronRight, Menu, X, Shield,
  LayoutGrid, Laptop, Smartphone, Globe, Briefcase, Users
} from 'lucide-react';
import { userAPI, propertyAPI } from '../../api/endpoints.js';
import { useAuthStore } from '../../store.js';

// Import Modular Tabs
import Overview from './Overviews/Overview.jsx';
import Profile from './Profile/Profile.jsx';
import MyAssets from './MyAssets/MyAssets.jsx';
import Analytics from './Analytics/Analytics.jsx';
import Inquiries from './Inquiries/Inquiries.jsx';
import Settings from './Settings/Settings.jsx';

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    averageRating: 4.8,
    ratingCount: 124
  });
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await userAPI.getMyListings({ limit: 5 });
        const allListings = response.data.data || [];

        setRecentListings(allListings);

        setStats(prev => ({
          ...prev,
          totalListings: allListings.length,
          activeListings: allListings.filter(l => l.status === 'active').length,
          totalViews: allListings.reduce((acc, curr) => acc + (curr.views || 0), 0)
        }));
      } catch (error) {
        console.error('Error fetching agent stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const NavItem = ({ id, label, icon: Icon, onClick }) => (
    <button
      onClick={onClick || (() => {
        setActiveTab(id);
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
      })}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${activeTab === id
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
        : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
    >
      <Icon size={20} className={`${activeTab === id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
      {activeTab === id && (
        <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff]"></div>
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Initializing Command Center</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#020617] flex font-sans selection:bg-blue-600/30 selection:text-blue-200 overflow-hidden">

      {/* Dynamic Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/60 backdrop-blur-2xl border-r border-slate-800/50 transform transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static lg:block h-full ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-4 mb-10 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight leading-none">NepalBhumi</h1>
              <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Agent Protocol</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 px-4">Intelligence</div>
            <NavItem id="overview" label="Mission Control" icon={LayoutGrid} />
            <NavItem id="analytics" label="Market Analytics" icon={BarChart3} />

            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 px-4 mt-8">Operations</div>
            <NavItem id="properties" label="My Assets" icon={Home} />
            <NavItem id="inquiries" label="Inquiries" icon={MessageSquare} />

            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 px-4 mt-8">Systems</div>
            <NavItem id="profile" label="Agent Profile" icon={User} />
            <NavItem id="settings" label="Config" icon={SettingsIcon} />
          </nav>

          <div className="pt-6 border-t border-slate-800">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all font-bold text-sm group">
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#020617] relative h-full">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none rounded-full"></div>

        {/* Top Header */}
        <header className="h-24 bg-slate-900/40 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-8 z-40 sticky top-0 shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight capitalize">{activeTab.replace('-', ' ')}</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Operational ID: {user?._id?.slice(-8).toUpperCase() || 'UNSYNCED'}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setActiveTab('properties');
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-2xl text-white hover:bg-blue-500 transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Post Property</span>
            </button>
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-xl cursor-pointer hover:border-blue-500 transition-all">
              <img src={user?.profilePicture || user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name || 'Agent'}&background=0f172a&color=3b82f6`} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Dynamic Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar relative">
          {activeTab === 'overview' && <Overview stats={stats} recentListings={recentListings} navigate={navigate} setActiveTab={setActiveTab} />}
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'properties' && (
            <MyAssets 
              navigate={navigate} 
              setActiveTab={setActiveTab} 
              autoOpenAdd={showAddModal} 
              onAddOpened={() => setShowAddModal(false)} 
            />
          )}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'inquiries' && <Inquiries />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default AgentDashboard;
