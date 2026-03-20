import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, updateEvent } from '../api/eventApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

export default function EventEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getEvent(id).then(res => {
      const e = res.data.event;
      setForm({
        event_name: e.event_name, description: e.description || '', event_date: e.event_date,
        start_time: e.start_time, end_time: e.end_time, venue: e.venue,
        venue_lat: e.venue_lat || '', venue_lng: e.venue_lng || '',
        venue_radius: e.venue_radius, status: e.status,
      });
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        venue_lat: form.venue_lat ? parseFloat(form.venue_lat) : null,
        venue_lng: form.venue_lng ? parseFloat(form.venue_lng) : null,
      };
      await updateEvent(id, data);
      toast.success('Event updated.');
      setTimeout(() => navigate(`/events/${id}`), 1000);
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : 'Update failed.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <LoadingSpinner />;

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Event</h1>
      <p className="text-sm text-gray-500 mb-6">Modify event details</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-green-300 max-w-2xl">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400">
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue Radius (m)</label>
            <input type="number" min="1" value={form.venue_radius}
              onChange={e => set('venue_radius', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input type="text" value={form.venue_lat} onChange={e => set('venue_lat', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input type="text" value={form.venue_lng} onChange={e => set('venue_lng', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Update Event'}
            </button>
            <button type="button" onClick={() => navigate(`/events/${id}`)}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}






