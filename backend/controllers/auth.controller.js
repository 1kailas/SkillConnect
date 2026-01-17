import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import Worker from '../models/Worker.model.js';
import Employer from '../models/Employer.model.js';
import { sanitizeInput } from '../utils/sanitize.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, phone, password, role, ...additionalData } = req.body;

    // Sanitize inputs to prevent XSS
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedPhone = phone.trim();

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email: sanitizedEmail }, { phone: sanitizedPhone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone'
      });
    }

    let user;
    if (role === 'worker') {
      user = await Worker.create({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        password,
        role,
        ...additionalData
      });
    } else if (role === 'employer') {
      user = await Employer.create({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        password,
        role,
        ...additionalData
      });
    } else if (role === 'admin') {
      user = await User.create({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        password,
        role,
        ...additionalData
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        ...userResponse,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        ...userResponse,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/auth/me
// @access  Private (with protect middleware)
export const getMe = async (req, res, next) => {
  try {
    // Only use authenticated user ID from JWT token
    const userId = req.user._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private (with protect middleware)
export const updateProfile = async (req, res, next) => {
  try {
    // Only use authenticated user ID from JWT token
    const userId = req.user._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    let user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Base fields that all users can update
    const fieldsToUpdate = {};
    if (req.body.name) fieldsToUpdate.name = req.body.name;
    if (req.body.phone) fieldsToUpdate.phone = req.body.phone;
    if (req.body.avatar) fieldsToUpdate.avatar = req.body.avatar;

    // Worker-specific fields
    if (user.role === 'worker') {
      if (req.body.profession) fieldsToUpdate.profession = req.body.profession;
      if (req.body.skills) fieldsToUpdate.skills = req.body.skills;
      if (req.body.experience !== undefined) fieldsToUpdate.experience = req.body.experience;
      if (req.body.bio !== undefined) fieldsToUpdate.bio = req.body.bio;
      if (req.body.hourlyRate !== undefined) fieldsToUpdate.hourlyRate = req.body.hourlyRate;
      
      // Handle location - can be string or object
      if (req.body.location) {
        if (typeof req.body.location === 'string') {
          fieldsToUpdate['location.address'] = req.body.location;
          fieldsToUpdate['location.city'] = req.body.location;
        } else if (typeof req.body.location === 'object') {
          if (req.body.location.address) fieldsToUpdate['location.address'] = req.body.location.address;
          if (req.body.location.city) fieldsToUpdate['location.city'] = req.body.location.city;
          if (req.body.location.state) fieldsToUpdate['location.state'] = req.body.location.state;
          if (req.body.location.pincode) fieldsToUpdate['location.pincode'] = req.body.location.pincode;
          if (req.body.location.coordinates) fieldsToUpdate['location.coordinates'] = req.body.location.coordinates;
        }
      }
      
      // Use Worker model for worker updates
      const updatedUser = await Worker.findByIdAndUpdate(
        userId, 
        { $set: fieldsToUpdate }, 
        {
          new: true,
          runValidators: true
        }
      );

      return res.status(200).json({
        success: true,
        data: updatedUser
      });
    }

    // Employer-specific fields
    if (user.role === 'employer') {
      if (req.body.companyName) fieldsToUpdate.companyName = req.body.companyName;
      if (req.body.companyDescription) fieldsToUpdate.companyDescription = req.body.companyDescription;
      if (req.body.website) fieldsToUpdate.website = req.body.website;
      if (req.body.companySize) fieldsToUpdate.companySize = req.body.companySize;
      if (req.body.industry) fieldsToUpdate.industry = req.body.industry;
      if (req.body.location) fieldsToUpdate.location = req.body.location;
      
      // Use Employer model for employer updates
      const updatedUser = await Employer.findByIdAndUpdate(
        userId, 
        { $set: fieldsToUpdate }, 
        {
          new: true,
          runValidators: true
        }
      );

      return res.status(200).json({
        success: true,
        data: updatedUser
      });
    }

    // For other roles, use base User model
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { $set: fieldsToUpdate }, 
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private (with protect middleware)
export const updatePassword = async (req, res, next) => {
  try {
    // Only use authenticated user ID from JWT token
    const userId = req.user._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
