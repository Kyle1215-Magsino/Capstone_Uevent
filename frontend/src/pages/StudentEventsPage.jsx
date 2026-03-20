import { useState, useEffect, useMemo } from 'react';
import { getStudentEvents } from '../api/authApi';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';

function EventDetailModal({ event, onClose }) {
  if (!event) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-t-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-100 text-xs font-medium mb-1">Event Details</p>
              <h2 className="text-white font-bold text-lg leading-tight">{event.event_name}</h2>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <span className={`mt-2 inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
            event.status === 'ongoing' ? 'bg-blue-400/30 text-blue-100' : 'bg-white/20 text-white'
          }`}>{event.status}</span>
        </div>
        <div className="p-5 space-y-3">
          {[
            { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, label: 'Date', value: event.event_date },
            { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Time', value: `${event.start_time} – ${event.end_time}` },
            { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, label: 'Venue', value: event.venue },
          ].map(r => (
            <div key={r.label} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">{r.icon}</div>
              <div>
                <p className="text-xs text-gray-400">{r.label}</p>
                <p className="text-sm font-medium text-gray-800">{r.value}</p>
              </div>
            </div>
          ))}
          {event.description && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
              </div>
            </div>
          )}
          {event.venue_lat && event.venue_lng && (
            <a href={`https://www.google.com/maps?q=${event.venue_lat},${event.venue_lng}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              View on Google Maps
            </a>
          )}
          <div className="pt-1">
            {event.checked_in
              ? <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>You are checked in</span>
              : <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">Not yet checked in</span>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    getStudentEvents().then(res => setEvents(res.data)).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (tab === 'all') return events;
    return events.filter(e => e.status === tab);
  }, [events, tab]);

  const counts = useMemo(() => ({
    all: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
  }), [events]);

  if (loading) return <LoadingSpinner />;

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'ongoing', label: 'Ongoing' },
  ];

  const columns = [
    { key: 'event_name', label: 'Event Name', accessor: row => row.event_name },
    { key: 'event_date', label: 'Date', accessor: row => row.event_date },
    { key: 'time', label: 'Time', accessor: row => `${row.start_time} - ${row.end_time}` },
    { key: 'venue', label: 'Venue', accessor: row => row.venue },
    { key: 'status', label: 'Status', render: row => {
      const isOngoing = row.status === 'ongoing';
      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          isOngoing ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
        }`}>
          <span className="capitalize">{row.status}</span>
        </span>
      );
    }},
    { key: 'checked_in', label: 'Attendance', render: row => (
      row.checked_in
        ? <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Checked In</span>
        : <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Pending</span>
    )},
    { key: 'actions', label: '', render: row => (
      <button onClick={() => setSelectedEvent(row)}
        className="px-3 py-1.5 text-xs text-green-600 border border-green-200 rounded-lg hover:bg-green-50 font-medium transition">
        View Details
      </button>
    )},
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-400">Upcoming and ongoing events you can attend</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
            {counts[t.key] > 0 && (
              <span className={`ml-1.5 text-xs ${tab === t.key ? 'text-green-100' : 'text-gray-400'}`}>({counts[t.key]})</span>
            )}
          </button>
        ))}
      </div>

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-green-200 p-5">
        {filtered.length > 0 ? (
          <DataTable columns={columns} data={filtered} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="text-sm">No {tab !== 'all' ? tab : ''} events available</p>
          </div>
        )}
      </div>
    </div>
  );
}






