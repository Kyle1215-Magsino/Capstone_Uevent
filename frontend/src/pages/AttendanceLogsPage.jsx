import { useState, useEffect } from 'react';
import { getAttendanceLogs } from '../api/attendanceApi';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AttendanceLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('');

  useEffect(() => {
    getAttendanceLogs().then(res => setLogs(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const courses = [...new Set(logs.map(r => r.student?.course).filter(Boolean))].sort();

  const filteredLogs = courseFilter
    ? logs.filter(r => r.student?.course === courseFilter)
    : logs;

  const columns = [
    { key: 'student_id', label: 'Student ID', accessor: row => row.student?.student_id },
    { key: 'student_name', label: 'Student Name', accessor: row => `${row.student?.first_name} ${row.student?.last_name}` },
    { key: 'course', label: 'Course', accessor: row => row.student?.course },
    { key: 'event_name', label: 'Event', accessor: row => row.event?.event_name },
    { key: 'check_in_time', label: 'Check-in Time', accessor: row => new Date(row.check_in_time).toLocaleString() },
    { key: 'status', label: 'Status', render: row => (
      <span className={`px-2 py-1 rounded text-xs ${row.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {row.status}
      </span>
    )},
    { key: 'method', label: 'Method', accessor: row => row.verification_method, render: row => (
      <span className="capitalize">{row.verification_method}</span>
    )},
    { key: 'location', label: 'Location Verified', render: row => (
      row.location_verified ? <span className="text-green-600">Yes</span> : <span className="text-gray-400">No</span>
    )},
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Logs</h1>
        <p className="text-sm text-gray-500 mt-1">Complete attendance history</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-green-300 p-5">
        {/* Course filter */}
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by Course:</label>
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="px-3 py-2 border border-green-300 rounded-xl bg-gray-50 text-sm text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {courseFilter && (
            <button onClick={() => setCourseFilter('')} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              Clear
            </button>
          )}
        </div>
        <DataTable columns={columns} data={filteredLogs} />
      </div>
    </div>
  );
}






