import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-12 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link to="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
