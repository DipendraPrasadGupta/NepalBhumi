import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Filter, Plus, MapPin, Home, Edit2, Trash2, ExternalLink, 
  X, ImagePlus, AlertCircle, Bed, Bath, Square, Zap, Package, Eye,
  Navigation, DollarSign, Activity, Layers, CheckCircle2, Save
} from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';

// Property type categorization for routing to appropriate components
const MAIN_PROPERTY_TYPES = [
  'Apartment', 'Single Family', 'Multi Family', 'Studio', 'Penthouse', 
  'Office Space', 'Store Front', 'Warehouse', 'Workshop', 'Food Services', 
  'Guest Services', 'Medical Services', 'Mixed Commercial', 'Agricultural', 
  'Residential', 'Commercial', 'Industrial', 'Mixed Use'
];

const ROOM_TYPES = [
  'single-room', 'sharing-room', 'premium-room', '1bhk', '2bhk', '3bhk'
];

const propertyTypeMap = {
  'Apartment': 'apartment', 'Single Family': 'single-family', 
  'Multi Family': 'multi-family', 'Studio': 'studio', 'Penthouse': 'penthouse', 
  'Office Space': 'office-space', 'Store Front': 'store-front', 
  'Warehouse': 'warehouse', 'Workshop': 'workshop', 'Food Services': 'food-services', 
  'Guest Services': 'guest-services', 'Medical Services': 'medical-services', 
  'Mixed Commercial': 'mixed-commercial', 'Agricultural': 'agricultural', 
  'Residential': 'residential', 'Commercial': 'commercial', 
  'Industrial': 'industrial', 'Mixed Use': 'mixed-use',
  'single-room': 'single-room', 'sharing-room': 'sharing-room', 
  'premium-room': 'premium-room', '1bhk': '1bhk', '2bhk': '2bhk', 
  '3bhk': '3bhk', 'house': 'house', 'flat': 'flat', 'land': 'land'
};

