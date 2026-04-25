import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    enum: ['admin', 'user'],
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientEmail: String,
  recipientName: String,
  message: {
    type: String,
    required: true
  },
  reply: {
    type: String,
    default: null
  },
  replyAt: {
    type: Date,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Message', MessageSchema);
