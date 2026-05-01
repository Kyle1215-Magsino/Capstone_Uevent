import { useState, useEffect } from 'react';
import LoginModal from '../components/LoginModal';
import StudentRegisterModal from '../components/StudentRegisterModal';
import { getPublicAnnouncements } from '../api/announcementApi';

const FALLBACK_ANNOUNCEMENTS = [
  { id: 1, tag: 'Event',    text: 'Campus Leadership Summit — April 5, 2026 at the Main Gymnasium. All students are encouraged to attend!' },
  { id: 2, tag: 'Reminder', text: 'Face enrollment is now open. Visit the Face Enrollment page to register your biometric data.' },
  { id: 3, tag: 'Info',     text: "RFID cards are available at the Registrar's Office. Present your student ID to claim yours." },
  { id: 4, tag: 'Event',    text: 'General Assembly on April 12, 2026 — attendance is mandatory for all enrolled students.' },
  { id: 5, tag: 'Update',   text: 'U-EventTrack v2 is live! Enjoy faster check-ins, GPS verification, and real-time dashboards.' },
];

const TAG_COLORS = {
  Event:    'bg-green-400/20 text-green-200',
  Reminder: 'bg-yellow-400/20 text-yellow-200',
  Info:     'bg-blue-400/20 text-blue-200',
  Update:   'bg-emerald-400/20 text-emerald-200',
  Alert:    'bg-red-400/20 text-red-200',
};

const features = [
  {
    title: 'Multi-Method Check-In',
    description: 'RFID scanning, facial recognition, and manual entry for flexible attendance tracking.',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: 'from-green-500 to-emerald-600',
    light: 'bg-green-50 text-green-600',
  },
  {
    title: 'Real-Time Monitoring',
    description: 'Live attendance dashboard with instant updates during events for officers and admins.',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    color: 'from-blue-500 to-cyan-500',
    light: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'GPS Verification',
    description: 'Location-based validation ensures students are physically present at the event venue.',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    color: 'from-orange-400 to-rose-500',
    light: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'Analytics & Reports',
    description: 'Comprehensive reports with charts and graphs for attendance patterns and statistics.',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    color: 'from-violet-500 to-purple-600',
    light: 'bg-violet-50 text-violet-600',
  },
];

