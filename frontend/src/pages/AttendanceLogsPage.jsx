import { useState, useEffect } from 'react';
import { getAttendanceLogs } from '../api/attendanceApi';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';

function exportCSV(rows) {
  const headers = ['Student ID', 'Student Name', 'Course', 'Event', 'Check-in Time', 'Status', 'Method', 'Location Verified'];
  const lines = rows.map(r => [
    r.student?.student_id ?? '',
    `${r.student?.first_name ?? ''} ${r.student?.last_name ?? ''}`.trim(),
    r.student?.course ?? '',
    r.event?.event_name ?? '',
    new Date(r.check_in_time).toLocaleString(),
    r.status,
    r.verification_method,
    r.location_verified ? 'Yes' : 'No',
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'attendance_logs.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function AttendanceLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    getAttendanceLogs()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setLogs(data);
      })
      .catch(err => {
        console.error('Error fetching attendance logs:', err);
        setLogs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const logsArray = Array.isArray(logs) ? logs : [];
  const courses = [...new Set(logsArray.map(r => r.student?.course).filter(Boolean))].sort();

  const filteredLogs = logsArray.filter(r => {
    if (courseFilter && r.student?.course !== courseFilter) return false;
    if (statusFilter && r.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    { key: 'student_id', label: 'Student ID', accessor: row => row.student?.student_id },
    { key: 'student_name', label: 'Student Name', accessor: row => `${row.student?.first_name} ${row.student?.last_name}` },
    { key: 'course', label: 'Course', accessor: row => row.student?.course },
    { key: 'event_name', label: 'Event', accessor: row => row.event?.event_name },
    { key: 'check_in_time', label: 'Check-in Time', accessor: row => new Date(row.check_in_time).toLocaleString() },
    { key: 'status', label: 'Status', render: row => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'present' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'}`}>
        {row.status}
      </span>
    )},
    { key: 'method', label: 'Method', accessor: row => row.verification_method, render: row => (
      <span className="capitalize text-gray-900 dark:text-gray-100">{row.verification_method}</span>
    )},
    { key: 'location', label: 'Location Verified', render: row => (
      row.location_verified ? <span className="text-green-600 dark:text-green-400 font-medium">Yes</span> : <span className="text-gray-400 dark:text-gray-500">No</span>
    )},
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Logs</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete attendance history</p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-green-300 dark:border-gray-800 p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="px-3 py-2 border border-green-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-400 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-green-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-400 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
          </select>
          {(courseFilter || statusFilter) && (
            <button
              onClick={() => { setCourseFilter(''); setStatusFilter(''); }}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              Clear filters
            </button>
          )}
          <div className="ml-auto">
            <button
              onClick={() => exportCSV(filteredLogs)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export CSV
            </button>
          </div>
        </div>
        <DataTable columns={columns} data={filteredLogs} />
      </div>
    </div>
  );
}






