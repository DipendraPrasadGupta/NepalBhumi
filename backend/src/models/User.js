import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      unique: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'agent', 'admin'],
      default: 'user',
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    kycDocs: [
      {
        docType: String,
        docUrl: String,
        uploadedAt: Date,
      },
    ],
    kycVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      street: String,
      apartment: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    work: String,
    dreamTravel: String,
    languages: [String],
    birthDate: Date,
    funFacts: String,
    timeSink: String,
    residence: String,
    obsession: String,
    licenseNumber: String,
    experienceYears: {
      type: Number,
      default: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
    homePage: String,
    agencyInfo: {
      name: String,
      address: String,
      phone: String,
    },
    socialLinks: {
      whatsapp: String,
      facebook: String,
      instagram: String,
    },
    savedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
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
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
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

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.passwordHash = await bcryptjs.hash(this.passwordHash, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

export default User;
