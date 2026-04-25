import React from 'react';
import { Search, MapPin, DollarSign, Home } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.({ searchTerm, location, propertyType });
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Properties
            </label>
            <input
              type="text"
              placeholder="Enter title or keyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4">
              <MapPin size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Enter city"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full py-2 ml-2 border-none outline-none"
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="flat">Flat</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="btn btn-primary w-full py-2 flex items-center justify-center space-x-2"
            >
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
