import Property from '../models/Property.js';
import User from '../models/User.js';
import { deleteImage, uploadImages } from '../services/cloudinaryService.js';

// Get all properties for admin dashboard with filters
export const getAllPropertiesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, purpose, search } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (purpose) filter.purpose = purpose;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
      ];
    }

    const properties = await Property.find(filter)
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create property from admin dashboard
export const createPropertyAdmin = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      purpose,
      price,
      currency,
      location,
      features,
      amenities,
      agent,
      status,
      featured,
    } = req.body;

    // Validate required fields
    if (!title || !description || !type || !purpose || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, type, purpose, price',
      });
    }

    console.log('Creating property with files:', req.files ? req.files.length : 0);

    // Parse JSON fields if they're strings
    let parsedLocation = location ? (typeof location === 'string' ? JSON.parse(location) : location) : {};
    let parsedFeatures = features ? (typeof features === 'string' ? JSON.parse(features) : features) : {};
    let parsedAmenities = amenities ? (typeof amenities === 'string' ? JSON.parse(amenities) : amenities) : [];
    let parsedAgent = agent ? (typeof agent === 'string' ? JSON.parse(agent) : agent) : {};

    console.log('👤 Agent data received:', parsedAgent);

    // Handle image uploads
    let images = [];
    let agentProfileUrl = '';

    // Separate property images from agent profile picture
    const propertyFiles = [];
    const agentFiles = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (file.fieldname === 'agentProfilePicture') {
          agentFiles.push(file);
        } else {
          propertyFiles.push(file);
        }
      }
    }

    // Upload property images
    if (propertyFiles.length > 0) {
      console.log('Uploading', propertyFiles.length, 'property images to Cloudinary');
      try {
        const uploadedImages = await uploadImages(propertyFiles);
        console.log('Property images uploaded successfully:', uploadedImages.length);
        images = uploadedImages.map((img) => ({
          url: img.secure_url,
          publicId: img.public_id,
        }));
        console.log('Images formatted for database:', images.length);
      } catch (uploadError) {
        console.error('Property image upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Image upload failed: ' + uploadError.message,
        });
      }
    }

    // Upload agent profile picture
    if (agentFiles.length > 0) {
      console.log('Uploading agent profile picture to Cloudinary');
      try {
        const uploadedAgent = await uploadImages(agentFiles);
        console.log('Agent image uploaded successfully');
        agentProfileUrl = uploadedAgent[0].secure_url;
        parsedAgent.profilePicture = agentProfileUrl;
        console.log('👤 Agent profile picture updated:', agentProfileUrl);
      } catch (uploadError) {
        console.error('Agent image upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Agent image upload failed: ' + uploadError.message,
        });
      }
    }

    // Create property with coordinates
    const property = await Property.create({
      title,
      description,
      type,
      purpose,
      price: parseInt(price),
      currency: currency || 'NPR',
      location: {
        province: parsedLocation.province || '',
        district: parsedLocation.district || '',
        municipality: parsedLocation.municipality || '',
        ward: parsedLocation.ward || '',
        streetTole: parsedLocation.streetTole || '',
        address: parsedLocation.address || '',
        city: parsedLocation.city || 'Kathmandu',
        state: parsedLocation.state || '',
        postalCode: parsedLocation.postalCode || '',
        country: parsedLocation.country || 'Nepal',
        landmark: parsedLocation.landmark || '',
        coordinates: {
          type: 'Point',
          coordinates: [
            parseFloat(parsedLocation.coordinates?.lng || parsedLocation.lng || 85.3240),
            parseFloat(parsedLocation.coordinates?.lat || parsedLocation.lat || 27.7172),
          ],
        },
      },
      features: {
        bedrooms: parsedFeatures.bedrooms || 0,
        bathrooms: parsedFeatures.bathrooms || 0,
        area: parsedFeatures.area || 0,
        furnished: parsedFeatures.furnished || 'unfurnished',
        builtYear: parsedFeatures.builtYear || new Date().getFullYear(),
        floor: parsedFeatures.floor || '',
        facing: parsedFeatures.facing || 'South',
        totalFloors: parsedFeatures.totalFloors || '',
      },
      amenities: parsedAmenities,
      images: images,
      ownerId: req.user.userId || req.user._id,
      postedBy: {
        name: parsedAgent.name || 'Nepal Bhumi Agent',
        role: parsedAgent.role || 'Real Estate Agent',
        phone: parsedAgent.phone || '',
        description: parsedAgent.description || '',
        rating: parsedAgent.rating || 5,
        profilePicture: parsedAgent.profilePicture || '',
      },
      status: status || 'active',
      verificationStatus: 'verified',
      featured: featured || false,
    });

    console.log('Property created with', images.length, 'images and agent info:', parsedAgent.name);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property,
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update property from admin dashboard
export const updatePropertyAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, purpose, price, currency, location, features, amenities, agent, status, featured } = req.body;

    console.log('[ADMIN UPDATE]', 'Property ID:', id);
    console.log('[ADMIN UPDATE]', 'Received data:', {
      title,
      type,
      purpose,
      price,
      status,
      featured,
      hasLocation: !!location,
      hasFeatures: !!features,
      hasAmenities: !!amenities,
      hasAgent: !!agent,
      files: req.files?.length || 0,
    });
    
    if (agent) {
      console.log('[ADMIN UPDATE]', 'Agent (raw):', agent);
      const parsedAgent = typeof agent === 'string' ? JSON.parse(agent) : agent;
      console.log('[ADMIN UPDATE]', 'Agent (parsed):', parsedAgent);
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    console.log('[ADMIN UPDATE]', 'Updating property with files:', req.files ? req.files.length : 0);

    // Update basic fields
    if (title) property.title = title;
    if (description) property.description = description;
    if (type) property.type = type;
    if (purpose) property.purpose = purpose;
    if (price) property.price = parseInt(price);
    if (currency) property.currency = currency;
    if (status) property.status = status;
    if (featured !== undefined) property.featured = featured;

    // Update location if provided
    if (location) {
      console.log('[ADMIN UPDATE]', 'Updating location...');
      const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
      console.log('[ADMIN UPDATE]', 'Parsed location data:', parsedLocation);
      
      property.location = {
        province: parsedLocation.province || property.location?.province || '',
        district: parsedLocation.district || property.location?.district || '',
        municipality: parsedLocation.municipality || property.location?.municipality || '',
        ward: parsedLocation.ward || property.location?.ward || '',
        streetTole: parsedLocation.streetTole || property.location?.streetTole || '',
        address: parsedLocation.address || property.location?.address || '',
        city: parsedLocation.city || property.location?.city || 'Kathmandu',
        state: parsedLocation.state || property.location?.state || '',
        postalCode: parsedLocation.postalCode || property.location?.postalCode || '',
        country: parsedLocation.country || property.location?.country || 'Nepal',
        landmark: parsedLocation.landmark || property.location?.landmark || '',
        coordinates: {
          type: 'Point',
          coordinates: [
            parseFloat(parsedLocation.coordinates?.lng || parsedLocation.lng || property.location?.coordinates?.coordinates[0] || 85.3240),
            parseFloat(parsedLocation.coordinates?.lat || parsedLocation.lat || property.location?.coordinates?.coordinates[1] || 27.7172),
          ],
        },
      };
      console.log('[ADMIN UPDATE]', 'Location updated to:', property.location);
    }

    // Update features if provided
    if (features) {
      console.log('[ADMIN UPDATE]', 'Updating features...');
      const parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      console.log('[ADMIN UPDATE]', 'Parsed features data:', parsedFeatures);
      
      property.features = {
        bedrooms: parsedFeatures.bedrooms !== undefined ? parsedFeatures.bedrooms : property.features?.bedrooms || 0,
        bathrooms: parsedFeatures.bathrooms !== undefined ? parsedFeatures.bathrooms : property.features?.bathrooms || 0,
        area: parsedFeatures.area !== undefined ? parsedFeatures.area : property.features?.area || 0,
        furnished: parsedFeatures.furnished || property.features?.furnished || 'unfurnished',
        builtYear: parsedFeatures.builtYear || property.features?.builtYear || new Date().getFullYear(),
        floor: parsedFeatures.floor || property.features?.floor || '',
        facing: parsedFeatures.facing || property.features?.facing || 'South',
        totalFloors: parsedFeatures.totalFloors || property.features?.totalFloors || '',
      };
      console.log('[ADMIN UPDATE]', 'Features updated to:', property.features);
    }

    // Update amenities if provided
    if (amenities) {
      console.log('[ADMIN UPDATE]', 'Updating amenities...');
      const parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
      console.log('[ADMIN UPDATE]', 'Parsed amenities data:', parsedAmenities);
      property.amenities = parsedAmenities;
    }

    // Update agent if provided
    if (agent) {
      console.log('[ADMIN UPDATE]', 'Updating agent information...');
      const parsedAgent = typeof agent === 'string' ? JSON.parse(agent) : agent;
      console.log('[ADMIN UPDATE]', 'Parsed agent data:', parsedAgent);
      property.postedBy = {
        name: parsedAgent.name || property.postedBy?.name || 'Nepal Bhumi Agent',
        role: parsedAgent.role || property.postedBy?.role || 'Real Estate Agent',
        phone: parsedAgent.phone || property.postedBy?.phone || '',
        description: parsedAgent.description || property.postedBy?.description || '',
        rating: parsedAgent.rating !== undefined ? parsedAgent.rating : (property.postedBy?.rating || 5),
        profilePicture: parsedAgent.profilePicture || property.postedBy?.profilePicture || '',
      };
      console.log('[ADMIN UPDATE]', 'Agent updated to:', property.postedBy);
    }

    // Handle file uploads (separate property images from agent profile picture)
    const propertyFiles = [];
    const agentFiles = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (file.fieldname === 'agentProfilePicture') {
          agentFiles.push(file);
        } else {
          propertyFiles.push(file);
        }
      }
    }

    // Upload property images
    if (propertyFiles.length > 0) {
      console.log('[ADMIN UPDATE]', 'Uploading', propertyFiles.length, 'property images to Cloudinary');
      try {
        const uploadedImages = await uploadImages(propertyFiles);
        console.log('[ADMIN UPDATE]', 'Images uploaded successfully:', uploadedImages.length);
        const newImages = uploadedImages.map((img) => ({
          url: img.secure_url,
          publicId: img.public_id,
        }));
        // Add new images to existing ones
        property.images = [...(property.images || []), ...newImages];
        console.log('[ADMIN UPDATE]', 'Total property images after update:', property.images.length);
      } catch (uploadError) {
        console.error('[ADMIN UPDATE]', 'Property image upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Property image upload failed: ' + uploadError.message,
        });
      }
    }

    // Upload agent profile picture
    if (agentFiles.length > 0) {
      console.log('[ADMIN UPDATE]', 'Uploading agent profile picture to Cloudinary');
      try {
        const uploadedAgent = await uploadImages(agentFiles);
        console.log('[ADMIN UPDATE]', 'Agent image uploaded successfully');
        const agentProfileUrl = uploadedAgent[0].secure_url;
        if (!property.postedBy) {
          property.postedBy = { name: 'Nepal Bhumi Agent', role: 'Real Estate Agent' };
        }
        property.postedBy.profilePicture = agentProfileUrl;
        console.log('[ADMIN UPDATE]', 'Agent profile picture updated:', agentProfileUrl);
      } catch (uploadError) {
        console.error('[ADMIN UPDATE]', 'Agent image upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Agent image upload failed: ' + uploadError.message,
        });
      }
    }

    // Force mark as modified if nested objects were updated
    if (location) property.markModified('location');
    if (features) property.markModified('features');
    if (amenities) property.markModified('amenities');
    if (agent) property.markModified('postedBy');
    
    property.updatedAt = new Date();
    const savedProperty = await property.save();

    console.log('[ADMIN UPDATE]', 'Property saved successfully');
    console.log('[ADMIN UPDATE]', 'Saved location:', savedProperty.location);
    console.log('[ADMIN UPDATE]', 'Saved features:', savedProperty.features);
    console.log('[ADMIN UPDATE]', 'Saved agent:', savedProperty.postedBy);
    console.log('[ADMIN UPDATE]', 'Full saved property:', JSON.stringify(savedProperty, null, 2));

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: savedProperty,
    });
  } catch (error) {
    console.error('[ADMIN UPDATE]', 'Error updating property:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete property image
export const deletePropertyImage = async (req, res) => {
  try {
    const { propertyId, imageId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    const imageIndex = property.images.findIndex((img) => img._id.toString() === imageId);
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    const image = property.images[imageIndex];
    if (image.publicId) {
      await deleteImage(image.publicId);
    }

    property.images.splice(imageIndex, 1);
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: property,
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete property
export const deletePropertyAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Delete images from cloudinary
    if (property.images && property.images.length > 0) {
      for (const image of property.images) {
        if (image.publicId) {
          await deleteImage(image.publicId);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get enhanced dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ status: 'active' });
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const rentProperties = await Property.countDocuments({ purpose: 'rent' });
    const totalUsers = await User.countDocuments();

    const stats = {
      totalProperties,
      activeProperties,
      pendingProperties,
      rentProperties,
      totalUsers,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update property status
export const updatePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'active', 'archived', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const property = await Property.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property status updated successfully',
      data: property,
    });
  } catch (error) {
    console.error('Error updating property status:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Bulk upload properties
export const bulkUploadProperties = async (req, res) => {
  try {
    const properties = req.body;

    if (!Array.isArray(properties) || properties.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of properties',
      });
    }

    const createdProperties = [];
    const errors = [];

    for (let i = 0; i < properties.length; i++) {
      try {
        const {
          title,
          description,
          type,
          purpose,
          price,
          currency,
          location,
          features,
          amenities,
        } = properties[i];

        if (!title || !description || !type || !purpose || !price) {
          errors.push({
            row: i + 1,
            error: 'Missing required fields',
          });
          continue;
        }

        const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
        const parsedFeatures = features ? (typeof features === 'string' ? JSON.parse(features) : features) : {};
        const parsedAmenities = amenities ? (typeof amenities === 'string' ? JSON.parse(amenities) : amenities) : [];

        const property = await Property.create({
          title,
          description,
          type,
          purpose,
          price: parseInt(price),
          currency: currency || 'NPR',
          location: {
            address: parsedLocation.address || '',
            city: parsedLocation.city || 'Kathmandu',
            state: parsedLocation.state || '',
            postalCode: parsedLocation.postalCode || '',
            country: parsedLocation.country || 'Nepal',
            landmark: parsedLocation.landmark || '',
            coordinates: {
              type: 'Point',
              coordinates: [
                parseFloat(parsedLocation.coordinates?.lng || parsedLocation.lng || 85.3240),
                parseFloat(parsedLocation.coordinates?.lat || parsedLocation.lat || 27.7172),
              ],
            },
          },
          features: {
            bedrooms: parsedFeatures.bedrooms || 0,
            bathrooms: parsedFeatures.bathrooms || 0,
            area: parsedFeatures.area || 0,
            furnished: parsedFeatures.furnished || 'unfurnished',
          },
          amenities: parsedAmenities,
          ownerId: req.user.userId || req.user._id,
          status: 'active',
          verificationStatus: 'verified',
        });

        createdProperties.push(property);
      } catch (err) {
        errors.push({
          row: i + 1,
          error: err.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `${createdProperties.length} properties created successfully`,
      data: {
        created: createdProperties.length,
        failed: errors.length,
        createdProperties,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error('Error in bulk upload:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Ban a user
export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User banned successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users for admin dashboard
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 100, search, role, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) filter.role = role;
    if (status) filter.isActive = status === 'active';

    const users = await User.find(filter)
      .select('-password') // Don't send passwords
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete user
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Unban a user
export const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User unbanned successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
