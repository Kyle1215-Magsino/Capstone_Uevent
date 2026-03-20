import { useState, useEffect } from 'react';
import Modal from './Modal';
import { getStudent } from '../api/studentApi';

export default function StudentViewModal({ studentId, open, onClose, onEdit }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && studentId) {
      setLoading(true);
      setStudent(null);
      getStudent(studentId).then(res => setStudent(res.data)).finally(() => setLoading(false));
    }
  }, [open, studentId]);

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {student ? `${student.first_name} ${student.last_name}` : 'Student Profile'}
            </h2>
            <p className="text-sm text-gray-500">Student Details</p>
          </div>
          {student && (
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
        ) : student ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info card */}
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Info</h3>
              <dl className="space-y-2 text-sm">
                <div><dt className="text-gray-500">Student ID</dt><dd className="font-medium">{student.student_id}</dd></div>
                <div><dt className="text-gray-500">Email</dt><dd className="font-medium break-all">{student.email}</dd></div>
                <div><dt className="text-gray-500">Course</dt><dd className="font-medium">{student.course}</dd></div>
                <div><dt className="text-gray-500">Year Level</dt><dd className="font-medium">{student.year_level}</dd></div>
                <div><dt className="text-gray-500">RFID Tag</dt><dd className="font-medium">{student.rfid_tag || 'N/A'}</dd></div>
                <div>
                  <dt className="text-gray-500">Status</dt>
                  <dd>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {student.status}
                    </span>
                  </dd>
                </div>
                <div><dt className="text-gray-500">Face Enrolled</dt><dd className="font-medium">{student.face_data ? 'Yes' : 'No'}</dd></div>
              </dl>
            </div>

            {/* Attendance table */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Attendance History</h3>
              <div className="rounded-xl border border-green-200 overflow-hidden">
                <table className="min-w-full text-sm">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Event</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Date</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-100">
                    {student.attendances?.map(a => (
                      <tr key={a.id} className="hover:bg-green-50">
                        <td className="px-3 py-2">{a.event?.event_name}</td>
                        <td className="px-3 py-2">{new Date(a.check_in_time).toLocaleString()}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${a.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 capitalize">{a.verification_method}</td>
                      </tr>
                    ))}
                    {!student.attendances?.length && (
                      <tr>
                        <td colSpan={4} className="px-3 py-8 text-center text-gray-400">No attendance records.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
