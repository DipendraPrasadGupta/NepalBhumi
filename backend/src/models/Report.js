import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reporterEmail: {
      type: String,
      required: true,
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reason: {
      type: String,
      enum: ['fake_account', 'spam', 'inappropriate_content', 'harassment', 'fraud', 'illegal_activity', 'other'],
      required: true,
    },
    details: {
      type: String,
      required: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Report', reportSchema);
