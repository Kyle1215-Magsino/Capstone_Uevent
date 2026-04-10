import { useState, useEffect } from 'react';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../api/announcementApi';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';

const TAGS = ['Event', 'Reminder', 'Info', 'Update', 'Alert'];

const TAG_COLORS = {
  Event:    'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  Reminder: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
  Info:     'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  Update:   'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  Alert:    'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
};

const EMPTY_FORM = { tag: 'Info', text: '', active: true, sort_order: 0 };

export default function AnnouncementsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = add, obj = edit
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = () => {
    setLoading(true);
    getAnnouncements().then(res => setItems(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ tag: item.tag, text: item.text, active: item.active, sort_order: item.sort_order });
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) { toast.warning('Text is required.'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateAnnouncement(editing.id, form);
        toast.success('Announcement updated.');
      } else {
        await createAnnouncement(form);
        toast.success('Announcement created.');
      }
      setFormOpen(false);
      fetchAll();
    } catch {
      toast.error('Failed to save announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item) => {
    try {
      await updateAnnouncement(item.id, { active: !item.active });
      setItems(prev => prev.map(a => a.id === item.id ? { ...a, active: !a.active } : a));
    } catch {
      toast.error('Failed to update.');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAnnouncement(deleteId);
      toast.success('Announcement deleted.');
      setDeleteId(null);
      fetchAll();
    } catch {
      toast.error('Failed to delete.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage announcements shown on the landing page</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 font-medium text-sm transition shadow-sm"
        >
          + New Announcement
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-green-300 dark:border-gray-800 overflow-hidden">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
              <svg className="w-12 h-12 mb-3 text-gray-200 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <p className="text-sm">No announcements yet.</p>
              <button onClick={openAdd} className="mt-3 text-sm text-green-600 dark:text-green-400 hover:underline">Create your first one</button>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-green-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tag</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Text</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {items.map(item => (
                  <tr key={item.id} className={`hover:bg-green-50 dark:hover:bg-gray-800 transition-colors ${!item.active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TAG_COLORS[item.tag] ?? 'bg-gray-100 text-gray-600'}`}>
                        {item.tag}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-md">
                      <p className="line-clamp-2">{item.text}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.sort_order}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(item)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${item.active ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                        title={item.active ? 'Deactivate' : 'Activate'}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${item.active ? 'translate-x-4.5' : 'translate-x-0.5'}`} style={{ transform: item.active ? 'translateX(18px)' : 'translateX(2px)' }} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(item)} title="Edit" className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setDeleteId(item.id)} title="Delete" className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} maxWidth="max-w-lg">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            {editing ? 'Edit Announcement' : 'New Announcement'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                <select
                  value={form.tag}
                  onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                  className="w-full px-3 py-2 border border-green-300 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent"
                >
                  {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-green-300 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text <span className="text-gray-400">(max 500 chars)</span></label>
              <textarea
                value={form.text}
                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                rows={3}
                maxLength={500}
                placeholder="Enter announcement text..."
                className="w-full px-3 py-2 border border-green-300 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-400 text-right mt-0.5">{form.text.length}/500</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ann-active"
                checked={form.active}
                onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                className="w-4 h-4 accent-green-500"
              />
              <label htmlFor="ann-active" className="text-sm text-gray-700">Active (visible on landing page)</label>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setFormOpen(false)} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm font-medium disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="max-w-sm">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Announcement?</h3>
          <p className="text-sm text-gray-500 mb-6">This cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setDeleteId(null)} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50">
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
