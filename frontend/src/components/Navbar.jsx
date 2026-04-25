import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Home, Menu, X, MapPin, Plus, LogOut, LayoutGrid, Zap, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../api/endpoints.js';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = React.useState(false);
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (user) {
      userAPI.getProfile()
        .then(response => {
          if (response.data.success) {
            setUser(response.data.data);
          }
        })
        .catch(err => console.error('Error syncing profile:', err));
    }
  }, []);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-slate-900/50 border-b border-slate-700/50'
      : 'bg-slate-900/90 backdrop-blur-lg border-b border-slate-700/30'
      }`}>
      <div className="max-w-full mx-auto px-0">
        <div className="flex justify-between items-center h-20 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg group-hover:shadow-blue-500/40 transition-all group-hover:scale-110">
              <Home className="text-white" size={24} />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Nepal</span>
                <span className="text-2xl font-bold text-blue-400">Bhumi</span>
              </div>
              <p className="text-xs text-blue-300/70 font-semibold tracking-wider">REAL ESTATE</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* <Link
              to="/"
              className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm ${isActive('/')
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              Home
            </Link> */}

            <Link
              to="/map"
              className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-2 ${isActive('/map')
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <MapPin size={18} />
              Explore Properties With Map View
            </Link>

            <Link
              to="/explore"
              className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-2 ${(isActive('/explore') || isActive('/search') || isActive('/rooms'))
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <Search size={18} />
              Explore Room & Flats
            </Link>

            <Link
              to="/agents"
              className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-2 ${isActive('/agents')
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <User size={18} />
              Find a Local Agent
            </Link>

            {/* Tools Dropdown */}
            <div className="relative group">
              <button
                onMouseEnter={() => setIsToolsDropdownOpen(true)}
                onMouseLeave={() => setIsToolsDropdownOpen(false)}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-2 ${(isActive('/tools/electricity') || isActive('/tools/land-conversion') || isActive('/tools/emi-calculator'))
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
              >
                <Zap size={18} />
                Tools
                <ChevronDown size={16} className={`transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Tools Submenu */}
              <div
                onMouseEnter={() => setIsToolsDropdownOpen(true)}
                onMouseLeave={() => setIsToolsDropdownOpen(false)}
                className={`absolute top-full left-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 transition-all duration-200 ${isToolsDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                  } z-50`}
              >
                <Link
                  to="/tools/electricity"
                  className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors first:rounded-t-lg"
                >
                  <Zap size={16} className="text-yellow-500" />
                  <span className="font-medium">Electricity Calculator</span>
                </Link>
                <Link
                  to="/tools/land-conversion"
                  className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors border-t border-slate-700"
                >
                  <span className="text-lg">📐</span>
                  <span className="font-medium">Land Area Conversion</span>
                </Link>
                <Link
                  to="/tools/emi-calculator"
                  className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors border-t border-slate-700 last:rounded-b-lg"
                >
                  <span className="text-lg">💰</span>
                  <span className="font-medium">EMI Calculator</span>
                </Link>
              </div>
            </div>

            {user && (user.role === 'admin' || user.role === 'agent') && (
              <Link
                to={user.role === 'admin' ? '/admin' : '/agent/profile'}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-2 ${(isActive('/admin') || isActive('/agent/profile'))
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
              >
                <LayoutGrid size={18} />
                {user.role === 'admin' ? 'Admin Panel' : 'Agent Profile'}
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center space-x-6">

            {user ? (
              <div className="relative group flex items-center gap-4 pl-6 border-l border-slate-700/50">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'user'}`}
                  alt={user.name}
                  className="w-11 h-11 rounded-full border-2 border-blue-500/50 hover:border-blue-400 transition-colors cursor-pointer flex-shrink-0"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                </div>

                {/* User Dropdown */}
                <div className="absolute right-0 top-full mt-3 w-64 bg-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-700 z-50">
                  <div className="px-5 py-4 border-b border-slate-700">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 capitalize mt-1">{user.role}</p>
                  </div>
                  <div className="py-2">
                    {user.role === 'agent' ? (
                      <>
                        <Link
                          to="/agent/dashboard"
                          className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
                        >
                          <LayoutGrid size={16} />
                          <span className="text-sm font-medium">Dashboard</span>
                        </Link>

                        <Link
                          to="/agent/properties"
                          className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
                        >
                          <Home size={16} />
                          <span className="text-sm font-medium">Manage Properties</span>
                        </Link>

                        <Link
                          to="/agent/profile"
                          className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors border-t border-slate-700"
                        >
                          <span className="text-sm">👤</span>
                          <span className="text-sm font-medium">Profile</span>
                        </Link>
                      </>
                    ) : user.role === 'admin' ? (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
                      >
                        <LayoutGrid size={16} />
                        <span className="text-sm font-medium">Admin Panel</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
                        >
                          <User size={16} />
                          <span className="text-sm font-medium">My Profile</span>
                        </Link>
                        <Link
                          to="/user-dashboard"
                          className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
                        >
                          <LayoutGrid size={16} />
                          <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-colors border-t border-slate-700"
                    >
                      <LogOut size={16} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/auth/login"
                  className="px-4 py-2.5 rounded-lg text-blue-400 font-semibold text-sm border-2 border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              {isOpen ? <X size={24} className="text-blue-400" /> : <Menu size={24} className="text-slate-300" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-6 space-y-4 animate-slideUp border-t border-slate-700/50">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 px-3 pt-5">
              {!user && (
                <Link
                  to="/auth/login"
                  className="px-4 py-3 rounded-lg border-2 border-blue-500 text-blue-400 text-sm font-semibold flex items-center justify-center hover:bg-blue-500/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>

            {/* Navigation Links */}
            <div className="space-y-2 px-3">
              <Link
                to="/"
                className={`block px-4 py-3 rounded-lg font-medium text-sm transition-all ${isActive('/')
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/map"
                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-3 ${isActive('/map')
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <MapPin size={18} />
                Explore Properties With Map View
              </Link>

              <Link
                to="/explore"
                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-3 ${(isActive('/explore') || isActive('/search') || isActive('/rooms'))
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <Search size={18} />
                Explore Rent Room & Flats
              </Link>

              <Link
                to="/agents"
                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-3 ${isActive('/agents')
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <User size={18} />
                Find a Local Agent
              </Link>

              {/* Tools Section Mobile */}
              <div className="px-4 py-3 border-t border-slate-700/50">
                <button
                  onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Zap size={18} />
                    Tools
                  </span>
                  <ChevronDown size={16} className={`transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isToolsDropdownOpen && (
                  <div className="mt-2 space-y-2 pl-4">
                    <Link
                      to="/tools/electricity"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                      onClick={() => {
                        setIsOpen(false);
                        setIsToolsDropdownOpen(false);
                      }}
                    >
                      <Zap size={16} className="text-yellow-500" />
                      Electricity Calculator
                    </Link>
                    <Link
                      to="/tools/land-conversion"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                      onClick={() => {
                        setIsOpen(false);
                        setIsToolsDropdownOpen(false);
                      }}
                    >
                      <span>📐</span>
                      Land Area Conversion
                    </Link>
                    <Link
                      to="/tools/emi-calculator"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                      onClick={() => {
                        setIsOpen(false);
                        setIsToolsDropdownOpen(false);
                      }}
                    >
                      <span>💰</span>
                      EMI Calculator
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* User Section */}
            {user ? (
              <div className="pt-4 px-3 border-t border-slate-700/50 space-y-3">
                <div className="px-4 py-4 bg-slate-700/30 rounded-lg border border-slate-700">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 capitalize mt-1">{user.role}</p>
                </div>
                {user?.role === 'admin' || user?.role === 'agent' ? (
                  <Link
                    to={user?.role === 'admin' ? '/admin' : '/agent/profile'}
                    className="w-full px-4 py-3 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-blue-500/30"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutGrid size={18} />
                    {user?.role === 'admin' ? 'Admin Panel' : 'Agent Profile'}
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="w-full px-4 py-3 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-blue-500/30"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={18} />
                      My Profile
                    </Link>
                    <Link
                      to="/user-dashboard"
                      className="w-full px-4 py-3 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-blue-500/30"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutGrid size={18} />
                      Dashboard
                    </Link>
                  </div>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 font-semibold text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 px-3 border-t border-slate-700/50">
                <Link
                  to="/auth/register"
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/40 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
