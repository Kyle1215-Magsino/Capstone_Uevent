import { useState, useEffect } from 'react';
import Modal from './Modal';
import { getEvent } from '../api/eventApi';

export default function EventViewModal({ eventId, open, onClose, onEdit }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && eventId) {
      setLoading(true);
      setData(null);
      getEvent(eventId).then(res => setData(res.data)).finally(() => setLoading(false));
    }
  }, [open, eventId]);

  const statusColors = {
    upcoming: 'bg-green-100 text-green-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const event = data?.event;
  const attendanceCounts = data?.attendanceCounts;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{event ? event.event_name : 'Event Details'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Event Profile</p>
          </div>
          {event && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-500">Loading...</div>
        ) : event ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Event details */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Details</h3>
                <dl className="space-y-2 text-sm">
                  <div><dt className="text-gray-500 dark:text-gray-400">Date</dt><dd className="font-medium text-gray-900 dark:text-gray-100">{event.event_date}</dd></div>
                  <div><dt className="text-gray-500 dark:text-gray-400">Time</dt><dd className="font-medium text-gray-900 dark:text-gray-100">{event.start_time} – {event.end_time}</dd></div>
                  <div><dt className="text-gray-500 dark:text-gray-400">Venue</dt><dd className="font-medium text-gray-900 dark:text-gray-100">{event.venue}</dd></div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                    <dd>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[event.status]}`}>{event.status}</span>
                    </dd>
                  </div>
                  {event.description && <div><dt className="text-gray-500 dark:text-gray-400">Description</dt><dd className="text-gray-900 dark:text-gray-100">{event.description}</dd></div>}
                  <div><dt className="text-gray-500 dark:text-gray-400">Organizer</dt><dd className="font-medium text-gray-900 dark:text-gray-100">{event.organizer?.name}</dd></div>
                </dl>
              </div>

              {/* Attendance summary */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Attendance Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-800">
                    <span className="text-gray-600 dark:text-gray-400">Total</span>
                    <span className="font-bold text-gray-900 dark:text-white text-lg">{attendanceCounts?.total}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-800">
                    <span className="text-gray-600 dark:text-gray-400">Present</span>
                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">{attendanceCounts?.present}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-400">Late</span>
                    <span className="font-bold text-yellow-600 dark:text-yellow-400 text-lg">{attendanceCounts?.late}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendees */}
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Attendees</h3>
            <div className="rounded-xl border border-green-200 dark:border-green-800 overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-green-50 dark:bg-green-900/20">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Student ID</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Name</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Check-in Time</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-100 dark:divide-green-800">
                  {event.attendances?.map(a => (
                    <tr key={a.id} className="hover:bg-green-50 dark:hover:bg-green-900/10">
                      <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{a.student?.student_id}</td>
                      <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{a.student?.first_name} {a.student?.last_name}</td>
                      <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{new Date(a.check_in_time).toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${a.status === 'present' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 capitalize text-gray-900 dark:text-gray-100">{a.verification_method}</td>
                    </tr>
                  ))}
                  {!event.attendances?.length && (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-gray-400 dark:text-gray-500">No attendees yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}
