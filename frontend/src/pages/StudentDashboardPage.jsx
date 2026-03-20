import { useState, useEffect } from 'react';
import { getStudentDashboard } from '../api/authApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-green-200 rounded-xl px-4 py-2.5 shadow-lg text-sm">
      {label && <p className="font-semibold text-gray-700 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function StudentDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentDashboard().then(res => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <p className="text-lg font-medium">Failed to load dashboard</p>
      <p className="text-sm mt-1">Please try refreshing the page.</p>
    </div>
  );

  const chartData = data.chartLabels.map((label, i) => ({
    month: label,
    Present: data.chartPresent[i],
    Late: data.chartLate[i],
  }));

  const attendanceRate = data.totalEvents > 0
    ? Math.round((data.attendedEvents / data.totalEvents) * 100)
    : 0;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const recentCheckins = (data.attendanceRecords || [])
    .sort((a, b) => new Date(b.check_in_time) - new Date(a.check_in_time))
    .slice(0, 5);

  // Ring helpers
  const ringRadius = 36;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc - (attendanceRate / 100) * ringCirc;

  const methodBreakdown = data.methodBreakdown || { face: 0, rfid: 0, manual: 0 };
  const streak = data.streak || 0;
  const nextEvent = data.nextEvent || null;

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-1">
          {data.student?.profile_image ? (
            <img src={`/storage/${data.student.profile_image}`} alt="Profile" className="w-12 h-12 rounded-full object-cover shadow-md shadow-green-200" />
          ) : (
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md shadow-green-200">
              {data.student?.first_name?.charAt(0)}{data.student?.last_name?.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{greeting}, {data.student?.first_name}!</h1>
            <p className="text-sm text-gray-400">{today}</p>
          </div>
        </div>
      </div>

      {/* Next Event Reminder Banner */}
      {nextEvent && (
        <div className="mb-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 shadow-md shadow-green-200 flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-medium mb-0.5">Next Upcoming Event</p>
            <p className="text-white font-semibold truncate">{nextEvent.event_name}</p>
            <p className="text-white/70 text-xs mt-0.5">{nextEvent.event_date} &bull; {nextEvent.start_time}–{nextEvent.end_time} &bull; {nextEvent.venue}</p>
          </div>
          <span className="flex-shrink-0 px-2.5 py-1 bg-white/20 text-white text-xs font-medium rounded-full border border-white/30">Upcoming</span>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Events Attended', value: data.attendedEvents, iconBg: 'bg-green-100', iconColor: 'text-green-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
          { label: 'Present', value: data.totalPresent, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
          { label: 'Late', value: data.totalLate, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
          { label: 'Attendance Streak', value: `${streak} event${streak !== 1 ? 's' : ''}`, iconBg: 'bg-orange-100', iconColor: 'text-orange-500', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg> },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl p-5 shadow-sm border border-green-200 hover:shadow-md hover:border-green-300 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${c.iconBg} ${c.iconColor} rounded-lg flex items-center justify-center`}>{c.icon}</div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{c.value}</p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Attendance Rate Ring + Method Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Ring */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-green-200 flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg width="96" height="96" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r={ringRadius} fill="none" stroke="#dcfce7" strokeWidth="8" />
              <circle cx="48" cy="48" r={ringRadius} fill="none" stroke="#16a34a" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={ringCirc}
                strokeDashoffset={ringOffset}
                transform="rotate(-90 48 48)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-extrabold text-gray-900">{attendanceRate}%</span>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Attendance Rate</p>
            <p className="text-sm text-gray-500">{data.attendedEvents} of {data.totalEvents} events attended</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-400">Present: {data.totalPresent}</span>
              <span className="w-2 h-2 rounded-full bg-yellow-400 ml-2" />
              <span className="text-xs text-gray-400">Late: {data.totalLate}</span>
            </div>
          </div>
        </div>
        {/* Method Breakdown */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-green-200">
          <p className="font-semibold text-gray-900 mb-3">Check-in Methods</p>
          <div className="space-y-2.5">
            {[
              { label: 'Face Recognition', key: 'face', color: 'bg-green-500', textColor: 'text-green-600', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
              { label: 'RFID', key: 'rfid', color: 'bg-blue-500', textColor: 'text-blue-600', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
              { label: 'Manual', key: 'manual', color: 'bg-gray-400', textColor: 'text-gray-500', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> },
            ].map(m => {
              const total = data.attendedEvents || 1;
              const pct = Math.round((methodBreakdown[m.key] / total) * 100);
              return (
                <div key={m.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${m.textColor}`}>{m.icon}{m.label}</span>
                    <span className="text-xs text-gray-500">{methodBreakdown[m.key]} times</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full`} style={{ width: `${pct}%`, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <h3 className="font-semibold text-gray-900">Monthly Attendance</h3>
          </div>
          {chartData.length > 0 ? (
            <div key={chartData.length} style={{ width: '100%', minHeight: 260 }}>
              <ResponsiveContainer width="100%" height={260} debounce={50}>
                <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barCategoryGap="30%" maxBarSize={32}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#dcfce7" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f0fdf4' }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} isAnimationActive animationBegin={0} animationDuration={600} animationEasing="ease-out" />
                  <Bar dataKey="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} isAnimationActive animationBegin={100} animationDuration={600} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[260px] text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <p className="text-sm">No attendance data yet</p>
            </div>
          )}
        </div>

        {/* Student Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
          <div className="bg-gradient-to-br from-green-500 to-green-600 px-6 py-5 text-center">
            {data.student?.profile_image ? (
              <img src={`/storage/${data.student.profile_image}`} alt="Profile" className="w-16 h-16 rounded-full object-cover mx-auto mb-2 ring-2 ring-white/30" />
            ) : (
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-2 ring-2 ring-white/30">
                {data.student?.first_name?.charAt(0)}{data.student?.last_name?.charAt(0)}
              </div>
            )}
            <p className="text-white font-semibold">{data.student?.first_name} {data.student?.last_name}</p>
            <p className="text-green-100 text-xs mt-0.5">{data.student?.course} - Year {data.student?.year_level}</p>
          </div>
          <div className="p-5">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" /></svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Student ID</p>
                  <p className="font-medium text-gray-800">{data.student?.student_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="font-medium text-gray-800 truncate">{data.student?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Course</p>
                  <p className="font-medium text-gray-800">{data.student?.course}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Year Level</p>
                  <p className="font-medium text-gray-800">Year {data.student?.year_level}</p>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-green-200 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="font-semibold text-gray-900">Recent Check-ins</h3>
        </div>
        {recentCheckins.length > 0 ? (
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-[15px] w-0.5 bg-green-100" />
            <div className="space-y-4">
              {recentCheckins.map((rec, idx) => (
                <div key={rec.id || idx} className="flex items-start gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    rec.status === 'present' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {rec.status === 'present' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{rec.event?.event_name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className={`text-xs font-medium capitalize ${rec.status === 'present' ? 'text-green-600' : 'text-yellow-600'}`}>{rec.status}</span>
                      <span className="text-xs text-gray-400">{new Date(rec.check_in_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {new Date(rec.check_in_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      <span className="text-xs text-gray-400 capitalize">{rec.verification_method}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm">No check-ins yet</p>
          </div>
        )}
      </div>

      {/* Upcoming events */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
          </div>
          {data.upcomingEvents.length > 0 && (
            <span className="text-xs text-gray-400">{data.upcomingEvents.length} event{data.upcomingEvents.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="space-y-3">
          {data.upcomingEvents.map(e => (
            <div key={e.id} className="border border-green-100 rounded-xl p-4 flex justify-between items-center hover:bg-green-50/50 hover:border-green-200 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{e.event_name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {e.event_date}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {e.venue}
                    </span>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">{e.status}</span>
            </div>
          ))}
          {data.upcomingEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-sm">No upcoming events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



