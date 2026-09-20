import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FinesPage = () => {
  const [fines, setFines] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedFine, setSelectedFine] = useState(null);
  const [showWaiveModal, setShowWaiveModal] = useState(false);
  const [waiveReason, setWaiveReason] = useState('');

  useEffect(() => {
    fetchFines();
    fetchStatistics();
  }, [filter]);

  const fetchFines = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await axios.get('http://localhost:8000/api/fines', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setFines(response.data.data || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fines:', error);
      toast.error('Failed to load fines');
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/fines/statistics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const markAsPaid = async (fineId) => {
    if (!confirm('Mark this fine as paid?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/api/fines/${fineId}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Fine marked as paid');
      fetchFines();
      fetchStatistics();
    } catch (error) {
      console.error('Error marking fine as paid:', error);
      toast.error('Failed to mark fine as paid');
    }
  };

  const handleWaive = async () => {
    if (!waiveReason.trim()) {
      toast.error('Please provide a reason for waiving the fine');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/api/fines/${selectedFine.id}/waive`, 
        { reason: waiveReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Fine waived successfully');
      setShowWaiveModal(false);
      setWaiveReason('');
      setSelectedFine(null);
      fetchFines();
      fetchStatistics();
    } catch (error) {
      console.error('Error waiving fine:', error);
      toast.error('Failed to waive fine');
    }
  };

  const getPeriodLabel = (period) => {
    const labels = {
      'morning_in': 'Morning Time-In',
      'morning_out': 'Morning Time-Out',
      'afternoon_in': 'Afternoon Time-In',
      'afternoon_out': 'Afternoon Time-Out'
    };
    return labels[period] || period;
  };

  const getStatusBadge = (status) => {
    const styles = {
      unpaid: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      waived: 'bg-blue-100 text-blue-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading fines...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Student Fines Management</h1>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-sm text-red-600 font-semibold">Unpaid Fines</div>
            <div className="text-2xl font-bold text-red-700">₱{stats.total_unpaid?.toFixed(2)}</div>
            <div className="text-xs text-red-500">{stats.count_unpaid} violations</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-sm text-green-600 font-semibold">Paid Fines</div>
            <div className="text-2xl font-bold text-green-700">₱{stats.total_paid?.toFixed(2)}</div>
            <div className="text-xs text-green-500">{stats.count_paid} violations</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 font-semibold">Waived Fines</div>
            <div className="text-2xl font-bold text-blue-700">₱{stats.total_waived?.toFixed(2)}</div>
            <div className="text-xs text-blue-500">{stats.count_waived} violations</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unpaid')}
          className={`px-4 py-2 rounded ${filter === 'unpaid' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
        >
          Unpaid
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`px-4 py-2 rounded ${filter === 'paid' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Paid
        </button>
        <button
          onClick={() => setFilter('waived')}
          className={`px-4 py-2 rounded ${filter === 'waived' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Waived
        </button>
      </div>

      {/* Fines Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Violation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fines.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No fines found
                </td>
              </tr>
            ) : (
              fines.map((fine) => (
                <tr key={fine.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {fine.student?.first_name} {fine.student?.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{fine.student?.student_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{fine.event?.event_name}</div>
                    <div className="text-xs text-gray-500">{fine.event?.event_date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getPeriodLabel(fine.period)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {fine.violation_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₱{parseFloat(fine.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(fine.payment_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {fine.payment_status === 'unpaid' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => markAsPaid(fine.id)}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFine(fine);
                            setShowWaiveModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Waive
                        </button>
                      </div>
                    )}
                    {fine.payment_status === 'waived' && fine.waiver_reason && (
                      <div className="text-xs text-gray-500">
                        Reason: {fine.waiver_reason}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Waive Modal */}
      {showWaiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Waive Fine</h3>
            <p className="mb-4 text-gray-600">
              Student: {selectedFine?.student?.first_name} {selectedFine?.student?.last_name}
              <br />
              Amount: ₱{parseFloat(selectedFine?.amount).toFixed(2)}
            </p>
            <label className="block mb-2 text-sm font-medium">Reason for Waiving</label>
            <textarea
              value={waiveReason}
              onChange={(e) => setWaiveReason(e.target.value)}
              className="w-full border rounded p-2 mb-4"
              rows="3"
              placeholder="Enter reason..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleWaive}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Waive Fine
              </button>
              <button
                onClick={() => {
                  setShowWaiveModal(false);
                  setWaiveReason('');
                  setSelectedFine(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinesPage;
