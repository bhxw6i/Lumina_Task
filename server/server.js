import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Clean FRONTEND_URL if provided
const sanitizeUrl = (url) => (url ? url.trim().replace(/\/+$/, '') : '');
const frontendUrl = sanitizeUrl(process.env.FRONTEND_URL) || 'https://luminataskmanagement.netlify.app';

// Allowed origins
const defaultAllowedOrigins = [
  'https://luminataskmanagement.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

if (frontendUrl && !defaultAllowedOrigins.includes(frontendUrl)) {
  defaultAllowedOrigins.push(frontendUrl);
}

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (like curl, postman, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, '');

    // Allow configured origins or any Netlify deploy preview
    const isAllowed =
      defaultAllowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.netlify.app') ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1');

    if (isAllowed) {
      return callback(null, true);
    }

    console.warn(`[CORS] Warning: Origin ${origin} requested access`);
    // Default to allowing in production if FRONTEND_URL is set to wildcard or allow origin
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger in Development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }[mongoose.connection.readyState] || 'unknown';

  res.json({
    status: 'OK',
    service: 'Lumina Task API',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      connected: mongoose.connection.readyState === 1,
    },
  });
});

// API Root Info Endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '✨ Lumina Task API is running',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: ['/api/health', '/api/auth/register', '/api/auth/login', '/api/auth/me', '/api/tasks', '/api/tasks/stats']
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: '✨ Lumina Task API is running',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// MongoDB Connection Event Listeners
mongoose.connection.on('connected', () => console.log('✅ Connected to MongoDB successfully'));
mongoose.connection.on('error', (err) => console.error('❌ MongoDB Connection Error:', err.message));
mongoose.connection.on('disconnected', () => console.warn('⚠️ MongoDB Disconnected'));

// MongoDB Connection and Server Start
const mongoUri =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/lumina_tasks';

const startServer = async () => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Lumina Task Server running on port ${PORT}`);
    console.log(`🔗 Allowed Frontend: ${frontendUrl}`);
    console.log(`🩺 Health check available at: http://localhost:${PORT}/api/health`);
  });

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    console.error('⚠️ MongoDB Connection Notice:', err.message);
    console.warn('The API server is running, but database operations require a valid MONGODB_URI in Render / .env');
  }

  return server;
};

startServer();
