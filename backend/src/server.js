import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import connectDB from './config/database.js';
import { initializeCloudinary } from './config/cloudinary.js';

// Load environment variables from .env file FIRST
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
console.log('📂 Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Initialize Cloudinary AFTER dotenv is loaded
console.log('⚙️  Initializing Cloudinary...');
initializeCloudinary();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    app.listen(PORT, '127.0.0.1', () => {
      console.log(`
╔═══════════════════════════════════════════╗
║   NepalBhumi Server Running Successfully   ║
║   🚀 Server: http://localhost:${PORT}         ║
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
