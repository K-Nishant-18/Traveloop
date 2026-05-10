import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Plus, MoreVertical, Calendar } from 'lucide-react';
import api from '../services/api';

const Notes = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  React.useEffect(() => {
    if (tripId) {
      api.get(`/api/trips/${tripId}/notes`)
        .then(res => setNotes(res.data))
        .catch(err => {
          console.error('Error fetching notes:', err);
          // Fallback
          setNotes([
            { id: 1, title: 'Hotel Details', content: 'Check in at 3 PM. Booking ref: XJY192', createdAt: '2026-06-15T12:00:00' }
          ]);
        });
    }
  }, [tripId]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (newNote.title && newNote.content) {
      try {
        const payload = { title: newNote.title, content: newNote.content };
        const res = await api.post(`/api/trips/${tripId}/notes`, payload);
        setNotes([res.data, ...notes]);
      } catch (err) {
        console.error(err);
        setNotes([{ id: Date.now(), title: newNote.title, content: newNote.content, createdAt: new Date().toISOString() }, ...notes]);
      }
      setNewNote({ title: '', content: '' });
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <button onClick={() => navigate(`/itinerary/${tripId}`)} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Itinerary
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Trip Notes</h2>
            <p className="mt-2 text-sm text-gray-500">Keep important details and personal journal entries.</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </button>
        </div>

        {isAdding && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-200 mb-8 animate-fade-in-down">
            <form onSubmit={handleAddNote}>
              <input
                type="text"
                placeholder="Note Title"
                required
                className="w-full text-xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none mb-4 focus:ring-0"
                value={newNote.title}
                onChange={e => setNewNote({...newNote, title: e.target.value})}
              />
              <textarea
                placeholder="Write your note here..."
                required
                rows="4"
                className="w-full text-gray-700 bg-gray-50 p-4 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 resize-none mb-4"
                value={newNote.content}
                onChange={e => setNewNote({...newNote, content: e.target.value})}
              ></textarea>
              <div className="flex justify-end space-x-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Save Note</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map(note => (
            <div key={note.id} className="bg-amber-50 p-6 rounded-2xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4 text-amber-300 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer">
                <MoreVertical className="w-5 h-5" />
              </div>
              <div className="flex items-center text-xs font-semibold text-amber-600 mb-3">
                <Calendar className="w-3 h-3 mr-1" /> {note.createdAt ? note.createdAt.split('T')[0] : 'Today'}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{note.title}</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
          {notes.length === 0 && !isAdding && (
             <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
               <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
               <h3 className="text-lg font-medium text-gray-900">No notes yet</h3>
               <p className="text-gray-500 text-sm mt-1">Click the "New Note" button to start writing.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notes;
