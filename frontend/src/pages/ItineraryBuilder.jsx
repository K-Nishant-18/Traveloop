import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Clock, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Edit3, 
  Loader, 
  Sparkles, 
  CheckCircle2, 
  X,
  PlusCircle,
  Compass,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

// Curated City Catalog for predictive City Search
const POPULAR_CITIES = [
  { name: 'Paris', country: 'France', costIndex: '$$$', popularity: '4.9', category: 'Culture' },
  { name: 'Tokyo', country: 'Japan', costIndex: '$$$', popularity: '4.9', category: 'Tech & Food' },
  { name: 'Rome', country: 'Italy', costIndex: '$$', popularity: '4.8', category: 'History' },
  { name: 'Zermatt', country: 'Switzerland', costIndex: '$$$$', popularity: '4.9', category: 'Alpine & Adventure' },
  { name: 'Interlaken', country: 'Switzerland', costIndex: '$$$$', popularity: '4.8', category: 'Lakes & Adventure' },
  { name: 'Bali', country: 'Indonesia', costIndex: '$', popularity: '4.7', category: 'Tropical' },
  { name: 'London', country: 'United Kingdom', costIndex: '$$$', popularity: '4.8', category: 'Heritage' },
  { name: 'New York', country: 'United States', costIndex: '$$$$', popularity: '4.9', category: 'Metropolitan' },
];

