# Frontend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file with API URL:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

App runs on `http://localhost:5173`

## Project Structure

- `/src/api` - API endpoints and axios instance
- `/src/components` - Reusable UI components
- `/src/pages` - Full page components
- `/src/contexts` - Context API (if used)
- `/src/hooks` - Custom React hooks
- `/src/services` - External services (WebSocket, etc)
- `/src/utils` - Helper functions and constants
- `/src/store.js` - Zustand state management

## Key Features

### State Management (Zustand)
- `useAuthStore` - Authentication state
- `usePropertyStore` - Property listings state
- `useUIStore` - UI state

### Custom Hooks
- `useAuth()` - Auth context wrapper
- `useIsAuthenticated()` - Check auth status
- `useIsAdmin()` - Check admin role
- `useIsAgent()` - Check agent role

### API Endpoints
- `authAPI` - Login, register, logout
- `propertyAPI` - Property CRUD, search
- `userAPI` - User profile, listings
- `inquiryAPI` - Messages and inquiries
- `adminAPI` - Admin functions

## Pages

- `/` - Home page with featured properties
- `/search` - Advanced search and filters
- `/properties/:id` - Property details
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/dashboard` - User dashboard
- `/admin` - Admin dashboard

## Components

- `Layout` - Main layout wrapper
- `Navbar` - Navigation bar
- `Footer` - Footer
- (More components to be added)

## Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Custom CSS** - `/src/index.css` with custom utilities
- **Responsive** - Mobile-first design

## Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Environment Variables

```
VITE_API_URL=http://localhost:5000/api
```

## Dependencies

- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Vite** - Build tool

---

For more details, see main README.md
