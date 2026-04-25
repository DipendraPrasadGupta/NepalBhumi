import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

if (process.env.NODE_ENV !== 'production') {
  console.log('📂 Environment variables loaded from:', envPath);
}

if (!process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ FATAL ERROR: MONGODB_URI is not defined in the environment!');
    console.error('   Please add MONGODB_URI to your Render Environment Variables.');
  } else {
    console.warn('⚠️  MONGODB_URI not found in environment. Falling back to local MongoDB.');
  }
}
