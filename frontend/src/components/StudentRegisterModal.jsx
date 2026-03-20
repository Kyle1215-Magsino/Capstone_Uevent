import { useState } from 'react';
import { registerStudent } from '../api/authApi';
import { toast } from 'react-toastify';
import Modal from './Modal';

export default function StudentRegisterModal({ open, onClose, onSwitchToLogin }) {
  const [form, setForm] = useState({
    student_id: '', first_name: '', last_name: '', email: '',
    course: '', year_level: 1, password: '', password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);

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
      setTimeout(() => {
        onClose();
        onSwitchToLogin();
      }, 1000);
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

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      <div className="p-8">
        {/* Branding */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-green-200">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Student Registration</h2>
          <p className="text-sm text-gray-400 mt-1">Create your U-EventTrack account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" /></svg>
                </span>
                <input type="text" required value={form.student_id}
                  onChange={e => set('student_id', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-green-400 rounded-xl bg-green-50 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="e.g. 00414" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input type="email" required value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-green-400 rounded-xl bg-green-50 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="your@email.com" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                <input type="text" required value={form.first_name}
                  onChange={e => set('first_name', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-green-400 rounded-xl bg-green-50 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="First name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                <input type="text" required value={form.last_name}
                  onChange={e => set('last_name', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-green-400 rounded-xl bg-green-50 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Last name" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select required value={form.course} onChange={e => set('course', e.target.value)}
                className="w-full px-3 py-2 border border-green-400 rounded-xl bg-green-50 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent">
                <option value="">Select Course</option>
                <option value="BSIT">BSIT</option>
                <option value="BSCS">BSCS</option>
                <option value="BSED">BSED</option>
                <option value="BEED">BEED</option>
                <option value="BSA">BSA</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year Level</label>
              <select required value={form.year_level} onChange={e => set('year_level', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-green-400 rounded-xl bg-green-50 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent">
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input type="password" required minLength={6} value={form.password}
                  onChange={e => set('password', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-green-400 rounded-xl bg-green-50 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Min 6 characters" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </span>
                <input type="password" required minLength={6} value={form.password_confirmation}
                  onChange={e => set('password_confirmation', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-green-400 rounded-xl bg-green-50 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Confirm password" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 transition text-sm shadow-lg shadow-green-200">
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={onSwitchToLogin} className="text-sm text-green-600 hover:text-green-700 font-medium">
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </Modal>
  );
}






