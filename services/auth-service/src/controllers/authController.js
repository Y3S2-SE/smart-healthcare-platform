import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';
import { validateLogin, validateRegister } from '../validators/authValidator.js';


const generateToken = (user) => 
    jwt.sign(
        {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
        },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

const safeUser = (user) => ({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    displayName: user.displayName,
    email: user.email,
    role: user.role,
    isApproved: user.isApproved,
    isVerified: user.isVerified,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
});

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const { valid, errors } = validateRegister(req.body);
        if (!valid) {
            return res.status(400).json({ success: false, errors });
        }

        const { firstName, lastName, email, password, role } = req.body;

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({
                success: false,
                error: 'An account with this email already exists.',
            });
        }

        // Public can only register as patient or doctor
        const assignedRole = role === 'doctor' ? 'doctor' : 'patient';

        const user = await User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase(),
            password,
            role: assignedRole,
        });

        const token = generateToken(user);

        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        logger.success(`Registered [${user.role}]: ${user.fullName} — ${user.email}`);

        // Doctor gets a specific message about pending approval
        const message =
            assignedRole === 'doctor'
                ? `Welcome Dr. ${user.lastName}. Your account is pending admin approval.`
                : `Welcome ${user.firstName}. Your account is ready.`;

        res.status(201).json({
            success: true,
            message,
            token,
            user: safeUser(user),
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    User login
 * @route   POST /api/auth/register
 * @access  Public
 */
export const login = async (req, res, next) => {
    try {
        const { valid, errors } = validateLogin(req.body);
        if (!valid) {
            return res.status(400).json({ success: false, errors });
        }

        const { email, password } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase(),
        }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password.',
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                error: 'Account deactivated. Contact support.',
            });
        }

        const token = generateToken(user);

        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        logger.info(`Login [${user.role}]: ${user.fullName} — ${user.email}`);

        res.status(200).json({
            success: true,
            message: `Welcome back, ${user.firstName}.`,
            token,
            user: safeUser(user),
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    User logut
 * @route   POST /api/auth/login
 * @access  Private
 */
export const logout = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            lastLogin: new Date(),
        });

        logger.info(`Logout [${req.user.role}]: ${req.user.fullName}`);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully.',
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    View profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found.',
            });
        }
        res.status(200).json({ success: true, user: safeUser(user) });
    } catch (err) {
        next(err);
    }
};


/**
 * @desc    Update profile details
 * @route   PUT /api/auth/me
 * @access  Private
 */
export const updateMe = async (req, res, next) => {
    try {
        const allowed = ['firstName', 'lastName'];
        const updates = {};
        allowed.forEach((f) => {
            if (req.body[f] !== undefined) updates[f] = req.body[f];
        });

        if (!Object.keys(updates).length) {
            return res.status(400).json({
                success: false,
                error: 'Nothing to update.',
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, user: safeUser(user) });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
// export const changePassword = async (req, res, next) => {
//     try {
//         const { valid, errors } = validatePasswordChange(req.body);
//         if (!valid) {
//             return res.status(400).json({ success: false, errors });
//         }

//         const user = await User.findById(req.user._id).select('+password');

//         if (!(await user.matchPassword(req.body.currentPassword))) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'Current password is incorrect.',
//             });
//         }

//         user.password = req.body.newPassword;
//         await user.save();

//         const token = generateToken(user);

//         logger.info(`Password changed [${user.role}]: ${user.fullName}`);

//         res.status(200).json({
//             success: true,
//             message: 'Password updated successfully.',
//             token,
//         });
//     } catch (err) {
//         next(err);
//     }
// };


/**
 * @desc    Verify user token
 * @route   PUT /api/auth/verify
 * @access  Private
 */
export const verifyToken = (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            fullName: req.user.fullName,
            email: req.user.email,
            role: req.user.role,
            isApproved: req.user.isApproved,
            isActive: req.user.isActive,
        },
    });
};

// Admin + Super Admin controllers

/**
 * @desc    Update profile details
 * @route   PUT /api/auth/me
 * @access  Private
 */
