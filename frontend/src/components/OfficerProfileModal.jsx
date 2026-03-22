import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { uploadUserProfileImage, updateUserPassword } from '../api/authApi';
import { toast } from 'react-toastify';
import TwoFactorPanel from './TwoFactorPanel';

export default function OfficerProfileModal({ open, onClose }) {
  const { user, fetchUser } = useAuth();

  const [tab, setTab] = useState('info');
  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState({ current: false, pwd: false, confirm: false });
  const [uploading, setUploading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      await updateUserPassword(form);
      toast.success('Password updated successfully!');
      setForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      if (err.response?.status === 422) {
        const msg = err.response.data.message || err.response.data.errors;
        if (typeof msg === 'string') {
          toast.error(msg);
        } else if (msg) {
          setErrors(msg);
        }
      } else {
        toast.error('Failed to update password.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB.');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profile_image', file);
      await uploadUserProfileImage(formData);
      toast.success('Profile picture updated!');
      await fetchUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const profileImageUrl = user?.profile_image ? `/storage/${user.profile_image}` : null;

  const handleClose = () => {
    setTab('info');
    setForm({ current_password: '', password: '', password_confirmation: '' });
    setErrors({});
    onClose();
  };

  const roleBadgeColor = user?.role === 'admin'
    ? 'bg-purple-100/30 text-purple-100'
    : 'bg-blue-100/30 text-blue-100';

  const inputCls = 'w-full pl-10 pr-4 py-2.5 border border-green-300 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent';

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 px-6 py-6 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Avatar with upload button */}
          <div className="relative inline-block mx-auto mb-2">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="w-[72px] h-[72px] rounded-full object-cover ring-2 ring-white/30" />
            ) : (
              <div className="w-[72px] h-[72px] bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-2xl font-bold ring-2 ring-white/30">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => document.getElementById('user-profile-image-input').click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-green-50 transition-colors border border-green-200"
              title="Change profile picture"
            >
              {uploading ? (
                <svg className="w-3.5 h-3.5 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </button>
            <input
              id="user-profile-image-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <p className="text-white text-lg font-semibold">{user?.name}</p>
          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleBadgeColor}`}>
            {user?.role}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-green-100 overflow-x-auto">
          <button
            onClick={() => setTab('info')}
            className={`flex-1 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              tab === 'info' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setTab('password')}
            className={`flex-1 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              tab === 'password' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setTab('security')}
            className={`flex-1 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              tab === 'security' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Security
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === 'info' ? (
            <div className="space-y-3">
              {[
                {
                  label: 'Full Name', value: user?.name,
                  icon: <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
                },
                {
                  label: 'Email', value: user?.email,
                  icon: <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                },
                {
                  label: 'Role', value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '',
                  icon: <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                },
                {
                  label: 'Member Since',
                  value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
                  icon: <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
                },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-green-50/50 transition-colors">
                  <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input type={showPw.current ? 'text' : 'password'} name="current_password" value={form.current_password} onChange={handleChange} className={inputCls + ' pr-10'} placeholder="Enter current password" />
                  <button type="button" onClick={() => setShowPw(v => ({ ...v, current: !v.current }))} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                    {showPw.current ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
                {errors.current_password && <p className="text-xs text-red-500 mt-1">{errors.current_password[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                  </div>
                  <input type={showPw.pwd ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} className={inputCls + ' pr-10'} placeholder="Enter new password" />
                  <button type="button" onClick={() => setShowPw(v => ({ ...v, pwd: !v.pwd }))} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                    {showPw.pwd ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <input type={showPw.confirm ? 'text' : 'password'} name="password_confirmation" value={form.password_confirmation} onChange={handleChange} className={inputCls + ' pr-10'} placeholder="Confirm new password" />
                  <button type="button" onClick={() => setShowPw(v => ({ ...v, confirm: !v.confirm }))} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                    {showPw.confirm ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors shadow-sm"
              >
                {saving ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          )}
          {tab === 'security' && (
            <TwoFactorPanel />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
