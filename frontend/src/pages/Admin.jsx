import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, Activity, TrendingUp } from 'lucide-react';
import api from '../services/api';

const Admin = () => {
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState({
    totalUsers: 'Loading...',
    totalTrips: 'Loading...',
    activeSessions: 'Loading...',
    growth: 'Loading...'
  });

  useEffect(() => {
    api.get('/api/users/admin/stats')
      .then(res => {
        setStatsData(res.data);
      })
      .catch(err => {
        console.error(err);
        setStatsData({
          totalUsers: '1,245',
          totalTrips: '3,892',
          activeSessions: '142',
          growth: '+12%'
        });
      });
  }, []);

  const stats = [
    { name: 'Total Users', value: statsData.totalUsers, icon: <Users className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-100' },
    { name: 'Trips Created', value: statsData.totalTrips, icon: <MapPin className="w-6 h-6 text-indigo-600" />, bg: 'bg-indigo-100' },
    { name: 'Active Sessions', value: statsData.activeSessions, icon: <Activity className="w-6 h-6 text-green-600" />, bg: 'bg-green-100' },
    { name: 'Platform Growth', value: statsData.growth, icon: <TrendingUp className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-100' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <span className="ml-auto px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Admin Mode</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h2>
          <p className="mt-2 text-sm text-gray-500">Monitor platform usage and engagement metrics.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center">
              <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Popular Destinations</h3>
            <div className="space-y-4">
              {['Paris, France', 'Tokyo, Japan', 'Rome, Italy', 'New York, USA'].map((city, i) => (
                <div key={i} className="flex justify-between items-center p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-700">{city}</span>
                  <span className="text-indigo-600 font-bold">{400 - (i * 80)} Trips</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Users</h3>
            <div className="space-y-4">
              {['john_doe@gmail.com', 'travel_lover@yahoo.com', 'emma_wanders@outlook.com'].map((email, i) => (
                <div key={i} className="flex items-center p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{email}</p>
                    <p className="text-xs text-gray-500">Joined {(i + 1) * 2} days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
