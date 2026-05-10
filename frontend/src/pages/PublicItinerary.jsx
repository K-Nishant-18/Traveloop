import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Clock, 
  Copy, 
  Share2, 
  MessageSquare, 
  CheckCircle2, 
  ChevronRight, 
  Loader,
  Heart
} from 'lucide-react';
import api from '../services/api';
import AuthService from '../services/authService';

// Curated Mock Itineraries Data for seamless frontend-only community detail views
const mockItinerariesData = {
  'mock-101': {
    name: 'Backpacking Southeast Asia',
    description: 'A grand journey through Thailand, Cambodia, and Vietnam. Exploring ancient temples, tropical islands, and delicious street food.',
    startDate: '2026-06-01',
    endDate: '2026-07-01',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    stops: [
      {
        cityName: 'Bangkok, Thailand',
        startDate: '2026-06-01',
        endDate: '2026-06-10',
        budgetAllocated: 800,
        orderIndex: 0,
        activities: [
          { title: 'Grand Palace Tour', type: 'SIGHTSEEING', cost: 15, startTime: '09:00:00' },
          { title: 'Pad Thai Masterclass', type: 'FOOD', cost: 25, startTime: '13:00:00' },
          { title: 'Chao Phraya River Cruise', type: 'SIGHTSEEING', cost: 30, startTime: '18:30:00' }
        ]
      },
      {
        cityName: 'Siem Reap, Cambodia',
        startDate: '2026-06-11',
        endDate: '2026-06-18',
        budgetAllocated: 600,
        orderIndex: 1,
        activities: [
          { title: 'Angkor Wat Sunrise', type: 'SIGHTSEEING', cost: 37, startTime: '05:00:00' },
          { title: 'Phare Circus Performance', type: 'ENTERTAINMENT', cost: 18, startTime: '20:00:00' }
        ]
      },
      {
        cityName: 'Hanoi, Vietnam',
        startDate: '2026-06-19',
        endDate: '2026-06-25',
        budgetAllocated: 500,
        orderIndex: 2,
        activities: [
          { title: 'Old Quarter Food Tour', type: 'FOOD', cost: 20, startTime: '17:00:00' },
          { title: 'Water Puppet Theater', type: 'ENTERTAINMENT', cost: 10, startTime: '15:30:00' }
        ]
      }
    ]
  },
  'mock-102': {
    name: 'Culinary Tour of Italy',
    description: 'Indulging in regional specialties from Rome, Florence, and Venice. Wine tasting in Tuscany and pizza masterclass in Naples.',
    startDate: '2026-09-10',
    endDate: '2026-09-24',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    stops: [
      {
        cityName: 'Rome, Italy',
        startDate: '2026-09-10',
        endDate: '2026-09-15',
        budgetAllocated: 1200,
        orderIndex: 0,
        activities: [
          { title: 'Colosseum & Forum Guided Tour', type: 'SIGHTSEEING', cost: 45, startTime: '10:00:00' },
          { title: 'Trastevere Evening Food Tour', type: 'FOOD', cost: 85, startTime: '18:00:00' }
        ]
      },
      {
        cityName: 'Florence, Italy',
        startDate: '2026-09-16',
        endDate: '2026-09-20',
        budgetAllocated: 1000,
        orderIndex: 1,
        activities: [
          { title: 'Uffizi Gallery Tour', type: 'SIGHTSEEING', cost: 35, startTime: '09:30:00' },
          { title: 'Tuscan Wine & Olive Oil Tasting', type: 'FOOD', cost: 90, startTime: '14:00:00' }
        ]
      },
      {
        cityName: 'Venice, Italy',
        startDate: '2026-09-21',
        endDate: '2026-09-24',
        budgetAllocated: 900,
        orderIndex: 2,
        activities: [
          { title: 'Gondola Ride at Sunset', type: 'ENTERTAINMENT', cost: 80, startTime: '18:00:00' },
          { title: 'St. Marks Basilica Visit', type: 'SIGHTSEEING', cost: 15, startTime: '11:00:00' }
        ]
      }
    ]
  },
  'mock-103': {
    name: 'Weekend Gateway in NYC',
    description: 'A fast-paced exploration of Manhattan. Broadway shows, Central Park walks, and high-line adventures.',
    startDate: '2026-05-15',
    endDate: '2026-05-18',
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    stops: [
      {
        cityName: 'Manhattan, New York',
        startDate: '2026-05-15',
        endDate: '2026-05-18',
        budgetAllocated: 1500,
        orderIndex: 0,
        activities: [
          { title: 'Broadway Show: Wicked', type: 'ENTERTAINMENT', cost: 120, startTime: '19:00:00' },
          { title: 'Summit One Vanderbilt Entry', type: 'SIGHTSEEING', cost: 45, startTime: '14:30:00' },
          { title: 'High Line Park & Chelsea Market', type: 'SIGHTSEEING', cost: 15, startTime: '11:00:00' }
        ]
      }
    ]
  },
  'mock-104': {
    name: 'Swiss Alpine Hiking Expedition',
    description: 'Conquering the most picturesque hiking trails in Interlaken, Zermatt, and Grindelwald with spectacular Matterhorn views.',
    startDate: '2026-07-10',
    endDate: '2026-07-20',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    stops: [
      {
        cityName: 'Interlaken, Switzerland',
        startDate: '2026-07-10',
        endDate: '2026-07-14',
        budgetAllocated: 1300,
        orderIndex: 0,
        activities: [
          { title: 'Paragliding over Lake Thun', type: 'ENTERTAINMENT', cost: 160, startTime: '10:00:00' },
          { title: 'Harder Kulm Sunset Funicular', type: 'SIGHTSEEING', cost: 35, startTime: '18:00:00' }
        ]
      },
      {
        cityName: 'Zermatt, Switzerland',
        startDate: '2026-07-15',
        endDate: '2026-07-20',
        budgetAllocated: 1500,
        orderIndex: 1,
        activities: [
          { title: 'Gornergrat Cog Railway Ride', type: 'SIGHTSEEING', cost: 95, startTime: '09:00:00' },
          { title: 'Five Lakes Hiking Trail Guide', type: 'SIGHTSEEING', cost: 40, startTime: '08:30:00' }
        ]
      }
    ]
  },
  'mock-105': {
    name: 'Tokyo Future & Tradition',
    description: 'A balanced trip exploring Akihabara tech culture, teamLab borderless digital art, alongside historical shrines in Kyoto.',
    startDate: '2026-10-05',
    endDate: '2026-10-15',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    stops: [
      {
        cityName: 'Tokyo, Japan',
        startDate: '2026-10-05',
        endDate: '2026-10-10',
        budgetAllocated: 1400,
        orderIndex: 0,
        activities: [
          { title: 'teamLab Planets Digital Exhibition', type: 'ENTERTAINMENT', cost: 28, startTime: '11:00:00' },
          { title: 'Shibuya Sky & Harajuku Tour', type: 'SIGHTSEEING', cost: 18, startTime: '15:00:00' },
          { title: 'Shinjuku Omoide Yokocho Izakaya', type: 'FOOD', cost: 40, startTime: '19:30:00' }
        ]
      },
      {
        cityName: 'Kyoto, Japan',
        startDate: '2026-10-11',
        endDate: '2026-10-15',
        budgetAllocated: 1000,
        orderIndex: 1,
        activities: [
          { title: 'Fushimi Inari Shrine Morning Walk', type: 'SIGHTSEEING', cost: 0, startTime: '07:30:00' },
          { title: 'Traditional Tea Ceremony Experience', type: 'FOOD', cost: 35, startTime: '14:00:00' }
        ]
      }
    ]
  }
};

