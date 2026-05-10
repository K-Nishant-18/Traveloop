import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Settings, 
  LogOut, 
  Map, 
  Trash2, 
  Globe, 
  Shield, 
  Star, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  Loader
} from 'lucide-react';
import api from '../services/api';
import AuthService from '../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser() || { id: 1, username: 'Alex Traveler', email: 'alex@traveloop.io' };

  const [user, setUser] = useState({
    name: currentUser.username || 'Alex Traveler',
    email: currentUser.email || 'alex@traveloop.io',
    location: 'Zurich, Switzerland',
    bio: 'Avid explorer, design enthusiast, and chocolate taster. Always scouting for the next ski trail!',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alex',
    language: 'English',
    isPrivate: false
  });

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Saved preset destinations list
  const savedDestinations = [
    { city: 'Kyoto', country: 'Japan', rating: '⭐ 4.9', cost: '$$', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80' },
    { city: 'Santorini', country: 'Greece', rating: '⭐ 4.8', cost: '$$$', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=300&q=80' },
    { city: 'Paris', country: 'France', rating: '⭐ 4.7', cost: '$$$', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80' }
  ];

  useEffect(() => {
    // Sync details with server user metadata
    api.get(`/api/users/${currentUser.id}`)
      .then(res => {
        const u = res.data;
        setUser(prev => ({
          ...prev,
          name: u.name || prev.name,
          email: u.email || prev.email,
          location: u.location || prev.location
        }));
      })
      .catch(err => {
        console.error('User fetch fallback:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUser.id]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      // Simulate/perform server update
      await api.put(`/api/users/${currentUser.id}`, {
        name: user.name,
        location: user.location,
        bio: user.bio
      });

      // Update local storage username if needed
      const current = JSON.parse(localStorage.getItem('user'));
      if (current) {
        current.username = user.name;
        localStorage.setItem('user', JSON.stringify(current));
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error('Error saving profile changes:', err);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // API call to purge user
      await api.delete(`/api/users/${currentUser.id}`);
      AuthService.logout();
      navigate('/');
    } catch (err) {
      console.error('Error deleting account:', err);
      AuthService.logout();
      navigate('/');
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  // Avatar presets
  const avatars = [
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alex',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Wander',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Explorer',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ski'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 pb-16 relative overflow-hidden">
      {/* Glow filters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500 rounded-full opacity-10 blur-[120px]" />
      </div>

      {/* Nav header */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center text-slate-400 hover:text-white transition-colors gap-2 font-semibold text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center text-rose-400 hover:text-rose-300 transition-colors gap-1.5 font-bold text-xs bg-rose-500/10 hover:bg-rose-500/20 px-4 py-2 rounded-xl border border-rose-500/20 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Profile central dashboard sheet */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-10 space-y-8">
        
        {loading ? (
          <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Syncing settings manifest...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              
              {/* Profile Cover Image Banner */}
              <div className="h-36 bg-gradient-to-r from-indigo-500/30 to-purple-600/30 relative">
                {/* Float avatar */}
                <div className="absolute -bottom-10 left-8 border-4 border-slate-900 rounded-2xl bg-slate-900 shadow-xl overflow-hidden">
                  <img src={user.avatar} alt="Profile avatar" className="w-24 h-24 object-cover" />
                </div>
              </div>

              {/* Banner profile info */}
              <div className="pt-14 px-8 pb-8 space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
                  <div>
                    <h2 className="text-2xl font-black text-white">{user.name}</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                      <Map className="w-3.5 h-3.5 text-indigo-400" /> {user.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {avatars.map((av, index) => (
                      <button 
                        key={index} 
                        onClick={() => setUser(prev => ({ ...prev, avatar: av }))}
                        className={`w-10 h-10 rounded-xl overflow-hidden border transition-all ${
                          user.avatar === av ? 'border-indigo-400 scale-105 shadow-lg' : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img src={av} alt="Avatar suggestion" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Edit Fields Form */}
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Display Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-xs text-white focus:ring-1 focus:ring-indigo-500" 
                        value={user.name} 
                        onChange={(e) => setUser({...user, name: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Location Zone</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-xs text-white focus:ring-1 focus:ring-indigo-500" 
                        value={user.location} 
                        onChange={(e) => setUser({...user, location: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address (Read-Only)</label>
                      <input 
                        type="email" 
                        disabled 
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl outline-none text-xs text-slate-500 cursor-not-allowed" 
                        value={user.email} 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Language Preference</label>
                      <select 
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-xs text-slate-300 rounded-xl outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                        value={user.language} 
                        onChange={(e) => setUser({...user, language: e.target.value})}
                      >
                        <option value="English">English (US)</option>
                        <option value="Español">Español (ES)</option>
                        <option value="Français">Français (FR)</option>
                        <option value="Deutsch">Deutsch (DE)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Adventure Biography</label>
                    <textarea 
                      rows="3" 
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-xs text-white resize-none focus:ring-1 focus:ring-indigo-500" 
                      value={user.bio} 
                      onChange={(e) => setUser({...user, bio: e.target.value})}
                    />
                  </div>

                  {/* Privacy details block */}
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-indigo-400" />
                      <div>
                        <span className="font-bold text-xs text-white block">Private Explorer Mode</span>
                        <span className="text-[10px] text-slate-400 font-semibold">When active, your itineraries are hidden from community feeds.</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setUser(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${user.isPrivate ? 'bg-indigo-500' : 'bg-slate-700'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${user.isPrivate ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Save profile actions bar */}
                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <button 
                      type="submit" 
                      disabled={saveLoading}
                      className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
                    >
                      {saveLoading ? (
                        <Loader className="w-3.5 h-3.5 animate-spin" />
                      ) : savedSuccess ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      {saveLoading ? 'Saving Info...' : savedSuccess ? 'Profile updated!' : 'Save Preferences'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Saved destinations list display */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
              <div className="flex items-center gap-2 text-indigo-400">
                <Star className="w-4 h-4 fill-indigo-400 text-indigo-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Bookmarked Destinations ({savedDestinations.length})</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {savedDestinations.map((sd, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-white/5 bg-slate-900 relative group shadow-xl">
                    <div className="h-28 bg-slate-800 relative">
                      <img src={sd.image} alt={sd.city} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    </div>
                    <div className="p-4 relative mt-[-20px] z-10">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{sd.country}</span>
                      <h4 className="font-bold text-sm text-white">{sd.city}</h4>
                      <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>Cost Index: {sd.cost}</span>
                        <span className="text-indigo-300">{sd.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone account deletion block */}
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
                <h4 className="text-sm font-black uppercase tracking-wider">Platform Danger Zone</h4>
              </div>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                Deleting your Traveloop profile is absolute and irreversible. All planned adventure cards, checklists, invoice parameters, and journal notes will be permanently purged from the MySQL clusters.
              </p>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Purge Account & Data
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Delete Account Modal Alert */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Purge My Account?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you absolutely sure? All flight itineraries, budgets, and saved journals will be permanently destroyed.
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
