#!/usr/bin/env node

/**
 * Seed Script to create an admin user
 * Usage: node scripts/seedAdmin.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nepal-bhumi';

async function seedAdmin() {
  try {
    console.log('🌱 Seeding admin user...');
    console.log(`Connecting to MongoDB: ${MONGODB_URI}`);
    
    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@nepalbhumi.com' });
    if (adminExists) {
      console.log('✓ Admin user already exists');
      console.log('  Email: admin@nepalbhumi.com');
      console.log('  Password: [use the one you know]');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@nepalbhumi.com',
      phone: '+977-9800000000',
      passwordHash: 'AdminPassword123', // Will be hashed by the model
      role: 'admin',
      verified: true,
      kycVerified: true,
    });

    console.log('✓ Admin user created successfully!');
    console.log('\n📝 Admin Credentials:');
    console.log('  Email: admin@nepalbhumi.com');
    console.log('  Password: AdminPassword123');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('\n✓ You can now log in to the admin dashboard at: http://localhost:5173/admin');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedAdmin();
