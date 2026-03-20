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
            <h2 className="text-xl font-bold text-gray-900">{event ? event.event_name : 'Event Details'}</h2>
            <p className="text-sm text-gray-500">Event Profile</p>
          </div>
          {event && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-xl hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400">Loading...</div>
        ) : event ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Event details */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Details</h3>
                <dl className="space-y-2 text-sm">
                  <div><dt className="text-gray-500">Date</dt><dd className="font-medium">{event.event_date}</dd></div>
                  <div><dt className="text-gray-500">Time</dt><dd className="font-medium">{event.start_time} – {event.end_time}</dd></div>
                  <div><dt className="text-gray-500">Venue</dt><dd className="font-medium">{event.venue}</dd></div>
                  <div>
                    <dt className="text-gray-500">Status</dt>
                    <dd>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[event.status]}`}>{event.status}</span>
                    </dd>
                  </div>
                  {event.description && <div><dt className="text-gray-500">Description</dt><dd>{event.description}</dd></div>}
                  <div><dt className="text-gray-500">Organizer</dt><dd className="font-medium">{event.organizer?.name}</dd></div>
                </dl>
              </div>

              {/* Attendance summary */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Attendance Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-gray-900 text-lg">{attendanceCounts?.total}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-gray-600">Present</span>
                    <span className="font-bold text-green-600 text-lg">{attendanceCounts?.present}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Late</span>
                    <span className="font-bold text-yellow-600 text-lg">{attendanceCounts?.late}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendees */}
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Attendees</h3>
            <div className="rounded-xl border border-green-200 overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Student ID</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Name</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Check-in Time</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-100">
                  {event.attendances?.map(a => (
                    <tr key={a.id} className="hover:bg-green-50">
                      <td className="px-3 py-2">{a.student?.student_id}</td>
                      <td className="px-3 py-2">{a.student?.first_name} {a.student?.last_name}</td>
                      <td className="px-3 py-2">{new Date(a.check_in_time).toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${a.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 capitalize">{a.verification_method}</td>
                    </tr>
                  ))}
                  {!event.attendances?.length && (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-gray-400">No attendees yet.</td>
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
