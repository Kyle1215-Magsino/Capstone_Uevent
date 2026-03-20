import { useState, useEffect, useMemo } from 'react';
import { getStudentAttendance } from '../api/authApi';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';

export default function StudentAttendancePage() {
  const [records, setRecords] = useState([]);
  const [absentEvents, setAbsentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    getStudentAttendance().then(res => {
      setRecords(res.data.records || []);
      setAbsentEvents(res.data.absentEvents || []);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (tab === 'all') return records;
    if (tab === 'absent') return absentEvents;
    return records.filter(r => r.status === tab);
  }, [records, absentEvents, tab]);

  const counts = useMemo(() => ({
    all: records.length,
    present: records.filter(r => r.status === 'present').length,
    late: records.filter(r => r.status === 'late').length,
    absent: absentEvents.length,
  }), [records, absentEvents]);

  const exportCSV = () => {
    const rows = tab === 'absent'
      ? absentEvents.map(e => [e.event_name, e.event_date, `${e.start_time}-${e.end_time}`, e.venue, 'Absent', '', ''])
      : filtered.map(r => [r.event?.event_name, r.event?.event_date, `${r.event?.start_time}-${r.event?.end_time}`, r.event?.venue, r.status, new Date(r.check_in_time).toLocaleString(), r.verification_method]);
    const header = ['Event', 'Date', 'Time', 'Venue', 'Status', 'Check-in Time', 'Method'];
    const csv = [header, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'my-attendance.csv';
    a.click();
  };

  if (loading) return <LoadingSpinner />;

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'present', label: 'Present' },
    { key: 'late', label: 'Late' },
    { key: 'absent', label: 'Absent' },
  ];

  const columns = [
    { key: 'event', label: 'Event', accessor: row => row.event?.event_name },
    { key: 'date', label: 'Date', accessor: row => row.event?.event_date },
    { key: 'venue', label: 'Venue', accessor: row => row.event?.venue },
    { key: 'event_time', label: 'Event Time', accessor: row => row.event ? `${row.event.start_time} - ${row.event.end_time}` : '' },
    { key: 'check_in', label: 'Check-in Time', accessor: row => new Date(row.check_in_time).toLocaleString() },
    { key: 'status', label: 'Status', render: row => (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        row.status === 'present'
          ? 'bg-green-100 text-green-700'
          : row.status === 'late'
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-gray-100 text-gray-600'
      }`}>
        {row.status === 'present' && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        )}
        {row.status === 'late' && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
        )}
        <span className="capitalize">{row.status}</span>
      </span>
    )},
    { key: 'method', label: 'Verification', render: row => (
      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
        {row.verification_method === 'face' && (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        )}
        {row.verification_method === 'rfid' && (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        )}
        {row.verification_method === 'manual' && (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        )}
        <span className="capitalize">{row.verification_method}</span>
      </span>
    )},
  ];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
          </div>
          <p className="text-sm text-gray-400 ml-8">Track your event attendance history</p>
        </div>
        <button onClick={exportCSV}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-medium hover:bg-green-100 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.key
                ? t.key === 'absent' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
            {counts[t.key] > 0 && (
              <span className={`ml-1.5 text-xs ${tab === t.key ? 'text-white/70' : 'text-gray-400'}`}>({counts[t.key]})</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-green-200 p-5">
        {tab === 'absent' ? (
          absentEvents.length > 0 ? (
            <div className="space-y-2">
              {absentEvents.map(e => (
                <div key={e.id} className="flex items-center justify-between px-4 py-3 border border-red-100 rounded-xl bg-red-50/50">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{e.event_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{e.event_date} &bull; {e.start_time}–{e.end_time} &bull; {e.venue}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">Absent</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <svg className="w-10 h-10 mb-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm font-medium text-gray-500">No absences!</p>
              <p className="text-xs text-gray-400 mt-1">You attended all completed events.</p>
            </div>
          )
        ) : (
          <DataTable columns={columns} data={filtered} />
        )}
      </div>
    </div>
  );
}






