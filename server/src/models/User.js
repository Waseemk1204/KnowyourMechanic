import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['customer', 'garage'],
        default: 'customer'
    },
    // For garage-specific fields
    garageName: String,
    address: String,
    location: {
        lat: Number,
        lng: Number
    },
    servicesOffered: [String],
    photoUrl: String,

    // Stats
    totalServices: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },

    // OTP handling
    otp: String,
    otpExpiry: Date,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual for checking if user is a garage
userSchema.virtual('isGarage').get(function () {
    return this.role === 'garage';
});

const User = mongoose.model('User', userSchema);

export default User;
