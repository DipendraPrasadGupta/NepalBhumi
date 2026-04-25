# Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file with required variables (see `.env.example`)

### 3. Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Routes

### Auth Routes (`/api/auth`)
- POST `/register` - Register new user
- POST `/login` - Login
- POST `/logout` - Logout

### Property Routes (`/api/properties`)
- GET `/` - Get all properties
- POST `/` - Create property (requires auth)
- GET `/:id` - Get property details
- PUT `/:id` - Update property
- DELETE `/:id` - Delete property
- POST `/:id/save` - Save property

### User Routes (`/api/users`)
- GET `/profile` - Get profile
- PUT `/profile` - Update profile
- GET `/listings` - Get user listings
- POST `/kyc` - Upload KYC docs

### Inquiry Routes (`/api/inquiries`)
- POST `/` - Create inquiry
- GET `/` - Get inquiries
- GET `/:id` - Get inquiry details
- POST `/:id/message` - Send message
- POST `/:id/close` - Close inquiry

### Admin Routes (`/api/admin`)
- GET `/stats` - Dashboard stats
- GET `/properties/pending` - Pending properties
- POST `/properties/:id/approve` - Approve property
- POST `/properties/:id/reject` - Reject property
- GET `/users` - Get users
- POST `/users/:id/ban` - Ban user
- POST `/users/:id/unban` - Unban user

## Environment Variables

```
MONGODB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret
JWT_EXPIRE=7d
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_MAPS_API_KEY=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
FRONTEND_URL=http://localhost:5173
```

## Middleware

- **Auth Middleware**: Validates JWT tokens
- **Role Authorization**: Checks user role (admin, agent, user)
- **Upload Middleware**: Handles file uploads
- **Error Handler**: Global error handling

## Database Indexes

- User: email, phone (unique)
- Property: location (geospatial), status, type, purpose
- Inquiry: propertyId, participants
- Booking: propertyId, userId, status
- Transaction: userId, status

## File Structure

- `/config` - Database and service configurations
- `/models` - Mongoose schemas
- `/controllers` - Business logic
- `/routes` - API routes
- `/middleware` - Custom middleware
- `/services` - Reusable services
- `/utils` - Helper functions
- `/jobs` - Scheduled jobs

---

For more details, see main README.md
