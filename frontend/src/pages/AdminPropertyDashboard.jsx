import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Plus, Edit2, Trash2, Eye, EyeOff, ImagePlus, X, AlertCircle,
  Home, Zap, Package, TrendingUp, MapPin, DollarSign, Bed, Bath, Square
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

// Property type categorization for routing to appropriate components
const MAIN_PROPERTY_TYPES = [
  'Apartment',
  'Single Family',
  'Multi Family',
  'Studio',
  'Penthouse',
  'Office Space',
  'Store Front',
  'Warehouse',
  'Workshop',
  'Food Services',
  'Guest Services',
  'Medical Services',
  'Mixed Commercial',
  'Agricultural',
  'Residential',
  'Commercial',
  'Industrial',
  'Mixed Use'
];

const ROOM_TYPES = [
  'single-room',
  'sharing-room',
  'premium-room',
  '1bhk',
  '2bhk',
  '3bhk'
];

// Map frontend property type names to backend enum values
const propertyTypeMap = {
  'Apartment': 'apartment',
  'Single Family': 'single-family',
  'Multi Family': 'multi-family',
  'Studio': 'studio',
  'Penthouse': 'penthouse',
  'Office Space': 'office-space',
  'Store Front': 'store-front',
  'Warehouse': 'warehouse',
  'Workshop': 'workshop',
  'Food Services': 'food-services',
  'Guest Services': 'guest-services',
  'Medical Services': 'medical-services',
  'Mixed Commercial': 'mixed-commercial',
  'Agricultural': 'agricultural',
  'Residential': 'residential',
  'Commercial': 'commercial',
  'Industrial': 'industrial',
  'Mixed Use': 'mixed-use',
  // Room types map to themselves
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

const isMainPropertyType = (type) => MAIN_PROPERTY_TYPES.includes(type);
const isRoomType = (type) => ROOM_TYPES.includes(type);
const getBackendType = (frontendType) => propertyTypeMap[frontendType] || frontendType;

const AdminPropertyDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [purposeFilter, setPurposeFilter] = useState('all');
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

  // Fetch properties
  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (purposeFilter !== 'all') params.append('purpose', purposeFilter);
      if (search) params.append('search', search);

      const response = await axiosInstance.get(`/admin/properties?${params}`);
      setProperties(response.data.data);
      setTotalPages(response.data.pagination.pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching properties:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch properties';
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const isInitialMount = useRef(true);

  // Consolidated data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties(1);

      if (isInitialMount.current) {
        fetchStats();
        isInitialMount.current = false;
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, statusFilter, typeFilter, purposeFilter]);

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      console.warn('⚠️ No files selected');
      return;
    }

    console.log(`📸 Selected ${files.length} image(s)`);

    // Validate file types and sizes
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

    // Check if at least one image is selected when creating new property
    if (!editingProperty && selectedImages.length === 0) {
      alert('Please select at least one image for the property');
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('type', getBackendType(formData.type)); // Convert to backend format
    submitFormData.append('purpose', formData.purpose);
    submitFormData.append('price', formData.price);
    submitFormData.append('currency', formData.currency);
    submitFormData.append('status', formData.status);
    submitFormData.append('featured', formData.featured);

    // Log location data before sending
    console.log('📍 Location data to send:', formData.location);
    const locationJSON = JSON.stringify(formData.location);
    console.log('📍 Location JSON string:', locationJSON);
    submitFormData.append('location', locationJSON);

    // Log features data before sending
    console.log('🏠 Features data to send:', formData.features);
    const featuresJSON = JSON.stringify(formData.features);
    console.log('🏠 Features JSON string:', featuresJSON);
    submitFormData.append('features', featuresJSON);

    // Log amenities data before sending
    console.log('✨ Amenities data to send:', formData.amenities);
    const amenitiesJSON = JSON.stringify(formData.amenities);
    console.log('✨ Amenities JSON string:', amenitiesJSON);
    submitFormData.append('amenities', amenitiesJSON);



    // Handle images - only send new images if they exist, flag to preserve existing images
    console.log('📸 Images to upload:', selectedImages.length);
    console.log('🖼️ Image previews (existing):', imagePreview.length);

    if (selectedImages.length > 0) {
      selectedImages.forEach((file, index) => {
        console.log(`Image ${index + 1}:`, file.name, file.size, file.type);
        submitFormData.append('images', file);
      });
    } else if (editingProperty && imagePreview.length > 0) {
      // For updates with no new images, signal to preserve existing images
      console.log('📌 Preserving existing images for update');
      submitFormData.append('preserveExistingImages', 'true');
    }

    // Agent data is managed separately - not sent in property form



    // Log FormData contents
    console.log('📦 FormData contents:');
    for (let [key, value] of submitFormData.entries()) {
      if (key === 'images') {
        console.log(`  ${key}: [File] ${value.name}`);
      } else if (key !== 'agentProfilePicture') {
        console.log(`  ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
      }
    }

    try {
      setLoading(true);
      let response;

      if (editingProperty) {
        console.log('🔄 Updating property:', editingProperty._id);
        console.log('📦 Update data:', {
          title: formData.title,
          type: formData.type,
          location: formData.location,
          features: formData.features,
          amenities: formData.amenities,
          newImagesCount: selectedImages.length,
        });

        response = await axiosInstance.put(`/admin/properties/${editingProperty._id}`, submitFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('✅ Update response:', response.data);
        console.log('✅ Images preserved:', selectedImages.length === 0 ? imagePreview.length : selectedImages.length);
        alert('Property updated successfully!');
      } else {
        console.log('✅ Creating new property');
        response = await axiosInstance.post('/admin/properties', submitFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Determine where the property will be displayed
        const propertyType = formData.type;
        let displayLocation = '';

        if (isMainPropertyType(propertyType)) {
          displayLocation = '📍 PropertyMap (Main Properties)';
        } else if (isRoomType(propertyType)) {
          displayLocation = '🛏️ RoomsAndFlats (Room Listings)';
        } else {
          displayLocation = '📋 General Listings';
        }

        alert(`Property created successfully!\n\n${displayLocation}\n\nThe property will appear in the appropriate section.`);
      }

      console.log('✅ Response:', response.data);
      resetForm();

      // Force refresh with a slight delay to ensure backend has processed
      setTimeout(() => {
        fetchProperties(1);
        fetchStats();
      }, 1500);
    } catch (error) {
      console.error('❌ Error saving property:', error);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Error code:', error.code);
      console.error('Full error:', error);

      let errorMessage = 'Unknown error';

      // Check for network error
      if (!error.response) {
        if (error.code === 'ECONNREFUSED') {
          errorMessage = 'Cannot connect to server. Is the backend running on port 5000?';
        } else if (error.message === 'Network Error') {
          errorMessage = 'Network Error: Backend server is not responding. Please ensure the backend is running.';
        } else {
          errorMessage = `Network Error: ${error.message}`;
        }
      } else {
        errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      }

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
      type: 'single-room',
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
    console.log('🔍 Full property data:', JSON.stringify(property, null, 2));
    console.log('📍 Location data:', JSON.stringify(property.location, null, 2));
    console.log('🏠 Features data:', JSON.stringify(property.features, null, 2));
    console.log('✅ Agent data removed from form - will be managed separately');

    setEditingProperty(property);

    // Carefully construct location object with all fields
    const locationData = property.location || {};
    console.log('📝 Building location object with:', {
      province: locationData.province,
      district: locationData.district,
      municipality: locationData.municipality,
      ward: locationData.ward,
      streetTole: locationData.streetTole,
      address: locationData.address,
      city: locationData.city,
      lat: locationData.lat,
      lng: locationData.lng,
      landmark: locationData.landmark,
    });

    // Carefully construct features object with all fields
    const featuresData = property.features || {};
    console.log('🏠 Building features object with:', {
      bedrooms: featuresData.bedrooms,
      bathrooms: featuresData.bathrooms,
      area: featuresData.area,
      furnished: featuresData.furnished,
      builtYear: featuresData.builtYear,
      floor: featuresData.floor,
      facing: featuresData.facing,
      totalFloors: featuresData.totalFloors,
    });

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
        lat: locationData.lat || locationData.coordinates?.coordinates?.[1] || 27.7172,
        lng: locationData.lng || locationData.coordinates?.coordinates?.[0] || 85.3240,
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

    setSelectedImages([]);
    setImagePreview(property.images?.map((img) => img.url) || []);
    setShowModal(true);
    console.log('✅ Property loaded for editing - Form data set');
  };

  // Delete property
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axiosInstance.delete(`/admin/properties/${id}`);
        alert('Property deleted successfully!');
        fetchProperties(currentPage);
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Error deleting property');
      }
    }
  };

  // Update property status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`/admin/properties/${id}/status`, { status: newStatus });
      fetchProperties(currentPage);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              Property Management Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Manage and upload properties</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition font-semibold"
          >
            <Plus size={20} />
            Add Property
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Properties</p>
                  <p className="text-3xl font-bold text-blue-400">{stats?.totalProperties || 0}</p>
                </div>
                <Home size={40} className="text-blue-500/30" />
              </div>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active</p>
                  <p className="text-3xl font-bold text-green-400">{stats?.activeProperties || 0}</p>
                </div>
                <Eye size={40} className="text-green-500/30" />
              </div>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats?.pendingProperties || 0}</p>
                </div>
                <Zap size={40} className="text-yellow-500/30" />
              </div>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">For Rent</p>
                  <p className="text-3xl font-bold text-purple-400">{stats?.rentProperties || 0}</p>
                </div>
                <Package size={40} className="text-purple-500/30" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 bg-slate-700/30 border border-slate-600 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm text-slate-400 block mb-2">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, location..."
              className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="archived">Archived</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="all">All Types</option>
              <optgroup label="🛏️ Rooms">
                <option value="single-room">Single Room</option>
                <option value="sharing-room">Sharing Room</option>
                <option value="premium-room">Premium Room</option>
              </optgroup>
              <optgroup label="🏠 Residential">
                <option value="1bhk">1 BHK</option>
                <option value="2bhk">2 BHK</option>
                <option value="3bhk">3 BHK</option>
                <option value="Apartment">🏘️Apartment</option>
                <option value="Single Family">Single Family</option>
                <option value="Multi Family">Multi Family</option>
                <option value="Studio">Studio</option>
                <option value="Penthouse">Penthouse</option>
              </optgroup>
              <optgroup label="🏢 Commercial">
                <option value="Office Space">Office Space</option>
                <option value="Store Front">Store Front</option>
                <option value="Mixed Commercial">Mixed Commercial</option>
              </optgroup>
              <optgroup label="🏭 Industrial">
                <option value="Warehouse">Warehouse</option>
                <option value="Workshop">Workshop</option>
              </optgroup>
              <optgroup label="🍽️ Services">
                <option value="Food Services">Food Services</option>
                <option value="Guest Services">Guest Services</option>
                <option value="Medical Services">Medical Services</option>
              </optgroup>
              <optgroup label="🌍 Special Properties">
                <option value="Agricultural">Agricultural</option>
                <option value="Mixed Use">Mixed Use</option>
              </optgroup>
              <optgroup label="📋 Categories">
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-2">Purpose</label>
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="all">All Purposes</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-slate-700/30 border border-slate-600 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No properties found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-slate-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Property</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Featured</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property._id} className="border-b border-slate-600 hover:bg-slate-700/20 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-white truncate max-w-xs">{property.title}</p>
                          <p className="text-sm text-slate-400 flex items-center gap-1">
                            <MapPin size={14} />
                            {property.location?.city}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-slate-700/50 rounded-full capitalize">{property.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-blue-400">
                          ₹ {property.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400">{property.purpose}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={property.status}
                          onChange={(e) => handleStatusChange(property._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold border-0 ${getStatusColor(property.status)} cursor-pointer`}
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="archived">Archived</option>
                          <option value="rejected">Rejected</option>
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

            {/* Pagination */}
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
          </>
        )}
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
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-blue-400">Basic Information</h3>
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

              {/* Property Details */}
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
                    <option value="Apartment" className='text-black'>Apartment</option>
                    <option value="Single Family">Single Family</option>
                    <option value="Multi Family">Multi Family</option>
                    <option value="Studio">Studio</option>
                    <option value="Penthouse">Penthouse</option>
                  </optgroup>
                  <optgroup label="🏢 Commercial" className='text-black'>
                    <option value="Office Space">Office Space</option>
                    <option value="Store Front">Store Front</option>
                    <option value="Mixed Commercial">Mixed Commercial</option>
                  </optgroup>
                  <optgroup label="🏭 Industrial" className='text-black' >
                    <option value="Warehouse">Warehouse</option>
                    <option value="Workshop">Workshop</option>
                  </optgroup>
                  <optgroup label="🍽️ Services" className='text-black'>
                    <option value="Food Services">Food Services</option>
                    <option value="Guest Services">Guest Services</option>
                    <option value="Medical Services">Medical Services</option>
                  </optgroup>
                  <optgroup label="🌍 Special Properties" className='text-black'>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Mixed Use">Mixed Use</option>
                  </optgroup>
                  <optgroup label="📋 Categories" className='text-black'>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
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

              {/* Price */}
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
                  <option value="pending">Pending</option>
                  <option value="archived">Archived</option>
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

export default AdminPropertyDashboard;
