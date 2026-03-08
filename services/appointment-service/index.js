import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';
import { connectDB } from './src/config/db.js';
import { logger } from './src/utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') 
        : ['http://localhost:5173', 'http://localhost:80'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: process.env.SERVICE_NAME || 'appointment',
        timestamp: new Date().toISOString()
    });
});

// Routes

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();
        const server = app.listen(PORT, () => {
            logger.success(`Service running on port ${PORT}`);
        });

        process.on('SIGTERM', () => {
            logger.warn('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                logger.info('Server closed.');
                process.exit(0);
            });
        });
    } catch (error) {
        logger.error('Failed to start service:', error);
        process.exit(1);
    }
};

startServer();