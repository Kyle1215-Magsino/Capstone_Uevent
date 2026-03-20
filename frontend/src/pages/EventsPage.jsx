import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getEvents, deleteEvent } from '../api/eventApi';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import EventAddModal from '../components/EventAddModal';
import EventViewModal from '../components/EventViewModal';
import EventEditModal from '../components/EventEditModal';
import { toast } from 'react-toastify';

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || 1;

  const fetchEvents = () => {
    setLoading(true);
    getEvents({ status, search, page })
      .then(res => {
        setEvents(res.data.data);
        setPagination(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, [status, search, page]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEvent(deleteId);
      toast.success('Event deleted.');
      setDeleteId(null);
      fetchEvents();
    } catch {
      toast.error('Failed to delete event.');
    } finally {
      setDeleting(false);
    }
  };

  const statusColors = {
    upcoming: 'bg-green-100 text-green-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500 mt-1">Manage USG events</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 font-medium text-sm transition shadow-sm">
          + Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={e => setSearchParams({ status, search: e.target.value, page: 1 })}
          className="px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400"
        />
        <select
          value={status}
          onChange={e => setSearchParams({ status: e.target.value, search, page: 1 })}
          className="px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400"
        >
          <option value="">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl shadow-sm border border-green-300 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50">
              <tr>
                <th className="px-4 py-3 text-left">Event Name</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Venue</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.map(e => (
                <tr key={e.id} className="hover:bg-green-50">
                  <td className="px-4 py-3 font-medium">{e.event_name}</td>
                  <td className="px-4 py-3">{e.event_date}</td>
                  <td className="px-4 py-3">{e.start_time} - {e.end_time}</td>
                  <td className="px-4 py-3">{e.venue}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${statusColors[e.status]}`}>{e.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {/* View */}
                      <button onClick={() => setViewId(e.id)} title="View" className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      {/* Edit */}
                      <button onClick={() => setEditId(e.id)} title="Edit" className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      {/* Delete */}
                      <button onClick={() => setDeleteId(e.id)} title="Delete" className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No events found.</td></tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <span className="text-sm text-gray-600">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSearchParams({ status, search, page: Math.max(1, pagination.current_page - 1) })}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >Prev</button>
                <button
                  onClick={() => setSearchParams({ status, search, page: Math.min(pagination.last_page, pagination.current_page + 1) })}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >Next</button>
              </div>
            </div>
          )}
        </div>
      )}
      <EventAddModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={fetchEvents} />
      <EventViewModal
        eventId={viewId}
        open={!!viewId}
        onClose={() => setViewId(null)}
        onEdit={() => { setEditId(viewId); setViewId(null); }}
      />
      <EventEditModal
        eventId={editId}
        open={!!editId}
        onClose={() => setEditId(null)}
        onUpdated={fetchEvents}
      />

      {/* Delete confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="max-w-sm">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Event?</h3>
          <p className="text-sm text-gray-500 mb-6">This will permanently delete the event and all its attendance records.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setDeleteId(null)} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}






