import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../api/endpoints.js';
import { useAuthStore } from '../../store.js';
import { User, Mail, Phone, Lock, AlertCircle, CheckCircle } from 'lucide-react';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setUser, setTokens } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(formData);
      const { user, accessToken, refreshToken } = response.data.data;

      setUser(user);
      setTokens(accessToken, refreshToken);
      setSuccess('Account created successfully! Redirecting...');
      
      setTimeout(() => {
        if (user?.role === 'admin') {
          navigate('/admin');
        } else if (user?.role === 'agent') {
          navigate('/agent/profile');
        } else {
          navigate('/user-dashboard');
        }
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-white to-primary/10 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join NepalBhumi and start your real estate journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-danger flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-danger">Error</p>
                <p className="text-sm text-danger/80">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-lg flex items-start gap-3">
              <CheckCircle className="text-success flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-success">{success}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input w-full pl-10"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input w-full pl-10"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={20} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+977 98xxxxxxxx"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input w-full pl-10"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.role === 'user'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === 'user'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-gray-900">Buyer/Renter</span>
                </label>
                <label className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.role === 'agent'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="agent"
                    checked={formData.role === 'agent'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-gray-900">Agent/Seller</span>
                </label>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input w-full pl-10"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="password"
                  name="passwordConfirm"
                  placeholder="Confirm your password"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  required
                  className="input w-full pl-10"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-8 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already registered?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/auth/login"
            className="btn btn-outline w-full text-center font-semibold"
          >
            Log In
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          By creating an account, you agree to our{' '}
          <Link to="#" className="text-primary hover:underline font-medium">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="#" className="text-primary hover:underline font-medium">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
