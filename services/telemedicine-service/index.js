import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { logger } from './src/utils/logger.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:80'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: process.env.SERVICE_NAME || 'service',
    timestamp: new Date().toISOString()
  });
});

// Routes 

app.use(notFound);
app.use(errorHandler);

const startServer = () => {
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
};

startServer();