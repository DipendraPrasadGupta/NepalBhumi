import React from 'react';
import { MapPin, Bed, Bath, Ruler, Heart, ExternalLink, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatters';
import { propertyAPI } from '../api/endpoints';
import { useAuthStore } from '../store';

const PropertyCard = ({ property, onSave, onSaveSuccess }) => {
  const [isSaved, setIsSaved] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const user = useAuthStore((state) => state.user);

  React.useEffect(() => {
    if (property?.savedBy && user?._id) {
      const userIdStr = user._id.toString();
      const isSavedByUser = property.savedBy.some(id => id.toString() === userIdStr);
      setIsSaved(isSavedByUser);
    } else {
      setIsSaved(false);
    }
  }, [property, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }

    try {
      setLoading(true);
      const response = await propertyAPI.saveProperty(property._id);
      
      if (response?.data?.success || response?.status === 200) {
        setIsSaved(!isSaved);
        onSave?.(property._id);
        onSaveSuccess?.();
      }
    } catch (error) {
      console.error('Failed to save property:', error);
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = property?.images?.[0]?.url || property?.images?.[0] || 'https://via.placeholder.com/400x300?text=Property+Image';
  const price = property?.price ? formatPrice(property.price) : 'Not Listed';
  const bedrooms = property?.bedrooms || property?.features?.bedrooms || 0;
  const bathrooms = property?.bathrooms || property?.features?.bathrooms || 0;
  const area = property?.area || property?.features?.area || 0;

  return (
    <Link to={`/property/${property._id}`}>
      <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-300/60 flex flex-col">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          <img
            src={imageUrl}
            alt={property?.title || 'Property'}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              if (e.target.src !== 'https://via.placeholder.com/400x300?text=Property+Image') {
                e.target.src = 'https://via.placeholder.com/400x300?text=Property+Image';
              }
            }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Purpose Badge - Top Left */}
          {property?.purpose && (
            <div className="absolute top-4 left-4 z-10">
              <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold shadow-lg backdrop-blur-sm">
                {property.purpose === 'rent' ? '🔑 For Rent' : '🏷️ For Sale'}
              </div>
            </div>
          )}

          {/* Featured Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
              <Star size={14} fill="currentColor" />
              4.8
            </div>
          </div>

          {/* Save Button - Enhanced */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="absolute bottom-4 right-4 z-20 p-2.5 rounded-full bg-white/95 hover:bg-white text-slate-800 transition-all duration-200 shadow-lg hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white/50 hover:border-red-300"
            aria-label={isSaved ? 'Remove from saved' : 'Add to saved'}
          >
            <Heart 
              size={20} 
              fill={isSaved ? 'currentColor' : 'none'} 
              className={`transition-all ${isSaved ? 'text-red-500' : 'text-slate-400'}`}
            />
          </button>

          {/* Quick View Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="p-3.5 rounded-full bg-blue-600 text-white shadow-2xl transform group-hover:scale-100 scale-75 transition-transform duration-300">
              <ExternalLink size={24} />
            </div>
          </div>

          {/* Verified Badge if applicable */}
          {property?.verified && (
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-green-500/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
              <Check size={14} fill="currentColor" />
              Verified
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 p-5">
          {/* Title */}
          <div>
            <h3 className="line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {property?.title || 'Untitled Property'}
            </h3>
            {/* Room Type Badge */}
            {property?.type && (
              <div className="mt-2 flex items-center gap-1.5">
                <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-full border border-purple-200/60 hover:border-purple-300 transition-colors">
                  {property.type === 'single-room' && '🛏️ Single Room'}
                  {property.type === 'sharing-room' && '👥 Sharing Room'}
                  {property.type === 'premium-room' && '⭐ Premium Room'}
                  {property.type === '1bhk' && '🏠 1 BHK'}
                  {property.type === '2bhk' && '🏢 2 BHK'}
                  {!['single-room', 'sharing-room', 'premium-room', '1bhk', '2bhk'].includes(property.type) && property.type}
                </span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-start gap-2.5 text-gray-600 text-sm">
            <MapPin size={18} className="flex-shrink-0 mt-0.5 text-blue-500" />
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-gray-800">{property?.location?.city || 'Unknown'}</span>
              <span className="line-clamp-1 text-gray-500">{property?.location?.address || 'Unknown'}</span>
            </div>
          </div>

          {/* Price - Enhanced */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Rs. {price}
            </span>
            {property?.purpose === 'rent' && <span className="text-sm text-gray-500 font-medium">/month</span>}
          </div>

          {/* Specs - Improved */}
          <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-gray-200">
            {bedrooms > 0 && (
              <div className="flex flex-col items-center gap-1.5 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Bed size={18} className="text-blue-600" />
                <span className="text-sm font-bold text-gray-900">{bedrooms}</span>
                <span className="text-xs text-gray-600">Beds</span>
              </div>
            )}
            {bathrooms > 0 && (
              <div className="flex flex-col items-center gap-1.5 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Bath size={18} className="text-green-600" />
                <span className="text-sm font-bold text-gray-900">{bathrooms}</span>
                <span className="text-xs text-gray-600">Baths</span>
              </div>
            )}
            {area > 0 && (
              <div className="flex flex-col items-center gap-1.5 p-2 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                <Ruler size={18} className="text-amber-600" />
                <span className="text-sm font-bold text-gray-900">{area}</span>
                <span className="text-xs text-gray-600">sqft</span>
              </div>
            )}
          </div>

          {/* Description */}
          {property?.description && (
            <p className="line-clamp-2 text-sm text-gray-600 leading-relaxed">
              {property.description}
            </p>
          )}

          {/* Amenities - Enhanced */}
          {property?.amenities && property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {property.amenities.slice(0, 3).map((amenity, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 text-xs bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full font-medium border border-blue-200/60 hover:border-blue-300 transition-colors"
                >
                  ✓ {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-medium border border-gray-200">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* View Details Button - Enhanced */}
          <button className="mt-auto px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg group-hover:shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-2">
            <span>View Details</span>
            <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
