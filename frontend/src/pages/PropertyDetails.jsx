import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { propertyAPI } from '../api/endpoints.js';
import { formatPrice } from '../utils/formatters.js';
import { MapPin, Bed, Bath, Heart, DollarSign, Home, ChevronLeft, ChevronRight, Share2, Flag, Wifi, Zap, Droplet, Trash2, ParkingCircle, Users, Calendar, Phone, Mail, Map, MessageSquare, User, Star, Info, X } from 'lucide-react';
import { useAuthStore } from '../store.js';

// Agent Details Modal Component
const AgentDetailsModal = ({ agent, onClose }) => {
  if (!agent) return null;

  // Generate QR code data - links to agent contact
  const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Phone:${agent.phone}|Email:${agent.name}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[70vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-start justify-between sticky top-0">
          <h2 className="text-2xl font-bold text-white">Agent Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg bg-gray-300 flex items-center justify-center">
              {agent.avatarUrl ? (
                <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-gray-500" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{agent.name || 'Nepal Bhumi Agent'}</h3>
            <p className="text-lg font-bold text-green-600 mb-3 capitalize">{agent.role === 'admin' ? 'Nepal Bhumi Admin' : 'Verified Agent'}</p>

            {/* Rating */}
            {agent.rating && (
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className={i < Math.round(agent.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                ))}
                <span className="text-sm text-gray-600 ml-2">({agent.rating}/5)</span>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">📞 Contact Information</h4>

            {agent.phone && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Phone size={20} className="text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <a href={`tel:${agent.phone}`} className="font-semibold text-gray-900 hover:text-blue-600">
                    {agent.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {agent.description && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-2">📝 About</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{agent.description}</p>
            </div>
          )}

          {/* QR Code Section */}
          <div className="border-t pt-4 flex flex-col items-center">
            <h4 className="font-semibold text-gray-900 mb-3">📱 Contact QR Code</h4>
            <img
              src={qrData}
              alt="Agent QR Code"
              className="w-40 h-40 border-2 border-gray-200 rounded-lg"
            />
            <p className="text-xs text-gray-600 mt-2 text-center">Scan to display contact information</p>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-4 grid grid-cols-2 gap-2">
            <a
              href={`tel:${agent.phone || '9800000000'}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Phone size={18} />
              Call
            </a>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2">
              <MessageSquare size={18} />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapComponentDetails = ({ lat, lng, address, city }) => {
  const validLat = lat && !isNaN(lat) ? parseFloat(lat) : 27.7172;
  const validLng = lng && !isNaN(lng) ? parseFloat(lng) : 85.3240;
  const bbox = `${validLng - 0.01},${validLat - 0.01},${validLng + 0.01},${validLat + 0.01}`;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${validLat},${validLng}`;

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-200 border-2 border-gray-300 shadow-md">
      <iframe
        title="Property Location Map"
        width="100%"
        height="100%"
        frameBorder="0"
        src={osmUrl}
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onError={() => console.error('[MapComponent] Failed to load map')}
        onLoad={() => console.log(`[MapComponent] Map loaded for ${address}`)}
      />
    </div>
  );
};

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savingProperty, setSavingProperty] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ name: '', email: '', phone: '', message: '' });
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await propertyAPI.getPropertyById(id);
        const propertyData = response.data.data;
        setProperty(propertyData);

        if (propertyData?.savedBy && user?._id) {
          const userIdStr = user._id.toString();
          const isSavedByUser = propertyData.savedBy.some(savedId => savedId.toString() === userIdStr);
          setIsSaved(isSavedByUser);
        }
      } catch (error) {
        console.error('Failed to fetch property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, user]);

  const handleSaveProperty = async () => {
    if (!user) {
      alert('Please login to save properties');
      window.location.href = '/auth/login';
      return;
    }

    try {
      setSavingProperty(true);
      const response = await propertyAPI.saveProperty(id);
      if (response.data.success) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Failed to save property:', error);
      alert('Failed to save property. Please try again.');
    } finally {
      setSavingProperty(false);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? (property.images?.length || 1) - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === (property.images?.length || 1) - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="spinner mx-auto"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600">Property not found</p>
      </div>
    );
  }

  const images = property.images?.length > 0 ? property.images : [];
  const currentImage = images[currentImageIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with image gallery */}
      <div className="relative bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Image Gallery */}
          <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden mb-6 mt-6 bg-gray-200">
            {currentImage ? (
              <img
                src={currentImage.url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                <Home size={80} className="text-blue-500 opacity-50" />
              </div>
            )}

            {/* Image navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
                >
                  <ChevronLeft size={24} className="text-gray-800" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
                >
                  <ChevronRight size={24} className="text-gray-800" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
              {images.length > 0 ? `${currentImageIndex + 1} / ${images.length}` : '0 / 0'}
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleSaveProperty}
                disabled={savingProperty}
                className={`p-3 rounded-full transition-all shadow-lg backdrop-blur-sm ${savingProperty ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                  } ${isSaved
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
              >
                <Heart size={24} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
              <button className="p-3 rounded-full bg-white/80 text-gray-700 hover:bg-white shadow-lg transition backdrop-blur-sm">
                <Share2 size={24} />
              </button>
              <button className="p-3 rounded-full bg-white/80 text-gray-700 hover:bg-white shadow-lg transition backdrop-blur-sm">
                <Flag size={24} />
              </button>
            </div>
          </div>

          {/* Image thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition border-2 ${idx === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                >
                  <img src={img.url} alt={`${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and price */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin size={20} className="mr-2 text-blue-500" />
                <span className="text-lg">{property.location?.address}, {property.location?.city}</span>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-4xl font-bold text-blue-600">{formatPrice(property.price, property.currency)}</p>
                {property.purpose === 'rent' && <p className="text-lg text-gray-600">/month</p>}
              </div>
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <Bed size={20} className="mx-auto text-blue-500 mb-1" />
                  <p className="font-bold">{property.features?.bedrooms || 0}</p>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                </div>
                <div className="text-center">
                  <Bath size={20} className="mx-auto text-blue-500 mb-1" />
                  <p className="font-bold">{property.features?.bathrooms || 0}</p>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                </div>
                <div className="text-center">
                  <Home size={20} className="mx-auto text-blue-500 mb-1" />
                  <p className="font-bold">{property.features?.area || 0}</p>
                  <p className="text-sm text-gray-600">Sq. ft.</p>
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Property Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Property Type</p>
                  <p className="font-bold text-gray-900 capitalize">{property.type}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Purpose</p>
                  <p className="font-bold text-gray-900 capitalize">{property.purpose}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Status</p>
                  <p className="font-bold text-blue-600 capitalize">{property.status}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Views</p>
                  <p className="font-bold text-gray-900">{property.views || 0}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">About this Place</h2>
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">{property.description}</p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 font-medium mb-2">Built Year</p>
                    <p className="font-bold text-gray-900 text-lg">{property.features?.builtYear || 'Not specified'}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 font-medium mb-2">Floor</p>
                    <p className="font-bold text-gray-900 text-lg">{property.features?.floor || 'Ground'}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 font-medium mb-2">Facing</p>
                    <p className="font-bold text-gray-900 text-lg capitalize">{property.features?.facing || 'South'}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 font-medium mb-2">Total Floors</p>
                    <p className="font-bold text-gray-900 text-lg">{property.features?.totalFloors || 'Multi-storey'}</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h3 className="font-bold text-gray-900 mb-2">Property Highlights</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Newly constructed & well-maintained property</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Prime location with excellent accessibility</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Modern amenities and utilities included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Easy verification & documentation</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-900 capitalize font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Utilities & Facilities */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Utilities & Facilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Zap size={24} className="text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Electricity</p>
                    <p className="font-semibold text-gray-900">Available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Droplet size={24} className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Water Supply</p>
                    <p className="font-semibold text-gray-900">24/7</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trash2 size={24} className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Waste Management</p>
                    <p className="font-semibold text-gray-900">Available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ParkingCircle size={24} className="text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Parking</p>
                    <p className="font-semibold text-gray-900">{property.features?.parking || 'Available'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wifi size={24} className="text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-600">Internet</p>
                    <p className="font-semibold text-gray-900">Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-xl p-6 shadow-sm overflow-hidden">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <MapComponentDetails
                lat={property.location?.coordinates?.coordinates?.[1]}
                lng={property.location?.coordinates?.coordinates?.[0]}
                address={property.location?.address}
                city={property.location?.city}
              />

              {/* Complete Address - Below Map */}
              <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-semibold mb-4">COMPLETE ADDRESS</p>

                    {/* Address Components Grid */}
                    <div className="space-y-3">
                      <div className="flex">
                        <p className="text-sm font-semibold text-gray-700 w-32">Province:</p>
                        <p className="text-sm text-gray-900">{property.location?.province || 'Not specified'}</p>
                      </div>

                      <div className="flex">
                        <p className="text-sm font-semibold text-gray-700 w-32">District:</p>
                        <p className="text-sm text-gray-900">{property.location?.district || 'Not specified'}</p>
                      </div>

                      <div className="flex">
                        <p className="text-sm font-semibold text-gray-700 w-32">Municipality:</p>
                        <p className="text-sm text-gray-900">{property.location?.municipality || 'Not specified'}</p>
                      </div>

                      <div className="flex">
                        <p className="text-sm font-semibold text-gray-700 w-32">Ward:</p>
                        <p className="text-sm text-gray-900">{property.location?.ward || 'Not specified'}</p>
                      </div>

                      <div className="flex">
                        <p className="text-sm font-semibold text-gray-700 w-32">Street/Tole:</p>
                        <p className="text-sm text-gray-900">{property.location?.streetTole || 'Not specified'}</p>
                      </div>

                      <div className="flex">
                        <p className="text-sm font-semibold text-gray-700 w-32">Google Address:</p>
                        <p className="text-sm text-gray-900">{property.location?.address || 'Not specified'}</p>
                      </div>
                    </div>

                    {/* GPS Coordinates */}
                    {property.location?.coordinates?.coordinates && (
                      <div className="mt-4 pt-4 border-t border-blue-300">
                        <p className="text-xs font-semibold text-gray-600 mb-2">GPS COORDINATES</p>
                        <p className="text-indigo-600 font-mono text-sm">{property.location.coordinates.coordinates[1].toFixed(6)}° N, {property.location.coordinates.coordinates[0].toFixed(6)}° E</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-200">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Agent Information</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center">
                  {property.ownerId?.avatarUrl ? (
                    <img src={property.ownerId.avatarUrl} alt={property.ownerId.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-gray-500" />
                  )}
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-bold text-gray-900">{property.ownerId?.name || 'Nepal Bhumi Agent'}</h4>
                  <p className="text-sm font-bold text-green-600 capitalize">{property.ownerId?.role === 'admin' ? 'Nepal Bhumi Admin' : 'Verified Agent'}</p>
                </div>
                <button
                  onClick={() => setShowAgentModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Info size={20} />
                  View All Details
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-3 ">
              <button
                onClick={() => setShowRequestForm(!showRequestForm)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Request Information
              </button>
              <button
                onClick={handleSaveProperty}
                disabled={savingProperty}
                className={`w-full font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 ${isSaved
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${savingProperty ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Saved' : 'Save Property'}
              </button>
              <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
                <Share2 size={20} />
                Share
              </button>
            </div>

            {/* Request Form */}
            {showRequestForm && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Get Information</h3>
                <form className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={requestForm.name}
                    onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Your phone"
                    value={requestForm.phone}
                    onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Your message"
                    value={requestForm.message}
                    onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
                  >
                    Send Request
                  </button>
                </form>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <p className="text-gray-600 text-sm font-medium mb-1">Property ID</p>
                  <p className="font-semibold text-gray-900">{property._id?.slice(-8) || 'N/A'}</p>
                </div>
                <div className="border-b pb-3">
                  <p className="text-gray-600 text-sm font-medium mb-1">Listed by</p>
                  <p className="font-semibold text-gray-900">{property.ownerId?.role === 'admin' ? 'Nepal Bhumi Admin' : (property.ownerId?.name || 'Nepal Bhumi')}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Posted on</p>
                  <p className="font-semibold text-gray-900">{new Date(property.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Featured Badge */}
            {property.featured && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-300">
                <p className="text-center text-yellow-800 font-bold text-lg">⭐ Featured Property</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agent Details Modal */}
      {showAgentModal && (
        <AgentDetailsModal
          agent={property.ownerId}
          onClose={() => setShowAgentModal(false)}
        />
      )}
    </div>
  );
}

export default PropertyDetails;
