import React from 'react';
import { 
  Search, TrendingUp, Eye, Trash2, User, Shield, Briefcase, 
  Mail, Phone, Calendar, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';

const AdminUsers = ({ 
  users, searchTerm, setSearchTerm, fetchUsers, 
  handleDeleteUser, handleViewUser 
}) => {
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield size={14} className="text-purple-400" />;
      case 'agent': return <Briefcase size={14} className="text-blue-400" />;
      default: return <User size={14} className="text-slate-400" />;
    }
  };

  const getRoleStyles = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'agent': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-8">
      {/* Header Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#0f172a]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800/50 shadow-2xl">
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              User Management
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                {users.length} Total
              </span>
            </h3>
            <p className="text-slate-400 text-sm font-medium">Manage permissions, roles, and account statuses for all platform users.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group/search">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-slate-500 group-focus-within/search:text-blue-400 transition-colors" size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-6 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 w-full sm:w-80 transition-all backdrop-blur-md"
              />
            </div>
            <button 
              onClick={fetchUsers} 
              className="flex items-center gap-2 px-5 py-3.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-2xl text-slate-300 hover:text-white transition-all font-bold text-sm"
            >
              <RefreshCw size={18} className="animate-hover" />
              Sync Data
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="relative overflow-hidden bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2rem] shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Full Identity</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Contact Details</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Access Level</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Membership</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-slate-800/30 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform duration-500">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0f172a] ${user.isActive !== false ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`}></div>
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-white group-hover:text-blue-400 transition-colors">{user.name || 'Unknown User'}</p>
                          <p className="text-[11px] text-slate-500 font-mono tracking-tighter">REF_{user._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5 text-[13px]">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Mail size={12} className="text-slate-500" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Phone size={12} className="text-slate-500" />
                          <span>{user.phone || 'No Contact'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-wider ${getRoleStyles(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role || 'user'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Calendar size={14} className="text-slate-500" />
                        {new Date(user.createdAt).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {user.isActive !== false ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <CheckCircle2 size={12} />
                            <span className="text-[10px] font-black uppercase">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                            <AlertCircle size={12} />
                            <span className="text-[10px] font-black uppercase">Suspended</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => handleViewUser(user)}
                          className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500 hover:text-white border border-indigo-500/20 transition-all shadow-lg hover:shadow-indigo-500/20"
                          title="View Comprehensive Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-600 hover:text-white border border-red-500/20 transition-all shadow-lg hover:shadow-red-500/20"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-600 mb-2">
                        <Search size={32} />
                      </div>
                      <p className="text-slate-400 font-medium">No users found matching your search.</p>
                      <button 
                        onClick={() => setSearchTerm('')} 
                        className="text-blue-400 text-sm font-bold hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

