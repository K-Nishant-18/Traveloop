import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Trash2, 
  Edit3, 
  ArrowRight, 
  Search, 
  SlidersHorizontal, 
  Compass, 
  X, 
  Check, 
  Loader,
  Eye
} from 'lucide-react';
import api from '../services/api';
import AuthService from '../services/authService';

const MyTrips = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal editing states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
    coverImage: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete confirmation states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  useEffect(() => {
    if (user?.id) fetchTrips();
    else setLoading(false);
  }, [user?.id]);

  // Handle Edit Action
  const handleOpenEdit = (trip) => {
    setEditingTrip(trip);
    setEditFormData({
      name: trip.name || '',
      description: trip.description || '',
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      status: trip.status || 'UPCOMING',
      coverImage: trip.coverImage || ''
    });
    setEditError('');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');

    if (new Date(editFormData.startDate) > new Date(editFormData.endDate)) {
      setEditError('End date cannot be earlier than start date.');
      return;
    }

    setEditLoading(true);
    try {
      const response = await api.put(`/api/trips/${editingTrip.id}`, {
        ...editingTrip,
        ...editFormData
      });
      // Update local trips array
      setTrips(trips.map(t => t.id === editingTrip.id ? response.data : t));
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating trip:', err);
      setEditError('Failed to save changes. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Delete Action
  const handleOpenDelete = (trip) => {
    setTripToDelete(trip);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/api/trips/${tripToDelete.id}`);
      // Filter out deleted trip from UI
      setTrips(trips.filter(t => t.id !== tripToDelete.id));
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Error deleting trip:', err);
      alert('Failed to delete adventure. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter logic
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          trip.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 pb-16 relative overflow-hidden">
      {/* Glow overlays */}
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
              <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-300 tracking-tight">
                Traveloop
              </span>
            </div>

            {/* Middle Nav Links */}
            <div className="hidden md:flex items-center space-x-1">
              <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">Dashboard</button>
              <button onClick={() => navigate('/my-trips')} className="px-4 py-2 text-sm font-bold text-indigo-400 bg-white/5 rounded-xl transition-all">My Trips</button>
              <button onClick={() => navigate('/community')} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">Community</button>
              <button onClick={() => navigate('/admin')} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">Admin Panel</button>
            </div>

            {/* Profile Avatar info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/5 cursor-pointer" onClick={() => navigate('/profile')}>
                <span className="text-sm font-bold text-white hidden sm:block">{user?.name || 'Explorer'}</span>
                <img className="h-8.5 w-8.5 rounded-xl object-cover" src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.email || 'default'}`} alt="Profile" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-10 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
              My Saved Adventures
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Browse, manage, edit details, or delete itineraries for all your personal travel plans.
            </p>
          </div>
          <button
            onClick={() => navigate('/create-trip')}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Plan New Trip
          </button>
        </div>

        {/* Search and Filters Hub */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search adventures by name or keywords..."
              className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm text-white placeholder-slate-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter pills dropdown */}
          <div className="flex gap-2 items-center w-full md:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              className="bg-white/5 border border-white/10 text-slate-300 text-xs font-bold rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:border-white/20 transition-all w-full md:w-48 [color-scheme:dark]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ACTIVE">Active / Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Trips display list */}
        {loading ? (
          <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading your adventure collection...</p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="p-12 text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl max-w-lg mx-auto space-y-4 shadow-xl">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No adventures match filters</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Try adjusting your search query, selecting another status filter, or begin planning a brand new getaway.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map(trip => {
              // Extract destination stops count
              const stopCount = trip.stops?.length || 0;

              return (
                <div 
                  key={trip.id} 
                  className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-indigo-500/30 hover:shadow-indigo-500/10 hover:shadow-2xl transition-all duration-300 flex flex-col group relative"
                >
                  {/* Card Banner Cover Image */}
                  <div className="h-44 bg-gradient-to-br from-indigo-600/30 to-purple-700/30 relative overflow-hidden">
                    <img 
                      src={trip.coverImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'} 
                      alt={trip.name} 
                      className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    
                    {/* Status Pill Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase rounded-full backdrop-blur-md border border-white/10 ${
                        trip.status === 'COMPLETED' 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/20' 
                          : trip.status === 'ACTIVE' 
                          ? 'bg-sky-500/20 text-sky-300 border-sky-400/20' 
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-400/20'
                      }`}>
                        {trip.status}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white truncate">{trip.name}</h3>
                    </div>
                  </div>

                  {/* Card details body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed h-[2rem]">
                      {trip.description || 'Embarking on a custom adventure to map out beautiful travel memories.'}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-white/5">
                      <div className="flex items-center text-xs text-slate-300">
                        <Calendar className="w-3.5 h-3.5 mr-2 text-indigo-400 shrink-0" />
                        {trip.startDate} to {trip.endDate}
                      </div>
                      <div className="flex items-center text-xs text-slate-300">
                        <MapPin className="w-3.5 h-3.5 mr-2 text-indigo-400 shrink-0" />
                        <span>{stopCount} {stopCount === 1 ? 'Destination' : 'Destinations'} Planned</span>
                      </div>
                    </div>

                    {/* Action controls row */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(trip)}
                          title="Edit Details"
                          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(trip)}
                          title="Delete Plan"
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => navigate(`/itinerary/${trip.id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Itinerary
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Glassmorphic Inline Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Edit Trip Details</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-200">
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Trip Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white focus:ring-1 focus:ring-indigo-500"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Description</label>
                <textarea
                  rows="2"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white focus:ring-1 focus:ring-indigo-500"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                    value={editFormData.startDate}
                    onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                    value={editFormData.endDate}
                    onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl outline-none text-xs text-white focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Publicly Shared</label>
                  <div className="flex items-center h-9">
                    <input
                      type="checkbox"
                      id="isPublicEdit"
                      className="w-4 h-4 bg-white/5 border border-white/10 rounded text-indigo-500 focus:ring-0 cursor-pointer"
                      checked={editingTrip?.isPublic || false}
                      onChange={(e) => setEditingTrip({ ...editingTrip, isPublic: e.target.checked })}
                    />
                    <label htmlFor="isPublicEdit" className="ml-2 text-xs text-slate-300 cursor-pointer">Visible to Community</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl outline-none text-xs text-white focus:ring-1 focus:ring-indigo-500"
                  placeholder="https://images.unsplash.com/..."
                  value={editFormData.coverImage}
                  onChange={(e) => setEditFormData({ ...editFormData, coverImage: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg"
                >
                  {editLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Delete Adventure?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you absolutely sure you want to delete <span className="font-bold text-slate-200">"{tripToDelete?.name}"</span>? This action is permanent and will purge all itinerary stops, checklists, and note logs.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-all outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-all outline-none flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/20"
              >
                {deleteLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : null}
                {deleteLoading ? 'Deleting...' : 'Delete Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyTrips;
