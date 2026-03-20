import { useState } from 'react';
import LoginModal from '../components/LoginModal';
import StudentRegisterModal from '../components/StudentRegisterModal';

const features = [
  {
    title: 'Multi-Method Check-In',
    description: 'RFID scanning, facial recognition, and manual entry for flexible attendance tracking.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
  },
  {
    title: 'Real-Time Monitoring',
    description: 'Live attendance dashboard with instant updates during events for officers and admins.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
  },
  {
    title: 'GPS Verification',
    description: 'Location-based validation ensures students are physically present at the event venue.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
  },
  {
    title: 'Analytics & Reports',
    description: 'Comprehensive reports with charts and graphs for attendance patterns and statistics.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    ),
  },
];

const stats = [
  { value: '3+', label: 'Check-in Methods' },
  { value: '100%', label: 'Digital Records' },
  { value: 'Live', label: 'Real-Time Updates' },
  { value: 'GPS', label: 'Location Verified' },
];

const steps = [
  { step: '1', title: 'Officers Create Events', desc: 'Set up events with location, schedule, and attendance requirements in seconds.' },
  { step: '2', title: 'Students Check In', desc: 'RFID scan, face recognition, or manual entry — verified by GPS at the venue.' },
  { step: '3', title: 'View Reports', desc: 'Real-time dashboards and exportable reports give full visibility into attendance.' },
];

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const openLogin = () => { setRegisterOpen(false); setLoginOpen(true); };
  const openRegister = () => { setLoginOpen(false); setRegisterOpen(true); };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Sticky Navbar ─────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">U-EventTrack</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openLogin} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-green-700 transition rounded-lg">
              Sign In
            </button>
            <button onClick={openRegister} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition shadow-sm">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-gray-900">
        {/* Dot-grid overlay */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* Glow blobs */}
        <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-green-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-green-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28 flex flex-col items-center">

          {/* Copy */}
          <div className="text-center max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-green-200 text-xs font-medium border border-white/20 mb-6">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Mindoro State University — Bongabong Campus
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5">
              Smart Attendance<br />
              <span className="text-green-300">for USG Events</span>
            </h1>
            <p className="text-base sm:text-lg text-green-100/80 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Streamline event attendance with RFID, facial recognition, and GPS-based check-in — all tracked in real time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={openLogin}
                className="px-7 py-3.5 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition shadow-xl shadow-black/25 text-sm">
                Login
              </button>
              <button onClick={openRegister}
                className="px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/25 hover:bg-white/20 transition text-sm">
                Get Started
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* ── Stats Strip ───────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-green-600 mb-1">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="bg-green-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-widest mb-3">Features</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything You Need</h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
              Modern tools designed for efficient, campus-wide USG event attendance management.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(f => (
              <div key={f.title} className="group bg-white rounded-2xl p-6 border border-green-100 hover:shadow-xl hover:border-green-300 hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors duration-200">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-widest mb-3">How It Works</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Three Simple Steps</h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
              From event setup to detailed attendance reports in minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line between step boxes */}
            <div className="hidden md:block absolute top-9 left-[calc(50%/3+4rem)] right-[calc(50%/3+4rem)] h-px bg-green-200" />
            {steps.map(s => (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 w-[4.5rem] h-[4.5rem] bg-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-extrabold mb-5 shadow-lg shadow-green-600/30">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[14rem]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 py-18">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center py-10">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Get Started?</h2>
          <p className="text-green-100/80 mb-8 text-sm leading-relaxed">
            Join Mindoro State University's digital attendance system for USG events.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={openRegister}
              className="px-7 py-3.5 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition text-sm shadow-lg">
              Register as Student
            </button>
            <button onClick={openLogin}
              className="px-7 py-3.5 bg-transparent border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition text-sm">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">U-EventTrack</span>
          </div>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Mindoro State University — Bongabong Campus
          </p>
        </div>
      </footer>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSwitchToRegister={openRegister} />
      <StudentRegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} onSwitchToLogin={openLogin} />
    </div>
  );
}






