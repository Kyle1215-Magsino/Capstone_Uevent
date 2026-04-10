import { useState, useEffect } from 'react';
import Modal from './Modal';
import { getEvent, updateEvent } from '../api/eventApi';
import { toast } from 'react-toastify';

export default function EventEditModal({ eventId, open, onClose, onUpdated }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && eventId) {
      setLoading(true);
      setForm(null);
      getEvent(eventId).then(res => {
        const e = res.data.event;
        setForm({
          event_name: e.event_name, description: e.description || '', event_date: e.event_date,
          start_time: e.start_time, end_time: e.end_time, venue: e.venue,
          venue_lat: e.venue_lat || '', venue_lng: e.venue_lng || '',
          venue_radius: e.venue_radius, status: e.status,
        });
      }).finally(() => setLoading(false));
    }
  }, [open, eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        venue_lat: form.venue_lat ? parseFloat(form.venue_lat) : null,
        venue_lng: form.venue_lng ? parseFloat(form.venue_lng) : null,
      };
      await updateEvent(eventId, data);
      toast.success('Event updated.');
      onClose();
      onUpdated?.();
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : 'Update failed.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const inputCls = 'w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent';

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Edit Event</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Modify event details</p>

        {loading || !form ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-500">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <input type="text" required value={form.event_name} onChange={e => set('event_name', e.target.value)} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows="3" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" required value={form.event_date} onChange={e => set('event_date', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <select required value={form.venue} onChange={e => set('venue', e.target.value)} className={inputCls}>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
              <input type="time" required value={form.start_time} onChange={e => set('start_time', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
              <input type="time" required value={form.end_time} onChange={e => set('end_time', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue Radius (m)</label>
              <input type="number" min="1" value={form.venue_radius} onChange={e => set('venue_radius', parseInt(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitude</label>
              <input type="text" value={form.venue_lat} onChange={e => set('venue_lat', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitude</label>
              <input type="text" value={form.venue_lng} onChange={e => set('venue_lng', e.target.value)} className={inputCls} />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Update Event'}
              </button>
              <button type="button" onClick={onClose}
                className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
