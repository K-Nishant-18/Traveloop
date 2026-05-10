import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  Activity, 
  TrendingUp, 
  Compass, 
  ShieldAlert, 
  Sliders, 
  Calendar, 
  Search,
  CheckCircle2,
  XCircle,
  BarChart4
} from 'lucide-react';
import api from '../services/api';

const Admin = () => {
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState({
    totalUsers: '1,420',
    totalTrips: '4,812',
    activeSessions: '198',
    growth: '+14.2%'
  });

  const [usersList, setUsersList] = useState([
    { id: 1001, name: 'john_doe', email: 'john.doe@gmail.com', joined: '2 days ago', status: 'ACTIVE', role: 'USER' },
    { id: 1002, name: 'wanderer_99', email: 'wanderer@yahoo.com', joined: '3 days ago', status: 'ACTIVE', role: 'USER' },
    { id: 1003, name: 'emma_ski', email: 'emma.wanders@outlook.com', joined: '5 days ago', status: 'ACTIVE', role: 'USER' },
    { id: 1004, name: 'travel_pioneer', email: 'pioneer@traveloop.io', joined: '1 week ago', status: 'ACTIVE', role: 'ADMIN' },
    { id: 1005, name: 'spammer_block', email: 'spammy@spambot.ru', joined: '2 weeks ago', status: 'SUSPENDED', role: 'USER' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/users/admin/stats')
      .then(res => {
        setStatsData({
          totalUsers: res.data.totalUsers || '1,420',
          totalTrips: res.data.totalTrips || '4,812',
          activeSessions: res.data.activeSessions || '198',
          growth: res.data.growth || '+14.2%'
        });
      })
      .catch(err => {
        console.error('Error fetching admin statistics, falling back:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Toggle active/blocked state
  const handleToggleStatus = (id) => {
    setUsersList(usersList.map(u => {
      if (u.id === id) {
        return {
          ...u,
          status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
        };
      }
      return u;
    }));
  };

  // Toggle user role privilege
  const handleToggleRole = (id) => {
    setUsersList(usersList.map(u => {
      if (u.id === id) {
        return {
          ...u,
          role: u.role === 'USER' ? 'ADMIN' : 'USER'
        };
      }
      return u;
    }));
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // SVG Chart Mock parameters (Weekly Trip Creations)
  const weeklyCreations = [
    { label: 'Wk 1', count: 320, height: 45 },
    { label: 'Wk 2', count: 480, height: 68 },
    { label: 'Wk 3', count: 410, height: 58 },
    { label: 'Wk 4', count: 620, height: 88 },
    { label: 'Wk 5', count: 710, height: 100 }
  ];

  const stats = [
    { name: 'Total Curators', value: statsData.totalUsers, icon: <Users className="w-5 h-5 text-indigo-400" />, bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { name: 'Trips Plotted', value: statsData.totalTrips, icon: <Compass className="w-5 h-5 text-sky-400" />, bg: 'bg-sky-500/10 border-sky-500/20' },
    { name: 'Active Creators', value: statsData.activeSessions, icon: <Activity className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Adoption Rate', value: statsData.growth, icon: <TrendingUp className="w-5 h-5 text-purple-400" />, bg: 'bg-purple-500/10 border-purple-500/20' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 pb-16 relative overflow-hidden">
      {/* Radial backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500 rounded-full opacity-10 blur-[120px]" />
      </div>

      {/* Nav header */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center text-slate-400 hover:text-white transition-colors gap-2 font-semibold text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-black rounded-full uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              Admin Portal
            </span>
          </div>
        </div>
      </nav>

      {/* Main Admin dashboard container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        
        {/* Title Block Header */}
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-2 relative overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sliders className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest uppercase">Global Analytics Control Room</span>
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
            Platform adoption audit
          </h1>
          <p className="text-xs text-slate-400 font-semibold">Track database registrations, metrics, and manage customer accounts.</p>
        </div>

        {/* Dynamic statistics metrics list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className={`bg-white/5 border ${stat.bg} rounded-3xl p-6 flex items-center justify-between shadow-xl`}>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{stat.name}</span>
                <span className="text-2xl font-black text-white">{stat.value}</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Popular destination meters row layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Charts column */}
          <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart4 className="w-4 h-4 text-indigo-400" />
                Itinerary Spikes (Weekly Logs)
              </h3>
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Past month</span>
            </div>

            {/* Glowing SVG Bar graph */}
            <div className="h-48 flex items-end justify-between px-4 pt-4 border-b border-white/5">
              {weeklyCreations.map((wk, i) => (
                <div key={i} className="flex flex-col items-center gap-3 w-12 group">
                  <span className="text-[10px] font-black text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">{wk.count}</span>
                  <div 
                    className="w-7 rounded-t-lg bg-gradient-to-t from-indigo-500/40 to-purple-500 group-hover:to-indigo-400 shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-500 relative overflow-hidden"
                    style={{ height: `${wk.height}%` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-white/20" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-2 border-t border-white/5 w-full text-center">{wk.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Destinations listing column */}
          <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              Sought-after city stop destinations
            </h3>

            <div className="space-y-4">
              {[
                { city: 'Tokyo, Japan', count: 320, percentage: '100%' },
                { city: 'Paris, France', count: 240, percentage: '75%' },
                { city: 'Rome, Italy', count: 180, percentage: '56%' },
                { city: 'Zurich, Switzerland', count: 120, percentage: '37%' }
              ].map((dest, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-300">{dest.city}</span>
                    <span className="text-indigo-400">{dest.count} logs</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-700"
                      style={{ width: dest.percentage }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* User Accounts list control board table */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Customer Accounts Board
            </h3>

            {/* Search query box */}
            <div className="relative w-full sm:w-64 shrink-0">
              <input 
                type="text" 
                placeholder="Search user email or tag..."
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl outline-none text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-indigo-500"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Role Privileges</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-semibold text-slate-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 italic">No search results matched user email filters.</td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 flex items-center gap-3">
                        <img 
                          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.name}`} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-lg object-cover border border-white/10"
                        />
                        <div>
                          <span className="font-bold text-white block">{user.name}</span>
                          <span className="text-[10px] text-slate-400">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                          user.role === 'ADMIN' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                          user.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {user.status === 'ACTIVE' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-1.5">
                        <button 
                          onClick={() => handleToggleRole(user.id)}
                          className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-[10px] text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                        >
                          Modify Role
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(user.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                            user.status === 'ACTIVE' 
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20' 
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? 'Suspend' : 'Reinstate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Admin;
