import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  LogOut, 
  Compass, 
  Globe, 
  DollarSign, 
  Sparkles, 
  Award,
  Users,
  Settings,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';
import AuthService from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = AuthService.getCurrentUser();

  // Premium Greetings based on local time
  const [greeting, setGreeting] = useState('Hello');
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good morning');
    else if (hours < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get(`/api/trips/user/${user?.id}`);
        setTrips(response.data || []);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchTrips();
    else setLoading(false);
  }, [user?.id]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  // Aggregated dynamic stats
  const totalTrips = trips.length;
  const activeTrips = trips.filter(t => t.status === 'ACTIVE' || t.status === 'UPCOMING').length;
  // Estimate average budget per trip for allocation preview
  const estimatedAllocation = trips.reduce((sum, trip) => sum + 1250, 0);

  // High-fidelity recommended cities
  const recommendations = [
    {
      city: 'Paris',
      country: 'France',
      tag: 'Romantic • Culture',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      description: 'Explore the city of light, world-class gastronomy, and legendary art collections.'
    },
    {
      city: 'Tokyo',
      country: 'Japan',
      tag: 'Neon • Gastronomy',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      description: 'Discover ultra-modern skyscrapers alongside ancient temples and culinary wonders.'
    },
    {
      city: 'Rome',
      country: 'Italy',
      tag: 'Antiquity • Cuisine',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
      description: 'Step into history at the Colosseum, and savor the finest pasta in cozy Roman alleys.'
    },
    {
      city: 'Bali',
      country: 'Indonesia',
      tag: 'Tropical • Wellness',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      description: 'Find serenity among pristine turquoise waters, green rice paddies, and temples.'
    }
  ];

  const handleRecommendPlan = (cityName, countryName) => {
    navigate('/create-trip', { state: { presetDestination: `${cityName}, ${countryName}` } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 pb-16 relative overflow-hidden">
      {/* Visual background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500 rounded-full opacity-10 blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Compass className="w-5 h-5 text-white animate-spin-slow" />
              </div>
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-300 tracking-tight">
                Traveloop
              </span>
            </div>

            {/* Middle Nav Links */}
            <div className="hidden md:flex items-center space-x-1">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="px-4 py-2 text-sm font-bold text-indigo-400 bg-white/5 rounded-xl transition-all"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/my-trips')} 
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                My Trips
              </button>
              <button 
                onClick={() => navigate('/community')} 
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                Community
              </button>
              <button 
                onClick={() => navigate('/admin')} 
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                Admin Panel
              </button>
            </div>

            {/* Profile Pillar */}
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => navigate('/profile')}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-400">Logged in as</p>
                  <p className="text-sm font-bold text-white">{user?.name || 'Explorer'}</p>
                </div>
                <img 
                  className="h-8.5 w-8.5 rounded-xl object-cover ring-2 ring-indigo-500/30 hover:ring-indigo-500/60 transition-all" 
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.email || 'default'}`} 
                  alt="Profile" 
                />
              </div>

              <button 
                onClick={handleLogout} 
                title="Log out" 
                className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-10 space-y-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-gradient-to-l from-indigo-500/5 to-transparent rounded-r-3xl" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase">{greeting}</span>
            </div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-200">
              Welcome back, {user?.name || 'Explorer'}! ✨
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Ready to embark on another adventure? Manage your itineraries, track budgets, and share your explorations with the world.
            </p>
          </div>

          <button
            onClick={() => navigate('/create-trip')}
            className="relative z-10 flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Plan New Trip
          </button>
        </div>

        {/* Financial Highlights / Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center gap-5 hover:border-white/15 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Adventures</p>
              <h3 className="text-2xl font-black text-white mt-1">{totalTrips} Trips</h3>
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center gap-5 hover:border-white/15 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Expeditions</p>
              <h3 className="text-2xl font-black text-white mt-1">{activeTrips} Active</h3>
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center gap-5 hover:border-white/15 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estimated Allocation</p>
              <h3 className="text-2xl font-black text-white mt-1">
                ${estimatedAllocation.toLocaleString()} USD
              </h3>
            </div>
          </div>
        </div>

        {/* Grid: Your Trips and Inspiration */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping" />
              <h3 className="text-2xl font-black text-white">Your Adventures</h3>
            </div>
            {trips.length > 0 && (
              <span className="text-xs font-semibold px-3 py-1 bg-white/5 rounded-full text-slate-400 border border-white/5">
                {trips.length} Saved Plans
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Loading your itineraries...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="p-12 text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col items-center justify-center max-w-xl mx-auto space-y-4 shadow-xl">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto">
                <Compass className="w-8 h-8 animate-pulse" />
              </div>
              <h4 className="text-lg font-bold text-white">No adventures planned yet</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Ready to explore? Create your first dynamic travel planner, checklist, and budget monitor in seconds!
              </p>
              <button
                onClick={() => navigate('/create-trip')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Plan Your First Adventure
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map(trip => (
                <div 
                  key={trip.id} 
                  className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-indigo-500/30 hover:shadow-indigo-500/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer" 
                  onClick={() => navigate(`/itinerary/${trip.id}`)}
                >
                  <div className="h-44 bg-gradient-to-br from-indigo-600/30 to-purple-700/30 relative overflow-hidden">
                    {/* Visual pattern overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 transition-opacity group-hover:bg-slate-950/20" />
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 text-indigo-300 text-[10px] font-bold tracking-widest uppercase rounded-full">
                        {trip.status}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-1">
                        {trip.name}
                      </h4>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-400 line-clamp-2 min-h-[2rem]">
                      {trip.description || 'Embarking on a custom adventure to map out beautiful memories.'}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex items-center text-xs text-slate-300">
                        <Calendar className="w-3.5 h-3.5 mr-2 text-indigo-400" />
                        {trip.startDate} to {trip.endDate}
                      </div>
                      <div className="flex items-center text-xs text-slate-300">
                        <MapPin className="w-3.5 h-3.5 mr-2 text-indigo-400" />
                        Multi-Stop Exploration Route
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <span className="text-indigo-400 text-xs font-bold flex items-center group-hover:text-indigo-300">
                        View Plan <ChevronRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inspirational Recommendations Carousel */}
        <div className="space-y-6 pt-6 border-t border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <h3 className="text-2xl font-black text-white">Curated Wanderlust Inspiration</h3>
            </div>
            <p className="text-sm text-slate-400">
              Sourced by Traveloop curators based on global trending explorations. Click to instantly pre-plan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((rec, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 hover:shadow-purple-500/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                onClick={() => handleRecommendPlan(rec.city, rec.country)}
              >
                <div className="h-40 relative overflow-hidden">
                  <img 
                    src={rec.image} 
                    alt={rec.city} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-purple-300 bg-purple-500/20 backdrop-blur-md px-2 py-0.5 rounded-md border border-purple-400/30">
                      {rec.tag}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h4 className="text-lg font-bold text-white leading-tight">
                      {rec.city}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {rec.country}
                    </p>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-3">
                    {rec.description}
                  </p>
                  <div className="pt-2">
                    <button 
                      type="button"
                      className="w-full py-2.5 text-center text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 group-hover:border-purple-500/30 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      Plan This Trip <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
