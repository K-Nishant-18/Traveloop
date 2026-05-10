import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Map, Calendar as CalendarIcon, Loader, Image, Check } from 'lucide-react';
import api from '../services/api';

const CreateTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Curated cover image presets from Unsplash
  const coverPresets = [
    { name: 'Alpine Mountains', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Parisian Streets', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
    { name: 'Tokyo Lights', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Roman Monuments', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' },
    { name: 'Tropical Bali', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' }
  ];

  // Helper to determine initial cover preset based on pre-populated destination
  const getInitialCover = (dest) => {
    if (!dest) return coverPresets[0].url; // Default to Alpine mountains
    const d = dest.toLowerCase();
    if (d.includes('paris')) return coverPresets[1].url;
    if (d.includes('tokyo')) return coverPresets[2].url;
    if (d.includes('rome')) return coverPresets[3].url;
    if (d.includes('bali')) return coverPresets[4].url;
    return coverPresets[0].url;
  };

  // Handle pre-population from recommended destinations state
  const presetDestination = location.state?.presetDestination || '';

  const [formData, setFormData] = useState({
    name: presetDestination,
    description: presetDestination ? `An exciting, curated exploration of ${presetDestination}.` : '',
    startDate: '',
    endDate: ''
  });

  const [selectedCover, setSelectedCover] = useState(() => getInitialCover(presetDestination));
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [useCustomCover, setUseCustomCover] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update cover selection if the pre-populated destination changes dynamically
  useEffect(() => {
    if (presetDestination) {
      setSelectedCover(getInitialCover(presetDestination));
    }
  }, [presetDestination]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Date validation
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user')) || { id: 1 };
    
    // Choose cover image: custom input or selected preset
    const finalCoverImage = useCustomCover && customCoverUrl.trim() 
      ? customCoverUrl.trim() 
      : selectedCover;

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        coverImage: finalCoverImage,
        status: 'UPCOMING'
      };
      const response = await api.post(`/api/trips/user/${user.id}`, payload);
      navigate(`/itinerary/${response.data.id}`);
    } catch (err) {
      console.error('Error creating trip:', err);
      setError('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 pb-12 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500 rounded-full opacity-10 blur-[120px]" />
      </div>

      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center text-slate-400 hover:text-white transition-colors gap-2 font-medium text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-200">
              Plan a New Trip
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Start your next journey by providing some basic details and selecting a beautiful cover photo.
            </p>
          </div>
          
          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Trip Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70 mb-2">
                Trip Name / Destination
              </label>
              <div className="relative group">
                <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white placeholder-slate-500"
                  placeholder="e.g. Summer Eurotrip or Paris, France"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                rows="3"
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white placeholder-slate-500"
                placeholder="What is this trip about?"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Travel Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70 mb-2">
                  Start Date
                </label>
                <div className="relative group">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white [color-scheme:dark]"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70 mb-2">
                  End Date
                </label>
                <div className="relative group">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="date"
                    name="endDate"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white [color-scheme:dark]"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Premium Cover Photo Selector */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200/70">
                  Select Cover Photo (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setUseCustomCover(!useCustomCover)}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  {useCustomCover ? 'Select Preset' : 'Paste Custom URL'}
                </button>
              </div>

              {!useCustomCover ? (
                /* Preset Gallery Row */
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {coverPresets.map((preset, idx) => {
                    const isSelected = selectedCover === preset.url;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedCover(preset.url)}
                        className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                          isSelected 
                            ? 'border-indigo-400 ring-2 ring-indigo-500/30' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/20" />
                        <span className="absolute bottom-1 left-2 right-2 text-[9px] font-bold text-white truncate text-center">
                          {preset.name}
                        </span>

                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-indigo-950/40 backdrop-blur-[1px]">
                            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[3px]" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Custom Image URL Input */
                <div className="relative group animate-fade-in">
                  <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="url"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all outline-none text-sm text-white placeholder-slate-500"
                    placeholder="https://images.unsplash.com/your-custom-image-url..."
                    value={customCoverUrl}
                    onChange={(e) => setCustomCoverUrl(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm rounded-2xl transition-all outline-none shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center gap-2 cursor-pointer"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Creating Trip...' : 'Create Trip & Start Planning'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateTrip;
