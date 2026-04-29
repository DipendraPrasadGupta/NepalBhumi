import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    type: {
      type: String,
      enum: [
        'house', 'flat', 'land', 'commercial', 'single-room', 'sharing-room', 'premium-room', 
        '1bhk', '2bhk', '3bhk', 'apartment', 'single-family', 'multi-family', 'studio', 
        'penthouse', 'office-space', 'store-front', 'warehouse', 'workshop', 'food-services', 
        'guest-services', 'medical-services', 'mixed-commercial', 'agricultural', 
        'residential', 'industrial', 'mixed-use'
      ],
      required: true,
    },
    purpose: {
      type: String,
      enum: ['rent', 'sale'],
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'NPR',
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        url: String,
        publicId: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    location: {
      province: String,
      district: String,
      municipality: String,
      ward: String,
      streetTole: String,
      address: String,
      city: {
        type: String,
        required: true,
      },
      state: String,
      postalCode: String,
      country: {
        type: String,
        default: 'Nepal',
      },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
      landmark: String,
    },
    features: {
      bedrooms: {
        type: Number,
        min: 0,
      },
      bathrooms: {
        type: Number,
        min: 0,
      },
      area: {
        type: Number, // in sq meters
        min: 0,
      },
      furnished: {
        type: String,
        enum: ['furnished', 'unfurnished', 'semi-furnished'],
        default: 'unfurnished',
      },
      builtYear: Number,
      floor: String,
      facing: String,
      totalFloors: String,
      highlights: [String],
    },
    amenities: [String],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postedBy: {
      name: String,
      role: {
        type: String,
        default: 'Real Estate Agent',
      },
      phone: String,
      description: String,
      rating: {
        type: Number,
        default: 5,
        min: 0,
        max: 5,
      },
      profilePicture: String,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'archived', 'rejected'],
      default: 'pending',
    },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending', 'rejected'],
      default: 'pending',
    },
    views: {
      type: Number,
      default: 0,
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    featuredUntil: Date,
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create geospatial index for location-based queries
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ city: 1, purpose: 1, type: 1 });

const Property = mongoose.model('Property', propertySchema);

export default Property;