// Curated Activity preset recommendations
const PRESET_ACTIVITIES = {
  'Paris': [
    { title: 'Louvre Museum Tour', type: 'SIGHTSEEING', cost: 45, startTime: '10:00', duration: '3 hrs', desc: 'Skip the line guided exploration of iconic masterpieces.' },
    { title: 'Eiffel Tower Top Access', type: 'SIGHTSEEING', cost: 35, startTime: '14:00', duration: '2 hrs', desc: 'Breathtaking panoramic views of the Parisian cityscape.' },
    { title: 'Seine River Dinner Cruise', type: 'FOOD', cost: 85, startTime: '19:30', duration: '2.5 hrs', desc: 'Gourmet French cuisine under sparkling monuments.' },
    { title: 'Montmartre Secret Food Tour', type: 'FOOD', cost: 65, startTime: '12:00', duration: '3 hrs', desc: 'Indulge in artisanal cheeses, pastries, and wines.' }
  ],
  'Tokyo': [
    { title: 'Shibuya Crossing & Sky Visit', type: 'SIGHTSEEING', cost: 20, startTime: '16:00', duration: '1.5 hrs', desc: 'Iconic panoramic overlook above the world\'s busiest crossing.' },
    { title: 'Tsukiji Fish Market Feast', type: 'FOOD', cost: 40, startTime: '08:30', duration: '2 hrs', desc: 'Savor freshly sliced sashimi and flame-seared wagyu.' },
    { title: 'Robot Restaurant Cabaret', type: 'SIGHTSEEING', cost: 60, startTime: '19:00', duration: '2 hrs', desc: 'Dazzling high-tech neon laser entertainment show.' },
    { title: 'Private Sushi Masterclass', type: 'FOOD', cost: 110, startTime: '12:00', duration: '3 hrs', desc: 'Learn exact roll techniques from a Michelin-starred master.' }
  ],
  'Rome': [
    { title: 'Colosseum Underground Access', type: 'SIGHTSEEING', cost: 50, startTime: '09:00', duration: '3 hrs', desc: 'Step onto the arena floor where gladiators fought.' },
    { title: 'Vatican Museums & Sistine Chapel', type: 'SIGHTSEEING', cost: 40, startTime: '13:30', duration: '3.5 hrs', desc: 'Gaze at Michelangelo\'s awe-inspiring ceiling frescoes.' },
    { title: 'Trastevere Sunset Food Crawl', type: 'FOOD', cost: 55, startTime: '18:00', duration: '3 hrs', desc: 'Sample authentic roman pasta, suppli, and local wines.' },
    { title: 'Traditional Gelato Making Class', type: 'FOOD', cost: 30, startTime: '15:00', duration: '1.5 hrs', desc: 'Whip up custom creamy gelato flavors from scratch.' }
  ],
  'Zermatt': [
    { title: 'Matterhorn Glacier Paradise', type: 'SIGHTSEEING', cost: 120, startTime: '09:00', duration: '4 hrs', desc: 'Cable car to Europe\'s highest mountain station at 3,883m.' },
    { title: 'Gornergrat Railway Ride', type: 'SIGHTSEEING', cost: 88, startTime: '11:00', duration: '3 hrs', desc: 'Historic rack railway offering majestic Matterhorn backdrops.' },
    { title: 'Alpine Cheese Fondue Feast', type: 'FOOD', cost: 45, startTime: '18:30', duration: '2 hrs', desc: 'Cozy up with bubbling local cheese in a wood-carved cabin.' }
  ],
  'Interlaken': [
    { title: 'Tandem Paragliding Flight', type: 'SIGHTSEEING', cost: 170, startTime: '10:00', duration: '1.5 hrs', desc: 'Soar through the skies with 360 views of Swiss Lakes.' },
    { title: 'Harder Kulm Funicular Climb', type: 'SIGHTSEEING', cost: 35, startTime: '15:00', duration: '2 hrs', desc: 'Ascend to the "Top of Interlaken" for panoramic vistas.' },
    { title: 'Chocolate Show Workshop', type: 'FOOD', cost: 28, startTime: '14:00', duration: '1.5 hrs', desc: 'Mold and design your own fine Swiss chocolates.' }
  ],
  'Bali': [
    { title: 'Ubud Sacred Monkey Forest Tour', type: 'SIGHTSEEING', cost: 12, startTime: '09:00', duration: '2 hrs', desc: 'Encounter playful macaques and ancient jungle temples.' },
    { title: 'Mt. Batur Sunrise Volcano Trek', type: 'SIGHTSEEING', cost: 45, startTime: '03:00', duration: '6 hrs', desc: 'Early morning climb to catch a spectacular sunrise over lakes.' },
    { title: 'Jimbaran Bay Seafood BBQ', type: 'FOOD', cost: 25, startTime: '18:00', duration: '2 hrs', desc: 'Fresh lobster and red snapper directly on the sandy beach.' }
  ],
  'General': [
    { title: 'Hop-on Hop-off Explorer Bus', type: 'SIGHTSEEING', cost: 25, startTime: '10:00', duration: 'All Day', desc: 'Flexible sightseeing tour across prime city landmarks.' },
    { title: 'Locals\' Hidden Street Food Tour', type: 'FOOD', cost: 35, startTime: '13:00', duration: '2.5 hrs', desc: 'Discover off-the-beaten-path culinary treasures.' },
    { title: 'Scenic Bike Ride & Heritage Tour', type: 'SIGHTSEEING', cost: 20, startTime: '11:00', duration: '2 hrs', desc: 'Leisurely guided bicycle ride along historical streets.' }
  ]
};

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState({ name: 'Curating Exploration', startDate: '', endDate: '' });
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  // View Mode: 'LIST' or 'CALENDAR'
  const [viewMode, setViewMode] = useState('LIST');

  // Search/Filters states for Activity presets
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [activityCategoryFilter, setActivityCategoryFilter] = useState('ALL');
  const [activityCostMax, setActivityCostMax] = useState(200);

  // City Predictive search toggles
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [showCityResults, setShowCityResults] = useState(false);

  // Stop add form toggles & states
  const [showAddStop, setShowAddStop] = useState(false);
  const [newStop, setNewStop] = useState({ cityName: '', startDate: '', endDate: '', budgetAllocated: '' });
  const [addStopLoading, setAddStopLoading] = useState(false);
  const [addStopError, setAddStopError] = useState('');

  // Stop inline edit states
  const [showEditStopModal, setShowEditStopModal] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [editStopData, setEditStopData] = useState({ cityName: '', startDate: '', endDate: '', budgetAllocated: '' });
  const [editStopLoading, setEditStopLoading] = useState(false);
  const [editStopError, setEditStopError] = useState('');

  // Activity adding states
  const [activeStopId, setActiveStopId] = useState(null);
  const [activityInputMode, setActivityInputMode] = useState('PRESET'); // 'PRESET' or 'CUSTOM'
  const [newActivity, setNewActivity] = useState({ title: '', type: 'SIGHTSEEING', cost: '', startTime: '' });
  const [addActivityLoading, setAddActivityLoading] = useState(false);

  // Fetch full trip with stops and sorted activities
  const fetchTripDetails = async () => {
    try {
      const response = await api.get(`/api/trips/${tripId}`);
      setTrip(response.data);
      const sortedStops = (response.data.stops || []).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setStops(sortedStops);
    } catch (error) {
      console.error('Error fetching trip details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId && tripId !== 'new-trip') {
      fetchTripDetails();
    } else {
      setLoading(false);
    }
  }, [tripId]);

  // Handle predictive city selection
  const handleSelectCityPreset = (city) => {
    setNewStop({
      ...newStop,
      cityName: city.name
    });
    setCitySearchQuery(city.name);
    setShowCityResults(false);
  };

  // Handle Adding a Stop
  const handleAddStop = async (e) => {
    e.preventDefault();
    setAddStopError('');

    const finalCityName = newStop.cityName || citySearchQuery;
    if (!finalCityName) {
      setAddStopError('Please input or select a city.');
      return;
    }

    if (new Date(newStop.startDate) > new Date(newStop.endDate)) {
      setAddStopError('Stop end date cannot be earlier than start date.');
      return;
    }

    setAddStopLoading(true);
    try {
      const payload = {
        cityName: finalCityName,
        startDate: newStop.startDate,
        endDate: newStop.endDate,
        budgetAllocated: parseFloat(newStop.budgetAllocated) || 0,
        orderIndex: stops.length
      };

      const res = await api.post(`/api/trips/${tripId}/stops`, payload);
      setStops([...stops, { ...res.data, activities: [] }]);
      setNewStop({ cityName: '', startDate: '', endDate: '', budgetAllocated: '' });
      setCitySearchQuery('');
      setShowAddStop(false);
    } catch (err) {
      console.error('Error adding stop:', err);
      setAddStopError('Failed to add destination stop.');
    } finally {
      setAddStopLoading(false);
    }
  };

  // Open Edit Stop Modal
  const handleOpenEditStop = (stop) => {
    setEditingStop(stop);
    setEditStopData({
      cityName: stop.cityName || '',
      startDate: stop.startDate || '',
      endDate: stop.endDate || '',
      budgetAllocated: stop.budgetAllocated || ''
    });
    setEditStopError('');
    setShowEditStopModal(true);
  };

  // Save Stop Edit Details
  const handleSaveStopEdit = async (e) => {
    e.preventDefault();
    setEditStopError('');

    if (new Date(editStopData.startDate) > new Date(editStopData.endDate)) {
      setEditStopError('End date cannot be earlier than start date.');
      return;
    }

    setEditStopLoading(true);
    try {
      const updatedStopPayload = {
        ...editingStop,
        cityName: editStopData.cityName,
        startDate: editStopData.startDate,
        endDate: editStopData.endDate,
        budgetAllocated: parseFloat(editStopData.budgetAllocated) || 0
      };

      const res = await api.put(`/api/trips/stops/${editingStop.id}`, updatedStopPayload);
      setStops(stops.map(s => s.id === editingStop.id ? { ...s, ...res.data } : s));
      setShowEditStopModal(false);
    } catch (err) {
      console.error('Error saving stop details:', err);
      setEditStopError('Failed to update destination details.');
    } finally {
      setEditStopLoading(false);
    }
  };

  // Delete a Stop
  const handleDeleteStop = async (stopId) => {
    if (!window.confirm('Are you sure you want to remove this stop from your itinerary?')) return;
    try {
      await api.delete(`/api/trips/stops/${stopId}`);
      setStops(stops.filter(s => s.id !== stopId));
    } catch (err) {
      console.error('Error deleting stop:', err);
      alert('Failed to remove stop.');
    }
  };

  // Reorder Stops
  const handleReorderStop = async (currentIndex, direction) => {
    const targetIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;

    const newStops = [...stops];
    const temp = newStops[currentIndex];
    newStops[currentIndex] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    newStops[currentIndex].orderIndex = currentIndex;
    newStops[targetIndex].orderIndex = targetIndex;

    setStops(newStops);

    try {
      await api.put(`/api/trips/stops/${newStops[currentIndex].id}`, newStops[currentIndex]);
      await api.put(`/api/trips/stops/${newStops[targetIndex].id}`, newStops[targetIndex]);
    } catch (err) {
      console.error('Error persisting stop reorder:', err);
      fetchTripDetails();
    }
  };

  // Add an Activity
  const handleAddActivity = async (e, stopId, presetAct = null) => {
    if (e) e.preventDefault();
    setAddActivityLoading(true);

    try {
      const actPayload = presetAct ? {
        title: presetAct.title,
        type: presetAct.type,
        cost: presetAct.cost,
        startTime: presetAct.startTime ? presetAct.startTime + ':00' : '12:00:00'
      } : {
        title: newActivity.title,
        type: newActivity.type,
        cost: parseFloat(newActivity.cost) || 0,
        startTime: newActivity.startTime ? newActivity.startTime + ':00' : '12:00:00'
      };

      const res = await api.post(`/api/trips/stops/${stopId}/activities`, actPayload);
      setStops(stops.map(stop => stop.id === stopId 
        ? { ...stop, activities: [...(stop.activities || []), res.data] } 
        : stop
      ));
      
      setNewActivity({ title: '', type: 'SIGHTSEEING', cost: '', startTime: '' });
      setActiveStopId(null);
    } catch (err) {
      console.error('Error adding activity:', err);
      alert('Failed to add activity.');
    } finally {
      setAddActivityLoading(false);
    }
  };

  // Delete an Activity
  const handleDeleteActivity = async (stopId, activityId) => {
    if (!window.confirm('Delete this planned activity?')) return;
    try {
      await api.delete(`/api/trips/activities/${activityId}`);
      setStops(stops.map(stop => stop.id === stopId 
        ? { ...stop, activities: stop.activities.filter(act => act.id !== activityId) } 
        : stop
      ));
    } catch (err) {
      console.error('Error deleting activity:', err);
      alert('Failed to remove activity.');
    }
  };

  // Calculate Calendar Groupings (Day-wise groupings of all activities)
  const getCalendarDays = () => {
    if (!trip.startDate || !trip.endDate) return [];
    
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = [];
    
    // Loop through each day range
    let current = new Date(start);
    let dayCount = 1;
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      
      // Filter stops and gather activities mapped to this specific date
      const activeStops = stops.filter(s => {
        const stopStart = new Date(s.startDate);
        const stopEnd = new Date(s.endDate);
        return current >= stopStart && current <= stopEnd;
      });

      const dayActivities = [];
      activeStops.forEach(stop => {
        const acts = (stop.activities || []).map(act => ({
          ...act,
          cityName: stop.cityName,
          stopId: stop.id
        }));
        dayActivities.push(...acts);
      });

      // Sort day activities by startTime
      dayActivities.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

      days.push({
        dayNumber: dayCount,
        dateString: dateStr,
        dayName: current.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        stops: activeStops,
        activities: dayActivities
      });

      current.setDate(current.getDate() + 1);
      dayCount++;
    }
    return days;
  };

  // Predictive City search filtering
  const filteredCities = POPULAR_CITIES.filter(city => {
    const query = citySearchQuery.toLowerCase();
    return city.name.toLowerCase().includes(query) || city.country.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500 rounded-full opacity-10 blur-[120px]" />
      </div>

      {/* Header sub nav */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <button 
              onClick={() => navigate('/my-trips')} 
              className="flex items-center text-slate-400 hover:text-white transition-colors gap-2 font-semibold text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Trips
            </button>
            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 items-center">
              <button onClick={() => navigate(`/itinerary/${tripId}`)} className="px-4 py-2 text-xs font-bold text-indigo-400 bg-white/5 rounded-xl transition-all">Itinerary</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/budget`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Budget</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/checklist`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Checklist</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/notes`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Notes</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/invoice`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Invoice</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10 space-y-8">
        
        {/* Top Info Header Block */}
        {loading ? (
          <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Fetching trip planner details...</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Compass className="w-4 h-4 animate-spin-slow" />
                <span className="text-xs font-bold tracking-widest uppercase">Itinerary Creator & Explorer</span>
              </div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                {trip.name}
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
                <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" /> {trip.startDate} to {trip.endDate}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
              {/* View Mode Toggle Switch */}
              <div className="flex bg-white/5 border border-white/15 rounded-xl p-0.5 shrink-0">
                <button
                  onClick={() => setViewMode('LIST')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    viewMode === 'LIST' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  List Timeline
                </button>
                <button
                  onClick={() => setViewMode('CALENDAR')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    viewMode === 'CALENDAR' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  Day Calendar
                </button>
              </div>

              {/* Add Stop Button */}
              <button
                onClick={() => setShowAddStop(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Stop
              </button>
            </div>
          </div>
        )}

        {/* Add Destination stop Form Overlay Card (with City predictive search!) */}
        {showAddStop && (
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl animate-fade-in-up space-y-6">
            <div className="flex justify-between items-center border-b border-white/15 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                Discover and Add Destination Stop
              </h3>
              <button 
                onClick={() => {
                  setShowAddStop(false);
                  setCitySearchQuery('');
                  setShowCityResults(false);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addStopError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-200">
                {addStopError}
              </div>
            )}

            <form onSubmit={handleAddStop} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative">
              
              {/* City Name with predictive dropdown catalog */}
              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70 mb-2">City Name</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-white placeholder-slate-500" 
                    value={citySearchQuery} 
                    onChange={e => {
                      setCitySearchQuery(e.target.value);
                      setNewStop({ ...newStop, cityName: e.target.value });
                      setShowCityResults(true);
                    }} 
                    onFocus={() => setShowCityResults(true)}
                    placeholder="e.g. Paris" 
                  />
                </div>

                {/* City Predictive results dropdown list */}
                {showCityResults && citySearchQuery && (
                  <div className="absolute left-0 right-0 mt-2 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-1 animate-fade-in">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">Popular Discoveries</span>
                    {filteredCities.length === 0 ? (
                      <div className="p-3 text-xs text-slate-400 italic text-center">No preset matches, press Enter to custom add</div>
                    ) : (
                      filteredCities.map(city => (
                        <div
                          key={city.name}
                          onClick={() => handleSelectCityPreset(city)}
                          className="flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                        >
                          <div>
                            <span className="text-sm font-bold text-white block">{city.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{city.country} • <span className="text-indigo-400">{city.category}</span></span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">{city.costIndex} Cost</span>
                            <span className="text-xs text-amber-300 font-bold">⭐ {city.popularity}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70 mb-2">Start Date</label>
                <input 
                  type="date" 
                  required 
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-white [color-scheme:dark]" 
                  value={newStop.startDate} 
                  onChange={e => setNewStop({...newStop, startDate: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70 mb-2">End Date</label>
                <input 
                  type="date" 
                  required 
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-white [color-scheme:dark]" 
                  value={newStop.endDate} 
                  onChange={e => setNewStop({...newStop, endDate: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70 mb-2">Budget ($)</label>
                <input 
                  type="number" 
                  min="0" 
                  required 
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-white placeholder-slate-500" 
                  value={newStop.budgetAllocated} 
                  onChange={e => setNewStop({...newStop, budgetAllocated: e.target.value})} 
                  placeholder="e.g. 1500" 
                />
              </div>

              <div className="md:col-span-4 pt-4 border-t border-white/10 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddStop(false);
                    setCitySearchQuery('');
                    setShowCityResults(false);
                  }} 
                  className="px-5 py-3 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={addStopLoading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {addStopLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : null}
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
             VIEW MODE 1: DAY-WISE CALENDAR VIEW (Grouped Day Dates Timeline)
           ========================================================================= */}
        {!loading && viewMode === 'CALENDAR' && (
          <div className="space-y-8 animate-fade-in">
            {getCalendarDays().length === 0 ? (
              <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl max-w-lg mx-auto">
                <HelpCircle className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">Dates are not set</h3>
                <p className="text-xs text-slate-400 mt-1">Please set valid trip start and end dates inside your details page.</p>
              </div>
            ) : (
              getCalendarDays().map(day => (
                <div key={day.dayNumber} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-6 space-y-4 shadow-xl hover:border-indigo-500/20 transition-all">
                  
                  {/* Calendar day header */}
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="px-3.5 py-1.5 bg-indigo-500/20 border border-indigo-400/20 text-indigo-300 font-black text-sm rounded-xl">
                        Day {day.dayNumber}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">{day.dayName}</h3>
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {day.stops.length === 0 ? 'No City Stop Assigned' : day.stops.map(s => s.cityName).join(' ➔ ')}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {day.activities.length} {day.activities.length === 1 ? 'Activity' : 'Activities'}
                    </span>
                  </div>

                  {/* Day Activities blocks */}
                  {day.activities.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500 italic bg-slate-900/10 border border-dashed border-white/5 rounded-2xl">
                      No activities scheduled for this day. Click 'List Timeline' mode to schedule experiences.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {day.activities.map(act => (
                        <div key={act.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl relative flex justify-between items-center group hover:border-white/15 transition-all">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white block">{act.title}</span>
                              <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">{act.cityName}</span>
                            </div>
                            <div className="flex items-center gap-3.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {act.startTime?.substring(0, 5) || '12:00'}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md ${
                                act.type === 'FOOD' 
                                  ? 'bg-amber-500/15 text-amber-300' 
                                  : act.type === 'TRANSIT' 
                                  ? 'bg-sky-500/15 text-sky-300' 
                                  : 'bg-indigo-500/15 text-indigo-300'
                              }`}>
                                {act.type}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="font-black text-sm text-emerald-400">${act.cost}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteActivity(act.stopId, act.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                              title="Delete Activity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        )}

        {/* =========================================================================
             VIEW MODE 2: CHRONOLOGICAL LIST TIMELINE (Standard builder / preset activities)
           ========================================================================= */}
        {!loading && viewMode === 'LIST' && (
          <div className="space-y-10 relative animate-fade-in">
            
            {stops.length > 1 && (
              <div className="absolute left-[30px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-indigo-500/10 pointer-events-none hidden sm:block" />
            )}

            {stops.length === 0 ? (
              <div className="p-12 text-center bg-white/5 border border-dashed border-white/15 rounded-3xl max-w-lg mx-auto space-y-4 shadow-xl">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mx-auto animate-pulse">
                  <Compass className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">Your timeline is empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Start mapping your journey! Add stop locations, allocate budgets, and append daily travel activities.
                </p>
                <button
                  onClick={() => setShowAddStop(true)}
                  className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
                >
                  Add Your First Stop
                </button>
              </div>
            ) : (
              stops.map((stop, index) => {
                const totalCost = (stop.activities || []).reduce((sum, act) => sum + (act.cost || 0), 0);
                const remainingBudget = (stop.budgetAllocated || 0) - totalCost;

                return (
                  <div key={stop.id} className="relative sm:pl-16 group transition-all">
                    
                    {/* Circle Badge Node index */}
                    <div className="absolute left-[10px] top-6 w-[42px] h-[42px] rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center shadow-lg border border-white/20 relative z-10 hidden sm:flex">
                      {index + 1}
                    </div>

                    {/* Outer stop container */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-indigo-500/30 transition-all duration-300">
                      
                      {/* Stop details row bar */}
                      <div className="p-6 bg-white/5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                          {/* Circle badge mobile */}
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0 sm:hidden">
                            {index + 1}
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-indigo-400 shrink-0 animate-bounce-slow" />
                              {stop.cityName}
                            </h2>
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-semibold">
                              <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                              {stop.startDate} to {stop.endDate}
                            </p>
                          </div>
                        </div>

                        {/* Order shifts and delete/edit buttons */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          
                          {/* Index reorder triggers */}
                          <div className="flex bg-white/5 rounded-xl border border-white/5 p-0.5 shrink-0">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleReorderStop(index, 'UP')}
                              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-lg transition-colors cursor-pointer"
                              title="Move Stop Up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={index === stops.length - 1}
                              onClick={() => handleReorderStop(index, 'DOWN')}
                              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-lg transition-colors cursor-pointer"
                              title="Move Stop Down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Controls row */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditStop(stop)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                              title="Edit Stop Details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStop(stop.id)}
                              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                              title="Remove Stop"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Budget Tag */}
                          <div className="text-right ml-2 bg-white/5 border border-white/5 px-4 py-2 rounded-2xl shrink-0">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Budget Allocated</span>
                            <span className="text-base font-black text-emerald-400">${stop.budgetAllocated}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content panel */}
                      <div className="p-6 space-y-6">
                        
                        {/* Title of stop activities section */}
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                            Stop Itinerary Experiences
                          </h4>
                          <button 
                            onClick={() => {
                              setActiveStopId(stop.id);
                              setActivityInputMode('PRESET'); // Default open browsing popular catalog!
                            }} 
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Experience
                          </button>
                        </div>

                        {/* =========================================================================
                             UPGRADED MULTI-MODE ACTIVITY CREATOR & BROWSER CATALOG
                           ========================================================================= */}
                        {activeStopId === stop.id && (
                          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6 animate-fade-in-down">
                            
                            {/* Toggle mode switch header: Preset catalog vs Custom form */}
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                              <div className="flex bg-white/5 border border-white/10 rounded-xl p-0.5">
                                <button
                                  type="button"
                                  onClick={() => setActivityInputMode('PRESET')}
                                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                                    activityInputMode === 'PRESET' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  Browse Curated Catalog
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActivityInputMode('CUSTOM')}
                                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                                    activityInputMode === 'CUSTOM' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  Add Custom Experience
                                </button>
                              </div>

                              <button 
                                onClick={() => setActiveStopId(null)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* MODE A: BROWSE CURATED ATTRACTIONS CATALOG (With filters, durations, description) */}
                            {activityInputMode === 'PRESET' && (
                              <div className="space-y-6">
                                
                                {/* Inner category and cost filters inside catalog */}
                                <div className="flex flex-wrap gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                  {/* Filter input */}
                                  <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                    <input
                                      type="text"
                                      placeholder="Filter preset sights..."
                                      className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/5 rounded-xl outline-none text-xs text-white placeholder-slate-500"
                                      value={activitySearchQuery}
                                      onChange={(e) => setActivitySearchQuery(e.target.value)}
                                    />
                                  </div>

                                  {/* Category dropdown filter */}
                                  <div className="flex items-center gap-1.5">
                                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                                    <select
                                      className="bg-white/5 border border-white/10 text-xs text-slate-300 rounded-xl px-3 py-1.5 outline-none cursor-pointer [color-scheme:dark]"
                                      value={activityCategoryFilter}
                                      onChange={(e) => setActivityCategoryFilter(e.target.value)}
                                    >
                                      <option value="ALL">All Categories</option>
                                      <option value="SIGHTSEEING">Sightseeing</option>
                                      <option value="FOOD">Food / Restaurant</option>
                                    </select>
                                  </div>

                                  {/* Cost filter slider */}
                                  <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Max Cost: ${activityCostMax}</span>
                                    <input
                                      type="range"
                                      min="0"
                                      max="200"
                                      step="5"
                                      className="flex-1 accent-indigo-500 cursor-pointer"
                                      value={activityCostMax}
                                      onChange={(e) => setActivityCostMax(parseInt(e.target.value))}
                                    />
                                  </div>
                                </div>

                                {/* Attractions Presets Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                  {(() => {
                                    const presets = PRESET_ACTIVITIES[stop.cityName] || PRESET_ACTIVITIES['General'];
                                    const filteredPresets = presets.filter(p => {
                                      const matchesSearch = p.title.toLowerCase().includes(activitySearchQuery.toLowerCase()) || 
                                                            p.desc.toLowerCase().includes(activitySearchQuery.toLowerCase());
                                      const matchesCategory = activityCategoryFilter === 'ALL' || p.type === activityCategoryFilter;
                                      const matchesCost = p.cost <= activityCostMax;
                                      return matchesSearch && matchesCategory && matchesCost;
                                    });

                                    if (filteredPresets.length === 0) {
                                      return (
                                        <div className="col-span-2 text-center py-8 text-xs text-slate-500 italic">
                                          No preset sights match your filter criteria. Try expanding search tags!
                                        </div>
                                      );
                                    }

                                    return filteredPresets.map(preset => (
                                      <div 
                                        key={preset.title}
                                        className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/20 hover:shadow-lg transition-all group/preset"
                                      >
                                        <div className="space-y-1">
                                          <div className="flex justify-between items-start gap-2">
                                            <span className="font-bold text-sm text-white block group-hover/preset:text-indigo-200 transition-colors">
                                              {preset.title}
                                            </span>
                                            <span className="font-black text-xs text-emerald-400 shrink-0">
                                              ${preset.cost}
                                            </span>
                                          </div>
                                          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                                            {preset.desc}
                                          </p>
                                        </div>

                                        <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-3">
                                          <div className="flex items-center gap-3 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                                            <span className="flex items-center gap-1">
                                              <Clock className="w-3 h-3 text-slate-500" />
                                              {preset.duration} • {preset.startTime}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-md ${
                                              preset.type === 'FOOD' ? 'bg-amber-500/10 text-amber-300' : 'bg-indigo-500/10 text-indigo-300'
                                            }`}>
                                              {preset.type}
                                            </span>
                                          </div>

                                          <button
                                            type="button"
                                            disabled={addActivityLoading}
                                            onClick={() => handleAddActivity(null, stop.id, preset)}
                                            className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                          >
                                            <Plus className="w-3 h-3" /> Add
                                          </button>
                                        </div>
                                      </div>
                                    ));
                                  })()}
                                </div>
                              </div>
                            )}

                            {/* MODE B: ADD CUSTOM ACTIVITY FORM (Legacy fields) */}
                            {activityInputMode === 'CUSTOM' && (
                              <form onSubmit={(e) => handleAddActivity(e, stop.id)} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end animate-fade-in-down">
                                <div className="md:col-span-2">
                                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Activity Title</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Paragliding flight" 
                                    required 
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500" 
                                    value={newActivity.title} 
                                    onChange={e => setNewActivity({...newActivity, title: e.target.value})} 
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                                  <select 
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 outline-none focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]" 
                                    value={newActivity.type} 
                                    onChange={e => setNewActivity({...newActivity, type: e.target.value})}
                                  >
                                    <option value="SIGHTSEEING">Sightseeing</option>
                                    <option value="FOOD">Food / Restaurant</option>
                                    <option value="TRANSIT">Transit / Flight</option>
                                  </select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Start Time</label>
                                    <input 
                                      type="time" 
                                      required 
                                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]" 
                                      value={newActivity.startTime} 
                                      onChange={e => setNewActivity({...newActivity, startTime: e.target.value})} 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Cost ($)</label>
                                    <input 
                                      type="number" 
                                      placeholder="0" 
                                      required 
                                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" 
                                      value={newActivity.cost} 
                                      onChange={e => setNewActivity({...newActivity, cost: e.target.value})} 
                                    />
                                  </div>
                                </div>

                                <div className="md:col-span-4 flex gap-2 justify-end pt-2 border-t border-white/5">
                                  <button 
                                    type="button" 
                                    onClick={() => setActiveStopId(null)} 
                                    className="px-4 py-2 bg-white/5 text-slate-400 hover:text-white rounded-lg text-xs transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    type="submit" 
                                    disabled={addActivityLoading}
                                    className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg text-xs hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center gap-1.5"
                                  >
                                    {addActivityLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : null}
                                    Save Custom Activity
                                  </button>
                                </div>
                              </form>
                            )}

                          </div>
                        )}

                        {/* Activities list grids */}
                        {(!stop.activities || stop.activities.length === 0) ? (
                          <p className="text-xs text-slate-500 italic py-6 text-center border-2 border-dashed border-white/5 rounded-2xl">
                            No activities planned for this stop yet. Click 'Add Experience' to explore curated sights!
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {stop.activities.map(act => (
                              <div 
                                key={act.id} 
                                className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-white/15 transition-all group"
                              >
                                <div className="space-y-1">
                                  <span className="font-bold text-sm text-white group-hover:text-indigo-200 transition-colors block">
                                    {act.title}
                                  </span>
                                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-slate-500" /> 
                                      {act.startTime?.substring(0, 5) || '12:00'}
                                    </span>
                                    <span>•</span>
                                    <span className={`px-2 py-0.5 rounded-md ${
                                      act.type === 'FOOD' 
                                        ? 'bg-amber-500/15 text-amber-300' 
                                        : act.type === 'TRANSIT' 
                                        ? 'bg-sky-500/15 text-sky-300' 
                                        : 'bg-indigo-500/15 text-indigo-300'
                                    }`}>
                                      {act.type}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4 shrink-0">
                                  <span className="font-black text-sm text-emerald-400">
                                    ${act.cost}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteActivity(stop.id, act.id)}
                                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                    title="Delete Activity"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Cost estimates remaining stop allocation info */}
                        <div className="flex justify-end gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-t border-white/5 pt-4">
                          <span>Total Cost: <span className="text-white">${totalCost}</span></span>
                          <span>Remaining Stop Allocation: <span className={remainingBudget < 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>${remainingBudget}</span></span>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })
            )}

          </div>
        )}
      </main>

      {/* Edit Stop details Modal */}
      {showEditStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-white">Edit Destination Stop</h3>
              <button 
                onClick={() => setShowEditStopModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editStopError && (
              <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-200">
                {editStopError}
              </div>
            )}

            <form onSubmit={handleSaveStopEdit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">City Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white focus:ring-1 focus:ring-indigo-500"
                  value={editStopData.cityName}
                  onChange={(e) => setEditStopData({ ...editStopData, cityName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                    value={editStopData.startDate}
                    onChange={(e) => setEditStopData({ ...editStopData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                    value={editStopData.endDate}
                    onChange={(e) => setEditStopData({ ...editStopData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">BudgetAllocated ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white focus:ring-1 focus:ring-indigo-500"
                  value={editStopData.budgetAllocated}
                  onChange={(e) => setEditStopData({ ...editStopData, budgetAllocated: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditStopModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editStopLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  {editStopLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ItineraryBuilder;