const stats = [
  { value: '3+',   label: 'Check-in Methods',  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { value: '100%', label: 'Digital Records',   icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
  { value: 'Live', label: 'Real-Time Updates', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  { value: 'GPS',  label: 'Location Verified', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
];

const steps = [
  { step: '01', title: 'Officers Create Events', desc: 'Set up events with location, schedule, and attendance requirements in seconds.', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  { step: '02', title: 'Students Check In',      desc: 'RFID scan, face recognition, or manual entry — verified by GPS at the venue.',  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
  { step: '03', title: 'View Reports',           desc: 'Real-time dashboards and exportable reports give full visibility into attendance.', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
];

const roles = [
  { role: 'Admin',   color: 'border-purple-200 bg-purple-50', badge: 'bg-purple-100 text-purple-700', perks: ['Full system access', 'Manage officers & students', 'View audit logs', 'Control announcements'] },
  { role: 'Officer', color: 'border-blue-200 bg-blue-50',     badge: 'bg-blue-100 text-blue-700',     perks: ['Create & manage events', 'Run check-in sessions', 'View attendance logs', 'Export reports'] },
  { role: 'Student', color: 'border-green-200 bg-green-50',   badge: 'bg-green-100 text-green-700',   perks: ['View enrolled events', 'Check personal attendance', 'Face & RFID check-in', 'Track your streak'] },
];

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [announcements, setAnnouncements] = useState(FALLBACK_ANNOUNCEMENTS);
  const [annIdx, setAnnIdx] = useState(0);
  const [annVisible, setAnnVisible] = useState(true);

  useEffect(() => {
    getPublicAnnouncements()
      .then(res => { if (res.data?.length) setAnnouncements(res.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setAnnVisible(false);
      setTimeout(() => {
        setAnnIdx(i => (i + 1) % announcements.length);
        setAnnVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements]);

  const current = announcements[annIdx];
  const openLogin = () => { setRegisterOpen(false); setLoginOpen(true); };
  const openRegister = () => { setLoginOpen(false); setRegisterOpen(true); };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-[Inter,system-ui,sans-serif]">

      <style>{`
        @keyframes annSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes annSlideOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        .hero-float { animation: heroFloat 6s ease-in-out infinite; }
      `}</style>

      {/* ── Navbar ──────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-100/80 dark:border-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm shadow-green-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white text-base tracking-tight leading-none">U-EventTrack</span>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-0.5">MinSU Bongabong</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openLogin} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
              Sign In
            </button>
            <button onClick={openRegister} className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-semibold hover:from-green-600 hover:to-emerald-700 transition shadow-sm shadow-green-500/30">
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* ── Announcement Ticker ─────────────────────────── */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 border-b border-green-500/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-4">
          <span className="flex-shrink-0 flex items-center gap-2 text-green-100 text-sm font-bold uppercase tracking-widest">
            <span className="w-2.5 h-2.5 bg-yellow-300 rounded-full animate-pulse" />
            Live
          </span>
          <span className="w-px h-6 bg-white/20 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <div
              key={annIdx}
              style={{ animation: annVisible ? 'annSlideIn 0.4s ease forwards' : 'annSlideOut 0.3s ease forwards' }}
              className="flex items-center gap-3"
            >
              <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${TAG_COLORS[current.tag] ?? 'bg-white/10 text-white'}`}>
                {current.tag}
              </span>
              <p className="text-white/95 text-sm sm:text-base font-medium truncate">{current.text}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {announcements.map((_, i) => (
              <button
                key={i}
                onClick={() => { setAnnIdx(i); setAnnVisible(true); }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${i === annIdx ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 min-h-[88vh] flex items-center">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.5] dark:opacity-[0.2]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,128,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,128,0,0.04) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full text-green-700 dark:text-green-300 text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
                Mindoro State University — Bongabong Campus
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.08] mb-5 tracking-tight">
                Smart<br />
                <span className="bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">Attendance</span><br />
                for USG Events
              </h1>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
                Streamline event attendance with RFID, facial recognition, and GPS-based check-in — all tracked in real time.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button onClick={openLogin}
                  className="px-7 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition shadow-xl shadow-green-500/30 text-sm flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                  Sign In
                </button>
                <button onClick={openRegister}
                  className="px-7 py-3.5 bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 rounded-xl font-semibold border border-green-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-700 hover:border-green-300 dark:hover:border-gray-600 transition text-sm flex items-center justify-center gap-2 shadow-sm">
                  Register as Student
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
              {/* Inline trust badges */}
              <div className="flex flex-wrap gap-4">
                {['RFID Scan', 'Face ID', 'GPS Verified', 'Live Dashboard'].map(b => (
                  <span key={b} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <svg className="w-3.5 h-3.5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — USG Logo */}
            <div className="hidden lg:flex justify-center items-center">
              <div>
                <img
                  src="/usg-logo.png"
                  alt="USG Logo"
                  className="w-96 h-96 object-cover rounded-full drop-shadow-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats Strip ─────────────────────────────────── */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(s => (
              <div key={s.label} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-4 backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white leading-none">{s.value}</p>
                  <p className="text-green-100/70 text-xs mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3.5 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Everything You Need</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
              Modern tools designed for efficient, campus-wide USG event attendance management.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={f.title} className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                {/* subtle gradient top border */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className={`w-12 h-12 ${f.light} dark:bg-opacity-20 rounded-xl flex items-center justify-center mb-5`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-950 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3.5 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Three Simple Steps</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
              From event setup to detailed attendance reports in minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[33%] w-[34%] h-px bg-gradient-to-r from-green-300 to-green-200 dark:from-green-800 dark:to-green-900" />
            {steps.map((s, i) => (
              <div key={s.step} className="relative flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl flex flex-col items-center justify-center mb-5 shadow-xl shadow-green-500/25 group-hover:shadow-green-500/40 transition-shadow duration-300">
                  <div className="text-white/80 mb-1">{s.icon}</div>
                  <span className="text-[10px] font-black tracking-widest text-green-200">{s.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[13rem]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles Section ───────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3.5 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Access Levels</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Built for Every Role</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
              Tailored experiences for admins, officers, and students.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map(r => (
              <div key={r.role} className={`rounded-2xl p-6 border ${r.color} dark:bg-gray-800 dark:border-gray-700`}>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${r.badge}`}>{r.role}</span>
                <ul className="space-y-2.5">
                  {r.perks.map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 py-24">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/15 border border-white/20 rounded-full text-white text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Ready to go digital?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">Join U-EventTrack Today</h2>
          <p className="text-green-100 dark:text-green-50 mb-8 text-sm leading-relaxed max-w-md mx-auto">
            Join Mindoro State University's digital attendance system for USG events.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={openRegister}
              className="px-7 py-3.5 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition text-sm shadow-xl">
              Register as Student →
            </button>
            <button onClick={openLogin}
              className="px-7 py-3.5 bg-white/10 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition text-sm">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="bg-gray-950 dark:bg-black border-t border-white/5 dark:border-gray-900 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">U-EventTrack</p>
                <p className="text-gray-500 dark:text-gray-600 text-[11px] mt-0.5">MinSU Bongabong Campus</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-700 text-xs text-center">
              © {new Date().getFullYear()} Mindoro State University — Bongabong Campus. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-700">
              <span>RFID · Face ID · GPS</span>
            </div>
          </div>
        </div>
      </footer>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSwitchToRegister={openRegister} />
      <StudentRegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} onSwitchToLogin={openLogin} />
    </div>
  );

}
