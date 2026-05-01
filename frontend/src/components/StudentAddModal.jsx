import { useState } from 'react';
import { createStudent } from '../api/studentApi';
import { toast } from 'react-toastify';
import Modal from './Modal';

export default function StudentAddModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    student_id: '', first_name: '', last_name: '', email: '',
    course: '', year_level: 1, barcode: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createStudent(form);
      toast.success('Student created successfully.');
      setTimeout(() => {
        onClose();
        setForm({ student_id: '', first_name: '', last_name: '', email: '', course: '', year_level: 1, barcode: '' });
        onCreated?.();
      }, 600);
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : err.response?.data?.message || 'Failed to create student.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Student</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a new student record</p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student ID</label>
            <input type="text" required value={form.student_id} onChange={e => set('student_id', e.target.value)}
              placeholder="e.g. 00414"
              className="w-full px-4 py-2.5 border border-green-400 dark:border-green-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 dark:border-green-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
            <input type="text" required value={form.first_name} onChange={e => set('first_name', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 dark:border-green-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
            <input type="text" required value={form.last_name} onChange={e => set('last_name', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 dark:border-green-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
            <select required value={form.course} onChange={e => set('course', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 dark:border-green-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500">
              <option value="">Select Course</option>
              <option value="BSIT">BSIT</option>
              <option value="BSCS">BSCS</option>
              <option value="BSED">BSED</option>
              <option value="BEED">BEED</option>
              <option value="BSA">BSA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year Level</label>
            <select required value={form.year_level} onChange={e => set('year_level', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-green-400 dark:border-green-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500">
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Barcode (Optional)</label>
            <input type="text" value={form.barcode} onChange={e => set('barcode', e.target.value)}
              placeholder="e.g. BC-000001"
              className="w-full px-4 py-2.5 border border-green-400 dark:border-green-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500" />
          </div>
          <div className="md:col-span-2 flex gap-2 pt-2">
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 transition text-sm shadow-lg shadow-green-200 dark:shadow-green-900/30">
              {loading ? 'Saving...' : 'Create Student'}
            </button>
            <button type="button" onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}






