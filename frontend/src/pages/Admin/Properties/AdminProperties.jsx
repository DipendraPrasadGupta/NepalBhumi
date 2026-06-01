import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, MapPin, Home, Edit2, Trash2, ExternalLink, X, ImagePlus, AlertCircle, Bed, Bath, Square, Zap, Package, Eye, Navigation, DollarSign, Activity, Layers, CheckCircle2, Save, Sparkles, Shield, ChevronRight, ChevronLeft, Info, Building, Waves, Leaf, Snowflake, Flame } from 'lucide-react';
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

// Fallback for icons that might be missing in some lucide versions
const PoolIcon = Waves || Eye;
const GardenIcon = Leaf || Home;
const AcIcon = Snowflake || Zap;
const GeyserIcon = Flame || Zap;

const PropertyForm = ({ initialData, onSubmit, onCancel, loading, mode = 'create' }) => {
  const [step, setStep] = useState(1);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [newHighlight, setNewHighlight] = useState('');
  const typeDropdownRef = React.useRef(null);

  // Cache Bust: 2024-04-29T15:07
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'flat',
    purpose: initialData?.purpose || 'rent',
    status: initialData?.status || 'pending',
    price: initialData?.price || '',
    currency: initialData?.currency || 'NPR',
    videoUrl: initialData?.videoUrl || '',
    location: {
      province: initialData?.location?.province || '',
      district: initialData?.location?.district || '',
      municipality: initialData?.location?.municipality || '',
      city: initialData?.location?.city || '',
      ward: initialData?.location?.ward || '',
      streetTole: initialData?.location?.streetTole || '',
      landmark: initialData?.location?.landmark || '',
      postalCode: initialData?.location?.postalCode || '',
      address: initialData?.location?.address || '',
      country: initialData?.location?.country || 'Nepal',
      coordinates: initialData?.location?.coordinates?.coordinates || [85.3240, 27.7172]
    },
    features: {
      bedrooms: initialData?.features?.bedrooms || 0,
      bathrooms: initialData?.features?.bathrooms || 0,
      area: initialData?.features?.area || 0,
      furnished: initialData?.features?.furnished || 'unfurnished',
      floor: initialData?.features?.floor || '',
      facing: initialData?.features?.facing || 'East',
      totalFloors: initialData?.features?.totalFloors || '',
      builtYear: initialData?.features?.builtYear || new Date().getFullYear(),
      highlights: initialData?.features?.highlights || []
    },
    amenities: initialData?.amenities || []
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState(initialData?.images || []);

  useEffect(() => {
    if (initialData?.images) {
      setExistingImages(initialData.images);
      setPreviews(initialData.images.map(img => img.url));
    }
  }, [initialData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setShowTypeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const steps = [
    { id: 1, title: 'Intelligence', desc: 'Core Data', icon: Sparkles },
    { id: 2, title: 'Geography', desc: 'Precise Location', icon: MapPin },
    { id: 3, title: 'Architecture', desc: 'Physical Metrics', icon: Layers },
    { id: 4, title: 'Comfort', desc: 'Amenity Matrix', icon: Zap },
    { id: 5, title: 'Media', desc: 'Visual Assets', icon: ImagePlus },
  ];

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 10 - (existingImages.length + selectedImages.length);
    
    if (remainingSlots <= 0) {
      alert('Maximum limit of 10 images reached.');
      return;
    }

    const validFiles = files
      .filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024)
      .slice(0, remainingSlots);

    if (validFiles.length < files.length && files.length > 0) {
      alert(`Only the first ${validFiles.length} valid images were added (Max 10 total).`);
    }

    if (validFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...validFiles]);
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => setPreviews(prev => [...prev, e.target.result]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setPreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      const relativeIndex = index - existingImages.length;
      setSelectedImages(prev => prev.filter((_, i) => i !== relativeIndex));
      setPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const ASSET_TYPES = [
    { value: 'house', label: 'Residential House 🏠', group: 'Residential' },
    { value: 'flat', label: 'Residential Flat 🏢', group: 'Residential' },
    { value: 'apartment', label: 'Modern Apartment 🏢', group: 'Residential' },
    { value: 'single-family', label: 'Single Family Home 🏡', group: 'Residential' },
    { value: 'multi-family', label: 'Multi-Family Building 🏘️', group: 'Residential' },
    { value: 'studio', label: 'Studio Apartment 📦', group: 'Residential' },
    { value: 'penthouse', label: 'Luxury Penthouse 🏰', group: 'Residential' },
    { value: 'single-room', label: 'Single Room 🛏️', group: 'Residential' },
    { value: 'sharing-room', label: 'Sharing Room 👥', group: 'Residential' },
    { value: '1bhk', label: '1 BHK Apartment 🏠', group: 'Residential' },
    { value: '2bhk', label: '2 BHK Apartment 🏠', group: 'Residential' },
    { value: '3bhk', label: '3 BHK Apartment 🏠', group: 'Residential' },
    
    { value: 'commercial', label: 'Commercial Building 🏪', group: 'Commercial' },
    { value: 'office-space', label: 'Office Space 💼', group: 'Commercial' },
    { value: 'store-front', label: 'Store Front 🏬', group: 'Commercial' },
    { value: 'food-services', label: 'Food & Restaurant 🍽️', group: 'Commercial' },
    { value: 'guest-services', label: 'Guest Services / Hotel 🛏️', group: 'Commercial' },
    { value: 'medical-services', label: 'Medical Services 🏥', group: 'Commercial' },
    { value: 'mixed-commercial', label: 'Mixed Commercial 🏢', group: 'Commercial' },
    
    { value: 'industrial', label: 'Industrial Site 🏗️', group: 'Industrial' },
    { value: 'warehouse', label: 'Warehouse 🏭', group: 'Industrial' },
    { value: 'workshop', label: 'Workshop 🔧', group: 'Industrial' },
    
    { value: 'land', label: 'Strategic Land 🌍', group: 'Land & Others' },
    { value: 'agricultural', label: 'Agricultural Land 🌾', group: 'Land & Others' },
    { value: 'mixed-use', label: 'Mixed Use Development 🌆', group: 'Land & Others' },
  ];

  const AMENITIES = [
    { value: 'water-supply', label: 'Water Supply', icon: Home, group: 'Utilities' },
    { value: 'electricity', label: 'Stable Power', icon: Zap, group: 'Utilities' },
    { value: 'power-backup', label: 'Power Backup', icon: Shield, group: 'Utilities' },
    { value: 'waste-management', label: 'Waste Management', icon: Leaf, group: 'Utilities' },
    { value: 'sewerage', label: 'Sewerage System', icon: Activity, group: 'Utilities' },
    { value: 'security', label: '24/7 Security', icon: Shield, group: 'Utilities' },
    { value: 'cctv', label: 'CCTV Surveillance', icon: Eye, group: 'Utilities' },
    { value: 'elevator', label: 'Lift / Elevator', icon: Layers, group: 'Utilities' },
    { value: 'intercom', label: 'Intercom / PABX', icon: Activity, group: 'Utilities' },
    { value: 'wifi', label: 'Internet / WiFi', icon: Zap, group: 'Utilities' },
    { value: 'fire-exit', label: 'Fire Exit', icon: Shield, group: 'Utilities' },
    
    { value: 'parking-2w', label: 'Bike Parking', icon: Building, group: 'Facilities' },
    { value: 'parking-4w', label: 'Car Parking', icon: Building, group: 'Facilities' },
    { value: 'staff-quarter', label: 'Staff Quarter', icon: Home, group: 'Facilities' },
    
    { value: 'gym', label: 'Fitness Center', icon: Activity, group: 'Amenities' },
    { value: 'pool', label: 'Swimming Pool', icon: PoolIcon, group: 'Amenities' },
    { value: 'garden', label: 'Private Garden', icon: GardenIcon, group: 'Amenities' },
    { value: 'balcony', label: 'Private Balcony', icon: Square, group: 'Amenities' },
    { value: 'community-hall', label: 'Community Hall', icon: Building, group: 'Amenities' },
    { value: 'club-house', label: 'Club House', icon: Building, group: 'Amenities' },
    { value: 'ac', label: 'Air Conditioning', icon: AcIcon, group: 'Amenities' },
    { value: 'geyser', label: 'Hot Water / Geyser', icon: GeyserIcon, group: 'Amenities' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#020617] text-white overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
      
      {/* Header with Stepper */}
      <div className="p-4 border-b border-white/5 bg-slate-950/40 backdrop-blur-3xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20`}>
              <Shield size={18} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">{mode === 'edit' ? 'Asset Modification' : 'New Listing Registration'}</h3>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Operational Protocol Alpha-9</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><X size={20} /></button>
        </div>

        {/* Professional Stepper */}
        <div className="flex items-center justify-between relative max-w-3xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-2 relative z-10 flex-1">
              <button 
                onClick={() => setStep(s.id)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-500 border ${
                  step === s.id ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/40 scale-105' : 
                  step > s.id ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {step > s.id ? <CheckCircle2 size={12} /> : <s.icon size={12} />}
              </button>
              <div className="text-center">
                <p className={`text-[8px] font-black uppercase tracking-widest ${step === s.id ? 'text-blue-400' : 'text-slate-600'}`}>{s.title}</p>
                <p className="text-[6px] text-slate-700 font-bold uppercase mt-0.5 hidden sm:block">{s.desc}</p>
              </div>
            </div>
          ))}
          {/* Progress Line */}
          <div className="absolute top-3.5 left-0 right-0 h-[1px] bg-slate-800 -z-0 mx-8">
            <div 
              className="h-full bg-blue-600 transition-all duration-700 shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gradient-to-b from-slate-950/20 to-transparent">
        
        {/* Step 1: Core Intelligence */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Headline</label>
                <input 
                  type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  placeholder="e.g. Luxury Modern Penthouse with Panoramic Views"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Description</label>
                <textarea 
                  rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                  placeholder="Describe the architectural significance and neighborhood context..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Classification</label>
                  <div className="relative" id="type-dropdown-container" ref={typeDropdownRef}>
                  <button 
                    type="button"
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white font-bold text-left flex items-center justify-between hover:border-slate-700 transition-all outline-none"
                  >
                    <span>{ASSET_TYPES.find(t => t.value === formData.type)?.label || 'Select Type'}</span>
                    <ChevronRight size={18} className={`transition-transform duration-300 ${showTypeDropdown ? 'rotate-90' : ''}`} />
                  </button>

                  {showTypeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-[100] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                        {Object.entries(
                          ASSET_TYPES.reduce((acc, curr) => {
                            if (!acc[curr.group]) acc[curr.group] = [];
                            acc[curr.group].push(curr);
                            return acc;
                          }, {})
                        ).map(([group, options]) => (
                          <div key={group} className="mb-2">
                            <div className="px-3 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">{group}</div>
                            <div className="space-y-1 mt-1">
                              {options.map(opt => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    setFormData({...formData, type: opt.value});
                                    setShowTypeDropdown(false);
                                  }}
                                  className={`w-full px-3 py-2.5 rounded-lg text-sm text-left transition-all flex items-center justify-between group ${
                                    formData.type === opt.value ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                  }`}
                                >
                                  <span>{opt.label}</span>
                                  {formData.type === opt.value && <CheckCircle2 size={14} />}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Market Strategy</label>
                  <div className="flex gap-2 p-1.5 bg-slate-950/50 border border-slate-800 rounded-2xl">
                    {['rent', 'sale'].map(p => (
                      <button 
                        key={p} type="button" onClick={() => setFormData({...formData, purpose: p})}
                        className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.purpose === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500'}`}
                      >
                        For {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {mode === 'edit' && (
                <div className="space-y-2 mt-6">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Status</label>
                  <div className="relative" id="status-dropdown-container">
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white font-bold text-sm outline-none appearance-none cursor-pointer"
                    >
                      <option value="pending" className="bg-slate-900 text-amber-400">Pending</option>
                      <option value="active" className="bg-slate-900 text-emerald-400">Active</option>
                      <option value="archived" className="bg-slate-900 text-slate-400">Archived</option>
                      <option value="sold" className="bg-slate-900 text-blue-400">Sold</option>
                      <option value="rented" className="bg-slate-900 text-blue-400">Rented</option>
                    </select>
                    <Activity size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  </div>
                </div>
              )}

              <div className="space-y-2 mt-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Valuation (NPR)</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 font-black text-sm group-focus-within:scale-110 transition-transform">NPR</div>
                  <input 
                    type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full pl-16 pr-6 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white font-black focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Geographic Coordination */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { label: 'Country', key: 'country', placeholder: 'e.g. Nepal' },
                { label: 'Province', key: 'province', placeholder: 'e.g. Lumbini' },
                { label: 'District', key: 'district', placeholder: 'e.g. Rupandehi' },
                { label: 'Municipality', key: 'municipality', placeholder: 'e.g. Butwal Sub-Metropolitan' },
                { label: 'City / Town', key: 'city', placeholder: 'e.g. Butwal' },
                { label: 'Ward No', key: 'ward', placeholder: 'e.g. 11' },
                { label: 'Zip / Postal Code', key: 'postalCode', placeholder: 'e.g. 32907' },
                { label: 'Street / Tole', key: 'streetTole', placeholder: 'e.g. Milanchowk' },
                { label: 'Landmark (Optional)', key: 'landmark', placeholder: 'e.g. Near Traffic Chowk' },
              ].map(f => (
                <div key={f.key} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{f.label}</label>
                  <input 
                    type="text" value={formData.location[f.key]} 
                    placeholder={f.placeholder}
                    onChange={(e) => setFormData({...formData, location: {...formData.location, [f.key]: e.target.value}})}
                    className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              ))}
              <div className="md:col-span-2 lg:col-span-3 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Search Address / String</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" value={formData.location.address} 
                    onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
                    className="w-full pl-12 pr-6 py-5 bg-slate-900/50 border border-slate-800 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Start typing the full address..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: About this Place / Physical Metrics */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Bed, label: 'Bedrooms', key: 'bedrooms' },
                { icon: Bath, label: 'Bathrooms', key: 'bathrooms' },
                { icon: Square, label: 'Area (sq m)', key: 'area' },
                { icon: Home, label: 'Built Year', key: 'builtYear' },
              ].map(feat => (
                <div key={feat.key} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{feat.label}</label>
                  <div className="relative group">
                    <feat.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="number"
                      value={formData.features[feat.key]} 
                      onChange={(e) => setFormData({...formData, features: {...formData.features, [feat.key]: parseInt(e.target.value) || 0}})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-white font-black text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Furnishing Status */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Furnishing</label>
                <div className="flex gap-2 p-1.5 bg-slate-950/50 border border-slate-800 rounded-2xl">
                  {['unfurnished', 'semi-furnished', 'furnished'].map(status => (
                    <button 
                      key={status} type="button" onClick={() => setFormData({...formData, features: {...formData.features, furnished: status}})}
                      className={`flex-1 py-3.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${formData.features.furnished === status ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500'}`}
                    >
                      {status.split('-').join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Facing Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Facing</label>
                <select 
                  value={formData.features.facing}
                  onChange={(e) => setFormData({...formData, features: {...formData.features, facing: e.target.value}})}
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white font-bold text-sm outline-none appearance-none cursor-pointer"
                >
                  {['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map(dir => (
                    <option key={dir} value={dir} className="bg-slate-900">{dir}</option>
                  ))}
                </select>
              </div>

              {/* Floor Level */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Floor Level</label>
                <div className="relative">
                  <Layers size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input 
                    type="text" 
                    value={formData.features.floor}
                    onChange={(e) => setFormData({...formData, features: {...formData.features, floor: e.target.value}})}
                    placeholder="e.g. 4th Floor"
                    className="w-full pl-12 pr-6 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white font-bold text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Property Highlights (Bullet Points) */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Sparkles size={14} className="text-blue-500" /> Strategic Property Highlights
              </label>
              
              <div className="relative group">
                <input 
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newHighlight.trim()) {
                      setFormData({
                        ...formData, 
                        features: {
                          ...formData.features, 
                          highlights: [...formData.features.highlights, newHighlight.trim()]
                        }
                      });
                      setNewHighlight('');
                    }
                  }}
                  placeholder="Enter a highlight and press Enter (e.g. 24/7 Water Supply, Earthquake Resistant...)"
                  className="w-full pl-5 pr-16 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white font-bold text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (newHighlight.trim()) {
                      setFormData({
                        ...formData, 
                        features: {
                          ...formData.features, 
                          highlights: [...formData.features.highlights, newHighlight.trim()]
                        }
                      });
                      setNewHighlight('');
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-black text-[9px] uppercase tracking-widest transition-all"
                >
                  Add
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.features.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800/50 rounded-xl group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                      <span className="text-sm text-slate-300 font-bold">{item}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const newHighlights = [...formData.features.highlights];
                        newHighlights.splice(idx, 1);
                        setFormData({...formData, features: {...formData.features, highlights: newHighlights}});
                      }}
                      className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Amenity Matrix */}
        {step === 4 && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {Object.entries(
              AMENITIES.reduce((acc, curr) => {
                const group = (curr.group === 'Utilities' || curr.group === 'Facilities') ? 'Utilities & Facilities' : 'Lifestyle Amenities';
                if (!acc[group]) acc[group] = [];
                acc[group].push(curr);
                return acc;
              }, {})
            ).map(([group, items]) => (
              <div key={group} className="bg-slate-950/40 p-6 rounded-[2rem] border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                    {group === 'Utilities & Facilities' ? <Shield size={18} /> : <Sparkles size={18} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest">{group}</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.1em]">Select all active systems</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {items.map(amenity => (
                    <button 
                      key={amenity.value} type="button"
                      onClick={() => {
                        const newAmenities = formData.amenities.includes(amenity.value)
                          ? formData.amenities.filter(a => a !== amenity.value)
                          : [...formData.amenities, amenity.value];
                        setFormData({...formData, amenities: newAmenities});
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-300 group ${
                        formData.amenities.includes(amenity.value) 
                        ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${formData.amenities.includes(amenity.value) ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-600'}`}>
                        <amenity.icon size={12} />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest">{amenity.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 5: Visual Documentation */}
        {step === 5 && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
              <label className="aspect-square bg-slate-950/40 border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
                <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                <Plus size={32} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-400">Add Media</span>
              </label>

              {previews.map((url, i) => (
                <div key={i} className="aspect-square rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800 relative group shadow-2xl">
                  <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <button 
                    type="button" onClick={() => removeImage(i)}
                    className="absolute top-4 right-4 w-10 h-10 bg-red-500/90 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-md"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Property Video Input */}
        {step === 5 && (
          <div className="max-w-4xl mx-auto mt-12 p-8 bg-slate-900/40 rounded-[2.5rem] border border-slate-800/60 backdrop-blur-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
                <ExternalLink size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-white">Property Video Tour</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em]">Paste link from YouTube, Facebook or TikTok</p>
              </div>
            </div>
            
            <div className="relative group">
              <input 
                type="text" 
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                className="w-full pl-6 pr-6 py-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors">
                <Sparkles size={20} />
              </div>
            </div>
            
            {formData.videoUrl && (
              <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Video Link Protocol Active</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-white/5 bg-slate-950/60 backdrop-blur-3xl flex items-center justify-between">
        <button 
          onClick={prevStep} 
          disabled={step === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 font-black text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft size={18} /> Back
        </button>

        <div className="flex gap-3">
          {step < 5 ? (
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 px-10 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95"
            >
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={() => onSubmit(formData, selectedImages)}
              disabled={loading}
              className="flex items-center gap-2 px-12 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <span className="animate-spin text-lg">◌</span> : <><Save size={18} /> {mode === 'edit' ? 'Update Asset' : 'Commit Registration'}</>}
            </button>
          ) }
        </div>
      </div>

    </div>
  );
};


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

  const handleSubmit = async (submittedFormData, submittedImages) => {
    const finalFormData = new FormData();
    Object.entries(submittedFormData).forEach(([key, value]) => {
      if (key === 'location' || key === 'features' || key === 'amenities') {
        finalFormData.append(key, JSON.stringify(value));
      } else {
        finalFormData.append(key, key === 'type' ? getBackendType(value) : value);
      }
    });

    if (submittedImages && submittedImages.length > 0) {
      submittedImages.forEach(file => finalFormData.append('images', file));
    } else if (editingProperty) {
      finalFormData.append('preserveExistingImages', 'true');
    }

    try {
      setLoading(true);
      if (editingProperty) {
        await axiosInstance.put(`/admin/properties/${editingProperty._id}`, finalFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axiosInstance.post('/admin/properties', finalFormData, {
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

  if (showModal) {
    return (
      <div className="h-[calc(100vh-150px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PropertyForm 
          initialData={editingProperty || null}
          mode={editingProperty ? 'edit' : 'create'}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          loading={loading}
        />
      </div>
    );
  }

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
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
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
                          : prop.status === 'sold' || prop.status === 'rented'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20'
                        }`}
                      >
                        <option value="active" className="bg-slate-900 text-emerald-400">Active</option>
                        <option value="pending" className="bg-slate-900 text-amber-400">Pending</option>
                        <option value="archived" className="bg-slate-900 text-slate-400">Archived</option>
                        <option value="rejected" className="bg-slate-900 text-red-400">Rejected</option>
                        <option value="sold" className="bg-slate-900 text-blue-400">Sold</option>
                        <option value="rented" className="bg-slate-900 text-blue-400">Rented</option>
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
    </div>
  );
};

export default AdminProperties;