const getBackendType = (frontendType) => propertyTypeMap[frontendType] || frontendType;

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'flat',
    purpose: 'rent',
    price: '',
    currency: 'NPR',
    status: 'active',
    featured: false,
    location: {
      province: '', district: '', municipality: '', ward: '', 
      streetTole: '', city: 'Kathmandu', address: '', 
      lat: 27.7172, lng: 85.3240, landmark: '',
    },
    features: {
      bedrooms: 0, bathrooms: 0, area: 0, furnished: 'unfurnished', 
      builtYear: new Date().getFullYear(), floor: '', 
      facing: 'South', totalFloors: '',
    },
    amenities: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const amenitiesOptions = [
    { value: 'wifi', label: 'WiFi' }, { value: 'parking', label: 'Parking' },
    { value: 'security', label: 'Security' }, { value: 'garden', label: 'Garden' },
    { value: 'gym', label: 'Gym' }, { value: 'pool', label: 'Pool' },
    { value: 'balcony', label: 'Balcony' }, { value: 'kitchen', label: 'Kitchen' },
    { value: 'dining', label: 'Dining' }, { value: 'laundry', label: 'Laundry' },
    { value: 'elevator', label: 'Elevator' }, { value: 'water-supply', label: 'Water Supply' },
  ];

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (purposeFilter !== 'all') params.append('purpose', purposeFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await axiosInstance.get(`/admin/properties?${params}`);
      setProperties(response.data.data);
      setTotalPages(response.data.pagination.pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, typeFilter, purposeFilter]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024);
    
    setSelectedImages([...selectedImages, ...validFiles]);
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(prev => [...prev, event.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'location' || key === 'features' || key === 'amenities') {
        submitFormData.append(key, JSON.stringify(value));
      } else {
        submitFormData.append(key, key === 'type' ? getBackendType(value) : value);
      }
    });

    if (selectedImages.length > 0) {
      selectedImages.forEach(file => submitFormData.append('images', file));
    } else if (editingProperty) {
      submitFormData.append('preserveExistingImages', 'true');
    }

    try {
      setLoading(true);
      if (editingProperty) {
        await axiosInstance.put(`/admin/properties/${editingProperty._id}`, submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axiosInstance.post('/admin/properties', submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      resetForm();
      fetchProperties(currentPage);
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error saving property');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingProperty(null);
    setSelectedImages([]);
    setImagePreview([]);
    setFormData({
      title: '', description: '', type: 'flat', purpose: 'rent', price: '',
      currency: 'NPR', status: 'active', featured: false,
      location: {
        province: '', district: '', municipality: '', ward: '', 
        streetTole: '', city: 'Kathmandu', address: '', 
        lat: 27.7172, lng: 85.3240, landmark: '',
      },
      features: {
        bedrooms: 0, bathrooms: 0, area: 0, furnished: 'unfurnished', 
        builtYear: new Date().getFullYear(), floor: '', 
        facing: 'South', totalFloors: '',
      },
      amenities: [],
    });
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title || '',
      description: property.description || '',
      type: property.type || 'flat',
      purpose: property.purpose || 'rent',
      price: property.price || '',
      currency: property.currency || 'NPR',
      status: property.status || 'active',
      featured: property.featured || false,
      location: { ...property.location },
      features: { ...property.features },
      amenities: property.amenities || [],
    });
    setImagePreview(property.images?.map(img => img.url) || []);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this property permanently?')) {
      try {
        await axiosInstance.delete(`/admin/properties/${id}`);
        fetchProperties(currentPage);
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      await axiosInstance.patch(`/admin/properties/${id}/status`, { status: newStatus });
      
      // Update local state for immediate feedback
      setProperties(prev => prev.map(p => p._id === id ? { ...p, status: newStatus } : p));
      
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const InputLabel = ({ children }) => (
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block">
      {children}
    </label>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* Header & Search */}
      <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800/60 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none -mr-32 -mt-32 rounded-full"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">Property Directory</h3>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">Streamlined inventory management for NepalBhumi.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search by title, location or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-slate-950/40 border border-slate-800/80 rounded-2xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-3.5 bg-slate-950/40 border border-slate-800/80 rounded-2xl text-sm text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer hover:bg-slate-900/60 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="pending">Under Review</option>
              <option value="archived">Archived</option>
            </select>
            <button 
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl text-white font-black text-sm transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <Plus size={20} strokeWidth={3} /> <span>New Property</span>
            </button>
          </div>
        </div>
      </div>

      {/* Property Table */}
      <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/60 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50">
                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Listing Details</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Location</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Investment</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {loading && properties.length === 0 ? (
                <tr><td colSpan="5" className="px-8 py-20 text-center"><div className="flex flex-col items-center gap-4"><div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div><p className="text-slate-400 font-bold text-sm">Syncing inventory...</p></div></td></tr>
              ) : properties.length === 0 ? (
                <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-500 font-medium">No property assets found matching your criteria.</td></tr>
              ) : properties.map((prop) => (
                <tr key={prop._id} className="hover:bg-slate-800/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center text-slate-700 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all shadow-lg">
                          {prop.images?.[0] ? (
                            <img src={prop.images[0].url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                            <Home size={24} />
                          )}
                        </div>
                        {prop.featured && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg">
                            <Zap size={12} className="text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-100 max-w-[240px] truncate leading-tight">{prop.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 py-0.5 bg-slate-800/50 rounded-md border border-slate-700/50">
                            {prop.type}
                          </span>
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                            For {prop.purpose}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-300 font-bold">
                        <MapPin size={14} className="text-blue-500" />
                        <span>{prop.location?.city || 'Nepal'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium ml-5 truncate max-w-[180px]">{prop.location?.district}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-base font-black text-slate-100">
                        <span className="text-xs text-slate-500 font-medium mr-1">{prop.currency}</span>
                        {prop.price?.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{prop.purpose === 'rent' ? '/ Month' : 'Total Value'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="relative group/status">
                      <select 
                        value={prop.status}
                        onChange={(e) => handleStatusChange(prop._id, e.target.value)}
                        className={`appearance-none pl-3.5 pr-8 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm cursor-pointer outline-none transition-all ${
                          prop.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                          : prop.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                          : prop.status === 'rejected'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20'
                        }`}
                      >
                        <option value="active" className="bg-slate-900 text-emerald-400">Active</option>
                        <option value="pending" className="bg-slate-900 text-amber-400">Pending</option>
                        <option value="archived" className="bg-slate-900 text-slate-400">Archived</option>
                        <option value="rejected" className="bg-slate-900 text-red-400">Rejected</option>
                      </select>
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-50">
                        <Filter size={10} />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button 
                        onClick={() => handleEdit(prop)} 
                        className="p-3 bg-blue-500/5 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-500/10"
                        title="Edit Listing"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(prop._id)} 
                        className="p-3 bg-red-500/5 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-500/10"
                        title="Delete Listing"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        className="p-3 bg-slate-800/50 text-slate-400 rounded-xl hover:bg-slate-700 hover:text-white transition-all border border-slate-700/50"
                        title="View Live"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-8 border-t border-slate-800/40 bg-slate-950/20 flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Showing Page {currentPage} of {totalPages}</p>
            <div className="flex gap-3">
              <button 
                disabled={currentPage === 1}
                onClick={() => fetchProperties(currentPage - 1)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 rounded-xl text-xs font-black tracking-widest transition-all border border-slate-700 text-slate-300"
              >
                Previous
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => fetchProperties(currentPage + 1)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 rounded-xl text-xs font-black tracking-widest transition-all shadow-lg shadow-blue-600/20 text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal - Unified Form */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-5xl max-h-[92vh] rounded-[3rem] overflow-hidden shadow-[0_0_100px_-20px_rgba(37,99,235,0.2)] relative flex flex-col animate-in fade-in zoom-in-95 duration-500">
            
            {/* Modal Header */}
            <div className="p-8 border-b border-white/5 bg-slate-950/40 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-[1.5rem] ${editingProperty ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {editingProperty ? <Edit2 size={24} /> : <Plus size={24} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {editingProperty ? 'Modify Listing' : 'New Listing Registration'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">
                    ID: {editingProperty ? editingProperty._id : 'N/A — System Generated'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-16">
              
              {/* Basic Section */}
              <section className="animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shadow-lg"><Package size={20} /></div>
                  <div>
                    <h4 className="text-lg font-black text-slate-100 tracking-tight">Core Configuration</h4>
                    <p className="text-xs text-slate-500 font-medium">Define the primary characteristics of your property asset.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-12 space-y-2">
                    <InputLabel>Property Designation / Title</InputLabel>
                    <input 
                      required type="text" value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-100 font-bold placeholder:text-slate-700 transition-all shadow-inner"
                      placeholder="e.g. Premium West-Facing 4BHK Villa"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <InputLabel>Asset Classification</InputLabel>
                    <div className="relative">
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-100 font-bold appearance-none transition-all cursor-pointer"
                      >
                        <optgroup label="Residential Assets" className="bg-slate-900">
                          <option value="flat">Apartment / Flat</option>
                          <option value="house">Independent House</option>
                          <option value="1bhk">1 BHK Residence</option>
                          <option value="2bhk">2 BHK Residence</option>
                          <option value="3bhk">3 BHK Residence</option>
                        </optgroup>
                        <optgroup label="Rooms & Co-living" className="bg-slate-900">
                          <option value="single-room">Single Occupancy</option>
                          <option value="sharing-room">Shared Occupancy</option>
                          <option value="premium-room">Premium Suite</option>
                        </optgroup>
                        <optgroup label="Commercial Assets" className="bg-slate-900">
                          <option value="Office Space">Executive Office</option>
                          <option value="Store Front">Retail Storefront</option>
                          <option value="Warehouse">Logistics / Warehouse</option>
                        </optgroup>
                      </select>
                      <Layers size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <InputLabel>Transaction Purpose</InputLabel>
                    <div className="flex gap-2 p-1.5 bg-slate-950/50 border border-slate-800/80 rounded-2xl">
                      {['rent', 'sale'].map((p) => (
                        <button
                          key={p} type="button"
                          onClick={() => setFormData({...formData, purpose: p})}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                            formData.purpose === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <InputLabel>Valuation (NPR)</InputLabel>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 font-black text-sm">Rs.</div>
                      <input 
                        required type="number" value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-100 font-black transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <InputLabel>Operational Status</InputLabel>
                    <div className="relative">
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-100 font-bold appearance-none transition-all cursor-pointer"
                      >
                        <option value="active">Active Listing</option>
                        <option value="pending">Awaiting Review</option>
                        <option value="archived">Archived / Hidden</option>
                      </select>
                      <Activity size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                    </div>
                  </div>

                  <div className="md:col-span-8 flex items-center gap-6 mt-6 px-4">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${formData.featured ? 'bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/20' : 'border-slate-700 bg-slate-950'}`}>
                        {formData.featured && <CheckCircle2 size={16} className="text-white" />}
                      </div>
                      <input 
                        type="checkbox" className="hidden"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      />
                      <div className="space-y-0.5">
                        <span className="text-sm font-black text-slate-200 uppercase tracking-widest">Mark as Featured</span>
                        <p className="text-[10px] text-slate-500 font-medium">Highlight this asset on the homepage carousel</p>
                      </div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Location Section */}
              <section className="animate-in slide-in-from-left-4 duration-500 delay-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shadow-lg"><MapPin size={20} /></div>
                  <div>
                    <h4 className="text-lg font-black text-slate-100 tracking-tight">Geographic Data</h4>
                    <p className="text-xs text-slate-500 font-medium">Precise location coordinates for mapping and logistics.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <InputLabel>Province / State</InputLabel>
                    <input 
                      type="text" value={formData.location.province}
                      onChange={(e) => setFormData({...formData, location: {...formData.location, province: e.target.value}})}
                      className="w-full px-6 py-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-100 font-bold"
                      placeholder="e.g. Bagmati"
                    />
                  </div>
                  <div className="space-y-2">
                    <InputLabel>Administrative District</InputLabel>
                    <input 
                      type="text" value={formData.location.district}
                      onChange={(e) => setFormData({...formData, location: {...formData.location, district: e.target.value}})}
                      className="w-full px-6 py-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-100 font-bold"
                      placeholder="e.g. Kathmandu"
                    />
                  </div>
                  <div className="space-y-2">
                    <InputLabel>Local Municipality</InputLabel>
                    <input 
                      type="text" value={formData.location.municipality}
                      onChange={(e) => setFormData({...formData, location: {...formData.location, municipality: e.target.value}})}
                      className="w-full px-6 py-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-100 font-bold"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <InputLabel>Precise Street Address & Navigation Landmark</InputLabel>
                    <div className="relative">
                      <input 
                        required type="text" value={formData.location.address}
                        onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
                        className="w-full pl-14 pr-6 py-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-100 font-bold transition-all shadow-inner"
                        placeholder="e.g. House 45, Lalitpur Marg, Opposite Central Bank"
                      />
                      <Navigation size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Features & Amenities */}
              <section className="animate-in slide-in-from-left-4 duration-500 delay-200">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shadow-lg"><Zap size={20} /></div>
                  <div>
                    <h4 className="text-lg font-black text-slate-100 tracking-tight">Features & Infrastructure</h4>
                    <p className="text-xs text-slate-500 font-medium">Detailed specifications of the built-up area and amenities.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { icon: Bed, label: 'Beds', key: 'bedrooms', color: 'text-blue-400' },
                    { icon: Bath, label: 'Baths', key: 'bathrooms', color: 'text-cyan-400' },
                    { icon: Square, label: 'Area (sq m)', key: 'area', color: 'text-emerald-400' },
                  ].map((feat) => (
                    <div key={feat.key} className="space-y-2">
                      <InputLabel>{feat.label}</InputLabel>
                      <div className="relative group">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${feat.color} group-focus-within:scale-110 transition-transform`}>
                          <feat.icon size={18} />
                        </div>
                        <input 
                          type="number" value={formData.features[feat.key]}
                          onChange={(e) => setFormData({...formData, features: {...formData.features, [feat.key]: parseInt(e.target.value) || 0}})}
                          className="w-full pl-12 pr-4 py-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-100 font-black text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <InputLabel>Furnishing</InputLabel>
                    <select 
                      value={formData.features.furnished}
                      onChange={(e) => setFormData({...formData, features: {...formData.features, furnished: e.target.value}})}
                      className="w-full px-6 py-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-100 font-bold text-sm appearance-none cursor-pointer"
                    >
                      <option value="unfurnished">Raw / Unfurnished</option>
                      <option value="semi-furnished">Semi-Furnished</option>
                      <option value="furnished">Fully-Furnished</option>
                    </select>
                  </div>
                </div>

                <div className="mt-10 bg-slate-950/30 p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] pointer-events-none"></div>
                  <InputLabel>In-Unit Utilities & Amenities</InputLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {amenitiesOptions.map((amenity) => (
                      <button
                        key={amenity.value} type="button"
                        onClick={() => {
                          const newAmenities = formData.amenities.includes(amenity.value)
                            ? formData.amenities.filter(a => a !== amenity.value)
                            : [...formData.amenities, amenity.value];
                          setFormData({...formData, amenities: newAmenities});
                        }}
                        className={`px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-3 relative ${
                          formData.amenities.includes(amenity.value)
                          ? 'bg-blue-600/10 border-blue-500/40 text-blue-400 shadow-lg shadow-blue-600/10'
                          : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full transition-all ${formData.amenities.includes(amenity.value) ? 'bg-blue-400 scale-125 shadow-[0_0_10px_rgba(37,99,235,0.8)]' : 'bg-slate-700'}`}></div>
                        {amenity.label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Images Section */}
              <section className="animate-in slide-in-from-left-4 duration-500 delay-300 pb-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-lg"><ImagePlus size={20} /></div>
                  <div>
                    <h4 className="text-lg font-black text-slate-100 tracking-tight">Visual Documentation</h4>
                    <p className="text-xs text-slate-500 font-medium">High-resolution assets for property visualization.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                  <label className="aspect-square bg-slate-950/40 border-2 border-dashed border-slate-800/80 rounded-[2rem] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-500/50 hover:bg-slate-900/50 transition-all group relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors"></div>
                    <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                    <div className="w-12 h-12 rounded-full bg-slate-900/80 flex items-center justify-center text-slate-600 group-hover:text-blue-400 group-hover:scale-110 transition-all border border-slate-800 group-hover:border-blue-500/30 z-10">
                      <Plus size={24} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] group-hover:text-slate-400 transition-colors z-10">Upload Media</span>
                  </label>
                  
                  {imagePreview.map((url, i) => (
                    <div key={i} className="aspect-square rounded-[2rem] overflow-hidden bg-slate-950 border border-slate-800/80 relative group shadow-xl">
                      <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <button 
                        type="button" onClick={() => removeImage(i)}
                        className="absolute top-3 right-3 w-10 h-10 bg-red-500/90 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="absolute bottom-3 left-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all delay-75">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">Image {i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </form>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-950/60 border-t border-white/5 flex items-center justify-between gap-6 backdrop-blur-2xl sticky bottom-0 z-20">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-8 py-4 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-200 transition-all"
              >
                Cancel Session
              </button>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleSubmit} disabled={loading}
                  className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{editingProperty ? 'Update Asset' : 'Commit Registration'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
