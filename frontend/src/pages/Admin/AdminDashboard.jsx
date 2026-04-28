import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutGrid, Home, Users, User, Settings, BarChart3, Plus, Search, 
  AlertCircle, X, Trash2, MessageSquare, LogOut, 
  ChevronRight, Bell, Menu, Mail, Phone, Star, Copy, Check,
  RefreshCw, Shield, Calendar, Briefcase
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

// Import sub-components
import AdminOverview from './Overview/AdminOverview';
import AdminProperties from './Properties/AdminProperties';
import AdminUsers from './Users/AdminUsers';
import AdminMessages from './Messages/AdminMessages';
import AdminAnalytics from './Analytics/AdminAnalytics';
import AdminSettings from './Settings/AdminSettings';
import AdminProfile from './Profile/AdminProfile';
import { useAuthStore } from '../../store';

function AdminDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersError, setUsersError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [settings, setSettings] = useState({
    platformName: 'NepalBhumi',
    supportEmail: 'support@nepalbhumi.com',
    phone: '+977-1-5970000',
    address: 'Kathmandu, Nepal',
    description: 'Nepal\'s leading real estate platform for properties, rooms, and flats.',
    maintenanceMode: false,
    commissionsPercentage: 5,
    logoUrl: '',
    primaryColor: '#2563EB',
    currency: 'NPR',
    socialLinks: {
      facebook: '',
      whatsapp: '',
      instagram: ''
    }
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    propertyTypes: [],
    monthlyActivity: [],
    propertyStatus: [],
  });
  const [allPropertiesForAnalytics, setAllPropertiesForAnalytics] = useState([]);
  const [authError, setAuthError] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Messaging states
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [sentMessages, setSentMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState('');
  const messagesEndRef = useRef(null);

  // Helper functions
  const getUserId = (userField) => {
    if (!userField) return '';
    if (typeof userField === 'string') return userField;
    if (typeof userField === 'object') return userField._id || userField.id || '';
    return '';
  };

  const isMessageForUser = (message, user) => {
    if (!message || !user) return false;
    const targetUserId = getUserId(user._id || user.id);
    const recipientId = getUserId(message.recipientId);
    const senderId = getUserId(message.senderId);
    return (recipientId === targetUserId) || (senderId === targetUserId);
  };

  // API Fetches
  const fetchStats = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await axiosInstance.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch stats';
      if (error.response?.status === 401 || error.response?.status === 403) {
        setAuthError('Unauthorized access or insufficient permissions.');
      } else {
        setApiError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };



  const fetchAllPropertiesForAnalytics = async () => {
    try {
      const response = await axiosInstance.get('/admin/properties?limit=1000');
      const allProps = response.data.data || [];
      setAllPropertiesForAnalytics(allProps);
      return allProps;
    } catch (error) {
      console.error('Error fetching properties for analytics:', error);
      return [];
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setUsersError(null);
    try {
      const response = await axiosInstance.get('/admin/users?limit=100');
      const userData = response.data?.data || response.data || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsersError(error.response?.data?.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      const [sentRes, receivedRes] = await Promise.allSettled([
        axiosInstance.get('/messages/sent'),
        axiosInstance.get('/messages')
      ]);
      
      let allMsgs = [];
      if (sentRes.status === 'fulfilled' && sentRes.value.data?.data) {
        allMsgs = [...allMsgs, ...sentRes.value.data.data];
      }
      if (receivedRes.status === 'fulfilled' && receivedRes.value.data?.data) {
        allMsgs = [...allMsgs, ...receivedRes.value.data.data];
      }
      setSentMessages(allMsgs);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSettingsSave = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    setDeletingUserId(userId);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUserId) return;
    try {
      const response = await axiosInstance.delete(`/admin/users/${deletingUserId}`);
      if (response.data.success) {
        setUsers(users.filter(u => u._id !== deletingUserId));
        setIsDeleteConfirmOpen(false);
        setDeletingUserId(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !messageText.trim()) return;
    try {
      const response = await axiosInstance.post('/messages', {
        recipientId: selectedUser._id,
        recipientEmail: selectedUser.email,
        recipientName: selectedUser.name,
        message: messageText,
        senderRole: 'admin',
      });
      if (response.data.success) {
        setMessageText('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSaveEditMessage = async (messageId) => {
    if (!editingMessageText.trim()) return;
    try {
      const response = await axiosInstance.put(`/messages/${messageId}`, {
        message: editingMessageText
      });
      if (response.data.success) {
        setSentMessages(prev => prev.map(msg => msg._id === messageId ? { ...msg, message: editingMessageText } : msg));
        setEditingMessageId(null);
        setEditingMessageText('');
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const response = await axiosInstance.delete(`/messages/${messageId}`);
      if (response.data.success) {
        setSentMessages(prev => prev.filter(msg => msg._id !== messageId));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Analytics Generation
  const generateAnalyticsData = () => {
    const userGrowthData = [
      { month: 'Jan', users: Math.max(5, Math.floor(users.length * 0.2)) },
      { month: 'Feb', users: Math.max(10, Math.floor(users.length * 0.35)) },
      { month: 'Mar', users: Math.max(15, Math.floor(users.length * 0.5)) },
      { month: 'Apr', users: Math.max(20, Math.floor(users.length * 0.65)) },
      { month: 'May', users: Math.max(25, Math.floor(users.length * 0.8)) },
      { month: 'Jun', users: users.length },
    ];

    const typeMap = {};
    allPropertiesForAnalytics.forEach(prop => {
      const type = (prop.type || 'other').toLowerCase();
      typeMap[type] = (typeMap[type] || 0) + 1;
    });

    const propertyTypesData = Object.entries(typeMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    })).sort((a, b) => b.value - a.value);

    const totalListings = allPropertiesForAnalytics.length;
    const monthlyActivityData = [
      { month: 'W1', listings: Math.ceil(totalListings * 0.2), inquiries: 45, bookings: 12 },
      { month: 'W2', listings: Math.ceil(totalListings * 0.3), inquiries: 52, bookings: 18 },
      { month: 'W3', listings: Math.ceil(totalListings * 0.25), inquiries: 38, bookings: 15 },
      { month: 'W4', listings: Math.ceil(totalListings * 0.4), inquiries: 65, bookings: 22 },
    ];

    const propertyStatusData = [
      { name: 'Active', value: allPropertiesForAnalytics.filter(p => p.status === 'active').length, color: '#10b981' },
      { name: 'Pending', value: allPropertiesForAnalytics.filter(p => p.status === 'pending').length, color: '#f59e0b' },
      { name: 'Sold', value: allPropertiesForAnalytics.filter(p => p.status === 'sold').length, color: '#3b82f6' },
    ];

    const cityMap = {};
    allPropertiesForAnalytics.forEach(prop => {
      const city = prop.location?.city || 'Other';
      cityMap[city] = (cityMap[city] || 0) + 1;
    });
    const cityDistributionData = Object.entries(cityMap).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value).slice(0, 5);

    setAnalyticsData({
      userGrowth: userGrowthData,
      propertyTypes: propertyTypesData.length > 0 ? propertyTypesData : [{ name: 'N/A', value: 0 }],
      monthlyActivity: monthlyActivityData,
      propertyStatus: propertyStatusData,
      cityDistribution: cityDistributionData
    });
  };

  useEffect(() => {
    generateAnalyticsData();
  }, [users.length, allPropertiesForAnalytics.length]);

  useEffect(() => {
    fetchStats();
    fetchAllPropertiesForAnalytics();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'messaging') fetchMessages();
  }, [activeTab]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sentMessages, selectedUser]);

  // UI Components
  const NavItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
        activeTab === id 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'text-white' : 'group-hover:text-blue-400'} />
      <span className="font-medium">{label}</span>
      {activeTab === id && <ChevronRight size={16} className="ml-auto" />}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/80 backdrop-blur-2xl border-r border-slate-800/50 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Home className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">NepalBhumi</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-4 mt-4">Main Menu</div>
          <NavItem id="overview" label="Overview" icon={LayoutGrid} />
          <NavItem id="properties" label="Properties" icon={Home} />
          <NavItem id="users" label="Users" icon={Users} />
          <NavItem id="messaging" label="Messages" icon={MessageSquare} />
          <NavItem id="analytics" label="Analytics" icon={BarChart3} />
          
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-4 mt-8">System</div>
          <NavItem id="profile" label="My Profile" icon={User} />
          <NavItem id="settings" label="Settings" icon={Settings} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full bg-slate-800/30 rounded-2xl p-4 flex items-center gap-3 transition-all hover:bg-slate-800/50 ${activeTab === 'profile' ? 'ring-2 ring-blue-500/50 border border-blue-500/20' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30 overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <Users size={20} />
              )}
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-sm font-bold truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-slate-500 truncate uppercase tracking-tighter">{user?.role || 'Super Admin'}</p>
            </div>
            <button className="p-2 text-slate-500 hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#020617] relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] pointer-events-none rounded-full"></div>

        {/* Top Header */}
        <header className="h-20 bg-slate-900/40 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-8 z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white">
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white capitalize">{activeTab}</h2>
              <p className="text-xs text-slate-500 hidden sm:block">Welcome back, here's what's happening today.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative items-center">
              <Search className="absolute left-3 text-slate-500" size={18} />
              <input type="text" placeholder="Global search..." className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all" />
            </div>
            <button className="relative p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="h-8 w-px bg-slate-800 mx-2"></div>
            <button className="p-2.5 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <Plus size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar relative z-10">
          {authError && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="text-red-500" size={24} />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-400">Authorization Error</p>
                <p className="text-xs text-red-400/80">{authError}</p>
              </div>
            </div>
          )}

          {activeTab === 'overview' && <AdminOverview stats={stats} setActiveTab={setActiveTab} />}
          {activeTab === 'properties' && <AdminProperties />}
          {activeTab === 'users' && (
            <AdminUsers 
              users={users} 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              fetchUsers={fetchUsers} 
              handleDeleteUser={handleDeleteUser} 
              handleViewUser={handleViewUser}
            />
          )}
          {activeTab === 'messaging' && (
            <AdminMessages 
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              messageSearchTerm={messageSearchTerm}
              setMessageSearchTerm={setMessageSearchTerm}
              sentMessages={sentMessages}
              isMessageForUser={isMessageForUser}
              messagesLoading={messagesLoading}
              editingMessageId={editingMessageId}
              editingMessageText={editingMessageText}
              setEditingMessageText={setEditingMessageText}
              handleSaveEditMessage={handleSaveEditMessage}
              setEditingMessageId={setEditingMessageId}
              handleDeleteMessage={handleDeleteMessage}
              messageText={messageText}
              setMessageText={setMessageText}
              handleSendMessage={handleSendMessage}
              messagesEndRef={messagesEndRef}
            />
          )}
          {activeTab === 'analytics' && (
            <AdminAnalytics 
              analyticsData={analyticsData} 
              users={users} 
              allProperties={allPropertiesForAnalytics} 
            />
          )}
          {activeTab === 'settings' && (
            <AdminSettings 
              settings={settings} 
              setSettings={setSettings} 
              handleSettingsSave={handleSettingsSave} 
              loading={loading} 
              settingsSaved={settingsSaved} 
            />
          )}
          {activeTab === 'profile' && <AdminProfile />}
        </main>
      </div>

      {/* Modals */}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsDeleteConfirmOpen(false)}></div>
          <div className="bg-[#0f172a] border border-slate-800/50 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative animate-in fade-in zoom-in-95 duration-300">
            <div className="p-12 text-center">
              <div className="relative inline-flex mb-8">
                <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full"></div>
                <div className="relative w-20 h-20 bg-red-500/10 text-red-500 rounded-[2rem] flex items-center justify-center border border-red-500/20">
                  <Trash2 size={36} />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Security Protocol</h3>
              <p className="text-slate-500 font-medium mb-10">You are about to permanently purge this user account from the system. This action is irreversible.</p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleConfirmDelete} 
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 transition-all active:scale-95"
                >
                  Confirm Deletion
                </button>
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)} 
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] transition-all"
                >
                  Cancel Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal (View All Details) */}
      {isViewModalOpen && viewingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsViewModalOpen(false)}></div>
          
          <div className="bg-[#0f172a] border border-slate-800/50 w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative animate-in fade-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 -left-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full"></div>

            {/* Header section with expanded profile area */}
            <div className="relative p-10 border-b border-slate-800/50 flex flex-col sm:flex-row items-center gap-8 bg-slate-800/20">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative w-32 h-32 rounded-[2.2rem] bg-[#1e293b] border-2 border-slate-700/50 flex items-center justify-center text-white text-5xl font-black shadow-2xl overflow-hidden">
                  {viewingUser.avatarUrl ? (
                    <img src={viewingUser.avatarUrl} alt={viewingUser.name} className="w-full h-full object-cover" />
                  ) : (
                    viewingUser.name?.charAt(0) || 'U'
                  )}
                </div>
                <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-2 border-[#0f172a] text-[10px] font-black uppercase tracking-tighter shadow-lg ${viewingUser.isActive !== false ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {viewingUser.isActive !== false ? 'Verified' : 'Banned'}
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-3">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h3 className="text-3xl font-black text-white tracking-tight leading-none">{viewingUser.name}</h3>
                  <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                    viewingUser.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    viewingUser.role === 'agent' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    {viewingUser.role} Level
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-slate-400 text-sm font-medium">
                  <div className="flex items-center gap-2 group/id cursor-pointer" onClick={() => {
                    navigator.clipboard.writeText(viewingUser._id);
                    // Add a temporary tooltip or notification if needed
                  }}>
                    <span className="font-mono text-xs bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800 group-hover:border-blue-500 transition-colors">#{viewingUser._id}</span>
                    <Copy size={12} className="group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-500" />
                    <span>Member since {new Date(viewingUser.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="absolute top-8 right-8 p-3 bg-slate-800/50 hover:bg-red-500/20 hover:text-red-400 text-slate-500 rounded-2xl transition-all border border-slate-700/50 group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10 relative">
              {/* Quick Summary Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Platform Status', value: viewingUser.isActive !== false ? 'Operational' : 'Restricted', color: viewingUser.isActive !== false ? 'text-emerald-400' : 'text-red-400', icon: Shield },
                  { label: 'KYC Verification', value: viewingUser.kycVerified ? 'Completed' : 'Not Started', color: viewingUser.kycVerified ? 'text-blue-400' : 'text-amber-400', icon: Check },
                  { label: 'Last Login', value: viewingUser.lastLogin ? new Date(viewingUser.lastLogin).toLocaleDateString() : 'Never', color: 'text-white', icon: RefreshCw },
                  { label: 'Permissions', value: viewingUser.role?.toUpperCase(), color: 'text-white', icon: Users },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/40 p-5 rounded-[2rem] border border-slate-800/50 group hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-slate-800 rounded-xl text-slate-500 group-hover:text-blue-400 transition-colors">
                        <stat.icon size={16} />
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
                    </div>
                    <p className={`text-sm font-black tracking-tight ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Essential Info */}
                <div className="lg:col-span-7 space-y-10">
                  <section className="space-y-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                      <User size={14} className="text-blue-500" /> Bio & Experience
                    </h4>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        <MessageSquare size={80} />
                      </div>
                      <p className="text-slate-300 text-[15px] leading-relaxed relative z-10 font-medium italic">
                        {viewingUser.bio ? `"${viewingUser.bio}"` : "This user has not provided a professional biography yet. Information will appear here once updated by the user."}
                      </p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Phone size={14} className="text-emerald-500" /> Communication Channels
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50 flex items-center gap-4 group hover:bg-slate-800/50 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</p>
                          <p className="text-sm font-bold text-white truncate max-w-[150px]">{viewingUser.email}</p>
                        </div>
                      </div>
                      <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50 flex items-center gap-4 group hover:bg-slate-800/50 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                          <Phone size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Line</p>
                          <p className="text-sm font-bold text-white">{viewingUser.phone || 'Not Provided'}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Meta Info & Role Specifics */}
                <div className="lg:col-span-5 space-y-10">
                  <section className="space-y-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Home size={14} className="text-purple-500" /> Geographic Info
                    </h4>
                    <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800/50 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                          <BarChart3 size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Residence</p>
                          <p className="text-sm font-bold text-white">{viewingUser.address?.city || 'City'}, {viewingUser.address?.country || 'Nepal'}</p>
                        </div>
                      </div>
                      <div className="h-px bg-slate-800/50 w-full"></div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                          <Plus size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Work / Profession</p>
                          <p className="text-sm font-bold text-white">{viewingUser.work || 'Real Estate Sector'}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {viewingUser.role === 'agent' && (
                    <section className="space-y-4">
                      <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Briefcase size={14} /> Agent Professional Metrics
                      </h4>
                      <div className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-[2.5rem] space-y-6">
                        <div className="space-y-4">
                          {[
                            { label: 'License ID', val: viewingUser.licenseNumber || 'PENDING', sub: 'Verified Document' },
                            { label: 'Market Tenure', val: `${viewingUser.experienceYears || 0} Years`, sub: 'Active Experience' },
                            { label: 'Closed Deals', val: `${viewingUser.salesCount || 0} Sales`, sub: 'Success Rate' },
                          ].map((metric, i) => (
                            <div key={i} className="flex justify-between items-end border-b border-blue-500/10 pb-4 last:border-0 last:pb-0">
                              <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{metric.label}</p>
                                <p className="text-[10px] text-blue-500/60 font-medium">{metric.sub}</p>
                              </div>
                              <p className="text-lg font-black text-white tracking-tight">{metric.val}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </div>

              {/* Languages & Ratings Bottom Bar */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Multilingual Proficiency</h4>
                  <div className="flex flex-wrap gap-3">
                    {viewingUser.languages?.length > 0 ? viewingUser.languages.map(lang => (
                      <span key={lang} className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white font-bold hover:border-blue-500/50 transition-all cursor-default">
                        {lang}
                      </span>
                    )) : ['Nepali', 'English'].map(lang => (
                      <span key={lang} className="px-5 py-2.5 bg-slate-800/30 border border-slate-800 rounded-2xl text-xs text-slate-500 font-bold opacity-50">
                        {lang} (Estimated)
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Market Reputation</h4>
                  <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className={`${i < Math.round(viewingUser.ratings?.average || 4) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-white leading-none">{viewingUser.ratings?.average || 4.8}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Based on {viewingUser.ratings?.count || 24} reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Footer with Brand touch */}
            <div className="p-10 border-t border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Shield size={16} />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">NepalBhumi Data Protection</p>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all border border-slate-700 hover:border-slate-600 shadow-xl"
              >
                Exit Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
