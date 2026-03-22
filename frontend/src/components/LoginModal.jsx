import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Modal from './Modal';

const EyeOff = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
);
const EyeOn = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);

export default function LoginModal({ open, onClose, onSwitchToRegister }) {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      toast.success('Welcome back!');
      onClose();
      navigate(data.role === 'student' ? '/student-dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {/* Green Header */}
      <div className="bg-green-600 rounded-t-2xl px-8 py-8 text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto mb-3">
          <img src="/usg-logo.png" alt="USG Logo" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-xl font-bold text-white">U-EventTrack</h2>
        <p className="text-green-100 text-sm mt-0.5">Mindoro State University &bull; USG</p>
      </div>

      {/* Form */}
      <div className="px-7 pt-6 pb-7">
        <h3 className="text-center text-sm font-semibold text-gray-500 mb-5">Sign in to your account</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <input
                type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white text-sm text-gray-800 placeholder:text-gray-300 transition"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              <input
                type={showPw ? 'text' : 'password'} required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white text-sm text-gray-800 placeholder:text-gray-300 transition"
                placeholder="Enter your password"
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-300 hover:text-gray-500 transition">
                {showPw ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={form.remember}
              onChange={e => setForm({ ...form, remember: e.target.checked })}
              className="w-3.5 h-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-xs text-gray-500">Remember me</span>
          </label>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm disabled:opacity-50 transition flex items-center justify-center gap-2">
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-400">
          No account?{' '}
          <button onClick={onSwitchToRegister} className="text-green-600 font-semibold hover:text-green-700 transition">
            Register
          </button>
        </p>
      </div>
    </Modal>
  );
}
