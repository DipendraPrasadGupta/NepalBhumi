import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Heart, ChevronLeft, ChevronRight, Search, Map, Bed, Bath, Square, Sliders, X, Calendar, Users, AlertCircle, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// OpenStreetMap Component (Free, No API Key Required)
const MapComponent = ({ lat, lng, title, price }) => {
  // Validate coordinates
  const validLat = lat && !isNaN(lat) ? parseFloat(lat) : 27.7172;
  const validLng = lng && !isNaN(lng) ? parseFloat(lng) : 85.3240;

  console.log(`[MapComponent] Rendering map for "${title}":`, { lat: validLat, lng: validLng });

  // Using OpenStreetMap + Leaflet (FREE, no API key required)
  // Zoom levels: 18 = street level, 15 = neighborhood
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(validLng - 0.01).toFixed(6)},${(validLat - 0.01).toFixed(6)},${(validLng + 0.01).toFixed(6)},${(validLat + 0.01).toFixed(6)}&layer=mapnik&marker=${validLat.toFixed(6)},${validLng.toFixed(6)}`;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border-2 border-slate-200 bg-slate-100 flex flex-col">
      {/* Map Content */}
      <div className="flex-1 relative bg-slate-200">
        <iframe
          key={`map-${validLat}-${validLng}`}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '400px' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={osmUrl}
          title={`Map: ${title}`}
          className="rounded-xl absolute inset-0 bg-slate-100"
          onError={() => {
            console.error('[MapComponent] Failed to load map iframe');
          }}
          onLoad={() => {
            console.log('[MapComponent] Map iframe loaded successfully');
          }}
        />
        {/* Fallback text while loading - using link instead of broken map */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 pointer-events-none">
          <div className="text-center">
            <p className="text-slate-400 text-sm font-medium">Loading map...</p>
          </div>
        </div>
      </div>

      {/* Property Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-lg shadow-xl p-4 z-10 border border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">{title}</p>
            <p className="text-lg font-bold text-blue-600">{price}</p>
          </div>
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md">
            <MapPin size={18} />
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 font-mono bg-slate-50 p-1 rounded inline-block">
          {validLat.toFixed(6)}, {validLng.toFixed(6)}
        </p>
      </div>
    </div>
  );
};

const PropertyMap = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlLocation = searchParams.get('search') || '';
  const urlType = searchParams.get('type') || '';
  const urlPriceRange = searchParams.get('priceRange') || '';

  // Parse price range from URL parameter
  const parsePriceRange = (priceRangeStr) => {
    if (!priceRangeStr) return { min: 0, max: 100000000 };
    if (priceRangeStr === '0-10000') return { min: 0, max: 10000 };
    if (priceRangeStr === '10000-25000') return { min: 10000, max: 25000 };
    if (priceRangeStr === '25000-50000') return { min: 25000, max: 50000 };
    if (priceRangeStr === '50000') return { min: 50000, max: 100000000 };
    return { min: 0, max: 100000000 };
  };

  // Map backend types (lowercase, hyphenated) to display types
  const typeMapping = {
    'apartment': 'Apartment',
    'single-family': 'Single Family',
    'multi-family': 'Multi Family',
    'studio': 'Studio',
    'penthouse': 'Penthouse',
    'office-space': 'Office Space',
    'store-front': 'Store Front',
    'warehouse': 'Warehouse',
    'workshop': 'Workshop',
    'food-services': 'Food Services',
    'guest-services': 'Guest Services',
    'medical-services': 'Medical Services',
    'mixed-commercial': 'Mixed Commercial',
    'agricultural': 'Agricultural',
    'residential': 'Residential',
    'commercial': 'Commercial',
    'industrial': 'Industrial',
    'mixed-use': 'Mixed Use',
    'house': 'House',
    'land': 'Land',
  };

  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedType, setSelectedType] = useState(urlType ? (typeMapping[urlType.toLowerCase()] || 'All') : 'All');
  const [showFilters, setShowFilters] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(urlLocation || '');
  const mapRef = useRef(null);
  const isInitialMount = useRef(true);

  gsap.registerPlugin(ScrollTrigger);
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    occupants: '1',
    specialRequests: '',
  });

  // Initialize filters with price range from URL if provided
  const urlPriceRangeObj = parsePriceRange(urlPriceRange);
  const [filters, setFilters] = useState({
    purpose: 'All',
    priceMin: urlPriceRangeObj.min,
    priceMax: urlPriceRangeObj.max,
    bedrooms: 'All',
    bathrooms: 'All',
  });

  const getDisplayType = (backendType) => {
    return typeMapping[backendType?.toLowerCase()] || backendType;
  };

  // Location to coordinates mapping for Nepal
  const locationCoordinates = {
    // KATHMANDU VALLEY - MAIN KATHMANDU AREAS
    'kathmandu': { lat: 27.7172, lng: 85.3240 },
    'durbar marg': { lat: 27.7314, lng: 85.3159 },
    'deep jyoti marg': { lat: 27.7195, lng: 85.3240 },
    'chakrapath': { lat: 27.7209, lng: 85.3270 },
    'thamel': { lat: 27.7245, lng: 85.2928 },
    'new road': { lat: 27.7142, lng: 85.3239 },
    'basundhara': { lat: 27.7418, lng: 85.3458 },

    // KATHMANDU - NORTH AREAS
    'high garden': { lat: 27.7350, lng: 85.3310 },
    'baluwater': { lat: 27.7255, lng: 85.3400 },
    'kapan': { lat: 27.7500, lng: 85.3150 },
    'maharajgunj': { lat: 27.7400, lng: 85.3250 },
    'naxal': { lat: 27.7350, lng: 85.3200 },
    'lazimpat': { lat: 27.7210, lng: 85.3290 },
    'mahankal': { lat: 27.7400, lng: 85.3350 },

    // KATHMANDU - CENTRAL AREAS
    'kamalpokhari': { lat: 27.7230, lng: 85.3310 },
    'sundhara': { lat: 27.7120, lng: 85.3180 },
    'putalisadak': { lat: 27.7089, lng: 85.3239 },
    'jhamsikhel': { lat: 27.7168, lng: 85.3168 },
    'maitidevi': { lat: 27.7200, lng: 85.3200 },
    'dhumbarahi': { lat: 27.7250, lng: 85.3350 },

    // KATHMANDU - EAST AREAS
    'boudha': { lat: 27.7196, lng: 85.3567 },
    'gaushala': { lat: 27.7300, lng: 85.3500 },
    'bhimsenkhan': { lat: 27.7300, lng: 85.3200 },

    // KATHMANDU - SOUTH AREAS
    'godavari': { lat: 27.6200, lng: 85.3800 },
    'imadol': { lat: 27.6820, lng: 85.2880 },

    // KATHMANDU - WEST AREAS
    'sitapaila': { lat: 27.7300, lng: 85.2800 },
    'winayek': { lat: 27.7100, lng: 85.3100 },
    'paknajol': { lat: 27.7270, lng: 85.2950 },

    // KATHMANDU - LANDMARKS & ZONES
    'durbar square': { lat: 27.7314, lng: 85.3159 },
    'kathmandu-city': { lat: 27.7172, lng: 85.3240 },
    'kathmandu valley': { lat: 27.7172, lng: 85.3240 },
    'valley': { lat: 27.7172, lng: 85.3240 },

    // BANESHWOR AREA
    'new baneshwor': { lat: 27.7000, lng: 85.3400 },
    'naya baneshwor': { lat: 27.7050, lng: 85.3380 },
    'baneshwor': { lat: 27.6900, lng: 85.3400 },

    // BHAKTAPUR DISTRICT
    'bhaktapur': { lat: 27.6728, lng: 85.4300 },
    'sanothimi': { lat: 27.6680, lng: 85.4350 },
    'bhaktapur district': { lat: 27.6728, lng: 85.4300 },

    // LALITPUR (PATAN)
    'patan': { lat: 27.6413, lng: 85.3157 },
    'lalitpur': { lat: 27.6413, lng: 85.3157 },

    // POKHARA REGION
    'pokhara': { lat: 28.2096, lng: 83.9856 },
    'daman': { lat: 27.5897, lng: 85.2245 },

    // WESTERN NEPAL
    'butwal': { lat: 27.8099, lng: 83.4621 },
    'lumbini': { lat: 27.5041, lng: 83.2753 },
    'rara': { lat: 29.3833, lng: 82.0833 },

    // CENTRAL NEPAL
    'hetauda': { lat: 27.4188, lng: 85.0367 },
    'dhulikhel': { lat: 27.6172, lng: 85.4189 },

    // EASTERN NEPAL
    'birgunj': { lat: 27.1806, lng: 84.8750 },
    'janakpur': { lat: 26.7520, lng: 85.9243 },

    // FAR EASTERN NEPAL
    'itahari': { lat: 26.9639, lng: 87.2763 },
    'biratnagar': { lat: 26.4532, lng: 87.2717 },
    'dharan': { lat: 26.8122, lng: 87.2847 },
    'ilam': { lat: 26.9158, lng: 87.9264 },

    // FAR WESTERN NEPAL
    'nepalganj': { lat: 28.0505, lng: 81.0992 },
    'dhanusha': { lat: 26.8197, lng: 85.9243 },
  };

  const getCoordinatesFromLocation = (location, learnedCoordinates = {}) => {
    if (!location || typeof location !== 'string') {
      console.warn(`[getCoordinatesFromLocation] Invalid location:`, location);
      return { lat: 27.7172, lng: 85.3240 };
    }

    const locationLower = location.toLowerCase().trim();

    // Check learned coordinates first (from actual property data)
    if (learnedCoordinates[locationLower]) {
      console.log(`✓ Found LEARNED coordinate for "${locationLower}":`, learnedCoordinates[locationLower]);
      return learnedCoordinates[locationLower];
    }

    // Strategy 1: Exact match - highest priority
    if (locationCoordinates[locationLower]) {
      console.log(`✓ Strategy 1 - EXACT match for "${locationLower}"`);
      return locationCoordinates[locationLower];
    }

    // Get all keys sorted by length (longest first) for better matching
    const sortedKeys = Object.keys(locationCoordinates).sort((a, b) => b.length - a.length);

    // Strategy 2: Partial match - if input contains a known location
    for (const key of sortedKeys) {
      if (locationLower.includes(key)) {
        console.log(`✓ Strategy 2 - PARTIAL match: "${locationLower}" contains "${key}"`);
        return locationCoordinates[key];
      }
    }

    // Strategy 3: Reverse match - if a known location contains the input
    for (const key of sortedKeys) {
      if (key.includes(locationLower)) {
        console.log(`✓ Strategy 3 - WORD match: "${key}" contains "${locationLower}"`);
        return locationCoordinates[key];
      }
    }

    // Strategy 4: First word extraction (for multi-word locations like "Durbar Marg, Kathmandu")
    const words = locationLower.split(/[\s,\-\/]+/).filter(w => w && w.length > 2);

    // Try each word individually
    for (const word of words) {
      if (locationCoordinates[word]) {
        console.log(`✓ Strategy 4a - FIRST WORD match: "${word}" from "${locationLower}"`);
        return locationCoordinates[word];
      }
    }

    // Strategy 5: Two-word match
    if (words.length >= 2) {
      const twoWords = words.slice(0, 2).join(' ');
      if (locationCoordinates[twoWords]) {
        console.log(`✓ Strategy 5 - TWO WORD match: "${twoWords}"`);
        return locationCoordinates[twoWords];
      }
    }

    // Strategy 6: Special handling for Kathmandu areas
    if (locationLower.includes('kathmandu') || locationLower.includes('ktm')) {
      // Extract the area name before Kathmandu
      const areaMatch = locationLower.split(/[,\s]+/).find(part =>
        part && part !== 'kathmandu' && part !== 'ktm' && locationCoordinates[part]
      );

      if (areaMatch) {
        console.log(`✓ Strategy 6 - KATHMANDU AREA match: "${areaMatch}"`);
        return locationCoordinates[areaMatch];
      }
    }

    console.warn(`✗ No match found for "${locationLower}" - defaulting to Kathmandu`);
    return { lat: 27.7172, lng: 85.3240 };
  };

  const propertyTypes = [
    { name: 'All', icon: '🏠' },
    { name: 'Apartment', icon: '🏢' },
    { name: 'Single Family', icon: '🏡' },
    { name: 'Multi Family', icon: '🏘️' },
    { name: 'Studio', icon: '📦' },
    { name: 'Penthouse', icon: '🏰' },
    { name: 'Office Space', icon: '💼' },
    { name: 'Store Front', icon: '🏬' },
    { name: 'Warehouse', icon: '🏭' },
    { name: 'Workshop', icon: '🔧' },
    { name: 'Food Services', icon: '🍽️' },
    { name: 'Guest Services', icon: '🛏️' },
    { name: 'Medical Services', icon: '🏥' },
    { name: 'Mixed Commercial', icon: '🏢' },
    { name: 'Agricultural', icon: '🌾' },
    { name: 'Residential', icon: '🏠' },
    { name: 'Commercial', icon: '🏪' },
    { name: 'Industrial', icon: '🏗️' },
    { name: 'Mixed Use', icon: '🌆' },
    { name: 'House', icon: '🏠' },
    { name: 'Land', icon: '🌍' },
  ];

  useEffect(() => {
    // Fetch properties from backend ONLY
    const fetchBackendProperties = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/properties?status=active&limit=100`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const backendProperties = data.data || [];

          console.log('[PropertyMap] Backend properties received:', backendProperties.length);

          // Log first 5 properties' location data for debugging
          console.log('[PropertyMap] ========== SAMPLE LOCATION DATA ==========');
          backendProperties.slice(0, 5).forEach((prop, idx) => {
            console.log(`[Property ${idx + 1}] "${prop.title}"`);
            console.log(`  - Address: "${prop.location?.address}"`);
            console.log(`  - City: "${prop.location?.city}"`);
            console.log(`  - Coordinates: ${prop.location?.coordinates?.coordinates ? JSON.stringify(prop.location.coordinates.coordinates) : 'none'}`);
          });
          console.log('[PropertyMap] ==========================================\n');

          // Main property types for PropertyMap display
          const mainPropertyTypes = [
            'apartment', 'single-family', 'multi-family', 'studio', 'penthouse',
            'office-space', 'store-front', 'warehouse', 'workshop',
            'food-services', 'guest-services', 'medical-services', 'mixed-commercial',
            'agricultural', 'residential', 'commercial', 'industrial', 'mixed-use', 'house', 'land'
          ];

          // Filter backend properties to only show main property types
          const filteredBackendProps = backendProperties.filter(prop =>
            mainPropertyTypes.includes(prop.type?.toLowerCase())
          );

          console.log('[PropertyMap] Filtered backend properties:', filteredBackendProps.length);

          // Convert backend properties to display format with normalized coordinates
          const convertedProps = filteredBackendProps.map(prop => {
            // Get coordinates from backend or from location mapping
            let lat, lng;
            let coordinateSource = 'unknown';

            console.log(`\n[PropertyMap] ========== Processing: "${prop.title}" ==========`);
            console.log(`[PropertyMap] Location Data:`, {
              address: prop.location?.address,
              city: prop.location?.city,
              landmark: prop.location?.landmark,
              coordinates: prop.location?.coordinates?.coordinates
            });

            // Priority 1: Extract from GeoJSON coordinates [lng, lat]
            if (prop.location?.coordinates?.coordinates && Array.isArray(prop.location.coordinates.coordinates)) {
              lng = parseFloat(prop.location.coordinates.coordinates[0]);
              lat = parseFloat(prop.location.coordinates.coordinates[1]);

              if (lat && lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                // Validate coordinates are in Nepal region (roughly 26-30 lat, 80-89 lng)
                if (lat >= 26 && lat <= 30 && lng >= 80 && lng <= 89) {
                  console.log(`[PropertyMap] ✓ Using GEOJSON coordinates:`, { lat, lng });
                  coordinateSource = 'geojson';
                } else {
                  console.log(`[PropertyMap] ✗ GeoJSON coordinates out of Nepal region:`, { lat, lng });
                  lat = undefined;
                  lng = undefined;
                }
              } else {
                console.log(`[PropertyMap] ✗ GeoJSON coordinates invalid or zero`);
                lat = undefined;
                lng = undefined;
              }
            }

            // Priority 2: Try address matching
            if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
              if (prop.location?.address && prop.location.address.trim()) {
                console.log(`[PropertyMap] → Trying ADDRESS: "${prop.location.address}"`);
                const coordsFromAddress = getCoordinatesFromLocation(prop.location.address);

                lat = coordsFromAddress.lat;
                lng = coordsFromAddress.lng;
                coordinateSource = 'address';
                console.log(`[PropertyMap] ✓ Using ADDRESS coordinates:`, { lat, lng });
              }
            }

            // Priority 3: Try city matching if address failed or wasn't available
            if (!coordinateSource.startsWith('address') && !coordinateSource.startsWith('geojson')) {
              if (prop.location?.city && prop.location.city.trim()) {
                console.log(`[PropertyMap] → Trying CITY: "${prop.location.city}"`);
                const coordsFromCity = getCoordinatesFromLocation(prop.location.city);

                lat = coordsFromCity.lat;
                lng = coordsFromCity.lng;
                coordinateSource = 'city';
                console.log(`[PropertyMap] ✓ Using CITY coordinates:`, { lat, lng });
              }
            }

            // Priority 4: Try landmark if we have one
            if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
              if (prop.location?.landmark && prop.location.landmark.trim()) {
                console.log(`[PropertyMap] → Trying LANDMARK: "${prop.location.landmark}"`);
                const coordsFromLandmark = getCoordinatesFromLocation(prop.location.landmark);

                lat = coordsFromLandmark.lat;
                lng = coordsFromLandmark.lng;
                coordinateSource = 'landmark';
                console.log(`[PropertyMap] ✓ Using LANDMARK coordinates:`, { lat, lng });
              }
            }

            // Final fallback - should rarely happen
            if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
              lat = 27.7172;
              lng = 85.3240;
              coordinateSource = 'default';
              console.warn(`[PropertyMap] ⚠ Using DEFAULT Kathmandu (no location data found)`);
            }

            // Build location string for display
            const address = prop.location?.address || '';
            const city = prop.location?.city || '';
            const locationDisplay = address && city ? `${address}, ${city}` : address || city || 'Unknown Location';

            console.log(`[PropertyMap] ✅ FINAL: "${prop.title}"`);
            console.log(`   Location: "${locationDisplay}"`);
            console.log(`   Coordinates: lat=${lat.toFixed(4)}, lng=${lng.toFixed(4)}`);
            console.log(`   Source: [${coordinateSource}]`);
            console.log(`[PropertyMap] ==========================================\n`);


            return {
              id: prop._id,
              title: prop.title,
              price: prop.price,
              currency: prop.currency,
              image: prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1545779750-94d696f6d221?w=500',
              bedrooms: prop.features?.bedrooms || 0,
              bathrooms: prop.features?.bathrooms || 0,
              area: prop.features?.area || 0,
              type: getDisplayType(prop.type), // Convert to display type
              purpose: prop.purpose,
              location: locationDisplay,
              amenities: prop.amenities || [],
              rating: 4.5,
              lat: lat,
              lng: lng,
            };
          });

          console.log('[PropertyMap] Backend converted properties:', convertedProps.length);

          setProperties(convertedProps);
          if (convertedProps.length > 0) {
            setSelectedProperty(convertedProps[0]);
            console.log('[PropertyMap] Selected first property:', convertedProps[0].title);
          } else {
            console.log('[PropertyMap] No properties to display');
          }
        } else {
          console.log('[PropertyMap] Backend fetch failed - Status:', response.status);
          setProperties([]);
          setSelectedProperty(null);
        }
      } catch (error) {
        console.error('[PropertyMap] Error fetching backend properties:', error);
        setProperties([]);
        setSelectedProperty(null);
      }
    };

    if (isInitialMount.current) {
      fetchBackendProperties();
      isInitialMount.current = false;
    }

    // Refresh properties every 30 seconds to get new additions
    const interval = setInterval(fetchBackendProperties, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle auto-scroll to map on mobile when property is selected
  useEffect(() => {
    if (selectedProperty && window.innerWidth < 1024) {
      mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedProperty]);

  // Cleanup any GSAP triggers on mount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const filteredProperties = properties.filter(property => {
    // Type filter
    const propDisplayType = typeof property.type === 'string' && property.type.includes('-')
      ? getDisplayType(property.type)
      : property.type;
    const matchesType = selectedType === 'All' || propDisplayType === selectedType;

    // Location/Search filter - check both title and location
    let matchesLocation = true;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      matchesLocation = property.title.toLowerCase().includes(searchLower) ||
        property.location.toLowerCase().includes(searchLower);
    }

    // Price range filter
    const matchesPrice = property.price >= filters.priceMin && property.price <= filters.priceMax;

    // Purpose filter (All/Sale/Rent)
    let matchesPurpose = true;
    if (filters.purpose !== 'All') {
      const normalizedPurpose = (property.purpose || '').toLowerCase().trim();
      const normalizedFilter = filters.purpose.toLowerCase().trim();
      matchesPurpose = normalizedPurpose === normalizedFilter;
    }

    // Bedrooms filter
    let matchesBedrooms = true;
    if (filters.bedrooms !== 'All') {
      const filterBedrooms = parseInt(filters.bedrooms);
      matchesBedrooms = property.bedrooms === filterBedrooms || (filters.bedrooms === '3' && property.bedrooms >= 3);
    }

    // Bathrooms filter
    let matchesBathrooms = true;
    if (filters.bathrooms !== 'All') {
      const filterBathrooms = parseInt(filters.bathrooms);
      matchesBathrooms = property.bathrooms === filterBathrooms || (filters.bathrooms === '3' && property.bathrooms >= 3);
    }

    // Apply ALL filters with AND logic
    return matchesType && matchesLocation && matchesPrice && matchesPurpose && matchesBedrooms && matchesBathrooms;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <div className="z-40 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 text-white">
        <div className="w-full  px-4 sm:px-6 lg:px-8 py-8">
          {/* Commented out Title & Breadcrumb section */}

          {/* Search & Filter Bar */}
          <div className="space-y-4">
            <div className="flex  justify-center align-center gap-2 items-center">

              <div className="flex gap-2">
                {['All', 'Sale', 'Rent'].map(purpose => (
                  <button
                    key={purpose}
                    onClick={() => setFilters({ ...filters, purpose })}
                    className={`px-5 py-2.5 rounded-lg font-semibold transition whitespace-nowrap ${filters.purpose === purpose
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40'
                      : 'bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 border border-slate-600'
                      }`}
                  >
                    {purpose}
                  </button>
                ))}
              </div>
              <div className="flex-1 max-w-md relative group">
                <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-400 transition" size={22} />
                <input
                  type="text"
                  placeholder="Search by property name, location, area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-5 py-3.5 bg-slate-700/40 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 transition text-base"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition flex items-center gap-2 font-semibold whitespace-nowrap"
              >
                <Sliders size={20} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
            {showFilters && (
              <div className="w-full bg-slate-700/20 border border-slate-600 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-slate-200">Filter Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-2 uppercase tracking-wide">Min Price</label>
                    <input
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({ ...filters, priceMin: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-2 uppercase tracking-wide">Max Price</label>
                    <input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({ ...filters, priceMax: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-2 uppercase tracking-wide">Bedrooms</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="All">All</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-2 uppercase tracking-wide">Bathrooms</label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-700/40 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="All">All</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Type Carousel */}
      <div className="z-30 bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 no-scrollbar">
            {propertyTypes.map(type => (
              <button
                key={type.name}
                onClick={() => setSelectedType(type.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold whitespace-nowrap transition transform hover:scale-105 ${selectedType === type.name
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/40'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70 border border-slate-600'
                  }`}
              >
                <span className="text-lg">{type.icon}</span>
                <span className="hidden sm:inline">{type.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Cards and Map Together */}
      <div className="w-full px-0 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {/* Properties List - 3 Columns with Natural Scroll */}
          <div className="lg:col-span-3 pl-4 sm:pl-6 lg:pl-8 cards-wrapper">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">
                {filteredProperties.length}
                <span className="text-slate-400 font-normal"> Properties Found</span>
              </h2>
            </div>
            {filteredProperties.length > 0 ? (
              <div className="cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProperties.map(property => (
                  <div
                    key={property.id}
                    onClick={() => {
                      console.log(`[PropertyMap] Selected property: "${property.title}"`, {
                        location: property.location,
                        lat: property.lat,
                        lng: property.lng,
                      });
                      setSelectedProperty(property);
                    }}
                    className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-102 border-2 ${selectedProperty?.id === property.id
                      ? 'border-blue-500 ring-2 ring-blue-500/30'
                      : 'border-slate-200 hover:border-blue-400'
                      }`}
                  >
                    <div className="relative h-40 overflow-hidden bg-slate-200">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover hover:scale-110 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition cursor-pointer">
                        <Heart size={16} className="text-slate-600 hover:text-red-500" />
                      </div>
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        {property.purpose?.toLowerCase() === 'sale' && (
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-lg shadow-md">For Sale</span>
                        )}
                        {property.purpose?.toLowerCase() === 'rent' && (
                          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md">For Rent</span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 line-clamp-1 text-base mb-1">{property.title}</h3>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mb-3">
                        <MapPin size={13} className="text-blue-500 flex-shrink-0" />
                        <span className="line-clamp-1">{property.location}</span>
                      </p>
                      <div className="mb-3 pb-3 border-b border-slate-100">
                        <p className="text-lg font-bold text-blue-600">
                          {property.price.toLocaleString()} <span className="text-xs text-slate-500 font-normal">{property.currency}</span>
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center mb-3">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2">
                          <Bed size={14} className="mx-auto text-blue-600 mb-0.5" />
                          <span className="font-bold text-slate-700 text-sm">{property.bedrooms}</span>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2">
                          <Bath size={14} className="mx-auto text-blue-600 mb-0.5" />
                          <span className="font-bold text-slate-700 text-sm">{property.bathrooms}</span>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2">
                          <Square size={14} className="mx-auto text-blue-600 mb-0.5" />
                          <span className="font-bold text-slate-700 text-sm">{property.area}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-semibold text-slate-700 text-sm">{property.rating}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProperty(property);
                              if (window.innerWidth < 1024) {
                                mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }}
                            className="text-xs px-3 py-1 bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition font-semibold flex items-center gap-1"
                          >
                            <Map size={12} />
                            Map
                          </button>
                          <Link to={`/property/${property.id}`} className="text-xs px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold">
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-800/40 border border-slate-700 rounded-xl">
                <Map size={56} className="mx-auto text-slate-500 mb-4" />
                <p className="text-slate-300 font-semibold text-lg">No properties match your criteria</p>
                <p className="text-slate-400 text-sm mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Map on Right Side - Sticky Positioned */}
          <div className="lg:col-span-2 pr-4 sm:pr-6 lg:pr-8">
            {selectedProperty && (
              <div
                ref={mapRef}
                className="sticky top-24 h-[600px] rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-500 bg-white"
              >
                <MapComponent
                  key={`${selectedProperty.id}-${selectedProperty.lat}-${selectedProperty.lng}`}
                  lat={selectedProperty.lat}
                  lng={selectedProperty.lng}
                  title={selectedProperty.title}
                  price={`${selectedProperty.price.toLocaleString()} ${selectedProperty.currency}`}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 flex items-center justify-between shadow-lg">
              <div>
                <h2 className="text-2xl font-bold">Book Property</h2>
                <p className="text-sm text-blue-100">{selectedProperty.title}</p>
              </div>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setBookingForm({
                    fullName: '',
                    email: '',
                    phone: '',
                    checkInDate: '',
                    checkOutDate: '',
                    occupants: '1',
                    specialRequests: '',
                  });
                }}
                className="hover:bg-white/20 p-2 rounded transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4 bg-white">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={bookingForm.fullName}
                  onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Email *</label>
                <input
                  type="email"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  placeholder="+977 xxxxxxxxxx"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Check-in *</label>
                  <input
                    type="date"
                    value={bookingForm.checkInDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkInDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Check-out *</label>
                  <input
                    type="date"
                    value={bookingForm.checkOutDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkOutDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Number of Occupants *</label>
                <select
                  value={bookingForm.occupants}
                  onChange={(e) => setBookingForm({ ...bookingForm, occupants: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5">5+ People</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Special Requests</label>
                <textarea
                  value={bookingForm.specialRequests}
                  onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                  placeholder="Any special requirements or questions..."
                  rows="3"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900 resize-none"
                />
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-slate-700 font-semibold">
                  <span className="text-blue-600">Price:</span> {selectedProperty.price.toLocaleString()} {selectedProperty.currency}
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    alert('Booking request submitted! We will contact you shortly.');
                    setShowBookingModal(false);
                    setBookingForm({
                      fullName: '',
                      email: '',
                      phone: '',
                      checkInDate: '',
                      checkOutDate: '',
                      occupants: '1',
                      specialRequests: '',
                    });
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/40 transition text-center"
                >
                  Submit Booking
                </button>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingForm({
                      fullName: '',
                      email: '',
                      phone: '',
                      checkInDate: '',
                      checkOutDate: '',
                      occupants: '1',
                      specialRequests: '',
                    });
                  }}
                  className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition text-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
