import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import RoomsAndFlats from './pages/RoomsAndFlats';
import PropertyDetails from './pages/PropertyDetails';
import PropertyMap from './pages/PropertyMap';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProperties from './pages/Admin/Properties/AdminProperties';
import Agents from './pages/Agents';
import AgentProfile from './pages/Agent/AgentProfile';
import AgentPropertyDashboard from './pages/Agent/AgentPropertyDashboard';
import AgentDashboard from './pages/Agent/AgentDashboard';
import NotFound from './pages/NotFound';
import ElectricityCalculator from './pages/tools/ElectricityCalculator';
import LandAreaConversion from './pages/tools/LandAreaConversion';
import EMICalculator from './pages/tools/EMICalculator';
import HelpCenter from './pages/HelpCenter';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import About from './pages/About';
import './index.css';

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ['/map', '/agent/profile', '/agent/properties', '/agent/dashboard'];
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAgentRoute = location.pathname.startsWith('/agent');
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname) || isAdminRoute || isAgentRoute;
  const shouldHideNavbar = isAdminRoute || isAgentRoute;

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<PropertyMap />} />
          <Route path="/explore" element={<RoomsAndFlats />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/tools/electricity" element={<ElectricityCalculator />} />
          <Route path="/tools/land-conversion" element={<LandAreaConversion />} />
          <Route path="/tools/emi-calculator" element={<EMICalculator />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/properties"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminProperties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/profile"
            element={
              <ProtectedRoute requiredRole="agent">
                <AgentProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/agent/:id" element={<AgentProfile />} />
          <Route
            path="/agent/properties"
            element={
              <ProtectedRoute requiredRole="agent">
                <AgentPropertyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/dashboard"
            element={
              <ProtectedRoute requiredRole="agent">
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

