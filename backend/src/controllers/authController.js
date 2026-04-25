import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../services/tokenService.js';
import { validateEmail, validatePassword } from '../utils/validation.js';
import { sendVerificationEmail } from '../services/mailService.js';
import { generateVerificationCode } from '../utils/helpers.js';

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, passwordConfirm, role } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: 'Email or phone already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: password,
      role: role || 'user',
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Send verification email
    const verificationCode = generateVerificationCode();
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: providedRefreshToken } = req.body;

    if (!providedRefreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
      // Verify the refresh token
      const decoded = jwt.verify(providedRefreshToken, process.env.JWT_REFRESH_SECRET);

      // Get the user to fetch current role and verify user still exists
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Generate new access token with current user role
      const newAccessToken = generateAccessToken(user._id, user.role);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: newAccessToken,
        },
      });
    } catch (error) {
      console.error('Token refresh error:', error.message);
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
