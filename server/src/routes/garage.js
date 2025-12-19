import express from 'express';
import User from '../models/User.js';
import Service from '../models/Service.js';
import { protect, garageOnly } from '../middleware/auth.js';

const router = express.Router();

// @desc    Update garage profile
// @route   PUT /api/garage/profile
// @access  Private (Garage only)
router.put('/profile', protect, garageOnly, async (req, res) => {
    try {
        const { name, garageName, address, servicesOffered, location } = req.body;

        const garage = await User.findByIdAndUpdate(
            req.user._id,
            {
                name,
                garageName,
                address,
                servicesOffered,
                location
            },
            { new: true, runValidators: true }
        ).select('-otp -otpExpiry');

        res.status(200).json({
            success: true,
            user: garage
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

// @desc    Get garage stats
// @route   GET /api/garage/stats
// @access  Private (Garage only)
router.get('/stats', protect, garageOnly, async (req, res) => {
    try {
        const totalServices = await Service.countDocuments({
            garageId: req.user._id,
            status: 'completed'
        });

        const totalEarnings = await Service.aggregate([
            { $match: { garageId: req.user._id, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const pendingCount = await Service.countDocuments({
            garageId: req.user._id,
            status: { $in: ['pending_otp', 'pending_payment'] }
        });

        res.status(200).json({
            success: true,
            stats: {
                totalServices,
                totalEarnings: totalEarnings[0]?.total || 0,
                pendingCount,
                rating: req.user.rating || 0
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get stats'
        });
    }
});

// @desc    Get public garage profile (portfolio)
// @route   GET /api/garage/:id/public
// @access  Public
router.get('/:id/public', async (req, res) => {
    try {
        const garage = await User.findById(req.params.id)
            .select('name garageName address servicesOffered totalServices totalEarnings rating');

        if (!garage || garage.role !== 'garage') {
            return res.status(404).json({
                success: false,
                message: 'Garage not found'
            });
        }

        const services = await Service.find({
            garageId: garage._id,
            status: 'completed'
        })
            .select('description amount completedAt')
            .sort({ completedAt: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            garage,
            portfolio: services
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get garage'
        });
    }
});

// @desc    List all garages (for customer browsing)
// @route   GET /api/garage/list
// @access  Public
router.get('/list', async (req, res) => {
    try {
        const garages = await User.find({ role: 'garage' })
            .select('name garageName address servicesOffered totalServices rating location')
            .sort({ totalServices: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            count: garages.length,
            garages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to list garages'
        });
    }
});

export default router;
