import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store.js';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Heart, Home, MessageSquare, Edit3, ArrowLeft, VerifiedIcon, Badge, Save, X, Camera, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { userAPI, propertyAPI } from '../api/endpoints.js';
import axiosInstance from '../api/axiosInstance.js';

function UserProfile() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [profileData, setProfileData] = useState(null);
  const [savedCount, setSavedCount] = useState(0);
  const [listingsCount, setListingsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    province: '',
    postalCode: '',
    bio: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    loadProfileData();
  }, [user, navigate]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setImageError(false);
      // Fetch user profile
      const profileRes = await userAPI.getProfile();
      if (profileRes.data.success) {
        const data = profileRes.data.data;
        setProfileData(data);
        
        // Map address object fields to form fields for display
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address?.street || '',
          city: data.address?.city || '',
          district: data.address?.state || '',
          province: data.address?.state || '',
          postalCode: data.address?.zipCode || '',
          bio: data.bio || '',
        });
        setPreviewImage(data.avatarUrl || null);
      }

      // Fetch saved properties count
      try {
        const savedRes = await propertyAPI.getSavedProperties({ limit: 1 });
        if (savedRes.data.success) {
          setSavedCount(savedRes.data.data?.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch saved count:', error);
      }

      // Fetch listings count
      try {
        const listingsRes = await userAPI.getMyListings({ limit: 100 });
        if (listingsRes.data.success) {
          setListingsCount(listingsRes.data.data?.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch listings count:', error);
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Please upload a valid image file (JPG, PNG, GIF, or WebP)' });
        return;
      }

      // Validate file size (max 5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeInBytes) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setImageError(false);
        setMessage({ type: '', text: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Validation
      if (!formData.name || !formData.name.trim()) {
        setMessage({ type: 'error', text: 'Full name is required' });
        return;
      }

      if (!formData.email || !formData.email.trim()) {
        setMessage({ type: 'error', text: 'Email address is required' });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setMessage({ type: 'error', text: 'Please enter a valid email address' });
        return;
      }

      // Phone validation (if provided)
      if (formData.phone && formData.phone.trim()) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(formData.phone)) {
          setMessage({ type: 'error', text: 'Please enter a valid phone number' });
          return;
        }
      }

      setIsSaving(true);
      setMessage({ type: '', text: '' });

      const updateData = new FormData();
      updateData.append('name', formData.name.trim());
      updateData.append('email', formData.email.trim());
      updateData.append('phone', formData.phone?.trim() || '');
      updateData.append('address', formData.address?.trim() || '');
      updateData.append('city', formData.city?.trim() || '');
      updateData.append('district', formData.district?.trim() || '');
      updateData.append('province', formData.province?.trim() || '');
      updateData.append('postalCode', formData.postalCode?.trim() || '');
      updateData.append('bio', formData.bio?.trim() || '');

      // Check if image was changed (base64 indicates new upload)
      if (previewImage && previewImage.startsWith('data:')) {
        // Validate image size (max 5MB)
        const imageSizeInBytes = previewImage.length * 0.75; // Rough estimate
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

        if (imageSizeInBytes > maxSizeInBytes) {
          setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
          return;
        }

        updateData.append('avatar', previewImage);
      }

      const response = await userAPI.updateProfile(updateData);
      
      if (response.data.success) {
        const updatedUserData = response.data.data;
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setImageError(false);
        
        // Update all states immediately
        setProfileData(updatedUserData);
        setFormData({
          name: updatedUserData.name || '',
          email: updatedUserData.email || '',
          phone: updatedUserData.phone || '',
          address: updatedUserData.address || '',
          city: updatedUserData.city || '',
          district: updatedUserData.district || '',
          province: updatedUserData.province || '',
          postalCode: updatedUserData.postalCode || '',
          bio: updatedUserData.bio || '',
        });
        
        // Update preview image with the new avatar URL from server
        if (updatedUserData.avatarUrl) {
          setPreviewImage(updatedUserData.avatarUrl);
        }
        
        // Update the user in Zustand store to sync avatar everywhere
        setUser({
          ...user,
          name: updatedUserData.name,
          email: updatedUserData.email,
          phone: updatedUserData.phone,
          address: updatedUserData.address,
          bio: updatedUserData.bio,
          avatarUrl: updatedUserData.avatarUrl,
          city: updatedUserData.city,
          district: updatedUserData.district,
          province: updatedUserData.province,
          postalCode: updatedUserData.postalCode,
        });
        
        // Close editing mode after state updates
        setTimeout(() => {
          setIsEditing(false);
          setMessage({ type: '', text: '' });
        }, 500);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImageError(false);
    // Reset form to original data
    setFormData({
      name: profileData?.name || '',
      email: profileData?.email || '',
      phone: profileData?.phone || '',
      address: profileData?.address || '',
      city: profileData?.city || '',
      district: profileData?.district || '',
      province: profileData?.province || '',
      postalCode: profileData?.postalCode || '',
      bio: profileData?.bio || '',
    });
    setPreviewImage(profileData?.avatarUrl || null);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Recently joined';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently joined';
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    } catch (e) {
      return 'Recently joined';
    }
  };

  const getMembershipDuration = (createdDate) => {
    try {
      if (!createdDate) return '';
      const joinDate = new Date(createdDate);
      if (isNaN(joinDate.getTime())) return '';
      
      const now = new Date();
      const diffTime = Math.abs(now - joinDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) return `${diffDays} days`;
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''}`;
      }
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    } catch (e) {
      return '';
    }
  };

  // Add cache buster to image URL to prevent caching
  const getImageUrl = () => {
    if (!previewImage) return null;
    // If it's a base64 image (from file upload), return as-is
    if (previewImage.startsWith('data:')) {
      return previewImage;
    }
    // Add timestamp to bypass browser cache for server URLs
    const separator = previewImage.includes('?') ? '&' : '?';
    return `${previewImage}${separator}t=${Date.now()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <Link
            to="/user-dashboard"
            className="text-primary hover:text-primary-dark font-medium transition"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <AlertCircle className="text-red-600" size={20} />
            )}
            <span className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-slate-600">Loading profile...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Avatar & Quick Stats */}
            <div>
              {/* Avatar Section */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    {previewImage && !imageError ? (
                      <img
                        key={previewImage}
                        src={getImageUrl()}
                        alt={formData.name}
                        className="w-32 h-32 rounded-full border-4 border-primary object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', getImageUrl());
                          setImageError(true);
                        }}
                        loading="eager"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-primary bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto">
                        <span className="text-5xl font-bold text-white">
                          {formData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition shadow-lg"
                      >
                        <Camera size={16} />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-primary hover:text-primary-dark font-medium"
                    >
                      Change Picture
                    </button>
                  )}
                  <h2 className="text-2xl font-bold text-slate-900 mt-4">{formData.name}</h2>
                  <p className="text-slate-600 text-sm mt-2 flex items-center justify-center gap-1">
                    <Calendar size={14} />
                    <span>Joined {formatDate(profileData?.createdAt)}</span>
                  </p>
                  {getMembershipDuration(profileData?.createdAt) && (
                    <p className="text-slate-500 text-xs mt-1">Member for {getMembershipDuration(profileData?.createdAt)}</p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <Heart className="text-red-600" size={20} />
                    </div>
                    <div>
                      <p className="text-slate-600 text-xs font-medium">Saved Properties</p>
                      <p className="text-2xl font-bold text-slate-900">{savedCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Home className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-slate-600 text-xs font-medium">My Listings</p>
                      <p className="text-2xl font-bold text-slate-900">{listingsCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Badge className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-slate-600 text-xs font-medium">Account Status</p>
                      <p className="text-2xl font-bold text-slate-900">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">Profile Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition font-medium"
                    >
                      <Edit3 size={18} />
                      Edit Profile
                    </button>
                  ) : null}
                </div>

                {isEditing ? (
                  <form className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                        placeholder="Enter your full name"
                        required
                        maxLength="100"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                        placeholder="Enter your email"
                        required
                        maxLength="120"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                        placeholder="Enter your phone number"
                        maxLength="20"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
                        placeholder="Tell us about yourself"
                        maxLength="500"
                      />
                      <p className="text-xs text-slate-500 mt-1">{formData.bio?.length || 0}/500</p>
                    </div>

                    {/* Address Section */}
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-4">Address Details</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-900 mb-3">Street Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                          placeholder="Enter street address"
                          maxLength="200"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-3">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                            placeholder="City"
                            maxLength="50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-3">District</label>
                          <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                            placeholder="District"
                            maxLength="50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-3">Province</label>
                          <input
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                            placeholder="Province"
                            maxLength="50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-3">Postal Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                            placeholder="Postal code"
                            maxLength="20"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t">
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-200 text-slate-900 px-6 py-3 rounded-lg hover:bg-slate-300 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Basic Info Display */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Full Name</p>
                        <p className="text-lg font-semibold text-slate-900">{formData.name}</p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Email</p>
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-blue-600" />
                          <p className="text-lg font-semibold text-slate-900 break-all">{formData.email}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Phone</p>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-green-600" />
                          <p className="text-lg font-semibold text-slate-900">{formData.phone || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Member Since</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold text-slate-900">{formatDate(profileData?.createdAt)}</p>
                            {getMembershipDuration(profileData?.createdAt) && (
                              <p className="text-sm text-slate-600 mt-1">Member for {getMembershipDuration(profileData?.createdAt)}</p>
                            )}
                          </div>
                          <Calendar className="text-blue-600" size={24} />
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {formData.bio && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Bio</p>
                        <p className="text-slate-900">{formData.bio}</p>
                      </div>
                    )}

                    {/* Address Section */}
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-4">Address Details</h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Street Address</p>
                          <div className="flex items-start gap-2">
                            <MapPin size={16} className="text-orange-600 mt-1 flex-shrink-0" />
                            <p className="text-lg font-semibold text-slate-900">{formData.address || 'Not provided'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">City</p>
                            <p className="text-slate-900 font-semibold">{formData.city || '-'}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">District</p>
                            <p className="text-slate-900 font-semibold">{formData.district || '-'}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Province</p>
                            <p className="text-slate-900 font-semibold">{formData.province || '-'}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Postal Code</p>
                            <p className="text-slate-900 font-semibold">{formData.postalCode || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
