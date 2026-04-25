import { v2 as cloudinary } from 'cloudinary';

// Function to configure Cloudinary with environment variables
export const initializeCloudinary = () => {
  const cloud_name = process.env.CLOUDINARY_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  console.log('🔧 Cloudinary Configuration:');
  console.log('  Cloud Name:', cloud_name ? '✓ SET (' + cloud_name + ')' : '✗ MISSING');
  console.log('  API Key:', api_key ? '✓ SET' : '✗ MISSING');
  console.log('  API Secret:', api_secret ? '✓ SET' : '✗ MISSING');

  if (!cloud_name || !api_key || !api_secret) {
    console.error('❌ ERROR: Cloudinary credentials are not fully configured!');
    console.error('   Make sure CLOUDINARY_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in .env');
  }

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });

  console.log('✅ Cloudinary configured successfully');
};

export default cloudinary;
