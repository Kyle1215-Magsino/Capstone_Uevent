import { useState } from 'react';
import { createEvent } from '../api/eventApi';
import { toast } from 'react-toastify';
import Modal from './Modal';

export default function EventAddModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    event_name: '', description: '', event_date: '', start_time: '', end_time: '',
    venue: '', venue_lat: '', venue_lng: '', venue_radius: 200,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        venue_lat: form.venue_lat ? parseFloat(form.venue_lat) : null,
        venue_lng: form.venue_lng ? parseFloat(form.venue_lng) : null,
      };
      await createEvent(data);
      toast.success('Event created successfully.');
      setTimeout(() => {
        onClose();
        setForm({ event_name: '', description: '', event_date: '', start_time: '', end_time: '', venue: '', venue_lat: '', venue_lng: '', venue_radius: 200 });
        onCreated?.();
      }, 600);
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : err.response?.data?.message || 'Failed to create event.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Event</h2>
          <p className="text-sm text-gray-500 mt-1">Set up a new USG event</p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input type="text" required value={form.event_name} onChange={e => set('event_name', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" rows="3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" required value={form.event_date} onChange={e => set('event_date', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
            <select required value={form.venue} onChange={e => set('venue', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400">
              <option value="">Select Venue</option>
              <option value="Main Auditorium">Main Auditorium</option>
              <option value="University Gymnasium">University Gymnasium</option>
              <option value="IT Building Hall">IT Building Hall</option>
              <option value="Conference Room A">Conference Room A</option>
              <option value="Conference Room B">Conference Room B</option>
              <option value="Bongabong Town Plaza">Bongabong Town Plaza</option>
              <option value="Open Court">Open Court</option>
              <option value="Library Hall">Library Hall</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input type="time" required value={form.start_time} onChange={e => set('start_time', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input type="time" required value={form.end_time} onChange={e => set('end_time', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue Latitude (Optional)</label>
            <input type="text" value={form.venue_lat} onChange={e => set('venue_lat', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" placeholder="e.g. 14.5995" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue Longitude (Optional)</label>
            <input type="text" value={form.venue_lng} onChange={e => set('venue_lng', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" placeholder="e.g. 120.9842" />
          </div>
          <div className="md:col-span-2 flex gap-2 pt-2">
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 transition text-sm shadow-lg shadow-green-200">
              {loading ? 'Creating...' : 'Create Event'}
            </button>
            <button type="button" onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 text-gray-800 rounded-xl hover:bg-slate-600 text-sm font-medium transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}






