import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import Budget from './pages/Budget';
import Checklist from './pages/Checklist';
import Notes from './pages/Notes';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Admin from './pages/Admin';
import Invoice from './pages/Invoice';
import MyTrips from './pages/MyTrips';
import PublicItinerary from './pages/PublicItinerary';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/public-itinerary/:tripId" element={<PublicItinerary />} />

          {/* Protected routes — require JWT */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
          <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
          <Route path="/itinerary/:tripId" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
          <Route path="/itinerary/:tripId/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          <Route path="/itinerary/:tripId/checklist" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
          <Route path="/itinerary/:tripId/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/itinerary/:tripId/invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
