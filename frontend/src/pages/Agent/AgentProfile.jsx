import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store.js';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance.js';
import { propertyAPI, userAPI, reportAPI } from '../../api/endpoints.js';
import {
  User, Mail, Phone, MapPin, Edit, Save, X, Camera, Upload, Star,
  Home, TrendingUp, Eye, LogOut, Settings, AlertCircle, CheckCircle,
  Loader, Heart, MessageSquare, ChevronDown, ChevronUp, Briefcase,
  Globe, MessageCircle, Calendar, Info, Clock, Navigation, Globe2
} from 'lucide-react';

function AgentProfile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { id } = useParams(); // Get agent ID from URL if viewing another agent

  // Determine if this is view-only mode (viewing another agent's profile)
  const isViewOnly = !!id && id !== user?._id;
  const viewingAgentId = id;

  // Profile states
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingAgent, setIsLoadingAgent] = useState(isViewOnly);

  // Accordion state
  const [activeSection, setActiveSection] = useState('about'); // 'about', 'contact', 'agency', 'listings'

  // Profile form data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    avatarUrl: '',
    rating: 5,
    // New fields
    username: '',
    work: '',
    dreamTravel: '',
    languages: '', // comma separated string for input
    birthDate: '',
    funFacts: '',
    timeSink: '',
    residence: '',
    obsession: '',
    licenseNumber: '',
    homePage: '',
    streetAddress: '',
    apartment: '',
    agencyName: '',
    agencyAddress: '',
    agencyPhone: '',
    experienceYears: 0,
    salesCount: 0
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');

  // Statistics
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    averageRating: 5,
  });

  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  // Report modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({
    reason: '',
    details: ''
  });
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportMessage, setReportMessage] = useState('');

  // Load agent profile and data
  useEffect(() => {
    if (isViewOnly) {
      // Viewing another agent's profile - no authentication required
      loadPublicAgentProfile();
    } else {
      // Viewing own profile
      if (!user) {
        navigate('/auth/login');
        return;
      }

      if (user.role !== 'agent') {
        navigate('/user-dashboard');
        return;
      }

      loadAgentProfile();
      fetchAgentData();
    }
  }, [user, navigate, isViewOnly, viewingAgentId]);

  const loadAgentProfile = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      description: user?.description || '',
      avatarUrl: user?.avatarUrl || user?.profilePicture || '',
      rating: user?.rating || 5,
      username: user?.username || '',
      work: user?.work || '',
      dreamTravel: user?.dreamTravel || '',
      languages: user?.languages ? user.languages.join(', ') : '',
      birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
      funFacts: user?.funFacts || '',
      timeSink: user?.timeSink || '',
      residence: user?.residence || '',
      obsession: user?.obsession || '',
      licenseNumber: user?.licenseNumber || '',
      homePage: user?.homePage || '',
      streetAddress: user?.address?.street || '',
      apartment: user?.address?.apartment || '',
      agencyName: user?.agencyInfo?.name || '',
      agencyAddress: user?.agencyInfo?.address || '',
      agencyPhone: user?.agencyInfo?.phone || '',
      experienceYears: user?.experienceYears || 0,
      salesCount: user?.salesCount || 0,
    });
    if (user?.avatarUrl || user?.profilePicture) {
      setProfileImagePreview(user.avatarUrl || user.profilePicture);
    }
  };

  const loadPublicAgentProfile = async () => {
    try {
      setIsLoadingAgent(true);
      // Use axiosInstance directly to fetch specific agent profile
      const response = await axiosInstance.get(`/users/profile/${viewingAgentId}`);
      if (response.data.success) {
        const agentData = response.data.data;
        setProfileData({
          name: agentData?.name || '',
          email: agentData?.email || '',
          phone: agentData?.phone || '',
          location: agentData?.location || '',
          description: agentData?.description || '',
          avatarUrl: agentData?.avatarUrl || agentData?.profilePicture || '',
          rating: agentData?.ratings?.average || 5,
          username: agentData?.username || '',
          work: agentData?.work || '',
          dreamTravel: agentData?.dreamTravel || '',
          languages: agentData?.languages ? agentData.languages.join(', ') : '',
          birthDate: agentData?.birthDate ? new Date(agentData.birthDate).toISOString().split('T')[0] : '',
          funFacts: agentData?.funFacts || '',
          timeSink: agentData?.timeSink || '',
          residence: agentData?.residence || '',
          obsession: agentData?.obsession || '',
          licenseNumber: agentData?.licenseNumber || '',
          homePage: agentData?.homePage || '',
          streetAddress: agentData?.address?.street || '',
          apartment: agentData?.address?.apartment || '',
          agencyName: agentData?.agencyInfo?.name || '',
          agencyAddress: agentData?.agencyInfo?.address || '',
          agencyPhone: agentData?.agencyInfo?.phone || '',
          experienceYears: agentData?.experienceYears || 0,
          salesCount: agentData?.salesCount || 0,
        });
        if (agentData?.avatarUrl || agentData?.profilePicture) {
          setProfileImagePreview(agentData.avatarUrl || agentData.profilePicture);
        }

        // Fetch listings - try multiple endpoints
        try {
          const listingsResponse = await axiosInstance.get(`/users/${viewingAgentId}/listings`);
          const properties = listingsResponse.data?.data || [];
          setListings(properties);

          const activeCount = properties.filter(p => p.status === 'active').length;
          const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);

          setStats({
            totalListings: properties.length,
            activeListings: activeCount,
            totalViews: totalViews,
            averageRating: agentData?.ratings?.average || 5,
          });
        } catch (listingsError) {
          console.warn('Could not fetch agent listings:', listingsError);
          setStats({
            totalListings: 0,
            activeListings: 0,
            totalViews: 0,
            averageRating: agentData?.ratings?.average || 5,
          });
        }
      }
    } catch (error) {
      console.error('Error loading public agent profile:', error);
      setErrorMessage('Failed to load agent profile. The agent may not exist.');
    } finally {
      setIsLoadingAgent(false);
    }
  };

  const fetchAgentData = async () => {
    setListingsLoading(true);
    try {
      const response = await propertyAPI.getUserProperties();
      const properties = response.data?.data || [];

      // Update listings
      setListings(properties);

      // Update stats
      const activeCount = properties.filter(p => p.status === 'active').length;
      const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);

      setStats({
        totalListings: properties.length,
        activeListings: activeCount,
        totalViews: totalViews,
        averageRating: user?.rating || 5,
      });
    } catch (error) {
      console.error('Error fetching agent data:', error);
      setErrorMessage('Failed to load your data');
    } finally {
      setListingsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage('');
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image is too large (max 5MB)');
      return;
    }

    setProfileImage(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('phone', profileData.phone);
      formData.append('location', profileData.location);
      formData.append('description', profileData.description);

      // Append new fields
      if (profileData.username) formData.append('username', profileData.username);
      if (profileData.work) formData.append('work', profileData.work);
      if (profileData.dreamTravel) formData.append('dreamTravel', profileData.dreamTravel);

      // Handle languages array
      if (profileData.languages) {
        const langs = profileData.languages.split(',').map(l => l.trim()).filter(l => l);
        langs.forEach((lang, index) => {
          formData.append(`languages[${index}]`, lang);
        });
      }

      if (profileData.birthDate) formData.append('birthDate', profileData.birthDate);
      if (profileData.funFacts) formData.append('funFacts', profileData.funFacts);
      if (profileData.timeSink) formData.append('timeSink', profileData.timeSink);
      if (profileData.residence) formData.append('residence', profileData.residence);
      if (profileData.obsession) formData.append('obsession', profileData.obsession);
      if (profileData.licenseNumber) formData.append('licenseNumber', profileData.licenseNumber);
      if (profileData.experienceYears !== undefined) formData.append('experienceYears', profileData.experienceYears);
      if (profileData.salesCount !== undefined) formData.append('salesCount', profileData.salesCount);
      if (profileData.homePage) formData.append('homePage', profileData.homePage);

      // Address fields - backend reads flat keys: address (=street), city, apartment
      if (profileData.streetAddress) formData.append('address', profileData.streetAddress);
      if (profileData.location) formData.append('city', profileData.location);
      if (profileData.apartment) formData.append('apartment', profileData.apartment);

      // Agency fields - backend reads agencyInfo as a parsed object
      if (profileData.agencyName || profileData.agencyAddress || profileData.agencyPhone) {
        formData.append('agencyInfo[name]', profileData.agencyName || '');
        formData.append('agencyInfo[address]', profileData.agencyAddress || '');
        formData.append('agencyInfo[phone]', profileData.agencyPhone || '');
      }

      if (profileImage) {
        formData.append('avatar', profileImage);
      }

      const response = await userAPI.updateProfile(formData);
      console.log('Profile updated:', response.data);

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);

      // Update store with new user data
      const { setUser } = useAuthStore.getState?.() || {};
      if (setUser && response.data?.data) {
        setUser(response.data.data);
      }

      loadAgentProfile();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Failed to update profile';
      setErrorMessage(errorMsg);
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReportData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitReport = async () => {
    if (!reportData.reason) {
      setReportMessage('Please select a reason');
      return;
    }
    if (!reportData.details.trim()) {
      setReportMessage('Please provide additional details');
      return;
    }

    setReportSubmitting(true);
    setReportMessage('');

    try {
      const payload = {
        reportedUserId: viewingAgentId || user?._id,
        reason: reportData.reason,
        details: reportData.details,
        reporterEmail: user?.email || 'anonymous'
      };

      const response = await reportAPI.submitReport(payload);

      if (response.data.success) {
        setReportMessage('✓ Report submitted successfully!');
        setShowReportModal(false);
        setReportData({ reason: '', details: '' });
        setTimeout(() => setReportMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setReportMessage(error?.response?.data?.message || 'Failed to submit report');
    } finally {
      setReportSubmitting(false);
    }
  };

  if (isLoadingAgent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-slate-200 text-lg font-semibold">Loading agent profile...</p>
          <p className="text-slate-400 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (errorMessage && isViewOnly) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-slate-200 text-lg font-semibold">{errorMessage}</p>
          <button
            onClick={() => navigate('/agents')}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white"
          >
            Back to Agents
          </button>
        </div>
      </div>
    );
  }

  if (!isViewOnly && (!user || user.role !== 'agent')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-slate-200 text-lg font-semibold">Access Denied</p>
          <p className="text-slate-400 text-sm mt-2">You need to be an agent to access this page</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              Agent Profile
            </h1>
            <p className="text-slate-400 mt-2">
              {isViewOnly ? 'View agent profile and listings' : 'Manage your agent profile and listings'}
            </p>
          </div>
        </div>


        {/* Professional Agent Info Card */}
        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl overflow-hidden mb-8 max-w-5xl mx-auto">
          {/* Top Action Bar */}
          {isViewOnly && (
            <div className="bg-slate-800/80 px-8 py-3 border-b border-slate-600 flex justify-end gap-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-600 hover:bg-slate-700 rounded transition font-medium"
              >
                <X size={16} />
                Close
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded transition font-medium"
              >
                <MessageCircle size={16} />
                Message
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 rounded transition font-medium"
              >
                <AlertCircle size={16} />
                Report Profile
              </button>
            </div>
          )}

          {/* Main Content */}
          <div className="p-8">
            {/* Header Section: Profile Picture + Info + Actions */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <div className="relative w-40 h-40">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-slate-600 border-4 border-blue-500 flex items-center justify-center shadow-lg">
                      <User size={56} className="text-slate-400" />
                    </div>
                  )}

                  {/* Camera overlay - only in edit mode */}
                  {isEditing && !isViewOnly && (
                    <>
                      <input
                        type="file"
                        id="profileImageInput"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="profileImageInput"
                        className="absolute inset-0 rounded-full flex flex-col items-center justify-center bg-black/50 opacity-0 hover:opacity-100 cursor-pointer transition-opacity duration-200 group"
                        title="Change profile photo"
                      >
                        <Camera size={28} className="text-white mb-1" />
                        <span className="text-white text-xs font-semibold">Change Photo</span>
                      </label>
                    </>
                  )}
                </div>

                {/* File name hint when a new image is selected */}
                {isEditing && profileImage && (
                  <p className="text-xs text-blue-400 text-center mt-2 truncate max-w-[10rem]">
                    {profileImage.name}
                  </p>
                )}
              </div>

              {/* Agent Info */}
              <div className="flex-1 flex flex-col justify-center">
                {/* Verified Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-600/30 to-blue-500/20 border border-blue-500/50 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Verified Agent</span>
                  </div>
                </div>

                {/* Name */}
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{profileData.name}</h1>

                {/* Username */}
                <p className="text-slate-400 text-lg mb-6">@{profileData.username || 'username'}</p>

                {/* Rating Stats Row */}
                <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-slate-600">
                  {/* Rating */}
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < Math.floor(stats.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-white font-bold">{stats.averageRating.toFixed(1)}</p>
                      <p className="text-xs text-slate-400">Rating</p>
                    </div>
                  </div>

                  {/* Properties */}
                  <div>
                    <p className="text-white font-bold text-lg">{stats.totalListings}</p>
                    <p className="text-xs text-slate-400">Properties</p>
                  </div>

                  {/* Views */}
                  <div>
                    <p className="text-white font-bold text-lg">{stats.totalViews}</p>
                    <p className="text-xs text-slate-400">Total Views</p>
                  </div>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="flex items-center gap-3 bg-slate-700/40 rounded-lg p-4 hover:bg-slate-700/60 transition">
                    <div className="p-2.5 bg-blue-600/20 rounded-lg flex-shrink-0">
                      <Phone size={20} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 font-medium">Phone</p>
                      <p className="text-sm text-white font-semibold truncate">{profileData.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 bg-slate-700/40 rounded-lg p-4 hover:bg-slate-700/60 transition">
                    <div className="p-2.5 bg-blue-600/20 rounded-lg flex-shrink-0">
                      <Mail size={20} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 font-medium">Email</p>
                      <p className="text-sm text-white font-semibold truncate">{profileData.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Own Profile Actions (Right Side) */}
              {!isViewOnly && (
                <div className="flex flex-col gap-3 justify-start">
                  <button
                    onClick={() => navigate('/agent/properties')}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium whitespace-nowrap"
                  >
                    <Home size={18} />
                    Properties
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium whitespace-nowrap"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
            <CheckCircle size={20} className="text-green-400" />
            <p className="text-green-400">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="text-red-400" />
            <p className="text-red-400">{errorMessage}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-8 mb-8">

          {/* ── VIEW MODE (not editing) ─────────────────────────────── */}
          {!isEditing && (
            <div>
              {/* Action row */}
              {!isViewOnly && (
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
                  >
                    <Edit size={17} />
                    Edit Profile
                  </button>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 border-b border-slate-600 pb-4 mb-6">
                {[
                  { id: 'about', label: 'About Me', icon: User },
                  { id: 'contact', label: 'Contact Info', icon: Mail },
                  { id: 'agency', label: 'Agency Info', icon: Briefcase },
                  { id: 'listings', label: 'My Listings', icon: Home }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeSection === tab.id
                      ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                      }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* About Me Tab */}
              {activeSection === 'about' && (
                <div className="animate-in fade-in duration-300">
                  {profileData.description && (
                    <div className="mb-6">
                      <p className="text-slate-300 leading-relaxed text-base italic border-l-4 border-blue-500 pl-4">
                        "{profileData.description}"
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { icon: User, label: 'Username', value: profileData.username ? `@${profileData.username}` : null },
                      { icon: Briefcase, label: 'Work', value: profileData.work },
                      { icon: Navigation, label: 'Dream Travel', value: profileData.dreamTravel },
                      { icon: Globe, label: 'Languages', value: profileData.languages },
                      { icon: Calendar, label: 'Born', value: profileData.birthDate ? new Date(profileData.birthDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null },
                      { icon: MapPin, label: 'Location', value: [profileData.residence, profileData.location].filter(Boolean).join(', ') || null },
                      { icon: Info, label: 'Fun Fact', value: profileData.funFacts },
                      { icon: Clock, label: 'Time Sink', value: profileData.timeSink },
                      { icon: Heart, label: 'Obsessed With', value: profileData.obsession },
                    ].filter(item => item.value).map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3 bg-slate-800/40 rounded-xl p-4 hover:bg-slate-800/60 transition">
                        <div className="p-2 bg-blue-600/15 rounded-lg flex-shrink-0 mt-0.5">
                          <Icon size={16} className="text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
                          <p className="text-sm text-white font-semibold break-words">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {![profileData.description, profileData.work, profileData.dreamTravel, profileData.languages, profileData.birthDate, profileData.funFacts, profileData.timeSink, profileData.obsession].some(Boolean) && (
                    <p className="text-slate-500 text-sm text-center py-8">No about information added yet.</p>
                  )}
                </div>
              )}

              {/* Contact Info Tab */}
              {activeSection === 'contact' && (
                <div className="animate-in fade-in duration-300 space-y-4">
                  {[
                    { icon: Mail, label: 'Email', value: profileData.email },
                    { icon: Phone, label: 'Phone', value: profileData.phone },
                    { icon: Globe2, label: 'Website', value: profileData.homePage, isLink: true },
                    { icon: MapPin, label: 'City / Region', value: profileData.location },
                    { icon: MapPin, label: 'Residence', value: profileData.residence },
                    { icon: MapPin, label: 'Street Address', value: [profileData.streetAddress, profileData.apartment].filter(Boolean).join(', ') || null },
                  ].filter(item => item.value).map(({ icon: Icon, label, value, isLink }) => (
                    <div key={label} className="flex items-center gap-4 bg-slate-800/40 rounded-xl p-4 hover:bg-slate-800/60 transition">
                      <div className="p-2.5 bg-blue-600/15 rounded-lg flex-shrink-0">
                        <Icon size={18} className="text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
                        {isLink ? (
                          <a href={value} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline font-semibold break-all">{value}</a>
                        ) : (
                          <p className="text-sm text-white font-semibold">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {![profileData.email, profileData.phone, profileData.homePage, profileData.location, profileData.residence, profileData.streetAddress].some(Boolean) && (
                    <p className="text-slate-500 text-sm text-center py-8">No contact information added yet.</p>
                  )}
                </div>
              )}

              {/* Agency Info Tab */}
              {activeSection === 'agency' && (
                <div className="animate-in fade-in duration-300 space-y-4">
                  {(profileData.experienceYears > 0 || profileData.salesCount > 0) && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                      {profileData.experienceYears > 0 && (
                        <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 text-center">
                          <p className="text-2xl font-bold text-blue-400">{profileData.experienceYears}</p>
                          <p className="text-xs text-slate-400 mt-1">Years Experience</p>
                        </div>
                      )}
                      {profileData.salesCount > 0 && (
                        <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4 text-center">
                          <p className="text-2xl font-bold text-green-400">{profileData.salesCount}</p>
                          <p className="text-xs text-slate-400 mt-1">Total Sales</p>
                        </div>
                      )}
                    </div>
                  )}
                  {[
                    { icon: Briefcase, label: 'Agency Name', value: profileData.agencyName },
                    { icon: CheckCircle, label: 'License Number', value: profileData.licenseNumber, mono: true },
                    { icon: Phone, label: 'Agency Phone', value: profileData.agencyPhone },
                    { icon: MapPin, label: 'Agency Address', value: profileData.agencyAddress },
                  ].filter(item => item.value).map(({ icon: Icon, label, value, mono }) => (
                    <div key={label} className="flex items-center gap-4 bg-slate-800/40 rounded-xl p-4 hover:bg-slate-800/60 transition">
                      <div className="p-2.5 bg-blue-600/15 rounded-lg flex-shrink-0">
                        <Icon size={18} className="text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
                        <p className={`text-sm text-white font-semibold ${mono ? 'font-mono' : ''}`}>{value}</p>
                      </div>
                    </div>
                  ))}
                  {![profileData.agencyName, profileData.licenseNumber, profileData.agencyPhone, profileData.agencyAddress].some(Boolean) && profileData.experienceYears === 0 && (
                    <p className="text-slate-500 text-sm text-center py-8">No agency information added yet.</p>
                  )}
                </div>
              )}

              {/* My Listings Tab */}
              {activeSection === 'listings' && (
                <div className="animate-in fade-in duration-300">
                  {listingsLoading ? (
                    <div className="text-center py-8">
                      <Loader className="animate-spin mx-auto mb-2" size={24} />
                      <p className="text-sm text-slate-400">Loading listings...</p>
                    </div>
                  ) : listings.length === 0 ? (
                    <div className="text-center py-8 bg-slate-800/30 rounded-lg border border-slate-700 border-dashed">
                      <Home size={32} className="mx-auto text-slate-500 mb-2" />
                      <p className="text-sm text-slate-400">No properties posted yet</p>
                    </div>
                  ) : (
                    <>
                      {!isViewOnly && (
                        <div className="flex justify-end mb-4">
                          <button onClick={() => navigate('/agent/properties')} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            Manage All <TrendingUp size={14} />
                          </button>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {listings.slice(0, 4).map((listing) => (
                          <div key={listing._id} className="flex gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700 hover:border-slate-500 transition">
                            <img src={listing.images?.[0]?.url || 'https://via.placeholder.com/80'} alt={listing.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-white truncate">{listing.title}</h4>
                              <p className="text-xs text-slate-400 truncate">{listing.location?.city}</p>
                              <p className="text-xs text-blue-400 mt-1 font-bold">₹{listing.price?.toLocaleString()}</p>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block ${listing.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>{listing.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {listings.length > 4 && (
                        <button onClick={() => navigate('/agent/properties')} className="w-full mt-4 py-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition">
                          View all {listings.length} listings
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── EDIT MODE ───────────────────────────────────────────── */}
          {isEditing && (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Information */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2"><Edit size={18} /> Editing Profile</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50"
                    >
                      <Save size={18} />
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); loadAgentProfile(); }}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 border-b border-slate-600 pb-4 mb-6">
                  {[
                    { id: 'about', label: 'About Me', icon: User },
                    { id: 'contact', label: 'Contact Info', icon: Mail },
                    { id: 'agency', label: 'Agency Info', icon: Briefcase },
                    { id: 'listings', label: 'My Listings', icon: Home }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeSection === tab.id
                        ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                        }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Form Fields - About Me */}
                {activeSection === 'about' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                    <div className="md:col-span-2">
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <User size={16} /> Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="Your Full Name"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-slate-400 block mb-2">Bio / Description</label>
                      <textarea
                        name="description"
                        value={profileData.description}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="Write a brief bio about yourself..."
                        rows="3"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <User size={16} /> Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="e.g. joshiland"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <Briefcase size={16} /> My Work
                      </label>
                      <input
                        type="text"
                        name="work"
                        value={profileData.work}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="e.g. Land Agent"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <Navigation size={16} /> Dream Travel Destination
                      </label>
                      <input
                        type="text"
                        name="dreamTravel"
                        value={profileData.dreamTravel}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="e.g. Paris"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <Globe size={16} /> Languages Spoken
                      </label>
                      <input
                        type="text"
                        name="languages"
                        value={profileData.languages}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="e.g. English, Nepali, Hindi"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <Calendar size={16} /> Birth Date
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={profileData.birthDate}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <Info size={16} /> Fun Fact
                      </label>
                      <input
                        type="text"
                        name="funFacts"
                        value={profileData.funFacts}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="e.g. StandUp comedian"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <Clock size={16} /> I spend too much time...
                      </label>
                      <input
                        type="text"
                        name="timeSink"
                        value={profileData.timeSink}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="e.g. using phone"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <Heart size={16} /> Obsessed with...
                      </label>
                      <input
                        type="text"
                        name="obsession"
                        value={profileData.obsession}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="e.g. Making money"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}

                {/* Form Fields - Contact Info */}
                {activeSection === 'contact' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <Mail size={16} /> Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-1">Cannot be changed</p>
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <Phone size={16} /> Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <Globe2 size={16} /> Website / Home Page
                      </label>
                      <input
                        type="url"
                        name="homePage"
                        value={profileData.homePage}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="e.g. https://mywebsite.com"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div className="md:col-span-2 mt-4">
                      <h4 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Address</h4>
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <MapPin size={16} /> City / Region
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="e.g. Dhangadhi"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <MapPin size={16} /> Residence
                      </label>
                      <input
                        type="text"
                        name="residence"
                        value={profileData.residence}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="Where you live"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <MapPin size={16} /> Street Address
                      </label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={profileData.streetAddress}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="Street name, P.O. box, etc."
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <MapPin size={16} /> Apartment, Suite, etc.
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={profileData.apartment}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="Apartment, suite, unit, building, floor, etc."
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}

                {/* Form Fields - Agency Info */}
                {activeSection === 'agency' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                    <div className="md:col-span-2">
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <Briefcase size={16} /> License Number
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={profileData.licenseNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="Your Agent License Number"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="experienceYears"
                        value={profileData.experienceYears}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="e.g. 5"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        Total Sales
                      </label>
                      <input
                        type="number"
                        name="salesCount"
                        value={profileData.salesCount}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="e.g. 20"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <Briefcase size={16} /> Agency Name
                      </label>
                      <input
                        type="text"
                        name="agencyName"
                        value={profileData.agencyName}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="Name of your agency"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <Phone size={16} /> Agency Phone
                      </label>
                      <input
                        type="tel"
                        name="agencyPhone"
                        value={profileData.agencyPhone}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="Agency contact number"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                        <MapPin size={16} /> Agency Address
                      </label>
                      <input
                        type="text"
                        name="agencyAddress"
                        value={profileData.agencyAddress}
                        onChange={handleInputChange}
                        disabled={!isEditing || isViewOnly}
                        placeholder="Full agency address"
                        className="w-full px-4 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}

                {/* Listings Tab (edit mode) */}
                {activeSection === 'listings' && (
                  <div className="animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                      <h3 className="text-xl font-semibold text-blue-400">Your Listings Overview</h3>
                      <button
                        onClick={() => navigate('/agent/properties')}
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        Manage All <TrendingUp size={14} />
                      </button>
                    </div>
                    {listingsLoading ? (
                      <div className="text-center py-8">
                        <Loader className="animate-spin mx-auto mb-2" size={24} />
                        <p className="text-sm text-slate-400">Loading listings...</p>
                      </div>
                    ) : listings.length === 0 ? (
                      <div className="text-center py-8 bg-slate-800/30 rounded-lg border border-slate-700 border-dashed">
                        <Home size={32} className="mx-auto text-slate-500 mb-2" />
                        <p className="text-sm text-slate-400">No properties posted yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {listings.slice(0, 4).map((listing) => (
                          <div key={listing._id} className="flex gap-3 bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                            <img src={listing.images?.[0]?.url || 'https://via.placeholder.com/80'} alt={listing.title} className="w-16 h-16 object-cover rounded" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-white truncate">{listing.title}</h4>
                              <p className="text-xs text-slate-400 truncate">{listing.location?.city}</p>
                              <p className="text-xs text-blue-400 mt-1 font-semibold">₹{listing.price?.toLocaleString()}</p>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${listing.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>{listing.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {listings.length > 4 && (
                      <button onClick={() => navigate('/agent/properties')} className="w-full mt-4 py-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded transition">
                        View all {listings.length} listings
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>



        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Listings</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalListings}</p>
              </div>
              <Home size={40} className="text-blue-500/30" />
            </div>
          </div>

          <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Listings</p>
                <p className="text-3xl font-bold text-green-400">{stats.activeListings}</p>
              </div>
              <TrendingUp size={40} className="text-green-500/30" />
            </div>
          </div>

          <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-purple-400">{stats.totalViews}</p>
              </div>
              <Eye size={40} className="text-purple-500/30" />
            </div>
          </div>

          <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Rating</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.averageRating.toFixed(1)}/5</p>
              </div>
              <Star size={40} className="text-yellow-500/30 fill-current" />
            </div>
          </div>
        </div>

      </div>

      {/* Report Profile Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full shadow-2xl">
            {/* Modal Header */}
            <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertCircle size={20} className="text-red-400" />
                Report Profile
              </h3>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportData({ reason: '', details: '' });
                  setReportMessage('');
                }}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* User Info */}
              <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                <p className="text-xs text-slate-400">Reporting Profile:</p>
                <p className="text-sm font-semibold text-white">{profileData.name}</p>
                <p className="text-xs text-slate-400">{profileData.email}</p>
              </div>

              {/* Reason Selection */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Reason for Reporting <span className="text-red-400">*</span>
                </label>
                <select
                  name="reason"
                  value={reportData.reason}
                  onChange={handleReportChange}
                  className="w-full px-3 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                >
                  <option value="">Select a reason...</option>
                  <option value="fake_account">Fake Account</option>
                  <option value="spam">Spam or Scam</option>
                  <option value="inappropriate_content">Inappropriate Content</option>
                  <option value="harassment">Harassment or Abuse</option>
                  <option value="fraud">Fraud or Misleading Info</option>
                  <option value="illegal_activity">Illegal Activity</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Additional Details */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Additional Details <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="details"
                  value={reportData.details}
                  onChange={handleReportChange}
                  placeholder="Please provide more information about why you're reporting this profile..."
                  rows="4"
                  className="w-full px-3 py-2 bg-slate-700/40 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white resize-none placeholder-slate-500"
                />
                <p className="text-xs text-slate-400 mt-1">{reportData.details.length}/500</p>
              </div>

              {/* Message */}
              {reportMessage && (
                <div className={`p-3 rounded-lg text-sm ${reportMessage.includes('✓')
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}>
                  {reportMessage}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-700/30 px-6 py-4 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportData({ reason: '', details: '' });
                  setReportMessage('');
                }}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={reportSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition font-medium flex items-center justify-center gap-2"
              >
                {reportSubmitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentProfile;
