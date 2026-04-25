import React, { useState, useEffect, useRef } from 'react';
import PropertyCard from '../components/PropertyCard.jsx';
import axiosInstance from '../api/axiosInstance';
import { useLocation } from 'react-router-dom';
import {
  Search as SearchIcon, X,
  Bed, Wifi, Zap, Wind, Droplet, Flame,
  AlertCircle, Sliders, Filter, ArrowUpDown,
  MapPin, DollarSign, Home as HomeIcon
} from 'lucide-react';

function RoomsAndFlats() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Parse price range from query params
  const parsePriceRange = (priceRangeStr) => {
    if (!priceRangeStr) return { min: 0, max: Infinity };
    if (priceRangeStr === '0-10000') return { min: 0, max: 10000 };
    if (priceRangeStr === '10000-25000') return { min: 10000, max: 25000 };
    if (priceRangeStr === '25000-50000') return { min: 25000, max: 50000 };
    if (priceRangeStr === '50000') return { min: 50000, max: Infinity };
    return { min: 0, max: Infinity };
  };

  // Rooms/Flats filters
  const [roomFilters, setRoomFilters] = useState({
    type: searchParams.get('type') || '',
    location: searchParams.get('search') || '', // Use 'search' param as location
    priceRange: parsePriceRange(searchParams.get('priceRange')),
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Fetch properties from backend
  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    try {
      // Room types that should be displayed in RoomsAndFlats
      const roomTypes = ['single-room', 'sharing-room', 'premium-room', '1bhk', '2bhk', '3bhk'];

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (roomFilters.type) params.append('type', roomFilters.type);
      // Don't filter by location on backend - do it on frontend instead
      params.append('status', 'active');
      params.append('limit', 50);

      const apiUrl = import.meta.env.VITE_API_URL || 'https://nepalbhumi.onrender.com/api';
      const response = await fetch(`${apiUrl}/properties?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      let fetchedProperties = responseData.data || [];

      // Filter to only show room/flat types (not main property types like Apartment, Commercial, etc.)
      fetchedProperties = fetchedProperties.filter(prop =>
        roomTypes.includes(prop.type) ||
        // Also include standard apartment/flat properties
        (prop.type === 'Apartment' && prop.purpose === 'Rent') ||
        (prop.type === 'Studio' && prop.purpose === 'Rent')
      );

      // Sort based on sortBy value
      let sorted = [...fetchedProperties];
      if (sortBy === 'price-low') {
        sorted.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        sorted.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'newest') {
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setProperties(sorted);
      console.log('Properties loaded:', sorted.length, 'First property:', sorted[0]);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Unable to load properties. Please check your connection and try again.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const amenityOptions = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Zap },
    { id: 'kitchen', label: 'Kitchen', icon: Flame },
    { id: 'gym', label: 'Gym', icon: Wind },
    { id: 'security', label: 'Security', icon: Droplet },
    { id: 'balcony', label: 'Balcony', icon: Wind },
  ];

  const isInitialMount = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, isInitialMount.current ? 0 : 500); // No delay on mount, 500ms on subsequent changes

    isInitialMount.current = false;
    return () => clearTimeout(timer);
  }, [searchTerm, roomFilters, sortBy]);

  const handleRoomFilterChange = (field, value) => {
    setRoomFilters((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleApplyFilters = () => {
    // Amenities filtering happens automatically through filteredProperties
    // This function can be used to trigger a refresh if needed
    setMobileFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoomFilters({ type: '', location: '' });
    setSelectedAmenities([]);
    setMobileFilterOpen(false);
  };

  const sortProperties = (propsToSort) => {
    const sorted = [...propsToSort];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const filteredProperties = properties.filter((property) => {
    // Search filter - checks title, city, and address
    const matchesSearch =
      !searchTerm ||
      (property.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (property.location?.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (property.location?.address?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    // Type filter - improved matching logic
    const propertyType = (property.type?.toLowerCase() || '').trim();
    const filterType = (roomFilters.type?.toLowerCase() || '').trim();
    const matchesType = !filterType || propertyType === filterType || propertyType.includes(filterType) || filterType.includes(propertyType);

    // Location filter - check location.city and address field
    let matchesLocation = true;
    if (roomFilters.location?.trim()) {
      const locationFilter = roomFilters.location.toLowerCase().trim();
      matchesLocation =
        (property.location?.city?.toLowerCase().includes(locationFilter)) ||
        (property.location?.address?.toLowerCase().includes(locationFilter));
    }

    // Price filter
    const matchesPrice =
      property.price >= roomFilters.priceRange.min &&
      property.price <= roomFilters.priceRange.max;

    // Amenities filter - improved logic
    const matchesAmenities = selectedAmenities.length === 0 ||
      (property.amenities && selectedAmenities.every(selectedAmenity =>
        property.amenities.some(amenity =>
          amenity.toLowerCase() === selectedAmenity.toLowerCase()
        )
      ));

    return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesAmenities;
  });

  const sortedProperties = sortProperties(filteredProperties);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50  pb-16">
      {/* Professional Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-slate-700 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb & Title */}
          <div className="flex items-center gap-3 mb-6 text-blue-300/70 text-sm font-medium">
            <HomeIcon size={16} />
            <span>Home</span>
            <span>/</span>
            <span className="text-blue-300">Explore Rooms & Flats</span>
          </div>

          <div className="mb-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl border border-blue-400/50 backdrop-blur-sm">
                <Bed className="text-blue-300" size={36} />
              </div>
              <div>
                <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Find Your Perfect Room
                </h1>
                <p className="text-blue-300/90 text-lg mt-2 flex items-center gap-2">
                  <MapPin size={18} /> Discover premium accommodation across Nepal
                </p>
              </div>
            </div>
          </div>

          {/* Search & Sort Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="text-blue-300 group-focus-within:text-blue-200 transition-colors" size={22} />
              </div>
              <input
                type="text"
                placeholder="Search by location, room type, amenities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-white/15 hover:bg-white/20 border-2 border-blue-400/50 hover:border-blue-400/70 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:bg-white/25 transition-all backdrop-blur-sm font-medium shadow-lg shadow-blue-500/10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X size={20} className="text-blue-200 hover:text-blue-100" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ArrowUpDown className="text-blue-300 group-focus-within:text-blue-200 transition-colors" size={22} />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-white/15 hover:bg-white/20 border-2 border-blue-400/50 hover:border-blue-400/70 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:bg-white/25 transition-all appearance-none cursor-pointer backdrop-blur-sm font-medium shadow-lg shadow-blue-500/10"
              >
                <option value="newest" className="bg-slate-900 text-white">🆕 Newest First</option>
                <option value="price-low" className="bg-slate-900 text-white">💰 Price: Low → High</option>
                <option value="price-high" className="bg-slate-900 text-white">💸 Price: High → Low</option>
              </select>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mt-6">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${mobileFilterOpen
                  ? 'bg-blue-500/40 border border-blue-400 text-blue-100 shadow-lg shadow-blue-500/20'
                  : 'bg-white/10 border border-blue-400/40 text-blue-100 hover:bg-white/20 backdrop-blur-sm'
                }`}
            >
              <Filter size={18} />
              {mobileFilterOpen ? '✕ Hide Filters' : '⚙ Show Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 mt-6">
          <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-5 flex items-center gap-4 backdrop-blur-sm">
            <AlertCircle className="text-red-400 flex-shrink-0" size={22} />
            <div>
              <p className="text-red-300 text-sm font-semibold">Unable to load rooms</p>
              <p className="text-red-300/70 text-xs mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          {(mobileFilterOpen || window.innerWidth >= 1024) && (
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-slate-200/60 sticky top-24 space-y-7 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Filter size={22} className="text-blue-600" />
                    Filters
                  </h3>
                  {mobileFilterOpen && (
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="lg:hidden p-1 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      <X size={20} className="text-slate-500" />
                    </button>
                  )}
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-3.5 uppercase tracking-widest">🏠 Room Type</label>
                  <div className="space-y-2.5">
                    {[
                      { value: '', label: 'All Types' },
                      { value: 'single-room', label: '🛏️ Single Room' },
                      { value: 'sharing-room', label: '👥 Sharing Room' },
                      { value: 'premium-room', label: '⭐ Premium Room' },
                      { value: '1bhk', label: '🏠 1 BHK' },
                      { value: '2bhk', label: '🏠 2 BHK' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer group p-2.5 hover:bg-slate-100/50 rounded-lg transition-all">
                        <input
                          type="radio"
                          name="room-type"
                          value={option.value}
                          checked={roomFilters.type === option.value}
                          onChange={(e) => handleRoomFilterChange('type', e.target.value)}
                          className="w-4 h-4 cursor-pointer accent-blue-600 border-2 border-slate-300 transition-all"
                        />
                        <span className="text-slate-700 text-sm group-hover:text-blue-600 transition-colors font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-3.5 uppercase tracking-widest">📍 Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Kathmandu"
                    value={roomFilters.location}
                    onChange={(e) => handleRoomFilterChange('location', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
                  />
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-3.5 uppercase tracking-widest">✨ Amenities</label>
                  <div className="space-y-2.5">
                    {amenityOptions.map((amenity) => (
                      <label key={amenity.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity.label)}
                          onChange={() => toggleAmenity(amenity.label)}
                          className="w-4.5 h-4.5 rounded cursor-pointer accent-blue-600 border border-slate-300 transition-all"
                        />
                        <span className="text-slate-700 text-sm group-hover:text-blue-600 transition-colors font-medium">{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="space-y-3 pt-6 border-t border-slate-200">
                  <button
                    onClick={handleApplyFilters}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold text-sm transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <SearchIcon size={18} />
                    Apply Filters
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm border border-slate-200 transition-all duration-300"
                  >
                    ✕ Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className={`${mobileFilterOpen && window.innerWidth < 1024 ? 'hidden' : 'lg:col-span-3'}`}>
            {loading ? (
              <div className="space-y-8">
                <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl animate-pulse"></div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl h-96 animate-pulse border border-slate-200 shadow-sm"
                    ></div>
                  ))}
                </div>
              </div>
            ) : sortedProperties.length > 0 ? (
              <div className="space-y-8">
                {/* Results Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="px-5 py-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200">
                      <span className="text-blue-900 font-bold text-sm">📊 {sortedProperties.length} Result{sortedProperties.length !== 1 ? 's' : ''} Found</span>
                    </div>
                  </div>
                  {(searchTerm || Object.values(roomFilters).some(v => v)) && (
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 text-xs bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 transition-all font-semibold"
                    >
                      Clear Search & Filters
                    </button>
                  )}
                </div>

                {/* Results Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProperties.map((property, idx) => (
                    <div
                      key={property._id}
                      style={{ animation: `slideUp 0.5s ease-out ${idx * 0.1}s both` }}
                      className="hover:scale-105 transition-transform duration-300"
                    >
                      <PropertyCard
                        property={property}
                        onSaveSuccess={() => { }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 shadow-sm">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-slate-100 rounded-full">
                    <Bed size={48} className="text-slate-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">No Rooms Found</h3>
                <p className="text-slate-500 mb-8 text-sm max-w-md mx-auto leading-relaxed">
                  {searchTerm
                    ? `We couldn't find rooms matching "${searchTerm}". Try a different search or adjust your filters.`
                    : 'No rooms match your current filters. Try adjusting your search criteria.'}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all active:scale-95"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default RoomsAndFlats;
