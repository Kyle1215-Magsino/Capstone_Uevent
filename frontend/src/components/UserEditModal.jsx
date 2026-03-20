import { useState, useEffect } from 'react';
import Modal from './Modal';
import { updateUser } from '../api/authApi';
import { toast } from 'react-toastify';

export default function UserEditModal({ user, open, onClose, onUpdated }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'officer', password: '', password_confirmation: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && user) {
      setForm({ name: user.name, email: user.email, role: user.role, password: '', password_confirmation: '' });
    }
  }, [open, user]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email, role: form.role };
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      await updateUser(user.id, payload);
      toast.success('User updated.');
      onClose();
      onUpdated?.();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        toast.error(Object.values(errors).flat().join(' '));
      } else {
        toast.error(err.response?.data?.message || 'Update failed.');
      }
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent';

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Edit User</h2>
        <p className="text-sm text-gray-500 mb-6">Update account information</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" required value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select value={form.role} onChange={e => set('role', e.target.value)} className={inputCls}>
              <option value="officer">Officer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Leave blank to keep current" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" value={form.password_confirmation} onChange={e => set('password_confirmation', e.target.value)} placeholder="Repeat new password" className={inputCls} />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors shadow-sm">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
