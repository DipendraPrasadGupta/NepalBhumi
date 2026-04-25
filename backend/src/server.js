import './config/env.js';
import app from './app.js';
import connectDB from './config/database.js';
import { initializeCloudinary } from './config/cloudinary.js';

// Initialize Cloudinary
console.log('⚙️  Initializing Cloudinary...');
initializeCloudinary();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server (FIXED HERE)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
╔═══════════════════════════════════════════╗
║   NepalBhumi Server Running Successfully   ║
║   🚀 Server: http://0.0.0.0:${PORT}         ║
║   📊 Environment: ${process.env.NODE_ENV}    ║
╚═══════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();