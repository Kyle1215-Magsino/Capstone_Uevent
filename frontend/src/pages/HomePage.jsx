import { useState, useEffect } from 'react';
import { Calendar, LogIn, ArrowRight, Check, Zap, MapPin, BarChart2, Smartphone, Users, CheckCircle, Clipboard, Eye, FileText, QrCode } from 'lucide-react';
import LoginModal from '../components/LoginModal';
import StudentRegisterModal from '../components/StudentRegisterModal';
import { getPublicAnnouncements } from '../api/announcementApi';

const FALLBACK_ANNOUNCEMENTS = [
  { id: 1, tag: 'Event',    text: 'Campus Leadership Summit — April 5, 2026 at the Main Gymnasium. All students are encouraged to attend!' },
  { id: 2, tag: 'Reminder', text: 'Face enrollment is now open. Visit the Face Enrollment page to register your biometric data.' },
  { id: 3, tag: 'Info',     text: "Barcode scanners are available at the Registrar's Office. Contact admin for assistance." },
  { id: 4, tag: 'Event',    text: 'General Assembly on April 12, 2026 — attendance is mandatory for all enrolled students.' },
  { id: 5, tag: 'Update',   text: 'U-EventTrack v2 is live! Enjoy barcode scanning, facial recognition, and mobile app access.' },
];

