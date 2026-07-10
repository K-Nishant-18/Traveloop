import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  MessageCircle, 
  MapPin, 
  Compass, 
  Search, 
  Sparkles, 
  Plus, 
  MessageSquare, 
  Copy, 
  CheckCircle2, 
  Loader, 
  ChevronDown, 
  ChevronUp, 
  SlidersHorizontal, 
  LogOut, 
  Calendar, 
  Lock, 
  Unlock, 
  Send,
  Eye,
  Globe
} from 'lucide-react';
import api from '../services/api';
import AuthService from '../services/authService';

// Curated Mock Itineraries Data for Quick-Cloning and Fallbacks
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

// Generates high-fidelity default seed comments for each trip to look alive
const getDefaultComments = (tripId, title) => {
  const commentsPool = [
    [
      { author: 'Liam Miller', text: 'This looks absolutely incredible! Added to my travel bucket list.', date: '2 hours ago' },
      { author: 'Sofia Chen', text: 'What was your total budget for this trip? Planning to replicate it in June!', date: '1 day ago' }
    ],
    [
      { author: 'Oliver Bennett', text: 'Perfect selection of stops! Highly recommend the local cafes near the central station.', date: '3 hours ago' },
      { author: 'Isabella Ross', text: 'Did you need any special permits or visas for these multi-stop routes?', date: '2 days ago' }
    ],
    [
      { author: 'Marcus Aurelius', text: 'Exquisite planning. The scheduling is very realistic and not rushed.', date: '1 hour ago' },
      { author: 'Amara Walker', text: 'Saved! Is it easy to find English-speaking guides around these spots?', date: '5 days ago' }
    ]
  ];
  const index = Math.abs(typeof tripId === 'string' ? tripId.charCodeAt(0) : Number(tripId) || 0) % commentsPool.length;
  return commentsPool[index].map((c, i) => ({
    id: `default-${tripId}-${i}`,
    author: c.author,
    text: c.text,
    date: c.date,
    avatar: c.author
  }));
};

// Resolves a curated Unsplash landscape based on trip keywords or fallbacks
const getTripImage = (trip) => {
  if (trip.coverImage && trip.coverImage.trim() !== '') {
    return trip.coverImage;
  }
  const title = (trip.name || trip.title || '').toLowerCase();
  if (title.includes('paris') || title.includes('france')) {
    return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80';
  }
  if (title.includes('tokyo') || title.includes('japan')) {
    return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80';
  }
  if (title.includes('rome') || title.includes('italy')) {
    return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80';
  }
  if (title.includes('bali') || title.includes('indonesia')) {
    return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80';
  }
  if (title.includes('london') || title.includes('uk') || title.includes('england')) {
    return 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?auto=format&fit=crop&w=600&q=80';
  }
  if (title.includes('new york') || title.includes('nyc') || title.includes('usa')) {
    return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80';
  }
  if (title.includes('switzerland') || title.includes('alps')) {
    return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80';
  }
  
  const fallbacks = [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'
  ];
  const numId = typeof trip.id === 'string' ? trip.id.charCodeAt(0) : Number(trip.id) || 0;
  return fallbacks[Math.abs(numId) % fallbacks.length];
};

