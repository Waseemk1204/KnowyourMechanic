import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    garageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    customerPhone: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending_otp', 'pending_payment', 'completed', 'reported', 'expired'],
        default: 'pending_otp'
    },

    // OTP for customer verification
    otp: String,
    otpExpiry: Date,

    // Payment details
    razorpayOrderId: String,
    razorpayPaymentId: String,
    paymentMethod: String,

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    verifiedAt: Date,
    completedAt: Date
});

// Index for efficient queries
serviceSchema.index({ garageId: 1, status: 1 });
serviceSchema.index({ customerPhone: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
