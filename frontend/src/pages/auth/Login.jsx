import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../api/endpoints.js';
import { useAuthStore } from '../../store.js';
import { Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff, Loader } from 'lucide-react';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, setTokens } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Login attempt with:', { email: formData.email, password: '***' });
      const response = await authAPI.login(formData);
      
      // Handle different response structures
      const { user, accessToken, refreshToken } = response?.data?.data || response?.data || {};

      if (!user || !accessToken) {
        setError('Invalid response from server. Please try again.');
        return;
      }

      setUser(user);
      setTokens(accessToken, refreshToken);
      setSuccess('Login successful! Redirecting...');
      
      setTimeout(() => {
        // Redirect based on user role
        if (user?.role === 'admin') {
          navigate('/admin');
        } else if (user?.role === 'agent') {
          navigate('/agent/dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Login failed. Please check your email and password.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12 pt-20">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Mail className="text-blue-400" size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">Log in to your NepalBhumi account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 animate-in">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-red-300">Error</p>
                <p className="text-sm text-red-300/80">{error}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-start gap-3 animate-in">
              <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-green-300">{success}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-2.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-3.5 text-blue-400/50 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-sm font-semibold text-blue-300 uppercase tracking-wider">
                  Password
                </label>
                <Link 
                  to="#" 
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  title="Password recovery coming soon"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-3.5 text-blue-400/50 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-300 transition-colors disabled:opacity-50"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/60 text-slate-400">New to NepalBhumi?</span>
            </div>
          </div>

          {/* Sign Up Button */}
          <Link
            to="/auth/register"
            className="block w-full px-6 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-white font-bold rounded-lg transition-all duration-200 text-center"
          >
            Create Account
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          By logging in, you agree to our{' '}
          <Link to="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
