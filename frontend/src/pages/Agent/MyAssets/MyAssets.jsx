import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Filter, Plus, MapPin, Home, Edit2, Trash2, ExternalLink,
  X, ImagePlus, AlertCircle, Bed, Bath, Square, Zap, Package, Eye,
  Navigation, DollarSign, Activity, Layers, CheckCircle2, Save,
  ChevronLeft, ChevronRight, Loader, Sparkles, Building, Info, Shield
} from 'lucide-react';
import { userAPI, propertyAPI } from '../../../api/endpoints.js';
import PropertyForm from '../PropertyRegistration/PropertyForm.jsx';

const MyAssets = ({ navigate, setActiveTab, autoOpenAdd, onAddOpened }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    if (autoOpenAdd) {
      setEditingProperty(null);
      setShowModal(true);
      onAddOpened();
    }
  }, [autoOpenAdd]);

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const response = await userAPI.getMyListings({ 
        page, 
        limit: 10, 
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter 
      });
      setProperties(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Network synchronization failure:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchProperties(1), 500);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const handleFormSubmit = async (formData, selectedImages) => {
    setLoading(true);
    try {
      const data = new FormData();
      ['title', 'description', 'type', 'purpose', 'price', 'currency'].forEach(key => {
        data.append(key, formData[key]);
      });
      
      data.append('location', JSON.stringify(formData.location));
      data.append('features', JSON.stringify(formData.features));
      data.append('amenities', JSON.stringify(formData.amenities));

      selectedImages.forEach(file => data.append('images', file));

      if (editingProperty) {
        await propertyAPI.updateProperty(editingProperty._id, data);
      } else {
        await propertyAPI.createProperty(data);
      }

      setShowModal(false);
      setEditingProperty(null);
      fetchProperties(currentPage);
    } catch (error) {
      alert('Asset synchronization failed: ' + (error.response?.data?.message || 'Check network protocols'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prop) => {
    setEditingProperty(prop);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Terminate this asset registration permanently?')) {
      try {
        await propertyAPI.deleteProperty(id);
        fetchProperties(currentPage);
      } catch (error) {
        console.error('Termination failed:', error);
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      {showModal ? (
        <div className="bg-[#0f172a]/40 backdrop-blur-3xl border border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl h-[calc(100vh-140px)]">
          <PropertyForm 
            initialData={editingProperty} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setShowModal(false)}
            loading={loading}
            mode={editingProperty ? 'edit' : 'create'}
          />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Search & Actions Header */}
          <div className="bg-[#0f172a]/40 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] pointer-events-none -mr-32 -mt-32 rounded-full"></div>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Asset Inventory</h3>
                <p className="text-slate-400 text-sm mt-1.5 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-emerald-500" /> Portfolio Intelligence Dashboard
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Search asset designations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-950/40 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-6 py-4 bg-slate-950/40 border border-slate-800 rounded-2xl text-sm text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer hover:bg-slate-900/60 transition-colors font-bold"
                >
                  <option value="all">Global Status</option>
                  <option value="active">Active Network</option>
                  <option value="pending">Under Review</option>
                </select>
                <button
                  onClick={() => { setEditingProperty(null); setShowModal(true); }}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/30 active:scale-95"
                >
                  <Plus size={20} /> <span>Deploy Asset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Asset Inventory Table */}
          <div className="bg-[#0f172a]/40 backdrop-blur-3xl border border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Parameters</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Geographic Data</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Valuation</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">System Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {loading && properties.length === 0 ? (
                    <tr><td colSpan="5" className="px-8 py-20 text-center"><div className="flex flex-col items-center gap-4"><Loader className="animate-spin text-blue-500" size={32} /><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Portfolio...</p></div></td></tr>
                  ) : properties.length === 0 ? (
                    <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-500 font-black text-[10px] uppercase tracking-widest italic">No asset registrations detected in current sector.</td></tr>
                  ) : properties.map((prop) => (
                    <tr key={prop._id} className="hover:bg-slate-800/20 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
                            {prop.images?.[0] ? (
                              <img src={prop.images[0].url || prop.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-700"><Home size={24} /></div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">{prop.title}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2 py-0.5 bg-slate-800/50 rounded-md border border-slate-700/50">
                                {prop.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                            <MapPin size={12} className="text-blue-500" />
                            <span>{prop.location?.city || 'Nepal'}</span>
                          </div>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest ml-5 truncate max-w-[150px]">{prop.location?.district}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-white">
                            <span className="text-[10px] text-slate-500 mr-1 font-bold">{prop.currency}</span>
                            {prop.price?.toLocaleString()}
                          </p>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">For {prop.purpose}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                          prop.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${prop.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`}></div>
                          {prop.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                          <button onClick={() => handleEdit(prop)} className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(prop._id)} className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-500/20"><Trash2 size={16} /></button>
                          <button onClick={() => navigate(`/property/${prop._id}`)} className="p-2.5 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 hover:text-white transition-all border border-slate-700"><ExternalLink size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Console */}
            {totalPages > 1 && (
              <div className="p-8 border-t border-slate-800 bg-slate-950/20 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sector Page {currentPage} of {totalPages}</p>
                <div className="flex gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => fetchProperties(currentPage - 1)}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-700 text-slate-300"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => fetchProperties(currentPage + 1)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 text-white"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAssets;
