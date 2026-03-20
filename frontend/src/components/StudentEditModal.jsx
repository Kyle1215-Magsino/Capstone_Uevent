import { useState, useEffect } from 'react';
import Modal from './Modal';
import { getStudent, updateStudent } from '../api/studentApi';
import { toast } from 'react-toastify';

export default function StudentEditModal({ studentId, open, onClose, onUpdated }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && studentId) {
      setLoading(true);
      setForm(null);
      getStudent(studentId).then(res => {
        const s = res.data;
        setForm({
          student_id: s.student_id, first_name: s.first_name, last_name: s.last_name,
          email: s.email, course: s.course, year_level: s.year_level,
          rfid_tag: s.rfid_tag || '', status: s.status,
        });
      }).finally(() => setLoading(false));
    }
  }, [open, studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStudent(studentId, form);
      toast.success('Student updated.');
      onClose();
      onUpdated?.();
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : 'Update failed.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const inputCls = 'w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent';

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Edit Student</h2>
        <p className="text-sm text-gray-500 mb-6">Update student information</p>

        {loading || !form ? (
          <div className="py-16 text-center text-gray-400">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input type="text" required value={form.student_id} onChange={e => set('student_id', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" required value={form.first_name} onChange={e => set('first_name', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" required value={form.last_name} onChange={e => set('last_name', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select required value={form.course} onChange={e => set('course', e.target.value)} className={inputCls}>
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
              <select required value={form.year_level} onChange={e => set('year_level', parseInt(e.target.value))} className={inputCls}>
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RFID Tag</label>
              <input type="text" value={form.rfid_tag} onChange={e => set('rfid_tag', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Update Student'}
              </button>
              <button type="button" onClick={onClose}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
