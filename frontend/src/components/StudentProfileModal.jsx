import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { updateStudentPassword, uploadProfileImage } from '../api/authApi';
import { toast } from 'react-toastify';

const EyeOff = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;
const EyeOn = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;

export default function StudentProfileModal({ open, onClose }) {
  const { user, fetchUser } = useAuth();
  const student = user?.student_record;

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
      await updateStudentPassword(form);
      toast.success('Password updated successfully!');
      setForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      if (err.response?.status === 422) {
        const msg = err.response.data.message || err.response.data.errors;
        if (typeof msg === 'string') toast.error(msg);
        else if (msg) setErrors(msg);
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
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB.'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profile_image', file);
      await uploadProfileImage(formData);
      toast.success('Profile picture updated!');
      await fetchUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const profileImageUrl = student?.profile_image ? `/storage/${student.profile_image}` : null;

  const handleClose = () => {
    setTab('info');
    setForm({ current_password: '', password: '', password_confirmation: '' });
    setErrors({});
    onClose();
  };

  const inputCls = 'w-full pl-10 pr-10 py-2.5 border border-green-300 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent';

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">

        {/* Header */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 px-6 py-6 text-center relative">
          <button onClick={handleClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Avatar + upload */}
          <div className="relative inline-block mx-auto mb-2">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="w-[72px] h-[72px] rounded-full object-cover ring-2 ring-white/30" />
            ) : (
              <div className="w-[72px] h-[72px] bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-2xl font-bold ring-2 ring-white/30">
                {student?.first_name?.charAt(0)}{student?.last_name?.charAt(0)}
              </div>
            )}
            <button type="button"
              onClick={() => document.getElementById('student-profile-image-input').click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-green-50 transition-colors border border-green-200"
              title="Change profile picture">
              {uploading ? (
                <svg className="w-3.5 h-3.5 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </button>
            <input id="student-profile-image-input" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
          </div>

          <p className="text-white text-lg font-semibold">{student?.first_name} {student?.last_name}</p>
          <p className="text-green-100 text-sm mt-0.5">{student?.course} · Year {student?.year_level}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-green-100">
          {['info', 'password'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === t ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-400 hover:text-gray-600'}`}>
              {t === 'info' ? 'Profile Info' : 'Change Password'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === 'info' ? (
            <div className="space-y-3">
              {[
                { label: 'Student ID', value: student?.student_id, icon: <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" /></svg> },
                { label: 'Email', value: student?.email || user?.email, icon: <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                { label: 'Course', value: student?.course, icon: <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
                { label: 'Year Level', value: `Year ${student?.year_level}`, icon: <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-green-50/50 transition-colors">
                  <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">{item.icon}</div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: 'current_password', label: 'Current Password', key: 'current' },
                { name: 'password', label: 'New Password', key: 'pwd' },
                { name: 'password_confirmation', label: 'Confirm New Password', key: 'confirm' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input
                      type={showPw[field.key] ? 'text' : 'password'}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className={inputCls}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                    <button type="button" onClick={() => setShowPw(v => ({ ...v, [field.key]: !v[field.key] }))}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                      {showPw[field.key] ? <EyeOff /> : <EyeOn />}
                    </button>
                  </div>
                  {errors[field.name] && <p className="text-xs text-red-500 mt-1">{errors[field.name][0]}</p>}
                </div>
              ))}
              <button type="submit" disabled={saving}
                className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors shadow-sm">
                {saving ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
