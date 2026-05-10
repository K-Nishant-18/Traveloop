import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, MessageCircle, MapPin } from 'lucide-react';
import api from '../services/api';

const Community = () => {
  const navigate = useNavigate();

  const [sharedTrips, setSharedTrips] = useState([]);

  useEffect(() => {
    api.get('/api/trips/public')
      .then(res => {
        // Map the backend trips to the community card format
        const publicTrips = res.data.map(trip => ({
          id: trip.id,
          author: trip.user?.name || 'Alex Traveler', // Display dynamic author name from nested user mapping
          title: trip.name,
          days: trip.stops ? trip.stops.length * 3 : 5, // Mocking days based on stops for UI
          likes: Math.floor(Math.random() * 200), // Randomize likes for hackathon visual
          comments: Math.floor(Math.random() * 20)
        }));
        setSharedTrips(publicTrips.length > 0 ? publicTrips : [
          { id: 101, author: 'Emma Wanderlust', title: 'Backpacking Southeast Asia', days: 30, likes: 124, comments: 12 },
          { id: 102, author: 'Foodie Travels', title: 'Culinary Tour of Italy', days: 14, likes: 89, comments: 5 },
          { id: 103, author: 'Alex Explorer', title: 'Weekend in NYC', days: 3, likes: 45, comments: 2 },
        ]);
      })
      .catch(err => {
        console.error(err);
        setSharedTrips([
          { id: 1, author: 'Emma Wanderlust', title: 'Backpacking Southeast Asia', days: 30, likes: 124, comments: 12 },
          { id: 2, author: 'Foodie Travels', title: 'Culinary Tour of Italy', days: 14, likes: 89, comments: 5 },
          { id: 3, author: 'Alex Explorer', title: 'Weekend in NYC', days: 3, likes: 45, comments: 2 },
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Traveloop Community</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Get inspired by other travelers. Browse public itineraries, share your own adventures, and discover your next destination.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sharedTrips.map(trip => (
            <div key={trip.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 relative">
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-700">
                  {trip.days} Days
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{trip.title}</h3>
                <p className="text-sm text-gray-500 mb-4">by {trip.author}</p>
                
                <div className="flex items-center space-x-4 border-t border-gray-100 pt-4 mt-4">
                  <button className="flex items-center text-gray-500 hover:text-pink-500 transition-colors text-sm font-medium">
                    <Heart className="w-4 h-4 mr-1" /> {trip.likes}
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors text-sm font-medium">
                    <MessageCircle className="w-4 h-4 mr-1" /> {trip.comments}
                  </button>
                  <div className="flex-1"></div>
                  <button className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors text-sm font-medium">
                    <Share2 className="w-4 h-4 mr-1" /> View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Community;
