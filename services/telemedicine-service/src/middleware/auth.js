import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
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
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Not authenticated.',
            });
        }

        // superadmin passes all role checks automatically
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

export const requireApproved = (req, res, next) => {
    if (req.user.role === 'doctor' && !req.user.isApproved) {
        return res.status(403).json({
            success: false,
            error: 'Your doctor account is pending admin approval.',
        });
    }
    next();
};