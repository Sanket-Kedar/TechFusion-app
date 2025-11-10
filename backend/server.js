import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load env vars
dotenv.config();

// Validate critical environment variables
console.log('\n🔧 Environment Variables Check:');
console.log('   MongoDB URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Missing');
console.log('   JWT Secret:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Missing');
console.log('   Payment System: 💳 Simulated (for development)\n');

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TechFusion Backend API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      auth: '/api/auth',
      orders: '/api/orders'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'TechFusion API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
