import { useState } from 'react';
import { registerStudent } from '../api/authApi';
import { toast } from 'react-toastify';
import Modal from './Modal';

const EyeOff = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
);
const EyeOn = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);

export default function StudentRegisterModal({ open, onClose, onSwitchToLogin }) {
  const [form, setForm] = useState({
    student_id: '', first_name: '', last_name: '', email: '',
    course: '', year_level: 1, password: '', password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState({ pwd: false, confirm: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await registerStudent(form);
      toast.success('Account created! You can now login.');
      setForm({ student_id: '', first_name: '', last_name: '', email: '', course: '', year_level: 1, password: '', password_confirmation: '' });
      setTimeout(() => { onClose(); onSwitchToLogin(); }, 1000);
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const inputCls = "w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-500 transition";
  const labelCls = "block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5";
  const selectCls = "w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white transition";

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      {/* Green Header */}
      <div className="bg-green-600 rounded-t-2xl px-8 py-7 text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto mb-3">
          <img src="/usg-logo.png" alt="USG Logo" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-xl font-bold text-white">Student Registration</h2>
        <p className="text-green-100 text-sm mt-0.5">Mindoro State University &bull; USG</p>
      </div>

      {/* Form */}
      <div className="px-6 pt-5 pb-6">
        <h3 className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Fill in your details to create an account</h3>
        <form onSubmit={handleSubmit} className="space-y-3">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Student ID</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" /></svg>
                </span>
                <input type="text" required value={form.student_id} onChange={e => set('student_id', e.target.value)} className={inputCls} placeholder="e.g. 00414" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="your@email.com" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>First Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                <input type="text" required value={form.first_name} onChange={e => set('first_name', e.target.value)} className={inputCls} placeholder="First name" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Last Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                <input type="text" required value={form.last_name} onChange={e => set('last_name', e.target.value)} className={inputCls} placeholder="Last name" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Course</label>
              <select required value={form.course} onChange={e => set('course', e.target.value)} className={selectCls}>
                <option value="">Select Course</option>
                <option value="BSIT">BSIT</option>
                <option value="BSCS">BSCS</option>
                <option value="BSED">BSED</option>
                <option value="BEED">BEED</option>
                <option value="BSA">BSA</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Year Level</label>
              <select required value={form.year_level} onChange={e => set('year_level', parseInt(e.target.value))} className={selectCls}>
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input type={showPw.pwd ? 'text' : 'password'} required minLength={6} value={form.password}
                  onChange={e => set('password', e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-500 transition"
                  placeholder="Min 6 chars" />
                <button type="button" onClick={() => setShowPw(v => ({ ...v, pwd: !v.pwd }))}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition">
                  {showPw.pwd ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
            </div>
            <div>
              <label className={labelCls}>Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </span>
                <input type={showPw.confirm ? 'text' : 'password'} required minLength={6} value={form.password_confirmation}
                  onChange={e => set('password_confirmation', e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-500 transition"
                  placeholder="Confirm" />
                <button type="button" onClick={() => setShowPw(v => ({ ...v, confirm: !v.confirm }))}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition">
                  {showPw.confirm ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg font-semibold text-sm disabled:opacity-50 transition flex items-center justify-center gap-2">
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Registering...</>
            ) : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-400 dark:text-gray-500">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-500 transition">
            Sign In
          </button>
        </p>
      </div>
    </Modal>
  );
}
