import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudent, updateStudent } from '../api/studentApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

export default function StudentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getStudent(id).then(res => {
      const s = res.data;
      setForm({
        student_id: s.student_id, first_name: s.first_name, last_name: s.last_name,
        email: s.email, course: s.course, year_level: s.year_level,
        rfid_tag: s.rfid_tag || '', status: s.status,
      });
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStudent(id, form);
      toast.success('Student updated.');
      setTimeout(() => navigate(`/students/${id}`), 1000);
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : 'Update failed.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <LoadingSpinner />;

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Student</h1>
      <p className="text-sm text-gray-500 mb-6">Update student information</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-green-300 max-w-2xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input type="text" required value={form.student_id} onChange={e => set('student_id', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input type="text" required value={form.first_name} onChange={e => set('first_name', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" required value={form.last_name} onChange={e => set('last_name', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select required value={form.course} onChange={e => set('course', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400">
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
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400">
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RFID Tag</label>
            <input type="text" value={form.rfid_tag} onChange={e => set('rfid_tag', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Update Student'}
            </button>
            <button type="button" onClick={() => navigate(`/students/${id}`)}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}






