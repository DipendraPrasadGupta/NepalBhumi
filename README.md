# NepalBhumi - Property Management Platform

A full-stack real estate platform for Nepal enabling users to list, browse, and manage property rentals and sales with advanced features including verified listings, interactive maps, and secure user authentication.

## 🌟 Key Features

- **Property Listings** - Browse and manage rental and sale listings
- **Advanced Search** - Filter by location, price, type, and amenities
- **User Authentication** - Secure login and profile management
- **Admin Dashboard** - Manage properties, users, and inquiries
- **Interactive Maps** - View property locations with location-specific coordinates
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Real-time Location Mapping** - Properties display at correct geographical coordinates

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Email**: NodeMailer

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Maps**: OpenStreetMap (no API key required)
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 📁 Project Structure

```
NepalBhumi/
├── backend/
│   ├── src/
│   │   ├── config/        # Database, Cloudinary, Constants
│   │   ├── models/        # User, Property, Inquiry, Message
│   │   ├── controllers/   # Auth, Property, User, Message, Admin
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth, Error handler, Upload
│   │   ├── services/      # Email, Cloudinary, Token
│   │   ├── utils/         # Validation, Helpers
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Server entry point
│   ├── .env.example       # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/           # API endpoints, Axios instance
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages (Home, Map, Admin, etc)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store.js       # Zustand state management
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # React DOM render
│   ├── public/            # Static assets
│   ├── .env.example       # Environment variables template
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS config
│   └── package.json
│
└── README.md
```

## ⚡ Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for image storage)

### Backend Setup

1. **Navigate to backend**
```bash
cd backend
```

2. **Install dependencies**
```bash
2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
See `.env.example` for all required variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `CLOUDINARY_*` - Cloudinary credentials
- `SMTP_*` - Email service credentials

5. **Start backend server**
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure API URL**
```
VITE_API_URL=http://localhost:5000/api
```

5. **Start development server**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Properties
- `GET /api/properties` - Get all properties with filters
- `POST /api/properties` - Create new property (authenticated)
- `GET /api/properties/:id` - Get property details
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send message
- `GET /api/messages/:propertyId` - Get property messages

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/properties` - Manage properties
- `GET /api/admin/users` - Manage users

## 📊 Database

MongoDB with the following models:
- **User** - User accounts and profiles
- **Property** - Property listings
- **Message** - User communications
- **Inquiry** - Property inquiries
- **Booking** - Booking information

## 🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation
- Environment variable protection
- Secure file uploads via Cloudinary

## 🌐 Deployment

### Backend (Node.js)
Recommended platforms:
- Railway
- Render
- Heroku

### Frontend (React + Vite)
Recommended platforms:
- Vercel
- Netlify
- AWS Amplify

### Database
- MongoDB Atlas (cloud database)

### Storage
- Cloudinary (image storage)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Support

For issues and questions, please open an issue on the repository or contact the development team.

---

Built with ❤️ for Nepal's Real Estate Community
