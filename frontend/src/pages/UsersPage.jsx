import { useState, useEffect } from 'react';
import { getUsers, getArchivedUsers, deleteUser, restoreUser } from '../api/authApi';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import RegisterOfficerModal from '../components/RegisterOfficerModal';
import UserViewModal from '../components/UserViewModal';
import UserEditModal from '../components/UserEditModal';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [tab, setTab] = useState('active'); // 'active' | 'archived'
  const [users, setUsers] = useState([]);
  const [archived, setArchived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [archiveId, setArchiveId] = useState(null);
  const [archiving, setArchiving] = useState(false);
  const [restoreId, setRestoreId] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetchAll = () => {
    setLoading(true);
    Promise.all([getUsers(), getArchivedUsers()])
      .then(([a, b]) => { setUsers(a.data); setArchived(b.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleArchive = async () => {
    setArchiving(true);
    try {
      await deleteUser(archiveId);
      toast.success('User archived.');
      setArchiveId(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to archive user.');
    } finally {
      setArchiving(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await restoreUser(restoreId);
      toast.success('User restored.');
      setRestoreId(null);
      fetchAll();
    } catch {
      toast.error('Failed to restore user.');
    } finally {
      setRestoring(false);
    }
  };

  const roleBadge = (role) => (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
      role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
    }`}>{role}</span>
  );

  const activeColumns = [
    { key: 'name', label: 'Name', accessor: row => row.name },
    { key: 'email', label: 'Email', accessor: row => row.email },
    { key: 'role', label: 'Role', render: row => roleBadge(row.role) },
    { key: 'created_at', label: 'Joined', accessor: row => new Date(row.created_at).toLocaleDateString() },
    { key: 'actions', label: 'Actions', sortable: false, render: row => (
      <div className="flex items-center gap-1">
        <button onClick={() => setViewUser(row)} title="View" className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        </button>
        <button onClick={() => setEditUser(row)} title="Edit" className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
        {row.id !== currentUser?.id ? (
          <button onClick={() => setArchiveId(row.id)} title="Archive" className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          </button>
        ) : (
          <span className="w-7" />
        )}
      </div>
    )},
  ];

  const filteredArchived = archived.filter(u => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage admin and officer accounts</p>
        </div>
        {tab === 'active' && (
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add User
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-green-50 dark:bg-gray-800 border border-green-200 dark:border-gray-700 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('active')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'active' ? 'bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 shadow-sm border border-green-200 dark:border-gray-700' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          Active
          <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-semibold ${
            tab === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>{users.length}</span>
        </button>
        <button
          onClick={() => setTab('archived')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'archived' ? 'bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400 shadow-sm border border-orange-200 dark:border-gray-700' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          Archived
          <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-semibold ${
            tab === 'archived' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>{archived.length}</span>
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {/* Active tab */}
          {tab === 'active' && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-green-300 dark:border-gray-800 p-5">
              <DataTable columns={activeColumns} data={users} />
            </div>
          )}

          {/* Archived tab */}
          {tab === 'archived' && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-orange-200 dark:border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-orange-100 dark:border-gray-800">
                <div className="relative max-w-sm">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search archived users..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-orange-200 dark:border-gray-700 rounded-xl bg-orange-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 text-sm focus:ring-2 focus:ring-orange-300 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              {filteredArchived.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-orange-300 dark:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">{search ? 'No matching records.' : 'No archived users yet.'}</p>
                </div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-orange-50 dark:bg-gray-800 border-b border-orange-100 dark:border-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Joined</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-50 dark:divide-gray-800">
                    {filteredArchived.map(u => (
                      <tr key={u.id} className="hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-200">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                        <td className="px-4 py-3">{roleBadge(u.role)}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setRestoreId(u.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800 rounded-lg text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Restore
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}

      {/* View modal */}
      <UserViewModal
        user={viewUser}
        open={!!viewUser}
        onClose={() => setViewUser(null)}
        onEdit={() => { setEditUser(viewUser); setViewUser(null); }}
      />

      {/* Edit modal */}
      <UserEditModal
        user={editUser}
        open={!!editUser}
        onClose={() => setEditUser(null)}
        onUpdated={() => { setEditUser(null); fetchAll(); }}
      />

      {/* Archive confirmation */}
      <Modal open={!!archiveId} onClose={() => setArchiveId(null)}>
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Archive User</h3>
          <p className="text-sm text-gray-500 mb-6">This user will be moved to the Archived tab. You can restore them later.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setArchiveId(null)} className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleArchive} disabled={archiving} className="px-5 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors">
              {archiving ? 'Archiving…' : 'Archive'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Restore confirmation */}
      <Modal open={!!restoreId} onClose={() => setRestoreId(null)}>
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Restore User</h3>
          <p className="text-sm text-gray-500 mb-6">This user will be moved back to the Active tab.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setRestoreId(null)} className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleRestore} disabled={restoring} className="px-5 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors">
              {restoring ? 'Restoring…' : 'Restore'}
            </button>
          </div>
        </div>
      </Modal>

      <RegisterOfficerModal open={addOpen} onClose={() => { setAddOpen(false); fetchAll(); }} />
    </div>
  );
}
