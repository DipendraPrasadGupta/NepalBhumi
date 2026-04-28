import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Plus, Edit2, Trash2, Eye, EyeOff, ImagePlus, X, AlertCircle,
  Home, MapPin, DollarSign, Bed, Bath, Square, ArrowLeft, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { userAPI, propertyAPI } from '../../api/endpoints';

const ROOM_TYPES = [
  'single-room',
  'sharing-room',
  'premium-room',
  '1bhk',
  '2bhk',
  '3bhk',
  'house',
  'flat',
  'land'
];

const propertyTypeMap = {
  'single-room': 'single-room',
  'sharing-room': 'sharing-room',
  'premium-room': 'premium-room',
  '1bhk': '1bhk',
  '2bhk': '2bhk',
  '3bhk': '3bhk',
  'house': 'house',
  'flat': 'flat',
  'land': 'land'
};

const getBackendType = (frontendType) => propertyTypeMap[frontendType] || frontendType;

const AgentPropertyDashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);

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
      province: '',
      district: '',
      municipality: '',
      ward: '',
      streetTole: '',
      city: 'Kathmandu',
      address: '',
      lat: 27.7172,
      lng: 85.3240,
      landmark: '',
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      furnished: 'unfurnished',
      builtYear: new Date().getFullYear(),
      floor: '',
      facing: 'South',
      totalFloors: '',
    },
    amenities: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const amenitiesOptions = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'parking', label: 'Parking' },
    { value: 'security', label: 'Security' },
    { value: 'garden', label: 'Garden' },
    { value: 'gym', label: 'Gym' },
    { value: 'pool', label: 'Pool' },
    { value: 'balcony', label: 'Balcony' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'dining', label: 'Dining' },
    { value: 'laundry', label: 'Laundry' },
    { value: 'elevator', label: 'Elevator' },
    { value: 'water-supply', label: 'Water Supply' },
  ];

  // Fetch agent's properties
  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
      };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search) params.search = search;

      const response = await userAPI.getMyListings(params);
      setProperties(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching properties:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch properties';
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch agent stats
  const fetchStats = async () => {
    try {
      const response = await userAPI.getMyListings({ limit: 1000 });
      const properties = response.data.data || [];

      const activeCount = properties.filter(p => p.status === 'active').length;
      const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalInquiries = properties.reduce((sum, p) => sum + (p.inquiries?.length || 0), 0);

      setStats({
        totalProperties: properties.length,
        activeProperties: activeCount,
        totalViews,
        totalInquiries,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const isInitialMount = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties(currentPage);

      if (isInitialMount.current) {
        fetchStats();
        isInitialMount.current = false;
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage, search, statusFilter]);

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      console.warn('⚠️ No files selected');
      return;
    }

    console.log(`📸 Selected ${files.length} image(s)`);

    const validFiles = [];
    files.forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        console.warn(`❌ File ${index + 1} is not an image:`, file.type);
        alert(`File ${index + 1} (${file.name}) is not a valid image`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        console.warn(`❌ File ${index + 1} is too large:`, file.size);
        alert(`File ${index + 1} (${file.name}) is too large (max 5MB)`);
        return;
      }

      console.log(`✅ File ${index + 1} valid:`, file.name, `${(file.size / 1024).toFixed(2)}KB`, file.type);
      validFiles.push(file);
    });

    setSelectedImages([...selectedImages, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('✅ Image preview loaded for:', file.name);
        setImagePreview((prev) => [...prev, event.target.result]);
      };
      reader.onerror = () => {
        console.error('❌ Error reading file:', file.name);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove selected image
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price) {
      alert('Please fill all required fields');
      return;
    }

    if (!editingProperty && selectedImages.length === 0) {
      alert('Please select at least one image for the property');
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('type', getBackendType(formData.type));
    submitFormData.append('purpose', formData.purpose);
    submitFormData.append('price', formData.price);
    submitFormData.append('currency', formData.currency);
    submitFormData.append('status', formData.status);
    submitFormData.append('featured', formData.featured);

    console.log('📍 Location data to send:', formData.location);
    submitFormData.append('location', JSON.stringify(formData.location));

    console.log('🏠 Features data to send:', formData.features);
    submitFormData.append('features', JSON.stringify(formData.features));

    console.log('✨ Amenities data to send:', formData.amenities);
    submitFormData.append('amenities', JSON.stringify(formData.amenities));

    console.log('📸 Images to upload:', selectedImages.length);

    if (selectedImages.length > 0) {
      selectedImages.forEach((file) => {
        submitFormData.append('images', file);
      });
    } else if (editingProperty && imagePreview.length > 0) {
      console.log('📌 Preserving existing images for update');
      submitFormData.append('preserveExistingImages', 'true');
    }

    try {
      setLoading(true);
      let response;

      if (editingProperty) {
        console.log('🔄 Updating property:', editingProperty._id);
        response = await propertyAPI.updateProperty(editingProperty._id, submitFormData);
        alert('Property updated successfully!');
      } else {
        console.log('✅ Creating new property');
        response = await propertyAPI.createProperty(submitFormData);
        alert('Property created successfully!');
      }

      console.log('✅ Response:', response.data);
      resetForm();

      setTimeout(() => {
        fetchProperties(1);
        fetchStats();
      }, 1500);
    } catch (error) {
      console.error('❌ Error saving property:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      alert(`Error saving property: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setShowModal(false);
    setEditingProperty(null);
    setSelectedImages([]);
    setImagePreview([]);
    setFormData({
      title: '',
      description: '',
      type: 'flat',
      purpose: 'rent',
      price: '',
      currency: 'NPR',
      status: 'active',
      featured: false,
      location: {
        province: '',
        district: '',
        municipality: '',
        ward: '',
        streetTole: '',
        city: 'Kathmandu',
        address: '',
        lat: 27.7172,
        lng: 85.3240,
        landmark: '',
      },
      features: {
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        furnished: 'unfurnished',
        builtYear: new Date().getFullYear(),
        floor: '',
        facing: 'South',
        totalFloors: '',
      },
      amenities: [],
    });
  };

  // Edit property
  const handleEdit = (property) => {
    console.log('📝 Editing property:', property._id);
    setEditingProperty(property);

    const locationData = property.location || {};
    const featuresData = property.features || {};

    setFormData({
      title: property.title || '',
      description: property.description || '',
      type: property.type || 'flat',
      purpose: property.purpose || 'rent',
      price: property.price || '',
      currency: property.currency || 'NPR',
      status: property.status || 'active',
      featured: property.featured || false,
      location: {
        province: locationData.province || '',
        district: locationData.district || '',
        municipality: locationData.municipality || '',
        ward: locationData.ward || '',
        streetTole: locationData.streetTole || '',
        city: locationData.city || 'Kathmandu',
        address: locationData.address || '',
        lat: locationData.lat || 27.7172,
        lng: locationData.lng || 85.3240,
        landmark: locationData.landmark || '',
      },
      features: {
        bedrooms: featuresData.bedrooms || 0,
        bathrooms: featuresData.bathrooms || 0,
        area: featuresData.area || 0,
        furnished: featuresData.furnished || 'unfurnished',
        builtYear: featuresData.builtYear || new Date().getFullYear(),
        floor: featuresData.floor || '',
        facing: featuresData.facing || 'South',
        totalFloors: featuresData.totalFloors || '',
      },
      amenities: property.amenities || [],
    });

    setImagePreview(property.images || []);
    setSelectedImages([]);
    setShowModal(true);
  };

  // Delete property
  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyAPI.deleteProperty(propertyId);
        alert('Property deleted successfully!');
        fetchProperties(1);
        fetchStats();
      } catch (error) {
        console.error('Error deleting property:', error);
        alert(`Error deleting property: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Toggle property visibility
  const handleToggleVisibility = async (propertyId, newStatus) => {
    try {
      await propertyAPI.updateProperty(propertyId, { status: newStatus });
      fetchProperties(currentPage);
    } catch (error) {
      console.error('Error updating property status:', error);
      alert(`Error updating property: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/agent/profile')}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-300 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                Property Dashboard
              </h1>
              <p className="text-slate-400 text-sm mt-1">Manage your property listings</p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/40 transition-all"
          >
            <Plus size={20} />
            Post New Property
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Total Properties</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalProperties || 0}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Active</p>
              <p className="text-3xl font-bold text-green-400 mt-2">{stats.activeProperties || 0}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <p className="text-slate-400 text-sm">For Rent</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">{stats.totalProperties - (stats.activeProperties || 0)}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Total Views</p>
              <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.totalViews || 0}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Properties Table */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin">
                <div className="w-8 h-8 border-4 border-slate-600 border-t-blue-500 rounded-full"></div>
              </div>
              <p className="text-slate-400 mt-4">Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="p-12 text-center">
              <Home className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No properties yet</p>
              <p className="text-slate-500 text-sm mt-2">Start by posting your first property</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Property</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Featured</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property._id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {property.images && property.images[0] && (
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-white truncate max-w-xs">{property.title}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                              <MapPin size={14} />
                              {property.location?.city || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300 capitalize">{property.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-blue-400">
                          {property.currency} {property.price?.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400">{property.purpose}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={property.status}
                          onChange={(e) => handleToggleVisibility(property._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold border-0 cursor-pointer ${property.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                            }`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {property.featured ? (
                          <span className="text-yellow-400 font-semibold">⭐ Yes</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(property)}
                            className="p-2 hover:bg-blue-500/20 rounded-lg transition text-blue-400"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(property._id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-slate-800/50 border-t border-slate-600 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => currentPage > 1 && fetchProperties(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => currentPage < totalPages && fetchProperties(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Property Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 flex items-center justify-between shadow-lg">
              <h2 className="text-2xl font-bold">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h2>
              <button
                onClick={resetForm}
                className="hover:bg-white/20 p-2 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Home size={20} className="text-blue-400" />
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Property Title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                  <textarea
                    placeholder="Description"
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-blue-400">Property Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <optgroup label="🛏️ Rooms" className='text-black'>
                      <option value="single-room">Single Room</option>
                      <option value="sharing-room">Sharing Room</option>
                      <option value="premium-room">Premium Room</option>
                    </optgroup>
                    <optgroup label="🏠 Residential" className='text-black'>
                      <option value="1bhk">1 BHK</option>
                      <option value="2bhk">2 BHK</option>
                      <option value="3bhk">3 BHK</option>
                      <option value="flat">Flat</option>
                      <option value="house">House</option>
                    </optgroup>
                    <optgroup label="🌾 Land" className='text-black'>
                      <option value="land">Land</option>
                    </optgroup>
                  </select>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-blue-400">Price</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Price"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="NPR">NPR</option>
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold text-lg text-blue-400">Location Details</h3>
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-2 py-1">
                    <p className="text-xs text-blue-300">⚠️ Complete address details for accurate mapping</p>
                  </div>
                </div>

                {/* Address Hierarchy */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-300 block mb-2">
                      🏛️ Province <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Bagmati, Gandaki, Lumbini"
                      required
                      value={formData.location.province}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, province: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 block mb-2">
                      📍 District <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Kathmandu, Bhaktapur, Lalitpur"
                      required
                      value={formData.location.district}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, district: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 block mb-2">
                      🏘️ Municipality <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Kathmandu Metropolitan, Madhyapur Thimi"
                      required
                      value={formData.location.municipality}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, municipality: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 block mb-2">
                      🔢 Ward <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Ward 1-32 or 1, 2, 3, etc."
                      required
                      value={formData.location.ward}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, ward: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 block mb-2">
                      🛣️ Street/Tole <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Durbar Marg, Thamel, Deep Jyoti Marg"
                      required
                      value={formData.location.streetTole}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, streetTole: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 block mb-2">
                      🏙️ City <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Kathmandu, Pokhara, Butwal"
                      required
                      value={formData.location.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, city: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    📬 Google Address / Full Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Complete address for Google Maps"
                    required
                    value={formData.location.address}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, address: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">This will be displayed as the complete address on property details page</p>
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    🏷️ Landmark / Additional Info
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Near Kathmandu Durbar Square, opposite KFC"
                    value={formData.location.landmark}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, landmark: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">Optional: Nearby landmarks or additional location details</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-blue-400">Features & About This Place</h3>

                {/* Basic Features */}
                <div>
                  <label className="text-sm text-slate-300 block mb-2">Basic Features</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-blue-400 pointer-events-none">
                        <Bed size={20} />
                      </div>
                      <input
                        type="number"
                        placeholder="Bedrooms"
                        value={formData.features.bedrooms}
                        onChange={(e) => setFormData({
                          ...formData,
                          features: { ...formData.features, bedrooms: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-blue-400 pointer-events-none">
                        <Bath size={20} />
                      </div>
                      <input
                        type="number"
                        placeholder="Bathrooms"
                        value={formData.features.bathrooms}
                        onChange={(e) => setFormData({
                          ...formData,
                          features: { ...formData.features, bathrooms: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-blue-400 pointer-events-none">
                        <Square size={20} />
                      </div>
                      <input
                        type="number"
                        placeholder="Area (sq m)"
                        value={formData.features.area}
                        onChange={(e) => setFormData({
                          ...formData,
                          features: { ...formData.features, area: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Furnished Status */}
                <div>
                  <label className="text-sm text-slate-300 block mb-2">Furnished Status</label>
                  <select
                    value={formData.features.furnished}
                    onChange={(e) => setFormData({
                      ...formData,
                      features: { ...formData.features, furnished: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="unfurnished">Unfurnished</option>
                    <option value="furnished">Furnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                  </select>
                </div>

                {/* About This Place Details */}
                <div>
                  <label className="text-sm text-slate-300 block mb-2">About This Place</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Built Year"
                      value={formData.features.builtYear}
                      onChange={(e) => setFormData({
                        ...formData,
                        features: { ...formData.features, builtYear: parseInt(e.target.value) || new Date().getFullYear() }
                      })}
                      className="px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Floor (e.g., 1st, 2nd, 3rd, Ground)"
                      value={formData.features.floor}
                      onChange={(e) => setFormData({
                        ...formData,
                        features: { ...formData.features, floor: e.target.value }
                      })}
                      className="px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                    <select
                      value={formData.features.facing}
                      onChange={(e) => setFormData({
                        ...formData,
                        features: { ...formData.features, facing: e.target.value }
                      })}
                      className="px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      <option value="North">⬆️ North</option>
                      <option value="South">⬇️ South</option>
                      <option value="East">➡️ East</option>
                      <option value="West">⬅️ West</option>
                      <option value="North-East">↗️ North-East</option>
                      <option value="North-West">↖️ North-West</option>
                      <option value="South-East">↘️ South-East</option>
                      <option value="South-West">↙️ South-West</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Total Floors (e.g., 5, 10, Multi-storey)"
                      value={formData.features.totalFloors}
                      onChange={(e) => setFormData({
                        ...formData,
                        features: { ...formData.features, totalFloors: e.target.value }
                      })}
                      className="px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-blue-400">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {amenitiesOptions.map((amenity) => (
                    <label key={amenity.value} className="flex items-center gap-3 px-4 py-2 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, amenities: [...formData.amenities, amenity.value] });
                          } else {
                            setFormData({ ...formData, amenities: formData.amenities.filter((a) => a !== amenity.value) });
                          }
                        }}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status & Featured */}
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <label className="flex items-center gap-3 px-4 py-2.5">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-white">Mark as Featured</span>
                </label>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-blue-400">Images</h3>
                <label className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <ImagePlus size={32} className="text-blue-400" />
                    <span className="text-slate-400">Click to upload images</span>
                  </div>
                </label>

                {/* Image Preview */}
                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-600">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/40 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingProperty ? 'Update Property' : 'Create Property'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border-2 border-slate-600 text-slate-400 rounded-lg font-semibold hover:border-slate-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentPropertyDashboard;
