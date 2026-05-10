import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Calendar,
  Sparkles,
  RefreshCw,
  Loader,
  PlusCircle,
  FileText,
  Smartphone,
  Sparkle,
  Shirt,
  HelpCircle,
  X
} from 'lucide-react';
import api from '../services/api';

const Checklist = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState({ name: 'Expedition Bag' });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('Clothing');
  const [addLoading, setAddLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Fetch checklist items & trip info
  const fetchChecklistDetails = async () => {
    try {
      const tripRes = await api.get(`/api/trips/${tripId}`);
      setTrip(tripRes.data);

      const res = await api.get(`/api/trips/${tripId}/checklist`);
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching checklist items:', err);
      // Fallback presets if error/empty
      setItems([
        { id: 101, itemName: 'Passport & Visas', category: 'Documents', isPacked: false },
        { id: 102, itemName: 'Flight Tickets & Bookings', category: 'Documents', isPacked: true },
        { id: 103, itemName: 'Phone Charger & Adapters', category: 'Electronics', isPacked: false },
        { id: 104, itemName: 'Toothbrush & Grooming Kit', category: 'Toiletries', isPacked: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchChecklistDetails();
    }
  }, [tripId]);

  // Toggle packed status
  const togglePacked = async (id) => {
    try {
      const res = await api.put(`/api/trips/checklist/${id}/toggle`);
      setItems(items.map(item => item.id === id ? res.data : item));
    } catch (err) {
      console.error('Error toggling pack status:', err);
      // Local fallback toggle
      setItems(items.map(item => item.id === id ? { ...item, isPacked: !item.isPacked } : item));
    }
  };

  // Delete checklist item
  const deleteItem = async (id) => {
    try {
      await api.delete(`/api/trips/checklist/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting checklist item:', err);
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Add checklist item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    setAddLoading(true);
    try {
      const payload = { itemName: newItem.trim(), category: newCategory, isPacked: false };
      const res = await api.post(`/api/trips/${tripId}/checklist`, payload);
      setItems([...items, res.data]);
      setNewItem('');
    } catch (err) {
      console.error('Error adding checklist item:', err);
      // Local fallback add
      setItems([...items, { id: Date.now(), itemName: newItem.trim(), category: newCategory, isPacked: false }]);
      setNewItem('');
    } finally {
      setAddLoading(false);
    }
  };

  // Bulk Reset Checklist for Re-use
  const handleResetChecklist = async () => {
    if (!window.confirm('Reset all packed items in this checklist back to unpacked?')) return;
    setResetLoading(true);
    
    try {
      // Loop and reset packed states sequentially
      const packed = items.filter(i => i.isPacked);
      for (const item of packed) {
        await api.put(`/api/trips/checklist/${item.id}/toggle`);
      }
      setItems(items.map(i => ({ ...i, isPacked: false })));
    } catch (err) {
      console.error('Bulk reset issue, resetting local state:', err);
      setItems(items.map(i => ({ ...i, isPacked: false })));
    } finally {
      setResetLoading(false);
    }
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || 'Miscellaneous';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const totalItems = items.length;
  const packedItems = items.filter(i => i.isPacked).length;
  const progress = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  // Icon mapping for categories
  const getCategoryIcon = (cat) => {
    switch (cat.toLowerCase()) {
      case 'documents': return <FileText className="w-4 h-4 text-sky-400" />;
      case 'electronics': return <Smartphone className="w-4 h-4 text-purple-400" />;
      case 'clothing': return <Shirt className="w-4 h-4 text-amber-400" />;
      case 'toiletries': return <Sparkle className="w-4 h-4 text-emerald-400" />;
      default: return <HelpCircle className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Radial glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500 rounded-full opacity-10 blur-[120px]" />
      </div>

      {/* Nav bar */}
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
              <button onClick={() => navigate(`/itinerary/${tripId}/checklist`)} className="px-4 py-2 text-xs font-bold text-indigo-400 bg-white/5 rounded-xl transition-all">Checklist</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/notes`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Notes</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/invoice`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Invoice</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Central Board Container */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10 space-y-8">
        
        {/* Title Block Header */}
        {loading ? (
          <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading checklist manifest...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-8 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden shadow-2xl">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400">
                  <CheckSquare className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-bold tracking-widest uppercase">Packing Assistant</span>
                </div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                  {trip.name} Essentials
                </h1>
                <p className="text-xs text-slate-400 font-semibold">Organize categories and items before you travel.</p>
              </div>

              {/* Reset Checklist trigger button */}
              <button
                onClick={handleResetChecklist}
                disabled={resetLoading || items.length === 0}
                className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {resetLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Reset Checklist
              </button>
            </div>

            {/* Progress Card tracker */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 bg-indigo-500/15 border-b border-white/5 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-black text-white text-base">Packing Progress Monitor</h3>
                  <p className="text-xs text-indigo-300 font-semibold">{packedItems} of {totalItems} essentials secured</p>
                </div>
                <div className="text-4xl font-black text-indigo-400">{progress}%</div>
              </div>
              <div className="w-full bg-slate-900/40 h-2.5 relative">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 transition-all duration-700" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Checklist body columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Column Form: Add New Item */}
              <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl">
                <h3 className="font-black text-white text-sm uppercase tracking-wider border-b border-white/5 pb-2">
                  Add Item To Suitcase
                </h3>

                <form onSubmit={handleAddItem} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Item Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Sunglasses" 
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl outline-none text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-indigo-500"
                      value={newItem} 
                      onChange={e => setNewItem(e.target.value)} 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Category Section</label>
                    <select 
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 text-xs text-slate-300 rounded-xl outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                      value={newCategory} 
                      onChange={e => setNewCategory(e.target.value)}
                    >
                      <option value="Clothing">Clothing</option>
                      <option value="Documents">Documents & Paperwork</option>
                      <option value="Electronics">Electronics & Chargers</option>
                      <option value="Toiletries">Toiletries & Cosmetics</option>
                      <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={addLoading}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all transform hover:scale-[1.01] cursor-pointer"
                  >
                    {addLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Item to List
                  </button>
                </form>
              </div>

              {/* Right Column Grid: Grouped Checklist items */}
              <div className="md:col-span-8 space-y-6">
                {items.length === 0 ? (
                  <div className="p-12 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl max-w-md mx-auto space-y-3">
                    <CheckSquare className="w-10 h-10 text-indigo-400 mx-auto" />
                    <h4 className="text-sm font-bold text-white">Your suitcase is empty</h4>
                    <p className="text-xs text-slate-500">Add clothing, documents, and adapters to prepare for flight boarding!</p>
                  </div>
                ) : (
                  Object.keys(groupedItems).map((category) => (
                    <div key={category} className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                      
                      {/* Section label header with dynamic icon */}
                      <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
                        {getCategoryIcon(category)}
                        <h4 className="font-bold text-white text-sm">{category}</h4>
                      </div>

                      {/* Items lists layout */}
                      <div className="space-y-1">
                        {groupedItems[category].map(item => (
                          <div 
                            key={item.id} 
                            className="flex items-center justify-between p-3 hover:bg-white/5 rounded-2xl group transition-all"
                          >
                            <div 
                              onClick={() => togglePacked(item.id)}
                              className="flex items-center gap-3 cursor-pointer select-none"
                            >
                              {item.isPacked ? (
                                <CheckSquare className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                              ) : (
                                <Square className="w-4.5 h-4.5 text-slate-600 shrink-0 hover:text-white transition-colors" />
                              )}
                              <span className={`text-sm font-semibold transition-all ${
                                item.isPacked ? 'text-slate-500 line-through' : 'text-slate-100 hover:text-indigo-200'
                              }`}>
                                {item.itemName}
                              </span>
                            </div>

                            <button 
                              onClick={() => deleteItem(item.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Checklist;
