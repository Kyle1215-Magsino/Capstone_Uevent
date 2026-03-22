import { useState } from 'react';
import { register } from '../api/authApi';
import { toast } from 'react-toastify';
import Modal from './Modal';

export default function RegisterOfficerModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'officer' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState({ pwd: false, confirm: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Officer account created.');
      setTimeout(() => {
        onClose();
        setForm({ name: '', email: '', password: '', password_confirmation: '', role: 'officer' });
      }, 800);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-200">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Register Officer Account</h2>
          <p className="text-sm text-gray-500 mt-1">Create a new officer or admin account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </span>
              <input type="text" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <input type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              <input type={showPw.pwd ? 'text' : 'password'} required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
              <button type="button" onClick={() => setShowPw(v => ({ ...v, pwd: !v.pwd }))} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                {showPw.pwd ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </span>
              <input type={showPw.confirm ? 'text' : 'password'} required value={form.password_confirmation}
                onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
              <button type="button" onClick={() => setShowPw(v => ({ ...v, confirm: !v.confirm }))} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                {showPw.confirm ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </span>
              <select value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400">
                <option value="officer">Officer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 transition text-sm shadow-lg shadow-green-200">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </Modal>
  );
}






