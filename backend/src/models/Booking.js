import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingType: {
      type: String,
      enum: ['deposit', 'full-payment', 'inquiry'],
      default: 'inquiry',
    },
    startDate: Date,
    endDate: Date,
    amount: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: 'NPR',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'paid', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'pending', 'completed', 'failed', 'refunded'],
      default: 'unpaid',
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    notes: String,
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

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
