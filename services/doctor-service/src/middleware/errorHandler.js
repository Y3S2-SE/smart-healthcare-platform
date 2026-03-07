/**
 * Middleware to catch 404s and centralized error handler to ensure 
 * consistent API error responses across microservices.
 */

import { logger } from "../utils/logger.js";

export const notFound = (req, res, next) => {
    const error = new Error(`Not Found = ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    logger.error(`${req.method} ${req.url}`, err);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const message = error.message || 'Server Error';

    res.status(statusCode).json({
        success: false, 
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
}