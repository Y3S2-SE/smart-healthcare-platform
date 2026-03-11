import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.',
            });
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token has expired. Please login again.',
                });
            }
            return res.status(401).json({
                success: false,
                error: 'Invalid token.',
            });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User account no longer exists.',
            });
        }
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                error: 'Your account has been deactivated. Contact support.',
            });
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Not authenticated.',
            });
        }

        // superadmin can always pass any role check
        if (req.user.role === 'superadmin') return next();

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Access denied. Required: ${roles.join(' or ')}. Your role: ${req.user.role}`,
            });
        }
        next();
    };
};

// For routes that only superadmin can access
export const requireSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'superadmin') {
        return res.status(403).json({
            success: false,
            error: 'Access denied. Super admin only.',
        });
    }
    next();
};

// To approve doctors
export const requireApproved = (req, res, next) => {
    if (req.user.role === 'doctor' && !req.user.isApproved) {
        return res.status(403).json({
            success: false,
            error: 'Your doctor account is pending admin approval.',
        });
    }
    next();
};