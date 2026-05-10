import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Settings, LogOut, Map } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...',
    email: 'loading...',
    location: 'Loading...',
    bio: 'Loading...'
  });

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user')) || { id: 1 };
    api.get(`/api/users/${localUser.id}`)
      .then(res => {
        const u = res.data;
        setUser({
          name: u.name || 'Alex Traveler',
          email: u.email || 'alex@example.com',
          location: u.location || 'New York, USA',
          bio: 'Avid explorer and food lover.'
        });
      })
      .catch(err => {
        console.error(err);
        setUser({
          name: localUser.name || 'Alex Traveler',
          email: localUser.email || 'alex@example.com',
          location: localUser.location || 'New York, USA',
          bio: 'Avid explorer and food lover.'
        });
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700 transition-colors text-sm font-medium">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <div className="absolute -bottom-12 left-8 border-4 border-white rounded-full bg-white shadow-md">
              <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold">
                <User size={40} />
              </div>
            </div>
          </div>
          
          <div className="pt-16 px-8 pb-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 flex items-center mt-1">
                  <Map className="w-4 h-4 mr-1" /> {user.location}
                </p>
              </div>
              <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
                <Settings className="w-4 h-4 mr-2" /> Edit Profile
              </button>
            </div>

            <div className="space-y-6 border-t border-gray-100 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input type="email" disabled value={user.email} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input type="text" value={user.location} onChange={(e) => setUser({...user, location: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <textarea rows="3" value={user.bio} onChange={(e) => setUser({...user, bio: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
