import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;   // 15 minutes of inactivity
const WARNING_COUNTDOWN_S = 60;            // 60-second warning before auto-logout

export default function SessionTimeoutModal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_COUNTDOWN_S);
  const idleTimer = useRef(null);
  const countdownTimer = useRef(null);

  const doLogout = useCallback(async () => {
    setShowWarning(false);
    clearInterval(countdownTimer.current);
    await logout();
    navigate('/');
  }, [logout, navigate]);

  const startCountdown = useCallback(() => {
    setCountdown(WARNING_COUNTDOWN_S);
    setShowWarning(true);
    countdownTimer.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer.current);
          doLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [doLogout]);

  const resetIdleTimer = useCallback(() => {
    if (showWarning) return; // don't reset during countdown
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(startCountdown, IDLE_TIMEOUT_MS);
  }, [showWarning, startCountdown]);

  const handleStayLoggedIn = () => {
    clearInterval(countdownTimer.current);
    setShowWarning(false);
    // Restart idle timer
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(startCountdown, IDLE_TIMEOUT_MS);
  };

  useEffect(() => {
    if (!user) return;

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(e => window.addEventListener(e, resetIdleTimer));
    resetIdleTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimer.current);
      clearInterval(countdownTimer.current);
    };
  }, [user, resetIdleTimer]);

  if (!showWarning) return null;

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (countdown / WARNING_COUNTDOWN_S) * circumference;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[fadeInUp_0.25s_ease]">
        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-orange-400 to-red-500" />

        <div className="p-7 text-center">
          {/* Countdown ring */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <svg width="72" height="72" className="-rotate-90">
              <circle cx="36" cy="36" r={radius} fill="none" stroke="#fee2e2" strokeWidth="5" />
              <circle
                cx="36" cy="36" r={radius}
                fill="none"
                stroke={countdown <= 10 ? '#ef4444' : countdown <= 20 ? '#f97316' : '#22c55e'}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
              />
            </svg>
            <span className={`absolute text-xl font-bold tabular-nums ${countdown <= 10 ? 'text-red-500' : 'text-gray-800'}`}>
              {countdown}
            </span>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-2">Session Expiring</h2>
          <p className="text-sm text-gray-500 mb-6">
            You've been inactive for a while. You'll be automatically logged out in{' '}
            <span className={`font-semibold ${countdown <= 10 ? 'text-red-500' : 'text-gray-800'}`}>{countdown} second{countdown !== 1 ? 's' : ''}</span>.
          </p>

          <div className="flex gap-3">
            <button
              onClick={doLogout}
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Log Out Now
            </button>
            <button
              onClick={handleStayLoggedIn}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