const TAG_COLORS = {
  Event:    'bg-green-400/20 text-green-200',
  Reminder: 'bg-yellow-400/20 text-yellow-200',
  Info:     'bg-blue-400/20 text-blue-200',
  Update:   'bg-emerald-400/20 text-emerald-200',
  Alert:    'bg-red-400/20 text-red-200',
};

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">

      <style>{`
        @keyframes annSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes annSlideOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50%       { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
        }
        .float-animation { animation: float 6s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src="/usg-logo.png" 
                alt="USG Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 tracking-tight">U-EventTrack</h1>
              <p className="text-xs text-gray-500">MinSU Bongabong Campus</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openLogin} className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all">
              Sign In
            </button>
            <button onClick={openRegister} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50">
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 border-b border-green-400/30">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-6">
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse" />
            <span className="text-green-100 text-sm font-bold uppercase tracking-wider">Live</span>
          </div>
          <span className="w-px h-8 bg-white/20 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <div
              key={annIdx}
              style={{ animation: annVisible ? 'annSlideIn 0.4s ease forwards' : 'annSlideOut 0.3s ease forwards' }}
              className="flex items-center gap-4"
            >
              <span className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${TAG_COLORS[current.tag] ?? 'bg-white/10 text-white'}`}>
                {current.tag}
              </span>
              <p className="text-white text-lg font-semibold truncate">{current.text}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {announcements.map((_, i) => (
              <button
                key={i}
                onClick={() => { setAnnIdx(i); setAnnVisible(true); }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === annIdx ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-700 text-sm font-semibold">Mindoro State University — Bongabong Campus</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Smart<br />
                <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Attendance</span><br />
                for USG Events
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Streamline event attendance with <span className="font-semibold text-green-600">barcode scanning</span>, <span className="font-semibold text-green-600">facial recognition</span>, and <span className="font-semibold text-green-600">mobile app</span> — all tracked in real time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={openLogin} className="px-7 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-base hover:from-green-600 hover:to-emerald-700 transition-all shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 hover:scale-105">
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </span>
                </button>
                <button onClick={openRegister} className="px-7 py-3.5 bg-white text-green-700 rounded-2xl font-bold text-base border-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all shadow-lg">
                  <span className="flex items-center justify-center gap-2">
                    Register as Student
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </button>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 pt-4">
                {[
                  { icon: <Smartphone className="w-5 h-5 text-green-600" />, label: 'Mobile App' },
                  { icon: <QrCode className="w-5 h-5 text-green-600" />, label: 'Barcode Scan' },
                  { icon: <Eye className="w-5 h-5 text-green-600" />, label: 'Face Recognition' },
                  { icon: <BarChart2 className="w-5 h-5 text-green-600" />, label: 'Live Dashboard' }
                ].map(badge => (
                  <div key={badge.label} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                    {badge.icon}
                    <span className="text-sm font-semibold text-gray-700">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - USG Logo */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-3xl opacity-20" />
                <img
                  src="/usg-logo.png"
                  alt="USG Logo"
                  className="relative w-80 h-80 object-cover rounded-full shadow-2xl border-8 border-white"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '3', label: 'Check-in Methods', icon: <CheckCircle className="w-12 h-12 mx-auto text-white" /> },
              { value: '100%', label: 'Digital Records', icon: <Clipboard className="w-12 h-12 mx-auto text-white" /> },
              { value: 'Live', label: 'Real-Time Updates', icon: <Zap className="w-12 h-12 mx-auto text-white" /> },
              { value: 'Secure', label: 'Face Recognition', icon: <Eye className="w-12 h-12 mx-auto text-white" /> }
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="mb-3">{stat.icon}</div>
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-green-100 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold uppercase tracking-wider mb-4">Features</span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Modern tools designed for efficient, campus-wide USG event attendance management.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Barcode Scanning',
                desc: 'Fast and reliable barcode-based check-in system for quick student verification at events.',
                icon: <QrCode className="w-8 h-8 text-white" />,
                color: 'from-green-500 to-emerald-600'
              },
              {
                title: 'Facial Recognition',
                desc: 'Advanced face detection with quality scoring and multi-stage verification.',
                icon: <Eye className="w-8 h-8 text-white" />,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Mobile App',
                desc: 'Native Expo mobile app for students with dashboard, attendance history, and announcements.',
                icon: <Smartphone className="w-8 h-8 text-white" />,
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Real-Time Dashboard',
                desc: 'Live attendance monitoring with instant updates, charts, and statistics during events.',
                icon: <BarChart2 className="w-8 h-8 text-white" />,
                color: 'from-orange-500 to-red-500'
              },
              {
                title: 'GPS Verification',
                desc: 'Location-based validation with configurable radius ensures physical presence at venue.',
                icon: <MapPin className="w-8 h-8 text-white" />,
                color: 'from-yellow-500 to-orange-500'
              },
              {
                title: 'Audit Logging',
                desc: 'Complete activity tracking with detailed logs for security, compliance, and monitoring.',
                icon: <FileText className="w-8 h-8 text-white" />,
                color: 'from-indigo-500 to-purple-500'
              }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold uppercase tracking-wider mb-4">How It Works</span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Three Simple Steps</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">From registration to detailed attendance reports in minutes.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-24 left-[16.66%] right-[16.66%] h-1 bg-gradient-to-r from-green-300 via-green-400 to-green-300" />
            
            {[
              {
                step: '01',
                title: 'Register & Enroll',
                desc: 'Students register via mobile app, then enroll their face for biometric authentication.',
                icon: <Users className="w-12 h-12 text-white" />
              },
              {
                step: '02',
                title: 'Officers Create Events',
                desc: 'Officers set up events with venue, schedule, and attendance tracking enabled.',
                icon: <Calendar className="w-12 h-12 text-white" />
              },
              {
                step: '03',
                title: 'Check In & Track',
                desc: 'Students check in using barcode or facial recognition. View real-time attendance analytics.',
                icon: <Check className="w-12 h-12 text-white" />
              }
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/40 relative z-10">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-green-600 text-sm border-4 border-green-100 shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 py-24">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-sm font-semibold">Ready to go digital?</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-6">Join U-EventTrack Today</h2>
          <p className="text-lg text-green-50 mb-10 max-w-2xl mx-auto">
            Join Mindoro State University's digital attendance system for USG events.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={openRegister} className="px-7 py-3.5 bg-white text-green-700 rounded-2xl font-bold text-base hover:bg-green-50 transition-all shadow-2xl hover:scale-105">
              Register as Student →
            </button>
            <button onClick={openLogin} className="px-7 py-3.5 bg-white/10 border-2 border-white/30 text-white rounded-2xl font-bold text-base hover:bg-white/20 transition-all backdrop-blur-sm">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">U-EventTrack</p>
                <p className="text-gray-400 text-sm">MinSU Bongabong Campus</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm text-center">
              © {new Date().getFullYear()} Mindoro State University — Bongabong Campus. All rights reserved.
            </p>
            
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>Barcode</span>
              <span>·</span>
              <span>Face Recognition</span>
              <span>·</span>
              <span>Mobile</span>
            </div>
          </div>
        </div>
      </footer>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSwitchToRegister={openRegister} />
      <StudentRegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} onSwitchToLogin={openLogin} />
    </div>
  );
}
