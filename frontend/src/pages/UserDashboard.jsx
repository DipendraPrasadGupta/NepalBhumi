import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store.js';
import { Plus, Home, MessageSquare, Heart, Settings, LogOut, BarChart3, Eye, AlertCircle, RefreshCw, Upload, Mail, Phone, MapPin, User, Lock, Bell, Shield, Camera, Send, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyAPI } from '../api/endpoints.js';
import axiosInstance from '../api/axiosInstance.js';
import PropertyCard from '../components/PropertyCard.jsx';
import { userAPI, messageAPI } from '../api/endpoints.js';

function UserDashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [savedProperties, setSavedProperties] = useState([]);
  const [savesLoading, setSavesLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [userListings, setUserListings] = useState(0);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    messageAlerts: true,
    marketingEmails: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const isInitialMount = useRef(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    } else if (isInitialMount.current) {
      // Load all user data ONLY on initial mount
      loadUserProfile();
      fetchUserListings();
      fetchSavedProperties();
      fetchReceivedMessages();
      isInitialMount.current = false;
    }
  }, [user, navigate]);

  // Fetch saved properties when tab changes
  useEffect(() => {
    if (activeTab === 'saved' && user) {
      fetchSavedProperties();
    } else if (activeTab === 'messages' && user) {
      fetchReceivedMessages();
    }
  }, [activeTab, user]);

  // Also refetch periodically to catch updates from other pages
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      if (activeTab === 'saved') {
        fetchSavedProperties();
      }
    }, 30000); // Refetch every 2 seconds when on saved tab

    return () => clearInterval(interval);
  }, [activeTab, user]);

  const loadUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.data.success) {
        const userData = response.data.data;
        setPhoneNumber(userData.phone || '');
        setLocation(userData.address || '');
        setBio(userData.bio || '');
        if (userData.avatarUrl) {
          setProfileImage(userData.avatarUrl);
        }
        calculateProfileCompletion(userData);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const calculateProfileCompletion = (userData) => {
    let completed = 0;
    const totalFields = 5;

    if (userData.name) completed++;
    if (userData.email) completed++;
    if (userData.phone) completed++;
    if (userData.address) completed++;
    if (userData.bio) completed++;

    const percentage = Math.round((completed / totalFields) * 100);
    setProfileCompletion(percentage);
  };

  const fetchUserListings = async () => {
    if (!user) return;

    try {
      setListingsLoading(true);
      const response = await userAPI.getMyListings({ limit: 100 });
      if (response.data.success) {
        setUserListings(response.data.data?.length || 0);
      }
    } catch (error) {
      console.error('Failed to fetch user listings:', error);
    } finally {
      setListingsLoading(false);
    }
  };

  const fetchSavedProperties = async () => {
    if (!user) return;

    try {
      setSavesLoading(true);
      console.log('Fetching saved properties...');
      const response = await propertyAPI.getSavedProperties({ limit: 50 });
      console.log('Saved properties response:', response.data);
      if (response.data.success) {
        setSavedProperties(response.data.data || []);
      } else {
        console.warn('API returned success: false', response.data);
        // Don't clear data on API error - keep showing old data
      }
    } catch (error) {
      console.error('Failed to fetch saved properties:', error);
      console.error('Error details:', error.response?.data || error.message);
      // Don't clear data on error - keep showing old data while loading
    } finally {
      setSavesLoading(false);
    }
  };

  // Fetch received messages
  const fetchReceivedMessages = async () => {
    if (!user) {
      console.log('No user, skipping fetch');
      return;
    }

    try {
      setMessagesLoading(true);
      console.log('Fetching messages for role:', user?.role);
      console.log('User ID:', user?.id);

      // For admins, fetch sent messages; for users, fetch received messages
      let response;
      if (user?.role === 'admin') {
        console.log('Fetching SENT messages (admin)');
        response = await messageAPI.getSentMessages();
      } else {
        console.log('Fetching RECEIVED messages (user)');
        response = await messageAPI.getReceivedMessages();
      }

      console.log('Messages response:', response);
      console.log('Response data:', response.data);

      if (response.data?.success) {
        console.log('Setting messages:', response.data.data);
        setReceivedMessages(response.data.data || []);
      } else {
        console.warn('API returned success: false', response.data);
        setReceivedMessages([]);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Send reply to message
  const handleSendReply = async (messageId) => {
    if (!replyText[messageId]?.trim()) {
      alert('Please enter a reply message');
      return;
    }

    try {
      const response = await messageAPI.replyToMessage(messageId, {
        reply: replyText[messageId]
      });

      if (response.data.success) {
        // Update the message with reply
        setReceivedMessages(prev =>
          prev.map(msg =>
            msg._id === messageId
              ? { ...msg, reply: replyText[messageId], replyAt: new Date() }
              : msg
          )
        );

        // Clear reply input
        setReplyText(prev => ({
          ...prev,
          [messageId]: ''
        }));

        alert('✓ Reply sent successfully!');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();

      // Add user data to form (matching backend expectations)
      formData.append('phone', phoneNumber);
      formData.append('address', location); // Backend uses 'address'
      formData.append('bio', bio);

      // Add profile image if changed
      if (profileImage && profileImage.startsWith('data:')) {
        // Convert data URL to blob
        const response = await fetch(profileImage);
        const blob = await response.blob();
        formData.append('profileImage', blob, 'profile.jpg');
      }

      // Call API to update user profile using userAPI
      const updateResponse = await userAPI.updateProfile(formData);

      if (updateResponse.data.success) {
        alert('✓ Profile updated successfully!');
        // Reload profile to get updated data
        await loadUserProfile();
      } else {
        alert('Failed to update profile: ' + (updateResponse.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      setIsChangingPassword(true);
      const response = await userAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      if (response.data.success) {
        alert('✓ Password changed successfully!');
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert('Please enter your password to confirm deletion');
      return;
    }

    if (!window.confirm('⚠️ Are you absolutely sure? This will permanently delete your account and all associated data. This action cannot be undone.')) {
      return;
    }

    try {
      const response = await userAPI.deleteAccount({ password: deletePassword });

      if (response.data.success) {
        alert('Account deleted successfully. You will be logged out.');
        logout();
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleNotificationChange = (preference) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-3 py-12 text-center">
        <AlertCircle size={48} className="text-danger mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
        <Link to="/auth/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  const stats = [
    { label: 'Saved Properties', value: savedProperties.length, icon: Heart, color: 'text-red-600' },
    { label: 'Messages', value: receivedMessages.length, icon: MessageSquare, color: 'text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome, <span className="text-primary">{user.name}</span>!
              </h1>
              <p className="text-gray-600">Manage your profile, saved properties, and account</p>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 ${activeTab === 'overview'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <BarChart3 size={18} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 ${activeTab === 'profile'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <User size={18} />
                My Profile
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 ${activeTab === 'saved'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Heart size={18} />
                Saved Properties
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 ${activeTab === 'messages'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <MessageSquare size={18} />
                Messages
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 ${activeTab === 'settings'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Settings size={18} />
                Settings
              </button>

              {/* Admin Panel - Only show for admins */}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 text-amber-600 hover:bg-amber-50 border-2 border-amber-200"
                >
                  <BarChart3 size={18} />
                  Admin Panel
                </Link>
              )}

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 text-danger hover:bg-danger/5"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="card bg-gradient-to-r from-primary/10 via-blue-50 to-secondary/10 border-2 border-primary/20">
                  <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                    {/* Profile Picture */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                      {profileImage ? (
                        <img src={profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={64} className="text-white" />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
                      <p className="text-gray-600 text-lg mb-4">{user.email}</p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Shield size={18} className="text-primary" />
                          <span className="font-semibold capitalize">{user.role} Account</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar size={18} className="text-secondary" />
                          <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="inline-block mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all"
                      >
                        Edit Full Profile
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card border-l-4 border-l-primary">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-red-100 text-red-600">
                        <Heart size={24} />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Saved Properties</p>
                    <p className="text-4xl font-bold text-gray-900">{savedProperties.length}</p>
                    <p className="text-gray-500 text-xs mt-2">Properties you love</p>
                  </div>

                  <div className="card border-l-4 border-l-secondary">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-green-100 text-green-600">
                        <MessageSquare size={24} />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Messages</p>
                    <p className="text-4xl font-bold text-gray-900">{receivedMessages.length}</p>
                    <p className="text-gray-500 text-xs mt-2">Unread from admin</p>
                  </div>

                  <div className="card border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                        <Home size={24} />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Contact Info</p>
                    <p className="text-4xl font-bold text-gray-900">{phoneNumber ? '✓' : '○'}</p>
                    <p className="text-gray-500 text-xs mt-2">{phoneNumber ? 'Updated' : 'Add your phone'}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      to="/explore"
                      className="p-6 border-2 border-secondary rounded-lg hover:bg-secondary hover:text-white transition-all flex items-center gap-4 group"
                    >
                      <div className="p-3 rounded-lg bg-secondary/10 text-secondary group-hover:bg-white group-hover:text-secondary transition-all">
                        <Eye size={28} />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Browse Properties</p>
                        <p className="text-sm group-hover:text-gray-100">Explore rooms & flats</p>
                      </div>
                    </Link>
                    <Link
                      to="/profile"
                      className="p-6 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-4 group"
                    >
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-white group-hover:text-primary transition-all">
                        <User size={28} />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Edit Profile</p>
                        <p className="text-sm group-hover:text-gray-100">Update your info</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="card">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <Mail size={24} className="text-primary flex-shrink-0" />
                      <div>
                        <p className="text-gray-600 text-sm">Email</p>
                        <p className="font-semibold text-gray-900">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <Phone size={24} className="text-primary flex-shrink-0" />
                      <div>
                        <p className="text-gray-600 text-sm">Phone</p>
                        <p className="font-semibold text-gray-900">{phoneNumber || 'Not added'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg md:col-span-2">
                      <MapPin size={24} className="text-primary flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-600 text-sm">Location</p>
                        <p className="font-semibold text-gray-900">{location || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* My Profile Tab */}
            {activeTab === 'profile' && (
              <div className="card">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                  <User size={28} className="text-primary" />
                  <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                </div>
                <div className="text-center">
                  <div className="mb-8">
                    <p className="text-gray-600 text-lg mb-4">For complete profile management and editing, please use the dedicated profile page:</p>
                    <Link
                      to="/profile"
                      className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
                    >
                      Go to My Profile
                    </Link>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-900 text-sm">
                      <span className="font-semibold">💡 Tip:</span> On the profile page, you can edit all your personal information, upload a profile picture, manage address details, and update your bio.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Properties Tab */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Saved Properties</h2>
                    <p className="text-gray-600 text-sm mt-1">Keep track of properties you're interested in</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={fetchSavedProperties}
                      disabled={savesLoading}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
                      title="Refresh saved properties"
                    >
                      <RefreshCw size={20} className={`text-primary ${savesLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <span className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-full">
                      {savedProperties.length} saved
                    </span>
                  </div>
                </div>

                {savesLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-96 animate-pulse"></div>
                    ))}
                  </div>
                ) : savedProperties.length > 0 ? (
                  <div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {savedProperties.map((property) => (
                        <PropertyCard
                          key={property._id}
                          property={property}
                          onSaveSuccess={() => fetchSavedProperties()}
                        />
                      ))}
                    </div>
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-900 text-sm">
                        <span className="font-semibold">Tip:</span> Click the heart icon on any saved property card to remove it from your saved list.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="card text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100">
                    <Heart size={64} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Saved Properties</h3>
                    <p className="text-gray-600 text-lg mb-2">You haven't saved any properties yet</p>
                    <p className="text-gray-500 text-sm mb-8">Start exploring and save properties you love!</p>
                    <div className="flex gap-4 justify-center flex-wrap">
                      <Link to="/map" className="btn btn-primary">
                        Browse Properties
                      </Link>
                      <Link to="/explore" className="btn btn-outline">
                        Explore Rooms & Flats
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="card flex flex-col min-h-[600px] max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {user?.role === 'admin' ? 'Messages from users' : 'Chat with admin'}
                    </p>
                  </div>
                  <button
                    onClick={fetchReceivedMessages}
                    disabled={messagesLoading}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
                    title="Refresh messages"
                  >
                    <RefreshCw size={20} className={`text-primary ${messagesLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Chat Area */}
                {messagesLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin">
                      <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full"></div>
                    </div>
                  </div>
                ) : receivedMessages.length > 0 ? (
                  <>
                    {/* Messages Thread - WhatsApp Style */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                      {receivedMessages
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                        .map((message) => (
                          <div key={message._id} className="space-y-2">
                            {/* Message - Left side (blue) */}
                            <div className="flex justify-start">
                              <div className="max-w-xs px-4 py-3 rounded-lg bg-blue-600 text-white shadow-sm">
                                <p className="text-sm font-semibold mb-1">
                                  {user?.role === 'admin' ? 'You' : (message.senderName || 'Admin')}
                                </p>
                                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                <p className="text-xs opacity-75 mt-2">
                                  {new Date(message.createdAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>

                            {/* Reply - Right side (green) */}
                            {message.reply && (
                              <div className="flex justify-end">
                                <div className="max-w-xs px-4 py-3 rounded-lg bg-green-500 text-white shadow-sm">
                                  <p className="text-xs font-semibold mb-1">
                                    ✓ {user?.role === 'admin' ? 'User Reply' : 'Your Reply'}
                                  </p>
                                  <p className="text-sm whitespace-pre-wrap">{message.reply}</p>
                                  <p className="text-xs opacity-75 mt-2">
                                    {new Date(message.replyAt).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>

                    {/* Reply Input - Bottom - Always Visible */}
                    <div className="border-t border-gray-200 p-6 bg-white shrink-0 overflow-y-auto max-h-[250px]">
                      <div className="space-y-3">
                        {user?.role === 'admin' ? (
                          // For admins - show message info
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-blue-900 text-sm">
                              <span className="font-semibold">📊 Admin View:</span> You're viewing messages you sent to users and their replies. To send a new message, visit the Admin Panel.
                            </p>
                          </div>
                        ) : (
                          // For users - show reply input
                          receivedMessages.length > 0 && (
                            <>
                              {/* Show reply inputs for unreplied messages */}
                              {receivedMessages
                                .filter(msg => !msg.reply)
                                .map((message) => (
                                  <div key={message._id}>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                      Reply to: {message.senderName || 'Admin'}
                                    </label>
                                    <div className="flex gap-3">
                                      <textarea
                                        value={replyText[message._id] || ''}
                                        onChange={(e) => setReplyText(prev => ({
                                          ...prev,
                                          [message._id]: e.target.value
                                        }))}
                                        placeholder="Type your reply..."
                                        rows="2"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                      />
                                      <button
                                        onClick={() => handleSendReply(message._id)}
                                        className="btn btn-primary flex items-center gap-2 h-fit shrink-0"
                                      >
                                        <Send size={18} />
                                      </button>
                                    </div>
                                  </div>
                                ))}

                              {/* General message input - Always show at bottom */}
                              <div className="border-t pt-3">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                  {receivedMessages.filter(msg => !msg.reply).length === 0
                                    ? '💬 Send a message'
                                    : 'Add another message'}
                                </label>
                                <div className="flex gap-3">
                                  <textarea
                                    value={replyText['general'] || ''}
                                    onChange={(e) => setReplyText(prev => ({
                                      ...prev,
                                      'general': e.target.value
                                    }))}
                                    placeholder="Type your message..."
                                    rows="2"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                  />
                                  <button
                                    onClick={() => {
                                      if (replyText['general']?.trim()) {
                                        alert('General message feature coming soon!');
                                      }
                                    }}
                                    className="btn btn-primary flex items-center gap-2 h-fit shrink-0"
                                    disabled={!replyText['general']?.trim()}
                                  >
                                    <Send size={18} />
                                  </button>
                                </div>
                              </div>
                            </>
                          )
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare size={64} className="text-gray-300 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">No Messages</h3>
                      <p className="text-gray-600 text-lg mb-2">You don't have any messages yet</p>
                      <p className="text-gray-500 text-sm">Admin messages will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Account Information */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-200">
                    <User size={24} className="text-primary" />
                    <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-900 text-sm mb-4">
                        <span className="font-semibold">📝 Note:</span> To edit your profile information (phone, location, bio), please visit the <Link to="/profile" className="underline font-semibold text-primary">My Profile</Link> page.
                      </p>
                      <Link
                        to="/profile"
                        className="inline-block px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all"
                      >
                        Edit My Profile
                      </Link>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Email Address</label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-200">
                    <Bell size={24} className="text-primary" />
                    <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={notificationPreferences.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                        className="w-5 h-5 rounded cursor-pointer accent-primary"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Email Notifications</p>
                        <p className="text-gray-600 text-sm">Get updates about saved properties and new messages</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={notificationPreferences.messageAlerts}
                        onChange={() => handleNotificationChange('messageAlerts')}
                        className="w-5 h-5 rounded cursor-pointer accent-primary"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Message Alerts</p>
                        <p className="text-gray-600 text-sm">Notify me when I receive new messages</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={notificationPreferences.marketingEmails}
                        onChange={() => handleNotificationChange('marketingEmails')}
                        className="w-5 h-5 rounded cursor-pointer accent-primary"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Marketing Emails</p>
                        <p className="text-gray-600 text-sm">Receive special offers, promotions, and news</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Security */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-200">
                    <Lock size={24} className="text-primary" />
                    <h2 className="text-2xl font-bold text-gray-900">Security & Privacy</h2>
                  </div>
                  <div className="space-y-4">
                    {!showPasswordForm ? (
                      <button
                        onClick={() => setShowPasswordForm(true)}
                        className="w-full p-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all"
                      >
                        🔑 Change Password
                      </button>
                    ) : (
                      <div className="p-4 border-2 border-primary rounded-lg bg-primary/5 space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Current Password</label>
                          <input
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                            placeholder="Enter current password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">New Password</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="Enter new password (min 6 characters)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleChangePassword}
                            disabled={isChangingPassword}
                            className="flex-1 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isChangingPassword && <RefreshCw size={16} className="animate-spin" />}
                            {isChangingPassword ? 'Changing...' : 'Change Password'}
                          </button>
                          <button
                            onClick={() => {
                              setShowPasswordForm(false);
                              setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                            }}
                            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="card border-2 border-danger/30 bg-danger/5">
                  <h3 className="text-lg font-bold text-danger mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    Danger Zone
                  </h3>
                  {!showDeleteConfirm ? (
                    <div>
                      <p className="text-gray-700 mb-6">
                        Deleting your account will permanently remove all your data, saved properties, and listings. This action cannot be undone.
                      </p>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full px-6 py-3 bg-danger text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-danger/30"
                      >
                        🗑️ Delete My Account
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 border-2 border-danger rounded-lg bg-danger/10 space-y-4">
                      <p className="text-danger font-bold">⚠️ This will permanently delete your account!</p>
                      <p className="text-gray-700 text-sm">Enter your password to confirm account deletion:</p>
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-danger"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleDeleteAccount}
                          className="flex-1 px-4 py-2 bg-danger text-white font-bold rounded-lg hover:bg-red-700"
                        >
                          Yes, Delete Account
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeletePassword('');
                          }}
                          className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