const PublicItinerary = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sharing feedback
  const [copiedLink, setCopiedLink] = useState(false);
  const [cloning, setCloning] = useState(false);
  const [clonedSuccess, setClonedSuccess] = useState(false);
  const [likes, setLikes] = useState(24);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (tripId) {
      if (tripId.startsWith('mock-')) {
        const mockTrip = mockItinerariesData[tripId];
        if (mockTrip) {
          const formattedMock = {
            id: tripId,
            name: mockTrip.name,
            description: mockTrip.description,
            startDate: mockTrip.startDate,
            endDate: mockTrip.endDate,
            coverImage: mockTrip.coverImage,
            isPublic: true,
            stops: mockTrip.stops.map((stop, sidx) => ({
              id: `mock-stop-${tripId}-${sidx}`,
              cityName: stop.cityName,
              startDate: stop.startDate,
              endDate: stop.endDate,
              budgetAllocated: stop.budgetAllocated,
              orderIndex: stop.orderIndex,
              activities: stop.activities.map((act, aidx) => ({
                id: `mock-act-${tripId}-${sidx}-${aidx}`,
                title: act.title,
                type: act.type,
                cost: act.cost,
                startTime: act.startTime
              }))
            }))
          };
          setTrip(formattedMock);
          setStops(formattedMock.stops);
          setLoading(false);
          // Set deterministic likes count based on ID
          setLikes(Math.floor(Math.abs(tripId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 100) + 45);
          return;
        }
      }

      api.get(`/api/trips/${tripId}`)
        .then(res => {
          setTrip(res.data);
          // Sort stops
          const sortedStops = (res.data.stops || []).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
          setStops(sortedStops);
        })
        .catch(err => {
          console.error('Error fetching public trip:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [tripId]);

  // Copy public URL
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Copy entire Trip to User's Account (Cloning Engine)
  const handleCopyTripToAccount = async () => {
    if (!currentUser) {
      alert('Please sign up or log in to copy this adventure to your profile!');
      navigate('/');
      return;
    }

    setCloning(true);
    try {
      // 1. Create cloned trip base
      const tripPayload = {
        name: `Cloned: ${trip.name}`,
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        coverImage: trip.coverImage,
        status: 'UPCOMING',
        isPublic: false
      };

      const clonedTripRes = await api.post(`/api/trips/user/${currentUser.id}`, tripPayload);
      const newTripId = clonedTripRes.data.id;

      // 2. Clone stops and sub-activities sequentially
      for (const stop of stops) {
        const stopPayload = {
          cityName: stop.cityName,
          startDate: stop.startDate,
          endDate: stop.endDate,
          budgetAllocated: stop.budgetAllocated,
          orderIndex: stop.orderIndex
        };

        const clonedStopRes = await api.post(`/api/trips/${newTripId}/stops`, stopPayload);
        const newStopId = clonedStopRes.data.id;

        // Clone activities of this stop
        if (stop.activities && stop.activities.length > 0) {
          for (const act of stop.activities) {
            const actPayload = {
              title: act.title,
              type: act.type,
              cost: act.cost,
              startTime: act.startTime
            };
            await api.post(`/api/trips/stops/${newStopId}/activities`, actPayload);
          }
        }
      }

      setClonedSuccess(true);
      setTimeout(() => {
        navigate(`/itinerary/${newTripId}`);
      }, 1500);

    } catch (err) {
      console.error('Cloning error:', err);
      alert('Failed to clone this trip. Please try again.');
    } finally {
      setCloning(false);
    }
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col items-center justify-center text-slate-200">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400">Loading Shared Adventure Board...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col items-center justify-center text-slate-200 p-6 text-center space-y-4">
        <Compass className="w-16 h-16 text-indigo-400 animate-bounce-slow" />
        <h2 className="text-2xl font-black">Itinerary not found or private</h2>
        <p className="text-sm text-slate-400 max-w-sm">
          The requested travel plan may have been deleted, or the owner has configured it as private.
        </p>
        <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-indigo-500 rounded-xl text-xs font-bold text-white">Go to Traveloop</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 pb-16 relative overflow-hidden">
      {/* Radial glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500 rounded-full opacity-10 blur-[120px]" />
      </div>

      {/* Sharing header branding */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(currentUser ? '/dashboard' : '/')}>
              <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Compass className="w-5 h-5 text-white animate-spin-slow" />
              </div>
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-300 tracking-tight">
                Traveloop <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full ml-1 border border-indigo-500/20">SHARED</span>
              </span>
            </div>

            {currentUser ? (
              <button 
                onClick={() => navigate('/dashboard')} 
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                Go to My Dashboard
              </button>
            ) : (
              <button 
                onClick={() => navigate('/')} 
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-colors"
              >
                Sign In / Join Traveloop
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-10 space-y-8">
        
        {/* Giant Cover Photo Banner Header */}
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl relative">
          <div className="h-64 sm:h-80 bg-gradient-to-br from-indigo-600/20 to-purple-700/20 relative">
            <img 
              src={trip.coverImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'} 
              alt={trip.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          <div className="p-8 relative mt-[-100px] z-10 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div className="space-y-3">
                <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold tracking-widest text-[10px] uppercase rounded-full">
                  Public Travelogue
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  {trip.name}
                </h1>
                <p className="text-sm text-slate-300 flex items-center gap-2 font-semibold">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  {trip.startDate} to {trip.endDate}
                </p>
              </div>

              {/* Action buttons row */}
              <div className="flex flex-wrap gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  onClick={handleLike}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    hasLiked 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                  {likes}
                </button>

                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  {copiedLink ? 'Copied URL!' : 'Share'}
                </button>

                <button
                  disabled={cloning || clonedSuccess}
                  onClick={handleCopyTripToAccount}
                  className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {cloning ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : clonedSuccess ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {cloning ? 'Cloning Plan...' : clonedSuccess ? 'Copied successfully!' : 'Copy Trip'}
                </button>
              </div>
            </div>

            {/* Owner Creator details block */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <img className="h-10 w-10 rounded-xl object-cover border border-white/10" src="https://api.dicebear.com/7.x/pixel-art/svg?seed=shared" alt="Creator" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Curator</span>
                  <span className="text-sm font-bold text-white">Traveloop Pioneer</span>
                </div>
              </div>

              {/* Social sharing widget circles */}
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1.5">Share with Friends:</span>
                <a 
                  href={`https://twitter.com/intent/tweet?text=Check%20out%20my%20itinerary%20on%20Traveloop:%20${window.location.href}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Read-Only Timeline layout displaying stops and planned events */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-white">Chronological Timeline</h2>

          <div className="space-y-10 relative pl-0 sm:pl-8">
            {/* Line connector */}
            {stops.length > 1 && (
              <div className="absolute left-[30px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-indigo-500/10 pointer-events-none hidden sm:block" />
            )}

            {stops.map((stop, index) => (
              <div key={stop.id} className="relative sm:pl-16 space-y-4">
                {/* Node counter */}
                <div className="absolute left-[10px] top-4 w-[42px] h-[42px] rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center shadow-lg border border-white/20 relative z-10 hidden sm:flex">
                  {index + 1}
                </div>

                {/* Stop Card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-indigo-400" />
                        {stop.cityName}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {stop.startDate} to {stop.endDate}
                      </p>
                    </div>

                    <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs font-black text-emerald-400 shrink-0">
                      Budgeted: ${stop.budgetAllocated}
                    </div>
                  </div>

                  {/* Activities planned list */}
                  {(!stop.activities || stop.activities.length === 0) ? (
                    <p className="text-xs text-slate-500 italic py-4 text-center">No daily activities mapped out for this stop yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {stop.activities.map(act => (
                        <div key={act.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
                          <div>
                            <span className="font-bold text-sm text-white block">{act.title}</span>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                {act.startTime?.substring(0, 5) || '12:00'}
                              </span>
                              <span>•</span>
                              <span className={`px-2 py-0.5 rounded-md ${
                                act.type === 'FOOD' ? 'bg-amber-500/15 text-amber-300' : 'bg-indigo-500/15 text-indigo-300'
                              }`}>
                                {act.type}
                              </span>
                            </div>
                          </div>
                          
                          <span className="font-black text-sm text-emerald-400">${act.cost}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default PublicItinerary;
