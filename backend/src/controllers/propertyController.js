import Property from '../models/Property.js';
import { paginationParams } from '../utils/helpers.js';
import { uploadImages, deleteImage } from '../services/cloudinaryService.js';
import { sendPropertyApprovedEmail } from '../services/mailService.js';

export const createProperty = async (req, res) => {
  try {
    const { title, description, type, purpose, price, currency, location, features, amenities } =
      req.body;

    if (!title || !description || !type || !purpose || !price) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Parse location and features
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    const parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
    const parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;

    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadedImages = await uploadImages(req.files);
      images = uploadedImages.map((img) => ({
        url: img.secure_url,
        publicId: img.public_id,
      }));
    }

    // Ensure coordinates are in GeoJSON format [lng, lat]
    const coordinates = [
      parseFloat(parsedLocation.coordinates?.lng || parsedLocation.lng || 85.3240),
      parseFloat(parsedLocation.coordinates?.lat || parsedLocation.lat || 27.7172),
    ];

    const property = await Property.create({
      title,
      description,
      type,
      purpose,
      price,
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
          coordinates: coordinates,
        },
      },
      features: parsedFeatures,
      amenities: parsedAmenities,
      images,
      ownerId: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProperties = async (req, res) => {
  try {
    const { page, limit, type, purpose, city, minPrice, maxPrice, search } = req.query;
    const { skip, limit: pageLimit } = paginationParams(page, limit);

    const filter = { status: 'active' };

    if (type) filter.type = type;
    if (purpose) filter.purpose = purpose;
    if (city) filter['location.city'] = city;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const properties = await Property.find(filter)
      .populate('ownerId', 'name email phone')
      .skip(skip)
      .limit(pageLimit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page: Math.floor(skip / pageLimit) + 1,
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('ownerId', 'name email phone avatarUrl bio ratings role');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    console.log('[UPDATE]', 'Updating property:', req.params.id);
    console.log('[UPDATE]', 'Request body:', JSON.stringify(req.body, null, 2));
    console.log('[UPDATE]', 'Files received:', req.files?.length || 0);

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    // Extract and parse fields
    const {
      title,
      description,
      type,
      purpose,
      price,
      currency,
      status,
      featured,
      location,
      features,
      amenities,
    } = req.body;

    // Update basic fields
    if (title) property.title = title;
    if (description) property.description = description;
    if (type) property.type = type;
    if (purpose) property.purpose = purpose;
    if (price) property.price = price;
    if (currency) property.currency = currency;
    if (status !== undefined) property.status = status;
    if (featured !== undefined) property.featured = featured === 'true' || featured === true;

    // Parse and update location
    if (location) {
      const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
      const coordinates = [
        parseFloat(parsedLocation.lng || property.location?.coordinates?.coordinates[0] || 85.3240),
        parseFloat(parsedLocation.lat || property.location?.coordinates?.coordinates[1] || 27.7172),
      ];

      property.location = {
        province: parsedLocation.province || property.location?.province || '',
        district: parsedLocation.district || property.location?.district || '',
        municipality: parsedLocation.municipality || property.location?.municipality || '',
        ward: parsedLocation.ward || property.location?.ward || '',
        streetTole: parsedLocation.streetTole || property.location?.streetTole || '',
        address: parsedLocation.address || property.location?.address || '',
        city: parsedLocation.city || property.location?.city || 'Kathmandu',
        landmark: parsedLocation.landmark || property.location?.landmark || '',
        country: property.location?.country || 'Nepal',
        coordinates: {
          type: 'Point',
          coordinates: coordinates,
        },
      };
    }

    // Parse and update features
    if (features) {
      const parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      property.features = {
        bedrooms: parseInt(parsedFeatures.bedrooms) || 0,
        bathrooms: parseInt(parsedFeatures.bathrooms) || 0,
        area: parseInt(parsedFeatures.area) || 0,
        furnished: parsedFeatures.furnished || 'unfurnished',
        builtYear: parseInt(parsedFeatures.builtYear) || new Date().getFullYear(),
        floor: parsedFeatures.floor || '',
        facing: parsedFeatures.facing || 'South',
        totalFloors: parsedFeatures.totalFloors || '',
      };
    }

    // Parse and update amenities
    if (amenities) {
      const parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
      property.amenities = parsedAmenities;
    }

    // Handle new images if provided
    if (req.files && req.files.length > 0) {
      console.log('[UPDATE]', 'Uploading new images:', req.files.length);
      try {
        const uploadedImages = await uploadImages(req.files);
        const newImages = uploadedImages.map((img) => ({
          url: img.secure_url,
          publicId: img.public_id,
        }));
        property.images = newImages;
        console.log('[UPDATE]', 'Images uploaded successfully');
      } catch (imageError) {
        console.error('[UPDATE]', 'Image upload error:', imageError);
        return res.status(400).json({ message: 'Failed to upload images: ' + imageError.message });
      }
    }

    console.log('[UPDATE]', 'Saving property changes...');
    await property.save();

    console.log('[UPDATE]', 'Property updated successfully');
    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    console.error('[UPDATE]', 'Error updating property:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    // Delete images from cloudinary
    for (const image of property.images) {
      await deleteImage(image.publicId);
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const userId = req.user.userId;
    if (property.savedBy.includes(userId)) {
      property.savedBy = property.savedBy.filter((id) => id.toString() !== userId);
    } else {
      property.savedBy.push(userId);
    }

    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property saved successfully',
      data: property,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedProperties = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { skip, limit: pageLimit } = paginationParams(page, limit);

    const properties = await Property.find({ savedBy: req.user.userId })
      .skip(skip)
      .limit(pageLimit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments({ savedBy: req.user.userId });

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page: Math.floor(skip / pageLimit) + 1,
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
