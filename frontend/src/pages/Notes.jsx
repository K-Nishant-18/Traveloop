import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Plus, 
  Calendar, 
  Trash2, 
  Edit3, 
  FileText, 
  MapPin, 
  Save, 
  X,
  Clock,
  CheckCircle2,
  Loader
} from 'lucide-react';
import api from '../services/api';

const Notes = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState({ name: 'Adventure Logs', stops: [] });
  const [notes, setNotes] = useState([]);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Editor states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Note inputs
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedStopName, setSelectedStopName] = useState('General Trip');

  // Fetch data
  const fetchData = async () => {
    try {
      const tripRes = await api.get(`/api/trips/${tripId}`);
      setTrip(tripRes.data);
      setStops(tripRes.data.stops || []);

      const notesRes = await api.get(`/api/trips/${tripId}/notes`);
      setNotes(notesRes.data);
    } catch (err) {
      console.error('Error fetching logs:', err);
      // Fallback journals
      setNotes([
        { id: 201, title: 'Hotel Booking Ref', content: 'Check-in: Interlaken Grand Plaza. Ref: INT-8921-A. Breakfast included!', stopName: 'General Trip', createdAt: '2026-05-10T11:00:00' },
        { id: 202, title: 'Local Contacts', content: 'Ski Instructor: Thomas (+41 79 123 4567). Call for snowboarding rental coupons.', stopName: 'Zermatt', createdAt: '2026-05-10T12:00:00' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchData();
    }
  }, [tripId]);

  // Add / Edit Note Action handler
  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    try {
      const payload = { 
        title: noteTitle.trim(), 
        content: noteContent.trim(),
        stopName: selectedStopName 
      };

      if (editingId) {
        // Edit existing note
        const res = await api.put(`/api/trips/notes/${editingId}`, payload);
        setNotes(notes.map(n => n.id === editingId ? res.data : n));
        setEditingId(null);
      } else {
        // Create new note
        const res = await api.post(`/api/trips/${tripId}/notes`, payload);
        setNotes([res.data, ...notes]);
        setIsAdding(false);
      }

      // Reset
      setNoteTitle('');
      setNoteContent('');
      setSelectedStopName('General Trip');
    } catch (err) {
      console.error('Error saving note:', err);
      // Local fallback
      const mockItem = {
        id: editingId || Date.now(),
        title: noteTitle,
        content: noteContent,
        stopName: selectedStopName,
        createdAt: new Date().toISOString()
      };
      if (editingId) {
        setNotes(notes.map(n => n.id === editingId ? mockItem : n));
        setEditingId(null);
      } else {
        setNotes([mockItem, ...notes]);
        setIsAdding(false);
      }
      setNoteTitle('');
      setNoteContent('');
      setSelectedStopName('General Trip');
    }
  };

  // Delete note
  const handleDeleteNote = async (id) => {
    try {
      await api.delete(`/api/trips/notes/${id}`);
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  // Open editor for edit
  const handleOpenEdit = (note) => {
    setEditingId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setSelectedStopName(note.stopName || 'General Trip');
    setIsAdding(true);
    // Scroll smoothly to top editor
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Date formatter
  const formatDate = (isoStr) => {
    if (!isoStr) return 'Recently';
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500 rounded-full opacity-10 blur-[120px]" />
      </div>

      {/* Navigation header */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <button 
              onClick={() => navigate(`/itinerary/${tripId}`)} 
              className="flex items-center text-slate-400 hover:text-white transition-colors gap-2 font-semibold text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Itinerary
            </button>
            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 items-center">
              <button onClick={() => navigate(`/itinerary/${tripId}`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Itinerary</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/budget`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Budget</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/checklist`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Checklist</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/notes`)} className="px-4 py-2 text-xs font-bold text-indigo-400 bg-white/5 rounded-xl transition-all">Notes</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/invoice`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Invoice</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Journal Body */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10 space-y-8">
        
        {loading ? (
          <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading expedition diaries...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-end bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-widest uppercase">Expedition Journal</span>
                </div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                  {trip.name} Notes
                </h1>
                <p className="text-xs text-slate-400 font-semibold">Log check-ins, guidelines, and diaries tied to city stops.</p>
              </div>

              {!isAdding && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setNoteTitle('');
                    setNoteContent('');
                    setSelectedStopName('General Trip');
                    setIsAdding(true);
                  }}
                  className="flex items-center gap-1.5 px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  New Entry
                </button>
              )}
            </div>

            {/* Note Editor Modal Block */}
            {isAdding && (
              <div className="bg-white/5 border border-indigo-500/20 rounded-3xl p-6 shadow-2xl relative space-y-4 animate-fade-in">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    {editingId ? 'Edit Journal Entry' : 'Create New Journal Entry'}
                  </h3>
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveNote} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    {/* Title Input */}
                    <div className="sm:col-span-8">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Entry Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Hotel Check-In parameters" 
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl outline-none text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-indigo-500"
                        value={noteTitle}
                        onChange={e => setNoteTitle(e.target.value)}
                      />
                    </div>

                    {/* Destination Tie Selector */}
                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Associate to Stop</label>
                      <select 
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 text-xs text-slate-300 rounded-xl outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                        value={selectedStopName}
                        onChange={e => setSelectedStopName(e.target.value)}
                      >
                        <option value="General Trip">General (Global Trip)</option>
                        {stops.map(st => (
                          <option key={st.id} value={st.cityName}>{st.cityName}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Journal Narrative</label>
                    <textarea 
                      required
                      rows="4"
                      placeholder="Jot down directions, booking numbers, or snowboard coupon codes..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none text-xs text-white placeholder-slate-500 resize-none focus:ring-1 focus:ring-indigo-500"
                      value={noteContent}
                      onChange={e => setNoteContent(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsAdding(false)} 
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {editingId ? 'Update Entry' : 'Log Entry'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Note cards grid layout */}
            {notes.length === 0 ? (
              <div className="p-16 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl max-w-md mx-auto space-y-3">
                <FileText className="w-10 h-10 text-indigo-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Your diary is empty</h4>
                <p className="text-xs text-slate-500">Log instructions, local emergency numbers, or daily reminders to keep everything tidy!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notes.map(note => (
                  <div key={note.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl relative group hover:border-indigo-500/20 transition-all flex flex-col justify-between space-y-4">
                    
                    {/* Edit/Delete overlays */}
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEdit(note)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        title="Edit Entry"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* Note Tag info header */}
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          {formatDate(note.createdAt)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-indigo-300">
                          <MapPin className="w-3 h-3 text-indigo-400" />
                          {note.stopName || 'General Trip'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white leading-tight">
                        {note.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                        {note.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default Notes;
