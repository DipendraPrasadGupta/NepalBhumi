import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ MONGODB_URI is missing! Deployment cannot continue.');
      process.exit(1);
    }
    console.warn('⚠️  MONGODB_URI missing, using local fallback...');
  }

  try {
    const dbUri = mongoURI || 'mongodb://localhost:27017/nepal-bhumi';
    console.log('📡 Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(dbUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
