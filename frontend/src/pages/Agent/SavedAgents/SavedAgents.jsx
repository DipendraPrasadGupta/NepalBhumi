import React, { useState, useEffect } from 'react';
import { userAPI } from '../../../api/endpoints.js';
import { Shield, MapPin, Star, Briefcase, ChevronRight, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';

const SavedAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedAgents();
  }, []);

  const fetchSavedAgents = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getSavedAgents();
      setAgents(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch saved agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (agentId) => {
    try {
      await userAPI.toggleSaveAgent(agentId);
      setAgents(agents.filter(a => a._id !== agentId));
    } catch (error) {
      console.error('Failed to unsave agent:', error);
      alert('Failed to remove agent from saved list.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Syncing Directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 shadow-md">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Saved Network</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Your Curated Professional Directory</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-slate-900 border border-white/5 rounded-xl">
          <span className="text-white font-black">{agents.length}</span>
          <span className="text-slate-500 text-xs font-bold ml-2">Agents</span>
        </div>
      </div>

      {agents.length === 0 ? (
        <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-16 text-center shadow-inner backdrop-blur-xl">
          <Shield className="mx-auto text-slate-800 mb-6" size={64} />
          <h3 className="text-xl font-black text-white mb-2">No Saved Agents</h3>
          <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
            You haven't added any agents to your professional network yet. Explore the directory to find specialists to collaborate with.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent._id} className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 relative group hover:border-blue-500/30 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden shadow-inner flex-shrink-0">
                  <img 
                    src={agent.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.name}`} 
                    alt={agent.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-white truncate">{agent.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin size={12} className="text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-slate-400 font-bold truncate">{agent.address?.city || agent.location || 'Nepal'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Briefcase size={12} className="text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-slate-400 font-bold truncate">{agent.work || 'Real Estate Consultant'}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleUnsave(agent._id)}
                  className="p-2 bg-slate-950 hover:bg-red-500/10 text-slate-600 hover:text-red-500 rounded-xl transition-all"
                  title="Remove from Network"
                >
                  <UserMinus size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Experience</p>
                  <p className="text-sm font-black text-white">{agent.experienceYears || '0'} Yrs</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Performance</p>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-sm font-black text-white">{agent.ratings?.average?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <Link 
                to={`/agent/${agent._id}`}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all group/btn"
              >
                Access Dossier <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAgents;
