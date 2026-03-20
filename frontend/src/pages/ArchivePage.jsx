import { useState, useEffect } from 'react';
import { getArchivedStudents, restoreStudent } from '../api/studentApi';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';

export default function ArchivePage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [restoreId, setRestoreId] = useState(null);
  const [restoring, setRestoring] = useState(false);

  const fetchArchived = () => {
    setLoading(true);
    getArchivedStudents().then(res => setStudents(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchArchived(); }, []);

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await restoreStudent(restoreId);
      toast.success('Student restored successfully.');
      setRestoreId(null);
      fetchArchived();
    } catch {
      toast.error('Failed to restore student.');
    } finally {
      setRestoring(false);
    }
  };

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    return (
      s.student_id?.toLowerCase().includes(q) ||
      s.first_name?.toLowerCase().includes(q) ||
      s.last_name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.course?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Archive</h1>
          <p className="text-sm text-gray-500 mt-1">View and restore archived student records</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5">
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span className="text-sm font-medium text-orange-700">{students.length} archived</span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search archived students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-green-400 rounded-xl bg-white text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-green-300 overflow-hidden">
        {loading ? (
          <div className="py-16"><LoadingSpinner /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">
              {search ? 'No matching archived students.' : 'No archived students yet.'}
            </p>
            <p className="text-sm text-gray-400 mt-1">Archived students will appear here.</p>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-green-50 border-b border-green-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Student ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Year</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-orange-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.student_id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {s.first_name?.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-700">{s.last_name}, {s.first_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.email}</td>
                  <td className="px-4 py-3 text-gray-600">{s.course}</td>
                  <td className="px-4 py-3 text-gray-600">{s.year_level}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setRestoreId(s.id)}
                      title="Restore student"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-300 rounded-lg text-xs font-medium hover:bg-green-100 hover:border-green-400 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Restore confirmation modal */}
      <Modal open={!!restoreId} onClose={() => setRestoreId(null)} maxWidth="max-w-sm">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Restore Student?</h3>
          <p className="text-sm text-gray-500 mb-6">
            This will reactivate the student record and make them visible in the Students list again.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setRestoreId(null)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleRestore}
              disabled={restoring}
              className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm font-medium disabled:opacity-50"
            >
              {restoring ? 'Restoring...' : 'Restore'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
