import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

console.log('📂 Environment variables loaded from:', envPath);
if (!process.env.MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI not found in environment. Using fallback.');
}
