import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/database.js';
import swaggerSpec from './docs/swaggerConfig.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobMatchRoutes from './routes/jobMatchRoutes.js';

const app = express();

// Initialize Database
connectDB();

// ============ SECURITY MIDDLEWARE ============

// Helmet for security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    // origin: process.env.CLIENT_URL || 'http://localhost:3000',
        origin: 'https://ai-powered-resume-analyzer-six.vercel.app',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// ============ BODY PARSING ============
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============ SWAGGER DOCUMENTATION ============
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============ HEALTH CHECK ============
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ============ API ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', jobMatchRoutes);

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// ============ ERROR HANDLER ============
app.use(errorHandler);

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
});

// Configure socket timeout for long-running requests (AI analysis can take 15-30+ seconds)
// Disable default 2-minute timeout on HTTP requests
server.timeout = 240000; // 4 minutes - enough for AI analysis + buffer
server.keepAliveTimeout = 65000; // Keep-alive timeout slightly higher than server timeout

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

export default app;
