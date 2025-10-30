import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🧩 Apply CORS middleware BEFORE routes
app.use(
  cors({
    origin: [
      'http://localhost:3000',         // frontend dev
      'https://resume-optimzer.vercel.app', // deployed frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Must come before your routes
app.use(express.json());

// ✅ MongoDB connection
let isConnected = false;
async function connectToMongoDB() {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = conn.connections[0].readyState === 1;
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  }
}
await connectToMongoDB();

// ✅ Routes
app.use('/api/jobs', jobRoutes);
app.use('/api', resumeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
