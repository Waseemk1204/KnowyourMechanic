import bcrypt from 'bcryptjs';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { sendServiceVerificationOTP } from '../services/otpService.js';

// @desc    Initiate add service flow (sends OTP to customer)
// @route   POST /api/services/initiate
// @access  Private (Garage only)
export const initiateService = async (req, res) => {
    try {
        const { customerPhone, description, amount } = req.body;
        const garage = req.user;

        // Validation
        if (!customerPhone || customerPhone.length !== 10) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 10-digit phone number'
            });
        }

        if (!description || !amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Description and valid amount are required'
            });
        }

        // Send OTP to customer
        const otp = await sendServiceVerificationOTP(
            customerPhone,
            garage.garageName || garage.name,
            description,
            amount
        );

        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Create pending service record
        const service = await Service.create({
            garageId: garage._id,
            customerPhone,
            description,
            amount,
            otp: hashedOtp,
            otpExpiry,
            status: 'pending_otp'
        });

        res.status(201).json({
            success: true,
            message: 'OTP sent to customer',
            serviceId: service._id,
            // In development, return OTP for testing
            ...(process.env.NODE_ENV === 'development' && { devOtp: otp })
        });

    } catch (error) {
        console.error('Initiate service error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initiate service'
        });
    }
};

// @desc    Verify customer OTP for service
// @route   POST /api/services/:id/verify
// @access  Private (Garage only)
export const verifyServiceOtp = async (req, res) => {
    try {
        const { id } = req.params;
        const { otp } = req.body;
        const garage = req.user;

        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Verify service belongs to this garage
        if (service.garageId.toString() !== garage._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Check status
        if (service.status !== 'pending_otp') {
            return res.status(400).json({
                success: false,
                message: `Service is already ${service.status}`
            });
        }

        // Check expiry
        if (service.otpExpiry < new Date()) {
            service.status = 'expired';
            await service.save();
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please initiate again.'
            });
        }

        // Verify OTP
        const isOtpValid = await bcrypt.compare(otp, service.otp);

        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // OTP verified - move to payment
        service.otp = undefined;
        service.otpExpiry = undefined;
        service.status = 'pending_payment';
        service.verifiedAt = new Date();
        await service.save();

        // TODO: Generate Razorpay payment link here
        // For now, simulate with a mock payment URL
        const paymentUrl = `upi://pay?pa=merchant@upi&pn=KnowyourMechanic&am=${service.amount}&tn=Service:${service._id}`;

        res.status(200).json({
            success: true,
            message: 'OTP verified. Proceed to payment.',
            service: {
                id: service._id,
                amount: service.amount,
                description: service.description
            },
            paymentUrl,
            // Mock QR data (in real app, this would be Razorpay QR)
            mockPayment: process.env.NODE_ENV === 'development'
        });

    } catch (error) {
        console.error('Verify service OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Verification failed'
        });
    }
};

// @desc    Complete payment (mock for development)
// @route   POST /api/services/:id/complete-payment
// @access  Private (Garage only)
export const completePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const garage = req.user;

        const service = await Service.findById(id);

        if (!service || service.garageId.toString() !== garage._id.toString()) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        if (service.status !== 'pending_payment') {
            return res.status(400).json({
                success: false,
                message: `Cannot complete. Current status: ${service.status}`
            });
        }

        // Mark as completed
        service.status = 'completed';
        service.completedAt = new Date();
        service.razorpayPaymentId = 'mock_payment_' + Date.now();
        await service.save();

        // Update garage stats
        await User.findByIdAndUpdate(garage._id, {
            $inc: {
                totalServices: 1,
                totalEarnings: service.amount
            }
        });

        // Find or create customer
        let customer = await User.findOne({ phone: service.customerPhone });
        if (!customer) {
            customer = await User.create({
                phone: service.customerPhone,
                role: 'customer'
            });
        }

        // Link service to customer
        service.customerId = customer._id;
        await service.save();

        // Generate WhatsApp link for notification
        const whatsappMessage = encodeURIComponent(
            `✅ Service Verified\n\n` +
            `Garage: ${garage.garageName || garage.name}\n` +
            `Service: ${service.description}\n` +
            `Amount: ₹${service.amount}\n\n` +
            `Your account has been created. Login anytime to find verified garages.\n\n` +
            `Not satisfied? Report: [link]`
        );
        const whatsappUrl = `https://wa.me/91${service.customerPhone}?text=${whatsappMessage}`;

        res.status(200).json({
            success: true,
            message: 'Payment completed. Service added to portfolio.',
            service: {
                id: service._id,
                description: service.description,
                amount: service.amount,
                completedAt: service.completedAt
            },
            whatsappUrl,
            customerCreated: !customer.name // true if new customer
        });

    } catch (error) {
        console.error('Complete payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete payment'
        });
    }
};

// @desc    Get garage's services (portfolio)
// @route   GET /api/services/portfolio
// @access  Private (Garage only)
export const getPortfolio = async (req, res) => {
    try {
        const services = await Service.find({
            garageId: req.user._id,
            status: 'completed'
        })
            .sort({ completedAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            count: services.length,
            services
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch portfolio'
        });
    }
};

// @desc    Get pending services for garage
// @route   GET /api/services/pending
// @access  Private (Garage only)
export const getPendingServices = async (req, res) => {
    try {
        const services = await Service.find({
            garageId: req.user._id,
            status: { $in: ['pending_otp', 'pending_payment'] }
        })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: services.length,
            services
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending services'
        });
    }
};

// @desc    Get customer's received services
// @route   GET /api/services/my-services
// @access  Private (Customer)
export const getMyServices = async (req, res) => {
    try {
        const services = await Service.find({
            customerPhone: req.user.phone
        })
            .populate('garageId', 'name garageName address')
            .sort({ completedAt: -1 });

        res.status(200).json({
            success: true,
            count: services.length,
            services
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch services'
        });
    }
};

export default {
    initiateService,
    verifyServiceOtp,
    completePayment,
    getPortfolio,
    getPendingServices,
    getMyServices
};
