import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'NPR',
    },
    method: {
      type: String,
      enum: ['card', 'bank-transfer', 'stripe', 'khalti', 'esewa'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentGatewayId: String,
    reference: String,
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    description: String,
    failureReason: String,
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

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