const Community = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  // Navigation tabs: 'feed' or 'my-hub'
  const [activeTab, setActiveTab] = useState('feed');

  // Shared Feed State
  const [sharedTrips, setSharedTrips] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  // User's own trips state (My Hub)
  const [myTrips, setMyTrips] = useState([]);
  const [loadingHub, setLoadingHub] = useState(true);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [durationFilter, setDurationFilter] = useState('ALL'); // ALL, SHORT, MEDIUM, LONG
  const [sortBy, setSortBy] = useState('LIKES'); // LIKES, COMMENTS, DURATION, NEWEST

  // Likes & Comments local storage reactive mappings
  const [likedTrips, setLikedTrips] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [expandedTripId, setExpandedTripId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Cloning feedback mappings: { tripId: 'cloning' | 'success' | 'error' }
  const [cloningStates, setCloningStates] = useState({});

  // Fetch Public / Shared Trips
  const fetchPublicTrips = () => {
    setLoadingFeed(true);
    api.get('/api/trips/public')
      .then(res => {
        // Map backend trips and filter only public ones
        const backendPublic = res.data
          .filter(trip => trip.isPublic)
          .map(trip => {
            const days = trip.startDate && trip.endDate 
              ? Math.max(1, Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)))
              : (trip.stops ? trip.stops.length * 3 : 5);

            // Deterministic likes and comments based on ID so they persist/feel realistic
            const likesSeed = Math.floor(Math.abs(Number(trip.id) * 11) % 150) + 10;
            const commentsSeedCount = Math.floor(Math.abs(Number(trip.id) * 3) % 12) + 1;

            return {
              id: trip.id,
              name: trip.name,
              description: trip.description,
              startDate: trip.startDate,
              endDate: trip.endDate,
              isPublic: true,
              author: trip.user?.name || 'Traveloop Pioneer',
              email: trip.user?.email || 'pioneer@traveloop.com',
              days: days,
              stopsCount: trip.stops ? trip.stops.length : 0,
              coverImage: trip.coverImage,
              defaultLikes: likesSeed,
              defaultCommentsCount: commentsSeedCount,
              rawTrip: trip // Keep reference for cloning
            };
          });

        // Assemble Mock Trips
        const formattedMocks = defaultMockTrips();
        
        // Merge them together
        setSharedTrips([...backendPublic, ...formattedMocks]);
      })
      .catch(err => {
        console.error('Error loading public feed:', err);
        // Fallback to mock trips only on network failure
        setSharedTrips(defaultMockTrips());
      })
      .finally(() => {
        setLoadingFeed(false);
      });
  };

  // Fetch Logged in User's own trips for the Control Panel
  const fetchMyTrips = () => {
    if (!user?.id) return;
    setLoadingHub(true);
    api.get(`/api/trips/user/${user.id}`)
      .then(res => {
        setMyTrips(res.data || []);
      })
      .catch(err => {
        console.error('Error fetching own trips:', err);
      })
      .finally(() => {
        setLoadingHub(false);
      });
  };

  // Initialize and Sync Local Storage
  useEffect(() => {
    fetchPublicTrips();
    fetchMyTrips();

    // Load Liked trips
    const savedLikes = JSON.parse(localStorage.getItem('traveloop_liked_trips') || '[]');
    setLikedTrips(savedLikes);

    // Load local comments maps
    const savedComments = JSON.parse(localStorage.getItem('traveloop_trip_comments') || '{}');
    setCommentsMap(savedComments);
  }, [user?.id]);

  const defaultMockTrips = () => {
    return Object.keys(mockItinerariesData).map(key => {
      const mock = mockItinerariesData[key];
      const days = Math.max(1, Math.ceil((new Date(mock.endDate) - new Date(mock.startDate)) / (1000 * 60 * 60 * 24)));
      const likesSeed = Math.floor(Math.abs(key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 100) + 45;
      const commentsSeedCount = Math.floor(Math.abs(key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 8) + 3;

      return {
        id: key,
        name: mock.name,
        description: mock.description,
        startDate: mock.startDate,
        endDate: mock.endDate,
        isPublic: true,
        author: mock.name.includes('Backpacking') ? 'Emma Wanderlust' : mock.name.includes('Culinary') ? 'Foodie Travels' : mock.name.includes('Swiss') ? 'Elena Peak' : mock.name.includes('NYC') ? 'Alex Explorer' : 'Tech Nomad',
        email: 'mock@traveloop.com',
        days: days,
        stopsCount: mock.stops.length,
        coverImage: mock.coverImage,
        defaultLikes: likesSeed,
        defaultCommentsCount: commentsSeedCount
      };
    });
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  // Toggle Publicity switch on own trips (My Hub)
  const handleTogglePublicity = async (trip) => {
    try {
      const updatedTrip = { ...trip, isPublic: !trip.isPublic };
      await api.put(`/api/trips/${trip.id}`, updatedTrip);
      
      // Update local hub list
      setMyTrips(myTrips.map(t => t.id === trip.id ? { ...t, isPublic: !t.isPublic } : t));
      
      // Instantly synchronize community feed!
      fetchPublicTrips();
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
      alert('Could not update adventure visibility. Please try again.');
    }
  };

  // Toggle Like button reactively
  const handleLikeTrip = (tripId) => {
    const updatedLikes = likedTrips.includes(tripId)
      ? likedTrips.filter(id => id !== tripId)
      : [...likedTrips, tripId];
    setLikedTrips(updatedLikes);
    localStorage.setItem('traveloop_liked_trips', JSON.stringify(updatedLikes));
  };

  // Expand and load comments
  const handleToggleComments = (tripId, title) => {
    if (expandedTripId === tripId) {
      setExpandedTripId(null);
    } else {
      setExpandedTripId(tripId);
      setNewCommentText('');
      
      // Load comments (creates seeds if empty)
      const saved = JSON.parse(localStorage.getItem('traveloop_trip_comments') || '{}');
      if (!saved[tripId]) {
        const defaults = getDefaultComments(tripId, title);
        setCommentsMap(prev => ({ ...prev, [tripId]: defaults }));
      } else {
        setCommentsMap(prev => ({ ...prev, [tripId]: saved[tripId] }));
      }
    }
  };

  // Submit comment
  const handleSubmitComment = (e, tripId) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: user?.name || 'Explorer Guest',
      text: newCommentText,
      date: 'Just now',
      avatar: user?.name || 'guest'
    };

    const saved = JSON.parse(localStorage.getItem('traveloop_trip_comments') || '{}');
    const existing = saved[tripId] || getDefaultComments(tripId, '');
    const updated = [...existing, newComment];

    saved[tripId] = updated;
    localStorage.setItem('traveloop_trip_comments', JSON.stringify(saved));
    setCommentsMap(prev => ({ ...prev, [tripId]: updated }));
    setNewCommentText('');
  };

  // One-Click Quick-Clone Engine (Supports both mock and user-generated itineraries)
  const handleQuickClone = async (tripId, tripName) => {
    if (!user) {
      alert('Please log in or register to clone itineraries to your profile!');
      navigate('/');
      return;
    }

    setCloningStates(prev => ({ ...prev, [tripId]: 'cloning' }));

    try {
      let stopsToClone = [];
      let baseTripDetails = {};

      if (String(tripId).startsWith('mock-')) {
        // 1A. Handle Clone for Curated Mock Itinerary
        const mockData = mockItinerariesData[tripId];
        baseTripDetails = {
          name: `Cloned: ${mockData.name}`,
          description: mockData.description,
          startDate: mockData.startDate,
          endDate: mockData.endDate,
          coverImage: mockData.coverImage,
          status: 'UPCOMING',
          isPublic: false
        };
        stopsToClone = mockData.stops;
      } else {
        // 1B. Handle Clone for Live User Public Itinerary (Fetch complete details with stops and activities)
        const res = await api.get(`/api/trips/${tripId}`);
        const liveTrip = res.data;
        baseTripDetails = {
          name: `Cloned: ${liveTrip.name}`,
          description: liveTrip.description,
          startDate: liveTrip.startDate,
          endDate: liveTrip.endDate,
          coverImage: liveTrip.coverImage,
          status: 'UPCOMING',
          isPublic: false
        };
        stopsToClone = (liveTrip.stops || []).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      }

      // 2. Post Cloned Trip Base to Account
      const clonedBaseRes = await api.post(`/api/trips/user/${user.id}`, baseTripDetails);
      const newTripId = clonedBaseRes.data.id;

      // 3. Sequentially post Stops and sub-Activities
      for (const stop of stopsToClone) {
        const stopPayload = {
          cityName: stop.cityName,
          startDate: stop.startDate,
          endDate: stop.endDate,
          budgetAllocated: stop.budgetAllocated,
          orderIndex: stop.orderIndex
        };

        const stopRes = await api.post(`/api/trips/${newTripId}/stops`, stopPayload);
        const newStopId = stopRes.data.id;

        // Sequence and post activities
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

      // 4. Update clone progress to success state!
      setCloningStates(prev => ({ ...prev, [tripId]: 'success' }));
      
      // Update Hub trips lists dynamically so it renders immediately
      fetchMyTrips();

      // Clear the clone status overlay checkmark after 3s
      setTimeout(() => {
        setCloningStates(prev => {
          const updated = { ...prev };
          delete updated[tripId];
          return updated;
        });
      }, 3000);

    } catch (err) {
      console.error('Quick clone error:', err);
      setCloningStates(prev => ({ ...prev, [tripId]: 'error' }));
      setTimeout(() => {
        setCloningStates(prev => {
          const updated = { ...prev };
          delete updated[tripId];
          return updated;
        });
      }, 3000);
    }
  };

  // Sorting and Filtering logic on Shared Feed
  const filteredSharedTrips = sharedTrips.filter(trip => {
    // Search filter
    const matchesSearch = trip.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          trip.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Duration filter
    let matchesDuration = true;
    if (durationFilter === 'SHORT') {
      matchesDuration = trip.days <= 4;
    } else if (durationFilter === 'MEDIUM') {
      matchesDuration = trip.days >= 5 && trip.days <= 10;
    } else if (durationFilter === 'LONG') {
      matchesDuration = trip.days >= 11;
    }

    return matchesSearch && matchesDuration;
  }).sort((a, b) => {
    // Sorting algorithms
    const likedA = likedTrips.includes(a.id);
    const likedB = likedTrips.includes(b.id);
    const likesA = a.defaultLikes + (likedA ? 1 : 0);
    const likesB = b.defaultLikes + (likedB ? 1 : 0);

    const commentsSaved = JSON.parse(localStorage.getItem('traveloop_trip_comments') || '{}');
    const commsA = (commentsSaved[a.id] || getDefaultComments(a.id, '')).length;
    const commsB = (commentsSaved[b.id] || getDefaultComments(b.id, '')).length;

    if (sortBy === 'LIKES') {
      return likesB - likesA;
    } else if (sortBy === 'COMMENTS') {
      return commsB - commsA;
    } else if (sortBy === 'DURATION') {
      return b.days - a.days;
    } else {
      // Newest (mocks last, user-created trips first)
      const isMockA = String(a.id).startsWith('mock-');
      const isMockB = String(b.id).startsWith('mock-');
      if (isMockA && !isMockB) return 1;
      if (!isMockA && isMockB) return -1;
      return Number(b.id) - Number(a.id);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 pb-16 relative overflow-hidden font-sans">
      
      {/* Decorative Glow Overlays */}
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
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
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
                className="px-4 py-2 text-sm font-bold text-indigo-400 bg-white/5 rounded-xl transition-all"
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-10 space-y-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            Wanderlust Collective
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-300">
            Traveloop Community
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Get inspired by other travelers. Browse public multi-stop itineraries, clone shared adventures with one click to your account, or toggles visibility on your own personal journeys!
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/10 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'feed'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            Global Explorers Feed
          </button>
          {user?.id && (
            <button
              onClick={() => setActiveTab('my-hub')}
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
                activeTab === 'my-hub'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-4 h-4" />
              My Adventure Hub
            </button>
          )}
        </div>

        {activeTab === 'feed' ? (
          /* ==================================== */
          /*         GLOBAL EXPLORERS FEED        */
          /* ==================================== */
          <div className="space-y-8 animate-fade-in">
            {/* Search, Filters, Sorting Toolbar */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-3xl flex flex-col md:flex-row gap-4 items-center shadow-2xl backdrop-blur-md">
              {/* Keyword Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search trips by destination, keyword, or explorer..."
                  className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm text-white placeholder-slate-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
                {/* Duration Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1 sm:flex-initial">
                  <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
                  <select
                    className="bg-slate-900/60 border border-white/10 text-slate-300 text-xs font-bold rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:border-white/20 transition-all w-full [color-scheme:dark]"
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                  >
                    <option value="ALL">All Durations</option>
                    <option value="SHORT">Weekend Gateways (1-4 Days)</option>
                    <option value="MEDIUM">Vacations (5-10 Days)</option>
                    <option value="LONG">Grand Expeditions (11+ Days)</option>
                  </select>
                </div>

                {/* Sorting Select */}
                <select
                  className="bg-slate-900/60 border border-white/10 text-slate-300 text-xs font-bold rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:border-white/20 transition-all w-full sm:w-44 [color-scheme:dark]"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="LIKES">Most Liked</option>
                  <option value="COMMENTS">Most Discussed</option>
                  <option value="DURATION">Longest Trips</option>
                  <option value="NEWEST">Recently Added</option>
                </select>
              </div>
            </div>

            {loadingFeed ? (
              <div className="p-20 text-center bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-xl">
                <Loader className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-sm text-slate-400">Fetching shared travel logs...</p>
              </div>
            ) : filteredSharedTrips.length === 0 ? (
              <div className="p-16 text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl max-w-lg mx-auto space-y-4 shadow-xl">
                <Compass className="w-14 h-14 text-indigo-400 mx-auto animate-pulse" />
                <h3 className="text-xl font-bold text-white">No Adventures Match</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Try adjusting your search query, choosing a different trip duration, or clearing your search filters to view more travel logs.
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setDurationFilter('ALL'); }}
                  className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs rounded-xl transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSharedTrips.map(trip => {
                  const hasLiked = likedTrips.includes(trip.id);
                  const likesCount = trip.defaultLikes + (hasLiked ? 1 : 0);
                  const savedComs = commentsMap[trip.id] || getDefaultComments(trip.id, trip.name);
                  const commentsCount = savedComs.length;
                  const isCloned = cloningStates[trip.id] === 'success';
                  const isCloning = cloningStates[trip.id] === 'cloning';

                  return (
                    <div 
                      key={trip.id} 
                      className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-indigo-500/30 hover:shadow-indigo-500/10 hover:shadow-2xl transition-all duration-300 flex flex-col group relative backdrop-blur-md"
                    >
                      {/* Image Banner Section */}
                      <div className="h-48 relative overflow-hidden">
                        <img 
                          src={getTripImage(trip)} 
                          alt={trip.name} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        
                        {/* Day / Stops Badges */}
                        <div className="absolute top-4 right-4 flex gap-1.5">
                          <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md border border-white/10 text-[9px] font-black tracking-wider uppercase text-indigo-300 rounded-md">
                            {trip.days} Days
                          </span>
                          <span className="px-2.5 py-1 bg-indigo-500/20 backdrop-blur-md border border-indigo-400/20 text-[9px] font-black tracking-wider uppercase text-indigo-300 rounded-md">
                            {trip.stopsCount} Stops
                          </span>
                        </div>
                      </div>

                      {/* Card Content Section */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          {/* Title */}
                          <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-1">
                            {trip.name}
                          </h3>

                          {/* Author & Avatar */}
                          <div className="flex items-center gap-2.5">
                            <img 
                              className="h-6 w-6 rounded-md border border-white/10" 
                              src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${trip.author}`} 
                              alt="Avatar" 
                            />
                            <p className="text-xs text-slate-400 font-semibold">by {trip.author}</p>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed min-h-[3rem]">
                            {trip.description || 'Embarking on a custom adventure to map out beautiful memories.'}
                          </p>
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-2">
                          <div className="flex items-center gap-2">
                            {/* Like Counter Button */}
                            <button 
                              onClick={() => handleLikeTrip(trip.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                                hasLiked 
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                  : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-400' : ''}`} />
                              {likesCount}
                            </button>

                            {/* Comment Expand Button */}
                            <button 
                              onClick={() => handleToggleComments(trip.id, trip.name)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                                expandedTripId === trip.id 
                                  ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20' 
                                  : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
                              }`}
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              {commentsCount}
                            </button>
                          </div>

                          <div className="flex gap-1">
                            {/* Quick Clone Icon Button */}
                            <button
                              disabled={isCloned || isCloning}
                              onClick={() => handleQuickClone(trip.id, trip.name)}
                              title={isCloning ? 'Cloning to your account...' : isCloned ? 'Successfully Cloned!' : 'Quick Clone to My Trips'}
                              className={`p-2.5 rounded-xl text-xs font-black transition-all ${
                                isCloning 
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : isCloned 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-white/5 hover:bg-indigo-500 hover:text-white text-slate-300'
                              }`}
                            >
                              {isCloning ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : isCloned ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>

                            {/* View Full Trip button */}
                            <button
                              onClick={() => navigate(`/public-itinerary/${trip.id}`)}
                              className="px-3.5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-1 shrink-0"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                          </div>
                        </div>

                        {/* Collapsing Comments Board */}
                        {expandedTripId === trip.id && (
                          <div className="pt-4 mt-2 border-t border-white/5 space-y-4 animate-fade-in text-left">
                            <h4 className="text-xs font-black tracking-wider text-slate-300 uppercase flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              Comments ({commentsCount})
                            </h4>

                            <div className="max-h-48 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                              {savedComs.map((comment) => (
                                <div key={comment.id} className="p-3 bg-white/5 rounded-2xl space-y-1.5 border border-white/5">
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold text-indigo-300">{comment.author}</span>
                                    <span className="text-slate-500">{comment.date}</span>
                                  </div>
                                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                    {comment.text}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Add Comment Form */}
                            <form 
                              onSubmit={(e) => handleSubmitComment(e, trip.id)}
                              className="flex gap-2"
                            >
                              <input
                                type="text"
                                placeholder="Add a public comment..."
                                className="flex-1 px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500/50"
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                              />
                              <button
                                type="submit"
                                className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors shrink-0"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ==================================== */
          /*         MY ADVENTURE SHARING HUB     */
          /* ==================================== */
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Your Publicity Dashboard</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure visibility permissions for your custom-built travel planners and choose what to share with the community.
                  </p>
                </div>
              </div>
            </div>

            {loadingHub ? (
              <div className="p-16 text-center bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3">
                <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-sm text-slate-400">Syncing your personal adventure catalog...</p>
              </div>
            ) : myTrips.length === 0 ? (
              <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl space-y-4">
                <Compass className="w-12 h-12 text-indigo-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">No custom trips found</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  You haven't built any private travel planners yet. Head to your dashboard to layout an adventure!
                </p>
                <button
                  onClick={() => navigate('/create-trip')}
                  className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
                >
                  Create Trip Itinerary
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myTrips.map(trip => {
                  const stopCount = trip.stops?.length || 0;
                  return (
                    <div 
                      key={trip.id} 
                      className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/15 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white truncate">{trip.name}</h4>
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase border ${
                            trip.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                          }`}>
                            {trip.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {trip.description || 'Custom Travelogue and checklist logs.'}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] text-slate-500 font-semibold pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {trip.startDate} to {trip.endDate}
                          </span>
                          <span>•</span>
                          <span>{stopCount} {stopCount === 1 ? 'Destination' : 'Destinations'}</span>
                        </div>
                      </div>

                      {/* Share control toggle switch */}
                      <div className="flex items-center gap-4 bg-slate-900/40 p-2.5 sm:p-3 rounded-2xl border border-white/5 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          {trip.isPublic ? (
                            <div className="flex items-center gap-1.5 text-indigo-400">
                              <Unlock className="w-3.5 h-3.5" />
                              <span>Shared with Community</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Private / Unlisted</span>
                            </div>
                          )}
                        </div>

                        {/* Toggle switch slider button */}
                        <button
                          type="button"
                          onClick={() => handleTogglePublicity(trip)}
                          className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 outline-none ${
                            trip.isPublic ? 'bg-indigo-500' : 'bg-slate-800 border border-white/10'
                          }`}
                        >
                          <div 
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                              trip.isPublic ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default Community;
