// Cloudflare Worker entry point for Express app
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.routes.js';
import workerRoutes from './routes/worker.routes.js';
import employerRoutes from './routes/employer.routes.js';
import jobRoutes from './routes/job.routes.js';
import chatRoutes from './routes/chat.routes.js';
import reviewRoutes from './routes/review.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import certificateRoutes from './routes/certificate.routes.js';
import aiRoutes from './routes/ai.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Import middleware
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// MongoDB connection for Workers
let mongooseConnection = null;

async function connectDB() {
  if (mongooseConnection && mongoose.connection.readyState === 1) {
    return mongooseConnection;
  }
  
  try {
    mongooseConnection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected');
    return mongooseConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Error handler
app.use(errorHandler);

// Cloudflare Workers fetch handler
export default {
  async fetch(request, env, ctx) {
    // Polyfill process.env for Cloudflare Workers
    if (typeof process === 'undefined') {
      globalThis.process = { env: {} };
    }
    if (!process.env) {
      process.env = {};
    }
    
    // Set environment variables from env
    Object.assign(process.env, {
      MONGODB_URI: env.MONGODB_URI,
      JWT_SECRET: env.JWT_SECRET,
      GROQ_API_KEY: env.GROQ_API_KEY,
      FRONTEND_URL: env.FRONTEND_URL,
      NODE_ENV: env.NODE_ENV || 'production'
    });

    // Connect to MongoDB
    try {
      await connectDB();
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Database connection failed' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert Cloudflare Request to Node.js request format
    const url = new URL(request.url);
    const nodeRequest = {
      method: request.method,
      url: url.pathname + url.search,
      headers: Object.fromEntries(request.headers),
      body: request.body
    };

    // Create response handler
    return new Promise((resolve) => {
      const nodeResponse = {
        statusCode: 200,
        headers: {},
        body: '',
        setHeader(key, value) {
          this.headers[key.toLowerCase()] = value;
        },
        writeHead(statusCode, headers) {
          this.statusCode = statusCode;
          if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
              this.setHeader(key, value);
            });
          }
        },
        end(data) {
          if (data) this.body = data;
          resolve(new Response(this.body, {
            status: this.statusCode,
            headers: this.headers
          }));
        },
        write(chunk) {
          this.body += chunk;
        }
      };

      // Handle the request with Express
      app(nodeRequest, nodeResponse);
    });
  }
};
