import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const STORAGE_KEY = 'notif_read_ids';

function getReadIds() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveReadIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NotificationBell() {
  const { role } = useAuth();
  const [events, setEvents] = useState([]);
  const [readIds, setReadIds] = useState(getReadIds);
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const ref = useRef(null);

  useEffect(() => {
    if (!role) return;
    const endpoint = role === 'student' ? '/student-events' : '/events';
    api.get(endpoint)
      .then(res => {
        const raw = res.data;
        // /student-events returns a plain array; /events returns paginated { data: [...] }
        const list = Array.isArray(raw) ? raw : (raw?.data || raw?.events || []);
        const upcoming = list.filter(e => e.status === 'upcoming' || e.status === 'ongoing');
        setEvents(upcoming);
      })
      .catch(() => {});
  }, [role]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = events.filter(e => !readIds.includes(e.id));
  const unreadCount = unread.length;

  const handleOpen = () => {
    setOpen(v => !v);
  };

  const markAllRead = () => {
    const ids = [...new Set([...readIds, ...events.map(e => e.id)])];
    setReadIds(ids);
    saveReadIds(ids);
  };

  const markOne = (id) => {
    const ids = [...new Set([...readIds, id])];
    setReadIds(ids);
    saveReadIds(ids);
  };

  const statusColor = {
    upcoming: 'bg-blue-100 text-blue-600',
    ongoing: 'bg-green-100 text-green-600',
  };

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scaleIn">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-modal-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-800">Notifications</p>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">{unreadCount} new</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors">
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="divide-y divide-gray-50">
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm">No upcoming events</p>
              </div>
            ) : (
              events.slice(0, visibleCount).map(evt => {
                const isRead = readIds.includes(evt.id);
                return (
                  <div
                    key={evt.id}
                    onClick={() => markOne(evt.id)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${isRead ? 'bg-white hover:bg-gray-50' : 'bg-green-50/60 hover:bg-green-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${evt.status === 'ongoing' ? 'bg-green-100' : 'bg-blue-50'}`}>
                      <svg className={`w-4 h-4 ${evt.status === 'ongoing' ? 'text-green-600' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${isRead ? 'text-gray-600 font-normal' : 'text-gray-800 font-semibold'}`}>{evt.event_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(evt.event_date)} &bull; {evt.venue}</p>
                      <span className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${statusColor[evt.status] || 'bg-gray-100 text-gray-500'}`}>
                        {evt.status}
                      </span>
                    </div>
                    {!isRead && <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-2" />}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {events.length > 0 && visibleCount < events.length && (
            <div className="px-4 py-2.5 border-t border-gray-100 text-center">
              <button
                onClick={() => setVisibleCount(v => v + 5)}
                className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Show more
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
