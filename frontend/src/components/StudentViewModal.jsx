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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {student ? `${student.first_name} ${student.last_name}` : 'Student Profile'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Student Details</p>
          </div>
          {student && (
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
        ) : student ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info card */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Info</h3>
              <dl className="space-y-2 text-sm">
                <div><dt className="text-gray-500 dark:text-gray-400">Student ID</dt><dd className="font-medium text-gray-900 dark:text-gray-100">{student.student_id}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Email</dt><dd className="font-medium text-gray-900 dark:text-gray-100 break-all">{student.email}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Course</dt><dd className="font-medium text-gray-900 dark:text-gray-100">{student.course}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Year Level</dt><dd className="font-medium text-gray-900 dark:text-gray-100">{student.year_level}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">RFID Tag</dt><dd className="font-medium text-gray-900 dark:text-gray-100">{student.rfid_tag || 'N/A'}</dd></div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                  <dd>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${student.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                      {student.status}
                    </span>
                  </dd>
                </div>
                <div><dt className="text-gray-500 dark:text-gray-400">Face Enrolled</dt><dd className="font-medium text-gray-900 dark:text-gray-100">{student.face_data ? 'Yes' : 'No'}</dd></div>
              </dl>
            </div>

            {/* Attendance table */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Attendance History</h3>
              <div className="rounded-xl border border-green-200 dark:border-green-800 overflow-hidden">
                <table className="min-w-full text-sm">
                  <thead className="bg-green-50 dark:bg-green-900/20">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Event</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Date</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-100 dark:divide-green-800">
                    {student.attendances?.map(a => (
                      <tr key={a.id} className="hover:bg-green-50 dark:hover:bg-green-900/10">
                        <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{a.event?.event_name}</td>
                        <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{new Date(a.check_in_time).toLocaleString()}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${a.status === 'present' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 capitalize text-gray-900 dark:text-gray-100">{a.verification_method}</td>
                      </tr>
                    ))}
                    {!student.attendances?.length && (
                      <tr>
                        <td colSpan={4} className="px-3 py-8 text-center text-gray-400 dark:text-gray-500">No attendance records.</td>
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
