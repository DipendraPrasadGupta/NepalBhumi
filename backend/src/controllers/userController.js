import User from '../models/User.js';
import Property from '../models/Property.js';
import { uploadProfileImage } from '../middleware/upload.js';
import { uploadImages } from '../services/cloudinaryService.js';
import bcrypt from 'bcryptjs';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-passwordHash -kycDocs');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAgents = async (req, res) => {
  try {
    const { city, search } = req.query;
    
    // Base filter for agents only
    let filter = { role: 'agent' };

    // Apply city filter (checking both simple location string and nested address.city)
    if (city && city.trim() !== '') {
      const cityRegex = new RegExp(city.trim(), 'i');
      filter = {
        ...filter,
        $or: [
          { location: cityRegex },
          { 'address.city': cityRegex },
          { residence: cityRegex }
        ]
      };
    }

    // Apply general search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      
      const searchConditions = {
        $or: [
          { name: searchRegex },
          { 'agencyInfo.name': searchRegex },
          { work: searchRegex },
          { bio: searchRegex },
          { description: searchRegex }
        ]
      };

      if (filter.$or) {
        // If we already have a city filter utilizing $or, use $and to combine them
        filter = {
          $and: [
            filter,
            searchConditions
          ]
        };
      } else {
        filter = { ...filter, ...searchConditions };
      }
    }

    const agents = await User.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: 'ownerId',
          as: 'properties'
        }
      },
      {
        $addFields: {
          totalListings: { $size: '$properties' }
        }
      },
      {
        $project: {
          passwordHash: 0,
          kycDocs: 0,
          properties: 0
        }
      },
      { $sort: { 'ratings.average': -1, createdAt: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const { 
      name, email, bio, phone, address, city, district, province, state, postalCode, zipCode, socialLinks,
      username, work, dreamTravel, languages, birthDate,
      funFacts, timeSink, residence, obsession,
      licenseNumber, experienceYears, salesCount, homePage, agencyInfo, avatar 
    } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (phone) user.phone = phone;
    
    // Handle address object - map frontend fields to model fields
    if (address || city || district || province || state || postalCode || zipCode || req.body.apartment) {
      user.address = {
        ...user.address,
        street: address || user.address?.street || '',
        city: city || user.address?.city || '',
        state: state || province || user.address?.state || '',
        zipCode: zipCode || postalCode || user.address?.zipCode || '',
        apartment: req.body.apartment || user.address?.apartment || '',
        country: user.address?.country || '',
      };
    }

    // Gather social links from various possible formats
    const gatheredSocialLinks = {
      whatsapp: socialLinks?.whatsapp || req.body['socialLinks[whatsapp]'] || '',
      facebook: socialLinks?.facebook || req.body['socialLinks[facebook]'] || '',
      twitter: socialLinks?.twitter || req.body['socialLinks[twitter]'] || '',
      instagram: socialLinks?.instagram || req.body['socialLinks[instagram]'] || '',
      linkedin: socialLinks?.linkedin || req.body['socialLinks[linkedin]'] || '',
    };

    // Only update if at least one link is provided or we want to allow clearing
    user.socialLinks = { ...user.socialLinks, ...gatheredSocialLinks };
    if (username) user.username = username;
    if (work) user.work = work;
    if (dreamTravel) user.dreamTravel = dreamTravel;
    if (languages) {
      user.languages = Array.isArray(languages) ? languages : [languages];
    }
    if (birthDate) user.birthDate = birthDate;
    if (funFacts) user.funFacts = funFacts;
    if (timeSink) user.timeSink = timeSink;
    if (residence) user.residence = residence;
    if (obsession) user.obsession = obsession;
    if (licenseNumber) user.licenseNumber = licenseNumber;
    if (experienceYears !== undefined) user.experienceYears = experienceYears;
    if (salesCount !== undefined) user.salesCount = salesCount;
    if (homePage) user.homePage = homePage;
    
    // Gather agency info from possible flat formats
    const gatheredAgencyInfo = {
      name: agencyInfo?.name || req.body['agencyInfo[name]'] || user.agencyInfo?.name || '',
      address: agencyInfo?.address || req.body['agencyInfo[address]'] || user.agencyInfo?.address || '',
      phone: agencyInfo?.phone || req.body['agencyInfo[phone]'] || user.agencyInfo?.phone || '',
    };
    if (gatheredAgencyInfo.name || gatheredAgencyInfo.address || gatheredAgencyInfo.phone) {
      user.agencyInfo = gatheredAgencyInfo;
    }

    // Handle avatar upload (both base64 data URI and file uploads)
    if (avatar && typeof avatar === 'string' && avatar.startsWith('data:')) {
      // Convert base64 data URI to buffer
      try {
        const base64Data = avatar.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Create a file-like object for uploadImages
        const fileObj = {
          buffer: buffer,
          originalname: `avatar-${Date.now()}.jpg`,
          mimetype: 'image/jpeg'
        };
        
        const uploadedImage = await uploadImages([fileObj]);
        if (uploadedImage.length > 0) {
          user.avatarUrl = uploadedImage[0].secure_url;
        }
      } catch (uploadError) {
        console.error('Failed to upload base64 avatar:', uploadError);
        // Continue with profile update even if avatar upload fails
      }
    } else if (req.file) {
      // Handle file upload via multer
      try {
        const uploadedImage = await uploadImages([req.file]);
        if (uploadedImage.length > 0) {
          user.avatarUrl = uploadedImage[0].secure_url;
        }
      } catch (uploadError) {
        console.error('Failed to upload file avatar:', uploadError);
        // Continue with profile update even if avatar upload fails
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageLimit;

    const filter = { ownerId: req.user.userId };
    if (status) filter.status = status;

    const properties = await Property.find(filter).skip(skip).limit(pageLimit).sort({ createdAt: -1 });

    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page: pageNumber,
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgentListings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page, limit, status } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 100;
    const skip = (pageNumber - 1) * pageLimit;

    const filter = { ownerId: userId };
    if (status) filter.status = status;

    const properties = await Property.find(filter)
      .skip(skip)
      .limit(pageLimit)
      .sort({ createdAt: -1 })
      .select('-__v'); // Exclude version field

    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page: pageNumber,
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadKYC = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one document' });
    }

    const uploadedDocs = await uploadImages(req.files);

    user.kycDocs = uploadedDocs.map((doc) => ({
      docType: req.body.docType || 'other',
      docUrl: doc.secure_url,
      uploadedAt: new Date(),
    }));

    await user.save();

    res.status(200).json({
      success: true,
      message: 'KYC documents uploaded successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if old password is correct
    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    // Delete user account
    await User.findByIdAndDelete(req.user.userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleSaveAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (id === userId) {
      return res.status(400).json({ message: 'You cannot save your own profile' });
    }

    const user = await User.findById(userId);
    const agent = await User.findById(id);

    if (!user || !agent) {
      return res.status(404).json({ message: 'User or Agent not found' });
    }

    const isSaved = user.savedAgents.includes(id);

    if (isSaved) {
      user.savedAgents = user.savedAgents.filter((agentId) => agentId.toString() !== id);
    } else {
      user.savedAgents.push(id);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isSaved ? 'Agent removed from saved list' : 'Agent saved successfully',
      isSaved: !isSaved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedAgents = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate({
      path: 'savedAgents',
      select: 'name email phone avatarUrl work location address ratings salesCount experienceYears agencyInfo',
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user.savedAgents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
