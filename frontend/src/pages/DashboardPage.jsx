import { useState, useEffect } from 'react';
import { getDashboard } from '../api/authApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid, Area, AreaChart } from 'recharts';

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
import LoadingSpinner from '../components/LoadingSpinner';

const statCardConfig = [
  { key: 'totalStudents', label: 'Total Students', iconBg: 'bg-green-100', iconColor: 'text-green-600', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  )},
  { key: 'totalEvents', label: 'Total Events', iconBg: 'bg-green-100', iconColor: 'text-green-700', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  )},
  { key: 'totalAttendance', label: 'Total Attendance', iconBg: 'bg-green-100', iconColor: 'text-green-600', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
  )},
  { key: 'ongoingEvents', label: 'Ongoing Events', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
  { key: 'upcomingEvents', label: 'Upcoming Events', iconBg: 'bg-green-50', iconColor: 'text-green-500', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then(res => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <p className="text-gray-500">Failed to load dashboard.</p>;

  const monthlyChart = data.chartLabels.map((label, i) => ({
    month: label,
    Present: data.chartValues[i],
    Late: data.chartLateValues[i],
  }));

  const dailyChart = data.dailyLabels.map((label, i) => ({
    day: label,
    Attendance: data.dailyValues[i],
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of attendance and event activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCardConfig.map((card, i) => (
          <div key={card.key} style={{ animationDelay: `${i * 0.07}s` }} className="animate-staggerIn bg-white rounded-xl p-5 shadow-sm border border-green-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className={`${card.iconBg} ${card.iconColor} rounded-lg p-2.5`}>{card.icon}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{data[card.key]}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-green-300">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Attendance</h3>
          <div key={monthlyChart.length} style={{ width: '100%', minHeight: 260 }}>
          <ResponsiveContainer width="100%" height={260} debounce={50}>
            <BarChart data={monthlyChart} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barCategoryGap="30%" maxBarSize={32}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#dcfce7" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f0fdf4' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="Present" fill="#22C55E" radius={[4, 4, 0, 0]} isAnimationActive animationBegin={0} animationDuration={600} animationEasing="ease-out" />
              <Bar dataKey="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} isAnimationActive animationBegin={100} animationDuration={600} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-green-300">
          <h3 className="font-semibold text-gray-900 mb-4">Daily Attendance (This Month)</h3>
          <div key={dailyChart.length} style={{ width: '100%', minHeight: 260 }}>
          <ResponsiveContainer width="100%" height={260} debounce={50}>
            <AreaChart data={dailyChart} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#dcfce7" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#86efac', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="Attendance" stroke="#22C55E" strokeWidth={2.5} fill="url(#attendanceGrad)" dot={{ r: 3, fill: '#22C55E', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#22C55E', stroke: '#fff', strokeWidth: 2 }} isAnimationActive animationBegin={0} animationDuration={700} animationEasing="ease-out" />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Attendance & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-green-300">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Attendance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-green-300">
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentAttendance.map(a => (
                  <tr key={a.id} className="hover:bg-green-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">{a.student?.first_name} {a.student?.last_name}</td>
                    <td className="px-3 py-2.5 text-gray-600">{a.event?.event_name}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${a.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{new Date(a.check_in_time).toLocaleString()}</td>
                  </tr>
                ))}
                {data.recentAttendance.length === 0 && (
                  <tr><td colSpan={4} className="px-3 py-8 text-center text-gray-400">No attendance records yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-green-300">
          <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {data.upcomingEventsList.map(e => (
              <div key={e.id} className="flex items-center gap-4 p-3 rounded-lg border border-green-300 hover:bg-green-50 transition">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{e.event_name}</p>
                  <p className="text-xs text-gray-500">{new Date(e.event_date).toLocaleDateString()} &middot; {e.venue}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">upcoming</span>
              </div>
            ))}
            {data.upcomingEventsList.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No upcoming events.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}






