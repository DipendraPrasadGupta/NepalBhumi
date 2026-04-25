import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    messages: [
      {
        fromId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        attachments: [String], // URLs of images/documents
        timestamp: {
          type: Date,
          default: Date.now,
        },
        seen: {
          type: Boolean,
          default: false,
        },
      },
    ],
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    closedAt: Date,
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

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;
