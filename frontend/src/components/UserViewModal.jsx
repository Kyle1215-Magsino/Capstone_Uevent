import Modal from './Modal';

export default function UserViewModal({ user, open, onClose, onEdit }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name || 'User Details'}</h2>
            <p className="text-sm text-gray-500">Account Information</p>
          </div>
          {user && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-xl hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {user && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <dl className="space-y-3 text-sm">
              {[
                { label: 'Name', value: user.name },
                { label: 'Email', value: user.email },
                { label: 'Role', value: (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>{user.role}</span>
                )},
                { label: 'Joined', value: new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1 border-b border-green-100 last:border-0">
                  <dt className="text-gray-500 font-medium">{item.label}</dt>
                  <dd className="font-medium text-gray-800">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </Modal>
  );
}
