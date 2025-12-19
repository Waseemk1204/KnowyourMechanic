import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendLoginOTP } from '../services/otpService.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Send OTP to phone number
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOtp = async (req, res) => {
    try {
        const { phone, role = 'customer' } = req.body;

        if (!phone || phone.length !== 10) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 10-digit phone number'
            });
        }

        // Generate and send OTP
        const otp = await sendLoginOTP(phone);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Hash OTP before storing
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Find or create user
        let user = await User.findOne({ phone });

        if (user) {
            // Update OTP for existing user
            user.otp = hashedOtp;
            user.otpExpiry = otpExpiry;
            await user.save();
        } else {
            // Create new user with OTP
            user = await User.create({
                phone,
                role,
                otp: hashedOtp,
                otpExpiry
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            isNewUser: !user.name,
            // In development, return OTP for easy testing
            ...(process.env.NODE_ENV === 'development' && { devOtp: otp })
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP'
        });
    }
};

// @desc    Verify OTP and login/register
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
    try {
        const { phone, otp, name, role, garageName, address } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Phone and OTP are required'
            });
        }

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please request OTP first.'
            });
        }

        // Check OTP expiry
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            });
        }

        // Verify OTP
        const isOtpValid = await bcrypt.compare(otp, user.otp);

        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpiry = undefined;

        // Update profile if provided (for new users)
        if (name) user.name = name;
        if (role) user.role = role;
        if (garageName) user.garageName = garageName;
        if (address) user.address = address;

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                phone: user.phone,
                name: user.name,
                role: user.role,
                garageName: user.garageName,
                address: user.address,
                isProfileComplete: !!user.name
            }
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Verification failed'
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
};

// @desc    Login with Firebase (Phone Auth)
// @route   POST /api/auth/firebase-login
// @access  Public
export const firebaseLogin = async (req, res) => {
    try {
        const { phone, role, name, garageName, address, uid } = req.body;

        if (!phone || !uid) {
            return res.status(400).json({
                success: false,
                message: 'Phone and UID are required'
            });
        }

        // Find or create user
        let user = await User.findOne({ phone });
        let isNewUser = false;

        if (!user) {
            isNewUser = true;
            user = await User.create({
                phone,
                role: role || 'customer',
                name: name || '',
                garageName: garageName || '',
                address: address || ''
            });
        } else {
            // Update existing user if profile data provided
            if (name) user.name = name;
            if (role) user.role = role; // Careful with role switching? Allowed for now.
            if (garageName) user.garageName = garageName;
            if (address) user.address = address;
            await user.save();
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            isNewUser,
            user: {
                id: user._id,
                phone: user.phone,
                name: user.name,
                role: user.role,
                garageName: user.garageName,
                address: user.address,
                isProfileComplete: !!user.name
            }
        });

    } catch (error) {
        console.error('Firebase login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};

export default { sendOtp, verifyOtp, firebaseLogin, getMe };
